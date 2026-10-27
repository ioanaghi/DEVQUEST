# DEVQUEST — Season 1 Mission Content Bible

Generated from the authored curriculum by `node scripts/export-season-bible.mjs`. Runtime definitions in `src/lib/season-content.mjs` are the source of truth.

This extends the original Checkout Incident. Story delivery accepts guided attempts. Independent interview passes earn badges; different problems after three later missions certify mastery. SQL and OOP have independent first-day prerequisites. All other episodes follow their predecessor.

Visual interaction and animation implementations live in `SeasonLabs.tsx`, `season-art.ts` and the Season 1 CSS rules. Mission completion triggers the office celebration and returns the player to the next colleague.

## Episode 2 — The Warehouse Mix-up

Concept: Two Pointers. New room: Warehouse Lab. Reward: Robotic desk arms. Independent badge: Dual Pointer.

### 1. Warehouse Alert

NPC: Nora. Office interaction: nora. Reward: 30 XP.

Dialogue: “BentoCart shipped its voucher fix, but the warehouse robot checks every pair of parcels. Choose two different parcels totaling 13 kg before the next truck leaves.”

Activity: pair. Completion: complete the authored visual experiment or reasoning check. Next: Meet Max.

### 2. Meet Max

NPC: Max. Office interaction: max. Reward: 30 XP.

Dialogue: “I’m Max, Warehouse Engineer. Our conveyor already sorts parcels by weight. Equal weights can sit next to each other; sorted does not mean distinct.”

Activity: sorted. Completion: complete the authored visual experiment or reasoning check. Next: Robot Arms.

### 3. Robot Arms

NPC: Alex. Office interaction: board. Reward: 30 XP.

Dialogue: “One arm starts at the lightest parcel, the other at the heaviest. Use the ordering to prove which arm can safely move.”

Activity: pointers. Completion: complete the authored visual experiment or reasoning check. Next: First Implementation.

### 4. First Implementation

NPC: Alex. Office interaction: desk. Reward: 80 XP.

Dialogue: “Write findPairSorted. Return indices in this sorted manifest; never use one parcel twice.”

Activity: code. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Memory Limit.

Editor contract: Input is sorted ascending; weights are nonnegative. Return two different zero-based indices or an empty array. Any valid pair is accepted. O(n) time, O(1) extra space; no HashMap.

Signature: `public static int[] findPairSorted(int[] weights, int target)`.

Four optional hints:
1. What does sorting tell you about the smallest and largest remaining weights?
2. Compare the sum at the two ends with the target.
3. If the sum is too small, discard the left endpoint. If too large, discard the right.
4. Keep left < right. Return their indices on equality; otherwise move the justified endpoint.

Public checks:
- Manifest [1,3,5,6,8,11] / 13. Input: {"values":[1,3,5,6,8,11],"target":13}. Expected: two valid distinct indices, or [].
- Manifest [5,5] / 10. Input: {"values":[5,5],"target":10}. Expected: two valid distinct indices, or [].
- Manifest [1,3,8] / 20. Input: {"values":[1,3,8],"target":20}. Expected: two valid distinct indices, or [].
- Manifest [0,0,6] / 0. Input: {"values":[0,0,6],"target":0}. Expected: two valid distinct indices, or [].

### 5. Memory Limit

NPC: Max. Office interaction: max. Reward: 30 XP.

Dialogue: “The scanner has very little memory. A growing HashMap is unnecessary because our conveyor already gives us order. Compare the tradeoffs.”

Activity: memory. Completion: complete the authored visual experiment or reasoning check. Next: The Duplicate Crates.

### 6. The Duplicate Crates

NPC: Maya. Office interaction: maya. Reward: 80 XP.

Dialogue: “Twins are separate parcels. One parcel is not a pair. Predict the edge cases, then submit two additional tests.”

Activity: qa. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Code Review.

Editor contract: Input is sorted ascending; weights are nonnegative. Return two different zero-based indices or an empty array. Any valid pair is accepted. O(n) time, O(1) extra space; no HashMap.

Signature: `public static int[] findPairSorted(int[] weights, int target)`.

Four optional hints:
1. What does sorting tell you about the smallest and largest remaining weights?
2. Compare the sum at the two ends with the target.
3. If the sum is too small, discard the left endpoint. If too large, discard the right.
4. Keep left < right. Return their indices on equality; otherwise move the justified endpoint.

Public checks:
- Manifest [1,3,5,6,8,11] / 13. Input: {"values":[1,3,5,6,8,11],"target":13}. Expected: two valid distinct indices, or [].
- Manifest [5,5] / 10. Input: {"values":[5,5],"target":10}. Expected: two valid distinct indices, or [].
- Manifest [1,3,8] / 20. Input: {"values":[1,3,8],"target":20}. Expected: two valid distinct indices, or [].
- Manifest [0,0,6] / 0. Input: {"values":[0,0,6],"target":0}. Expected: two valid distinct indices, or [].

Required predictions:
- [5,5], target 10 → pair.
- [5], target 10 → none.
- [], target 0 → none.
- [0,0], target 0 → pair.

The player also authors two different tests; these execute against their saved implementation.

### 7. Code Review

NPC: Alex. Office interaction: alex. Reward: 30 XP.

Dialogue: “Explain which candidates a pointer move eliminates and why sorting is essential.”

Activity: review. Completion: complete the authored visual experiment or reasoning check. Next: The Secret Password.

Accepted reasoning:
- Why may the left pointer advance when the sum is too small? Even the largest remaining partner is too light for this left value.
- When does this pair algorithm require a different approach? On unsorted input with original indices required.
- Time and extra space? O(n) time; O(1) extra space.

### 8. The Secret Password

NPC: Eva. Office interaction: eva. Reward: 350 XP.

Dialogue: “Transfer the idea to text. A password is palindromic after ignoring punctuation and case. Clarify the character contract and implement independently.”

