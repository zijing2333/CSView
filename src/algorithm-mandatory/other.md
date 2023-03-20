---
title: 其他算法题
author: 枫长
---
### [1.两数之和](https://leetcode.cn/problems/two-sum/)

> 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。
>
> 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
>
> 你可以按任意顺序返回答案。


**解题思路**：
- 正常思路是两遍遍历，实际上每个节点对访问了两次。
- 我们可以用hash表来存一下，要么第一次访问时节点对对应的节点就在hash表里，要么不再就加进去，等着另外一个节点访问。

::: code-tabs

@tab cpp
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int,int> hash;
        vector<int> ans(2);
        for(int i = 0; i < nums.size(); i++) {
            if(hash.count(target - nums[i])) {
                ans[0] = hash[target - nums[i]];
                ans[1] = i;
                return ans;
            }
            hash[nums[i]] = i;
        }
        return ans;
    }
};
```

@tab golang

```go
func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    for index, val := range nums {
        if preIndex, ok := m[target-val]; ok {
            return []int{preIndex, index}
        } else {
            m[val] = index
        }
    }
    return []int{}
}
```

------



### [146.LRU缓存](https://leetcode.cn/problems/lru-cache)

> 请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
> 实现 LRUCache 类：
> LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
> int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
> void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。
> 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。

**解题思路**：LRU缓存是考察数据结构能力的题目，它本质上由一个**双端链表**与一个**hash表**构成。双端链表用于存放具体的键值对，hash表的作用是能根据key以O(1)的复杂度找到相应的键值对。注意一下链表的增删，容易在这里出错。

::: code-tabs

@tab cpp

```cpp
struct node{
    int key;
    int val;
    node* pre;
    node* next;
    node(int _key, int _val): key(_key), val(_val) {

    }
};
class LRUCache {
public:
    unordered_map<int, node*> hash;
    node* begin;
    node* end;
    int capacity;
    int size = 0;
    LRUCache(int _capacity) {
        begin = new node(-1, -1);
        end = new node(-1, -1);
        begin->next = end;
        end->pre = begin;
        capacity = _capacity;
    }
    
    void add(node* pre, node* cur) {
        node* next = pre->next;
        pre->next = cur;
        cur->pre = pre;
        cur->next = next;
        next->pre = cur;
    }

    int get(int key) {
        if(!hash.count(key)) {
            return -1;
        }
        node* cur = hash[key];
        node* pre = cur->pre;
        node* next = cur->next;
        pre->next = next;
        next->pre = pre;
        add(begin, cur);
        return cur->val;
    }
    
    void put(int key, int value) {
        if(hash.count(key)) {
            hash[key]->val = value;
            get(key);
            return;
        }
        if(size >= capacity) {
            node* cur = end->pre;
            node* pre = cur->pre;
            node* next = cur->next;
            pre->next = next;
            next->pre = pre;
            hash.erase(cur->key);
            size--;
        }
        node* cur = new node(key, value);
        add(begin, cur);
        hash[key] = cur;
        size++;
    }
};
```

@tab golang

```go
type LRUCache struct {
    capacity int
    m map[int]*Node
    head,tail *Node
}

type Node struct{
    Key int
    Val int
    Pre, Next *Node
}

func Constructor(capacity int) LRUCache {
    head,tail := &Node{},&Node{}
    head.Next = tail
    tail.Pre = head
    return LRUCache{
        capacity: capacity, 
        m: map[int]*Node{}, 
        head: head, 
        tail: tail,
    }
}
func (this *LRUCache) deleteNode(node *Node){
    node.Pre.Next = node.Next
    node.Next.Pre = node.Pre
}

func (this *LRUCache) removeTail()int{
    node := this.tail.Pre
    this.deleteNode(node)
    return node.Key
}
func (this *LRUCache)addToHead(node *Node){
    this.head.Next.Pre = node
    node.Next = this.head.Next
    node.Pre = this.head
    this.head.Next = node
}
func (this *LRUCache) moveToHead(node *Node) {
    this.deleteNode(node)
    this.addToHead(node)
}

func (this *LRUCache) Get(key int) int {
    if v,ok := this.m[key];ok{
        this.moveToHead(v)
        return v.Val
    }
    return -1
}


func (this *LRUCache) Put(key int, value int)  {
    if v,ok := this.m[key];ok{
        v.Val = value
        this.moveToHead(v)
        return
    }
    if this.capacity==len(this.m){
        rmKey := this.removeTail()
        delete(this.m,rmKey)
    }
    newNode := &Node{Key: key, Val: value}
    this.addToHead(newNode)
    this.m[key] = newNode
}


/**
 * Your LRUCache object will be instantiated and called as such:
 * obj := Constructor(capacity);
 * param_1 := obj.Get(key);
 * obj.Put(key,value);
 */
