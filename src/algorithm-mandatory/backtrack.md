### [46.全排列](https://leetcode.cn/problems/permutations/)

> 给定一个不含重复数字的数组 `nums` ，返回其 *所有可能的全排列* 。你可以 **按任意顺序** 返回答案。
>
**解题思路**：
- 这道题是**dfs**的经典题目
- dfs的时候，我们用一个tmp保存正在搜索的排列，用visit记录搜索过的位,注意在dfs中，我们尽量传引用而不是传值，不然会炸，所以我们需要一直利用一些变量，dfs前设置好，dfs完再清掉。
- 每次搜索时，分别去遍历每一位，如果这一位没遍历，就将这一位压入tmp，visit记录tmp然后进入下次dfs。
- 注意在dfs返回后，要给visit的相应位归0，tmp同时也要pop()掉，好让其接着用于下一个分支。
- 递归退出的条件是找到一个全排列，也就是tmp大小为n

::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    vector<vector<int>> ans;
    void dfs(vector<int>& nums, vector<int>& visit, vector<int>& tmp) {
        int n = nums.size();
        if(tmp.size() == n) {
            ans.emplace_back(tmp);
            return;
        }
        for(int i = 0; i < n; i++) {
            if(visit[i]) {
                continue;
            }
            tmp.emplace_back(nums[i]);
            visit[i] = 1;
            dfs(nums, visit, tmp);
            tmp.pop_back();
            visit[i] = 0;
        }
    }
    vector<vector<int>> permute(vector<int>& nums) {
        int n = nums.size();
        vector<int> visit(n);
        vector<int> tmp;
        dfs(nums, visit, tmp);
        return ans;
    }
};
```
@tab golang

```go
var result [][]int
var track []int
var used []bool
func permute(nums []int) [][]int {
    result = [][]int{}
    track = []int{}
    used = make([]bool,len(nums))
    backtrack(nums)
    return result
}

func backtrack(nums []int){
    if len(nums)==len(track){
        result = append(result,append([]int{},track...))
    }
    for i:=0;i<len(nums);i++{
        if used[i]{
            continue
        }
        used[i] = true
        track = append(track,nums[i])
        backtrack(nums)
        track = track[:len(track)-1]
        used[i] = false
    }
}
```

------



### [39.组合总和](https://leetcode.cn/problems/combination-sum)

> 给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。
>
> candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是不同的。 
>
> 对于给定的输入，保证和为 target 的不同组合数少于 150 个。
>
**解题思路**：
- **dfs**问题，就是回溯的思路，递归返回的边界是，要么target为0，即找到了结果返回，要么用完了所有数，idx = n返回。
- 注意一下对于每个数，是尝试拿多少个当前数直到target超了,所以dfs完后也要pop相应个数。

::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    vector<vector<int>> ans;
    void dfs(vector<int>& candidates, vector<int>& t,int target, int idx) {
        int n = candidates.size();
        if(target == 0) {
            ans.emplace_back(t);
            return;
        } else if(target < 0) {
            return;
        }
        if(idx >= n) {
            return;
        }
        for(int cnt = 0; cnt*candidates[idx] <= target; cnt++) {
            for(int i = 0;i < cnt; i++) {
                t.emplace_back(candidates[idx]);
            }
            dfs(candidates, t, target - cnt*candidates[idx], idx + 1);
            for(int i = 0;i < cnt; i++) {
                t.pop_back();
            }            
        }
    }
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<int> t;
        dfs(candidates, t, target, 0);
        return ans;
    }
};
```
@tab golang

```go
var result [][]int
var track []int
var sum int
func combinationSum(candidates []int, target int) [][]int {
    result = [][]int{}
    track = []int{}
    sum = 0
    backtrack(candidates,target,0)
    return result
}
func backtrack(candidates []int,target int,start int){
    if sum==target{
        result = append(result,append([]int{},track...))
    }
    if sum>target{
        return
    }
    for i:=start;i<len(candidates);i++{
        sum += candidates[i]
        track = append(track,candidates[i])
        backtrack(candidates,target,i)
        sum -= candidates[i]
        track = track[:len(track)-1]
    }
}
```
:::
------



### [78.子集](https://leetcode.cn/problems/subsets/)

> 给你一个整数数组 `nums` ，数组中的元素 **互不相同** 。返回该数组所有可能的子集（幂集）。
>
> 解集 **不能** 包含重复的子集。你可以按 **任意顺序** 返回解集。
>
- 这道题当然可以用dfs回溯来做，但我推荐另一种做法，**按位枚举**。
- 可以用一个二进制数来表示子集中的拿取情况，二进制数的位数等于子集的大小，每一位来表示拿或者没拿，所以每种子集拿取情况都有一个唯一的二进制数来表示。
- 二进制数的边界是2^n^ - 1。即n个1组成的二进制数，开始当然是0，n个0组成的二进制数。
- 然后遍历从0到2^n^ - 1中的每一个数，按照当前数的二进制位生成子集。
- 这样做法的好处是不用递归

