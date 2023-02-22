### [33.索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array)

> 整数数组nums按升序排列，数组中的值互不相同。
>
> 在传递给函数之前，nums在预先未知的某个下标 k（0 <= k < nums.length）上进行了旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标从0开始计数）。例如，[0,1,2,4,5,6,7] 在下标3处经旋转后可能变为[4,5,6,7,0,1,2]。
>
> 给你旋转后的数组nums和一个整数target，如果nums中存在这个目标值target，则返回它的下标，否则返回 -1 。
>

**解题思路**：

**二分**的经典题目，时间复杂度就是O(logn)：

- 正常二分是要在一段有序的数组上二分，如果整个数组无序，但分段有序，可以在每段上用二分来找，就像这道题，旋转过的数组是前面一段有序，后面一段有序。一种思路是可以用二分先找到中间旋转的断点，然后分段二分。
- 但其实二分的本质是二段性，也就是m的一边一定满足某种性质，而另一边不满足某种性质；像这道题，m落下来有可能在旋转前半段有可能在后半段，如果在前半段的话，0到m上是有序的，判断一下target与nums[m]的大小即可确定是l右移还是r左移；同理当落到旋转的后半段的话，同理。

::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int n = nums.size();
        int l = 0, r = nums.size() - 1;
        while(l < r) {
            int m = l + (r - l) / 2;
            if(target > nums[n - 1]) {
                if(nums[m] <= nums[n - 1] || nums[m] >= target) {
                    r = m;
                }else {
                    l = m + 1;
                }
            }else {
                if(nums[m] <= nums[n - 1] && nums[m] >= target) {
                    r = m;
                }else {
                    l = m + 1;
                }
            }
        }
        if(nums[l] == target) {
            return l;
        }else {
            return -1;
        }
    }
};
```

@tab golang

```go
func search(nums []int, target int) int {
	n := len(nums)
	if n == 0 {
		return -1
	}
	l, r := 0, n-1
	for l <= r {
		mid := (l + r) / 2
		// 中间值即为target,直接返回mid
		if target == nums[mid] {
			return mid
		}
		// 此时前半部分有序
		if nums[0] <= nums[mid] {
			// 此时target落在前半部分有序区间内
			if nums[0] <= target && target < nums[mid] {
				r = mid - 1
			} else {
				// 此时target落在后半部分无序区间内
				l = mid + 1
			}
		} else {
			// 此时后半部分有序
			// 此时target落在后半部分有序区间内
			if nums[mid] < target && target <= nums[n-1] {
				l = mid + 1
			} else {
				// 此时target落在前半部分无序区间内
				r = mid - 1
			}
		}
	}
	// 循环结束没有找到目标值target，返回-1
	return -1
}
```

:::

------



### [31.下一个排列](https://leetcode.cn/problems/next-permutation)

> 整数数组的一个 排列  就是将其所有成员以序列或线性顺序排列。
>
> 例如，arr = [1,2,3] ，以下这些都可以视作 arr 的排列：[1,2,3]、[1,3,2]、[3,1,2]、[2,3,1] 。
> 整数数组的 下一个排列 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 下一个排列 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。
>
> 例如，arr = [1,2,3] 的下一个排列是 [1,3,2] 。
> 类似地，arr = [2,3,1] 的下一个排列是 [3,1,2] 。
> 而 arr = [3,2,1] 的下一个排列是 [1,2,3] ，因为 [3,2,1] 不存在一个字典序更大的排列。
> 给你一个整数数组 nums ，找出 nums 的下一个排列。
>
> 必须 原地 修改，只允许使用额外常数空间。
>
**解题思路**：
- 比较经典的题，想要找到字典序比它大的排列，那么一定是更大的后一位与更小的前一位交换
- 想要刚好的下一位，可以从后往前遍历，如果找到前一位比当前一位小，那么说明此时可以交换
- 但需要考虑到，右面有可能存在比当前一位小但比前一位大的元素，所以这里先把后面所有降序排序，找到刚好比当前位小比前一位大的元素，交换
- 然后再将后面重新升序排序一遍。

::: code-tabs

@tab cpp

```cpp
    void nextPermutation(vector<int>& nums) {
        int n = nums.size();
        int i = n - 1;
        for(; i > 0; i--) {
            if(nums[i] > nums[i - 1]) {
                int pos = i;
                sort(nums.begin() + i, nums.end(), greater<int>());
                while(pos < n) {
                    if(pos + 1 < n && nums[pos + 1] > nums[i - 1]) {
                        pos++;
                    }else {
                        break;
                    }
                }
                swap(nums[i - 1],nums[pos]);
                break;
                
            }
        }
        sort(nums.begin() + i, nums.end());
        return;
    }
