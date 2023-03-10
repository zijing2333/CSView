import { navbar } from "vuepress-theme-hope";

export const navBar = navbar([

  {
    text: "面试题",
    icon: "suanfaku",
    children: [
      {
        text: "力扣高频必刷题",
        icon: "zhongdianbiaozhu",
        link: "/algorithm-mandatory/",

      },
      {
        text: "智力题",
        icon: "dengpao",
        link: "/intelligence/",

      },
      {
        text: "设计题",
        icon: "sheji-xianxing",
        link: "/design/",
      },
      {
        text: "HR面常见题",
        icon: "mianshianpai",
        link: "/hr/",
      },
    ],
  },

  { text: "计算机网络", icon: "wangluo1", link: "/network/" },

  { text: "操作系统", icon: "caozuoxitong", link: "/os/" },

  {
    text: "数据库",
    icon: "data-Inquire-full",
    children: [
      {
        text: "MySQL",
        icon: "odbc-full",
        link: "/mysql/",
      },
      {
        text: "Redis",
        icon: "redis",
        link: "/redis/",
      },
    ],
  },

  {
    text: "编程语言基础",
    icon: "biancheng-01",
    children: [
      {
        text: "golang",
        icon: "Goyuyan",
        link: "/golang/",
      },
      {
        text: "c++",
        icon: "cyuyan",
        link: "/cpp/",
      },
      {
        text: "java",
        icon: "java",
        link: "/java/",
      },
    ],
  },

  {
    text: "中间件",
    icon: "gongju",
    children: [
      {
        text: "RabbitMQ",
        icon: "RabbitMQ",
        link: "/rabbitmq/",
      },
      {
        text: "Nginx",
        icon: "nginx",
        link: "/nginx/",
      },
      {
        text: "Kubernetes",
        icon: "kubernetes",
        link: "/k8s/",
      },
    ],
  },

  {
    text: "关于本站",
    icon: "guanyu",
    children: [
      {
        text: "项目介绍",
        icon: "jieshaoxinxi",
        link: "/introduction",
      },
      {
        text: "开发日志",
        icon: "rizhi",
        link: "/development-log",
      },
      {
        text: "网站贡献",
        icon: "gongxian",
        link: "/website-contribution",
      },
    ],
  },
]);