```

:::

------



### [15.三数之和](https://leetcode.cn/problems/3sum)

> 给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请
>
> 你返回所有和为 0 且不重复的三元组。
>
> 注意：答案中不可以包含重复的三元组。
>

**解题思路**：

- **双指针**经典题目,比较naive的做法就是三次遍历O(n^3^)的复杂度，这肯定是不行的，我们可以先排序，将无序数组转成有序的，然后在第二次与第三次遍历上做文章，优化的复杂度可以达到O(n^2^)。
- 对数组进行排序，使用三个指针 i、j 和 k 分别代表要找的三个数。通过枚举 i 确定第一个数，另外两个指针 j，k 分别从左边 i + 1 和右边 n - 1 往中间移动，通过比较sum与0的大小，找到满足 sum = 0的所有组合。
  由于题目要求答案不能包含重复的三元组，所以在确定第一个数和第二个数的时候，要跳过数值一样的下标（在三数之和确定的情况下，确保第一个数和第二个数不会重复，即可保证三元组不重复）

::: code-tabs

@tab cpp

```cpp
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        vector<vector<int>> ans;
        vector<int> tmp(3);
        for(int i = 0; i < n; i++) {
            if(i != 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            int target = -nums[i], r = n - 1;
            for(int l = i + 1; l < n; l++) {
                if(l != i + 1 && nums[l] == nums[l - 1]) {
                    continue;
                }
                while(l < r && nums[l] + nums[r] > target) {
                    r--;
                }
                if(l < r && nums[l] + nums[r] == target) {
                    tmp[0] = nums[i];
                    tmp[1] = nums[l];
                    tmp[2] = nums[r];
                    ans.emplace_back(tmp);
                }
            }
        }
        return ans;
    }
```

@tab golang

```go
func threeSum(nums []int) [][]int {
    sort.Ints(nums)
    res := make([][]int,0)
    for i:=0;i<len(nums);i++{
        if nums[i]>0{
            return res
        }
        if i>0&&nums[i]==nums[i-1]{
            continue
        }
        l := i + 1
        r := len(nums) - 1
        for l<r{
            sum := nums[i] + nums[l] + nums[r]
        if sum == 0{
            res = append(res,[]int{nums[i],nums[l],nums[r]})
            for l<r&&nums[l]==nums[l+1]{
                l++
            }
            for l<r&&nums[r]==nums[r-1]{
                r--
            }
            l++
            r--
        }else if sum>0{
            r--
        }else{
            l++
        }
        }
        
    }
    return res
}
```

:::

------



### [42.接雨水](https://leetcode.cn/problems/trapping-rain-water/)

> 给定 n个非负整数表示每个宽度为1的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
>

**解题思路**：

- 思路1：**单调栈**问题，对于每一个凹的区域，它所能接的水是要看距离它最近的比它高的位置的高度，单调栈遍历一圈，将每个位置上所能接到的水存下来即可。 时间复杂度O(n)。
- 思路2：**双指针**的思路，一开始左右两个指针指向数组的两边，判断左边和右边哪边高，假设是左边高，那么此时在l指针这一格里，右边一定有人挡水，且右边的max一定比左边的max高(因为如果左边更高左边就会卡着不动)，所以此时这一格接到的水就是左边的max - 当前的高度；当右边高时同理。

::: code-tabs

@tab cpp

```go
    int trap(vector<int>& height) {
        vector<vector<int>> st;
        int n = height.size();
        int ans = 0;
        for(int i = 0; i < n; i++) {
            while(!st.empty() && height[st.back().back()] < height[i]) {
                vector<int> t = st.back();
                st.pop_back();
                if(!st.empty()) {
                    int high = min(height[st.back().back()], height[i]) - height[t.back()];
                    ans += high*(i - st.back().back() - 1);
                }
            }
            if(st.empty() || height[st.back().back()] > height[i]) {
                vector<int> add = { i };
                st.emplace_back(add);
            }else if(height[st.back().back()] == height[i]) {
                st.back().emplace_back(i);
            }
        }
        return ans;
    }
