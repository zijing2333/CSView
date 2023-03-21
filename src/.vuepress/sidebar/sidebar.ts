import { sidebar } from "vuepress-theme-hope";

export const sideBar = sidebar({

   "/network/":[
    
      { text: "🟠 概述", link: "summary"},
      { text: "🔴 TCP和UDP", link: "tcp"},
      { text: "🔵 IP", link: "ip"},
      { text: "🟢 HTTP", link: "http"},
    ],


    "/mysql/":[
      { text: "🔴 概述", link: "summary"},
      { text: "🟤 事务", link: "transaction"},
      { text: "🔵 索引", link: "indexing"},
      { text: "🟢 锁", link: "lock"},
      { text: "🟣 存储引擎", link: "engine"},
      { text: "🟠 日志", link: "log"},
      { text: "🟡 优化", link: "optimize"},
    ],

    "/golang/":[
      { text: "🔴 概述", link: "summary"},
      { text: "🔵 关键字", link: "keyword"},
      { text: "🟢 GMP", link: "gmp"},
      { text: "🟡 垃圾回收", link: "gc"},
    ],

    "/redis/":[
      { text: "🔴 概述", link: "summary"},
      { text: "🔵 数据结构", link: "data-structure"},
      { text: "🟢 持久化", link: "persistence"},
      { text: "🟡 应用", link: "application"},
      { text: "🟣 集群", link: "colony"},
    ],

    "/cpp/":[
      { text: "🔴 概述", link: "summary"},
      { text: "🔵 数据结构和关键字", link: "data-structure"},
      { text: "🟡 函数", link: "function"},
      { text: "🟢 编译和内存管理", link: "compilation-memory"},

    ],

    "/java/":[
      { text: "🔴 基础", link: "summary"},
      { text: "🔵 集合", link: "collection"},
      { text: "🟢 并发", link: "concurrent"},
      { text: "🟡 JVM", link: "jvm"},
        { text: "🟣 Spring", link: "spring"},
    ],

    "/design/":[
      { text: "🔴 常见设计题", link: "design"},
      { text: "🔵 海量数据处理题", link: "bigdata"},
    ],

    "/rabbitmq/":[
      { text: "🔴 概述", link: "summary"},
      { text: "🔵 应用", link: "apply"},
    ],

    "/os/":[
      { text: "🔴 概述", link: "summary"},
      { text: "🔵 进程和线程", link: "process"},      
      { text: "🟢 linux相关", link: "linux"},
      { text: "🟡 其他知识", link: "other"},
    ],


    "/algorithm-mandatory/":[

        {text: "🔴 链表",
          collapsible: true,
            prefix:"linklist",
          children: [
              {
                  text: "链表必刷题第一部分（1-7题）",
                  link: "01",
              },
              {
                  text: "链表必刷题第二部分（8-14题）",
                  link: "02",
              },
              {
                  text: "链表必刷题第三部分（15-20题）",
                  link: "03",
              },
          ],
       },

        {text: "🟤 树",
            collapsible: true,
            prefix:"tree",
            children: [
                {
                    text: "树必刷题第一部分（1-10题）",
                    link: "01",
                },
                {
                    text: "树必刷题第二部分（11-20题）",
                    link: "02",
                },
                {
                    text: "树必刷题第三部分（21-28题）",
                    link: "03",
                },
            ],
        },

        {text: "🟢 字符串",
            collapsible: true,
            prefix:"string",
            children: [
                {
                    text: "字符串必刷题第一部分（1-6题）",
                    link: "01",
                },
                {
                    text: "字符串必刷题第二部分（7-11题）",
                    link: "02",
                },
            ],
        },


        {text: "🟣 数组",
            collapsible: true,
            prefix:"array",
            children: [
                {
                    text: "数组必刷题第一部分（1-7题）",
                    link: "01",
                },
                {
                    text: "数组必刷题第二部分（8-14题）",
                    link: "02",
                },
                {
                    text: "数组必刷题第三部分（15-21题）",
                    link: "03",
                },
                {
                    text: "数组必刷题第三部分（22-26题）",
                    link: "04",
                },
            ],
        },

        {text: "🔵 栈和队列",
            collapsible: true,
            prefix:"stark-queue",
            children: [
                {
                    text: "栈和队列必刷题第一部分（1-4题）",
                    link: "01",
                },
                {
                    text: "栈和队列必刷题第二部分（5-8题）",
                    link: "02",
                },
            ],
        },

        {text: "🟠 动态规划",
            collapsible: true,
            prefix:"dp",
            children: [
                {
                    text: "动态规划必刷题第一部分（1-6题）",
                    link: "01",
                },
                {
                    text: "动态规划必刷题第二部分（7-12题）",
                    link: "02",
                },
                {
                    text: "动态规划必刷题第三部分（13-18题）",
                    link: "03",
                },
                {
                    text: "动态规划必刷题第四部分（19-24题）",
                    link: "04",
                },
            ],
        },

        {text: "🟡 DFS和回溯",
            collapsible: true,
            prefix:"dfs-backtrack",
            children: [
                {
                    text: "DFS必刷题第一部分（1-5题）",
                    link: "01",
                },
                {
                    text: "回溯必刷题第二部分（6-10题）",
                    link: "02",
                },
            ],
        },

        {text: "🔶 其他",
            collapsible: true,
            prefix:"other",
            children: [
                {
                    text: "其他必刷题第一部分（1-6题）",
                    link: "01",
                },
                {
                    text: "其他必刷题第二部分（7-12题）",
                    link: "02",
                },
                {
                    text: "其他必刷题第三部分（13-18题）",
                    link: "03",
                },
            ],
        },
    ],
    

      
    "/": [
        {
            text: "刷题",
            icon: "suanfaku",
            collapsible: true,
            children: [
              {
                text: "面试必刷算法题",
                icon: "zhongdianbiaozhu",
                link: "algorithm-mandatory",
        
              },
              {
                text: "智力题",
                icon: "dengpao",
                link: "intelligence",
        
              },
              {
                text: "设计题",
                icon: "sheji-xianxing",
                link: "design",
              },
              {
                text: "HR面常见题",
                icon: "mianshianpai",
                link: "hr",
              },
            ],
          },
        

        { text: "操作系统", icon: "caozuoxitong", link: "/os" },
        {
            text: "数据库",
            icon: "data-Inquire-full",
            collapsible: true,

            children: [
              {
                text: "MySQL",
                icon: "odbc-full",
                link: "/mysql",
              },
              {
                text: "Redis",
                icon: "redis",
                link: "/redis",
              },
            ],
          },
        
          {
            text: "编程语言基础",
            icon: "biancheng-01",
            collapsible: true,

            children: [
              {
                text: "golang",
                icon: "Goyuyan",
                link: "/golang",
              },
              {
                text: "c++",
                icon: "cyuyan",
                link: "/cpp",
              },
              {
                text: "java",
                icon: "java",
                link: "/java",
              },
            ],
          },
        
          {
            text: "中间件",
            icon: "gongju",
            collapsible: true,
            children: [
              {
                text: "RabbitMQ",
                icon: "RabbitMQ",
                link: "/rabbitmq",
              },
              {
                text: "Nginx",
                icon: "nginx",
                link: "/nginx",
              },
              
              {
                text: "Kubernetes",
                icon: "kubernetes",
                link: "/k8s",
              },
            ],
          },
        
      ],
});
