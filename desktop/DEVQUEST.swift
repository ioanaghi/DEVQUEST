import Cocoa
import WebKit
import UniformTypeIdentifiers

final class GameWindow: NSWindow {
    weak var gameView: WKWebView?
    override func sendEvent(_ event: NSEvent) {
        // Escape belongs to the game's pause/dialogue flow. Letting AppKit handle
        // it as a fallback would also leave native full screen on the same key.
        if event.type == .keyDown && event.keyCode == 53 {
            if !event.isARepeat { gameView?.evaluateJavaScript("window.dispatchEvent(new Event('devquest:escape'))", completionHandler: nil) }
            return
        }
        super.sendEvent(event)
    }
}

final class LocalAssets: NSObject, WKURLSchemeHandler {
    let root: URL
    init(root: URL) { self.root = root }
    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        guard let url = task.request.url, url.host == "app" else { task.didFailWithError(URLError(.badURL)); return }
        let relative = url.path == "/" || url.path.isEmpty ? "index.html" : String(url.path.dropFirst())
        let file = root.appendingPathComponent(relative).standardizedFileURL
        guard file.path.hasPrefix(root.path + "/"), let data = try? Data(contentsOf: file) else { task.didFailWithError(URLError(.fileDoesNotExist)); return }
        let mime = ["html":"text/html", "js":"text/javascript", "css":"text/css", "svg":"image/svg+xml", "png":"image/png", "json":"application/json"][file.pathExtension] ?? "application/octet-stream"
        task.didReceive(URLResponse(url: url, mimeType: mime, expectedContentLength: data.count, textEncodingName: "utf-8"))
        task.didReceive(data)
        task.didFinish()
    }
    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {}
}

