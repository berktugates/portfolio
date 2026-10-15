import type { Locale } from "./config";
import type { ContactProjectType } from "../contact-form";

export type ContactPageCopy = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  form: {
    projectTypeLegend: string;
    projectTypeOptional: string;
    projectTypeAria: string;
    projectTypePlaceholder: string;
    projectTypes: Record<ContactProjectType, string> & { unspecified: string };
    nameLabel: string;
    emailLabel: string;
    detailsLabel: string;
    /** Shown beside the label, e.g. min length */
    detailsMinLabel: string;
    submit: string;
    submitting: string;
    submitted: string;
    turnstileWait: string;
    unavailable: string;
    sendingStatus: string;
    successDefault: string;
    sendFailed: string;
  };
  errors: {
    spam: string;
    "project-type": string;
    name: string;
    email: string;
    details: string;
    turnstile: string;
    timing: string;
    default: string;
  };
  api: {
    invalidRequest: string;
    tooLarge: string;
    cooldown: string;
    formUnreadable: string;
    turnstileUnavailable: string;
    turnstileFailed: string;
    serviceUnavailable: string;
    emailUnreachable: string;
    emailFailed: string;
    success: string;
  };
};

const en: ContactPageCopy = {
  metaTitle: "Contact — Berktuğ Berke Ateş",
  metaDescription:
    "Reach Berktuğ Berke Ateş about software projects, collaborations, or product engineering. Full-time, part-time, and project-based engagements.",
  h1: "Contact",
  intro:
    "Share a short brief about your project or collaboration idea. Use a valid reply-to email so a response can reach you.",
  form: {
    projectTypeLegend: "Project type",
    projectTypeOptional: "optional",
    projectTypeAria: "Project type",
    projectTypePlaceholder: "Select project type",
    projectTypes: {
      erp: "ERP",
      crm: "CRM",
      b2b: "B2B platform",
      b2c: "B2C product",
      "saas-mvp": "SaaS / MVP",
      ecommerce: "E-commerce",
      marketplace: "Marketplace",
      "web-platform": "Web platform",
      mobile: "Mobile app",
      "ai-automation": "AI / automation",
      integration: "Integrations / API",
      "data-bi": "Data / BI",
      custom: "Custom software",
      other: "Other",
      unspecified: "Not specified",
    },
    nameLabel: "YOUR NAME",
    emailLabel: "EMAIL",
    detailsLabel: "PROJECT DETAILS",
    detailsMinLabel: "min. 20 characters",
    submit: "Send message",
    submitting: "Sending…",
    submitted: "Sent",
    turnstileWait: "Wait for the security check to finish before sending.",
    unavailable: "The form is temporarily unavailable. Please try again later.",
    sendingStatus: "Sending…",
    successDefault: "Your message was sent successfully.",
    sendFailed: "Could not send the message.",
  },
  errors: {
    spam: "Submission blocked. Refresh the page and try again.",
    "project-type": "Invalid project type.",
    name: "Name must be at least 2 characters.",
    email: "Enter a valid email address.",
    details: "Project details must be at least 20 characters.",
    turnstile: "Complete the security check (Turnstile).",
    timing: "Fill in the fields before sending. If the page was open a long time, refresh and try again.",
    default: "Check the fields and try again.",
  },
  api: {
    invalidRequest: "Invalid request.",
    tooLarge: "Request too large.",
    cooldown: "Wait 10 minutes before sending another message.",
    formUnreadable: "Could not read the form.",
    turnstileUnavailable: "Security verification is temporarily unavailable.",
    turnstileFailed: "Security verification failed. Please try again.",
    serviceUnavailable: "Contact service is temporarily unavailable.",
    emailUnreachable: "Could not reach the email service. Try again later.",
    emailFailed: "Message could not be sent. Try again later.",
    success: "Your message was sent successfully.",
  },
};