```

@tab golang

```go
func nextPermutation(nums []int) {
	for i := len(nums) - 2; i >= 0; i-- {
		if nums[i] < nums[i+1] {
			for j := len(nums) - 1; j > i; j-- {
				if nums[j] > nums[i] {
					nums[j], nums[i] = nums[i], nums[j]
					sort.Ints(nums[i+1:])
					return
				}
			}
		}
	}
	sort.Ints(nums)
}
```

------



### [88.合并两个有序数组](https://leetcode.cn/problems/merge-sorted-array)

> 给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
>
> 请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
>
> 注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。
>
**解题思路**：
- 倒序合并的题，也是模板题目，思路是**双指针**。
- 我们用一个指针last指向nums1的末尾，也就是第m+n位；一个指针m指向nums1第m位；一个指针n指向nums2的第n位
- 然后就是归并的思路，nums1[m]大的话，就把nums1[m]复制到nums1[last]的位置上，m前移一位，num2[n]大的话，同理。
- 因为已经留足空位，所以排序的部分不可能超过未排序的部分。

::: code-tabs

@tab cpp

```cpp
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        int last=m+n-1;
        m--;
        n--;
        //从最后往前归并，这样保证一定会有空位，从大小到小归并，先放大的。
        while(m >= 0 && n >= 0){
            if(nums1[m] > nums2[n]) nums1[last--] = nums1[m--];
            else nums1[last--] = nums2[n--];
        }
        while(n>=0){
            nums1[last--] = nums2[n--];
        }
    }
```

@tab golang

```go
func merge(nums1 []int, m int, nums2 []int, n int)  {
    for m > 0 && n > 0{
        if nums1[m - 1] > nums2[n - 1]{
            nums1[ m + n - 1] = nums1[m - 1]
            m --
        }else{
            nums1[ m + n - 1] = nums2[n - 1]
            n --
        }
    }
    if n > 0{
        nums1 = append(nums1[:0], nums2[:n]...)
    }
}
```

------



### [56.合并区间](https://leetcode.cn/problems/merge-intervals)

> 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。
>
**解题思路**：
- 合并区间首先进行排序，按starti的大小顺序排序区间，不是按endi是因为有可能会碰到这种例子:[[2,3],[4,5],[6,7],[8,9],[1,10]]
- 然后从前往后遍历每个区间来合并，假设2个区间a,b，a.start < b.start,那么可以合并的前提是a.end >= b.start，可以在纸上画一下，一共三种可能性。
- 然后就是贪心，能合并就合并，不能合并就放到ans中，重新设定正在合并的区间。

::: code-tabs

@tab cpp

```cpp
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> ans;
        vector<int> t = {intervals[0][0], intervals[0][1]};
        for(int i = 1; i < intervals.size(); i++) {
            if(t[1] >= intervals[i][0]) {
                t[1] = max(t[1],intervals[i][1]);
            }else {
                ans.emplace_back(t);
                t[0] = intervals[i][0];
                t[1] = intervals[i][1];
            }
        } 
        ans.emplace_back(t);
        return ans;
    }
