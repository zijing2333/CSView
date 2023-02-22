---
title: 链表
author: 枫长
---

### [206.反转链表](https://leetcode.cn/problems/reverse-linked-list/)

> 给你单链表的头节点head，请你反转链表，并返回反转后的链表。

**解题思路**：板子题，很多链表操作题都需要写个反转链表的子函数。

::: code-tabs

@tab cpp

```cpp
ListNode* reverseList(ListNode* head) {
    ListNode *cur = head, *pre = nullptr, *next = nullptr;
    while(cur != nullptr) {
        next = cur-> next;
        cur->next = pre;
        pre = cur;
        cur = next;
    }
    return pre;
}
```

@tab java
```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode pre = null;
        ListNode cur = head;
        while(cur != null) {
            ListNode tmp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = tmp;
        }
        return pre;
    }
}
```

@tab golang

```go
// 迭代
func reverseList(head *ListNode) *ListNode {
    if head==nil||head.Next==nil{
        return head
    }
    var node *ListNode
    for head!=nil{
        head.Next,head,node = node,head.Next,head
        //tmp := head.Next
        //head.Next = node
        //node = head
        //head = tmp
    }
    return node
}

//递归
func reverseList(head *ListNode) *ListNode {
    if head==nil||head.Next==nil{
        return head
    }
    last := reverseList(head.Next)
    head.Next.Next = head
    head.Next = nil
    return last
}
```

:::

-----




### [83.删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/)

> 给定一个已排序的链表的头head，删除所有重复的元素，使每个元素只出现一次。返回已排序的链表。
>

**解题思路**：这道题就是链表遍历一圈，当当前元素和下一个元素相同时，一直删除直到下一个元素和当前元素不相同即可。算法复杂度O(n)。

::: code-tabs


@tab cpp

```cpp
class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        ListNode* cur = head;
        while(cur != nullptr) {
            ListNode* next = cur->next;
            while(next != nullptr && cur->val == next->val) {
                cur->next = next->next;
                next = cur->next;
            }
            cur = cur->next;
            if(cur != nullptr) {
                next = cur->next;
            }
        }
        return head;
    }
};
```

@tab java
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        if(head == null) return null;
        ListNode dummy = new ListNode();
        dummy.next = head;
        ListNode slow = head;
        ListNode fast = head;
        while(fast != null) {
            while(fast != null && fast.val == slow.val) fast = fast.next;
            if(fast == null) break;
            slow.next = fast;
            slow = slow.next;
            fast = slow;
        }
        slow.next = null;
        return dummy.next;
    }
}
```

@tab golang
```go
//递归
func deleteDuplicates(head *ListNode) *ListNode {
    if (head == nil || head.Next == nil) {
        return head
    }
    head.Next = deleteDuplicates(head.Next)
    if head.Val == head.Next.Val {
        return head.Next
    }

    return head
}
//迭代
func deleteDuplicates(head *ListNode) *ListNode {
    // 迭代实现
    if(head == nil || head.Next == nil) {
        return head
    }
    cur := head
    for cur.Next != nil {
        if cur.Val == cur.Next.Val {
            cur.Next = cur.Next.Next
        } else {
            cur = cur.Next
        }
    }

    return head
}
```
:::

-----

### [25.K个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group)

> 给你链表的头节点head，每k个节点一组进行翻转，请你返回修改后的链表。k是一个正整数，它的值小于或等于链表的长度。如果节点总数不是k的整数倍，那么请将最后剩余的节点保持原有顺序。
>

**解题思路**：这道题也是实际考察**链表操作**的熟悉程度，思路就是每遍历k个节点翻转一次，然后翻转之后的这段链表再连到原有链表上。最好链表反转单独写一个函数，这样不容易出错。

::: code-tabs

@tab cpp

```cpp
class Solution {
public:
    ListNode* reverse(ListNode* begin, ListNode* end) {
        ListNode* pre = nullptr, *next = nullptr;
        for(ListNode* cur = begin; cur != end;) {
            next = cur->next;
            cur->next = pre;
            pre = cur;
            cur = next;
        }
        return pre;
    }
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode* org = new ListNode(-1, head);
        ListNode* pre = org;
        ListNode* cur = head;
        int cnt = 1;
        while(cur != nullptr) {
            if(cnt == k) {
                ListNode* next = cur->next;
                ListNode* curBegin = reverse(pre->next, cur->next);
                ListNode* curEnd = pre->next;
                curEnd->next = next;
                pre->next = curBegin;
                cnt = 0;
                pre = curEnd;
                cur = curEnd;
            }
            cnt++;
            cur = cur->next;
        }
        return org->next;
    }   
};
```

@tab java
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode();
        dummy.next = head;
        ListNode pre = dummy;
        while(true) {
            ListNode cur = pre;
            for(int i=0;i<k && cur!=null;i++) cur = cur.next;
            if(cur == null) break;
            ListNode tmp = cur.next;
            cur.next = null;
            ListNode nh = reverse(pre.next);
            ListNode np = pre.next;
            pre.next.next = tmp;
            pre.next = nh;
            pre = np;
        }
        return dummy.next;
    }

    private ListNode reverse(ListNode head) {
        ListNode cur = head;
        ListNode pre = null;
        while(cur != null) {
            ListNode tmp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = tmp;
        }
        return pre;
    }
}
```

