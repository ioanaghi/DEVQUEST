# Season 1 — The Junior Developer Chronicles

Implemented from `to_do/Quests2.md` in version 0.5.0. The original Checkout Incident remains intact. Episodes 02–09 add 60 connected missions and 29 coding assessments, including nine later retention problems. Candidate tracks listed after the season in the design document remain future curriculum.

## Play

Finish Checkout, then meet Nora for Warehouse Alert. Press Q for the season board. Each mission returns to the office and points to its next colleague or station. Max, Theo, Lia, Iris and Victor join the office. Earlier missions remain revisitable; repeat delivery never awards XP again.

The episode board includes the exact eight-quest Warehouse sequence and a palindrome interview, followed by Traffic (seven quests), Undo (seven), Release (seven), Delivery (seven), Folder (seven), SQL (eight), and Legacy (nine).

SQL study unlocks after the first-day JOIN ticket. OOP study unlocks after completing Java and claiming the first-day reward. Both are available independently of the algorithm story. Other episodes follow their predecessors.

## Learning and assessment

- Interactive parcel matcher and two-pointer conveyor; fixed and variable traffic windows; Undo/Redo stack tower; midpoint release search; linked-route and cycle traces; recursive-folder call frames; INNER/LEFT JOIN comparison; payment polymorphism experiments.
- Guided Java/SQL coding, four authored hints, public cases, hidden review cases, and controlled operation-growth checks where applicable.
- QA predictions before execution, two distinct player-authored tests, and editor feedback. SQL QA accepts two alternative verification queries; all are checked on three datasets.
- Five interview phases: clarify, plan, implement, defend edge cases, explain. The implementation contributes 40 correctness and 25 efficiency points; edge-case reasoning contributes 15 and explanation 20.
- Hints switch that interview attempt to Practice Mode. Completing it still advances the story and earns mission XP. A fresh independent attempt resets the boss draft, interview answers, and hint count. The independent pass earns the episode badge.
- Each skill has a different retention problem. It unlocks after an independent interview and three subsequently completed season missions. At the season finale, three mixed pattern questions enable the remaining final-episode retention checks. Story completion, Interview Ready and Mastered remain separate.

Warehouse's boss grants 350 XP as specified. Other boss missions use the same authored 350-XP reward; guided coding/QA checkpoints grant 80 XP and discovery missions 30 XP. All rewards are derived from completed mission IDs.

## Character and input contracts

Palindromes compare Unicode letter/digit code points using Java’s simple lowercase mapping, including supplementary characters. Session tracking uses case-sensitive ASCII event characters. Both contracts are stated in the editor. SQL uses actual SQLite, not a query simulator. Monetary examples use integer cents. Linked-list tests compare original node identities and check that cycle/middle implementations leave links unchanged.

## Offline Java runtime

Season submissions compile with a bundled JDK runtime targeting Java 17. The existing first-day and Checkout practice interpreters remain separate. The source editor accepts the supplied methods and named nested strategy classes, imports java.util centrally, and rejects runtime access, files, networking, reflection, Unicode source escapes, exception handling, custom imports and uninstrumented loop bodies.

Compilation disables annotation processing. Each submission uses a fresh temporary directory. Execution runs in a separate JVM with a 64-MB heap, restricted stack, time/output limits, an empty Security Manager policy, and an operation meter inserted into methods and braced loop bodies. Constant-space exercises additionally restrict allocations and collections. The desktop includes a compact Java 21 runtime and compiler created with jlink, including its legal notices.

The Java Security Manager is deprecated; this runner is intended for bounded, local educational submissions. It is not an OS container or a general service for hostile internet submissions. Do not expose the local endpoint publicly. Complexity feedback is controlled empirical evidence plus exercise restrictions, not a proof for arbitrary Java programs. An eventual runtime replacement should use OS-level isolation before supporting remote multi-user execution.

## World and rewards

Completed episodes add collection items to the backpack and miniature desk decorations; Delivery adds a roaming cosmetic robot. The episode board opens dedicated room views and interactive practice stations after completion. These rooms are panel-based environments; the walking office remains the existing map. The post-Sliding-Window reward also unlocks the Debugging Lab practice view. A completed season gets a BentoCart release-day scene and mixed pattern review.

## Saves

Existing version-1 saves migrate automatically. Episode completion, drafts, hints, answers, custom tests, independent-pass timestamps, mastery and mixed review persist in the same save. Native and browser imports accept up to 512 KiB. The distributed app includes no player save or test solutions.

## Verification

`npm run check` runs original and season tests and the production TypeScript/Vite build. `tests/fixtures/season-solutions.mjs` contains assessment fixtures and is never bundled. Tests exercise all 29 correct solutions, incomplete starters, quadratic code rejection, malformed inputs, operation limits, hidden SQL datasets, original linked-node identities, independent prerequisites, chronology of retention, save normalization, duplicate rewards, office reachability, and the native bridge.
