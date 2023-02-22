### [221.最大正方形](https://leetcode.cn/problems/maximal-square/)

> 在一个由 `'0'` 和 `'1'` 组成的二维矩阵内，找到只包含 `'1'` 的最大正方形，并返回其面积。
>
**解题思路**：
- **二维dp**,dp[i][j] = 以(i, j)为右下顶点的最大正方形边长。
- matrix[i][j] = 0时，dp[i][j] = 0
- matrix[i][j] = 1时，可以联想到dp[i][j] 与 dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]有关，其中任何一个为0都以为着dp[i][j] = 1
- 可以画一画图，会发现dp[i][j]取决于三者的最小值，递推为dp[i][j] = 三者最小值 + 1
- dp的做题思路是先找到dp的形式，基本就是看题目给的1维2维就知道了，然后想dp代表了什么，之后再想当前位置的dp需要之前哪些信息，想出递推关系。
- 递推关系知道了，最次你也能写记忆化搜索；或者熟练的直接写dp。

::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        int m=matrix.size(),n=matrix[0].size();
        vector<vector<int>> dp(m,vector<int>(n));
        int ans=0;
        for(int i = 0;i < m; i++){
            for(int j = 0;j < n; j++){
                if(matrix[i][j] == '1'){
                    if(i == 0 || j == 0) {
                        dp[i][j] = 1;
                    } else{
                        dp[i][j] = min(min(dp[i - 1][j], dp[i][j - 1]), dp[i - 1][j - 1]) + 1;
                    }
                    ans = max(ans, dp[i][j]);
                }else{
                    dp[i][j] = 0;
                }
            }
        }
        return ans*ans;
    }
};
```
@tab java
```java
class Solution {
    public int maximalSquare(char[][] matrix) {
        int maxSide = 0;
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return maxSide;
        }
        int rows = matrix.length, columns = matrix[0].length;
        int[][] dp = new int[rows][columns];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                if (matrix[i][j] == '1') {
                    if (i == 0 || j == 0) {
                        dp[i][j] = 1;
                    } else {
                        dp[i][j] = Math.min(Math.min(dp[i - 1][j], dp[i][j - 1]), dp[i - 1][j - 1]) + 1;
                    }
                    maxSide = Math.max(maxSide, dp[i][j]);
                }
            }
        }
        int maxSquare = maxSide * maxSide;
        return maxSquare;
    }
}
```
@tab golang

```go
func maximalSquare(matrix [][]byte) int {
	if len(matrix) == 0 || len(matrix[0]) == 0 {
		return 0
	}
	m, n, max := len(matrix), len(matrix[0]), 0
	dp := make([][]int, m+1)
	for i := range dp {
		dp[i] = make([]int, n+1)
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if matrix[i-1][j-1] == '1' {
				dp[i][j] = min(dp[i-1][j-1], min(dp[i-1][j], dp[i][j-1])) + 1
			}
			if dp[i][j] > max {
				max = dp[i][j]
			}
		}
	}
	return max * max
}
func min(x, y int) int {
	if x < y {
		return x
	}
	return y
}
```
:::


### [53.最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

> 给你一个整数数组nums，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
>
> **子数组** 是数组中的一个连续部分。

**解题思路**：**动态规划**经典题目，用sumNum来表示以当前元素结尾的最大子数组和；那么整个数组的最大子数组和就是所有位置的最大子数组和取最大，就可以得到答案。时间复杂度O(n)，空间复杂度O(1)

::: code-tabs

@tab cpp

```cpp
    int maxSubArray(vector<int>& nums) {
        int ans = INT_MIN;
        int sum = 0;
        for(int i = 0; i < nums.size(); i++) {
            sum = max(sum + nums[i], nums[i]);
            ans = max(ans, sum);
        }
        return ans;
    }
