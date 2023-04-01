---
title: STL
author: ["comewei","jjd","枫长","LH"]
---



### 1. 什么是STL？

C++的STL（Standard Template Library，标准模板库）是C++编程语言中的一个功能强大且广泛使用的库，它提供了一系列通用的模板类和函数，可以帮助程序员更高效地处理各种数据结构和算法问题。STL主要包含以下几个组件：

- **容器（Containers）**：容器是用来存储和管理数据的数据结构，例如向量（vector）、列表（list）、队列（queue）、栈（stack）、集合（set）和映射（map）等。
- **迭代器（Iterators）**：迭代器是一种类似于指针的对象，可以用来遍历容器中的元素。迭代器为容器中的数据提供了统一的访问接口，使得算法可以与容器无缝地协同工作。
- **算法（Algorithms）**：STL提供了许多通用的算法，如排序、查找、合并等，这些算法可以直接应用于容器和迭代器。
- **函数对象（Function Objects）**：函数对象是实现了函数调用操作符（operator()）的类的对象。它们通常用作算法的自定义操作，使得算法可以具有更高的灵活性和可扩展性。函数对象有时被称为“仿函数”（functors）。STL还提供了一些预定义的函数对象，例如less、greater、plus等，它们可以用于算法中的比较和运算操作。
- **适配器（Adapters）**：适配器是一种特殊的容器或函数对象，它们可以修改或扩展其他容器或函数对象的行为。例如，队列（queue）和栈（stack）就是容器适配器，它们分别基于deque和vector容器实现。函数适配器包括bind、mem_fn等，可以用来组合和修改函数对象。
- **分配器（Allocators）**：分配器是一种管理内存分配和释放的机制，它们可以用于自定义容器的内存管理策略。STL中默认使用的分配器是std::allocator，但用户可以根据需要提供自定义的分配器。



### 2. vector与list的区别与应用？

vector和list是C++ STL中两种常用的序列容器，它们用于存储和管理线性数据，但在底层实现、性能特点和适用场景上有一些区别。

**底层实现**

- vector：vector是基于动态数组实现的，内存空间是连续的。当vector需要扩容时，它会分配一块更大的内存空间，将原有的数据拷贝到新的空间，并释放原有的内存。 
- list：list是基于双向链表实现的，内存空间是非连续的。每个元素都是一个节点，节点之间通过指针相互连接。

**性能**

- vector

  - 访问元素：由于内存连续，vector支持随机访问，可以使用下标直接访问任意元素，时间复杂度为O(1)。

  - 插入和删除：在vector的末尾插入和删除元素非常高效，时间复杂度为O(1)；但在中间或开头插入和删除元素需要移动后面的元素，时间复杂度为O(n)。

  - 内存使用：vector可能会预留一些额外的内存空间用于扩容，因此在某些情况下可能会浪费一些内存。但由于内存连续，vector通常对缓存友好，有更好的空间局部性。

- list
  - 访问元素：list不支持随机访问，访问任意元素需要从头节点开始遍历链表，时间复杂度为O(n)。
  - 插入和删除：在list的任意位置插入和删除元素非常高效，只需要修改相邻节点的指针，时间复杂度为O(1)。但需要注意的是，要定位到插入或删除的位置仍然需要O(n)的时间。

**应用场景**

- vector：当需要频繁访问元素，且插入和删除操作主要发生在容器末尾时，vector是一个好的选择。由于其连续内存特性，vector通常更适用于需要高缓存友好性的场景。
- list：当需要频繁在容器中间或开头进行插入和删除操作，且对随机访问性能要求不高时，list是一个更合适的选择。list也适用于那些不支持或不方便进行内存移动的数据类型的场景，因为list在插入和删除时不会引起元素的内存移动。



### 3. STL vector的实现，删除其中的元素，迭代器如何变化？为什么是两倍扩容？释放空间？

**STL vector的实现**： vector是基于动态数组实现的，其内存空间是连续的。vector有三个指针：指向数据开始的位置（begin），指向数据结束的下一个位置（end）和指向已分配内存空间结束的下一个位置（capacity）。

**删除元素及迭代器的变化**： 当从vector中删除元素时（如使用erase方法），被删除元素之后的所有元素会向前移动一位以填补空位，因此迭代器会受到影响。删除元素后，原来指向被删除元素的迭代器以及指向其后元素的迭代器都会失效。为了确保迭代器的有效性，通常在删除元素后重新获取迭代器。

