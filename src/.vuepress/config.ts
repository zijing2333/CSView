import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";
// import { docsearchPlugin } from "@vuepress/plugin-docsearch";


export default defineUserConfig({

  // 部署站点基础路径
  base: "/",

  // 站点的语言
  lang: "zh-CN",

  // 站点的标题
  title: 'CSView',

  // 站点的描述
  description : '专注互联网校园招聘，更快、更好、更精确的准备面试，让计算机校招不再成为困难！',

  // 自定义favicon
  head: [['link', { rel: 'icon', href: '/logo.png' }]],


  

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
