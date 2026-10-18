#!/usr/bin/env python3
"""Locale block tuples for SEO blog posts 5–11 (used with i18n() in blog queue writers)."""


def para(*pairs):
    return [list(p) for p in pairs]


blocks5 = {
    "tr": (
        "PII Biriktirmeden LLM Etkileşimlerini Loglama",
        "Üretim copilot'larını traces olmadan debug edemezsiniz; ama her sohbeti kalıcı veri ambarı yakıtı sayamazsınız. Log tasarımı gizlilik ve maliyet kararıdır.",
        "LLM etkileşim logları için staff kalıpları: redaksiyon katmanları, örnekleme, saklama sınıfları ve uyum incelemesinden geçen observability.",
        [
            "Loglar ücretsiz arşiv değildir",
            "Transkriptleri hassasiyete göre katmanla",
            "Kalite için örnekle, trend için aggregate et",
            "Export'ları güvenlik olayı gibi işlet",
        ],
        para(
            (
                [
                    "Varsayılan olarak tam prompt loglayan ekipler, bunları analitik araçları, destek export'ları ve geniş erişim rolleriyle zamanla sızdırır.",
                    "LLM transkriptlerini kimlik bilgisine yakın veri gibi ele alın: minimize edin, redakte edin, erişimi döndürün ve programlı süre sonunda silin.",
                ],
            ),
            (
                [
                    "Olay debug için sıcak, örneklem eval için ılık, ürün trendleri için soğuk aggregate saklama tanımlayın.",
                    "Pazarlama ambarlarının ham sohbet çekmesine, belgelenmiş hukuki dayanak ve silme job'u olmadan izin vermeyin.",
                ],
            ),
            (
                [
                    "Kalite ekiplerinin tam geçmişe değil, temsili örneklere ihtiyacı var. Sonuç, gecikme ve red türüne göre tabakalı örnekleme kullanın.",
                    "Mümkün olduğunda kullanıcı metni saklamadan token kullanımı ve hata kodlarını aggregate edin.",
                ],
            ),
            (
                [
                    "Toplu export uçları ve notebook indirmeleri, veritabanı dump'larıyla aynı alarmları tetiklemeli.",
                    "İyi loglama, Mart'ta KVKK/GDPR talebi açıklamak zorunda kalmadan Salı günü debug etmenizi sağlar.",
                ],
            ),
        ),
    ),
    "de": (
        "LLM-Interaktionen loggen ohne PII-Hortung",
        "Copilots lassen sich ohne Traces nicht debuggen; jeder Chat darf kein dauerhafter Warehouse-Tank sein.",
        "Staff-Muster für LLM-Logging: Redaktionsstufen, Sampling, Retention-Klassen und Observability für Compliance.",
        [
            "Logs sind kein Gratisarchiv",
            "Transkripte nach Sensibilität stufen",
            "Für Qualität sampeln, für Trends aggregieren",
            "Exporte wie Sicherheitsereignisse behandeln",
        ],
        para(
            (
                [
                    "Teams mit Voll-Prompt-Logging leaken früher oder später über Analytics, Support-Exporte und zu breite Rollen.",
                    "Behandeln Sie Transkripte wie credentials-nahe Daten: minimieren, redigieren, Zugriff rotieren, planmäßig löschen.",
                ],
            ),
            (
                [
                    "Heiße Speicher für Incidents, warme für Eval-Samples, kalte Aggregate für Produkt-Trends.",
                    "Rohe Chats ohne Rechtsgrundlage und Löschjobs nicht ins Marketing-Warehouse.",
                ],
            ),
            (
                [
                    "Qualität braucht repräsentative Stichproben, nicht die komplette Historie. Stratifiziert nach Outcome, Latenz und Refusal.",
                    "Token-Nutzung und Fehlercodes aggregieren, ohne Nutzertext wenn möglich.",
                ],
            ),
            (
                [
                    "Bulk-Exporte und Notebook-Downloads wie DB-Dumps alarmieren.",
                    "Gutes Logging debuggt Dienstag, ohne GDPR-Erklärung im März.",
                ],
            ),
        ),
    ),
    "fr": (
        "Journaliser les interactions LLM sans accumuler de PII",
        "Impossible de déboguer un copilote sans traces; chaque chat ne doit pas alimenter un entrepôt permanent.",
        "Patterns staff : niveaux de rédaction, échantillonnage, classes de rétention et observabilité validée compliance.",
        [
            "Les logs ne sont pas une archive gratuite",
            "Stratifier les transcriptions par sensibilité",
            "Échantillonner pour la qualité, agréger pour les tendances",
            "Traiter les exports comme des événements sécurité",
        ],
        para(
            (
                [
                    "Logger les prompts complets par défaut finit par fuiter via analytics, exports support et rôles trop larges.",
                    "Traitez les transcriptions comme des données proches des identifiants : minimiser, rédiger, faire expirer.",
                ],
            ),
            (
                [
                    "Stockage chaud pour incidents, tiède pour eval échantillonnée, froid pour tendances produit.",
                    "Pas de chats bruts en warehouse marketing sans base légale et job de suppression.",
                ],
            ),
            (
                [
                    "La qualité a besoin d'échantillons représentatifs, pas de l'historique complet. Échantillonnage stratifié par résultat et refus.",
                    "Agréger tokens et codes d'erreur sans texte utilisateur quand c'est possible.",
                ],
            ),
            (
                [
                    "Exports massifs et notebooks : mêmes alertes que les dumps base de données.",
                    "Un bon logging permet de déboguer mardi sans expliquer une demande RGPD en mars.",
                ],
            ),
        ),
    ),
    "it": (
        "Loggare interazioni LLM senza accumulare PII",
        "Senza trace non debugghi i copilot in produzione; ogni chat non può essere carburante permanente del warehouse.",
        "Pattern staff per logging LLM: livelli di redazione, campionamento, classi di retention e observability compliance-ready.",
        [
            "I log non sono archivio gratuito",
            "Stratifica le trascrizioni per sensibilità",
            "Campiona per qualità, aggrega per trend",
            "Gestisci gli export come eventi di sicurezza",
        ],
        para(
            (
                [
                    "Chi logga prompt completi per default finisce per perdere dati via analytics, export support e ruoli troppo ampi.",
                    "Tratta le trascrizioni come dati vicini alle credenziali: minimizza, redigi, ruota accessi, scadenza programmata.",
                ],
            ),
            (
                [
                    "Storage caldo per incident, tiepido per eval campionata, freddo per trend prodotto.",
                    "Niente chat raw nel warehouse marketing senza base legale e job di cancellazione.",
                ],
            ),
            (
                [
                    "La qualità vuole campioni rappresentativi, non tutta la storia. Campionamento stratificato per esito e rifiuto.",
                    "Aggrega token e codici errore senza testo utente quando possibile.",
                ],
            ),
            (
                [
                    "Export bulk e download notebook: stesse alert dei dump database.",
                    "Un buon logging debugga martedì senza spiegare GDPR a marzo.",
                ],
            ),
        ),
    ),
    "zh": (
        "记录 LLM 交互而不囤积 PII",
        "没有追踪无法调试生产 copilot；也不能把每次聊天当永久仓库存料。",
        "LLM 交互日志的 staff 模式：脱敏层级、抽样、保留类别与合规可过的可观测性。",
        ["日志不是免费档案", "按敏感度分层转录", "质量抽样、趋势聚合", "把导出当安全事件运营"],
        para(
            (["默认记录完整 prompt 的团队终会通过分析、支持导出和过宽角色泄露。", "把转录当近凭证数据处理：最小化、脱敏、轮换访问、按期删除。"],),
            (["热存事件调试、温存评测样本、冷存产品趋势聚合。", "营销仓不得无合法依据与删除任务 ingest 原始聊天。"],),
            (["质量团队要代表性样本而非全历史；按结果、延迟与拒绝类型分层抽样。", "尽可能聚合 token 与错误码而不存用户文本。"],),
            (["批量导出与 notebook 下载应像数据库 dump 一样告警。", "好的日志让你周二能排障，三月不必解释 GDPR 请求。"],),
        ),
    ),
    "ja": (
        "PIIを溜め込まずLLM対話をログする",
        "トレースなしでは本番コパイロットをデバッグできない。全チャットを永久ウェアハウス燃料にしてはいけない。",
        "LLM対話ログのスタッフパターン：編集階層、サンプリング、保持クラス、コンプライアンスを通る可観測性。",
        ["ログは無料アーカイブではない", "機密度でトランスクリプトを階層化", "品質はサンプル、トレンドは集計", "エクスポートをセキュリティイベントとして運用"],
        para(
            (["デフォルトで全文プロンプトをログするチームは分析、サポートエクスポート、広いロールから漏らす。", "トランスクリプトをクレデンシャル近傍データとして最小化・編集・期限削除。"],),
            (["インシデントはホット、評価サンプルはウォーム、プロダクトトレンドはコールド集計。", "法的根拠と削除ジョブなしにマーケ倉庫へ生チャットを入れない。"],),
            (["品質は全履歴ではなく代表サンプル。結果・レイテンシ・拒否で層化サンプル。", "可能ならユーザーテキストなしでトークンとエラーコードを集計。"],),
            (["一括エクスポートとノートブックDLはDBダンプと同様にアラート。", "良いログは火曜にデバッグし、3月にGDPR説明を不要にする。"],),
        ),
    ),
}

