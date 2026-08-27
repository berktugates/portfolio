import type { ContentUi } from "../lib/content/types";

const ui: ContentUi = {
  back: "返回",
  blogs: "博客",
  blogsIntro:
    "关于软件架构、AI 产品、跨平台工程、可靠性与技术领导力的一线笔记。",
  blogsMetaTitle: "软件工程与 AI 博客",
  blogsMetaDescription:
    "关于软件架构、AI 产品工程、跨平台移动开发、可靠性、API、无障碍与技术领导力的长文。",
  blogsMetaTitlePaged: "软件工程与 AI 博客 · 第 {{page}} 页",
  minRead: "{{minutes}} 分钟阅读",
  publishedBy: "由 Berktug Berke Ates 于 {{date}} 发布。",
  previous: "上一页",
  next: "下一页",
  paginationAria: "博客分页",
  productScope: "产品范围",
  techStack: "技术栈",
  downloadOnAppStore: "在 App Store 中下载",
  downloadOnAppStoreAria: "在 App Store 中下载 {{title}}",
  privacyPolicy: "隐私政策",
  termsOfService: "服务条款",
  legalDocumentsAria: "{{title}} 法律文件",
  appStoreScreenshotsAria: "{{title}} App Store 截图",
  appStoreScreenshotAlt: "{{title}} App Store 截图 {{index}}",
  subscribe: {
    title: "保持关注",
    body: "当 berktugberke.com 发布新文章时收到邮件。可选——随时可跳过。",
    emailLabel: "邮箱",
    emailPlaceholder: "you@example.com",
    skip: "跳过",
    submit: "通知我",
    submitting: "订阅中…",
    footnote: "仅限新博客文章。可随时取消订阅。",
    successTitle: "已加入",
    successBody: "请查收邮箱完成确认。新文章发布后会发到那里。",
    dismissAria: "关闭订阅对话框",
  },
};

export default ui;