Activity: interview. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: episode delivery and practice-room access.

Editor contract: Compare Unicode letter/digit code points, ignoring other code points and case using Character.toLowerCase. Empty or punctuation-only text is a palindrome. O(n) time and O(1) extra space. Use codePointAt, codePointBefore and Character.charCount to move across supplementary characters; do not build a normalized copy.

Signature: `public static boolean isPalindrome(String password)`.

Four optional hints:
1. Can the same idea compare the two ends of a string?
2. Use Character.isLetterOrDigit on the endpoint code points; skip ignored code points.
3. Compare Character.toLowerCase on both code points; move by Character.charCount.
4. A mismatch means false. After all valid pairs match, return true.

Public checks:
- A man, a plan, a canal: Panama. Input: A man, a plan, a canal: Panama. Expected: true.
- race a car. Input: race a car. Expected: false.
- No lemon, no melon. Input: No lemon, no melon. Expected: true.
- Éxé. Input: Éxé. Expected: true.

Accepted reasoning:
- What is the palindrome invariant? All valid character pairs outside the pointers already match.
- Why may punctuation be skipped? The contract excludes it from comparison.
- Time and extra space? O(n) time, O(1) extra space using in-place character reads.

Phases: clarify input/output and edge contracts; justify the approach; submit a fresh implementation; defend edge tests; explain cost and correctness. Score: correctness 40, measured efficiency 25, edge reasoning 15, explanation 20. Hints switch to Practice Mode; fresh independent retry resets draft, answers and hints.

### Later check — Two Pointers retention

public static int[] findGap(int[] numbers, int gap): Sorted distinct integers, gap >= 0. Return two different indices whose larger value minus smaller value equals gap, or an empty array. O(n) time and O(1) extra space.

Unlock: independent interview plus three later mission completions, or the completed-season mixed review. Pass the new problem independently without hints to certify mastery.

## Episode 3 — The Midnight Traffic Spike

Concept: Sliding Window. New room: Server Monitoring Room. Reward: Animated traffic monitor. Independent badge: Traffic Analyst.

### 1. Pager Alert

NPC: Theo. Office interaction: theo. Reward: 30 XP.

Dialogue: “Midnight. BentoCart is slowing down. I’m Theo, Site Reliability Engineer. These counts represent consecutive minutes, not unrelated events. Read the spike before touching the monitor.”

Activity: traffic. Completion: complete the authored visual experiment or reasoning check. Next: The Five-Minute Mystery.

### 2. The Five-Minute Mystery

NPC: Theo. Office interaction: theo. Reward: 30 XP.

Dialogue: “Find the busiest consecutive window. Overlapping intervals share most of their values; can we reuse that work?”

Activity: fixed. Completion: complete the authored visual experiment or reasoning check. Next: The Moving Window.

### 3. The Moving Window

NPC: Alex. Office interaction: board. Reward: 30 XP.

Dialogue: “Move one minute: subtract the count that leaves, add the count that enters. Keep a running maximum.”

Activity: window. Completion: complete the authored visual experiment or reasoning check. Next: Fix the Monitor.

### 4. Fix the Monitor

NPC: Theo. Office interaction: desk. Reward: 80 XP.

Dialogue: “Implement maxRequests in one pass. The contract guarantees a valid nonempty window size.”

Activity: code. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: The Session Problem.

Editor contract: Nonnegative requests, 1 <= k <= requests.length. Return the largest sum of k consecutive minutes in O(n) time and O(1) extra space. Inputs and sums fit int.

Signature: `public static int maxRequests(int[] requests, int k)`.

Four optional hints:
1. Find the sum of the first k minutes.
2. Move the window one minute: which value leaves and which enters?
3. Subtract requests[i-k], add requests[i], and update the maximum.
4. Include the initial window in the maximum; k may equal the entire array length.

Public checks:
- {"values":[3,8,4,12,6,9,2,7],"k":3}. Input: {"values":[3,8,4,12,6,9,2,7],"k":3}. Expected: 27.
- {"values":[3,8,4],"k":1}. Input: {"values":[3,8,4],"k":1}. Expected: 8.
- {"values":[3,8,4],"k":3}. Input: {"values":[3,8,4],"k":3}. Expected: 15.

### 5. The Session Problem

NPC: Theo. Office interaction: theo. Reward: 30 XP.

Dialogue: “Now the length is variable. Keep extending the session until a repeated event breaks uniqueness; shrink until the condition is true again.”

Activity: variable. Completion: complete the authored visual experiment or reasoning check. Next: The Duplicate Event.

### 6. The Duplicate Event

NPC: Maya. Office interaction: maya. Reward: 80 XP.

Dialogue: “Test k=1, k equal to the input length, zero traffic, and repeats that force more than one shrink.”

Activity: qa. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: The Session Tracker.

Editor contract: Nonnegative requests, 1 <= k <= requests.length. Return the largest sum of k consecutive minutes in O(n) time and O(1) extra space. Inputs and sums fit int.

Signature: `public static int maxRequests(int[] requests, int k)`.

Four optional hints:
1. Find the sum of the first k minutes.
2. Move the window one minute: which value leaves and which enters?
3. Subtract requests[i-k], add requests[i], and update the maximum.
4. Include the initial window in the maximum; k may equal the entire array length.

Public checks:
- {"values":[3,8,4,12,6,9,2,7],"k":3}. Input: {"values":[3,8,4,12,6,9,2,7],"k":3}. Expected: 27.
- {"values":[3,8,4],"k":1}. Input: {"values":[3,8,4],"k":1}. Expected: 8.
- {"values":[3,8,4],"k":3}. Input: {"values":[3,8,4],"k":3}. Expected: 15.

Required predictions:
- [3,8,4], k=1 → 8.
- [3,8,4], k=3 → 15.
- [0,0], k=2 → 0.

The player also authors two different tests; these execute against their saved implementation.

### 7. The Session Tracker