blocks6 = {
    "tr": (
        "Pazarlama ve Uygulama Rotaları için Performans Bütçeleri",
        "Pazarlama sayfaları ve kimlik doğrulamalı app shell'ler farklı nedenlerle çöker; ortak kural: bütçe yoksa her lansman ağırlık ekler, arama ve dönüşüm sessizce zarar görür.",
        "Staff mühendislerin rota bazlı performans bütçesi, CI bağlantısı ve pazarlama ile ürün yüzeylerini ölçülebilir LCP/INP sınırlarında tutma yöntemi.",
        [
            "Şablonların kendi bütçesi olmalı",
            "Performansı release train ile birlikte gönder",
            "Yavaş ağları kasıtlı test et",
            "Performansı ürüne görünür kıl",
        ],
        para(
            (
                [
                    "Landing sayfaları ilk boyamada yarışır; dashboard'lar etkileşim hazırlığında. Tek global bundle bütçesi hangi ekibin hangi yüzeyi bozduğunu gizler.",
                    "Rota sınıfı ve üçüncü taraf etiket sahipliğine göre bütçe ayırın; pazarlama deneyleri mühendislik varsayılanını miras almasın.",
                ],
            ),
            (
                [
                    "Yoğun trafikli şablonlar için preview deploy'lara bütçe kontrolü ekleyin. LCP'yi patlatan merge'leri sahibi olan açık waiver olmadan bloklayın.",
                    "INP eşiği canary'de aşıldığında bir haftalık şikayetten önce feature flag geri alın.",
                ],
            ),
            (
                [
                    "Hızlı laptop lab testleri yalan söyler. Temsili mobil profil ve önbellek durumlarında smoke perf çalıştırın.",
                    "Hero görsel baytları, font yükleme stratejisi ve hydration maliyetini birinci sınıf metrik sayın.",
                ],
            ),
            (
                [
                    "Ürün yöneticileri dönüşümün yanında perf trendini görmeli, yıllık infra review'da değil.",
                    "Bütçeler, SEO ve UX'in postmortem teması olmasını engeller.",
                ],
            ),
        ),
    ),
    "de": (
        "Performance-Budgets für Marketing- und App-Routen",
        "Marketing und App-Shell scheitern aus anderen Gründen; ohne Budgets wird jeder Launch schwerer, bis Suche und Conversion leiden.",
        "Staff-Muster: Budgets pro Route, CI-Anbindung und messbare LCP/INP-Grenzen für Marketing und Produkt.",
        [
            "Templates brauchen eigene Budgets",
            "Performance mit dem Release-Zug shippen",
            "Langsame Netze gezielt testen",
            "Performance für Produkt sichtbar machen",
        ],
        para(
            (
                [
                    "Landings konkurrieren auf First Paint, Dashboards auf Interaktionsbereitschaft. Ein globales Bundle-Budget versteckt Regressionen.",
                    "Budgets nach Routenklasse und Tag-Ownership splitten.",
                ],
            ),
            (
                [
                    "Budget-Checks an Preview-Deploys für High-Traffic-Templates. LCP-Regressionen ohne Waiver blocken.",
                    "Feature-Flags zurückrollen, wenn INP im Canary die Schwelle überschreitet.",
                ],
            ),
            (
                [
                    "Lab-Tests auf schnellen Laptops lügen. Smoke-Perf auf mobilen Profilen und Cache-Zuständen.",
                    "Hero-Bytes, Font-Strategie und Hydration als First-Class-Metriken.",
                ],
            ),
            (
                [
                    "Product sieht Perf-Trends neben Conversion, nicht nur im Infra-Review.",
                    "Budgets verhindern, dass SEO und UX zum Postmortem-Thema werden.",
                ],
            ),
        ),
    ),
    "fr": (
        "Budgets performance pour routes marketing et app",
        "Les pages marketing et les shells app échouent pour des raisons différentes ; sans budgets, chaque lancement alourdit jusqu'à nuire SEO et conversion.",
        "Budgets par route, CI, et garde-fous LCP/INP mesurables pour surfaces marketing et produit.",
        [
            "Chaque template a son budget",
            "Shipper la perf avec le train de release",
            "Tester délibérément les réseaux lents",
            "Rendre la perf visible au produit",
        ],
        para(
            (
                [
                    "Les landings visent le first paint ; les dashboards la réactivité. Un budget bundle global cache qui a régressé.",
                    "Séparer budgets par classe de route et ownership des tags tiers.",
                ],
            ),
            (
                [
                    "Contrôles budget sur previews des templates à fort trafic. Bloquer merges qui explosent LCP sans waiver nommé.",
                    "Rollback des feature flags quand l'INP dépasse le seuil en canary.",
                ],
            ),
            (
                [
                    "Les tests lab sur laptops rapides mentent. Smoke perf sur profils mobile et états de cache.",
                    "Bytes hero, chargement de fonts et coût d'hydratation en métriques de premier plan.",
                ],
            ),
            (
                [
                    "Le produit voit les tendances perf à côté de la conversion.",
                    "Les budgets évitent que SEO et UX deviennent le thème du postmortem.",
                ],
            ),
        ),
    ),
    "it": (
        "Budget di performance per rotte marketing e app",
        "Marketing e app shell falliscono per motivi diversi; senza budget ogni launch aggiunge peso fino a danneggiare ricerca e conversione.",
        "Budget per rotta, CI e guardrail LCP/INP misurabili per superfici marketing e prodotto.",
        [
            "I template hanno budget propri",
            "Shippare la perf con il release train",
            "Testare deliberatamente reti lente",
            "Rendere la perf visibile al prodotto",
        ],
        para(
            (
                [
                    "Le landing competono sul first paint; le dashboard sulla readiness all'interazione. Un budget bundle globale nasconde le regressioni.",
                    "Separare budget per classe di rotta e ownership dei tag terzi.",
                ],
            ),
            (
                [
                    "Check budget su preview deploy per template ad alto traffico. Bloccare merge che rompono LCP senza waiver con owner.",
                    "Rollback feature flag quando INP supera soglia in canary.",
                ],
            ),
            (
                [
                    "I test lab su laptop veloci mentono. Smoke perf su profili mobile e stati cache.",
                    "Byte hero, font e costo hydration come metriche first-class.",
                ],
            ),
            (
                [
                    "Il prodotto vede trend perf accanto alla conversione.",
                    "I budget evitano che SEO e UX diventino tema del postmortem.",
                ],
            ),
        ),
    ),
    "zh": (
        "营销与应用路由的性能预算",
        "营销页与认证应用壳失败原因不同；无预算则每次发布增重，搜索与转化悄然受损。",
        "按路由设性能预算、接入 CI，并用可测 LCP/INP 护栏约束营销与产品面。",
        ["模板需要独立预算", "与发布列车一起交付性能", "刻意测试慢网络", "让产品看见性能"],
        para(
            (["落地页争首屏，仪表盘争交互就绪；单一全局 bundle 预算掩盖谁回归。", "按路由类型与第三方标签归属拆分预算。"],),
            (["高流量模板预览部署挂预算检查；LCP 爆表 merge 无明确豁免则阻断。", "金丝雀 INP 越阈即回滚 feature flag。"],),
            (["快笔记本实验室测试会撒谎；在代表移动配置与缓存态跑冒烟性能。", "Hero 字节、字体策略与水合成本为一等指标。"],),
            (["产品经理应在转化旁看到性能趋势。", "预算避免 SEO 与 UX 成为复盘主题。"],),
        ),
    ),
    "ja": (
        "マーケティングとアプリルートのパフォーマンス予算",
        "マーケページと認証アプリシェルは別理由で失敗する。予算なしではローンチのたびに重くなり検索とコンバージョンが静かに損なわれる。",
        "ルート別予算、CI連携、測定可能なLCP/INPガードレールでマーケとプロダクト面を守る。",
        ["テンプレートごとに予算", "リリース列車と一緒にperfを出荷", "遅いネットを意図的に試す", "プロダクトにperfを見える化"],
        para(
            (["LPはファーストペイント、ダッシュボードは操作の準備。単一グローバルbundle予算は誰が悪化したか隠す。", "ルートクラスとタグ所有者で予算を分割。"],),
            (["高トラフィックテンプレのプレビューに予算チェック。LCP破壊mergeはオーナー付き免除なしでブロック。", "カナリアでINP閾値超えならフラグをロールバック。"],),
            (["速いノートPCのラボは嘘をつく。代表モバイルプロファイルとキャッシュでスモークperf。", "ヒーロー画像、フォント、ハイドレーションコストを第一級指標に。"],),
            (["PMはコンバージョン横にperfトレンドを見るべき。", "予算はSEO/UXがポストモーテム題材になるのを防ぐ。"],),
        ),
    ),
}

