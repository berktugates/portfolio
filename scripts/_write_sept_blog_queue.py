#!/usr/bin/env python3
import json
from pathlib import Path

QUEUE = Path(__file__).resolve().parent.parent / "content" / "blog-queue"


def loc(title, excerpt, description, headings, paras, points, links):
    sections = []
    for i, h in enumerate(headings):
        s = {"heading": h, "paragraphs": paras[i]}
        if i == 1:
            s["points"] = points
        if i == 3:
            s["links"] = links
        sections.append(s)
    return {"title": title, "excerpt": excerpt, "description": description, "sections": sections}


def en_sections(h1, p1, h2, p2, points, h3, p3, h4, p4, links):
    return [
        {"heading": h1, "paragraphs": p1},
        {"heading": h2, "paragraphs": p2, "points": points},
        {"heading": h3, "paragraphs": p3},
        {"heading": h4, "paragraphs": p4, "links": links},
    ]


def write_post(filename, body):
    path = QUEUE / filename
    path.write_text(json.dumps(body, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(path.name)


# POST 1
links1 = [
    {"label": "OpenTelemetry — Semantic conventions", "url": "https://opentelemetry.io/docs/specs/semconv/"},
    {"label": "MDN — Server-sent events", "url": "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events"},
    {"label": "Vercel AI SDK — Streaming", "url": "https://sdk.vercel.ai/docs/ai-sdk-core/streaming"},
]
pts1 = [
    "Separate metrics for provider TTFT versus your gateway overhead",
    "Track client disconnect rate and whether billing still accrues",
    "Sample full transcripts for eval, not for default metrics cardinality",
    "Alert on rising stall gaps before hard timeouts fire",
]
write_post(
    "2026-09-18-observability-for-streaming-llm-responses.json",
    {
        "slug": "observability-for-streaming-llm-responses",
        "title": "Observability for Streaming LLM Responses",
        "excerpt": "Time-to-first-token and partial output change how users judge quality. If your traces stop at the HTTP boundary, you are flying blind through the longest part of the request.",
        "description": "Staff-engineer patterns for observability on streaming LLM responses: span models for SSE, token and latency budgets, client disconnect semantics, quality signals mid-stream, and dashboards that separate model from product regressions.",
        "readingMinutes": 7,
        "keywords": ["LLM observability", "streaming responses", "OpenTelemetry", "SSE", "AI product metrics", "production LLM"],
        "socialThreadTr": [
            "Streaming yanıtta kalite algısı ilk tokenden başlar. Trace HTTP sınırında bitiyorsa, isteğin en uzun kısmında körsünüz. 🧵",
            "Span modeli, TTFT, disconnect ve mid-stream sinyaller. Detay: https://berktugberke.com/tr/blogs/observability-for-streaming-llm-responses",
        ],
        "sections": en_sections(
            "Streaming is a different failure surface",
            [
                "Batch inference hides latency behind a single completion event. Streaming exposes partial failure: slow first token, stalled chunks, truncated JSON, or a confident preamble before a policy violation. Product teams feel these as 'the assistant froze' long before your error rate spikes.",
                "Treat the stream as a first-class workload. Instrument from client render through gateway, router, model provider, and tool side effects. A trace that ends when headers return misses the user-visible story.",
            ],
            "Span the stream, not only the socket",
            [
                "Model one trace per user turn with child spans for retrieval, routing, first token, tool calls, and finalization. Record time-to-first-token (TTFT), inter-chunk gaps, total tokens, and whether the client aborted mid-flight.",
                "Propagate trace context through SSE or WebSocket frames where your stack allows. When it cannot, correlate with a stable turn id and log structured events at chunk boundaries so you can reconstruct stall points without storing full prompts in logs.",
            ],
            pts1,
            "Quality signals belong in the same timeline",
            [
                "Attach lightweight checks as the stream progresses: citation coverage, refusal patterns, tool-call shape, or retrieval hit rate. You do not need to block every chunk—aggregate signals at end-of-stream for dashboards and at thresholds for automatic degrade.",
                "Compare streaming cohorts to batch baselines when you A/B route models. A model that wins on final BLEU can lose on perceived speed if TTFT regresses. Observability should make that trade visible to product, not only to infra.",
            ],
            "Operate streams like a product SLO",
            [
                "Define SLOs on TTFT p95, stall-free completion rate, and successful tool finalization—not only 5xx rate. Runbooks should distinguish provider brownouts, prompt bloat, retrieval timeouts, and client network loss.",
                "Streaming observability is how AI products earn the right to feel instant. Measure the experience users actually see, or you will optimize the wrong graph while churn quietly rises.",
            ],
            links1,
        ),
        "locales": {
            "tr": loc(
                "Streaming LLM Yanıtları için Observability",
                "İlk token süresi ve kısmi çıktı kalite algısını değiştirir. Trace'leriniz HTTP sınırında bitiyorsa, isteğin en uzun kısmında körsünüz.",
                "Streaming LLM yanıtlarında observability için staff mühendis kalıpları: SSE span modelleri, token ve gecikme bütçeleri, client disconnect semantiği, akış ortası kalite sinyalleri ve model ile ürün regresyonlarını ayıran panolar.",
                [
                    "Streaming farklı bir hata yüzeyidir",
                    "Yalnızca soketi değil, akışı span'leyin",
                    "Kalite sinyalleri aynı zaman çizgisinde olmalı",
                    "Akışları ürün SLO'su gibi işletin",
                ],
                [
                    [
                        "Batch çıkarım gecikmeyi tek tamamlanma olayının arkasına gizler. Streaming kısmi hatayı açığa çıkarır: yavaş ilk token, takılan chunk'lar, kesik JSON veya politika ihlalinden önce gelen kendinden emin giriş.",
                        "Akışı birinci sınıf iş yükü sayın. Client render'dan gateway, router, model sağlayıcı ve tool yan etkilerine kadar ölçün.",
                    ],
                    [
                        "Kullanıcı turu başına bir trace modelleyin; retrieval, routing, ilk token, tool çağrıları ve finalize için child span'ler ekleyin.",
                        "Stack izin verdiğinde trace context'i SSE veya WebSocket frame'leri boyunca taşıyın; değilse stabil turn id ile chunk sınırında yapılandırılmış olaylar loglayın.",
                    ],
                    [
                        "Akış ilerlerken hafif kontroller ekleyin: atıf kapsamı, red kalıpları, tool-call şekli veya retrieval isabet oranı.",
                        "Modelleri A/B yönlendirirken streaming kohortlarını batch baz çizgileriyle karşılaştırın; TTFT regresyonu algılanan hızı bozar.",
                    ],
                    [
                        "TTFT p95, takılmadan tamamlanma oranı ve başarılı tool finalize üzerine SLO tanımlayın.",
                        "Streaming observability, kullanıcının gerçekten gördüğü deneyimi ölçmeden anında hissettirme hakkını kazanamazsınız.",
                    ],
                ],
                [
                    "Sağlayıcı TTFT ile gateway ek yükünü ayrı metrikleyin",
                    "Client disconnect oranını ve faturalamanın sürüp sürmediğini izleyin",
                    "Eval için tam transkript örnekleyin, varsayılan kardinalite için değil",
                    "Sert timeout'lardan önce artan stall aralıklarına alarm kurun",
                ],
                links1,
            ),
            "de": loc(
                "Observability für gestreamte LLM-Antworten",
                "Time-to-first-token und Teiloutput ändern die Qualitätswahrnehmung. Enden Traces an der HTTP-Grenze, fliegen Sie blind durch den längsten Teil der Anfrage.",
                "Staff-Engineer-Muster für Observability bei gestreamten LLM-Antworten: Span-Modelle für SSE, Token- und Latenz-Budgets, Client-Disconnect-Semantik und Dashboards die Modell- von Produkt-Regressionen trennen.",
                [
                    "Streaming ist eine andere Failure-Oberfläche",
                    "Den Stream spannen, nicht nur den Socket",
                    "Qualitätssignale gehören auf dieselbe Timeline",
                    "Streams wie ein Produkt-SLO betreiben",
                ],
                [
                    [
                        "Batch-Inferenz versteckt Latenz hinter einem Completion-Event. Streaming legt Teilfehler offen: langsames erstes Token, stockende Chunks oder abgeschnittenes JSON.",
                        "Behandeln Sie den Stream als First-Class-Workload von Client-Render bis Tool-Nebenwirkungen.",
                    ],
                    [
                        "Ein Trace pro User-Turn mit Child-Spans für Retrieval, Routing, First Token, Tools und Finalisierung.",
                        "Trace-Context durch SSE/WebSocket propagieren oder mit stabiler Turn-ID an Chunk-Grenzen korrelieren.",
                    ],
                    [
                        "Leichte Checks während des Streams: Zitationsabdeckung, Refusal-Muster, Tool-Form, Retrieval-Treffer.",
                        "Streaming-Kohorten mit Batch-Baselines bei A/B-Routing vergleichen.",
                    ],
                    [
                        "SLOs auf TTFT p95, stall-freie Completion und Tool-Finalisierung definieren.",
                        "Messen Sie die nutzersichtbare Erfahrung, nicht nur 5xx.",
                    ],
                ],
                [
                    "Provider-TTFT und Gateway-Overhead getrennt metrieren",
                    "Client-Disconnect-Rate und Billing-Fortlauf tracken",
                    "Volle Transkripte für Eval sampeln",
                    "Stall-Gaps vor harten Timeouts alarmieren",
                ],
                links1,
            ),
            "fr": loc(
                "Observabilité des réponses LLM en streaming",
                "Le time-to-first-token change la perception qualité. Si vos traces s'arrêtent à HTTP, vous volez à l'aveugle pendant la plus longue partie de la requête.",
                "Patterns staff engineer : spans SSE, budgets token/latence, déconnexion client, signaux mid-stream et tableaux de bord séparant régressions modèle et produit.",
                [
                    "Le streaming est une surface d'échec différente",
                    "Span le flux, pas seulement le socket",
                    "Les signaux qualité sur la même timeline",
                    "Exploiter les streams comme SLO produit",
                ],
                [
                    [
                        "L'inférence batch cache la latence. Le streaming expose échecs partiels : premier token lent, chunks bloqués, JSON tronqué.",
                        "Instrumentez du rendu client aux effets de bord outils.",
                    ],
                    [
                        "Une trace par tour avec spans enfants pour retrieval, routage, premier token, outils, finalisation.",
                        "Propagez le contexte via SSE/WebSocket ou corrélez avec un turn id stable.",
                    ],
                    [
                        "Contrôles légers en cours de stream : citations, refus, forme d'appel outil, hit retrieval.",
                        "Comparez cohortes streaming et baselines batch en A/B.",
                    ],
                    [
                        "SLO sur TTFT p95, complétion sans stall, finalisation outil.",
                        "Mesurez l'expérience visible, pas seulement les 5xx.",
                    ],
                ],
                [
                    "Métriques séparées TTFT fournisseur vs gateway",
                    "Taux de déconnexion client et facturation",
                    "Transcriptions complètes échantillonnées pour eval",
                    "Alertes sur gaps de stall avant timeouts",
                ],
                links1,
            ),
            "it": loc(
                "Observability per risposte LLM in streaming",
                "Time-to-first-token e output parziale cambiano il giudizio sulla qualità. Trace che finiscono a HTTP lasciano ciechi nella parte più lunga.",
                "Pattern staff engineer: span SSE, budget token/latenza, disconnect client, segnali mid-stream e dashboard che separano regressioni modello e prodotto.",
                [
                    "Lo streaming è una superficie di failure diversa",
                    "Span lo stream, non solo il socket",
                    "Segnali qualità sulla stessa timeline",
                    "Operare gli stream come SLO di prodotto",
                ],
                [
                    [
                        "L'inferenza batch nasconde la latenza. Lo streaming espone failure parziali: primo token lento, chunk bloccati, JSON troncato.",
                        "Strumenta dal render client agli effetti collaterali tool.",
                    ],
                    [
                        "Una trace per turno con span figli per retrieval, routing, primo token, tool, finalizzazione.",
                        "Propaga contesto via SSE/WebSocket o correla con turn id stabile.",
                    ],
                    [
                        "Controlli leggeri in stream: citazioni, rifiuti, forma tool-call, hit retrieval.",
                        "Confronta cohort streaming con baseline batch in A/B.",
                    ],
                    [
                        "SLO su TTFT p95, completamento senza stall, finalizzazione tool.",
                        "Misura l'esperienza che l'utente vede davvero.",
                    ],
                ],
                [
                    "Metriche separate TTFT provider vs gateway",
                    "Tasso disconnect client e fatturazione",
                    "Trascrizioni complete per eval",
                    "Allerta su gap di stall prima dei timeout",
                ],
                links1,
            ),
            "zh": loc(
                "流式 LLM 响应的可观测性",
                "首 token 时间与部分输出改变质量判断。追踪在 HTTP 边界结束意味着在最长一段请求中盲目飞行。",
                "流式 LLM 可观测性模式：SSE span、token 与延迟预算、客户端断开语义、流中质量信号，以及区分模型与产品回归的看板。",
                ["流式是不同的失败面", "为流建 span", "质量信号在同一时间线", "像产品 SLO 运营流"],
                [
                    ["批式推理隐藏延迟。流式暴露部分失败：首 token 慢、块停滞、JSON 截断。", "从客户端渲染到工具副作用全程埋点。"],
                    ["每轮一条追踪，子 span 覆盖检索、路由、首 token、工具与收尾。", "通过 SSE/WebSocket 传播上下文，或用稳定 turn id 在块边界关联。"],
                    ["流中轻量检查：引用、拒绝、工具形态、检索命中。", "A/B 时将流式人群与批式基线对比。"],
                    ["在 TTFT p95、无停滞完成、工具收尾上定义 SLO。", "测量用户真正看到的体验。"],
                ],
                ["分开提供商 TTFT 与网关开销", "跟踪客户端断开与计费", "评测抽样完整转录", "硬超时前对停滞间隔告警"],
                links1,
            ),
            "ja": loc(
                "ストリーミングLLM応答の可観測性",
                "初回トークンと部分出力は品質の見え方を変えます。HTTP境界でトレースが終わると最長区間を盲目で飛ばします。",
                "SSEスパン、トークン/レイテンシ予算、クライアント切断、ストリーム途中の品質シグナル、モデルとプロダクト回帰を分けるダッシュボード。",
                ["ストリーミングは別の失敗面", "ストリームをスパンする", "品質シグナルは同じタイムライン", "ストリームをプロダクトSLOとして運用"],
                [
                    ["バッチ推論はレイテンシを隠す。ストリーミングは部分失敗を露わにする。", "クライアント描画からツール副作用まで計測。"],
                    ["ターンごとに1トレース、取得・ルーティング・初トークン・ツール・終了の子スパン。", "SSE/WebSocketでコンテキスト伝播、またはturn idで相関。"],
                    ["ストリーム中の軽量チェック：引用、拒否、ツール形状、取得ヒット。", "A/Bでストリーミングコホートとバッチ基準を比較。"],
                    ["TTFT p95、停滞なし完了、ツール終了でSLO定義。", "ユーザーが見る体験を測る。"],
                ],
                ["プロバイダTTFTとゲートウェイを分離", "クライアント切断と課金を追跡", "評価用に全文サンプル", "ハードタイムアウト前に停滞ギャップをアラート"],
                links1,
            ),
        },
    },
)

def pack_locales2(links, points):
    headings_tr = ["Mobil gecikme kalıcı bir kısıttır", "Sürümü sözleşmede tutun", "Release ve destekle koordine edin", "Kesmeden önce skew ölçün"]
    paras_tr = [
        ["Mağaza incelemesi, MDM dondurmaları ve güncellemeyi yok sayan kullanıcılar API'nizin birden fazla istemci neslini aynı anda sunmasını gerektirir.", "En eski desteklenen uygulama sürümünü birinci sınıf tüketici sayın."],
        ["Açık API epoch'ları (header veya path) kullanın; istemci build kimliğini her istekte göndersin.", "Alanları ölçülü deprecation olmadan kaldırmayın; sunset ipuçlarını yapılandırılmış hatalarda döndürün."],
        ["API sunset'lerini uygulama içi güncelleme ve destek makrolarıyla eşleyin.", "CI'da en eski desteklenen client bundle ile sözleşme testleri çalıştırın."],
        ["Aktif uygulama sürümlerini API epoch kullanımına karşı panoda izleyin.", "Disiplinli sürümleme, mobil'i rehin almadan backend geliştirmenizi sağlar."],
    ]
    return {
        "tr": loc("Mobil İstemcilerin Kullandığı Genel API'leri Sürümlemek", "Mobil haftalık deploy etmez; API sürümleme bunu yok sayarsa üretim kırılır.", "Mobil tüketen genel API'ler için epoch, additive evrim, zorunlu güncelleme guardrail'leri ve skew telemetrisi.", headings_tr, paras_tr, points, links),
        "de": loc("Versionierung öffentlicher APIs für Mobile Clients", "Mobile Clients deployen nicht wöchentlich; ignoriert Ihre API-Versionierung das, brechen Sie Produktion.", "Epoch-Header, additive Evolution, Upgrade-Guardrails und Deprecation-Telemetrie für Mobile APIs.", ["Mobile Verzögerung ist dauerhaft", "Version in Verträgen", "Mit Release und Support koordinieren", "Skew messen vor Cut"], [["App Store und MDM bedeuten mehrere Client-Generationen parallel.", "Älteste unterstützte App-Version ist First-Class."], ["Explizite API-Epochen und Build-Identität pro Request.", "Felder nicht ohne Deprecation entfernen."], ["Sunsets mit In-App-Upgrade koppeln.", "Contract-Tests auf ältestem Bundle."], ["Dashboard Versionen vs Epochen.", "Vorhersagbare Evolution statt Chaos."]], points, links),
        "fr": loc("Versionner les API publiques pour clients mobiles", "Les clients mobiles ne déploient pas chaque semaine; ignorer cela casse la prod.", "Époques d'API, évolution additive, garde-fous de mise à jour et télémétrie de dépréciation.", ["Le décalage mobile est permanent", "Versionner par contrat", "Coordonner release et support", "Mesurer le skew avant coupure"], [["Review store et MDM imposent plusieurs générations clients.", "La plus vieille version supportée est un consommateur de premier plan."], ["Époques explicites et identité de build par requête.", "Pas de retrait de champs sans dépréciation mesurée."], ["Sunsets avec upgrade in-app.", "Tests de contrat sur le plus vieux bundle."], ["Tableaux de bord versions vs époques.", "Évolution prévisible."]], points, links),
        "it": loc("Versionare API pubbliche per client mobile", "I client mobile non deployano ogni settimana; ignorarlo rompe la produzione.", "Epoche API, evoluzione additiva, guardrail di upgrade e telemetria deprecazione.", ["Il lag mobile è permanente", "Versione nel contratto", "Coordinare release e supporto", "Misurare lo skew prima del taglio"], [["Review store e MDM richiedono più generazioni client.", "La versione app più vecchia supportata è first-class."], ["Epoche esplicite e build identity per richiesta.", "Non rimuovere campi senza deprecazione."], ["Sunset con upgrade in-app.", "Contract test sul bundle più vecchio."], ["Dashboard versioni vs epoche.", "Evoluzione prevedibile."]], points, links),
        "zh": loc("面向移动客户端的公共 API 版本化", "移动客户端无法每周发布；忽视这一点会打爆生产。", "API 纪元、加法演进、强制升级护栏与废弃遥测。", ["移动滞后是长期约束", "用契约承载版本", "与发布和支持协同", "切断前测量偏斜"], [["应用商店与 MDM 意味着多代客户端并存。", "最旧支持版本是一等消费者。"], ["显式 API 纪元与每次请求的构建身份。", "无度量废弃期不删字段。"], ["下线与应用内升级配对。", "CI 跑最旧 bundle 契约测试。"], ["看板对比版本与纪元。", "可预测的演进。"]], points, links),
        "ja": loc("モバイルクライアント向け公開APIのバージョニング", "モバイルは毎週デプロイできない。無視すると本番が壊れる。", "APIエポック、加法進化、アップグレードガードレール、非推奨テレメトリ。", ["モバイル遅延は恒常的制約", "契約でバージョン管理", "リリースとサポートと調整", "切断前にスキュー計測"], [["ストア審査とMDMは複数世代の併存を意味する。", "最古サポート版を第一級消費者に。"], ["明示的エポックとリクエスト毎のビルドID。", "測定された非推奨なしにフィールド削除しない。"], ["サンセットとアプリ内アップグレードを連動。", "最古バンドルで契約テスト。"], ["バージョンとエポックのダッシュボード。", "予測可能な進化。"]], points, links),
    }


# POST 2
links2 = [
    {"label": "Stripe — API versioning", "url": "https://stripe.com/docs/api/versioning"},
    {"label": "Microsoft — REST API guidelines", "url": "https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md"},
    {"label": "Apple — App Store review guidelines", "url": "https://developer.apple.com/app-store/review/guidelines/"},
]
pts2 = [
    "Publish a mobile compatibility matrix with minimum app versions per API epoch",
    "Treat breaking changes as contract events with sunset dates in responses",
    "Run shadow traffic from oldest supported app builds in CI",
    "Instrument version skew: which app builds hit deprecated fields",
]
write_post(
    "2026-09-19-versioning-public-apis-used-by-mobile-clients.json",
    {
        "slug": "versioning-public-apis-used-by-mobile-clients",
        "title": "Versioning Public APIs Used by Mobile Clients",
        "excerpt": "Mobile clients ship on human timelines. If your API versioning story assumes everyone refreshes weekly, you will break production users who cannot update until the store approves.",
        "description": "Staff-engineer guidance for versioning public APIs consumed by mobile clients: epoch headers, additive evolution, forced-upgrade guardrails, contract tests on oldest supported builds, and deprecation telemetry.",
        "readingMinutes": 7,
        "keywords": ["API versioning", "mobile clients", "backward compatibility", "REST API", "Expo", "release engineering"],
        "socialThreadTr": [
            "Mobil istemci haftalık deploy etmez; mağaza onayı insan zaman çizelgesindedir. API sürümleme hikâyeniz bunu yok sayıyorsa üretim kullanıcısını kırarsınız. 🧵",
            "Epoch, additive evrim, zorunlu güncelleme guardrail'leri ve skew telemetrisi. Detay: https://berktugberke.com/tr/blogs/versioning-public-apis-used-by-mobile-clients",
        ],
        "sections": en_sections(
            "Mobile lag is a permanent constraint",
            [
                "App store review, enterprise MDM freezes, and users who ignore updates mean your API must serve multiple client generations simultaneously. Web can hide behind a deploy; mobile cannot.",
                "Staff ownership treats oldest supported app version as a first-class consumer. Breaking changes are product decisions with sunset windows, not surprise 400s on Monday morning.",
            ],
            "Version in contracts, not in vibes",
            [
                "Prefer explicit API epochs via headers or path prefixes over implicit 'we deployed Friday.' Document what is additive, what is deprecated, and what requires a new epoch. Clients should send their build identity on every request so you can route, shadow, or block safely.",
                "Never remove fields without a measured deprecation period. Return sunset hints in structured error payloads and analytics events so product can message upgrades before hard cutoffs.",
            ],
            pts2,
            "Coordinate with release and support",
            [
                "Pair API sunsets with in-app upgrade prompts and support macros. Forced upgrade is a product lever—use it sparingly for security or irreversible data migrations, not for routine refactors.",
                "Contract tests should run against the oldest supported client bundle in CI, not only the latest main branch. Mobile API versioning is release engineering for users who cannot git pull.",
            ],
            "Measure skew before you cut",
            [
                "Dashboard active app versions against API epoch usage. Spikes in deprecated endpoints after a release often mean a client bug, not stubborn users.",
                "A disciplined versioning story lets you ship backend improvements without holding mobile hostage. The goal is predictable evolution, not infinite backward compatibility for dead builds.",
            ],
            links2,
        ),
def i18n(blocks, points, links):
    return {code: loc(b[0], b[1], b[2], b[3], b[4], points, links) for code, b in blocks.items()}


def para(*pairs):
    return [list(p) for p in pairs]


# POST 3
links3 = [
    {"label": "Detox — Getting started", "url": "https://wix.github.io/Detox/docs/introduction/getting-started/"},
    {"label": "Expo — E2E testing", "url": "https://docs.expo.dev/develop/development-builds/introduction/"},
    {"label": "Maestro — Mobile UI testing", "url": "https://maestro.mobile.dev/"},
]
pts3 = [
    "Reset app state and server fixtures deterministically between specs",
    "Stub network at the boundary; avoid sleeping on animations",
    "Quarantine flaky tests with owner and SLA, do not mute forever",
    "Run a subset on every PR, full matrix nightly on real devices",
]
blocks3 = {
    "tr": ("Expo Uygulamalarında Flaky E2E Testleri Azaltmak", "Flaky E2E güveni öldürür; retry maskesi değil deterministik kurulum ister.", "Expo'da flaky E2E'yi azaltma: deterministik fixture, ağ stub'ları, karantina politikası ve gerçek cihaz matrisi.", ["Flaky test bir ürün riskidir", "Zamanlayıcı değil sözleşme bekle", "Karantina disiplini", "CI'ı gerçekçi katmanla"], para(
        (["Animasyon ve ağ yarışları Expo E2E'de en sık kök nedenlerdir.", "Staff ekipler flake oranını release metriği sayar."],),
        (["Sabit test kullanıcıları ve bilinen backend durumu kullanın.", "sleep yerine görünürlük ve API yanıtı bekleyin."],),
        (["Flaky testleri sahipsiz retry ile sonsuza kadar susturmayın.", "Sahip ve düzeltme SLA'sı olan karantina listesi tutun."],),
        (["Her PR'da smoke, gece tam matris.", "Gerçek cihazda Metro ve native modül farklarını yakalayın."],),
    )),
    "de": ("Flaky E2E-Tests in Expo-Apps reduzieren", "Flaky E2E tötet Vertrauen; Retries sind kein Setup.", "Deterministische Fixtures, Netzwerk-Stubs, Quarantäne und Device-Matrix für Expo E2E.", ["Flaky ist Produktrisiko", "Auf Vertrag warten", "Quarantäne-Disziplin", "CI realistisch schichten"], para(
        (["Animation und Netzwerk-Races sind häufige Ursachen.", "Flake-Rate ist Release-Metrik."],),
        (["Feste Testnutzer und bekannte Backend-Zustände.", "Kein sleep—auf Sichtbarkeit warten."],),
        (["Keine endlosen Retries ohne Owner.", "Quarantäne mit SLA."],),
        (["Smoke pro PR, volle Matrix nachts.", "Echte Geräte für Native-Unterschiede."],),
    )),
    "fr": ("Réduire les tests E2E flaky dans Expo", "Les E2E flaky tuent la confiance; les retries ne remplacent pas un setup déterministe.", "Fixtures déterministes, stubs réseau, quarantaine et matrice appareils pour Expo.", ["Le flaky est un risque produit", "Attendre le contrat", "Discipline de quarantaine", "CI en couches réalistes"], para(
        (["Courses animation/réseau sont fréquentes.", "Le taux de flake est métrique release."],),
        (["Utilisateurs test fixes et état backend connu.", "Pas de sleep—attendre visibilité."],),
        (["Pas de retry infini sans owner.", "Quarantaine avec SLA."],),
        (["Smoke à chaque PR, matrice complète la nuit.", "Vrais appareils pour écarts natifs."],),
    )),
    "it": ("Ridurre test E2E flaky in app Expo", "E2E flaky uccide la fiducia; i retry non sostituiscono setup deterministico.", "Fixture deterministiche, stub di rete, quarantena e matrice dispositivi per Expo.", ["Flaky è rischio prodotto", "Aspettare il contratto", "Disciplina quarantena", "CI a strati realistici"], para(
        (["Race di animazione e rete sono cause comuni.", "Il flake rate è metrica di release."],),
        (["Utenti test fissi e stato backend noto.", "Niente sleep—attendere visibilità."],),
        (["Niente retry infiniti senza owner.", "Quarantena con SLA."],),
        (["Smoke ogni PR, matrice piena di notte.", "Dispositivi reali per gap nativi."],),
    )),
    "zh": ("减少 Expo 应用中的不稳定 E2E 测试", "不稳定 E2E 摧毁信心；重试不能替代确定性环境。", "Expo E2E：确定性夹具、网络桩、隔离纪律与真机矩阵。", ["不稳定是产品风险", "等契约而非计时", "隔离纪律", "分层 CI"], para(
        (["动画与网络竞态是常见根因。", "flake 率应是发布指标。"],),
        (["固定测试用户与已知后端状态。", "用可见性等待而非 sleep。"],),
        (["勿无限重试无主测试。", "有 SLA 的隔离列表。"],),
        (["每 PR 冒烟，夜间全矩阵。", "真机覆盖原生差异。"],),
    )),
    "ja": ("ExpoアプリでフレーキーE2Eを減らす", "フレーキーE2Eは信頼を壊す。リトライは決定的セットアップの代わりにならない。", "決定的フィクスチャ、ネットワークスタブ、隔離規律、実機マトリクス。", ["フレーキーはプロダクトリスク", "契約を待つ", "隔離の規律", "現実的なCI層"], para(
        (["アニメーションとネットワーク競合が典型。", "フレーク率はリリース指標。"],),
        (["固定テストユーザーと既知のバックエンド状態。", "sleepではなく可視性を待つ。"],),
        (["オーナーなし無限リトライ禁止。", "SLA付き隔離リスト。"],),
        (["PRごとにスモーク、夜間フルマトリクス。", "実機でネイティブ差分を捕捉。"],),
    )),
}
write_post(
    "2026-09-20-reducing-flaky-e2e-tests-in-expo-apps.json",
    {
        "slug": "reducing-flaky-e2e-tests-in-expo-apps",
        "title": "Reducing Flaky E2E Tests in Expo Apps",
        "excerpt": "A green CI badge means nothing if engineers rerun the pipeline until luck strikes. Flaky mobile E2E is a product risk signal, not a nuisance ticket.",
        "description": "Practical staff-engineer tactics to reduce flaky end-to-end tests in Expo apps: deterministic fixtures, network stubs, quarantine policy, and a realistic device matrix in CI.",
        "readingMinutes": 7,
        "keywords": ["Expo E2E", "Detox", "Maestro", "mobile testing", "flaky tests", "CI reliability"],
        "socialThreadTr": [
            "Yeşil CI rozeti şansla üçüncü rerun'da geliyorsa güven yoktur. Expo E2E flake bir gürültü değil, ürün risk sinyalidir. 🧵",
            "Deterministik fixture, ağ stub'ı, karantina ve cihaz matrisi. Detay: https://berktugberke.com/tr/blogs/reducing-flaky-e2e-tests-in-expo-apps",
        ],
        "sections": en_sections(
            "Flaky E2E is a trust problem",
            [
                "Animation races, Metro reload timing, and real network dependencies turn mobile E2E into a lottery. Teams that 'just retry' teach themselves to ignore red builds until a release is blocked.",
                "Staff engineers track flake rate like error budget: visible, owned, and trending down. Reliability of the test system is part of shipping confidence for Expo products.",
            ],
            "Wait on contracts, not clocks",
            [
                "Use fixed test accounts, seeded data, and known API responses. Stub HTTP at the client boundary when the goal is UI flow, not backend integration—reserve a smaller integration suite for cross-service truth.",
                "Replace arbitrary sleeps with visibility and network idle predicates from your runner. If a test needs a five-second sleep, it is documenting a missing synchronization contract.",
            ],
            pts3,
            "Quarantine with discipline",
            [
                "Move flaky specs to a quarantine job with an owner and fix-by date. Unlimited retries in the main pipeline hide debt and burn CI minutes.",
                "When a quarantined test fails consistently, that is progress—it is now deterministic enough to debug.",
            ],
            "Layer CI realistically",
            [
                "Run a fast smoke suite on every pull request; run the full device matrix nightly or pre-release. Emulators catch logic; real devices catch keyboard, push permissions, and native module edge cases.",
                "Reducing flake is how Expo teams keep shipping weekly without pretending mobile is just small web.",
            ],
            links3,
        ),
        "locales": i18n(blocks3, pts3, links3),
    },
)

# POST 4
links4 = [
    {"label": "GDPR — Storage limitation", "url": "https://gdpr-info.eu/art-5-gdpr/"},
    {"label": "Snowplow — Data retention", "url": "https://docs.snowplow.io/docs/understanding-your-pipeline/retention/"},
    {"label": "Amplitude — Data governance", "url": "https://amplitude.com/docs/data/data-governance"},
]
pts4 = [
    "Define event tiers: product analytics vs audit vs model training",
    "Use aggregated rollups before deleting raw events",
    "Document lawful basis and deletion SLAs per data class",
    "Make retention config code-reviewed like schema migrations",
]
blocks4 = {
    "tr": ("Ürün Analitiğini Mümkün Kılan Veri Saklama Politikaları", "Saklama yasal zorunluluk; analitik ise ürün kararı. İkisini aynı çöp kutusuna atmayın.", "Ham olayları silip özetleri koruyarak analitiği sürdüren saklama: katmanlar, rollup, hukuki dayanak ve gözlemlenebilir silme.", ["Saklama ürün yüzeyidir", "Katmanlı olay sınıfları", "Rollup ile hafıza", "Operasyonel disiplin"], para(
        (["Her şeyi sonsuza kadar tutmak ölçek ve hukuk riski; her şeyi silmek trend körleştirir.", "Staff ekipler veri sınıflarına göre politika yazar."],),
        (["Ürün analitiği, denetim ve model eğitimi aynı TTL'i paylaşmamalı.", "PII ile anonim metrikleri ayırın."],),
        (["Ham olayları silmeden önce haftalık/aylık rollup üretin.", "Funnel ve kohort soruları özetlerde cevaplanabilmeli."],),
        (["Saklama config'i şema migrasyonu gibi review edilsin.", "Silme işlerini metrikleyin; sessiz boşluklar analitik sürprizidir."],),
    )),
    "de": ("Datenaufbewahrung die Produktanalytik ermöglicht", "Aufbewahrung ist Compliance; Analytik ist Produkt. Nicht alles in eine TTL.", "Schichten, Rollups, Rechtsgrundlage und beobachtbare Löschung statt Alles-oder-Nichts.", ["Retention ist Produktfläche", "Gestufte Event-Tiers", "Rollups vor Löschung", "Operative Disziplin"], para(
        (["Alles für immer skaliert und riskiert Recht.", "Alles löschen macht blind."],),
        (["Analytics, Audit, Training getrennte TTLs.", "PII von anonymen Metriken trennen."],),
        (["Rollups vor Rohdaten-Löschung.", "Funnels auf Aggregaten."],),
        (["Retention wie Schema reviewen.", "Deletion jobs metrieren."],),
    )),
    "fr": ("Politiques de rétention compatibles analytics produit", "La rétention est compliance; l'analytics est produit.", "Couches, rollups, base légale et suppression observable.", ["La rétention est surface produit", "Tiers d'événements", "Rollups avant suppression", "Discipline opérationnelle"], para(
        (["Tout garder scale et juridique; tout effacer aveugle.", "Politiques par classe de données."],),
        (["Analytics, audit, entraînement: TTL distincts.", "Séparer PII et métriques anonymes."],),
        (["Rollups avant suppression brute.", "Entonnoirs sur agrégats."],),
        (["Config reviewée comme schéma.", "Métriquer les jobs de suppression."],),
    )),
    "it": ("Politiche di retention che abilitano product analytics", "Retention è compliance; analytics è prodotto.", "Strati, rollup, base legale e cancellazione osservabile.", ["Retention è superficie prodotto", "Tier di eventi", "Rollup prima della delete", "Disciplina operativa"], para(
        (["Tenere tutto scala e rischia; cancellare tutto acceca.", "Politiche per classe dati."],),
        (["Analytics, audit, training: TTL separati.", "Separare PII e metriche anonime."],),
        (["Rollup prima dei raw event.", "Funnel su aggregati."],),
        (["Config reviewata come schema.", "Metricare job di cancellazione."],),
    )),
    "zh": ("在合规前提下支撑产品分析的数据保留", "保留是合规，分析是产品，不能同一 TTL。", "分层、汇总、法律依据与可观测删除。", ["保留是产品面", "事件分层", "删除前汇总", "运营纪律"], para(
        (["永久保留有规模与法律风险；全删则失明。", "按数据类写政策。"],),
        (["分析、审计、训练分开 TTL。", "PII 与匿名指标分离。"],),
        (["删原始前先 rollup。", "漏斗在聚合上回答。"],),
        (["保留配置像 schema 一样评审。", "度量删除作业。"],),
    )),
    "ja": ("プロダクト分析を可能にするデータ保持ポリシー", "保持はコンプライアンス、分析はプロダクト。", "層、ロールアップ、法的根拠、可観測な削除。", ["保持はプロダクト面", "イベント階層", "削除前ロールアップ", "運用規律"], para(
        (["永久保持はスケールと法リスク。", "全削除は盲目。"],),
        (["分析・監査・学習でTTL分離。", "PIIと匿名指標を分離。"],),
        (["生削除前にロールアップ。", "ファネルは集計で。"],),
        (["保持設定をスキーマ同様レビュー。", "削除ジョブを計測。"],),
    )),
}
write_post(
    "2026-09-21-data-retention-policies-that-enable-product-analytics.json",
    {
        "slug": "data-retention-policies-that-enable-product-analytics",
        "title": "Data Retention Policies That Enable Product Analytics",
        "excerpt": "Keeping everything forever is a compliance and cost trap. Deleting everything is a product blindfold. Good retention design preserves the questions product still needs to ask.",
        "description": "How staff engineers design data retention that satisfies privacy while keeping product analytics useful: tiered events, rollups, lawful basis documentation, and observable deletion jobs.",
        "readingMinutes": 7,
        "keywords": ["data retention", "product analytics", "GDPR", "privacy engineering", "event pipelines", "data governance"],
        "socialThreadTr": [
            "Her şeyi sonsuza saklamak hukuk ve maliyet tuzağı; her şeyi silmek ürünü kör eder. İyi saklama, hâlâ sorulacak soruları korur. 🧵",
            "Katmanlı olaylar, rollup, hukuki dayanak ve gözlemlenebilir silme. Detay: https://berktugberke.com/tr/blogs/data-retention-policies-that-enable-product-analytics",
        ],
        "sections": en_sections(
            "Retention is a product surface",
            [
                "Legal teams ask how long you keep personal data. Product teams ask whether last quarter's funnel still works. If one policy answers both with 'delete everything at 30 days,' you traded compliance theater for analytics amnesia.",
                "Staff engineers classify data by purpose and risk, then attach retention to each class with explicit owners—not a single TTL copied from a blog post.",
            ],
            "Tier events by purpose",
            [
                "Separate product analytics events from audit logs, support attachments, and model-training corpora. They have different lawful bases, deletion SLAs, and downstream consumers.",
                "Minimize identifiers in analytics tiers. Pseudonymous user keys with rotation beat shipping emails to your warehouse because it was convenient in v1.",
            ],
            pts4,
            "Roll up before you purge",
            [
                "Delete raw high-cardinality events on schedule while retaining weekly cohort rollups and feature adoption summaries that answer roadmap questions without resurrecting PII.",
                "Document which dashboards break when raw data ages out, and migrate those questions to aggregates before enforcement day.",
            ],
            "Operate deletion like migrations",
            [
                "Retention configuration should be version-controlled and reviewed. Deletion jobs need metrics: rows removed, failures, and lag. Silent gaps show up as mysterious metric cliffs in product reviews.",
                "Retention done well is a competitive advantage: you can tell users what you keep, why, and for how long—while still learning from behavior at scale.",
            ],
            links4,
        ),
        "locales": i18n(blocks4, pts4, links4),
    },
)