const tr: ContactPageCopy = {
  metaTitle: "İletişim — Berktuğ Berke Ateş",
  metaDescription:
    "Yazılım projesi, iş birliği veya ürün geliştirme için Berktuğ Berke Ateş ile iletişime geçin. Tam zamanlı, yarı zamanlı ve proje bazlı çalışmalar.",
  h1: "İletişim",
  intro:
    "Projenizi veya iş birliği fikrinizi kısaca anlatın. Yanıt alabilmeniz için geçerli bir e-posta adresi yazın.",
  form: {
    projectTypeLegend: "Proje türü",
    projectTypeOptional: "opsiyonel",
    projectTypeAria: "Proje türü",
    projectTypePlaceholder: "Proje türü seçin",
    projectTypes: {
      erp: "ERP",
      crm: "CRM",
      b2b: "B2B platform",
      b2c: "B2C ürün",
      "saas-mvp": "SaaS / MVP",
      ecommerce: "E-ticaret",
      marketplace: "Pazaryeri",
      "web-platform": "Web platformu",
      mobile: "Mobil uygulama",
      "ai-automation": "AI / otomasyon",
      integration: "Entegrasyon / API",
      "data-bi": "Veri / BI",
      custom: "Özel yazılım",
      other: "Diğer",
      unspecified: "Belirtilmedi",
    },
    nameLabel: "ADINIZ",
    emailLabel: "E-POSTA",
    detailsLabel: "PROJE DETAYLARI",
    detailsMinLabel: "en az 20 karakter",
    submit: "Mesajı gönder",
    submitting: "Gönderiliyor…",
    submitted: "Gönderildi",
    turnstileWait: "Göndermek için güvenlik doğrulamasının bitmesini bekleyin.",
    unavailable: "Form geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.",
    sendingStatus: "Gönderiliyor…",
    successDefault: "Mesajınız başarıyla gönderildi.",
    sendFailed: "Mesaj gönderilemedi.",
  },
  errors: {
    spam: "Gönderim reddedildi. Sayfayı yenileyip tekrar deneyin.",
    "project-type": "Geçersiz proje türü seçimi.",
    name: "Ad en az 2 karakter olmalı.",
    email: "Geçerli bir e-posta adresi girin.",
    details: "Proje detayları en az 20 karakter olmalı.",
    turnstile: "Güvenlik doğrulamasını tamamlayın (Turnstile kutusu).",
    timing: "Formu göndermeden önce alanları doldurun. Çok uzun süre açık kaldıysa sayfayı yenileyin.",
    default: "Alanları kontrol edip tekrar deneyin.",
  },
  api: {
    invalidRequest: "Geçersiz istek.",
    tooLarge: "İstek çok büyük.",
    cooldown: "Yeni bir mesaj göndermeden önce 10 dakika bekleyin.",
    formUnreadable: "Form okunamadı.",
    turnstileUnavailable: "Güvenlik doğrulaması geçici olarak kullanılamıyor.",
    turnstileFailed: "Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.",
    serviceUnavailable: "İletişim servisi geçici olarak kullanılamıyor.",
    emailUnreachable: "E-posta servisine ulaşılamadı. Lütfen daha sonra tekrar deneyin.",
    emailFailed: "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.",
    success: "Mesajınız başarıyla gönderildi.",
  },
};

const de: ContactPageCopy = {
  metaTitle: "Kontakt — Berktuğ Berke Ateş",
  metaDescription:
    "Kontakt zu Berktuğ Berke Ateş für Softwareprojekte, Zusammenarbeit oder Produktentwicklung. Vollzeit, Teilzeit und projektbasiert.",
  h1: "Kontakt",
  intro:
    "Beschreiben Sie Ihr Projekt oder Ihre Idee kurz. Geben Sie eine gültige E-Mail-Adresse an, damit eine Antwort Sie erreicht.",
  form: {
    projectTypeLegend: "Projekttyp",
    projectTypeOptional: "optional",
    projectTypeAria: "Projekttyp",
    projectTypePlaceholder: "Projekttyp wählen",
    projectTypes: {
      erp: "ERP",
      crm: "CRM",
      b2b: "B2B-Plattform",
      b2c: "B2C-Produkt",
      "saas-mvp": "SaaS / MVP",
      ecommerce: "E-Commerce",
      marketplace: "Marktplatz",
      "web-platform": "Web-Plattform",
      mobile: "Mobile App",
      "ai-automation": "KI / Automatisierung",
      integration: "Integrationen / API",
      "data-bi": "Daten / BI",
      custom: "Individuelle Software",
      other: "Sonstiges",
      unspecified: "Nicht angegeben",
    },
    nameLabel: "IHR NAME",
    emailLabel: "E-MAIL",
    detailsLabel: "PROJEKTDETAILS",
    detailsMinLabel: "mind. 20 Zeichen",
    submit: "Nachricht senden",
    submitting: "Wird gesendet…",
    submitted: "Gesendet",
    turnstileWait: "Bitte warten Sie, bis die Sicherheitsprüfung abgeschlossen ist.",
    unavailable: "Das Formular ist vorübergehend nicht verfügbar. Bitte später erneut versuchen.",
    sendingStatus: "Wird gesendet…",
    successDefault: "Ihre Nachricht wurde erfolgreich gesendet.",
    sendFailed: "Nachricht konnte nicht gesendet werden.",
  },
  errors: {
    spam: "Sendung blockiert. Seite aktualisieren und erneut versuchen.",
    "project-type": "Ungültiger Projekttyp.",
    name: "Name muss mindestens 2 Zeichen haben.",
    email: "Geben Sie eine gültige E-Mail-Adresse ein.",
    details: "Projektdetails müssen mindestens 20 Zeichen haben.",
    turnstile: "Schließen Sie die Sicherheitsprüfung (Turnstile) ab.",
    timing: "Füllen Sie die Felder aus, bevor Sie senden. Bei langer Wartezeit Seite neu laden.",
    default: "Felder prüfen und erneut versuchen.",
  },
  api: {
    invalidRequest: "Ungültige Anfrage.",
    tooLarge: "Anfrage zu groß.",
    cooldown: "Warten Sie 10 Minuten, bevor Sie erneut senden.",
    formUnreadable: "Formular konnte nicht gelesen werden.",
    turnstileUnavailable: "Sicherheitsprüfung vorübergehend nicht verfügbar.",
    turnstileFailed: "Sicherheitsprüfung fehlgeschlagen. Bitte erneut versuchen.",
    serviceUnavailable: "Kontaktdienst vorübergehend nicht verfügbar.",
    emailUnreachable: "E-Mail-Dienst nicht erreichbar. Später erneut versuchen.",
    emailFailed: "Nachricht konnte nicht gesendet werden. Später erneut versuchen.",
    success: "Ihre Nachricht wurde erfolgreich gesendet.",
  },
};