```

@tab golang

```go
func trap(height []int) int {
	var left, right, leftMax, rightMax, res int
	right = len(height) - 1
	for left < right {
		if height[left] < height[right] {
			if height[left] >= leftMax {
				leftMax = height[left]
			} else {
				res += leftMax - height[left] 
			}
			left++
		} else {
			if height[right] > rightMax { 
				rightMax = height[right]
			} else {
				res += rightMax - height[right]
			}
			right--
		}
	}
	return res
}
```

:::

------



### [704.二分查找](https://leetcode.cn/problems/binary-search/)

> 给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

**解题思路**：
- 经典二分，二分的本质是维护二段性，一段符合某个性质，另一段不符合，那么搜索范围就可以缩小。

::: code-tabs

@tab cpp
```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l=0,r=nums.size()-1;
        while(l < r){
            int m = l + (r - l)/2;
            if(nums[m] >= target) r = m;
            else l = m + 1;
        }
        if(nums[l] == target) return l;
        else return -1;
    }
};
```
@tab golang

```go
func search(nums []int, target int) int {
    for l, r := 0, len(nums)-1; l <= r; {
        m := l+(r-l)/2
        if nums[m] == target {
            return m
        } else if nums[m] > target {
            r = m-1
        } else {
            l = m+1
        }
    }
    return -1
}
```

------



### [7.整数反转](https://leetcode.cn/problems/reverse-integer)

> 给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。
>
> 如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0。
>
> 假设环境不允许存储 64 位整数（有符号或无符号）。
>

**解题思路**：
- 如果不超出范围的整数反转很简单，这道题的考点就在于超过范围，因为INT_MIN的存在所以用负数来搜，
- 如果ans < INT_MIN/10，那么下一次一定超，
- 或者ans == INT_MIN/10 且 x % 10 < INT_MIN % 10，那么也会超

::: code-tabs

@tab cpp
```cpp
class Solution {
public:

    int reverse(int x) {
        int sign = x > 0;
        if(x > 0) x = -x;
        int INTx = INT_MIN / 10;
        int INTy = INT_MIN % 10;
        int ans = 0;
        while(x < 0){
            if(ans < INTx || (ans == INTx && x%10 < INTy)){
                return 0;
            }
            ans = 10 * ans + x%10;
            x /= 10;
        }
        if(ans == INT_MIN && !sign) return 0; //注意如果是INT_MIN且符号是正的，这个也不能转换
        if(sign) ans = -ans;
        return ans;
    }
};
```

@tab golang

```go
func reverse(x int) int {
	res := 0
	for x != 0 {
		res = res*10 + x%10
		x = x/10
	}
	if res <= math.MinInt32 || res >= math.MaxInt32 {
		return 0
	}
	return res
}
```

------



### [69.x的平方根](https://leetcode.cn/problems/sqrtx/)

> 给你一个非负整数 x ，计算并返回 x 的 算术平方根 。
>
> 由于返回类型是整数，结果只保留 整数部分 ，小数部分将被 舍去 。
>
> 注意：不允许使用任何内置指数函数和算符，例如 pow(x, 0.5) 或者 x ** 0.5 。
>

**解题思路**：
- 二分，时间复杂度O(logX)
  
::: code-tabs

```cpp
class Solution {
public:
    int mySqrt(int x) {
        if(x == 0 || x == 1) return x;
        //查的是sqrt(x)，如果正常是大于等于sqrt(x)的第一个整数，但答案要的是取整的
        //注意x2=x的情况，此时不能减，x=0或1
        int l = 0, r = x;
        while(l < r){
            long m = l + (r - l)/2;
            if(m * m > x) r = m;
            else l = m + 1;
        }
        return l - 1;
    }
};
```
```go
// 精确到个位
func mySqrt(x int) int {
    l, r := 1, x
    for l <= r {
        mid := (l + r) >> 1
        if x < mid * mid {
            r = mid - 1
        } else {
            l = mid + 1
        }
    }
    return r
}

// 精确到3位小数
func mySqrt(x float64) float64 {
	l, r := 0.0, x
	for l <= r {
		mid := (l + r) >> 1
		if x < mid*mid {
			r = mid - 1e-3
		} else {
			l = mid + 1e-3
		}
	}
	return r
}
```

------



### [209.长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum)

> 给定一个含有 n 个正整数的数组和一个正整数 target 。
>
> 找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。
>

**解题思路**：
- 双指针的思路，双指针维持的窗口满足其和 ≥ target，且尽量让窗口最小。
- 每次滑动一下右指针，更新一下窗口元素和；然后只要左指针滑动之后窗口元素和依然 >= target，那么就接着缩小窗口。

::: code-tabs

@tab cpp
```cpp
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int n = nums.size();
        int l = 0;
        int sum = 0;
        int ans = INT_MAX;
        for(int r = 0; r < n; r++) {
            sum += nums[r];
            while(l < r && sum - nums[l] >= target) {
                sum -= nums[l];
                l++;
            }
            if(sum >= target) {
                ans = min(ans, r - l + 1);
            }
        }
        if(ans == INT_MAX) {
            return 0;
        }
        return ans;
    }
};
```
@tab golang
```go
func minSubArrayLen(target int, nums []int) int { 
    i := 0
    l := len(nums)
    sum := 0    
    result := l + 1
    for j := 0; j < l; j++ {
        sum += nums[j]
        for sum >= target {
            subLength := j - i + 1
            if subLength < result {
                result = subLength
            }
            sum -= nums[i]
            i++
        }
    }
    if result == l+1 {
        return 0
    } else {
        return result
    }
}
```

------



### [54.螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/)

> 给你一个`m`行`n`列的矩阵`matrix`，请按照**顺时针螺旋顺序**，返回矩阵中的所有元素。
>
> **子数组**是数组中的一个连续部分。

**解题思路**：**状态机模拟**题目，我们可以定义上下左右四个方向状态为1,2,3,4；一开始方向状态为右，当右碰到边界或者已经遍历过的元素了，就将状态变成下；当下走到边界或者已经遍历过的元素了，就将状态变成左，以此类推，当所有位置都遍历完了，就可以得到的答案。

::: code-tabs

@tab cpp

```cpp
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> res;
        int first=0;
        int second=0;
        int count=0;
        int direction=2;// 上右下左
        while(count<matrix.size()*matrix[0].size())
        {
            res.push_back(matrix[first][second]);
            matrix[first][second]=101;
            count++;
            switch(direction){
                case 1: 
                    if(first==0 && direction==1) direction=2;
                    else if(direction==1 && matrix[first-1][second]==101) direction=2;
                    break;
                case 2:
                    if(direction==2 && second==matrix[0].size()-1) direction=3;
                    else if(direction==2 && matrix[first][second+1]==101) direction=3;
                    break;
                case 3:
                    if(direction==3 && first==matrix.size()-1) direction=4;
                    else if(direction==3 && matrix[first+1][second]==101) direction=4;
                    break;
                case 4:
                    if(direction==4 && second==0) direction=1;
                    else if(direction==4 && matrix[first][second-1]==101) direction=1;
                    break;
            }
            switch(direction){
                case 1: first-=1; break;
                case 2: second+=1; break;
                case 3: first+=1; break;
                case 4: second-=1; break;
            }
        }
        return res;
    }；