**为什么是两倍扩容**： vector在需要扩容时通常会将容量增加到原来的两倍。这是因为两倍扩容可以在动态数组的插入操作上实现均摊O(1)的时间复杂度（amortized O(1)）。当每次扩容为原来的两倍时，元素移动的次数和总时间开销相对较低，从而在实际应用中表现出较好的性能。两倍扩容是一种折衷方案，既能平衡内存使用效率，又能在大多数场景下保持良好的性能。

**释放空间**： vector本身不会在元素删除时自动收缩内存。如果你希望在删除元素后释放多余的空间，可以使用“swap trick”技巧。创建一个新的临时vector，用它来交换（swap）原vector的内容，这样原vector的内存空间就会收缩到实际元素数量所需的大小。这个方法的示例如下：

```cpp
std::vector<int> v(100);
// ... 添加/删除元素 ...

// 使用swap trick释放多余的空间
std::vector<int>(v).swap(v);
```

创建了一个新的临时vector对象，并使用原vector的内容进行构造。然后通过swap方法，将原vector的内容与新vector的内容交换。新vector在离开作用域时会自动销毁，从而释放多余的内存空间。请注意，此操作可能导致迭代器、指针和引用失效，因此在执行此操作后，需要确保更新这些指向vector的对象。



### 4. set与unordered_set的区别？

`set` 和 `hash_set` 都是用于存储不重复元素的容器，但它们之间有一些关键区别。`set` 是一个基于平衡二叉搜索树实现的有序容器，而  `unordered_set`是一个基于哈希表实现的无序容器。下面列出了它们之间的主要区别：

**底层数据结构**

- `set`：基于平衡二叉搜索树（通常是红黑树）实现。元素在容器中按照一定的顺序排列（通过比较运算符 `<` 或自定义比较函数）。
- `unordered_set`：基于哈希表实现。元素在容器中的位置由其哈希值决定，因此元素在容器中的顺序是无序的。

**时间复杂度**

- `set`：插入、删除和查找操作的平均时间复杂度为 O(log n)，其中 n 为元素个数。

- `unordered_set`：插入、删除和查找操作的平均时间复杂度为 O(1)，但在最坏情况下（所有元素都在同一个哈希桶中）时间复杂度可能退化为 O(n)。

**空间复杂度**

  - `set`：空间复杂度相对较低，因为它基于平衡二叉搜索树。
  - `unordered_set`：空间复杂度相对较高，因为哈希表需要分配额外的空间来存储桶和处理冲突。

**元素顺序**

- `set`：元素在容器中按照排序顺序存储，因此遍历 `set` 时，元素将按照顺序输出。
- `unordered_set`：元素在容器中是无序的。遍历时，元素的输出顺序将是随机的。

**自定义哈希函数和比较函数**

- `set`：需要自定义比较函数（通常为 `operator<` 或 `std::less` 的自定义版本），以便在平衡二叉搜索树中对元素进行排序。
- `unordered_set`：需要自定义哈希函数（用于计算元素的哈希值）和相等函数（用于比较元素是否相等）。

**适用场景**

- `set`：当需要一个有序容器时，或者当对元素的插入、删除和查找时间复杂度要求为对数级别时，使用 `set` 是一个不错的选择。
- `unordered_set`：当不需要关心元素顺序，且需要更快速的插入、删除和查找操作时，使用 `hash_set` 或 `unordered_set` 更为合适。



### 5. unordered_map与map的区别？

`map` 和 `unordered_map`都是 C++ 中常用的关联容器，它们允许使用键（key）来存储和检索值（value）。尽管它们有相似的功能，但它们的底层实现和性能特点有很大的不同。

**底层数据结构**

- `map`：基于平衡二叉搜索树（通常是红黑树）实现。键值对按照键的顺序（通过比较运算符 `<` 或自定义比较函数）排列。
- `unordered_map`：基于哈希表实现。键值对在容器中的位置由键的哈希值决定，因此键值对在容器中的顺序是无序的。

**时间复杂度**

- `map`：插入、删除和查找操作的平均时间复杂度为 O(log n)，其中 n 为元素个数。
- `unordered_map`：插入、删除和查找操作的平均时间复杂度为 O(1)，但在最坏情况下（所有元素都在同一个哈希桶中）时间复杂度可能退化为 O(n)。

**空间复杂度**

- `map`：空间复杂度相对较低，因为它基于平衡二叉搜索树。
- `unordered_map`：空间复杂度相对较高，因为哈希表需要分配额外的空间来存储桶和处理冲突。

**元素顺序**

- `map`：键值对按照键的顺序排列，因此遍历 `map` 时，键值对按照键的顺序输出。
- `unordered_map`：键值对在容器中是无序的。遍历时，键值对的输出顺序将是随机的。