NPC: Eva. Office interaction: eva. Reward: 350 XP.

Dialogue: “Find the longest contiguous stretch of unique event characters. Choose your own window invariant and implement it.”

Activity: interview. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: episode delivery and practice-room access.

Editor contract: ASCII event characters, case-sensitive. Return the length of the longest contiguous substring with no repeated character. Empty string returns 0. O(n) time and O(min(n,128)) space.

Signature: `public static int longestUniqueSession(String events)`.

Four optional hints:
1. Keep a window with no duplicate events.
2. A set or map can track the characters inside the window.
3. When a duplicate arrives, shrink from the left until the invariant holds.
4. Update the maximum after restoring uniqueness. Each pointer only moves forward.

Public checks:
- abcaef. Input: abcaef. Expected: 5.
- abcabcbb. Input: abcabcbb. Expected: 3.
- bbbbb. Input: bbbbb. Expected: 1.

Accepted reasoning:
- What must remain true inside the session window? No character repeats.
- Why may shrinking require multiple moves? The earlier duplicate can lie beyond the current left edge.
- Expected time and space? O(n) time; O(min(n,A)) space for alphabet size A.

Phases: clarify input/output and edge contracts; justify the approach; submit a fresh implementation; defend edge tests; explain cost and correctness. Score: correctness 40, measured efficiency 25, edge reasoning 15, explanation 20. Hints switch to Practice Mode; fresh independent retry resets draft, answers and hints.

### Later check — Sliding Window retention

public static int minWindowSum(int[] values, int k): Return the minimum sum of k consecutive nonnegative values. 1 <= k <= length. O(n) time and O(1) extra space.

Unlock: independent interview plus three later mission completions, or the completed-season mixed review. Pass the new problem independently without hints to certify mastery.

## Episode 4 — The Broken Undo Button

Concept: Stacks · LIFO · Deque. New room: Design Editor. Reward: Retro terminal. Independent badge: Undo Wizard.

### 1. UI Disaster

NPC: Lia. Office interaction: lia. Reward: 30 XP.

Dialogue: “I’m Lia, Frontend Developer. I deleted a button, then text, then an image. Undo restored the button first and ruined the demo. Which deletion should be undone first?”

Activity: lifo. Completion: complete the authored visual experiment or reasoning check. Next: Stack of Actions.

### 2. Stack of Actions

NPC: Alex. Office interaction: board. Reward: 30 XP.

Dialogue: “Only the top is accessible. Push adds, pop removes, peek observes. Try the tower and watch the last action leave first.”

Activity: stack. Completion: complete the authored visual experiment or reasoning check. Next: Push & Pop.

### 3. Push & Pop

NPC: Alex. Office interaction: alex. Reward: 30 XP.

Dialogue: “Trace a sequence before running code. Guard empty stacks so a harmless extra Undo cannot crash the editor.”

Activity: pushpop. Completion: complete the authored visual experiment or reasoning check. Next: Fix Undo.

### 4. Fix Undo

NPC: Lia. Office interaction: desk. Reward: 80 XP.

Dialogue: “Implement undoHistory with Deque<String> and ArrayDeque. Undo at most the available number of actions.”

Activity: code. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Redo Is Broken Too.

Editor contract: Return the most recent remaining action after up to undos pops, or "EMPTY". undos >= 0. Use Deque<String> and ArrayDeque. Input actions are in chronological order.

Signature: `public static String undoHistory(String[] actions, int undos)`.

Four optional hints:
1. The last action must leave first.
2. Push every action in input order onto a Deque.
3. Pop only when the stack is not empty.
4. After undoing, return peek(), or EMPTY if there is nothing left.

Public checks:
- {"actions":["button","text","image"],"undos":1}. Input: {"actions":["button","text","image"],"undos":1}. Expected: text.
- {"actions":["button"],"undos":1}. Input: {"actions":["button"],"undos":1}. Expected: EMPTY.

### 5. Redo Is Broken Too

NPC: Lia. Office interaction: lia. Reward: 80 XP.

Dialogue: “Undo moves an action to redo. Redo moves it back. A new action clears the old redo path. Implement both histories.”

Activity: code. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Maya’s Chaos Test.

Editor contract: Commands: ADD:text, UNDO, REDO. Use two Deque<String> stacks. ADD clears redo. Return the current top action or "EMPTY". Invalid undo/redo on empty stacks does nothing.

Signature: `public static String replay(String[] commands)`.

Four optional hints:
1. Undo and redo need separate histories.
2. Undo moves a top action to redo; redo moves it back.
3. A new ADD invalidates all redo history.
4. Use startsWith and substring(4) to read ADD:text; guard every pop.

Public checks:
- ["ADD:A","ADD:B","UNDO"]. Input: ["ADD:A","ADD:B","UNDO"]. Expected: A.
- ["ADD:A","UNDO","REDO"]. Input: ["ADD:A","UNDO","REDO"]. Expected: A.

### 6. Maya’s Chaos Test

NPC: Maya. Office interaction: maya. Reward: 80 XP.

Dialogue: “Try repeated undo, redo on an empty history, and a new action after undo. Predict then execute your own command sequences.”

Activity: qa. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: The Corrupted Configuration.

Editor contract: Commands: ADD:text, UNDO, REDO. Use two Deque<String> stacks. ADD clears redo. Return the current top action or "EMPTY". Invalid undo/redo on empty stacks does nothing.

Signature: `public static String replay(String[] commands)`.

Four optional hints:
1. Undo and redo need separate histories.
2. Undo moves a top action to redo; redo moves it back.
3. A new ADD invalidates all redo history.
4. Use startsWith and substring(4) to read ADD:text; guard every pop.

Public checks:
- ["ADD:A","ADD:B","UNDO"]. Input: ["ADD:A","ADD:B","UNDO"]. Expected: A.
- ["ADD:A","UNDO","REDO"]. Input: ["ADD:A","UNDO","REDO"]. Expected: A.