@tab golang

```go
func reverseKGroup(head *ListNode, k int) *ListNode {
    cur := head
    for i := 0; i < k; i++ {
        if cur == nil {
            return head
        }
        cur = cur.Next
    }
    newHead := reverse(head, cur)
    head.Next = reverseKGroup(cur, k)
    return newHead
}

func reverse(start, end *ListNode) *ListNode {
    var pre *ListNode
    cur := start
    for cur != end {
        nxt := cur.Next
        cur.Next = pre
        pre = cur
        cur = nxt
    }
    return pre
}
```
:::

-----

### [160.相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/)

> 给你两个单链表的头节点headA和headB，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null。
>

**解题思路**：

- 这个做法基本就是记住，本质上是**双指针**的套路。
  - 如果a，b无交点，那么a，b最后会同时到达nullptr
  - 如果a，b有交点，如果两者到交点路程相同，那么直接返回，如果路程不相同，那么就是a跑一个a，b的路程，b跑一个b，a的路程还是会同时到交点


::: code-tabs

@tab cpp

```cpp
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        //双指针思路
        ListNode* a = headA;
        ListNode* b = headB;
        while(a! = nullptr || b! = nullptr){
            if(a == nullptr) a = headB;
            if(b == nullptr) b = headA;
            if(a == b) return a;
            a = a->next;
            b = b->next;
        }
        return nullptr;
    }
```

@tab java
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode();
        dummy.next = head;
        ListNode pre = dummy;
        while(true) {
            ListNode cur = pre;
            for(int i=0;i<k && cur!=null;i++) cur = cur.next;
            if(cur == null) break;
            ListNode tmp = cur.next;
            cur.next = null;
            ListNode nh = reverse(pre.next);
            ListNode np = pre.next;
            pre.next.next = tmp;
            pre.next = nh;
            pre = np;
        }
        return dummy.next;
    }

    private ListNode reverse(ListNode head) {
        ListNode cur = head;
        ListNode pre = null;
        while(cur != null) {
            ListNode tmp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = tmp;
        }
        return pre;
    }
}
```

@tab golang

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func getIntersectionNode(headA, headB *ListNode) *ListNode {
    l1, l2 := headA, headB
    for l1 != l2{
        if l1!=nil{
            l1 = l1.Next
        }else{
            l1 = headB
        }
        if l2!=nil{
            l2 = l2.Next
        }else{
            l2 = headA
        }
    }
    return l2
}
```
:::

-----

### [21.合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

> 将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
>

**解题思路**：
- 这也属于板子题，准备一个虚节点，list1和list2谁值小谁挂虚节点上，同时那个链表往后一位
- 有个不需要管一个到结尾另一个没到结尾导致无法比较的技巧，如果遍历到nullptr，那么比较的值就设为INT_MAX。

::: code-tabs

@tab cpp

```cpp
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode* org = new ListNode(0);
        ListNode* cur = org;
        while(list1 != nullptr || list2 != nullptr) {
            int va1 = list1 != nullptr ? list1->val : INT_MAX;
            int va2 = list2 != nullptr ? list2->val : INT_MAX;
            if(va1 < va2) {
                cur->next = list1;
                list1 = list1-> next;
            }else {
                cur->next = list2;
                list2 = list2-> next;
            }
            cur = cur->next;
        }
        return org->next;
    }
```

@tab java
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode();
        ListNode cur = dummy;
        while(list1 != null || list2 != null) {
            if(list1 != null && list2 != null) {
                cur.next = list1.val < list2.val ? list1 : list2;
                if(list1.val < list2.val) list1 = list1.next;
                else list2 = list2.next;
            } else if(list1 != null) {
                cur.next = list1;
                list1 = list1.next;
            } else {
                cur.next = list2;
                list2 = list2.next;
            }
            cur = cur.next;
        }
        return dummy.next;
    }
}
```

@tab golang

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func mergeTwoLists(l1 *ListNode, l2 *ListNode) *ListNode {
    dummy := new(ListNode)
    node := dummy
    for l1!=nil&&l2!=nil{
        if l1.Val>l2.Val{
        node.Next = l2
        node = node.Next
        l2 = l2.Next
        }else{
        node.Next = l1
        node = node.Next
        l1 = l1.Next
        }
    }
    if l1==nil{
        node.Next = l2
    }
    if l2==nil{
        node.Next = l1
    }
    return dummy.Next
}
```
:::

------



### [143.重排链表](https://leetcode.cn/problems/reorder-list)

> 给定一个单链表 L 的头节点 head ，单链表 L 表示为：
>
> L0 → L1 → … → Ln - 1 → Ln
> 请将其重新排列后变为：
>
> L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …
> 不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。
**解题思路**：这种题属于3个简单题合并在一起的中等题，我们可以拆开来看

