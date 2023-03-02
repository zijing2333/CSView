import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import {VueMatomo} from 'vue-matomo'
// import { docsearchPlugin } from "@vuepress/plugin-docsearch";


export default defineUserConfig({


  // 部署站点基础路径
  base: "/",

  // 站点的语言
  lang: "zh-CN",

  // 站点的标题
  title: 'CSView',

  // 站点的描述
  description : 'CSView是一个互联网面试知识学习和汇总项目，包括面试高频算法、系统设计、计算机网络、操作系统、C++、Java、golang、MySQL、Redis、K8s、消息队列等常见面试题。',

  
  head: [
    // 自定义favicon
    ['link', { rel: 'icon', href: '/logo.png' }],
    // 流量统计脚本
    [
      "script",
      {},
      `var _paq = window._paq = window._paq || [];
        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u="//82.156.128.12/";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '1']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
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
    

    // 20230212 爬虫结果显示插件暂时无法正常工作
    // docsearchPlugin({
    //   indexName: 'csguide',
    //   appId: "DEXZADAF4U",
    //   apiKey: "7df1732b3996e98e4387f27cea067e01",
    // }),
    
  ],
  shouldPrefetch: true,
});
