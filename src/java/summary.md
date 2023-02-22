---
title: 基础
author: xmy
---

### Object类
Object类是Java所有类的父类，包含了所有对象最通用的方法，主要有：
- **equals**：用于判断两个对象内容是否等同，没有重写的情况下与`==`相同，都是比较地址是否相同，而它设计出来的目的就是为了使程序员通过重写equals自定义比较对象的哪些内容，比如String的equals是比较字符串内容
- **getClass**：用于获取对象（堆）运行时的类对象（方法区）
- **hashCode**：用于获取对象的hashCode，主要应用于哈希桶相关容器的定位计算。
- **toString**：用于获取对象的字符串表示
- **notify/notifyAll/wait**：用于将线程唤醒/阻塞
- **clone**：用于拷贝对象
### 深浅拷贝
浅拷贝只拷贝对象本身，不对其属性中的引用类型创建新的对象，即拷贝前后的两个对象中的引用指向同一个对象。深拷贝则会为引用类型递归地创建新的对象。对于基本数据类型的属性则都会复制一份。Java中对象的clone方法默认是浅拷贝，如果想深拷贝可以重写clone来实现

![image-20210831104309200](https://i.loli.net/2021/09/12/OYFTNHqljiZGvpn.png)
### 拆装箱原理
以Integer为例

`Integer i = 10`

装箱时自动调用Integer的valueOf(int)方法

`int n = i`

拆箱时自动调用Integer的intValue方法
![image-20210831000034502](https://i.loli.net/2021/09/12/J7RlX4TE58CvBPz.png)
Integer、Short、Byte、Character、Long这几个类的valueOf方法的实现是类似的，它们的参数如果在一定范围内，则会返回cache中已经存在的对象，否则new一个新对象返回

Double、Float的valueOf方法的实现是类似的，这两个没有范围，都返回新对象

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

```java
public static Double valueOf(double d) {
    return new Double(d);
}
```

Boolean的valueOf都返回两个单例的变量之一

```java
public static final Boolean TRUE = new Boolean(true);

public static final Boolean FALSE = new Boolean(false);

public static Boolean valueOf(boolean b) {
    return (b ? TRUE : FALSE);
}
```

当 "=="运算符的两个操作数都是 包装器类型的引用，则是比较指向的是否是同一个对象，而如果其中有一个操作数是表达式（即包含算术运算）则比较的是数值（即会触发自动拆箱的过程）
### String相关
**String、StringBuilder和StringBuffer的主要区别**

- String中的字符数组有final修饰，因此不可变，每次给String类型的引用赋值都是新生成个对象再把该引用指过去，或者是指向字符串常量池中的对象

- StringBuilder和StringBuffer都继承AbstractStringBuilder，其中的字符数组没有final修饰，可通过令其指向新的字符数组实现各种增删改查操作，二者都有功能相同的各种对其中字符串增删改查的方法，区别是后者的这些方法都加了synchronized修饰，是线程安全的

**各自使用场景**

- String：操作少量数据

- StringBuilder：操作大量数据，单线程

- StringBuffer：操作大量数据，多线程

### 接口和抽象类的区别
- 接口方法默认public，抽象类还有protected和default，它们都不能有private，因为生来只为被重写
- 接口只能有static、final变量，抽象类不一定
- 一个类只能继承一个类/抽象类，但可以实现多个接口。一个接口也可以继承多个接口
- 设计上讲，抽象类抽象一类事物，接口抽象一组行为
- 在 jdk 7 或更早版本中，接口里面只能有常量变量和抽象方法。这些接口方法必须由选择实现接口的类实现。jdk 8 的时候接口可以有默认方法和静态方法功能。Jdk 9 在接口中引入了私有方法和私有静态方法。