- 首先先找到链表的中点，然后分成两段，链表长度偶数无所谓，奇数中点节点给第一段，这是用**快慢指针**的简单题。
- 然后反转后一段链表，反转链表问题。
- 然后两个链表交错合并，链表合并问题，就可以得到答案。

::: code-tabs

@tab cpp

```cpp
    ListNode* reverse(ListNode* head) {
        ListNode* pre = nullptr, *next = nullptr;
        ListNode* cur = head;
        while(cur != nullptr) {
            next = cur->next;
            cur->next = pre;
            pre = cur;
            cur = next;
        }
        return pre;
    }
    void reorderList(ListNode* head) {
        if(head->next == nullptr) {
            return;
        }
        ListNode* fast = head, *slow = head;
        while(fast != nullptr && fast->next != nullptr) {
            fast = fast->next;
            if(fast != nullptr) {
                fast = fast->next;
            }
            slow = slow->next;
        }
        fast = slow;
        slow = reverse(slow->next);
        fast->next = nullptr;
        fast = head;
        ListNode* org = new ListNode(-1);
        ListNode* cur = org;
        while(fast != nullptr && slow != nullptr) {
            ListNode* fastNext = fast->next;
            ListNode* slowNext = slow->next;
            cur->next = fast;
            cur = cur->next;
            cur->next = slow;
            cur = cur->next;
            fast = fastNext;
            slow = slowNext;
        }
        cur->next = fast;
        head = org->next;
    }
```
@tab java
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public void reorderList(ListNode head) {
        ListNode dummy = new ListNode();
        dummy.next = head;
        ListNode slow = dummy;
        ListNode fast = dummy;
        while(fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next;
            if(fast == null) break;
            fast = fast.next;
        }
        ListNode a = dummy.next;
        ListNode b = slow.next;
        slow.next = null;
        b = reverse(b);
        ListNode cur = dummy;
        while(a != null || b != null) {
            cur.next = a;
            a = a.next;
            cur = cur.next;
            if(b == null) break;
            cur.next = b;
            b = b.next;
            cur = cur.next;
        }
    }

    private ListNode reverse(ListNode head) {
        if(head == null) return null;
        ListNode cur = head;
        ListNode pre = null;
        while(cur != null) {
            ListNode tmp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = tmp;
        }
        return pre;
    }
}
```
@tab golang

```go
func reorderList(head *ListNode)  {
 var nodes []*ListNode
 for head !=nil{
     nodes =append(nodes,head)
     head = head.Next
 }
 i,j:=0,len(nodes)-1
 for i < j{
     nodes[i].Next = nodes[j]
     i++
     if i == j{
         break 
     }
     nodes[j].Next=nodes[i]
     j--
 }
 nodes[i].Next = nil 
}
```
:::

-----
### [148.排序链表](https://leetcode.cn/problems/sort-list/)

> 给你链表的头结点head，请将其按 **升序** 排列并返回 **排序后的链表** 。
>
**解题思路**：

- 数组的排序都很熟悉，有快排，归并排序，堆排这三种思路，但这三种方法不一定都适合链表排序，快排和堆排实现都需要通过数组下标访问元素，而这点链表做不到。
- 因此这道题最好用归并排序来解，分治的思路。

::: code-tabs

@tab cpp

```cpp
    ListNode* mergeSort(ListNode* begin, ListNode* end, int n) {
        if(n == 1) {
            begin->next = nullptr;
            return begin;
        }
        ListNode* nodeEnd1 = begin;
        ListNode* nodeBegin2 = begin;
        int m = n/2;
        for(int i = 0; i < m; i++) {
            nodeEnd1 = nodeBegin2;
            nodeBegin2 = nodeBegin2->next;
        }
        nodeEnd1->next = nullptr;
        ListNode* cur1 = mergeSort(begin, nodeEnd1, m);
        ListNode* cur2 = mergeSort(nodeBegin2, end, n - m);
        ListNode* org = new ListNode(1);
        ListNode* cur = org;
        while(cur1 != nullptr || cur2 != nullptr) {
            int va1 = cur1 == nullptr ? INT_MAX : cur1->val;
            int va2 = cur2 == nullptr ? INT_MAX : cur2->val;
            if(va1 < va2) {
                cur->next = cur1;
                cur1 = cur1->next;
            }else {
                cur->next = cur2;
                cur2 = cur2->next;
            }
            cur = cur->next;
        }
        cur->next = nullptr;
        return org->next;
    }
    ListNode* sortList(ListNode* head) {
        if(head == nullptr) {
            return nullptr;
        }
        ListNode* begin = head;
        ListNode* end = head;
        int n = 1;
        while(end->next != nullptr) {
            end = end->next;
            n++;
        }
        return mergeSort(begin, end, n);
    }
```

@tab java
```java
class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null)
            return head;
        ListNode fast = head.next, slow = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode tmp = slow.next;
        slow.next = null;
        ListNode left = sortList(head);
        ListNode right = sortList(tmp);
        ListNode h = new ListNode(0);
        ListNode res = h;
        while (left != null && right != null) {
            if (left.val < right.val) {
                h.next = left;
                left = left.next;
            } else {
                h.next = right;
                right = right.next;
            }
            h = h.next;
        }
        h.next = left != null ? left : right;
        return res.next;
    }
}