**自定义哈希函数和比较函数**

- `map`：需要自定义比较函数（通常为 `operator<` 或 `std::less` 的自定义版本），以便在平衡二叉搜索树中对键进行排序。
- `unordered_map`：需要自定义哈希函数（用于计算键的哈希值）和相等函数（用于比较键是否相等）。

**适用场景**

- `map`：当需要一个有序容器时，或者当对键值对的插入、删除和查找时间复杂度要求为对数级别时，使用 `map` 是一个不错的选择。
- `unordered_map`：当不需要关心键值对顺序，且需要更快速的插入、删除和查找操作时，使用 `unordered_map` 更为合适。





### 6. map、set是怎么实现的，红黑树是怎么能够同时实现这两种容器？ 为什么使用红黑树？

`map` 和 `set` 都是基于红黑树实现的关联容器。红黑树是一种自平衡的二叉搜索树，它通过在每个节点上添加一个颜色属性（红色或黑色）来确保树保持大致平衡。红黑树的平衡特性可以保证插入、删除和查找操作具有较好的时间复杂度（O(log n)）。

红黑树如何实现 `map` 和 `set`：

- 实现 `set`：红黑树中的每个节点存储一个键，节点之间通过比较键的大小进行排序。红黑树的节点之间的顺序关系满足二叉搜索树的特性。因此，通过将元素作为红黑树的键，我们可以实现一个 `set` 容器。
- 实现 `map`：为了实现 `map` 容器，需要同时存储键和值。在红黑树中，每个节点除了存储键之外，还可以存储一个对应的值。通常将键和值封装成一个 `pair` 对象。这样，红黑树的
- 节点就包含了键值对，并且键之间的顺序关系依然满足二叉搜索树的特性。因此，通过将键值对作为红黑树的节点，我们可以实现一个 `map` 容器。

为什么使用红黑树？

- 时间复杂度：红黑树的自平衡特性保证了树的高度大致保持在 O(log n)，这意味着插入、删除和查找操作的时间复杂度都是 O(log n)。相比其他的数据结构（如普通的二叉搜索树），红黑树在最坏情况下仍然具有较好的性能。
- 内存效率：红黑树只需要在每个节点上存储一个额外的颜色属性，因此与其他自平衡二叉搜索树（如 AVL 树）相比，红黑树具有较好的内存效率。
- 灵活性：红黑树可以用于实现多种关联容器，例如 `set`、`multiset`、`map`和`multimap`。同时，红黑树支持范围查询、查找前驱和后继等高级操作，这使得它成为实现这些容器的理想选择。
- 良好的实时性：红黑树的插入、删除和调整操作都具有较好的实时性，因为它们的时间复杂度可以保证在 O(log n)。相比其他数据结构，红黑树能够更好地满足实时性的需求。



### 7. 如何在共享内存上使用stl标准库？

在C++中，在共享内存上使用STL标准库涉及到一些挑战，因为STL容器通常在堆上分配内存，而不是在共享内存中。为了解决这个问题，你可以使用Boost.Interprocess库，它提供了一些STL兼容的容器，它们可以在共享内存上分配内存。

以下是如何使用Boost.Interprocess在共享内存上创建并使用STL容器的示例：

首先已经安装了Boost库。你可以从官网（https://www.boost.org/）获取Boost库并按照说明进行安装。

接下来，引入必要的头文件：

```cpp
#include <boost/interprocess/managed_shared_memory.hpp>
#include <boost/interprocess/containers/vector.hpp>
#include <boost/interprocess/allocators/allocator.hpp>
#include <boost/interprocess/sync/named_mutex.hpp>
#include <iostream>
```

定义共享内存中使用的容器类型：

```cpp
namespace bip = boost::interprocess;

typedef bip::allocator<int, bip::managed_shared_memory::segment_manager> ShmemAllocator;
typedef bip::vector<int, ShmemAllocator> MyVector;
```

在共享内存中创建STL容器：

```cpp
void create_shared_memory_vector() {
    bip::shared_memory_object::remove("MySharedMemory");
    bip::managed_shared_memory segment(bip::create_only,"MySharedMemory", 65536); // 65536是共享内存的大小，可以根据需要进行调整
    // 使用共享内存分配器构造容器
	ShmemAllocator alloc_inst(segment.get_segment_manager());
	MyVector *my_vector = segment.construct<MyVector>("MyVector")(alloc_inst);

	// 向共享内存中的向量添加元素
	for (int i = 0; i < 10; ++i) {
    	my_vector->push_back(i);
	}
}
```

