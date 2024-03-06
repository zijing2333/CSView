---
title: 面试常见手撕算法
author: 若枫
---



### 快速排序

快速排序是一种高效的排序算法，发明于1960年，由英国计算机科学家Tony Hoare提出。采用了分治法的思想，通过不断地将待排序序列划分为两部分，然后对这两部分分别进行排序，从而达到整个序列有序的目的。

**快速排序的基本思想和过程**

1. 选择基准值（Pivot）：从待排序序列中选择一个元素作为基准值。基准值的选择有多种方法，如选择第一个元素、最后一个元素、中间元素或随机元素。不同的选择方法在实际应用中可能导致算法性能的差异。
2. 划分子数组（Partitioning）：将待排序序列划分为两个子数组，一个包含小于基准值的元素，另一个包含大于基准值的元素。划分过程中会将基准值放到合适的位置，这个位置即为基准值在已排序序列中的最终位置。
3. 递归排序子数组：对两个子数组分别递归地执行快速排序。由于子数组的大小在每次递归调用时都会减少，所以这个过程会逐渐递归到只剩下一个元素，此时递归终止。

快速排序的核心在于划分子数组（Partitioning）的过程。通常采用双指针法实现：

1. 初始化两个指针 i 和 j，分别指向序列的起始位置和结束位置。
2. 将基准值与指针 j 所指的元素进行比较。如果指针 j 所指的元素大于等于基准值，则将 j 往左移动一位；否则，将指针 j 所指的元素赋值给指针 i 所指的位置，同时将 i 右移一位。
3. 接下来，将基准值与指针 i 所指的元素进行比较。如果指针 i 所指的元素小于等于基准值，则将 i 往右移动一位；否则，将指针 i 所指的元素赋值给指针 j 所指的位置，同时将 j 左移一位。
4. 重复步骤2和3，直到 i 和 j 相遇。此时，将基准值放置在 i（或 j）所指的位置。至此，基准值左边的元素都小于等于基准值，右边的元素都大于等于基准值。
5. 返回基准值所在的索引。这个索引将用于划分子数组，进入下一次递归。

快速排序在最优情况下具有 O(nlogn)的时间复杂度，这是因为在每次划分过程中，如果基准值能将数组均匀地分成两部分，那么递归树的深度就是log(n)。每层递归树需要处理的元素总数是n，因此总的时间复杂度为O(nlogn)。

在最坏情况下，快速排序的时间复杂度为O(n^2)。这种情况发生在待排序序列已经是升序或降序排列，且每次选择的基准值都是最大或最小的元素时。这会导致递归树极度不平衡，最大深度达到n。为了避免这种情况，通常采用随机选取基准值的方法，使得算法在实际应用中的表现更加稳定。

**快速排序的优点**

1. 在平均情况下，具有较高的排序效率，时间复杂度为O(nlogn)；
2. 原地排序，不需要额外的存储空间，空间复杂度为O(logn)，这是由于递归调用栈的深度；
3. 比其他排序算法（如归并排序）具有更好的缓存性能，因为它使用的是局部性原理。

**快速排序的缺点**

1. 在最坏情况下，时间复杂度为O(n^2)，但这可以通过随机选取基准值的方法来改善；
2. 对于小数组，快速排序的性能可能不如插入排序等简单排序算法。因此，实际应用中，快速排序通常与其他排序算法结合使用，例如在递归到较小子数组时切换到插入排序。

::: code-tabs
@tab cpp

```cpp
#include <iostream>

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[low];
    int i = low, j = high;
    while (i < j) {
        while (i < j && arr[j] >= pivot) {
            j--;
        }
        arr[i] = arr[j];
        while (i < j && arr[i] <= pivot) {
            i++;
        }
        arr[j] = arr[i];
    }
    arr[i] = pivot;
    return i;
}

int main() {
    int arr[] = {3, 6, 8, 2, 4, 1, 9, 5, 7};
    int len = sizeof(arr) / sizeof(arr[0]);
    quickSort(arr, 0, len - 1);
    for (int num : arr) {
        std::cout << num << " ";
    }
    return 0;
}
```