Required predictions:
- ADD:A, ADD:B, UNDO → A.
- ADD:A, UNDO, ADD:C, REDO → C.
- UNDO, REDO → EMPTY.

The player also authors two different tests; these execute against their saved implementation.

### 7. The Corrupted Configuration

NPC: Eva. Office interaction: eva. Reward: 350 XP.

Dialogue: “Check (), [] and {} nesting in a configuration string. Ignore other characters. Explain why the most recent opening matters first.”

Activity: interview. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: episode delivery and practice-room access.

Editor contract: Match (), [] and {} in correct nesting order. Ignore every other character. Empty string is valid. O(n) time, O(n) worst-case space.

Signature: `public static boolean isValidBrackets(String source)`.

Four optional hints:
1. Which opening bracket must a closing bracket match?
2. Push openings and check the top on a closing symbol.
3. A closing symbol with an empty stack or wrong top is invalid.
4. After the scan, all openings must have been closed.

Public checks:
- {[()]}. Input: {[()]}. Expected: true.
- {[(])}. Input: {[(])}. Expected: false.
- x[y]. Input: x[y]. Expected: true.

Accepted reasoning:
- Which opening should match the current closing bracket? The most recent unmatched opening.
- What makes input invalid immediately? A closing bracket with no matching stack top.
- Worst-case time and space? O(n) time and O(n) stack space.

Phases: clarify input/output and edge contracts; justify the approach; submit a fresh implementation; defend edge tests; explain cost and correctness. Score: correctness 40, measured efficiency 25, edge reasoning 15, explanation 20. Hints switch to Practice Mode; fresh independent retry resets draft, answers and hints.

### Later check — Stack retention

public static String collapse(String text): Repeatedly remove adjacent equal character pairs until none remain. ASCII input. Example abbaca becomes ca. O(n) time and O(n) space.

Unlock: independent interview plus three later mission completions, or the completed-season mixed review. Pass the new problem independently without hints to certify mastery.

## Episode 5 — The Cursed Release

Concept: Binary Search. New room: Release Control Room. Reward: Release beacon. Independent badge: Binary Search Specialist.

### 1. Failed Deployment

NPC: Theo. Office interaction: theo. Reward: 30 XP.

Dialogue: “In this controlled release experiment, every version after the first failure also fails. We need the boundary without testing all 1,024 versions.”

Activity: monotone. Completion: complete the authored visual experiment or reasoning check. Next: The Guessing Game.

### 2. The Guessing Game

NPC: Alex. Office interaction: board. Reward: 30 XP.

Dialogue: “Test the middle. A good version removes everything earlier; a failing version keeps a possible earlier failure alive.”

Activity: binary. Completion: complete the authored visual experiment or reasoning check. Next: Release Timeline.

### 3. Release Timeline

NPC: Theo. Office interaction: theo. Reward: 30 XP.

Dialogue: “Follow false...true on a timeline. The first true is the answer; if no version fails return -1.”

Activity: boundary. Completion: complete the authored visual experiment or reasoning check. Next: First Binary Search.

### 4. First Binary Search

NPC: Theo. Office interaction: desk. Reward: 80 XP.

Dialogue: “Write firstFailingBuild. Use a midpoint calculation that avoids adding two large bounds.”

Activity: code. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Off-by-One Bug.

Editor contract: Monotone false...true array; zero-based index of first true, or -1 if absent, including empty input. O(log n) time and O(1) space.

Signature: `public static int firstFailingBuild(boolean[] failing)`.

Four optional hints:
1. A failing midpoint means the first failure cannot be to its right.
2. A passing midpoint eliminates that midpoint and every earlier build.
3. Keep a candidate answer, or use a half-open interval.
4. Use left + (right-left)/2 and ensure every iteration shrinks the interval.

Public checks:
- [false,false,false,true,true,true]. Input: [false,false,false,true,true,true]. Expected: 3.
- [false,false]. Input: [false,false]. Expected: -1.

### 5. Off-by-One Bug

NPC: Maya. Office interaction: maya. Reward: 30 XP.

Dialogue: “A two-element interval exposes loops that never shrink or skip the answer. Trace the boundaries.”

Activity: offby. Completion: complete the authored visual experiment or reasoning check. Next: No Bad Releases.

### 6. No Bad Releases

NPC: Theo. Office interaction: theo. Reward: 80 XP.

Dialogue: “Check empty input, all passing, all failing, first failure at each edge, and a single version.”

Activity: qa. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Find the Insertion Point.

Editor contract: Monotone false...true array; zero-based index of first true, or -1 if absent, including empty input. O(log n) time and O(1) space.

Signature: `public static int firstFailingBuild(boolean[] failing)`.

Four optional hints:
1. A failing midpoint means the first failure cannot be to its right.
2. A passing midpoint eliminates that midpoint and every earlier build.
3. Keep a candidate answer, or use a half-open interval.
4. Use left + (right-left)/2 and ensure every iteration shrinks the interval.

Public checks:
- [false,false,false,true,true,true]. Input: [false,false,false,true,true,true]. Expected: 3.
- [false,false]. Input: [false,false]. Expected: -1.

Required predictions:
- [] → -1.
- [false,false] → -1.
- [true,true] → 0.
- [false,true] → 1.

The player also authors two different tests; these execute against their saved implementation.

### 7. Find the Insertion Point

NPC: Eva. Office interaction: eva. Reward: 350 XP.

Dialogue: “Return the index of target or the position that keeps distinct numbers sorted. The insertion point can be after the last element.”

Activity: interview. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: episode delivery and practice-room access.

Editor contract: Sorted distinct integers. Return the existing target index, otherwise its insertion index (0 through length). O(log n) time, O(1) extra space. Avoid midpoint overflow.

Signature: `public static int searchInsert(int[] numbers, int target)`.

