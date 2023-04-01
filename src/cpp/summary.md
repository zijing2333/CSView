---
title: C++基础概念和语法
author: ["comewei","jjd","枫长","LH"]
---





### 1. C和C++有什么区别？

区别有很多，下面写了主要的几项。

- c++新增了**面对对象**的特性以及**泛型编程**的特性。
- c++用new与delete取代了c中的malloc与free，并且c11还新增了智能指针，更加安全。
- c++用string类取代了c中的字符串处理函数。
- c++IO操作用iostream库取代了标准io操作。
- c++允许函数重载，c不允许。
- c++新增了引用，比指针更方便。

### 2. C++有哪些性质？

**面向对象编程（OOP）**：C++是一种面向对象编程语言，允许用户定义类和对象，以及类的成员函数和数据成员。OOP的主要特性包括封装、继承和多态。

- **封装**是一种将数据和操作数据的函数组合在一起的方法，这样可以隐藏对象的内部细节。封装可以提高代码的可读性和可维护性。
- **继承**是一种允许从现有类派生出新类的方法，新类可以继承现有类的属性和方法，还可以添加新的属性和方法或者覆盖现有的方法。
- **多态**是一种允许在程序中使用通用接口来处理不同类型的对象的方法。多态可以简化代码，提高代码的可扩展性和复用性。

**泛型编程**：C++支持模板，允许用户编写通用的代码，以处理不同类型的数据。模板可以用于创建通用的函数和类，从而实现类型无关的编程。

**低级访问能力**：C++允许用户直接操作内存和硬件，这使得C++成为一种高效且功能强大的语言，适用于底层编程和性能关键应用。

**标准库**：C++有一个丰富的标准库，提供了许多常用功能和数据结构，如容器、算法、输入/输出操作、字符串处理等。

**语言兼容性**：C++与C语言具有很高的兼容性，这意味着大多数C程序可以在C++编译器中编译和运行。这使得C++可以轻松地与C语言代码集成。

**RAII（Resource Acquisition Is Initialization）**：RAII是一种在C++中广泛使用的编程技巧，它将资源的分配和释放与对象的生命周期关联起来。这有助于防止资源泄漏和简化资源管理。

### 3. C++如何进行异常处理的？

在C++中，异常处理是通过一组特定的关键字和语法进行的。异常处理的主要目的是在程序运行过程中发生错误时提供一种优雅的处理和恢复机制。简单来说就是**try throw catch**。以下是C++异常处理的几个关键部分：

**抛出异常（throw）**：当检测到错误或异常情况时，可以使用throw关键字抛出一个异常。这可以是任何数据类型，比如整数、字符串或自定义类对象。例如：

```cpp
throw std::runtime_error("An error occurred!");
```

**捕获异常（catch）**：为了捕获和处理异常，需要使用try和catch块。try块包含可能引发异常的代码。catch块用于捕获异常并处理它。例如：

```cpp
try {
    // Code that might throw an exception
} catch (const std::runtime_error& e) {
    // Handle the exception
    std::cerr << "Caught exception: " << e.what() << std::endl;
} catch (...) {
    // Catch all other exceptions
    std::cerr << "Unknown exception caught!" << std::endl;
}
```

**标准异常类**：C++标准库包含了一组异常类，这些类都继承自`std::exception`。一些常见的标准异常类包括`std::runtime_error`、`std::invalid_argument`、`std::out_of_range`等。当需要抛出异常时，最好使用这些标准异常类，因为它们更具描述性，而且可以携带更多关于错误的信息。

**自定义异常类**：如果需要创建自定义异常类型，可以通过继承`std::exception`或其子类来实现。例如：

```cpp
class CustomException : public std::runtime_error {
public:
    explicit CustomException(const std::string& msg) : std::runtime_error(msg) {}
};
```

这样，就可以使用自定义的异常类抛出和捕获异常了：

```cpp
try {
    throw CustomException("A custom exception occurred!");
} catch (const CustomException& e) {
    std::cerr << "Caught custom exception: " << e.what() << std::endl;
}
```

**异常传播**：当一个函数抛出一个异常，而该函数本身没有处理这个异常时，异常会向上传播至调用链上的上一级函数。如果没有任何函数捕获该异常，程序将终止并显示未捕获异常的错误信息。

总结一下，C++通过使用try-catch块和标准异常类，可以确保程序在遇到问题时能够正常运行并提供有关错误的信息。

### 4. 提高C++性能，你用过哪些方式去提升？

**优化编译选项**：使用编译器的优化选项，如 -O2 或 -O3，可以对生成的可执行文件进行优化。这些优化选项可能包括内联函数、循环展开、常量传播等。

**选择合适的数据结构和算法**：根据问题选择合适的数据结构和算法。合理使用STL容器和算法，如 vector、map、sort等。这可以显著提高程序效率。

**避免不必要的内存分配**：减少动态内存分配和释放的次数，使用对象池、预先分配内存、栈上分配内存等策略来减少内存碎片和提高性能。

**利用缓存**：尽量让数据局部性更强，减少缓存未命中。对于计算量大的操作，可以使用缓存技术来存储结果，避免重复计算。

**并行计算**：利用多核处理器、多线程、SIMD指令等并行计算技术，提高计算效率。使用C++11及更高版本的线程库、async、future等功能来实现多线程编程。

**避免使用异常处理作为正常控制流**：异常处理对性能有一定影响，应仅在真正需要时使用。尽量使用错误码或其他方法作为正常控制流。

**使用内联函数和常量表达式**：将小型函数声明为内联函数，以减少函数调用开销。使用constexpr关键字声明常量表达式，将在编译时计算值。

**使用智能指针管理资源**：避免内存泄漏，采用 RAII(Resource Acquisition Is Initialization) 技术，使用智能指针如 shared_ptr、unique_ptr 管理动态分配的资源。

**懒惰计算和值计算**：仅在必要时进行计算，避免重复计算。将计算结果保存在值中，以提高性能。

**代码剖析和性能分析**：使用性能分析工具，如 gprof、Valgrind、Intel VTune等，定位瓶颈，对代码进行优化。