const fr: ContactPageCopy = {
  metaTitle: "Contact — Berktuğ Berke Ateş",
  metaDescription:
    "Contacter Berktuğ Berke Ateş pour un projet logiciel, une collaboration ou du développement produit. Temps plein, temps partiel et missions par projet.",
  h1: "Contact",
  intro:
    "Décrivez brièvement votre projet ou votre idée de collaboration. Indiquez une adresse e-mail valide pour recevoir une réponse.",
  form: {
    projectTypeLegend: "Type de projet",
    projectTypeOptional: "facultatif",
    projectTypeAria: "Type de projet",
    projectTypePlaceholder: "Choisir un type de projet",
    projectTypes: {
      erp: "ERP",
      crm: "CRM",
      b2b: "Plateforme B2B",
      b2c: "Produit B2C",
      "saas-mvp": "SaaS / MVP",
      ecommerce: "E-commerce",
      marketplace: "Place de marché",
      "web-platform": "Plateforme web",
      mobile: "Application mobile",
      "ai-automation": "IA / automatisation",
      integration: "Intégrations / API",
      "data-bi": "Données / BI",
      custom: "Logiciel sur mesure",
      other: "Autre",
      unspecified: "Non précisé",
    },
    nameLabel: "VOTRE NOM",
    emailLabel: "E-MAIL",
    detailsLabel: "DÉTAILS DU PROJET",
    detailsMinLabel: "min. 20 caractères",
    submit: "Envoyer le message",
    submitting: "Envoi…",
    submitted: "Envoyé",
    turnstileWait: "Attendez la fin de la vérification de sécurité avant d’envoyer.",
    unavailable: "Le formulaire est temporairement indisponible. Réessayez plus tard.",
    sendingStatus: "Envoi…",
    successDefault: "Votre message a bien été envoyé.",
    sendFailed: "Impossible d’envoyer le message.",
  },
  errors: {
    spam: "Envoi bloqué. Actualisez la page et réessayez.",
    "project-type": "Type de projet invalide.",
    name: "Le nom doit comporter au moins 2 caractères.",
    email: "Saisissez une adresse e-mail valide.",
    details: "Les détails du projet doivent comporter au moins 20 caractères.",
    turnstile: "Terminez la vérification de sécurité (Turnstile).",
    timing: "Remplissez les champs avant d’envoyer. Si la page est ouverte depuis longtemps, actualisez.",
    default: "Vérifiez les champs et réessayez.",
  },
  api: {
    invalidRequest: "Requête invalide.",
    tooLarge: "Requête trop volumineuse.",
    cooldown: "Attendez 10 minutes avant d’envoyer un autre message.",
    formUnreadable: "Impossible de lire le formulaire.",
    turnstileUnavailable: "Vérification de sécurité temporairement indisponible.",
    turnstileFailed: "Échec de la vérification de sécurité. Réessayez.",
    serviceUnavailable: "Service de contact temporairement indisponible.",
    emailUnreachable: "Service e-mail inaccessible. Réessayez plus tard.",
    emailFailed: "Message non envoyé. Réessayez plus tard.",
    success: "Votre message a bien été envoyé.",
  },
};