@tab java

```java
public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[low];
        int i = low, j = high;
        while (i < j) {
            while (i < j && arr[j] >= pivot) {
                j--;
            }
            arr[i] = arr[j];
            while (i < j && arr[i] <= pivot) {
                i++;
            }
            arr[j] = arr[i];
        }
        arr[i] = pivot;
        return i;
    }

    public static void main(String[] args) {
        int[] arr = {3, 6, 8, 2, 4, 1, 9, 5, 7};
        quickSort(arr, 0, arr.length - 1);
        for (int num : arr) {
            System.out.print(num + " ");
        }
    }
}
```

@tab golang

```go
package main

import "fmt"

func quickSort(arr []int, low, high int) {
    if low < high {
        pivotIndex := partition(arr, low, high)
        quickSort(arr, low, pivotIndex-1)
        quickSort(arr, pivotIndex+1, high)
    }
}

func partition(arr []int, low, high int) int {
	pivot := arr[low]
	i, j := low, high
	for i < j {
		for i < j && arr[j] >= pivot {
			j--
		}
		arr[i] = arr[j]
		for i < j && arr[i] <= pivot {
			i++
		}
		arr[j] = arr[i]
	}
	arr[i] = pivot
	return i
}

func main() {
	arr := []int{3, 6, 8, 2, 4, 1, 9, 5, 7}
	quickSort(arr, 0, len(arr)-1)
	for _, num := range arr {
		fmt.Print(num, " ")
	}
}
```

:::

### 堆排序

堆排序（Heap Sort）是一种基于二叉堆（Binary Heap）的比较排序算法。它利用了堆这种特殊的数据结构，通过构建堆和调整堆的过程来达到排序的目的。堆排序的时间复杂度为O(nlogn)，是一种非常高效的排序方法。在实际应用中，堆排序适用于大数据集的排序，因为它在数据量较大时依然具有良好的性能表现。

**堆排序的基本思想和过程**

1. 构建堆：将待排序序列构建成一个大顶堆（对于升序排序）或小顶堆（对于降序排序）。

大顶堆是一种完全二叉树，满足每个非叶子节点的值都不小于其左右子节点的值。小顶堆也是一种完全二叉树，满足每个非叶子节点的值都不大于其左右子节点的值。构建堆的过程通常从最后一个非叶子节点开始，向前遍历至根节点，对每个节点进行调整，使其满足堆的性质。

2. 提取堆顶元素：将堆顶元素（最大值或最小值）与堆中的最后一个元素交换，然后从堆中移除最后一个元素。

此时，堆顶元素已经被移动到了数组的最后一个位置，因此，数组的最后一个位置已经是有序的。

3. 调整堆：自顶向下调整堆，使其重新满足大顶堆或小顶堆的性质。

调整堆的过程从根节点开始，将当前节点与其左右子节点中的较大（或较小）值进行交换。然后继续向下调整，直到调整到叶子节点或当前节点已经满足堆的性质。

4. 重复步骤2和3，直到堆为空，这样就可以得到一个有序序列。

每次提取堆顶元素后，都会将堆的大小减一。重复提取堆顶元素并调整堆的过程，直到堆为空。这时，整个数组就变成了一个有序序列。

**优点**

1. 时间复杂度为O(nlogn)，在平均和最坏情况下都具有较高的排序效率。
2. 原地排序，不需要额外的存储空间，空间复杂度为O(1)。

**缺点**

1. 不稳定排序。在调整堆的过程中，可能会破坏相同元素的相对顺序。
2. 对于小数组，堆排序的性能可能不如其他更简单的排序算法（如插入排序）。但在处理大数据集时，它的性能优势是无法忽视的。

::: code-tabs
@tab cpp

