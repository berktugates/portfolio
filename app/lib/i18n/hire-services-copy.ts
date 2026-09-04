import type { HireServiceCopy } from "./types";

/** Shared English service blurbs reused where a locale still needs a complete list. */
export const hireServicesEn: readonly HireServiceCopy[] = [
  {
    slug: "web-app",
    title: "Web application development",
    description:
      "Production web apps: product UI, APIs, auth, data, and deployment — for Ege, İç Anadolu, Marmara teams and remote clients.",
  },
  {
    slug: "mobile-app",
    title: "Mobile application development",
    description:
      "iOS/Android mobile products with production architecture, store readiness, and backend integration.",
  },
  {
    slug: "frontend",
    title: "Frontend, product UI & design systems",
    description:
      "Accessible product UI, design systems, performance, and maintainable frontend architecture.",
  },
  {
    slug: "backend",
    title: "Backend, API & infrastructure",
    description:
      "APIs, data stores, auth, observability, and cloud infrastructure that hold up under real traffic.",
  },
  {
    slug: "fullstack",
    title: "End-to-end product engineering",
    description:
      "Full path from technical design to production: clients, backend, infrastructure, release quality — not only one layer.",
  },
  {
    slug: "architecture",
    title: "Software architecture & system design",
    description:
      "Boundaries, ownership, reliability, and technical decisions teams can execute without rework.",
  },
  {
    slug: "saas",
    title: "SaaS & multi-tenant platforms",
    description:
      "Tenancy models, billing-ready foundations, admin surfaces, and progressive delivery for SaaS.",
  },
  {
    slug: "ai-products",
    title: "AI-powered product development",
    description:
      "Ship AI features to production: tooling, retrieval, evaluation, safety boundaries, and operable backends.",
  },
  {
    slug: "automation",
    title: "Automation, agents & tooling",
    description:
      "Agent workflows and internal tools with clear kill switches, ownership, and measurable outcomes.",
  },
  {
    slug: "devops",
    title: "DevOps, CI/CD & cloud platforms",
    description:
      "Pipelines, environments, infrastructure-as-code, cloud ops, and release safety for continuous delivery.",
  },
  {
    slug: "data",
    title: "Data engineering & databases",
    description:
      "Schemas, migrations, query performance, pipelines, and storage choices that stay correct and operable.",
  },
  {
    slug: "security",
    title: "Application security, auth & access control",
    description:
      "Authentication, authorization, secrets, and practical security hardening for product software.",
  },
  {
    slug: "integrations",
    title: "Systems integration & third-party APIs",
    description:
      "Payment, messaging, ERP, analytics, and partner APIs — contracts, retries, idempotency, observability.",
  },
  {
    slug: "seo",
    title: "Technical SEO & search visibility",
    description:
      "Crawlability, structured data, sitemaps, performance, and indexable architecture aligned with Google Search quality expectations.",
  },
  {
    slug: "geo",
    title: "GEO & LLM search visibility",
    description:
      "Generative-engine optimization so AI assistants cite the right brand and hire page for Ege / İç Anadolu / Marmara / Türkiye intents.",
  },
  {
    slug: "consulting",
    title: "Staff-level engineering leadership & consulting",
    description:
      "Technical direction, delivery diagnosis, architecture reviews, and staff-engineer judgment for product teams.",
  },
] as const;