blocks7 = {
    "tr": (
        "Ajans Kopyası Değil, Editöryal Brifing için SEO",
        "Trafik için manşet yeniden yayınlamak, tarayıcıları düşük güvenilir kopya olarak görmeye alıştırır. Analiz, net tarih ve dürüst yapılandırılmış veri ekleyen brifingler aramayla farklı ilişki kurar.",
        "Editöryal brifing siteleri için staff SEO: schema disiplini, alt alan canonical'ları, ölçüm ve ajans kopyası tuzaklarından kaçınan kalite kapıları.",
        [
            "Brifingler yeniden yazım değildir",
            "Yapılandırılmış veri sayfayla uyumlu olmalı",
            "Host ve hreflang dürüst kalır",
            "İçerik yüzeyine göre analitik",
        ],
        para(
            (
                [
                    "Arama sistemleri net yazım, güncelleme tarihi ve özgün sentezi ödüllendirir. Trend sorgularının ince yeniden yazımları crawl bütçesini yakar, marka inşa etmez.",
                    "Editöryal brifingler ne olduklarını açıkça söylemeli: atıflı birincil kaynaklarla analiz, canlı haber telgrafı değil.",
                ],
            ),
            (
                [
                    "NewsArticle işaretlemesi görünen başlık, görsel ve tarihlerle örtüşmeli. Uyumsuzluk, hiç işaretlemeden daha kötüdür.",
                    "Stok görsellerde UI'da lisans metadatası olmalı; sahte foto muhabirliği ipuçları kullanılmamalı.",
                ],
            ),
            (
                [
                    "Haberler ayrı host'ta yaşarken sitemap ve iç linkleme, ilgisiz site graflarına sızmak yerine bu sınırı korumalı.",
                    "Yönlendirme ve canonical etiketleri kullanıcı ve tarayıcıyı doğru yüzeye indirmeli.",
                ],
            ),
            (
                [
                    "Analitikte içerik grubu etiketleyin; ürün, blog ve haber yüzeyleri çift sayım olmadan karşılaştırılabilir olsun.",
                    "Brifing SEO'su uzun oyun: tutarlılık, dürüstlük ve ölçülebilir kalite günlük kopyala-yapıştıyı geçer.",
                ],
            ),
        ),
    ),
    "de": (
        "SEO für redaktionelle Briefings, nicht Agentur-Kopie",
        "Schlagzeilen reposten trainiert Crawler auf Dubletten mit geringem Vertrauen. Briefings mit Analyse, Datum und ehrlichen Structured Data bauen anderes Ranking-Vertrauen.",
        "Staff-SEO für Briefing-Sites: Schema-Disziplin, Canonicals pro Host, Messung und Quality Gates gegen Copy-Paste.",
        [
            "Briefings sind keine Rewrites",
            "Structured Data muss zur Seite passen",
            "Hosts und hreflang bleiben ehrlich",
            "Analytics nach Content-Oberfläche",
        ],
        para(
            (
                [
                    "Suche belohnt klare Autorschaft, Änderungsdatum und eigene Synthese. Dünne Rewrites von Trend-Queries verbrennen Crawl-Budget.",
                    "Briefings deklarieren: Analyse mit zitierten Primärquellen, kein Breaking-Wire.",
                ],
            ),
            (
                [
                    "NewsArticle-Markup muss sichtbare Headlines, Bilder und Daten spiegeln. Mismatch ist schlimmer als kein Markup.",
                    "Stock-Fotos brauchen Lizenz-Hinweis in der UI, keine Fake-Reportage.",
                ],
            ),
            (
                [
                    "Lebt News auf eigenem Host, respektieren Sitemaps und interne Links diese Grenze.",
                    "Redirects und Canonicals führen Nutzer und Crawler zur richtigen Oberfläche.",
                ],
            ),
            (
                [
                    "Analytics nach content_group taggen, damit Produkt, Blog und News vergleichbar bleiben.",
                    "Briefing-SEO ist Langstrecke: Konsistenz und messbare Qualität schlagen tägliches Copy-Paste.",
                ],
            ),
        ),
    ),
    "fr": (
        "SEO pour briefings éditoriaux, pas copie agence",
        "Republier des titres pour le trafic habitue les crawlers à la duplication peu fiable. Analyse, dates claires et données structurées honnêtes changent la relation avec la recherche.",
        "SEO staff pour sites de briefing : discipline schema, canoniques par hôte, mesure et garde-fous qualité.",
        [
            "Les briefings ne sont pas des rewrites",
            "Les données structurées doivent coller à la page",
            "Hôtes et hreflang restent honnêtes",
            "Analytics par surface de contenu",
        ],
        para(
            (
                [
                    "La recherche récompense auteur clair, date de modification et synthèse originale. Les rewrites minces brûlent le budget crawl.",
                    "Les briefings disent ce qu'ils sont : analyse avec sources primaires citées, pas fil de presse.",
                ],
            ),
            (
                [
                    "Le markup NewsArticle doit refléter titres, images et dates visibles. Le mismatch vaut pire que l'absence.",
                    "Photos stock : crédit licence dans l'UI, pas fausse photojournalisme.",
                ],
            ),
            (
                [
                    "News sur hôte dédié : sitemaps et liens internes respectent cette frontière.",
                    "Redirections et canoniques mènent au bon surface.",
                ],
            ),
            (
                [
                    "Taguer content_group pour comparer produit, blog et news sans double comptage.",
                    "SEO briefing = long terme : cohérence et qualité mesurable battent le copier-coller quotidien.",
                ],
            ),
        ),
    ),
    "it": (
        "SEO per briefing editoriali, non copia agenzia",
        "Ripubblicare titoli per traffico addestra i crawler alla duplicazione a bassa fiducia. Briefing con analisi, date chiare e structured data onesti costruiscono altra relazione con la ricerca.",
        "SEO staff per siti briefing: disciplina schema, canonical per host, misura e quality gate anti copy-paste.",
        [
            "I briefing non sono riscritture",
            "I structured data devono combaciare con la pagina",
            "Host e hreflang restano onesti",
            "Analytics per superficie contenuto",
        ],
        para(
            (
                [
                    "La ricerca premia autorship chiara, date di modifica e sintesi originale. Rewrite sottili su query trend bruciano crawl budget.",
                    "I briefing dichiarano cosa sono: analisi con fonti primarie citate, non wire breaking.",
                ],
            ),
            (
                [
                    "Il markup NewsArticle deve riflettere titoli, immagini e date visibili. Il mismatch peggio dell'omissione.",
                    "Stock photo con credito licenza in UI, non finto reportage.",
                ],
            ),
            (
                [
                    "News su host dedicato: sitemap e link interni rispettano il confine.",
                    "Redirect e canonical portano utenti e crawler alla superficie giusta.",
                ],
            ),
            (
                [
                    "Tag content_group in analytics per confrontare prodotto, blog e news senza doppio conteggio.",
                    "SEO briefing è gioco lungo: coerenza e qualità misurabile battono copy-paste quotidiano.",
                ],
            ),
        ),
    ),
    "zh": (
        "面向编辑简报而非通稿复制的 SEO",
        "为流量转载标题会让爬虫把你当低信任重复源。带分析、清晰日期与诚实结构化数据的简报与搜索建立不同关系。",
        "编辑简报站的 staff SEO：schema 纪律、分主机 canonical、度量与避开通稿陷阱的质量门。",
        ["简报不是改写", "结构化数据须与页面一致", "主机与 hreflang 保持诚实", "按内容面分析"],
        para(
            (["搜索奖励清晰作者、修改日期与原创综合；薄改写趋势查询烧 crawl 预算。", "简报应声明自身：引用一手来源的分析，非突发电讯。"],),
            (["NewsArticle 标记须匹配可见标题、图片与日期；不一致比不标记更糟。", "库存图在 UI 标注许可，勿伪装现场摄影。"],),
            (["新闻在独立主机时，站点地图与内链应尊重边界。", "重定向与 canonical 引导用户与爬虫到 intended 面。"],),
            (["按 content_group 打标，产品、博客与新闻可对比且不重复计数。", "简报 SEO 是长跑：一致、诚实与可测质量胜过日复粘贴。"],),
        ),
    ),
    "ja": (
        "通信コピーではなく編集ブリーフィング向けSEO",
        "トラフィック目的の見出し再掲はクローラーを低信頼の複製扱いに慣らす。分析・明確な日付・正直な構造化データのブリーフは検索との関係を変える。",
        "編集ブリーフサイト向けスタッフSEO：スキーマ規律、ホスト別canonical、計測、コピペ回避の品質ゲート。",
        ["ブリーフはリライトではない", "構造化データはページと一致", "ホストとhreflangは正直に", "コンテンツ面別アナリティクス"],
        para(
            (["検索は明確な著者・更新日・独自総合を評価。トレンドの薄いリライトはクロール予算を燃やす。", "ブリーフは一次ソース引用の分析であると明示し、速報ワイヤーではない。"],),
            (["NewsArticleは可視見出し・画像・日付と一致。不一致は未マークより悪い。", "ストック画像はUIでライセンス表示、偽 photojournalism 禁止。"],),
            (["専用ホストのニュースはサイトマップと内部リンクで境界を守る。", "リダイレクトとcanonicalで正しい面に誘導。"],),
            (["content_groupでタグ付けし製品・ブログ・ニュースを二重計上なく比較。", "ブリーフSEOは長期戦：一貫性と測定可能品質が日次コピペに勝つ。"],),
        ),
    ),
}