```
@tab java
```java
class Solution {
    public int maxSubArray(int[] nums) {
        int ans = nums[0];
        int sum = 0;
        for(int num: nums) {
            if(sum > 0) {
                sum += num;
            } else {
                sum = num;
            }
            ans = Math.max(ans, sum);
        }
        return ans;
    }
}
```

@tab golang

```go
func maxSubArray(nums []int) int {
    dp := make([]int, len(nums))
    maxSum := 0
    for i := 0; i < len(nums); i++ {
        dp[i] = nums[i]
        if i == 0 {
            maxSum = dp[i]
            continue
        }
        if dp[i-1] + dp[i] > dp[i] {
            dp[i] += dp[i-1]
        }
        if dp[i] > maxSum {
            maxSum = dp[i]
        }
    }
    return maxSum
}
```

:::

### [300.最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence)

> 给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
>
> 子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。
>
**解题思路**：
- 这道题两个思路，比较容易想的思路是dp，时间复杂度O(n^2^),空间复杂度O(n)；还有一个思路是贪心+二分查找，时间复杂度O(nlogn), 空间复杂度O(n)
- 思路一：一维dp
- - dp[i]表示以第i位为末尾的最长严格递增子序列长度。所以得到dp[i]可以遍历0到i - 1，如果nums[j] < nums[i]，就表示可以在以j为底的最长严格递增子序列后续上一位，然后找到最大的j即可。
- 思路二: 贪心
- - 首先贪心的思路是，我们希望它上升的越“慢”越好，我们有一个数组d，d[i]代表长度为i的最长递增子序列末尾元素的最小值，在这个贪心思路里，越长肯定末尾元素更大。
- 如果nums[i] 大于 d.back(),那说明出现了一个更大的最长递增子序列，把nums[i]加进d中。
- 不然就找到nums[i]在d中的位置，即找到d[j - 1] < nums[i] < d[j]，nums[i]就可以替换d[j]让长度为j的最小值末尾元素更小。查找这步用二分。 
::: code-tabs
@tab cpp
```cpp
//思路1，dp
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n=nums.size();
        vector<int> dp(n,1);
        for(int i = 1;i < n; i++){
            for(int j = 0; j < i; j++){
                if(nums[i] > nums[j]) {
                    dp[i] = max(dp[i], dp[j] + 1);
                }
            }
        }
        int ans=INT_MIN;
        for(auto i:dp){
            ans=max(i,ans);
        }
        return ans;
    }
};
//思路2，贪心，二分查找
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        vector<int> d;
        d.push_back(nums[0]);
        for(int i = 1; i < n; i++) {
            if(nums[i] > d[d.size() - 1]) {
                d.push_back(nums[i]);
            } else{
                auto p = lower_bound(d.begin(),d.end(),nums[i]);
                *p = nums[i];
            }
        }
        return d.size();
    }
};
```
@tab java

```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for(int i=1;i<n;i++) {
            for(int j=0;j<i;j++) {
                if(nums[i] > nums[j]) {
                    dp[i] = Math.max(dp[j] + 1, dp[i]);
                }
            }
        }
        int maxLen = 1;
        for(int len : dp) {
            if(len > maxLen) maxLen = len;
        }
        return maxLen;
    }
}
```
@tab golang

```go
func lengthOfLIS(nums []int) int {
    res := 0
    dp := make([]int,len(nums))
    for i:=0;i<len(nums);i++{
        dp[i] = 1
    }
    for i:=1;i<len(nums);i++{
        for j:=0;j<i;j++{
            if nums[i]>nums[j]{
                dp[i] = max(dp[i],dp[j]+1)
            }
        }
    }
    for i:=0;i<len(nums);i++{
        res = max(res,dp[i])
    }
    return res
}

