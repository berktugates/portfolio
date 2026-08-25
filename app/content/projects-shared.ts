import type { ProjectCopy } from "../lib/content/types";

/** Shared product copy used by every non-English locale file. */
export const projectCopies = {
  tr: {
    "celestial-insights": {
      summary: "Kişisel astroloji, günlük farkındalık ve yapay zekâ destekli spiritüel keşif.",
      description:
        "Celestial Insights, doğum verisini derinlemesine kişiselleştirilmiş günlük bir deneyime dönüştüren çapraz platform bir astroloji ve spiritüel rehberlik ürünüdür. Natal harita yorumu, burç yorumları, tarot esintili okumalar, ritüeller, ilişki içgörüleri ve uygulama içi yapay zekâ rehberi Celeste’yi tek bir bütünleşik sistemde bir araya getirir.",
      details: [
        "Mobil istemci React Native ve Expo Router ile kuruludur; TanStack Query sunucu durumunu, Zustand ise yerel ürün durumunu yönetir. Supabase kimlik doğrulama, kalıcılık, okuma geçmişi, kota denetimi, zamanlanmış burç üretimi, bildirimler ve RevenueCat abonelik senkronizasyonunu özel Edge Function’lar üzerinden sağlar.",
        "Ürün ayrıca çok dilli içerik, üretilen okumalar için deterministik yedekler, medya zengin spiritüel araçlar, büyüme analitiği, ödüllü erişim politikaları ve günlük rehberlik için yerel iOS widget’larını içerir.",
      ],
      highlights: [
        "Kişiselleştirilmiş natal haritalar, günlük burçlar, synastry, tarot ve ritüel araçları",
        "Sunucu tarafı politika ve kota kontrolleriyle Gemini destekli Celeste asistanı",
        "Supabase Edge Function’ları, push bildirimleri, abonelikler ve iOS widget’ları",
      ],
      period: "2026",
      imageAlt: "Celestial Insights uygulama ikonu",
    },
    "medula-eczane": {
      summary: "Web ve mobil istemcileri kapsayan çok kiracılı eczane ERP sistemi.",
      description:
        "Medula Eczane, Türkiye’deki eczanelerin operasyonel gerçekliğine göre tasarlanmış çok kiracılı bir eczane ERP’sidir. Ürünler, hastalar, reçeteler, stok, satın alma, iadeler, finans, raporlama ve uçtan uca POS akışlarını web ile mobil istemcilerde birleştirir.",
      details: [
        "Web platformu, UI, OpenAPI ile üretilmiş API erişimi, ortak yardımcılar ve yetki bilincine sahip ürün özelliklerine ayrılmış React 19 ve Vite monoreposudur. TanStack Query uzak durumu, Zustand odaklı istemci durumunu yönetir; React Router uygulama kabuğunu, MUI ise erişilebilir bileşen temelini sağlar.",
        "Expo tabanlı tamamlayıcı uygulama aynı alan modelini iOS ve Android’e taşır: tipli API sözleşmeleri, güvenli kimlik bilgisi saklama, kamera ile barkod/QR tarama, duyarlı operasyon ekranları ve web akışlarını yansıtan özellik modülleri. Her iki istemci de birim, responsive, erişilebilirlik ve uçtan uca test paketleriyle desteklenir.",
      ],
      highlights: [
        "Ürünler, master data, reçeteler, envanter, satın alma, iadeler ve raporlama",
        "Barkod/QR, terminaller, fişler ve iptal ile taslaktan ödemeye POS akışı",
        "Duyarlı web, iOS ve Android istemcileriyle paylaşılan OpenAPI sözleşmeleri",
      ],
      period: "Geliştiriliyor",
      imageAlt: "Medula Eczane uygulama ikonu",
    },
    strumai: {
      summary: "Gerçek zamanlı ses analizi ve yapay zekâ mentoruna sahip gitar çalışma sistemi.",
      description:
        "Strumai, pasif içerik yerine gerçek çalmaya odaklanan çapraz platform bir gitar pratik sistemidir. Mikrofon tabanlı akort, metronom ve tempo çalışması, akorlar ve teori, kulak ve performans araçları, transkripsiyon, pratik serileri, başarımlar ve bağlamsal rehberlik için AI mentor Maestro’yu bir araya getirir.",
      details: [
        "Uygulama pitch detection için Pitchy, ses görselleştirme için Skia, kayıt/oynatma için Expo Audio ve Maestro sohbeti ile ton eşleştirme için Gemini destekli Supabase Edge Function’larıyla Expo ve React Native kullanır. TanStack Query ile Zustand, ürün genelinde uzak ve yerel durum sorumluluklarını ayırır.",
        "Bireysel pratiğin ötesinde Strumai; topluluk profilleri, gönderiler, kayıtlar, bahsetmeler, bildirimler, liderlik tabloları, içerik moderasyonu, RevenueCat abonelikleri, yapılandırılabilir hatırlatıcılar ve yerel pratik-seri widget’larını içerir.",
      ],
      highlights: [
        "Gerçek zamanlı akort, metronom, teori, transkripsiyon, kayıtlar ve performans araçları",
        "Gemini destekli Maestro mentor ve yapay zekâ destekli gitar ton eşleştirme",
        "Topluluk, moderasyon, oyunlaştırma, abonelikler, bildirimler ve widget’lar",
      ],
      period: "2026",
      imageAlt: "Strumai uygulama ikonu",
    },
  },
  de: {
    "celestial-insights": {
      summary: "Persönliche Astrologie, Reflexion und KI-gestützte spirituelle Entdeckung.",
      description:
        "Celestial Insights ist ein plattformübergreifendes Astrologie- und Spirituelles-Guidance-Produkt, das Geburtsdaten in ein tief personalisiertes tägliches Erlebnis verwandelt. Natalchart-Deutung, Horoskope, tarot-inspirierte Readings, Rituale, Beziehungs-Insights und Celeste – der In-App-KI-Guide – fließen in einem kohärenten System zusammen.",
      details: [
        "Der Mobile-Client basiert auf React Native und Expo Router; TanStack Query verwaltet Server-State, Zustand den lokalen Produktzustand. Supabase übernimmt Authentifizierung, Persistenz, Reading-Historie, Quota-Enforcement, geplante Horoskop-Generierung, Benachrichtigungen und RevenueCat-Abo-Synchronisation über dedizierte Edge Functions.",
        "Das Produkt umfasst außerdem mehrsprachige Inhalte, deterministische Fallbacks für generierte Readings, medienreiche spirituelle Tools, Growth-Analytics, rewarded Access Policies und native iOS-Widgets für tägliche Guidance auf einen Blick.",
      ],
      highlights: [
        "Personalisierte Natalcharts, Tageshoroskope, Synastrie, Tarot und Ritual-Tools",
        "Gemini-gestützte Celeste-Assistentin mit serverseitiger Policy und Quota-Kontrolle",
        "Supabase Edge Functions, Push-Benachrichtigungen, Abos und iOS-Widgets",
      ],
      period: "2026",
      imageAlt: "Celestial Insights App-Icon",
    },
    "medula-eczane": {
      summary: "Multi-Tenant-Apotheken-ERP für Web und plattformübergreifendes Mobile.",
      description:
        "Medula Eczane ist ein Multi-Tenant-Apotheken-ERP, das auf die operative Realität türkischer Apotheken ausgelegt ist. Es vereint Produkte, Patienten, Rezepte, Bestand, Einkauf, Retouren, Finanzen, Reporting und vollständige POS-Workflows über Web- und Mobile-Clients.",
      details: [
        "Die Web-Plattform ist ein React-19- und Vite-Monorepo mit Domain-Paketen für UI, OpenAPI-generierten API-Zugriff, Shared Utilities und berechtigungssensible Features. TanStack Query steuert Remote-State, Zustand fokussierten Client-State, React Router die App-Shell und MUI die barrierefreie Komponentenbasis.",
        "Die begleitende Expo-App bringt dasselbe Domänenmodell auf iOS und Android: typisierte API-Verträge, sichere Credential-Speicherung, kamera-basiertes Barcode-/QR-Scanning, responsive Operationsscreens und Feature-Module, die die Web-Workflows spiegeln. Beide Clients werden durch Unit-, Responsive-, Accessibility- und E2E-Tests abgesichert.",
      ],
      highlights: [
        "Produkte, Stammdaten, Rezepte, Inventar, Einkauf, Retouren und Reporting",
        "POS von Entwurf bis Zahlung mit Barcode/QR, Terminals, Belegen und Storno",
        "Geteilte OpenAPI-Verträge mit responsive Web-, iOS- und Android-Clients",
      ],
      period: "In Entwicklung",
      imageAlt: "Medula Eczane App-Icon",
    },
    strumai: {
      summary: "Komplettes Gitarren-Übesystem mit Echtzeit-Audio und KI-Mentor.",
      description:
        "Strumai ist ein plattformübergreifendes Gitarren-Übesystem rund um echtes Spielen statt passiver Inhalte. Es kombiniert mikrofonbasiertes Tuning, Metronom und Tempo-Training, Akkorde und Theorie, Gehör- und Performance-Tools, Transkription, Übe-Serien, Achievements und Maestro – einen KI-Mentor für kontextuelle Guidance.",
      details: [
        "Die App nutzt Expo und React Native mit Pitchy für Pitch Detection, Skia für Audio-Visualisierung, Expo Audio für Aufnahme/Wiedergabe sowie Gemini-gestützte Supabase Edge Functions für Maestro-Chat und Tone Matching. TanStack Query und Zustand trennen Remote- und Local-State über das Produkt.",
        "Neben dem individuellen Üben umfasst Strumai Community-Profile, Posts, Recordings, Mentions, Notifications, Leaderboards, Content-Moderation, RevenueCat-Abos, konfigurierbare Reminder und native Streak-Widgets.",
      ],
      highlights: [
        "Echtzeit-Tuner, Metronom, Theorie, Transkription, Recordings und Performance-Tools",
        "Gemini-gestützter Maestro-Mentor und KI-gestütztes Gitarren-Tone-Matching",
        "Community, Moderation, Gamification, Abos, Notifications und Widgets",
      ],
      period: "2026",
      imageAlt: "Strumai App-Icon",
    },
  },
  fr: {
    "celestial-insights": {
      summary: "Astrologie personnelle, réflexion et exploration spirituelle guidée par l’IA.",
      description:
        "Celestial Insights est un produit d’astrologie et de guidance spirituelle multiplateforme qui transforme les données de naissance en une expérience quotidienne profondément personnalisée. Interprétation du thème natal, horoscopes, lectures inspirées du tarot, rituels, insights relationnels et Celeste — le guide IA in-app — forment un système cohérent.",
      details: [
        "Le client mobile est construit avec React Native et Expo Router ; TanStack Query gère l’état serveur, Zustand l’état produit local. Supabase assure authentification, persistance, historique des lectures, quotas, génération planifiée d’horoscopes, notifications et synchronisation des abonnements RevenueCat via des Edge Functions dédiées.",
        "Le produit inclut aussi du contenu multilingue, des repli déterministes pour les lectures générées, des outils spirituels riches en médias, de l’analytics de croissance, des politiques d’accès récompensé et des widgets iOS natifs pour un guidance quotidien.",
      ],
      highlights: [
        "Thèmes natals, horoscopes quotidiens, synastrie, tarot et outils de rituel",
        "Assistante Celeste propulsée par Gemini avec politique et quotas côté serveur",
        "Edge Functions Supabase, notifications push, abonnements et widgets iOS",
      ],
      period: "2026",
      imageAlt: "Icône de l’app Celestial Insights",
    },
    "medula-eczane": {
      summary: "ERP pharmacie multi-tenant couvrant le web et le mobile multiplateforme.",
      description:
        "Medula Eczane est un ERP pharmacie multi-tenant conçu pour la réalité opérationnelle des pharmacies turques. Il unifie produits, patients, ordonnances, stock, achats, retours, finance, reporting et flux POS complets sur clients web et mobile.",
      details: [
        "La plateforme web est un monorepo React 19 et Vite organisé en packages de domaine pour l’UI, l’accès API généré OpenAPI, les utilitaires partagés et les fonctionnalités sensibles aux permissions. TanStack Query gère l’état distant, Zustand l’état client ciblé, React Router la coque applicative et MUI la base de composants accessibles.",
        "L’application Expo compagnon porte le même modèle de domaine sur iOS et Android : contrats API typés, stockage sécurisé des identifiants, scan code-barres/QR par caméra, écrans opérationnels responsives et modules qui reflètent les flux web. Les deux clients sont couverts par des suites de tests unitaires, responsives, accessibilité et E2E.",
      ],
      highlights: [
        "Produits, données de référence, ordonnances, inventaire, achats, retours et reporting",
        "Flux POS du brouillon au paiement avec code-barres/QR, terminaux, reçus et annulation",
        "Contrats OpenAPI partagés avec clients web, iOS et Android responsives",
      ],
      period: "En développement",
      imageAlt: "Icône de l’app Medula Eczane",
    },
    strumai: {
      summary: "Système complet de pratique guitare avec audio temps réel et mentor IA.",
      description:
        "Strumai est un système de pratique guitare multiplateforme centré sur le jeu réel, pas le contenu passif. Il combine accordeur micro, métronome et tempo, accords et théorie, outils d’oreille et de performance, transcription, séries de pratique, succès et Maestro — un mentor IA pour un guidance contextuel.",
      details: [
        "L’app utilise Expo et React Native avec Pitchy pour la détection de hauteur, Skia pour la visualisation audio, Expo Audio pour l’enregistrement/lecture, et des Edge Functions Supabase basées sur Gemini pour le chat Maestro et le tone matching. TanStack Query et Zustand séparent les responsabilités d’état distant et local.",
        "Au-delà de la pratique individuelle, Strumai inclut profils communautaires, posts, enregistrements, mentions, notifications, classements, modération, abonnements RevenueCat, rappels configurables et widgets natifs de séries de pratique.",
      ],
      highlights: [
        "Accordeur temps réel, métronome, théorie, transcription, enregistrements et performance",
        "Mentor Maestro propulsé par Gemini et tone matching guitare assisté par IA",
        "Communauté, modération, gamification, abonnements, notifications et widgets",
      ],
      period: "2026",
      imageAlt: "Icône de l’app Strumai",
    },
  },
  it: {
    "celestial-insights": {
      summary: "Astrologia personale, riflessione ed esplorazione spirituale guidata dall’IA.",
      description:
        "Celestial Insights è un prodotto di astrologia e guida spirituale multipiattaforma che trasforma i dati di nascita in un’esperienza quotidiana profondamente personalizzata. Interpretazione del tema natale, oroscopi, letture ispirate al tarot, rituali, insight relazionali e Celeste — la guida IA in-app — convivono in un sistema coerente.",
      details: [
        "Il client mobile è costruito con React Native ed Expo Router; TanStack Query gestisce lo stato server, Zustand lo stato prodotto locale. Supabase gestisce autenticazione, persistenza, cronologia letture, quote, generazione programmata di oroscopi, notifiche e sincronizzazione abbonamenti RevenueCat tramite Edge Functions dedicate.",
        "Il prodotto include anche contenuti multilingue, fallback deterministici per le letture generate, strumenti spirituali ricchi di media, analytics di crescita, politiche di accesso rewarded e widget iOS nativi per la guida quotidiana.",
      ],
      highlights: [
        "Temi natali, oroscopi giornalieri, sinastria, tarot e strumenti rituali",
        "Assistente Celeste basato su Gemini con policy e quote lato server",
        "Edge Functions Supabase, push notification, abbonamenti e widget iOS",
      ],
      period: "2026",
      imageAlt: "Icona dell’app Celestial Insights",
    },
    "medula-eczane": {
      summary: "ERP farmacia multi-tenant per web e mobile multipiattaforma.",
      description:
        "Medula Eczane è un ERP farmacia multi-tenant progettato sulla realtà operativa delle farmacie turche. Unifica prodotti, pazienti, ricette, stock, acquisti, resi, finanza, reporting e flussi POS completi su client web e mobile.",
      details: [
        "La piattaforma web è un monorepo React 19 e Vite organizzato in package di dominio per UI, accesso API generato OpenAPI, utility condivise e feature sensibili ai permessi. TanStack Query gestisce lo stato remoto, Zustand lo stato client mirato, React Router lo shell e MUI la base di componenti accessibili.",
        "L’app Expo companion porta lo stesso modello di dominio su iOS e Android: contratti API tipizzati, storage credenziali sicuro, scansione barcode/QR via fotocamera, schermate operative responsive e moduli che rispecchiano i flussi web. Entrambi i client sono coperti da suite di test unitari, responsive, accessibilità ed E2E.",
      ],
      highlights: [
        "Prodotti, master data, ricette, inventario, acquisti, resi e reporting",
        "Flusso POS da bozza a pagamento con barcode/QR, terminali, scontrini e annulli",
        "Contratti OpenAPI condivisi con client web, iOS e Android responsive",
      ],
      period: "In sviluppo",
      imageAlt: "Icona dell’app Medula Eczane",
    },
    strumai: {
      summary: "Sistema completo di pratica chitarra con audio in tempo reale e mentor IA.",
      description:
        "Strumai è un sistema di pratica chitarra multipiattaforma centrato sul suonare davvero, non sul contenuto passivo. Combina accordatore a microfono, metronomo e tempo, accordi e teoria, strumenti di orecchio e performance, trascrizione, serie di pratica, achievement e Maestro — un mentor IA per guida contestuale.",
      details: [
        "L’app usa Expo e React Native con Pitchy per il pitch detection, Skia per la visualizzazione audio, Expo Audio per registrazione/riproduzione ed Edge Functions Supabase basate su Gemini per chat Maestro e tone matching. TanStack Query e Zustand separano stato remoto e locale.",
        "Oltre alla pratica individuale, Strumai include profili community, post, registrazioni, mention, notifiche, classifiche, moderazione, abbonamenti RevenueCat, reminder configurabili e widget nativi di serie pratica.",
      ],
      highlights: [
        "Accordatore realtime, metronomo, teoria, trascrizione, registrazioni e performance",
        "Mentor Maestro basato su Gemini e tone matching chitarra assistito da IA",
        "Community, moderazione, gamification, abbonamenti, notifiche e widget",
      ],
      period: "2026",
      imageAlt: "Icona dell’app Strumai",
    },
  },
  zh: {
    "celestial-insights": {
      summary: "个人占星、日常觉察与 AI 引导的灵性探索。",
      description:
        "Celestial Insights 是一款跨平台占星与灵性指引产品，将出生数据转化为高度个性化的每日体验。本命盘解读、星座运势、塔罗启发式阅读、仪式、关系洞察，以及应用内 AI 向导 Celeste，被整合进同一套连贯系统。",
      details: [
        "移动端基于 React Native 与 Expo Router；TanStack Query 管理服务端状态，Zustand 协调本地产品状态。Supabase 通过专用 Edge Functions 提供认证、持久化、阅读历史、配额控制、定时运势生成、通知以及 RevenueCat 订阅同步。",
        "产品还包含多语言内容、生成阅读的确定性回退、富媒体灵性工具、增长分析、激励访问策略，以及便于一览每日指引的原生 iOS 小组件。",
      ],
      highlights: [
        "个性化本命盘、每日运势、合盘、塔罗与仪式工具",
        "具备服务端策略与配额控制的 Gemini 驱动 Celeste 助手",
        "Supabase Edge Functions、推送通知、订阅与 iOS 小组件",
      ],
      period: "2026",
      imageAlt: "Celestial Insights 应用图标",
    },
    "medula-eczane": {
      summary: "覆盖 Web 与跨平台移动端的多租户药店 ERP。",
      description:
        "Medula Eczane 是面向土耳其药店运营现实设计的多租户药店 ERP。它在 Web 与移动客户端统一产品、患者、处方、库存、采购、退货、财务、报表以及完整收银（POS）流程。",
      details: [
        "Web 平台是 React 19 与 Vite 单体仓库，按领域拆分为 UI、OpenAPI 生成的 API 访问、共享工具与权限感知功能。TanStack Query 管理远程状态，Zustand 处理聚焦的客户端状态，React Router 提供应用壳层，MUI 提供无访问组件基础。",
        "配套 Expo 应用将同一领域模型带到 iOS 与 Android：类型化 API 契约、安全凭证存储、摄像头条码/二维码扫描、响应式运营界面，以及镜像 Web 流程的功能模块。两端均有单元、响应式、无障碍与端到端测试覆盖。",
      ],
      highlights: [
        "产品、主数据、处方、库存、采购、退货与报表",
        "从草稿到支付的 POS 流程，支持条码/二维码、终端、小票与取消",
        "共享 OpenAPI 契约，覆盖响应式 Web、iOS 与 Android 客户端",
      ],
      period: "开发中",
      imageAlt: "Medula Eczane 应用图标",
    },
    strumai: {
      summary: "具备实时音频分析与 AI 导师的完整吉他练习系统。",
      description:
        "Strumai 是围绕真实演奏而非被动内容构建的跨平台吉他练习系统。它结合麦克风调音、节拍器与速度训练、和弦与乐理、听音与演奏工具、转谱、练习连续记录、成就，以及提供情境指导的 AI 导师 Maestro。",
      details: [
        "应用使用 Expo 与 React Native，借助 Pitchy 做音高检测、Skia 做音频可视化、Expo Audio 做录制播放，并通过基于 Gemini 的 Supabase Edge Functions 提供 Maestro 对话与音色匹配。TanStack Query 与 Zustand 在产品中划分远程与本地状态职责。",
        "除个人练习外，Strumai 还包含社区资料、动态、录音、提及、通知、排行榜、内容审核、RevenueCat 订阅、可配置提醒以及原生练习连续记录小组件。",
      ],
      highlights: [
        "实时调音器、节拍器、乐理、转谱、录音与演奏工具",
        "Gemini 驱动的 Maestro 导师与 AI 辅助吉他音色匹配",
        "社区、审核、游戏化、订阅、通知与小组件",
      ],
      period: "2026",
      imageAlt: "Strumai 应用图标",
    },
  },
  ja: {
    "celestial-insights": {
      summary: "パーソナル占星、振り返り、AI ガイドによるスピリチュアル探索。",
      description:
        "Celestial Insights は、出生データを深くパーソナライズされた日々の体験に変えるクロスプラットフォームの占星・スピリチュアルガイダンス製品です。ネイタルチャート解釈、ホロスコープ、タロット着想のリーディング、儀式、関係性インサイト、アプリ内 AI ガイド Celeste を一つの一貫したシステムに統合します。",
      details: [
        "モバイルクライアントは React Native と Expo Router で構築。TanStack Query がサーバー状態を、Zustand がローカル製品状態を担います。Supabase は認証、永続化、リーディング履歴、クォータ、予定ホロスコープ生成、通知、RevenueCat サブスク同期を専用 Edge Functions 経由で提供します。",
        "多言語コンテンツ、生成リーディングの決定論的フォールバック、メディア豊富なスピリチュアルツール、グロース分析、リワードアクセス方針、日々のガイダンス用ネイティブ iOS ウィジェットも含みます。",
      ],
      highlights: [
        "パーソナライズされたネイタルチャート、日次ホロスコープ、シナストリー、タロット、儀式ツール",
        "サーバー側ポリシーとクォータ制御を備えた Gemini 駆動 Celeste アシスタント",
        "Supabase Edge Functions、プッシュ通知、サブスク、iOS ウィジェット",
      ],
      period: "2026",
      imageAlt: "Celestial Insights アプリアイコン",
    },
    "medula-eczane": {
      summary: "Web とクロスプラットフォームモバイルをまたぐマルチテナント薬局 ERP。",
      description:
        "Medula Eczane は、トルコの薬局の運用現実に合わせて設計されたマルチテナント薬局 ERP です。商品、患者、処方箋、在庫、仕入、返品、財務、レポート、完全な POS ワークフローを Web とモバイルクライアントで統合します。",
      details: [
        "Web プラットフォームは React 19 と Vite のモノレポで、UI、OpenAPI 生成 API、共有ユーティリティ、権限対応機能のドメインパッケージに整理されています。TanStack Query がリモート状態、Zustand が焦点のあるクライアント状態、React Router がアプリシェル、MUI がアクセシブルなコンポーネント基盤を担います。",
        "併設の Expo アプリは同じドメインモデルを iOS / Android に展開。型付き API 契約、安全な資格情報保管、カメラによるバーコード/QR スキャン、レスポンシブな運用画面、Web フローを映す機能モジュールを備え、両クライアントは単体・レスポンシブ・アクセシビリティ・E2E テストで支えられます。",
      ],
      highlights: [
        "商品、マスタデータ、処方箋、在庫、仕入、返品、レポート",
        "下書きから決済までの POS（バーコード/QR、端末、レシート、取消）",
        "レスポンシブ Web・iOS・Android 向けの共有 OpenAPI 契約",
      ],
      period: "開発中",
      imageAlt: "Medula Eczane アプリアイコン",
    },
    strumai: {
      summary: "リアルタイム音声と AI メンターを備えたギター練習システム。",
      description:
        "Strumai は受動的コンテンツではなく実際の演奏を中心にしたクロスプラットフォームのギター練習システムです。マイク駆動チューナー、メトロノームとテンポ練習、コードと理論、耳とパフォーマンスツール、トランスクリプション、練習ストリーク、実績、文脈的ガイダンスの AI メンター Maestro を組み合わせます。",
      details: [
        "アプリは Expo と React Native を用い、ピッチ検出に Pitchy、音声可視化に Skia、録音再生に Expo Audio、Maestro チャットとトーンマッチングに Gemini ベースの Supabase Edge Functions を使います。TanStack Query と Zustand がリモート/ローカル状態の責任を分けます。",
        "個人練習に加え、コミュニティプロフィール、投稿、録音、メンション、通知、リーダーボード、モデレーション、RevenueCat サブスク、設定可能なリマインダー、ネイティブ練習ストリークウィジェットを含みます。",
      ],
      highlights: [
        "リアルタイムチューナー、メトロノーム、理論、トランスクリプション、録音、パフォーマンス",
        "Gemini 駆動 Maestro メンターと AI 支援ギタートーンマッチング",
        "コミュニティ、モデレーション、ゲーミフィケーション、サブスク、通知、ウィジェット",
      ],
      period: "2026",
      imageAlt: "Strumai アプリアイコン",
    },
  },
} as const satisfies Record<string, Record<string, ProjectCopy>>;
