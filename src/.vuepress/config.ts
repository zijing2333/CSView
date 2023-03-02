import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({


  // 部署站点基础路径
  base: "/",

  // 站点的语言
  lang: "zh-CN",

  // 站点的标题
  title: 'CSView',

  // 站点的描述
  description : 'CSView是一个互联网面试知识学习和汇总的八股文网站，包括面试高频算法、系统设计、计算机网络、操作系统、C++、Java、golang、MySQL、Redis、K8s、消息队列等常见面试题。',

  
  head: [
    // 自定义favicon
    ['link', { rel: 'icon', href: '/logo.png' }],
    // 流量统计脚本
    [
      "script",
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?c902278b2f3d0bef22a61dce631ddecb";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`,
    ],   
  ],


  

  // 主题
  theme,

  // 插件
  plugins: [
    
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
      locales:{
        "/zh/": {
          cancel: "取消",
          placeholder: "搜索",
          search: "搜索",
          searching: "搜索中",
          select: "选择",
          navigate: "切换",
          exit: "关闭",
          history: "搜索历史",
          emptyHistory: "无搜索历史",
          emptyResult: "没有找到结果",
          loading: "正在加载搜索索引...",
        },
      },

    }),
    
  ],
  shouldPrefetch: true,
});