func max(a,b int)int{
    if a>b{
        return a
    }
    return b
}
```
:::


### [32.最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/)

> 给你一个只包含 `'('` 和 `')'` 的字符串，找出最长有效（格式正确且连续）括号子串的长度。
>
**解题思路**：
- 这道题思路是**dp**,dp[i]代表以i为最后一位，最长有效括号子串的长度。
- 首先如果s[i] = '('时，那么以他为最有一位不可能构成最长有效括号子串，dp[i] = 0
- s[i] = ')'时，可以想到dp[i]应该跟dp[i - 1]有关，因为要组成一对，所以要看left = i - dp[i - 1] + 1这一位是否为'(',如果是，那么dp[i] = dp[i - 1] + 2
- 还应该考虑到left左边一位的最长有效括号，他也能拼一起，所以dp[i] = dp[i - 1] + 1 + dp[left - 1]
::: code-tabs
@tab cpp

```cpp
class Solution {
public:
    int longestValidParentheses(string s) {
        int n = s.size();
        int ans = 0;
        //dp表示的是第 i 个位置结尾的有效括号长度
        vector<int> dp(n);
        for(int i = 1; i < n; i++) {
            if(s[i] == '(') {
                continue;
            }
            int leftPos = i - dp[i - 1] - 1;
            if(leftPos < 0) {
                continue;
            } 
            if(s[leftPos] == '(') {
                dp[i] = i - leftPos + 1;
                if(leftPos > 0) {
                    dp[i] += dp[leftPos - 1];
                } 
            }
            ans = max(ans, dp[i]);
        }
        return ans;
    }
};
```
@tab java
```java
class Solution {
    public int longestValidParentheses(String s) {
        int n = s.length();
        if(n==0) return 0;
        int[] dp = new int[n];
        dp[0] = 0;
        int res = 0;
        for(int i=1;i<n;i++){
            if(s.charAt(i) == ')'){
                if(s.charAt(i-1) == '('){
                    dp[i] = (i>=2? dp[i-2]:0) + 2;
                }else if (i>dp[i-1] && s.charAt(i-dp[i-1]-1) == '('){
                    dp[i] = dp[i-1] + (i-dp[i-1]>=2? dp[i-dp[i-1]-2]:0) + 2;
                }
                res = Math.max(res, dp[i]);
            }
        }
        return res;
    }
}
```
@tab golang

```go
func longestValidParentheses(s string) int {
    if len(s) == 0 {
        return 0
    }
    longest, n := 0, len(s)
    dp := make([]int, n) // dp[i]是以i结尾的子串的最长有效括号
    dp[0] = 0
    for i := 1; i < n; i++ {
        if s[i] == '(' {
            continue
        }
        if s[i-1] == '(' {
            if i - 2 >= 0 {
                dp[i] = dp[i-2] + 2
            }else {
                dp[i] = 2
            }
        }else {
            if i - dp[i-1] -1 >= 0 && s[i-dp[i-1]-1] == '(' {
                if i - dp[i-1] - 2 >=0 {
                    dp[i] = dp[i-dp[i-1]-2] + dp[i-1] + 2
                } else {
                    dp[i] = dp[i-1] + 2
                }
            }
        }
        longest = max(dp[i], longest)
    }
    return longest
}

func max (x, y int) int {
    if x > y {
        return x
    }
    return y
}
```

:::

### [322.零钱兑换](https://leetcode.cn/problems/coin-change)

> 给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
>
> 计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。
>
> 你可以认为每种硬币的数量是无限的。
>
**解题思路**：
- 可以先想2维dp,dp[i][j]代表以第i位为底，凑成金额为j的最少硬币数。
- 易得要么不拿，即dp[i - 1][j]，要么在dp[i][j - coin[i - 1]]的基础上再拿一个，凑成金额为j。也就是dp[i][j] = min(dp[i - 1][j], dp[i][j - coin[i - 1]])
- 这时候可以画个表，横轴是i，纵轴是j，看一下dp[i][j]的递推式，容易看出来dp[i][j]是可以状态压缩的。
- 每次i往前遍历一位，i之前的dp其实并没有用到，可以把i压缩掉，变成一维dp。
::: code-tabs
@tab cpp

```cpp
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        int n = coins.size();
        vector<int> dp(amount + 1, 1e9);
        dp[0] = 0;
        for(int i = 1; i <= n; i++) {
            for(int j = 1; j <= amount; j++) {
                if(j >= coins[i - 1]) {
                    dp[j] = min(dp[j], dp[j - coins[i - 1]] + 1);
                }
            }
        }
        if(dp[amount] == 1e9) return -1;
        return dp[amount];
    }
};
```
@tab java
```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount+1];
        Arrays.fill(dp, amount+1);
        dp[0] = 0;
        for(int i=1;i<=amount;i++) {
            for(int coin : coins) {
                if(i >= coin) {
                    dp[i] = Math.min(dp[i-coin] + 1, dp[i]);
                }
            }
        }
        return dp[amount] == amount+1? -1 : dp[amount];
    }
}
```
@tab golang

```go
func coinChange(coins []int, amount int) int {
    dp := make([]int,amount+1)
    for i:=0;i<len(dp);i++{
        dp[i] = amount + 1
    }
    dp[0] = 0
    for i:=1;i<=amount;i++{
        for j:=0;j<len(coins);j++{
            if coins[j] <= i{
                dp[i] = min(dp[i],dp[i-coins[j]]+1)
            }
         }
    }
    if dp[amount]>amount{
        return -1
    }
    return dp[amount]
}

