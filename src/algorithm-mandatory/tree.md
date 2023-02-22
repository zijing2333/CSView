### [144.二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)

> 给你二叉树的根节点 `root` ，返回它节点值的 **前序** 遍历。
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        while(root != null || !stack.isEmpty()) {
            while(root != null) {
                res.add(root.val);
                stack.addLast(root);
                root = root.left;
            }
            if(!stack.isEmpty()) {
                root = stack.removeLast();
                root = root.right;
            }
        }
        return res;
    }
}

```
@tab golang
```go
// 递归
func preorderTraversal(root *TreeNode) []int {
	res := []int{}
	var preOrder func(*TreeNode)
	preOrder = func(root *TreeNode) {
		if root == nil {
			return
		}
		res = append(res, root.Val)
		preOrder(root.Left)
		preOrder(root.Right)
	}
	preOrder(root)
	return res
}

// 迭代
func preorderTraversal(root *TreeNode) []int {
    var res []int
    if root == nil {
        return res
    }

    var stack []*TreeNode
    stack = append(stack, root)
    for len(stack) > 0 {
        size := len(stack)
        temp := stack[size - 1]
        if size <= 1 {
            stack = []*TreeNode{}
        } else {
            stack = stack[: size - 1]
        }

        res = append(res, temp.Val)
        

        if temp.Right != nil {
            stack = append(stack, temp.Right)
        }
        if temp.Left != nil {
            stack = append(stack, temp.Left)
        }

    }
    return res

}
```
:::

------



### [94.二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)

> 给定一个二叉树的根节点 `root` ，返回它的 **中序** 遍历 。
>
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        List<Integer> res = new ArrayList<>();
        while(!stack.isEmpty() || root != null){
            while(root != null){
                stack.add(root);
                root = root.left;
            }
            if(!stack.isEmpty()){
                root = stack.removeLast();
                res.add(root.val);
                root = root.right;
            }
        }
        return res;
    }
}
```
@tab golang
```go
// 递归
var res []int
func inorderTraversal( root *TreeNode ) []int {
    // write code here
    res = []int{}
    mid(root)
    return res
}
 
func mid(root *TreeNode){
    if root == nil{
        return
    }
    mid(root.Left)
    res = append(res, root.Val)
    mid(root.Right)
}
// 迭代
func inorderTraversal(root *TreeNode) []int {
	res := []int{}
	stack := []*TreeNode{}

	for root != nil {
		stack = append(stack, root)
		root = root.Left
	}
	for len(stack) != 0 {
		node := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		res = append(res, node.Val)
		node = node.Right
		for node != nil {
			stack = append(stack, node)
			node = node.Left
		}
	}
	return res
}
```
:::

------



### [226.翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

> 给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        List<Integer> res = new ArrayList<>();
        while(!stack.isEmpty() || root != null){
            while(root != null){
                stack.add(root);
                root = root.left;
            }
            if(!stack.isEmpty()){
                root = stack.removeLast();
                res.add(root.val);
                root = root.right;
            }
        }
        return res;
    }
}
```
@tab golang
```go
func invertTree(root *TreeNode) *TreeNode {
  if root ==nil {
  	return root
  }
  left := invertTree(root.Left)
  right := invertTree(root.Right)
  root.Left = right
  root.Right =left
  return root
}
```
:::
------



### [101.对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

> 给你一个二叉树的根节点`root`， 检查它是否轴对称。
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public boolean isSymmetric(TreeNode root) {
        if(root == null) return true;
        return isSymme(root.left, root.right);
    }

    public boolean isSymme(TreeNode left, TreeNode right){
        if(left == null && right == null) return true;
        if(left == null || right == null) return false;
        if(left.val == right.val){
            return isSymme(left.left, right.right) && isSymme(left.right, right.left);
        }
        return false;
    }
}

```
@tab golang
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func isSymmetric(root *TreeNode) bool {
	if root == nil {
		return true
	}
	return isInvertTree(root.Left, root.Right)
}
func isInvertTree(root *TreeNode, seroot *TreeNode) bool {
	if root == nil && seroot == nil {
		return true
	}
	if root == nil || seroot == nil {
		return false
	}
	if root.Val != seroot.Val {
		return false
	}
	return isInvertTree(root.Left, seroot.Right) && isInvertTree(root.Right, seroot.Left)
}
```
:::

------

### [110.平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/)

> 给定一个二叉树，判断它是否是高度平衡的二叉树。
>
> 本题中，一棵高度平衡二叉树定义为：
>
> 一个二叉树*每个节点* 的左右两个子树的高度差的绝对值不超过 1 。
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public boolean isBalanced(TreeNode root) {
        return recur(root) != -1;
    }

    private int recur(TreeNode root) {
        if(root == null) return 0;
        int left = recur(root.left);
        if(left == -1) return -1;
        int right = recur(root.right);
        if(right == -1) return -1;
        return Math.abs(left - right) <= 1 ? Math.max(left, right) + 1 : -1;
    }
}

```
@tab golang
```go
func isBalanced(root *TreeNode) bool {
    if root == nil {
        return true
    }
    return abs(height(root.Left) - height(root.Right)) <= 1 && isBalanced(root.Left) && isBalanced(root.Right)
}

func height(root *TreeNode) int {
    if root == nil {
        return 0
    }
    return max(height(root.Left), height(root.Right)) + 1
}

func max(x, y int) int {
    if x > y {
        return x
    }
    return y
}

func abs(x int) int {
    if x < 0 {
        return -1 * x
    }
    return x
}
```
:::