```

@tab golang

```go
func spiralOrder(matrix [][]int) []int {
    res := make([]int,0)
    upboundy,downboundy,leftboundy,rightboundy := 0,len(matrix)-1,0,len(matrix[0])-1
    for len(res)<len(matrix)*len(matrix[0]){
        if upboundy<=downboundy{
            for i:=leftboundy;i<=rightboundy;i++{
                res = append(res,matrix[upboundy][i])
            }
            upboundy++
        }
        if leftboundy<=rightboundy{
            for i:=upboundy;i<=downboundy;i++{
                res = append(res,matrix[i][rightboundy])
            }
            rightboundy--
        }
        if upboundy<=downboundy{
            for i:=rightboundy;i>=leftboundy;i--{   
                res = append(res,matrix[downboundy][i])
            }
            downboundy--
        }
        if leftboundy<=rightboundy{
            for i:=downboundy;i>=upboundy;i--{
                res = append(res,matrix[i][leftboundy])
            }
            leftboundy++
        }
    }
    return res
}
```

:::

------



### [41.缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive/)

> 给你一个未排序的整数数组 `nums` ，请你找出其中没有出现的最小的正整数。
>
> 请你实现时间复杂度为 `O(n)` 并且只使用常数级别额外空间的解决方案。
>

```go
func firstMissingPositive(nums []int) int {
    for i:=0;i<len(nums);i++{
        for nums[i]>=1&&nums[i]<=len(nums)&&nums[nums[i]-1]!=nums[i]{
            nums[i],nums[nums[i]-1] = nums[nums[i]-1],nums[i]
        }
    }
    for i:=0;i<len(nums);i++{
        if nums[i]!=i+1{
            return i+1
        }
    }
    return len(nums)+1
}
```



### [240.搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/)

> 编写一个高效的算法来搜索 m x n 矩阵 matrix 中的一个目标值 target 。该矩阵具有以下特性：
>
> - 每行的元素从左到右升序排列。
> - 每列的元素从上到下升序排列。

```go
func searchMatrix(matrix [][]int, target int) bool {
     n,m:= 0,len(matrix[0])-1
    for n<len(matrix)&&m>=0{
        if matrix[n][m]!=target{
            if matrix[n][m]>target{
                m--
            }else{
                n++
            }
        }else{
            return true
        }
    }
    return false
}
```

------



### [470.用Rand7() 实现 Rand10()](https://leetcode.cn/problems/implement-rand10-using-rand7)

> 给定方法 rand7 可生成 [1,7] 范围内的均匀随机整数，试写一个方法 rand10 生成 [1,10] 范围内的均匀随机整数。
>
> 你只能调用 rand7() 且不能调用其他方法。请不要使用系统的 Math.random() 方法。
>
> 每个测试用例将有一个内部参数 n，即你实现的函数 rand10() 在测试时将被调用的次数。请注意，这不是传递给 rand10() 的参数。
>

::: code-tabs

**解题思路**：
- 这种用rand m实现rand n的题目，都是先用rand m构建rand 2。
- 然后找到大于n的2的整数次幂，比如10就是16，用rand 2去roll每一位。
- roll出来的结果大于10的话就重roll。

@tab cpp
```cpp
// The rand7() API is already defined for you.
// int rand7();
// @return a random integer in the range 1 to 7