Four optional hints:
1. Search for the first position whose value is at least target.
2. The answer may be numbers.length.
3. A half-open interval [left,right) naturally includes that possibility.
4. Move left beyond values smaller than target, otherwise move right to mid.

Public checks:
- {"values":[1,3,5,6],"target":5}. Input: {"values":[1,3,5,6],"target":5}. Expected: 2.
- {"values":[1,3,5,6],"target":2}. Input: {"values":[1,3,5,6],"target":2}. Expected: 1.

Accepted reasoning:
- What boundary are you looking for? The first index whose value is at least target.
- Why can the result equal the input length? The target belongs after every existing value.
- Time, space and midpoint? O(log n), O(1); left+(right-left)/2.

Phases: clarify input/output and edge contracts; justify the approach; submit a fresh implementation; defend edge tests; explain cost and correctness. Score: correctness 40, measured efficiency 25, edge reasoning 15, explanation 20. Hints switch to Practice Mode; fresh independent retry resets draft, answers and hints.

### Later check — Binary Search retention

public static int lastAtMost(int[] values, int target): Sorted distinct integers. Return the last index whose value is <= target, or -1. O(log n) time and O(1) space.

Unlock: independent interview plus three later mission completions, or the completed-season mixed review. Pass the new problem independently without hints to certify mastery.

## Episode 6 — The Delivery Chain

Concept: Linked Lists · Fast/Slow Pointers. New room: Delivery Workshop. Reward: Roaming delivery robot. Independent badge: Linked List Navigator.

### 1. Route Gone Wrong

NPC: Max. Office interaction: max. Reward: 30 XP.

Dialogue: “Each delivery stop knows only its next stop. We cannot jump to an array index. Follow the chain before changing it.”

Activity: chain. Completion: complete the authored visual experiment or reasoning check. Next: Follow the Next Pointer.

### 2. Follow the Next Pointer

NPC: Alex. Office interaction: board. Reward: 30 XP.

Dialogue: “A node holds a value and a reference. Equal values do not mean two references identify the same node.”

Activity: links. Completion: complete the authored visual experiment or reasoning check. Next: Reverse the Route.

### 3. Reverse the Route

NPC: Max. Office interaction: max. Reward: 30 XP.

Dialogue: “Save the next link before redirecting it toward the previous stop. Otherwise the remainder of the route is lost.”

Activity: reverse. Completion: complete the authored visual experiment or reasoning check. Next: Java Implementation.

### 4. Java Implementation

NPC: Alex. Office interaction: desk. Reward: 80 XP.

Dialogue: “Reverse the existing nodes iteratively with constant extra space. No replacement list.”

Activity: code. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: The Missing Node.

Editor contract: ListNode has int value and ListNode next. Acyclic input, possibly null. Reverse the original nodes in place, return the new head. O(n) time, O(1) extra space. Do not allocate replacement nodes.

Signature: `public static ListNode reverseList(ListNode head)`.

Four optional hints:
1. Changing next too early can lose the remaining route.
2. Track the previous node and the current node.
3. Save current.next before redirecting that link.
4. Advance using the saved link; return the final previous node.

Public checks:
- 3 original nodes. Input: 3 nodes. Expected: same nodes in reverse order.
- 4 original nodes. Input: 4 nodes. Expected: same nodes in reverse order.

### 5. The Missing Node

NPC: Maya. Office interaction: maya. Reward: 80 XP.

Dialogue: “Null, one node and repeated values deserve their own tests. The returned route must contain the original nodes exactly once.”

Activity: qa. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: The Infinite Route.

Editor contract: ListNode has int value and ListNode next. Acyclic input, possibly null. Reverse the original nodes in place, return the new head. O(n) time, O(1) extra space. Do not allocate replacement nodes.

Signature: `public static ListNode reverseList(ListNode head)`.

Four optional hints:
1. Changing next too early can lose the remaining route.
2. Track the previous node and the current node.
3. Save current.next before redirecting that link.
4. Advance using the saved link; return the final previous node.

Public checks:
- 3 original nodes. Input: 3 nodes. Expected: same nodes in reverse order.
- 4 original nodes. Input: 4 nodes. Expected: same nodes in reverse order.

Required predictions:
- Reverse null → null.
- Reverse 7 → 7.
- Reverse 1 → 1 → 2 → 2 → 1 → 1.

The player also authors two different tests; these execute against their saved implementation.

### 6. The Infinite Route

NPC: Max. Office interaction: max. Reward: 30 XP.

Dialogue: “A driver keeps revisiting stops. Move one pointer one step and another two steps. Watch references, not values.”

Activity: cycle. Completion: complete the authored visual experiment or reasoning check. Next: The Endless Delivery Route.

### 7. The Endless Delivery Route

NPC: Eva. Office interaction: eva. Reward: 350 XP.

Dialogue: “Detect a cycle without modifying the route or storing all visited nodes. Explain why the two pointers eventually meet.”

Activity: interview. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: episode delivery and practice-room access.

Editor contract: Return whether next references form a cycle. Nodes are identified by reference, not value. Null input is acyclic. O(n) time, O(1) extra space; leave the list unchanged.

Signature: `public static boolean hasCycle(ListNode head)`.

Four optional hints:
1. Can two walkers moving at different speeds detect repeated travel?
2. Move slow one link and fast two links.
3. Guard fast and fast.next before moving.
4. If the references meet there is a cycle; reaching null means there is none.

Public checks:
- 4 nodes, cycle entry 1. Input: 4 nodes, cycle entry 1. Expected: true.
- 4 nodes, cycle entry -1. Input: 4 nodes, cycle entry -1. Expected: false.

Accepted reasoning:
- How do fast and slow detect a cycle? Different speeds eventually meet on the same node reference.
- What protects fast.next.next? Check fast and fast.next for null before advancing.
- Time and extra space? O(n) time, O(1) extra space with unchanged links.