blocks8 = {
    "tr": (
        "LLM Eval Kapıları CI'da, Slayt Değil",
        "Demo kalitesinde prompt'lar prod trafiğinde çöker. Eval yalnızca notebook'ta yaşarsa her model değişimi ürün piyangosu olur.",
        "CI'da LLM değerlendirme için staff kalıpları: golden veri setleri, regresyon eşikleri, maliyet duyarlı örnekleme ve ürünün güvenebileceği release kapıları.",
        [
            "Eval'ler release altyapısıdır",
            "Golden set'in sahibi olmalı",
            "Online örnekle, offline kilitle",
            "Regresyonları görünür kıl",
        ],
        para(
            (
                [
                    "Yalnızca gözle kontrol eden ekipler hataları destek ticket'larında görür. Eval harness'leri 'iyi görünüyor'u prompt, tool ve locale boyunca karşılaştırılabilir skorlara çevirir.",
                    "Veri setlerini kod gibi versiyonlayın; onaysız golden case düzenlemesi model regresyonunu davranış değişikliğinden ayıramaz.",
                ],
            ),
            (
                [
                    "Gelir veya uyum yollarına bağlı küçük, yüksek sinyalli golden set ile başlayın—pazarlama kopyasından yüzlerce belirsiz prompt değil.",
                    "Her vaka tool şekli, atıf, red davranışı veya sayısal sınır assert etmeli; yalnızca benzerlik skoru yetmez.",
                ],
            ),
            (
                [
                    "CI her PR'da hızlı eval alt kümesi, gece tam suite çalıştırmalı. Pahalı judge modeller zamanlanmış job'larda olmalı, her push'ta değil.",
                    "Prod shadow trafik offline eval'i tamamlar; kapının yerini tutmaz çünkü olay zaten kullanıcıya görünür.",
                ],
            ),
            (
                [
                    "Eval trendlerini gecikme ve maliyetin yanında yayınlayın. Model yükseltmesi kalite skorunu kazanıp token maliyetini ikiye katlarsa ürün tek panoda görmeli.",
                    "Eval kapıları, lansman gecesi kahramanlık olmadan model değiştirme hakkı verir.",
                ],
            ),
        ),
    ),
    "de": (
        "LLM-Eval-Gates in der CI, nicht in Folien",
        "Demo-Prompts scheitern im Produktionsverkehr. Leben Evals nur in Notebooks, wird jeder Modelltausch zur Lotterie.",
        "Staff-Muster für LLM-Eval in CI: Golden Sets, Regressionsschwellen, kostenbewusstes Sampling und Release-Gates.",
        [
            "Evals sind Release-Infrastruktur",
            "Golden Sets brauchen Owner",
            "Online sampeln, offline sperren",
            "Regressionen sichtbar machen",
        ],
        para(
            (
                [
                    "Wer nur visuell prüft, findet Fehler in Support-Tickets. Eval-Harnesses machen aus 'sieht ok' vergleichbare Scores über Prompts, Tools und Locales.",
                    "Datensätze wie Code versionieren; unreviewte Golden-Case-Edits verblenden Modell-Regressionen.",
                ],
            ),
            (
                [
                    "Klein starten: hochsignal Golden Set an Revenue- oder Compliance-Pfaden.",
                    "Jeder Fall assertiert Tool-Form, Zitation, Refusal oder numerische Grenzen—not nur Ähnlichkeit.",
                ],
            ),
            (
                [
                    "CI: schnelle Eval-Teilmenge pro PR, volle Suite nachts. Teure Judge-Modelle in Jobs, nicht jeden Push.",
                    "Shadow-Traffic ergänzt offline Eval, ersetzt Gates nicht.",
                ],
            ),
            (
                [
                    "Eval-Trends neben Latenz und Kosten publizieren. Qualitätsgewinn bei doppelten Token-Kosten muss sichtbar sein.",
                    "Eval-Gates erlauben Modellwechsel ohne Launch-Heldentum.",
                ],
            ),
        ),
    ),
    "fr": (
        "Portes d'eval LLM en CI, pas en slides",
        "Les prompts démo s'effondrent en prod. Si les evals vivent seulement dans des notebooks, chaque swap modèle devient loterie.",
        "Patterns staff : jeux golden, seuils de régression, échantillonnage coût-aware et gates de release fiables.",
        [
            "Les evals sont infra de release",
            "Les golden sets ont un owner",
            "Échantillonner online, verrouiller offline",
            "Rendre les régressions visibles",
        ],
        para(
            (
                [
                    "Les équipes qui eyeballent avant launch découvrent les échecs au support. Les harness transforment 'ça a l'air bien' en scores comparables.",
                    "Versionner les datasets comme le code ; éditer un golden sans review aveugle les régressions.",
                ],
            ),
            (
                [
                    "Commencer petit : golden set à fort signal sur chemins revenue ou compliance.",
                    "Chaque cas assert forme d'outil, citation, refus ou bornes—not seulement similarité.",
                ],
            ),
            (
                [
                    "CI : sous-ensemble rapide à chaque PR, suite complète la nuit. Juges coûteux en jobs planifiés.",
                    "Le shadow prod complète l'eval offline ; ne remplace pas les gates.",
                ],
            ),
            (
                [
                    "Publier tendances eval à côté latence et coût. Un upgrade qualité qui double les tokens doit être visible.",
                    "Les gates eval permettent de changer de modèle sans héroïsme de launch.",
                ],
            ),
        ),
    ),
    "it": (
        "Gate di eval LLM in CI, non slide",
        "I prompt da demo crollano in produzione. Eval solo in notebook rende ogni cambio modello una lotteria.",
        "Pattern staff per eval LLM in CI: golden set, soglie regressione, campionamento cost-aware e gate di release.",
        [
            "Gli eval sono infrastruttura di release",
            "I golden set hanno un owner",
            "Campiona online, blocca offline",
            "Rendi visibili le regressioni",
        ],
        para(
            (
                [
                    "Chi controlla a occhio scopre i fallimenti nei ticket. Gli harness trasformano 'sembra ok' in punteggi comparabili su prompt, tool e locale.",
                    "Versiona i dataset come codice; edit golden senza review offusca regressioni modello.",
                ],
            ),
            (
                [
                    "Parti piccolo: golden ad alto segnale su percorsi revenue o compliance.",
                    "Ogni caso assert forma tool, citazione, rifiuto o bound numerici—not solo similarità.",
                ],
            ),
            (
                [
                    "CI: subset veloce ogni PR, suite piena di notte. Judge costosi in job schedulati.",
                    "Shadow in prod completa eval offline, non sostituisce i gate.",
                ],
            ),
            (
                [
                    "Pubblica trend eval accanto a latenza e costo. Upgrade qualità che raddoppia token deve essere visibile.",
                    "I gate eval permettono cambio modello senza eroi alla launch.",
                ],
            ),
        ),
    ),
    "zh": (
        "CI 中的 LLM 评测门，而非幻灯片",
        "演示级 prompt 扛不住生产流量。评测若只活在 notebook，每次换模型都是产品抽奖。",
        "CI 中 LLM 评测的 staff 模式：黄金集、回归阈值、成本敏感抽样与可信赖发布门。",
        ["评测是发布基础设施", "黄金集需要负责人", "在线抽样、离线门禁", "让回归可见"],
        para(
            (["只肉眼验收的团队在工单里发现失败。评测 harness 把“看起来还行”变成可比分。", "数据集像代码一样版本化；未审 golden 编辑会混淆模型回归与行为变更。"],),
            (["从小而高信号 golden 集起步，绑 revenue 或合规路径。", "每例应断言工具形态、引用、拒绝或数值界，而非仅相似度。"],),
            (["CI 每 PR 跑快评子集，夜间全量；贵 judge 放定时任务。", "生产 shadow 补充离线评测，不能替代门禁。"],),
            (["评测趋势与延迟、成本同屏。质量升而 token 翻倍须在一张盘里可见。", "评测门让你无需 launch 夜英雄式换模型。"],),
        ),
    ),
    "ja": (
        "スライドではなくCIのLLM評価ゲート",
        "デモ品質プロンプトは本番トラフィックで崩れる。評価がノートブックだけならモデル差し替えは宝くじになる。",
        "CIでのLLM評価：ゴールデンセット、回帰閾値、コスト意識サンプリング、信頼できるリリースゲート。",
        ["Evalはリリース基盤", "ゴールデンセットにオーナー", "オンラインでサンプル、オフラインでゲート", "回帰を可視化"],
        para(
            (["目視だけのチームはサポートチケットで失敗に気づく。Harnessは「良さそう」を比較可能スコアに。", "データセットをコード同様バージョン管理；未レビューgolden編集は回帰検知を壊す。"],),
            (["小さく高信号のゴールデンから。収益・コンプライアンス経路に紐づける。", "各ケースはツール形状・引用・拒否・数値境界をassert；類似度だけでは不足。"],),
            (["CIはPRごとに高速サブセット、夜間フル。高コストジャッジはスケジュールジョブ。", "本番シャドウはオフラインevalを補完しゲートの代わりにならない。"],),
            (["evalトレンドをレイテンシ・コスト横に公開。品質向上でトークン2倍なら一枚の盤で見えるべき。", "Evalゲートはローンチ夜のヒーローなしでモデル変更を可能にする。"],),
        ),
    ),
}