------



### [104.二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

> 给定一个二叉树，找出其最大深度。二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public int maxDepth(TreeNode root) {
        if(root == null) return 0;
        if(root.left == null && root.right == null) return 1;
        int left = maxDepth(root.left);
        int right = maxDepth(root.right);
        return 1 + Math.max(left, right);
    }
}
```
@tab golang
```go
// 迭代
func maxDepth(root *TreeNode) int {
    if root == nil {
        return 0
    }
    queue := []*TreeNode{}
    queue = append(queue, root)
    ans := 0
    for len(queue) > 0 {
        sz := len(queue)
        for sz > 0 {
            node := queue[0]
            queue = queue[1:]
            if node.Left != nil {
                queue = append(queue, node.Left)
            }
            if node.Right != nil {
                queue = append(queue, node.Right)
            }
            sz--
        }
        ans++
    }
    return ans
}

// 递归
func maxDepth(root *TreeNode) int {
    if root == nil {
        return 0
    }
    return max(maxDepth(root.Left), maxDepth(root.Right)) + 1
}
```
:::

------



### [103.二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)

> 给你二叉树的根节点root，返回其节点值的**锯齿形层序遍历** 。（即先从左往右，再从右往左进行下一层遍历，以此类推，层与层之间交替进行）。
>

**解题思路**：**层序遍历**的一个变化考法，首先层序遍历属于常考题目，这个板子必须要记住。正常的层序遍历时的队列是队尾进，队头出；锯齿形就先队尾进，队头出，然后再队头进，队尾出，每遍历一层就切换一次。

::: code-tabs

@tab cpp

```cpp
vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        vector<vector<int>> ans;
        if(root==nullptr) return ans;
        deque<TreeNode*> q={root};
        vector<int> t;
        int flag=1;
        while(!q.empty()){
            int sz=q.size();
            while(sz--){
                if(flag){
                    //从左往右遍历，从左往右开始压，压入尾部
                    TreeNode* cur=q.front();
                    q.pop_front();
                    t.emplace_back(cur->val);
                    if(cur->left!=nullptr) q.emplace_back(cur->left);
                    if(cur->right!=nullptr) q.emplace_back(cur->right);
                }else{
                    //从右往左遍历，从右往左开始压，压入头部
                    TreeNode* cur=q.back();
                    q.pop_back();
                    t.emplace_back(cur->val);
                    if(cur->right!=nullptr) q.emplace_front(cur->right);
                    if(cur->left!=nullptr) q.emplace_front(cur->left);
                }
            }
            ans.emplace_back(t);
            t.clear();
            flag=!flag;
        }
        return ans;
    }
```
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if(root == null) return res;
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.addLast(root);
        boolean toRight = true;
        while(!stack.isEmpty()) {
            int sz = stack.size();
            List<Integer> layer = new ArrayList<>();
            Deque<TreeNode> ns = new ArrayDeque<>();
            for(int i=0;i<sz;i++) {
                TreeNode cur = stack.removeLast();
                layer.add(cur.val);
                if(toRight) {
                    if(cur.left != null) ns.addLast(cur.left);
                    if(cur.right != null) ns.addLast(cur.right);
                } else {
                    if(cur.right != null) ns.addLast(cur.right);
                    if(cur.left != null) ns.addLast(cur.left);
                }
            }
            res.add(layer);
            stack = ns;
            toRight = !toRight;
        }
        return res;
    }
}
```

