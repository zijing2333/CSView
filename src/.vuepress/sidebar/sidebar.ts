import { sidebar } from "vuepress-theme-hope";

export const sideBar = sidebar({

   "/network/":[
    
      { text: "ð  æ¦è¿°", link: "summary"},
      { text: "ð´ TCPåUDP", link: "tcp"},
      { text: "ðµ IP", link: "ip"},
      { text: "ð¢ HTTP", link: "http"},
    ],


    "/mysql/":[
      { text: "ð´ æ¦è¿°", link: "summary"},
      { text: "ð¤ äºå¡", link: "transaction"},
      { text: "ðµ ç´¢å¼", link: "indexing"},
      { text: "ð¢ é", link: "lock"},
      { text: "ð£ å­å¨å¼æ", link: "engine"},
      { text: "ð  æ¥å¿", link: "log"},
      { text: "ð¡ ä¼å", link: "optimize"},
    ],

    "/golang/":[
      { text: "ð´ æ¦è¿°", link: "summary"},
      { text: "ðµ å³é®å­", link: "keyword"},
      { text: "ð¢ GMP", link: "gmp"},
      { text: "ð¡ åå¾åæ¶", link: "gc"},
    ],

    "/redis/":[
      { text: "ð´ æ¦è¿°", link: "summary"},
      { text: "ðµ æ°æ®ç»æ", link: "data-structure"},
      { text: "ð¢ æä¹å", link: "persistence"},
      { text: "ð¡ åºç¨", link: "application"},
      { text: "ð£ éç¾¤", link: "colony"},
    ],

    "/cpp/":[
      { text: "ð´ æ¦è¿°", link: "summary"},
      { text: "ðµ æ°æ®ç»æåå³é®å­", link: "data-structure"},
      { text: "ð¡ å½æ°", link: "function"},
      { text: "ð¢ ç¼è¯ååå­ç®¡ç", link: "compilation-memory"},

    ],

    "/java/":[
      { text: "ð´ åºç¡", link: "summary"},
      { text: "ðµ éå", link: "collection"},
      { text: "ð¢ å¹¶å", link: "concurrent"},
      { text: "ð¡ JVM", link: "jvm"},
      { text: "ð£ Spring", link: "spring"},
    ],

    "/design/":[
      { text: "ð´ å¸¸è§è®¾è®¡é¢", link: "design"},
      { text: "ðµ æµ·éæ°æ®å¤çé¢", link: "bigdata"},
    ],

    "/rabbitmq/":[
      { text: "ð´ æ¦è¿°", link: "summary"},
      { text: "ðµ åºç¨", link: "apply"},
    ],

    "/os/":[
      { text: "ð´ æ¦è¿°", link: "summary"},
      { text: "ðµ è¿ç¨åçº¿ç¨", link: "process"},      
      { text: "ð¢ linuxç¸å³", link: "linux"},
      { text: "ð¡ å¶ä»ç¥è¯", link: "other"},
    ],


    "/algorithm-mandatory/":[
      { text: "ð´ é¾è¡¨", link: "linklist"},
      { text: "ð¤ æ ", link: "tree"},
      { text: "ðµ æ åéå", link: "stark-queue"},
      { text: "ð¢ å­ç¬¦ä¸²", link: "string"},
      { text: "ð£ æ°ç»", link: "array"},
      { text: "ð  å¨æè§å", link: "dp"},
      { text: "ð¡ DFS", link: "dfs"},
      { text: "â« åæº¯", link: "backtrack"},
      { text: "âª ææ", link: "handtearing"},
      { text: "ð¶ å¶ä»", link: "other"},
    ],
    

      
    "/": [
        {
            text: "å·é¢",
            icon: "suanfaku",
            collapsible: true,
            children: [
              {
                text: "é¢è¯å¿å·ç®æ³é¢",
                icon: "zhongdianbiaozhu",
                link: "algorithm-mandatory",
        
              },
              {
                text: "æºåé¢",
                icon: "dengpao",
                link: "intelligence",
        
              },
              {
                text: "è®¾è®¡é¢",
                icon: "sheji-xianxing",
                link: "design",
              },
              {
                text: "HRé¢å¸¸è§é¢",
                icon: "mianshianpai",
                link: "hr",
              },
            ],
          },
        

        { text: "æä½ç³»ç»", icon: "caozuoxitong", link: "/os" },
        {
            text: "æ°æ®åº",
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
            text: "ç¼ç¨è¯­è¨åºç¡",
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
            text: "ä¸­é´ä»¶",
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