```
@tab golang

```go
func merge(intervals [][]int) [][]int {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
    var res [][]int
    start, end := intervals[0][0], intervals[0][1]
    for i := 1; i < len(intervals); i++ {
        if intervals[i][0] <= end {
            if intervals[i][1] > end {
                end = intervals[i][1]
            }
        } else {
            res = append(res, []int{start, end})
            start, end = intervals[i][0], intervals[i][1]
        }
    }
    return append(res, []int{start, end})
}
```



------



### [162.寻找峰值](https://leetcode.cn/problems/find-peak-element)

> 峰值元素是指其值严格大于左右相邻值的元素。
>
> 给你一个整数数组 nums，找到峰值元素并返回其索引。数组可能包含多个峰值，在这种情况下，返回 任何一个峰值 所在位置即可。
>
> 你可以假设 nums[-1] = nums[n] = -∞ 。
>
> 你必须实现时间复杂度为 O(log n) 的算法来解决此问题。
>
**解题思路**：
- **二分**+**爬山法**，山峰一定是需要往上爬的,可以对应4种情况:
- nums[m - 1] < nums[m] < nums[m + 1] 这种情况需要向m + 1爬，所以l = m + 1
- nums[m - 1] > nums[m] > nums[m + 1] 这种情况需要向m - 1爬，所以r = m 
- nums[m - 1] < nums[m] && nums[m] > nums[m + 1] 这种情况是找到了，直接返回m
- nums[m - 1] > nums[m] && nums[m] < nums[m + 1] 这种情况是谷底，往左往右都行

::: code-tabs

@tab cpp

```cpp
    int findPeakElement(vector<int>& nums) {
        int n = nums.size();
        int l = 0, r = n - 1;
        while(l < r) {
            int m = l + (r - l)/2;
            if((m == n - 1 || nums[m] > nums[m + 1]) && (m == 0 || nums[m - 1] > nums[m])) {
                r = m;
            }else if((m == 0 || nums[m] > nums[m - 1]) && (m == n - 1 || nums[m + 1] > nums[m])) {
                l = m + 1;
            }else if((m == 0 || nums[m] > nums[m - 1]) && (m == n - 1 || nums[m] > nums[m + 1])) {
                r = m;
            }else {
                l++;
            }
        }
        return l;
    }
```
```go
func findPeakElement(nums []int) int {
    left, right := 0, len(nums)-1
    if right == 0 {
        return 0
    }
    if nums[left] > nums[left+1] {
        return left
    }
    if nums[right] > nums[right-1] {
        return right
    }
    for left < right {
        mid := left + (right - left)/2
        if nums[mid] > nums[mid+1] && nums[mid] > nums[mid-1] {
            return mid
        } else if nums[mid+1] > nums[mid] {
            left = mid+1
        } else {
            right = mid-1
        }
    }
    if left == right {
        return left
    }
    return -1
}
```

------



### [4.寻找两个正序数组的中位数](https://leetcode.cn/problems/median-of-two-sorted-arrays)

> 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
>
> 算法的时间复杂度应该为 O(log (m+n)) 。
>
**解题思路**：
- 这道题可以先做出需要两个正序数组的第k位，如果m + n为奇数，就找k = (m + n)/2 + 1; 如果m + n为偶数, 找k = (m + n)/2与(m + n)/2 + 1两个再取平均，时间复杂度O(log(m + n))
- 然后两个数组找第k位数的思路是二分。可以先找arr1[k/2 - 1]位和arr2[k/2 -1]位，如果arr1[k/2 - 1]大，那么可以认为arr2的k/2 - 1不可能成为第k位
- 因为arr1中比arr2[k/2 - 1]小的个数一定少于k/2 - 1个，两个数组放在一起比arr2[k/2 - 1]小的个数就一定小于k - 2, 所以arr2[k/2 - 1]前面的都可以不管，直接滑动。对于另一种情况同理。

::: code-tabs

@tab cpp

```cpp
    double sort(vector<int>& arr1, vector<int>& arr2, int l1, int l2, int k) {
        int n1 = arr1.size(), n2 = arr2.size();
        if(l1 >= n1) {
            return arr2[k + l2 - 1];
        }
        if(l2 >= n2) {
            return arr1[k + l1 - 1];
        }
        if(k == 1) {
            return min(arr1[l1], arr2[l2]);
        }
        int idx1 = min(l1 + k/2 - 1, n1);
        int idx2 = min(l2 + k/2 - 1, n2);
        int val1 = INT_MAX;
        int val2 = INT_MAX;
        if(idx1 < n1) {
            val1 = arr1[idx1];
        }
        if(idx2 < n2) {
            val2 = arr2[idx2];
        }
        if(val1 < val2) {
            k -= (idx1 - l1 + 1);
            l1 = idx1 + 1;
        }else {
            k -= (idx2 - l2 + 1);
            l2 = idx2 + 1;
        }
        return sort(arr1, arr2, l1, l2, k);
    }
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        int n1 = nums1.size();
        int n2 = nums2.size();
        int n = n1 + n2;
        if(n % 2 == 0) {
            return 0.5 * (sort(nums1, nums2, 0, 0, n/2) + sort(nums1, nums2, 0, 0, n/2 + 1));
        }else {
            return sort(nums1, nums2, 0, 0, n/2 + 1);
        }

    }
