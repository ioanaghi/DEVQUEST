# Main menu and three save slots (0.6)

DEVQUEST always opens on the title screen. Start Game opens three local save slots. Continue resumes the last selected character directly. Each occupied card shows the character, current quest, XP, coins and save time.

Choose New Game in an empty slot to customize a name, hoodie, skin tone, hair and glasses, then start from the first meeting with Alex. Character creation does not overwrite a save until Start is pressed. Starting in an occupied slot or resetting it requires confirmation. Only that slot changes; the other two keep their own code, notes, progress, hints, rewards and appearance.

Escape opens the game’s pause menu. Save & main menu waits for persistence before returning to the title. The native File menu also offers Main Menu & Save Slots. Closing the window or quitting through the Mac menu asks the frontend to finish saving first; a failed save cancels termination.

## Existing progress and backups

The previous single save becomes Slot 1 automatically. Native progress now lives in `~/Library/Application Support/DEVQUEST/save-slots.json`. The old `first-day.json` is preserved as read-only migration input. Once a slot library exists, an empty or reset library never reloads the old save automatically.

Browser development uses `devquest.slots.v1` and preserves the former `devquest.save.v1` key. It does not write any slot while sitting on the title screen or during unfinished character creation.

Each character can still be exported from the handbook or the native File menu. Importing a character opens the slot selector and waits for a destination; an occupied destination requires confirmation. Imports do not overwrite the currently running game immediately.

Slot writes are serialized in the frontend and atomic on disk. Migration validates the save before accepting it. An unreadable existing library is reported and preserved; the game does not replace it with an empty library. The library limit is 1,600,000 bytes, allowing three full character saves.

## Validation

- Pure progression tests cover three independent avatars, code drafts, notes and XP; switching, replacement, reset, migration, corrupted data, invalid IDs and empty-library persistence.
- A native Swift harness exercises the actual `SaveLibraryStore` against temporary files: legacy loading, atomic writes, reload, selected-slot export, isolated reset, no legacy resurrection, and preservation of corrupt files.
- Browser walkthrough: legacy Season QA migrated to Slot 1 at 2,080 XP; customized Fresh QA in Slot 2 started at 0 XP; returned to main menu, reloaded, verified both slots, cancelled reset confirmation, and continued Slot 1 with its original quest and XP.