blocks9 = {
    "tr": (
        "AI Ürün Olayları için On-Call Runbook'ları",
        "Model yanlış davrandığında HTTP 200 dolu panolar yalan söyler. AI olayları yalnızca restart değil; politika, maliyet ve tool yan etkileri için runbook ister.",
        "LLM ürünleri için staff on-call runbook'ları: 5xx ötesi SLO'lar, sağlayıcı arızaları, retrieval drift, güvenlik eskalasyonu ve prompt değişikliklerini kaydeden postmortem.",
        [
            "200 OK hâlâ olay olabilir",
            "Sağlayıcı brownout'ları yaygın",
            "Güvenlik eskalasyonunun sahibi olsun",
            "Postmortem prompt içerir",
        ],
        para(
            (
                [
                    "Toksik çıktı veya sızan retrieval chunk HTTP 200 ile özür dönebilir. Playbook kullanıcıya görünen zarar, veri sızıntısı ve harcama sıçramasını birinci sınıf sayfa olarak listelemeli.",
                    "Sayfalamayı red doğruluğu, tool başarısı ve retrieval isabet SLO'larına bağlayın.",
                ],
            ),
            (
                [
                    "Model sağlayıcıları brownout yapar: gecikme, kesik context veya sessiz tool schema değişimi. Runbook gateway hatasını sağlayıcı bozulmasından ayırmalı.",
                    "Model route kill switch ve feature flag'leri 03:00'te kim çekebilir belgelenmiş olsun.",
                ],
            ),
            (
                [
                    "Politika ihlali sıçramasında hukuk ve trust-and-safety ortakları tanımlı eskalasyon yoluna ihtiyaç duyar.",
                    "Her içerik şikayetini infra on-call'a yönlendirmeyin; triage tablosu uyku kurtarır.",
                ],
            ),
            (
                [
                    "Post-incident incelemeler prompt, retrieval index ve config diff'ini içermeli—yalnızca deploy SHA değil.",
                    "AI olayları tek seferlik model tuhaflığı sayılırsa tekrarlar.",
                ],
            ),
        ),
    ),
    "de": (
        "On-Call-Runbooks für KI-Produktincidents",
        "Wenn das Modell fehlverhält, lügen Dashboards voller HTTP 200. KI-Incidents brauchen Runbooks für Policy, Kosten und Tool-Nebenwirkungen.",
        "Staff-Runbooks für LLM-Produkte: SLOs jenseits 5xx, Provider-Ausfälle, Retrieval-Drift, Safety-Eskalation und Postmortems mit Prompt-Diffs.",
        [
            "200 OK kann trotzdem Incident sein",
            "Provider-Brownouts sind häufig",
            "Safety-Eskalation braucht Owner",
            "Postmortems enthalten Prompts",
        ],
        para(
            (
                [
                    "Toxische Outputs oder geleakte Retrieval-Chunks können mit HTTP 200 und höflicher Entschuldigung kommen.",
                    "Paging an SLOs für Refusal-Genauigkeit, Tool-Erfolg und Retrieval-Treffer koppeln.",
                ],
            ),
            (
                [
                    "Anbieter brownouten: Latenz, gekürzter Context, stille Tool-Schema-Änderungen. Runbooks trennen Gateway-Bug und Provider-Degradation.",
                    "Kill-Switch für Modell-Routen dokumentieren—wer darf um 3 Uhr ziehen.",
                ],
            ),
            (
                [
                    "Legal und Trust-and-Safety brauchen definierte Eskalation bei Policy-Spikes oder Jailbreak-Wellen.",
                    "Nicht jede Content-Beschwerde an Infra-On-Call; Triage-Tabellen retten Schlaf.",
                ],
            ),
            (
                [
                    "Postmortems diffen Prompts, Retrieval-Index und Config—not nur Deploy-SHAs.",
                    "KI-Incidents wiederholen sich, wenn man sie als Modell-Marotte abtut.",
                ],
            ),
        ),
    ),
    "fr": (
        "Runbooks d'astreinte pour incidents produit IA",
        "Quand le modèle dérape, les tableaux pleins de HTTP 200 mentent. Les incidents IA exigent runbooks policy, coût et effets outils.",
        "Runbooks staff pour produits LLM : SLO au-delà des 5xx, pannes fournisseur, drift retrieval, escalade safety et postmortems avec diffs prompt.",
        [
            "200 OK peut être un incident",
            "Les brownouts fournisseur sont fréquents",
            "Les escalades safety ont un owner",
            "Les postmortems incluent les prompts",
        ],
        para(
            (
                [
                    "Sortie toxique ou chunk retrieval fuité peut arriver en HTTP 200 avec excuses polies.",
                    "Pager sur SLO de refus, succès outil et hit retrieval quand ces métriques existent.",
                ],
            ),
            (
                [
                    "Les vendors brownoutent : latence, contexte tronqué, changements schema outil silencieux.",
                    "Documenter kill switch routes modèle et qui peut agir à 3h.",
                ],
            ),
            (
                [
                    "Legal et trust-and-safety ont besoin d'escalade définie si violations policy explosent.",
                    "Ne pas envoyer chaque plainte contenu à l'infra on-call.",
                ],
            ),
            (
                [
                    "Post-incident : diff prompts, index retrieval, config—not seulement SHA deploy.",
                    "Traiter comme bizarrerie modèle unique fait récidiver.",
                ],
            ),
        ),
    ),
    "it": (
        "Runbook on-call per incidenti prodotto IA",
        "Quando il modello sbaglia, dashboard piene di HTTP 200 mentono. Gli incidenti IA servono runbook su policy, costo ed effetti tool.",
        "Runbook staff per prodotti LLM: SLO oltre 5xx, failure provider, drift retrieval, escalation safety e postmortem con diff prompt.",
        [
            "200 OK può essere incidente",
            "I brownout provider sono comuni",
            "Le escalation safety hanno owner",
            "I postmortem includono i prompt",
        ],
        para(
            (
                [
                    "Output tossico o chunk retrieval trapelato può tornare HTTP 200 con scuse educate.",
                    "Paging su SLO di rifiuto, successo tool e hit retrieval dove esistono.",
                ],
            ),
            (
                [
                    "I vendor brownoutano: latenza, context troncato, cambi schema tool silenziosi.",
                    "Documentare kill switch route modello e chi può agire alle 3.",
                ],
            ),
            (
                [
                    "Legal e trust-and-safety servono escalation definita su picchi policy o jailbreak.",
                    "Non instradare ogni reclamo contenuto all'infra on-call.",
                ],
            ),
            (
                [
                    "Post-incident: diff prompt, indice retrieval, config—not solo SHA deploy.",
                    "Trattarli come stranezza modello una tantum fa ripetere.",
                ],
            ),
        ),
    ),
    "zh": (
        "AI 产品事故的值班手册",
        "模型行为异常时，满屏 HTTP 200 的仪表盘在撒谎。AI 事故需要政策、成本与工具副作用手册，而非仅重启。",
        "LLM 产品 staff 值班手册：5xx 之外的 SLO、供应商故障、检索漂移、安全升级与记录 prompt 变更的复盘。",
        ["200 OK 仍可能是事故", "供应商降载很常见", "安全升级需负责人", "复盘包含 prompt"],
        para(
            (["有毒输出或泄露检索块可能 HTTP 200 加礼貌道歉返回。", "在拒绝准确率、工具成功、检索命中等 SLO 上分页。"],),
            (["厂商 brownout：延迟、截断上下文、静默工具 schema 变更。", "文档化模型路由 kill switch 与凌晨谁可拉。"],),
            (["政策违规激增或越狱传播时，法务与 trust-and-safety 需明确升级路径。", "勿把每条内容投诉都转 infra 值班。"],),
            (["复盘应 diff prompt、检索索引与配置，而非仅部署 SHA。", "若当一次性模型怪癖，AI 事故会复发。"],),
        ),
    ),
    "ja": (
        "AIプロダクトインシデント向けオンコール手順書",
        "モデルが誤動作するとHTTP 200だらけのダッシュボードは嘘をつく。AIインシデントは再起動だけでなく政策・コスト・ツール副作用の手順書が要る。",
        "LLMプロダクト向けスタッフ手順書：5xx超のSLO、プロバイダ障害、取得ドリフト、安全エスカレーション、プロンプトdiff付きポストモーテム。",
        ["200 OKでもインシデント", "プロバイダブラウンアウトは日常", "安全エスカレーションにオーナー", "ポストモーテムにプロンプト"],
        para(
            (["有害出力や取得チャンク漏洩はHTTP 200と丁寧な謝罪で返ることがある。", "拒否精度・ツール成功・取得ヒットのSLOでページング。"],),
            (["ベンダーはレイテンシ上昇、コンテキスト切り詰め、静かなツールスキーマ変更を起こす。", "モデルルートkill switchと深夜誰が引けるか文書化。"],),
            (["ポリシー違反急増やジェイルブレイク拡散時、法務とtrust-and-safetyに定義済みエスカレーション。", "全コンテンツ苦情をinfraオンコールへ送らない。"],),
            (["事後レビューはプロンプト・取得インデックス・設定をdiff—デプロイSHAだけでない。", "一度きりのモデル奇癖扱いは再発を招く。"],),
        ),
    ),
}