```
@tab golang

```go
func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
    m, n := len(nums1), len(nums2)
    length := m + n
    left, right := 0, 0
    l1, l2 := 0, 0
    for i:=0;i<=length/2;i++{
        left = right
        if l1 < m && (l2 >= n || nums1[l1]<nums2[l2]){
            right = nums1[l1]
            l1++
        }else{
            right = nums2[l2]
            l2++
        }
    }
    if length%2 == 1{
        return float64(right)
    }
    return float64(left+right)/2.0
}
```

------



### [215.数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array)

> 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
>
> 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
>
> 你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。
>

**解题思路**：

- TopK问题，根据数据量的不同有3种做法：当数据量正常时，就是**优先队列**或者**快速选择**的做法；当数据海量时，就是**hash分流**。不过一般手撕碰到的算法题都是数据量正常时候，两个做法优先队列或者快速选择，快速选择的时间复杂度会更好些，优先队列是O(nlogk),快速选择是O(n)。

- 优先队列就是用一个size是K的小根堆，它的top代表的是第K个最大的元素，堆内的其他元素都堆顶大，所以用小根堆。将数字一个一个压进去，一直维护小根堆的大小为K，数多了就pop，这样最后堆顶就是第K个元素。

- 快速选择的思路其实来源于**快排的partition**这一步，partition可以划分数组为3个集合，左边一部分的小于指定的数，右边一部分大于指定的数，中间部分等于指定的数。

  - 如果左边部分个数小于K，那么第K个数就在中间和右边部分里，这时候可以在中间与右边部分里找第 k - 左边部分个数 个元素，递归即可；

  - 如果做边个数大于K，那么第K个数就在左边的集合里，同理递归即可。

::: code-tabs

@tab cpp

```go
    /*
        优先队列做法
    */
    class Solution {
    public:
        int findKthLargest(vector<int>& nums, int k) {
            priority_queue<int, vector<int>, greater<int>> q;
            int n = nums.size();
            for(int i = 0; i < n; i++) {
                if(q.size() < k) {
                    q.push(nums[i]);
                }else {
                    if(nums[i] > q.top()) {
                        q.pop();
                        q.push(nums[i]);
                    }
                }
            }
            return q.top();
        }
    };
    /*
        快速选择做法
    */
    int partation(vector<int>& nums, int left, int right) {
        int cl = left - 1, cr = right;
        int idx = left;
        while(idx < cr) {
            if(nums[idx] > nums[right]) {
                swap(nums[idx++], nums[++cl]);
            }else if(nums[idx] < nums[right]) {
                swap(nums[idx], nums[--cr]);
            }else {
                idx++;
            }
        }
        swap(nums[cr++], nums[right]);
        return cl - left + 1;
    }
    int findKthLargest(vector<int>& nums, int k) {
        int n = nums.size();
        int left = 0, right = n - 1;
        while(left < right) {
            int randIdx = rand()%(right - left + 1);
            swap(nums[left + randIdx], nums[right]);
            int cnt = partation(nums, left ,right) + 1;
            if(cnt > k) {
                right = left + cnt - 1;
            }else if(cnt < k){
                left = left + cnt;
                k -= cnt;
            }else {
                return nums[left + cnt - 1];
            }
        }
        return nums[left];
    }