Phases: clarify input/output and edge contracts; justify the approach; submit a fresh implementation; defend edge tests; explain cost and correctness. Score: correctness 40, measured efficiency 25, edge reasoning 15, explanation 20. Hints switch to Practice Mode; fresh independent retry resets draft, answers and hints.

### Later check — Linked List retention

public static ListNode middleNode(ListNode head): Acyclic list, possibly null. Return the middle node reference, choosing the second middle for even length. Leave links unchanged. O(n) time, O(1) space.

Unlock: independent interview plus three later mission completions, or the completed-season mixed review. Pass the new problem independently without hints to certify mastery.

## Episode 7 — The Endless Folder

Concept: Recursion · Call Stack · Trees. New room: Archive Room. Reward: Pixel library. Independent badge: Recursion Explorer.

### 1. Archive Emergency

NPC: Iris. Office interaction: iris. Reward: 30 XP.

Dialogue: “I’m Iris, Backend Engineer. A client has folders inside folders at unknown depths. Count files in every branch; there are no cycles.”

Activity: tree. Completion: complete the authored visual experiment or reasoning check. Next: The Folder Inside a Folder.

### 2. The Folder Inside a Folder

NPC: Alex. Office interaction: alex. Reward: 30 XP.

Dialogue: “Every child folder is a smaller instance of the same problem. Direct files plus all child results give the parent total.”

Activity: subproblem. Completion: complete the authored visual experiment or reasoning check. Next: The Recursive Robot.

### 3. The Recursive Robot

NPC: Iris. Office interaction: board. Reward: 30 XP.

Dialogue: “Choose the stopping case and the recursive step. An empty folder and a missing folder must both finish.”

Activity: base. Completion: complete the authored visual experiment or reasoning check. Next: Count Every File.

### 4. Count Every File

NPC: Iris. Office interaction: desk. Reward: 80 XP.

Dialogue: “Use the Folder model to count direct and nested files. Arrays in valid folders are never null.”

Activity: code. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Call Stack Lab.

Editor contract: Folder has String[] files and Folder[] children. Arrays are non-null; root may be null. No cycles. Count direct files and all descendant files. O(total folders + files) time, O(height) call stack.

Signature: `public static int countFiles(Folder root)`.

Four optional hints:
1. What should a null root contribute?
2. Count the files directly inside this folder.
3. Apply the same method to every child folder.
4. Add each child result to the direct count, then return the total.

Public checks:
- 2 nested folders with two files each. Input: 2 nested folders with two files each. Expected: 4.
- 4 nested folders with two files each. Input: 4 nested folders with two files each. Expected: 8.

### 5. Call Stack Lab

NPC: Alex. Office interaction: board. Reward: 30 XP.

Dialogue: “Enter a folder, suspend the parent, solve its child, return the child result, and resume. Trace the stack and returned totals.”

Activity: calls. Completion: complete the authored visual experiment or reasoning check. Next: Stack Overflow.

### 6. Stack Overflow

NPC: Maya. Office interaction: maya. Reward: 80 XP.

Dialogue: “Very deep input can exhaust the JVM call stack. Test normal trees and explain when an explicit work stack is safer.”

Activity: qa. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Deepest Directory.

Editor contract: Folder has String[] files and Folder[] children. Arrays are non-null; root may be null. No cycles. Count direct files and all descendant files. O(total folders + files) time, O(height) call stack.

Signature: `public static int countFiles(Folder root)`.

Four optional hints:
1. What should a null root contribute?
2. Count the files directly inside this folder.
3. Apply the same method to every child folder.
4. Add each child result to the direct count, then return the total.

Public checks:
- 2 nested folders with two files each. Input: 2 nested folders with two files each. Expected: 4.
- 4 nested folders with two files each. Input: 4 nested folders with two files each. Expected: 8.

Required predictions:
- Null root file count → 0.
- Empty folder file count → 0.
- Root has 2 files, child has 3 → 5.

The player also authors two different tests; these execute against their saved implementation.

### 7. Deepest Directory

NPC: Eva. Office interaction: eva. Reward: 350 XP.

Dialogue: “Find binary-tree maximum depth. Empty tree is 0, one node is 1. Explain O(n) time and O(h) stack space.”

Activity: interview. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: episode delivery and practice-room access.

Editor contract: TreeNode has int value, TreeNode left and right. Empty tree has depth 0; single node 1. O(n) time, O(h) call stack.

Signature: `public static int maxDepth(TreeNode root)`.

Four optional hints:
1. What is the depth of no tree?
2. Compute each child subtree depth.
3. The deeper branch determines the depth.
4. Include the current node: one plus the larger child depth.

Public checks:
- 3 nodes in balanced tree. Input: 3 nodes in balanced tree. Expected: 2.
- 7 nodes in balanced tree. Input: 7 nodes in balanced tree. Expected: 3.

Accepted reasoning:
- How do subtree results combine? One plus the larger child depth.
- What does null contribute? Depth zero.
- Time and call stack space? O(n) time, O(h) stack for tree height h.

Phases: clarify input/output and edge contracts; justify the approach; submit a fresh implementation; defend edge tests; explain cost and correctness. Score: correctness 40, measured efficiency 25, edge reasoning 15, explanation 20. Hints switch to Practice Mode; fresh independent retry resets draft, answers and hints.

### Later check — Trees retention

public static int countLeaves(TreeNode root): Return the number of nodes with no children. Empty tree returns 0. O(n) time, O(h) call stack.

Unlock: independent interview plus three later mission completions, or the completed-season mixed review. Pass the new problem independently without hints to certify mastery.

## Episode 8 — The Missing Customer

Concept: SQL JOINs · LEFT JOIN · NULL. New room: Secret Investigation. Reward: Investigation board. Independent badge: SQL Detective Level 2.

### 1. Missing Customers

NPC: Nora. Office interaction: nora. Reward: 30 XP.

Dialogue: “Support says new accounts vanished from the dashboard. Iris found them in the database. Investigate the query before blaming the data.”

