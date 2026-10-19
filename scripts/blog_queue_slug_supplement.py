#!/usr/bin/env python3
"""One optional supplement section (heading + four paragraphs) per slug and locale."""

SUPPLEMENT: dict[str, dict[str, dict[str, list[str] | str]]] = {
    "data-retention-policies-that-enable-product-analytics": {
        "en": {
            "heading": 'Operational checklist for retention and analytics',
            "paragraphs": [
                'Product teams treat retention policies as legal paperwork while analytics pipelines keep ingesting identifiers forever. Break that cycle by publishing an event catalog in the same repo as your tracking SDK, with TTL, lawful basis, and rollup target on every row. Pull requests that add new properties must update the catalog or fail CI. Analysts still get cohort funnels when raw PII expires, because weekly aggregates inherit the same classification tags downstream.',
                'Rollups are how you keep dashboards honest after deletion windows close. Design materialized views that drop user keys but preserve experiment assignment hashes long enough for readouts, then document which charts query raw versus aggregated tables. When someone exports a CSV for a board deck, log the export event with the requesting principal and the data class touched. Exports without audit trails fail privacy reviews faster than missing metrics.',
                'Cross-border replication breaks naive retention promises. If events land in a region with different erasure SLAs, tag replicas in the catalog and run deletion orchestration that follows the strictest policy, not the laxest bucket. Staging environments must not hold production TTL exceptions without automatic expiry; engineers debugging with real user rows is a recurring audit finding. Synthetic fixtures should mimic schema, not copy prod dumps.',
                'Review retention like capacity planning each quarter. Measure warehouse growth against deleted rows, exception counts, and open legal holds. Product analytics leaders should sign when new AI or payment flows ship, confirming defaults were not silently widened. Publish a one-page status to engineering all-hands: what expires this month, what rollups backfill history, and which teams still query fields that should have aged out.',
            ],
        },
        "tr": {
            "heading": 'Analitiği boğmadan saklama operasyonu',
            "paragraphs": [
                "Ürün ekipleri saklama politikalarını hukuki evrak sayarken analitik boru hatları tanımlayıcıları süresiz yutmaya devam eder. Döngüyü kırın: izleme SDK'nızla aynı repoda TTL, hukuki dayanak ve rollup hedefi olan bir olay kataloğu yayınlayın. Yeni özellik ekleyen PR'lar kataloğu güncellemeden geçmesin. Ham PII süresi dolunca kohort hunileri haftalık agregalar aynı sınıflandırma etiketlerini taşıdığı için yaşamaya devam eder.",
                "Silme pencereleri kapandıktan sonra panoları dürüst tutan şey rollup'lardır. Kullanıcı anahtarlarını düşüren ama deney atama hash'lerini okuma süreleri boyunca koruyan materialized view'lar tasarlayın; hangi grafiğin ham hangisinin agregadan beslendiğini belgeleyin. Yönetim sunumu için CSV export edildiğinde isteği yapan principal ve dokunulan veri sınıfı loglansın. Denet izi olmayan export'lar eksik metrikten hızlı privacy review'da düşer. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Sınır ötesi replikasyon naif saklama vaatlerini kırar. Olaylar farklı silme SLA'ları olan bölgelere düşüyorsa replikaları katalogda etiketleyin; silme orkestrasyonu en gevşek bucket değil en sıkı politikayı izlesin. Staging prod TTL istisnalarını otomatik süre dolmadan tutmasın; gerçek kullanıcı satırlarıyla debug tekrarlayan audit bulgusudur. Sentetik fixture'lar şemayı taklit etsin, prod dump kopyalamayın. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Saklamayı çeyreklik kapasite planı gibi gözden geçirin. Depo büyümesini silinen satırlar, istisna sayıları ve açık hukuki hold'larla karşılaştırın. Yeni AI veya ödeme akışları ship olurken analitik liderleri imza atsın; varsayılanların sessizce genişletilmediğini onaylasın. Mühendislik all-hands'e tek sayfa durum: bu ay ne expire oluyor, hangi rollup'lar geçmişi dolduruyor, hangi ekipler yaşlanması gereken alanları hâlâ sorguluyor. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
            ],
        },
        "de": {
            "heading": 'Retention operativ, Analytics intakt',
            "paragraphs": [
                'Produktteams behandeln Retention-Policies als Legal-Papier, während Analytics-Pipelines weiter Identifikatoren einsaugen. Brechen Sie den Kreislauf: Event-Katalog im selben Repo wie das Tracking-SDK, mit TTL, Rechtsgrund und Rollup-Ziel pro Zeile. PRs mit neuen Properties scheitern ohne Katalog-Update. Kohorten-Funnels überleben abgelaufenes Raw-PII, weil Wochenaggregate dieselben Klassifikations-Tags tragen. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Rollups halten Dashboards ehrlich, nachdem Löschfenster schließen. Materialized Views ohne User-Keys, aber mit Experiment-Assignment-Hashes für Readouts; dokumentieren Sie Raw- versus Aggregat-Charts. CSV-Exports für Board-Decks loggen Principal und Datenklasse. Exporte ohne Audit-Trail scheitern schneller in Privacy-Reviews als fehlende Metriken. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Cross-Border-Replikation bricht naive Retention-Versprechen. Landen Events in Regionen mit anderen Erasure-SLAs, taggen Sie Replikas im Katalog; Deletion-Orchestrierung folgt der strengsten Policy. Staging ohne Auto-Expiry für Prod-TTL-Ausnahmen vermeiden; Debug mit echten User-Rows ist wiederkehrender Audit-Befund. Synthetische Fixtures imitieren Schema, keine Prod-Dumps. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Retention vierteljährlich wie Capacity Planning reviewen. Warehouse-Wachstum gegen gelöschte Rows, Ausnahmen, Legal Holds messen. Analytics-Leads signieren neue KI- oder Payment-Flows und bestätigen unveränderte Defaults. One-Pager fürs Engineering-All-Hands: was diesen Monat expiret, welche Rollups History backfillen, wer noch veraltete Felder abfragt. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
            ],
        },
        "fr": {
            "heading": 'Checklist opérationnelle rétention et analytics',
            "paragraphs": [
                "Les équipes produit traitent la rétention comme paperasse juridique pendant que l'analytics ingère des identifiants indéfiniment. Cassez le cycle : catalogue d'événements dans le même repo que le SDK de tracking, TTL, base légale et cible de rollup par ligne. Les PR ajoutant des propriétés échouent sans mise à jour du catalogue. Les entonnoirs de cohortes survivent à l'expiration du PII brut via agrégats hebdo portant les mêmes labels de classification.",
                "Les rollups gardent les dashboards honnêtes après fermeture des fenêtres de suppression. Vues matérialisées sans clés utilisateur mais avec hashes d'affectation d'expérience ; documentez graphiques raw vs agrégés. Export CSV pour comité de direction : journaliser le principal demandeur et la classe de données. Exports sans piste d'audit échouent plus vite en revue privacy que métriques manquantes.",
                "La réplication transfrontalière casse les promesses naïves. Si les événements atterrissent dans des régions à SLA d'effacement différents, taguez les réplicas ; l'orchestration de suppression suit la politique la plus stricte. Le staging ne doit pas garder d'exceptions TTL prod sans expiration auto ; debug avec vraies lignes utilisateur est un finding d'audit récurrent. Fixtures synthétiques imitent le schéma, pas dumps prod.",
                "Revoyez la rétention comme planification de capacité chaque trimestre. Croissance entrepôt vs lignes supprimées, exceptions, legal holds. Les leads analytics signent les nouveaux flux IA ou paiement confirmant l'absence d'élargissement silencieux des défauts. One-pager all-hands : expirations du mois, rollups de backfill, équipes interrogeant encore des champs périmés. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
            ],
        },
        "it": {
            "heading": 'Checklist operativa retention e analytics',
            "paragraphs": [
                "I team prodotto trattano le policy di retention come carta legale mentre le pipeline analytics ingoiano identificatori per sempre. Rompete il ciclo: catalogo eventi nello stesso repo dell'SDK di tracking, con TTL, base giuridica e target rollup per riga. Le PR che aggiungono proprietà falliscono senza aggiornare il catalogo. I funnel di cohorte sopravvivono alla scadenza del PII grezzo perché gli aggregati settimanali ereditano le stesse etichette di classificazione.",
                'I rollup mantengono onesti i dashboard dopo la chiusura delle finestre di cancellazione. Viste materializzate senza chiavi utente ma con hash di assegnazione esperimento; documentate grafici raw vs aggregati. Export CSV per board: loggare principal richiedente e classe dati. Export senza audit trail falliscono più in fretta in privacy review che metriche mancanti. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni.',
                'La replica cross-border rompe promesse naive. Se gli eventi atterrano in regioni con SLA di cancellazione diversi, taggate le repliche; orchestrazione deletion segue la policy più severa. Staging senza scadenza auto per eccezioni TTL prod; debug con righe utente reali è finding audit ricorrente. Fixture sintetiche imitano schema, non dump prod. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire.',
                "Rivedete retention come capacity planning ogni trimestre. Crescita warehouse vs righe eliminate, eccezioni, legal hold. I lead analytics firmano nuovi flussi AI o pagamento confermando default non allargati silenziosamente. One-pager all-hands: cosa scade questo mese, quali rollup backfillano storia, chi interroga ancora campi che dovrebbero essere scaduti. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
            ],
        },
        "zh": {
            "heading": '在不牺牲分析能力的前提下落地留存',
            "paragraphs": [
                '产品团队把留存政策当作法务文件，而分析管道却无限期吞入标识符。打破这一循环：在与追踪 SDK 同一仓库发布事件目录，每行写明 TTL、法律依据与汇总目标。新增属性的 PR 必须更新目录否则 CI 失败。原始 PII 过期后，周报汇总仍保留相同分类标签，队列漏斗分析可以继续。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '删除窗口关闭后，汇总表是仪表盘诚实的保障。设计物化视图：去掉用户键但保留足够长的实验分配哈希供读数，并记录哪些图表查 raw、哪些查汇总。为董事会导出 CSV 时，记录请求主体与触及的数据级别。没有审计轨迹的导出，在隐私评审中比缺指标更快被否决。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '跨境复制会让天真的留存承诺失效。若事件落入擦除 SLA 不同的区域，在目录中标记副本，删除编排遵循最严策略而非最松桶。预发环境不得无限期保留生产 TTL 例外；工程师用真实用户行调试是反复出现的审计发现。合成夹具应模拟 schema，而非复制生产转储。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '像容量规划一样每季度评审留存。衡量仓库存储增长、已删行数、例外与法律保全。新的 AI 或支付流上线时，分析负责人应签字确认默认 TTL 未被悄悄放宽。向工程全员发布一页状态：本月何物过期、哪些汇总回填历史、哪些团队仍在查询应已老化的字段。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
            ],
        },
        "ja": {
            "heading": '分析を生かす retention 運用チェックリスト',
            "paragraphs": [
                'プロダクトチームは retention を法務書類扱いし、分析パイプラインだけが識別子を際限なく取り込み続けます。追跡 SDK と同じリポジトリにイベントカタログを公開し、各行に TTL、法的根拠、ロールアップ先を載せて打破してください。新プロパティを増やす PR はカタログ更新なしで CI 失敗。raw PII 失効後も週次集計が同じ分類タグを継承するためコホート漏斗は維持できます。',
                '削除ウィンドウ後にダッシュボードを正直に保つのはロールアップです。ユーザー鍵を落としつつ実験割当ハッシュを読み取り期間保持する materialized view を設計し、どのグラフが raw と集計のどちらを見るか文書化。取締役会向け CSV エクスポートは要求主体とデータクラスをログ。監査証跡のないエクスポートは欠損メトリクスより privacy レビューで早く落ちます。',
                '越境レプリケーションは素朴な retention 約束を壊します。消去 SLA の異なるリージョンにイベントが落ちるならレプリカをカタログでタグ付け、削除オーケストレーションは最も厳しい方針に従います。ステージングは prod TTL 例外を自動失効なしに置かない。実ユーザ行でデバッグは繰り返しの監査指摘。合成フィクスチャはスキーマ模倣で prod ダンプコピー禁止。 担当者、レビュー日、ロールバック条件を同一変更チケットに記録し、次の on-call エンジニアがインシデントを再オープンせず判断を追跡できるようにする。',
                'retention を四半期ごとのキャパシティ計画のようにレビュー。倉庫成長、削除行、例外、リーガルホールドを測定。新 AI や決済フロー ship 時は分析リードが署名し、デフォルトが静かに広がっていないことを確認。エンジニア all-hands 向け一页: 今月の失効、履歴を埋めるロールアップ、期限切れのはずのフィールドをまだ問い合わせるチーム。 担当者、レビュー日、ロールバック条件を同一変更チケットに記録し、次の on-call エンジニアがインシデントを再オープンせず判断を追跡できるようにする。',
            ],
        },
    },
    "logging-llm-interactions-without-hoarding-pii": {
        "en": {
            "heading": 'Logging LLM traffic with defensible minimization',
            "paragraphs": [
                'LLM gateways see full prompts unless you design capture points upstream. Split observability into request metadata—model route, token counts, latency, policy outcome—and a restricted transcript tier sampled for quality review. Never default full prompt logging to hot storage. Schema tests should reject new log fields that match regexes for credit cards, government IDs, or employee personnel numbers before merge.',
                'Redaction pipelines belong in the ingestion path, not as a quarterly cleanup script. Run deterministic transforms—mask emails, hash stable user keys, strip attachment bytes—and verify with golden log fixtures in CI. When legal asks for a sample during an incident, generate it from the redacted tier with approval workflow; ad hoc grep across raw clusters is how leaks happen in supposedly compliant stacks.',
                'Retention classes for LLM logs must differ from classic HTTP access logs. Transcript samples may need seventy-two hours for triage while aggregate token spend metrics live ninety days. Document which on-call queries hit which tier in the runbook, and metric expiry job failures the same way you alert on model five hundreds. Security dashboards should show export volume, not only authentication failures.',
                'Treat vendor subprocessors as part of your logging boundary. If a hosted model returns echoes of PII in tool outputs, your retention policy must cover derived fields in vector stores and eval exports. Product managers requesting longer history for prompt tuning owe an exception ticket with expiry and anonymization plan. When in doubt, log identifiers and outcomes, not verbatim user content copied into tickets.',
            ],
        },
        "tr": {
            "heading": 'Savunulabilir minimizasyonla LLM loglama',
            "paragraphs": [
                "Yukarı akışta yakalama noktaları tasarlamazsanız LLM gateway'leri tam prompt görür. Gözlemlenebilirliği istek metadatasına—model route, token sayısı, gecikme, politika sonucu—ve kalite incelemesi için örneklenen kısıtlı transkript katmanına bölün. Tam prompt loglamayı sıcak depoya varsayılan yapmayın. Şema testleri merge öncesi kredi kartı, kimlik numarası veya personel numarası regex'ine uyan yeni log alanlarını reddetsin. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Redaksiyon boru hatları çeyreklik temizlik script'i değil ingestion yolunda olmalı. Deterministik dönüşümler—e-posta maskeleme, stabil kullanıcı anahtarı hash, ek baytlarını strip—CI'da golden log fixture'larıyla doğrulansın. Hukuk olay sırasında örnek isterse onay akışıyla redakte katmandan üretin; raw cluster'da rastgele grep sızıntının uyumlu sandığınız stack'lerdeki yoludur. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "LLM logları için saklama sınıfları klasik HTTP access log'larından ayrılmalı. Transkript örnekleri triage için yetmiş iki saat gerekebilir; toplam token harcama metrikleri doksan gün kalabilir. Runbook'ta hangi on-call sorgusunun hangi katmana vurduğunu yazın; expiry job hatalarını model 500'leri gibi uyarın. Güvenlik panoları yalnızca auth failure değil export hacmini göstersin. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Vendor alt işlemcileri log sınırınızın parçası sayın. Barındırılan model tool çıktısında PII yankısı dönerse retention vektör store ve eval export'taki türev alanları kapsamalı. Prompt tuning için uzun geçmiş isteyen PM'ler süreli istisna ticket'ı ve anonimleştirme planı borçlu. Şüphede tanımlayıcı ve sonuç loglayın, ticket'a kopyalanan ham kullanıcı metnini değil. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
            ],
        },
        "de": {
            "heading": 'LLM-Logging mit verteidigbarer Minimierung',
            "paragraphs": [
                'LLM-Gateways sehen volle Prompts ohne upstream Capture-Points. Teilen Sie Observability: Request-Metadaten—Modell-Route, Token, Latenz, Policy-Outcome—und restricted Transcript-Tier für Quality-Sampling. Niemals Full-Prompt-Logging als Hot-Storage-Default. Schema-Tests lehnen vor Merge neue Log-Felder ab, die Regex für Karten, Ausweise oder Personalnummern matchen. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Redaction-Pipelines gehören in Ingestion, nicht als Quarterly-Cleanup. Deterministische Transforms—E-Mail maskieren, User-Keys hashen, Attachments strippen—mit Golden-Log-Fixtures in CI verifizieren. Legal-Samples im Incident aus redacted Tier mit Approval-Workflow; ad-hoc grep in Raw-Clustern ist Leak-Pfad in scheinbar compliant Stacks. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Retention-Klassen für LLM-Logs unterscheiden sich von HTTP-Access-Logs. Transcript-Samples evtl. 72h Triage, Token-Spend-Aggregate 90 Tage. Runbook dokumentiert On-Call-Queries pro Tier; Expiry-Job-Failures wie Model-500s alerten. Security-Dashboards zeigen Export-Volumen, nicht nur Auth-Failures. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Vendor-Subprocessor sind Logging-Boundary. Echo-PII in Tool-Outputs erfordert Retention für abgeleitete Felder in Vector Stores und Eval-Exports. PMs mit längerer History für Prompt-Tuning brauchen Exception-Ticket mit Expiry und Anonymisierungsplan. Im Zweifel IDs und Outcomes loggen, nicht wörtlichen User-Content in Tickets. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
            ],
        },
        "fr": {
            "heading": 'Journaliser le trafic LLM avec minimisation défendable',
            "paragraphs": [
                'Les gateways LLM voient les prompts complets sans points de capture amont. Séparez observabilité : métadonnées requête—route modèle, tokens, latence, issue policy—et tier transcript restreint échantillonné pour qualité. Jamais de log prompt intégral par défaut en stockage chaud. Tests schéma rejettent avant merge champs log matchant regex cartes, IDs gouvernementaux ou matricules. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions.',
                "Pipelines de rédaction dans l'ingestion, pas script trimestriel. Transforms déterministes—masquer emails, hasher clés utilisateur stables, retirer bytes pièces jointes—vérifiés par fixtures log dorées en CI. Échantillon legal en incident depuis tier rédigé avec workflow d'approbation ; grep ad hoc sur clusters raw fuit dans stacks soi-disant conformes. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Classes de rétention LLM diffèrent des access logs HTTP. Échantillons transcript peut-être 72h triage, métriques agrégées dépense tokens 90 jours. Runbook : quelles requêtes on-call touchent quel tier ; échecs jobs expiry alertés comme 500 modèle. Dashboards sécurité montrent volume export, pas seulement échecs auth. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Sous-traitants vendor dans la boundary logging. Échos PII dans sorties tools imposent rétention champs dérivés vector stores et exports eval. PM demandant historique long pour tuning doivent ticket exception avec expiry et plan anonymisation. En doute, journaliser identifiants et outcomes, pas contenu utilisateur verbatim copié en tickets. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
            ],
        },
        "it": {
            "heading": 'Log LLM con minimizzazione difendibile',
            "paragraphs": [
                "I gateway LLM vedono prompt completi senza capture point a monte. Dividete observability: metadati richiesta—route modello, token, latenza, esito policy—e tier transcript ristretto campionato per qualità. Mai log prompt intero default su hot storage. Test schema rifiutano prima del merge campi log che matchano regex carte, ID governativi o matricole. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Pipeline di redazione nell'ingestion, non script trimestrale. Trasformazioni deterministiche—mascherare email, hash chiavi utente stabili, strippare allegati—verificate con fixture log golden in CI. Campione legal in incident da tier redatto con workflow approvazione; grep ad hoc su cluster raw fa leak in stack presumibilmente compliant. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Classi retention log LLM diverse da access log HTTP. Campioni transcript forse 72h triage, metriche aggregate spesa token 90 giorni. Runbook: query on-call per tier; failure job expiry alertati come 500 modello. Dashboard sicurezza mostrano volume export, non solo failure auth. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Subprocessor vendor parte del boundary logging. Eco PII in output tool richiede retention campi derivati vector store ed export eval. PM che chiedono storico lungo per tuning devono ticket eccezione con expiry e piano anonimizzazione. Nel dubbio loggare identificatori ed esiti, non contenuto utente verbatim copiato nei ticket. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
            ],
        },
        "zh": {
            "heading": '可辩护的最小化 LLM 日志',
            "paragraphs": [
                '若不在上游设计采集点，LLM 网关会看到完整 prompt。将可观测性拆为请求元数据——模型路由、token 数、延迟、策略结果——以及用于质量抽检的受限转录层。切勿默认把完整 prompt 写入热存储。合并前 schema 测试应拒绝匹配信用卡、证件号或工号正则的新日志字段。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '脱敏管道应位于摄入路径，而非季度清理脚本。运行确定性变换——掩码邮箱、哈希稳定用户键、剥离附件字节——并在 CI 用黄金日志 fixture 验证。法务在事件中要样本时，经审批从脱敏层生成；在 raw 集群随意 grep 是所谓合规栈里常见的泄漏路径。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                'LLM 日志留存级别应不同于 HTTP 访问日志。转录样本或需 72 小时排障，而 token 花费汇总可保留 90 天。在 runbook 记录 on-call 查询命中哪一层；过期任务失败与模型 500 同级告警。安全仪表盘应展示导出量，而非仅认证失败。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '将供应商子处理方纳入日志边界。若托管模型在 tool 输出中带回 PII 回声，留存策略须覆盖向量库与 eval 导出中的派生字段。为 prompt 调优请求更长历史的 PM 须提交带过期与匿名化计划的例外工单。不确定时记录标识符与结果，而非抄进工单的用户原文。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
            ],
        },
        "ja": {
            "heading": '防御可能な最小化で LLM をログ',
            "paragraphs": [
                '上流にキャプチャポイントがなければ LLM ゲートウェイはフル prompt を見ます。可観測性をリクエストメタデータ—モデルルート、トークン数、レイテンシ、ポリシー結果—と品質レビュー用サンプルの制限 transcript 層に分割。ホットストレージへのフル prompt ログをデフォルトにしない。マージ前のスキーマテストはカード、政府 ID、社員番号 regex に合う新ログフィールドを拒否。',
                'レダクションは四半期クリーンアップではなく ingestion 経路。決定論変換—メールマスク、安定ユーザ鍵ハッシュ、添付 strip—を CI の golden log fixture で検証。インシデントで法務がサンプル要求時は承認ワークフロー付き redacted 層から生成。raw クラスタの ad hoc grep は準拠 stack でも漏洩経路。 担当者、レビュー日、ロールバック条件を同一変更チケットに記録し、次の on-call エンジニアがインシデントを再オープンせず判断を追跡できるようにする。',
                'LLM ログの retention クラスは HTTP access log と別。transcript サンプルは triage 72 時間、トークン支出集計は 90 日。runbook に on-call クエリと tier の対応。expiry job 失敗はモデル 500 と同様に alert。セキュリティダッシュボードは auth 失敗だけでなく export 量を表示。 担当者、レビュー日、ロールバック条件を同一変更チケットに記録し、次の on-call エンジニアがインシデントを再オープンせず判断を追跡できるようにする。',
                'ベンダ subprocessor は logging 境界の一部。ホストモデルの tool 出力に PII エコーがあれば vector store と eval export の派生フィールドも retention 対象。prompt tuning で長い履歴を求める PM は失効と匿名化計画付き例外チケット。迷ったら識別子と outcome をログし、チケットにコピーしたユーザ原文は避ける。 担当者、レビュー日、ロールバック条件を同一変更チケットに記録し、次の on-call エンジニアがインシデントを再オープンせず判断を追跡できるようにする。',
            ],
        },
    },
    "performance-budgets-for-marketing-and-app-routes": {
        "en": {
            "heading": 'Shared budgets without blame shifting',
            "paragraphs": [
                'Marketing landing routes and authenticated app shells rarely share bottlenecks, yet teams fight over one global Lighthouse score. Publish separate budgets for static hero pages, localized campaigns, and logged-in dashboards, each with owner and allowed third-party scripts. Regressions attach to the same rollback conversation as error-rate spikes, so product managers cannot treat perf as a frontend hobby. Budget dashboards should trend weekly, not only alarm on deploy day.',
                'Real-user monitoring fills gaps synthetics miss—login flows, paywalls, and geo-specific CDN paths—but sample rates must respect privacy tags on events. Pair RUM with synthetic checks from three regions to catch DNS and edge misconfigurations lab Wi-Fi hides. When budgets breach, require a named mitigation: defer noncritical A/B scripts, shrink hero video, or paginate heavy tables, not vague tech debt tickets without dates.',
                'Budgets fail when assets ship outside the main release train. Creative teams uploading five megabyte PNGs into CMS bypass CI unless upload hooks enforce compression and format rules. Block merges that add render-blocking tags without performance review on marketing routes. Document exceptions with expiry and measure whether conversions actually improved, otherwise revert the heavy asset after the campaign ends.',
                'Staff engineers should facilitate quarterly budget reviews with marketing, growth, and mobile leads together. Compare p75 interaction to next paint on top campaigns against core task completion routes. Celebrate teams that renegotiate vendor contracts for lighter embeds. Performance is a product feature; publish trends where leadership sees them, not only in guild Slack channels engineers already inhabit.',
            ],
        },
        "tr": {
            "heading": 'Suçu başkasına atmadan ortak bütçeler',
            "paragraphs": [
                "Pazarlama landing route'ları ile oturum açmış app shell'leri nadiren aynı darboğazı paylaşır ama ekipler tek global Lighthouse skoru için kavga eder. Statik hero, lokal kampanya ve giriş yapılmış dashboard için ayrı bütçe yayınlayın; her birinde owner ve izinli üçüncü parti script olsun. Regresyonlar error-rate spike ile aynı rollback konuşmasına bağlansın; PM'ler perf'i frontend hobi sayamasın. Bütçe panoları haftalık trend göstersin, yalnızca deploy günü alarm vermesin.",
                "RUM sentetiğin kaçırdığı login, paywall ve bölgesel CDN yollarını doldurur; örnekleme oranları olaylardaki privacy etiketlerine uymalı. Virginia, Frankfurt ve Singapur sentetiği DNS ve edge yanlış yapılandırmalarını yakalasın. Bütçe aşımında adlı mitigasyon şart: kritik olmayan A/B script erteleme, hero video küçültme veya ağır tablo sayfalama; tarihsiz tech debt ticket değil. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Varlıklar ana release treninin dışında ship olunca bütçeler çöker. CMS'e beş megabayt PNG yükleyen kreatif ekipler upload hook sıkıştırma ve format kuralı olmadan CI'ı bypass eder. Pazarlama route'larına render-blocking tag ekleyen merge'leri perf review olmadan bloklayın. İstisnaları süreli belgeleyin; dönüşüm gerçekten artmadıysa kampanya bitince ağır varlığı geri alın. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Staff mühendisler pazarlama, growth ve mobil liderlerle çeyreklik bütçe review'u kolaylaştırsın. En iyi kampanyalarda p75 INP'yi çekirdek görev tamamlama route'larıyla karşılaştırın. Daha hafif embed için vendor sözleşmesi yenileyen ekipleri öne çıkarın. Performans ürün özelliğidir; trendleri yalnızca mühendis Slack'inde değil liderliğin gördüğü yerde yayınlayın. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
            ],
        },
        "de": {
            "heading": 'Geteilte Budgets ohne Schuldzuweisung',
            "paragraphs": [
                'Marketing-Landing und authentifizierte App-Shells teilen selten Engpässe, doch Teams streiten um einen globalen Lighthouse-Score. Separate Budgets für Hero-Seiten, lokale Kampagnen und eingeloggte Dashboards mit Owner und erlaubten Third-Party-Scripts. Regressionen in derselben Rollback-Diskussion wie Error-Spikes; PMs dürfen Perf nicht als Frontend-Hobby behandeln. Budget-Dashboards wöchentlich trenden, nicht nur Deploy-Alarm. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'RUM füllt Lücken—Login, Paywalls, geo-spezifische CDN-Pfade—Sample-Rates müssen Privacy-Tags respektieren. RUM plus Synthetics aus drei Regionen für DNS- und Edge-Fehler, die Lab-Wi-Fi versteckt. Bei Budget-Bruch benannte Mitigation: A/B-Scripts verschieben, Hero-Video verkleinern, schwere Tabellen paginieren—keine Tech-Debt-Tickets ohne Datum. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Budgets scheitern wenn Assets außerhalb des Release-Trains shippen. Kreativ-Teams mit 5-MB-PNGs in CMS umgehen CI ohne Upload-Hooks für Kompression. Merges mit render-blocking Tags auf Marketing-Routes ohne Perf-Review blocken. Ausnahmen mit Expiry dokumentieren; ohne Conversion-Gewinn schwere Assets nach Kampagne revertieren. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Staff Engineers facilitieren vierteljährliche Budget-Reviews mit Marketing, Growth, Mobile. p75 INP Top-Kampagnen vs Core-Task-Routes vergleichen. Teams feiern, die Vendor-Verträge für leichtere Embeds neu verhandeln. Performance ist Produktfeature; Trends dort publizieren, wo Leadership hinschaut, nicht nur Guild-Slack. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
            ],
        },
        "fr": {
            "heading": 'Budgets partagés sans renvoi de faute',
            "paragraphs": [
                "Landing marketing et coques app authentifiées partagent rarement les goulots, pourtant les équipes se battent pour un score Lighthouse global. Budgets séparés pour hero statique, campagnes localisées et dashboards connectés, chacun avec owner et scripts tiers autorisés. Régressions dans la même conversation rollback que pics d'erreurs ; les PM ne traitent pas perf comme hobby frontend. Dashboards budget en tendance hebdo, pas seulement alarme deploy.",
                "RUM comble login, paywalls, chemins CDN géo—taux d'échantillon respectant tags privacy. RUM plus synthetics trois régions pour DNS et edge que le lab Wi-Fi cache. Dépassement budget exige mitigation nommée : différer scripts A/B, réduire vidéo hero, paginer tables lourdes—pas tickets dette technique sans date. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Budgets échouent quand assets shippent hors train release. Créatif upload 5 Mo PNG en CMS bypass CI sans hooks compression. Bloquer merges ajoutant tags render-blocking sur routes marketing sans revue perf. Exceptions datées ; sans gain conversion, revert asset lourd après campagne. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Staff engineers facilitent revues trimestrielles avec marketing, growth, mobile. Comparer p75 INP campagnes top vs routes complétion tâche cœur. Célébrer renégociations vendor pour embeds plus légers. Perf est feature produit ; publier tendances où leadership regarde, pas seulement Slack guilde. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
            ],
        },
        "it": {
            "heading": 'Budget condivisi senza scaricabarile',
            "paragraphs": [
                'Landing marketing e shell app autenticate raramente condividono colli di bottiglia, eppure i team litigano su un unico Lighthouse globale. Budget separati per hero statiche, campagne localizzate e dashboard loggati, ciascuno con owner e script third-party ammessi. Regressioni nella stessa conversazione rollback dei picchi error rate; i PM non trattino perf come hobby frontend. Dashboard budget in trend settimanale, non solo allarme deploy.',
                "RUM colma login, paywall, percorsi CDN geo—sample rate rispettano tag privacy. RUM più synthetic da tre regioni per DNS ed edge nascosti dal Wi-Fi lab. Sforamento budget richiede mitigazione nominata: rimandare script A/B, ridurre video hero, paginare tabelle pesanti—niente ticket tech debt senza data. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "I budget falliscono quando asset shippano fuori dal release train. Creative che caricano PNG da 5 MB nel CMS bypassano CI senza hook compressione. Bloccare merge con tag render-blocking su route marketing senza review perf. Eccezioni con scadenza; senza miglior conversione, revert asset pesante a fine campagna. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Staff engineer facilitano review trimestrali con marketing, growth e mobile lead. Confrontare p75 INP campagne top vs route completamento task core. Celebrare team che rinegoziano vendor per embed più leggeri. Performance è feature prodotto; pubblicare trend dove guarda la leadership, non solo Slack di guild. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
            ],
        },
        "zh": {
            "heading": '共享性能预算而不互相甩锅',
            "paragraphs": [
                '营销落地页与已登录应用壳层很少共用瓶颈，团队却为一个全局 Lighthouse 分数争执。为静态 hero、本地化活动与登录仪表盘分别发布预算，各有负责人与允许的第三方脚本。回归与错误率尖峰纳入同一回滚讨论，产品经理不能把性能当作前端爱好。预算仪表盘应每周展示趋势，而非仅在发布日告警。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '真实用户监控填补合成监测盲区——登录、付费墙与区域 CDN——采样率须遵守事件隐私标签。结合三地区合成检查以发现实验室 Wi-Fi 掩盖的 DNS 与边缘配置错误。超预算须指名缓解措施：推迟非关键 A/B 脚本、缩小 hero 视频或分页重表，而非无日期的技术债工单。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '资产在主发布列车之外上线时预算易失效。创意团队向 CMS 上传五兆 PNG 会在无上传钩子强制压缩时绕过 CI。阻止在营销路由添加阻塞渲染标签且未经性能评审的合并。例外须注明过期并衡量转化是否真提升，否则活动结束后回滚重资源。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                'Staff 工程师应每季度与营销、增长与移动端负责人联合评审预算。对比头部活动的 p75 INP 与核心任务完成路径。表彰重新谈判供应商以获得更轻嵌入的团队。性能是产品能力；趋势应发布到领导可见处，而非仅工程师频道。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
            ],
        },
        "ja": {
            "heading": '責任押し付けなしの共有バジェット',
            "paragraphs": [
                'マーケ landing と認証済み app shell はボトルネックを共有しにくいのに、単一 Lighthouse スコアで争います。静的 hero、ローカルキャンペーン、ログインダッシュボードで別バジェットを公開し、各 owner と許可 third-party script を明記。回帰は error spike と同じ rollback 会話に載せ、PM が perf を frontend 趣味扱いしない。バジェットダッシュボードは deploy 日だけでなく週次トレンド。',
                'RUM は login、ペイウォール、地域 CDN など synthetic の穴を埋めますが、サンプル率は privacy タグを尊重。三地域 synthetic と RUM で lab Wi-Fi が隠す DNS・edge 誤設定を捕捉。超過時は named mitigation：非クリティカル A/B 延期、hero 動画縮小、重い表のページング—日付なし tech debt チケット禁止。 担当者、レビュー日、ロールバック条件を同一変更チケットに記録し、次の on-call エンジニアがインシデントを再オープンせず判断を追跡できるようにする。',
                'release train 外で asset が ship するとバジェットは破綻。CMS に 5MB PNG を上げるクリエイティブは圧縮 hook なしで CI  bypass。マーケ route に render-blocking タグを足す merge を perf review なしで block。例外は失効付きで文書化し、コンバージョン改善がなければキャンペーン後に重 asset を revert。 担当者、レビュー日、ロールバック条件を同一変更チケットに記録し、次の on-call エンジニアがインシデントを再オープンせず判断を追跡できるようにする。',
                'Staff engineer がマーケ・growth・モバイルリードと四半期バジェット review を進行。トップキャンペーンの p75 INP をコアタスク完了 route と比較。軽い embed の vendor 再交渉を称賛。パフォーマンスはプロダクト機能；トレンドは guild Slack だけでなくリーダーシップが見る場所へ。 担当者、レビュー日、ロールバック条件を同一変更チケットに記録し、次の on-call エンジニアがインシデントを再オープンせず判断を追跡できるようにする。',
            ],
        },
    },
    "seo-for-editorial-briefings-not-wire-copy": {
        "en": {
            "heading": 'Briefing SEO you can show in Search Console',
            "paragraphs": [
                'Editorial briefings outperform wire copy when they explain tradeoffs readers can act on—implementation cost, risk, and timeline—not when they recap headlines with keyword stuffing. Structure pages with clear H2 questions analysts actually ask, then answer in prose a staff engineer would sign. Internal links should connect related briefings and primary docs, forming a topic cluster search engines can crawl without orphan URLs buried in app-only navigation.',
                'Structured data must reflect what you ship. Fake FAQ blocks and mismatched article schema hurt trust signals more than omitting JSON-LD entirely. Validate rich results in staging with the same canonical URLs production uses, including hreflang alternates for localized briefings. Measure organic landing engagement separately from app conversion funnels so SEO wins are not hidden inside blended product metrics.',
                'Refresh evergreen sections on a calendar, not when traffic already collapsed. Track query impressions and average position for briefing URLs monthly; schedule updates when rankings slip while impressions rise—a sign of stale snippets. Authors should note revision dates visibly. Wire-style timestamps that never change teach crawlers the page is unmaintained, even if the product beneath it evolved.',
                'Distribution matters as much as on-page craft. Briefings earn links when product and policy teams cite them in changelogs, release notes, and conference talks. Provide stable anchors for quotable definitions partners can reference. Avoid gating technical substance entirely; summaries can be public while worksheets stay registered. SEO for briefings is a product surface, not a marketing afterthought bolted onto blog templates.',
            ],
        },
        "tr": {
            "heading": "Search Console'da savunulabilir brifing SEO",
            "paragraphs": [
                "Editoryal brifingler, okuyucunun uygulayabileceği tradeoff'ları—maliyet, risk, zaman çizelgesi—anlattığında wire copy'yi geçer; başlık özetine keyword doldurmakla değil. Analistlerin gerçekten sorduğu soruları H2 yapın, staff mühendisin imzalayacağı düz yazıyla yanıtlayın. İç linkler ilgili brifingleri ve birincil doklara bağlasın; app-only navigasyonda yetim kalan URL cluster'ı oluşmasın. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Yapılandırılmış veri ship ettiğiniz sayfayı yansıtmalı. Sahte FAQ blokları ve uyumsuz article schema, JSON-LD'yi tamamen atlamaktan daha çok güven sinyalini zedeler. Staging'de production canonical ve hreflang alternates ile rich result doğrulayın. Organik landing etkileşimini app dönüşüm hunisinden ayrı ölçün; SEO kazanımları karışık ürün metriklerinde kaybolmasın. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Evergreen bölümleri trafik çöktükten sonra değil takvimle yenileyin. Brifing URL'leri için aylık impression ve ortalama pozisyon izleyin; impression artarken sıralama düşüyorsa snippet bayat demektir—güncelleme planlayın. Yazarlar revizyon tarihini görünür yazsın. Hiç değişmeyen wire timestamp'i crawler'a sayfanın bakımsız olduğunu öğretir. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Dağıtım on-page ustalık kadar önemli. Ürün ve politika ekipleri brifingleri changelog, release note ve konferansta cite edince link gelir. Partnerlerin alıntılayacağı stabil anchor tanımlar sunun. Teknik özü tamamen gate etmeyin; özet public, worksheet kayıtlı kalabilir. Brifing SEO'su blog şablonuna sonradan cıvatalanan pazarlama artığı değil, ürün yüzeyidir. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
            ],
        },
        "de": {
            "heading": 'Briefing-SEO für Search Console',
            "paragraphs": [
                'Editorial Briefings schlagen Wire Copy wenn sie Tradeoffs erklären—Kosten, Risiko, Timeline—nicht wenn sie Headlines mit Keyword-Stuffing wiederholen. H2-Fragen wie Analysten sie stellen; Antworten in Prosa die Staff Engineers unterschreiben. Interne Links verbinden Briefings und Primärdocs zu crawlbar clusters ohne Waisen-URLs in App-only-Navigation. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Structured Data spiegelt Shipped Pages. Fake-FAQ und mismatched Article Schema schaden Trust mehr als fehlendes JSON-LD. Rich Results in Staging mit Prod-Canonicals und hreflang validieren. Organisches Landing-Engagement getrennt von App-Funnels messen damit SEO-Wins nicht in Blend-Metriken verschwinden. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Evergreen-Abschnitte kalenderbasiert refreshen, nicht nach Traffic-Kollaps. Monatlich Impressions und Average Position für Briefing-URLs; Updates wenn Rankings sinken bei steigenden Impressions—stale Snippets. Revision dates sichtbar. Wire-Timestamps die nie wechseln lehren Crawler Unmaintained trotz Produkt-Evolution. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Distribution so wichtig wie On-Page. Briefings verdienen Links wenn Product und Policy in Changelogs, Release Notes, Talks zitieren. Stabile Anker für quotable Definitions. Technische Substanz nicht ganz gaten; Summaries public, Worksheets registriert. Briefing-SEO ist Produktfläche, kein Marketing-Bolt-on. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
            ],
        },
        "fr": {
            "heading": 'SEO briefing visible dans Search Console',
            "paragraphs": [
                "Les briefings éditoriaux battent le fil quand ils expliquent des arbitrages actionnables—coût, risque, délai—pas quand ils récapitulent titres avec keyword stuffing. H2 = questions que posent les analystes ; réponses en prose qu'un staff engineer signerait. Liens internes relient briefings et docs primaires en cluster crawlable sans URL orphelines en nav app-only. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions.",
                "Données structurées reflètent ce que vous shippez. FAQ factices et schema article incohérent nuisent plus que JSON-LD absent. Valider rich results en staging avec canonicals prod et hreflang. Mesurer engagement landing organique séparé des funnels app pour ne pas noyer les gains SEO. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Rafraîchir sections evergreen au calendrier, pas après effondrement trafic. Impressions et position moyenne mensuelles sur URLs briefing ; MAJ si rankings baissent et impressions montent—snippets périmés. Dates de révision visibles. Timestamps fil qui ne bougent pas disent aux crawlers page non maintenue. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Distribution aussi importante que on-page. Briefings gagnent liens quand product et policy les citent dans changelogs, notes release, conférences. Ancres stables pour définitions citables. Ne pas gated toute substance technique ; résumés publics, worksheets enregistrés. SEO briefing = surface produit, pas afterthought marketing. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
            ],
        },
        "it": {
            "heading": 'SEO briefing difendibile in Search Console',
            "paragraphs": [
                "I briefing editoriali battono il wire quando spiegano tradeoff attuabili—costo, rischio, timeline—non quando ripetono titoli con keyword stuffing. H2 con domande che gli analisti pongono; risposte in prosa firmabile da staff engineer. Link interni collegano briefing e doc primari in cluster crawlable senza URL orfane in nav solo app. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Structured data riflette ciò che shipate. FAQ finte e schema article disallineato danneggiano trust più dell'assenza di JSON-LD. Validare rich results in staging con canonical prod e hreflang. Misurare engagement landing organico separato dai funnel app così le vittorie SEO non spariscono in metriche blend. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Refresh sezioni evergreen a calendario, non dopo crollo traffico. Impression e posizione media mensili sulle URL briefing; update se ranking scende con impression in salita—snippet stantii. Date revisione visibili. Timestamp stile wire immutabili insegnano ai crawler pagina non mantenuta. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Distribuzione importante quanto on-page. I briefing guadagnano link quando product e policy li citano in changelog, release note, talk. Ancore stabili per definizioni quotabili. Non gated tutta la sostanza tecnica; summary public, worksheet registrati. SEO briefing è superficie prodotto, non afterthought marketing. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
            ],
        },
        "zh": {
            "heading": '可在 Search Console 展示的简报 SEO',
            "paragraphs": [
                '编辑简报在解释可行动的权衡——实施成本、风险与时间线——时优于电讯稿，而非用关键词堆砌复述标题。用分析师真实提问作 H2，以 staff 工程师愿意署名散文作答。内链连接相关简报与主文档，形成可被爬取的主题簇，避免 URL 仅藏在应用内导航成为孤儿页。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '结构化数据须反映实际上线页面。虚假 FAQ 与不符的 article schema 比省略 JSON-LD 更伤信任信号。在预发用与生产相同的 canonical 与 hreflang 验证富结果。有机落地页互动与 app 转化漏斗分开衡量，SEO 成效才不会淹没在混合产品指标里。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '按日历刷新常青段落，而非流量已跌才更新。每月跟踪简报 URL 的展示与平均排名；展示升而排名降时说明摘要陈旧，应排期更新。作者应显著标注修订日期。从不变化的电讯式时间戳会让爬虫认为页面无人维护。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '分发与页面工艺同样重要。产品与政策团队在 changelog、发布说明与演讲中引用简报时会带来链接。提供可引用的稳定锚点定义。勿将全部技术内容门禁；摘要可公开，工作表可注册访问。简报 SEO 是产品界面，而非博客模板上的营销补丁。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
            ],
        },
        "ja": {
            "heading": 'Search Console で説明できる briefing SEO',
            "paragraphs": [
                '編集 briefing は実装コスト・リスク・タイムラインなど行動可能な tradeoff を説明するとき wire copy を上回り、見出しの keyword 詰め込みではありません。アナリストが本当に聞く問いを H2 にし、staff engineer が署名する散文で答える。内部リンクで関連 briefing と primary doc を繋ぎ、app-only ナビに埋もれた orphan URL の cluster を避ける。',
                '構造化データは ship したページを反映。偽 FAQ や不一致 article schema は JSON-LD 省略より trust を傷つける。staging で prod canonical と hreflang で rich result を検証。オーガニック landing engagement を app ファネルと分離計測し SEO 成果を blend メトリクスに埋もれさせない。 担当者、レビュー日、ロールバック条件を同一変更チケットに記録し、次の on-call エンジニアがインシデントを再オープンせず判断を追跡できるようにする。',
                'evergreen 節は traffic 崩壊後ではなくカレンダーで更新。briefing URL の月次 impression と平均順位；impression 増で ranking 低下は stale snippet—更新を計画。改訂日を可視化。変わらない wire タイムスタンプは crawler に未保守を教える。 担当者、レビュー日、ロールバック条件を同一変更チケットに記録し、次の on-call エンジニアがインシデントを再オープンせず判断を追跡できるようにする。',
                '配布は on-page と同じくらい重要。product と policy が changelog、release note、講演で cite すると link が付く。引用可能定義の stable anchor を提供。技術 substance を全面 gate しない；summary は public、worksheet は登録可。briefing SEO は blog テンプレ bolt-on ではなく product surface。',
            ],
        },
    },
    "llm-eval-gates-in-ci-not-slide-decks": {
        "en": {
            "heading": 'Eval gates that block merges, not meetings',
            "paragraphs": [
                'Slide-deck evals rot the week models change. Treat golden datasets as versioned code: store prompts, expected rubric scores, and judge configuration beside application logic, reviewed in pull requests like migrations. CI should replay a frozen subset on every merge request touching prompts, tools, or routing. Absolute score thresholds drift with base model upgrades; gate on regressions against the last green baseline instead of vanity ninety-five percent headlines.',
                'Automated graders need calibration humans trust. Schedule weekly spot checks where engineers label a sample of failures; feed disagreements back into rubric wording and judge prompts. Separate flaky eval cases into quarantine with owners, mirroring how you handle flaky end-to-end tests. Failed gates block deploy; waivers require named executives, expiry dates, and linked tickets documenting customer impact accepted.',
                'Eval harnesses must mirror production constraints—same tool schemas, latency budgets, and retrieval indices—not an optimistic sandbox with god-mode API keys. Record token spend per eval run so finance notices CI creep. Cache embeddings for static corpora, but invalidate when document stores change. Publish eval duration trends beside unit test times; slow eval trains encourage skipping locally, which defeats the purpose of gates.',
                'Connect eval failures to observability. When a gate catches toxic output or broken JSON, add the case to synthetic probes and on-call playbooks if similar patterns could reach users. Post-incident reviews should append regressions to golden sets, not only Confluence pages nobody reads. The goal is eval gates in CI becoming the authoritative release contract, replacing quarterly deck reviews executives already ignore.',
            ],
        },
        "tr": {
            "heading": "Toplantı değil merge'i durduran eval kapıları",
            "paragraphs": [
                "Slayt eval'leri model değiştiği hafta çürür. Golden dataset'leri versiyonlu kod sayın: prompt, beklenen rubric skoru ve judge yapılandırmasını uygulama mantığının yanında tutun, migration gibi PR'da review edilsin. Prompt, tool veya routing'e dokunan her MR'da CI donmuş alt küme replay etsin. Mutlak skor eşikleri base model upgrade ile kayar; yüzde doksan beş başlıkları yerine son yeşil baseline'a regresyona gate koyun.",
                "Otomatik grader'lar insanın güvendiği kalibrasyon ister. Haftalık spot check'te mühendisler failure örneği etiketlesin; anlaşmazlıklar rubric ve judge prompt'una geri beslensin. Flaky eval case'leri E2E'deki gibi owner'lı karantinaya alın. Başarısız gate deploy'u bloklasın; waiver'da adlı yönetici, süre ve kabul edilen müşteri etkisi ticket'ı olsun. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Eval harness production kısıtlarını yansıtmalı—aynı tool schema, latency bütçesi, retrieval index—god-mode API key'li iyimser sandbox değil. Eval run başına token harcamasını kaydedin; finans CI şişmesini görsün. Statik corpus embedding cache'leyin ama doküman store değişince invalidate edin. Eval süresi trendini unit test yanında yayınlayın; yavaş eval yerelde skip'i teşvik eder. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Eval failure'ları gözlemlenebilirliğe bağlayın. Gate toxic output veya bozuk JSON yakalarsa benzer pattern kullanıcıya ulaşabilirse synthetic probe ve on-call playbook'a ekleyin. Post-incident golden set'e regresyon eklemeli, yalnızca okunmayan wiki değil. Hedef: CI eval gate'leri yetkili release sözleşmesi olsun, yönetici quarterly deck'in yerini alsın. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
            ],
        },
        "de": {
            "heading": 'Eval-Gates stoppen Merges, nicht Meetings',
            "paragraphs": [
                'Slide-Deck-Evals vermodern in der Modellwechsel-Woche. Golden Datasets als versionierter Code: Prompts, Rubric-Scores, Judge-Config neben App-Logik, in PRs wie Migrationen reviewen. CI replayt frozen Subset bei jedem MR an Prompts, Tools, Routing. Absolute Score-Schwellen driften mit Base-Model-Upgrades; gating auf Regression gegen letzte grüne Baseline statt Vanity-95%-Headlines. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Automatische Grader brauchen Kalibrierung mit Vertrauen. Wöchentliche Spot-Checks: Engineers labeln Failure-Samples; Disagreements zurück in Rubric und Judge-Prompts. Flaky Eval-Cases in Quarantäne mit Ownern wie flaky E2E. Failed Gates blocken Deploy; Waivers mit named Executives, Expiry, Tickets zu akzeptiertem Customer Impact. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Eval-Harness spiegelt Prod-Constraints—Tool-Schemas, Latenz-Budgets, Retrieval-Indizes—kein Sandbox mit God-Mode-Keys. Token-Spend pro Eval-Run für Finance sichtbar. Embeddings für statische Corpora cachen, invalidieren bei Doc-Store-Changes. Eval-Dauer-Trends neben Unit-Tests publizieren; langsame Evals fördern lokales Skipping. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Eval-Failures an Observability koppeln. Toxic Output oder broken JSON in Gates → Synthetic Probes und On-Call-Playbooks wenn Pattern Nutzer erreichen könnte. Post-Incidents appenden Regressionen zu Golden Sets, nicht nur Confluence. Ziel: CI-Eval-Gates als authoritative Release-Vertrag statt quarterly Deck-Reviews. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
            ],
        },
        "fr": {
            "heading": 'Portes eval qui bloquent les merges',
            "paragraphs": [
                'Evals en slides pourrissent la semaine du changement de modèle. Datasets dorés comme code versionné : prompts, scores rubric, config juge à côté de la logique app, revus en PR comme migrations. CI rejoue sous-ensemble gelé sur chaque MR touchant prompts, tools, routing. Seuils absolus dérivent avec upgrades ; gate sur régression vs dernière baseline verte, pas titres vanity 95%.',
                "Graders auto exigent calibration humaine de confiance. Spot checks hebdo : engineers labellisent échantillon d'échecs ; désaccords alimentent rubric et prompts juge. Cas eval flaky en quarantaine avec owners comme E2E. Gates échoués bloquent deploy ; waivers avec exécutifs nommés, expiry, tickets d'impact client accepté. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Harness eval reflète contraintes prod—schemas tools, budgets latence, indices retrieval—pas sandbox optimiste clés god-mode. Dépense tokens par run eval pour finance. Cache embeddings corpus statiques, invalide si doc store change. Publier tendances durée eval à côté tests unitaires ; evals lentes encouragent skip local. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Relier échecs eval à observabilité. Gate attrape output toxique ou JSON cassé → ajouter probes synthetics et playbooks on-call si pattern peut atteindre users. Post-incident append régressions aux golden sets, pas seulement Confluence. Objectif : gates CI comme contrat release autoritaire remplaçant revues deck trimestrielles. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
            ],
        },
        "it": {
            "heading": 'Gate eval che bloccano i merge',
            "paragraphs": [
                'Eval su slide marciscono quando cambia il modello. Dataset golden come codice versionato: prompt, punteggi rubric, config judge accanto alla logica app, review in PR come migrazioni. CI replay subset congelato su ogni MR che tocca prompt, tool, routing. Soglie assolute derivano con upgrade base model; gate su regressione vs ultima baseline verde, non titoli vanity 95%.',
                "Grader automatici servono calibrazione umana fidata. Spot check settimanali: engineer etichettano campione failure; disaccordi alimentano rubric e prompt judge. Casi eval flaky in quarantena con owner come E2E. Gate falliti bloccano deploy; waiver con executive nominati, scadenza, ticket impatto cliente accettato. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Harness eval rispecchia vincoli prod—schema tool, budget latenza, indici retrieval—non sandbox ottimista con chiavi god-mode. Spesa token per run eval visibile a finance. Cache embedding corpora statici, invalida se doc store cambia. Pubblicare trend durata eval accanto unit test; eval lenti incoraggiano skip locale. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Collegare failure eval a observability. Gate cattura output tossico o JSON rotto → aggiungere probe synthetic e playbook on-call se pattern può raggiungere utenti. Post-incident appende regressioni ai golden set, non solo Confluence. Obiettivo: gate CI come contratto release autorevole al posto delle review deck trimestrali. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
            ],
        },
        "zh": {
            "heading": '阻断合并而非会议的 eval 门禁',
            "paragraphs": [
                '幻灯片 eval 在模型更换当周就会腐烂。将黄金数据集视为版本化代码：prompt、期望 rubric 分数与 judge 配置与应用逻辑同仓，在 PR 中像迁移一样评审。凡改动 prompt、工具或路由的 MR，CI 应重放冻结子集。绝对分数阈值随基座升级漂移；应对相对上次绿基线的回归设门禁，而非 vanity 95% 标题。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '自动评分器需要人可信的校准。每周抽检：工程师标注失败样本；分歧反馈到 rubric 与 judge prompt。不稳定 eval 用例像 flaky E2E 一样隔离并指定 owner。门禁失败应阻断发布；豁免须具名高管、过期日与记录已接受客户影响的工单。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                'Eval  harness 须镜像生产约束——相同 tool schema、延迟预算与检索索引——而非带 god-mode 密钥的乐观沙箱。记录每次 eval 的 token 花费供财务发现 CI 膨胀。静态语料 embedding 可缓存，文档库变更须失效。与单元测试并列发布 eval 耗时趋势；过慢会鼓励本地跳过。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '将 eval 失败连到可观测性。门禁捕获有毒输出或坏 JSON 时，若类似模式可能触达用户，应加入合成探针与 on-call 剧本。事后回顾应向黄金集追加回归，而非只改 Confluence。目标让 CI eval 门禁成为权威发布契约，取代管理层已忽视的季度 deck。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
            ],
        },
        "ja": {
            "heading": '会議ではなく merge を止める eval ゲート',
            "paragraphs": [
                'スライド eval はモデル変更週に腐ります。golden dataset を version コード扱い：prompt、期待 rubric スコア、judge 設定をアプリロジック横に置き、migration 同様 PR review。prompt・tool・routing に触れる MR ごとに CI が frozen subset を replay。絶対閾値は base model upgrade で drift；vanity 95% 見出しより最後の緑 baseline への regression で gate。',
                '自動 grader は人が信じる較正が要る。週次 spot check で engineer が failure サンプルにラベル；不一致は rubric と judge prompt へ。flaky eval case は flaky E2E と同様 owner 付き quarantine。失敗 gate は deploy block；waiver は named executive、失効、受容した customer impact チケット。',
                'eval harness は prod 制約—tool schema、latency バジェット、retrieval index—を鏡写し、god-mode key の楽観 sandbox 不可。eval run あたり token  spend を finance 向けに記録。静的 corpus embedding は cache、doc store 変更で invalidate。eval 時間 trend を unit test 横に公開；遅い eval は local skip を促進。',
                'eval failure を observability に接続。gate が toxic output や broken JSON を捕らえたら user に届きうる pattern なら synthetic probe と on-call playbook へ。post-incident は golden set に regression を append、Confluence だけにしない。目標は CI eval gate を authoritative release 契約とし四半期 deck を置換。',
            ],
        },
    },
    "on-call-runbooks-for-ai-product-incidents": {
        "en": {
            "heading": 'Runbooks operators trust during model outages',
            "paragraphs": [
                'AI incidents blur categories—model vendor outages, retrieval index staleness, policy refusals, client-side streaming bugs, and runaway token spend can feel identical to users. Runbooks must start with a decision tree mapping symptoms to checks: gateway five hundreds versus empty completions versus moderation loops. Customer messaging templates differ per class; copying generic status text erodes trust when the root cause is billing, not creativity.',
                'Kill switches for model routes and feature flags should be tested monthly with game days, discovering broken switches during a real outage is expensive. Document which switch disables tools only, which falls back to cached answers, and which blocks writes. On-call load includes cost spikes—wire billing alerts and rate-limit dashboards into the same paging policy as error rates. Finance should see annotations when incidents force emergency quota raises.',
                'Tool-heavy agents need runbook steps for external dependency failures—CRM timeouts, payment double posts, ticket systems returning ambiguous errors—not only LLM latency. Include idempotency guidance and customer-safe retry messaging. Post-incident reviews must update eval cases and synthetic probes, not only wiki pages. If a runbook step requires manual SQL, link audited scripts with dry-run examples, not improvised queries at three a.m.',
                'Runbooks stay useful when operators rehearse them. Rotate shadow on-call for AI features before holiday freezes; new hires should page once with a mentor for benign drills. Capture time-to-mitigate and time-to-root-cause metrics per incident type. Leadership reviews trends quarterly, funding fixes for recurring retrieval gaps or missing circuit breakers instead of adding headcount alone. Record the owner, review date, and rollback trigger in the same change ticket so the next on-call engineer can trace decisions.',
            ],
        },
        "tr": {
            "heading": "Model kesintisinde güvenilen runbook'lar",
            "paragraphs": [
                "AI olayları kategorileri bulanıklaştırır—vendor outage, retrieval index bayatlığı, politika red'i, client streaming bug'ı, token maliyeti patlaması kullanıcıya aynı hissedilir. Runbook semptom→check karar ağacıyla başlamalı: gateway 500 mü, boş completion mı, moderasyon döngüsü mü. Müşteri mesaj şablonları sınıfa göre değişir; kök neden faturalama iken generic status güveni eritir. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Model route kill switch ve feature flag'ler aylık game day ile test edilmeli; gerçek outage'da bozuk switch keşfi pahalıdır. Hangi switch yalnızca tool'u kapatır, hangisi cache cevaba düşer, hangisi write'ı bloklar belgelensin. On-call yükü maliyet spike'ını içerir—billing alert ve rate-limit panolarını error rate ile aynı paging'e bağlayın. Acil kota artışında finans annotation görsün. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Tool ağırlıklı agent runbook'unda CRM timeout, çift ödeme, belirsiz ticket hatası gibi dış bağımlılık adımları olmalı, yalnızca LLM latency değil. Idempotency rehberi ve müşteri güvenli retry mesajı ekleyin. Post-incident eval case ve synthetic probe güncellemeli, yalnızca wiki değil. Runbook SQL gerektiriyorsa dry-run örnekli denetli script linkleyin. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Operatör prova edince runbook yaşar. Tatil freeze öncesi AI için shadow on-call rotasyonu; yeni işe alınan mentor eşliğinde benign page alsın. Olay tipine göre time-to-mitigate ve time-to-root-cause ölçün. Liderlik çeyreklik trend review'da tekrarlayan retrieval açığı veya eksik circuit breaker için headcount yerine fix bütçesi ayırsın. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
            ],
        },
        "de": {
            "heading": 'Runbooks bei Modellausfällen mit Vertrauen',
            "paragraphs": [
                'KI-Incidents verwischen Kategorien—Vendor-Outage, stale Retrieval-Index, Policy-Refusals, Client-Streaming-Bugs, Token-Kosten—fühlen sich für Nutzer gleich an. Runbooks starten mit Entscheidungsbaum Symptom→Check: Gateway-500 vs leere Completions vs Moderation-Loops. Kunden-Templates pro Klasse; generischer Status bei Billing-Ursache zerstört Vertrauen. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Kill-Switches für Modell-Routen monatlich in Game Days testen; kaputte Switches im echten Outage sind teuer. Dokumentieren welcher Switch nur Tools stoppt, welcher auf Cache-Antworten fällt, welcher Writes blockt. On-Call um Cost-Spikes erweitern—Billing-Alerts und Rate-Limit-Dashboards wie Error Rates page. Finance sieht Annotations bei Emergency-Quota. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Tool-heavy Agents brauchen Runbook-Schritte für externe Failures—CRM-Timeout, Doppelzahlungen, ambiguous Ticket-Errors—nicht nur LLM-Latenz. Idempotency-Guidance und kundensichere Retry-Texte. Post-Incidents updaten Eval-Cases und Synthetic Probes, nicht nur Wiki. SQL-Schritte verlinken auditierte Scripts mit Dry-Run, keine ad-hoc Queries um drei Uhr. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Runbooks bleiben nutzbar durch Proben. Shadow On-Call für KI vor Holiday Freeze; New Hires einmal pagend mit Mentor. TTmitigate und TTroot pro Incident-Typ messen. Leadership quarterly Trends reviewen und Fixes für wiederkehrende Retrieval-Lücken statt nur Headcount. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
            ],
        },
        "fr": {
            "heading": 'Runbooks de confiance pendant pannes modèle',
            "paragraphs": [
                "Incidents IA brouillent catégories—panne vendor, index retrieval périmé, refus policy, bugs streaming client, coût tokens—paraissent identiques aux users. Runbooks commencent par arbre symptôme→checks : 500 gateway vs completions vides vs boucles modération. Templates client diffèrent par classe ; statut générique quand cause facturation érode confiance. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Kill switches routes modèle testés mensuellement en game days ; switches cassés en vraie panne coûtent cher. Documenter switch qui coupe tools seulement, fallback cache, ou bloque writes. On-call inclut pics coût—alertes billing et dashboards rate-limit paginés comme error rates. Finance voit annotations si quota d'urgence. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Agents tool-heavy : étapes pour échecs externes—timeout CRM, double paiement, erreurs tickets ambiguës—pas seulement latence LLM. Guidance idempotency et messages retry sûrs client. Post-incident met à jour eval cases et probes synthetics, pas seulement wiki. SQL manuel → scripts audités avec dry-run, pas requêtes improvisées à 3h. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Runbooks utiles si opérateurs répètent. Shadow on-call IA avant gel holidays ; nouvelles recrues pagées une fois avec mentor. Métriques time-to-mitigate et root-cause par type incident. Leadership revoit tendances trimestrielles et finance fixes gaps retrieval récurrents plutôt que headcount seul. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
            ],
        },
        "it": {
            "heading": 'Runbook fidati durante outage modello',
            "paragraphs": [
                "Incident AI confondono categorie—outage vendor, retrieval index stale, rifiuti policy, bug streaming client, costo token—sembrano uguali agli utenti. Runbook inizia con albero sintomo→check: 500 gateway vs completion vuote vs loop moderazione. Template clienti per classe; status generico con causa billing erode fiducia. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Kill switch route modello testati mensilmente in game day; switch rotti in outage reale costano caro. Documentare quale switch disabilita solo tool, fallback cache, o blocca write. On-call include picchi costo—alert billing e dashboard rate-limit paginati come error rate. Finance vede annotation su quota emergenza. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Agent tool-heavy: passi per failure esterni—timeout CRM, doppio pagamento, errori ticket ambigui—non solo latenza LLM. Guida idempotency e messaggi retry sicuri. Post-incident aggiorna eval case e probe synthetic, non solo wiki. SQL manuale → script auditati con dry-run, non query improvvisate alle tre. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Runbook utili se operatori provano. Shadow on-call AI prima freeze festivi; nuovi assunti pagati una volta con mentor. Metriche time-to-mitigate e root-cause per tipo incident. Leadership review trimestrale trend e finanzia fix per gap retrieval ricorrenti invece di solo headcount. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
            ],
        },
        "zh": {
            "heading": '模型故障时值班员可信的 runbook',
            "paragraphs": [
                'AI 事件类别易混——供应商中断、检索索引过期、策略拒绝、客户端流式 bug、token 费用失控——用户感受相似。Runbook 应以症状→检查决策树开篇：网关 500、空 completion 还是审核循环。客户消息模板按类别区分；根因是账单时复制通用状态会损害信任。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '模型路由 kill switch 与 feature flag 应每月 game day 演练；真实故障才发现开关失效代价高。记录哪个开关仅禁 tool、哪个回退缓存答案、哪个阻断写入。On-call 负荷含成本尖峰——将账单告警与限流仪表盘与错误率同等分页。紧急提配额时财务应看到标注。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '重 tool 的 agent runbook 须覆盖外部依赖失败——CRM 超时、重复扣款、工单系统含糊错误——而非仅 LLM 延迟。含幂等指引与客户安全重试文案。事后须更新 eval 用例与合成探针，而非只改 wiki。若步骤需手工 SQL，链接带 dry-run 的审计脚本，避免凌晨即兴查询。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '值班员演练 runbook 才有用。假日前轮换 AI shadow on-call；新人应在导师陪同下 benign 接警一次。按事件类型记录缓解与根因耗时。领导季度审趋势，为反复出现的检索缺口或缺失熔断器拨款修 fix，而非只加人头。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
            ],
        },
        "ja": {
            "heading": 'モデル障害で信頼される runbook',
            "paragraphs": [
                'AI インシデントは vendor outage、retrieval index  stale、policy refusal、client streaming bug、token コスト急増をユーザーから同じに見せます。runbook は symptom→check 決定木から：gateway 500、空 completion、moderation loop。顧客テンプレはクラス別；billing が原因なのに generic status は trust を削る。',
                'モデル route kill switch と feature flag は月次 game day でテスト；本番 outage で壊れた switch 発見は高コスト。tools のみ止める switch、cache 回答 fallback、write block を文書化。on-call は cost spike を含む—billing alert と rate-limit dashboard を error rate と同 paging。緊急 quota 増で finance に annotation。',
                'tool 多い agent は CRM timeout、二重課金、曖昧 ticket エラーなど外部 failure 手順が要り、LLM latency だけでない。idempotency ガイドと顧客安全 retry メッセージ。post-incident は eval case と synthetic probe を更新、wiki のみ禁止。手動 SQL は dry-run 付き監査 script リンク、午前三時の即興 query 禁止。',
                'オペレータがリハーサルすると runbook が生きる。holiday freeze 前に AI shadow on-call ローテ；新人は mentor 付き benign page 一度。incident タイプ別 time-to-mitigate と root-cause。リーダーシップは四半期 trend を review し recurring retrieval gap や欠落 circuit breaker に headcount だけでなく fix 予算。',
            ],
        },
    },
    "idempotency-keys-for-agent-tool-side-effects": {
        "en": {
            "heading": 'Keys that survive agent retries',
            "paragraphs": [
                'Agents retry tool calls aggressively after timeouts or ambiguous model outputs, duplicating payments, tickets, or inventory holds silently without idempotency. Require clients to generate stable keys per logical side effect, persisted with the invocation record in your database, not only in process memory that restarts erase. Keys should combine user or tenant scope with intent hash so parallel legitimate actions still succeed while duplicates collapse to the original response.',
                'Document which tools are safe to retry automatically versus which need human confirmation in runbooks and OpenAPI descriptions. Integration tests must simulate duplicate deliveries with the same key and conflicting payloads, expecting deterministic rejection or no-op semantics. Partial failures—charge succeeded but ledger write failed—need reconciliation jobs keyed the same way to avoid double settlement during cleanup sweeps.',
                'Gateway layers should enforce key presence for mutating routes before requests reach domain services. Metrics on replay hits, stale keys, and rejected duplicates help tune TTL windows; keys kept forever blow up storage, keys expiring too soon reintroduce double spend. Align key TTL with business reconciliation windows and card network rules, publishing the matrix to partner teams integrating new tools.',
                'When orchestrating multi-step agent plans, propagate a parent idempotency scope to child tools so partial replays do not fork inconsistent state. Log key identifiers alongside trace IDs for support lookups without logging full arguments. Security reviews should treat missing idempotency on financial tools as release blockers equal to missing authentication, because the blast radius is customer money, not only log noise.',
            ],
        },
        "tr": {
            "heading": "Agent retry'lerinde yaşayan anahtarlar",
            "paragraphs": [
                "Agent'lar timeout veya belirsiz model çıktısı sonrası tool call'ları agresif retry eder; idempotency yoksa ödeme, ticket veya stok hold sessizce çoğalır. Mantıksal yan etki başına stabil key üretin; restart'ın sildiği process memory değil invocation kaydıyla DB'de persist edin. Key tenant/kullanıcı kapsamı ile intent hash birleştirsin: paralel meşru işlemler geçsin, duplicate orijinal yanıta collapse olsun. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Hangi tool'un otomatik retry-safe, hangisinin insan onayı gerektirdiğini runbook ve OpenAPI'da yazın. Integration test aynı key ile duplicate delivery ve çakışan payload simüle etsin; deterministik red veya no-op bekleyin. Kısmi failure—charge OK ledger fail—reconciliation job aynı key ile çalışsın, cleanup'ta çift settlement olmasın. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Gateway mutating route'larda domain'e gitmeden key varlığını enforce etsin. Replay hit, stale key, rejected duplicate metrikleri TTL ayarına yardım eder; sonsuz key depo şişirir, erken expiry çift harcamayı geri getirir. Key TTL'yi mutabakat penceresi ve kart ağı kurallarıyla hizalayın; matrisi yeni tool entegre eden partner'e yayınlayın. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Çok adımlı agent planlarında parent idempotency scope'u child tool'lara taşıyın; kısmi replay tutarsız state çatallamasın. Support lookup için trace ID yanında key identifier loglayın, tam argüman değil. Finansal tool'da eksik idempotency, eksik auth kadar release blocker sayılmalı; blast radius müşteri parasıdır. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
            ],
        },
        "de": {
            "heading": 'Keys die Agent-Retries überleben',
            "paragraphs": [
                'Agents retrien Tool-Calls aggressiv nach Timeouts oder ambiguous Outputs; ohne Idempotency duplizieren Zahlungen, Tickets, Holds still. Stabile Keys pro logischem Side-Effect, persistiert mit Invocation-Record in DB, nicht nur RAM den Restart löscht. Keys kombinieren Tenant/User-Scope mit Intent-Hash: parallele legitime Actions ok, Duplikate kollabieren zur Original-Response. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Dokumentieren welche Tools auto-retry-safe sind vs Human-Confirm in Runbooks und OpenAPI. Integrationstests simulieren Duplicate-Delivery gleicher Key mit konfliktierenden Payloads—deterministische Rejection oder No-Op. Partial Failures—Charge ok, Ledger fail—Reconciliation-Jobs mit gleichem Key gegen Double Settlement bei Cleanup. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Gateway erzwingt Key-Präsenz auf mutierenden Routes vor Domain-Services. Metriken Replay-Hits, stale Keys, rejected Duplicates für TTL-Tuning; ewige Keys blähen Storage, zu kurze TTL Double-Spend. Key-TTL an Reconciliation-Fenster und Card-Network-Regeln, Matrix an Partner-Teams. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Multi-Step-Agent-Pläne: Parent-Idempotency-Scope an Child-Tools propagieren damit Partial-Replays keinen inconsistent Fork erzeugen. Key-IDs neben Trace-IDs loggen ohne volle Args. Security-Reviews: fehlende Idempotency auf Financial Tools Release-Blocker wie fehlende Auth—Blast Radius ist Kundengeld. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
            ],
        },
        "fr": {
            "heading": 'Clés qui survivent aux retries agent',
            "paragraphs": [
                "Les agents retentent agressivement après timeout ou sorties ambiguës ; sans idempotency paiements, tickets, holds se dupliquent silencieusement. Exiger clés stables par effet de bord logique, persistées avec l'enregistrement d'invocation en base, pas seulement RAM effacée au restart. Clés combinent scope tenant/user et hash intent : actions légitimes parallèles ok, doublons collapsent vers réponse originale.",
                "Documenter outils safe retry auto vs confirmation humaine dans runbooks et OpenAPI. Tests intégration simulent livraisons dupliquées même clé et payloads conflictuels—rejet déterministe ou no-op. Échecs partiels—charge ok ledger fail—jobs réconciliation même clé pour éviter double règlement au cleanup. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Gateway enforce présence clé sur routes mutantes avant services domaine. Métriques replay hits, clés stale, doublons rejetés pour tuner TTL ; clés éternelles gonflent stockage, expiry trop court réintroduit double dépense. Aligner TTL clé sur fenêtres réconciliation et règles réseau cartes ; publier matrice aux partenaires intégrant tools. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Plans agent multi-étapes : propager scope idempotency parent aux tools enfants pour que replays partiels ne forquent pas état incohérent. Logger identifiants clé avec trace IDs sans args complets. Revues sécurité : idempotency manquante sur tools financiers bloque release comme auth manquante—rayon client argent. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
            ],
        },
        "it": {
            "heading": 'Chiavi che sopravvivono ai retry agent',
            "paragraphs": [
                'Gli agent ritentano tool call aggressivamente dopo timeout o output ambigui; senza idempotency pagamenti, ticket, hold si duplicano silenziosamente. Richiedere chiavi stabili per effetto collaterale logico, persistite con record invocazione in DB, non solo RAM cancellata al restart. Chiavi combinano scope tenant/user e hash intent: azioni legittime parallele ok, duplicati collassano alla risposta originale. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le.',
                "Documentare tool safe auto-retry vs conferma umana in runbook e OpenAPI. Test integrazione simulano consegne duplicate stessa chiave e payload conflittuali—rifiuto deterministico o no-op. Failure parziali—charge ok ledger fail—job riconciliazione stessa chiave per evitare doppio settlement in cleanup. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Gateway impone presenza chiave su route mutanti prima dei servizi dominio. Metriche replay hit, chiavi stale, duplicati rifiutati per tuning TTL; chiavi eternal gonfiano storage, expiry troppo presto reintroduce double spend. Allineare TTL chiave a finestre riconciliazione e regole network carte; pubblicare matrice ai partner che integrano tool. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Piani agent multi-step: propagare scope idempotency parent ai tool figli così replay parziali non forkano stato inconsistente. Loggare id chiave con trace ID senza argomenti completi. Security review: idempotency mancante su tool finanziari blocca release come auth mancante—blast radius è denaro cliente. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
            ],
        },
        "zh": {
            "heading": '经得住 agent 重试的幂等键',
            "paragraphs": [
                'Agent 在超时或模型输出含糊时会激进重试 tool 调用；无幂等则支付、工单或库存 hold 会静默重复。要求客户端为每个逻辑副作用生成稳定键，与调用记录一并持久化到数据库，而非仅存于进程重启即失的内存。键应结合租户/用户范围与意图哈希：并行合法操作仍成功，重复请求折叠为原响应。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '在 runbook 与 OpenAPI 中说明哪些 tool 可自动重试、哪些需人工确认。集成测试应模拟同键重复投递与冲突 payload，期望确定性拒绝或 no-op。部分失败——扣款成功账本写入失败——对账任务须用相同键，避免清理扫掠时双重结算。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '网关层应在 mutating 路由到达领域服务前强制携带键。重放命中、过期键、拒绝重复等指标用于调 TTL；键永不过期会撑爆存储，过早过期又引入双花。键 TTL 与业务对账窗口及卡组织规则对齐，并向接入新 tool 的伙伴发布矩阵。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '编排多步 agent 计划时，将父幂等作用域传播到子 tool，避免部分重放分叉不一致状态。为支持查询在 trace ID 旁记录键标识，勿记完整参数。安全评审应将金融 tool 缺失幂等视为与缺失认证同级的发布阻断，爆炸半径是客户资金而非日志噪音。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
            ],
        },
        "ja": {
            "heading": 'agent retry を生き延びる idempotency key',
            "paragraphs": [
                'agent は timeout や曖昧な model output 後に tool call を積極 retry；idempotency なしでは決済、ticket、hold が静かに重複。論理 side effect ごとに安定 key を生成し、restart で消える process memory ではなく invocation レコードと DB に persist。key は tenant/user scope と intent hash を組み合わせ、並列の正当 action は成功し duplicate は original response に collapse。',
                'auto-retry safe な tool と human confirm 要る tool を runbook と OpenAPI に明記。integration test は同一 key の duplicate delivery と矛盾 payload を simulate—deterministic reject か no-op。partial failure—charge OK ledger fail—は同 key の reconciliation job で cleanup 時 double settlement 回避。',
                'gateway は mutating route で domain 到達前に key 存在を enforce。replay hit、stale key、rejected duplicate メトリクスで TTL 調整；永久 key は storage 膨張、短すぎる expiry は double spend 再導入。key TTL を reconciliation 窓と card network 規則に合わせ、新 tool 統合 partner に matrix 公開。',
                'multi-step agent plan では parent idempotency scope を child tool へ propagateし partial replay で inconsistent fork 禁止。support 用に trace ID 横に key identifier を log、full args は不可。financial tool の idempotency 欠如は auth 欠如と同格 release blocker—blast radius は customer money。',
            ],
        },
    },
    "synthetic-probes-for-llm-gateways": {
        "en": {
            "heading": 'Probes that mirror production client paths',
            "paragraphs": [
                'Admin-only health endpoints lie about user experience. Synthetic probes must authenticate like production clients, traverse rate limits, routing rules, and regional gateways, then assert on time-to-first-token and JSON schema validity—not merely HTTP two hundred. Store probe transcripts separately from customer traffic logs to avoid feedback loops where probes pollute training or eval sets. Rotate prompts weekly to detect subtle quality drift, not only hard five hundreds.',
                'Alert on percentile latency before social media complaints arrive. Baseline probes during known vendor maintenance windows so pages distinguish expected blips from regressions you caused. Include a tool-call probe path if agents are in scope; empty completions with two hundred responses are a common failure mode synthetics miss when checks only ping chat completions without functions enabled.',
                'Probe failures should link to runbooks and recent deploys automatically in incident tickets. Tag probes by model route and region; a green check in Virginia while Oregon fails still blocks release if your SLA promises global availability. Cost-control teams need dashboards on probe token spend so monitoring does not become its own budget incident. Record the owner, review date, and rollback trigger in the same change ticket so the next on-call engineer can trace decisions.',
                'Treat probe datasets like production config—review changes in pull requests, version prompts, and document expected rubric scores for qualitative checks where automation compares embeddings distance. After incidents, add failing scenarios to probes before closing the postmortem. Probes complement eval gates in CI; together they catch routing misconfigurations decks never exercise because demos use shortcut API keys.',
            ],
        },
        "tr": {
            "heading": 'Prod istemci yolunu yansıtan probeler',
            "paragraphs": [
                "Yalnızca admin health endpoint'leri kullanıcı deneyimini yalanlar. Synthetic probeler prod client gibi authenticate olmalı; rate limit, routing ve bölgesel gateway'den geçip time-to-first-token ve JSON schema assert etmeli—yalnızca HTTP 200 değil. Probe transkriptlerini müşteri trafik log'undan ayrı tutun; probe'ların training/eval set'ini kirletmesini önleyin. Haftalık prompt rotasyonu ince kalite drift'ini yakalar, yalnızca sert 500'leri değil. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Sosyal medya şikayetinden önce percentile latency alert edin. Bilinen vendor maintenance penceresinde baseline probe çalıştırın; sayfalar beklenen blip ile sizin regresyonunuzu ayırsın. Agent kapsamdaysa tool-call probe path ekleyin; yalnızca function'sız chat completion ping'leyen check'ler 200 dönen boş completion'ı kaçırır. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Probe failure incident ticket'ında runbook ve son deploy'a otomatik linklensin. Probe'ları model route ve bölgeye tag'leyin; Virginia yeşil Oregon kırmızıysa global SLA varsa release bloklanmalı. Maliyet kontrol ekipleri probe token harcaması dashboard'u görmeli; monitoring kendi bütçe olayına dönmesin. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
                "Probe dataset'lerini prod config gibi yönetin—PR review, versiyonlu prompt, embedding mesafesi ile otomasyon yapılan kalitatif check'lerde beklenen rubric skoru. Postmortem kapanmadan failing senaryoyu probe'a ekleyin. Probe'lar CI eval gate'lerini tamamlar; birlikte deck'lerin shortcut API key ile asla koşmadığı routing misconfig'lerini yakalar. Sahip, gözden geçirme tarihi ve rollback tetikleyicisini aynı değişiklik ticket'ında kaydedin; sonraki on-call mühendis olayı yeniden açmadan kararları izleyebilsin.",
            ],
        },
        "de": {
            "heading": 'Probes spiegeln Prod-Client-Pfade',
            "paragraphs": [
                'Admin-only Health-Endpoints lügen über UX. Synthetic Probes authentifizieren wie Prod-Clients, durchlaufen Rate-Limits, Routing, regionale Gateways, asserten Time-to-First-Token und JSON-Schema—not only HTTP 200. Probe-Transcripts getrennt von Customer-Logs gegen Feedback-Loops in Training/Eval. Wöchentliche Prompt-Rotation für subtilen Quality-Drift, nicht nur harte 500er. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Percentile-Latency alerten vor Social-Media-Beschwerden. Baseline-Probes während Vendor-Maintenance damit Pages erwartete Blips von eigenen Regressionen trennen. Tool-Call-Probe-Pfad wenn Agents im Scope; leere Completions mit 200 verpassen Checks die nur Chat ohne Functions pingen. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Probe-Failures verlinken Runbooks und recent Deploys in Incident-Tickets. Probes taggen nach Modell-Route und Region; Virginia grün Oregon rot blockt Release bei globalem SLA. Cost-Control braucht Dashboards Probe-Token-Spend damit Monitoring kein eigenes Budget-Incident wird. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
                'Probe-Datasets wie Prod-Config—PR-Review, versionierte Prompts, erwartete Rubric-Scores bei Embedding-Distanz-Automation. Nach Incidents failing Scenarios zu Probes vor Postmortem-Close. Probes ergänzen CI-Eval-Gates; zusammen fangen Routing-Misconfigs die Decks mit Shortcut-Keys nie testen. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein, damit der nächste On-Call-Engineer Entscheidungen ohne Reopen des Incidents nachvollzieht.',
            ],
        },
        "fr": {
            "heading": 'Sondes calquées sur les chemins clients prod',
            "paragraphs": [
                "Health endpoints admin-only mentent sur l'UX. Probes synthetics s'authentifient comme clients prod, traversent rate limits, routing, gateways régionaux, assert time-to-first-token et schema JSON—pas seulement HTTP 200. Transcripts probes séparés des logs clients pour éviter boucles feedback training/eval. Rotation prompts hebdo pour drift qualité subtil, pas seulement 500 durs. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Alerter latence percentile avant plaintes réseaux sociaux. Baseline probes pendant maintenance vendor connue pour séparer blips attendus de vos régressions. Chemin probe tool-call si agents in scope ; completions vides avec 200 manquées si checks pingent chat sans functions. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Échecs probe lient runbooks et deploys récents dans tickets incident. Tagger probes par route modèle et région ; Virginia vert Oregon rouge bloque release si SLA global. Équipes coût veulent dashboards dépense tokens probes pour que monitoring ne devienne pas incident budget. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
                "Datasets probes comme config prod—review PR, prompts versionnés, scores rubric attendus pour checks qualitatifs par distance embeddings. Après incidents ajouter scénarios failing aux probes avant clôture postmortem. Probes complètent gates eval CI ; ensemble attrapent misconfigs routing que decks avec clés shortcut ne testent jamais. Consignez owner, date de revue et déclencheur rollback dans le même ticket de changement afin que le prochain engineer on-call retrace les décisions sans rouvrir l'incident.",
            ],
        },
        "it": {
            "heading": 'Probe che rispecchiano i path client prod',
            "paragraphs": [
                "Health endpoint solo admin mentono sull'UX. Probe synthetic autenticano come client prod, attraversano rate limit, routing, gateway regionali, assert time-to-first-token e schema JSON—non solo HTTP 200. Transcript probe separati da log clienti per evitare feedback loop su training/eval. Rotazione prompt settimanale per drift qualità sottile, non solo 500 duri. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Alertare latenza percentile prima delle lamentele social. Baseline probe durante maintenance vendor nota per separare blip attesi dalle vostre regressioni. Path probe tool-call se agent in scope; completion vuote con 200 perse se check pingano chat senza functions. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Failure probe collegano runbook e deploy recenti nei ticket incident. Tag probe per route modello e regione; Virginia verde Oregon rosso blocca release con SLA globale. Team costo vogliono dashboard spesa token probe così monitoring non diventa incident budget. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
                "Dataset probe come config prod—review PR, prompt versionati, punteggi rubric attesi per check qualitativi con distanza embedding. Dopo incident aggiungere scenari failing alle probe prima chiusura postmortem. Probe completano gate eval CI; insieme catturano misconfig routing che deck con chiavi shortcut non esercitano mai. Registrate owner, data di review e trigger di rollback nello stesso ticket di change così il prossimo on-call engineer rintraccia le decisioni senza riaprire l'incident.",
            ],
        },
        "zh": {
            "heading": '镜像生产客户端路径的探针',
            "paragraphs": [
                '仅管理员健康端点无法反映真实体验。合成探针须像生产客户端一样认证，经过限流、路由与区域网关，断言首 token 时间与 JSON schema 有效性——而非只看 HTTP 200。探针转录与客户流量日志分开存储，避免污染训练或 eval 集的反馈环。每周轮换 prompt 以发现细微质量漂移，而非仅硬 500。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '在社交媒体抱怨前对分位延迟告警。在已知供应商维护窗口运行基线探针，使值班能区分预期抖动与自身回归。若范围含 agent，加入 tool-call 探针路径；仅 ping 无 function 的 chat completion 的检查常会漏掉返回 200 的空 completion。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '探针失败应在事件工单中自动链接 runbook 与近期发布。按模型路由与区域标记探针；弗吉尼亚绿而俄勒冈红时，若 SLA 承诺全球可用仍应阻断发布。成本控制团队需要探针 token 花费仪表盘，以免监控本身成为预算事件。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
                '将探针数据集当作生产配置——PR 评审、版本化 prompt，以及在自动化比较 embedding 距离时记录期望 rubric 分数。事后在关闭 postmortem 前把失败场景加入探针。探针与 CI eval 门禁互补；共同捕获演示用 shortcut API 密钥从未覆盖的路由误配。 在同一变更工单中记录负责人、评审日期与回滚触发条件，以便下一轮值班工程师无需重开事件即可追溯决策。',
            ],
        },
        "ja": {
            "heading": 'prod クライアント path を映す probe',
            "paragraphs": [
                'admin 専用 health endpoint は UX を嘘つく。synthetic probe は prod client 同様に auth し、rate limit、routing、地域 gateway を通過、time-to-first-token と JSON schema を assert—HTTP 200 だけでない。probe transcript は customer ログと分離し training/eval 汚染の feedback loop 回避。週次 prompt ローテで subtle quality drift を検知、hard 500 だけでない。',
                'SNS 苦情前に percentile latency を alert。既知 vendor maintenance 中に baseline probe を走らせ、期待 blip と自前 regression を分離。agent scope なら tool-call probe path；function なし chat ping だけの check は 200 の空 completion を見逃す。 担当者、レビュー日、ロールバック条件を同一変更チケットに記録し、次の on-call エンジニアがインシデントを再オープンせず判断を追跡できるようにする。',
                'probe failure は incident ticket で runbook と recent deploy へ自動 link。model route と region で tag；Virginia 緑 Oregon 赤なら global SLA なら release block。cost control は probe token spend dashboard を要り、monitoring が別 budget incident にならないように。',
                'probe dataset を prod config 扱い—PR review、version prompt、embedding 距離 automation の qualitative check では期待 rubric score を文書化。incident 後 postmortem close 前に failing scenario を probe へ追加。probe は CI eval gate を補完；deck の shortcut API key では never 走る routing misconfig を両方で捕捉。',
            ],
        },
    },
    "circuit-breakers-for-llm-vendor-failures": {
        "en": {
            "heading": "Breaker operations the gateway team owns",
            "paragraphs": [
                "Vendor brownouts often look healthy on HTTP dashboards while latency tails and empty tool payloads erode trust. Scope circuit breakers per vendor, model route, and tenant tier so one sick embedding path does not drain the entire gateway budget. Trip on consecutive timeouts, schema validation failures, and rising refusal rates—not only five hundreds. Export open, half-open, and closed state as metrics product can read beside error budgets during launch week. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Fallback routes need explicit ordering and cost ceilings documented in runbooks, not tribal knowledge in chat. Degraded tiers might use a cheaper draft model, cached retrieval answers, or a honest retry banner with preserved idempotency keys. When the breaker opens, surface degraded mode in the client so support tickets reference infra state instead of mystery quality drops. Game-day injections of provider timeouts should precede major releases. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Half-open recovery must use fixed-cost golden probes that assert streaming completion and tool shape, not a percentage of live traffic. Failed probes should return to open with exponential backoff to prevent alert flapping that trains on-call to ignore pages. Pair breaker transitions with spend caps so automatic retries do not double token bills while users still see errors. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Security and finance reviews should treat missing breakers on paid model routes as release blockers equal to missing authentication. Log breaker decisions with trace identifiers for post-incident timelines without storing full prompts. Quarterly reviews compare breaker thresholds against vendor incident history and tune per region when peering issues dominate failures. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first."],
        },
        "tr": {
            "heading": "Gateway ekibinin sahiplendiği breaker operasyonu",
            "paragraphs": [
                "Vendor brownout'ları HTTP dashboard'da sağlıklı görünürken latency kuyruğu ve boş tool payload güveni aşındırır. Circuit breaker'ları vendor, model route ve tenant tier bazında scope edin; tek hasta embedding yolu tüm gateway bütçesini boşaltmasın. Ardışık timeout, schema validation failure ve artan refusal oranında açın—yalnızca beş yüzlerde değil. Open, half-open ve closed durumunu launch haftasında error budget yanında okunabilir metrik olarak export edin.",
                "Fallback rotalarının sırası ve maliyet tavanları runbook'ta yazılı olsun, chat'teki tribal knowledge'da kalmasın. Degrade katmanı ucuz draft model, cached retrieval veya idempotency key koruyan dürüst retry banner olabilir. Breaker açıkken client'ta degrade modu gösterin; destek ticket'ları gizemli kalite düşüşü yerine infra state referans etsin. Büyük release öncesi provider timeout enjeksiyonlu game-day şart.",
                "Half-open recovery canlı trafiğin yüzdesi değil, streaming completion ve tool shape assert eden sabit maliyetli golden probe kullanmalı. Probe fail olursa exponential backoff ile open'a dönün; alert flapping on-call'u page'leri ignore etmeye iter. Breaker geçişlerini spend cap ile eşleyin; otomatik retry kullanıcı hata görürken token faturasını ikiye katlamasın.",
                "Güvenlik ve finans review'ları ücretli model route'larında eksik breaker'ı eksik auth kadar release blocker saymalı. Breaker kararlarını post-incident timeline için trace ID ile loglayın, tam prompt saklamayın. Çeyreklik review breaker eşiklerini vendor incident geçmişiyle kıyaslasın; peering sorunları baskınsa bölge bazında tune edin.",
            ],
        },
        "de": {
            "heading": "Breaker-Betrieb im Gateway-Team",
            "paragraphs": [
                "Vendor-Brownouts wirken auf HTTP-Dashboards gesund, während Latenz-Tails und leere Tool-Payloads Vertrauen aushöhlen. Circuit Breaker pro Vendor, Modell-Route und Tenant-Tier scopen, damit ein kranker Embedding-Pfad nicht das gesamte Gateway-Budget leert. Öffnen bei Timeouts, Schema-Failures und steigenden Refusal-Rates—not only 500. Open, Half-Open und Closed als Metriken exportieren, die Product neben Error Budgets liest.",
                "Fallback-Routen brauchen dokumentierte Reihenfolge und Cost-Ceiling in Runbooks, kein Tribal Knowledge. Degraded Tier: günstigeres Draft-Modell, gecachte Retrieval-Antworten oder ehrliches Retry-Banner mit Idempotency-Keys. Bei offenem Breaker Degraded Mode im Client zeigen. Game-Days mit Provider-Timeouts vor Major Releases. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Half-Open-Recovery nutzt fixkostengünstige Golden Probes mit Streaming- und Tool-Shape-Asserts, nicht Prozent Live-Traffic. Fehlgeschlagene Probes zurück zu Open mit Exponential Backoff gegen Alert-Flapping. Breaker-Übergänge mit Spend Caps koppeln, damit Retries Token-Rechnung nicht verdoppeln. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Security- und Finance-Reviews: fehlende Breaker auf Paid-Model-Routes sind Release-Blocker wie fehlende Auth. Breaker-Entscheidungen mit Trace-IDs loggen ohne volle Prompts. Quarterly Reviews vergleichen Schwellen mit Vendor-Incident-Historie und tunen pro Region bei Peering-Dominanz. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
            ],
        },
        "fr": {
            "heading": "Exploitation des breakers côté gateway",
            "paragraphs": [
                "Les brownouts vendor semblent sains sur les dashboards HTTP pendant que les queues de latence et payloads tool vides érodent la confiance. Scopez les circuit breakers par vendor, route modèle et tier tenant pour qu'un chemin embedding malade ne vide pas tout le budget gateway. Ouvrez sur timeouts consécutifs, échecs validation schéma et refus croissants—pas seulement 500. Exportez états open, half-open et closed en métriques lisibles par le produit à côté des error budgets.",
                "Les routes fallback exigent ordre explicite et plafonds coût documentés dans runbooks, pas connaissance tribale. Tier dégradé : modèle draft moins cher, réponses retrieval en cache ou bannière retry honnête avec clés idempotency. Breaker ouvert : mode dégradé visible client pour que support référence l'état infra. Game-days avec timeouts provider avant grosses releases. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Recovery half-open utilise sondes golden coût fixe assert completion streaming et forme tool, pas pourcentage trafic live. Sondes échouées retour open avec backoff exponentiel contre flapping alertes. Couplez transitions breaker avec plafonds spend pour que retries automatiques ne doublent pas la facture tokens. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Revues sécurité et finance : breakers manquants sur routes modèle payantes bloquent release comme auth manquante. Logger décisions breaker avec trace IDs sans prompts complets. Revues trimestrielles comparent seuils à historique incidents vendor et ajustent par région si peering domine. Consignez owner, date de revue et rollback dans le même ticket de changement.",
            ],
        },
        "it": {
            "heading": "Operatività breaker del team gateway",
            "paragraphs": [
                "I brownout vendor sembrano sani sulle dashboard HTTP mentre code di latenza e payload tool vuoti erodono fiducia. Scope circuit breaker per vendor, route modello e tier tenant così un path embedding malato non svuota tutto il budget gateway. Aprite su timeout consecutivi, failure validazione schema e refusal in crescita—non solo 500. Esportate stati open, half-open e closed come metriche leggibili dal product accanto agli error budget.",
                "Le route fallback richiedono ordine esplicito e ceiling di costo documentati in runbook, non tribal knowledge. Tier degradato: modello draft più economico, risposte retrieval in cache o banner retry onesto con chiavi idempotency. Breaker aperto: mostrare modalità degradata nel client così il supporto cita lo stato infra. Game-day con timeout provider prima delle major release. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Recovery half-open usa golden probe a costo fisso che assertano streaming completion e forma tool, non percentuale traffico live. Probe fallite tornano open con backoff esponenziale contro flapping alert. Accoppiate transizioni breaker con spend cap così i retry automatici non raddoppiano la fattura token. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Review security e finance: breaker mancanti su route modello a pagamento bloccano release come auth mancante. Loggare decisioni breaker con trace ID senza prompt completi. Review trimestrali confrontano soglie con storico incident vendor e tunano per regione se domina peering. Registrate owner, data di review e rollback nello stesso ticket di change.",
            ],
        },
        "zh": {
            "heading": "网关团队负责的 breaker 运维",
            "paragraphs": [
                "供应商 brownout 在 HTTP 仪表盘上仍显健康，而延迟长尾与空 tool payload 却在侵蚀信任。按供应商、模型路由与租户 tier 划分 circuit breaker，避免单条 embedding 路径拖垮整个网关预算。在连续 timeout、schema 校验失败与拒绝率上升时打开——而非只看 500。将 open、half-open、closed 导出为产品可在发布周与 error budget 同看的指标。",
                "fallback 路由须在 runbook 中写明顺序与成本上限，而非口口相传。降级层可用更便宜的 draft 模型、缓存检索答案，或保留幂等键的诚实重试提示。breaker 打开时在客户端展示降级模式，让工单引用 infra 状态而非神秘的质量下滑。重大发布前应做注入供应商 timeout 的 game-day。",
                "half-open 恢复须用固定成本的 golden 探针断言流式完成与 tool 形态，而非 live 流量比例。探针失败应指数退避回到 open，避免告警抖动让 on-call 忽视 paging。breaker 切换应配对 spend cap，防止自动 retry 在用户仍见错时翻倍 token 账单。",
                "安全与财务评审应将付费模型路由缺失 breaker 视为与缺失认证同级的发布阻断。用 trace ID 记录 breaker 决策，勿存完整 prompt。季度评审将阈值与供应商事故史对照，peering 主导失败时按区域调参。",
            ],
        },
        "ja": {
            "heading": "gateway チームが担う breaker 運用",
            "paragraphs": [
                "vendor brownout は HTTP dashboard では healthy に見え、latency tail と空 tool payload が信頼を削ります。circuit breaker を vendor、model route、tenant tier ごとに scope し、1 本の sick embedding path が gateway 予算全体を drain しないようにする。連続 timeout、schema validation failure、refusal 増加で open—500 だけでなく。open、half-open、closed を product が launch 週に error budget 横で読める metric として export。",
                "fallback route は runbook に明示順序と cost ceiling を文書化し、tribal knowledge にしない。degraded tier は安い draft model、cached retrieval、idempotency key を保つ honest retry banner。breaker open 時は client に degraded mode を見せ、support が謎の quality drop ではなく infra state を参照。major release 前に provider timeout 注入 game-day。",
                "half-open recovery は live 流量の割合ではなく、streaming completion と tool shape を assert する fixed-cost golden probe。probe fail は exponential backoff で open へ戻し alert flapping を防ぐ。breaker 遷移は spend cap と pair し、auto retry が token 請求を二重化しない。",
                "security と finance review では paid model route の breaker 欠如を auth 欠如と同格 release blocker とする。breaker 判断は trace ID で log、full prompt は保存しない。四半期 review で threshold を vendor incident 履歴と比較し、peering 支配時は region 別 tune。",
            ],
        },
    },
    "embedding-index-rebuild-strategies": {
        "en": {
            "heading": "Rebuild operations without search downtime",
            "paragraphs": [
                "Changing embedding models or chunk policies silently poisons retrieval quality while dashboards still show green health checks. Build shadow indexes in parallel, backfill with batch jobs whose SLA you measure per shard, then swap aliases only after offline golden-set recall passes gates. Pin model identifier, chunk version, and normalization parameters in document metadata and reject queries that mismatch the active index contract. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Blue-green cutovers beat in-place reindex when traffic is continuous. Dual-write or staged ingestion into the shadow index prevents a big-bang weekend. Track rebuild cost in dollars and engineer hours per million vectors so finance can compare vendor upgrades to infra work. Freeze feature flags that alter chunk boundaries during backfill or you will fork incompatible corpora mid-job. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Quality gates belong in CI, not only in postmortems. Maintain labeled question sets with expected document identifiers; compare recall and nDCG before and after rebuild. Regression in minority languages or long-tail SKUs should block alias swap even when English headline metrics look flat. Document which teams consume which index alias in a catalog updated on every cutover. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Post-cutover, monitor query latency, cache hit rate, and support tickets tagged search for seventy-two hours. Keep the previous index read-only with a dated TTL so rollback is a DNS or alias change, not a panic re-embed. Archive rebuild manifests—source snapshot ids, batch job ids, and approval links—for auditors who ask whether vectors were trained on expired consent classes. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first."],
        },
        "tr": {
            "heading": "Arama kesintisi olmadan rebuild operasyonu",
            "paragraphs": [
                "Embedding model veya chunk politikasını değiştirmek dashboard yeşilken retrieval kalitesini sessizce zehirler. Shadow index'i paralel kurun, shard başına SLA ölçtüğünüz batch job'larla backfill yapın, offline golden-set recall gate geçmeden alias swap etmeyin. Model id, chunk versiyonu ve normalizasyon parametrelerini metadata'da kilitleyin; aktif index contract'ına uymayan sorguları reddedin.",
                "Sürekli trafikte blue-green cutover yerinde reindex'ten iyidir. Shadow index'e dual-write veya staged ingestion büyük patlama hafta sonunu önler. Rebuild maliyetini milyon vektör başına dolar ve mühendis saati olarak izleyin; finans vendor upgrade'i infra işiyle kıyaslasın. Backfill sırasında chunk sınırını değiştiren feature flag'leri dondurun yoksa job ortasında uyumsuz corpus çatallanır.",
                "Kalite gate'leri yalnızca postmortem'de değil CI'da olmalı. Beklenen doküman id'leri olan etiketli soru setleri sürdürün; rebuild öncesi sonrası recall ve nDCG kıyaslayın. Azınlık dillerinde veya long-tail SKU'larda regresyon, İngilizce metrik düz görünse bile alias swap'i bloklasın. Her cutover'da güncellenen katalogda hangi ekibin hangi alias'ı tükettiğini yazın.",
                "Cutover sonrası yetmiş iki saat query latency, cache hit rate ve arama etiketli destek ticket'larını izleyin. Önceki index'i tarihli TTL ile read-only tutun; rollback DNS veya alias değişimi olsun, panik re-embed değil. Rebuild manifest'lerini—kaynak snapshot id, batch job id, onay linkleri—arşivleyin; vektörlerin süresi dolmuş consent sınıfında eğitilip eğitilmediği sorulduğunda yanıtlayın.",
            ],
        },
        "de": {
            "heading": "Rebuild ohne Search-Downtime",
            "paragraphs": [
                "Wechsel von Embedding-Modellen oder Chunk-Policies vergiftet Retrieval leise, während Dashboards grün bleiben. Shadow-Indexes parallel bauen, Backfill mit pro Shard gemessener Batch-SLA, Alias-Swap erst nach Offline-Golden-Set-Recall-Gates. Modell-ID, Chunk-Version und Normalisierung in Metadaten pinnen; Queries bei Contract-Mismatch ablehnen. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Blue-Green schlägt In-Place-Reindex bei Dauertraffic. Dual-Write oder staged Ingestion in Shadow verhindert Big-Bang-Wochenende. Rebuild-Kosten in Dollar und Engineer-Stunden pro Million Vektoren tracken. Feature Flags, die Chunk-Grenzen ändern, während Backfill einfrieren. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Quality Gates in CI, nicht nur Postmortems. Labeled Question Sets mit erwarteten Doc-IDs; Recall und nDCG vor/nach Rebuild. Regression in Minority Languages oder Long-Tail-SKUs blockiert Alias-Swap auch bei flachen EN-Metriken. Katalog welches Team welchen Alias nutzt bei jedem Cutover aktualisieren. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Nach Cutover 72h Query-Latenz, Cache-Hit-Rate und Support-Tickets Search taggen. Vorherigen Index read-only mit datiertem TTL für Rollback per Alias, kein Panic-Re-Embed. Rebuild-Manifeste archivieren für Audit-Fragen zu Consent-Klassen. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
            ],
        },
        "fr": {
            "heading": "Rebuild sans couper la recherche",
            "paragraphs": [
                "Changer modèle embedding ou politique chunk empoisonne retrieval en silence pendant dashboards verts. Construire index shadow en parallèle, backfill avec SLA batch par shard, swap alias seulement après golden set offline. Épingler id modèle, version chunk, paramètres normalisation ; rejeter queries hors contrat index actif. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Blue-green bat reindex sur place avec trafic continu. Dual-write ou ingestion staged évite big-bang week-end. Coût rebuild en dollars et heures ingénieur par million vecteurs. Geler feature flags modifiant frontières chunk pendant backfill. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Gates qualité en CI, pas seulement postmortems. Jeux questions labelisés avec doc ids attendus ; recall et nDCG avant/après. Régression langues minoritaires ou SKU long tail bloque swap alias même si métriques EN plates. Catalogue équipes et alias mis à jour à chaque cutover. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Après cutover, monitorer latence query, cache hit, tickets support tag search 72h. Index précédent read-only TTL daté ; rollback = alias, pas re-embed panique. Archiver manifestes rebuild pour audits consent. Consignez owner, date de revue et rollback dans le même ticket de changement.",
            ],
        },
        "it": {
            "heading": "Rebuild senza downtime di ricerca",
            "paragraphs": [
                "Cambiare modello embedding o policy chunk avvelena retrieval in silenzio con dashboard verdi. Costruite index shadow in parallelo, backfill con SLA batch per shard, swap alias solo dopo golden set offline. Pin model id, versione chunk, parametri normalizzazione; rifiutate query fuori contratto index attivo. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Blue-green batte reindex in place con traffico continuo. Dual-write o ingestion staged evita big-bang weekend. Costo rebuild in dollari e ore engineer per milione vettori. Congelate feature flag che alterano confini chunk durante backfill. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Gate qualità in CI, non solo postmortem. Set domande etichettate con doc id attesi; recall e nDCG prima/dopo rebuild. Regressione lingue minoritarie o SKU long tail blocca swap alias anche con metriche EN piatte. Catalogo team e alias aggiornato a ogni cutover. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Post-cutover monitorate latenza query, cache hit, ticket support tag search per 72h. Index precedente read-only con TTL datato; rollback alias, non re-embed panico. Archiviate manifest rebuild per audit consent. Registrate owner, data di review e rollback nello stesso ticket di change.",
            ],
        },
        "zh": {
            "heading": "无搜索中断的重建运维",
            "paragraphs": [
                "更换 embedding 模型或 chunk 策略会在仪表盘仍绿时悄悄毒害检索质量。并行构建 shadow 索引，用按分片衡量 SLA 的批作业回填，离线 golden 集 recall 通过门禁后再切换 alias。在文档 metadata 中锁定模型 id、chunk 版本与归一化参数，拒绝与活跃索引契约不匹配的查询。",
                "持续流量下 blue-green 切换优于原地 reindex。dual-write 或分阶段写入 shadow 索引可避免周末大爆炸。按百万向量跟踪重建的美元与工程师小时成本。回填期间冻结会改变 chunk 边界的 feature flag，否则会在作业中途分叉不兼容语料。",
                "质量门禁应放在 CI，而非只在事后复盘。维护带期望文档 id 的标注问题集；比较重建前后 recall 与 nDCG。少数语言或长尾 SKU 回归即使英文指标平坦也应阻断 alias 切换。在每次 cutover 更新的目录中记录各团队使用的 alias。",
                "切换后 72 小时监控查询延迟、缓存命中率与带 search 标签的工单。只读保留旧索引并设 dated TTL，回滚只需改 alias 而非恐慌重嵌。归档重建清单——源快照 id、批作业 id、审批链接——以应对向量是否使用过期 consent 类的审计提问。",
            ],
        },
        "ja": {
            "heading": "検索 downtime なしの rebuild 運用",
            "paragraphs": [
                "embedding model や chunk policy 変更は dashboard が緑のまま retrieval 品質を静かに poison する。shadow index を並行構築し shard ごと SLA 測定 batch backfill、offline golden set recall gate 通過後に alias swap。model id、chunk version、normalization を metadata に pin し active index contract 不一致 query を reject。",
                "継続 traffic では blue-green cutover が in-place reindex に勝る。shadow へ dual-write か staged ingestion で big-bang 週末回避。rebuild コストを百万 vector あたりドルと engineer 時間で track。backfill 中 chunk 境界を変える feature flag を freeze。",
                "quality gate は postmortem だけでなく CI。期待 doc id 付き labeled question set；recall と nDCG を rebuild 前後比較。minority language や long-tail SKU regression は EN metric flat でも alias swap block。cutover ごと更新 catalog に team と alias 対応。",
                "cutover 後 72h query latency、cache hit、search tag support ticket monitor。previous index を dated TTL read-only；rollback は alias で panic re-embed 禁止。rebuild manifest を archive し consent class audit に備える。",
            ],
        },
    },
    "postgres-connection-pooling-at-the-edge": {
        "en": {
            "heading": "Pool sizing for serverless and edge workers",
            "paragraphs": [
                "Edge functions multiply processes faster than Postgres multiplies connections. Cap pools per worker and region instead of one global maximum that either starves lambdas or exhausts max_connections on the primary. Validate PgBouncer transaction mode against your ORM: prepared statements, advisory locks, and listen-notify patterns break silently when session semantics disappear. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Cold starts create connection storms when every isolate opens a fresh pool simultaneously. Add jittered backoff on first connect and reuse warm pools where the runtime allows. Correlate pool wait time, active clients, and database CPU so saturation shows up before customer queries time out. Document which routes require session pooling versus transaction pooling in the architecture decision record. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Neon, RDS Proxy, and self-hosted PgBouncer differ in TLS termination and credential rotation—test failover drills quarterly. Read replicas should not share the same pool name as writers unless your driver explicitly targets roles. Staging must use smaller pools with the same mode as production; testing session mode in staging and shipping transaction mode invites launch-week surprises. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Treat pool misconfiguration as a product incident when checkout or search routes fail. Export metrics with service and route labels, not only database hostnames. On-call runbooks need explicit steps to drain workers, bounce bouncer, and verify ORM pool settings without restarting the entire cluster. Finance should see connection overhead beside query spend when evaluating edge migration proposals. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first."],
        },
        "tr": {
            "heading": "Serverless ve edge worker için pool boyutlandırma",
            "paragraphs": [
                "Edge function'lar Postgres'in connection çoğaltmasından hızlı process çoğaltır. Lambda'ları aç bırakan veya primary max_connections'ı tüketen tek global max yerine worker ve bölge başına pool cap koyun. PgBouncer transaction mode'u ORM'inize karşı doğrulayın: prepared statement, advisory lock ve listen-notify session semantiği kaybolunca sessizce kırılır.",
                "Cold start her isolate aynı anda taze pool açınca connection fırtınası yaratır. İlk connect'te jittered backoff ekleyin; runtime izin veriyorsa warm pool reuse edin. Pool wait, active client ve DB CPU'yu korele edin; müşteri sorguları timeout olmadan saturation görünsün. ADR'de hangi route'un session pooling, hangisinin transaction pooling gerektirdiğini yazın.",
                "Neon, RDS Proxy ve self-hosted PgBouncer TLS termination ve credential rotation'da farklıdır—çeyreklik failover drill test edin. Read replica writer ile aynı pool adını paylaşmasın, driver rol hedeflemiyorsa. Staging prod ile aynı mode'da daha küçük pool kullansın; staging'de session, prod'da transaction ship etmek launch sürprizi demektir.",
                "Checkout veya arama route'ları fail olunca pool misconfig product incident sayılmalı. Metrikleri yalnızca DB hostname değil service ve route label ile export edin. Runbook worker drain, bouncer bounce ve ORM pool ayarını tüm cluster restart etmeden doğrulama adımlarını içersin. Finans edge migration önerilerinde query harcaması yanında connection overhead görsün.",
            ],
        },
        "de": {
            "heading": "Pool-Sizing für Serverless und Edge",
            "paragraphs": [
                "Edge Functions vervielfachen Prozesse schneller als Postgres Connections. Pools pro Worker und Region cappen statt globalem Maximum, das Lambdas hungern lässt oder max_connections sprengt. PgBouncer Transaction Mode gegen ORM validieren: Prepared Statements, Advisory Locks, Listen-Notify brechen ohne Session-Semantik. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Cold Starts erzeugen Connection Storms wenn jedes Isolate gleichzeitig Pool öffnet. Jittered Backoff beim Erstconnect; warme Pools wo Runtime erlaubt. Pool-Wait, Active Clients und DB-CPU korrelieren. ADR dokumentiert Session- vs Transaction-Pooling pro Route. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Neon, RDS Proxy, self-hosted PgBouncer unterscheiden TLS und Credential-Rotation—Quarterly Failover-Drills. Read Replicas nicht gleicher Pool-Name wie Writer ohne explizite Driver-Rollen. Staging kleinere Pools gleicher Mode wie Prod. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Pool-Misconfig als Product-Incident wenn Checkout oder Search failt. Metriken mit Service- und Route-Labels. Runbook: Worker drain, Bouncer bounce, ORM-Settings ohne Full-Cluster-Restart. Finance sieht Connection-Overhead neben Query-Spend bei Edge-Migration. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
            ],
        },
        "fr": {
            "heading": "Dimensionnement pool pour edge et serverless",
            "paragraphs": [
                "Les edge functions multiplient processus plus vite que Postgres ne multiplie connexions. Plafonds pool par worker et région, pas maximum global qui affame lambdas ou épuise max_connections. Valider mode transaction PgBouncer contre ORM : prepared statements, advisory locks, listen-notify cassent sans sémantique session. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Cold starts créent tempêtes connexion si chaque isolate ouvre pool neuf simultanément. Backoff jitteré au premier connect ; réutiliser pools chauds si runtime le permet. Corréler attente pool, clients actifs, CPU base. ADR documente session vs transaction pooling par route. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Neon, RDS Proxy, PgBouncer self-hosted diffèrent TLS et rotation credentials—drills failover trimestriels. Replicas lecture ne partagent pas nom pool writer sans rôle driver explicite. Staging pools plus petits même mode que prod. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Misconfig pool = incident produit si checkout ou search échoue. Métriques avec labels service et route. Runbook drain workers, bounce bouncer, vérif ORM sans restart cluster entier. Finance voit overhead connexion à côté dépense query pour migrations edge. Consignez owner, date de revue et rollback dans le même ticket de changement.",
            ],
        },
        "it": {
            "heading": "Dimensionamento pool per edge e serverless",
            "paragraphs": [
                "Le edge function moltiplicano processi più velocemente di Postgres con le connessioni. Cap pool per worker e regione, non massimo globale che affama lambda o esaurisce max_connections. Validare transaction mode PgBouncer con ORM: prepared statement, advisory lock, listen-notify si rompono senza semantica sessione. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Cold start creano tempeste connessione se ogni isolate apre pool fresco insieme. Backoff jitter al primo connect; riuso pool caldi dove il runtime consente. Correlate attesa pool, client attivi, CPU DB. ADR documenta session vs transaction pooling per route. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Neon, RDS Proxy, PgBouncer self-hosted differiscono su TLS e rotazione credential—drill failover trimestrali. Read replica non condividono nome pool writer senza targeting ruolo driver. Staging pool più piccoli stesso mode di prod. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Misconfig pool è incident product se checkout o search falliscono. Metriche con label service e route. Runbook drain worker, bounce bouncer, verifica ORM senza restart cluster intero. Finance vede overhead connessione accanto a spend query per migration edge. Registrate owner, data di review e rollback nello stesso ticket di change.",
            ],
        },
        "zh": {
            "heading": "面向 serverless 与 edge 的连接池 sizing",
            "paragraphs": [
                "Edge 函数增殖进程的速度快于 Postgres 增殖连接。按 worker 与区域设 pool 上限，而非单一全局最大值——要么饿死 lambda，要么耗尽 primary 的 max_connections。针对 ORM 验证 PgBouncer transaction mode：prepared statement、advisory lock 与 listen-notify 在 session 语义消失时会静默失败。",
                "冷启动时若每个 isolate 同时打开新 pool 会引发连接风暴。首次连接加入 jitter 退避，运行时允许则复用 warm pool。关联 pool 等待、活跃客户端与数据库 CPU，在客户查询超时前看到饱和。在 ADR 记录哪些路由需要 session pooling、哪些需要 transaction pooling。",
                "Neon、RDS Proxy 与自建 PgBouncer 在 TLS 终止与凭证轮换上不同——每季度做 failover 演练。读副本不应与 writer 共用 pool 名，除非驱动显式按角色路由。预发应使用与生产相同模式但更小的 pool；预发 session、生产 transaction 的组合会在发布周制造惊喜。",
                "当 checkout 或 search 路由失败时，应将 pool 误配视为产品事故。按 service 与 route 标签导出指标，而非仅数据库主机名。Runbook 需含 drain worker、bounce bouncer、在不重启整集群情况下验证 ORM pool 的步骤。财务评估 edge 迁移时应同时看到连接开销与查询花费。",
            ],
        },
        "ja": {
            "heading": "serverless と edge 向け pool sizing",
            "paragraphs": [
                "edge function は Postgres の connection 増より process 増が速い。lambda を飢えさせるか max_connections を枯らす global max ではなく worker と region ごとに pool cap。PgBouncer transaction mode を ORM で検証：prepared statement、advisory lock、listen-notify は session 意味論消失で静かに break。",
                "cold start で各 isolate が同時に新 pool を開くと connection storm。first connect に jitter backoff；runtime が許せば warm pool reuse。pool wait、active client、DB CPU を correlate。ADR に route ごとの session vs transaction pooling。",
                "Neon、RDS Proxy、self-hosted PgBouncer は TLS と credential rotation が異なる—四半期 failover drill。read replica は driver が role target しない限り writer と pool 名共有禁止。staging は prod と同 mode で smaller pool。",
                "checkout や search route fail なら pool misconfig を product incident とする。DB hostname だけでなく service と route label で metric export。runbook に worker drain、bouncer bounce、full cluster restart なし ORM pool 検証。finance は edge migration で query spend 横に connection overhead。",
            ],
        },
    },
    "secure-webhook-ingestion-patterns": {
        "en": {
            "heading": "Ingestion hardening beyond signature checks",
            "paragraphs": [
                "HMAC verification is necessary but not sufficient when replay windows are unbounded or body parsers execute before authentication. Enforce timestamp skew limits, constant-time signature comparison, and a durable replay store keyed by delivery identifier. Reject oversize bodies at the edge with per-tenant rate limits so one noisy partner cannot exhaust workers. Retain redacted raw bodies only in encrypted buffers with short TTL. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Handlers must be idempotent because vendors retry aggressively on any ambiguous response. Persist processing outcomes with the same idempotency key the partner supplies, returning two hundred only after side effects commit. Separate verification failures—four hundred one—from business validation failures so on-call can distinguish attacks from schema drift without reading raw payloads in chat. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Dead-letter queues need metrics, not silent S3 folders. Alert on DLQ growth rate, oldest message age, and repeated failure signatures tied to schema versions. Run contract tests against sample webhook fixtures in CI whenever you change parsing code. Penetration tests should include replayed signed bodies from captured traffic stored in redacted fixtures. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Document data classification for webhook fields before logging them to general observability backends. PCI and PII-bearing events may require dedicated ingestion accounts and shorter retention. Product managers requesting new webhook types owe a threat model covering spoofing, replay, and volumetric abuse, signed off before endpoints go public in partner documentation. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first."],
        },
        "tr": {
            "heading": "İmza kontrolünün ötesinde ingestion sertleştirme",
            "paragraphs": [
                "Replay penceresi sınırsızken veya body parser auth'tan önce çalışırken HMAC yeterli değildir. Timestamp skew limiti, constant-time signature karşılaştırması ve delivery id ile keyed kalıcı replay store zorunlu kılın. Oversize body'leri edge'de tenant başına rate limit ile reddedin; gürültülü partner worker'ları tüketmesin.",
                "Handler'lar idempotent olmalı; vendor belirsiz yanıtta agresif retry eder. Partner'ın idempotency key'i ile işlem sonucunu persist edin, side effect commit olmadan iki yüz dönmeyin. Doğrulama failure'larını—dört yüz bir—iş validation failure'larından ayırın; on-call saldırı ile schema drift'i chat'te raw payload okumadan ayırsın.",
                "DLQ metrik ister, sessiz S3 klasörü değil. DLQ büyüme hızı, en eski mesaj yaşı ve schema versiyonuna bağlı tekrarlayan failure imzalarında alert. Parsing kodu değişince CI'da örnek webhook fixture'larına contract test koşun. Pen test redakte fixture'lardaki imzalı body replay'ini içersin.",
                "Genel observability backend'lerine loglamadan önce webhook alanları için veri sınıflandırması yazın. PCI ve PII taşıyan olaylar ayrı ingestion account ve kısa retention gerektirebilir. Yeni webhook isteyen PM spoofing, replay ve volumetric abuse threat model'i sunsun; partner dokümanında public olmadan onaylansın.",
            ],
        },
        "de": {
            "heading": "Ingestion-Härtung jenseits Signaturen",
            "paragraphs": [
                "HMAC allein reicht nicht bei unbounded Replay oder Body-Parser vor Auth. Timestamp-Skew-Limits, constant-time Signature-Vergleich, durable Replay-Store keyed by Delivery-ID. Oversize Bodies am Edge mit per-Tenant Rate Limits ablehnen. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Handler idempotent—Vendors retrien bei ambiguous Response. Outcomes mit Partner-Idempotency-Key persistieren; 200 erst nach Side-Effect-Commit. Verification-Failures 401 von Business-Validation trennen für On-Call ohne Raw-Payload-Chat. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "DLQ braucht Metriken: Wachstumsrate, oldest age, wiederkehrende Failure-Signaturen pro Schema-Version. Contract-Tests auf Webhook-Fixtures in CI bei Parser-Änderungen. Pentest mit replayed signed Bodies aus redigierten Fixtures. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Datenklassifikation für Webhook-Felder vor Logging in generelle Observability. PCI/PII-Events evtl. dedizierte Ingestion-Accounts und kürzere Retention. PMs für neue Webhook-Typen liefern Threat Model Spoofing, Replay, Volumetric Abuse vor Public Partner-Docs. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
            ],
        },
        "fr": {
            "heading": "Durcissement ingestion au-delà des signatures",
            "paragraphs": [
                "HMAC nécessaire mais insuffisant si fenêtre replay illimitée ou parser body avant auth. Imposer limites skew timestamp, comparaison signature temps constant, store replay durable clé delivery id. Rejeter corps oversize au edge avec rate limits par tenant. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Handlers idempotents car vendors retentent sur réponse ambiguë. Persister outcomes avec clé idempotency partenaire ; 200 seulement après commit effets. Séparer échecs vérification 401 des échecs validation métier pour on-call sans lire payloads bruts. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "DLQ exige métriques : taux croissance, âge message le plus vieux, signatures échec répétées par version schéma. Tests contrat sur fixtures webhook en CI à chaque changement parser. Pentest inclut replay corps signés depuis fixtures rédigées. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Classifier champs webhook avant log observability générale. Événements PCI/PII peuvent exiger comptes ingestion dédiés et rétention courte. PM nouveaux webhooks doivent threat model spoofing, replay, abus volumétrique avant docs partenaires publiques. Consignez owner, date de revue et rollback dans le même ticket de changement.",
            ],
        },
        "it": {
            "heading": "Indurimento ingestion oltre le firme",
            "paragraphs": [
                "HMAC necessario ma insufficiente con replay illimitato o parser body prima dell'auth. Imporre limiti skew timestamp, confronto firma constant-time, replay store durable keyed by delivery id. Rifiutare body oversize al edge con rate limit per tenant. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Handler idempotenti perché i vendor ritentano su risposta ambigua. Persistere outcome con chiave idempotency partner; 200 solo dopo commit side effect. Separare failure verifica 401 da failure validazione business per on-call senza payload grezzi in chat. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "DLQ richiede metriche: tasso crescita, età messaggio più vecchio, firme failure ripetute per versione schema. Contract test su fixture webhook in CI a ogni cambio parser. Pentest include replay body firmati da fixture redatte. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Classificare campi webhook prima di log su observability generale. Eventi PCI/PII possono richiedere account ingestion dedicati e retention breve. PM per nuovi webhook devono threat model spoofing, replay, abuso volumetrico prima doc partner pubbliche. Registrate owner, data di review e rollback nello stesso ticket di change.",
            ],
        },
        "zh": {
            "heading": "超越签名校验的接入加固",
            "paragraphs": [
                "当 replay 窗口无界或 body 解析器在认证前执行时，HMAC 必要但不充分。强制 timestamp 偏移上限、常数时间签名比较，以及以 delivery id 为键的持久 replay 存储。在边缘按租户限流拒绝超大 body，避免 noisy partner 耗尽 worker。",
                "处理器必须幂等，因为供应商对任何含糊响应都会激进重试。用伙伴提供的幂等键持久化处理结果，仅在副作用提交后返回 200。将验证失败（401）与业务校验失败分开，便于 on-call 在不于聊天中读 raw payload 的情况下区分攻击与 schema drift。",
                "DLQ 需要指标而非静默 S3 目录。对 DLQ 增长率、最旧消息年龄及与 schema 版本绑定的重复失败签名告警。解析代码变更时在 CI 对示例 webhook fixture 跑 contract test。渗透测试应包含来自 redact fixture 的重放签名 body。",
                "写入通用可观测后端前先为 webhook 字段做数据分级。含 PCI/PII 的事件可能需要独立 ingestion 账户与更短 retention。产品经理申请新 webhook 类型须提交涵盖 spoofing、replay 与 volumetric abuse 的威胁模型，并在伙伴文档公开前获批。",
            ],
        },
        "ja": {
            "heading": "署名チェックを超える ingestion 硬化",
            "paragraphs": [
                "replay 窓が unbounded だったり body parser が auth より先なら HMAC だけでは不十分。timestamp skew limit、constant-time signature compare、delivery id keyed durable replay store を enforce。oversize body は edge で tenant 別 rate limit で reject。",
                "handler は idempotent—vendor は ambiguous response で aggressive retry。partner idempotency key で outcome persist；side effect commit 後に 200。verification failure 401 を business validation failure と分離し on-call が raw payload なしで attack と schema drift を区別。",
                "DLQ は metric 必須：成長率、最古 message age、schema version 別 repeated failure signature。parser 変更のたび CI で webhook fixture contract test。pentest は redacted fixture から signed body replay を含む。",
                "general observability に log する前に webhook field の data classification。PCI/PII event は dedicated ingestion account と短 retention の可能性。新 webhook を求める PM は partner doc public 前に spoofing、replay、volumetric abuse threat model を sign-off。",
            ],
        },
    },
    "frontend-error-budgets-with-rum": {
        "en": {
            "heading": "RUM-backed budgets product can defend",
            "paragraphs": [
                "Lab Lighthouse scores alone cannot explain checkout failures on mid-tier Android devices in specific regions. Pair synthetic budgets with real-user monitoring sampled by route, release version, and experiment cohort while respecting privacy tags on events. Define JavaScript exception budgets separately from interaction latency budgets so teams know whether to fix handlers or defer third-party scripts. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Error budgets should attach to release trains and feature flags, not only quarterly OKRs. When a route exhausts its budget, block merges that add scripts to that route until a named mitigation lands—pagination, lazy hydration, or vendor contract renegotiation. Dashboards must show RUM and lab metrics side by side so leadership cannot cherry-pick the greener chart. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Source maps are production secrets. Audit every download of map files like a credential access event; restrict storage to break-glass roles with automatic expiry. Sentry or equivalent projects need data residency settings aligned with counsel before PII-adjacent breadcrumbs ship. On-call runbooks should list which routes are budget-critical and which analytics scripts are allowed during incidents. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Post-release reviews compare budget burn against deploy cadence and marketing campaigns that add heavy assets. Celebrate teams that remove scripts instead of only teams that optimize images. Frontend reliability is a revenue feature when conversion routes stay inside budget during peak traffic; publish trends where product and growth leads actually meet, not only in performance guild channels. Schedule quarterly budget reviews on the release calendar. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
            ],
        },
        "tr": {
            "heading": "Ürünün savunabileceği RUM destekli bütçeler",
            "paragraphs": [
                "Lab Lighthouse skorları belirli bölgelerde orta segment Android'de checkout failure'larını açıklayamaz. Sentetik bütçeleri route, release versiyonu ve deney kohortu ile örneklenen RUM ile eşleyin; olaylardaki privacy etiketlerine uyun. JS exception bütçelerini interaction latency bütçelerinden ayırın; ekipler handler mı üçüncü parti script mi erteleyeceğini bilsin.",
                "Error budget release train ve feature flag'lere bağlansın, yalnızca çeyreklik OKR'lara değil. Route bütçesini tüketince adlı mitigasyon—sayfalama, lazy hydration, vendor sözleşmesi—gelene kadar o route'a script ekleyen merge'leri bloklayın. Dashboard RUM ve lab metriklerini yan yana göstersin; liderlik yeşil grafiği cherry-pick edemesin.",
                "Source map production secret'tır. Map indirmelerini credential erişimi gibi audit edin; depolamayı otomatik süre dolan break-glass rollerle sınırlayın. Sentry projelerinde PII-adjacent breadcrumb ship etmeden önce data residency counsel ile hizalı olsun. Runbook budget-kritik route'ları ve olay sırasında izinli analytics script'lerini listelesin.",
                "Release sonrası review bütçe yanmasını deploy cadence ve ağır varlık ekleyen kampanyalarla kıyaslasın. Yalnızca görsel optimize eden değil script kaldıran ekipleri de öne çıkarın. Peak trafikte conversion route'ları bütçede kalınca frontend güvenilirliği gelir özelliğidir; trendleri product ve growth liderlerinin buluştuğu yerde yayınlayın.",
            ],
        },
        "de": {
            "heading": "RUM-gestützte Budgets fürs Product",
            "paragraphs": [
                "Lab-Lighthouse erklärt keine Checkout-Failures auf Mid-Tier-Android in bestimmten Regionen. Synthetische Budgets mit RUM pro Route, Release und Experiment-Kohorte paaren; Privacy-Tags respektieren. JS-Exception-Budgets getrennt von Interaktions-Latenz-Budgets. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Error Budgets an Release Trains und Feature Flags, nicht nur OKRs. Route erschöpft Budget: Merges mit Scripts blocken bis named Mitigation. Dashboards RUM und Lab nebeneinander. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Source Maps sind Production-Secrets; Downloads wie Credential-Zugriff auditieren. Sentry-Residency vor PII-adjacent Breadcrumbs. Runbook listet budget-kritische Routes und erlaubte Analytics-Scripts im Incident. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Post-Release-Reviews vergleichen Budget-Burn mit Deploy-Cadence und Marketing-Assets. Teams feiern die Scripts entfernen. Frontend-Reliability ist Revenue-Feature wenn Conversion-Routes im Budget bleiben. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
            ],
        },
        "fr": {
            "heading": "Budgets appuyés RUM défendables produit",
            "paragraphs": [
                "Lighthouse lab n'explique pas échecs checkout sur Android milieu de gamme par région. Coupler budgets synthétiques et RUM échantillonné par route, release et cohorte expérience ; respect tags privacy. Budgets exceptions JS séparés des budgets latence interaction. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Budgets erreur liés trains release et feature flags, pas seulement OKR trimestriels. Route épuisée : bloquer merges scripts jusqu'à mitigation nommée. Dashboards RUM et lab côte à côte. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Source maps secrets prod ; auditer téléchargements comme accès credentials. Résidence données Sentry avant breadcrumbs PII-adjacent. Runbook routes budget-critiques et scripts analytics autorisés en incident. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Revues post-release comparent burn budget à cadence deploy et campagnes assets lourds. Célébrer équipes retirant scripts. Fiabilité frontend feature revenu si routes conversion restent dans budget en pic. Consignez owner, date de revue et rollback dans le même ticket de changement.",
            ],
        },
        "it": {
            "heading": "Budget supportati da RUM difendibili dal product",
            "paragraphs": [
                "Lighthouse da lab non spiega failure checkout su Android mid-tier per regione. Accoppiate budget sintetici con RUM campionato per route, release e cohort experiment; rispettate tag privacy. Budget eccezioni JS separati da budget latenza interazione. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Error budget legati a release train e feature flag, non solo OKR trimestrali. Route esaurita: bloccare merge script fino a mitigazione nominata. Dashboard RUM e lab affiancati. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Source map segreti production; audit download come accesso credential. Residency Sentry prima breadcrumb PII-adjacent. Runbook elenca route budget-critical e script analytics ammessi in incident. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Review post-release confrontano burn budget con cadence deploy e campagne asset pesanti. Celebrare team che rimuovono script. Affidabilità frontend feature revenue se route conversion restano in budget ai picchi. Registrate owner, data di review e rollback nello stesso ticket di change.",
            ],
        },
        "zh": {
            "heading": "产品可辩护的 RUM 支撑预算",
            "paragraphs": [
                "实验室 Lighthouse 无法解释特定地区中端 Android 上的 checkout 失败。将合成预算与按路由、发布版本与实验 cohort 采样且遵守隐私标签的 RUM 配对。JS 异常预算应与交互延迟预算分开，让团队知道该修 handler 还是推迟第三方脚本。",
                "错误预算应绑定发布列车与 feature flag，而非仅季度 OKR。路由耗尽预算时，在指名缓解——分页、lazy hydration、供应商重谈——落地前阻止向该路由加脚本的合并。仪表盘须并排展示 RUM 与 lab，避免领导只挑更绿的图。",
                "Source map 是生产机密。像审计凭证访问一样审计每次 map 下载；存储限制于自动过期的 break-glass 角色。Sentry 等项目在发送 PII 邻近 breadcrumb 前须与法务对齐数据 residency。Runbook 应列出 budget-critical 路由与事件中允许的 analytics 脚本。",
                "发布后评审将 budget burn 与发布节奏及添加重资源的营销活动对照。表彰移除脚本的团队，而非仅优化图片者。峰值流量下 conversion 路由保持预算内时，前端可靠性即收入能力；趋势应发布到 product 与 growth 负责人实际开会之处。",
            ],
        },
        "ja": {
            "heading": "product が defend できる RUM バジェット",
            "paragraphs": [
                "lab Lighthouse は特定地域 mid-tier Android の checkout failure を説明できない。synthetic budget を route、release、experiment cohort で sample し privacy tag を尊重する RUM と pair。JS exception budget を interaction latency budget と分離。",
                "error budget は release train と feature flag に attach、四半期 OKR だけでない。route budget 枯渇時は named mitigation まで script 追加 merge block。dashboard は RUM と lab を並列表示。",
                "source map は production secret；download を credential access として audit。Sentry residency を PII-adjacent breadcrumb 前に counsel と align。runbook に budget-critical route と incident 許可 analytics script。",
                "post-release review で budget burn を deploy cadence と heavy asset campaign と比較。script 削除チームを称賛。peak で conversion route が budget 内なら frontend reliability は revenue feature。",
            ],
        },
    },
    "contract-tests-for-event-driven-services": {
        "en": {
            "heading": "Async contracts that survive deploy order",
            "paragraphs": [
                "Event-driven systems fail quietly when producers ship schema changes consumers never verified. Treat published event schemas like HTTP OpenAPI: semver breaking changes, consumer-driven contract suites, and provider verification jobs in continuous integration before either side merges. CloudEvents envelopes help, but payload fields still need explicit compatibility rules and fixture data representative of production cardinality. Negative contract fixtures should run on every provider pull request. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Pact or equivalent tools should run on both sides—consumers publish expectations, producers prove they emit matching shapes under recorded scenarios. Block producer deploys when verification fails, not only consumer deploys, or you recreate the monolith release train in slow motion. Version negotiation headers or topic suffixes beat silent dual writes that fork analytics pipelines. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Dead-letter queues surface poison messages and schema drift faster than grep in logs. Metric DLQ depth, processing lag, and error taxonomy by event type. Contract tests must include negative cases: unknown fields ignored, required fields missing, and enum extensions forwarded without crash. Document which teams own which event types in a catalog linked from pull request templates. Treat registry drift like API deprecation with explicit sunset dates. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
                "Game days replay production traffic samples into staging buses with redaction to validate contract changes under load. Legal and privacy reviews apply to event payloads the same way they apply to REST bodies—do not log full payment or health events to shared topics. Quarterly audits diff emitted schemas against the registry and retire orphaned topics before they become shadow databases. Registry diffs should block deploy when orphaned topics still receive traffic. Publish dashboards beside error budgets, run game days before major releases, and record owner sign-off in the same change ticket the on-call engineer will read first.",
            ],
        },
        "tr": {
            "heading": "Deploy sırasını atlatan async contract'lar",
            "paragraphs": [
                "Producer schema değiştirip consumer doğrulamayınca event-driven sistemler sessizce fail eder. Yayınlanan event schema'larını HTTP OpenAPI gibi yönetin: semver breaking change, consumer-driven contract suite ve her iki taraf merge etmeden önce CI provider verification. CloudEvents zarf yardım eder ama payload alanları hâlâ açık uyumluluk kuralı ve prod cardinality temsili fixture ister.",
                "Pact veya eşdeğeri iki tarafta koşsun—consumer beklenti yayımlar, producer kayıtlı senaryolarda eşleşen shape emit ettiğini kanıtlar. Verification fail olunca yalnızca consumer değil producer deploy'u da bloklayın yoksa monolith release train'i yavaş motion'da tekrarlarsınız. Version negotiation header veya topic suffix, analytics pipeline çatallayan sessiz dual write'dan iyidir.",
                "DLQ poison message ve schema drift'i log grep'ten hızlı gösterir. DLQ derinliği, işleme lag'i ve event type bazında error taxonomy metrikleyin. Contract test negative case içersin: bilinmeyen alan ignore, required alan eksik, enum extension crash etmeden forward. PR template'e bağlı katalogda event type sahipliğini yazın.",
                "Game day prod traffic sample'ını redaksiyonlu staging bus'a replay ederek yük altında contract değişimini doğrulayın. Legal ve privacy review event payload'a REST body gibi uygulanır—tam payment veya health event'i paylaşılan topic'e loglamayın. Çeyreklik audit emit edilen schema'yı registry ile diff edip shadow database olan orphan topic'leri emekli edin.",
            ],
        },
        "de": {
            "heading": "Async-Verträge unabhängig von Deploy-Reihenfolge",
            "paragraphs": [
                "Event-Systeme scheitern leise wenn Producer Schema ändern ohne Consumer-Verifikation. Event-Schemas wie OpenAPI behandeln: Semver-Breaks, Consumer-Driven Contracts, Provider-Verification in CI vor Merge. CloudEvents helfen, Payload-Felder brauchen Compatibility-Regeln und Fixtures mit Prod-Kardinalität. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Pact beidseitig: Consumer Erwartungen, Producer beweist Shapes in recorded Scenarios. Producer-Deploy blocken bei Fail, nicht nur Consumer. Version-Negotiation-Header oder Topic-Suffixe schlagen silent Dual-Writes. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "DLQ zeigt Poison Messages und Schema-Drift schneller als Log-Grep. Metriken Tiefe, Lag, Fehler-Taxonomie pro Event-Type. Contract-Tests negative Cases: unknown fields, missing required, enum extensions. Katalog Event-Ownership in PR-Templates. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
                "Game-Days replay Prod-Samples in Staging-Bus mit Redaction unter Last. Legal/Privacy für Event-Payloads wie REST. Keine vollen Payment/Health-Events in Shared Topics. Quarterly Audit Schema vs Registry, orphan Topics retiren. Tragen Sie Owner, Review-Datum und Rollback-Trigger im selben Change-Ticket ein.",
            ],
        },
        "fr": {
            "heading": "Contrats async indépendants de l'ordre de deploy",
            "paragraphs": [
                "Les systèmes événementiels échouent silencieusement quand producteurs changent schéma sans vérif consommateurs. Traiter schémas publiés comme OpenAPI HTTP : semver breaking, suites consumer-driven, vérif provider en CI avant merge. CloudEvents aide, champs payload exigent règles compatibilité et fixtures cardinality prod. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Pact des deux côtés : consommateurs publient attentes, producteurs prouvent shapes sous scénarios enregistrés. Bloquer deploy producteur si vérif échoue, pas seulement consommateur. Headers négociation version ou suffixes topic battent dual writes silencieux. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "DLQ révèle poison messages et drift schéma plus vite que grep logs. Métriques profondeur, lag, taxonomie erreurs par type event. Tests contrat cas négatifs : champs inconnus, required manquants, extensions enum. Catalogue ownership lié aux templates PR. Consignez owner, date de revue et rollback dans le même ticket de changement.",
                "Game days rejouent échantillons trafic prod sur bus staging rédigé sous charge. Revues legal/privacy sur payloads events comme REST. Ne pas logger payment/health complets sur topics partagés. Audit trimestriel schémas émis vs registry, retirer topics orphelins. Consignez owner, date de revue et rollback dans le même ticket de changement.",
            ],
        },
        "it": {
            "heading": "Contratti async indipendenti dall'ordine di deploy",
            "paragraphs": [
                "I sistemi event-driven falliscono in silenzio quando i producer cambiano schema senza verifica consumer. Trattate schema evento pubblicati come OpenAPI HTTP: semver breaking, suite consumer-driven, verifica provider in CI prima del merge. CloudEvents aiuta, i campi payload richiedono regole compatibilità e fixture cardinality prod. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Pact su entrambi i lati: consumer pubblicano attese, producer provano shape in scenari registrati. Bloccare deploy producer se verifica fallisce, non solo consumer. Header negoziazione versione o suffissi topic battono dual write silenziosi. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "DLQ mostra poison message e drift schema più velocemente del grep log. Metriche profondità, lag, tassonomia errori per tipo evento. Test contratto casi negativi: campi sconosciuti, required mancanti, estensioni enum. Catalogo ownership eventi nei template PR. Registrate owner, data di review e rollback nello stesso ticket di change.",
                "Game day replay campioni traffico prod su bus staging redatto sotto carico. Review legal/privacy su payload evento come REST. Non loggare payment/health completi su topic condivisi. Audit trimestrale schema emessi vs registry, ritirare topic orfani. Registrate owner, data di review e rollback nello stesso ticket di change.",
            ],
        },
        "zh": {
            "heading": "不受发布顺序影响的异步契约",
            "paragraphs": [
                "当生产者发布消费者从未验证的 schema 变更时，事件驱动系统会静默失败。将发布的事件 schema 当作 HTTP OpenAPI：semver 破坏性变更、消费者驱动契约套件，以及任一方合并前的 CI 提供者验证。CloudEvents 信封有帮助，但 payload 字段仍需明确兼容规则与代表生产基数的 fixture。",
                "Pact 或等价工具应双侧运行——消费者发布期望，生产者在录制场景下证明 emit 匹配形状。验证失败时应阻断生产者部署，而非仅阻断消费者，否则会以慢动作重现单体发布列车。版本协商头或 topic 后缀优于 fork 分析管道的静默双写。",
                "DLQ 比日志 grep 更快暴露 poison message 与 schema drift。按事件类型指标化 DLQ 深度、处理滞后与错误分类。契约测试须含负例：未知字段忽略、必填缺失、枚举扩展转发且不崩溃。在 PR 模板链接的目录中记录各事件类型 owner。",
                "Game day 将 redact 后的生产流量样本 replay 到 staging 总线以在负载下验证契约变更。法务与隐私评审同样适用于事件 payload——勿将完整 payment 或 health 事件写入共享 topic。季度审计将 emit schema 与 registry diff，退役成为 shadow database 的 orphan topic。",
            ],
        },
        "ja": {
            "heading": "deploy 順序に依存しない async contract",
            "paragraphs": [
                "producer が consumer 未 verify の schema change を ship すると event-driven system は静かに fail。published event schema を HTTP OpenAPI 同様に：semver breaking、consumer-driven contract suite、merge 前 CI provider verification。CloudEvents envelope は助けだが payload field は compatibility rule と prod cardinality fixture が要る。",
                "Pact は両側：consumer が expectation publish、producer が recorded scenario で matching shape emit を証明。verify fail 時 consumer だけでなく producer deploy も block。version negotiation header か topic suffix が silent dual write より良い。",
                "DLQ は log grep より poison message と schema drift を速く surface。depth、lag、event type 別 error taxonomy を metric。contract test に negative case：unknown field ignore、required missing、enum extension forward without crash。PR template リンク catalog に event type ownership。",
                "game day で redacted prod traffic sample を staging bus に replay し load 下で contract change validate。legal/privacy review は event payload に REST body 同様適用。full payment/health event を shared topic に log しない。四半期 audit で emit schema を registry と diff し orphan topic retire。",
            ],
        },
    },
}


def supplement_sections(slug: str, locale: str) -> list[dict]:
    block = SUPPLEMENT.get(slug, {}).get(locale)
    if not block:
        return []
    return [{"heading": block["heading"], "paragraphs": list(block["paragraphs"])}]