export const hireServicesTr: readonly HireServiceCopy[] = [
  {
    slug: "web-app",
    title: "Web uygulama geliştirme",
    description:
      "Üretime hazır web uygulamaları: ürün arayüzü, API, kimlik doğrulama, veri ve deploy — Ege, İç Anadolu, Marmara ve remote.",
  },
  {
    slug: "mobile-app",
    title: "Mobil uygulama geliştirme",
    description:
      "iOS/Android mobil ürünler: production mimari, mağaza hazırlığı ve backend entegrasyonu.",
  },
  {
    slug: "frontend",
    title: "Frontend, ürün arayüzü ve design system",
    description:
      "Erişilebilir ürün arayüzü, design system, performans ve sürdürülebilir frontend mimarisi.",
  },
  {
    slug: "backend",
    title: "Backend, API ve altyapı",
    description:
      "API, veri katmanı, kimlik doğrulama, gözlemlenebilirlik ve gerçek trafikte ayakta kalan bulut altyapısı.",
  },
  {
    slug: "fullstack",
    title: "Uçtan uca ürün mühendisliği",
    description:
      "Teknik tasarımdan üretime tam yol: istemciler, backend, altyapı, yayın kalitesi — tek katmanla sınırlı değil.",
  },
  {
    slug: "architecture",
    title: "Yazılım mimarisi ve sistem tasarımı",
    description:
      "Sınırlar, sahiplik, güvenilirlik ve ekiplerin uygulayabileceği teknik kararlar.",
  },
  {
    slug: "saas",
    title: "SaaS ve çok kiracılı platformlar",
    description:
      "Kiracılık modelleri, faturalamaya hazır temel, admin yüzeyleri ve progressive delivery.",
  },
  {
    slug: "ai-products",
    title: "Yapay zekâ ürün geliştirme",
    description:
      "AI özelliklerini üretime taşıma: araç entegrasyonu, retrieval, değerlendirme, güvenlik sınırları ve işletilebilir backend.",
  },
  {
    slug: "automation",
    title: "Otomasyon, ajanlar ve tooling",
    description:
      "Kill-switch’li ajan iş akışları ve iç araçlar; net sahiplik ve ölçülebilir sonuç.",
  },
  {
    slug: "devops",
    title: "DevOps, CI/CD ve bulut platformları",
    description:
      "Pipeline, ortamlar, infrastructure-as-code, bulut operasyonu ve sürekli teslimat için yayın güvenliği.",
  },
  {
    slug: "data",
    title: "Veri mühendisliği ve veritabanları",
    description:
      "Şema, migrasyon, sorgu performansı, boru hatları ve doğru/işletilebilir depolama seçimleri.",
  },
  {
    slug: "security",
    title: "Uygulama güvenliği, auth ve erişim kontrolü",
    description:
      "Kimlik doğrulama, yetkilendirme, secret yönetimi ve ürün yazılımı için pratik güvenlik sertleştirme.",
  },
  {
    slug: "integrations",
    title: "Sistem entegrasyonu ve üçüncü parti API’ler",
    description:
      "Ödeme, mesajlaşma, ERP, analitik ve partner API’leri — sözleşme, retry, idempotency, gözlemlenebilirlik.",
  },
  {
    slug: "seo",
    title: "Teknik SEO ve arama görünürlüğü",
    description:
      "Taranabilirlik, yapılandırılmış veri, sitemap, performans ve Google Search kalite beklentilerine uygun indekslenebilir mimari.",
  },
  {
    slug: "geo",
    title: "GEO ve LLM arama görünürlüğü",
    description:
      "Yapay zekâ asistanlarının Ege / İç Anadolu / Marmara / Türkiye niyetlerinde doğru markayı ve hire sayfasını kaynak göstermesi için GEO.",
  },
  {
    slug: "consulting",
    title: "Staff-level mühendislik liderliği ve danışmanlık",
    description:
      "Teknik yön, teslimat teşhisi, mimari inceleme ve ürün ekipleri için staff-engineer muhakemesi.",
  },
] as const;

