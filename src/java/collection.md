---
title: 集合
author: xmy
---

### ArrayList、LinkedList和Vector的区别？
- ArrayList基于数组，查询较快，末尾插入O(1)，中间i处插入O(n-i)，需要移动元素，可通过序号快速获取对象，线程不安全，有预留的内存空间

- LinkedList基于双向链表，末尾插入O(1)，中间i处插入O(n-i)，但不需要移动元素，不可通过序号快速获取对象，线程不安全，没有预留的内存空间，但每个节点都有两个指针占用了内存

- Vector和ArrayList实现上基本相同，区别在于Vector是线程安全的，其各种增删改查方法加了synchronized修饰

### ArrayList扩容机制
通过一次ArrayList创建和add的流程分析扩容机制：

首先，ArrayList有三个构造函数：

```java
    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+
                                               initialCapacity);
        }
    }
```

```java
    public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }
```

```java
    public ArrayList(Collection<? extends E> c) {
        elementData = c.toArray();
        if ((size = elementData.length) != 0) {
            // c.toArray might (incorrectly) not return Object[] (see 6260652)
            if (elementData.getClass() != Object[].class)
                elementData = Arrays.copyOf(elementData, size, Object[].class);
        } else {
            // replace with empty array.
            this.elementData = EMPTY_ELEMENTDATA;
        }
    }
```

以及几个核心属性：

```java
    private static final int DEFAULT_CAPACITY = 10;
    private static final Object[] EMPTY_ELEMENTDATA = {};
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
    transient Object[] elementData;
    private int size;
```

由此可以分析出：

如果创建空的Arraylist对象，则可以用无参构造器或其它两个分别以0和空的集合作为参数进行创建。当用无参构造器创建时，会将其内容数组elementData指向DEFAULTCAPACITY_EMPTY_ELEMENTDATA这个单例，而用其它两个构造器创建空的ArrayList对象时，会令elementData指向EMPTY_ELEMENTDATA这个单例

如果创建非空的，则只能用两个有参构造器进行创建，它们都会将elementData指向新创建的Object[]对象

再来看看add：

```java
	public boolean add(E e) {
        ensureCapacityInternal(size + 1);  // Increments modCount!!
        elementData[size++] = e;
        return true;
    }
```

```java
    public void add(int index, E element) {
        rangeCheckForAdd(index);

        ensureCapacityInternal(size + 1);  // Increments modCount!!
        System.arraycopy(elementData, index, elementData, index + 1,
                         size - index);
        elementData[index] = element;
        size++;
    }
```

后者在前者的基础上只是加了一些对数组越界和插入时移动部分对象的处理，扩容的核心则都在ensureCapacityInternal这个函数里

```java
    private void ensureCapacityInternal(int minCapacity) {
        if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
            minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
        }

        ensureExplicitCapacity(minCapacity);
    }
```

其中`minCapacity`可以理解为扩容后容量的最小值，假设调用无参构造器创建了一个`ArrayList`对象，则初始状态下其`size=0`，`DEFAULT_CAPACITY=10`。此时我们对其调用`add(new Object())`，那么首先会调用`ensureCapacityInternal(0 + 1)`，意为新加入了一个对象，此时容量应至少为`1`。随后，判断该`ArrayList`是否是用无参构造器创建的，如果是，将`minCapacity`设为`max(DEFAULT_CAPACITY, minCapacity)`，即默认容量够用了就不用再扩容。随后调用`ensureExplicitCapacity(minCapacity)`

```java
    private void ensureExplicitCapacity(int minCapacity) {
        modCount++;

        // overflow-conscious code
        if (minCapacity - elementData.length > 0)
            grow(minCapacity);
    }
```

此时判断如果应该达到的容量超过现有数组的长度，则需要扩容，扩容就调用`grow(minCapacity)`方法

```java
    private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
```

首先设定新的容量为原来的`3/2`，再判定加完这部分是否够用，如果不够用就将新容量设定为刚刚好。这时如果新容量超出了系统规定的最大值，则调用`hugeCapacity(minCapacity)`将其设定为一个合理的最大值。最后将elementData拷贝到新容量的Object[]中。

```java
    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
            Integer.MAX_VALUE :
            MAX_ARRAY_SIZE;
    }
```

至此一次扩容算是完毕了。

**总结一下就是无参构造的第一次add扩容到10，随后每当加满了就扩容到原来的3/2。有参构造的如果构造的是空list，则第一次add扩容到1，第二次扩容到2，第三次扩容到3，第四次扩容到4，第五次扩容到6，再加满扩容到9，...，后面都是3/2了。有参构造非空list，按前面的序列来。最大容量为`Integer.MAX_VALUE=0x7fffffff`**

### HashMap、HashSet和HashTable的区别

- HashMap线程不安全，效率高一点，可以存储null的key和value，null的key只能有一个，null的value可以有多个。默认初始容量为16，每次扩充变为原来2倍。创建时如果给定了初始容量，则扩充为2的幂次方大小。底层数据结构为数组+链表，插入元素后如果链表长度大于阈值（默认为8），先判断数组长度是否小于64，如果小于，则扩充数组，反之将链表转化为红黑树，以减少搜索时间。

- HashTable线程安全，效率低一点，其内部方法基本都经过synchronized修饰，不可以有null的key和value。默认初始容量为11，每次扩容变为原来的2n+1。创建时给定了初始容量，会直接用给定的大小。底层数据结构为数组+链表。它基本被淘汰了，要保证线程安全可以用ConcurrentHashMap。

- HashSet是基于HashMap实现的，只是value都指向了一个虚拟对象，只用到了key

### HashSet、LinkedHashSet和TreeSet的区别

- LinkedHashSet是HashSet子类，在HashSet的基础上能过够按照添加的顺序遍历

- TreeSet底层使用红黑树，插入时按照默认/自定义的key排序规则指定插入位置

### 总结
- Collection下主要有List，Set，Map三个接口

- List和Set是继承了Collection接口

- Map只是依赖了Collection接口，不存在父子关系

- List主要有ArrayList，LinkedList，Vector

- Set主要有HashSet，TreeSet，LinkedHashSet

- Map主要有HashMap，HashTable，TreeMap，ConcurrentHashMap

- 当我们要存键值对，以便通过键值访问数据时，就用Map，此时需要排序就用TreeMap，不需要就用HashMap，需要线程安全就用ConcurrentHashMap

- 当我们只需要存对象时，就用Collection，需要保证唯一性就用Set，不需要就用List。用Set时，需要保证顺序就用TreeSet，不需要就用HashSet。用List时，如果是频繁查询，较少增删的场景，就用ArrayList，如果是频繁增删，较少查询的场景就用LinkedList，如果要保证线程安全就用Vector