Activity: investigate. Completion: complete the authored visual experiment or reasoning check. Next: Database Access.

### 2. Database Access

NPC: Iris. Office interaction: iris. Reward: 30 XP.

Dialogue: “customers.id identifies a customer; orders.customer_id refers to it. Explore our local database with real SQLite.”

Activity: schema. Completion: complete the authored visual experiment or reasoning check. Next: Detective SELECT.

### 3. Detective SELECT

NPC: Iris. Office interaction: sql. Reward: 80 XP.

Dialogue: “Return all customer IDs and names, ordered by ID. Read the schema and execute your own query.”

Activity: code. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: The Relationship.

Editor contract: Return id and name for all customers, ordered by id. Explore the live seeded customers and orders tables.

Four optional hints:
1. Look at the schema.
2. SELECT chooses output columns.
3. FROM customers chooses the source.
4. ORDER BY id makes the requested ordering explicit.

Runs on the live customers/orders/payments seed. Submission and verification queries are also checked on two changed datasets.

### 4. The Relationship

NPC: Iris. Office interaction: board. Reward: 30 XP.

Dialogue: “A customer can have several orders or none. Match the keys and count the resulting rows.”

Activity: relation. Completion: complete the authored visual experiment or reasoning check. Next: INNER JOIN Trap.

### 5. INNER JOIN Trap

NPC: Iris. Office interaction: iris. Reward: 30 XP.

Dialogue: “INNER JOIN retains matches only. Watch Sara and David disappear because they have not ordered.”

Activity: join. Completion: complete the authored visual experiment or reasoning check. Next: LEFT JOIN Investigation.

### 6. LEFT JOIN Investigation

NPC: Alex. Office interaction: sql. Reward: 80 XP.

Dialogue: “Keep every customer, and represent unmatched orders with NULL. Multiple orders still produce multiple rows.”

Activity: code. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Fix the Dashboard.

Editor contract: Return customer_name and order_id for every customer, including customers without orders. One row per order; NULL order_id for unmatched customers.

Four optional hints:
1. Which table must keep every row?
2. Put customers on the left of a LEFT JOIN.
3. Join customers.id to orders.customer_id.
4. Alias c.name as customer_name and o.id as order_id.

Runs on the live customers/orders/payments seed. Submission and verification queries are also checked on two changed datasets.

### 7. Fix the Dashboard

NPC: Maya. Office interaction: sql. Reward: 80 XP.

Dialogue: “Find customers with no orders. Test on a second dataset so memorized customer IDs will not pass.”

Activity: qa. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Unpaid Orders.

Editor contract: Return id and customer_name for customers with no orders. Each customer appears once, even if other customers have multiple orders.

Four optional hints:
1. Start by retaining customers with LEFT JOIN.
2. Unmatched order columns become NULL.
3. Use IS NULL, rather than = NULL.
4. Test an order identifier for NULL, and return the customer identifier and name.

Runs on the live customers/orders/payments seed. Submission and verification queries are also checked on two changed datasets.

Required predictions:
- Customer has no orders in LEFT JOIN → NULL order_id.
- Customer has 2 orders → 2 rows.
- Compare NULL with = NULL → not true.

The player also authors two different tests; these execute against their saved implementation.

### 8. Unpaid Orders

NPC: Eva. Office interaction: eva. Reward: 350 XP.

Dialogue: “A new schema includes payments. Find every unpaid order with its customer name, even when customers have several orders.”

Activity: interview. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: episode delivery and practice-room access.

Editor contract: Return order_id and customer_name for orders with no associated payment. customers(id,name), orders(id,customer_id), payments(id,order_id,amount). Multiple orders and payments are possible.

Four optional hints:
1. Start with orders, not customers.
2. Join customers to recover the name.
3. LEFT JOIN payments using the order ID.
4. Keep rows where the payment ID IS NULL, or use NOT EXISTS.

Runs on the live customers/orders/payments seed. Submission and verification queries are also checked on two changed datasets.

Accepted reasoning:
- What is the unit of the requested output? An unpaid order and its customer name.
- Which join/filter finds absent payments? LEFT JOIN payments, then payment ID IS NULL.
- How do multiple payments affect unpaid orders? Paid orders remain excluded; every unpaid order remains present.

Phases: clarify input/output and edge contracts; justify the approach; submit a fresh implementation; defend edge tests; explain cost and correctness. Score: correctness 40, measured efficiency 25, edge reasoning 15, explanation 20. Hints switch to Practice Mode; fresh independent retry resets draft, answers and hints.

### Later check — SQL retention

SQL / architecture contract: Return id and customer_name for customers having at least one unpaid order, once per customer. Paid and unpaid orders may belong to the same customer.

Unlock: independent interview plus three later mission completions, or the completed-season mixed review. Pass the new problem independently without hints to certify mastery.

## Episode 9 — The Legacy Code Disaster

Concept: Interfaces · Polymorphism · SOLID. New room: Architecture Room. Reward: Workstation upgrade. Independent badge: Clean Code Architect.

### 1. Payment Disaster

NPC: Nora. Office interaction: nora. Reward: 30 XP.

Dialogue: “BentoCart needs another payment method, but every new if branch risks breaking existing payments. Read the design before extending it.”

Activity: legacy. Completion: complete the authored visual experiment or reasoning check. Next: The Giant If Statement.

### 2. The Giant If Statement

NPC: Victor. Office interaction: victor. Reward: 30 XP.

Dialogue: “I’m Victor, Software Architect. The processor mixes choosing a method, implementing it, and formatting its result. Identify the responsibilities.”

Activity: responsibility. Completion: complete the authored visual experiment or reasoning check. Next: Object Workshop.

### 3. Object Workshop

NPC: Alex. Office interaction: board. Reward: 30 XP.

Dialogue: “An object combines state and behavior. Different payment objects can fulfill the same role while owning their own behavior.”

Activity: objects. Completion: complete the authored visual experiment or reasoning check. Next: Interface Contract.