### 5. #include 的顺序？尖括号和双引号有什么区别？

在 C++ 中，`#include` 指令用于包含其他头文件，提供了一种方便的方式来共享代码、类型定义和函数声明。`#include` 指令的语法有两种形式：尖括号 `< >` 和双引号 `" "`。这两种形式之间的主要区别在于编译器搜索头文件的方式和顺序。

尖括号 `< >`： 当使用尖括号 `< >` 时，**编译器通常在标准系统库中搜索头文件**。这些库通常包含标准 C++ 库和编译器提供的其他库。例如，当包含标准库如 `<iostream>`、`<vector>` 时，你需要使用尖括号。

```cpp
#include <iostream>
#include <vector>
```

双引号 `" "`： 当使用双引号 `" "` 时，编译器**首先在当前源文件所在的目录中搜索头文件**。如果没有找到，它将继续在标准库和其他预先配置的库路径中搜索。这种形式通常用于包含自定义的头文件或者项目特定的头文件。

```cpp
#include "my_custom_header.h"
```

虽然 C++ 标准没有明确规定包含顺序，但遵循一定的顺序和约定可以提高代码的可读性和可维护性。以下是建议的顺序：

- 包含与项目相关的自定义头文件。
- 包含第三方库的头文件。
- 包含标准库的头文件。

**总结**： `#include` 的两种形式，尖括号和双引号，主要区别在于编译器搜索头文件的位置。尖括号用于包含系统库中的头文件，双引号用于包含自定义的头文件。



### 6. 迭代器++i，i++哪个更好，为什么？

在 C++ 中，迭代器 `++i`（前置自增）和 `i++`（后置自增）都可以用于遍历容器中的元素。在某些情况下，**`++i` 是一个更好的选择**，原因如下：

- **性能优势**： 前置自增 `++i` 直接将迭代器的值加 1，然后返回自增后的迭代器。而后置自增 `i++` 需要在自增之前创建并返回一个临时迭代器副本，然后再将原始迭代器的值加 1。在大多数情况下，这种额外的开销可能不会产生显著的性能差异，但对于某些类型的迭代器（如自定义迭代器或非内联函数的代理迭代器），这种开销可能会对性能产生影响。
- **通用性**： `++i` 和 `i++` 在大多数情况下都可以互换使用，但在某些泛型编程场景中，使用前置自增可能更加通用。例如，当你编写一个模板函数时，如果你不知道迭代器的具体类型，那么使用前置自增 `++i` 可以确保不会引入不必要的性能开销。





### 7. 谈谈segement fault 与 coredump？

`Segmentation fault`（段错误）和`coredump`（核心转储）是与程序异常有关的两个概念。

- **Segmentation fault**： Segmentation fault 是一种程序异常，通常发生在程序试图访问非法的内存区域时，例如：访问越界数组、访问空指针、访问已释放的内存等。操作系统会捕获这个异常并终止程序的执行。
- **Coredump**： 当程序异常终止时，操作系统可以将程序在异常发生时的内存映像以及其他相关信息保存到一个文件中，这个文件称为核心转储文件（coredump 文件）。通过分析这个文件，开发者可以定位程序崩溃时的上下文信息，从而帮助找出问题的根源。

解决 Segmentation fault 和分析 coredump 的一般步骤如下：

1. 编译程序时，确保启用调试信息。使用 g++ 编译器时，可以加上`-g`选项。
2. 确保操作系统配置允许生成 coredump 文件。在 Linux 系统上，可以使用`ulimit`命令设置允许生成 coredump 文件。例如：`ulimit -c unlimited`。
3. 运行程序。当程序发生 Segmentation fault 时，操作系统会生成 coredump 文件。通常，这个文件名为`core`或`core.PID`（其中 PID 是进程 ID）。
4. 使用调试器（如 gdb）分析 coredump 文件。例如，可以使用命令`gdb -c corefile your_program`（其中`corefile`是 coredump 文件名，`your_program`是可执行文件名）。
5. 在调试器中，可以使用`backtrace`（或简写`bt`）命令查看程序崩溃时的调用栈。通过分析调用栈，可以定位到导致 Segmentation fault 的代码行。
6. 根据调用栈和代码分析，找出问题的根源并修复它。可能的原因包括：数组越界访问、空指针解引用、内存泄漏、内存重复释放等。
7. 修复问题后，重新编译并运行程序，确保问题已解决。



### 8. 变量的声明和定义有什么区别？

**变量声明**： 变量声明向编译器表明了变量的类型和名称，**但不分配内存**。声明的目的是在编译时告诉编译器变量的存在，以便在其他地方使用它。变量可以在程序中声明多次，但只能定义一次。

示例：

```cpp
extern int myVar; // 变量声明
```

上面使用 `extern` 关键字声明了一个名为 `myVar` 的整数变量。这告诉编译器在其他地方有一个名为 `myVar` 的整数变量的定义，将在这里使用它。

**变量定义**： 变量定义既声明了变量，又为它分配了内存空间。定义同时还可以为变量指定初始值。变量在程序中只能定义一次，否则会导致编译错误。

示例：

```cpp
int myVar; // 变量定义
int myVar = 10; // 变量定义并初始化
```

上面定义了一个名为 `myVar` 的整数变量，并为其分配了内存空间，在第二行中为 `myVar` 指定了初始值 10。

**总结**： 变量声明与定义之间的主要区别在于内存分配和初始值设置。声明不分配内存，仅通知编译器关于变量的存在；而定义则分配内存并可以设置初始值。一个变量可以多次声明，但在程序中只能定义一次。如果尝试多次定义变量，将导致编译错误。

### 9. strcpy函数和strncpy函数的区别？哪个函数更安全？

`strcpy` 和 `strncpy` 是 C 语言中的字符串复制函数，它们用于将一个字符串复制到另一个字符串。这两个函数的主要区别在于它们的安全性和复制方式：

