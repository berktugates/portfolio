#!/usr/bin/env python3
"""Locale overlays mirroring EN depth (extra paragraphs + optional closing section)."""

# slug -> locale -> section_index -> [extra paragraphs]
LOCALE_EXTRA_PARAS: dict[str, dict[str, dict[int, list[str]]]] = {
    "reducing-flaky-e2e-tests-in-expo-apps": {
        "tr": {
            0: ["Test paketini ürün altyapısı sayın: flake eşiği aşılınca sahiplik ve kök neden ticket'ı olmadan yeni spec eklemeyin."],
            1: ["Her retry'da değil, bir kez video ve ağ HAR kaydedin; artefakt flake'i açıklasın, şansla yeniden üretmesin."],
            2: ["Karantinayı release manager'larla haftalık gözden geçirin; SLA'sı geçen maddeler treni durdursun veya spec silinsin."],
            3: ["Flake oranını build süresinin yanında yayınlayın; ürün mobil CI sağlığının maliyetini hissetsin."],
        },
        "de": {
            0: ["Behandeln Sie die Suite als Produktinfrastruktur: Flake-Schwellen stoppen neue Specs ohne Owner und Root-Cause-Tickets."],
            1: ["Video und Netzwerk-HAR einmal bei Fehlschlag, nicht bei jedem Retry—Artefakte erklären den Flake."],
            2: ["Quarantäne wöchentlich mit Release-Managern; SLA-Überschreitungen blockieren den Train oder löschen die Spec."],
            3: ["Flake-Rate neben Build-Zeit veröffentlichen, damit Product die Kosten spürt."],
        },
        "fr": {
            0: ["Traitez la suite comme infra produit : au-delà du seuil de flake, gel des nouvelles specs sans owner et ticket cause racine."],
            1: ["Vidéo et HAR réseau une fois à l'échec, pas à chaque retry—les artefacts expliquent le flake."],
            2: ["Revue hebdo de quarantaine avec les release managers ; SLA dépassé bloque le train ou supprime la spec."],
            3: ["Publiez le taux de flake à côté du temps de build pour que le produit ressente le coût."],
        },
        "it": {
            0: ["Tratta la suite come infrastruttura prodotto: sopra soglia flake, congela nuove spec senza owner e ticket root cause."],
            1: ["Video e HAR di rete una volta al fallimento, non a ogni retry—gli artefatti spiegano il flake."],
            2: ["Revisione settimanale quarantena con release manager; SLA scaduto blocca il train o elimina la spec."],
            3: ["Pubblica il flake rate accanto al build time così il product sente il costo."],
        },
        "zh": {
            0: ["把测试套件当作产品基础设施：flake 超阈值时，没有 owner 与根因工单就暂停新增 spec。"],
            1: ["失败时录一次视频与网络 HAR，而非每次重试——产物应解释 flake，而非靠运气复现。"],
            2: ["与 release 经理每周审查隔离；超 SLA 项应阻断发布列车或删除 spec。"],
            3: ["将 flake 率与构建时间一并公布，让产品感知移动端 CI 健康的代价。"],
        },
        "ja": {
            0: ["スイートをプロダクト基盤と見なす。フレーク閾値超過時はオーナーと根本原因チケットなしに新specを止める。"],
            1: ["リトライ毎ではなく失敗時に一度だけ動画とネットワークHARを残す。成果物がフレークを説明すべき。"],
            2: ["リリースマネージャーと週次で隔離をレビュー。SLA超過はトレイン停止かspec削除。"],
            3: ["フレーク率をビルド時間と並べて公開し、プロダクトがコストを感じるようにする。"],
        },
    },
}

# slug -> locale -> (heading, [paragraphs])
LOCALE_CLOSING: dict[str, dict[str, tuple[str, list[str]]]] = {
    "reducing-flaky-e2e-tests-in-expo-apps": {
        "tr": (
            "Güvenilirliği görünür kıl",
            [
                "Bu sprintte bir flake metriği, bir karantina SLA'sı ve bir gerçek cihaz katmanı seçin—release manager'lara güven gerçekten arttı mı diye sorun.",
                "Staff sahiplik, E2E'yi piyangodan haftalık Expo ship eden ekibin güvendiği bir enstrümana çevirir.",
            ],
        ),
        "de": (
            "Zuverlässigkeit sichtbar machen",
            [
                "Wählen Sie diese Sprint eine Flake-Metrik, eine Quarantäne-SLA und eine Real-Device-Stufe—fragen Sie Release-Manager, ob Vertrauen wirklich stieg.",
                "Staff-Ownership macht aus E2E-Lotterie ein Instrument, dem Teams beim wöchentlichen Expo-Ship vertrauen.",
            ],
        ),
        "fr": (
            "Rendre la fiabilité visible",
            [
                "Choisissez une métrique flake, une SLA de quarantaine et un palier d'appareils réels ce sprint—demandez aux release managers si la confiance a bougé.",
                "Le staff ownership transforme l'E2E loterie en instrument de confiance pour shipper Expo chaque semaine.",
            ],
        ),
        "it": (
            "Rendere visibile l'affidabilità",
            [
                "Scegli questo sprint una metrica flake, una SLA di quarantena e un tier dispositivi reali—chiedi ai release manager se la fiducia è cresciuta.",
                "Lo staff ownership trasforma l'E2E da lotteria a strumento fidato per ship settimanale Expo.",
            ],
        ),
        "zh": (
            "让可靠性可见",
            [
                "本 sprint 选一个 flake 指标、一条隔离 SLA 和一层真机覆盖——问 release 经理信心是否真的提升。",
                "Staff 级 ownership 把 E2E 从抽奖变成团队每周发布 Expo 时信任的工具。",
            ],
        ),
        "ja": (
            "信頼性を可視化する",
            [
                "このスプリントでフレーク指標、隔離SLA、実機ティアを一つ選び、リリースマネージャーに信頼が動いたか問う。",
                "Staff ownershipはE2Eを宝くじから、Expoを週次で出すチームが信頼する計器に変える。",
            ],
        ),
    },
}


def apply_locale_depth(slug: str, locales: dict) -> dict:
    extra_by_locale = LOCALE_EXTRA_PARAS.get(slug, {})
    closing_by_locale = LOCALE_CLOSING.get(slug, {})
    out = {}
    for code, copy in locales.items():
        sections = [dict(s) for s in copy.get("sections", [])]
        extra = extra_by_locale.get(code, {})
        for idx, paras in extra.items():
            if idx < len(sections):
                sections[idx]["paragraphs"] = list(sections[idx].get("paragraphs", [])) + list(paras)
        closing = closing_by_locale.get(code)
        if closing:
            sections.append({"heading": closing[0], "paragraphs": closing[1]})
        out[code] = {**copy, "sections": sections}
    return out
