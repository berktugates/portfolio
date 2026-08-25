import type { ContentUi } from "../lib/content/types";

const ui: ContentUi = {
  back: "戻る",
  blogs: "ブログ",
  blogsIntro:
    "ソフトウェアアーキテクチャ、AIプロダクト、クロスプラットフォームエンジニアリング、信頼性、テクニカルリーダーシップに関する現場ノート。",
  blogsMetaTitle: "ソフトウェアエンジニアリング＆AIブログ",
  blogsMetaDescription:
    "ソフトウェアアーキテクチャ、AIプロダクトエンジニアリング、クロスプラットフォームモバイル開発、信頼性、API、アクセシビリティ、テクニカルリーダーシップに関する長文記事。",
  blogsMetaTitlePaged: "ソフトウェアエンジニアリング＆AIブログ · {{page}}ページ",
  minRead: "{{minutes}}分で読める",
  publishedBy: "{{date}}、Berktug Berke Ates が公開。",
  previous: "前へ",
  next: "次へ",
  paginationAria: "ブログのページネーション",
  productScope: "プロダクト範囲",
  techStack: "技術スタック",
  downloadOnAppStore: "App Store からダウンロード",
  downloadOnAppStoreAria: "{{title}} を App Store からダウンロード",
  subscribe: {
    title: "最新情報を受け取る",
    body: "berktugberke.com に新しい記事が公開されたらメールでお知らせします。任意です—いつでもスキップできます。",
    emailLabel: "メール",
    emailPlaceholder: "you@example.com",
    skip: "スキップ",
    submit: "通知を受け取る",
    submitting: "登録中…",
    footnote: "新しいブログ記事のみ。いつでも配信停止できます。",
    successTitle: "登録完了",
    successBody: "確認メールをチェックしてください。新しい記事は公開時に届きます。",
    dismissAria: "購読ダイアログを閉じる",
  },
};

export default ui;