- `strcpy`： `strcpy` 函数用于将源字符串完整地复制到目标字符串。它没有限制复制的字符数量，所以会一直复制源字符串的字符直到遇到空字符（`\0`）。由于 `strcpy` 没有限制复制的字符数量，当目标字符串的空间不足以容纳源字符串时，就会导致缓冲区溢出。这可能导致程序崩溃或安全漏洞，如代码注入攻击。因此，`strcpy` 在很多情况下被认为是不安全的。
- `strncpy`： `strncpy` 函数用于将源字符串的前 N 个字符复制到目标字符串。这个 N 由函数的第三个参数指定，它限制了复制的字符数量。这样，`strncpy` 可以避免缓冲区溢出，因为它不会复制超过指定数量的字符。然而，`strncpy` 也有一些需要注意的问题。当指定的字符数量小于源字符串长度时，`strncpy` 不会在目标字符串的末尾添加空字符。这可能导致目标字符串不以空字符结尾，从而产生未定义行为。因此，在使用 `strncpy` 时，需要确保在复制后手动添加空字符，或确保目标字符串足够大以容纳源字符串和空字符。

**`strncpy` 函数相对于 `strcpy` 函数更安全**，因为它限制了复制的字符数量，可以避免缓冲区溢出。然而，使用 `strncpy` 时还需注意确保目标字符串以空字符结尾。C++ 编程中，建议使用 `std::string` 类和相关函数，以避免这些问题并提高代码安全性。



### 10. 传值与传引用的区别与效率？

**传值（Pass by Value）**

传值通常会将输入的参数拷贝一份作为临时变量来操作。传值通常适用于基本数据类型（如 int、float、char 等）和较小的结构体。传值的缺点是需要多一次拷贝的值，这会消耗一定的内存和时间。对于较大的数据结构（如大数组、大容器等），传值可能会导致性能下降。示例：

```cpp
void pass_by_value(int x) {
    x = 10;
}

int main() {
    int a = 5;
    pass_by_value(a);
    std::cout << a << std::endl; // 输出：5
    return 0;
}
```

**传引用（Pass by Reference）**

传引用是指参数直接拷贝了一个引用。在这种情况下，原对象与临时对象指向相同的内存地址，对临时对象任何修改都会作用到原对象上。传引用通常适用于较大的数据结构，因为它只需要拷贝一个引用(本质就是一个地址)，无需对整个对象的复制，从而提高了效率。传引用的缺点是可能导致意外地修改原对象的值。在编写函数时，应注意不要意外地修改。示例：

```cpp
void pass_by_reference(int& x) {
    x = 10;
}

int main() {
    int a = 5;
    pass_by_reference(a);
    std::cout << a << std::endl; // 输出：10
    return 0;
}
```

传值与传引用的效率比较：

- 对于基本数据类型和较小的数据结构，传值的开销通常是可接受的。在这种情况下，传值和传引用的效率差别不大。
- 对于较大的数据结构，传引用通常更高效，因为它避免了数据的复制。在处理大型对象时，传引用可以显著提高程序的性能。
- 传引用的一个潜在问题是可能导致意外地修改原变量。因此，在使用传引用时，应谨慎操作，并在必要时使用 const 限定符来确保原变量的不变性。



### 11. 什么是lambda表达式？

C++11 引入了 lambda 表达式，它是一种便捷的、匿名的函数对象，可以在需要使用函数对象的地方直接定义和使用。Lambda 表达式在 STL 算法、事件回调等场景中非常有用。Lambda 表达式的基本语法如下：

```cpp
[capture_list](parameter_list) mutable(optional) noexcept(optional) -> return_type(optional) { function_body }
```

- **capture_list**：捕获列表，指定哪些变量以及如何捕获它们（通过值或引用）。捕获列表可以为空。
- **parameter_list**：参数列表，和普通函数的参数列表一样，指定传递给 lambda 表达式的参数。参数列表可以为空。
- **mutable**：可选关键字，用于标识 lambda 表达式是否可以修改捕获的变量。默认情况下，lambda 表达式是 const 的，不能修改捕获的变量。加上 mutable 后，lambda 表达式可以修改通过值捕获的变量。
- **noexcept**：可选关键字，用于指定 lambda 表达式是否不抛出异常。这在某些场景下可以提高性能。
- **eturn_type**：返回类型，可以显式指定，也可以省略。如果省略，编译器会根据函数体中的返回语句自动推导返回类型
- **function_body**：函数体，包含 lambda 表达式的实际代码。

以下是一些 lambda 表达式的示例：

示例1：无参数和无捕获的 lambda 表达式：

```cpp
auto hello = []() { std::cout << "Hello, Lambda!" << std::endl; };
hello(); // 输出：Hello, Lambda!
```

示例2：带参数的 lambda 表达式：

```cpp
auto add = [](int x, int y) { return x + y; };
int result = add(3, 4); // result = 7
```

示例3：通过值捕获外部变量：

```cpp
int a = 5;
auto add_to_a = [a](int x) { return a + x; };
int result = add_to_a(3); // result = 8
```

示例4：通过引用捕获外部变量：

```cpp
int a = 5;
auto increment_a = [&a]() { a++; };
increment_a();
std::cout << a << std::endl; // 输出：6
```

示例5：使用 mutable 和 noexcept 关键字：

```cpp
int a = 5;
auto add_and_increment_a = [a](int x) mutable noexcept { a += x; return a; };
int result = add_and_increment_a(3); // result = 8
```





### 12. static的作用是什么，静态变量什么时候初始化？

`static`关键字的一些主要用途：

- **隐藏**：当`static`用于全局变量或函数时，它改变了变量或函数的可见性。静态的全局变量或函数仅在定义它们的源文件中可见，不会在其他源文件中产生链接冲突。这可以用来实现模块内的封装。
- **保持变量持久且唯一**：当`static`用于局部变量时，它将变量的生命周期延长到整个程序执行期间。这意味着静态的局部变量在第一次执行包含它的函数时初始化，然后在程序的整个生命周期内保持其值。即使函数多次调用，静态的局部变量的值也会在调用之间保持不变。
- **静态类成员变量**：当`static`用于类成员变量时，该成员变量被所有该类的对象共享。也就是说，类的所有实例都将访问同一个静态成员变量，而不是为每个实例分配独立的存储空间。
- **静态类成员函数**：当`static`用于类成员函数时，这个函数可以在不创建类的实例的情况下直接通过类名调用。静态成员函数没有`this`指针，因此它只能访问类的静态成员变量。

