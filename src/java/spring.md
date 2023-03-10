---
title: Spring
author: xmy
---
### 谈谈你对IOC的理解？

Spring IOC（Inversion of Control，控制反转）是 Spring 框架的核心，它实现了一种基于容器的对象管理机制。在 Spring IOC 中，控制权由应用程序代码转移到了 Spring 框架中，Spring 框架负责创建对象、管理对象之间的依赖关系、调用对象的方法等操作，应用程序只需要声明需要使用的对象和依赖关系，无需自己负责对象的创建和管理，从而实现了控制反转。

在 Spring IOC 中，容器负责创建和管理对象，容器根据配置文件或者注解中的信息，自动创建和管理对象之间的依赖关系，然后将这些对象注入到应用程序中。应用程序只需要声明需要使用的对象和依赖关系，通过注入的方式获取这些对象，从而避免了硬编码和耦合性的问题。

Spring IOC 的主要实现方式是通过依赖注入（Dependency Injection，DI）来实现的。依赖注入是指在对象创建的过程中，自动注入该对象所依赖的其他对象，从而构建对象之间的依赖关系。Spring IOC 支持多种依赖注入的方式，如构造函数注入、Setter 方法注入、字段注入等。

总的来说，Spring IOC 提供了一种松耦合、可重用、可维护的编程模式，使得应用程序更加容易开发、测试和扩展。通过使用 Spring IOC，应用程序可以更加关注业务逻辑，而不需要过多关注对象的创建和管理。

### IOC的实现原理

Spring IOC 的实现原理可以分为两个步骤：1）扫描和解析配置文件或注解信息，将其转换为内部的对象定义和依赖关系；2）根据对象定义和依赖关系，使用反射机制动态创建和初始化对象，并将对象注入到需要使用它们的地方。

具体来说，Spring IOC 的实现过程如下：

1. 读取配置文件或解析注解信息，将其转换为内部的对象定义和依赖关系。在 Spring 中，可以使用 XML 文件或注解来配置对象和依赖关系。Spring 通过解析配置文件或注解信息，将其转换为内部的对象定义和依赖关系（BeanDefinition）放到容器（BeanFactory）中。对象定义包括对象的类型、属性、构造函数等信息，依赖关系包括对象之间的依赖关系、依赖注入方式等信息。
2. 使用反射机制创建对象。在 Spring 中，通过反射机制来创建对象。Spring 会根据对象定义的类型和构造函数信息，使用反射机制来创建对象。
3. 初始化对象。在创建对象之后，Spring 会调用对象的初始化方法，如实现了 InitializingBean 接口的 afterPropertiesSet 方法或配置文件中指定的初始化方法。
4. 注入依赖关系。在初始化对象之后，Spring 会自动注入对象之间的依赖关系。Spring 支持多种依赖注入方式，如构造函数注入、Setter 方法注入、字段注入等。
5. 返回对象。在注入依赖关系之后，Spring 将创建并初始化完成的对象返回给调用方（通过BeanFactory.getBean方法）。

总的来说，Spring IOC 的实现原理是通过反射机制动态创建和初始化对象，并将对象注入到需要使用它们的地方。通过解耦对象之间的依赖关系，使得应用程序更加灵活、可维护、可扩展。

### BeanFactory和ApplicationContext的关系

BeanFactory和ApplicationContext是Spring框架中的两个重要的接口。它们都用于管理Spring Bean对象，但是它们在功能上有一些不同点。

BeanFactory是Spring框架中最基本的容器，它提供了最基础的IOC和DI的支持。它的主要功能是用于创建、管理和查找Bean对象。BeanFactory负责解析XML文件并实例化所有的对象，它会延迟加载Bean对象，只有在第一次使用时才会进行实例化。这样做的好处是可以避免在程序启动时加载所有的Bean对象，从而提高了应用程序的启动速度和性能。

ApplicationContext则是在BeanFactory基础上扩展而来的，它提供了更多的功能和特性。ApplicationContext不仅支持IOC和DI，还支持国际化、事件传递、资源加载、AOP等功能。ApplicationContext会在应用程序启动时就立即实例化所有的Bean对象，同时也会提供更多的Bean生命周期管理功能，例如Bean的自动装配、Bean的自动注入、Bean的声明周期管理等。

