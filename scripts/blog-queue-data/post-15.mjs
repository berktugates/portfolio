export default {
  slug: "designing-human-escalation-queues-for-agents",
  title: "Designing Human Escalation Queues for Agents",
  excerpt:
    "Agents that never escalate look autonomous until they silently fail users. Escalation queues need triage rules, context packs, SLAs, and feedback loops—not a generic 'talk to a human' button bolted onto a chat UI.",
  description:
    "Staff-level design for human-in-the-loop escalation from AI agents: when to escalate, how to package context, queue routing, SLA ownership, and closing the loop so agents learn from resolutions.",
  readingMinutes: 7,
  keywords: [
    "human-in-the-loop",
    "AI agent escalation",
    "support queues",
    "agent handoff",
    "HITL workflows",
    "AI operations",
  ],
  socialThreadTr: [
    "Hiç escalate etmeyen ajan özerk görünür—ta ki kullanıcıyı sessizce düşürünceye kadar. Kuyruk, bağlam paketi ve SLA şart. 🧵",
    "Triage, yönlendirme ve geri bildirim döngüsü. Detay: https://berktugberke.com/tr/blogs/designing-human-escalation-queues-for-agents",
  ],
  sections: [
    {
      heading: "Escalate on policy, not on vibes",
      paragraphs: [
        "Define escalation triggers as explicit policies: low confidence on high-stakes intents, tool failures after N retries, user request for a human, regulatory keywords, and spend or permission boundaries the agent must not cross. Ambiguous 'when it feels stuck' heuristics produce either alert fatigue or silent dead-ends.",
        "Separate soft assist—agent keeps drafting while a human reviews—from hard stop, where the agent freezes side effects until approval. Product, risk, and support must sign the matrix per surface."
      ],
    },
    {
      heading: "Ship a context pack, not a raw transcript",
      paragraphs: [
        "Humans waste minutes reconstructing why the agent stopped. Package the user goal, last tool results, proposed next action, confidence signals, and what the agent already promised. Redact secrets; keep enough evidence for audit.",
        "Route by skill and authority: billing disputes, security incidents, and account recovery should not share one undifferentiated inbox. Include priority and customer tier so queue ordering matches business policy."
      ],
      points: [
        "Publish an escalation trigger matrix signed by product and risk",
        "Attach structured context packs with goals, tools, and proposed actions",
        "Route by skill, authority, and severity—not a single catch-all queue",
        "Measure time-to-first-human and resolution quality, not only ticket volume"
      ],
    },
    {
      heading: "Make the handoff bidirectional",
      paragraphs: [
        "When a human resolves a case, feed the outcome back: corrected facts, approved playbooks, and whether the agent may resume. Without that loop, every similar case escalates again and your cost curve never bends.",
        "Expose agent state transitions in the operator UI—pending, waiting on human, resumed, closed—so support does not fight a parallel chat the agent still thinks it owns."
      ],
    },
    {
      heading: "Operate queues like reliability work",
      paragraphs: [
        "Track backlog age, abandon rates, and false escalations. Spike after a model or prompt change usually means calibration broke, not that users suddenly need more humans. Rehearse peak load and after-hours coverage before marketing agent autonomy.",
        "Human escalation is a product feature with an ops budget. Design it with the same rigor as the agent that feeds it."
      ],
      links: [
        {
          label: "LangGraph — Human-in-the-loop",
          url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
        },
        {
          label: "OpenAI — Agents handoffs",
          url: "https://platform.openai.com/docs/guides/agents#handoffs",
        },
        {
          label: "Anthropic — Human feedback patterns",
          url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview",
        },
      ],
    },
  ],
  locales: {
    tr: {
      title: "Ajanlar için İnsan Escalation Kuyrukları Tasarlamak",
      excerpt:
        "Hiç escalate etmeyen ajanlar özerk görünür—ta ki kullanıcıyı sessizce düşürünceye kadar. Escalation kuyrukları triage kuralları, bağlam paketleri, SLA ve geri bildirim ister; sohbete yapıştırılmış genel 'insana bağlan' düğmesi değil.",
      description:
        "AI ajanlarından human-in-the-loop escalation için staff seviyesi tasarım: ne zaman escalate, bağlam nasıl paketlenir, kuyruk yönlendirme, SLA sahipliği ve çözümlerden ajanın öğrendiği döngüyü kapatmak.",
      sections: [
        {
          heading: "Hisle değil, politikayla escalate edin",
          paragraphs: [
            "Escalation tetiklerini açık politika olarak tanımlayın: yüksek riskli intent'te düşük güven, N retry sonrası tool hatası, kullanıcının insan istemesi, düzenleyici anahtar kelimeler ve ajanın aşmaması gereken harcama/izin sınırları. Belirsiz 'takılmış gibi hissedince' sezgileri ya alarm yorgunluğu ya da sessiz çıkmaz üretir.",
            "Soft assist—insan incelerken ajan taslak tutmaya devam eder—ile hard stop'u ayırın: ajan yan etkileri onaylanana kadar dondurur. Ürün, risk ve destek yüzey başına matrisi imzalamalıdır."
          ],
        },
        {
          heading: "Ham transcript değil, bağlam paketi gönderin",
          paragraphs: [
            "İnsanlar ajanın neden durduğunu yeniden kurmak için dakikalar kaybeder. Kullanıcı hedefini, son tool sonuçlarını, önerilen sonraki aksiyonu, güven sinyallerini ve ajanın zaten ne vaat ettiğini paketleyin. Gizlileri redakte edin; denetim için yeterli kanıt bırakın.",
            "Beceri ve yetkiye göre yönlendirin: faturalama uyuşmazlıkları, güvenlik olayları ve hesap kurtarma tek ayrışmamış inbox paylaşmamalı. Öncelik ve müşteri katmanını ekleyin ki kuyruk sırası iş politikasıyla eşleşsin."
          ],
          points: [
            "Ürün ve risk imzalı escalation tetik matrisi yayınlayın",
            "Hedef, tool ve önerilen aksiyonlarla yapılandırılmış bağlam paketleri ekleyin",
            "Tek catch-all kuyruk değil; beceri, yetki ve şiddete göre yönlendirin",
            "Yalnızca ticket hacmini değil, time-to-first-human ve çözüm kalitesini ölçün"
          ],
        },
        {
          heading: "Handoff'u çift yönlü yapın",
          paragraphs: [
            "İnsan bir vakayı çözünce sonucu geri besleyin: düzeltilmiş gerçekler, onaylı playbook'lar ve ajanın devam edip edemeyeceği. Bu döngü olmadan benzer her vaka yine escalate olur ve maliyet eğrisi hiç kırılmaz.",
            "Operatör UI'sında ajan durum geçişlerini gösterin—bekliyor, insan bekliyor, devam etti, kapandı—ki destek, ajanın hâlâ sahip sandığı paralel sohbetle savaşmasın."
          ],
        },
        {
          heading: "Kuyrukları güvenilirlik işi gibi işletin",
          paragraphs: [
            "Backlog yaşını, terk oranlarını ve yanlış escalation'ları izleyin. Model veya prompt değişiminden sonra ani artış genelde kullanıcıların birden fazla insan istemesi değil, kalibrasyonun bozulmasıdır. Ajan özerkliğini pazarlamadan önce peak yük ve mesai dışı kapsama prova edin.",
            "İnsan escalation'ı ops bütçeli bir ürün özelliğidir. Besleyen ajanla aynı titizlikle tasarlayın."
          ],
          links: [
            {
              label: "LangGraph — Human-in-the-loop",
              url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
            },
            {
              label: "OpenAI — Agents handoffs",
              url: "https://platform.openai.com/docs/guides/agents#handoffs",
            },
            {
              label: "Anthropic — Human feedback patterns",
              url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview",
            },
          ],
        },
      ],
    },
    de: {
      title: "Human-Escalation-Queues für Agents designen",
      excerpt:
        "Agents die nie eskalieren wirken autonom—bis sie Nutzer still scheitern lassen. Escalation-Queues brauchen Triage-Regeln, Context-Packs, SLAs und Feedback-Loops—keinen generischen 'mit Mensch sprechen'-Button am Chat.",
      description:
        "Staff-Level Design für Human-in-the-Loop-Escalation von AI-Agents: wann eskalieren, wie Kontext packen, Queue-Routing, SLA-Ownership und den Loop schließen damit Agents aus Resolutions lernen.",
      sections: [
        {
          heading: "Nach Policy eskalieren, nicht nach Vibes",
          paragraphs: [
            "Definieren Sie Escalation-Trigger als explizite Policies: niedrige Confidence bei high-stakes Intents, Tool-Failures nach N Retries, Nutzerwunsch nach einem Menschen, regulatorische Keywords und Spend-/Permission-Grenzen die der Agent nicht überschreiten darf. Mehrdeutige 'wenn es stuck wirkt'-Heuristiken erzeugen Alert-Fatigue oder stille Sackgassen.",
            "Trennen Sie Soft Assist—Agent schreibt weiter während ein Mensch reviewed—von Hard Stop, wo der Agent Side Effects bis zur Freigabe friert. Produkt, Risk und Support müssen die Matrix pro Surface signieren."
          ],
        },
        {
          heading: "Context-Pack liefern, kein Raw-Transcript",
          paragraphs: [
            "Menschen verschwenden Minuten damit zu rekonstruieren warum der Agent stoppte. Packen Sie Nutzerziel, letzte Tool-Results, vorgeschlagene Next Action, Confidence-Signale und was der Agent schon versprochen hat. Secrets redaktieren; genug Evidence für Audit behalten.",
            "Routen Sie nach Skill und Authority: Billing-Disputes, Security-Incidents und Account-Recovery sollten nicht eine undifferenzierte Inbox teilen. Priority und Customer-Tier einbeziehen damit Queue-Ordering Business-Policy matcht."
          ],
          points: [
            "Escalation-Trigger-Matrix mit Produkt- und Risk-Sign-off publizieren",
            "Strukturierte Context-Packs mit Goals, Tools und Proposed Actions anhängen",
            "Nach Skill, Authority und Severity routen—keine Catch-all-Queue",
            "Time-to-first-human und Resolution-Qualität messen, nicht nur Ticket-Volumen"
          ],
        },
        {
          heading: "Handoff bidirektional machen",
          paragraphs: [
            "Wenn ein Mensch einen Case resolved, Outcome zurückspeisen: korrigierte Fakten, genehmigte Playbooks und ob der Agent fortsetzen darf. Ohne diesen Loop eskaliert jeder ähnliche Case erneut und die Kostenkurve biegt sich nie.",
            "Agent-State-Transitions in der Operator-UI exponieren—pending, waiting on human, resumed, closed—damit Support nicht gegen einen parallelen Chat kämpft den der Agent noch besitzt."
          ],
        },
        {
          heading: "Queues wie Reliability-Arbeit betreiben",
          paragraphs: [
            "Backlog-Age, Abandon-Rates und False Escalations tracken. Spike nach Model- oder Prompt-Change bedeutet meist kaputte Calibration—nicht plötzlich mehr Menschenbedarf. Peak-Load und After-Hours-Coverage rehearsen bevor Agent-Autonomie vermarktet wird.",
            "Human Escalation ist ein Produktfeature mit Ops-Budget. Designen Sie es mit derselben Strenge wie den speisenden Agent."
          ],
          links: [
            {
              label: "LangGraph — Human-in-the-loop",
              url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
            },
            {
              label: "OpenAI — Agents handoffs",
              url: "https://platform.openai.com/docs/guides/agents#handoffs",
            },
            {
              label: "Anthropic — Human feedback patterns",
              url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview",
            },
          ],
        },
      ],
    },
    fr: {
      title: "Concevoir des files d'escalade humaine pour les agents",
      excerpt:
        "Les agents qui n'escaladent jamais semblent autonomes—jusqu'à faire échouer les utilisateurs en silence. Les files d'escalade exigent règles de triage, context packs, SLA et boucles de feedback—pas un bouton générique 'parler à un humain' collé au chat.",
      description:
        "Conception staff pour l'escalade human-in-the-loop depuis des agents IA : quand escalader, comment empaqueter le contexte, routage de file, ownership des SLA et fermer la boucle pour que les agents apprennent des résolutions.",
      sections: [
        {
          heading: "Escalader sur la politique, pas sur le feeling",
          paragraphs: [
            "Définissez les déclencheurs d'escalade comme des politiques explicites : faible confiance sur intents à fort enjeu, échecs d'outils après N retries, demande utilisateur d'un humain, mots-clés réglementaires et limites de dépense ou permission que l'agent ne doit pas franchir. Les heuristiques ambiguës 'quand ça semble bloqué' produisent fatigue d'alertes ou impasses silencieuses.",
            "Séparez soft assist—l'agent continue de rédiger pendant qu'un humain review—de hard stop, où l'agent gèle les effets de bord jusqu'à approbation. Produit, risque et support doivent signer la matrice par surface."
          ],
        },
        {
          heading: "Livrer un context pack, pas un transcript brut",
          paragraphs: [
            "Les humains perdent des minutes à reconstruire pourquoi l'agent s'est arrêté. Empaquetez l'objectif utilisateur, derniers résultats d'outils, prochaine action proposée, signaux de confiance et ce que l'agent a déjà promis. Redactez les secrets ; gardez assez de preuves pour l'audit.",
            "Routez par compétence et autorité : litiges facturation, incidents sécurité et récupération de compte ne doivent pas partager une inbox indifférenciée. Incluez priorité et tier client pour que l'ordre de file suive la politique métier."
          ],
          points: [
            "Publier une matrice de déclencheurs signée produit et risque",
            "Attacher des context packs structurés avec objectifs, outils et actions proposées",
            "Router par skill, autorité et sévérité—pas une file fourre-tout",
            "Mesurer time-to-first-human et qualité de résolution, pas seulement le volume de tickets"
          ],
        },
        {
          heading: "Rendre le handoff bidirectionnel",
          paragraphs: [
            "Quand un humain résout un cas, renvoyez le résultat : faits corrigés, playbooks approuvés et si l'agent peut reprendre. Sans cette boucle, chaque cas similaire remonte et la courbe de coût ne fléchit jamais.",
            "Exposez les transitions d'état agent dans l'UI opérateur—pending, waiting on human, resumed, closed—pour que le support ne combatte pas un chat parallèle que l'agent croit encore posséder."
          ],
        },
        {
          heading: "Opérer les files comme du travail de fiabilité",
          paragraphs: [
            "Suivez âge du backlog, taux d'abandon et fausses escalades. Un pic après un changement de modèle ou de prompt signifie souvent une calibration cassée—pas un besoin soudain de plus d'humains. Répétez charge de pointe et couverture hors horaires avant de commercialiser l'autonomie agent.",
            "L'escalade humaine est une feature produit avec budget ops. Concevez-la avec la même rigueur que l'agent qui l'alimente."
          ],
          links: [
            {
              label: "LangGraph — Human-in-the-loop",
              url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
            },
            {
              label: "OpenAI — Agents handoffs",
              url: "https://platform.openai.com/docs/guides/agents#handoffs",
            },
            {
              label: "Anthropic — Human feedback patterns",
              url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview",
            },
          ],
        },
      ],
    },
    it: {
      title: "Progettare code di escalation umana per gli agent",
      excerpt:
        "Gli agent che non escalano mai sembrano autonomi—finché non fanno fallire gli utenti in silenzio. Le code di escalation richiedono regole di triage, context pack, SLA e feedback loop—non un generico pulsante 'parla con un umano' appiccicato alla chat.",
      description:
        "Design staff per l'escalation human-in-the-loop dagli agent AI: quando escalare, come impacchettare il contesto, routing della coda, ownership degli SLA e chiudere il loop così gli agent imparano dalle risoluzioni.",
      sections: [
        {
          heading: "Escalate sulla policy, non sul feeling",
          paragraphs: [
            "Definite i trigger di escalation come policy esplicite: bassa confidence su intent ad alto rischio, fallimenti tool dopo N retry, richiesta utente di un umano, keyword regolatorie e limiti di spesa o permesso che l'agent non deve superare. Euristiche ambigue 'quando sembra bloccato' producono alert fatigue o vicoli ciechi silenziosi.",
            "Separate soft assist—l'agent continua a bozzare mentre un umano reviewa—da hard stop, dove l'agent congela gli side effect fino all'approvazione. Prodotto, risk e support devono firmare la matrice per superficie."
          ],
        },
        {
          heading: "Spedite un context pack, non un transcript grezzo",
          paragraphs: [
            "Gli umani sprecano minuti a ricostruire perché l'agent si è fermato. Impacchettate obiettivo utente, ultimi risultati tool, prossima azione proposta, segnali di confidence e ciò che l'agent ha già promesso. Redigete i secret; lasciate prove sufficienti per l'audit.",
            "Instradate per skill e autorità: dispute di billing, incident di sicurezza e account recovery non devono condividere una inbox indifferenziata. Includete priorità e tier cliente così l'ordine di coda segue la policy di business."
          ],
          points: [
            "Pubblicare una matrice di trigger firmata da prodotto e risk",
            "Allegare context pack strutturati con goal, tool e azioni proposte",
            "Instradare per skill, autorità e severità—non una coda catch-all",
            "Misurare time-to-first-human e qualità di risoluzione, non solo volume ticket"
          ],
        },
        {
          heading: "Rendere l'handoff bidirezionale",
          paragraphs: [
            "Quando un umano risolve un caso, rimandate l'esito: fatti corretti, playbook approvati e se l'agent può riprendere. Senza quel loop ogni caso simile scala di nuovo e la curva dei costi non si piega mai.",
            "Esporre le transizioni di stato dell'agent nella UI operatore—pending, waiting on human, resumed, closed—così il support non combatte una chat parallela che l'agent crede ancora di possedere."
          ],
        },
        {
          heading: "Operare le code come lavoro di reliability",
          paragraphs: [
            "Tracciare età del backlog, tassi di abbandono e false escalation. Spike dopo un cambio di modello o prompt di solito significa calibrazione rotta—non improvviso bisogno di più umani. Provare carico di picco e copertura fuori orario prima di commercializzare l'autonomia agent.",
            "L'escalation umana è una feature di prodotto con budget ops. Progettatela con lo stesso rigore dell'agent che la alimenta."
          ],
          links: [
            {
              label: "LangGraph — Human-in-the-loop",
              url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
            },
            {
              label: "OpenAI — Agents handoffs",
              url: "https://platform.openai.com/docs/guides/agents#handoffs",
            },
            {
              label: "Anthropic — Human feedback patterns",
              url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview",
            },
          ],
        },
      ],
    },
    zh: {
      title: "为智能体设计人工升级队列",
      excerpt:
        "从不升级的智能体看似自主——直到默默让用户失败。升级队列需要分诊规则、上下文包、SLA 与反馈闭环——而不是贴在聊天上的通用「找人工」按钮。",
      description:
        "从 AI 智能体做 human-in-the-loop 升级的 staff 级设计：何时升级、如何打包上下文、队列路由、SLA 归属，以及闭环让智能体从处置中学习。",
      sections: [
        {
          heading: "按策略升级，不按感觉",
          paragraphs: [
            "把升级触发写成明确策略：高风险意图上的低置信度、N 次重试后的工具失败、用户要求人工、监管关键词，以及智能体不得越过的支出或权限边界。模糊的「感觉卡住了」启发式只会带来告警疲劳或静默死胡同。",
            "区分软协助——人工审阅时智能体继续起草——与硬停止，即副作用冻结直至批准。产品、风险与支持须按表面签署矩阵。"
          ],
        },
        {
          heading: "交付上下文包，而非原始转录",
          paragraphs: [
            "人工会浪费数分钟重建智能体为何停下。打包用户目标、最近工具结果、建议的下一步、置信信号，以及智能体已承诺的内容。脱敏秘密；保留足够审计证据。",
            "按技能与权限路由：账单争议、安全事件与账户恢复不应共享一个未分化收件箱。包含优先级与客户层级，使排队顺序匹配业务策略。"
          ],
          points: [
            "发布经产品与风险签署的升级触发矩阵",
            "附带含目标、工具与建议动作的结构化上下文包",
            "按技能、权限与严重度路由——不是单一兜底队列",
            "衡量首次人工响应时间与处置质量，而不只是工单量"
          ],
        },
        {
          heading: "让交接双向进行",
          paragraphs: [
            "人工解决案件后回传结果：更正事实、批准剧本，以及智能体是否可恢复。没有该闭环，每个相似案件会再次升级，成本曲线永不弯折。",
            "在操作员 UI 暴露智能体状态转换——pending、waiting on human、resumed、closed——避免支持与智能体仍以为自己拥有的并行聊天打架。"
          ],
        },
        {
          heading: "像可靠性工作一样运营队列",
          paragraphs: [
            "跟踪积压年龄、放弃率与误升级。模型或提示变更后的尖峰通常意味着校准坏了——不是用户突然更需要人工。在营销智能体自主性之前演练峰值负载与非工作时间覆盖。",
            "人工升级是带运维预算的产品功能。用喂养它的智能体同等严谨来设计。"
          ],
          links: [
            {
              label: "LangGraph — Human-in-the-loop",
              url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
            },
            {
              label: "OpenAI — Agents handoffs",
              url: "https://platform.openai.com/docs/guides/agents#handoffs",
            },
            {
              label: "Anthropic — Human feedback patterns",
              url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview",
            },
          ],
        },
      ],
    },
    ja: {
      title: "エージェント向けヒューマンエスカレーションキューの設計",
      excerpt:
        "一度もエスカレーションしないエージェントは自律的に見えます—ユーザーを静かに失敗させるまで。エスカレーションキューにはトリアージ規則、コンテキストパック、SLA、フィードバックループが必要で、チャットに貼った汎用の「人と話す」ボタンではありません。",
      description:
        "AIエージェントからの human-in-the-loop エスカレーションのスタッフ級設計：いつ上げるか、コンテキストの梱包、キュールーティング、SLAオーナーシップ、解決からエージェントが学ぶループを閉じる方法。",
      sections: [
        {
          heading: "感覚ではなくポリシーでエスカレートする",
          paragraphs: [
            "エスカレーショントリガーを明示ポリシーとして定義します：高リスク意図での低信頼度、N回リトライ後のツール失敗、ユーザーの人間要求、規制キーワード、エージェントが越えてはならない支出・権限境界。曖昧な「詰まっている感じ」ヒューリスティックはアラート疲れか静かな行き止まりを生みます。",
            "ソフトアシスト—人間がレビュー中もエージェントが下書きを続ける—とハードストップ—副作用を承認まで凍結—を分けます。プロダクト・リスク・サポートがサーフェスごとにマトリクスに署名する必要があります。"
          ],
        },
        {
          heading: "生のトランスクリプトではなくコンテキストパックを送る",
          paragraphs: [
            "人間はエージェントが止まった理由を再構築するために何分も浪費します。ユーザー目標、直近のツール結果、提案する次アクション、信頼シグナル、エージェントが既に約束したことを梱包します。秘密は伏せ、監査に足る証拠は残します。",
            "スキルと権限でルーティングします：請求紛争、セキュリティインシデント、アカウント復旧は未分化の一つの受信箱を共有すべきではありません。優先度と顧客ティアを含め、キュー順序がビジネスポリシーと一致するようにします。"
          ],
          points: [
            "プロダクトとリスク署名済みのエスカレーショントリガーマトリクスを公開",
            "目標・ツール・提案アクション付きの構造化コンテキストパックを添付",
            "スキル・権限・重大度でルーティング—キャッチオールキューにしない",
            "チケット量だけでなく time-to-first-human と解決品質を計測"
          ],
        },
        {
          heading: "ハンドオフを双方向にする",
          paragraphs: [
            "人間がケースを解決したら結果を戻します：訂正された事実、承認済みプレイブック、エージェントが再開してよいか。このループがなければ似たケースはまた上がり、コスト曲線は曲がりません。",
            "オペレーターUIにエージェント状態遷移—pending、waiting on human、resumed、closed—を出し、サポートがエージェントがまだ所有していると思っている並行チャットと戦わないようにします。"
          ],
        },
        {
          heading: "キューを信頼性業務のように運用する",
          paragraphs: [
            "バックログ年齢、放棄率、誤エスカレーションを追跡します。モデルやプロンプト変更後のスパイクは多くの場合、急に人間が必要になったのではなくキャリブレーション崩れです。エージェント自律性を売り出す前にピーク負荷と時間外カバレッジをリハーサルしてください。",
            "ヒューマンエスカレーションは運用予算付きのプロダクト機能です。供給するエージェントと同じ厳しさで設計してください。"
          ],
          links: [
            {
              label: "LangGraph — Human-in-the-loop",
              url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
            },
            {
              label: "OpenAI — Agents handoffs",
              url: "https://platform.openai.com/docs/guides/agents#handoffs",
            },
            {
              label: "Anthropic — Human feedback patterns",
              url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview",
            },
          ],
        },
      ],
    },
  },
};