静态变量的初始化时机c与c++不同：

- 静态变量只会初始化一次，静态变量放在全局区域，所以在主程之前就会为其分配内存。
- 对于c而言，c是在代码执行前，编译阶段分配好内存后，进行初始化。
- 对于c++而言，它是在执行相关代码时被初始化。



### 13. const的作用是什么？

`const`关键字用于表示常量性（constness），即某个对象或值在其生命周期内不能被修改。使用`const`关键字可以提高代码的可读性和安全性，因为它清楚地表明了哪些对象是不可变的，从而帮助我们避免意外地修改了不应该被修改的数据。

**常量变量**：当声明一个常量变量时，需要使用`const`关键字。一旦常量变量被初始化，其值就不能被修改。

```cpp
const int x = 42; // 声明一个常量整数变量x，其值为42
x = 24; // 编译错误：试图修改一个常量变量的值
```

**指针和引用**：`const`关键字也可以用于指针和引用，用于限制指针或引用所指向的对象的常量性。

关于`int * const `与`const int * `的区别，其实只用记住，**const先修饰左边，左边没有就修饰右边**。所以int * const的话，const修饰的是指针，因此指针不能指向其他地址，但是指针所指向地址上保存的变量可以修改；而const int * ，const左边没有，所以其修饰的是右边也就是int所以指针指向的变量不能修改，但是指针可以指向别的变量。

```cpp
int x = 42;
const int* p = &x; // 声明一个指向常量整数的指针
int const* q = &x; // 同上，声明一个指向常量整数的指针
int * const m = &x //此时m是一个指针常量
int a = 24;
m = &a; //编译错误
const int& r = x; // 声明一个指向常量整数的引用
*p = 24; // 编译错误：试图通过指向常量的指针修改值
r = 24; // 编译错误：试图通过指向常量的引用修改值
```

**成员函数**：在类成员函数中，使用`const`关键字表示该成员函数不会修改类的任何非静态成员变量（除非它们被声明为`mutable`）。这样的成员函数被称为常量成员函数。

```cpp
class MyClass {
public:
    int x;

    // 常量成员函数，不会修改类的任何非静态成员变量
    int get_x() const {
        return x;
    }

    // 非常量成员函数，可能会修改类的非静态成员变量
    void set_x(int new_x) {
        x = new_x;
    }
};
```



### 14. extern的作用是什么？

`extern`关键字用于声明一个变量或函数，表明它的定义在其他地方（通常是另一个源文件）。帮助编译器理解变量或函数的类型和属性，以便在当前源文件中使用它们。实际的定义（包括分配存储空间）需要在其他地方进行。`extern`关键字的一些主要用途：

**全局变量**：当多个源文件需要共享同一个全局变量时，可以在一个源文件中定义该变量（不使用`extern`），并在其他需要访问该变量的源文件中使用`extern`进行声明。这样一来，多个源文件可以共享同一个全局变量，而不会引发链接错误。：

```cpp
// file1.cpp
int global_variable = 42;

// file2.cpp
#include <iostream>

extern int global_variable; // 声明全局变量，表明它在其他地方（如file1.cpp）定义

int main() {
    std::cout << "Global variable: " << global_variable << std::endl;
    return 0;
}
```

**函数**：虽然函数默认具有外部链接（external linkage），但在某些情况下可能需要使用`extern`显式声明一个函数，以便在其他源文件中使用它。这通常在包含函数声明的头文件中进行，以避免在多个源文件中重复声明。

```cpp
// my_functions.h
extern int my_function(int a, int b);

// my_functions.cpp
int my_function(int a, int b) {
    return a + b;
}

// main.cpp
#include <iostream>
#include "my_functions.h"

int main() {
    std::cout << "Result: " << my_function(3, 4) << std::endl;
    return 0;
}
```

**总结**：`extern`关键字用于声明全局变量或函数，表明它们的定义在其他地方（通常是另一个源文件）。这使得多个源文件可以共享同一个变量或函数，从而实现跨文件的代码组织和复用。



### 15. explicit的作用是什么？

`explicit`关键字用于修饰类的构造函数，以防止在某些情况下发生不希望的隐式类型转换。默认情况下，如果一个构造函数只有一个参数，C++允许将该构造函数用于隐式类型转换。这可能导致意外的结果或难以发现的错误，使用`explicit`关键字可以禁止这种隐式类型转换，从而避免相关问题。

```cpp
class MyInt {
public:
    int value;

    // 使用explicit修饰构造函数
    explicit MyInt(int i) : value(i) {}
};

void print_my_int(const MyInt& obj) {
    std::cout << "MyInt value: " << obj.value << std::endl;
}

int main() {
    MyInt obj1(42); // 正确，使用显式类型转换
    // MyInt obj2 = 42; // 错误，禁止隐式类型转换

    print_my_int(obj1); // 正确
    // print_my_int(42); // 错误，禁止隐式类型转换

    return 0;
}
```

为`MyInt`类定义了一个`explicit`构造函数，意味着不能将整数隐式转换为`MyInt`对象。尝试使用隐式类型转换的代码（例如`MyInt obj2 = 42;`和`print_my_int(42);`）会导致编译错误。



### 16. volatile的作用是什么？

`volatile`关键字用于修饰变量，表明该变量可能会在程序的正常执行过程之外被修改，例如通过硬件设备、操作系统或其他线程。当编译器遇到`volatile`修饰的变量时，它会禁止对该变量进行某些优化，以确保变量的访问和修改按照程序员的意图进行。`volatile`关键字的主要作用如下：