总的来说，BeanFactory是Spring框架中最基本的容器，提供最基础的IOC和DI的支持；而ApplicationContext是在BeanFactory的基础上扩展而来的，提供了更多的功能和特性。ApplicationContext是Spring框架中使用较为广泛的容器。

### Spring如何解决循环依赖问题？

Spring循环依赖问题指的是在Spring容器中出现相互依赖的情况，即两个或多个Bean之间相互依赖，形成了一个循环依赖链。例如，Bean A依赖Bean B，Bean B又依赖Bean A，这就构成了一个循环依赖。

Spring是通过三级缓存解决循环依赖问题的，基本思路是：在Bean创建过程中，将正在创建的Bean对象放入一个专门用于缓存正在创建中的Bean对象的缓存池中，当后续创建其他Bean对象时，若需要依赖于该缓存池中正在创建的Bean，则直接使用缓存池中的Bean对象，而不是重新创建一个新的Bean对象。

具体而言，Spring通过三级缓存解决循环依赖问题的步骤如下：

1. Spring在创建Bean对象时，首先从一级缓存（singletonObjects）中查找是否存在已经创建完成的Bean对象，若存在则直接返回该Bean对象；
2. 若一级缓存中不存在该Bean对象，则从二级缓存（earlySingletonObjects）中查找是否存在该Bean对象的代理对象，若存在则返回代理对象；
3. 若二级缓存中也不存在该Bean对象的代理对象，则将正在创建的Bean对象放入三级缓存（singletonFactories）中，并在创建过程中进行依赖注入，即为该Bean对象注入依赖的其他Bean对象。此时，如果其他Bean对象中依赖了正在创建的Bean对象，Spring将直接从三级缓存中获取正在创建的Bean对象，而不是重新创建一个新的Bean对象。
4. 当Bean对象创建完成后，Spring将其从三级缓存中移除，并将其加入一级缓存中，以便下次获取该Bean对象时直接从一级缓存中获取。

需要注意的是，三级缓存并不是无限制地缓存Bean对象，而是限定在Bean对象创建过程中使用，Bean对象创建完成后将会从三级缓存中移除。此外，如果Bean对象的依赖关系存在循环依赖，则在创建过程中将会抛出异常，因为无法通过缓存解决循环依赖的问题

### 谈谈你对AOP的理解？

Spring AOP（面向切面编程）是 Spring 框架中的一个重要模块，用于解决系统中的横切关注点（cross-cutting concerns）问题。所谓横切关注点，指的是系统中分散在各个模块中、与主业务逻辑无关的代码，例如日志记录、事务管理、权限控制等。

Spring AOP 采用代理模式实现，它通过在运行期间动态代理目标对象，将横切关注点织入到系统中，从而实现了业务逻辑与横切关注点的分离。Spring AOP 主要由以下几个概念组成：

1. 切面（Aspect）：切面是一个类，它包含了一组横切关注点和相应的逻辑。一个切面通常会跨越多个对象，因此它不仅定义了横切关注点，还定义了横切关注点与业务逻辑的关系。
2. 连接点（Join Point）：连接点是在程序执行期间可以插入切面的点。例如方法调用、异常抛出等。
3. 切入点（Pointcut）：切入点是一组连接点的集合，它定义了在哪些连接点上应用切面。例如所有的方法调用、所有的异常抛出等。
4. 通知（Advice）：通知是切面在特定连接点执行的代码。Spring AOP 提供了五种类型的通知：前置通知（Before）、后置通知（After）、返回通知（After-returning）、异常通知（After-throwing）和环绕通知（Around）。
5. 切面织入（Weaving）：切面织入是将切面应用到目标对象并创建代理对象的过程。

Spring AOP 通过配置文件或注解的方式来定义切面、连接点、切入点和通知等信息，并使用代理模式将切面织入到目标对象中。通过 AOP 技术，可以有效地解耦业务逻辑和横切关注点，提高了系统的可维护性和可扩展性。

### 动态代理了解吗？

Java动态代理是Java中一种重要的代理模式，它允许在运行时动态地生成代理类和对象，无需编写静态代理类。

在Java中，动态代理可以通过Java自带的两种方式实现：基于接口的动态代理和基于类的动态代理。

1. 基于接口的动态代理