@tab golang

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func zigzagLevelOrder(root *TreeNode) [][]int {
    res := [][]int{}
    if root == nil {
        return res
    }
    
    flag := true
    queue := []*TreeNode{root}
    for len(queue) > 0 {
        size := len(queue)
        cur := []int{}
        for i := 0; i < size; i++ {
            node := queue[0]
            queue = queue[1:]
            cur = append(cur, node.Val)
            if node.Left != nil {
                queue = append(queue, node.Left)
            }
            if node.Right != nil {
                queue = append(queue, node.Right)
            }
        }
        if !flag {
            reverse(cur)
        }
        flag = !flag
        res = append(res, cur)
    }

    return res
}

func reverse(arr []int) {
    l, r := 0, len(arr)-1
    for l < r {
        arr[l], arr[r] = arr[r], arr[l]
        l++
        r--
    }
}
```

:::

------



### [236.二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

> 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
>

**解题思路**：经典**树形dp**问题，思路就是问左子树和右子树要信息，如果第一次碰见左子树有一个节点，右子树有另一个节点，那么说明这个节点就是最近公共祖先。

::: code-tabs

@tab cpp

```cpp
    int dfs(TreeNode* root,TreeNode* p, TreeNode* q ,vector<TreeNode*>& nodecontainer){
        if(root==nullptr) return 0;
        int ans=0;
        ans+=dfs(root->left,p,q,nodecontainer);
        ans+=dfs(root->right,p,q,nodecontainer);
        ans += root==p || root==q ? 1:0;
        if(ans==2 && nodecontainer.empty()){
            nodecontainer.push_back(root);
        }
        return ans;
    }
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        vector<TreeNode*> nodecontainer;
        int x=dfs(root,p,q,nodecontainer);
        return nodecontainer[0];
    }
```
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if(root == null) return null;
        if(root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if(left != null && right != null) return root;
        if(left != null) return left;
        if(right != null) return right;
        return null;
    }
}

```

@tab golang

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
    return find(root,p.Val,q.Val)     
}

func find(root *TreeNode,val1,val2 int)*TreeNode{
    if root==nil{
        return root
    }
    if root.Val==val1||root.Val==val2{
        return root
    }
    left := find(root.Left,val1,val2)
    right := find(root.Right,val1,val2)
    if left!=nil&&right!=nil{
        return root
    }
    if left!=nil{
        return left
    }
    return right
}
```

:::

------



### [199.二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)

> 给定一个二叉树的 **根节点** root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
>

::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if(root == null) return res;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.addLast(root);
        while(!queue.isEmpty()) {
            int sz = queue.size();
            Deque<TreeNode> tmp = new ArrayDeque<>();
            for(int i=0;i<sz;i++) {
                TreeNode pop = queue.removeFirst();
                if(pop.left != null) tmp.addLast(pop.left);
                if(pop.right != null) tmp.addLast(pop.right);
                if(i == sz-1) res.add(pop.val);
            }
            queue = tmp;
        }
        return res;
    }
}
```
@tab golang
```go
var res [][]int
func rightSideView(root *TreeNode) []int {
    res = [][]int{}
    dfs(root,0)
    result := make([]int,0)
    for i:=0;i<len(res);i++{
        for j:=0;j<len(res[i]);j++{
            if j == len(res[i])-1{
                result = append(result, res[i][len(res[i])-1])
            }
        }
    }
    return result
}

func dfs(root *TreeNode , n int){
    if root != nil{
        if len(res)==n{
            res = append(res, []int{})
        }
        res[n] = append(res[n], root.Val)
        dfs(root.Left,n+1)
        dfs(root.Right,n+1)
    }
}
```
:::
------



### [124.二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum)

