export default {
  slug: "offline-first-sync-conflicts-in-mobile-apps",
  title: "Offline-First Sync Conflicts in Mobile Apps",
  excerpt:
    "Offline-first UX promises continuity; sync promises eventual consistency. Without explicit conflict models, users see duplicated actions, lost edits, and support tickets that reproduce only on airplanes.",
  description:
    "How staff engineers design offline-first sync for mobile: conflict types, CRDT vs last-write-wins, idempotent mutations, merge UX, and telemetry that proves sync health in the field.",
  readingMinutes: 7,
  keywords: [
    "offline-first",
    "mobile sync",
    "conflict resolution",
    "CRDT",
    "eventual consistency",
    "idempotent APIs",
  ],
  socialThreadTr: [
    "Offline-first UX süreklilik vaat eder; sync eventual consistency vaat eder. Açık çatışma modeli yoksa kullanıcı çift aksiyon ve kayıp düzenleme görür. 🧵",
    "Idempotent mutation, merge UX ve saha telemetrisi. Detay: https://berktugberke.com/tr/blogs/offline-first-sync-conflicts-in-mobile-apps",
  ],
  sections: [
    {
      heading: "Name the conflicts users will actually hit",
      paragraphs: [
        "Not every collision is a merge problem. Some are duplicate intents: tap 'pay' twice on a flaky tunnel, queue two transfers, and reconcile when connectivity returns. Others are true edits to the same field from two devices. Your sync layer needs separate strategies—idempotency keys for actions, structured merges for state.",
        "Staff teams document conflict classes per entity: append-only events, scalar fields with LWW, set unions, and 'human required' merges. If product cannot describe the desired outcome, engineering should not guess in the client."
      ],
    },
    {
      heading: "Prefer boring server rules with honest client UX",
      paragraphs: [
        "Last-write-wins is fine for low-stakes preferences; it is unacceptable for money, inventory, or medical notes without escalation. Expose server merge results with provenance: which device won, what was discarded, and how to undo when policy allows.",
        "Queue mutations with client-generated ids and retry-safe APIs. The server should recognize duplicates and return the original outcome instead of double-applying side effects."
      ],
      points: [
        "Idempotency keys on every user-visible mutation",
        "Per-entity conflict policy documented with product sign-off",
        "Conflict screens that show both versions, not silent overwrite",
        "Sync backlog metrics: queue depth, age, and failure rate by OS version"
      ],
    },
    {
      heading: "CRDTs when collaboration is the product",
      paragraphs: [
        "When multiple users edit shared artifacts in real time—whiteboards, shared lists, co-editing notes—CRDTs or operation-based OT can beat naive timestamps. The cost is complexity, testing burden, and harder support narratives. Adopt when offline collaboration is core value, not because the blog post sounded cool.",
        "Even with CRDTs, you still need authorization, compaction, and snapshot boundaries so clients do not replay unbounded history on cold start."
      ],
    },
    {
      heading: "Prove sync health outside the lab",
      paragraphs: [
        "Simulate airplane mode, clock skew, partial uploads, and app kills mid-queue. In production, sample conflict rates, merge failures, and user undo actions. Spikes after a release often mean a schema or policy change—not 'users offline more.'",
        "Offline-first is a reliability feature. Treat sync like payments: observable, owned, and rehearsed before marketing promises it everywhere."
      ],
      links: [
        {
          label: "Automerge — CRDT library",
          url: "https://automerge.org/docs/",
        },
        {
          label: "Apple — Syncing model data",
          url: "https://developer.apple.com/documentation/swiftdata/syncing-model-data-across-a-persons-devices",
        },
        {
          label: "Couchbase — Mobile sync",
          url: "https://docs.couchbase.com/sync-gateway/current/sync.html",
        },
      ],
    },
  ],
  locales: {
    tr: {
      title: "Mobil Uygulamalarda Offline-First Sync Çatışmaları",
      excerpt:
        "Offline-first UX süreklilik vaat eder; sync eventual consistency vaat eder. Açık çatışma modeli olmadan kullanıcı çift aksiyon, kayıp düzenleme ve yalnızca uçakta tekrarlayan destek kayıtları görür.",
      description:
        "Staff mühendisler mobilde offline-first sync'i nasıl tasarlar: çatışma türleri, CRDT vs last-write-wins, idempotent mutation'lar, merge UX ve sahada sync sağlığını kanıtlayan telemetri.",
      sections: [
        {
          heading: "Kullanıcıların gerçekten vuracağı çatışmaları adlandırın",
          paragraphs: [
            "Her çarpışma merge problemi değildir. Bazıları yinelenen niyettir: dalgalı tünelde 'öde'ye iki kez basmak, iki transfer kuyruğa almak ve bağlantı dönünce uzlaştırmak. Diğerleri iki cihazdan aynı alana gerçek düzenlemedir. Sync katmanınız ayrı stratejiler ister—aksiyonlar için idempotency key, durum için yapılandırılmış merge.",
            "Staff ekipleri varlık başına çatışma sınıflarını belgeler: yalnızca ekleme olayları, LWW skaler alanlar, küme birleşimleri ve 'insan gerekli' merge'ler. Ürün istenen sonucu tarif edemiyorsa mühendislik client'ta tahmin etmemelidir."
          ],
        },
        {
          heading: "Dürüst client UX ile sıkıcı sunucu kurallarını tercih edin",
          paragraphs: [
            "Last-write-wins düşük riskli tercihler için uygundur; yükseltme olmadan para, stok veya tıbbi notlar için kabul edilemez. Sunucu merge sonuçlarını provenance ile gösterin: hangi cihaz kazandı, ne atıldı, politika izin veriyorsa nasıl geri alınır.",
            "Client üretimli id'lerle mutation kuyruğu ve retry-safe API'ler kullanın. Sunucu kopyaları tanımalı ve yan etkiyi iki kez uygulamak yerine orijinal sonucu dönmelidir."
          ],
          points: [
            "Her kullanıcı görünür mutation'da idempotency key",
            "Ürün onayıyla belgelenmiş varlık başına çatışma politikası",
            "Sessiz üzerine yazma yerine her iki sürümü gösteren çatışma ekranları",
            "Sync backlog metrikleri: kuyruk derinliği, yaşı ve OS sürümüne göre hata oranı"
          ],
        },
        {
          heading: "İşbirliği ürünün kendisiyse CRDT",
          paragraphs: [
            "Birden fazla kullanıcı paylaşılan artefaktları gerçek zamanlı düzenlediğinde—tahtalar, listeler, ortak notlar—CRDT veya OT, naif zaman damgalarını yenebilir. Bedeli karmaşıklık, test yükü ve daha zor destek anlatılarıdır. Offline işbirliği çekirdek değer olduğunda benimseyin; blog hoş diye değil.",
            "CRDT ile bile yetkilendirme, compaction ve soğuk başlangıçta sınırsız geçmişi oynatmayan snapshot sınırları gerekir."
          ],
        },
        {
          heading: "Sync sağlığını laboratuvar dışında kanıtlayın",
          paragraphs: [
            "Uçak modu, saat kayması, kısmi yükleme ve kuyruk ortasında app kill simüle edin. Üretimde çatışma oranı, merge hatası ve kullanıcı geri alma aksiyonlarını örnekleyin. Yayın sonrası sıçrama çoğu zaman şema veya politika değişimidir—'kullanıcılar daha çok offline' değil.",
            "Offline-first bir güvenilirlik özelliğidir. Sync'i ödeme gibi ele alın: gözlemlenebilir, sahipli ve pazarlama her yerde vaat etmeden önce prova edilmiş."
          ],
          links: [
            {
              label: "Automerge — CRDT library",
              url: "https://automerge.org/docs/",
            },
            {
              label: "Apple — Syncing model data",
              url: "https://developer.apple.com/documentation/swiftdata/syncing-model-data-across-a-persons-devices",
            },
            {
              label: "Couchbase — Mobile sync",
              url: "https://docs.couchbase.com/sync-gateway/current/sync.html",
            },
          ],
        },
      ],
    },
    de: {
      title: "Offline-First-Sync-Konflikte in Mobile Apps",
      excerpt:
        "Offline-First-UX verspricht Kontinuität; Sync verspricht eventual consistency. Ohne explizite Konfliktmodelle sehen Nutzer doppelte Aktionen, verlorene Edits und Support-Tickets die nur im Flugzeug reproduzieren.",
      description:
        "Wie Staff Engineers Offline-First-Sync für Mobile designen: Konflikttypen, CRDT vs Last-Write-Wins, idempotente Mutationen, Merge-UX und Telemetrie die Sync-Gesundheit im Feld beweist.",
      sections: [
        {
          heading: "Benennen Sie Konflikte die Nutzer wirklich treffen",
          paragraphs: [
            "Nicht jede Kollision ist ein Merge-Problem. Manche sind doppelte Intents: zweimal 'bezahlen' im schwachen Tunnel, zwei Transfers in die Queue und abgleichen wenn Connectivity zurückkommt. Andere sind echte Edits am selben Feld von zwei Geräten. Ihre Sync-Schicht braucht getrennte Strategien—Idempotency Keys für Aktionen, strukturierte Merges für State.",
            "Staff-Teams dokumentieren Konfliktklassen pro Entity: append-only Events, skalare Felder mit LWW, Set-Unions und 'human required' Merges. Kann Produkt das gewünschte Ergebnis nicht beschreiben, soll Engineering nicht im Client raten."
          ],
        },
        {
          heading: "Langweilige Server-Regeln mit ehrlicher Client-UX",
          paragraphs: [
            "Last-Write-Wins ist ok für Low-Stakes-Preferences; inakzeptabel für Geld, Inventar oder medizinische Notizen ohne Escalation. Zeigen Sie Server-Merge-Ergebnisse mit Provenance: welches Gerät gewann, was verworfen wurde und wie Undo wenn Policy erlaubt.",
            "Queuen Sie Mutationen mit client-generierten IDs und retry-sicheren APIs. Der Server soll Duplikate erkennen und das ursprüngliche Ergebnis zurückgeben statt Side Effects doppelt anzuwenden."
          ],
          points: [
            "Idempotency Keys auf jeder nutzersichtbaren Mutation",
            "Pro-Entity-Konfliktpolicy mit Produkt-Sign-off dokumentiert",
            "Konflikt-Screens die beide Versionen zeigen, kein stilles Überschreiben",
            "Sync-Backlog-Metriken: Queue-Tiefe, Alter und Fehlerrate nach OS-Version"
          ],
        },
        {
          heading: "CRDTs wenn Kollaboration das Produkt ist",
          paragraphs: [
            "Wenn mehrere Nutzer geteilte Artefakte in Echtzeit bearbeiten—Whiteboards, Listen, Co-Editing—können CRDTs oder OT naive Timestamps schlagen. Kosten sind Komplexität, Testlast und schwierigere Support-Narrative. Adoptieren wenn Offline-Kollaboration Kernwert ist, nicht weil der Blog cool klang.",
            "Selbst mit CRDTs brauchen Sie Authorization, Compaction und Snapshot-Grenzen damit Clients bei Cold Start nicht unbounded History replayen."
          ],
        },
        {
          heading: "Sync-Gesundheit außerhalb des Labs beweisen",
          paragraphs: [
            "Simulieren Sie Flugmodus, Clock Skew, partielle Uploads und App-Kill mitten in der Queue. In Produktion Conflict Rates, Merge-Failures und User-Undo sampeln. Spikes nach einem Release bedeuten oft Schema- oder Policy-Change—nicht 'Nutzer mehr offline'.",
            "Offline-First ist ein Reliability-Feature. Behandeln Sie Sync wie Payments: beobachtbar, owned und geprobt bevor Marketing es überall verspricht."
          ],
          links: [
            {
              label: "Automerge — CRDT library",
              url: "https://automerge.org/docs/",
            },
            {
              label: "Apple — Syncing model data",
              url: "https://developer.apple.com/documentation/swiftdata/syncing-model-data-across-a-persons-devices",
            },
            {
              label: "Couchbase — Mobile sync",
              url: "https://docs.couchbase.com/sync-gateway/current/sync.html",
            },
          ],
        },
      ],
    },
    fr: {
      title: "Conflits de sync offline-first dans les apps mobiles",
      excerpt:
        "L'UX offline-first promet la continuité ; la sync promet la cohérence éventuelle. Sans modèles de conflit explicites, les utilisateurs voient des actions dupliquées, des edits perdus et des tickets qui ne se reproduisent qu'en avion.",
      description:
        "Comment les staff engineers conçoivent la sync offline-first mobile : types de conflits, CRDT vs last-write-wins, mutations idempotentes, UX de merge et télémétrie qui prouve la santé sync sur le terrain.",
      sections: [
        {
          heading: "Nommer les conflits que les utilisateurs rencontreront",
          paragraphs: [
            "Toute collision n'est pas un problème de merge. Certaines sont des intents dupliqués : taper 'payer' deux fois dans un tunnel instable, mettre deux virements en file et réconcilier au retour du réseau. D'autres sont de vraies edits du même champ depuis deux appareils. Votre couche sync a besoin de stratégies séparées—clés d'idempotence pour les actions, merges structurés pour l'état.",
            "Les équipes staff documentent les classes de conflit par entité : événements append-only, champs scalaires LWW, unions d'ensembles et merges 'humain requis'. Si le produit ne peut décrire le résultat voulu, l'ingénierie ne doit pas deviner côté client."
          ],
        },
        {
          heading: "Règles serveur ennuyeuses avec UX client honnête",
          paragraphs: [
            "Last-write-wins convient aux préférences à faible enjeu ; inacceptable pour l'argent, le stock ou les notes médicales sans escalade. Exposez les résultats de merge serveur avec provenance : quel appareil a gagné, quoi a été jeté, comment annuler si la politique le permet.",
            "Mettez les mutations en file avec des ids générés client et des APIs retry-safe. Le serveur doit reconnaître les doublons et renvoyer le résultat original au lieu d'appliquer deux fois les effets."
          ],
          points: [
            "Clés d'idempotence sur chaque mutation visible utilisateur",
            "Politique de conflit par entité documentée avec sign-off produit",
            "Écrans de conflit montrant les deux versions, pas d'écrasement silencieux",
            "Métriques de backlog sync : profondeur, âge et taux d'échec par version OS"
          ],
        },
        {
          heading: "CRDT quand la collaboration est le produit",
          paragraphs: [
            "Quand plusieurs utilisateurs éditent des artefacts partagés en temps réel—tableaux, listes, notes co-éditées—les CRDT ou OT peuvent battre des timestamps naïfs. Le coût est complexité, charge de test et récits support plus durs. Adoptez quand la collaboration offline est valeur cœur, pas parce que le blog était cool.",
            "Même avec CRDT, il faut autorisation, compaction et bornes de snapshot pour ne pas rejouer un historique illimité au cold start."
          ],
        },
        {
          heading: "Prouver la santé sync hors labo",
          paragraphs: [
            "Simulez mode avion, décalage d'horloge, uploads partiels et kill d'app en milieu de file. En prod, échantillonnez taux de conflit, échecs de merge et undo utilisateur. Les pics après release signifient souvent changement de schéma ou politique—pas 'plus d'offline'.",
            "Offline-first est une feature de fiabilité. Traitez la sync comme les paiements : observable, owned et répétée avant que le marketing la promette partout."
          ],
          links: [
            {
              label: "Automerge — CRDT library",
              url: "https://automerge.org/docs/",
            },
            {
              label: "Apple — Syncing model data",
              url: "https://developer.apple.com/documentation/swiftdata/syncing-model-data-across-a-persons-devices",
            },
            {
              label: "Couchbase — Mobile sync",
              url: "https://docs.couchbase.com/sync-gateway/current/sync.html",
            },
          ],
        },
      ],
    },
    it: {
      title: "Conflitti di sync offline-first nelle app mobile",
      excerpt:
        "L'UX offline-first promette continuità; la sync promette consistenza eventuale. Senza modelli di conflitto espliciti, gli utenti vedono azioni duplicate, edit persi e ticket che si riproducono solo in aereo.",
      description:
        "Come gli staff engineer progettano la sync offline-first mobile: tipi di conflitto, CRDT vs last-write-wins, mutazioni idempotenti, UX di merge e telemetria che prova la salute sync sul campo.",
      sections: [
        {
          heading: "Nominate i conflitti che gli utenti colpiranno davvero",
          paragraphs: [
            "Non ogni collisione è un problema di merge. Alcune sono intenti duplicati: tap 'paga' due volte in tunnel instabile, accodare due bonifici e riconciliare al ritorno della connettività. Altre sono vere edit allo stesso campo da due dispositivi. Il layer sync ha bisogno di strategie separate—chiavi di idempotenza per azioni, merge strutturati per lo stato.",
            "I team staff documentano classi di conflitto per entità: eventi append-only, campi scalari LWW, unioni di insiemi e merge 'umano richiesto'. Se il prodotto non descrive l'esito desiderato, l'engineering non deve indovinare sul client."
          ],
        },
        {
          heading: "Regole server noiose con UX client onesta",
          paragraphs: [
            "Last-write-wins va bene per preferenze a basso rischio; inaccettabile per denaro, inventario o note mediche senza escalation. Esponete risultati di merge server con provenance: quale dispositivo ha vinto, cosa è stato scartato, come annullare se la policy lo consente.",
            "Accodate mutazioni con id generati dal client e API retry-safe. Il server deve riconoscere i duplicati e restituire l'esito originale invece di applicare due volte gli effetti."
          ],
          points: [
            "Chiavi di idempotenza su ogni mutazione visibile all'utente",
            "Policy di conflitto per entità documentata con sign-off prodotto",
            "Schermate di conflitto che mostrano entrambe le versioni, non overwrite silenzioso",
            "Metriche backlog sync: profondità coda, età e tasso di errore per versione OS"
          ],
        },
        {
          heading: "CRDT quando la collaborazione è il prodotto",
          paragraphs: [
            "Quando più utenti editano artefatti condivisi in tempo reale—lavagne, liste, note co-edit—CRDT o OT possono battere timestamp naïf. Il costo è complessità, carico di test e narrative support più difficili. Adottate quando la collaborazione offline è valore core, non perché il blog sembrava figo.",
            "Anche con CRDT servono autorizzazione, compaction e limiti di snapshot per non riprodurre storia illimitata al cold start."
          ],
        },
        {
          heading: "Provare la salute sync fuori dal lab",
          paragraphs: [
            "Simulate modalità aereo, skew dell'orologio, upload parziali e kill dell'app a metà coda. In produzione campionate tassi di conflitto, fallimenti di merge e undo utente. Picchi dopo un release spesso significano cambio schema o policy—non 'più offline'.",
            "Offline-first è una feature di affidabilità. Trattate la sync come i pagamenti: osservabile, owned e provata prima che il marketing la prometta ovunque."
          ],
          links: [
            {
              label: "Automerge — CRDT library",
              url: "https://automerge.org/docs/",
            },
            {
              label: "Apple — Syncing model data",
              url: "https://developer.apple.com/documentation/swiftdata/syncing-model-data-across-a-persons-devices",
            },
            {
              label: "Couchbase — Mobile sync",
              url: "https://docs.couchbase.com/sync-gateway/current/sync.html",
            },
          ],
        },
      ],
    },
    zh: {
      title: "移动应用中的离线优先同步冲突",
      excerpt:
        "离线优先 UX 承诺连续性；同步承诺最终一致性。没有明确的冲突模型，用户会看到重复操作、丢失编辑，以及只在飞机上才能复现的工单。",
      description:
        "Staff 工程师如何设计移动离线优先同步：冲突类型、CRDT 与最后写入胜出、幂等变更、合并 UX，以及证明现场同步健康的遥测。",
      sections: [
        {
          heading: "命名用户会真实遇到的冲突",
          paragraphs: [
            "并非每次碰撞都是合并问题。有些是重复意图：在不稳定隧道里点两次「支付」、排队两笔转账，连通后 reconcile。另一些是两台设备对同一字段的真实编辑。同步层需要不同策略——动作用幂等键，状态用结构化合并。",
            "Staff 团队按实体记录冲突类别：仅追加事件、LWW 标量字段、集合并集与「需人工」合并。若产品无法描述期望结果，工程不应在客户端猜测。"
          ],
        },
        {
          heading: "无聊的服务端规则与诚实的客户端体验",
          paragraphs: [
            "最后写入胜出适合低风险偏好；对金钱、库存或医疗记录若无升级则不可接受。展示带来源的服务端合并结果：哪台设备胜出、丢弃了什么、政策允许时如何撤销。",
            "用客户端生成的 id 排队变更，API 可安全重试。服务端应识别重复并返回原结果，而非双重应用副作用。"
          ],
          points: [
            "每个用户可见变更带幂等键",
            "经产品签字的按实体冲突策略文档",
            "冲突界面展示两版内容，而非静默覆盖",
            "同步积压指标：队列深度、年龄与按 OS 版本的失败率"
          ],
        },
        {
          heading: "协作即产品时再用 CRDT",
          paragraphs: [
            "多人实时编辑共享对象——白板、列表、共编笔记——时，CRDT 或 OT 可胜过天真时间戳。代价是复杂度、测试负担与更难的支持叙事。仅在离线协作是核心价值时采用，而非因为博客很酷。",
            "即使用 CRDT，仍需要授权、压缩与快照边界，避免冷启动回放无限历史。"
          ],
        },
        {
          heading: "在实验室外证明同步健康",
          paragraphs: [
            "模拟飞行模式、时钟偏移、部分上传与队列中途杀进程。在生产采样冲突率、合并失败与用户撤销。发布后尖峰常意味模式或策略变更——不是「用户更常离线」。",
            "离线优先是可靠性能力。像支付一样对待同步：可观测、有归属，并在营销到处承诺前演练。"
          ],
          links: [
            {
              label: "Automerge — CRDT library",
              url: "https://automerge.org/docs/",
            },
            {
              label: "Apple — Syncing model data",
              url: "https://developer.apple.com/documentation/swiftdata/syncing-model-data-across-a-persons-devices",
            },
            {
              label: "Couchbase — Mobile sync",
              url: "https://docs.couchbase.com/sync-gateway/current/sync.html",
            },
          ],
        },
      ],
    },
    ja: {
      title: "モバイルアプリのオフライン優先同期コンフリクト",
      excerpt:
        "オフライン優先UXは継続性を約束し、同期は結果整合性を約束します。明示的なコンフリクトモデルがないと、ユーザーは重複アクション、失われた編集、機内でのみ再現するサポートチケットを見ます。",
      description:
        "スタッフエンジニアがモバイルのオフライン優先同期を設計する方法：コンフリクト種別、CRDT対ラストライトウィン、冪等ミューテーション、マージUX、現場で同期健全性を証明するテレメトリ。",
      sections: [
        {
          heading: "ユーザーが実際に当たるコンフリクトに名前を付ける",
          paragraphs: [
            "すべての衝突がマージ問題ではありません。重複意図もあります：不安定なトンネルで「支払い」を二度タップし、二つの振込をキューし、接続復帰時に調整する。別のデバイスから同じフィールドへの本当の編集もあります。同期層には別戦略が必要です—アクション用の冪等キー、状態用の構造化マージ。",
            "スタッフチームはエンティティごとにコンフリクトクラスを文書化します：追記のみイベント、LWWスカラー、集合和、「人間必須」マージ。プロダクトが望む結果を説明できないなら、クライアントで推測すべきではありません。"
          ],
        },
        {
          heading: "正直なクライアントUXと退屈なサーバールール",
          paragraphs: [
            "ラストライトウィンは低リスク設定には十分；エスカレーションなしの金銭・在庫・医療メモには不可。どのデバイスが勝ち、何が捨てられ、ポリシーが許せばどう取り消すかの出所付きでサーバーマージ結果を見せます。",
            "クライアント生成IDでミューテーションをキューし、リトライ安全APIを使います。サーバーは重複を認識し、副作用を二重適用せず元の結果を返すべきです。"
          ],
          points: [
            "ユーザー可視の各ミューテーションに冪等キー",
            "プロダクト署名付きのエンティティ別コンフリクト方針",
            "両バージョンを見せるコンフリクト画面、静かな上書きではない",
            "同期バックログ指標：キュー深さ、経過時間、OS版別失敗率"
          ],
        },
        {
          heading: "コラボがプロダクトならCRDT",
          paragraphs: [
            "複数ユーザーがリアルタイムで共有成果物を編集する—ホワイトボード、リスト、共同メモ—とき、CRDTやOTは素朴なタイムスタンプに勝てます。コストは複雑さ、テスト負荷、より難しいサポート物語です。オフラインコラボがコア価値のとき採用し、ブログがかっこよかったからではありません。",
            "CRDTでも認可、コンパクション、コールドスタートで無限履歴を再生しないスナップショット境界が必要です。"
          ],
        },
        {
          heading: "ラボ外で同期健全性を証明する",
          paragraphs: [
            "機内モード、時計ずれ、部分アップロード、キュー途中のアプリキルをシミュレートします。本番ではコンフリクト率、マージ失敗、ユーザー取り消しをサンプリング。リリース後のスパイクはしばしばスキーマや方針変更—「もっとオフライン」ではありません。",
            "オフライン優先は信頼性機能です。同期を決済のように扱い：可観測、オーナー付き、マーケがどこでも約束する前にリハーサル。"
          ],
          links: [
            {
              label: "Automerge — CRDT library",
              url: "https://automerge.org/docs/",
            },
            {
              label: "Apple — Syncing model data",
              url: "https://developer.apple.com/documentation/swiftdata/syncing-model-data-across-a-persons-devices",
            },
            {
              label: "Couchbase — Mobile sync",
              url: "https://docs.couchbase.com/sync-gateway/current/sync.html",
            },
          ],
        },
      ],
    },
  },
};
