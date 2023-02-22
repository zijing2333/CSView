import { hopeTheme } from "vuepress-theme-hope";
import { navBar } from "./navbar/navbar";
import { sideBar } from "./sidebar/sidebar";



export default hopeTheme({

  // 导航栏中Logo的链接，404页面的返回首页链接
  home: '/',

  // logo
  logo: "/logo.png",
  
  // 夜间模式logo
  logoDark:"/logodark.png",

  // 项目仓库
  repo: "https://github.com/zijing2333/CSView",

  // 项目仓库标签
  repoLabel: "GitHub仓库",

  // 编辑此页
  editLink: true,

  // 文档源文件的仓库 URL
  docsRepo:"https://github.com/zijing2333/CSView",

  // 文档源文件的仓库分支
  docsBranch: "main",

  // 文档源文件存放在仓库中的目录名
  docsDir: 'src',

  // lastUpdated
  lastUpdated: true,

  // 域名
  hostname: "https://www.csview.cn",

  // 作者信息
  author: {
    name: "zijing2333",
    email: "944741457@qq.com",
  },

  favicon: '/logo.png',

  // 图标
  iconAssets: "//at.alicdn.com/t/c/font_3888455_9aawfyfr1r6.css",

  // 面包屑导航
  breadcrumb:false,
  
  // 侧边栏
  sidebar:sideBar,

  // 导航栏
  navbar:navBar,

  // 隐藏打印按钮
  print: false,

  // 插件
  plugins: {

    // 评论插件   
    comment: {
      /**
       * Using Waline
       */
      provider: "Waline",
      serverURL: "https://comment-3nup9yoof-zijing2333.vercel.app",
      requiredMeta: ['nick', 'mail'],
      meta: ['nick', 'mail'],
      comment: true,
    },

    mdEnhance: {
      align: true,
      codetabs: true,
      container: true,
      tasklist: true,
      imgLazyload: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
    },
  }   
});