- **防止编译器优化**：编译器在优化代码时，可能会对访问和修改变量的操作进行优化，例如将变量缓存在寄存器中或者删除对变量的多余访问。然而，对于`volatile`变量，这种优化可能导致程序行为不正确。`volatile`关键字确保编译器不会对这些变量进行不安全的优化，从而保持正确的程序行为。
- **内存访问顺序**：`volatile`关键字可以确保对修饰的变量的访问按照程序代码的顺序执行。这在多线程环境或硬件访问中很重要，因为它们通常依赖于严格的顺序执行。

```cpp
#include <iostream>
#include <thread>
#include <chrono>

volatile bool stop = false;

void worker() {
    while (!stop) {
        // 执行一些工作
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}

int main() {
    std::thread t(worker);

    // 等待一段时间，然后停止工作线程
    std::this_thread::sleep_for(std::chrono::seconds(5));
    stop = true;

    t.join();
    std::cout << "Worker thread stopped." << std::endl;
    return 0;
}
```

使用`volatile`关键字修饰了一个名为`stop`的全局布尔变量。这可以确保在多线程环境中，`worker`线程能够正确地检测到`stop`变量的变化，而不受编译器优化的影响。

在C++11及之后的版本，`volatile`关键字在多线程编程中的使用相对较少，因为标准库提供了更好的同步原语，例如`std::atomic`和`std::mutex`。



### 17. 全局变量和局部变量的区别？

根据变量的声明位置和作用范围，将变量分为全局变量和局部变量。

**全局变量**

- 全局变量是在函数外部声明的变量，通常位于源文件的顶部。
- 全局变量在整个程序运行期间都是有效的，它们的作用范围是从声明处开始，直到程序结束。
- 全局变量可以在整个程序的任何地方访问，包括所有的函数和类。
- 全局变量在声明时具有默认初始值。例如，整数类型的全局变量默认初始化为0。
- 过多地使用全局变量可能导致代码的可维护性和可读性降低，因为它们可能在任何地方被访问和修改。因此，应谨慎使用全局变量。

**局部变量**

- 局部变量是在函数或代码块内声明的变量。
- 局部变量仅在声明它们的函数或代码块内部有效，离开这个范围后，它们就会被销毁。局部变量的作用范围仅限于声明它们的函数或代码块。
- 局部变量只能在声明它们的函数或代码块内访问。
- 局部变量在声明时没有默认初始值，必须在使用之前对它们进行初始化。
- 局部变量有助于代码的封装和模块化，通常是编写可维护和可读代码的推荐方法。

```cpp
#include <iostream>

int global_var = 10; // 全局变量，可以在整个程序的任何地方访问

void my_function() {
    int local_var = 20; // 局部变量，仅在my_function内部有效

    std::cout << "Global variable inside my_function: " << global_var << std::endl;
    std::cout << "Local variable inside my_function: " << local_var << std::endl;
}

int main() {
    int local_var = 30; // 另一个局部变量，仅在main函数内部有效

    std::cout << "Global variable inside main: " << global_var << std::endl;
    std::cout << "Local variable inside main: " << local_var << std::endl;

    my_function();

    return 0;
}
```

`global_var`是一个全局变量，可以在`main`函数和`my_function`中访问。而`local_var`是局部变量，它在`main`函数和`my_function`中分别有不同的实例，它们互不影响。



### 18. 静态成员与普通成员的区别？

**存储和生命周期**

- 静态成员：静态成员变量在类的所有实例之间共享，因此只有一个存储空间分配给静态成员变量。静态成员变量的生命周期从程序开始执行时就开始，一直持续到程序结束。
- 普通成员：每个类的实例都有自己的一份普通成员变量。这意味着每创建一个类的实例，都会为其普通成员变量分配独立的存储空间。普通成员变量的生命周期与其所属的类实例相同。

**访问方式**

- 静态成员：静态成员变量和静态成员函数可以通过类名直接访问，而不需要创建类的实例。同时，静态成员函数也可以通过类的实例访问，但它们没有`this`指针，因此无法访问非静态成员变量。
- 普通成员：普通成员变量和普通成员函数只能通过类的实例访问。它们可以访问类的所有成员（包括静态成员和非静态成员）。

**初始化**

- 静态成员：静态成员变量在程序启动之前的静态初始化阶段进行初始化。如果它们有显式的初始化器，则使用这些初始化器进行初始化；否则，它们将被初始化为零（整数类型）或者空（指针类型）。
- 普通成员：普通成员变量在创建类的实例时进行初始化。可以在构造函数中或使用成员初始化列表来初始化普通成员变量。



```cpp
#include <iostream>

class MyClass {
public:
    static int static_member;
    int normal_member;

    MyClass(int normal_value) : normal_member(normal_value) {}

    static void static_function() {
        std::cout << "Static function called." << std::endl;
    }

    void normal_function() {
        std::cout << "Normal function called." << std::endl;
    }
};

int MyClass::static_member = 42;

int main() {
    MyClass obj1(1), obj2(2);

    // 访问静态成员
    std::cout << "Static member: " << MyClass::static_member << std::endl;

    // 访问普通成员
    std::cout << "Normal member (obj1): " << obj1.normal_member << std::endl;
    std::cout << "Normal member (obj2): " << obj2.normal_member << std::endl;

    // 调用静态函数
    MyClass::static_function();

    // 调用普通函数
    obj1.normal_function();
    return 0;
}
```

**总结**

- 静态成员在所有类实例之间共享，并在程序生命周期内存在。它们可以通过类名直接访问，也可以通过类的实例访问。
- 普通成员随类实例的创建而创建，随类实例的销毁而销毁。它们只能通过类的实例访问。



### 19. 头文件中的 ifndef、define、endif 的作用？

在C++中，`#ifndef`、`#define`和`#endif`是预处理器指令，通常用于头文件中的“包含保护”（include guard）机制。**包含保护可以避免头文件在同一个编译单元中被多次包含，从而防止重复声明、编译错误和不必要的编译开销。**

以下是头文件包含保护的示例：

```cpp
// my_header.h
#ifndef MY_HEADER_H
#define MY_HEADER_H

// 头文件的内容，如类声明、函数声明等

#endif // MY_HEADER_H
```

