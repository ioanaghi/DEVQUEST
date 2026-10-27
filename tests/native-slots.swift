import Foundation

@main struct SlotStoreChecks {
    static func main() throws {
        let root = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
        let original: [String: Any] = ["version":1,"onboarded":true,"name":"Original"]
        let legacy = try JSONSerialization.data(withJSONObject: original)
        try legacy.write(to: root.appendingPathComponent("first-day.json"))
        let store = SaveLibraryStore(support: root)
        try store.load()
        let migrated = try store.payload() as? [String:Any]
        precondition(migrated?["name"] as? String == "Original")
        precondition(!FileManager.default.fileExists(atPath:store.libraryURL.path))
        var slots: [Any] = [["save":original,"updatedAt":1],NSNull(),NSNull()]
        var library: [String:Any] = ["kind":"devquest-slots","version":1,"activeSlot":0,"slots":slots]
        try store.store(library)
        slots[1] = ["save":["version":1,"onboarded":true,"name":"Second"],"updatedAt":2]
        library["slots"] = slots; library["activeSlot"] = 1
        try store.store(library)
        let reopened = SaveLibraryStore(support: root);try reopened.load()
        let selected = try JSONSerialization.jsonObject(with:reopened.selectedSave!) as? [String:Any]
        precondition(selected?["name"] as? String == "Second")
        slots[1] = NSNull();library["slots"] = slots;library["activeSlot"] = 0;try reopened.store(library)
        let reset = try reopened.payload() as! [String:Any]
        precondition((reset["slots"] as! [Any])[1] is NSNull)
        let keptLegacy = try Data(contentsOf:reopened.legacyURL)
        precondition(keptLegacy == legacy)
        library["slots"] = [NSNull(),NSNull(),NSNull()];library["activeSlot"] = NSNull();try reopened.store(library)
        let empty = SaveLibraryStore(support:root);try empty.load();precondition(empty.selectedSave == nil)
        try Data("corrupt".utf8).write(to:store.libraryURL)
        let damaged = SaveLibraryStore(support:root)
        do {try damaged.load();fatalError("Corrupt libraries must fail closed")}catch{}
        do {try damaged.store(library);fatalError("Damaged files must never be overwritten")}catch{}
        let preservedDamage = try Data(contentsOf:store.libraryURL)
        precondition(preservedDamage == Data("corrupt".utf8))
        print("Native atomic save slots passed")
    }
}