从共享内存中读取STL容器：

```cpp
void read_shared_memory_vector() {
    bip::managed_shared_memory segment(bip::open_only, "MySharedMemory");

    // 在共享内存中找到容器
    MyVector *my_vector = segment.find<MyVector>("MyVector").first;

    // 从共享内存中的向量读取元素并打印
    for (int i = 0; i < my_vector->size(); ++i) {
        std::cout << (*my_vector)[i] << std::endl;
    }
}
```

在main函数中调用创建和读取共享内存的函数：

```cpp
int main() {
    create_shared_memory_vector();
    read_shared_memory_vector();

    // 清除共享内存对象
    bip::shared_memory_object::remove("MySharedMemory");

    return 0;
}
```



### 8. map插入方式有几种？

**使用`insert`成员函数**

 这是一种通用的插入方式，可以将一个键值对或一个迭代器范围插入到map中。示例如下：

```cpp
std::map<int, std::string> my_map;
// 插入单个键值对
my_map.insert(std::make_pair(1, "one"));
my_map.insert(std::pair<int, std::string>(2, "two"));
my_map.insert({3, "three"});

// 插入迭代器范围（例如从另一个map中插入）
std::map<int, std::string> another_map = {{4, "four"}, {5, "five"}};
my_map.insert(another_map.begin(), another_map.end());
```

**使用`emplace`成员函数**

`emplace`会直接在map中构造一个新元素，而不是先创建一个临时对象，然后再将它插入到map中。这样可以减少对象的构造和析构开销，提高性能。示例如下：

```cpp
std::map<int, std::string> my_map;
my_map.emplace(1, "one");
my_map.emplace(2, "two");
my_map.emplace(3, "three");
```

**使用下标操作符（`operator[]`）**

下标操作符可以通过键值直接访问或插入元素。如果键值不存在于map中，它会自动插入一个具有该键值和默认值的元素。使用下标操作符插入元素时，如果键值不存在，会默认构造一个值对象，然后将其插入map。因此，如果你的值类型没有默认构造函数，这种插入方式可能会导致编译错误。示例如下：

```cpp
std::map<int, std::string> my_map;
my_map[1] = "one";
my_map[2] = "two";
my_map[3] = "three";
```



### 9. vector越界访问下标会怎么样？map越界访问下标会怎么样？

**vector越界访问下标**

访问vector越界下标的行为是未定义的（Undefined Behavior），可能导致程序崩溃、错误结果或其他不可预期的后果。在某些情况下，可能没有立即可见的影响，但这是非常危险的，因为它可能导致内存损坏或其他难以追踪的问题。为了避免越界访问，应该确保在访问vector元素之前检查索引是否在范围内。如果需要进行安全检查，可以使用`at()`成员函数，它在越界访问时会抛出`std::out_of_range`异常。

**map越界访问下标**

尝试访问map中不存在的键时，C++的行为与vector不同。使用下标运算符（`[]`）访问map中不存在的键会导致该键被插入到map中，并创建一个具有默认构造函数初始化值的新值。这意味着越界访问不会导致未定义行为，但可能导致无意中修改map的大小和内容。如果想要查询map中的键而不插入新的键值对，可以使用`find()`成员函数。这将返回一个迭代器，指向找到的元素或指向map的`end()`，如果键不存在。



### 10. vector删除元素时会不会释放空间？

当使用`std::vector`的`erase()`成员函数删除元素时，它会从vector中移除元素，并将后面的元素向前移动以填补空缺。然而，`erase()`并不会自动减小vector的容量（capacity），即分配给vector的内存空间。实际上，除非显式地调用`shrink_to_fit()`或者重新分配更小容量的内存，否则vector的容量将保持不变。

如果在删除元素后想要释放多余的空间，可以使用`shrink_to_fit()`成员函数。这个函数会尝试将vector的容量减小到与其大小（size）相匹配，从而释放不再使用的内存空间。需要注意的是，`shrink_to_fit()`并不保证一定能够减小容量，因为这取决于具体的实现和内存分配策略。

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> vec = {1, 2, 3, 4, 5};

    vec.erase(vec.begin() + 2); // 删除下标为2的元素

    std::cout << "Size: " << vec.size() << ", Capacity: " << vec.capacity() << std::endl;

    vec.shrink_to_fit(); // 尝试将容量减小到与大小相匹配

    std::cout << "Size: " << vec.size() << ", Capacity: " << vec.capacity() << std::endl;

    return 0;
}
```

在这个示例中首先创建了一个包含5个整数的vector。然后使用`erase()`删除了下标为2的元素。可以看到，尽管vector的大小（size）已经减小到4，但容量（capacity）仍然不变。当调用`shrink_to_fit()`后，vector的容量可能会减小到与大小相匹配，从而释放多余的内存空间。



### 11. map[]与find的区别？

`std::map`的`operator[]`（下标操作符）和`find()`成员函数都可以用来查询map中的键值对，但它们的行为和用途有所不同。

**`operator[]`（下标操作符）**

当使用下标操作符（`[]`）访问map中的某个键时，如果该键已经存在于map中，则返回对应的值的引用。但如果键不存在，map会自动创建一个新的键值对，键为给定的键，值为对应值类型的默认构造函数初始化值，然后返回新值的引用。因此，使用下标操作符可能导致map的大小和内容发生变化。

```cpp
std::map<int, std::string> my_map;

