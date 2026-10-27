// Authored curriculum shared by the mission UI and progression engine.
const q = (id, title, npc, target, dialogue, activity, task) => ({
  id,
  title,
  npc,
  target,
  dialogue,
  activity,
  task,
  xp: task ? 80 : 30,
});
/** @type {Record<string,{title:string,signature?:string|null,contract:string,starter:string|null,hints:string[],sql?:boolean,oop?:boolean}>} */
export const TASKS = {
  sorted: {
    title: 'Find the sorted pair',
    signature: 'public static int[] findPairSorted(int[] weights, int target)',
    contract:
      'Input is sorted ascending; weights are nonnegative. Return two different zero-based indices or an empty array. Any valid pair is accepted. O(n) time, O(1) extra space; no HashMap.',
    starter: 'return new int[0];',
    hints: [
      'What does sorting tell you about the smallest and largest remaining weights?',
      'Compare the sum at the two ends with the target.',
      'If the sum is too small, discard the left endpoint. If too large, discard the right.',
      'Keep left < right. Return their indices on equality; otherwise move the justified endpoint.',
    ],
  },
  palindrome: {
    title: 'The Secret Password',
    signature: 'public static boolean isPalindrome(String password)',
    contract:
      'Compare Unicode letter/digit code points, ignoring other code points and case using Character.toLowerCase. Empty or punctuation-only text is a palindrome. O(n) time and O(1) extra space. Use codePointAt, codePointBefore and Character.charCount to move across supplementary characters; do not build a normalized copy.',
    starter: 'return false;',
    hints: [
      'Can the same idea compare the two ends of a string?',
      'Use Character.isLetterOrDigit on the endpoint code points; skip ignored code points.',
      'Compare Character.toLowerCase on both code points; move by Character.charCount.',
      'A mismatch means false. After all valid pairs match, return true.',
    ],
  },
  traffic: {
    title: 'Fix the Monitor',
    signature: 'public static int maxRequests(int[] requests, int k)',
    contract:
      'Nonnegative requests, 1 <= k <= requests.length. Return the largest sum of k consecutive minutes in O(n) time and O(1) extra space. Inputs and sums fit int.',
    starter: 'return 0;',
    hints: [
      'Find the sum of the first k minutes.',
      'Move the window one minute: which value leaves and which enters?',
      'Subtract requests[i-k], add requests[i], and update the maximum.',
      'Include the initial window in the maximum; k may equal the entire array length.',
    ],
  },
  unique: {
    title: 'The Session Tracker',
    signature: 'public static int longestUniqueSession(String events)',
    contract:
      'ASCII event characters, case-sensitive. Return the length of the longest contiguous substring with no repeated character. Empty string returns 0. O(n) time and O(min(n,128)) space.',
    starter: 'return 0;',
    hints: [
      'Keep a window with no duplicate events.',
      'A set or map can track the characters inside the window.',
      'When a duplicate arrives, shrink from the left until the invariant holds.',
      'Update the maximum after restoring uniqueness. Each pointer only moves forward.',
    ],
  },
  undo: {
    title: 'Fix Undo',
    signature: 'public static String undoHistory(String[] actions, int undos)',
    contract:
      'Return the most recent remaining action after up to undos pops, or "EMPTY". undos >= 0. Use Deque<String> and ArrayDeque. Input actions are in chronological order.',
    starter: 'return "EMPTY";',
    hints: [
      'The last action must leave first.',
      'Push every action in input order onto a Deque.',
      'Pop only when the stack is not empty.',
      'After undoing, return peek(), or EMPTY if there is nothing left.',
    ],
  },
  redo: {
    title: 'Repair Redo',
    signature: 'public static String replay(String[] commands)',
    contract:
      'Commands: ADD:text, UNDO, REDO. Use two Deque<String> stacks. ADD clears redo. Return the current top action or "EMPTY". Invalid undo/redo on empty stacks does nothing.',
    starter: 'return "EMPTY";',
    hints: [
      'Undo and redo need separate histories.',
      'Undo moves a top action to redo; redo moves it back.',
      'A new ADD invalidates all redo history.',
      'Use startsWith and substring(4) to read ADD:text; guard every pop.',
    ],
  },
  brackets: {
    title: 'The Corrupted Configuration',
    signature: 'public static boolean isValidBrackets(String source)',
    contract:
      'Match (), [] and {} in correct nesting order. Ignore every other character. Empty string is valid. O(n) time, O(n) worst-case space.',
    starter: 'return false;',
    hints: [
      'Which opening bracket must a closing bracket match?',
      'Push openings and check the top on a closing symbol.',
      'A closing symbol with an empty stack or wrong top is invalid.',
      'After the scan, all openings must have been closed.',
    ],
  },
  failing: {
    title: 'Find the cursed release',
    signature: 'public static int firstFailingBuild(boolean[] failing)',
    contract:
      'Monotone false...true array; zero-based index of first true, or -1 if absent, including empty input. O(log n) time and O(1) space.',
    starter: 'return -1;',
    hints: [
      'A failing midpoint means the first failure cannot be to its right.',
      'A passing midpoint eliminates that midpoint and every earlier build.',
      'Keep a candidate answer, or use a half-open interval.',
      'Use left + (right-left)/2 and ensure every iteration shrinks the interval.',
    ],
  },
  insert: {
    title: 'Find the Insertion Point',
    signature: 'public static int searchInsert(int[] numbers, int target)',
    contract:
      'Sorted distinct integers. Return the existing target index, otherwise its insertion index (0 through length). O(log n) time, O(1) extra space. Avoid midpoint overflow.',
    starter: 'return 0;',
    hints: [
      'Search for the first position whose value is at least target.',
      'The answer may be numbers.length.',
      'A half-open interval [left,right) naturally includes that possibility.',
      'Move left beyond values smaller than target, otherwise move right to mid.',
    ],
  },
  reverse: {
    title: 'Reverse the Route',
    signature: 'public static ListNode reverseList(ListNode head)',
    contract:
      'ListNode has int value and ListNode next. Acyclic input, possibly null. Reverse the original nodes in place, return the new head. O(n) time, O(1) extra space. Do not allocate replacement nodes.',
    starter: 'return head;',
    hints: [
      'Changing next too early can lose the remaining route.',
      'Track the previous node and the current node.',
      'Save current.next before redirecting that link.',
      'Advance using the saved link; return the final previous node.',
    ],
  },
  cycle: {
    title: 'The Endless Delivery Route',
    signature: 'public static boolean hasCycle(ListNode head)',
    contract:
      'Return whether next references form a cycle. Nodes are identified by reference, not value. Null input is acyclic. O(n) time, O(1) extra space; leave the list unchanged.',
    starter: 'return false;',
    hints: [
      'Can two walkers moving at different speeds detect repeated travel?',
      'Move slow one link and fast two links.',
      'Guard fast and fast.next before moving.',
      'If the references meet there is a cycle; reaching null means there is none.',
    ],
  },
  files: {
    title: 'Count Every File',
    signature: 'public static int countFiles(Folder root)',
    contract:
      'Folder has String[] files and Folder[] children. Arrays are non-null; root may be null. No cycles. Count direct files and all descendant files. O(total folders + files) time, O(height) call stack.',
    starter: 'return 0;',
    hints: [
      'What should a null root contribute?',
      'Count the files directly inside this folder.',
      'Apply the same method to every child folder.',
      'Add each child result to the direct count, then return the total.',
    ],
  },
  depth: {
    title: 'Deepest Directory',
    signature: 'public static int maxDepth(TreeNode root)',
    contract:
      'TreeNode has int value, TreeNode left and right. Empty tree has depth 0; single node 1. O(n) time, O(h) call stack.',
    starter: 'return 0;',
    hints: [
      'What is the depth of no tree?',
      'Compute each child subtree depth.',
      'The deeper branch determines the depth.',
      'Include the current node: one plus the larger child depth.',
    ],
  },
  customers: {
    title: 'Detective SELECT',
    sql: true,
    contract:
      'Return id and name for all customers, ordered by id. Explore the live seeded customers and orders tables.',
    starter: 'SELECT * FROM customers;',
    hints: [
      'Look at the schema.',
      'SELECT chooses output columns.',
      'FROM customers chooses the source.',
      'ORDER BY id makes the requested ordering explicit.',
    ],
  },
  leftjoin: {
    title: 'LEFT JOIN Investigation',
    sql: true,
    contract:
      'Return customer_name and order_id for every customer, including customers without orders. One row per order; NULL order_id for unmatched customers.',
    starter: 'SELECT * FROM customers;',
    hints: [
      'Which table must keep every row?',
      'Put customers on the left of a LEFT JOIN.',
      'Join customers.id to orders.customer_id.',
      'Alias c.name as customer_name and o.id as order_id.',
    ],
  },
  missing: {
    title: 'Fix the Dashboard',
    sql: true,
    contract:
      'Return id and customer_name for customers with no orders. Each customer appears once, even if other customers have multiple orders.',
    starter: 'SELECT * FROM customers;',
    hints: [
      'Start by retaining customers with LEFT JOIN.',
      'Unmatched order columns become NULL.',
      'Use IS NULL, rather than = NULL.',
      'Test an order identifier for NULL, and return the customer identifier and name.',
    ],
  },
  unpaid: {
    title: 'Unpaid Orders',
    sql: true,
    contract:
      'Return order_id and customer_name for orders with no associated payment. customers(id,name), orders(id,customer_id), payments(id,order_id,amount). Multiple orders and payments are possible.',
    starter: 'SELECT * FROM orders;',
    hints: [
      'Start with orders, not customers.',
      'Join customers to recover the name.',
      'LEFT JOIN payments using the order ID.',
      'Keep rows where the payment ID IS NULL, or use NOT EXISTS.',
    ],
  },
  payment: {
    title: 'Refactor the Processor',
    oop: true,
    contract:
      'Define interface PaymentMethod { String pay(int cents); }, CardPayment and BankPayment implementing it, and PaymentProcessor with String pay(PaymentMethod method,int cents) delegating to the method. Card returns CARD:<cents>; bank returns BANK:<cents>. Use integer cents. Nested concrete classes must be static.',
    starter:
      'public interface PaymentMethod { String pay(int cents); }\npublic static class CardPayment implements PaymentMethod {\n    public String pay(int cents) { return ""; }\n}\npublic static class BankPayment implements PaymentMethod {\n    public String pay(int cents) { return ""; }\n}\npublic static class PaymentProcessor {\n    public String pay(PaymentMethod method, int cents) { return ""; }\n}',
    hints: [
      'Separate the common contract from each payment behavior.',
      'Concrete implementations return their own receipt string.',
      'The processor should depend on PaymentMethod, not concrete types.',
      'Call method.pay(cents) inside the processor; no type switch is needed.',
    ],
  },
  gift: {
    title: 'The New Payment Method',
    oop: true,
    contract:
      'Keep the same PaymentMethod, CardPayment, BankPayment and PaymentProcessor contracts. Add static GiftCardPayment implementing PaymentMethod and returning GIFT:<cents>. The processor must handle an unseen implementation too.',
    starter: null,
    hints: [
      'A new strategy should obey the existing interface.',
      'Add GiftCardPayment without a new branch in the processor.',
      'Return GIFT: followed by integer cents.',
      'An unseen PaymentMethod should work by delegation as well.',
    ],
  },
  notification: {
    title: 'Notification System',
    oop: true,
    contract:
      'Define interface NotificationChannel { String send(String message); }, static EmailChannel, SmsChannel and PushChannel implementing it, plus static NotificationService with String notify(NotificationChannel channel,String message). Channels return EMAIL:<message>, SMS:<message>, PUSH:<message>. Service must accept an unseen channel by delegation.',
    starter:
      'public interface NotificationChannel { String send(String message); }\npublic static class EmailChannel implements NotificationChannel {\n    public String send(String message) { return ""; }\n}\npublic static class SmsChannel implements NotificationChannel {\n    public String send(String message) { return ""; }\n}\npublic static class PushChannel implements NotificationChannel {\n    public String send(String message) { return ""; }\n}\npublic static class NotificationService {\n    public String notify(NotificationChannel channel, String message) { return ""; }\n}',
    hints: [
      'This is a new domain with the same extensibility problem.',
      'Give every channel one shared contract.',
      'Each channel owns its own formatting behavior.',
      'Delegate through NotificationChannel in the service; adding a channel should not change the service.',
    ],
  },
};
export function starter(task) {
  const t = TASKS[task];
  return t.starter === null
    ? TASKS.payment.starter
    : t.sql || t.oop
      ? t.starter
      : `${t.signature} {\n    // ${t.title}\n    ${t.starter}\n}`;
}
export const EPISODES = [
  {
    id: 'warehouse',
    number: 2,
    title: 'The Warehouse Mix-up',
    concept: 'Two Pointers',
    badge: 'Dual Pointer',
    reward: 'Robotic desk arms',
    room: 'Warehouse Lab',
    bossXP: 350,
    missions: [
      q(
        'alert',
        'Warehouse Alert',
        'Nora',
        'nora',
        'BentoCart shipped its voucher fix, but the warehouse robot checks every pair of parcels. Choose two different parcels totaling 13 kg before the next truck leaves.',
        'pair',
      ),
      q(
        'max',
        'Meet Max',
        'Max',
        'max',
        'I’m Max, Warehouse Engineer. Our conveyor already sorts parcels by weight. Equal weights can sit next to each other; sorted does not mean distinct.',
        'sorted',
      ),
      q(
        'arms',
        'Robot Arms',
        'Alex',
        'board',
        'One arm starts at the lightest parcel, the other at the heaviest. Use the ordering to prove which arm can safely move.',
        'pointers',
      ),
      q(
        'code',
        'First Implementation',
        'Alex',
        'desk',
        'Write findPairSorted. Return indices in this sorted manifest; never use one parcel twice.',
        'code',
        'sorted',
      ),
      q(
        'memory',
        'Memory Limit',
        'Max',
        'max',
        'The scanner has very little memory. A growing HashMap is unnecessary because our conveyor already gives us order. Compare the tradeoffs.',
        'memory',
      ),
      q(
        'qa',
        'The Duplicate Crates',
        'Maya',
        'maya',
        'Twins are separate parcels. One parcel is not a pair. Predict the edge cases, then submit two additional tests.',
        'qa',
        'sorted',
      ),
      q(
        'review',
        'Code Review',
        'Alex',
        'alex',
        'Explain which candidates a pointer move eliminates and why sorting is essential.',
        'review',
      ),
      q(
        'interview',
        'The Secret Password',
        'Eva',
        'eva',
        'Transfer the idea to text. A password is palindromic after ignoring punctuation and case. Clarify the character contract and implement independently.',
        'interview',
        'palindrome',
      ),
    ],
  },
  {
    id: 'traffic',
    number: 3,
    title: 'The Midnight Traffic Spike',
    concept: 'Sliding Window',
    badge: 'Traffic Analyst',
    reward: 'Animated traffic monitor',
    room: 'Server Monitoring Room',
    bossXP: 350,
    missions: [
      q(
        'pager',
        'Pager Alert',
        'Theo',
        'theo',
        'Midnight. BentoCart is slowing down. I’m Theo, Site Reliability Engineer. These counts represent consecutive minutes, not unrelated events. Read the spike before touching the monitor.',
        'traffic',
      ),
      q(
        'five',
        'The Five-Minute Mystery',
        'Theo',
        'theo',
        'Find the busiest consecutive window. Overlapping intervals share most of their values; can we reuse that work?',
        'fixed',
      ),
      q(
        'window',
        'The Moving Window',
        'Alex',
        'board',
        'Move one minute: subtract the count that leaves, add the count that enters. Keep a running maximum.',
        'window',
      ),
      q(
        'code',
        'Fix the Monitor',
        'Theo',
        'desk',
        'Implement maxRequests in one pass. The contract guarantees a valid nonempty window size.',
        'code',
        'traffic',
      ),
      q(
        'session',
        'The Session Problem',
        'Theo',
        'theo',
        'Now the length is variable. Keep extending the session until a repeated event breaks uniqueness; shrink until the condition is true again.',
        'variable',
      ),
      q(
        'qa',
        'The Duplicate Event',
        'Maya',
        'maya',
        'Test k=1, k equal to the input length, zero traffic, and repeats that force more than one shrink.',
        'qa',
        'traffic',
      ),
      q(
        'interview',
        'The Session Tracker',
        'Eva',
        'eva',
        'Find the longest contiguous stretch of unique event characters. Choose your own window invariant and implement it.',
        'interview',
        'unique',
      ),
    ],
  },
  {
    id: 'stack',
    number: 4,
    title: 'The Broken Undo Button',
    concept: 'Stacks · LIFO · Deque',
    badge: 'Undo Wizard',
    reward: 'Retro terminal',
    room: 'Design Editor',
    bossXP: 350,
    missions: [
      q(
        'disaster',
        'UI Disaster',
        'Lia',
        'lia',
        'I’m Lia, Frontend Developer. I deleted a button, then text, then an image. Undo restored the button first and ruined the demo. Which deletion should be undone first?',
        'lifo',
      ),
      q(
        'tower',
        'Stack of Actions',
        'Alex',
        'board',
        'Only the top is accessible. Push adds, pop removes, peek observes. Try the tower and watch the last action leave first.',
        'stack',
      ),
      q(
        'push',
        'Push & Pop',
        'Alex',
        'alex',
        'Trace a sequence before running code. Guard empty stacks so a harmless extra Undo cannot crash the editor.',
        'pushpop',
      ),
      q(
        'code',
        'Fix Undo',
        'Lia',
        'desk',
        'Implement undoHistory with Deque<String> and ArrayDeque. Undo at most the available number of actions.',
        'code',
        'undo',
      ),
      q(
        'redo',
        'Redo Is Broken Too',
        'Lia',
        'lia',
        'Undo moves an action to redo. Redo moves it back. A new action clears the old redo path. Implement both histories.',
        'code',
        'redo',
      ),
      q(
        'qa',
        'Maya’s Chaos Test',
        'Maya',
        'maya',
        'Try repeated undo, redo on an empty history, and a new action after undo. Predict then execute your own command sequences.',
        'qa',
        'redo',
      ),
      q(
        'interview',
        'The Corrupted Configuration',
        'Eva',
        'eva',
        'Check (), [] and {} nesting in a configuration string. Ignore other characters. Explain why the most recent opening matters first.',
        'interview',
        'brackets',
      ),
    ],
  },
  {
    id: 'binary',
    number: 5,
    title: 'The Cursed Release',
    concept: 'Binary Search',
    badge: 'Binary Search Specialist',
    reward: 'Release beacon',
    room: 'Release Control Room',
    bossXP: 350,
    missions: [
      q(
        'failed',
        'Failed Deployment',
        'Theo',
        'theo',
        'In this controlled release experiment, every version after the first failure also fails. We need the boundary without testing all 1,024 versions.',
        'monotone',
      ),
      q(
        'guess',
        'The Guessing Game',
        'Alex',
        'board',
        'Test the middle. A good version removes everything earlier; a failing version keeps a possible earlier failure alive.',
        'binary',
      ),
      q(
        'timeline',
        'Release Timeline',
        'Theo',
        'theo',
        'Follow false...true on a timeline. The first true is the answer; if no version fails return -1.',
        'boundary',
      ),
      q(
        'code',
        'First Binary Search',
        'Theo',
        'desk',
        'Write firstFailingBuild. Use a midpoint calculation that avoids adding two large bounds.',
        'code',
        'failing',
      ),
      q(
        'offby',
        'Off-by-One Bug',
        'Maya',
        'maya',
        'A two-element interval exposes loops that never shrink or skip the answer. Trace the boundaries.',
        'offby',
      ),
      q(
        'qa',
        'No Bad Releases',
        'Theo',
        'theo',
        'Check empty input, all passing, all failing, first failure at each edge, and a single version.',
        'qa',
        'failing',
      ),
      q(
        'interview',
        'Find the Insertion Point',
        'Eva',
        'eva',
        'Return the index of target or the position that keeps distinct numbers sorted. The insertion point can be after the last element.',
        'interview',
        'insert',
      ),
    ],
  },
  {
    id: 'lists',
    number: 6,
    title: 'The Delivery Chain',
    concept: 'Linked Lists · Fast/Slow Pointers',
    badge: 'Linked List Navigator',
    reward: 'Roaming delivery robot',
    room: 'Delivery Workshop',
    bossXP: 350,
    missions: [
      q(
        'route',
        'Route Gone Wrong',
        'Max',
        'max',
        'Each delivery stop knows only its next stop. We cannot jump to an array index. Follow the chain before changing it.',
        'chain',
      ),
      q(
        'next',
        'Follow the Next Pointer',
        'Alex',
        'board',
        'A node holds a value and a reference. Equal values do not mean two references identify the same node.',
        'links',
      ),
      q(
        'reverse',
        'Reverse the Route',
        'Max',
        'max',
        'Save the next link before redirecting it toward the previous stop. Otherwise the remainder of the route is lost.',
        'reverse',
      ),
      q(
        'code',
        'Java Implementation',
        'Alex',
        'desk',
        'Reverse the existing nodes iteratively with constant extra space. No replacement list.',
        'code',
        'reverse',
      ),
      q(
        'qa',
        'The Missing Node',
        'Maya',
        'maya',
        'Null, one node and repeated values deserve their own tests. The returned route must contain the original nodes exactly once.',
        'qa',
        'reverse',
      ),
      q(
        'cycle',
        'The Infinite Route',
        'Max',
        'max',
        'A driver keeps revisiting stops. Move one pointer one step and another two steps. Watch references, not values.',
        'cycle',
      ),
      q(
        'interview',
        'The Endless Delivery Route',
        'Eva',
        'eva',
        'Detect a cycle without modifying the route or storing all visited nodes. Explain why the two pointers eventually meet.',
        'interview',
        'cycle',
      ),
    ],
  },
  {
    id: 'recursion',
    number: 7,
    title: 'The Endless Folder',
    concept: 'Recursion · Call Stack · Trees',
    badge: 'Recursion Explorer',
    reward: 'Pixel library',
    room: 'Archive Room',
    bossXP: 350,
    missions: [
      q(
        'archive',
        'Archive Emergency',
        'Iris',
        'iris',
        'I’m Iris, Backend Engineer. A client has folders inside folders at unknown depths. Count files in every branch; there are no cycles.',
        'tree',
      ),
      q(
        'inside',
        'The Folder Inside a Folder',
        'Alex',
        'alex',
        'Every child folder is a smaller instance of the same problem. Direct files plus all child results give the parent total.',
        'subproblem',
      ),
      q(
        'robot',
        'The Recursive Robot',
        'Iris',
        'board',
        'Choose the stopping case and the recursive step. An empty folder and a missing folder must both finish.',
        'base',
      ),
      q(
        'code',
        'Count Every File',
        'Iris',
        'desk',
        'Use the Folder model to count direct and nested files. Arrays in valid folders are never null.',
        'code',
        'files',
      ),
      q(
        'calls',
        'Call Stack Lab',
        'Alex',
        'board',
        'Enter a folder, suspend the parent, solve its child, return the child result, and resume. Trace the stack and returned totals.',
        'calls',
      ),
      q(
        'qa',
        'Stack Overflow',
        'Maya',
        'maya',
        'Very deep input can exhaust the JVM call stack. Test normal trees and explain when an explicit work stack is safer.',
        'qa',
        'files',
      ),
      q(
        'interview',
        'Deepest Directory',
        'Eva',
        'eva',
        'Find binary-tree maximum depth. Empty tree is 0, one node is 1. Explain O(n) time and O(h) stack space.',
        'interview',
        'depth',
      ),
    ],
  },
  {
    id: 'sql2',
    number: 8,
    title: 'The Missing Customer',
    concept: 'SQL JOINs · LEFT JOIN · NULL',
    badge: 'SQL Detective Level 2',
    reward: 'Investigation board',
    room: 'Secret Investigation',
    bossXP: 350,
    independentTrack: true,
    missions: [
      q(
        'missing',
        'Missing Customers',
        'Nora',
        'nora',
        'Support says new accounts vanished from the dashboard. Iris found them in the database. Investigate the query before blaming the data.',
        'investigate',
      ),
      q(
        'database',
        'Database Access',
        'Iris',
        'iris',
        'customers.id identifies a customer; orders.customer_id refers to it. Explore our local database with real SQLite.',
        'schema',
      ),
      q(
        'select',
        'Detective SELECT',
        'Iris',
        'sql',
        'Return all customer IDs and names, ordered by ID. Read the schema and execute your own query.',
        'code',
        'customers',
      ),
      q(
        'relation',
        'The Relationship',
        'Iris',
        'board',
        'A customer can have several orders or none. Match the keys and count the resulting rows.',
        'relation',
      ),
      q(
        'inner',
        'INNER JOIN Trap',
        'Iris',
        'iris',
        'INNER JOIN retains matches only. Watch Sara and David disappear because they have not ordered.',
        'join',
      ),
      q(
        'left',
        'LEFT JOIN Investigation',
        'Alex',
        'sql',
        'Keep every customer, and represent unmatched orders with NULL. Multiple orders still produce multiple rows.',
        'code',
        'leftjoin',
      ),
      q(
        'dashboard',
        'Fix the Dashboard',
        'Maya',
        'sql',
        'Find customers with no orders. Test on a second dataset so memorized customer IDs will not pass.',
        'qa',
        'missing',
      ),
      q(
        'interview',
        'Unpaid Orders',
        'Eva',
        'eva',
        'A new schema includes payments. Find every unpaid order with its customer name, even when customers have several orders.',
        'interview',
        'unpaid',
      ),
    ],
  },
  {
    id: 'oop',
    number: 9,
    title: 'The Legacy Code Disaster',
    concept: 'Interfaces · Polymorphism · SOLID',
    badge: 'Clean Code Architect',
    reward: 'Workstation upgrade',
    room: 'Architecture Room',
    bossXP: 350,
    independentTrack: true,
    missions: [
      q(
        'payment',
        'Payment Disaster',
        'Nora',
        'nora',
        'BentoCart needs another payment method, but every new if branch risks breaking existing payments. Read the design before extending it.',
        'legacy',
      ),
      q(
        'giant',
        'The Giant If Statement',
        'Victor',
        'victor',
        'I’m Victor, Software Architect. The processor mixes choosing a method, implementing it, and formatting its result. Identify the responsibilities.',
        'responsibility',
      ),
      q(
        'objects',
        'Object Workshop',
        'Alex',
        'board',
        'An object combines state and behavior. Different payment objects can fulfill the same role while owning their own behavior.',
        'objects',
      ),
      q(
        'interface',
        'Interface Contract',
        'Victor',
        'victor',
        'A common pay contract lets callers depend on what a method does, rather than which concrete class provides it.',
        'interface',
      ),
      q(
        'poly',
        'Polymorphism Lab',
        'Victor',
        'board',
        'Run card and bank objects through the same caller. The implementation chosen belongs to the object.',
        'polymorphism',
      ),
      q(
        'refactor',
        'Refactor the Processor',
        'Alex',
        'desk',
        'Implement the interface, two strategies and a delegating processor. Amounts use integer cents.',
        'code',
        'payment',
      ),
      q(
        'new',
        'The New Payment Method',
        'Nora',
        'desk',
        'Add GiftCardPayment. Keep the central processor open to an implementation it has never seen.',
        'code',
        'gift',
      ),
      q(
        'qa',
        'Regression Testing',
        'Maya',
        'maya',
        'Check all original strategies and an unseen test strategy. Submit two amounts of your own before delivery.',
        'qa',
        'gift',
      ),
      q(
        'interview',
        'Architecture Interview',
        'Victor & Eva',
        'eva',
        'Design an extensible Email, SMS and Push notification system. Prove an unseen channel works through the same service.',
        'interview',
        'notification',
      ),
    ],
  },
];
for (const e of EPISODES) e.missions[e.missions.length - 1].xp = e.bossXP;
/** @type {Record<string,Array<[string,string[],number]>>} */
export const REVIEW = {
  warehouse: [
    [
      'Why may the left pointer advance when the sum is too small?',
      [
        'Even the largest remaining partner is too light for this left value.',
        'Small values are never useful.',
        'It skips all duplicates.',
      ],
      0,
    ],
    [
      'When does this pair algorithm require a different approach?',
      [
        'On unsorted input with original indices required.',
        'When two values are equal.',
        'When no pair exists.',
      ],
      0,
    ],
    [
      'Time and extra space?',
      ['O(n) time; O(1) extra space.', 'O(log n) time; O(n) space.', 'O(n²) time; O(1) space.'],
      0,
    ],
  ],
  traffic: [
    [
      'What changes when a fixed window moves?',
      [
        'Subtract the outgoing value, add the incoming value.',
        'Recompute every element.',
        'Sort the window.',
      ],
      0,
    ],
    [
      'What restores a unique variable window?',
      [
        'Shrink from the left until the duplicate is removed.',
        'Reset to the start of the input.',
        'Ignore the repeated character.',
      ],
      0,
    ],
    [
      'Why is two moving boundaries linear?',
      [
        'Each boundary advances at most n times.',
        'There is only one variable.',
        'A HashMap always guarantees constant time.',
      ],
      0,
    ],
  ],
  stack: [
    [
      'What does LIFO mean?',
      ['Last added, first removed.', 'First added, first removed.', 'Remove a random element.'],
      0,
    ],
    [
      'Why clear redo after a new action?',
      [
        'The old future no longer follows the current edit history.',
        'It makes undo impossible.',
        'Stacks cannot store strings.',
      ],
      0,
    ],
    [
      'Bracket checker worst-case cost?',
      [
        'O(n) time and O(n) space for unmatched openings.',
        'O(log n) time and O(1) space.',
        'O(n²) time.',
      ],
      0,
    ],
  ],
  binary: [
    [
      'What property enables boundary search?',
      [
        'All false values precede all true values.',
        'The array has even length.',
        'Every build has a different label.',
      ],
      0,
    ],
    [
      'How do you avoid midpoint overflow?',
      ['left + (right-left)/2', '(left+right)*2', 'left + right/2'],
      0,
    ],
    [
      'Worst-case checks for 1,024 builds?',
      ['Up to 11 checks.', 'Exactly 1,024.', 'Always one check.'],
      0,
    ],
  ],
  lists: [
    [
      'Before changing current.next, what must be saved?',
      ['The original next reference.', 'Only its integer value.', 'The head value.'],
      0,
    ],
    [
      'What proves two walkers have met?',
      [
        'Their references are identical.',
        'Their values are equal.',
        'They have the same next value.',
      ],
      0,
    ],
    [
      'Cycle detection extra space?',
      ['O(1) with fast and slow references.', 'O(n) always.', 'O(log n).'],
      0,
    ],
  ],
  recursion: [
    [
      'Why must recursion stop?',
      [
        'A base case handles the smallest problem.',
        'The compiler stops it automatically.',
        'Every folder has the same depth.',
      ],
      0,
    ],
    [
      'Recursive tree traversal space?',
      ['O(h) live call frames, where h is height.', 'Always O(1).', 'O(n²).'],
      0,
    ],
    [
      'For extreme depth, what is safer?',
      [
        'An explicit work stack with iteration.',
        'Removing the base case.',
        'Visiting every node twice recursively.',
      ],
      0,
    ],
  ],
  sql2: [
    [
      'Which join preserves customers without orders?',
      ['customers LEFT JOIN orders', 'customers INNER JOIN orders', 'orders INNER JOIN payments'],
      0,
    ],
    [
      'How do you test an unmatched order ID?',
      ['order_id IS NULL', 'order_id = NULL', 'order_id = 0'],
      0,
    ],
    [
      'One customer with two orders produces?',
      ['Two matching rows.', 'Always one row.', 'No rows.'],
      0,
    ],
  ],
  oop: [
    [
      'Which dependency supports extension?',
      [
        'The processor depends on PaymentMethod.',
        'The processor knows every concrete class.',
        'A new if branch for every method.',
      ],
      0,
    ],
    [
      'Single Responsibility means?',
      [
        'Keep payment behavior separate from orchestration.',
        'Put every operation in a class named Manager.',
        'Every class must have one field.',
      ],
      0,
    ],
    [
      'How do you test Open/Closed behavior?',
      [
        'Pass an unseen implementation through the unchanged caller.',
        'Count the number of classes.',
        'Search comments for SOLID.',
      ],
      0,
    ],
  ],
};
/** @type {Record<string,Array<[string,string]>>} */
export const QA = {
  warehouse: [
    ['[5,5], target 10', 'pair'],
    ['[5], target 10', 'none'],
    ['[], target 0', 'none'],
    ['[0,0], target 0', 'pair'],
  ],
  traffic: [
    ['[3,8,4], k=1', '8'],
    ['[3,8,4], k=3', '15'],
    ['[0,0], k=2', '0'],
  ],
  stack: [
    ['ADD:A, ADD:B, UNDO', 'A'],
    ['ADD:A, UNDO, ADD:C, REDO', 'C'],
    ['UNDO, REDO', 'EMPTY'],
  ],
  binary: [
    ['[]', '-1'],
    ['[false,false]', '-1'],
    ['[true,true]', '0'],
    ['[false,true]', '1'],
  ],
  lists: [
    ['Reverse null', 'null'],
    ['Reverse 7', '7'],
    ['Reverse 1 → 1 → 2', '2 → 1 → 1'],
  ],
  recursion: [
    ['Null root file count', '0'],
    ['Empty folder file count', '0'],
    ['Root has 2 files, child has 3', '5'],
  ],
  sql2: [
    ['Customer has no orders in LEFT JOIN', 'NULL order_id'],
    ['Customer has 2 orders', '2 rows'],
    ['Compare NULL with = NULL', 'not true'],
  ],
  oop: [
    ['CardPayment with 125 cents', 'CARD:125'],
    ['GiftCardPayment with 0 cents', 'GIFT:0'],
    ['Unseen strategy through delegating processor', 'works'],
  ],
};
/** @type {Record<string,[string,string,string|null,string]>} */
export const RETENTION = {
  checkout: [
    'repeated',
    'HashMap retention',
    'public static int firstRepeated(int[] values)',
    'Return the first value encountered a second time in left-to-right order, or -1 when none repeats. Values are nonnegative. Expected O(n) time.',
  ],
  warehouse: [
    'gap',
    'Two Pointers retention',
    'public static int[] findGap(int[] numbers, int gap)',
    'Sorted distinct integers, gap >= 0. Return two different indices whose larger value minus smaller value equals gap, or an empty array. O(n) time and O(1) extra space.',
  ],
  traffic: [
    'minwindow',
    'Sliding Window retention',
    'public static int minWindowSum(int[] values, int k)',
    'Return the minimum sum of k consecutive nonnegative values. 1 <= k <= length. O(n) time and O(1) extra space.',
  ],
  stack: [
    'collapse',
    'Stack retention',
    'public static String collapse(String text)',
    'Repeatedly remove adjacent equal character pairs until none remain. ASCII input. Example abbaca becomes ca. O(n) time and O(n) space.',
  ],
  binary: [
    'last',
    'Binary Search retention',
    'public static int lastAtMost(int[] values, int target)',
    'Sorted distinct integers. Return the last index whose value is <= target, or -1. O(log n) time and O(1) space.',
  ],
  lists: [
    'middle',
    'Linked List retention',
    'public static ListNode middleNode(ListNode head)',
    'Acyclic list, possibly null. Return the middle node reference, choosing the second middle for even length. Leave links unchanged. O(n) time, O(1) space.',
  ],
  recursion: [
    'leaves',
    'Trees retention',
    'public static int countLeaves(TreeNode root)',
    'Return the number of nodes with no children. Empty tree returns 0. O(n) time, O(h) call stack.',
  ],
  sql2: [
    'unpaidcustomers',
    'SQL retention',
    null,
    'Return id and customer_name for customers having at least one unpaid order, once per customer. Paid and unpaid orders may belong to the same customer.',
  ],
  oop: [
    'shipping',
    'Architecture retention',
    null,
    'Define interface ShippingStrategy { int cost(int grams); }, static StandardShipping (cost = grams + 100), ExpressShipping (cost = grams + 500), and ShippingService with int quote(ShippingStrategy strategy,int grams) delegating to the strategy. An unseen strategy must work too.',
  ],
};
for (const [key, [id, title, signature, contract]] of Object.entries(RETENTION))
  TASKS[id] = {
    title,
    signature,
    contract,
    sql: key === 'sql2',
    oop: key === 'oop',
    starter:
      key === 'sql2'
        ? 'SELECT * FROM customers;'
        : key === 'oop'
          ? 'public interface ShippingStrategy { int cost(int grams); }\npublic static class StandardShipping implements ShippingStrategy {\n    public int cost(int grams) { return 0; }\n}\npublic static class ExpressShipping implements ShippingStrategy {\n    public int cost(int grams) { return 0; }\n}\npublic static class ShippingService {\n    public int quote(ShippingStrategy strategy, int grams) { return 0; }\n}'
          : id === 'gap'
            ? 'return new int[0];'
            : id === 'collapse'
              ? 'return "";'
              : id === 'middle'
                ? 'return null;'
                : 'return 0;',
    hints: [],
  };
