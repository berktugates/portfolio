import type { BlogLocaleMap } from "../lib/content/types";

const blogs: BlogLocaleMap = {
  "failure-modes-of-ai-feature-rollouts": {
    title: "Yapay Zeka Özellik Yayınlarının Başarısızlık Biçimleri",
    excerpt:
      "Çoğu yapay zeka lansmanı; demolar, paneller ve gerçek kullanıcı iş akışları arasındaki boşluklarda başarısız olur.",
    description:
      "Yapay zeka özellik yayınlarının yaygın başarısızlık biçimlerini öngörün: sessiz kalite kayması, maliyet sıçramaları, eksik geri dönüş yolları ve üretim riskini yok sayan yayın kriterleri.",
    sections: [
      {
        heading: "Demolar operasyonel yüzeyi gizler",
        paragraphs: [
          "Cilalı bir demo, modelin seçilmiş koşullarda yararlı çıktı üretebildiğini kanıtlar. Bir yayın ise aynı sistemin trafik dağınık, gecikme bütçeleri sıkı ve organizasyonun kötü yanıtlardan destek ekibini çökertmeden kurtulması gerektiğinde de yararlı kaldığını kanıtlar.",
          "İlk üretim haftasını bir sistem testi gibi ele alın. Doğrulama tazeliğini, araç güvenilirliğini, geri dönüş yollarını, maliyet tavanlarını ve otomasyonun kaçırdığını yakalayan insan iş akışlarını doğruluyorsunuz. Bu parçalar tanımsızsa özellik hazır değildir—yalnızca demo hazırdır.",
        ],
      },
      {
        heading: "Sahibi olmadan kalite kayar",
        paragraphs: [
          "Model sağlayıcıları varsayılanları değiştirir. Promptlar istisnalar biriktirir. Retrieval indeksleri çürür. Bunların hiçbiri kırmızı bir deploy ile kendini duyurmaz. Açık bir kalite sahibi olmadan yapay zeka yayınlayan ekipler, regresyonları haftalar sonra müşteri şikayetleriyle keşfeder.",
          "Sahipliği bir erişilebilirlik SLO'sunda olduğu gibi atayın. Önemli özellikleri tanımlayın, üretim trafiğini örnekleyin ve bu özellikler hareket ettiğinde adlı bir inceleme zorunlu kılın. Kayma kaçınılmazdır; sahipsiz kayma bir ürün başarısızlığıdır.",
        ],
        points: [
          "Promptları, retrieval yapılandırmasını ve değerlendirme paketlerini birlikte sürümleyin",
          "Yalnızca hatalara değil; red oranı, yükseltme oranı ve düzeltme oranına da alarm kurun",
          "Ürünü kapatmadan yapay zekayı devre dışı bırakan bir geri alma yolu tutun",
          "Başarı ilan etmeden önce lansman sonrası triyaj için zaman ayırın",
        ],
      },
      {
        heading: "Geri dönüş yolları özelliğin parçasıdır",
        paragraphs: [
          "Model kullanılamaz, yavaş veya düşük güvenilir olduğunda kullanıcıların işi tamamlamak için yine de bir yola ihtiyacı vardır. Boş bir durum veya kibar bir özür geri dönüş yolu değildir. Geri dönüş yolu; ilerlemeyi koruyan deterministik akış, önbelleklenmiş yanıt, arama sonucu veya insan el değiştirmesidir.",
          "Geri dönüş yollarını lansmandan önce tasarlayın ve staging'de çalıştırın. Ne sıklıkla tetiklendiklerini ölçün. Testte nadir, üretimde yaygınlarsa güven eşikleriniz veya bağımlılık varsayımlarınız yanlıştır.",
        ],
      },
      {
        heading: "Yayın kriterleri maliyet ve riski içermelidir",
        paragraphs: [
          "Bir avuç golden prompt'u geçmek gereklidir ama yeterli değildir. Yayınları kritik özellik regresyonları, başarılı sonuç başına maliyet, p95 gecikme ve destek ile güven ekiplerinin hazırlığına bağlayın. Yüksek riskli eylemler, düşük riskli taslak yardımcılarından daha sıkı barlar gerektirir.",
          "Sağlıklı bir yapay zeka yayını sıkıcı görünür: kademeli maruz bırakma, net kill switch'ler, gözlemlenen kalite ve bir şeyler ters gittiğinde neyin değiştiğini açıklayabilen bir ekip. Bu sıkıcılık, mühendisliğin modele umut bağlamak yerine riski sahiplendiğinin işaretidir.",
        ],
      },
    ],
  },

  "context-engineering-for-reliable-ai-features": {
    title: "Güvenilir Yapay Zeka Özellikleri için Bağlam Mühendisliği",
    excerpt:
      "Çoğu yapay zeka ürün başarısızlığı bağlam başarısızlığıdır. Retrieval, bellek ve talimatları bir sistem olarak tasarlayın.",
    description:
      "Bağlam mühendisliğinin retrieval tasarımı, bellek sınırları, talimat hiyerarşisi ve ölçülebilir grounding ile üretim yapay zeka güvenilirliğini nasıl iyileştirdiğini öğrenin.",
    sections: [
      {
        heading: "Promptlar sistemin tamamı değildir",
        paragraphs: [
          "Bir yapay zeka özelliği halüsinasyon gördüğünde ekipler çoğu zaman sistem promptunu yeniden yazar. Bu yardımcı olabilir ama nadiren kök nedeni çözer. Model yalnızca kendisine verilenler üzerinde akıl yürütebilir. Retrieval zayıfsa, bellek gürültülüyse veya araç sonuçları eksikse, hiçbir ifade güvenilir davranış yaratmaz.",
          "Bağlam mühendisliği, birleştirilmiş girdiyi bir ürün yüzeyi olarak ele alır. Hangi gerçeklerin mevcut olması gerektiğini, hangi talimatların öncelikli olduğunu, ne kadar geçmişin yararlı olduğunu ve neyin dışarıda bırakılması gerektiğini sorar. Amaç, amaçlanan yanıtı mümkün kılan sınırlı ve incelenebilir bir bilgi paketidir.",
        ],
      },
      {
        heading: "Talimatları, gerçekleri ve araçları ayırın",
        paragraphs: [
          "Kalıcı bir bağlam paketinin net sahipliğe sahip katmanları vardır. Politika ve ürün talimatları modelin ne yapabileceğini tanımlar. Getirilen gerçekler dayanaklı kanıt sağlar. Araç çıktıları mevcut dünyayı anlatır. Konuşma geçmişi kullanıcı niyetini yakalar. Bu katmanları ayrışmamış tek bir yığına karıştırmak hata ayıklamayı neredeyse imkânsız kılar.",
          "Her katmana kararlı bir biçim ve boyut bütçesi verin. Uzun düzyazı dökümleri yerine yapılandırılmış gerçekleri tercih edin. Kanıtlar çeliştiğinde, sistemin otoriter kaynakları tercih edebilmesi veya uydurma uzlaştırma yerine netleştirici soru sorabilmesi için kaynak bilgisini koruyun.",
        ],
        points: [
          "Bağlamı token sayısına değil, karar değerine göre sıralayın",
          "Yetkilendirme kararlarını modelin dışında tutun",
          "Taahhütleri koruyan özetlemeyle geçmişi sınırlayın",
          "Son prompta hangi kaynakların girdiğini kaydedin",
        ],
      },
      {
        heading: "Retrieval kalitesi ürün kalitesidir",
        paragraphs: [
          "Retrieval ile güçlendirilmiş üretim, yanlış belgeler yüksek güvenle getirildiğinde sessizce başarısız olur. Yalnızca gömme benzerliğini değil, önemli sorularda recall'u ölçün. Zor durumları dahil edin: eş anlamlılar, kısmi tanımlayıcılar, çok dilli sorgular ve hiçbir şey getirmemesi gereken istekler.",
          "Parçalama stratejisi, metadata filtreleri ve yeniden sıralama, model seçimiyle aynı incelemede yer almalıdır. Özellikle gecikme ve maliyet kısıtları altında, mükemmel bağlama sahip daha küçük bir model, kirli bağlama sahip daha büyük bir modeli sıkça geride bırakır.",
        ],
      },
      {
        heading: "Bağlamı gözlemlenebilir kılın",
        paragraphs: [
          "Kullanıcılar kötü bir yanıt bildirdiğinde mühendislerin onu üreten bağlamı yeniden kurabilmesi gerekir. Prompt ve retrieval sürümlerini, kaynak tanımlayıcılarını, token bütçelerini ve doğrulama sonuçlarını gizlilik kontrolleriyle saklayın. Bu iz olmadan her olay anekdota dönüşür.",
          "Bağlam mühendisliği, sistem ne bildiğini, ne bilmediğini ve neden böyle yanıtladığını açıklayabildiğinde başarılıdır. Bu şeffaflık, yapay zeka ürünlerinde güvenin temelidir.",
        ],
      },
    ],
  },

  "cost-aware-ai-product-architecture": {
    title: "Yapay Zeka Ürünleri için Maliyet Bilinçli Mimari",
    excerpt:
      "Model harcamasını sonradan gelen bir finans sürprizi değil, bir ürün kısıtı olarak ele alın.",
    description:
      "Yapay zeka özelliklerini açık maliyet bütçeleri, önbellekleme, model yönlendirme, değerlendirme ödünleşimleri ve gerçek trafikte ayakta kalan birim ekonomisiyle tasarlayın.",
    sections: [
      {
        heading: "Birim ekonomisi tasarım belgesine aittir",
        paragraphs: [
          "On kullanıcıyı memnun edip on bin kullanıcıda şirketi batıran bir yapay zeka özelliği bitmiş bir tasarım değildir. İstek başına token, beklenen eşzamanlılık, önbellek isabet oranı, değerlendirme yükü ve müşterilerin sonuç için ödeme isteğini tahmin edin. Bu sayılar lansmandan önce model seçimini ve etkileşim tasarımını etkilemelidir.",
          "Maliyet bilinci ucuzlukla aynı şey değildir. Bazı iş akışları pahalı bir modeli hak eder çünkü alternatif insan emeği veya kayıp gelirdir. Mühendislik görevi, kalitenin kaldıraç yarattığı yerde bilinçli harcamak ve yaratmadığı yerde harcamayı reddetmektir.",
        ],
      },
      {
        heading: "İşi zorluğa göre yönlendirin",
        paragraphs: [
          "Her istek mevcut en güçlü modeli gerektirmez. Görevleri risk ve belirsizliğe göre sınıflandırın. Deterministik çıkarma, sınıflandırma ve biçimlendirme çoğu zaman daha küçük modelleri veya klasik yazılımı kullanabilir. Açık uçlu sentez, planlama ve yüksek riskli tavsiye, daha sıkı korumalarla daha güçlü bir modeli haklı kılabilir.",
          "Yönlendirme açık ve ölçülebilir olmalıdır. Kaliteyi, gecikmeyi ve maliyeti rota bazında izleyin. Yalnızca güven düşük olduğunda yükselten bir kaskad, deneyimi korurken ortalama isteği uygun maliyetli tutar.",
        ],
        points: [
          "Kararlı retrieval ve tekrarlanan promptları önbelleğe alın",
          "Yeniden denemeleri azaltan yapılandırılmış çıktıları tercih edin",
          "Değerlendirme koşularını üretim trafiği gibi bütçeleyin",
          "Faturalar gelmeden maliyet alarmlarını görünür kılın",
        ],
      },
      {
        heading: "Ürün biçimi faturayı değiştirir",
        paragraphs: [
          "Uzun denemeleri akışla sunmak pahalıdır. Kısa yapılandırılmış öneriler istemek daha ucuzdur ve çoğu zaman daha yararlıdır. Arayüz kararları—modele ne zaman çağrı yapılacağı, ne kadar geçmiş gönderileceği, yeniden üretim yapılıp yapılmayacağı—UX seçimleri kadar maliyet kontrolüdür.",
          "Çevrimdışı işi toplu işleyin, sık yanıtları önceden hesaplayın ve küçük ilgili bir dilim yeterliyken tüm hesap geçmişini göndermekten kaçının. En ucuz token, sistemin hiç göndermediği tokendir.",
        ],
      },
      {
        heading: "Harcamayı bir sağlık sinyali yapın",
        paragraphs: [
          "Yalnızca istek başına maliyeti değil, başarılı sonuç başına maliyeti izleyin. Kullanıcıların beş kez yeniden denediği ucuz bir uç nokta ucuz değildir. Finans metriklerini ürün analitiğine bağlayın ki ekipler harcamanın elde tutma, dönüşüm veya destek sapması satın alıp almadığını görsün.",
          "Sürdürülebilir yapay zeka ürünleri model harcamasını mimari bir parametre olarak ele alır. Bütçe görünür olduğunda ekipler trafiğin küçük kalmasını ummak yerine daha iyi sistemler icat eder.",
        ],
      },
    ],
  },

  "evaluating-llm-outputs-in-production": {
    title: "LLM Çıktılarını Tahmine Dayanmadan Değerlendirmek",
    excerpt:
      "Hislerle yayınlamayı, gerçek ürün riskini yansıtan değerlendirme paketleriyle değiştirin.",
    description:
      "Golden veri kümeleri, otomatik puanlayıcılar, insan inceleme döngüleri, regresyon kapıları ve risk tabanlı yayın kriterleriyle üretim LLM değerlendirmesi kurun.",
    sections: [
      {
        heading: "Önemli özellikleri tanımlayın",
        paragraphs: [
          "Genel doğruluk skorları bir ürünü nadiren korur. Kullanıcıların ve işin taviz veremeyeceği özellikleri belirleyin: olgusal grounding, şema geçerliliği, ton, red kalitesi, gecikme, alıntı varlığı veya politika uyumu. Farklı özellikler farklı skor kartları gerektirir.",
          "Bu özellikleri ölçülebilir kontroller olarak yazın. Dayanaklı bir yanıt izin verilen kaynaklara atıf yapmalıdır. Bir rezervasyon asistanı envanter uydurmamalıdır. Bir destek yardımcısı hesap ele geçirme isteklerini reddetmelidir. Değerlendirme model liderlik tablolarıyla değil, ürün vaatleriyle başlar.",
        ],
      },
      {
        heading: "Canlı bir veri kümesi oluşturun",
        paragraphs: [
          "Üretim sorunlarından, destek biletlerinden, düşmanca promptlardan ve araştırmada keşfedilen uç durumlardan örnekler toplayın. Kişisel olarak tanımlanabilir bilgileri paketten çıkarın veya gerçekçi sentetik ikamelerle değiştirin. Veri kümesini promptlar ve model ayarlarıyla birlikte sürümleyin.",
          "Zarifçe başarısız olması gereken durumları dahil edin. Yalnızca mutlu yolları kapsayan değerlendirme, güveni en çok zedeleyen anlarda regresyonları yeşil ışık yakar.",
        ],
        points: [
          "Çevrimdışı paketleri çevrimiçi örneklemeden ayırın",
          "Otomatik puanlayıcıları periyodik insan incelemesiyle kalibre edin",
          "Kritik özellik regresyonlarında yayınları engelleyin",
          "Değerlendirme kapsamını kullanıcı yolculuğuna göre izleyin",
        ],
      },
      {
        heading: "Sıkıcı olanı otomatikleştirin, incelikli olanı inceleyin",
        paragraphs: [
          "Şema kontrolleri, yasaklı ifade tespiti, alıntı varlığı ve deterministik fixture'lar her değişiklikte çalışabilir. Yardımcılık veya empati gibi nüanslı nitelikler hâlâ örneklenmiş insan yargısına ihtiyaç duyar. Kapsamı genişletmek için otomasyonu, puanlayıcıları dürüst tutmak için insanları kullanın.",
          "Model veya prompt değiştiğinde mutlak bir mükemmellik fantezisine değil, önceki tabana göre karşılaştırın. Soru, hizmet ettiğiniz kullanıcılar için ürünün daha güvenli ve daha yararlı olup olmadığıdır.",
        ],
      },
      {
        heading: "Lansmandan sonra döngüyü kapatın",
        paragraphs: [
          "Üretim, paketinizin hiç hayal etmediği durumlar icat eder. Yüksek şiddetli başarısızlıkları hızla değerlendirmeye geri besleyin. Bunu telemetriyle eşleştirin: beğenmeme oranları, kullanıcı düzeltmelerindeki düzenleme mesafesi, insanlara yükseltme ve görev tamamlama.",
          "Değerlendirme lansmandan önceki bir tören değildir. Yapay zeka ürününün sürekli bağışıklık sistemidir.",
        ],
      },
    ],
  },

  "designing-agentic-workflows-that-stay-controllable": {
    title: "Kontrol Edilebilir Kalan Ajan Tabanlı İş Akışları Tasarlamak",
    excerpt:
      "Özerklik yalnızca her araç çağrısının net bir sınırı ve denetim izi olduğunda yararlıdır.",
    description:
      "Kapsamlı araçlar, insan onay kapıları, deterministik durum makineleri ve güvenli kurtarma yollarıyla kontrol edilebilir yapay zeka ajanlarını nasıl tasarlayacağınızı öğrenin.",
    sections: [
      {
        heading: "Özerklik bir durum makinesi ister",
        paragraphs: [
          "Kendi planlarını icat eden serbest biçimli ajanlar demoda heyecan verici, üretimde kırılgandır. Açık bir iş akışını tercih edin: bağlam topla, eylemler öner, gerektiğinde onay iste, araçları çalıştır, sonuçları doğrula ve dur. Model bu makine içinde esnek adımları doldurabilir; makinenin sahibi olmamalıdır.",
          "Durum makineleri zaman aşımlarını, yeniden denemeleri ve denetimleri mümkün kılar. Ayrıca ürün vaatlerini uygulanabilir kılar: ajan, iş akışı onaylı bir duruma ulaşmadıkça para iadesi yapamaz, veri silemez veya müşterilere mesaj gönderemez.",
        ],
      },
      {
        heading: "Araçlar sözleşmeli yeteneklerdir",
        paragraphs: [
          "Her araç; tipli girdiler, yetkilendirme kontrolleri, idempotency ve net yan etkilerle dar bir yetenek sunmalıdır. Shell veya ham veritabanı üzerinden her şeyi yapabilen geniş araçlar geri alınamaz hatalara davetiye çıkarır.",
          "İş akışının doğrulayabileceği yapılandırılmış sonuçlar döndürün. Belirsiz araç başarısızlıkları uydurulmuş başarıya dönüşmemelidir. Bir ödeme API'si zaman aşımına uğrarsa ajan tamamlandığını varsaymak yerine durumu sorgulamalıdır.",
        ],
        points: [
          "Geri alınamaz yan etkiler için onay zorunlu kılın",
          "Döngüleri adım ve maliyet limitleriyle sınırlayın",
          "Planları ve araç dökümlerini kalıcılaştırın",
          "Araç başına en az yetkili kimlik bilgilerini tercih edin",
        ],
      },
      {
        heading: "İnsanları doğru yerlerde tutun",
        paragraphs: [
          "İnsan onayı bir başarısızlık itirafı değildir. Yasal, finansal veya itibar etkisi olan eylemler için bir ürün kontrolüdür. İnceleme arayüzlerini ham bir düşünce zinciri dökümü değil; önerilen eylemi, kanıtı ve alternatifleri saniyeler içinde gösterecek şekilde tasarlayın.",
          "Zamanla, tekrar tekrar onaylanan kalıpları izlemeyle otomatik yollara yükseltin. Kontrol edilebilirlik, organizasyon hangi kararların hızlandırılmasının güvenli olduğunu öğrendikçe iyileşir.",
        ],
      },
      {
        heading: "Büyü gibi değil, yazılım gibi kurtarın",
        paragraphs: [
          "Ajanlar takılır, döngüye girer veya işi kısmen tamamlar. Telafi eylemleri, dead-letter durumları ve sürdürme ya da geri alma için operatör araçları sağlayın. Kullanıcılara altta yatan işlemler çözülmemişken sistemin bitirdiği söylenmemelidir.",
          "Kazanan ajan sistemleri sakin hissettirir. Modelleri, dikkatle sahiplenilmiş yazılım sınırları içinde yargı için kullanırlar.",
        ],
      },
    ],
  },

  "typed-boundaries-in-modern-typescript-systems": {
    title: "Modern TypeScript Sistemlerinde Tipli Sınırlar",
    excerpt:
      "TypeScript, tipler modüller, API'ler ve çalışma zamanı verisi arasındaki dikişleri koruduğunda karşılığını verir.",
    description:
      "TypeScript'i sistem sınırlarında şema doğrulama, paylaşılan sözleşmeler, branded tipler ve üretim hatalarını azaltan pratik kalıplarla etkili kullanın.",
    sections: [
      {
        heading: "Tipler kenarlarda en güçlüdür",
        paragraphs: [
          "Dahili fonksiyon eklemeleri yardımcı olur ama pahalı hatalar genellikle süreç, ağ, depolama veya ekip sınırlarını aşar. Tip çabasını güvenilmeyen veya bağımsız dağıtılan verinin sisteme girdiği yerlere yatırın: HTTP yükleri, kuyruk mesajları, ortam yapılandırması ve üçüncü taraf webhook'ları.",
          "Bu kenarlarda derleme zamanı tipleri yeterli değildir. Geçersiz verinin alan mantığını bozmadan önce kontrollü şekilde başarısız olması için onları çalışma zamanı şemalarıyla eşleştirin.",
        ],
      },
      {
        heading: "Uygulamaları değil, sözleşmeleri paylaşın",
        paragraphs: [
          "İstemciler ve sunucular için paylaşılan tipleri tek bir doğruluk kaynağından üretin veya yayımlayın. Taşıma ayrıntılarını ve UI kaygılarını alan modelinin dışında tutun. Bir alanın nullability değişikliği bilinçli ve her tüketiciye görünür olmalıdır.",
          "Tanımlayıcılar için branded tipler, kullanıcı kimlikleri, organizasyon kimlikleri ve dış referansların yanlışlıkla karışmasını önler. Küçük nominal ayrımlar bütün bir entegrasyon hata sınıfını yakalar.",
        ],
        points: [
          "Güven sınırlarında okurken doğrulayın",
          "Ucuz olduğu yerde yasadışı durumları temsil edilemez kılın",
          "Atılan belirsizlik yerine açık sonuç tiplerini tercih edin",
          "DTO'ları kalıcılık modellerinden ayrı tutun",
        ],
      },
      {
        heading: "Tip tiyatrosundan kaçının",
        paragraphs: [
          "Her geçici UI durumuna aşırı tip uydurmak güvenlik olmadan churn yaratır. any, geniş cast'ler ve aşırı zekice koşullu tipler gibi kaçış kapıları nadir ve gerekçeli olmalıdır. Takım arkadaşlarının değiştirebileceği okunabilir tipler, kimsenin anlamadığı zekice tiplerden daha değerlidir.",
          "Başarıyı jenerik yoğunluğuyla değil, daha az üretim ayrıştırma hatası ve daha güvenli refaktörlerle ölçün.",
        ],
      },
      {
        heading: "Tiplerin kararları belgelemesine izin verin",
        paragraphs: [
          "İyi bir tip sistemi ürün kurallarını yakalar: onboarding sonrası hangi alanlar vardır, hangi durumlar iadeye izin verir, hangi yükler sürümlüdür. Bu belgeleme dürüst kalır çünkü derleyici onu zorlar.",
          "TypeScript, zaten inandığınız mimariyi kodladığında ve ekibin onu yanlışlıkla terk etmesini engellediğinde en etkilidir.",
        ],
      },
    ],
  },

  "caching-strategies-for-product-facing-apis": {
    title: "Ürün Yüzlü API'ler için Önbellekleme Stratejileri",
    excerpt:
      "Önbellek önce bir doğruluk kararı, sonra bir performans optimizasyonudur.",
    description:
      "API önbelleklemesini açık tazelik kuralları, geçersiz kılma stratejileri, stampede koruması ve web ile mobil istemciler için ürün farkındalıklı ödünleşimlerle tasarlayın.",
    sections: [
      {
        heading: "Tazelik sözleşmesini adlandırın",
        paragraphs: [
          "Redis, CDN kuralları veya HTTP başlıklarını seçmeden önce bir yanıtın ne kadar bayat olabileceğine ve yanlış olduğunda ne olacağına karar verin. Profil sayfaları, envanter sayıları, fiyatlar ve izinlerin gecikmeye farklı toleransları vardır. Tek bir küresel TTL genellikle bir ürün hatasıdır.",
          "Sözleşmeyi istemcilerin güvenebileceği mühendislik dilinde yazın: mutlak sona erme, olay güdümlü geçersiz kılma veya açık yeniden doğrulama. Belirsiz tazelik, birbirleriyle savaşan yinelenen önbellek katmanları yaratır.",
        ],
      },
      {
        heading: "Önbelleği izleyicinin olduğu yerde tutun",
        paragraphs: [
          "Herkese açık içerik kenar önbelleklerinden yararlanır. Kullanıcı bazlı paneller çoğu zaman kimlik ve kiracıya göre anahtarlanmış uygulama düzeyi önbellekler ister. Pahalı hesaplanmış toplamalar kısa ömürlü bir anahtar-değer girdisinden ziyade materyalizasyon gerektirebilir.",
          "Yetkisiz yanıtları veya sırlar gömen yanıtları önbelleğe almaktan kaçının. Önbellek anahtarları anlamı değiştiren her boyutu içermelidir: yerel ayar, plan, özellik bayrağı ve temsil sürümü.",
        ],
        points: [
          "Sona ermede thundering herd'lere karşı koruyun",
          "Idempotent yeniden hesaplama yollarını tercih edin",
          "İsabet oranını yanlış veri olaylarıyla birlikte gözlemleyin",
          "Anlamlı alan olaylarında geçersiz kılın",
        ],
      },
      {
        heading: "Geçersiz kılma zor kısımdır",
        paragraphs: [
          "Zaman tabanlı sona erme basittir ve işbirlikçi veriler için sıkça yanlıştır. Olay tabanlı geçersiz kılma kesindir ve bir üreticiyi kaçırmak kolaydır. Birçok sistem kritik varlıklar için yazma yollarında açık temizlemeyle mütevazı bir TTL'yi birleştirir.",
          "Silme ve güncelleme akışlarını önbelleklerin ihtiyaç duyduğu sinyalleri yayacak şekilde tasarlayın. Yazarlar okuyucuların önbelleklerini bilmiyorsa bayat veri yinelenen bir olay teması olur.",
        ],
      },
      {
        heading: "Kullanıcıya görünür sonuçları ölçün",
        paragraphs: [
          "Yüksek isabet oranıyla birlikte bayat bilgi hakkında artan destek biletleri bir zafer değildir. Gecikme yüzdeliklerini, origin yükünü ve doğruluk şikayetlerini birlikte izleyin. Önbellekleme stratejisi ürünün aynı anda hızlı ve güvenilir hissettirmesini sağlamalıdır.",
          "En iyi önbellek görünmezdir: kullanıcılar zamanında yanıt alır, origin'ler sakin kalır ve mühendisler verinin ne zaman gecikebileceğini tam olarak açıklayabilir.",
        ],
      },
    ],
  },

  "feature-flags-as-engineering-infrastructure": {
    title: "Mühendislik Altyapısı Olarak Özellik Bayrakları",
    excerpt:
      "Bayraklar geçici hileler değildir. Modern ekiplerin deploy'u yayından ayırma biçimidir.",
    description:
      "Özellik bayraklarını sahiplik, temizlik, hedefleme kuralları, deney hijyeni ve operasyonel güvenlikle güvenilir mühendislik altyapısı olarak kullanın.",
    sections: [
      {
        heading: "Deploy sıkıcı olmalıdır",
        paragraphs: [
          "Kodu üretime göndermek ile bir özelliği kullanıcılara açmak farklı kararlardır. Özellik bayrakları ekiplerin sürekli birleşmesine izin verirken etki yarıçapını kontrol eder. Gözlemlenebilirlikle birleşince yayınları ikili olaylar değil, geri alınabilir deneylere dönüştürürler.",
          "Bu yalnızca bayraklar altyapı olarak ele alındığında işler: net adlandırılmış, bir ekip tarafından sahiplenilmiş, güvenli varsayılanlı ve bir takvimde kaldırılabilir.",
        ],
      },
      {
        heading: "İşletilebilirlik için tasarlayın",
        paragraphs: [
          "Her bayrağın yönetim hizmeti kullanılamadığında bir varsayılanı olmalıdır. Kritik yollar rastgele değil, bilinçli olarak kapalı veya açık başarısız olmalıdır. Hedefleme kuralları, özellikle kurumsal müşteriler ve düzenlenmiş iş akışları için test edilebilir ve denetlenebilir olmalıdır.",
          "İlgisiz davranışı tek bir bayrakta sarmalamaktan kaçının. Kaba bayraklar dolanık temizlik yaratır. İnce bayraklar kombinatoryal test maliyeti yaratır. Kullanıcıya görünür yeteneğe göre gruplayın.",
        ],
        points: [
          "Bir bayrağı kimin neden değiştirdiğini kaydedin",
          "Bayraklar oluşturulurken kaldırma tarihleri belirleyin",
          "Mümkün olduğunda bayrak değerlendirmesini sıkı döngülerin dışında tutun",
          "Hem etkin hem de devre dışı yolları test edin",
        ],
      },
      {
        heading: "Deneyler hijyen ister",
        paragraphs: [
          "Bayraklar deneyleri güçlendirdiğinde hipotezi, birincil metriği ve bitiş kriterlerini lansmandan önce tanımlayın. Yarım kalmış deneyleri süresiz çalışır bırakmayın; analitiği kirletir ve bilişsel yükü artırırlar.",
          "Segmentasyonu dikkatli yapın. Aynı yolculukta örtüşen deneyler sonuçları geçersiz kılabilir ve kafa karıştırıcı kullanıcı deneyimleri yaratabilir.",
        ],
      },
      {
        heading: "Temizlik teslimatın parçasıdır",
        paragraphs: [
          "Bir özellik tamamen yayınlandıktan uzun süre sonra yaşayan bir bayrak ölü yapılandırma ve gizli dallanma haline gelir. Temizlik işini lansmanla aynı ciddiyetle planlayın. Kullanılmayan yolları silin ki kod tabanı gerçekliği yansıtsın.",
          "Olgun ekipler daha fazla anahtara sahip oldukları için değil, güvenli yayınlayıp ardından sistemi daha basit bırakabildikleri için bayraklarla kazanır.",
        ],
      },
    ],
  },

  "using-ai-coding-tools-without-losing-architecture": {
    title: "Mimariyi Kaybetmeden Yapay Zeka Kodlama Araçlarını Kullanmak",
    excerpt:
      "Hız yalnızca sistem sınırları bilinçli kaldığında ücretsizdir.",
    description:
      "Yapay zeka kodlama asistanlarını mimariyi, kod inceleme kalitesini, güvenlik incelemesini ve uzun vadeli sürdürülebilirliği koruyarak etkili benimseyin.",
    sections: [
      {
        heading: "Otomatik tamamlama değil, kısıttan başlayın",
        paragraphs: [
          "Yapay zeka kodlama araçları görev sınırlı olduğunda üstündür: bu arayüzü uygula, bu testi ekle, bu çağrı noktasını taşı. Depoda henüz ifade edilmeyen bir mimari icat etmeleri istendiğinde zorlanırlar. Önce değişmezleri sağlayın—sahiplik sınırları, adlandırma kuralları, hata modeli ve yasak kısayollar.",
          "Çerçeveleme mühendisin sorumluluğunda kalır. Belirsiz bir prompt, mevcut modülleri sessizce çoğaltan veya paylaşılan yardımcıları baypas eden makul kod üretir.",
        ],
      },
      {
        heading: "Üretilen değişiklikleri mimari olarak inceleyin",
        paragraphs: [
          "Sözdiziminin ötesine bakın. Değişiklik modül sınırlarına saygı duyuyor mu? Yeni bir kalıcılık yolu mı getiriyor? Yetkilendirme ve başarısızlığı ele alıyor mu? Büyük üretilmiş diff'ler üstünkörü okumaya davetiye çıkarır; bir insanın gerçekten anlayabileceği küçük commit'lerde ısrar edin.",
          "Geri alınması pahalı bir karar olduğunda araçtan alternatifler isteyin. İki yaklaşımı karşılaştırmak çoğu zaman ilk taslağı kabul etmekten daha değerlidir.",
        ],
        points: [
          "Görsel olarak doğrulayamadığınız davranış için test zorunlu kılın",
          "Yenilerini eklemeden önce mevcut yardımcıları arayın",
          "Sırları ve üretim verisini promptların dışında tutun",
          "Genel çerçeve folklorü yerine depo belgelerini tercih edin",
        ],
      },
      {
        heading: "Geri bildirim döngüsünü koruyun",
        paragraphs: [
          "Tip kontrolleri, lint kuralları, sözleşme testleri ve önizleme ortamları yüksek hızlı üretimi güvenli kılan şeylerdir. Paket zayıfsa yapay zeka yalnızca doğrulanmamış karmaşıklığı daha hızlı üretmenize yardım eder.",
          "Kazanılan zamanın bir kısmını daha iyi fixture'lara, daha net modül README dosyalarına ve tercih edilen kalıp örneklerine yatırın. Bu artefaktlar hem insan hem yapay zeka katkılarını iyileştirir.",
        ],
      },
      {
        heading: "Zevki döngüde tutun",
        paragraphs: [
          "Mimari, kısıtlar altında birikmiş zevktir. Yapay zeka uygulamalar önerebilir; ürünün geleceğini sahiplenemez. Araçları yargıyı dış kaynaklamak için değil, doğrulanmış işi hızlandırmak için kullanın.",
          "Yapay zeka kodlama araçlarıyla gelişen ekipler sınırlar konusunda disiplinlidir. Kod, raylar net olduğu için daha hızlı hareket eder.",
        ],
      },
    ],
  },

  "event-driven-design-for-product-backends": {
    title: "Ürün Backend'leri için Olay Güdümlü Tasarım",
    excerpt:
      "Olaylar ürünlere iş akışlarını ölçeklendirmede yardımcı olur—onları yangın hortumu değil sözleşme olarak ele alırsanız.",
    description:
      "Olay güdümlü mimariyi ürün backend'lerine net alan olayları, tüketici izolasyonu, idempotency, sıralama ödünleşimleri ve operasyonel görünürlükle uygulayın.",
    sections: [
      {
        heading: "İş hakkında gerçekler yayınlayın",
        paragraphs: [
          "Yararlı olaylar anlamlı bir şeyin olduğunu anlatır: sipariş verildi, kayıt işlendi, üyelik yükseltildi. Veritabanı satırlarının dökümü veya kılık değiştirmiş uzaktan yordam çağrısı değildirler. Olayları geçmiş zamanda adlandırın ve tüketicilerin geveze geri çağrılar olmadan hareket edebilmesi için yeterli bağlam ekleyin.",
          "Yükü sürümleyin. Tüketiciler farklı takvimlerde evrilir ve kırıcı bir alan yeniden adlandırması ekipler arasında sessiz başarısızlıklara yayılabilir.",
        ],
      },
      {
        heading: "Tüketicileri bilinçli olarak izole edin",
        paragraphs: [
          "Her tüketici belirli bir sonucu sahiplenmelidir: e-posta gönder, arama indeksini güncelle, yetkileri sağla veya analitiği bilgilendir. İlgisiz yan etkiler için tek bir dev işçi paylaşmak, daha kötü başarısızlık biçimleriyle bir monolit yeniden yaratır.",
          "Backpressure, yeniden denemeler ve dead-letter kuyrukları tüketici başına aittir. Bildirimlerdeki zehirli bir mesaj arama indekslemeyi engellememelidir.",
        ],
        points: [
          "İşleyicileri varsayılan olarak idempotent yapın",
          "Tekilleştirme anahtarlarıyla en az bir kez teslimatı tercih edin",
          "Sıralama garantilerini dürüstçe belgelendirin",
          "Üretim akışlarını yayınlama ve tüketme boyunca izleyin",
        ],
      },
      {
        heading: "Tutarlılık ödünleşimini kabul edin",
        paragraphs: [
          "Olay güdümlü sistemler sıkça eventual consistency'yi benimser. Ürün metni ve UI, bazı durumların asenkron yakaladığını kabul etmelidir. Her yan etkinin anlık olduğunu iddia etmektense işleniyor durumu göstermek daha iyidir.",
          "Güçlü tutarlılık gerektiğinde—bakiyeler, envanter rezervasyonları, benzersiz kısıtlar—bu mantığı işlem sınırında tutun ve olayları commit'ten sonra yayınlayın.",
        ],
      },
      {
        heading: "Koreografiyi işletın",
        paragraphs: [
          "Korelasyon kimlikleri, gecikme metrikleri ve yeniden oynatma araçları olmadan olay sistemleri gizemli hale gelir. Bir hata düzeltmesinden sonra bir olay penceresini güvenle yeniden işleme yeteneği kurun. Tüketici gecikmesini kullanıcıya dönük bir güvenilirlik sinyali olarak ölçün.",
          "Olay güdümlü tasarım, ekipler temel işlem yolunu istikrarsızlaştırmadan tüketici ekleyerek ürün davranışını genişletebildiğinde karşılığını verir.",
        ],
      },
    ],
  },

  "testing-strategies-for-ai-powered-features": {
    title: "Yapay Zeka Destekli Özellikler için Test Stratejileri",
    excerpt:
      "Deterministik testler hâlâ önemlidir. Onları olasılıksal kısımlar için değerlendirme ile eşleştirin.",
    description:
      "Yapay zeka özellikleri için şema sözleşmeleri, golden değerlendirmeler, entegrasyon stub'ları ve deterministik olmayan sistemler için yayın kapılarını kapsayan pratik bir test stratejisi oluşturun.",
    sections: [
      {
        heading: "Deterministik olanı olasılıksaldan ayırın",
        paragraphs: [
          "Bir yapay zeka özelliğinin çoğu hâlâ sıradan yazılımdır: kimlik doğrulama, girdi doğrulama, retrieval sorguları, hız sınırları, kalıcılık ve UI render'ı. Bu katmanlar sabit fixture'larla klasik birim ve entegrasyon testlerini hak eder. Ortada bir model var diye onları zayıflatmayın.",
          "Üretici adım farklı bir yaklaşım ister. Serbest biçimli yanıtlarda tam dize eşleştirme kırılgan paketler yaratır. Model çevresindeki sözleşmeyi test edin ve model çıktılarını ürün özelliklerine göre değerlendirin.",
        ],
      },
      {
        heading: "Sürekli entegrasyonda akıllıca stub'layın",
        paragraphs: [
          "Her pull request'te canlı modelleri çağırmak yavaş, pahalı ve deterministik değildir. Pull request hatları için kayıtlı fixture'lar veya deterministik stub'lar kullanın; daha geniş değerlendirme paketlerini bir takvimde veya promptlar, modeller ya da retrieval mantığı değiştiğinde çalıştırın.",
          "Stub'larken gerçekçi gecikme ve başarısızlık biçimlerini koruyun. Yalnızca mükemmel model yanıtları gören testler zaman aşımı işlemeyi veya bozuk çıktı yollarını korumaz.",
        ],
        points: [
          "Render etmeden önce çıktı şemasını doğrulayın",
          "Kritik dayanaklı yanıtları golden-file olarak tutun",
          "Boş retrieval ve araç başarısızlıklarını simüle edin",
          "Birleştirmeleri model yaratıcılığına değil sözleşme testlerine bağlayın",
        ],
      },
      {
        heading: "Yolculuk düzeyinde güven ekleyin",
        paragraphs: [
          "Uçtan uca testler kullanıcının yapay zeka destekli yolculuğu tamamlayabildiğini doğrulamalıdır: istek gir, doğrulanmış yanıt gör, reddi kurtar ve gerektiğinde yükselt. Bu yolculukları az ve kararlı tutun.",
          "Otomatik yolculukları örneklenmiş üretim çıktılarının periyodik insan incelemesiyle eşleştirin. Yapay zeka için kalite mühendisliği, yazılım disiplini ile ürün zevkinin bir karışımıdır.",
        ],
      },
      {
        heading: "Başarısızlığı eyleme dönüştürülebilir kılın",
        paragraphs: [
          "Başarısız bir yapay zeka testi size şemanın mı bozulduğunu, retrieval'ın mı kaçırdığını, politikanın mı yanlış reddettiğini yoksa değerlendirme skorlarının mı düştüğünü söylemeli. Belirsiz kırmızı derlemeler ekipleri onları yok saymaya alıştırır.",
          "Yapay zeka özelliklerini test etmenin amacı modellerin deterministik olduğunu iddia etmek değildir. Olasılıksal bileşenleri işletilebilir, incelenebilir ve değiştirmesi güvenli bir sistem içinde tutmaktır.",
        ],
      },
    ],
  },

  "engineering-ai-products-that-earn-trust": {
    title: "Güven Kazanan Yapay Zeka Ürünleri Mühendisliği",
    excerpt:
      "Üretimde yararlı, gözlemlenebilir ve güvenilir yapay zeka özellikleri için pratik bir mimari.",
    description:
      "Açık sözleşmeler, değerlendirme, gözlemlenebilirlik, geri dönüş yolları ve insan merkezli ürün sınırlarıyla üretim yapay zeka sistemlerini nasıl tasarlayacağınızı öğrenin.",
    sections: [
      {
        heading: "Model yalnızca bir bileşendir",
        paragraphs: [
          "İkna edici bir prototip tek bir model çağrısı etrafında kurulabilir. Güvenilir bir ürün kurulamaz. Üretim yapay zekası; girdi doğrulama, bağlam birleştirme, politika uygulama, retrieval, üretim, son işleme, kalıcılık, analitik ve kurtarmadan oluşan daha büyük bir sistemin içindedir. Model en görünür bileşen olabilir ama ürün kalitesi hepsi arasındaki sözleşmelerle belirlenir.",
          "Bu mühendislik sorusunu değiştirir. Hangi promptun en etkileyici yanıtı ürettiğini sormak yerine sistemin ne vaat ettiğini, bu vaadin nasıl ölçüldüğünü ve güven düşük olduğunda ne olduğunu sorun. Güçlü bir mimari belirsizliği açık kılar. Üretilmiş çıktıyı güvenilmeyen veri olarak ele alır, biçimini doğrular ve deterministik iş kurallarını model sınırının dışında tutar.",
        ],
      },
      {
        heading: "Sözleşmeyi prompttan önce tasarlayın",
        paragraphs: [
          "Kullanıcı sonucundan başlayın ve geriye doğru çalışın. Özelliğin gerçekten ihtiyaç duyduğu girdileri, arayüzün güvenle render edebileceği çıktı şemasını, gecikme ve maliyet bütçelerini, yasaklı davranışı ve geri dönüş deneyimini tanımlayın. Sınırlı alanlara sahip tipli bir yanıt, koşular arasında anlamı değişen bir düzyazı bloğundan daha kolay test edilir.",
          "Sözleşme ayrıca gerçekleri yorumdan ayırmalıdır. Getirilen hesap verisi, ürün kayıtları veya tıbbi referanslar kaynak bilgisi ister. Üretilmiş öneriler güven ve amaçlarını yansıtan net dil ister. Bu kategoriler karıştığında kullanıcılar yanıtın hangi kısmının dayanaklı olduğunu anlayamaz ve mühendisler bir yanıtın neden başarısız olduğunu teşhis edemez.",
        ],
        points: [
          "Model çıktısını çalışma zamanında doğrulayın",
          "Promptları, şemaları ve değerlendirme veri kümelerini birlikte sürümleyin",
          "Yetkilendirme ve fiyatlandırma kurallarını deterministik tutun",
          "Yararlı bir yapay zeka dışı geri dönüş yolu sağlayın",
        ],
      },
      {
        heading: "Değerlendirme teslimatın parçasıdır",
        paragraphs: [
          "Yapay zeka kalitesi bir birim teste indirgenemez ama bu onu test edilemez yapmaz. Gerçek ürün senaryolarından temsili bir değerlendirme kümesi oluşturun: yaygın istekler, belirsiz girdiler, düşmanca ifadeler, çok dilli durumlar, eksik bağlam ve yüksek riskli uç koşullar. Kullanıcıların önemsediği özellikleri puanlayın: doğruluk, alaka, ton, groundedness ve red davranışı.",
          "Bu paketi model, sistem promptu, retrieval stratejisi veya çıktı şeması değiştiğinde çalıştırın. Otomatik puanlayıcılar geri bildirimi hızlandırabilir; hedefli insan incelemesi puanlayıcıları kalibre eder ve incelikli ürün regresyonlarını yakalar. Amaç sihirli evrensel bir skor değildir. Yerel olarak etkileyici bir değişikliğin daha geniş deneyimi sessizce bozmasını engelleyen tekrarlanabilir bir karar sürecidir.",
        ],
      },
      {
        heading: "Özelliği bir sistem olarak işletın",
        paragraphs: [
          "Gözlemlenebilirlik, gereksiz hassas içerik saklamadan bir isteği tüm hat boyunca izlemelidir. Model ve prompt sürümlerini, retrieval sonuçlarını, şema doğrulamayı, gecikmeyi, token kullanımını, geri dönüş oranlarını, kullanıcı düzeltmelerini ve aşağı akış eylemlerini izleyin. Ürün analitiği özelliğin değerli olup olmadığını; operasyonel telemetri sağlıklı olup olmadığını söyler.",
          "Hız sınırları, circuit breaker'lar, zaman aşımları, önbellekleme ve zarif bozulma ikincil kaygılar değildir. Bir model kesintisinin veya maliyet sıçramasının ürün kesintisine dönüşmesini engelleyen şeylerdir. Olgun yapay zeka mühendisliği belirsizliği gizlemekten çok onu sınırlamaktır.",
        ],
      },
      {
        heading: "Güven bileşik faiz gibi birikir",
        paragraphs: [
          "Kullanıcılar bir ürünün güvene layık olup olmadığını tekrarlanan küçük etkileşimlerle öğrenir. Net sınırlar, öngörülebilir davranış, hızlı kurtarma ve dürüst açıklamalar, ara sıra parlamaktan daha önemlidir. En iyi yapay zeka deneyimi sıkça ölçülü hissettirir: belirsizliğin yararlandığı yerde zekâyı, kesinliğin gerektiği yerde geleneksel yazılımı kullanır.",
          "Bu ölçülülük aynı zamanda rekabet avantajıdır. Modeller hızla değişir; iyi tasarlanmış bir değerlendirme ve operasyon katmanı, ürünün kimliğini her seferinde yeniden inşa etmeden daha iyi modelleri benimsemesini sağlar.",
        ],
      },
    ],
  },

  "staff-level-engineering-without-the-title": {
    title: "Staff Düzeyi Mühendislik Bir Çalışma Biçimidir",
    excerpt:
      "Kıdemli mühendislerin kahramanlıkla değil kararlar, sistemler ve netlikle kaldıraç yaratması.",
    description:
      "Staff düzeyi yazılım mühendisliğine saha rehberi: teknik strateji, ekipler arası etki, karar kalitesi, sistem sahipliği ve sürdürülebilir teslimat.",
    sections: [
      {
        heading: "Gerçek fark kapsamdadır",
        paragraphs: [
          "Staff düzeyi iş sıkça daha az kod yazmak ve daha fazla toplantıya katılmak olarak anlatılır. Bu tarif noktayı kaçırır. Anlamlı değişim kapsamdadır: mühendis sistemler, ekipler ve zaman boyunca yayılan kararların kalitesinden sorumlu hale gelir. Kod önemli kalır ama mimari, iletişim, sıralama, mentorluk ve risk yönetimi arasında bir araçtır.",
          "En güçlü mühendisler derinliği göstermek için karmaşıklık üretmez. Birden fazla ekibin paylaşabileceği en küçük tutarlı modeli bulurlar. Kısıtları görünür kılar, geri alınması pahalı kararları belirler ve geri alınabilir seçimleri hafif tutarlar.",
        ],
      },
      {
        heading: "Bağımlılık değil, kaldıraç yaratın",
        paragraphs: [
          "Kahramanca teslimat değerli görünebilirken organizasyonu kırılganlaştırabilir. Her zorlu taşıma, olay veya mimari karar aynı kişiyi gerektiriyorsa bilgi kaldıraça dönüştürülmemiştir. Staff düzeyi etki geride daha net arayüzler, yararlı belgeler, daha iyi varsayılanlar ve bir sonraki kararı bağımsız verebilen insanlar bırakır.",
          "Bu, asfalt yollara yatırım demektir: paylaşılan gözlemlenebilirlik, dağıtım kalıpları, API gelenekleri, test stratejileri ve doğru yolu rastlantısal olandan daha kolay kılan örnekler. Bir platform veya soyutlama, tekrarlanan bilişsel yükü kaldırırken temel davranışı gizlemediğinde değerlidir.",
        ],
        points: [
          "Kararları gelecekteki okuyucular için yazın",
          "Bir platformun varlığını değil, benimsenmesini ölçün",
          "Standartların ardındaki muhakemeyi öğretin",
          "Maliyetini artık hak etmeyen soyutlamaları silin",
        ],
      },
      {
        heading: "Teknik strateji sıralamadır",
        paragraphs: [
          "Strateji nihai mimarinin diyagramı değildir. Riski azaltırken değer teslim eden sıralı bir hamleler kümesidir. İyi strateji mevcut kısıtları, hedef yetenekleri ve organizasyonun güvenle işletebileceği ara durumları adlandırır. Personeli, ürün taahhütlerini ve taşıma maliyetini uygulama ayrıntısı gibi değil, kabul ederek ele alır.",
          "En iyi plan genellikle kanıtın yönü değiştirebileceği kontrol noktaları içerir. Bu, stratejiyi belirsiz yapmadan sağlam kılar. Ekipler ne için optimize ettiklerini, neyin kararlı kalması gerektiğini ve hangi varsayımların önce test edilmesi gerektiğini bilir.",
        ],
      },
      {
        heading: "Etki anlayışla başlar",
        paragraphs: [
          "Ekipler arası liderlik mimari tartışmaları kazanmak değildir. Kararı benimsemesi gereken insanların teşviklerini ve kısıtlarını anlamakla başlar. Ürün ekipleri hızı, operasyon teşhis edilebilirliği, güvenlik kontrolü, finans birim ekonomisini önemseyebilir. Kalıcı bir öneri bunları reddetmek yerine bu gerçekleri içerir.",
          "Güçlü teknik yazı burada bir kuvvet çarpanıdır. Bağlam, seçenekler, ödünleşimler, bir öneri ve açık bir karar tarihi olan özlü bir belge anlaşmazlık için paylaşılan bir yüzey yaratır. Sessiz uzmanların katkı vermesini sağlar ve en yüksek sesli toplantının mimari olmasını engeller.",
        ],
      },
      {
        heading: "Sistemi daha sakin bırakın",
        paragraphs: [
          "Staff düzeyi mühendislik geride bırakılan durumda görünür: daha az bilinmeyen başarısızlık biçimi, daha net sahiplik, daha kısa geri bildirim döngüleri ve daha fazla güvenle hareket edebilen ekipler. İş her zaman dramatik değildir. Sıkça belirsizlik olaylara ve yeniden yazımlara dönüşmeden önce belirsizliği istikrarlı biçimde kaldırmaktır.",
          "Unvanlar organizasyonlar arasında değişir. Pratik tutarlıdır: mühendislik kararlarının kalitesini ve erişimini iyileştirirken başkalarının en iyi işlerini yapmasına yardım etmek.",
        ],
      },
    ],
  },

  "cross-platform-mobile-architecture-that-scales": {
    title: "Ölçeklenen Çapraz Platform Mobil Mimari",
    excerpt:
      "Yerel kaliteden ödün vermeden paylaşılan ürün mantığına pragmatik bir yaklaşım.",
    description:
      "Durum sınırları, yerel yetenekler, çevrimdışı davranış, test ve yayınlar dahil çapraz platform uygulamalar için ölçeklenebilir React Native ve Expo mimarisini keşfedin.",
    sections: [
      {
        heading: "Her uygulama ayrıntısını değil, niyeti paylaşın",
        paragraphs: [
          "Çapraz platform geliştirme, ekipler ürün davranışını ve alan kurallarını paylaşırken platforma özgü etkileşime alan bıraktığında başarılı olur. Tek bir kod tabanı her satırın aynı olduğu için değerli değildir. Önemli kavramların—kimlik, izinler, fiyatlandırma, senkronizasyon, analitik ve iş iş akışları—tek doğruluk kaynağına sahip olduğu için değerlidir.",
          "Görsel veya yerel davranışı hiçbir platforma uymayan bir soyutlamadan zorlamak başka bir çoğaltma türü yaratır: geçici çözümler. Paylaşılan sınırları bilinçli tutun. Navigasyon niyeti, veri sözleşmeleri, doğrulama ve durum geçişleri genellikle ortak koda aittir. Widget'lar, arka plan yürütme, satın almalar, bildirimler ve erişilebilirlik ayrıntıları yerel farkındalıklı adaptörler gerektirebilir.",
        ],
      },
      {
        heading: "Durumu sorumluluğa göre bölün",
        paragraphs: [
          "Tüm durum tek bir küresel store'a konulduğunda mobil uygulamalar hakkında akıl yürütmek zorlaşır. Sunucu durumunun önbellekleme, tazelik, yeniden deneme ve geçersiz kılma semantiği vardır. Yerel ürün durumunun etkileşim ve kalıcılık semantiği vardır. Geçici görünüm durumu bileşene yakın aittir. Bunları ayrı kategoriler olarak ele almak rastlantısal bağlaşımı azaltır.",
          "Bir sorgu katmanı uzak kaynakları ve mutasyonları sahiplenmelidir. Odaklı bir istemci store'u onboarding veya taslak kayıt gibi kalıcı yerel iş akışlarını koordine edebilir. Güvenli kimlik bilgileri platform korumalı depolamada olmalıdır. Bu model çevrimdışı davranışı açık kılar çünkü ekip hangi kaynakların bayat, kuyrukta veya kullanılamaz olabileceğine karar verebilir.",
        ],
        points: [
          "Ağ durumunu ürün durumu olarak modelleyin",
          "Yalnızca net bir geri yükleme amacı olan veriyi kalıcılaştırın",
          "İyimser güncellemeleri geri alınabilir yapın",
          "Kimlik doğrulama yenilemeyi ekranların dışında tutun",
        ],
      },
      {
        heading: "Yerel yetenek bir sınırdır",
        paragraphs: [
          "Mikrofonlar, kameralar, anlık bildirimler, abonelikler, sağlık verisi ve arka plan görevleri sıradan kütüphaneler değildir. İzin, gizlilik, yaşam döngüsü ve mağaza politikası sınırlarını aşarlar. Her yeteneği küçük, alana dönük bir arayüzle sarın ve platform ayrıntılarını arkasına koyun. Bu, yerel katmanın yokmuş gibi davranmadan simülatörleri ve testleri yararlı kılar.",
          "İzin istekleri uygulama başlangıcında değil, anlaşılır kullanıcı niyetiyle tetiklenmelidir. Başarısızlık yolları birinci sınıf tasarımı hak eder: reddedilen izinler, kesilen kayıtlar, geri yüklenen satın almalar, süresi dolmuş bildirim token'ları ve işletim sistemi kısıtları olağan durumlardır, istisnai hatalar değil.",
        ],
      },
      {
        heading: "Performans mimari bir özelliktir",
        paragraphs: [
          "Akıcı bir arayüz veri akışıyla başlar. İlgisiz durum için büyük ağaçları yeniden render etmekten kaçının, uzun koleksiyonları sanallaştırın, medyayı aktarımdan önce yeniden boyutlandırın ve ağır ses veya görüntü işini JavaScript iş parçacığından uzaklaştırın. Başlangıç, navigasyon ve etkileşim gecikmesini geliştirme simülatörüne güvenmek yerine temsili cihazlarda ölçün.",
          "Algılanan performans da önemlidir. Navigasyon sürekliliğini koruyun, kararlı iskeletler gösterin ve güvenle uzlaştırılabildiğinde iyimser eylemleri anlık hissettirin. En hızlı istek sıkça arayüzün beklemesi gerekmeyen istektir.",
        ],
      },
      {
        heading: "Yayın mühendisliği uygulamanın parçasıdır",
        paragraphs: [
          "Ölçeklenebilir bir mobil mimari imzalı derlemeler, ortam ayrımı, kademeli yayın, çökme raporlama, over-the-air güncelleme politikası ve mağaza metadata'sını içerir. Her yayın kod, yapılandırma, backend uyumluluğu ve özellik bayraklarına izlenebilir olmalıdır. Mobil istemciler bir backend deploy'undan çok sonra vahşi doğada kalır; bu yüzden API'ler sürüm örtüşmesine tolerans göstermelidir.",
          "Sonuç maksimum kod paylaşımı değildir. iOS ve Android'de tutarlı davranan, yerel yetenekleri sorumlu kullanan ve ekip ile özellik seti büyüdükçe işletilebilir kalan bir üründür.",
        ],
      },
    ],
  },

  "designing-resilient-full-stack-systems": {
    title: "Dayanıklı Full-Stack Sistemler Tasarlamak",
    excerpt:
      "Güvenilirlik, altyapı bozulmadan çok önce ürün sınırlarında başlar.",
    description:
      "Açık sözleşmeler, idempotency, gözlemlenebilirlik, zarif bozulma ve kurtarma öncelikli tasarımla dayanıklı full-stack mimariye pratik bir rehber.",
    sections: [
      {
        heading: "Güvenilirlik uçtan ucadır",
        paragraphs: [
          "Sağlıklı bir veritabanı güvenilir bir ürünü garanti etmez. Kullanıcılar cihaz durumu, ağ koşulları, kenar altyapısı, uygulama kodu, kuyruklar, üçüncü taraf hizmetler ve insan operasyonlarını içeren bir zinciri deneyimler. Dayanıklılık bu zinciri anlamaktan ve başarısızlıkların nerede emileceğini seçmekten gelir.",
          "Kritik kullanıcı yolculuklarıyla başlayın. Neyin senkron başarılı olması gerektiğini, neyin gecikebileceğini, neyin yeniden denenebileceğini ve neyin asla iki kez olmaması gerektiğini belirleyin. Bu, her uç noktaya genel erişilebilirlik kalıpları uygulamaktan daha yararlı bir mimari üretir.",
        ],
      },
      {
        heading: "Sözleşmeler yayılan belirsizliği önler",
        paragraphs: [
          "Tipli API'ler yardımcı olur ama dayanıklı bir sözleşme ayrıca zaman aşımlarını, hata kategorilerini, idempotency'yi, sayfalamayı, sürüm uyumluluğunu ve yetkilendirme davranışını tanımlar. İstemciler bir doğrulama sorununu geçici bir bağımlılık başarısızlığından ve bir izin reddinden ayırt edebilmelidir.",
          "Idempotency anahtarları ödemeler, siparişler, mesajlar ve bir istemcinin yeniden deneyebileceği her mutasyon için zorunludur. Bir istek zaman aşımı istemciye sunucunun işlemi tamamlayıp tamamlamadığını söylemez. Kararlı bir anahtar ve sorgulanabilir işlem durumu olmadan yeniden denemeler veri bozulmasına dönüşür.",
        ],
        points: [
          "Kararlı, makine tarafından okunabilir hata kodları kullanın",
          "Mutasyon sonuçlarını sorgulanabilir yapın",
          "Her ağ çağrısını bir zaman aşımıyla sınırlayın",
          "Mobil istemciler için geriye dönük uyumluluk tasarlayın",
        ],
      },
      {
        heading: "Yetenek bazında bozun",
        paragraphs: [
          "Zarif bozulma ürünün yararlı çekirdeğini korumalıdır. Öneriler başarısız olursa arama hâlâ çalışabilir. Gerçek zamanlı güncellemeler koparsa zaman damgalı bir anlık görüntü okunabilir kalabilir. Medya işleme gecikirse yükleme kabul edilip asenkron tamamlanabilir.",
          "Özellik sınırları bunu mümkün kılar. Bir bağımlılık her rota ve render yoluna gömüldüğünde kesintisi evrensel olur. İsteğe bağlı yetenekleri net arayüzlerin arkasına izole edin, güvenli sonuçları önbelleğe alın ve arayüzün bayat veriyi güncel gibi sessizce sunmak yerine tazeliği iletmesini sağlayın.",
        ],
      },
      {
        heading: "Yalnızca makineleri değil, kararları gözlemleyin",
        paragraphs: [
          "Altyapı metrikleri kaynak baskısını ortaya koyar. Ürün düzeyi telemetri bozuk sonuçları ortaya koyar. Bir kullanıcı işlemini korelasyon tanımlayıcılarıyla istemci, API, kuyruk ve işçi boyunca izleyin. Sipariş kabul edildi, ödeme yetkilendirildi, varlık işlendi ve bildirim iletildi gibi anlamlı geçişleri kaydedin.",
          "Loglar yapılandırılmış, gizlilik farkındalıklı ve bir operasyonel soruya bağlı olmalıdır. Paneller yolculuklara bağlı hizmet düzeyi göstergelerine ihtiyaç duyar; alarmlar eylem gerektiren koşulları belirlemelidir. Sık ateşlenen ve hiçbir kararı değiştirmeyen bir alarm, tüm müdahale sistemini zayıflatan gürültüdür.",
        ],
      },
      {
        heading: "Kurtarmayı pratik edin",
        paragraphs: [
          "Yedekler, geri yükleme test edilene kadar niyetlerdir. Kuyruklar, zehirli mesajlar ilerlemeyi engelleyene kadar dayanıklıdır. Runbook'lar, müdahalecilerin sahip olmadığı erişim veya bilgiyi varsayana kadar yararlıdır. Düzenli kurtarma egzersizleri bu boşlukları sistem sakinken ortaya çıkarır.",
          "Dayanıklılık nihayetinde başarısızlığı şaşırtıcı olmaktan çıkarma yeteneğidir. Ekipler her olayı kaldıramaz ama hem kullanıcıları hem mühendisleri koruyan sınırlı başarısızlıklar, görünür durum, güvenli yeniden denemeler ve pratik edilmiş kurtarma yolları yaratabilir.",
        ],
      },
    ],
  },

  "practical-software-observability-for-product-teams": {
    title: "Ürün Ekipleri için Pratik Gözlemlenebilirlik",
    excerpt:
      "Başka bir panel duvarı üretmek yerine kararları kısaltan telemetri kurun.",
    description:
      "İzlemeler, loglar, metrikler, frontend telemetrisi, SLO'lar, gizlilik ve olay öğrenimini kapsayan ürün merkezli bir gözlemlenebilirlik stratejisi öğrenin.",
    sections: [
      {
        heading: "Sorularla başlayın",
        paragraphs: [
          "Gözlemlenebilirlik, sistemin yaydığı kanıtı kullanarak tanıdık olmayan sistem davranışını açıklama yeteneğidir. Mevcut her metriği toplamak bu yeteneği garanti etmez. İnsanların yanıtlaması gereken sorularla başlayın: Kullanıcılar ödeme tamamlıyor mu? Hangi yayın başlangıç süresini artırdı? Bu istek nerede bekliyor? Kaç işlem yeniden deneniyor?",
          "Bu sorular telemetriyi kararlara bağlar. Ayrıca kimsenin yorumlayamayacağı pahalı enstrümantasyonu da önler. Tanımları ekipler arasında değişen büyük bir panelden daha değerli olan, güvenilir sinyallerden oluşan kompakt bir kümedir.",
        ],
      },
      {
        heading: "Tarayıcıyı backend'e bağlayın",
        paragraphs: [
          "Ürün başarısızlıkları sıkça istemcide başlar ve API sınırında kaybolur. Bir korelasyon tanımlayıcısını tarayıcı veya mobil uygulamadan gateway, hizmetler, kuyruklar ve işçiler boyunca taşıyın. Bir izlemeyi onu üreten deneyime bağlamak için yayın sürümü, rota, işlem ve güvenli hesap bağlamı ekleyin.",
          "Frontend telemetrisi gerçek kullanıcı performansını, navigasyon hatalarını, başarısız kaynakları ve önemli etkileşim zamanlamalarını içermelidir. Ayırımsız oturum yakalamadan kaçının. Gizlilik farkındalıklı enstrümantasyon davranışı teşhis etmek için gereken minimum bağlamı toplar ve hassas veri gelmeden önce saklama ile erişim kurallarını belirler.",
        ],
        points: [
          "Tutarlı işlem adları kullanın",
          "Her sinyale deploy sürümlerini ekleyin",
          "Toplama anında redakte edin",
          "Rutin trafiği örnekleyin, hataları saklayın",
        ],
      },
      {
        heading: "Hizmeti sonuçlar etrafında tanımlayın",
        paragraphs: [
          "Bir hizmet düzeyi göstergesi kullanıcıların algılayabileceği bir şeyi temsil etmelidir: başarılı istek oranı, işleme tamamlama, tazelik veya etkileşim gecikmesi. Bir hizmet düzeyi hedefi paylaşılan bir güvenilirlik hedefi ve teslimat kararları için bir hata bütçesi yaratır.",
          "Ortalamalar dikkat gerektiren deneyimleri gizler. Gecikme için yüzdelikler kullanın ve kritik sinyalleri platform, bölge, yayın ve yolculuğa göre segmentleyin. Segmentasyon sınırlı kalmalıdır; kontrolsüz etiketler maliyet yaratır ve sorguları güvenilmez kılar.",
        ],
      },
      {
        heading: "Eylem için alarm kurun",
        paragraphs: [
          "Bir alarm anlamlı bir hedef tehdidini işaret etmeli ve beklenen bir müdahalesi olmalıdır. Düşük aciliyetli anomalileri birini uyandırmak yerine incelemeye yönlendirin. Bildirime ilgili panelleri, son deploy'ları, sahipliği ve kısa bir teşhis yolu ekleyin.",
          "Bir olaydan sonra müdahaleyi şekillendiren sistemi iyileştirin. Eksik bağlam ekleyin, gürültülü alarmları kaldırın, güvenli bir kurtarma adımını otomatikleştirin veya sahipliği netleştirin. En iyi olay sonrası iş hem tekrarlama ihtimalini hem bir sonraki olayın bilişsel yükünü azaltır.",
        ],
      },
      {
        heading: "Telemetriyi bir ürün olarak ele alın",
        paragraphs: [
          "Enstrümantasyonun kullanıcıları, arayüzleri, kalite sorunları ve bakım maliyeti vardır. Önemli olaylara sahipler ve tanımlar verin. Kritik izlemelerin yayınları atlattığını test edin. Mimari değiştiğinde panelleri gözden geçirin. Artık bir kararı desteklemeyen sinyalleri silin.",
          "Gözlemlenebilirlik mühendislik davranışını değiştirdiğinde değerli olur: deneyler daha güvenli, regresyonlar daha erken bulunur, olaylar daha kısa sürer ve ödünleşimler sezgi yerine kanıtla yapılır.",
        ],
      },
    ],
  },

  "ai-assisted-development-with-engineering-judgment": {
    title: "Yapay Zeka Destekli Geliştirme Hâlâ Yargı Gerektirir",
    excerpt:
      "Mühendislik sorumluluğunu dış kaynaklamadan kodlama ajanlarını kullanmak için disiplinli bir iş akışı.",
    description:
      "Yapay zeka kodlama araçlarını kapsamlı görevler, depo bağlamı, doğrulama, güvenlik incelemesi ve mimari kararların insan sahipliğiyle etkili kullanın.",
    sections: [
      {
        heading: "Hızlanma darboğazı değiştirir",
        paragraphs: [
          "Yapay zeka uygulama seçenekleri, testler, taşımalar, belgeler ve araştırmaları dikkate değer hızda üretebilir. Bu hız darboğazı yazmaktan yargıya taşır. Mühendisler sorunu tanımlamalı, kısıtları seçmeli, makul hataları tanımalı ve sonucun onu sahiplenecek sisteme uyup uymadığına karar vermelidir.",
          "Üretilmiş bir değişiklik sözdizimsel olarak doğru ve mimari olarak yanlış olabilir. Mevcut bir soyutlamayı çoğaltabilir, yetkilendirmeyi baypas edebilir, dağıtım kısıtlarını yok sayabilir veya yerel bir işlevi optimize ederken ürün sınırını zayıflatabilir. Depo anlayışı kod üretimi ile mühendislik arasındaki farktır.",
        ],
      },
      {
        heading: "Ajana sınırlı bir sonuç verin",
        paragraphs: [
          "Güçlü görevler kullanıcıya görünür sonucu, ilgili dosya veya modülleri, doğru kalması gereken değişmezleri ve başarının nasıl doğrulanacağını anlatır. Her satırı dikte etmekten kaçınırken ajanın ilgisiz refaktörlere genişlemesini de engellerler.",
          "Düzenlemeden önce yerel gelenekleri, çerçeve belgelerini ve mevcut bağımlılık sürümlerini inceleyin. Yapay zeka sistemleri tarihsel kalıplar üzerinde eğitilir; hızlı hareket eden çerçeveler tanıdık API'leri sıkça geçersiz kılar. İşi gerçek depoya dayandırmak tören değil, doğruluğun parçasıdır.",
        ],
        points: [
          "Taviz verilemez davranışı belirtin",
          "Önemli testleri ve ortamları adlandırın",
          "İlgisiz kullanıcı değişikliklerini koruyun",
          "Geri alınması pahalı bir karar olduğunda alternatifler isteyin",
        ],
      },
      {
        heading: "Diff'i bir tasarım olarak inceleyin",
        paragraphs: [
          "Üretilmiş işi birden fazla düzeyde inceleyin. Kullanıcı akışı mantıklı mı? Sınırlar ve veri sahipliği net mi? Başarısızlık durumları ele alınmış mı? Kod deponun dilinde okunabilir mi? Ardından güvenlik, erişilebilirlik, performans ve operasyonel davranışı inceleyin.",
          "Büyük üretilmiş diff'ler inceleme kalitesini düşürür. Aralarında doğrulama olan küçük tutarlı artışları tercih edin. Değişiklik mekanikse otomasyon geniş olabilir; mimari yargı içerdiğinde yüzeyi bir insanın gerçekten anlayabileceği kadar kompakt tutun.",
        ],
      },
      {
        heading: "Doğrulama isteğe bağlı değildir",
        paragraphs: [
          "Statik analiz, tip kontrolleri, testler ve üretim derlemelerini çalıştırın. Arayüz işi için ilgili kırılma noktalarında ve etkileşim durumlarında gerçek tarayıcı davranışını inceleyin. Taşımalar için hem ileri yürütmeyi hem kurtarmayı test edin. API'ler için yalnızca mutlu yolu değil, yetkilendirme ve bozuk girdileri doğrulayın.",
          "Yapay zeka bu doğrulamayı tasarlamaya yardım edebilir ama sorumluluğu ortadan kaldıramaz. Test paketi zayıfsa üretilmiş güven de zayıftır. Değiştirilen davranışı koruyan en küçük yüksek değerli testi ekleyin.",
        ],
      },
      {
        heading: "Sahipliği insan tutun",
        paragraphs: [
          "Kodlama ajanları, mühendis niyet ve sonuçlardan sorumlu kaldığında güçlü işbirlikçilerdir. Önemli kararları kaydedin, üretilmiş bağımlılıkları açıklayın ve sırları veya hassas üretim verisini onaylı bir sınır olmadan araçlara göndermekten kaçının.",
          "Kalıcı avantaj daha fazla kod üretmek değildir. İyi çerçevelenmiş bir sorundan doğrulanmış bir sonuca giden yolu kısaltırken sistem tutarlılığını korumaktır.",
        ],
      },
    ],
  },

  "api-design-for-evolving-products": {
    title: "Sürekli Evrilen Ürünler için API Tasarımı",
    excerpt:
      "Her yayını koordineli bir taşıma haline getirmeden değişimi destekleyen arayüzler kurun.",
    description:
      "Evrilebilir API'leri kaynak modelleri, uyumluluk, idempotency, sayfalama, yetkilendirme ve tüketici odaklı sözleşmelerle tasarlayın.",
    sections: [
      {
        heading: "Ekranı değil, alanı modelleyin",
        paragraphs: [
          "Arayüzler arkalarındaki kavramlardan daha hızlı değişir. Belirli bir ekran etrafında kurulan bir API sunum durumunu açığa çıkarma ve yeni istemciler geldikçe yinelenen uç noktaları zorlama eğilimindedir. Kararlı alan kaynaklarıyla, yaşam döngüleriyle ve işin tanıdığı işlemlerle başlayın.",
          "Bu teorik saflık gerektirmez. Ürün yüzlü bir API bir yolculuk için veri toplayabilir ama toplamanın net bir amacı ve sahipliği olmalıdır. Veritabanı tablolarını doğrudan sızdırmaktan kaçının; depolama yapısı sonunda değişmesi gereken bir uygulama ayrıntısıdır.",
        ],
      },
      {
        heading: "Uyumluluk bir özelliktir",
        paragraphs: [
          "Tüketiciler özellikle mobil uygulamalar ve dış entegrasyonlar farklı takvimlerde deploy eder. Ekleme değişiklikleri genellikle daha güvenlidir: yeni isteğe bağlı alanlar, yeni kaynaklar ve hoşgörülü okuyucularla yeni enum değerleri. Mevcut davranışı kaldırmak veya yeniden tanımlamak taşıma planı, telemetri ve yayımlanmış bir bitiş tarihi ister.",
          "Sürümleme semantikler gerçekten ayrıldığında yararlıdır ama sürüm numaraları uyumluluk disiplinini değiştirmez. Sürümlü bir API yine de değişen sıralama, hata davranışı, limitler veya yetkilendirme yoluyla tüketicileri şaşırtabilir. Makine tarafından okunabilir bir şema tutun ve temsili tüketicileri ona karşı test edin.",
        ],
        points: [
          "Bilinmeyen enum değerlerini güvenli ele alın",
          "Nullability ve varsayılanları belgelendirin",
          "Kritik tüketiciler için sözleşme testleri kullanın",
          "Kaldırmadan önce kullanımdan kaldırılmış alan kullanımını ölçün",
        ],
      },
      {
        heading: "Mutasyonlar kimlik ister",
        paragraphs: [
          "Güvenilmez ağlarda yeniden denemeler kaçınılmazdır. Önemli mutasyonlar için çağıran ve işleme kapsamlı bir idempotency anahtarı kabul edin. Sonucu saklayın ki tekrarlanan bir istek eylemi yeniden gerçekleştirmek yerine orijinal sonucu döndürsün.",
          "Uzun süren iş açık durumlara sahip bir işlem kaynağı döndürmelidir. İstemciler kırılgan bir isteği açık tutmadan yoklayabilir veya abone olabilir. Bu desteği de iyileştirir: sistem işin kuyrukta, aktif, tamamlanmış veya başarısız olup olmadığını ve nedenini açıklayabilir.",
        ],
      },
      {
        heading: "Yetkilendirme sözleşmeye aittir",
        paragraphs: [
          "Kimlik doğrulama kimliği kurar; yetkilendirme o kimliğin bir kaynak üzerinde işlem yapıp yapamayacağına karar verir. Bunu sunucuda en dar anlamlı sınırda uygulayın. İstemcide bir düğmeyi gizlemek arayüz davranışıdır, erişim kontrolü değil.",
          "Çok kiracılı sistemler istemci tarafından serbestçe sağlanıp güvenilmeyecek bir kiracı bağlamı ister. Kapsamı doğrulanmış üyelikten türetin, her kaynak erişiminde sahipliği doğrulayın ve idari eylemleri denetim ile soruşturma için yeterli bağlamla kaydedin.",
        ],
      },
      {
        heading: "Tüketici anlayışı için optimize edin",
        paragraphs: [
          "Tutarlı adlandırma, öngörülebilir sayfalama, yararlı hatalar, örnekler ve net bir değişiklik günlüğü entegrasyon süresini zekice protokol seçimlerinden daha fazla kısaltır. Bir API, tüketiciler iç tarihini öğrenmeden doğru kullanabildiğinde başarılıdır.",
          "Tasarım incelemeleri istemci mühendislerini ve operasyonel senaryoları içermelidir. Arayüz ilk uygulamadan daha uzun yaşar; bu yüzden değiştirmesi en zor kısımlara hassasiyet harcayın: tanımlayıcılar, semantikler, yetkilendirme ve yaşam döngüsü.",
        ],
      },
    ],
  },

  "zero-downtime-database-migrations": {
    title: "Pratikte Sıfır Kesintili Veritabanı Taşımaları",
    excerpt:
      "Şemaları gerçek trafik altında güvenle değiştirmek için expand-and-contract teslimatını kullanın.",
    description:
      "Expand-and-contract değişiklikleri, backfill'ler, çift okumalar, gözlemlenebilirlik ve geri alma planlamasıyla sıfır kesintili veritabanı taşımalarına pratik bir rehber.",
    sections: [
      {
        heading: "Deploy'lar örtüşür",
        paragraphs: [
          "Bir şema taşıması nadiren yalnız çalışır. Eski ve yeni uygulama örnekleri aynı anda trafik sunabilir, işçiler gecikmiş işleri işleyebilir ve mobil istemciler aylarca aktif kalabilir. Güvenli bir taşıma bu örtüşmeyi varsayar ve her ara durumu uyumlu tutar.",
          "Expand-and-contract kalıbı riskli bir değiştirmeyi geri alınabilir aşamalara ayırır. Önce şemayı veya arayüzü genişletin, sonra davranışı ve veriyi taşıyın, sonucu gözlemleyin ve ancak daha sonra eski yolu kaldırın. Ek adımlar önemli anda kontrol satın alır.",
        ],
      },
      {
        heading: "Anlamı değiştirmeden genişletin",
        paragraphs: [
          "Yeni nullable sütunları, tabloları, indeksleri veya uç noktaları mevcut kodun yok sayabileceği şekilde ekleyin. Veritabanı davranışını anlamadan kilit altında büyük bir tabloyu yeniden yazan varsayılanlar veya kısıtlardan kaçının. Motor desteklediğinde büyük indeksleri eşzamanlı oluşturun ve çoğaltma gecikmesi ile kilit süresini izleyin.",
          "Her iki temsili yazabilen veya yeni oluşturulan veri için yeni modeli doldurabilen kodu deploy edin. Çift yazmalar tutarlılık riski getirir; bu yüzden geçişi sınırlı tutun, sapmayı enstrümante edin ve her iki kayıt aynı veritabanını paylaştığında tek bir işlemi tercih edin.",
        ],
        points: [
          "Önce tablo boyutunu ve kilit davranışını ölçün",
          "Taşıma komutlarını yeniden başlatılabilir yapın",
          "Üretim yükü altında backfill'leri kısıtlayın",
          "İlerlemeyi kararlı kontrol noktalarıyla kaydedin",
        ],
      },
      {
        heading: "Backfill'i bir operasyon olarak ele alın",
        paragraphs: [
          "Bir üretim backfill'i tek seferlik bir script değil, bir iş yüküdür. Deterministik yığınlar işleyin, kontrol noktalarını kalıcılaştırın, eşzamanlılığı sınırlayın ve ilerleme ile başarısızlıkları görünür kılın. İş etkileri çoğaltmadan durdurulup sürdürülebilir olmalıdır.",
          "Yeni temsili sürekli doğrulayın. Sona kadar beklemek yerine sayıları, sağlama toplamlarını, değişmezleri ve örneklenmiş kayıtları karşılaştırın. Taşıma anlamı dönüştürüyorsa beklenen eşlemeyi alan sahiplerince incelenen çalıştırılabilir kontrollerde kodlayın.",
        ],
      },
      {
        heading: "Okumaları bilinçli kaydırın",
        paragraphs: [
          "Yeni yazmalar ve tarihsel veri hazır olduğunda okumaları bir özellik bayrağı veya kontrollü yayın arkasına kaydırın. Gölge okumalar kullanıcı yanıtını değiştirmeden eski ve yeni sonuçları karşılaştırabilir. Hataları ve gecikmeyi yola göre segmentleyin ki ilerleme kararı kanıta dayansın.",
          "Bu aşamada geri alma genellikle şemayı tersine çevirmek değil, okumaları geri anahtarlamak anlamına gelmelidir. Yıkıcı geri alma script'leri kurtarılabilir bir deploy'u çok daha kötü hale getirebilir. Güven yüksek olana kadar genişletilmiş durumu koruyun.",
        ],
      },
      {
        heading: "Yalnızca kanıttan sonra daraltın",
        paragraphs: [
          "Eski temsili yazmayı bırakın, örtüşen uygulama sürümlerinin ve kuyruklanmış işin temizlenmesini bekleyin, sonra kullanılmayan kodu kaldırın. Telemetriyle eski alanın veya tablonun artık okunmadığını doğrulayın; ardından ayrı bir deploy'da düşürün.",
          "Sıfır kesinti riskin yokluğu değildir. Riski gözlemlenebilir kılan, etki yarıçapını sınırlayan ve her aşamada güvenli bir karar koruyan bir teslimat biçimidir.",
        ],
      },
    ],
  },

  "building-accessible-interfaces-by-default": {
    title: "Varsayılan Olarak Erişilebilir Arayüzler Kurmak",
    excerpt:
      "Erişilebilirlik, semantik ve etkileşim mimari varsayılanlar olduğunda sürdürülebilir hale gelir.",
    description:
      "Anlamsal yapı, klavye davranışı, odak yönetimi, kontrast, azaltılmış hareket ve otomatik artı manuel testle erişilebilir web ve mobil arayüzler kurun.",
    sections: [
      {
        heading: "Erişilebilirlik ürün kalitesidir",
        paragraphs: [
          "Erişilebilirlik sıkça son bir uyumluluk geçişi olarak ele alınır. O zamana kadar temel seçimler—bileşen semantiği, odak sırası, renk sistemleri, navigasyon yapısı ve hareket—onarımı pahalıdır. Erişilebilirliği doğru varsayılanın her yerde yeniden kullanılabileceği tasarım ve bileşen geliştirme sırasında bir kısıt olarak ele alın.",
          "Amaç ayrı bir basitleştirilmiş deneyim değildir. Bilgi ve eylemlerin farklı girdi yöntemleri, görme, işitme, biliş, dil ve cihaz koşulları boyunca kullanılabilir kaldığı bir arayüzdür. Bu iyileştirmeler sıkça her kullanıcıya, özellikle stres altında veya kusurlu ortamlarda yarar sağlar.",
        ],
      },
      {
        heading: "Yerel semantikle başlayın",
        paragraphs: [
          "Yapı için başlıklar, eylemler için düğmeler, navigasyon için bağlantılar, kontroller için etiketler ve ilgili öğeler için listeler kullanın. Yerel öğeler, özel kapsayıcıların aksi halde yeniden yaratması gereken klavye davranışı, erişilebilirlik rolleri ve platform beklentilerini getirir.",
          "ARIA ilişkileri ve dinamik durumu netleştirebilir ama alttaki davranışı yanlış olan bir etkileşimi onaramaz. Öngörülebilir bir sekme sırası kurun, görünür odağı koruyun ve her işaretçi etkileşiminin bir klavye eşdeğeri olsun. Mobilde anlamlı erişilebilirlik etiketleri sağlayın ve içeriği duyurulması gerektiği şekilde gruplayın.",
        ],
        points: [
          "Mantıksal bir başlık hiyerarşisini koruyun",
          "Yalnızca ikonlu kontrollere erişilebilir bir ad verin",
          "Anlamı yalnızca renkle kodlamayın",
          "Dokunma hedeflerini rahat boyutlarda tutun",
        ],
      },
      {
        heading: "Değişim sırasında odağı yönetin",
        paragraphs: [
          "Tek sayfa navigasyonu, diyaloglar, çekmeceler ve animasyonlu geçişler arayüzü tam belge yüklemesi olmadan değiştirir. Klavye ve ekran okuyucu kullanıcılarının yeni bağlamın nerede başladığını anlaması için odağı bilinçli taşıyın. Geçici bir yüzey kapandığında odağı tetikleyen kontrole geri yükleyin.",
          "Gerçek bir modal etkileşim dışında odağı tuzağa düşürmekten kaçının. Önemli asenkron sonuçları ölçülü live region'larla duyurun ve yardımcı teknolojiyi rutin görsel güncellemelerle boğmayın. Duyuru neyin değiştiğini ve kullanıcının hareket etmesi gerekip gerekmediğini yanıtlamalıdır.",
        ],
      },
      {
        heading: "Görsel ve hareket tercihlerine saygı gösterin",
        paragraphs: [
          "Metin ve etkileşimli kontroller yer tutucular, devre dışı kontroller, kenarlıklar ve hover göstergeleri dahil her tema ve durumda yeterli kontrasta ihtiyaç duyar. Eylemleri kırpmadan veya gizlemeden yakınlaştırmayı ve metin yeniden boyutlandırmayı destekleyin. Duyarlı tasarım sabit etiketler varsaymak yerine içeriğe uyum sağlamalıdır.",
          "Hareket sürekliliği iletebilir ama rahatsızlık da yaratabilir. Azaltılmış hareket tercihlerine saygı gösterin ve yönelimi koruyan daha basit bir geçiş sağlayın. Kritik bilgiyi asla yalnızca bir animasyon veya hover durumunda kullanılabilir kılmayın.",
        ],
      },
      {
        heading: "İnsanlarla ve araçlarla test edin",
        paragraphs: [
          "Otomatik kontroller eksik adları, geçersiz ilişkileri ve birçok kontrast sorununu yakalar; bu yüzden sürekli entegrasyonda değerlidirler. Odak hareketinin anlaşılır olup olmadığını, ekran okuyucu ifadesinin yararlı olup olmadığını veya bir iş akışının bilişsel olarak yorucu olup olmadığını yargılayamazlar.",
          "Anahtar yolculuklarda düzenli olarak yalnızca klavye, bir ekran okuyucu, yakınlaştırma ve yüksek kontrast ayarlarıyla gezin. Araştırmaya ve teste engelli kullanıcıları dahil edin. Erişilebilirlik, bulgular yalnızca sorunun keşfedildiği sayfayı değil paylaşılan bileşenleri ve tasarım kurallarını iyileştirdiğinde olgunlaşır.",
        ],
      },
    ],
  },

  "from-prototype-to-production-software": {
    title: "Prototipten Üretim Yazılımına",
    excerpt:
      "Umut vadeden bir demoyu insanların güvenebileceği bir ürüne dönüştüren mühendislik işi.",
    description:
      "Ürün sınırları, operasyonel gereksinimler, güvenlik, teslimat iş akışları ve ölçülebilir hazırlığı tanımlayarak yazılımı prototipten üretime taşıyın.",
    sections: [
      {
        heading: "Bir prototip farklı bir soruyu yanıtlar",
        paragraphs: [
          "Bir prototip bir fikrin işe yarayıp yaramayacağını ve deneyimin peşinden gitmeye değip değmeyeceğini sorar. Üretim yazılımı fikrin gerçek kullanıcılar, gerçek veri, değişen gereksinimler ve uygunsuz bir saatte nöbetçi bir mühendis için çalışmaya devam edip edemeyeceğini sorar. Bu hedefleri karıştırmak ya keşfi yavaşlatır ya da gizli risk yayınlar.",
          "Prototipten öğrenmeyi koruyun ama her kısayolu açıkça gözden geçirin. Sabit kodlanmış varsayımları, paylaşılan kimlik bilgilerini, manuel adımları, eksik sahipliği, sınırsız maliyetleri ve kurtarılamayan veriyi belirleyin. Prototip kanıttır; otomatik olarak ilk üretim mimarisi değildir.",
        ],
      },
      {
        heading: "İşletme sınırını tanımlayın",
        paragraphs: [
          "Ürünü kimin kullandığını, hangi veriyi işlediğini, hangi eylemlerin geri alınamaz olduğunu ve hangi dış hizmetlere bağımlı olduğunu yazın. Kabul edilebilir gecikmeyi, erişilebilirliği, destek beklentilerini, saklamayı ve kurtarmayı tanımlayın. Bu kısıtlar teknolojileri popülerliğe göre seçmekten daha etkili mimari yönlendirir.",
          "İlk üretim sistemini kısıtların izin verdiği kadar basit tutun. Net bir veri modeline sahip modüler bir monolit sıkça erken dağıtılmış hizmetlerden daha kolay işletilir. Dağıtım ölçülmüş bir ölçekleme, sahiplik, izolasyon veya dağıtım sorununu çözmelidir.",
        ],
        points: [
          "Ortamları ve kimlik bilgilerini ayırın",
          "Tekrarlanabilir deploy'ları otomatikleştirin",
          "Yedekler oluşturun ve geri yüklemeyi test edin",
          "Gecikme, hata ve üçüncü taraf maliyeti için bütçeler belirleyin",
        ],
      },
      {
        heading: "Güvensiz durumları zorlaştırın",
        paragraphs: [
          "Her güven sınırında veriyi doğrulayın, yetkilendirmeyi sunucuda uygulayın, sırları koruyun ve toplanan kişisel bilgiyi en aza indirin. En az yetkili hizmet kimlikleri kullanın ve kimlik bilgilerini uygulamayı yeniden oluşturmadan döndürün. Güvenlik, normal geliştirme yolu aynı zamanda güvenli yol olduğunda en güçlüdür.",
          "İdari araçlar müşteri arayüzleriyle aynı özeni hak eder. Hassas eylemler açık izinler, denetim kayıtları, uygun yerde onay ve sınırlı toplu işlemler ister. Birçok zararlı olay yanlış kapsamla kullanılan meşru yetenekler üzerinden gerçekleşir.",
        ],
      },
      {
        heading: "Bir teslimat sistemi kurun",
        paragraphs: [
          "Bir üretim deposu hızlı geri bildirim ister: biçimlendirme, statik analiz, tip kontrolü, kritik davranış etrafında testler ve yeniden üretilebilir bir derleme. Deploy'lar küçük, gözlemlenebilir ve geri alınabilir olmalıdır. Özellik bayrakları sahiplik ve kaldırma tarihlerine sahip olduklarında yayını maruz bırakmadan ayırabilir.",
          "Lansmandan önce önemli kullanıcı sonuçlarını enstrümante edin. Yayın tanımlayıcıları veya istek bağlamı olmadan hata raporlama eyleme geçilmesi zor raporlar üretir. Teknik sağlığı ürün sinyalleriyle birleştirin ki ekip başarılı bir deploy'u başarılı bir deneyimden ayırt edebilsin.",
        ],
      },
      {
        heading: "Hazırlık süreklidir",
        paragraphs: [
          "Yazılımın kalıcı olarak üretime hazır olduğu tek bir an yoktur. Trafik büyür, entegrasyonlar değişir, ekipler yeniden örgütlenir ve varsayımlar sona erer. Sistemi iyileştirmek için olayları, destek isteklerini, performans verisini ve ürün davranışını kullanın.",
          "Demodan dayanıklı ürüne geçiş büyük ölçüde açık sorumluluğun eklenmesidir: veri, başarısızlık, maliyet, güvenlik, yayınlar ve kullanıcılar için. Bu sorumluluk küçük bir yazılım parçasının güvenilir hale gelmesini sağlar.",
        ],
      },
    ],
  },
};

export default blogs;