> 路径被定义为一条从树中任意节点出发，沿父节点--子节点连接，达到任意节点的序列。同一个节点在一条路径序列中至多出现一次。该路径至少包含一个节点，且不一定经过根节点。
>
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    int max = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        dfs(root);
        return max;
    }

    public int dfs(TreeNode root){
        if(root == null) return 0;
        int left = Math.max(0, dfs(root.left));
        int right = Math.max(0, dfs(root.right));
        max = Math.max(max, root.val + left + right);
        return Math.max(root.val + left, root.val + right);
    }
}
```
@tab golang
```go
func maxPathSum(root *TreeNode) int {
	maxSum := math.MinInt32

	var dfs func(root *TreeNode) int
	dfs = func(root *TreeNode) int {
		if root == nil {
			return 0
		}
		left := dfs(root.Left)
		right := dfs(root.Right)

		innerMaxSum := left + root.Val + right
		maxSum = max(maxSum, innerMaxSum)
		outputMaxSum := root.Val + max(left, right) // left,right都是非负的，就不用和0比较了
		return max(outputMaxSum, 0)
	}

	dfs(root)
	return maxSum
}

func max(a, b int) int {
	if a > b { return a }
	return b
}
```
:::
------



### [102.二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

> 给你二叉树的根节点 `root`，返回其节点值的**层序遍历** 。（即逐层地，从左到右访问所有节点）。
>
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if(root == null) return res;
        Deque<TreeNode> queue = new ArrayDeque<TreeNode>();
        queue.addFirst(root);
        while(queue.peekLast()!=null){
            int currentSize = queue.size();
            List<Integer> layer = new ArrayList<>();
            for(int i=0;i<currentSize;i++){
                TreeNode cur = queue.removeLast();
                layer.add(cur.val);
                if(cur.left != null) queue.addFirst(cur.left);
                if(cur.right != null) queue.addFirst(cur.right);
            }
            res.add(layer);
        }
        return res;
    }
}
```
@tab golang
```go
// 迭代
func levelOrder(root *TreeNode) [][]int {
    var res [][]int
    if root == nil {
        return res
    }

    arr := []*TreeNode{root}

    for len(arr) > 0 {
        size := len(arr)
        curRes := []int{}
        for i := 0; i < size; i++ {
            node := arr[i]
            curRes = append(curRes, node.Val)
            if node.Left != nil {
                arr = append(arr, node.Left)
            }
            if node.Right != nil {
                arr = append(arr, node.Right)
            }
        }
        arr = arr[size:]
        res = append(res, curRes)
    }

    return res
}

// 递归
var res [][]int
func levelOrder(root *TreeNode) [][]int {
    res = [][]int{}
    dfs(root,0)
    return res
}
func dfs(root *TreeNode,level int){
    if root!=nil{
        if len(res)==level{
            res = append(res,[]int{})
        }
        res[level] = append(res[level],root.Val)
        dfs(root.Left,level+1)
        dfs(root.Right,level+1)
    }
}
```
:::
------



### [105.从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

> 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
>
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        if(preorder.length == 0) return null;
        TreeNode root = new TreeNode(preorder[0]);
        int i;
        for(i=0;i<inorder.length;i++){
            if(inorder[i]==preorder[0]) break;
        }
        root.left = buildTree(Arrays.copyOfRange(preorder, 1, i+1),
         Arrays.copyOfRange(inorder, 0, i));
        root.right = buildTree(Arrays.copyOfRange(preorder, i+1, preorder.length),
        Arrays.copyOfRange(inorder, i+1, inorder.length));
        return root;
    }
}
```
@tab golang
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
// 方法一
func buildTree(preorder []int, inorder []int) *TreeNode {
    if len(preorder) == 0 {
        return nil
    }
    root := &TreeNode{preorder[0], nil, nil}
    i := 0
    for ; i < len(inorder); i++ {
        if inorder[i] == preorder[0] {
            break
        }
    }
    root.Left = buildTree(preorder[1:len(inorder[:i])+1], inorder[:i])
    root.Right = buildTree(preorder[len(inorder[:i])+1:], inorder[i+1:])
    return root
}
// 方法二
func buildTree(preorder []int, inorder []int) *TreeNode {
    return build(preorder,0,len(preorder)-1,inorder,0,len(inorder)-1)
}
func build(preorder []int,preStart int,preEnd int,inorder []int,inStart int,inEnd int)*TreeNode{
    if preStart>preEnd||inStart>inEnd{
        return nil
    }
    rootVal := preorder[preStart]
    index := 0
    for i:=inStart;i<=inEnd;i++{
        if inorder[i]==rootVal{
            index = i
            break
        }
    }
    leftSize := index - inStart
    root := &TreeNode{
        Val: rootVal,
        Left: build(preorder,preStart+1,preStart+leftSize,inorder,inStart,index-1),
        Right: build(preorder,preStart+leftSize+1,preEnd,inorder,index+1,inEnd),
    }
    return root
}
```