final class AppDelegate: NSObject, NSApplicationDelegate, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate, NSWindowDelegate {
    var window: NSWindow!
    var webView: WKWebView!
    var processes: [String: Process] = [:]
    var assets: LocalAssets!
    var runtime: URL!
    var runner: URL!
    var saves: SaveLibraryStore!
    var jobs = 0
    var terminationPending = false
    var allowTermination = false
    let support = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0].appendingPathComponent("DEVQUEST", isDirectory: true)

    func applicationDidFinishLaunching(_ notification: Notification) {
        guard let resources = Bundle.main.resourceURL else { NSApp.terminate(nil); return }
        runtime = resources.appendingPathComponent("runtime/node")
        runner = resources.appendingPathComponent("game/server/desktop-runner.mjs")
        saves = SaveLibraryStore(support: support)
        do { try saves.load() } catch { /* The title screen reports the preserved-file error. */ }
        let config = WKWebViewConfiguration()
        assets = LocalAssets(root: resources.appendingPathComponent("game/dist"))
        config.setURLSchemeHandler(assets, forURLScheme: "devquest")
        config.websiteDataStore = .default()
        config.userContentController.add(self, name: "devquest")
        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.allowsBackForwardNavigationGestures = false
        let gameWindow = GameWindow(contentRect: NSRect(x: 0, y: 0, width: 1440, height: 900), styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView], backing: .buffered, defer: false)
        gameWindow.gameView = webView
        window = gameWindow
        window.title = "DEVQUEST — The Junior Developer Chronicles"
        window.minSize = NSSize(width: 980, height: 680)
        window.titleVisibility = .hidden
        window.titlebarAppearsTransparent = true
        window.collectionBehavior = [.fullScreenPrimary]
        window.backgroundColor = NSColor(calibratedRed: 0.13, green: 0.24, blue: 0.20, alpha: 1)
        window.contentView = webView
        window.delegate = self
        window.center()
        window.setFrameAutosaveName("DEVQUESTMainWindow")
        makeMenu()
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        webView.load(URLRequest(url: URL(string: "devquest://app/")!))
        let newPresentation = UserDefaults.standard.string(forKey: "PresentationVersion") != "0.2"
        let prefersFullScreen = newPresentation || (UserDefaults.standard.object(forKey: "StartFullScreen") as? Bool ?? true)
        UserDefaults.standard.set("0.2", forKey: "PresentationVersion")
        if prefersFullScreen { DispatchQueue.main.async { self.window.toggleFullScreen(nil) } }
    }

    func makeMenu() {
        let menu = NSMenu()
        let appItem = NSMenuItem(); menu.addItem(appItem)
        let appMenu = NSMenu(); appItem.submenu = appMenu
        appMenu.addItem(withTitle: "About DEVQUEST", action: #selector(about), keyEquivalent: "")
        appMenu.addItem(.separator())
        appMenu.addItem(withTitle: "Hide DEVQUEST", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        appMenu.addItem(.separator())
        appMenu.addItem(withTitle: "Quit DEVQUEST", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        let fileItem = NSMenuItem(); menu.addItem(fileItem)
        let file = NSMenu(title: "File"); fileItem.submenu = file
        let slotsItem = file.addItem(withTitle: "Main Menu & Save Slots", action: #selector(mainMenu), keyEquivalent: "m")
        slotsItem.target = self
        file.addItem(.separator())
        file.addItem(withTitle: "Export Progress…", action: #selector(exportProgress), keyEquivalent: "e")
        file.addItem(withTitle: "Import Progress…", action: #selector(importProgress), keyEquivalent: "i")
        file.addItem(.separator())
        file.addItem(withTitle: "Close Window", action: #selector(NSWindow.performClose(_:)), keyEquivalent: "w")
        let editItem = NSMenuItem(); menu.addItem(editItem)
        let edit = NSMenu(title: "Edit"); editItem.submenu = edit
        for (name, selector, key) in [("Undo", "undo:", "z"), ("Cut", "cut:", "x"), ("Copy", "copy:", "c"), ("Paste", "paste:", "v"), ("Select All", "selectAll:", "a")] {
            edit.addItem(withTitle: name, action: Selector(selector), keyEquivalent: key)
        }
        let viewItem = NSMenuItem(); menu.addItem(viewItem)
        let view = NSMenu(title: "View"); viewItem.submenu = view
        let fullscreenItem = view.addItem(withTitle: "Toggle Full Screen", action: #selector(toggleFullScreen), keyEquivalent: "f")
        fullscreenItem.keyEquivalentModifierMask = [.control, .command]
        fullscreenItem.target = self
        let helpItem = NSMenuItem(); menu.addItem(helpItem)
        let help = NSMenu(title: "Help"); helpItem.submenu = help
        help.addItem(withTitle: "Player Handbook", action: #selector(handbook), keyEquivalent: "?")
        NSApp.mainMenu = menu
        for submenu in [appMenu, file, help] { for item in submenu.items where item.action == #selector(about) || item.action == #selector(exportProgress) || item.action == #selector(importProgress) || item.action == #selector(handbook) { item.target = self } }
    }

    @objc func about() { NSApp.orderFrontStandardAboutPanel(options: [.applicationName: "DEVQUEST", .applicationVersion: "0.6.0 · Three Save Slots", .credits: NSAttributedString(string: "A cozy programming RPG by Ioana Ghinet.\nBuilt with Swift, WebKit, React, and SQLite.\nNo account. No AI answers. Your own curiosity.")]) }
    @objc func mainMenu() { webView.evaluateJavaScript("window.dispatchEvent(new Event('devquest:title'))", completionHandler: nil) }
    @objc func handbook() { webView.evaluateJavaScript("window.dispatchEvent(new Event('devquest:help'))", completionHandler: nil) }
    @objc func toggleFullScreen() { window.toggleFullScreen(nil) }
    func windowDidEnterFullScreen(_ notification: Notification) { UserDefaults.standard.set(true, forKey: "StartFullScreen"); publishFullScreen(true) }
    func windowDidExitFullScreen(_ notification: Notification) { UserDefaults.standard.set(false, forKey: "StartFullScreen"); publishFullScreen(false) }
    func publishFullScreen(_ enabled: Bool) { webView.evaluateJavaScript("window.dispatchEvent(new CustomEvent('devquest:fullscreen',{detail:{fullscreen:\(enabled ? "true" : "false")}}))", completionHandler: nil) }
    @objc func exportProgress() {
        guard let data = saves.selectedSave else { showError("No progress to export yet", "Create your developer to start your first day."); return }
        let panel = NSSavePanel(); panel.nameFieldStringValue = "devquest-character.json"; panel.allowedContentTypes = [.json]
        panel.beginSheetModal(for: window) { result in
            if result == .OK, let url = panel.url { do { try data.write(to: url, options: .atomic) } catch { self.showError("Export failed", error.localizedDescription) } }
        }
    }
    @objc func importProgress() {
        let panel = NSOpenPanel(); panel.allowedContentTypes = [.json]; panel.allowsMultipleSelection = false; panel.canChooseDirectories = false
        panel.beginSheetModal(for: window) { result in
            guard result == .OK, let url = panel.url else { return }
            do {
                let data = try Data(contentsOf: url)
                guard data.count < 524288, let save = try JSONSerialization.jsonObject(with: data) as? [String: Any], save["version"] as? Int == 1, save["onboarded"] is Bool else { throw NSError(domain: "DEVQUEST", code: 1, userInfo: [NSLocalizedDescriptionKey: "Choose a valid DEVQUEST save file."]) }
                guard let json = String(data: try JSONSerialization.data(withJSONObject: save), encoding: .utf8) else { throw URLError(.cannotParseResponse) }
                self.webView.evaluateJavaScript("window.dispatchEvent(new CustomEvent('devquest:import',{detail:\(json)}))", completionHandler: nil)
            } catch { self.showError("Could not import this save", error.localizedDescription) }
        }
    }
    func showError(_ title: String, _ detail: String) {
        let alert = NSAlert(); alert.messageText = title; alert.informativeText = detail; alert.alertStyle = .warning
        if let window = window { alert.beginSheetModal(for: window, completionHandler: nil) } else { alert.runModal() }
    }
    func reply(_ id: String, _ object: [String: Any]) {
        guard let encoded = try? JSONSerialization.data(withJSONObject: ["id": id, "reply": object]), let json = String(data: encoded, encoding: .utf8) else { return }
        webView.evaluateJavaScript("(()=>{const m=\(json);window.__devquestReply?.(m.id,m.reply);})()", completionHandler: nil)
    }
    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.frameInfo.isMainFrame, message.webView?.url?.scheme == "devquest", message.webView?.url?.host == "app", let body = message.body as? [String: Any], let id = body["id"] as? String, id.count <= 64, let path = body["path"] as? String else { return }
        let payload = body["payload"] as? [String: Any] ?? [:]
        if path == "/api/app/state" { reply(id, ["ok": true, "data": ["fullscreen": window.styleMask.contains(.fullScreen)]]); return }
        if path == "/api/app/fullscreen" { let next = !window.styleMask.contains(.fullScreen); window.toggleFullScreen(nil); reply(id, ["ok": true, "data": ["fullscreen": next]]); return }
        if path == "/api/app/cancel-quit" { if terminationPending { terminationPending=false;NSApp.reply(toApplicationShouldTerminate:false) };reply(id,["ok":true]);return }
        if path == "/api/app/quit" { reply(id, ["ok": true]); allowTermination=true; DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { if self.terminationPending { NSApp.reply(toApplicationShouldTerminate:true) } else { NSApp.terminate(nil) } }; return }
        if path == "/api/slots/load" {
            do { reply(id,["ok":true,"data":try saves.payload()]) }
            catch { reply(id,["ok":false,"error":error.localizedDescription]) }
            return
        }
        if path == "/api/slots/store" {
            do {
                guard let library=payload["library"] as? [String:Any] else { throw URLError(.cannotParseResponse) }
                try saves.store(library)
                reply(id,["ok":true,"data":true])
            } catch { reply(id,["ok":false,"error":"Save slots could not be written. Your previous saves are still on disk. Export a backup before quitting."]) }
            return
        }
        if path == "/api/save/export" { exportProgress(); reply(id, ["ok": true]); return }
        if path == "/api/save/import" { importProgress(); reply(id, ["ok": true]); return }
        guard ["/api/health", "/api/java", "/api/sql", "/api/pair", "/api/season"].contains(path), jobs < 2,
              let input = try? JSONSerialization.data(withJSONObject: ["path": path, "payload": payload]), input.count <= 20000 else { reply(id, ["ok": false, "error": "The runtime is busy or the request is too large."]); return }
        let process = Process(); process.executableURL = runtime; process.arguments = [runner.path]
        process.environment = ["PATH": "/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/homebrew/bin", "JAVA_RUNNER": "practice", "NODE_NO_WARNINGS": "1", "DEVQUEST_JAVA_HOME": runner.deletingLastPathComponent().deletingLastPathComponent().appendingPathComponent("java-runtime").path]
        let stdin = Pipe(), stdout = Pipe(), stderr = Pipe(); process.standardInput = stdin; process.standardOutput = stdout; process.standardError = stderr
        do { try process.run() } catch { reply(id, ["ok": false, "error": "The bundled runtime could not start: \(error.localizedDescription)"]); return }
        jobs += 1; processes[id] = process
        stdin.fileHandleForWriting.write(input); try? stdin.fileHandleForWriting.close()
        let timeout = DispatchWorkItem { if process.isRunning { kill(process.processIdentifier, SIGKILL) } }
        DispatchQueue.main.asyncAfter(deadline: .now() + 20, execute: timeout)
        DispatchQueue.global(qos: .userInitiated).async {
            let output = stdout.fileHandleForReading.readDataToEndOfFile()
            process.waitUntilExit(); timeout.cancel()
            let result = (try? JSONSerialization.jsonObject(with: output)) as? [String: Any]
            DispatchQueue.main.async {
                self.jobs -= 1; self.processes.removeValue(forKey: id)
                self.reply(id, result ?? ["ok": false, "error": "The runtime stopped before returning a result. Try a smaller query."])
            }
        }
    }
    func webView(_ view: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = action.request.url else { decisionHandler(.cancel); return }
        decisionHandler(url.scheme == "devquest" && url.host == "app" ? .allow : .cancel)
    }
    func webView(_ webView: WKWebView, runOpenPanelWith parameters: WKOpenPanelParameters, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping ([URL]?) -> Void) {
        let panel = NSOpenPanel(); panel.allowsMultipleSelection = false; panel.canChooseDirectories = false; panel.allowedContentTypes = [.json]
        panel.beginSheetModal(for: window) { result in completionHandler(result == .OK ? panel.urls : nil) }
    }
    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        if allowTermination || webView == nil { return .terminateNow }
        if !terminationPending {
            terminationPending=true
            webView.evaluateJavaScript("window.dispatchEvent(new Event('devquest:quit'))") { _,error in
                if let error=error { self.terminationPending=false;NSApp.reply(toApplicationShouldTerminate:false);self.showError("Could not finish saving",error.localizedDescription) }
            }
        }
        return .terminateLater
    }
    func windowShouldClose(_ sender: NSWindow) -> Bool { if allowTermination { return true };NSApp.terminate(nil);return false }
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }
    func applicationWillTerminate(_ notification: Notification) { for process in processes.values where process.isRunning { process.terminate() } }
}

@main struct DEVQUESTMain {
    static func main() {
        let application = NSApplication.shared
        let delegate = AppDelegate()
        application.delegate = delegate
        application.setActivationPolicy(.regular)
        withExtendedLifetime(delegate) { application.run() }
    }
}
