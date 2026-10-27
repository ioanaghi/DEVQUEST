const c = (name, check, input = '', expected = 'correct result') => ({
  name,
  check,
  input,
  expected,
});
const arr = (a) => `new int[]{${a.join(',')}}`;
const str = (s) => JSON.stringify(s);
export const MODELS = `
public static class ListNode { public int value; public ListNode next; public ListNode(int v) { value=v; } }
public static class TreeNode { public int value; public TreeNode left,right; public TreeNode(int v) {value=v;} }
public static class Folder { public String[] files; public Folder[] children; public Folder(String[] f,Folder[] c) {files=f;children=c;} }
`;
export const HELPERS = `
static int[] ints(int n) { int[] a=new int[n]; for(int i=0;i<n;i++)a[i]=i*2;return a; }
static boolean[] builds(int n) { boolean[] a=new boolean[n]; for(int i=n/2;i<n;i++)a[i]=true;return a; }
static boolean pair(int[] a,int t,int[] r,boolean difference) { if(r==null)return false; if(r.length==0){for(int i=0;i<a.length;i++)for(int j=i+1;j<a.length;j++)if((difference?a[j]-a[i]:a[i]+a[j])==t)return false;return true;}return r.length==2&&r[0]>=0&&r[0]<a.length&&r[1]>=0&&r[1]<a.length&&r[0]!=r[1]&&(difference?Math.abs(a[r[0]]-a[r[1]]):a[r[0]]+a[r[1]])==t; }
static Student.ListNode list(int n) { Student.ListNode h=null;for(int i=n-1;i>=0;i--){Student.ListNode x=new Student.ListNode(i%3);x.next=h;h=x;}return h; }
static boolean reverse(int n) { Student.ListNode h=list(n);Student.ListNode[] nodes=new Student.ListNode[n];for(int i=0;i<n;i++){nodes[i]=h;h=h.next;}Student.ListNode r=Student.reverseList(n==0?null:nodes[0]);for(int i=n-1;i>=0;i--){if(r!=nodes[i])return false;r=r.next;}return r==null; }
static boolean cycle(int n,int entry) { Student.ListNode h=list(n),r=h;Student.ListNode[] nodes=new Student.ListNode[n];for(int i=0;i<n;i++){nodes[i]=r;r=r.next;}if(n>0&&entry>=0)nodes[n-1].next=nodes[entry];Student.ListNode[] next=new Student.ListNode[n];for(int i=0;i<n;i++)next[i]=nodes[i].next;boolean result=Student.hasCycle(h);for(int i=0;i<n;i++)if(nodes[i].next!=next[i])return false;return result==(entry>=0&&n>0); }
static boolean middle(int n) {Student.ListNode h=list(n),m=h;for(int i=0;i<n/2;i++)m=m.next;Student.ListNode[] next=new Student.ListNode[n];Student.ListNode r=h;for(int i=0;i<n;i++){next[i]=r.next;r=r.next;}Student.ListNode result=Student.middleNode(h);r=h;for(int i=0;i<n;i++){if(r.next!=next[i])return false;r=r.next;}return result==m;}
static Student.Folder folder(int n) {Student.Folder r=null;for(int i=0;i<n;i++)r=new Student.Folder(new String[]{"a","b"},r==null?new Student.Folder[0]:new Student.Folder[]{r});return r;}
static Student.Folder branch(){return new Student.Folder(new String[]{"a"},new Student.Folder[]{folder(2),folder(3)});}
static Student.TreeNode tree(int n) {if(n<=0)return null;Student.TreeNode r=new Student.TreeNode(n);r.left=tree(n/2);r.right=tree((n-1)/2);return r;}
`;
export function taskCases(task, hidden = false) {
  const pair = (a, t, diff = false) =>
    c(
      `Manifest ${JSON.stringify(a)} / ${t}`,
      `pair(${arr(a)},${t},Student.${diff ? 'findGap' : 'findPairSorted'}(${arr(a)},${t}),${diff})`,
      JSON.stringify({ values: a, target: t }),
      'two valid distinct indices, or []',
    );
  const eq = (call, want, input) => c(input, `${call} == ${want}`, input, String(want));
  const text = (call, want, input) => c(input, `${str(want)}.equals(${call})`, input, want);
  switch (task) {
    case 'sorted':
      return (
        hidden
          ? [
              [[], 0],
              [[5], 10],
              [[0], 0],
              [[0, 0], 0],
              [[1, 2], 3],
              [[1, 2, 3, 4, 5, 6], 11],
              [[2, 2, 2, 2], 4],
              ...Array.from({ length: 12 }, (_, i) => [
                [0, i + 1, i + 3, i + 8, i + 20],
                i % 2 ? 2 * i + 28 : i + 4,
              ]),
            ]
          : [
              [[1, 3, 5, 6, 8, 11], 13],
              [[5, 5], 10],
              [[1, 3, 8], 20],
              [[0, 0, 6], 0],
            ]
      ).map(([a, t]) => pair(a, t));
    case 'gap':
      return (
        hidden
          ? [
              [[], 0],
              [[5], 0],
              [[1, 4, 9, 15], 11],
              [[0, 2, 7], 6],
            ]
          : [
              [[1, 3, 8, 11], 5],
              [[1, 2], 0],
              [[2, 7, 10], 8],
            ]
      ).map(([a, t]) => pair(a, t, true));
    case 'palindrome': {
      const cases = hidden
        ? [
            ['', true],
            ['!!!', true],
            ['0P', false],
            ['a', true],
            ['ab', false],
            ['.,A0a.,', true],
            ['Race a car', false],
            ['12321', true],
            ['ab@BA', true],
            ['Éxè', false],
            ['𝔄x𝔅', false],
            ['𝔄x𝔄', true],
            ['😀a😀', true],
            ['𝟙a𝟚', false],
          ]
        : [
            ['A man, a plan, a canal: Panama', true],
            ['race a car', false],
            ['No lemon, no melon', true],
            ['Éxé', true],
          ];
      return cases.map(([s, expected]) =>
        eq(`Student.isPalindrome(${str(s)})`, expected, s || '(empty)'),
      );
    }
    case 'traffic':
    case 'minwindow':
      return (
        hidden
          ? [
              [[0], 1],
              [[0, 0, 0], 2],
              [[9, 1, 1, 1], 1],
              [[9, 1, 1, 1], 4],
              [[1, 2, 10, 20], 2],
              [[20, 10, 2, 1], 2],
            ]
          : [
              [[3, 8, 4, 12, 6, 9, 2, 7], 3],
              [[3, 8, 4], 1],
              [[3, 8, 4], 3],
            ]
      ).map(([a, k]) => {
        const sums = a.slice(k - 1).map((_, i) => a.slice(i, i + k).reduce((n, v) => n + v, 0));
        return eq(
          `Student.${task === 'traffic' ? 'maxRequests' : 'minWindowSum'}(${arr(a)},${k})`,
          (task === 'traffic' ? Math.max : Math.min)(...sums),
          JSON.stringify({ values: a, k }),
        );
      });
    case 'unique':
      return (
        hidden
          ? ['', 'a', 'aaaa', 'abba', 'dvdf', 'pwwkew', 'aAbBcC', 'abacdefg']
          : ['abcaef', 'abcabcbb', 'bbbbb']
      ).map((s) => {
        let best = 0;
        for (let i = 0; i < s.length; i++)
          for (let j = i + 1; j <= s.length; j++)
            if (new Set(s.slice(i, j)).size === j - i) best = Math.max(best, j - i);
        return eq(`Student.longestUniqueSession(${str(s)})`, best, s || '(empty)');
      });
    case 'undo':
      return (
        hidden
          ? [
              [[], 3],
              [['a'], 0],
              [['a'], 5],
              [['a', 'b'], 1],
            ]
          : [
              [['button', 'text', 'image'], 1],
              [['button'], 1],
            ]
      ).map(([a, n]) =>
        text(
          `Student.undoHistory(new String[]{${a.map(str).join(',')}},${n})`,
          a[Math.max(0, a.length - n) - 1] ?? 'EMPTY',
          JSON.stringify({ actions: a, undos: n }),
        ),
      );
    case 'redo':
      return (
        hidden
          ? [
              ['UNDO', 'REDO'],
              ['ADD:A', 'UNDO', 'ADD:C', 'REDO'],
              ['ADD:A', 'ADD:B', 'UNDO', 'UNDO', 'REDO'],
              [],
            ]
          : [
              ['ADD:A', 'ADD:B', 'UNDO'],
              ['ADD:A', 'UNDO', 'REDO'],
            ]
      ).map((a) => {
        const u = [],
          r = [];
        for (const x of a) {
          if (x.startsWith('ADD:')) {
            u.push(x.slice(4));
            r.length = 0;
          } else if (x === 'UNDO' && u.length) r.push(u.pop());
          else if (x === 'REDO' && r.length) u.push(r.pop());
        }
        return text(
          `Student.replay(new String[]{${a.map(str).join(',')}})`,
          u.at(-1) ?? 'EMPTY',
          JSON.stringify(a),
        );
      });
    case 'brackets':
      return (
        hidden
          ? ['', ')', '(', '([)]', 'abc', '[x{y(z)}]', '{{}}[]', '(()']
          : ['{[()]}', '{[(])}', 'x[y]']
      ).map((s) => {
        const a = [];
        let ok = true;
        for (const x of s) {
          if ('([{'.includes(x)) a.push(x);
          else if (')]}'.includes(x) && a.pop() !== '([{'[')]}'.indexOf(x)]) ok = false;
        }
        return eq(`Student.isValidBrackets(${str(s)})`, ok && a.length === 0, s || '(empty)');
      });
    case 'failing':
      return (
        hidden
          ? [[], [false], [true], [false, false], [true, true], [false, true], [false, false, true]]
          : [
              [false, false, false, true, true, true],
              [false, false],
            ]
      ).map((a) =>
        eq(
          `Student.firstFailingBuild(new boolean[]{${a.join(',')}})`,
          a.indexOf(true),
          JSON.stringify(a),
        ),
      );
    case 'insert':
    case 'last':
      return (
        hidden
          ? [
              [[], 2],
              [[1], 0],
              [[1], 2],
              [[-9, -2, 0, 5], -2],
              [[1, 3, 5], 4],
              [[1, 3, 5], 6],
            ]
          : [
              [[1, 3, 5, 6], 5],
              [[1, 3, 5, 6], 2],
            ]
      ).map(([a, t]) =>
        eq(
          `Student.${task === 'insert' ? 'searchInsert' : 'lastAtMost'}(${arr(a)},${t})`,
          task === 'insert'
            ? a.findIndex((v) => v >= t) < 0
              ? a.length
              : a.findIndex((v) => v >= t)
            : a.reduce((n, v, i) => (v <= t ? i : n), -1),
          JSON.stringify({ values: a, target: t }),
        ),
      );
    case 'reverse':
      return (hidden ? [0, 1, 2, 7, 14] : [3, 4]).map((n) =>
        c(`${n} original nodes`, `reverse(${n})`, `${n} nodes`, 'same nodes in reverse order'),
      );
    case 'cycle':
      return (
        hidden
          ? [
              [0, -1],
              [1, -1],
              [1, 0],
              [5, 0],
              [8, 6],
              [9, -1],
            ]
          : [
              [4, 1],
              [4, -1],
            ]
      ).map(([n, i]) =>
        c(
          `${n} nodes, cycle entry ${i}`,
          `cycle(${n},${i})`,
          `${n} nodes, cycle entry ${i}`,
          String(i >= 0),
        ),
      );
    case 'middle':
      return (hidden ? [0, 1, 2, 8, 15] : [3, 4]).map((n) =>
        c(`${n} nodes`, `middle(${n})`, `${n} nodes`, 'original middle reference, unchanged links'),
      );
    case 'files':
      return (hidden ? [0, 1, 7, 30] : [2, 4])
        .map((n) =>
          eq(`Student.countFiles(folder(${n}))`, 2 * n, `${n} nested folders with two files each`),
        )
        .concat(
          hidden
            ? [
                eq('Student.countFiles(branch())', 11, 'branching folders'),
                eq(
                  'Student.countFiles(new Student.Folder(new String[0],new Student.Folder[0]))',
                  0,
                  'empty folder',
                ),
              ]
            : [],
        );
    case 'depth':
    case 'leaves':
      return (hidden ? [0, 1, 2, 6, 15, 31] : [3, 7]).map((n) =>
        eq(
          `Student.${task === 'depth' ? 'maxDepth' : 'countLeaves'}(tree(${n}))`,
          task === 'depth'
            ? n
              ? Math.floor(Math.log2(n)) + 1
              : 0
            : n
              ? Math.floor((n + 1) / 2)
              : 0,
          `${n} nodes in balanced tree`,
        ),
      );
    case 'collapse':
      return (
        hidden ? ['', 'a', 'abba', 'aaaa', 'abbaca', 'azxxzy', 'abcddcba'] : ['abbaca', 'abc']
      ).map((s) => {
        let a = [];
        for (const x of s) {
          if (a.at(-1) === x) a.pop();
          else a.push(x);
        }
        return text(`Student.collapse(${str(s)})`, a.join(''), s || '(empty)');
      });
    case 'repeated':
      return (
        hidden
          ? [[], [1], [2, 3, 3, 2], [0, 0], [1, 2, 3]]
          : [
              [4, 2, 4, 2],
              [1, 2, 3, 2],
            ]
      ).map((a) => {
        const seen = new Set();
        let r = -1;
        for (const x of a) {
          if (seen.has(x)) {
            r = x;
            break;
          }
          seen.add(x);
        }
        return eq(`Student.firstRepeated(${arr(a)})`, r, JSON.stringify(a));
      });
    case 'payment':
    case 'gift':
      return [
        c(
          'Card receipt',
          '"CARD:125".equals(new Student.PaymentProcessor().pay(new Student.CardPayment(),125))',
          '125 cents',
          'CARD:125',
        ),
        c(
          'Bank receipt',
          '"BANK:0".equals(new Student.PaymentProcessor().pay(new Student.BankPayment(),0))',
          '0 cents',
          'BANK:0',
        ),
        ...(task === 'gift'
          ? [
              c(
                'Gift receipt',
                '"GIFT:999".equals(new Student.PaymentProcessor().pay(new Student.GiftCardPayment(),999))',
                '999 cents',
                'GIFT:999',
              ),
            ]
          : []),
        ...(hidden
          ? [
              c(
                'Unseen strategy',
                '"TEST:301".equals(new Student.PaymentProcessor().pay(new Student.PaymentMethod(){public String pay(int c){return "TEST:"+c;}},301))',
              ),
            ]
          : []),
      ];
    case 'notification':
      return ['Email', 'Sms', 'Push']
        .map((x, i) =>
          c(
            `${x} channel`,
            `${str(['EMAIL', 'SMS', 'PUSH'][i] + ':hello')}.equals(new Student.NotificationService().notify(new Student.${x}Channel(),"hello"))`,
            'hello',
            `${['EMAIL', 'SMS', 'PUSH'][i]}:hello`,
          ),
        )
        .concat(
          hidden
            ? [
                c(
                  'Unseen channel',
                  '"CUSTOM:x".equals(new Student.NotificationService().notify(new Student.NotificationChannel(){public String send(String m){return "CUSTOM:"+m;}},"x"))',
                ),
              ]
            : [],
        );
    case 'shipping':
      return [
        eq(
          'new Student.ShippingService().quote(new Student.StandardShipping(),250)',
          350,
          'standard 250 grams',
        ),
        eq(
          'new Student.ShippingService().quote(new Student.ExpressShipping(),250)',
          750,
          'express 250 grams',
        ),
        ...(hidden
          ? [
              eq(
                'new Student.ShippingService().quote(new Student.ShippingStrategy(){public int cost(int g){return 42;}},250)',
                42,
                'unseen strategy',
              ),
            ]
          : []),
      ];
    default:
      throw new Error('Unknown Java exercise.');
  }
}
export function growthCases(task) {
  if (task === 'sorted' || task === 'gap')
    return [0, 1, 2].flatMap((workload) =>
      [64, 128, 256].map((n) => {
        const target =
          task === 'sorted'
            ? [1, 4 * n + 3, 4 * n - 6][workload]
            : [1, 2 * n + 3, 2 * n - 2][workload];
        const method = task === 'sorted' ? 'findPairSorted' : 'findGap';
        return c(
          `Growth workload ${workload + 1} / ${n}`,
          `pair(ints(${n}),${target},Student.${method}(ints(${n}),${target}),${task === 'gap'})`,
        );
      }),
    );
  const expressions = {
    sorted: (n) => `pair(ints(${n}),-1,Student.findPairSorted(ints(${n}),-1),false)`,
    gap: (n) => `pair(ints(${n}),1,Student.findGap(ints(${n}),1),true)`,
    palindrome: (n) => `Student.isPalindrome("a".repeat(${n}))`,
    traffic: (n) =>
      `Student.maxRequests(ints(${n}),${n / 2}) == ${Array.from({ length: n }, (_, i) => i * 2)
        .slice(n / 2)
        .reduce((a, b) => a + b, 0)}`,
    minwindow: (n) =>
      `Student.minWindowSum(ints(${n}),${n / 2}) == ${Array.from({ length: n / 2 }, (_, i) => i * 2).reduce((a, b) => a + b, 0)}`,
    unique: (n) => `Student.longestUniqueSession("abcde".repeat(${n})) == 5`,
    brackets: (n) => `Student.isValidBrackets("(".repeat(${n})+")".repeat(${n}))`,
    failing: (n) => `Student.firstFailingBuild(builds(${n})) == ${n / 2}`,
    insert: (n) => `Student.searchInsert(ints(${n}),${n * 2}) == ${n}`,
    last: (n) => `Student.lastAtMost(ints(${n}),${n * 2}) == ${n - 1}`,
    reverse: (n) => `reverse(${n})`,
    cycle: (n) => `cycle(${n},${n / 2})`,
    middle: (n) => `middle(${n})`,
    files: (n) => `Student.countFiles(folder(${n})) == ${n * 2}`,
    depth: (n) => `Student.maxDepth(tree(${n - 1})) == ${Math.log2(n)}`,
    leaves: (n) => `Student.countLeaves(tree(${n - 1})) == ${n / 2}`,
    collapse: (n) => `"".equals(Student.collapse("aa".repeat(${n})))`,
    repeated: (n) => `Student.firstRepeated(ints(${n})) == -1`,
  };
  return expressions[task] ? [64, 128, 256].map((n) => c(`Growth ${n}`, expressions[task](n))) : [];
}
export function customCases(task, custom) {
  if (!Array.isArray(custom) || custom.length > 2)
    throw new Error('Provide at most two custom tests.');
  return custom.map((x, i) => {
    let check;
    if (['sorted', 'gap'].includes(task)) {
      if (
        !x ||
        !Array.isArray(x.values) ||
        x.values.length > 32 ||
        !x.values.every(
          (v, i, a) => Number.isInteger(v) && Math.abs(v) < 1000000 && (!i || a[i - 1] <= v),
        ) ||
        !Number.isInteger(x.target) ||
        Math.abs(x.target) > 1000000 ||
        x.target < 0 ||
        (task === 'sorted' && x.values.some((v) => v < 0))
      )
        throw new Error(
          'Use {"values":[1,3,5],"target":6}, sorted integers, nonnegative weights/target.',
        );
      check = `pair(${arr(x.values)},${x.target},Student.${task === 'sorted' ? 'findPairSorted' : 'findGap'}(${arr(x.values)},${x.target}),${task === 'gap'})`;
    } else if (['traffic', 'minwindow'].includes(task)) {
      if (
        !x ||
        !Array.isArray(x.values) ||
        !x.values.length ||
        x.values.length > 32 ||
        !x.values.every((v) => Number.isInteger(v) && v >= 0 && v <= 1000000) ||
        !Number.isInteger(x.k) ||
        x.k < 1 ||
        x.k > x.values.length
      )
        throw new Error('Use {"values":[3,8,4],"k":2} with valid k and nonnegative integers.');
      const sums = x.values
        .slice(x.k - 1)
        .map((_, i) => x.values.slice(i, i + x.k).reduce((a, b) => a + b, 0));
      check = `Student.${task === 'traffic' ? 'maxRequests' : 'minWindowSum'}(${arr(x.values)},${x.k}) == ${(task === 'traffic' ? Math.max : Math.min)(...sums)}`;
    } else if (task === 'redo') {
      if (
        !Array.isArray(x) ||
        x.length > 32 ||
        !x.every(
          (v) =>
            typeof v === 'string' &&
            v.length <= 100 &&
            (/^(UNDO|REDO)$/.test(v) || v.startsWith('ADD:')),
        )
      )
        throw new Error('Use a JSON array of ADD:text, UNDO and REDO commands.');
      let u = [],
        r = [];
      for (const v of x) {
        if (v.startsWith('ADD:')) {
          u.push(v.slice(4));
          r = [];
        } else if (v === 'UNDO' && u.length) r.push(u.pop());
        else if (v === 'REDO' && r.length) u.push(r.pop());
      }
      check = `${str(u.at(-1) ?? 'EMPTY')}.equals(Student.replay(new String[]{${x.map(str).join(',')}}))`;
    } else if (task === 'failing') {
      if (
        !Array.isArray(x) ||
        x.length > 32 ||
        !x.every((v) => typeof v === 'boolean') ||
        x.some((v, i) => i && x[i - 1] && !v)
      )
        throw new Error('Use a monotone boolean JSON array such as [false,true,true].');
      check = `Student.firstFailingBuild(new boolean[]{${x.join(',')}}) == ${x.indexOf(true)}`;
    } else if (['reverse', 'files'].includes(task)) {
      if (!Number.isInteger(x) || x < 0 || x > 32)
        throw new Error('Use an integer from 0 to 32 (number of nodes or nested folders).');
      check = task === 'reverse' ? `reverse(${x})` : `Student.countFiles(folder(${x})) == ${2 * x}`;
    } else if (task === 'gift') {
      if (!Number.isInteger(x) || x < 0 || x > 1000000)
        throw new Error('Use an integer amount in cents, 0–1,000,000.');
      check = `"CARD:${x}".equals(new Student.PaymentProcessor().pay(new Student.CardPayment(),${x})) && "BANK:${x}".equals(new Student.PaymentProcessor().pay(new Student.BankPayment(),${x})) && "GIFT:${x}".equals(new Student.PaymentProcessor().pay(new Student.GiftCardPayment(),${x}))`;
    } else throw new Error('Custom tests are available at the QA checkpoint.');
    return c(`Your test ${i + 1}`, check, JSON.stringify(x), 'contract satisfied');
  });
}