:::

### [98.验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree)

> 给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。有效二叉搜索树定义如下：
>
> - 节点的左子树只包含 小于 当前节点的数。
>- 节点的右子树只包含 大于 当前节点的数。
> - 所有左子树和右子树自身必须也是二叉搜索树。

::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public boolean isValidBST(TreeNode root) {
        return isValidBST(root, null, null);
    }

    private boolean isValidBST(TreeNode root, TreeNode min, TreeNode max) {
        if(root == null) return true;
        if(min != null && root.val <= min.val) return false;
        if(max != null && root.val >= max.val) return false;
        return isValidBST(root.left, min, root) && isValidBST(root.right, root, max);
    }
}
```
@tab golang

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func isValidBST(root *TreeNode) bool {
    return traverse(root,nil,nil)
}
func traverse(root,min,max *TreeNode)bool{
    if root==nil{
        return true
    }
    if min!=nil&&root.Val<=min.Val{
        return false
    }
    if max!=nil&&root.Val>=max.Val{
        return false
    }
    return traverse(root.Right,root,max)&&traverse(root.Left,min,root)
}
```
:::
------



### [543.二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/)

> 给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过也可能不穿过根结点。
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    private int diameter;

    public int diameterOfBinaryTree(TreeNode root) {
        diameter = 0;
        postTraverse(root);
        return diameter;
    }

    private int postTraverse(TreeNode root) {
        if(root == null) return 0;
        int leftDepth = postTraverse(root.left);
        int rightDepth = postTraverse(root.right);
        diameter = Math.max(diameter, leftDepth + rightDepth);
        return Math.max(leftDepth, rightDepth) + 1;
    }
}
```
@tab golang
```go
var result int
func diameterOfBinaryTree(root *TreeNode) int {
    result = 0
    diameterOfBinaryTreeHelper(root)
    return result
}

func diameterOfBinaryTreeHelper(root *TreeNode) int{
    if root==nil {
        return 0
    }
    leftDepth := diameterOfBinaryTreeHelper(root.Left)
    rightDepth := diameterOfBinaryTreeHelper(root.Right)
    currentDiameter := leftDepth + rightDepth
    result = max(result,currentDiameter)
    return max(leftDepth,rightDepth)+1
}

func max(a,b int)int{
    if a>b{
        return a
    }
    return b
}
```
:::
------



### [662.二叉树最大宽度](https://leetcode.cn/problems/maximum-width-of-binary-tree)

> 给你一棵二叉树的根节点 root ，返回树的 最大宽度 。
>
> 树的 最大宽度 是所有层中最大的 宽度 。
>
> 每一层的 宽度 被定义为该层最左和最右的非空节点（即，两个端点）之间的长度。将这个二叉树视作与满二叉树结构相同，两端点间会出现一些延伸到这一层的 null 节点，这些 null 节点也计入长度。
>


::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    private int maximum;

    public int widthOfBinaryTree(TreeNode root) {
        dfs(root, 0, 1, new ArrayList<>());
        return maximum;
    }

    private void dfs(TreeNode root, int depth, int idx, List<Integer> leftIdx) {
        if (root == null) {
            return;
        }
        if (depth >= leftIdx.size()) {
            leftIdx.add(idx);
        }
        maximum = Math.max(maximum, idx - leftIdx.get(depth) + 1);
        dfs(root.left, depth + 1, 2 * idx, leftIdx);
        dfs(root.right, depth + 1, 2 * idx + 1, leftIdx);
    }
}

```
@tab golang
```go
type item struct {
    idx int
    *TreeNode
}
func widthOfBinaryTree(root *TreeNode) int {
    if root == nil {
        return 0
    }
    ans, que := 1, []item{{0, root}}
    for len(que) > 0 {
        if l := que[len(que) - 1].idx - que[0].idx + 1; l > ans {
            ans = l
        }
        tmp := []item{}
        for _, q := range que {
            if q.Left != nil {
                tmp = append(tmp, item{q.idx * 2, q.Left})
            }
            if q.Right != nil {
                tmp = append(tmp, item{q.idx * 2 + 1, q.Right})
            }
        }
        que = tmp
    }
    return ans
}
```
:::
------



### [958.二叉树的完全性检验](https://leetcode.cn/problems/check-completeness-of-a-binary-tree/)