```
@tab golang

```go
func sortList(head *ListNode) *ListNode {
   if head == nil || head.Next == nil {
      return head
   }
   slow, fast, pre := head, head, new(ListNode)
   for fast != nil && fast.Next != nil {
      pre = slow
      slow = slow.Next
      fast = fast.Next.Next
   }
   pre.Next = nil
   list1 := sortList(head)
   list2 := sortList(slow)
   return merge(list1, list2)
}

func merge(head1 *ListNode, head2 *ListNode) *ListNode {
   dummyHead := new(ListNode)
   cur := dummyHead
   for head1 != nil && head2 != nil {
      if head1.Val < head2.Val {
         cur.Next = head1
         head1 = head1.Next
      } else {
         cur.Next = head2
         head2 = head2.Next
      }
      cur = cur.Next
   }
   if head1 == nil {
      cur.Next = head2
   } else {
      cur.Next = head1
   }
   return dummyHead.Next
}
```
:::

------



### [92.反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii)

> 给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 。
>
**解题思路**：这道题也是一个考链表操作的题：

- 第一步，把left到right之间的链表拆出来，注意保存left之前一个，right后一个方便拼接

- 第二步，反转链表
- 第三步，将反转后的链表拼接回去

::: code-tabs

@tab cpp

```cpp
    void reverseLinkedList(ListNode *head) {
        // 也可以使用递归反转一个链表
        ListNode *pre = nullptr;
        ListNode *cur = head;

        while (cur != nullptr) {
            ListNode *next = cur->next;
            cur->next = pre;
            pre = cur;
            cur = next;
        }
    }
    ListNode *reverseBetween(ListNode *head, int left, int right) {
        ListNode *org = new ListNode(-1);
        org->next = head;
        ListNode *pre = org;
        for (int i = 0; i < left - 1; i++) {
            pre = pre->next;
        }
        ListNode *rightNode = pre;
        for (int i = 0; i < right - left + 1; i++) {
            rightNode = rightNode->next;
        }
        ListNode *leftNode = pre->next;
        ListNode *curr = rightNode->next;

        pre->next = nullptr;
        rightNode->next = nullptr;
        reverseLinkedList(leftNode);
        pre->next = rightNode;
        leftNode->next = curr;
        return org->next;
    }
```
@tab java
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    private ListNode tmp;

    public ListNode reverseBetween(ListNode head, int left, int right) {
        if(left > 1) {
            head.next = reverseBetween(head.next, left-1, right-1);
            return head;
        } else {
            if(right == 1) {
                tmp = head.next;
                return head;
            } else {
                ListNode nh = reverseBetween(head.next, left, right-1);
                head.next.next = head;
                head.next = tmp;
                return nh;
            }
        }
    }
}

```
@tab golang

```go
func reverseBetween(head *ListNode, left int, right int) *ListNode {
    // 根据给定范围反转链表, 一趟遍历实现
	// 哨兵节点
	dummy := &ListNode{}
	dummy.Next = head
	// 初始化节点，移动到left位置
	// 卫兵节点，不动节点
	guard := dummy
	// 移动节点
	p := dummy.Next
	// 移动guard和p到对应节点，准备反转
	// guard作为left节点的前继节点，p与left重合
	for i:=0;i<left-1;i++ {
		guard = guard.Next
		p = p.Next
	}
	// 反转left-right部分
	for i:=0;i<right-left;i++ {
		// 迭代法的实现
		rmNode := p.Next
		p.Next = p.Next.Next
		rmNode.Next = guard.Next
		guard.Next = rmNode
	}
	return dummy.Next
}
```

:::

------



### [142.环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)

> 给定一个链表的头节点 `head` ，返回链表开始入环的第一个节点。 如果链表无环，则返回 `null`。
>
**解题思路**：这道题用的是快慢指针，具体为啥这么干我也不知道，硬背吧：

- fast与slow两个指针，fast走两步，slow走一步。
- 如果fast碰到slow了则，说明有环；如果fast == nullptr，则无环直接返回
- 接着slow不动，fast重新放到head上，各自走一步，直到fast == slow，此时fast就是开始入环的第一个节点。

::: code-tabs

@tab cpp

```cpp
    ListNode *detectCycle(ListNode *head) {
        if(head == nullptr) {
            return nullptr;
        }
        ListNode* fast = head;
        ListNode* slow = head;
        int flag = 0;
        while(fast != nullptr) {
            fast = fast->next;
            if(fast != nullptr) {
                fast = fast->next;
            }
            slow = slow->next;
            if(fast == slow) {
                flag = 1;
                break;
            }
        }
        if(fast == nullptr) {
            return nullptr;
        }
        fast = head;
        while(fast != slow) {
            fast = fast->next;
            slow = slow->next;
        }
        return slow;
    }
```
@tab java
```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while(slow != null && fast != null) {
            fast = fast.next;
            if(fast == null) return null;
            fast = fast.next;
            slow = slow.next;
            if(slow == fast) break;
        }
        if(slow == null || fast == null) return null;
        fast = head;
        while(fast != slow) {
            fast = fast.next;
            slow = slow.next;
        }
        return slow;
    }
}

```