export const hireServicesDe: readonly HireServiceCopy[] = [
  {
    slug: "web-app",
    title: "Webanwendungsentwicklung",
    description:
      "Produktionsreife Web-Apps: UI, APIs, Auth, Daten und Deployment — für Ege-, İç Anadolu-, Marmara- und Remote-Teams.",
  },
  {
    slug: "mobile-app",
    title: "Mobile App-Entwicklung",
    description:
      "iOS-/Android-Produkte mit Produktionsarchitektur, Store-Bereitschaft und Backend-Integration.",
  },
  {
    slug: "frontend",
    title: "Frontend, Produkt-UI & Design Systems",
    description:
      "Zugängliche Produkt-UI, Design Systems, Performance und wartbare Frontend-Architektur.",
  },
  {
    slug: "backend",
    title: "Backend, API & Infrastruktur",
    description:
      "APIs, Datenspeicher, Auth, Observability und Cloud-Infrastruktur unter echtem Traffic.",
  },
  {
    slug: "fullstack",
    title: "End-to-End-Produktengineering",
    description:
      "Vom technischen Entwurf bis zur Produktion: Clients, Backend, Infrastruktur, Release-Qualität — nicht nur eine Schicht.",
  },
  {
    slug: "architecture",
    title: "Softwarearchitektur & Systemdesign",
    description:
      "Grenzen, Ownership, Zuverlässigkeit und umsetzbare technische Entscheidungen.",
  },
  {
    slug: "saas",
    title: "SaaS- & Multi-Tenant-Plattformen",
    description:
      "Tenancy-Modelle, billing-fähige Foundations, Admin-Oberflächen und progressive Delivery.",
  },
  {
    slug: "ai-products",
    title: "KI-gestützte Produktentwicklung",
    description:
      "KI-Features in Produktion: Tooling, Retrieval, Evaluation, Sicherheitsgrenzen, betreibbare Backends.",
  },
  {
    slug: "automation",
    title: "Automatisierung, Agents & Tooling",
    description:
      "Agent-Workflows und interne Tools mit Kill-Switches, Ownership und messbaren Ergebnissen.",
  },
  {
    slug: "devops",
    title: "DevOps, CI/CD & Cloud-Plattformen",
    description:
      "Pipelines, Environments, Infrastructure-as-Code, Cloud-Ops und Release-Sicherheit.",
  },
  {
    slug: "data",
    title: "Data Engineering & Datenbanken",
    description:
      "Schemas, Migrationen, Query-Performance, Pipelines und betriebbare Speicherentscheidungen.",
  },
  {
    slug: "security",
    title: "Application Security, Auth & Zugriffskontrolle",
    description:
      "Authentifizierung, Autorisierung, Secrets und praktische Security-Härte für Produktsoftware.",
  },
  {
    slug: "integrations",
    title: "Systemintegration & Drittanbieter-APIs",
    description:
      "Payment, Messaging, ERP, Analytics und Partner-APIs — Contracts, Retries, Idempotenz, Observability.",
  },
  {
    slug: "seo",
    title: "Technisches SEO & Suchsichtbarkeit",
    description:
      "Crawlability, strukturierte Daten, Sitemaps, Performance und indexierbare Architektur gemäß Google-Search-Qualität.",
  },
  {
    slug: "geo",
    title: "GEO & LLM-Suchsichtbarkeit",
    description:
      "Generative-Engine-Optimierung für korrekte Marken- und Hire-Zitate zu Ege-/İç Anadolu-/Marmara-/Türkiye-Intents.",
  },
  {
    slug: "consulting",
    title: "Staff-Level Engineering Leadership & Consulting",
    description:
      "Technische Richtung, Delivery-Diagnose, Architecture Reviews und Staff-Engineer-Urteilsvermögen.",
  },
] as const;