`#ifndef`指令检查一个名为`MY_HEADER_H`的宏是否已经定义。如果该宏尚未定义，预处理器将继续处理头文件的内容，并使用`#define`指令定义该宏。在头文件的末尾，`#endif`指令结束了包含保护。

如果头文件被多次包含，`#ifndef`指令将检测到`MY_HEADER_H`已经被定义，从而跳过头文件的内容，直接到达`#endif`指令。这样一来，同一个头文件在同一个编译单元中不会被多次包含，从而避免了重复声明和其他相关问题。

在C++11及以后的版本中可以使用`#pragma once`指令来实现相同的目的，可能在某些编译器中不受支持。在支持`#pragma once`的编译器中，可以将包含保护简化为：

```cpp
// my_header.h
#pragma once

// 头文件的内容，如类声明、函数声明等
```

这种写法具有更简洁的优点，但可能不具有可移植性。使用`#ifndef`、`#define`和`#endif`进行包含保护仍然是一个通用且可靠的方法。



### 20. define 和 inline 的区别？

`define`和`inline`都可以用于定义简短的函数。

**`define`**

- `define`是C和C++中的预处理器指令，用于定义宏（macro）。
- 使用`define`定义的宏在编译过程的预处理阶段进行文本替换，而不是在编译阶段进行处理。
- 宏没有作用域，它们在整个源文件中都是可见的，除非使用`#undef`取消定义。
- 宏不进行类型检查，容易导致潜在的错误和难以调试的问题。
- 宏的参数在替换时不进行计算，可能导致某些表达式在宏展开时被重复计算，从而影响程序的性能。

```cpp
#define SQUARE(x) ((x) * (x))

int main() {
    int x = 5;
    int y = SQUARE(x); // 宏展开为：int y = ((x) * (x));
}
```

**`inline`**

- `inline`是C++中的一个关键字，用于建议编译器将函数声明为内联函数。
- 内联函数在编译过程中可能被编译器直接插入到调用处，从而减少函数调用的开销。但请注意，编译器并不一定会接受这个建议，内联决策仍然由编译器自主决定。
- 内联函数具有作用域和类型检查，比宏更安全、更健壮。
- 对于简短的函数，内联函数可以提高程序的性能，因为它避免了函数调用的开销。

```cpp
inline int square(int x) {
    return x * x;
}

int main() {
    int x = 5;
    int y = square(x);
}
```

在C++通常建议**使用`inline`函数而不是宏，除非有特殊的需求必须使用宏**。`inline`函数在很多方面都优于宏，因为它们可以提供更好的类型检查、作用域管理和代码可读性。



### 21. define 和 typedef 有什么区别？

**`#define`是预处理器指令，而`typedef`是语言关键字**

- `#define`在预处理阶段展开，它只是进行文本替换，不涉及类型检查。因此，`#define`不能提供编译时类型安全。
- `typedef`在编译阶段处理，它涉及类型检查。这使得`typedef`具有类型安全性，可以捕获类型不匹配的错误。

**用途**

- `#define`可以用于定义类型别名、常量、宏等。它具有更广泛的用途，但可能导致意外的副作用和难以调试的问题。
- `typedef`专门用于为类型定义别名。它更安全、更可靠，但只能用于类型别名。

**作用域**

- `#define`没有作用域概念，从定义处开始，直到文件结束或者使用`#undef`取消定义。这可能导致命名冲突和全局污染。
- `typedef`遵循C++作用域规则，可以在命名空间、类或函数内部定义。这使得它更加灵活且易于管理。



```cpp
// 使用#define定义类型别名
#define IntPair std::pair<int, int>

// 使用typedef定义类型别名
typedef std::pair<int, int> IntPairTypedef;

int main() {
    IntPair a(1, 2);          // 使用#define定义的别名
    IntPairTypedef b(3, 4);   // 使用typedef定义的别名

    return 0;
}
```



### 22. memset ，memcpy 有什么区别？

`memset`和`memcpy`都是C语言库函数，分别用于设置内存块的内容和复制内存块，这两个函数在C++中也可以使用。

**功能**

- `memset`：`memset`函数用于设置内存块的内容。它将一段内存中的每个字节设置为指定的值。它常用于将数组或结构体初始化为零或其他特定值。
- `memcpy`：`memcpy`函数用于复制内存块。它从源内存块复制指定数量的字节到目标内存块。它常用于将一个数组或结构体的内容复制到另一个数组或结构体。

**参数**

- `memset`：接受三个参数，分别为指向目标内存块的指针、要设置的值（通常是一个整数，但实际上会被转换为无符号字符）以及要设置的字节数。
- `memcpy`：接受三个参数，分别为指向目标内存块的指针、指向源内存块的指针以及要复制的字节数。



```cpp
#include <iostream>
#include <cstring>

int main() {
    // 使用memset将数组初始化为零
    int arr1[5];
    std::memset(arr1, 0, sizeof(arr1));

    // 使用memcpy将数组复制到另一个数组
    int arr2[5];
    std::memcpy(arr2, arr1, sizeof(arr1));

    // 打印数组内容
    for (int i = 0; i < 5; ++i) {
        std::cout << arr2[i] << " ";
    }

    return 0;
}
```

使用`memset`将`arr1`数组的内容设置为零，然后使用`memcpy`将`arr1`的内容复制到`arr2`数组。虽然在C++中可以使用这两个函数，但在某些情况下，使用C++的标准库函数（如`std::fill`和`std::copy`）可能更安全。

对于具有non-trivial构造函数或析构函数的类对象，直接使用`memset`或`memcpy`可能会破坏对象的状态或导致未定义行为。



### 23. memcpy与memmove的区别？

`memcpy`和`memmove`都是用于内存操作的函数，它们用于将一段内存的内容复制到另一段内存。

**`memcpy`**

- `memcpy`用于将一段内存区域的内容复制到另一段内存区域。
- 原型：`void* memcpy(void* dest, const void* src, size_t count);`
- `memcpy`在源（`src`）和目标（`dest`）内存区域重叠的情况下可能产生未定义行为。当源和目标内存区域不重叠时，`memcpy`通常具有较高的性能。