```

@tab golang

```go
func findKthLargest(nums []int, k int) int {
    hp := &Heap{size: k}
    for _, num := range nums {
        hp.Add(num)
    }
    return hp.arr[0]
}

type Heap struct {
    arr []int
    size int
}

func (hp *Heap)Add(num int) {
    if len(hp.arr) < hp.size {
        hp.arr = append(hp.arr, num)
        for i := len(hp.arr)-1; i > 0; {
            p := (i-1)/2
            if p >= 0 && hp.arr[p] > hp.arr[i] {
                hp.Swap(p, i)
                i = p
            } else {
                break
            }
        }
    } else if num > hp.arr[0] {
        hp.arr[0] = num
        hp.Down(0)
    }
}

func (hp *Heap)Swap(a, b int) {
    hp.arr[a], hp.arr[b] = hp.arr[b], hp.arr[a]
}

func (hp *Heap)Down(i int) {
    k := i
    l, r := 2*i+1, 2*i+2
    n := len(hp.arr)
    if l < n && hp.arr[k] > hp.arr[l] {
        k = l
    }
    if r < n && hp.arr[k] > hp.arr[r] {
        k = r
    }
    if i != k {
        hp.Swap(i, k)
        hp.Down(k)
    }
}
```

:::

------



### [34.在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

> 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。
>
> 如果数组中不存在目标值 target，返回 [-1, -1]。
>
> 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。
>
**解题思路**：
- 经典**二分法**问题，用两次二分分别找到开始位置与结束位置即可。用cpp的库就是lower_bound与upper_bound
- lower_bound的意思是所能插入位置的第一位，也就是 <= target的第一位，upper_bound是指所能插入位置的最后一位，也就是 < target的第一位，所以结束位就是upper_bound找到的前一位。
- 如果手撕二分实现lower_bound就是当target > nums[m]时，l = m + 1； upper_bound就是当target >= nums[m]时，l = m + 1

::: code-tabs

@tab cpp

```cpp
    vector<int> searchRange(vector<int>& nums, int target) {
        auto x = lower_bound(nums.begin(), nums.end(), target);
        auto y = upper_bound(nums.begin(), nums.end(), target);
        if(x == nums.end() || *x != target) {
            return {-1, -1};
        }
        return {static_cast<int>(x - nums.begin()), static_cast<int>(y - nums.begin() - 1)};
    }
```
@tab golang

```go
func searchRange(nums []int, target int) []int {
    var l, r = 0, len(nums)-1
    for l <= r{
        mid := (l + r) / 2
        if nums[mid] >= target{
            r = mid - 1
        }else{
            l = mid + 1
        }
    }
    if l == len(nums) || nums[l] != target {
        return []int{-1, -1}
    }
    var cnt = 0
    for i := l + 1; i < len(nums); i++{
        if nums[i] == target{
            cnt++
        }
    }
    return []int{l, l + cnt}
}
```

------



### [283.移动零](https://leetcode.cn/problems/move-zeroes/)

> 给定一个数组 `nums`，编写一个函数将所有 `0` 移动到数组的末尾，同时保持非零元素的相对顺序。
>
> **请注意** ，必须在不复制数组的情况下原地对数组进行操作。
**解题思路**：
- **双指针**，一个指针p表示非零元素的位置，另一个指针q表示当前遍历的位置，如果当前q非0，就把p的值放到q上去，q后移动一位，如果为0，p不移动

::: code-tabs

@tab cpp

```cpp
    void moveZeroes(vector<int>& nums) {
        int l = 0;
        for(int r = 0; r < nums.size(); r++) {
            if(nums[r] != 0) {
                nums[l++] = nums[r];
            }
        }
        while(l < nums.size()) {
            nums[l] = 0;
            l++;
        }
        return;
    }