基于接口的动态代理是Java官方提供的一种动态代理实现方式。在这种实现方式中，代理类必须实现一个或多个接口，然后在运行时动态创建代理对象。JDK中提供了一个Proxy类和一个InvocationHandler接口来实现基于接口的动态代理。

首先，需要定义一个实现InvocationHandler接口的代理类，该类实现了代理类的逻辑。这个类中有一个invoke方法，这个方法在代理类的方法被调用时被执行。在运行时通过Proxy类的静态方法newProxyInstance生成代理类对象。这个方法需要三个参数：ClassLoader、代理类需要实现的接口数组和InvocationHandler实现类的实例。当通过代理类对象调用方法时，这个方法首先被转发到InvocationHandler的invoke方法中。在invoke方法中，可以根据代理类方法的不同来执行不同的逻辑，包括调用被代理对象的方法和执行其他的逻辑。最终，代理类的方法被执行完毕，返回结果。

1. 基于类的动态代理

基于类的动态代理是通过字节码生成技术实现的。在这种实现方式中，代理类不需要实现接口，而是通过继承一个已有的类来实现代理功能。在Java中，可以通过CGLIB库实现基于类的动态代理。

CGLIB（Code Generation Library）是一个高性能的代码生成库，它可以在运行时动态生成字节码来实现类的增强功能。通过CGLIB库，可以直接在运行时创建目标对象的子类，从而实现基于类的动态代理。

基于类的动态代理相比于基于接口的动态代理，可以代理那些没有实现任何接口的类，更加灵活。但是它的实现原理比较复杂，需要在运行时动态生成字节码，会带来一定的性能开销。

### SpringMVC有哪些核心组件？

DispatcherServlet：前置控制器，负责接收 HTTP 请求并委托给 HandlerMapping、HandlerAdapter 和 ViewResolver 等组件处理。
Handler：处理器，完成具体的业务逻辑，相当于 Servlet 或 Action。
HandlerMapping：负责将请求映射到对应的 Handler 即控制器(Controller)。
HandlerInterceptor：处理器拦截器，是一个接口，如果需要完成一些拦截处理，可以实现该接口。
HandlerExecutionChain：处理器执行链，包括两部分内容：Handler 和 HandlerInterceptor（系统会有一个默认的 HandlerInterceptor，如果需要额外设置拦截，可以添加拦截器）。
HandlerAdapter：负责调用处理器方法并封装处理结果，将其传递给 DispatcherServlet。
ModelAndView：装载了模型数据和视图信息，作为 Handler 的处理结果，返回给 DispatcherServlet。
ViewResolver：视图解析器，负责根据视图名称解析出对应的 View，最终将渲染结果响应给客户端。

### SpringMVC的执行流程了解吗？

![image-20230314192503296](https://pic.imgdb.cn/item/64105affebf10e5d53490643.jpg)

SpringMVC是基于MVC设计模式实现的Web框架，其工作流程如下：

1. 客户端发送HTTP请求至前端控制器DispatcherServlet。
2. DispatcherServlet根据请求信息调用HandlerMapping，解析请求对应的Handler即处理器（Controller）。
3. HandlerMapping根据请求URL查找对应的Controller，同时生成用于执行该请求的HandlerExecutionChain对象（包含Interceptor链）。
4. DispatcherServlet调用HandlerAdapter执行Handler。在执行过程中，HandlerAdapter将把ModelAndView对象传递给DispatcherServlet。
5. Handler执行完成后，返回一个ModelAndView对象给HandlerAdapter。
6. HandlerAdapter将ModelAndView对象传递给DispatcherServlet。
7. DispatcherServlet调用ViewResolver解析视图（View）。
8. ViewResolver解析出View对象后，将其返回给DispatcherServlet。
9. DispatcherServlet调用View对象的render()方法进行视图渲染。
10. DispatcherServlet将渲染后的视图返回给客户端。

在这个过程中，DispatcherServlet是整个SpringMVC的核心，它负责协调各个组件的工作。HandlerMapping负责将请求映射到对应的Controller，而HandlerAdapter负责执行Controller。ViewResolver则根据逻辑视图名（如JSP文件名）解析出View对象，最后由View渲染出实际的页面内容。通过这种分工协作的方式，SpringMVC可以实现灵活、高效、可扩展的Web应用程序开发。