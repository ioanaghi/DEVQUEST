import Foundation

// An atomic three-slot library. The original first-day.json is read-only migration input.
final class SaveLibraryStore {
    let support: URL
    var libraryURL: URL { support.appendingPathComponent("save-slots.json") }
    var legacyURL: URL { support.appendingPathComponent("first-day.json") }
    private(set) var library: Data?
    private(set) var legacy: Data?
    private(set) var loadError: Error?
    init(support: URL) { self.support = support }
    private func invalid() -> NSError { NSError(domain: "DEVQUEST.SaveSlots", code: 1, userInfo: [NSLocalizedDescriptionKey: "Save slots could not be read. Your files have been preserved. Restore a backup before retrying."]) }
    private func validateSave(_ save: [String: Any]) throws {
        guard save["version"] as? Int == 1, save["onboarded"] is Bool else { throw invalid() }
    }
    private func validateLibrary(_ object: [String: Any]) throws {
        guard object["kind"] as? String == "devquest-slots", object["version"] as? Int == 1, let slots = object["slots"] as? [Any], slots.count == 3 else { throw invalid() }
        for entry in slots where !(entry is NSNull) {
            guard let slot = entry as? [String: Any], let save = slot["save"] as? [String: Any], save["onboarded"] as? Bool == true else { throw invalid() }
            try validateSave(save)
        }
        if !(object["activeSlot"] is NSNull) {
            guard let index = object["activeSlot"] as? Int, slots.indices.contains(index), !(slots[index] is NSNull) else { throw invalid() }
        }
    }
    func load() throws {
        do {
            try FileManager.default.createDirectory(at: support, withIntermediateDirectories: true)
            if FileManager.default.fileExists(atPath: libraryURL.path) {
                let data = try Data(contentsOf: libraryURL)
                guard data.count <= 1_600_000, let object = try JSONSerialization.jsonObject(with: data) as? [String: Any] else { throw invalid() }
                try validateLibrary(object)
                library = data
            } else if FileManager.default.fileExists(atPath: legacyURL.path) {
                let data = try Data(contentsOf: legacyURL)
                guard data.count <= 524_288, let object = try JSONSerialization.jsonObject(with: data) as? [String: Any] else { throw invalid() }
                try validateSave(object)
                legacy = data
            }
            loadError = nil
        } catch { loadError = error; throw error }
    }
    func payload() throws -> Any {
        if let error = loadError { throw error }
        guard let data = library ?? legacy else { return NSNull() }
        return try JSONSerialization.jsonObject(with: data)
    }
    func store(_ object: [String: Any]) throws {
        if let error = loadError { throw error }
        try validateLibrary(object)
        let data = try JSONSerialization.data(withJSONObject: object, options: [.sortedKeys])
        guard data.count <= 1_600_000 else { throw invalid() }
        try data.write(to: libraryURL, options: .atomic)
        library = data
    }
    var selectedSave: Data? {
        guard let library = library else { return legacy }
        guard let object = try? JSONSerialization.jsonObject(with: library) as? [String: Any], let slots = object["slots"] as? [Any], let index = object["activeSlot"] as? Int, slots.indices.contains(index), let slot = slots[index] as? [String: Any], let save = slot["save"] as? [String: Any] else { return nil }
        return try? JSONSerialization.data(withJSONObject: save, options: [.sortedKeys])
    }
}