**`memmove`**

- `memmove`与`memcpy`类似，也用于将一段内存区域的内容复制到另一段内存区域。
- 原型：`void* memmove(void* dest, const void* src, size_t count);`
- 与`memcpy`不同，`memmove`可以正确处理源和目标内存区域重叠的情况。当内存区域重叠时，`memmove`会确保数据的正确复制，而不会产生未定义行为。
- 在处理不重叠的内存区域时，`memmove`可能比`memcpy`略慢，因为它需要处理重叠内存区域的情况。

**总结**：`memcpy`和`memmove`之间的主要区别在于它们**处理重叠内存区域**的方式。如果内存区域可能重叠，应使用`memmove`以确保正确的行为。如果内存区域不重叠，可以使用`memcpy`获得更高的性能。



### 24. sizeof 和 strlen 有什么区别？

`sizeof`和`strlen`是C和C++中两个用于获取大小的不同操作符和函数。

**`sizeof`**

- `sizeof`是一个编译时操作符，用于计算类型或对象所占用的字节数。
- `sizeof`可以用于任何数据类型，包括基本类型、数组、结构体和类。
- 对于数组，`sizeof`会返回整个数组所占用的字节数，而不仅仅是一个指针的大小。
- `sizeof`的结果在编译时就已经确定，不会在运行时改变。

```cpp
#include <iostream>

int main() {
    int a = 42;
    double b = 3.14;
    char c[] = "hello";

    std::cout << "Size of int: " << sizeof(a) << std::endl;        // 输出：Size of int: 4
    std::cout << "Size of double: " << sizeof(b) << std::endl;     // 输出：Size of double: 8
    std::cout << "Size of char array: " << sizeof(c) << std::endl; // 输出：Size of char array: 6
    
    return 0;
}
```

**`strlen`**

- `strlen`是一个运行时函数，用于计算C风格字符串（以空字符'\0'结尾的字符数组）的长度。
- `strlen`函数的原型：`size_t strlen(const char* str);`
- `strlen`只适用于C风格字符串，不能用于其他数据类型。
- `strlen`返回字符串中字符的数量，不包括结尾的空字符。因此，`strlen`的结果可能在运行时改变，取决于字符串的实际内容。

```cpp
#include <iostream>
#include <cstring>

int main() {
	char str1[] = "hello";
	char str2[] = "world";

	std::cout << "Length of str1: " << strlen(str1) << std::endl; // 输出：Length of str1: 5
	std::cout << "Length of str2: " << strlen(str2) << std::endl; // 输出：Length of str2: 5

	return 0;
}
```



### 25. 简述 strcpy、sprintf 与 memcpy 的区别？

`strcpy`、`sprintf`和`memcpy`都是C语言库函数，用于处理字符串和内存块的操作。

**功能**

- `strcpy`：`strcpy`函数用于复制一个以空字符（null-terminator）结尾的字符串。它将源字符串中的字符逐个复制到目标字符串，直到遇到空字符。空字符也会被复制到目标字符串。
- `sprintf`：`sprintf`函数用于格式化输出。它根据提供的格式字符串将数据格式化为一个字符串。可以将整数、浮点数、字符等格式化为字符串。函数返回存储在目标字符串中的字符数（不包括空字符）。
- `memcpy`：`memcpy`函数用于复制内存块。它从源内存块复制指定数量的字节到目标内存块。它常用于将一个数组或结构体的内容复制到另一个数组或结构体。

**参数**

- `strcpy`：接受两个参数，分别为指向目标字符串的指针和指向源字符串的指针。目标字符串的大小应足够容纳源字符串，包括空字符。
- `sprintf`：接受至少三个参数，分别为指向目标字符串的指针、格式字符串以及要格式化的数据。目标字符串的大小应足够容纳格式化后的结果，包括空字符。使用`sprintf`时要注意缓冲区溢出的风险，可以使用`snprintf`函数避免此类问题。
- `memcpy`：接受三个参数，分别为指向目标内存块的指针、指向源内存块的指针以及要复制的字节数。



```cpp
#include <iostream>
#include <cstring>

int main() {
    // 使用strcpy复制字符串
    char str1[] = "Hello, world!";
    char str2[20];
    std::strcpy(str2, str1);
    std::cout << "str2: " << str2 << std::endl;

    // 使用sprintf格式化输出
    int num = 42;
    char str3[20];
    std::sprintf(str3, "The answer is %d", num);
    std::cout << "str3: " << str3 << std::endl;

    // 使用memcpy复制内存块
    int arr1[] = {1, 2, 3, 4, 5};
    int arr2[5];
    std::memcpy(arr2, arr1, sizeof(arr1));
    std::cout << "arr2: ";
    for (int i = 0; i < 5; ++i) {
        std::cout << arr2[i] << " ";
    }

    return 0;
}
```



### 26. printf实现原理？

`printf`是C语言标准库中的一个用于格式化输出的函数。实现原理涉及包括解析格式字符串、处理可变参数列表和将结果输出到标准输出（通常是屏幕）等。

- **解析格式字符串**： `printf`函数的第一个参数是一个格式字符串，其中包含普通字符和格式说明符（以`%`开头）。`printf`首先会遍历格式字符串，逐个字符地处理。
  - 对于普通字符，`printf`直接将它们输出到标准输出。
  - 对于格式说明符，`printf`会解析后面跟随的字符，以确定需要处理的参数类型和格式。例如，`%d`表示输出一个整数，`%f`表示输出一个浮点数，`%s`表示输出一个字符串等。
- **处理可变参数列表**： `printf`是一个可变参数函数，这意味着它可以接受不同数量和类型的参数。为了处理这些参数，`printf`使用C语言提供的可变参数宏（如`va_start`、`va_arg`、`va_end`等）来访问和操作这些参数。 当遇到格式说明符时，`printf`会使用`va_arg`宏获取与之对应的参数，并将其转换为适当的类型。
- **格式化输出**： 对于每个格式说明符，`printf`会将对应的参数转换为字符串形式，根据格式选项进行适当的填充和对齐（如指定宽度、精度等），然后将结果输出到标准输出。
- **输出和返回值**： 在处理完格式字符串和参数列表后，`printf`将所有格式化后的内容输出到标准输出。最后，`printf`返回成功输出的字符数。