/** @type {Array<[string,string[],number]>} */
export const MIXED = [
  [
    'Sorted parcel weights, exact pair, constant memory. Which pattern fits?',
    ['Two Pointers', 'HashMap', 'Stack'],
    0,
  ],
  [
    'Consecutive minutes, busiest fixed interval. Which pattern fits?',
    ['Sliding Window', 'Binary Search', 'Linked List'],
    0,
  ],
  [
    'A monotone sequence of good then bad builds. Which pattern fits?',
    ['Binary Search', 'Stack', 'Sliding Window'],
    0,
  ],
];
/** @type {Record<string,Array<[string,string[],number]>>} */
export const BOSS_REVIEW = {
  warehouse: [
    [
      'What is the palindrome invariant?',
      [
        'All valid character pairs outside the pointers already match.',
        'The text must be sorted.',
        'Every character appears once.',
      ],
      0,
    ],
    [
      'Why may punctuation be skipped?',
      [
        'The contract excludes it from comparison.',
        'It always matches a letter.',
        'It sorts before digits.',
      ],
      0,
    ],
    [
      'Time and extra space?',
      [
        'O(n) time, O(1) extra space using in-place character reads.',
        'O(log n) time.',
        'O(n²) time, O(n) space.',
      ],
      0,
    ],
  ],
  traffic: [
    [
      'What must remain true inside the session window?',
      ['No character repeats.', 'Characters are sorted.', 'The window always has length k.'],
      0,
    ],
    [
      'Why may shrinking require multiple moves?',
      [
        'The earlier duplicate can lie beyond the current left edge.',
        'Only two characters are allowed.',
        'The array must be reversed.',
      ],
      0,
    ],
    [
      'Expected time and space?',
      [
        'O(n) time; O(min(n,A)) space for alphabet size A.',
        'O(n²) time and O(1) space.',
        'O(log n) time.',
      ],
      0,
    ],
  ],
  stack: [
    [
      'Which opening should match the current closing bracket?',
      [
        'The most recent unmatched opening.',
        'The first opening in the file.',
        'Any opening with the same count.',
      ],
      0,
    ],
    [
      'What makes input invalid immediately?',
      ['A closing bracket with no matching stack top.', 'An ordinary letter.', 'An empty input.'],
      0,
    ],
    [
      'Worst-case time and space?',
      ['O(n) time and O(n) stack space.', 'O(log n) time.', 'O(1) time and space.'],
      0,
    ],
  ],
  binary: [
    [
      'What boundary are you looking for?',
      [
        'The first index whose value is at least target.',
        'The largest value in every case.',
        'The median index.',
      ],
      0,
    ],
    [
      'Why can the result equal the input length?',
      [
        'The target belongs after every existing value.',
        'Indexing begins at one.',
        'The array is unsorted.',
      ],
      0,
    ],
    [
      'Time, space and midpoint?',
      ['O(log n), O(1); left+(right-left)/2.', 'O(n), O(n); sort every iteration.', 'O(n²), O(1).'],
      0,
    ],
  ],
  lists: [
    [
      'How do fast and slow detect a cycle?',
      [
        'Different speeds eventually meet on the same node reference.',
        'Equal values prove a cycle.',
        'They sort the linked list.',
      ],
      0,
    ],
    [
      'What protects fast.next.next?',
      [
        'Check fast and fast.next for null before advancing.',
        'Assume two nodes exist.',
        'Allocate a replacement node.',
      ],
      0,
    ],
    [
      'Time and extra space?',
      [
        'O(n) time, O(1) extra space with unchanged links.',
        'O(n²) time.',
        'O(log n) time, O(n) space.',
      ],
      0,
    ],
  ],
  recursion: [
    [
      'How do subtree results combine?',
      [
        'One plus the larger child depth.',
        'Add the two child depths without the current node.',
        'Count only left children.',
      ],
      0,
    ],
    ['What does null contribute?', ['Depth zero.', 'Depth one.', 'An infinite recursive call.'], 0],
    [
      'Time and call stack space?',
      [
        'O(n) time, O(h) stack for tree height h.',
        'Always O(1) space.',
        'O(log n) time for every tree.',
      ],
      0,
    ],
  ],
  sql2: [
    [
      'What is the unit of the requested output?',
      [
        'An unpaid order and its customer name.',
        'One row per customer regardless of orders.',
        'Only customers without any orders.',
      ],
      0,
    ],
    [
      'Which join/filter finds absent payments?',
      [
        'LEFT JOIN payments, then payment ID IS NULL.',
        'INNER JOIN payments.',
        'payment ID = NULL.',
      ],
      0,
    ],
    [
      'How do multiple payments affect unpaid orders?',
      [
        'Paid orders remain excluded; every unpaid order remains present.',
        'All customers must be deduplicated, losing order IDs.',
        'Zero-amount payments should be ignored automatically.',
      ],
      0,
    ],
  ],
  oop: [
    [
      'What contract should the notification service depend on?',
      [
        'NotificationChannel.',
        'Every concrete channel class.',
        'A string switch for every channel.',
      ],
      0,
    ],
    [
      'Where does channel-specific behavior belong?',
      [
        'Inside the channel implementation.',
        'Inside an ever-growing central conditional.',
        'Inside the caller’s test inputs.',
      ],
      0,
    ],
    [
      'What demonstrates extensibility?',
      [
        'An unseen channel works through the unchanged service.',
        'The service knows three fixed channel names.',
        'All code is in one class.',
      ],
      0,
    ],
  ],
};