const it: ContactPageCopy = {
  metaTitle: "Contatti — Berktuğ Berke Ateş",
  metaDescription:
    "Contatta Berktuğ Berke Ateş per progetti software, collaborazioni o product engineering. Full-time, part-time e lavoro per progetto.",
  h1: "Contatti",
  intro:
    "Descrivi brevemente il progetto o l’idea di collaborazione. Usa un’e-mail valida per poter ricevere risposta.",
  form: {
    projectTypeLegend: "Tipo di progetto",
    projectTypeOptional: "facoltativo",
    projectTypeAria: "Tipo di progetto",
    projectTypePlaceholder: "Seleziona tipo di progetto",
    projectTypes: {
      erp: "ERP",
      crm: "CRM",
      b2b: "Piattaforma B2B",
      b2c: "Prodotto B2C",
      "saas-mvp": "SaaS / MVP",
      ecommerce: "E-commerce",
      marketplace: "Marketplace",
      "web-platform": "Piattaforma web",
      mobile: "App mobile",
      "ai-automation": "AI / automazione",
      integration: "Integrazioni / API",
      "data-bi": "Dati / BI",
      custom: "Software su misura",
      other: "Altro",
      unspecified: "Non specificato",
    },
    nameLabel: "IL TUO NOME",
    emailLabel: "E-MAIL",
    detailsLabel: "DETTAGLI PROGETTO",
    detailsMinLabel: "min. 20 caratteri",
    submit: "Invia messaggio",
    submitting: "Invio…",
    submitted: "Inviato",
    turnstileWait: "Attendi il completamento del controllo di sicurezza prima di inviare.",
    unavailable: "Il modulo è temporaneamente non disponibile. Riprova più tardi.",
    sendingStatus: "Invio…",
    successDefault: "Il messaggio è stato inviato.",
    sendFailed: "Impossibile inviare il messaggio.",
  },
  errors: {
    spam: "Invio bloccato. Aggiorna la pagina e riprova.",
    "project-type": "Tipo di progetto non valido.",
    name: "Il nome deve avere almeno 2 caratteri.",
    email: "Inserisci un indirizzo e-mail valido.",
    details: "I dettagli devono avere almeno 20 caratteri.",
    turnstile: "Completa il controllo di sicurezza (Turnstile).",
    timing: "Compila i campi prima di inviare. Se la pagina è aperta da molto, ricarica.",
    default: "Controlla i campi e riprova.",
  },
  api: {
    invalidRequest: "Richiesta non valida.",
    tooLarge: "Richiesta troppo grande.",
    cooldown: "Attendi 10 minuti prima di inviare un altro messaggio.",
    formUnreadable: "Impossibile leggere il modulo.",
    turnstileUnavailable: "Verifica di sicurezza temporaneamente non disponibile.",
    turnstileFailed: "Verifica di sicurezza non riuscita. Riprova.",
    serviceUnavailable: "Servizio contatti temporaneamente non disponibile.",
    emailUnreachable: "Servizio e-mail non raggiungibile. Riprova più tardi.",
    emailFailed: "Messaggio non inviato. Riprova più tardi.",
    success: "Il messaggio è stato inviato.",
  },
};

const zh: ContactPageCopy = {
  metaTitle: "联系 — Berktuğ Berke Ateş",
  metaDescription:
    "联系 Berktuğ Berke Ateş 讨论软件项目、合作或产品开发。支持全职、兼职与项目制合作。",
  h1: "联系",
  intro: "请简要说明项目或合作想法，并填写可回复的有效邮箱地址。",
  form: {
    projectTypeLegend: "项目类型",
    projectTypeOptional: "选填",
    projectTypeAria: "项目类型",
    projectTypePlaceholder: "选择项目类型",
    projectTypes: {
      erp: "ERP",
      crm: "CRM",
      b2b: "B2B 平台",
      b2c: "B2C 产品",
      "saas-mvp": "SaaS / MVP",
      ecommerce: "电商",
      marketplace: "平台 / 市集",
      "web-platform": "Web 平台",
      mobile: "移动应用",
      "ai-automation": "AI / 自动化",
      integration: "集成 / API",
      "data-bi": "数据 / BI",
      custom: "定制软件",
      other: "其他",
      unspecified: "未选择",
    },
    nameLabel: "姓名",
    emailLabel: "邮箱",
    detailsLabel: "项目详情",
    detailsMinLabel: "至少 20 个字符",
    submit: "发送消息",
    submitting: "发送中…",
    submitted: "已发送",
    turnstileWait: "请等待安全验证完成后再发送。",
    unavailable: "表单暂时不可用，请稍后再试。",
    sendingStatus: "发送中…",
    successDefault: "消息已成功发送。",
    sendFailed: "消息发送失败。",
  },
  errors: {
    spam: "提交被阻止。请刷新页面后重试。",
    "project-type": "项目类型无效。",
    name: "姓名至少 2 个字符。",
    email: "请输入有效的邮箱地址。",
    details: "项目详情至少 20 个字符。",
    turnstile: "请完成安全验证（Turnstile）。",
    timing: "请先填写字段再发送。若页面打开过久，请刷新后重试。",
    default: "请检查字段后重试。",
  },
  api: {
    invalidRequest: "无效请求。",
    tooLarge: "请求过大。",
    cooldown: "请等待 10 分钟后再发送下一条消息。",
    formUnreadable: "无法读取表单。",
    turnstileUnavailable: "安全验证暂时不可用。",
    turnstileFailed: "安全验证失败，请重试。",
    serviceUnavailable: "联系服务暂时不可用。",
    emailUnreachable: "无法连接邮件服务，请稍后再试。",
    emailFailed: "消息未发送，请稍后再试。",
    success: "消息已成功发送。",
  },
};