my_map[1] = "One"; // 插入键值对 {1, "One"}

std::string value = my_map[1]; // 获取键为1的值，此时value为"One"

std::string non_existent_value = my_map[2]; // 键为2的值不存在，会插入一个新的键值对 {2, ""}
                                            // non_existent_value为""
```

**`find()`**

`find()`成员函数用于查询map中的键，但不会修改map。当`find()`在map中找到给定的键时，它返回一个指向找到的键值对的迭代器。如果键不存在，则返回指向map的`end()`的迭代器。因此，使用`find()`查询键值对不会导致map的大小和内容发生变化。

```cpp
std::map<int, std::string> my_map;

my_map[1] = "One"; // 插入键值对 {1, "One"}

auto it = my_map.find(1);
if (it != my_map.end()) {
    std::string value = it->second; // 获取键为1的值，此时value为"One"
}

auto non_existent_it = my_map.find(2);
if (non_existent_it == my_map.end()) {
    std::cout << "Key 2 not found." << std::endl;
}
```

`operator[]`和`find()`的主要区别在于：使用下标操作符可能会修改map的大小和内容，而`find()`则不会。在查询键值对时，如果不希望无意中插入新的键值对，应该使用`find()`而不是下标操作符。



### 12. STL中list与queue之间的区别？

`std::list`： `std::list` 是一个双向链表容器，支持在常数时间内在任何位置插入和删除元素。它提供了随机访问迭代器，这意味着你可以在链表中向前和向后移动，但不能直接访问任意位置的元素。`std::list` 是一种非连续存储的数据结构，这意味着它的元素可能分散在内存中的不同位置。

`std::list` 主要用途：

- 当需要在容器中间插入或删除元素时，使用 `std::list` 效率较高。
- 当不需要随机访问元素时，可以考虑使用 `std::list`。

`std::queue`： `std::queue` 是一个容器适配器，它基于其他容器（如 `std::deque`、`std::list` 或 `std::vector`）实现了一个先进先出（FIFO）的队列。`std::queue` 提供了有限的接口，仅支持在队列尾部插入元素（`push`），在队列头部移除元素（`pop`）以及访问队列头部元素（`front`）和尾部元素（`back`）。`std::queue` 的底层容器决定了它的存储方式和性能特性。

`std::queue` 主要用途：

- 当需要实现先进先出（FIFO）策略时，使用 `std::queue` 是很自然的选择。
- 当不需要在容器中间插入或删除元素时，可以使用 `std::queue`。



### 13. STL中的allocator，deallocate？

在C++标准库（STL）中，`allocator` 是一个模板类，用于封装内存分配和释放策略。STL容器（如 `std::vector`，`std::list`，`std::map` 等）使用 `allocator` 对象来管理其内部存储的内存分配和释放。这样可以使容器的实现与内存管理策略解耦，从而提供更大的灵活性。

`allocator` 类主要提供以下功能：

分配内存：`allocator` 提供了 `allocate()` 成员函数，用于分配内存空间，以容纳指定数量的对象。例如：

```cpp
std::allocator<int> alloc;
int* p = alloc.allocate(10);  // 分配内存空间，可容纳10个整数
```

构造对象：`allocator` 提供了 `construct()` 成员函数，用于在已分配的内存上构造对象。例如：

```cpp
alloc.construct(p, 42);  // 在分配的内存空间上构造一个值为42的整数
```

销毁对象：`allocator` 提供了 `destroy()` 成员函数，用于销毁已构造的对象。例如：

```cpp
alloc.destroy(p);  // 销毁在分配的内存空间上构造的整数
```

释放内存：`allocator` 提供了 `deallocate()` 成员函数，用于释放之前分配的内存空间。例如：

```cpp
alloc.deallocate(p, 10);  // 释放之前分配的内存空间
```