blocks10 = {
    "tr": (
        "Ajan Tool Yan Etkileri için Idempotency Anahtarları",
        "Modeller takılınca, gateway timeout olunca veya kullanıcı çift gönderince ajanlar retry yapar. Idempotency yoksa masum retry iki kez ücretlendirir, iki mail atar veya çift satır yazar.",
        "Idempotent ajan tool çağrıları için staff kalıpları: anahtar tasarımı, dedupe store, onay sırası ve kullanıcı retry'sini runaway döngüden ayıran observability.",
        [
            "Retry varsayılan, edge case değil",
            "Anahtarlar ürün eylemine ait",
            "Kalıcı yan etkiden sonra ack",
            "Çift replay'i ölç",
        ],
        para(
            (
                [
                    "Streaming ve tool-calling yığınları agresif retry yapar: istemci yeniden bağlanır, worker at-least-once teslim eder, planner kısmi hatadan sonra tool'u yeniden çağırır.",
                    "Ödeme, ticket, CRM güncellemesi gibi her dış yan etkiyi, idempotency hikâyesi code review'da açık olana kadar güvensiz sayın.",
                ],
            ),
            (
                [
                    "Anahtarları kararlı kullanıcı niyetinden türetin: konuşma id + turn sırası veya gönder ile gelen istemci UUID'si.",
                    "Model aynı mesajı yeniden ifade edince anahtarı döndürmeyin; ham token yerine normalize niyeti hash'leyin.",
                ],
            ),
            (
                [
                    "Mümkünse idempotency kaydını yan etkiyle aynı transaction'da tutun. Replay'de önceki sonucu duplicate bayrağıyla döndürün.",
                    "Kısmi hata zor durum: faturalama başarılı model başarısızsa retry çift ücret olmamalı—sağlayıcı id ile reconcile edin.",
                ],
            ),
            (
                [
                    "Tool ve tenant bazında replay oranını pano yapın. Sıçramalar çoğu zaman retry policy bug'ıdır.",
                    "Idempotency, ajanların finansı gece uyandırmadan fail-recover etme hakkını kazanma yoludur.",
                ],
            ),
        ),
    ),
    "de": (
        "Idempotenz-Schlüssel für Agent-Tool-Nebenwirkungen",
        "Agenten retrien bei Stall, Gateway-Timeout oder Doppel-Tap. Ohne Idempotenz lädt ein harmloser Retry doppelt ab oder schreibt doppelt.",
        "Staff-Muster für idempotente Agent-Tools: Key-Design, Dedupe-Stores, Ack-Reihenfolge und Observability für Retries vs. Loops.",
        [
            "Retries sind der Default",
            "Keys gehören zu Produktaktionen",
            "Ack erst nach durable Side Effects",
            "Duplicate Replays messen",
        ],
        para(
            (
                [
                    "Streaming- und Tool-Stacks retrien aggressiv: Reconnects, at-least-once, Planner ruft Tools nach Partial Failure erneut.",
                    "Jede externe Side Effect ist unsicher, bis Idempotenz im Code-Review explizit ist.",
                ],
            ),
            (
                [
                    "Keys aus stabiler Nutzerintention: Conversation-ID plus Turn oder Client-UUID beim Send.",
                    "Keys nicht rotieren, wenn das Modell umformuliert—normalisierte Intent-Hashes statt Rohtokens.",
                ],
            ),
            (
                [
                    "Idempotency-Record wenn möglich in derselben Transaktion wie Side Effect. Bei Replay vorheriges Ergebnis mit Duplicate-Flag.",
                    "Partial Failure: Billing ok, Modell fail—Retry darf nicht doppelt belasten.",
                ],
            ),
            (
                [
                    "Replay-Rate pro Tool und Tenant dashboarden. Spikes deuten oft auf Retry-Policy-Bugs.",
                    "Idempotenz erlaubt Fail-Recover ohne Finance-Paging um Mitternacht.",
                ],
            ),
        ),
    ),
    "fr": (
        "Clés d'idempotence pour effets de bord d'outils agent",
        "Les agents retentent sur stall, timeout gateway ou double envoi. Sans idempotence, un retry facture deux fois ou écrit en double.",
        "Patterns staff : design de clés, stores dedupe, ordre d'ack et observabilité retries vs boucles.",
        [
            "Les retries sont la norme",
            "Les clés appartiennent à l'action produit",
            "Ack après effets durables",
            "Mesurer les replays dupliqués",
        ],
        para(
            (
                [
                    "Stacks streaming et tools retentent fort : reconnect client, at-least-once, planner ré-invoque après échec partiel.",
                    "Tout effet externe est unsafe tant que l'idempotence n'est pas explicite en review.",
                ],
            ),
            (
                [
                    "Clés depuis intention stable : id conversation + tour ou UUID client à l'envoi.",
                    "Ne pas faire tourner les clés si le modèle reformule—hasher l'intent normalisé.",
                ],
            ),
            (
                [
                    "Enregistrement idempotence dans la même transaction que l'effet si possible. Replay renvoie résultat prior avec flag duplicate.",
                    "Échec partiel : billing ok, modèle fail—retry ne doit pas double facturer.",
                ],
            ),
            (
                [
                    "Dashboard taux replay par outil et tenant. Pics = souvent bug de politique retry.",
                    "L'idempotence permet fail-recover sans réveiller la finance.",
                ],
            ),
        ),
    ),
    "it": (
        "Chiavi di idempotenza per effetti collaterali tool agente",
        "Gli agenti ritentano su stall, timeout gateway o doppio invio. Senza idempotenza un retry innocuo addebita o scrive due volte.",
        "Pattern staff per tool agent idempotenti: design chiavi, dedupe store, ordine ack e observability retry vs loop.",
        [
            "I retry sono il default",
            "Le chiavi appartengono all'azione prodotto",
            "Ack solo dopo effetti duraturi",
            "Misurare replay duplicati",
        ],
        para(
            (
                [
                    "Stack streaming e tool ritentano aggressivamente: reconnect, at-least-once, planner richiama tool dopo fallimento parziale.",
                    "Ogni side effect esterno è unsafe finché l'idempotenza non è esplicita in review.",
                ],
            ),
            (
                [
                    "Chiavi da intent stabile: id conversazione + turno o UUID client all'invio.",
                    "Non ruotare chiavi se il modello riformula—hash intent normalizzato.",
                ],
            ),
            (
                [
                    "Record idempotenza nella stessa transazione dell'effetto se possibile. Replay restituisce risultato precedente con flag duplicate.",
                    "Fallimento parziale: billing ok, modello fail—retry non deve addebitare due volte.",
                ],
            ),
            (
                [
                    "Dashboard replay rate per tool e tenant. Picchi spesso = bug policy retry.",
                    "Idempotenza permette fail-recover senza svegliare finance a mezzanotte.",
                ],
            ),
        ),
    ),
    "zh": (
        "智能体工具副作用的幂等键",
        "模型卡住、网关超时或用户连点时 agent 会重试。无幂等则无害重试也会双扣费、双发信或双写行。",
        "幂等 agent 工具调用的 staff 模式：键设计、去重存储、确认顺序与区分用户重试与失控循环的可观测性。",
        ["重试是默认而非边缘", "键属于产品动作", "持久副作用后再 ack", "度量重复 replay"],
        para(
            (["流式与 tool 栈积极重试：客户端重连、至少一次投递、规划器部分失败后再次调用工具。", "支付、工单、CRM 等外部副作用在 code review 明确幂等前视为不安全。"],),
            (["从稳定用户意图派生键：会话 id + 轮次或发送时客户端 UUID。", "模型改写同一消息时不要轮换键；对归一化意图哈希而非原始 token。"],),
            (["可能时将幂等记录与副作用同事务。replay 返回先前结果并标 duplicate。", "部分失败：计费成功模型失败—重试不得双扣，用供应商 id 对账。"],),
            (["按工具与租户 dashboard replay 率。尖峰常是重试策略 bug。", "幂等让 agent 可在半夜不吵醒财务的情况下失败恢复。"],),
        ),
    ),
    "ja": (
        "エージェントツール副作用の冪等キー",
        "モデル停滞、ゲートウェイタイムアウト、二重送信でエージェントはリトライする。冪等性なしでは二重課金・二重メール・二重行が起きる。",
        "冪等エージェントツール呼び出し：キー設計、dedupeストア、ack順序、ユーザーリトライと暴走ループを分ける可観測性。",
        ["リトライがデフォルト", "キーはプロダクトアクションに属する", "永続副作用の後にack", "重複replayを計測"],
        para(
            (["ストリーミングとtoolスタックは積極リトライ：再接続、at-least-once、部分失敗後の再呼び出し。", "課金・チケット・CRMなど外部副作用はreviewで冪等が明示されるまでunsafe。"],),
            (["安定したユーザー意図からキー：会話id+ターンまたは送信時クライアントUUID。", "モデルが言い換えてもキーを回転させない—生トークンではなく正規化意図をハッシュ。"],),
            (["可能なら冪等レコードを副作用と同一トランザクション。replayはduplicateフラグ付きで前結果。", "部分失敗：課金成功・モデル失敗—リトライで二重課金不可、プロバイダidで照合。"],),
            (["ツール・テナント別replay率をダッシュボード。スパイクは多くリトライポリシーバグ。", "冪等性は深夜financeを起こさずfail-recoverする資格。"],),
        ),
    ),
}