func min(a,b int)int{
    if a<b{
        return a
    }
    return b
}
```
:::


### [1143.最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence)

> 给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 0 。
>
> 一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
>
> 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
> 两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。
**解题思路**：
- 属于dp中的模板题目，dp[i][j]表示text1中第i位和text2中第j位结尾的最长公共子序列。
- 如果text1[i] == text2[j]，那么dp[i][j] = dp[i - 1][j - 1] + 1
- 不然dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int n = text1.size();
        int m = text2.size();
        vector<vector<int>> dp(n + 1, vector<int>(m + 1));
        for(int i = 1; i <= n; i++) {
            for(int j = 1; j <= m; j++) {
                if(text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                }else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[n][m];
    }
};
```
@tab java
```java
class Solution {
    public int maxSubArray(int[] nums) {
        int ans = nums[0];
        int sum = 0;
        for(int num: nums) {
            if(sum > 0) {
                sum += num;
            } else {
                sum = num;
            }
            ans = Math.max(ans, sum);
        }
        return ans;
    }
}
```
@tab golang

```go
func longestCommonSubsequence(text1 string, text2 string) int {
    M,N := len(text1),len(text2)
    dp := make([][]int,M+1)
    for i:=0;i<M+1;i++{
        dp[i] = make([]int,N+1)
    }
    for i:=1;i<=M;i++{
        for j:=1;j<=N;j++{
            if text1[i-1]==text2[j-1]{
                dp[i][j] = dp[i-1][j-1] + 1
            }else{
                dp[i][j] = max(dp[i][j-1],dp[i-1][j])
            }
        }
    }
    return dp[M][N]
}

func max(a,b int)int{
    if a>b{
        return a
    }
    return b
}
```
:::


### [121.买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock)

> 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
>
> 你只能选择 某一天买入这只股票，并选择在未来的某一个不同的日子卖出该股票。设计一个算法来计算你所能获取的最大利润。
>
> 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
>

**解题思路**：可以遍历每一天卖出的最大收益，从中取收益最多的一天；每一天最大收益一定是之前股票最低的一天买入，所以就可以用一个数保存之前遍历的股票最小值，然后一遍遍历搞定。时间复杂度O(n)。


::: code-tabs

@tab cpp

```cpp
   int maxProfit(vector<int>& prices) {
        int ans = 0;
        int minNum = INT_MAX;
        int n = prices.size();
        for(int i = 0; i < n; i++) {
            minNum = min(minNum, prices[i]);
            ans = max(ans,prices[i] - minNum);
        }
        return ans;        
    }
```
@tab java
```java
class Solution {
    public int maxProfit(int[] prices) {
        if(prices == null) return 0;
        if(prices.length <= 1) return 0;
        Deque<Integer> stack = new ArrayDeque<>();
        stack.addLast(prices[0]);
        int profit = 0;
        for(int i=0;i<prices.length;i++){
            if(prices[i]<=stack.peekLast()){
                stack.addLast(prices[i]);
            }else{
                profit = Math.max(profit, prices[i] - stack.peekLast());
            }
        }
        return profit;
    }
}
```

@tab golang

```go
func maxProfit(prices []int) int {
    n := len(prices)
    dp := make([]int,n+1)
    dp[0] = 0
    res := 0
    minPrice := prices[0]
    for i:=1;i<n;i++{
        minPrice = min(prices[i],minPrice)
        dp[i] = max(dp[i-1],prices[i]-minPrice)
    }
    for i:=0;i<n+1;i++{
        res = max(dp[i],res)
    }
    return res
}

func max(a,b int)int{
    if a>b{
        return a
    }
    return b
}

func min(a,b int)int{
    if a<b{
        return a
    }
    return b
}
```

:::

### [72.编辑距离](https://leetcode.cn/problems/edit-distance)

> 给你两个单词 word1 和 word2， 请返回将 word1 转换成 word2 所使用的最少操作数  。
>
> 你可以对一个单词进行如下三种操作：
>
> - 插入一个字符
> - 删除一个字符
> - 替换一个字符
**解题思路**：
- 最长公共子序列题目的变种
- dp[i][j] 表示word1 中前i个字符变成 word2 中前j个字符的代价。
- 可以 word1 删除一个字符变word[0:i - 1]再变成word2， dp[i - 1][j] + 1
- 还可以 word1 变成 word2[0:j - 1] 再添加一个字符变成words2 dp[i][j - 1] + 1
- 还可以替换，word1[i] == word2[j]时，dp[i][j] = dp[i - 1][j - 1]
- word1[i] != word2[j]时，dp[i][j] = dp[i - 1][j - 1] + 1;
::: code-tabs
@tab cpp