```
@tab go

```go
func moveZeroes(nums []int)  {
    l:=len(nums)
    for i:=0; i<l; {
        if nums[i]==0 {
            nums = append(nums[:i], nums[i+1:]...)
            nums = append(nums, 0)
            l=l-1
        }else {
            i=i+1
        }
    }
}
```

------



### [153.寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/)

> 已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次 旋转 后，得到输入数组。例如，原数组 nums = [0,1,2,4,5,6,7] 在变化后可能得到：
> 若旋转 4 次，则可以得到 [4,5,6,7,0,1,2]
> 若旋转 7 次，则可以得到 [0,1,2,4,5,6,7]
> 注意，数组 [a[0], a[1], a[2], ..., a[n-1]] 旋转一次 的结果为数组 [a[n-1], a[0], a[1], a[2], ..., a[n-2]] 。
>
> 给你一个元素值 互不相同 的数组 nums ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 最小元素 。
>
> 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。
>
**解题思路**：
- **二分**，旋转后的数组分成两段
- 如果比nums[m] < nums[r]就说明m落在后半段，r = m
- 否则落在前半段 l = m + 1

::: code-tabs
@tab cpp

```cpp
    int findMin(vector<int>& nums) {
        int n = nums.size();
        int l = 0, r = n - 1;
        while(l < r) {
            int m = l + (r - l)/2;
            if(nums[m] < nums[r]) {
                r= m;
            }else {
                l = m + 1;
            }
        }
        return nums[l];
    }
```
@tab golang

```go
func findMin(nums []int) int {
    n := len(nums)
    l, r := 0, n-1
    for l <= r {
        m := l + (r-l)/2
        if nums[l] > nums[r] {
            if nums[m] >= nums[l] {
                l = m+1
            } else {
                r = m
            }
        } else {
            break
        }
    }
    return nums[l]
}
```

------



### [136.只出现一次的数字](https://leetcode.cn/problems/single-number/)

> 给你一个 非空 整数数组 nums ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。
>
> 你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。
**解题思路**：
- **异或**经典题目，两个数相同，异或为0。
- 所以把所有数全异或一遍，剩下的就是只出现一次的数.

::: code-tabs

@tab cpp

```cpp
    int singleNumber(vector<int>& nums) {
        int res = 0;
        for(int num : nums) {
            res ^= num;
        }
        return res;
    }
```
@tab golang

```go
func singleNumber(nums []int) int {
    ans := nums[0]
    for i := 1; i < len(nums); i++ {
        ans ^= nums[i]
    }
    return ans
}
```

------

### [55.跳跃游戏](https://leetcode.cn/problems/jump-game/)

> 给定一个非负整数数组 `nums` ，你最初位于数组的 **第一个下标** 。
>
> 数组中的每个元素代表你在该位置可以跳跃的最大长度。
>
> 判断你是否能够到达最后一个下标。
**解题思路**：
- **dp+贪心**的思想
- 记录最远能到达的区域，遍历一遍，如果遍历到哪个位置无法到达，就说明跳不过去。
::: code-tabs

@tab cpp

```cpp
    bool canJump(vector<int>& nums) {
        int maxDis = 0;
        for(int i = 0; i < nums.size(); i++) {
            if(i > maxDis) {
                return false;
            }
            maxDis = max(maxDis, i + nums[i]);
        }
        return true;
    }
```
@tab go

```go
func canJump(nums []int) bool {
    var p int
    for i := range nums {
        if i > p {
            return false
        }
        p = maxInt(p, i+nums[i])
    }
    return true
}

func maxInt(a, b int) int {
    if a > b {
        return a
    }
    return b
}
```

