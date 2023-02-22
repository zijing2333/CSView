### 手撕快排

```go
func sortArray(nums []int) []int {
    // 快速排序，基于比较，不稳定算法，时间平均O(nlogn)，最坏O(n^2)，空间O(logn)
	// 分治思想，选主元，依次将剩余元素的小于主元放其左侧，大的放右侧
	// 然后取主元的前半部分和后半部分进行同样处理，直至各子序列剩余一个元素结束，排序完成
	// 注意：
	// 小规模数据(n<100)，由于快排用到递归，性能不如插排
	// 进行排序时，可定义阈值，小规模数据用插排，往后用快排
	// golang的sort包用到了快排
	// (小数，主元，大数)
	var quick func(nums []int, left, right int) []int
	quick = func(nums []int, left, right int) []int {
		// 递归终止条件
		if left > right {
			return nil
		}
		// 左右指针及主元
		i, j, pivot := left, right, nums[left]
		for i < j {
			// 寻找小于主元的右边元素
			for i < j && nums[j] >= pivot {
				j--
			}
			// 寻找大于主元的左边元素
			for i < j && nums[i] <= pivot {
				i++
			}
			// 交换i/j下标元素
			nums[i], nums[j] = nums[j], nums[i]
		}
		// 交换元素
		nums[i], nums[left] = nums[left], nums[i]
		quick(nums, left, i-1)
		quick(nums, i+1, right)
		return nums
	}
	return quick(nums, 0, len(nums)-1)
}
```



### 手撕堆排

```go
func sortArray(nums []int) []int {
    // 堆排序-大根堆，升序排序，基于比较交换的不稳定算法，时间O(nlogn)，空间O(1)-迭代建堆
	// 遍历元素时间O(n)，堆化时间O(logn)，开始建堆次数多些，后面次数少 
	// 主要思路：
	// 1.建堆，从非叶子节点开始依次堆化，注意逆序，从下往上堆化
	// 建堆流程：父节点与子节点比较，子节点大则交换父子节点，父节点索引更新为子节点，循环操作
	// 2.尾部遍历操作，弹出元素，再次堆化
	// 弹出元素排序流程：从最后节点开始，交换头尾元素，由于弹出，end--，再次对剩余数组元素建堆，循环操作
	// 建堆函数，堆化
	var heapify func(nums []int, root, end int)
	heapify = func(nums []int, root, end int) {
		// 大顶堆堆化，堆顶值小一直下沉
		for {
			// 左孩子节点索引
			child := root*2 + 1
			// 越界跳出
			if child > end {
				return
			}
			// 比较左右孩子，取大值，否则child不用++
			if child < end && nums[child] <= nums[child+1] {
				child++
			}
			// 如果父节点已经大于左右孩子大值，已堆化
			if nums[root] > nums[child] {
				return
			}
			// 孩子节点大值上冒
			nums[root], nums[child] = nums[child], nums[root]
			// 更新父节点到子节点，继续往下比较，不断下沉
			root = child
		}
	}
	end := len(nums)-1
	// 从最后一个非叶子节点开始堆化
	for i:=end/2;i>=0;i-- {
		heapify(nums, i, end)
	}
	// 依次弹出元素，然后再堆化，相当于依次把最大值放入尾部
	for i:=end;i>=0;i-- {
		nums[0], nums[i] = nums[i], nums[0]
		end--
		heapify(nums, 0, end)
	}
	return nums
}
```



### 手撕归并

```go
//n为要排序数组的元素个数
func MergeSort(array *[]int, n int) {
	MergeSortDetail(array, 0, n-1)
}
 
//l,r分别为需要排序的数组的最左、最右元素的下标
func MergeSortDetail(array *[]int, l, r int) {
	if l >= r {
		return
	}
	//分解过程
	mid := (r + l) / 2
	MergeSortDetail(array, l, mid)
	MergeSortDetail(array, mid+1, r)
	//合并过程
	if (*array)[mid] > (*array)[mid+1] {
		Merge(array, l, mid, r)
	}
}
 
func Merge(array *[]int, l, mid, r int) {
	//temp为需要合并的两个数组无序合并而成的数组，方便下面遍历比较，再调整原数组的元素成有序状态
	temp := make([]int, r+1)
	for i := l; i <= r; i++ {
		temp[i] = (*array)[i]
	}
	//定义两个要合并的数组第一个元素的下标
	i := l
	j := mid + 1
	for k := l; k <= r; k++ {
		//需要合并的两个数组的下标不可以越界,设置判断条件i > mid,j > r
		if i > mid {
			(*array)[k] = temp[j]
			j++
		} else if j > r {
			(*array)[k] = temp[i]
			i++
		} else if temp[j] < temp[i] {
			(*array)[k] = temp[j]
			j++
		} else {
			(*array)[k] = temp[i]
			i++
		}
	}
 
}
 
func main() {
	array := []int{39, 2, 5, 23, 54, 12, 78, 34, 45, 40}
	MergeSort(&array, len(array))
	for i, v := range array {
		fmt.Printf("下标为%d的值为%d", i, v)
		fmt.Println()
	}
}
```