```cpp
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1));
        for(int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for(int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        for(int i = 1; i <= m; i++) {
            for(int j = 1; j <= n; j++) {
                int tmp = min(1 + dp[i - 1][j], dp[i][j - 1] + 1);
                if(word1[i - 1] == word2[j - 1]) {
                    tmp = min(tmp, dp[i - 1][j - 1]);
                }else {
                    tmp = min(tmp, dp[i - 1][j - 1] + 1);
                }
                dp[i][j] = tmp;
            }
        }
        return dp[m][n];
    }
};
```
@tab java
```java
class Solution {
    public int minDistance(String word1, String word2) {
        int m=word1.length();
        int n=word2.length();
        int[][] edit = new int[m+1][n+1];
        for(int i=1;i<=m;i++){
            edit[i][0]=i;
        }
        for(int j=1;j<=n;j++){
            edit[0][j]=j;
        }
        for(int i=1;i<=m;i++){
            for(int j=1;j<=n;j++){
                if(word1.charAt(i-1)==word2.charAt(j-1)){
                    edit[i][j] = edit[i-1][j-1];
                }
                else{
                    edit[i][j] = Math.min(Math.min(edit[i-1][j-1]+1,edit[i][j-1]+1),
                                          edit[i-1][j]+1);
                }
            }
        }
        return edit[m][n];
    }
}
```
@tab golang

```go
func minDistance(word1 string, word2 string) int {
    m, n := len(word1), len(word2)
    dp := make([][]int, m+1) //dp[i][j]含义：word1的第i位转换word2的第j位所使用的最少操作数
    for i:=0; i<=m; i++ {
        inline := make([]int, n+1)
        dp[i] = inline
    }
    for i:=1; i<=m; i++ {
        dp[i][0] = i
    }
    for i:=1; i<=n; i++ {
        dp[0][i] = i
    }
    for i:=1; i<=m; i++ {
        for j:=1; j<=n; j++ {
            if word1[i-1] == word2[j-1] {
                dp[i][j] = dp[i-1][j-1] //跳过
            } else {     
                dp[i][j] = min(dp[i][j-1]+1, min(dp[i-1][j]+1, dp[i-1][j-1]+1)) //分别代表：插入、删除、替换动作
            }
        }
    }
    return dp[m][n]
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}
```
:::


### [70.爬楼梯](https://leetcode.cn/problems/climbing-stairs/)

> 假设你正在爬楼梯。需要 `n` 阶你才能到达楼顶。
>
> 每次你可以爬 `1` 或 `2` 个台阶。你有多少种不同的方法可以爬到楼顶呢？
>
**解题思路**：
- 先考虑一维dp，dp[i]表示调到第i阶需要多少步,dp[i] = dp[i - 1] + dp[i - 2]
- 会发现dp[i]只需要dp[i - 1],dp[i - 2]，直接优化了，其实就是斐波那契数列问题。
::: code-tabs
@tab cpp
```cpp
class Solution {
public:
    int climbStairs(int n) {
        int dp0 = 1;
        int dp1 = 2;
        for(int i = 3; i <= n; i++) {
            int dp2 = dp0 + dp1;
            dp0 = dp1;
            dp1 = dp2;
        }
        if(n == 1) {
            return dp0;
        }else {
            return dp1;
        }
    }
};
```
@tab java
```java
class Solution {
    public int climbStairs(int n) {
        if(n == 1){
            return 1;
        }
        int[] dp = new int[n+1];
        dp[1] = 1;
        dp[2] = 2;
        for(int i=3;i<=n;i++){
            dp[i] = dp[i-1] + dp[i-2];
        }
        return dp[n];
    }
}
```
@tab golang
```go
func climbStairs(n int) int {
    if n<=2{
        return n
    }
    dp := make([]int,n+1)
    dp[1],dp[2] = 1,2
    for i:=3;i<=n;i++{
        dp[i] = dp[i-1]+dp[i-2]
    }
    return dp[n]
}
```
:::


### [122.买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii)