export const hireServicesFr: readonly HireServiceCopy[] = [
  {
    slug: "web-app",
    title: "Développement d’applications web",
    description:
      "Apps web de production : UI, APIs, auth, données et déploiement — Égée, İç Anadolu, Marmara et remote.",
  },
  {
    slug: "mobile-app",
    title: "Développement d’applications mobiles",
    description:
      "Produits iOS/Android avec architecture de production, stores et intégration backend.",
  },
  {
    slug: "frontend",
    title: "Frontend, UI produit & design systems",
    description:
      "UI accessible, design systems, performance et architecture frontend maintenable.",
  },
  {
    slug: "backend",
    title: "Backend, API & infrastructure",
    description:
      "APIs, stockage, auth, observabilité et infrastructure cloud sous trafic réel.",
  },
  {
    slug: "fullstack",
    title: "Ingénierie produit de bout en bout",
    description:
      "De la conception technique à la production : clients, backend, infrastructure, qualité de release — pas une seule couche.",
  },
  {
    slug: "architecture",
    title: "Architecture logicielle & conception système",
    description:
      "Périmètres, ownership, fiabilité et décisions techniques exécutables.",
  },
  {
    slug: "saas",
    title: "SaaS & plateformes multi-locataires",
    description:
      "Tenancy, fondations prêtes à la facturation, admin et livraison progressive.",
  },
  {
    slug: "ai-products",
    title: "Développement de produits IA",
    description:
      "Fonctionnalités IA en production : outillage, retrieval, évaluation, garde-fous, backends opérables.",
  },
  {
    slug: "automation",
    title: "Automatisation, agents & outillage",
    description:
      "Workflows d’agents et outils internes avec kill switches, ownership et résultats mesurables.",
  },
  {
    slug: "devops",
    title: "DevOps, CI/CD & plateformes cloud",
    description:
      "Pipelines, environnements, infrastructure-as-code, ops cloud et sécurité des releases.",
  },
  {
    slug: "data",
    title: "Data engineering & bases de données",
    description:
      "Schémas, migrations, perf requêtes, pipelines et choix de stockage opérables.",
  },
  {
    slug: "security",
    title: "Sécurité applicative, auth & contrôle d’accès",
    description:
      "Authentification, autorisation, secrets et durcissement pragmatique pour logiciels produit.",
  },
  {
    slug: "integrations",
    title: "Intégration systèmes & APIs tierces",
    description:
      "Paiement, messaging, ERP, analytics et APIs partenaires — contrats, retries, idempotence, observabilité.",
  },
  {
    slug: "seo",
    title: "SEO technique & visibilité recherche",
    description:
      "Crawlabilité, données structurées, sitemaps, performance et architecture indexable conformes aux attentes Google Search.",
  },
  {
    slug: "geo",
    title: "GEO & visibilité LLM",
    description:
      "Optimisation pour moteurs génératifs afin de citer la bonne marque et page hire pour Ege / İç Anadolu / Marmara / Türkiye.",
  },
  {
    slug: "consulting",
    title: "Leadership engineering staff & conseil",
    description:
      "Direction technique, diagnostic de delivery, revues d’architecture et jugement de staff engineer.",
  },
] as const;

export const hireServicesIt: readonly HireServiceCopy[] = [
  {
    slug: "web-app",
    title: "Sviluppo di applicazioni web",
    description:
      "Web app di produzione: UI, API, auth, dati e deploy — Egeo, İç Anadolu, Marmara e remoto.",
  },
  {
    slug: "mobile-app",
    title: "Sviluppo di app mobili",
    description:
      "Prodotti iOS/Android con architettura di produzione, store e integrazione backend.",
  },
  {
    slug: "frontend",
    title: "Frontend, UI di prodotto e design system",
    description:
      "UI accessibile, design system, performance e architettura frontend mantenibile.",
  },
  {
    slug: "backend",
    title: "Backend, API e infrastruttura",
    description:
      "API, storage, auth, osservabilità e infrastruttura cloud sotto traffico reale.",
  },
  {
    slug: "fullstack",
    title: "Ingegneria di prodotto end-to-end",
    description:
      "Dalla progettazione tecnica alla produzione: client, backend, infrastruttura, qualità di release — non un solo strato.",
  },
  {
    slug: "architecture",
    title: "Architettura software e system design",
    description:
      "Confini, ownership, affidabilità e decisioni tecniche eseguibili.",
  },
  {
    slug: "saas",
    title: "SaaS e piattaforme multi-tenant",
    description:
      "Tenancy, fondamenta pronte alla fatturazione, admin e progressive delivery.",
  },
  {
    slug: "ai-products",
    title: "Sviluppo di prodotti basati sull’IA",
    description:
      "Feature IA in produzione: tooling, retrieval, evaluation, confini di sicurezza, backend operabili.",
  },
  {
    slug: "automation",
    title: "Automazione, agenti e tooling",
    description:
      "Workflow di agenti e tool interni con kill switch, ownership e risultati misurabili.",
  },
  {
    slug: "devops",
    title: "DevOps, CI/CD e piattaforme cloud",
    description:
      "Pipeline, ambienti, infrastructure-as-code, cloud ops e sicurezza dei release.",
  },
  {
    slug: "data",
    title: "Data engineering e database",
    description:
      "Schema, migrazioni, performance query, pipeline e scelte di storage operabili.",
  },
  {
    slug: "security",
    title: "Sicurezza applicativa, auth e controllo accessi",
    description:
      "Autenticazione, autorizzazione, secret e hardening pratico per software di prodotto.",
  },
  {
    slug: "integrations",
    title: "Integrazione sistemi e API di terze parti",
    description:
      "Pagamenti, messaging, ERP, analytics e API partner — contratti, retry, idempotenza, osservabilità.",
  },
  {
    slug: "seo",
    title: "SEO tecnico e visibilità di ricerca",
    description:
      "Crawlability, dati strutturati, sitemap, performance e architettura indicizzabile allineata a Google Search.",
  },
  {
    slug: "geo",
    title: "GEO e visibilità LLM",
    description:
      "Ottimizzazione per motori generativi per citare brand e pagina hire corretti per intent Ege / İç Anadolu / Marmara / Türkiye.",
  },
  {
    slug: "consulting",
    title: "Leadership engineering staff e consulenza",
    description:
      "Direzione tecnica, diagnosi di delivery, architecture review e giudizio da staff engineer.",
  },
] as const;