> 给定一个二叉树的 root ，确定它是否是一个 完全二叉树 。
>
> 在一个 完全二叉树 中，除了最后一个关卡外，所有关卡都是完全被填满的，并且最后一个关卡中的所有节点都是尽可能靠左的。它可以包含 1 到 2h 节点之间的最后一级 h 。
>
::: code-tabs
@tab java
```java
 class Solution {
    public boolean isCompleteTree(TreeNode root) {
        Queue<TreeNode> queue = new LinkedList<>();
        TreeNode prev = root;
        queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.remove();
            if (prev == null && node != null)
                return false;
            if (node != null) {
                queue.add(node.left);
                queue.add(node.right);
            }
            prev = node;
        }
        return true;
    }
}
```
@tab golang

```go
func isCompleteTree(root *TreeNode) bool {
    queue := []*TreeNode{root}
    lastIsNil := false
    for len(queue) != 0 {
        node := queue[0]
        queue = queue[1:]
        if node == nil {
            lastIsNil = true
        } else {
            if lastIsNil {
                return false
            }
            queue = append(queue, node.Left)
            queue = append(queue, node.Right)
        }
    }
    return true
}
```
:::
------

### [297. 二叉树的序列化与反序列化](https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/)

> 序列化是将一个数据结构或者对象转换为连续的比特位的操作，进而可以将转换后的数据存储在一个文件或者内存中，同时也可以通过网络传输到另一个计算机环境，采取相反方式重构得到原数据。
>
> 请设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。
>
> 提示: 输入输出格式与 LeetCode 目前使用的方式一致，详情请参阅 LeetCode 序列化二叉树的格式。你并非必须采取这种方式，你也可以采用其他的方法解决这个问题。
>
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
public class Codec {

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        if(root == null) return null;
        Deque<TreeNode> queue = new ArrayDeque<>();
        StringBuilder res = new StringBuilder();
        queue.addFirst(root);
        res.append(root.val + ",");
        while(queue.peekFirst() != null){
            TreeNode cur = queue.removeLast();
            if(cur.left != null){
                queue.addFirst(cur.left);
                res.append(cur.left.val + ",");
            }
            else res.append("null,");
            if(cur.right != null){
                queue.addFirst(cur.right);
                res.append(cur.right.val + ",");
            }
            else res.append("null,");
        }
        res.deleteCharAt(res.length()-1);
        return res.toString();
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        if(data == null) return null;
        String[] values = data.split(",");
        TreeNode root = new TreeNode(Integer.parseInt(values[0]));
        int index = 1;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.addFirst(root);
        while(queue.peekFirst() != null){
            TreeNode cur = queue.removeLast();
            if(!values[index].equals("null")){
                TreeNode left = new TreeNode(Integer.parseInt(values[index++]));
                cur.left = left;
                queue.addFirst(left);
            }else{
                cur.left = null;
                index++;
            }
            if(!values[index].equals("null")){
                TreeNode right = new TreeNode(Integer.parseInt(values[index++]));
                cur.right = right;
                queue.addFirst(right);
            }else{
                cur.right = null;
                index++;
            }
        }
        return root;
    }
}

// Your Codec object will be instantiated and called as such:
// Codec codec = new Codec();
// codec.deserialize(codec.serialize(root));
```
@tab golang

```go
// 序列化
func (this *Codec) serialize(root *TreeNode) string {
	if root == nil {
		return "X"
	}
	return strconv.Itoa(root.Val) + "," + this.serialize(root.Left) + "," + this.serialize(root.Right)
}
// 反序列化

func buildTree(list *[]string) *TreeNode {
	rootVal := (*list)[0]
	*list = (*list)[1:]
	if rootVal == "X" {
		return nil
	}
	Val, _ := strconv.Atoi(rootVal)
	root := &TreeNode{Val: Val}
	root.Left = buildTree(list)
	root.Right = buildTree(list)
	return root
}