class Solution {
public:
    int rand2(){
        int val = 7;
        while(val == 7) val=rand7(); 
        if(val <= 3){
            return 1;
        }else{
            return 0;
        }
    }
    int rand10() {
        int val = 16;
        while(val >= 10){
            val = 0;
            for(int i = 0; i < 4; i++){
                val = (val << 1) + rand2();
            }
        }
        return val + 1;
    }
};
```

@tab golang
```go
func rand10() int {
    for{
        num := (rand7()-1)*7 + rand7()
        if num <= 40 {
            return num%10+1
        }
    }
}
```

------



### [440.字典序的第K小数字](https://leetcode.cn/problems/k-th-smallest-in-lexicographical-order/)

> 给定整数 `n` 和 `k`，返回 `[1, n]` 中字典序第 `k` 小的数字。

**解题思路**：
- 这道题解法直接看是字典树，但是时间复杂度O(n)，一定会超时。
- 我们是能计算以x为前缀且最大为limit的数字个数的，这样我们就可以剪枝。
- x从1开始，查询以x为前缀的个数，如果cnt小于k，就说明以x为前缀的数排序全在k之前，x++
- 如果cnt 大于 k，就说明第k个在以x为前缀的数里面，给x乘10，缩小范围
 
::: code-tabs
```cpp
class Solution {
public:
    int getLen(int val){
        int cnt=0;
        while(val>0){
            val/=10;
            cnt++;
        }
        return cnt;
    }
    //得到以x为前缀的个数
    int getCnt(int x,int limit){
        int lenX=getLen(x),lenL=getLen(limit);
        int res=0;
        for(int i=lenX;i<lenL;i++){
            res+=pow(10,i-lenX);
        }
        int t=limit/pow(10,lenL-lenX);
        if(t==x) res+=limit-x*pow(10,lenL-lenX)+1;
        else if(t>x) res+=pow(10,lenL-lenX);
        return res;
    }
    int findKthNumber(int n, int k) {
        int x=1;
        while(k>1){
            int num=getCnt(x,n);
            if(num<k){          //也就是说当前以他为前缀的所有数都ok
                x++;
                k-=num;
            }else if(num>=k){   //第k个数在以他为前缀的个数里面
                x*=10;
                k--;            //去掉x本身，接着往前算一轮。
            }
        }
        return x;
    }
};
```
@tab golang
```go
func findKthNumber(n int, k int) int {
	p := 1
	prefix := 1
	for p < k {
		count := 0
		currentNode := prefix
		nextNode := prefix + 1
		for currentNode <= n {
			count += int(math.Min(float64(nextNode), float64(n+1))) - currentNode
			currentNode *= 10
			nextNode *= 10
		}
		if p+count > k {
			prefix *= 10
			p++
		} else {
			prefix++
			p += count
		}
	}
	return prefix
}
```

------



### [239.滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)

**解题思路**：
- 经典题目，我们用一个双端队列来保存窗口在滑动过程中可能成为最大值的元素。
- 这个双端队列保存的是从队头到队尾依次可以成为最大值的元素，滑动r的时候往进加，滑动l的时候看看l是否和队头元素下标一样，一样就pop队头。
- 这个双端队列压入元素的方式是这样，从队尾开始压入，如果队尾元素比当前元素小，那说明队尾元素比当前元素旧，还比当前元素小，那它必不能成为最大值
- 所以就一直pop直到空或者队尾元素比当前元素大，然后把当前元素压进去。

::: code-tabs

@tab cpp
```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> q;
        int n = nums.size();
        vector<int> ans(n - k + 1);
        for(int i = 0; i < n; i++) {
            while(!q.empty() && nums[i] > nums[q.front()]) {
                q.pop_front();
            }
            q.emplace_front(i);
            if(i >= k && i - k == q.back()) {
                q.pop_back();
            }
            if(i >= k - 1) {
                ans[i - k + 1] = nums[q.back()];
            }
        }
        return ans;
    }
};
```
@tab golang
```go
type MaxQueue struct{
    Queue []int
}
func Constructor()MaxQueue{
    queue := make([]int,0)
    return MaxQueue{Queue:queue}
}
func (this *MaxQueue)push(n int){
    for len(this.Queue)!=0&&this.Queue[len(this.Queue)-1]<n{
        this.Queue = this.Queue[:len(this.Queue)-1]
    }
    this.Queue = append(this.Queue,n)
}
func (this *MaxQueue)max()int{
    return this.Queue[0]
}
func (this *MaxQueue)pop(n int){
    if n==this.Queue[0]{
        this.Queue = this.Queue[1:]
    }
}
func maxSlidingWindow(nums []int, k int) []int {
    window := Constructor()
    res := make([]int,0)
    for i:=0;i<len(nums);i++{
        if i<k-1{
            window.push(nums[i])
        }else{
            window.push(nums[i])
            res = append(res,window.max())
            window.pop(nums[i - k + 1])
        }
    }
    return res
}