> 给你一个整数数组 prices ，其中 prices[i] 表示某支股票第 i 天的价格。
>
> 在每一天，你可以决定是否购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。你也可以先购买，然后在 同一天 出售。
>
> 返回 你能获得的 最大 利润 。
>
**解题思路**：
- dp[i][0]代表第i天手里没股票最大收益，dp[i][1]代表第i天手里有股票
- dp[i][0]要么是i - 1天也没股票，要么是i - 1天把股票卖了。
- dp[i][1]要么是第i - 1天手里有股票，要么是i - 1天买进股票。
::: code-tabs
@tab cpp

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) { //
        int DP[prices.size()][2];
        DP[0][0]=0;
        DP[0][1]=-prices[0];
        for(int i=1;i<prices.size();i++) {
            DP[i][0]=max(DP[i-1][0],DP[i-1][1]+prices[i]);
            DP[i][1]=max(DP[i-1][1],DP[i-1][0]-prices[i]);
        }
        
        return DP[prices.size()-1][0];
    }
};
```
@tab java
```java
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        if(n<=1) return 0;
        int profit = 0;
        for(int i=0;i<n-1;i++){
            if(prices[i+1]>prices[i]) profit += prices[i+1] - prices[i];
        }
        return profit;
    }
}
```
@tab golang

```go
func maxProfit(prices []int) int {
    dp_i_0,dp_i_1 := 0,math.MinInt64
    for i:=0;i<len(prices);i++{
        tmp := dp_i_0
        dp_i_0 = max(dp_i_0,dp_i_1+prices[i])
        dp_i_1 = max(dp_i_1,tmp-prices[i])
    }
    return dp_i_0
}

func max(a,b int)int{
    if a>b{
        return a
    }
    return b
}
```
:::


### [198.打家劫舍](https://leetcode.cn/problems/house-robber)

> 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
>
> 给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。
>
**解题思路**：
- dp[i]表示 第i家偷了拿到的最多钱。
- 要么前一家偷了，dp[i - 1]，要么前一家没偷dp[i - 2] + nums[i], 取最大值
- 可以发现也是i - 1与i - 2有关，直接优化。
::: code-tabs

@tab cpp
```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        int dp0 = 0;          //上一间房前面的所有房的的最大值
        int dp1 = nums[0];    //上一间房的最大值
        int res = 0;
        for(int i = 1; i < nums.size(); i++){
            int dp2 = max(dp0 + nums[i], dp1);
            dp0 = max(dp0, dp1);
            dp1 = dp2;
        }
        return dp1;
    }
};
```
@tab java
```java
class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if(n==0) return 0;
        int[][] dp = new int[n][n];
        for(int i=0;i<n;i++){
            dp[i][i] = nums[i];
            if(i != n-1){
                dp[i][i+1] = Math.max(nums[i],nums[i+1]);
            }
        }
        for(int l=3;l<=n;l++){
            for(int i=0;i<n-l+1;i++){
                int j=i+l-1;
                dp[i][j] = Math.max(dp[i][j-2] + nums[j], dp[i][j-1]);
            }
        }
        return dp[0][n-1];
    }
}
```
@tab golang
```go
func rob(nums []int) int {
	if len(nums)<1{
		return 0
	}
	if len(nums)==1{
		return nums[0]
	}
	if len(nums)==2{
		return max(nums[0],nums[1])
	}
	dp :=make([]int,len(nums))
	dp[0]=nums[0]
	dp[1]=max(nums[0],nums[1])
	for i:=2;i<len(nums);i++{
		dp[i]=max(dp[i-2]+nums[i],dp[i-1])
	}
	return dp[len(dp)-1]
}

