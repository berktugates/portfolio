export default {
  slug: "cache-invalidation-for-personalized-ai-uis",
  title: "Cache Invalidation for Personalized AI UIs",
  excerpt:
    "Personalized AI surfaces cache embeddings, completions, and UI fragments for speed—then serve the wrong user the wrong answer. Invalidation must track identity, entitlements, and prompt versions, not just TTL.",
  description:
    "How staff engineers invalidate caches for personalized AI UIs: key design, tenant isolation, entitlement-aware busts, streaming partials, and metrics that catch cross-user leakage early.",
  readingMinutes: 7,
  keywords: [
    "cache invalidation",
    "personalized AI",
    "CDN caching",
    "LLM response cache",
    "tenant isolation",
    "AI UI performance",
  ],
  socialThreadTr: [
    "Kişiselleştirilmiş AI UI cache'i hız kazandırır—yanlış kullanıcıya yanlış yanıt da servis eder. Invalidation kimlik ve entitlement bilmeli. 🧵",
    "Anahtar tasarımı, tenant izolasyonu ve sızıntı metrikleri. Detay: https://berktugberke.com/tr/blogs/cache-invalidation-for-personalized-ai-uis",
  ],
  sections: [
    {
      heading: "Personalization makes TTL insufficient",
      paragraphs: [
        "Generic page caches expire on time. Personalized AI UIs expire when the user, role, plan, feature flags, retrieved documents, or prompt version change—even if the clock says the entry is fresh. A 60-second TTL that keys only on route can still leak another tenant's completion or show revoked entitlements.",
        "Name what you cache: raw model output, rendered markdown, embedding vectors for the sidebar, or edge HTML shells. Each layer needs a different key and bust strategy."
      ],
    },
    {
      heading: "Design keys that encode authority",
      paragraphs: [
        "Include tenant id, user or session scope, entitlement hash, and content or prompt revision in cache keys. Prefer opaque hashes over concatenating PII. For semantic caches, require a tenant-scoped namespace so similar questions never hit across organizations.",
        "On permission or plan changes, broadcast invalidation for the affected identity—not a global flush that thrashes the fleet. Document whether soft-deleted users can still hit warm entries during grace periods."
      ],
      points: [
        "Key on tenant, identity scope, entitlement hash, and prompt/content revision",
        "Namespace semantic caches per tenant; never share similarity indexes across orgs",
        "Bust on authz and plan events, not only on write timestamps",
        "Alert on cross-tenant key collisions and unexpected cache hit rates after releases"
      ],
    },
    {
      heading: "Streaming and partials complicate busts",
      paragraphs: [
        "AI UIs often stream tokens into a client that also hydrates from a CDN or service worker. Decide whether partial streams are cacheable at all. If you cache completed answers only, document how mid-stream cancels and tool-call revisions avoid storing half-truths.",
        "Stale-while-revalidate can hide entitlement revocation for one request cycle. For high-risk surfaces—billing, medical, legal—prefer explicit revalidation before render."
      ],
    },
    {
      heading: "Prove isolation in production",
      paragraphs: [
        "Add canary checks that attempt to fetch another tenant's cached completion by key guess and by similarity search. Monitor hit-rate cliffs after permission system deploys. Cache bugs in AI UIs are privacy incidents, not just UX glitches.",
        "Speed matters, but correct personalization is the product. Invalidation policy belongs in the same design review as the prompt."
      ],
      links: [
        {
          label: "MDN — HTTP caching",
          url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
        },
        {
          label: "Vercel — Caching",
          url: "https://vercel.com/docs/infrastructure/data-cache",
        },
        {
          label: "Cloudflare — Cache purge",
          url: "https://developers.cloudflare.com/cache/how-to/purge-cache/",
        },
      ],
    },
  ],
  locales: {
    tr: {
      title: "Kişiselleştirilmiş AI UI'lar için Cache Invalidation",
      excerpt:
        "Kişiselleştirilmiş AI yüzeyleri hız için embedding, completion ve UI parçalarını cache'ler—sonra yanlış kullanıcıya yanlış yanıt servis eder. Invalidation yalnızca TTL değil; kimlik, entitlement ve prompt sürümünü izlemelidir.",
      description:
        "Staff mühendisler kişiselleştirilmiş AI UI'larda cache'i nasıl invalidate eder: anahtar tasarımı, tenant izolasyonu, entitlement-aware bust, streaming partial'lar ve çapraz kullanıcı sızıntısını erken yakalayan metrikler.",
      sections: [
        {
          heading: "Kişiselleştirme TTL'yi yetersiz kılar",
          paragraphs: [
            "Genel sayfa cache'leri zamana göre expire olur. Kişiselleştirilmiş AI UI'lar kullanıcı, rol, plan, feature flag, retrieve edilen doküman veya prompt sürümü değişince expire olur—saat girişi taze dese bile. Yalnızca route'a key'lenen 60 saniyelik TTL başka tenant'ın completion'ını sızdırabilir veya iptal edilmiş entitlement gösterebilir.",
            "Ne cache'lediğinizi adlandırın: ham model çıktısı, render markdown, kenar çubuğu embedding'leri veya edge HTML kabukları. Her katmanın farklı anahtarı ve bust stratejisi vardır."
          ],
        },
        {
          heading: "Yetkiyi kodlayan anahtarlar tasarlayın",
          paragraphs: [
            "Cache anahtarlarına tenant id, kullanıcı veya oturum kapsamı, entitlement hash'i ve içerik/prompt revizyonunu ekleyin. PII birleştirmek yerine opak hash tercih edin. Semantic cache'ler için tenant-scoped namespace zorunlu tutun ki benzer sorular organizasyonlar arası asla isabet etmesin.",
            "İzin veya plan değişiminde etkilenen kimlik için invalidation yayınlayın—filoyu thrash eden global flush değil. Soft-delete kullanıcıların grace döneminde warm entry'ye hâlâ isabet edip edemeyeceğini belgelendirin."
          ],
          points: [
            "Tenant, kimlik kapsamı, entitlement hash ve prompt/içerik revizyonuna key'leyin",
            "Semantic cache'leri tenant başına namespace'leyin; org'lar arası similarity index paylaşmayın",
            "Yalnızca yazma zaman damgasında değil, authz ve plan olaylarında bust edin",
            "Çapraz-tenant key çarpışması ve release sonrası beklenmeyen hit rate için alarm kurun"
          ],
        },
        {
          heading: "Streaming ve partial'lar bust'ı zorlaştırır",
          paragraphs: [
            "AI UI'lar sıkça token'ları, CDN veya service worker'dan hydrate olan bir client'a stream eder. Partial stream'lerin hiç cache'lenip cache'lenmeyeceğine karar verin. Yalnızca tamamlanmış yanıtları cache'liyorsanız, mid-stream iptallerin ve tool-call revizyonlarının yarım gerçekleri saklamasını nasıl engellediğinizi belgelendirin.",
            "Stale-while-revalidate entitlement iptalini bir istek döngüsü gizleyebilir. Faturalama, tıbbi, hukuki gibi yüksek riskli yüzeylerde render öncesi açık revalidation tercih edin."
          ],
        },
        {
          heading: "İzolasyonu production'da kanıtlayın",
          paragraphs: [
            "Başka tenant'ın cache'li completion'ını key tahmini ve similarity aramasıyla çekmeyi deneyen canary kontrolleri ekleyin. İzin sistemi deploy'larından sonra hit-rate uçurumlarını izleyin. AI UI'lardaki cache bug'ları UX aksaklığı değil, gizlilik olayıdır.",
            "Hız önemlidir ama doğru kişiselleştirme üründür. Invalidation politikası prompt ile aynı tasarım incelemesine aittir."
          ],
          links: [
            {
              label: "MDN — HTTP caching",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
            },
            {
              label: "Vercel — Caching",
              url: "https://vercel.com/docs/infrastructure/data-cache",
            },
            {
              label: "Cloudflare — Cache purge",
              url: "https://developers.cloudflare.com/cache/how-to/purge-cache/",
            },
          ],
        },
      ],
    },
    de: {
      title: "Cache-Invalidierung für personalisierte AI-UIs",
      excerpt:
        "Personalisierte AI-Surfaces cachen Embeddings, Completions und UI-Fragmente für Speed—und servieren dann dem falschen User die falsche Antwort. Invalidierung muss Identity, Entitlements und Prompt-Versionen tracken, nicht nur TTL.",
      description:
        "Wie Staff Engineers Caches für personalisierte AI-UIs invalidieren: Key-Design, Tenant-Isolation, entitlement-aware Busts, Streaming-Partials und Metriken die Cross-User-Leakage früh fangen.",
      sections: [
        {
          heading: "Personalisierung macht TTL unzureichend",
          paragraphs: [
            "Generische Page-Caches expire auf Zeit. Personalisierte AI-UIs expire wenn User, Rolle, Plan, Feature Flags, retrieved Documents oder Prompt-Version wechseln—auch wenn die Uhr den Entry als fresh zeigt. Ein 60-Sekunden-TTL der nur auf Route keyt kann trotzdem die Completion eines anderen Tenants leaken oder revoked Entitlements zeigen.",
            "Benennen Sie was Sie cachen: Raw Model Output, gerendertes Markdown, Embedding-Vektoren für die Sidebar oder Edge-HTML-Shells. Jede Schicht braucht anderen Key und Bust-Strategie."
          ],
        },
        {
          heading: "Keys designen die Authority kodieren",
          paragraphs: [
            "Tenant-Id, User- oder Session-Scope, Entitlement-Hash und Content- oder Prompt-Revision in Cache-Keys aufnehmen. Opaque Hashes statt PII-Konkatenation bevorzugen. Für Semantic Caches tenant-scoped Namespace verlangen damit ähnliche Fragen nie org-übergreifend treffen.",
            "Bei Permission- oder Plan-Änderungen Invalidierung für die betroffene Identity broadcasten—kein Global Flush der die Fleet thrash. Dokumentieren ob soft-deleted User in Grace Periods noch Warm Entries treffen dürfen."
          ],
          points: [
            "Auf Tenant, Identity-Scope, Entitlement-Hash und Prompt/Content-Revision keyen",
            "Semantic Caches pro Tenant namespacen; Similarity-Indexes nie org-übergreifend teilen",
            "Bei Authz- und Plan-Events bustern, nicht nur bei Write-Timestamps",
            "Auf Cross-Tenant-Key-Collisions und unerwartete Hit-Rates nach Releases alerten"
          ],
        },
        {
          heading: "Streaming und Partials erschweren Busts",
          paragraphs: [
            "AI-UIs streamen oft Tokens in einen Client der auch von CDN oder Service Worker hydratet. Entscheiden ob Partial Streams überhaupt cachebar sind. Cachen Sie nur completed Answers, dokumentieren wie Mid-Stream-Cancels und Tool-Call-Revisions Half-Truths vermeiden.",
            "Stale-while-revalidate kann Entitlement-Revocation für einen Request-Zyklus verbergen. Für High-Risk-Surfaces—Billing, Medical, Legal—explizite Revalidation vor Render bevorzugen."
          ],
        },
        {
          heading: "Isolation in Production beweisen",
          paragraphs: [
            "Canary-Checks hinzufügen die versuchen eine andere Tenant-Completion per Key-Guess und Similarity-Search zu fetchen. Hit-Rate-Cliffs nach Permission-System-Deploys monitoren. Cache-Bugs in AI-UIs sind Privacy-Incidents, keine bloßen UX-Glitches.",
            "Speed zählt, aber korrekte Personalisierung ist das Produkt. Invalidierungs-Policy gehört in denselben Design Review wie der Prompt."
          ],
          links: [
            {
              label: "MDN — HTTP caching",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
            },
            {
              label: "Vercel — Caching",
              url: "https://vercel.com/docs/infrastructure/data-cache",
            },
            {
              label: "Cloudflare — Cache purge",
              url: "https://developers.cloudflare.com/cache/how-to/purge-cache/",
            },
          ],
        },
      ],
    },
    fr: {
      title: "Invalidation de cache pour les UI IA personnalisées",
      excerpt:
        "Les surfaces IA personnalisées mettent en cache embeddings, completions et fragments d'UI pour la vitesse—puis servent la mauvaise réponse au mauvais utilisateur. L'invalidation doit suivre identité, entitlements et versions de prompt, pas seulement le TTL.",
      description:
        "Comment les staff engineers invalidents les caches pour UI IA personnalisées : design de clés, isolation tenant, busts sensibles aux entitlements, partials en streaming et métriques qui détectent tôt les fuites cross-user.",
      sections: [
        {
          heading: "La personnalisation rend le TTL insuffisant",
          paragraphs: [
            "Les caches de pages génériques expirent dans le temps. Les UI IA personnalisées expirent quand utilisateur, rôle, plan, feature flags, documents récupérés ou version de prompt changent—même si l'horloge dit que l'entrée est fraîche. Un TTL de 60 secondes clé seulement sur la route peut encore fuiter la completion d'un autre tenant ou montrer des entitlements révoqués.",
            "Nommez ce que vous cachez : sortie modèle brute, markdown rendu, vecteurs d'embedding pour la sidebar ou coques HTML edge. Chaque couche a une clé et une stratégie de bust différentes."
          ],
        },
        {
          heading: "Concevoir des clés qui encodent l'autorité",
          paragraphs: [
            "Incluez id tenant, portée utilisateur ou session, hash d'entitlement et révision contenu/prompt dans les clés. Préférez des hashes opaques à la concaténation de PII. Pour les caches sémantiques, exigez un namespace scoped tenant pour que des questions similaires ne frappent jamais entre organisations.",
            "Sur changements de permission ou de plan, diffusez l'invalidation pour l'identité affectée—pas un flush global qui thrash la flotte. Documentez si les utilisateurs soft-deleted peuvent encore toucher des entrées chaudes pendant les périodes de grâce."
          ],
          points: [
            "Clé sur tenant, portée d'identité, hash d'entitlement et révision prompt/contenu",
            "Namespace des caches sémantiques par tenant ; ne jamais partager les index de similarité entre orgs",
            "Buster sur événements authz et plan, pas seulement timestamps d'écriture",
            "Alerter sur collisions de clés cross-tenant et hit rates inattendus après releases"
          ],
        },
        {
          heading: "Streaming et partials compliquent les busts",
          paragraphs: [
            "Les UI IA streamnent souvent des tokens vers un client qui hydrate aussi depuis CDN ou service worker. Décidez si les partial streams sont cacheables du tout. Si vous ne cachez que les réponses complètes, documentez comment annulations mid-stream et révisions d'appels d'outils évitent de stocker des demi-vérités.",
            "Stale-while-revalidate peut masquer une révocation d'entitlement pendant un cycle de requête. Pour surfaces à haut risque—facturation, médical, juridique—préférez une revalidation explicite avant render."
          ],
        },
        {
          heading: "Prouver l'isolation en production",
          paragraphs: [
            "Ajoutez des canary qui tentent de récupérer la completion cachée d'un autre tenant par guess de clé et recherche de similarité. Surveillez les falaises de hit-rate après déploiements du système de permissions. Les bugs de cache dans les UI IA sont des incidents de confidentialité, pas de simples glitches UX.",
            "La vitesse compte, mais la personnalisation correcte est le produit. La politique d'invalidation appartient à la même revue de design que le prompt."
          ],
          links: [
            {
              label: "MDN — HTTP caching",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
            },
            {
              label: "Vercel — Caching",
              url: "https://vercel.com/docs/infrastructure/data-cache",
            },
            {
              label: "Cloudflare — Cache purge",
              url: "https://developers.cloudflare.com/cache/how-to/purge-cache/",
            },
          ],
        },
      ],
    },
    it: {
      title: "Invalidazione cache per UI AI personalizzate",
      excerpt:
        "Le superfici AI personalizzate mettono in cache embedding, completion e frammenti UI per la velocità—poi servono la risposta sbagliata all'utente sbagliato. L'invalidazione deve tracciare identità, entitlement e versioni di prompt, non solo il TTL.",
      description:
        "Come gli staff engineer invalidano le cache per UI AI personalizzate: design delle chiavi, isolamento tenant, bust sensibili agli entitlement, partial in streaming e metriche che intercettano presto i leak cross-user.",
      sections: [
        {
          heading: "La personalizzazione rende insufficiente il TTL",
          paragraphs: [
            "Le cache di pagina generiche scadono nel tempo. Le UI AI personalizzate scadono quando cambiano utente, ruolo, piano, feature flag, documenti recuperati o versione di prompt—anche se l'orologio dice che l'entry è fresca. Un TTL di 60 secondi chiave solo sulla route può comunque far trapelare la completion di un altro tenant o mostrare entitlement revocati.",
            "Nominate cosa cacheate: output grezzo del modello, markdown renderizzato, vettori embedding per la sidebar o shell HTML edge. Ogni layer ha chiave e strategia di bust diverse."
          ],
        },
        {
          heading: "Progettare chiavi che codificano l'autorità",
          paragraphs: [
            "Includere tenant id, scope utente o sessione, hash entitlement e revisione contenuto/prompt nelle chiavi. Preferire hash opachi alla concatenazione di PII. Per i cache semantici richiedere un namespace scoped al tenant così domande simili non colpiscono mai tra organizzazioni.",
            "Su cambi di permesso o piano, broadcastare invalidazione per l'identità colpita—non un flush globale che thrash la flotta. Documentare se utenti soft-deleted possono ancora colpire entry calde nei periodi di grazia."
          ],
          points: [
            "Chiave su tenant, scope identità, hash entitlement e revisione prompt/contenuto",
            "Namespace dei cache semantici per tenant; non condividere indici di similarità tra org",
            "Bust su eventi authz e piano, non solo timestamp di scrittura",
            "Allertare su collisioni di chiavi cross-tenant e hit rate inattesi dopo i release"
          ],
        },
        {
          heading: "Streaming e partial complicano i bust",
          paragraphs: [
            "Le UI AI spesso streammano token in un client che idrata anche da CDN o service worker. Decidere se i partial stream sono cacheabili affatto. Se cacheate solo risposte complete, documentate come cancel mid-stream e revisioni di tool-call evitano di memorizzare mezze verità.",
            "Stale-while-revalidate può nascondere la revoca di entitlement per un ciclo di richiesta. Per superfici ad alto rischio—billing, medicale, legale—preferire revalidation esplicita prima del render."
          ],
        },
        {
          heading: "Dimostrare l'isolamento in produzione",
          paragraphs: [
            "Aggiungere canary che tentano di fetchare la completion in cache di un altro tenant per guess di chiave e ricerca di similarità. Monitorare cliff di hit-rate dopo deploy del sistema di permessi. I bug di cache nelle UI AI sono incident di privacy, non solo glitch UX.",
            "La velocità conta, ma la personalizzazione corretta è il prodotto. La policy di invalidazione appartiene alla stessa design review del prompt."
          ],
          links: [
            {
              label: "MDN — HTTP caching",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
            },
            {
              label: "Vercel — Caching",
              url: "https://vercel.com/docs/infrastructure/data-cache",
            },
            {
              label: "Cloudflare — Cache purge",
              url: "https://developers.cloudflare.com/cache/how-to/purge-cache/",
            },
          ],
        },
      ],
    },
    zh: {
      title: "个性化 AI 界面的缓存失效",
      excerpt:
        "个性化 AI 界面为速度缓存嵌入、补全与 UI 片段——然后把错误答案送给错误用户。失效必须跟踪身份、权益与提示版本，而不仅是 TTL。",
      description:
        "Staff 工程师如何为个性化 AI UI 做缓存失效：键设计、租户隔离、感知权益的清除、流式 partial，以及尽早发现跨用户泄漏的指标。",
      sections: [
        {
          heading: "个性化让 TTL 不够用",
          paragraphs: [
            "通用页面缓存按时间过期。个性化 AI UI 在用户、角色、套餐、功能开关、检索文档或提示版本变化时过期——即使时钟显示条目仍新鲜。仅按路由建键的 60 秒 TTL 仍可能泄漏另一租户的补全，或展示已撤销权益。",
            "说清缓存什么：原始模型输出、渲染 markdown、侧栏嵌入向量或边缘 HTML 壳。每层需要不同的键与清除策略。"
          ],
        },
        {
          heading: "设计编码权限的键",
          paragraphs: [
            "在缓存键中包含租户 id、用户或会话范围、权益哈希，以及内容或提示修订。优先用不透明哈希而非拼接 PII。语义缓存要求租户作用域命名空间，使相似问题永不跨组织命中。",
            "在权限或套餐变更时，对受影响身份广播失效——而不是 thrash 整机群的全局冲洗。记录软删除用户在宽限期内是否仍可命中温条目。"
          ],
          points: [
            "按租户、身份范围、权益哈希与提示/内容修订建键",
            "按租户为语义缓存建命名空间；永不跨组织共享相似度索引",
            "在授权与套餐事件上清除，而不仅是写入时间戳",
            "对跨租户键冲突与发布后异常命中率告警"
          ],
        },
        {
          heading: "流式与 partial 让清除更复杂",
          paragraphs: [
            "AI UI 常把 token 流到同时从 CDN 或 service worker 注水的客户端。决定 partial 流是否可缓存。若只缓存完整答案，记录中途取消与工具调用修订如何避免存下半真半假。",
            "Stale-while-revalidate 可能在一个请求周期内掩盖权益撤销。对高风险表面——计费、医疗、法律——在渲染前做显式再验证。"
          ],
        },
        {
          heading: "在生产中证明隔离",
          paragraphs: [
            "加入金丝雀检查，尝试通过键猜测与相似度搜索拉取另一租户的缓存补全。监控权限系统部署后的命中率悬崖。AI UI 中的缓存缺陷是隐私事件，而不只是 UX 毛刺。",
            "速度重要，但正确的个性化才是产品。失效策略应与提示进入同一设计评审。"
          ],
          links: [
            {
              label: "MDN — HTTP caching",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
            },
            {
              label: "Vercel — Caching",
              url: "https://vercel.com/docs/infrastructure/data-cache",
            },
            {
              label: "Cloudflare — Cache purge",
              url: "https://developers.cloudflare.com/cache/how-to/purge-cache/",
            },
          ],
        },
      ],
    },
    ja: {
      title: "パーソナライズAI UIのキャッシュ無効化",
      excerpt:
        "パーソナライズAIサーフェスは速度のため埋め込み・補完・UI断片をキャッシュし—誤ったユーザーに誤った答えを出します。無効化はTTLだけでなく、身元・権利・プロンプト版を追跡しなければなりません。",
      description:
        "スタッフエンジニアがパーソナライズAI UIのキャッシュをどう無効化するか：キー設計、テナント分離、権利対応バスト、ストリーミングパーシャル、クロスユーザー漏洩を早期に捉える指標。",
      sections: [
        {
          heading: "パーソナライズはTTLを不十分にする",
          paragraphs: [
            "汎用ページキャッシュは時間で期限切れになります。パーソナライズAI UIはユーザー、役割、プラン、フィーチャーフラグ、取得文書、プロンプト版が変わると期限切れになります—時計が新鮮と言っても。ルートのみをキーにした60秒TTLでも別テナントの補完を漏らしたり、取り消された権利を見せたりできます。",
            "何をキャッシュするか名付けてください：生モデル出力、レンダリング済みmarkdown、サイドバー用埋め込みベクトル、エッジHTMLシェル。層ごとにキーとバスト戦略が違います。"
          ],
        },
        {
          heading: "権限を符号化するキーを設計する",
          paragraphs: [
            "キャッシュキーにテナントID、ユーザーまたはセッション範囲、権利ハッシュ、コンテンツ/プロンプト改訂を含めます。PII連結より不透明ハッシュを好みます。セマンティックキャッシュではテナントスコープの名前空間を必須にし、似た質問が組織をまたいで当たらないようにします。",
            "権限やプラン変更時は影響を受けた身元向けに無効化をブロードキャストします—艦隊をスラッシュするグローバルフラッシュではなく。ソフト削除ユーザーが猶予期間中に温エントリにまだ当たれるかを文書化します。"
          ],
          points: [
            "テナント、身元範囲、権利ハッシュ、プロンプト/コンテンツ改訂でキー付け",
            "セマンティックキャッシュをテナントごとに名前空間化；類似度インデックスを組織間で共有しない",
            "書き込みタイムスタンプだけでなく認可・プランイベントでバスト",
            "クロステナントキー衝突とリリース後の予期せぬヒット率にアラート"
          ],
        },
        {
          heading: "ストリーミングとパーシャルがバストを難しくする",
          paragraphs: [
            "AI UIはしばしばトークンを、CDNやサービスワーカーからもハイドレートするクライアントへストリームします。パーシャルストリームをキャッシュ可能にするかを決めます。完了回答のみキャッシュするなら、途中キャンセルとツール呼び出し改訂が半真実を保存しない方法を文書化します。",
            "Stale-while-revalidateは権利取り消しを1リクエスト周期隠せます。課金・医療・法務など高リスク面では描画前の明示的再検証を好みます。"
          ],
        },
        {
          heading: "本番で分離を証明する",
          paragraphs: [
            "キー推測と類似検索で別テナントのキャッシュ補完を取ろうとするカナリアを追加します。権限システムデプロイ後のヒット率の崖を監視します。AI UIのキャッシュバグはUXの不具合ではなくプライバシー事故です。",
            "速度は重要ですが正しいパーソナライズがプロダクトです。無効化ポリシーはプロンプトと同じ設計レビューに属します。"
          ],
          links: [
            {
              label: "MDN — HTTP caching",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
            },
            {
              label: "Vercel — Caching",
              url: "https://vercel.com/docs/infrastructure/data-cache",
            },
            {
              label: "Cloudflare — Cache purge",
              url: "https://developers.cloudflare.com/cache/how-to/purge-cache/",
            },
          ],
        },
      ],
    },
  },
};