@tab golang

```go
func detectCycle(head *ListNode) *ListNode {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast {
            for slow != head {
                slow = slow.Next
                head = head.Next
            }
            return head
        }
    }
    return nil
}

```
:::

------



### [19.删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

> 给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。
**解题思路**：

- 这道题比较简单，就先记录链表长度，第二遍再遍历len - n个找到那个节点并删除
- 所谓的先遍历n个那种做法也是两遍遍历，只不过写到一个for循环里了


::: code-tabs

@tab cpp

```cpp
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        int len = 0;
        ListNode* org = new ListNode(-1, head);
        ListNode* cur = head;
        while(cur != nullptr) {
            cur = cur->next;
            len++;
        }
        cur = org;
        for(int i = 0; i < len - n; i++) {
            cur = cur->next;
        }
        if(cur->next->next) {
            cur->next = cur->next->next;
        }else {
            cur->next = nullptr;
        }
        return org->next;
    }
```

@tab java
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode();
        dummy.next = head;
        ListNode fast = head;
        ListNode slow = dummy;
        for(int i=0;i<n;i++) fast = fast.next;
        while(fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return dummy.next;
    }
}
```
@tab golang

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func removeNthFromEnd(head *ListNode, n int) *ListNode {
    dummy := new(ListNode)
    dummy.Next = head
    x := getKthFromEnd(dummy,n+1)
    x.Next = x.Next.Next
    return dummy.Next
}

func getKthFromEnd(head *ListNode, k int) *ListNode{
    p1 := head
    p2 := head
    for i:=0;i<k;i++{
        p1 = p1.Next
    }
    for p1!=nil{
        p1 = p1.Next
        p2 = p2.Next
    }
    return p2
}
```

:::

------



### [82.删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/)

> 给定一个已排序的链表的头`head` ， 删除原始链表中所有重复数字的节点，只留下不同的数字。返回已排序的链表。
**解题思路**：

- 这题其实就是当你碰到重复了，就先保留一下重复节点的pre，然后遍历完重复的，然后把pre连到第一个不重复的元素上。
- 就是注意一下有可能重复节点在末尾，注意做一下处理

::: code-tabs

@tab cpp

```cpp
    ListNode* deleteDuplicates(ListNode* head) {
        ListNode *org = new ListNode(-1, head);
        ListNode *cur = head, *pre = org;
        while(cur != nullptr && cur->next != nullptr) {   
            int flag = 0;
            while(cur->next != nullptr && cur->val == cur->next->val) {
                flag = 1;
                cur->next = cur->next->next;
            }
            if(flag) {
                pre->next = cur->next;
                cur = cur->next;
            }else {
                pre = pre->next;
                cur = cur->next;
            }
        }

        return org->next;
    }
```
@tab java
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        if(head == null) return null;
        ListNode dummy = new ListNode();
        dummy.next = head;
        ListNode cur = dummy;
        while(cur != null) {
            ListNode slow = cur.next;
            ListNode fast = slow;
            boolean repeat = false;
            while(fast != null && fast.val == slow.val) {
                if(fast != slow) repeat = true;
                fast = fast.next;
            }
            if(!repeat) {
                cur.next = slow;
                cur = cur.next;
            } else {
                cur.next = fast;
            }
        }
        return dummy.next;
    }
}
```
@tab golang

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func deleteDuplicates(head *ListNode) *ListNode{
    dummy := &ListNode{Next:head}
    pre,cur := dummy,head
    for cur != nil{
        for cur.Next != nil && cur.Val == cur.Next.Val{
            cur = cur.Next
        }
        if pre.Next == cur{
            pre = pre.Next
        }else{
            pre.Next = cur.Next
        }
        cur = cur.Next
    }
    return dummy.Next
}
```

:::

------



### [23.合并K个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)

> 给你一个链表数组，每个链表都已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表。
>

**解题思路**：**多路归并**问题，两个思路，第一个需要用到的数据结构是**优先队列**。时间复杂度O(mnlogn)；第二个思路是**分治**。

- 优先队列可以这么想，因为链表是升序的，所以最小的元素一定都是链表头部，我们可以用一个优先队列保存链表头部指针，这个优先队列的大小就为k，然后每次取头部，将其依次放入返回链表中，将其下一个压回优先队列，直到遍历完。时间复杂度O(k*n*logk)，空间复杂度O(k)。
- 第二个做法是分治，可以先考虑合并两个升序链表，如果一个一个来合并的话，第一次代价n + n, 第二次n + 2n, 第三次n + 3n.... 依次类推，最后的时间复杂度就是O(k* n^2)，代价有点大，我们可以用分治的思路，从链表划分为2组，4组，8组...来合并，这样时间复杂度就是O(k * n * logk),空间复杂度O(logk)。