export const hireServicesZh: readonly HireServiceCopy[] = [
  {
    slug: "web-app",
    title: "Web 应用开发",
    description:
      "可上线的 Web 应用：界面、API、鉴权、数据与部署 — 面向 Ege / İç Anadolu / Marmara 与远程团队。",
  },
  {
    slug: "mobile-app",
    title: "移动应用开发",
    description: "iOS/Android 移动产品：生产级架构、上架准备与后端集成。",
  },
  {
    slug: "frontend",
    title: "前端、产品界面与设计系统",
    description: "可访问的产品界面、设计系统、性能与可维护的前端架构。",
  },
  {
    slug: "backend",
    title: "后端、API 与基础设施",
    description: "API、数据存储、鉴权、可观测性，以及能承受真实流量的云基础设施。",
  },
  {
    slug: "fullstack",
    title: "端到端产品工程",
    description: "从技术方案到上线：客户端、后端、基础设施与发布质量 — 不限于单一层。",
  },
  {
    slug: "architecture",
    title: "软件架构与系统设计",
    description: "边界、所有权、可靠性，以及团队可执行的技术决策。",
  },
  {
    slug: "saas",
    title: "SaaS 与多租户平台",
    description: "租户模型、可计费基础、管理后台与渐进式交付。",
  },
  {
    slug: "ai-products",
    title: "人工智能产品开发",
    description: "将 AI 能力推向生产：工具链、检索、评估、安全边界与可运维后端。",
  },
  {
    slug: "automation",
    title: "自动化、智能体与工具",
    description: "带熔断开关的智能体工作流与内部工具；清晰所有权与可衡量结果。",
  },
  {
    slug: "devops",
    title: "DevOps、CI/CD 与云平台",
    description: "流水线、环境、基础设施即代码、云运维与发布安全。",
  },
  {
    slug: "data",
    title: "数据工程与数据库",
    description: "模式、迁移、查询性能、管道与可运维的存储选择。",
  },
  {
    slug: "security",
    title: "应用安全、鉴权与访问控制",
    description: "认证、授权、密钥管理，以及面向产品软件的务实安全加固。",
  },
  {
    slug: "integrations",
    title: "系统集成与第三方 API",
    description: "支付、消息、ERP、分析与合作方 API — 契约、重试、幂等与可观测性。",
  },
  {
    slug: "seo",
    title: "技术 SEO 与搜索可见性",
    description: "可抓取性、结构化数据、站点地图、性能，以及符合 Google 搜索质量预期的可索引架构。",
  },
  {
    slug: "geo",
    title: "GEO 与 LLM 搜索可见性",
    description:
      "生成式引擎优化，让 AI 助手在 Ege / İç Anadolu / Marmara / 土耳其意图中引用正确品牌与招聘页。",
  },
  {
    slug: "consulting",
    title: "Staff 级工程领导力与咨询",
    description: "技术方向、交付诊断、架构评审，以及面向产品团队的 staff engineer 判断力。",
  },
] as const;