func max(a, b int) int {
	if a>b{
		return a
	}
	return b
}
```
:::


### [139.单词拆分](https://leetcode.cn/problems/word-break)

> 给你一个字符串 s 和一个字符串列表 wordDict 作为字典。请你判断是否可以利用字典中出现的单词拼接出 s 。
>
> 注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。
>
**解题思路**：
- dp[i]表示以i结尾的子串能否被wordDict拼出来。
- 所以可以遍历之前每一位，如果j到i之间的子串在wordDict中，且dp[j] = 1那么dp[i] = 1
::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> hash(wordDict.begin(), wordDict.end());
        vector<bool> dp(s.size() + 1, false);
        dp[0] = true;
        int n = s.size();
        for(int i = 1; i <= n; i++) {
            for(int j = 0; j < i; j++) {
                if(hash.count(s.substr(j, i - j))) {
                    if(dp[j]) dp[i] = 1;
                }
            }
        }
        return dp[n];
    }
};
```
@tab java
```java
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Trie trie = new Trie();
        return trie.combine(s, wordDict);
    }
}

class Trie {
    private static class Node {
        Node[] children = new Node[26];
        boolean isTerminal;
    }

    private Node root;

    Trie() {
        root = new Node();
    }

    public void insert(String s) {
        Node cur = root;
        for(int i=0;i<s.length();i++) {
            int idx = s.charAt(i) - 'a';
            if(cur.children[idx] == null) {
                cur.children[idx] = new Node();
            }
            cur = cur.children[idx];
            if(i == s.length() - 1) cur.isTerminal = true;
        }
    }

    public boolean combine(String s, List<String> wordDict) {
        for(String word : wordDict) {
            insert(word);
        }
        int n = s.length();
        boolean[] dp = new boolean[n+1];
        dp[n] = true;
        for(int i=n-1;i>=0;i--) {
            Node cur = root;
            for(int j=i;j<n;j++) {
                int idx = s.charAt(j) - 'a';
                if(cur.children[idx] == null) break;
                else cur = cur.children[idx];
                if(cur.isTerminal && dp[j+1]) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[0];
    }
}

// dp[i] = or(dp[i+word.length]) if(word in trie)
```
@tab golang

```go
func wordBreak(s string,wordDict []string) bool  {
	wordDictSet:=make(map[string]bool)
	for _,w:=range wordDict{
		wordDictSet[w]=true
	}
	dp:=make([]bool,len(s)+1)
	dp[0]=true
	for i:=1;i<=len(s);i++{
		for j:=0;j<i;j++{
			if dp[j]&& wordDictSet[s[j:i]]{
				dp[i]=true
				break
			}
		}
	}
	return dp[len(s)]
}
```
:::


### [64.最小路径和](https://leetcode.cn/problems/minimum-path-sum/)

> 给定一个包含非负整数的 `m x n` 网格 `grid` ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
>
> **说明：**每次只能向下或者向右移动一步。
**解题思路**：
- dp[i][j]表示从(0,0)到i，j所需要的最短路径。
- 比较容易看出来，dp[i][j]由dp[i - 1][j]与dp[i][j - 1]更新得到，因为只能往下走往游走。
- dp[i][j] = min(dp[i][j - 1], dp[i - 1][j]) + grid[i][j]
- 注意一下边界条件
::: code-tabs
@tab cpp
```cpp
class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int n = grid.size(), m = grid[0].size();
        vector<vector<int>> dp(n, vector<int>(m));
        dp[0][0] = grid[0][0];
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < m; j++) {
                if(i == 0 && j == 0) {
                    continue;
                }
                if(i == 0) {
                    dp[i][j] = dp[i][j - 1] + grid[i][j];
                }else if(j == 0) {
                    dp[i][j] = dp[i - 1][j] + grid[i][j];
                }else {
                    dp[i][j] = min(dp[i][j - 1], dp[i - 1][j]) + grid[i][j];
                }
            }
        }
        return dp[n - 1][m - 1];
    }
};
```
@tab java
```java
class Solution {
public int minPathSum(int[][] grid) {
        int[][] dp = new int[grid.length][grid[0].length];
        for (int i = grid.length - 1; i >= 0; i--) {
            for (int j = grid[0].length - 1; j >= 0; j--) {
                if(i == grid.length - 1 && j != grid[0].length - 1)
                    dp[i][j] = grid[i][j] +  dp[i][j + 1];
                else if(j == grid[0].length - 1 && i != grid.length - 1)
                    dp[i][j] = grid[i][j] + dp[i + 1][j];
                else if(j != grid[0].length - 1 && i != grid.length - 1)
                    dp[i][j] = grid[i][j] + Math.min(dp[i + 1][j], dp[i][j + 1]);
                else
                    dp[i][j] = grid[i][j];
            }
        }
        return dp[0][0];
    }
}
```
@tab golang