::: code-tabs


@tab cpp

```cpp
   ListNode* mergeKLists(vector<ListNode*>& lists) {
        ListNode* org = new ListNode(-1);
        ListNode* cur = org;
        auto cmp = [](ListNode* a, ListNode* b){
            return a->val > b->val;
        };
        priority_queue<ListNode*,vector<ListNode*>,decltype(cmp)> q(cmp);
        for(int i = 0; i < lists.size(); i++) {
            if(lists[i] != nullptr) {
                q.push(lists[i]);   
            }
        }
        while(!q.empty()) {
            ListNode* tmp = q.top();
            q.pop();
            cur->next = tmp;
            cur = cur->next;
            if(tmp->next != nullptr) {
                q.push(tmp->next);
            }
        }
        return org->next;
    }
```
@tab java
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if(lists == null || lists.length == 0) return null;
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> (a.val - b.val));
        int k = lists.length;
        for(int i=0;i<k;i++) {
            if(lists[i] == null) continue;
            pq.offer(lists[i]);
        }
        ListNode dummy = new ListNode();
        ListNode cur = dummy;
        while(!pq.isEmpty()) {
            ListNode min = pq.poll();
            if(min.next != null) pq.offer(min.next);
            cur.next = min;
            cur = cur.next;
        }
        return dummy.next;
    }
}

```

@tab golang

```go
func mergeKLists(lists []*ListNode) *ListNode {
    var pre, cur *ListNode
    n := len(lists)
    for i := 0; i < n; i++ {
        if i == 0 {
            pre = lists[i]
            continue
        }
        cur = lists[i]
        pre = merge(pre, cur)
    }
    return pre
}

func merge(l1, l2 *ListNode) *ListNode {
    head := &ListNode{}
    cur := head
    for l1 != nil || l2 != nil {
        if l1 != nil && l2 != nil {
            if l1.Val < l2.Val {
                cur.Next = l1
                l1 = l1.Next
            } else {
                cur.Next = l2
                l2 = l2.Next
            }
            cur = cur.Next
        } else if l1 != nil {
            cur.Next = l1
            break
        } else {
            cur.Next = l2
            break
        }
    }
    return head.Next
}
```
:::

-----
### [2.两数相加](https://leetcode.cn/problems/add-two-numbers)

> 给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照逆序的方式存储的，并且每个节点只能存储一位数字。请你将两个数相加，并以相同形式返回一个表示和的链表。你可以假设除了数字0之外，这两个数都不会以0开头。
>
**解题思路**：这种链表求和也属于板子题
- 可以用一位数来记录进位值，然后在一个循环里全部搞定，直到两个节点都为null以及进位值为0的时候返回。
- 链表问题如果题目需要返回新链表时，虚拟节点是一个很不错的思路，可以省去一些讨论。
::: code-tabs
@tab cpp

```cpp
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode* org = new ListNode(-1);
        ListNode* cur = org;
        int ca = 0;
        while(l1 != nullptr || l2 != nullptr || ca != 0) {
            int va1 = l1 == nullptr ? 0 : l1->val;
            int va2 = l2 == nullptr ? 0 : l2->val;
            int val = va1 + va2 + ca;
            ca = val / 10;
            val = val % 10;
            cur->next = new ListNode(val);
            cur = cur->next;
            if(l1 != nullptr) {
                l1 = l1->next;
            }
            if(l2 != nullptr) {
                l2 = l2->next;
            }
        }
        return org -> next;
    }