blocks11 = {
    "tr": (
        "LLM Gateway'ler için Sentetik Probeler",
        "Model sağlayıcı status sayfası yeşilken copilot'unuz hâlâ bozuk route kuralında takılı olabilir. Sentetik probeler kullanıcıya görünen LLM yollarını ölçülebilir SLO'ya çevirir.",
        "LLM gateway sentetik izleme tasarımı: gerçekçi prompt'lar, streaming tamamlama kontrolleri, bölgesel probeler ve ürünün güvendiği alarm yönlendirme.",
        [
            "curl değil kullanıcı gibi probe",
            "Vendor ile gateway sinyalini ayır",
            "Gecikme SLO'sunda bölge önemli",
            "Ticket kuyruğundan önce uyar",
        ],
        para(
            (
                [
                    "`/health` vuran kontroller kullanıcının hissettiği hataları kaçırır: boş retrieval, kırık tool schema veya ilk tokenden sonra takılan stream.",
                    "Sentetik yolculuk kimlik doğrulamalı, minimal golden prompt çalıştırmalı ve bütçe içinde stream sonu işaretlerini assert etmeli.",
                ],
            ),
            (
                [
                    "Probe sonuçlarını sağlayıcı, model id ve route sürümü ile etiketleyin. Gecikme regresyonunda prompt şişmesi mi vendor brownout mu ayırın.",
                    "Probe'ların prod analitiğini kirletmemesi için sabit kotolu canary tenant tutun.",
                ],
            ),
            (
                [
                    "Kullanıcı tabanınıza uyan bölgelerden probe çalıştırın. Sağlıklı us-east gateway, uzak bölgeye yönlendirilen Avrupa kullanıcıları için INP'yi ihlal edebilir.",
                    "Probe TTFT'yi aynı etiketlerle gerçek RUM ile karşılaştırın—büyük fark örnekleme veya routing bug'ıdır.",
                ],
            ),
            (
                [
                    "Copilot gelir kritikse probe hatalarını ödeme kesintisiyle aynı on-call rotasına yönlendirin.",
                    "Sentetik izleme, sessiz model kesintisini retro'da açıklamaktan ucuzdur.",
                ],
            ),
        ),
    ),
    "de": (
        "Synthetische Probes für LLM-Gateways",
        "Vendor-Status kann grün sein, während der Copilot an einer kaputten Route scheitert. Synthetische Probes machen nutzersichtbare LLM-Pfade zu SLOs.",
        "Staff-Design für synthetisches Monitoring: realistische Prompts, Streaming-Completion-Checks, regionale Probes und Alert-Routing.",
        [
            "Proben wie ein Nutzer, nicht wie curl",
            "Vendor- vs Gateway-Signale trennen",
            "Region zählt für Latenz-SLOs",
            "Alarm vor der Ticket-Warteschlange",
        ],
        para(
            (
                [
                    "Checks auf `/health` verpassen leere Retrieval, kaputtes Tool-Schema oder Streams, die nach dem ersten Token hängen.",
                    "Synthetische Journeys authentifizieren, goldenen Minimal-Prompt fahren und End-of-Stream innerhalb Budget asserten.",
                ],
            ),
            (
                [
                    "Ergebnisse mit Provider, Modell-ID und Route-Version taggen. Latenz-Regression: Prompt-Bloat oder Vendor-Brownout?",
                    "Canary-Tenant mit festen Quotas, damit Probes Analytics nicht vergiften.",
                ],
            ),
            (
                [
                    "Probes aus Regionen, die zur Nutzerbasis passen. Gesundes us-east kann INP für Europa verletzen.",
                    "Probe-TTFT mit RUM unter gleichen Labels vergleichen—große Lücken = Sampling- oder Routing-Bug.",
                ],
            ),
            (
                [
                    "Bei revenue-kritischem Copilot Probe-Failures an dieselbe On-Call-Rotation wie Payment.",
                    "Synthetisches Monitoring ist billiger als stille Model-Ausfälle im Retro zu erklären.",
                ],
            ),
        ),
    ),
    "fr": (
        "Sondes synthétiques pour passerelles LLM",
        "La page statut fournisseur peut être verte pendant que le copilote échoue sur une mauvaise règle de route. Les sondes rendent les chemins LLM visibles mesurables en SLO.",
        "Design staff : prompts réalistes, checks fin de stream, sondes régionales et routage d'alerte de confiance.",
        [
            "Sonder comme un utilisateur, pas curl",
            "Séparer signaux vendor et gateway",
            "La région compte pour SLO latence",
            "Alerter avant la file tickets",
        ],
        para(
            (
                [
                    "Les checks `/health` ratent retrieval vide, schema outil cassé ou stream bloqué après le premier token.",
                    "Parcours synthétique : auth, prompt golden minimal, marqueurs fin de stream dans le budget.",
                ],
            ),
            (
                [
                    "Taguer résultats avec fournisseur, id modèle et version route. Régression latence : gonflement prompt ou brownout?",
                    "Tenant canary à quotas fixes pour ne pas polluer l'analytics prod.",
                ],
            ),
            (
                [
                    "Sondes depuis régions alignées utilisateurs. us-east sain peut violer INP pour l'Europe routée loin.",
                    "Comparer TTFT sonde et RUM avec mêmes labels—gros écarts = bug sampling ou routage.",
                ],
            ),
            (
                [
                    "Si copilote revenue-critical, échecs sonde vers même rotation on-call que paiements.",
                    "Monitoring synthétique coûte moins qu'expliquer une panne modèle silencieuse au retro.",
                ],
            ),
        ),
    ),
    "it": (
        "Probe sintetiche per gateway LLM",
        "Lo status page del vendor può essere verde mentre il copilot fallisce su una regola di route rotta. Le probe rendono SLO i percorsi LLM visibili all'utente.",
        "Design staff per monitoring sintetico: prompt realistici, check completamento stream, probe regionali e routing alert.",
        [
            "Sondare come utente, non curl",
            "Separare segnali vendor e gateway",
            "La regione conta per SLO latenza",
            "Alert prima della coda ticket",
        ],
        para(
            (
                [
                    "Check su `/health` perdono retrieval vuoto, schema tool rotto o stream bloccato dopo il primo token.",
                    "Journey sintetico: auth, golden prompt minimale, assert marker fine stream nel budget.",
                ],
            ),
            (
                [
                    "Tag esiti con provider, model id e versione route. Regressione latenza: prompt gonfiato o brownout vendor?",
                    "Tenant canary a quota fissa per non inquinare analytics prod.",
                ],
            ),
            (
                [
                    "Probe da regioni allineate agli utenti. us-east sano può violare INP per Europa routata lontano.",
                    "Confronta TTFT probe e RUM con stesse label—gap grandi = bug sampling o routing.",
                ],
            ),
            (
                [
                    "Se copilot revenue-critical, failure probe alla stessa rotazione on-call dei pagamenti.",
                    "Monitoring sintetico costa meno spiegare outage modello silenzioso in retro.",
                ],
            ),
        ),
    ),
    "zh": (
        "LLM 网关的合成探测",
        "供应商状态页全绿时 copilot 仍可能死在错误路由规则上。合成探测把用户可见 LLM 路径变成可测 SLO。",
        "LLM 网关合成监控设计：真实 prompt、流式完成检查、区域探测与产品信任的告警路由。",
        ["像用户而非 curl 探测", "拆分供应商与网关信号", "延迟 SLO 下区域重要", "工单排队前先告警"],
        para(
            (["打 `/health` 的健康检查会漏空检索、坏 tool schema 或首 token 后停滞的流。", "合成旅程应鉴权、跑最小 golden prompt 并在预算内断言流结束标记。"],),
            (["结果打标供应商、模型 id、路由版本。延迟回归需区分 prompt 膨胀还是 vendor brownout。", "固定配额金丝雀租户避免污染生产分析。"],),
            (["从与用户群匹配的区域跑探测。健康的 us-east 仍可能让远路由欧洲用户 INP 违约。", "同标签对比 probe TTFT 与真实 RUM—大差距即采样或路由 bug。"],),
            (["copilot 收入关键时，探测失败应路由到与支付 outage 相同的 on-call。", "合成监控比复盘里解释静默模型故障便宜。"],),
        ),
    ),
    "ja": (
        "LLMゲートウェイ向け合成プローブ",
        "ベンダーステータスが緑でもコパイロットは壊れたルールで失敗しうる。合成プローブはユーザー可視LLM経路を測定可能SLOにする。",
        "LLMゲートウェイ合成監視：現実的プロンプト、ストリーム完了チェック、地域プローブ、信頼できるアラートルーティング。",
        ["curlではなくユーザーとしてプローブ", "ベンダーとゲートウェイ信号を分離", "レイテンシSLOでは地域が重要", "チケット列の前にアラート"],
        para(
            (["`/health`チェックは空の取得、壊れたツールスキーマ、初トークン後停滞を見逃す。", "合成ジャーニーは認証、最小ゴールデンプロンプト、予算内ストリーム終了assert。"],),
            (["結果にプロバイダ・モデルid・ルート版をタグ。レイテンシ回帰はプロンプト肥大かブラウンアウトか。", "固定クォータのカナリテナントで本番分析を汚さない。"],),
            (["ユーザーベースに合う地域からプローブ。健全なus-eastでも遠方ルーティング欧州ユーザーのINPを破る。", "同ラベルでprobe TTFTとRUM比較—大ギャップはサンプリングかルーティングバグ。"],),
            (["収益クリティカルならプローブ失敗を決済 outage と同じオンコールへ。", "合成監視はサイレントモデル障害をレトロで説明するより安い。"],),
        ),
    ),
}


def all_blocks():
    return {
        5: blocks5,
        6: blocks6,
        7: blocks7,
        8: blocks8,
        9: blocks9,
        10: blocks10,
        11: blocks11,
    }
