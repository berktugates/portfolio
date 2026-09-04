export default {
  slug: "cost-attribution-for-shared-llm-gateways",
  title: "Cost Attribution for Shared LLM Gateways",
  excerpt:
    "A shared LLM gateway without cost attribution becomes a black hole: teams optimize prompts locally while finance sees one opaque bill. Tag every token to tenant, product, and caller—or you cannot charge, throttle, or debug spend.",
  description:
    "How staff engineers attribute LLM spend on shared gateways: request tagging, token vs dollar meters, tenant quotas, cache credits, and chargeback models that survive multi-hop agents.",
  readingMinutes: 7,
  keywords: [
    "LLM gateway",
    "cost attribution",
    "token metering",
    "AI chargeback",
    "multi-tenant AI",
    "OpenAI usage",
  ],
  socialThreadTr: [
    "Paylaşılan LLM gateway'de maliyet atıfı yoksa fatura tek kara delik olur. Her token'ı tenant, ürün ve caller'a etiketleyin. 🧵",
    "Kota, chargeback ve cache kredisi. Detay: https://berktugberke.com/tr/blogs/cost-attribution-for-shared-llm-gateways",
  ],
  sections: [
    {
      heading: "Untagged traffic is unowned spend",
      paragraphs: [
        "Shared gateways earn their keep by centralizing auth, model routing, retries, and safety filters. They fail when usage lands in one provider invoice with no join key back to product surfaces. Without request-level tags—tenant id, workspace, feature flag, caller service, model tier—you cannot answer whose prompt burned the budget or whether a regression doubled completion tokens.",
        "Treat attribution as a gateway contract, not a BI afterthought. Reject or quarantine calls that omit required metadata in non-prod; in prod, default tags must still be unambiguous enough for chargeback and incident response."
      ],
    },
    {
      heading: "Meter tokens, price dollars, reconcile both",
      paragraphs: [
        "Providers bill on tokens, cached tokens, tool calls, and sometimes image or audio units. Your gateway should emit normalized usage events: input/output/cached tokens, model id, latency class, and whether the response came from a semantic cache. Convert to dollars with a versioned price table so historical reports stay auditable when list prices change.",
        "Agents that fan out to multiple model calls need a correlation id that rolls child costs into a parent session. Otherwise product dashboards under-count agent workflows and over-count leaf microservices."
      ],
      points: [
        "Require tenant, product, and caller tags on every authenticated request",
        "Emit usage events with model, token splits, cache hits, and correlation ids",
        "Version price tables so dollar reports survive provider rate changes",
        "Expose soft quotas and hard caps per tenant with clear 429 semantics"
      ],
    },
    {
      heading: "Chargeback that teams can actually act on",
      paragraphs: [
        "Finance-friendly monthly rollups are necessary but insufficient. Engineering needs daily spend by feature and model so they can cut temperature, shrink context, or switch tiers. Product needs per-tenant burn rates for pricing and fair-use enforcement. Publish both views from the same usage stream.",
        "Credit semantic-cache hits and prompt-cache discounts explicitly. If you hide savings, teams stop investing in cache keys; if you over-credit, finance disputes the model. Document who pays for shared platform overhead versus tenant-driven traffic."
      ],
    },
    {
      heading: "Close the loop with budgets and alerts",
      paragraphs: [
        "Attribution without enforcement is a report. Wire budgets to gateway policy: warn at 70%, throttle non-critical routes at 90%, and page owners on runaway fan-out. Pair cost alerts with quality metrics so teams do not silently degrade answers to hit a number.",
        "A shared LLM gateway is an internal product. Cost attribution is part of its SLA—same as availability and latency."
      ],
      links: [
        {
          label: "OpenAI — Usage and costs",
          url: "https://platform.openai.com/docs/guides/production-best-practices#managing-costs",
        },
        {
          label: "Anthropic — Usage and rate limits",
          url: "https://docs.anthropic.com/en/api/rate-limits",
        },
        {
          label: "Portkey — LLM gateway observability",
          url: "https://portkey.ai/docs/product/observability",
        },
      ],
    },
  ],
  locales: {
    tr: {
      title: "Paylaşılan LLM Gateway'lerde Maliyet Atıfı",
      excerpt:
        "Maliyet atıfı olmayan paylaşılan LLM gateway kara deliğe döner: ekipler prompt'u yerelde optimize ederken finans tek opak fatura görür. Her token'ı tenant, ürün ve caller'a etiketleyin—yoksa charge, throttle veya harcamayı debug edemezsiniz.",
      description:
        "Staff mühendisler paylaşılan gateway'lerde LLM harcamasını nasıl atfeder: istek etiketleme, token vs dolar metre, tenant kotaları, cache kredisi ve çok adımlı ajanlarda ayakta kalan chargeback modelleri.",
      sections: [
        {
          heading: "Etiketlenmemiş trafik sahipsiz harcamadır",
          paragraphs: [
            "Paylaşılan gateway'ler auth, model routing, retry ve güvenlik filtrelerini merkezileştirerek değer üretir. Kullanım, ürün yüzeylerine geri join edilemeyen tek provider faturasına düştüğünde başarısız olurlar. Tenant id, workspace, feature flag, caller servis, model katmanı gibi istek düzeyi etiketler olmadan kimin prompt'unun bütçeyi yaktığını veya bir regresyonun completion token'ı ikiye katlayıp katlamadığını cevaplayamazsınız.",
            "Atıfı BI sonradan düşüncesi değil, gateway sözleşmesi olarak ele alın. Non-prod'da zorunlu metadata eksik çağrıları reddedin veya karantinaya alın; prod'da varsayılan etiketler yine chargeback ve incident yanıtı için yeterince net olmalıdır."
          ],
        },
        {
          heading: "Token ölçün, dolar fiyatlandırın, ikisini de mutabık kılın",
          paragraphs: [
            "Provider'lar token, cached token, tool call ve bazen görüntü/ses birimleri üzerinden faturalandırır. Gateway normalize kullanım olayları yayınlamalıdır: input/output/cached token, model id, latency sınıfı ve yanıtın semantic cache'ten gelip gelmediği. Dolar dönüşümünü sürümlenmiş fiyat tablosuyla yapın ki liste fiyatı değişince tarihsel raporlar denetlenebilir kalsın.",
            "Birden fazla model çağrısına dağılan ajanlar, çocuk maliyetleri üst oturuma toplayan correlation id ister. Aksi halde ürün panoları ajan iş akışlarını eksik, yaprak mikroservisleri fazla sayar."
          ],
          points: [
            "Her kimlik doğrulanmış istekte tenant, ürün ve caller etiketi zorunlu tutun",
            "Model, token ayrımı, cache hit ve correlation id ile kullanım olayları yayınlayın",
            "Dolar raporlarının provider fiyat değişiminde ayakta kalması için fiyat tablolarını sürümleyin",
            "Tenant başına soft kota ve hard cap'leri net 429 semantiğiyle açın"
          ],
        },
        {
          heading: "Ekiplerin gerçekten harekete geçebileceği chargeback",
          paragraphs: [
            "Finans dostu aylık özetler gerekli ama yeterli değil. Mühendislik temperature düşürmek, context kısaltmak veya katman değiştirmek için feature ve modele göre günlük harcama ister. Ürün fiyatlandırma ve adil kullanım için tenant başına yanma oranı ister. Her iki görünümü aynı kullanım akışından yayınlayın.",
            "Semantic-cache hit'lerini ve prompt-cache indirimlerini açıkça kredilendirin. Tasarrufu gizlerseniz ekipler cache key'e yatırım bırakır; fazla kredilendirirseniz finans modeli tartışır. Paylaşılan platform overhead'ini tenant kaynaklı trafikten kimin ödediğini belgelendirin."
          ],
        },
        {
          heading: "Döngüyü bütçe ve alarmlarla kapatın",
          paragraphs: [
            "Zorlamasız atıf yalnızca rapordur. Bütçeleri gateway politikasına bağlayın: %70'te uyarın, %90'da kritik olmayan rotaları throttle edin, kaçan fan-out'ta sahipleri sayfalayın. Maliyet alarmlarını kalite metrikleriyle eşleyin ki ekipler sayıyı tutturmak için yanıtları sessizce bozmasın.",
            "Paylaşılan LLM gateway dahili bir üründür. Maliyet atıfı SLA'sının parçasıdır—availability ve latency gibi."
          ],
          links: [
            {
              label: "OpenAI — Usage and costs",
              url: "https://platform.openai.com/docs/guides/production-best-practices#managing-costs",
            },
            {
              label: "Anthropic — Usage and rate limits",
              url: "https://docs.anthropic.com/en/api/rate-limits",
            },
            {
              label: "Portkey — LLM gateway observability",
              url: "https://portkey.ai/docs/product/observability",
            },
          ],
        },
      ],
    },
    de: {
      title: "Kostenzuordnung für shared LLM Gateways",
      excerpt:
        "Ein shared LLM Gateway ohne Kostenzuordnung wird zum schwarzen Loch: Teams optimieren Prompts lokal, Finance sieht eine undurchsichtige Rechnung. Taggen Sie jeden Token auf Tenant, Produkt und Caller—sonst kein Chargeback, Throttle oder Spend-Debug.",
      description:
        "Wie Staff Engineers LLM-Spend auf shared Gateways zuordnen: Request-Tagging, Token- vs Dollar-Meter, Tenant-Quotas, Cache-Credits und Chargeback-Modelle die Multi-Hop-Agents überleben.",
      sections: [
        {
          heading: "Ungetaggter Traffic ist unowned Spend",
          paragraphs: [
            "Shared Gateways verdienen sich durch zentrale Auth, Model-Routing, Retries und Safety-Filter. Sie scheitern, wenn Usage in einer Provider-Rechnung landet ohne Join-Key zurück zu Produktflächen. Ohne Request-Tags—Tenant-Id, Workspace, Feature-Flag, Caller-Service, Model-Tier—können Sie nicht sagen, wessen Prompt das Budget verbrannt hat oder ob eine Regression Completion-Tokens verdoppelt hat.",
            "Behandeln Sie Attribution als Gateway-Contract, nicht als BI-Afterthought. Rejecten oder quarantänen Sie Calls ohne Pflicht-Metadata in Non-Prod; in Prod müssen Default-Tags trotzdem eindeutig genug für Chargeback und Incident Response sein."
          ],
        },
        {
          heading: "Token metern, Dollars preisen, beides abstimmen",
          paragraphs: [
            "Provider rechnen über Tokens, Cached Tokens, Tool Calls und manchmal Bild- oder Audio-Einheiten ab. Ihr Gateway sollte normalisierte Usage-Events emittieren: Input/Output/Cached Tokens, Model-Id, Latency-Klasse und ob die Antwort aus einem Semantic Cache kam. Wandeln Sie in Dollars mit einer versionierten Preistabelle um, damit historische Reports auditierbar bleiben wenn Listenpreise sich ändern.",
            "Agents die zu mehreren Model-Calls fan-outen brauchen eine Correlation-Id die Child-Kosten in eine Parent-Session rollt. Sonst unterzählen Produkt-Dashboards Agent-Workflows und überzählen Leaf-Microservices."
          ],
          points: [
            "Tenant-, Produkt- und Caller-Tags auf jedem authentifizierten Request verlangen",
            "Usage-Events mit Model, Token-Splits, Cache-Hits und Correlation-Ids emittieren",
            "Preistabellen versionieren damit Dollar-Reports Provider-Preisänderungen überleben",
            "Soft Quotas und Hard Caps pro Tenant mit klarer 429-Semantik exponieren"
          ],
        },
        {
          heading: "Chargeback auf den Teams wirklich handeln können",
          paragraphs: [
            "Finance-freundliche Monats-Rollups sind nötig aber nicht genug. Engineering braucht täglichen Spend nach Feature und Model um Temperature zu senken, Context zu kürzen oder Tiers zu wechseln. Produkt braucht Burn-Rates pro Tenant für Pricing und Fair-Use. Publizieren Sie beide Views aus demselben Usage-Stream.",
            "Kreditiere Semantic-Cache-Hits und Prompt-Cache-Rabatte explizit. Verstecken Sie Savings, stoppen Teams Cache-Key-Investitionen; überkreditieren Sie, disputiert Finance das Modell. Dokumentieren Sie wer shared Platform-Overhead vs tenant-getriebenen Traffic zahlt."
          ],
        },
        {
          heading: "Schließen Sie den Loop mit Budgets und Alerts",
          paragraphs: [
            "Attribution ohne Enforcement ist ein Report. Verdrahten Sie Budgets an Gateway-Policy: Warnung bei 70%, Throttle nicht-kritischer Routes bei 90%, Page Owners bei runaway Fan-out. Koppeln Sie Cost-Alerts an Qualitätsmetriken damit Teams Antworten nicht still degradieren um eine Zahl zu treffen.",
            "Ein shared LLM Gateway ist ein internes Produkt. Kostenzuordnung ist Teil seiner SLA—wie Availability und Latency."
          ],
          links: [
            {
              label: "OpenAI — Usage and costs",
              url: "https://platform.openai.com/docs/guides/production-best-practices#managing-costs",
            },
            {
              label: "Anthropic — Usage and rate limits",
              url: "https://docs.anthropic.com/en/api/rate-limits",
            },
            {
              label: "Portkey — LLM gateway observability",
              url: "https://portkey.ai/docs/product/observability",
            },
          ],
        },
      ],
    },
    fr: {
      title: "Attribution des coûts pour les passerelles LLM partagées",
      excerpt:
        "Une passerelle LLM partagée sans attribution des coûts devient un trou noir : les équipes optimisent les prompts localement tandis que la finance voit une facture opaque. Étiquetez chaque token à tenant, produit et caller—sinon pas de chargeback, throttle ni debug de dépense.",
      description:
        "Comment les staff engineers attribuent la dépense LLM sur des passerelles partagées : tagging de requêtes, compteurs token vs dollar, quotas tenant, crédits cache et modèles de chargeback qui survivent aux agents multi-hop.",
      sections: [
        {
          heading: "Le trafic non tagué est une dépense sans propriétaire",
          paragraphs: [
            "Les passerelles partagées gagnent leur place en centralisant auth, routage de modèles, retries et filtres de sécurité. Elles échouent quand l'usage tombe dans une facture fournisseur sans clé de jointure vers les surfaces produit. Sans tags au niveau requête—id tenant, workspace, feature flag, service caller, tier modèle—vous ne pouvez pas dire quel prompt a brûlé le budget ni si une régression a doublé les tokens de completion.",
            "Traitez l'attribution comme un contrat de passerelle, pas un afterthought BI. Rejetez ou mettez en quarantaine les appels sans métadonnées requises en non-prod ; en prod, les tags par défaut doivent rester assez clairs pour chargeback et réponse incident."
          ],
        },
        {
          heading: "Comptez les tokens, prixez en dollars, réconciliez les deux",
          paragraphs: [
            "Les fournisseurs facturent tokens, tokens en cache, appels d'outils et parfois unités image ou audio. Votre passerelle doit émettre des événements d'usage normalisés : tokens input/output/cached, id modèle, classe de latence et si la réponse vient d'un cache sémantique. Convertissez en dollars avec une table de prix versionnée pour que les rapports historiques restent auditables quand les prix catalogue changent.",
            "Les agents qui se déploient vers plusieurs appels modèle ont besoin d'un correlation id qui agrège les coûts enfants dans une session parente. Sinon les tableaux de bord produit sous-comptent les workflows agent et sur-comptent les microservices feuilles."
          ],
          points: [
            "Exiger tags tenant, produit et caller sur chaque requête authentifiée",
            "Émettre des événements d'usage avec modèle, splits de tokens, cache hits et correlation ids",
            "Versionner les tables de prix pour que les rapports dollar survivent aux changements de tarif",
            "Exposer soft quotas et hard caps par tenant avec sémantique 429 claire"
          ],
        },
        {
          heading: "Un chargeback sur lequel les équipes peuvent agir",
          paragraphs: [
            "Les rollups mensuels finance-friendly sont nécessaires mais insuffisants. L'ingénierie a besoin de la dépense quotidienne par feature et modèle pour baisser la température, raccourcir le contexte ou changer de tier. Le produit a besoin des burn rates par tenant pour pricing et fair-use. Publiez les deux vues depuis le même flux d'usage.",
            "Créditez explicitement les hits de cache sémantique et les remises prompt-cache. Si vous cachez les économies, les équipes arrêtent d'investir dans les clés de cache ; si vous sur-créditez, la finance conteste le modèle. Documentez qui paie l'overhead plateforme partagée versus le trafic tenant."
          ],
        },
        {
          heading: "Fermez la boucle avec budgets et alertes",
          paragraphs: [
            "L'attribution sans enforcement n'est qu'un rapport. Branchez les budgets à la politique de passerelle : alerte à 70 %, throttle des routes non critiques à 90 %, page owners sur fan-out incontrôlé. Couplez alertes de coût et métriques de qualité pour que les équipes ne dégradent pas silencieusement les réponses pour tenir un chiffre.",
            "Une passerelle LLM partagée est un produit interne. L'attribution des coûts fait partie de son SLA—comme disponibilité et latence."
          ],
          links: [
            {
              label: "OpenAI — Usage and costs",
              url: "https://platform.openai.com/docs/guides/production-best-practices#managing-costs",
            },
            {
              label: "Anthropic — Usage and rate limits",
              url: "https://docs.anthropic.com/en/api/rate-limits",
            },
            {
              label: "Portkey — LLM gateway observability",
              url: "https://portkey.ai/docs/product/observability",
            },
          ],
        },
      ],
    },
    it: {
      title: "Attribuzione dei costi per gateway LLM condivisi",
      excerpt:
        "Un gateway LLM condiviso senza attribuzione dei costi diventa un buco nero: i team ottimizzano i prompt in locale mentre finance vede una fattura opaca. Tagga ogni token a tenant, prodotto e caller—altrimenti niente chargeback, throttle o debug della spesa.",
      description:
        "Come gli staff engineer attribuiscono la spesa LLM su gateway condivisi: tagging delle richieste, meter token vs dollaro, quote tenant, crediti cache e modelli di chargeback che sopravvivono agli agent multi-hop.",
      sections: [
        {
          heading: "Il traffico senza tag è spesa senza owner",
          paragraphs: [
            "I gateway condivisi guadagnano centralizzando auth, routing dei modelli, retry e filtri di safety. Falliscono quando l'usage finisce in una fattura provider senza chiave di join verso le superfici prodotto. Senza tag a livello richiesta—tenant id, workspace, feature flag, servizio caller, tier modello—non potete dire quale prompt ha bruciato il budget o se una regressione ha raddoppiato i token di completion.",
            "Trattate l'attribuzione come contratto del gateway, non come afterthought BI. Rifiutate o mettete in quarantena le chiamate senza metadata obbligatorie in non-prod; in prod i tag di default devono restare abbastanza chiari per chargeback e risposta agli incident."
          ],
        },
        {
          heading: "Misurate i token, prezzate i dollari, riconciliate entrambi",
          paragraphs: [
            "I provider fatturano su token, token in cache, tool call e a volte unità immagine o audio. Il gateway deve emettere eventi di usage normalizzati: token input/output/cached, model id, classe di latenza e se la risposta viene da un cache semantico. Convertite in dollari con una tabella prezzi versionata così i report storici restano auditabili quando cambiano i listini.",
            "Gli agent che fanno fan-out a più chiamate modello servono un correlation id che aggrega i costi figlio in una sessione parent. Altrimenti le dashboard prodotto sottostimano i workflow agent e sovrastimano i microservizi foglia."
          ],
          points: [
            "Richiedere tag tenant, prodotto e caller su ogni richiesta autenticata",
            "Emettere eventi di usage con modello, split token, cache hit e correlation id",
            "Versionare le tabelle prezzi così i report in dollari sopravvivono ai cambi tariffa",
            "Esporre soft quota e hard cap per tenant con semantica 429 chiara"
          ],
        },
        {
          heading: "Chargeback su cui i team possono agire davvero",
          paragraphs: [
            "I rollup mensili finance-friendly sono necessari ma insufficienti. L'engineering ha bisogno della spesa giornaliera per feature e modello per abbassare temperature, accorciare il context o cambiare tier. Il prodotto ha bisogno dei burn rate per tenant per pricing e fair-use. Pubblicate entrambe le viste dallo stesso stream di usage.",
            "Accreditare esplicitamente hit di cache semantico e sconti prompt-cache. Se nascondete i risparmi, i team smettono di investire nelle cache key; se sovra-accreditate, finance disputa il modello. Documentate chi paga l'overhead della piattaforma condivisa versus il traffico tenant."
          ],
        },
        {
          heading: "Chiudete il loop con budget e alert",
          paragraphs: [
            "Attribuzione senza enforcement è solo un report. Collegare i budget alla policy del gateway: avviso al 70%, throttle delle route non critiche al 90%, page agli owner su fan-out fuori controllo. Accoppiare alert di costo e metriche di qualità così i team non degradano silenziosamente le risposte per centrare un numero.",
            "Un gateway LLM condiviso è un prodotto interno. L'attribuzione dei costi fa parte del suo SLA—come availability e latency."
          ],
          links: [
            {
              label: "OpenAI — Usage and costs",
              url: "https://platform.openai.com/docs/guides/production-best-practices#managing-costs",
            },
            {
              label: "Anthropic — Usage and rate limits",
              url: "https://docs.anthropic.com/en/api/rate-limits",
            },
            {
              label: "Portkey — LLM gateway observability",
              url: "https://portkey.ai/docs/product/observability",
            },
          ],
        },
      ],
    },
    zh: {
      title: "共享 LLM 网关的成本归因",
      excerpt:
        "没有成本归因的共享 LLM 网关会变成黑洞：团队在本地优化提示，财务只看到一张不透明账单。把每个 token 打到租户、产品与调用方——否则无法计费、限流或调试支出。",
      description:
        "Staff 工程师如何在共享网关上归因 LLM 支出：请求打标、token 与美元计量、租户配额、缓存抵扣，以及能撑过多跳智能体的分摊模型。",
      sections: [
        {
          heading: "未打标流量就是无主支出",
          paragraphs: [
            "共享网关通过集中鉴权、模型路由、重试与安全过滤创造价值。当用量落入一张无法回连产品表面的供应商账单时就会失败。没有请求级标签——租户 id、工作区、功能开关、调用服务、模型档位——你无法回答是谁的提示烧了预算，或回归是否把 completion token 翻倍。",
            "把归因当作网关契约，而不是 BI 事后补丁。非生产环境拒绝或隔离缺少必填元数据的调用；生产环境的默认标签仍须足够明确，以支撑分摊与事件响应。"
          ],
        },
        {
          heading: "计量 token、定价美元、两边对账",
          paragraphs: [
            "供应商按 token、缓存 token、工具调用，有时还有图像或音频单位计费。网关应发出规范化用量事件：输入/输出/缓存 token、模型 id、延迟档位，以及响应是否来自语义缓存。用带版本的价格表换算美元，以便目录价变更后历史报告仍可审计。",
            "向多个模型调用扇出的智能体需要把子成本滚入父会话的 correlation id。否则产品仪表盘会少计智能体工作流、多计叶子微服务。"
          ],
          points: [
            "每个已认证请求强制要求租户、产品与调用方标签",
            "发出含模型、token 拆分、缓存命中与 correlation id 的用量事件",
            "为价格表做版本，使美元报告在供应商调价后仍可用",
            "按租户暴露软配额与硬上限，并给出清晰的 429 语义"
          ],
        },
        {
          heading: "团队真正能行动的分摊",
          paragraphs: [
            "面向财务的月度汇总必要但不够。工程需要按功能与模型的日支出，才能降低 temperature、缩短上下文或切换档位。产品需要按租户的燃烧速率做定价与公平使用。从同一用量流发布两种视图。",
            "明确抵扣语义缓存命中与提示缓存折扣。隐藏节省会让团队停止投入缓存键；过度抵扣会让财务质疑模型。记录共享平台开销与租户驱动流量分别由谁支付。"
          ],
        },
        {
          heading: "用预算与告警闭环",
          paragraphs: [
            "没有执行力的归因只是报告。把预算接到网关策略：70% 告警，90% 限流非关键路由，失控扇出时呼叫负责人。把成本告警与质量指标配对，避免团队为凑数字悄悄劣化回答。",
            "共享 LLM 网关是内部产品。成本归因是其 SLA 的一部分——与可用性、延迟同等。"
          ],
          links: [
            {
              label: "OpenAI — Usage and costs",
              url: "https://platform.openai.com/docs/guides/production-best-practices#managing-costs",
            },
            {
              label: "Anthropic — Usage and rate limits",
              url: "https://docs.anthropic.com/en/api/rate-limits",
            },
            {
              label: "Portkey — LLM gateway observability",
              url: "https://portkey.ai/docs/product/observability",
            },
          ],
        },
      ],
    },
    ja: {
      title: "共有LLMゲートウェイのコスト帰属",
      excerpt:
        "コスト帰属のない共有LLMゲートウェイはブラックホールになります。チームはプロンプトを局所最適化し、財務は不透明な一枚の請求書を見ます。各トークンをテナント・製品・呼び出し元にタグ付けしてください—さもなくば課金・スロットル・支出デバッグはできません。",
      description:
        "スタッフエンジニアが共有ゲートウェイ上でLLM支出をどう帰属させるか：リクエストタグ付け、トークン対ドル計測、テナントクォータ、キャッシュクレジット、マルチホップエージェントでも耐えるチャージバックモデル。",
      sections: [
        {
          heading: "タグなしトラフィックはオーナー不在の支出",
          paragraphs: [
            "共有ゲートウェイは認証、モデルルーティング、リトライ、安全フィルタを中央化して価値を生みます。利用が製品サーフェスへ戻る結合キーなしの一枚のプロバイダ請求に落ちると失敗します。テナントID、ワークスペース、フィーチャーフラグ、呼び出しサービス、モデル層などのリクエスト級タグがなければ、どのプロンプトが予算を燃やしたか、回帰が完了トークンを倍にしたかを答えられません。",
            "帰属をBIの後付けではなくゲートウェイ契約として扱ってください。非本番では必須メタデータ欠落の呼び出しを拒否または隔離し、本番でもデフォルトタグはチャージバックとインシデント対応に十分な明確さを保つ必要があります。"
          ],
        },
        {
          heading: "トークンを計測し、ドルで価格付けし、両方を突合する",
          paragraphs: [
            "プロバイダはトークン、キャッシュトークン、ツール呼び出し、時には画像や音声単位で請求します。ゲートウェイは正規化した利用イベントを出すべきです：入出力/キャッシュトークン、モデルID、レイテンシ級、応答がセマンティックキャッシュ由来かどうか。リスト価格が変わっても履歴レポートが監査可能になるよう、版管理した価格表でドル換算します。",
            "複数モデル呼び出しにファンアウトするエージェントは、子コストを親セッションにまとめる correlation id が必要です。なければ製品ダッシュボードはエージェントワークフローを過小、葉マイクロサービスを過大に数えます。"
          ],
          points: [
            "認証済みリクエストごとにテナント・製品・呼び出し元タグを必須にする",
            "モデル、トークン分割、キャッシュヒット、correlation id 付き利用イベントを出す",
            "プロバイダ料金変更後もドルレポートが耐えるよう価格表を版管理する",
            "テナントごとにソフトクォータとハードキャップを明確な429意味論で公開する"
          ],
        },
        {
          heading: "チームが実際に動けるチャージバック",
          paragraphs: [
            "財務向け月次ロールアップは必要だが不十分です。エンジニアリングは temperature 低下、コンテキスト短縮、ティア切替のため機能・モデル別の日次支出が要ります。製品は価格設定とフェアユースのためテナント別燃焼率が要ります。同じ利用ストリームから両ビューを公開してください。",
            "セマンティックキャッシュヒットとプロンプトキャッシュ割引を明示的にクレジットします。節約を隠すとチームはキャッシュキー投資を止め、過大クレジットすると財務がモデルに異議を唱えます。共有プラットフォームオーバーヘッドとテナント駆動トラフィックの支払い責任を文書化してください。"
          ],
        },
        {
          heading: "予算とアラートでループを閉じる",
          paragraphs: [
            "執行のない帰属はレポートに過ぎません。予算をゲートウェイポリシーに配線します：70%で警告、90%で非クリティカルルートをスロットル、暴走ファンアウトでオーナーをページ。コストアラートを品質指標と対にし、数字合わせで回答を静かに劣化させないようにします。",
            "共有LLMゲートウェイは社内プロダクトです。コスト帰属は可用性・レイテンシと同じくSLAの一部です。"
          ],
          links: [
            {
              label: "OpenAI — Usage and costs",
              url: "https://platform.openai.com/docs/guides/production-best-practices#managing-costs",
            },
            {
              label: "Anthropic — Usage and rate limits",
              url: "https://docs.anthropic.com/en/api/rate-limits",
            },
            {
              label: "Portkey — LLM gateway observability",
              url: "https://portkey.ai/docs/product/observability",
            },
          ],
        },
      ],
    },
  },
};