```go
// 原地DP
func minPathSum(matrix [][]int) int {
      for i:=0;i<len(matrix);i++{
        for j:=0;j<len(matrix[0]);j++{
            if i==0&&j==0{
                continue
            }else if i==0{
                matrix[i][j] = matrix[i][j-1] + matrix[i][j]
            }else if j==0{
                matrix[i][j] = matrix[i-1][j] + matrix[i][j]
            }else{
                matrix[i][j] = Min(matrix[i][j-1],matrix[i-1][j]) + matrix[i][j]
            }
        }
    }
    return matrix[len(matrix)-1][len(matrix[0])-1]
}

func Min(a,b int) int{
    if a>b{
        return b
    }
    return a
}

// 非原地DP
func minPathSum(grid [][]int) int {
    if len(grid) == 0 || len(grid[0]) == 0{
        return 0
    }
    m, n := len(grid), len(grid[0])
    dp := make([][]int, m)
    for i:=0;i<m;i++{
        dp[i] = make([]int, n)
    }
    dp[0][0] = grid[0][0]
    for i:=1;i<m;i++{
        dp[i][0] = dp[i-1][0] + grid[i][0]
    }
    for j:=1;j<n;j++{
        dp[0][j] = dp[0][j-1] + grid[0][j]
    }
    for i:=1;i<m;i++{
        for j:=1;j<n;j++{
            dp[i][j] = Min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
        }
    }
    return dp[m-1][n-1]
}

func Min(a, b int) int {
	if a < b{
		return a
	} else{
		return b
	}
}
```
:::


### [718.最长重复子数组](https://leetcode.cn/problems/maximum-length-of-repeated-subarray/)

> 给两个整数数组 `nums1` 和 `nums2` ，返回两个数组中 **公共的** 、长度最长的子数组的长度。
::: code-tabs
@tab java
```java
class Solution {
    public int findLength(int[] A, int[] B) {
        int m=A.length,n=B.length;
        int[][] dp = new int[m+1][n+1];
        int res = 0;
        for(int i=m-1;i>=0;i--){
            for(int j=n-1;j>=0;j--){
                dp[i][j] = A[i]==B[j]? dp[i+1][j+1] + 1: 0;
                res = Math.max(dp[i][j], res);
            }
        }
        return res;
    }
}
```
@tab golang

```go

func findLength(A []int, B []int) int {
	m, n := len(A), len(B)
	res := 0
	dp := make([]int, n+1)

	for i := 1; i <= m; i++ {
		for j := n; j >= 1; j-- {
			if A[i-1] == B[j-1] {
				dp[j] = dp[j-1] + 1
			} else {
				dp[j] = 0
			}
			if dp[j] > res {
				res = dp[j]
			}
		}
	}
	return res
}
```
:::
### [128.最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/)

> 给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
>
> 请你设计并实现时间复杂度为 O(n) 的算法解决此问题。
>
::: code-tabs
@tab java
```java
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> num_set = new HashSet<Integer>();
        for(int num:nums){
            num_set.add(num);
        }
        int max = 0;
        for(int num:nums){
            if(!num_set.contains(num-1)){
                int curNum = num;
                int curLen = 1;
                while(num_set.contains(curNum+1)){
                    curNum++;
                    curLen++;
                }
                max = Math.max(curLen, max);
            }
        }
        return max;
    }
}
```
@tab golang

```go
func longestConsecutive(nums []int) int {
    m := map[int]bool{}
    for _, v := range nums {
        m[v] = true
    }
    var maxCount int
    var tmpCount int
    for num := range m {
        if m[num-1] {
            continue
        }
        tmpCount = 0
        for m[num] {
            num++
            tmpCount++
        }
        if tmpCount > maxCount {
            maxCount = tmpCount
        }
    }
    return maxCount
}
```
:::
### [62.不同路径](https://leetcode.cn/problems/unique-paths/)

> 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
>
> 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
>
> 问总共有多少条不同的路径？
>
::: code-tabs
@tab java
```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[][] dp = new int[m+1][n+1];
        for(int i=1;i<=m;i++){
            dp[i][1] = 1;
        }
        for(int i=1;i<=n;i++){
            dp[1][i] = 1;
        }
        for(int i=2;i<=m;i++){
            for(int j=2;j<=n;j++){
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
        return dp[m][n];
    }
}
```
@tab golang

```go
func uniquePaths(m int, n int) int {
    var res [][]int

    for i := 0; i < n; i++ {
        var cur []int
        for j := 0; j < m; j++ {
            cur = append(cur, 0)
        }
        res = append(res, cur)
    }

    for i := 0; i < n; i++ {
        for j := 0; j < m; j++ {
            if i == 0 || j == 0 {
                res[i][j] = 1
            } else {
                res[i][j] = res[i][j-1] + res[i-1][j]
            }
        }
    }

    return res[n-1][m-1]
}
```
:::