### 手撕单例模式

```go
// 懒汉式
package singleton
type singleton struct{}
var instance *singleton
func GetSingleton() *singleton {
    if instance == nil {
        instance = &singleton{}
    }
    return instance
}

//	饿汉式
package singleton
type singleton struct{}
var instance *singleton
func GetSingleton() *singleton {
    if instance == nil {
        instance = &singleton{}
    }
    return instance
}

// 并发单例模式
package singleton
import "sync"
type singleton struct{}
var instance *singleton
var mu sync.Mutex
func GetSingleton() *singleton {
    mu.Lock()
    defer mu.Unlock()
    if instance == nil {
        instance = &singleton{}
    }
    return instance
}

// 双重锁定
package singleton
import "sync"
type singleton struct{}
var instance *singleton
var mu sync.Mutex
func GetSingleton() *singleton {
    if instance == nil {
        mu.Lock()
        defer mu.Unlock()
        if instance == nil {
            instance = &singleton{}
        }
    }
    return instance
}

// once写法

package singleton
import "sync"
type singleton struct{}
var instance *singleton
var once sync.Once
func GetSingleton() *singleton {
    once.Do(func() {
        instance = &singleton{}
    })
    return instance
}
```



### 手撕工厂模式

```go
type Log interface {
	set(message string) (err error)
}
type dbLog struct {

}

type localLog struct {

}

type cloudLog struct {

}

func (m *dbLog) writeLog(log string)(err error)  {
	fmt.Printf("把%s写入到了数据库日志",log)
	return
}

func (l *localLog)writeLog(log string)(err error)  {
	fmt.Printf("把%s写入到了本地日志",log)
	return
}

func (c *cloudLog) writeLog(log string) (err error) {
	fmt.Printf("把%s写入到了云端日志",log)
	return
}
func newLog(logType string) Log {

	switch logType {
	case "db":
		return &dbLog{}
	case "local":
		return &localLog{}
	case "cloud":
		return &cloudLog{}

	}

	return nil
}
```



### 手撕生产者消费者

```go
package main

// 无缓冲的channel

import (
	"fmt"
	"time"
)

func produce(ch chan<- int) {
	for i := 0; i < 10; i++ {
		ch <- i
		fmt.Println("Send:", i)
	}
}

func consumer(ch <-chan int) {
	for i := 0; i < 10; i++ {
		v := <-ch
		fmt.Println("Receive:", v)
	}
}

// 因为channel没有缓冲区，所以当生产者给channel赋值后，
// 生产者线程会阻塞，直到消费者线程将数据从channel中取出
// 消费者第一次将数据取出后，进行下一次循环时，消费者的线程
// 也会阻塞，因为生产者还没有将数据存入，这时程序会去执行
// 生产者的线程。程序就这样在消费者和生产者两个线程间不断切换，直到循环结束。
func main() {
	ch := make(chan int)
	go produce(ch)
	go consumer(ch)
	time.Sleep(1 * time.Second)
}

package main

// 带缓冲区的channel

import (
	"fmt"
	"time"
)

func produce(ch chan<- int) {
	for i := 0; i < 10; i++ {
		ch <- i
		fmt.Println("Send:", i)
	}
}

func consumer(ch <-chan int) {
	for i := 0; i < 10; i++ {
		v := <-ch
		fmt.Println("Receive:", v)
	}
}

func main() {
	ch := make(chan int, 10)
	go produce(ch)
	go consumer(ch)
	time.Sleep(1 * time.Second)
}
```