::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        int n = nums.size();
        int boundary = pow(2,n);
        vector<vector<int>> ans;
        vector<int> tmp;
        for(int i = 0; i < boundary; i++) {
            for(int j = 0; j < n; j++) {
                if((i >> j) & 1) {
                    tmp.emplace_back(nums[j]);
                }
            }
            ans.emplace_back(tmp);
            tmp.clear();
        }
        return ans;
    }
};
```
@tab golang

```go
var result [][]int
var track []int
func subsets(nums []int) [][]int {
    result = [][]int{}
    track = []int{}
    backtrack(nums,0)
    return result
}
func backtrack(nums []int,start int){
    result = append(result,append([]int{}, track...))
    for i:=start;i<len(nums);i++{
            track = append(track,nums[i])
            backtrack(nums,i+1)
            track = track[:len(track)-1]
    }
}
```

:::
------

### [40.组合总和 II](https://leetcode.cn/problems/combination-sum-ii/)

> 给定一个候选人编号的集合 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合。
>
> candidates 中的每个数字在每个组合中只能使用 一次 。
>
- 这道题和组合总和1相比限制了每个数字只能使用1次，看上去变简单了；但是candidates的大小很大，如果直接dfs会爆掉。
- 我们可以变化一下，题目说了每个数字有重复，且数字范围是0-50，再考虑到target只有30，所以有用的数字范围就是0-30,我们可以用一个hash表记录个数，这样又回到组合总和1了。
- 不过稍微变化的是，这次对一个数不光是尝试拿1个，2个，拿到target为0为止，还有你可能提前把这个数拿空的情况，所以有两个限制。

::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    void dfs(vector<int>& hash,int target,int index,vector<int>& tmp,vector<vector<int>>& ans){
        if(target <= 0){
            if(target == 0) ans.emplace_back(tmp);
            return;
        }
        int n = hash.size();
        //当前位置找到非0的
        while(index < hash.size() && hash[index] == 0){
            index++;
        }
        //超出边界
        if(index >= n) {
			return;
		} 
        dfs(hash, target, index + 1, tmp, ans);
        for(int i=0; i<hash[index]; i++){
            for(int j = 0; j <= i; j++){
                tmp.emplace_back(index);
            }
            target -= index;
            dfs(hash, target, index+1, tmp, ans);
            for(int j = 0; j <= i; j++){
                tmp.pop_back();
            }
        }
    }

    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        vector<int> hash(31);
        for(int i=0;i<candidates.size();i++){
            if(candidates[i]<=30) hash[candidates[i]]++;
        }
        vector<int> temp;
        vector<vector<int>> ans;
        dfs(hash,target,0,temp,ans);
        return ans; 
    }
};
```

@tab golang

```go

func combinationSum2(candidates []int, target int) [][]int {
	sort.Ints(candidates)
	res := [][]int{}

	var dfs func(start int, temp []int, sum int)
	dfs = func(start int, temp []int, sum int) {
		if sum >= target {
			if sum == target {
				t := make([]int, len(temp))
				copy(t, temp)
				res = append(res, t)
			}
			return
		}
		for i := start; i < len(candidates); i++ {
			if i-1 >= start && candidates[i-1] == candidates[i] {
				continue
			}
			temp = append(temp, candidates[i])
			dfs(i+1, temp, sum+candidates[i])
			temp = temp[:len(temp)-1]
		}
	}
	dfs(0, []int{}, 0)
	return res
}
```
:::
------

### [47.全排列 II](https://leetcode.cn/problems/permutations-ii/)

> 给定一个可包含重复数字的序列 nums ，按任意顺序返回所有不重复的全排列。
**解题思路**：
- 这道题跟全排列相比多了一个去重，去重也好办
- 先给nums排序，然后取数的时候注意一下，如果前一个和当前数相同，且前一个没访问过这种情况，直接跳过
- 也就是说，对于重复的数，我们只会从前往后一个一个取，这样就不会出现重复的排列。

::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    vector<vector<int>> ans;
    void dfs(vector<int>& nums,vector<int>& visit,vector<int>& t){
        int n = nums.size();
        if(t.size() == n) {
            ans.emplace_back(t);
            return;
        }
        for(int i=0;i<n;i++){
            if(!visit[i]){
                if(i > 0 && !visit[i-1] && nums[i-1] == nums[i]) {
					continue;
				}
                visit[i] = 1;
                t.emplace_back(nums[i]);
                dfs(nums, visit, t);
                t.pop_back();
                visit[i] = 0;
            }
            
        }
    }
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        sort(nums.begin(),nums.end());
        int n=nums.size();
        vector<int> visit(n);
        vector<int> t;
        dfs(nums,visit,t);
        return ans;
    }
};
```
@tab golang

```go
func permuteUnique(nums []int) [][]int {
	res := [][]int{}
	used := make([]bool, len(nums))
	sort.Ints(nums)
	helper([]int{}, nums, used, &res)
	return res
}

func helper(path, nums []int, used []bool, res *[][]int) {
	if len(path) == len(nums) {
		temp := make([]int, len(nums))
		copy(temp, path)
		*res = append(*res, temp)
		return
	}
	for i := 0; i < len(nums); i++ {
		if i-1 >= 0 && nums[i-1] == nums[i] && !used[i-1] {
			continue
		}
		if used[i] {
			continue
		}
		path = append(path, nums[i])
		used[i] = true
		helper(path, nums, used, res)
		path = path[0 : len(path)-1]
		used[i] = false
	}
}
```
:::