func (this *Codec) deserialize(data string) *TreeNode {
	list := strings.Split(data, ",")
	return buildTree(&list)
}
```
:::


### [129.求根节点到叶节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers)

> 给你一个二叉树的根节点 root ，树中每个节点都存放有一个 0 到 9 之间的数字。
> 每条从根节点到叶节点的路径都代表一个数字：
>
> 例如，从根节点到叶节点的路径 1 -> 2 -> 3 表示数字 123 。
> 计算从根节点到叶节点生成的 所有数字之和 。
::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    private int res;

    public int sumNumbers(TreeNode root) {
        dfs(root, new StringBuffer());
        return res;
    }

    private void dfs(TreeNode root, StringBuffer cur) {
        if(root == null) return;
        cur.append(root.val);
        if(root.left == null && root.right == null) {
            res += Integer.parseInt(cur.toString());
        }
        dfs(root.left, cur);
        dfs(root.right, cur);
        cur.deleteCharAt(cur.length() - 1);
    }
}
```
@tab golang
```go
// 递归
func sumNumbers(root *TreeNode) (res int) {

	var dfs func(root *TreeNode, sum int)
	dfs = func(root *TreeNode, sum int) {
		if root == nil {
			return
		}
		if root.Left == nil && root.Right == nil {
			res += (sum)*10 + root.Val
		}
		dfs(root.Left, sum*10+root.Val)
		dfs(root.Right, sum*10+root.Val)
	}

	dfs(root, 0)
	return
}

// 非递归
type pair struct {
	sum  int
	node *TreeNode
}

func sumNumbers(root *TreeNode) (res int) {
	if root == nil {
		return 0
	}
	queue := make([]*pair, 0)
	queue = append(queue, &pair{sum: root.Val, node: root})
	for len(queue) != 0 {
		pop := queue[0]
		queue = queue[1:]
		if pop.node.Left == nil && pop.node.Right == nil {
			res += pop.sum
		}
		if pop.node.Left != nil {
			queue = append(queue, &pair{
				sum:  pop.sum*10 + pop.node.Left.Val,
				node: pop.node.Left,
			})
		}
		if pop.node.Right != nil {
			queue = append(queue, &pair{
				sum:  pop.sum*10 + pop.node.Right.Val,
				node: pop.node.Right,
			})
		}
	}
	return
}
```
:::
------







### [112.路径总和](https://leetcode.cn/problems/path-sum/)

> 给你二叉树的根节点 root 和一个表示目标和的整数 targetSum 。判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和 targetSum 。如果存在，返回 true ；否则，返回 false 

::: code-tabs
@tab java
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public boolean hasPathSum(TreeNode root, int sum) {
        if(root == null) return false;
        sum -= root.val;
        if(sum == 0 && root.left==null && root.right==null) return true;
        return hasPathSum(root.left, sum) || hasPathSum(root.right, sum);
    }
}
```
@tab golang

```go
func hasPathSum(root *TreeNode, targetSum int) bool {
    if root==nil{
        return false
    }
    if root.Left==nil&&root.Right==nil{
        return root.Val-targetSum==0
    }
    return hasPathSum(root.Left,targetSum-root.Val)||hasPathSum(root.Right,targetSum-root.Val)
}
```
:::
------



### [113.路径总和 II](https://leetcode.cn/problems/path-sum-ii/)

> 给你二叉树的根节点 `root` 和一个整数目标和 `targetSum` ，找出所有 **从根节点到叶子节点** 路径总和等于给定目标和的路径。


::: code-tabs
@tab java
```java
class Solution {
    List<List<Integer>> ans = new ArrayList<>();
    LinkedList<Integer> rec = new LinkedList<>(); 
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        dfs(root, targetSum, 0);
        return ans;
    }
    void dfs(TreeNode root, int targetSum, int sum) {
        if (root == null) return;
        rec.add(root.val);
        sum += root.val;
        if (root.left == null && root.right == null) {
            if (sum == targetSum) ans.add(new ArrayList<>(rec));//O(n)
        } 
        dfs(root.left, targetSum, sum);
        dfs(root.right, targetSum, sum);
        rec.removeLast(); //回溯
    }
}

```
@tab golang
```go
func pathSum(root *TreeNode, targetSum int) [][]int {
	var res [][]int
	var path []int
	if root == nil {
		return res
	}
	var pathSum func(root *TreeNode)
	pathSum = func(root *TreeNode) {
		path = append(path, root.Val)
		if root.Left == nil && root.Right == nil {
			var sum, num int
			for i,v := range path {
				sum += v
				num = i
			}
			tmpNode := make([]int, num+1)
			for i,v := range path {
				tmpNode[i] = v
			}
			if sum == targetSum {
				res = append(res, tmpNode)
			}
		}
		if root.Left != nil {
			pathSum(root.Left)
			path = path[:len(path)-1]
		}
		if root.Right != nil {
			pathSum(root.Right)
			path = path[:len(path)-1]
		}
	}
	pathSum(root)
	return res
}
```
:::
------



