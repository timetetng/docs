import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/",
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  title: "菲比BOT",
  description: "A VitePress Site",
  themeConfig: {
    logo: "logo.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "快速上手", link: "/开发文档/快速开始/快速开始.md" },
    ],

    sidebar: [
      {
        text: "使用",
        collapsed: false,
        items: [
          {
            text: "快速开始",
            collapsed: false,
            link: "/开发文档/快速开始/快速开始.md",
          },
          {
            text: "如何部署",
            collapsed: false,
            link: "/开发文档/快速开始/如何部署.md",
          },
        ],
      },
      {
        text: "插件帮助",
        collapsed: true,
        items: [
          {
            text: "快速上手",
            collapsed: true,
            link: "/开发文档/插件帮助/Guide.md",
          },
          {
            text: "经济系统",
            collapsed: true,
            items: [
              {
                text: "签到与金币",
                collapsed: false,
                link: "/开发文档/插件帮助/签到插件.md",
              },
              {
                text: "商店",
                collapsed: false,
                link: "/开发文档/插件帮助/商店系统.md",
              },
              {
                text: "股票 (已禁用)",
                collapsed: false,
                link: "/开发文档/插件帮助/股票插件.md",
              },
              {
                text: "公司 (已禁用)",
                collapsed: false,
                link: "/开发文档/插件帮助/公司插件.md",
              },
              {
                text: "银行 (已禁用)",
                collapsed: false,
                link: "/开发文档/插件帮助/银行系统.md",
              },
              {
                text: "红包 (已禁用)",
                collapsed: false,
                link: "/开发文档/插件帮助/红包插件.md",
              },
              {
                text: "成就 (已禁用)",
                collapsed: false,
                link: "/开发文档/插件帮助/成就系统.md",
              },
            ],
          },
          {
            text: "鸣潮功能",
            collapsed: true,
            items: [
              {
                text: "汇总",
                collapsed: false,
                link: "/开发文档/插件帮助/鸣潮功能汇总.md",
              },
              {
                text: "UID 插件 (XWUID)",
                collapsed: false,
                link: "/开发文档/插件帮助/XWUID.md",
              },
              {
                text: "声骸评分",
                collapsed: false,
                link: "/开发文档/插件帮助/鸣潮声骸评分.md",
              },
              {
                text: "抽卡模拟",
                collapsed: false,
                link: "/开发文档/插件帮助/鸣潮抽卡模拟.md",
              },
            ],
          },
          {
            text: "异环UID (NTEUID)",
            collapsed: false,
            link: "/开发文档/插件帮助/异环UID.md",
          },
          {
            text: "好感度系统",
            collapsed: false,
            link: "/开发文档/插件帮助/好感度系统.md",
          },
          {
            text: "昵称系统",
            collapsed: false,
            link: "/开发文档/插件帮助/昵称系统.md",
          },
          {
            text: "今日运势 (JRYS)",
            collapsed: false,
            link: "/开发文档/插件帮助/今日运势.md",
          },
          {
            text: "小游戏汇总",
            collapsed: false,
            link: "/开发文档/插件帮助/一些小游戏.md",
          },
          {
            text: "娱乐插件汇总",
            collapsed: false,
            link: "/开发文档/插件帮助/娱乐插件.md",
          },
          {
            text: "OSU 插件",
            collapsed: false,
            link: "/开发文档/插件帮助/OSU插件.md",
          },
          {
            text: "其他插件",
            collapsed: false,
            link: "/开发文档/插件帮助/其他插件.md",
          },
        ],
      },
      {
        text: "插件API方法",
        collapsed: true,
        items: [
          {
            text: "概述",
            collapsed: false,
            link: "/开发文档/API文档/创建API共享目录.md",
          },
          {
            text: "获取API实例",
            collapsed: false,
            link: "/开发文档/API文档/获取API实例.md",
          },
          {
            text: "经济系统",
            collapsed: false,
            link: "/开发文档/API文档/经济系统.md",
          },
          {
            text: "商店系统",
            collapsed: false,
            link: "/开发文档/API文档/商店系统.md",
          },
          {
            text: "股票插件",
            collapsed: false,
            link: "/开发文档/API文档/股票插件.md",
          },
          {
            text: "公司系统",
            collapsed: false,
            link: "/开发文档/API文档/公司系统.md",
          },
          {
            text: "好感度系统",
            collapsed: false,
            link: "/开发文档/API文档/好感度系统.md",
          },
          {
            text: "昵称系统",
            collapsed: false,
            link: "/开发文档/API文档/昵称系统.md",
          },
          {
            text: "成就系统",
            collapsed: false,
            link: "/开发文档/API文档/成就系统.md",
          },
          {
            text: "虚拟股票 API (实例已下线)",
            collapsed: false,
            link: "/开发文档/虚拟股票API接口文档",
          },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/timetetng" }],
    footer: {
      copyright: "Copyright© 2025 timetetng",
    },
  },
});