### 4. Interface Contract

NPC: Victor. Office interaction: victor. Reward: 30 XP.

Dialogue: “A common pay contract lets callers depend on what a method does, rather than which concrete class provides it.”

Activity: interface. Completion: complete the authored visual experiment or reasoning check. Next: Polymorphism Lab.

### 5. Polymorphism Lab

NPC: Victor. Office interaction: board. Reward: 30 XP.

Dialogue: “Run card and bank objects through the same caller. The implementation chosen belongs to the object.”

Activity: polymorphism. Completion: complete the authored visual experiment or reasoning check. Next: Refactor the Processor.

### 6. Refactor the Processor

NPC: Alex. Office interaction: desk. Reward: 80 XP.

Dialogue: “Implement the interface, two strategies and a delegating processor. Amounts use integer cents.”

Activity: code. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: The New Payment Method.

Editor contract: Define interface PaymentMethod { String pay(int cents); }, CardPayment and BankPayment implementing it, and PaymentProcessor with String pay(PaymentMethod method,int cents) delegating to the method. Card returns CARD:<cents>; bank returns BANK:<cents>. Use integer cents. Nested concrete classes must be static.

Four optional hints:
1. Separate the common contract from each payment behavior.
2. Concrete implementations return their own receipt string.
3. The processor should depend on PaymentMethod, not concrete types.
4. Call method.pay(cents) inside the processor; no type switch is needed.

Public checks:
- Card receipt. Input: 125 cents. Expected: CARD:125.
- Bank receipt. Input: 0 cents. Expected: BANK:0.

### 7. The New Payment Method

NPC: Nora. Office interaction: desk. Reward: 80 XP.

Dialogue: “Add GiftCardPayment. Keep the central processor open to an implementation it has never seen.”

Activity: code. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Regression Testing.

Editor contract: Keep the same PaymentMethod, CardPayment, BankPayment and PaymentProcessor contracts. Add static GiftCardPayment implementing PaymentMethod and returning GIFT:<cents>. The processor must handle an unseen implementation too.

Four optional hints:
1. A new strategy should obey the existing interface.
2. Add GiftCardPayment without a new branch in the processor.
3. Return GIFT: followed by integer cents.
4. An unseen PaymentMethod should work by delegation as well.

Public checks:
- Card receipt. Input: 125 cents. Expected: CARD:125.
- Bank receipt. Input: 0 cents. Expected: BANK:0.
- Gift receipt. Input: 999 cents. Expected: GIFT:999.

### 8. Regression Testing

NPC: Maya. Office interaction: maya. Reward: 80 XP.

Dialogue: “Check all original strategies and an unseen test strategy. Submit two amounts of your own before delivery.”

Activity: qa. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: Architecture Interview.

Editor contract: Keep the same PaymentMethod, CardPayment, BankPayment and PaymentProcessor contracts. Add static GiftCardPayment implementing PaymentMethod and returning GIFT:<cents>. The processor must handle an unseen implementation too.

Four optional hints:
1. A new strategy should obey the existing interface.
2. Add GiftCardPayment without a new branch in the processor.
3. Return GIFT: followed by integer cents.
4. An unseen PaymentMethod should work by delegation as well.

Public checks:
- Card receipt. Input: 125 cents. Expected: CARD:125.
- Bank receipt. Input: 0 cents. Expected: BANK:0.
- Gift receipt. Input: 999 cents. Expected: GIFT:999.

Required predictions:
- CardPayment with 125 cents → CARD:125.
- GiftCardPayment with 0 cents → GIFT:0.
- Unseen strategy through delegating processor → works.

The player also authors two different tests; these execute against their saved implementation.

### 9. Architecture Interview

NPC: Victor & Eva. Office interaction: eva. Reward: 350 XP.

Dialogue: “Design an extensible Email, SMS and Push notification system. Prove an unseen channel works through the same service.”

Activity: interview. Completion: submit the player’s implementation, pass public/hidden review and applicable growth checks. Next: episode delivery and practice-room access.

Editor contract: Define interface NotificationChannel { String send(String message); }, static EmailChannel, SmsChannel and PushChannel implementing it, plus static NotificationService with String notify(NotificationChannel channel,String message). Channels return EMAIL:<message>, SMS:<message>, PUSH:<message>. Service must accept an unseen channel by delegation.

Four optional hints:
1. This is a new domain with the same extensibility problem.
2. Give every channel one shared contract.
3. Each channel owns its own formatting behavior.
4. Delegate through NotificationChannel in the service; adding a channel should not change the service.

Public checks:
- Email channel. Input: hello. Expected: EMAIL:hello.
- Sms channel. Input: hello. Expected: SMS:hello.
- Push channel. Input: hello. Expected: PUSH:hello.

Accepted reasoning:
- What contract should the notification service depend on? NotificationChannel.
- Where does channel-specific behavior belong? Inside the channel implementation.
- What demonstrates extensibility? An unseen channel works through the unchanged service.

Phases: clarify input/output and edge contracts; justify the approach; submit a fresh implementation; defend edge tests; explain cost and correctness. Score: correctness 40, measured efficiency 25, edge reasoning 15, explanation 20. Hints switch to Practice Mode; fresh independent retry resets draft, answers and hints.

### Later check — Architecture retention

SQL / architecture contract: Define interface ShippingStrategy { int cost(int grams); }, static StandardShipping (cost = grams + 100), ExpressShipping (cost = grams + 500), and ShippingService with int quote(ShippingStrategy strategy,int grams) delegating to the strategy. An unseen strategy must work too.

Unlock: independent interview plus three later mission completions, or the completed-season mixed review. Pass the new problem independently without hints to certify mastery.

## HashMap retention after Checkout

Return the first value encountered a second time in left-to-right order, or -1 when none repeats. Values are nonnegative. Expected O(n) time.

Unlocks after an independent Checkout interview and the first three Warehouse missions.