### 27. cout和printf有什么区别？

`cout`和`printf`都可以用于C++中的输出操作。

**来源和类型**

- `cout`：`cout`是C++标准库的一部分，属于`std`命名空间。它是`std::ostream`类的一个实例，用于向标准输出（通常是屏幕）发送数据。
- `printf`：`printf`是C语言库函数，在C++中也可以使用。它是一个用于格式化输出的函数，通常用于向标准输出发送格式化的文本。

**格式化**

- `cout`：`cout`使用流操作符（`<<`）将数据发送到输出流。可以方便地链接多个输出操作。`cout`自动处理类型转换和格式化，使得代码更易读和类型安全。
- `printf`：`printf`使用格式字符串来指定输出格式。需要为每个输出变量提供一个格式说明符。`printf`不提供类型安全，容易导致类型不匹配的问题。

**性能**

- `cout`：`cout`通常比`printf`性能略低，因为它涉及到更多的类和函数调用。然而，在大多数情况下，性能差异可以忽略不计。
- `printf`：`printf`通常比`cout`性能略高，因为它是一个简单的函数调用，直接处理格式字符串和参数列表。



### 28. class、union、struct的区别？

`class`、`union`和`struct`都是C++中用于定义用户自定义类型的关键字。

**`class`**

- `class`用于定义类，可以包含数据成员和成员函数。
- 默认情况下，`class`的数据成员和成员函数是私有（private）的，只能通过类的成员函数进行访问和修改。
- 类可以继承其他类，支持封装、继承和多态等面向对象编程特性。
- 类可以有构造函数、析构函数以及其他特殊成员函数。

**`union`**

- `union`用于定义联合体，可以包含多个数据成员。
- 所有`union`的数据成员共享同一块内存空间，因此在同一时间只能存储一个数据成员的值。
- 默认情况下，`union`的数据成员是公共（public）的。
- 通常，`union`用于节省内存或实现底层数据操作。
- 在C++中，`union`可以包含构造函数、析构函数和其他成员函数，但这会使使用变得复杂。

**`struct`**

- `struct`用于定义结构体，可以包含数据成员和成员函数。
- 默认情况下，`struct`的数据成员和成员函数是公共（public）的。
- 在C++中，`struct`和`class`的功能几乎相同，只是默认的访问控制不同。`struct`通常用于表示简单的数据结构，而`class`用于实现面向对象编程的特性。
- 结构体可以有构造函数、析构函数以及其他特殊成员函数。

```cpp
// class示例
class MyClass {
private:
    int x;

public:
    MyClass(int val) : x(val) {}
    int getX() const { return x; }
    void setX(int val) { x = val; }
};

// union示例
union MyUnion {
    int intValue;
    float floatValue;
};

// struct示例
struct MyStruct {
    int x;
    int y;

    int getSum() const { return x + y; }
};

int main() {
    MyClass obj1(5);
    obj1.setX(10);
    std::cout << "MyClass x: " << obj1.getX() << std::endl;

    MyUnion obj2;
    obj2.intValue = 42;
    std::cout << "MyUnion intValue: " << obj2.intValue << std::endl;
    obj2.floatValue = 3.14f;
    std::cout << "MyUnion floatValue: " << obj2.floatValue << std::endl;

    MyStruct obj3 = {1, 2};
    std::cout << "MyStruct sum: " << obj3.getSum() << std::endl;

    return 0;
}
```

分别创建了一个`class`、`union`和`struct`。`MyClass`用于实现一个简单的类，包含一个私有数据成员`x`和一些公共成员函数。`MyUnion`定义了一个联合体，包含两个数据成员`intValue`和`floatValue`，它们共享相同的内存空间。`MyStruct`定义了一个结构体，包含两个公共数据成员`x`和`y`以及一个成员函数`getSum`。

在`main`函数中分别创建了这些类型的实例，并进行了相应的操作。对于`MyClass`实例使用成员函数`setX`和`getX`来访问和修改私有数据成员`x`。对于`MyUnion`实例，将一个整数值赋给`intValue`，然后将一个浮点值赋给`floatValue`当给`floatValue`赋值后，`intValue`的值会丢失，因为它们共享相同的内存空间。对于`MyStruct`实例初始化数据成员`x`和`y`，然后使用成员函数`getSum`计算它们的和。



### 29. 一个参数可以既是const又是volatile吗？

一个参数可以同时被声明为`const`和`volatile`，这两个限定符具有不同的含义，可以组合使用以表示特定的行为。

- `const`： 当一个参数被声明为`const`时，意味着它的值不能被修改。编译器会对`const`对象的修改尝试报错。这有助于确保数据的不变性，提高代码的安全性和可读性。
- `volatile`： 当一个参数被声明为`volatile`时，意味着它的值可能在程序的控制之外发生变化，例如来自硬件设备或其他线程的更改。编译器在处理`volatile`对象时，会禁止对该对象进行优化，以确保每次访问都会直接从内存中读取数据，而不是使用缓存或寄存器中的值。

当一个参数被声明为`const volatile`时，表示该参数的值不应在当前作用域中被修改，同时它的值可能在程序的控制之外发生变化。这种情况通常出现在以下场景：

- 外部设备或硬件寄存器：这些设备的状态可能在程序控制之外发生变化，但程序在访问这些状态时不应对其进行修改。
- 只读内存映射：在嵌入式系统或实时操作系统中，某些内存区域可能会被映射为只读，但它们的值可能在程序控制之外发生变化。

示例：

```cpp
const volatile int* pStatusRegister;

// 读取状态寄存器的值，但不允许修改它
int status = *pStatusRegister;
```

`pStatusRegister`指向一个`const volatile`整数，表示它的值可能在程序控制之外发生变化，但在当前作用域中不应被修改。