```cpp
#include <iostream>
#include <vector>

void adjustHeap(std::vector<int>& arr, int i, int n) {
    int temp = arr[i];

    for (int k = 2 * i + 1; k < n; k = 2 * k + 1) {
        // 找到左右子节点中较大的一个
        if (k + 1 < n && arr[k] < arr[k + 1]) {
            k++;
        }

        // 如果子节点大于父节点，则交换它们
        if (arr[k] > temp) {
            arr[i] = arr[k];
            i = k;
        } else {
            break;
        }
    }

    arr[i] = temp;
}

void heapSort(std::vector<int>& arr) {
    int n = arr.size();

    // 构建大顶堆
    for (int i = n / 2 - 1; i >= 0; i--) {
        adjustHeap(arr, i, n);
    }

    // 排序
    for (int i = n - 1; i >= 0; i--) {
        // 交换堆顶元素和最后一个元素
        std::swap(arr[0], arr[i]);

        // 调整堆
        adjustHeap(arr, 0, i);
    }
}

int main() {
    std::vector<int> arr = {3, 6, 8, 2, 4, 1, 9, 5, 7};
    heapSort(arr);
    for (int num : arr) {
        std::cout << num << " ";
    }
    return 0;
}
```

@tab java

```java
public class HeapSort {
    public static void heapSort(int[] arr) {
        int n = arr.length;

        // 构建大顶堆
        for (int i = n / 2 - 1; i >= 0; i--) {
            adjustHeap(arr, i, n);
        }

        // 排序
        for (int i = n - 1; i >= 0; i--) {
            // 交换堆顶元素和最后一个元素
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;

            // 调整堆
            adjustHeap(arr, 0, i);
        }
    }

    private static void adjustHeap(int[] arr, int i, int n) {
        int temp = arr[i];

        for (int k = 2 * i + 1; k < n; k = 2 * k + 1) {
            // 找到左右子节点中较大的一个
            if (k + 1 < n && arr[k] < arr[k + 1]) {
                k++;
            }

            // 如果子节点大于父节点，则交换它们
            if (arr[k] > temp) {
                arr[i] = arr[k];
                i = k;
            } else {
                break;
            }
        }

        arr[i] = temp;
    }

    public static void main(String[] args) {
        int[] arr = {3, 6, 8, 2, 4, 1, 9, 5, 7};
        heapSort(arr);
        for (int num : arr) {
            System.out.print(num + " ");
        }
    }
}
```

@tab golang

```go
package main

import "fmt"

func adjustHeap(arr []int, i int, n int) {
    temp := arr[i]

    for k := 2*i + 1; k < n; k = 2*k + 1 {
        // 找到左右子节点中较大的一个
        if k+1 < n && arr[k] < arr[k+1] {
            k++
        }

        // 如果子节点大于父节点，则交换它们
        if arr[k] > temp {
            arr[i] = arr[k]
            i = k
        } else {
            break
        }
    }

    arr[i] = temp
}

func heapSort(arr []int) {
    n := len(arr)

    // 构建大顶堆
    for i := n/2 - 1; i >= 0; i-- {
        adjustHeap(arr, i, n)
    }

    // 排序
    for i := n - 1; i >= 0; i-- {
        // 交换堆顶元素和最后一个元素
        arr[0], arr[i] = arr[i], arr[0]

        // 调整堆
        adjustHeap(arr, 0, i)
    }
}

func main() {
    arr := []int{3, 6, 8, 2, 4, 1, 9, 5, 7}
    heapSort(arr)
    for _, num := range arr {
        fmt.Print(num, " ")
    }
}
```

:::



### 归并排序

归并排序（Merge Sort）是一种分治策略的排序算法。它的主要思想是将一个大的问题分解成若干个较小的子问题，然后分别解决这些子问题，最后将子问题的解合并成原问题的解。具体来说，归并排序的过程包括分解、解决和合并三个阶段：

