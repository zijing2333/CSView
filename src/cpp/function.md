### 内联函数？

以inline修饰的函数叫做内联函数，编译时C++编译器会在调用内联函数的地方展开，没有函数调用建立栈帧的开销，内联函数提升程序运行的效率。

  - 内联函数是以空间换时间的做法，省去调用函数的额外开销。所以代码很长或者有循环/递归的函数不适宜使用内联。
  - inline对编译器而言只是一个建议，如果定义的函数体内有递归/循环等，编译器优化时会自动忽略掉内联。
  - inline必须与函数定义放在一起，才能成为内联函数，仅将内联放在声明前是不起作用的。
  - 定义在类内的成员函数默认定义为内联函数，可以使用所在类的保护成员和私有成员
  - 一般情况下，内联函数只会用在函数内容非常简单的情况，如果内联函数代码过多会造成可读性差等问题。

**引入内联函数的目的**

  - 为了解决程序中函数调用的效率问题
  - 取代C中的宏，宏是预编译阶段单纯替换而没有类型检查

**内联函数与一般函数区别**

内联函数具有一般函数的特性，它与一般函数所不同之处公在于函数调用的处理。一般函数进行调用时，要将程序执行权转到被调用函数中，然后再返回到调用它的函数中；而内联函数在调用时，是将调用表达式用内联函数体来替换。内联函数在编译时被替代，而不是像一般函数那样是在运行时被调用。

**适合作为内联函数的函数**

内联函数是为频繁使用、并且过程不大的小型函数


### 虚函数与纯虚函数的区别？

  - 虚函数的定义形式：`virtual {method body}`，纯虚函数的定义形式：`virtual { } = 0`
  - 在虚函数和纯虚函数的定义中不能有static标识符
  - 虚函数和纯虚函数可以定义在同一个类(class)中，含有纯虚函数的类被称为抽象类(abstract class)，而只含有虚函数的类(class)不能被称为抽象类(abstract class)
  - 虚函数可以被直接使用，也可以被子类(sub class)重载以后以多态的形式调用，而纯虚函数必须在子类(sub class)中实现该函数才可以使用，因为纯虚函数在基类(base class)只有声明而没有定义
  - 虚函数和纯虚函数都可以在子类(sub class)中被重载，以多态的形式被调用
  - 虚函数和纯虚函数通常存在于抽象基类(abstract base class -ABC)之中，被继承的子类重载
  - 实现了纯虚函数的子类，该纯虚函数在子类中就编程了虚函数，子类的子类即孙子类可以覆盖该虚函数
  - 如果一个类中含有纯虚函数，那么任何试图对该类进行实例化的语句都将导致错误的产生，因为抽象基类(ABC)是不能被直接调用的



### 哪些函数不能被声明为虚函数？

- 普通函数(非类成员函数)
- 构造函数
- 内联函数
- 静态成员函数
- 友元函数
- 不会被继承的基类的析构函数(这种情况下可以声明，但是没有必要，因为会浪费内存空间)


### 构造函数和析构函数可以被声明为虚函数吗？

构造函数不可以是虚函数，析构函数可以是虚函数。

**构造函数不是虚函数**

  - 虚函数调用是通过虚函数表来查找的，而虚函数表由类的实例化对象的vptr指针指向，该指针存放在对象的内部空间中，需要调用构造函数完成初始化。如果构造函数是虚函数，那么调用构造函数就需要去找vptr，但vptr还没有初始化。
  - 虚函数主要是实现多态，在运行时才可以明确调用对象，根据传入的对象类型来调用函数，例如通过父类的指针或者引用来调用它的时候可以变成调用子类的那个成员函数。而构造函数是在创建对象时自己主动调用的，不可能通过父类的指针或者引用去调用，因此使用虚函数也没有实际意义。

**析构函数可以是虚函数**

  - C++类有继承时，基类的析构函数必须为虚函数。如果不是虚函数，则使用时可能存在内存泄漏的问题。


### lambda 函数的特点，和普通函数相比有什么优点？

lambda表达式是C++11引入的一项新技术，表达形式为

```cpp
 [capture](parameters) mutable -> return type { fuction body};
```

  - **捕获列表[capture]**： []是lambda表达式开始的标志，是指定lambda可以使用局部变量的地方。
  - **参数列表(parameters)**：和普通函数参数列表一致。
    若不需要输入参数可省略括号"()"；
    不支持可变参数、不能有默认参数(实参和形参个数永远相等)
  - **修饰符mutable**： 默认情况下，lambda函数总是一个const类型函数。mutable修饰符可取消其常量性质的。若使用mutable修饰符，参数列表不可省略(即使参数为空)
  - **返回值类型->return type**：追踪返回类型形式声明函数的返回类型。
    若不需要返回值，可省略；
  - **函数体{ fuction body}**：和普通函数的函数体一样，不过除了可以使用参数之外，还可以使用所有捕获的变量。


**与普通函数的区别**：

  - lambda函数和普通函数相比，不需要定义函数名，用[]说明是lambda函数；采样追踪返回类型的方式声明其返回值。
  - 相比普通函数，定义和使用在同一个地方进行，函数定义离使用地方可能很远。
  - lambda函数可以通过捕获列表访问一些上下文中的数据(即捕获列表指定了上下文中的哪些数据可以被lambda使用)。
  - lambda函数等同于一个“局部函数(即在函数作用域中定义的函数)”。局部函数通常仅属于其父作用域，能访问父作用域的变量，且在其父作用域中使用。


### 只定义析构函数，会自动生成哪些构造函数？

只定义析构函数，编译器将自动生成拷贝构造函数和默认构造函数。


### 变量的声明和定义有什么区别？

**变量定义**：用于为变量分配存储空间，还可为变量指定初始值，在程序中变量有且只有一个定义，定义变量的同时也声明了它的类型和名字。

**变量声明**：用于向程序表明变量的类型和名字，变量可以在程序中声明多次，声明需要使用`extern`关键字且不允许指定初始值，当不使用`extern`关键字时，都是定义而不是声明。


### 类默认的构造函数是什么？

没有定义的情况，默认构造就是一个由编译器提供的，不接受任何参数也不执行任何操作的函数；针对于不显式初始化对象，需要显式定义默认构造；带参数的构造也可以是默认构造，需要所有的参数都有默认值。


### 父类和子类是不是在同一个虚函数表？

父类和子类不会共用一个虚函数表，每一个类都会有一个虚函数表。