//  ---
func maxSlidingWindow(nums []int, k int) []int {
    var stack []int
    var res []int
    for i, v := range nums {
        for len(stack) > 0 && v >= nums[stack[len(stack)-1]] {
            stack = stack[:len(stack)-1]
        }
        stack = append(stack, i)
        if i-k+1 > stack[0] {
            stack = stack[1:]
        }
        if i+1 >= k {
            res = append(res, nums[stack[0]])
        }
    }
    return res
}
```

------



### [152.乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/)

> 给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。
>
> 测试用例的答案是一个 32-位 整数。
>
> 子数组 是数组的连续子序列。
>

**解题思路**：
- 动态规划问题，最大的乘积有可能从两个地方转移，之前最小的或者之前最大的。
 
::: code-tabs

@tab cpp
```cpp

class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int n = nums.size();
        int dpMax = nums[0], dpMin = nums[0];
        int ans = nums[0];
        for(int i = 1; i < n; i++) {
            int tmpMax = max(dpMax * nums[i], dpMin * nums[i]);
            int tmpMin = min(dpMax * nums[i], dpMin * nums[i]);
            tmpMax = max(max(tmpMax, tmpMin), nums[i]);
            tmpMin = min(min(tmpMax, tmpMin), nums[i]);
            ans = max(ans, tmpMax);
            dpMax = tmpMax;
            dpMin = tmpMin;
        }
        return ans;
    }
};```
@tab golang
```go
func maxProduct(nums []int) int {
    n := len(nums)
	if n == 0{
		return 0
	}
	if n == 1{
		return nums[0]
	}
	maxDP := make([]int, n)
    minDP := make([]int, n)
    maxDP[0], minDP[0] = nums[0], nums[0]
    maxValue := nums[0]
    for i:=1;i<n;i++{
        maxDP[i] = Max(nums[i], Max(maxDP[i-1]*nums[i], minDP[i-1]*nums[i]))
        minDP[i] = Min(nums[i], Min(maxDP[i-1]*nums[i], minDP[i-1]*nums[i]))
        maxValue = Max(maxValue, maxDP[i])
    }
    return maxValue
}


func Max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func Min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
```

------



### [79.单词搜索](https://leetcode.cn/problems/word-search/)

**解题思路**：
- 数据量很小，暴力搜索即可，遍历每一位然后以每一位为开头尝试搜出结果，搜索就dfs。

::: code-tabs
@tab cpp
```cpp
class Solution {
public:
    vector<vector<int>> turn = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
    int flag = 0;
    bool dfs(vector<vector<char>>& board, vector<vector<bool>>& visit, string& word, int idx, int x, int y) {
        int n = board.size(), m = board[0].size();
        if(flag) return true;
        if(!(x >= 0 && x < n && y >=0 && y < m)) {
            return false;
        }
        if(idx == word.size()) {
            return true;
        }
        for(int i = 0; i < 4; i++) {
            int nx = x + turn[i][0];
            int ny = y + turn[i][1];
            if(nx >= 0 && nx < n && ny >= 0 && ny < m) {
                if(!flag && !visit[nx][ny] && word[idx] == board[nx][ny]) {
                    visit[nx][ny] = true;
                    if(dfs(board, visit, word, idx + 1, nx, ny)) {
                        flag = 1;
                        return true;
                    }
                    visit[nx][ny] = false;
                }
            }
        }
        return false;
    }
    bool exist(vector<vector<char>>& board, string word) {
        int n = board.size(), m = board[0].size();
        vector<vector<bool>> visit(n, vector<bool>(m));
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < m; j++) {
                if(board[i][j] == word[0]) {
                    visit[i][j] = true;
                    if(dfs(board, visit, word ,1 ,i ,j)) {
                        return true;
                    }
                    visit[i][j] = false;
                }
            }
        }
        return false;
    }
};
```
@tab golang
```go
func exist(board [][]byte, word string) bool {
  
    words, m, n:= []byte(word), len(board), len(board[0])
    
    for i:=0; i<m; i++{
        for j:=0; j<n; j++{
            if board[i][j] == words[0]{     // 寻找到匹配的第一个字符
                if search(i, j, board, words){
                    return true
                }
            } 
        }
    }
    
    return false
}


func search (i, j int, board [][]byte, words []byte) bool {

	m, n := len(board), len(board[0])

	if i < 0 || i >= m || j < 0 || j >=n || board[i][j] != words[0]{   // 不符合的条件
		return false
	}

	if len(words) == 1{	// 匹配到最后一个值， 返回
		return true
	}
	
	tmp := board[i][j]
	board[i][j] = '1'   // 由于words只能是字母，所以'1'不会被匹配

	if search(i+1, j, board, words[1:]) || search(i, j+1, board, words[1:]) || search(i-1, j, board, words[1:]) || search(i, j-1, board, words[1:]){
		
        return true
	
    }else{
        
        //注意由于board是slice引用类型，所以函数的修改会真正的修改原slice的值，所以需要重新改正回来
		board[i][j] = tmp
		return false
	}
}

