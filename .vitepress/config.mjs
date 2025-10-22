import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base:'/',
  head:[["link",{rel:"icon", href:"/logo.png"}]],
  title: "timetetng's docs",
  description: "A VitePress Site",
  themeConfig: {
    logo:"logo.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '快速上手', link: '/开发文档/插件帮助/Guide.md' }
    ],

    sidebar: [
      {
        text: '使用',
        collapsed: false,
        items: [
          { text: '快速开始', 
            collapsed: false,
          items:[
            {text:"快速开始",link: '/开发文档/快速开始/快速开始.md'},
          { text: '获取API实例', link: '/开发文档/快速开始/获取API实例.md' },
          ],  
          link: '/开发文档/快速开始/快速开始.md' },
        ]
      },
{
  text:'插件API方法',
  collapsed: false,
        items: [
          { text: '经济系统',collapsed: false,link: '/开发文档/API文档/经济系统.md' },
          { text: '商店系统',collapsed: false,link: '/开发文档/API文档/商店系统.md' },
          { text: '股票插件',collapsed: false,link: '/开发文档/API文档/股票插件.md' },
          { text: '公司系统',collapsed: false,link: '/开发文档/API文档/公司系统.md' },
          { text: '好感度系统',collapsed: false,link: '/开发文档/API文档/好感度系统.md' },
          { text: '昵称系统',collapsed: false,link: '/开发文档/API文档/昵称系统.md' },
          { text: '成就系统',collapsed: false,link: '/开发文档/API文档/成就系统.md' }
        ]
},
{
  text:'虚拟股票插件',
  collapsed: false,
  items:[
{text:"web API 接口文档",collapsed:false,link:"/开发文档/虚拟股票API接口文档"},
{text:"webk展示",collapsed:false,link:"https://stock.leewater.online/"}
  ],
  link:"/开发文档/虚拟股票API接口文档"
},
{
  text:'插件帮助',
  collapsed: false,
        items: [
          { text: '快速上手',collapsed: false,link: '/开发文档/插件帮助/Guide.md' },
          { text: '经济系统',collapsed: false,link: '/开发文档/插件帮助/签到插件.md' },
          { text: '商店系统',collapsed: false,link: '/开发文档/插件帮助/商店系统.md' },
          { text: '股票插件',collapsed: false,link: '/开发文档/插件帮助/股票插件.md' },
          { text: '公司系统',collapsed: false,link: '/开发文档/插件帮助/公司插件.md' },
          { text: '好感度系统',collapsed: false,link: '/开发文档/插件帮助/好感度系统.md' },
          { text: '昵称系统',collapsed: false,link: '/开发文档/插件帮助/昵称系统.md' },
          { text: '成就系统',collapsed: false,link: '/开发文档/插件帮助/成就系统.md' },
          { text: '银行系统',collapsed: false,link: '/开发文档/插件帮助/银行系统.md' },
        ]
}
    
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/timetetng' }
    ],
    footer:{
      copyright:"Copyright© 2025 timetetng"
    }
  }
})