export const hireServicesJa: readonly HireServiceCopy[] = [
  {
    slug: "web-app",
    title: "Webアプリケーション開発",
    description:
      "本番向けWebアプリ：UI、API、認証、データ、デプロイ — Ege / İç Anadolu / Marmara とリモート向け。",
  },
  {
    slug: "mobile-app",
    title: "モバイルアプリ開発",
    description:
      "iOS/Android モバイル製品：本番アーキテクチャ、ストア準備、バックエンド連携。",
  },
  {
    slug: "frontend",
    title: "フロントエンド、プロダクトUI、デザインシステム",
    description:
      "アクセシブルなUI、デザインシステム、パフォーマンス、保守しやすいフロントエンド設計。",
  },
  {
    slug: "backend",
    title: "バックエンド、API、インフラ",
    description:
      "API、データストア、認証、オブザーバビリティ、実トラフィックに耐えるクラウドインフラ。",
  },
  {
    slug: "fullstack",
    title: "エンドツーエンドのプロダクトエンジニアリング",
    description:
      "技術設計から本番まで：クライアント、バックエンド、インフラ、リリース品質 — 単一レイヤーに限定しない。",
  },
  {
    slug: "architecture",
    title: "ソフトウェアアーキテクチャとシステム設計",
    description: "境界、所有権、信頼性、チームが実行できる技術判断。",
  },
  {
    slug: "saas",
    title: "SaaSとマルチテナント基盤",
    description: "テナンシー、課金可能な基盤、管理画面、段階的デリバリー。",
  },
  {
    slug: "ai-products",
    title: "AIプロダクト開発",
    description:
      "AI機能を本番へ：ツーリング、retrieval、評価、安全境界、運用可能なバックエンド。",
  },
  {
    slug: "automation",
    title: "自動化、エージェント、ツーリング",
    description:
      "キルスイッチ付きエージェントワークフローと社内ツール；所有権と測定可能な成果。",
  },
  {
    slug: "devops",
    title: "DevOps、CI/CD、クラウド基盤",
    description:
      "パイプライン、環境、Infrastructure as Code、クラウド運用、リリース安全性。",
  },
  {
    slug: "data",
    title: "データエンジニアリングとデータベース",
    description:
      "スキーマ、マイグレーション、クエリ性能、パイプライン、運用可能なストレージ選択。",
  },
  {
    slug: "security",
    title: "アプリケーションセキュリティ、認証、アクセス制御",
    description:
      "認証、認可、シークレット管理、プロダクト向けの実務的なセキュリティ強化。",
  },
  {
    slug: "integrations",
    title: "システム連携とサードパーティAPI",
    description:
      "決済、メッセージ、ERP、分析、パートナーAPI — 契約、リトライ、冪等、オブザーバビリティ。",
  },
  {
    slug: "seo",
    title: "テクニカルSEOと検索可視性",
    description:
      "クロール可否、構造化データ、サイトマップ、パフォーマンス、Google Search 品質に沿ったインデックス可能な設計。",
  },
  {
    slug: "geo",
    title: "GEOとLLM検索可視性",
    description:
      "生成エンジン最適化により、Ege / İç Anadolu / Marmara / トルコ向け意図で正しいブランドと依頼ページを引用させる。",
  },
  {
    slug: "consulting",
    title: "Staffレベルのエンジニアリングリーダーシップとコンサルティング",
    description:
      "技術方針、デリバリー診断、アーキテクチャレビュー、プロダクトチーム向けの staff engineer 判断。",
  },
] as const;