```

------



### [128.最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence)

> 给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
>
> 请你设计并实现时间复杂度为 O(n) 的算法解决此问题。
>

**解题思路**：
- 这道题直接想动态规划的解法比较费劲，建议直接并查集暴力搞掉。

::: code-tabs

@tab cpp
```cpp

```
@tab golang
```go
func longestConsecutive(nums []int) int {
    sort.Ints(nums)
    exist := map[int]bool{}
    length := 1
    res := 0
    for i:=0; i<len(nums); i++ {
        if exist[nums[i]] {
            continue
        }
        exist[nums[i]] = true
        if !exist[nums[i]-1] {
            length = 1
        } else {
            length++
        }
        res = max(res, length)
    }
    return res
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}

//并查集
func find(h []int, x int) int {
	if h[x]	== x {
		return x
	}
	return find(h, h[x])
}

func longestConsecutive(nums []int) int {
	m := map[int]int{}
	n := len(nums)
	h := make([]int, n)
	count := make([]int, n)
	max := 0
	for i := range nums {
		_, ok := m[nums[i]]
		if ok {
			continue
		}
		m[nums[i]] = i
		h[i] = i
		count[i] = 1
		laddr, ok := m[nums[i] - 1]
		if ok {
			head := find(h, laddr)
			h[head] = i
			count[i] = count[head] + count[i]
		}
		raddr, ok := m[nums[i] + 1]
		if ok {
			head := find(h, raddr)
			h[head] = i
			count[i] = count[head] + count[i]
		}
		if count[i] > max {
			max = count[i]
		}
	}
	return max
}
```

------



### [48.旋转图像](https://leetcode.cn/problems/rotate-image/)

> 给定一个 n × n 的二维矩阵 matrix 表示一个图像。请你将图像顺时针旋转 90 度。
>
> 你必须在 原地 旋转图像，这意味着你需要直接修改输入的二维矩阵。请不要 使用另一个矩阵来旋转图像。

**解题思路**：
- 旋转图像其实就是横轴和纵轴做轴对称拼出来的，可以想一个点怎么通过做轴对称得到旋转90度。

::: code-tabs

@tab cpp
```cpp
class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < n/2; j++) {
                swap(matrix[j][i], matrix[n - 1 - j][i]);
            }
        }
        for(int i = 0; i < n; i++) {
            for(int j = i + 1; j < n; j++){
                swap(matrix[i][j], matrix[j][i]);
            }
        }
        return;
    }
};
```
@tab golang
```go
func rotate(matrix [][]int)  {
    n := len(matrix)
    for i := 0; i < n / 2; i++ {
        for j := 0; j < n; j++ {
            matrix[i][j], matrix[n-1-i][j] = 
            matrix[n-1-i][j], matrix[i][j]
        }
    }
    for i := 0; i < n; i++ {
        for j := 0; j < i; j++ {
            matrix[i][j], matrix[j][i] = 
            matrix[j][i], matrix[i][j]
        }
    }
}
```

------



### [169.多数元素](https://leetcode.cn/problems/majority-element/)

> 给定一个大小为 n 的数组 nums ，返回其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。
>
> 你可以假设数组是非空的，并且给定的数组总是存在多数元素。

**解题思路**：
- 摩根投票法，用一个选举位，记录当前选举位有多少个数，然后遍历数组
- 如果和选举位相同，就选举票数++，如果不同，就选举票数--
- 如果选举票数为0，就重新设置选举位
- 最后返回选举位数字即可。
- 
::: code-tabs

@tab cpp
```cpp
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int cand = -1;
        int candNum = 0;
        int n = nums.size();
        for(int i = 0; i < n; i++) {
            if(cand == -1) {
                cand = nums[i];
                candNum = 1;
            }else if(nums[i] != cand) {
                candNum--;
                if(candNum == 0) {
                    cand = -1;
                    candNum = 0;
                }
            }else {
                candNum ++;
            }
        }
        return cand;
    }
};
```
@tab golang
```go
func majorityElement(nums []int) int {
    major := 0
    count := 0

    for _, num := range nums {
        if count == 0 {
            major = num
        }
        if major == num {
            count += 1
        } else {
            count -= 1
        }
    }
    
    return major
}
```

------



### [179.最大数](https://leetcode.cn/problems/largest-number/)

> 给定一组非负整数 `nums`，重新排列每个数的顺序（每个数不可拆分）使之组成一个最大的整数。
>
> **注意：**输出结果可能非常大，所以你需要返回一个字符串而不是整。
> 
::: code-tabs
**解题思路**：
- 自定义一下排序，对于两个字符串a, b 如果a前b后大于b前a后，就返回1，反之返回0。

@tab cpp
```cpp
class Solution {
public:
    string largestNumber(vector<int>& nums) {
        vector<string> numString;
        for(auto n:nums){
            numString.push_back(to_string(n));
        }
        sort(numString.begin(),numString.end(),[](string a,string b) {
            return a + b > b + a;
        });
        if(numString[0] == "0") return "0";
        string res;
        for(int i = 0; i < numString.size(); i++) {
            res += numString[i];
        }
        return res;
    }
};
```
@tab golang
```go
func Map(vs []int, f func(int) string) []string {
    vsm := make([]string, len(vs))
    for i, v := range vs {
        vsm[i] = f(v)
    }
    return vsm
}