const ja: ContactPageCopy = {
  metaTitle: "お問い合わせ — Berktuğ Berke Ateş",
  metaDescription:
    "ソフトウェアプロジェクト、協業、プロダクト開発について Berktuğ Berke Ateş に連絡。フルタイム、パートタイム、プロジェクト単位に対応。",
  h1: "お問い合わせ",
  intro:
    "プロジェクトや協業の概要を短く記載してください。返信先として有効なメールアドレスを入力してください。",
  form: {
    projectTypeLegend: "プロジェクト種別",
    projectTypeOptional: "任意",
    projectTypeAria: "プロジェクト種別",
    projectTypePlaceholder: "プロジェクト種別を選択",
    projectTypes: {
      erp: "ERP",
      crm: "CRM",
      b2b: "B2B プラットフォーム",
      b2c: "B2C プロダクト",
      "saas-mvp": "SaaS / MVP",
      ecommerce: "EC / ネット通販",
      marketplace: "マーケットプレイス",
      "web-platform": "Web プラットフォーム",
      mobile: "モバイルアプリ",
      "ai-automation": "AI / 自動化",
      integration: "連携 / API",
      "data-bi": "データ / BI",
      custom: "カスタムソフトウェア",
      other: "その他",
      unspecified: "未選択",
    },
    nameLabel: "お名前",
    emailLabel: "メール",
    detailsLabel: "プロジェクト詳細",
    detailsMinLabel: "20 文字以上",
    submit: "メッセージを送信",
    submitting: "送信中…",
    submitted: "送信済み",
    turnstileWait: "送信前にセキュリティ確認の完了をお待ちください。",
    unavailable: "フォームは一時的に利用できません。後でもう一度お試しください。",
    sendingStatus: "送信中…",
    successDefault: "メッセージを送信しました。",
    sendFailed: "メッセージを送信できませんでした。",
  },
  errors: {
    spam: "送信がブロックされました。ページを更新して再試行してください。",
    "project-type": "プロジェクト種別が無効です。",
    name: "名前は 2 文字以上必要です。",
    email: "有効なメールアドレスを入力してください。",
    details: "プロジェクト詳細は 20 文字以上必要です。",
    turnstile: "セキュリティ確認（Turnstile）を完了してください。",
    timing: "送信前に入力してください。長時間開いていた場合はページを更新してください。",
    default: "入力内容を確認して再試行してください。",
  },
  api: {
    invalidRequest: "無効なリクエストです。",
    tooLarge: "リクエストが大きすぎます。",
    cooldown: "次のメッセージ送信まで 10 分お待ちください。",
    formUnreadable: "フォームを読み取れませんでした。",
    turnstileUnavailable: "セキュリティ確認は一時的に利用できません。",
    turnstileFailed: "セキュリティ確認に失敗しました。再試行してください。",
    serviceUnavailable: "お問い合わせサービスは一時的に利用できません。",
    emailUnreachable: "メールサービスに接続できません。後でもう一度お試しください。",
    emailFailed: "メッセージを送信できませんでした。後でもう一度お試しください。",
    success: "メッセージを送信しました。",
  },
};

const COPY: Record<Locale, ContactPageCopy> = { en, tr, de, fr, it, zh, ja };

export function getContactPageCopy(locale: Locale): ContactPageCopy {
  return COPY[locale] ?? COPY.en;
}