```
@tab java
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode l3 = new ListNode(0);
        ListNode cur = l3;
        int carry = 0;
        while(l1 != null || l2 != null){
            int sum1 = l1 == null? 0:l1.val;
            int sum2 = l2 == null? 0:l2.val;
            int sum = sum1 + sum2 + carry;
            carry = sum/10;
            cur.next = new ListNode(sum % 10);
            cur = cur.next;
            if(l1 != null) l1 = l1.next;
            if(l2 != null) l2 = l2.next;
        }
        if(carry != 0){
            cur.next = new ListNode(carry);
        }
        return l3.next;
  }
}

```
@tab golang

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
     cur := &ListNode{}
     pre := cur
     carry,x,y := 0,0,0

     for l1!=nil||l2!=nil{
         if l1!=nil{
             x = l1.Val
         }else{
             x = 0
         }
         if l2!=nil{
             y = l2.Val
         }else{
             y = 0 
         }
         sum := x + y + carry
         carry = sum/10
         sum = sum%10
         cur.Next = &ListNode{Val:sum}
         cur = cur.Next
         if l1!=nil{
             l1 = l1.Next
         }
         if l2!=nil{
             l2 = l2.Next
         }
     }
     if carry==1{
         cur.Next = &ListNode{Val:1}
     }
     return pre.Next
}
```
:::

------



### [138.复制带随机指针的链表](https://leetcode.cn/problems/copy-list-with-random-pointer)

> 给你一个长度为 n 的链表，每个节点包含一个额外增加的随机指针 random ，该指针可以指向链表中的任何节点或空节点。
>
> 构造这个链表的 深拷贝。 深拷贝应该正好由 n 个 全新 节点组成，其中每个新节点的值都设为其对应的原节点的值。新节点的 next 指针和 random 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。复制链表中的指针都不应指向原链表中的节点 。
>
> 例如，如果原链表中有 X 和 Y 两个节点，其中 X.random --> Y 。那么在复制链表中对应的两个节点 x 和 y ，同样有 x.random --> y 。
>
> 返回复制链表的头节点。
>
> 用一个由 n 个节点组成的链表来表示输入/输出中的链表。每个节点用一个 [val, random_index] 表示：
>
> val：一个表示 Node.val 的整数。
> random_index：随机指针指向的节点索引（范围从 0 到 n-1）；如果不指向任何节点，则为  null 。
> 你的代码只接受原链表的头节点 head 作为传入参数。
**解题思路**：
- 这道题有两个方法：
- 方法1：需要额外创建一个**hash表**
- - 按next顺序遍历给出的链表，并为每个旧节点创建一个新节点，用hash表存映射
- - 之后在给每个新节点建立连接关系，旧节点->旧节点的映射关系拷贝到新节点上就是hash[旧节点]->hash[旧节点]，next和random的建立方式相同，遍历每个旧节点即可。
- 方法2：不需要用hash表来存映射关系，但是对链表操作要求比较高
- - 先给每个旧节点后面new一个新节点，这样旧节点->next = 对应新节点，旧节点->next->next = 原来的旧节点->next，以此来存映射关系。
- - 然后按照每个旧节点的映射关系给对应的新节点建立映射关系，最后再交替分开旧链表与新链表。
::: code-tabs
@tab cpp

```cpp
//方法一，hash表存映射
    Node* copyRandomList(Node* head) {
        unordered_map<Node*,Node*> hash;
        Node* cur=head;
        while(cur!=nullptr){
            Node* temp=new Node(cur->val);
            hash[cur]=temp;
            cur=cur->next;
        }
        cur=head;
        while(cur!=nullptr){
            hash[cur]->next=hash[cur->next];
            hash[cur]->random=hash[cur->random];
            cur=cur->next;
        }
        return hash[head];
    }
//方法二，新节点挂旧节点后面
    Node* copyRandomList(Node* head) {
        if(head==nullptr) return nullptr;
        Node* cur=head;
        while(cur!=nullptr){
            Node* temp=new Node(cur->val);
            Node* nextNode=cur->next;
            cur->next=temp;
            temp->next=nextNode;
            cur=temp->next;
        }
        cur=head;
        while(cur!=nullptr){
            if(cur->random!=nullptr) cur->next->random=cur->random->next;
            cur=cur->next->next;
        }
        cur=head;
        Node* newCur=head->next;
        Node* newhead=newCur;
        while(cur!=nullptr){
            cur->next=newCur->next;
            cur=cur->next;
            if(cur!=nullptr){
                newCur->next=cur->next;
                newCur=newCur->next;
            }
        }
        return newhead;
    }
```
@tab java
```java

/*
// Definition for a Node.
class Node {
    int val;
    Node next;
    Node random;

    public Node(int val) {
        this.val = val;
        this.next = null;
        this.random = null;
    }
}
*/

class Solution {
    public Node copyRandomList(Node head) {
        if(head == null) return null;
        Node cur = head;
        while(cur != null) {
            Node tmp = cur.next;
            cur.next = new Node(cur.val);
            cur.next.next = tmp;
            cur = tmp;
        }
        cur = head;
        while(cur != null) {
            if(cur.random != null) {
                cur.next.random = cur.random.next;
            }
            cur = cur.next.next;
        }
        cur = head;
        Node nh = head.next;
        while(cur != null) {
            Node tmp = cur.next;
            if(cur.next == null) break;
            cur.next = cur.next.next;
            cur = tmp;
        }
        return nh;
    }
}


```

@tab golang

```go
var cachedNode map[*Node]*Node

func deepCopy(node *Node) *Node {
    if node == nil {
        return nil
    }
    if n, has := cachedNode[node]; has {
        return n
    }
    newNode := &Node{Val: node.Val}
    cachedNode[node] = newNode
    newNode.Next = deepCopy(node.Next)
    newNode.Random = deepCopy(node.Random)
    return newNode
}

func copyRandomList(head *Node) *Node {
    cachedNode = map[*Node]*Node{}
    return deepCopy(head)
}
```

::: 

------



### [24.两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/)

> 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。
**解题思路**：
- 这道题也是一个考察**链表操作**的问题, 两两交换节点就是以3个为一组进行操作，当剩下节点不足三个时，直接返回。
- 链表操作中很多节点连接关系不注意就变化了，可以先把每个操作的节点存下来，这样不容易出错。
- 三个节点，cur，even，odd，按照cur，odd，even的顺序连就可以了，注意even先连上cur->next，或者你把cur->next保存下来让even最后连上也行。

::: code-tabs
@tab cpp

```cpp
    ListNode* swapPairs(ListNode* head) {
        if(head==nullptr || head->next==nullptr) return head;
        ListNode* org=new ListNode(0,head);
        ListNode* cur=org;
        while(cur->next!=nullptr && cur->next->next!=nullptr){
            ListNode* even=cur->next;
            ListNode* odd=cur->next->next;
            cur->next=odd;
            even->next=odd->next;
            odd->next=even;
            cur=even;
        }
        return org->next;
    }