func largestNumber(nums []int) string {
    strs := Map(nums, func(num int) string{
        return fmt.Sprintf("%d", num)
    })

    sort.Slice(strs, func(i, j int) bool{
        return strs[i]+strs[j] > strs[j]+strs[i]
    })
    
    if strs[0]=="0"{
        return "0"
    }

    return strings.Join(strs, "")
}
```

------



### [560.和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)

> 给你一个整数数组 `nums` 和一个整数 `k` ，请你统计并返回该数组中和为 `k` 的连续子数组的个数 。

```go
func subarraySum(nums []int, k int) int {
	count := 0
	hash := map[int]int{0: 1}
	preSum := 0

	for i := 0; i < len(nums); i++ {
		preSum += nums[i]
		if hash[preSum-k] > 0 {
			count += hash[preSum-k]
		}
		hash[preSum]++
	}
	return count
}
```

### [498.对角线遍历](https://leetcode.cn/problems/diagonal-traverse/)

> 给你一个大小为 `m x n` 的矩阵 `mat` ，请以对角线遍历的顺序，用一个数组返回这个矩阵中的所有元素。

```go
func findDiagonalOrder(mat [][]int) []int {
	m, n := len(mat), len(mat[0])
	ret := make([]int, m*n)
	r, c := 0, 0
	for i := 0; i < m*n; i++ {
		ret[i] = mat[r][c]
		if (r+c)%2 == 0 {
			 if c == n-1 {
				r++
			} else if r == 0 {
				c++
			} else {
				r, c = r-1, c+1
			}
		} else {
			if r == m-1 {
				c++
			} else if c == 0 {
				r++
			} else {
				r, c = r+1, c-1
			}
		}
	}
	return ret
}
```

### [207.课程表](https://leetcode.cn/problems/course-schedule/)

> 你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。
>
> 在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程  bi 。
>
> 例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
> 请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。



```go
func canFinish(numCourses int, prerequisites [][]int) bool {
    degrees := make([]int, numCourses)
    g := map[int][]int{}
    for _, item := range prerequisites{
        g[item[1]] = append(g[item[1]], item[0])
        degrees[item[0]]++
    }

    nodes :=[]int{} // bfs 队列
    for i:=0;i<numCourses; i++{
        if degrees[i] ==0{
            nodes = append(nodes, i)
        }
    }

    res := 0
    nodesLen := len(nodes)
    for nodesLen>0{
        for i:=0; i<nodesLen; i++{
            res++
            degrees[nodes[i]]--
            for _, next := range g[nodes[i]]{
                degrees[next]--
                if degrees[next]==0{
                    nodes = append(nodes, next)
                }
            }
        }
        nodes = nodes[nodesLen:]
        nodesLen = len(nodes)
    }

    return res == numCourses
}
```



### [11.盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

> 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。
>
> 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
>
> 返回容器可以储存的最大水量。
>
> 说明：你不能倾斜容器。
>

```go
func maxArea(height []int) (ans int) {
    left, right := 0, len(height)-1
    for left < right {
        area := (right - left) * min(height[left], height[right])
        ans = max(ans, area)
        if height[left] < height[right] {
            left++
        } else {
            right--
        }
    }
    return
}

func min(a, b int) int { if a > b { return b }; return a }
func max(a, b int) int { if a < b { return b }; return a }
```

### [74.搜索二维矩阵](https://leetcode.cn/problems/search-a-2d-matrix/)

> 编写一个高效的算法来判断 m x n 矩阵中，是否存在一个目标值。该矩阵具有如下特性：
>
> 每行中的整数从左到右按升序排列。
> 每行的第一个整数大于前一行的最后一个整数。

```go
func searchMatrix(matrix [][]int, target int) bool {
    var r, c = len(matrix), len(matrix[0])
	for i,j := r - 1, 0;i >=0 && j < c; {
		if matrix[i][j] == target{
			return true
		}else if matrix[i][j] < target{
			j++
		}else{
			i--
		}
	}
	return false
}
```

