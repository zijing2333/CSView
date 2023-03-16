---
title: DFS
author: 枫长
---
### [200.岛屿数量](https://leetcode.cn/problems/number-of-islands)

> 给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
>
> 岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。
>
> 此外，你可以假设该网格的四条边均被水包围。
>

**解题思路**：图论中很经典的**bfs**问题，就是遍历所有的点，如果是1就碰到了一个岛屿，然后清空图上连着的所有1(如果不要求还原可以置0，如果要求还原可以置-1，最后再遍历一遍把-1置1即可)。最后返回你碰到1的个数即可。清空所有连着的点就是bfs，几乎就是bfs的模板，建议背过。时间复杂度，因为一个点最多遍历2次，所以是O(n^2)。

::: code-tabs

@tab cpp

```cpp
    vector<vector<int>> turn{{0,1},{1,0},{-1,0},{0,-1}};
    int numIslands(vector<vector<char>>& grid) {
        int m = grid.size();
        int n = grid[0].size();
        int ans = 0;
        deque<pair<int,int>> s;
        for(int i = 0; i < m; i++) {
            for(int j = 0; j < n; j++){
                if(grid[i][j] == '1'){
                    ans++;
                    grid[i][j] = '0';
                    s.push_back({i, j});
                    while(!s.empty()) {
                        pair<int,int> x = s.front();
                        s.pop_front();
                        for(int k = 0; k < 4; k++){
                            int newi= x.first + turn[k][0];
                            int newj= x.second + turn[k][1];
                            if(newi >= 0 && newi < m && newj >= 0 && newj < n && grid[newi][newj] == '1'){
                                grid[newi][newj] = '0';
                                s.push_back({newi, newj});
                            }
                        }
                    }
                }
            }
        }
        return ans;
    }
```
@tab java

```java
class Solution {
    private boolean[][] visited;
    private int res;
    private static int[][] opt = {{-1, 0}, {1, 0}, {0, 1}, {0, -1}};

    public int numIslands(char[][] grid) {
        if(grid == null || grid.length == 0 || grid[0].length == 0) return 0;
        int m = grid.length;
        int n = grid[0].length;
        visited = new boolean[m][n];
        for(int i=0;i<m;i++) {
            for(int j=0;j<n;j++) bfs(grid, i, j);
        }
        return res;
    }

    private void bfs(char[][] grid, int i, int j) {
        if(visited[i][j] || grid[i][j] == '0') return;
        res++;
        Deque<int[]> queue = new ArrayDeque<>();
        queue.addLast(new int[]{i, j});
        while(!queue.isEmpty()) {
            int[] cur = queue.removeFirst();
            visited[cur[0]][cur[1]] = true;
            for(int k=0;k<4;k++) {
                int ni = cur[0] + opt[k][0];
                int nj = cur[1] + opt[k][1];
                if(ni < 0 || ni >= grid.length || nj < 0 || nj >= grid[0].length) continue;
                if(visited[ni][nj] || grid[ni][nj] == '0') continue;
                visited[ni][nj] = true;
                queue.addLast(new int[]{ni, nj});
            }
        }
    }
}
```

@tab golang

```go
func numIslands(grid [][]byte) int {
    return solve(grid)
}
func solve( grid [][]byte ) int {
    // write code here
    res := 0
    for r:=0;r<len(grid);r++{
        for c:=0;c<len(grid[0]);c++{
            if grid[r][c]=='1'{
                area(grid,r,c)
                res ++
            }
        }
    }
    return res
}

func area(grid [][]byte,r int,c int){
    if !isArea(grid,r,c){
        return
    }
    if grid[r][c]=='0'{
        return
    }
    grid[r][c]='0'
    area(grid,r-1,c)
    area(grid,r+1,c)
    area(grid,r,c-1)
    area(grid,r,c+1)
}
func isArea(grid [][]byte,r int,c int) bool{
    return r>=0&&r<len(grid)&&c>=0&&c<len(grid[0])
}
```

:::

### [22.括号生成](https://leetcode.cn/problems/generate-parentheses/)

> 数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。
>
**解题思路**:
-  **dfs**，每层dfs可以添左括号，可以添右括号，每次递归带个变量记录左括号的个数，以及一个中间存储的字符串；
- 添右括号条件是左括号数量大于0,递归结束的条件是生成括号的字符串已经达到2*n,且此时左括号个数为0。

::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    vector<string> ans;
    void dfs(int n, int numC, string& tmp) {
        if(tmp.size() == 2*n) {
            if(numC == 0) {
                ans.emplace_back(tmp);
            }
            return;
        }
        tmp.push_back('(');
        dfs(n, numC + 1, tmp);
        tmp.pop_back();

        if(numC > 0) {
            tmp.push_back(')');
            dfs(n, numC - 1, tmp);
            tmp.pop_back();
        }
    }
    vector<string> generateParenthesis(int n) {
        string tmp = "";
        dfs(n, 0, tmp);
        return ans;
    }
};
```
@tab java

```java
class Solution {
    private List<String> res = new ArrayList<>();

