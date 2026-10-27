// Assessment fixtures only; never imported into the game bundle or hints.
export const solutions = {
  sorted:
    'public static int[] findPairSorted(int[] a,int t){int l=0;int r=a.length-1;while(l<r){int s=a[l]+a[r];if(s==t)return new int[]{l,r};if(s<t)l++;else r--;}return new int[0];}',
  palindrome:
    'public static boolean isPalindrome(String s){int l=0,r=s.length();while(l<r){int a=s.codePointAt(l),b=s.codePointBefore(r);if(!Character.isLetterOrDigit(a)){l+=Character.charCount(a);}else if(!Character.isLetterOrDigit(b)){r-=Character.charCount(b);}else{if(Character.toLowerCase(a)!=Character.toLowerCase(b))return false;l+=Character.charCount(a);r-=Character.charCount(b);}}return true;}',
  traffic:
    'public static int maxRequests(int[] a,int k){int sum=0;for(int i=0;i<k;i++){sum+=a[i];}int best=sum;for(int i=k;i<a.length;i++){sum+=a[i]-a[i-k];best=Math.max(best,sum);}return best;}',
  unique:
    'public static int longestUniqueSession(String s){HashSet<Character> seen=new HashSet<>();int l=0,best=0;for(int r=0;r<s.length();r++){while(seen.contains(s.charAt(r))){seen.remove(s.charAt(l));l++;}seen.add(s.charAt(r));best=Math.max(best,r-l+1);}return best;}',
  undo: 'public static String undoHistory(String[] a,int n){Deque<String>s=new ArrayDeque<>();for(String x:a){s.push(x);}while(n>0&&!s.isEmpty()){s.pop();n--;}return s.isEmpty()?"EMPTY":s.peek();}',
  redo: 'public static String replay(String[] a){Deque<String>u=new ArrayDeque<>(),r=new ArrayDeque<>();for(String s:a){if(s.startsWith("ADD:")){u.push(s.substring(4));r.clear();}else if(s.equals("UNDO")&&!u.isEmpty()){r.push(u.pop());}else if(s.equals("REDO")&&!r.isEmpty()){u.push(r.pop());}}return u.isEmpty()?"EMPTY":u.peek();}',
  brackets:
    "public static boolean isValidBrackets(String s){Deque<Character> stack=new ArrayDeque<>();for(int i=0;i<s.length();i++){char c=s.charAt(i);if(c=='('||c=='['||c=='{'){stack.push(c);}else if(c==')'||c==']'||c=='}'){if(stack.isEmpty())return false;char a=stack.pop();if(c==')'&&a!='('||c==']'&&a!='['||c=='}'&&a!='{')return false;}}return stack.isEmpty();}",
  failing:
    'public static int firstFailingBuild(boolean[] a){int l=0,r=a.length;while(l<r){int m=l+(r-l)/2;if(a[m])r=m;else l=m+1;}return l==a.length?-1:l;}',
  insert:
    'public static int searchInsert(int[] a,int t){int l=0,r=a.length;while(l<r){int m=l+(r-l)/2;if(a[m]<t)l=m+1;else r=m;}return l;}',
  reverse:
    'public static ListNode reverseList(ListNode h){ListNode p=null;while(h!=null){ListNode n=h.next;h.next=p;p=h;h=n;}return p;}',
  cycle:
    'public static boolean hasCycle(ListNode h){ListNode s=h,f=h;while(f!=null&&f.next!=null){s=s.next;f=f.next.next;if(s==f)return true;}return false;}',
  files:
    'public static int countFiles(Folder f){if(f==null)return 0;int n=f.files.length;for(Folder c:f.children){n+=countFiles(c);}return n;}',
  depth:
    'public static int maxDepth(TreeNode r){if(r==null)return 0;return 1+Math.max(maxDepth(r.left),maxDepth(r.right));}',
  customers: 'SELECT id,name FROM customers ORDER BY id',
  leftjoin:
    'SELECT c.name AS customer_name,o.id AS order_id FROM customers c LEFT JOIN orders o ON c.id=o.customer_id',
  missing:
    'SELECT c.id AS id,c.name AS customer_name FROM customers c LEFT JOIN orders o ON c.id=o.customer_id WHERE o.id IS NULL',
  unpaid:
    'SELECT o.id AS order_id,c.name AS customer_name FROM orders o JOIN customers c ON c.id=o.customer_id LEFT JOIN payments p ON p.order_id=o.id WHERE p.id IS NULL',
  payment:
    'public interface PaymentMethod{String pay(int c);} public static class CardPayment implements PaymentMethod{public String pay(int c){return "CARD:"+c;}} public static class BankPayment implements PaymentMethod{public String pay(int c){return "BANK:"+c;}} public static class PaymentProcessor{public String pay(PaymentMethod m,int c){return m.pay(c);}}',
  notification:
    'public interface NotificationChannel{String send(String m);}public static class EmailChannel implements NotificationChannel{public String send(String m){return "EMAIL:"+m;}}public static class SmsChannel implements NotificationChannel{public String send(String m){return "SMS:"+m;}}public static class PushChannel implements NotificationChannel{public String send(String m){return "PUSH:"+m;}}public static class NotificationService{public String notify(NotificationChannel c,String m){return c.send(m);}}',
  repeated:
    'public static int firstRepeated(int[] a){HashSet<Integer>s=new HashSet<>();for(int v:a){if(!s.add(v))return v;}return -1;}',
  gap: 'public static int[] findGap(int[] a,int t){int l=0,r=1;while(r<a.length){if(l==r){r++;}else if(a[r]-a[l]==t){return new int[]{l,r};}else if(a[r]-a[l]<t){r++;}else{l++;}}return new int[0];}',
  minwindow:
    'public static int minWindowSum(int[] a,int k){int sum=0;for(int i=0;i<k;i++){sum+=a[i];}int best=sum;for(int i=k;i<a.length;i++){sum+=a[i]-a[i-k];best=Math.min(best,sum);}return best;}',
  collapse:
    'public static String collapse(String s){StringBuilder b=new StringBuilder();for(int i=0;i<s.length();i++){char c=s.charAt(i);if(b.length()>0&&b.charAt(b.length()-1)==c)b.deleteCharAt(b.length()-1);else b.append(c);}return b.toString();}',
  last: 'public static int lastAtMost(int[] a,int t){int l=0,r=a.length;while(l<r){int m=l+(r-l)/2;if(a[m]<=t)l=m+1;else r=m;}return l-1;}',
  middle:
    'public static ListNode middleNode(ListNode h){ListNode s=h,f=h;while(f!=null&&f.next!=null){s=s.next;f=f.next.next;}return s;}',
  leaves:
    'public static int countLeaves(TreeNode r){if(r==null)return 0;if(r.left==null&&r.right==null)return 1;return countLeaves(r.left)+countLeaves(r.right);}',
  unpaidcustomers:
    'SELECT DISTINCT c.id AS id,c.name AS customer_name FROM customers c JOIN orders o ON o.customer_id=c.id LEFT JOIN payments p ON p.order_id=o.id WHERE p.id IS NULL',
  shipping:
    'public interface ShippingStrategy{int cost(int grams);}public static class StandardShipping implements ShippingStrategy{public int cost(int g){return g+100;}}public static class ExpressShipping implements ShippingStrategy{public int cost(int g){return g+500;}}public static class ShippingService{public int quote(ShippingStrategy s,int g){return s.cost(g);}}',
};
solutions.gift =
  solutions.payment +
  'public static class GiftCardPayment implements PaymentMethod{public String pay(int c){return "GIFT:"+c;}}';