```
@tab java
```java

/*
// Definition for a Node.
class Node {
    int val;
    Node next;
    Node random;

    public Node(int val) {
        this.val = val;
        this.next = null;
        this.random = null;
    }
}
*/

class Solution {
    public Node copyRandomList(Node head) {
        if(head == null) return null;
        Node cur = head;
        while(cur != null) {
            Node tmp = cur.next;
            cur.next = new Node(cur.val);
            cur.next.next = tmp;
            cur = tmp;
        }
        cur = head;
        while(cur != null) {
            if(cur.random != null) {
                cur.next.random = cur.random.next;
            }
            cur = cur.next.next;
        }
        cur = head;
        Node nh = head.next;
        while(cur != null) {
            Node tmp = cur.next;
            if(cur.next == null) break;
            cur.next = cur.next.next;
            cur = tmp;
        }
        return nh;
    }
}

```
@tab golang

```go
func swapPairs(head *ListNode) *ListNode {
	dummy := &ListNode{}
	dummy.Next = head
	prev := dummy
	for head != nil && head.Next != nil {
		next := head.Next
		head.Next = next.Next
		next.Next = head
		prev.Next = next

		prev = head
		head = head.Next
	}
	return dummy.Next
}
```
:::

------



### [141.环形链表](https://leetcode.cn/problems/linked-list-cycle/)

> 给你一个链表的头节点 head ，判断链表中是否有环。
>
> 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。
>
> 如果链表中存在环 ，则返回 true 。 否则，返回 false 。
>

::: code-tabs
@tab java
```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {
        if(head == null || head.next == null) return false;
        ListNode slow = head;
        ListNode fast = head.next;
        while(slow != null && fast != null) {
            if(slow == fast) return true;
            slow = slow.next;
            fast = fast.next;
            if(fast != null) fast = fast.next;
        }
        return false;
    }
}

```

@tab golang

```go
func hasCycle(head *ListNode) bool {
	slow, fast := head, head
	for fast != nil {
		if fast.Next == nil {
			return false
		}
		slow, fast = slow.Next, fast.Next.Next
		if slow == fast {                    
			return true
		}
	}
	return false
}
```
:::


### [234.回文链表](https://leetcode.cn/problems/palindrome-linked-list/)

> 给你一个单链表的头节点 `head` ，请你判断该链表是否为回文链表。如果是，返回 `true` ；否则，返回 `false` 。

::: code-tabs

@tab java
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public boolean isPalindrome(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while(fast != null) {
            slow = slow.next;
            fast = fast.next;
            if(fast == null) break;
            fast = fast.next;
        }
        ListNode newHead = reverse(slow);
        while(newHead != null) {
            if(head.val != newHead.val) return false;
            head = head.next;
            newHead = newHead.next;
        }
        return true;
    }

    private ListNode reverse(ListNode head) {
        if(head == null || head.next == null) return head;
        ListNode res = reverse(head.next);
        head.next.next = head;
        head.next = null;
        return res;
    }
}

```

@tab golang

```go
func isPalindrome(head *ListNode) bool {
	if head == nil || head.Next == nil {
		return true
	}
	slow, fast := head, head
	var prev *ListNode = nil
	for fast != nil && fast.Next != nil {
		prev = slow
		slow = slow.Next
		fast = fast.Next.Next
	}
	prev.Next = nil
	var head2 *ListNode = nil
	for slow != nil {
		tmp := slow.Next
		slow.Next = head2
		head2 = slow
		slow = tmp
	}
	for head != nil && head2 != nil {
		if head.Val != head2.Val {
			return false
		}
		head = head.Next
		head2 = head2.Next
	}
	return true
}
```
:::
------

### [61.旋转链表](https://leetcode.cn/problems/rotate-list/)

> 给你一个链表的头节点 `head` ，旋转链表，将链表每个节点向右移动 `k` 个位置。

::: code-tabs
@tab java
```java

/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {
        if(head == null || head.next == null) return false;
        ListNode slow = head;
        ListNode fast = head.next;
        while(slow != null && fast != null) {
            if(slow == fast) return true;
            slow = slow.next;
            fast = fast.next;
            if(fast != null) fast = fast.next;
        }
        return false;
    }
}
```
@tab golang
```go
func rotateRight(head *ListNode, k int) *ListNode {
    if k == 0 || head == nil || head.Next == nil {
        return head
    }
    n := 1
    iter := head
    for iter.Next != nil {
        iter = iter.Next
        n++
    }
    add := n - k%n
    if add == n {
        return head
    }
    iter.Next = head
    for add > 0 {
        iter = iter.Next
        add--
    }
    ret := iter.Next
    iter.Next = nil
    return ret
}
```

:::