1. 分解：将待排序的数组递归地分解为两个子数组，直到每个子数组只包含一个元素。这些单元素子数组已经是有序的，因为一个元素本身就是有序的。
2. 解决：将子数组的解递归地合并起来。合并的过程是将两个有序的子数组合并为一个有序的数组。
3. 合并：在解决阶段，我们需要一个辅助函数（通常称为`merge`函数）来实现两个有序数组的合并。`merge`函数的实现思路是维护两个指针（一个指向第一个数组的第一个元素，另一个指向第二个数组的第一个元素），比较两个指针所指向的元素，将较小的元素添加到结果数组中，并将对应的指针向后移动一位。重复这个过程，直到两个数组中的所有元素都被合并到结果数组中。

归并排序的时间复杂度为 O(nlogn)，其中 n 是待排序数组的长度。这是因为在每一层递归中，需要合并的元素总数为 n，而递归的层数为 logn（因为每次递归都将问题规模减半）。归并排序在最坏、平均和最好情况下的时间复杂度都是 O(nlogn)，这意味着它的性能相对稳定。

::: code-tabs
@tab cpp

```cpp
#include <iostream>
#include <vector>

void merge(std::vector<int>& arr, int l, int m, int r) {
    std::vector<int> temp(r - l + 1);
    int i = l, j = m + 1, k = 0;

    while (i <= m && j <= r) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }

    while (i <= m) {
        temp[k++] = arr[i++];
    }

    while (j <= r) {
        temp[k++] = arr[j++];
    }

    for (int p = 0; p < temp.size(); p++) {
        arr[l + p] = temp[p];
    }
}

void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l >= r) return;

    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}

int main() {
    std::vector<int> arr = {3, 6, 8, 2, 4, 1, 9, 5, 7};
    mergeSort(arr, 0, arr.size() - 1);
    for (int num : arr) {
        std::cout << num << " ";
    }
    return 0;
}
```

@tab java

```java
public class MergeSort {
    public static void merge(int[] arr, int l, int m, int r) {
        int[] temp = new int[r - l + 1];
        int i = l, j = m + 1, k = 0;

        while (i <= m && j <= r) {
            if (arr[i] <= arr[j]) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
            }
        }

        while (i <= m) {
            temp[k++] = arr[i++];
        }

        while (j <= r) {
            temp[k++] = arr[j++];
        }

        System.arraycopy(temp, 0, arr, l, temp.length);
    }

    public static void mergeSort(int[] arr, int l, int r) {
        if (l >= r) return;

        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }

    public static void main(String[] args) {
        int[] arr = {3, 6, 8, 2, 4, 1, 9, 5, 7};
        mergeSort(arr, 0, arr.length - 1);
        for (int num : arr) {
            System.out.print(num + " ");
        }
    }
}
```

@tab golang

```go
package main

import "fmt"

func merge(arr []int, l int, m int, r int) {
    temp := make([]int, r-l+1)
    i, j, k := l, m+1, 0

    for i <= m && j <= r {
        if arr[i] <= arr[j] {
            temp[k] = arr[i]
            i++
        } else {
            temp[k] = arr[j]
            j++
        }
        k++
    }

    for i <= m {
        temp[k] = arr[i]
        i++
        k++
    }

    for j <= r {
        temp[k] = arr[j]
        j++
        k++
    }

    for p := 0; p < len(temp); p++ {
        arr[l+p] = temp[p]
    }
}

func mergeSort(arr []int, l int, r int) {
    if l >= r {
        return
    }

    m := l + (r-l)/2
    mergeSort(arr, l, m)
    mergeSort(arr, m+1, r)
    merge(arr, l, m, r)
}

func main() {
    arr := []int{3, 6, 8, 2, 4, 1, 9, 5, 7}
    mergeSort(arr, 0, len(arr)-1)
    for _, num := range arr {
        fmt.Print(num, " ")
    }
}
```

:::