    public List<String> generateParenthesis(int n) {
        StringBuilder cur = new StringBuilder();
        dfs(cur, n, n);
        return res;
    }

    private void dfs(StringBuilder cur, int left, int right) {
        if(left > right) return;
        if(left < 0 || right < 0) return;
        if(left == 0 && right == 0) {
            res.add(cur.toString());
            return;
        }
        cur.append("(");
        dfs(cur, left-1, right);
        cur.deleteCharAt(cur.length()-1);
        cur.append(")");
        dfs(cur, left, right-1);
        cur.deleteCharAt(cur.length()-1);
    }
}
```
@tab golang

```go
func generateParenthesis(n int) []string {
	res := []string{}

	var dfs func(lRemain int, rRemain int, path string)
	dfs = func(lRemain int, rRemain int, path string) {
		if 2*n == len(path) {
			res = append(res, path)
			return
		}
		if lRemain > 0 {
			dfs(lRemain-1, rRemain, path+"(")
		}
		if lRemain < rRemain {
			dfs(lRemain, rRemain-1, path+")")
		}
	}
	
	dfs(n, n, "")
	return res
}
```
:::


### [695.岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island)

> 给你一个大小为 m x n 的二进制矩阵 grid 。
>
> 岛屿 是由一些相邻的 1 (代表土地) 构成的组合，这里的「相邻」要求两个 1 必须在 水平或者竖直的四个方向上 相邻。你可以假设 grid 的四个边缘都被 0（代表水）包围着。
>
> 岛屿的面积是岛上值为 1 的单元格的数目。
>
> 计算并返回 grid 中最大的岛屿面积。如果没有岛屿，则返回面积为 0 。
>
**解题思路**：
- **岛屿问题**的变形，岛问题时候我们在dfs的时候没有记录每个岛中的1数量
- 这道题只需要在岛问题的基础上记录一下每个岛中1的数量即可，让dfs返回dfs遍历过的1的个数。
- 然后比较每个岛的1的数量找最大值即可。

::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    vector<vector<int>> turn = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    int dfs(vector<vector<int>>& grid,int x,int y){
        grid[x][y] = 0;
        int n = grid.size();
        int m = grid[0].size();
        int res = 1;
        for(int i = 0; i < 4; i++){
            int nx = x + turn[i][0];
            int ny = y + turn[i][1];
            if(nx >= 0 && nx < n && ny >= 0 && ny < m && grid[nx][ny] == 1){
                res += dfs(grid, nx, ny);
            }
        }
        return res;
    }
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        int n=grid.size();
        int m=grid[0].size();
        int ans=0;
        for(int i=0;i<n;i++){
            for(int j=0;j<m;j++){
                if(grid[i][j]){
                    ans=max(ans,dfs(grid,i,j));
                }
            }
        }
        return ans;
    }
};
```
@tab java 
```java
class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        int res = 0; 
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[i].length; j++) {
                if (grid[i][j] == 1) {
                    res = Math.max(res, dfs(i, j, grid));
                }
            }
        } 
        return res;
    }
    private int dfs(int i, int j, int[][] grid) {
        if (i < 0 || j < 0 || i >= grid.length || j >= grid[i].length || grid[i][j] == 0) { 
            return 0;
        } 
        grid[i][j] = 0;
        int num = 1;
        num += dfs(i + 1, j, grid);
        num += dfs(i - 1, j, grid);
        num += dfs(i, j + 1, grid);
        num += dfs(i, j - 1, grid);
        return num;
        
    }
}
```
@tab golang

```go
func solve( grid [][]int ) int {
    // write code here
    res := 0
    for r:=0;r<len(grid);r++{
        for c:=0;c<len(grid[0]);c++{
            if grid[r][c]==1{
                a := area(grid,r,c)
                res = max(res,a)
            }
        }
    }
    return res
}

func area(grid [][]int,r int,c int) int{
    if !isArea(grid,r,c){
        return 0
    }
    if grid[r][c]!=1{
        return 0
    }
    grid[r][c] = 2
    return 1 + area(grid,r-1,c)+area(grid,r+1,c)+area(grid,r,c-1)+area(grid,r,c+1)
}
func isArea(grid [][]int,r int,c int) bool{
    return r>=0&&r<len(grid)&&c>=0&&c<len(grid[0])
}

func max(a,b int) int{
    if a>b{
        return a
    }
    return b
}
```
:::