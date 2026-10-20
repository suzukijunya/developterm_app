// 近くのメンテナンス店(最初に入れておく候補)。2026年10月にネットの店舗情報・口コミから調べたもの。
// 営業時間・定休日は変わることがあるので、行く前に電話か公式サイトで確かめる。
// ガレージに入れたあとは、メモを書いたり、消したり、自分で追加したりできる(同期される)。

const Shops = (() => {
  const ORIGIN = "東京都杉並区荻窪1-33-12";
  const DEFAULTS = [
    {
      id: "manda", name: "万田サイクル", addr: "東京都杉並区上荻2-41-10", tel: "03-3395-3201", hours: "10:00〜19:00・水曜定休",
      good: "GIANTを扱っているので、Escape R3の相談がしやすい。1925年からの老舗。スポーツ車はGIANT〜DE ROSAまで",
      note: "一般車も多い町の自転車店。凝った作業は事前に電話で相談を", tags: ["GIANT", "定期点検", "パンク"],
      src: "https://www.podium.co.jp/shop/993",
    },
    {
      id: "alt", name: "ALT CYCLES(オルトサイクル)", addr: "東京都杉並区本天沼 本天沼グリーンデッキ1F", tel: "070-9017-6298", hours: "10:30〜19:30・不定休",
      good: "他店で買った自転車の整備・カスタムも受ける。塗装ブースがあり、フレームの塗り替えもできる",
      note: "ドロップハンドル化のような改造・カスタムの相談向き。不定休なのでInstagramか電話で確かめてから", tags: ["カスタム", "他店購入OK", "塗装"],
      src: "https://alt-cycles.com/",
    },
    {
      id: "watanabe", name: "サイクルステーションワタナベ 荻窪店", addr: "東京都杉並区天沼3-17-21", tel: "03-3392-3242", hours: "要確認",
      good: "Yahoo!マップ ★4.75(4件)。知識が豊富・見積もりが的確・部品の在庫があり修理が早い、という声",
      note: "1人で対応していて混むことがある、という口コミも", tags: ["修理", "見積もり"],
      src: "https://www.ekiten.jp/shop_208160/",
    },
    {
      id: "tokino", name: "トキノサイクリングフィットネス(ショップ併設)", addr: "東京都杉並区上荻1-24-10 2F", tel: "03-6276-9445", hours: "平日 9:00〜22:30・土日祝 8:15〜17:00(定休日は情報が分かれるので要確認)",
      good: "自転車技士・自転車安全整備士が整備。ロードバイクのオーバーホールは¥20,000〜(税抜)。会員でなくても利用できる",
      note: "フィットネスジムと同じ建物のショップ。夜遅くまで開いているので、仕事帰りに出しやすい", tags: ["オーバーホール", "夜まで"],
      src: "https://www.tokino-company.co.jp/shop",
    },
    {
      id: "watanabe-s", name: "サイクルステーションワタナベ 荻窪南口店", addr: "東京都杉並区荻窪5-1-14", tel: "03-3393-6090", hours: "要確認",
      good: "荻窪駅の南口側。パンクやブレーキなど、ちょっとした修理を急ぎで頼むとき",
      note: "ロードバイク専門ではないので、本格的な整備は上のお店へ", tags: ["パンク", "駅近"],
      src: "https://www.ekiten.jp/shop_208163/",
    },
  ];

  const mapUrl = (s) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(s.name.replace(/\(.*\)/, "") + " " + s.addr);
  const routeUrl = (s, origin) =>
    "https://www.google.com/maps/dir/?api=1&travelmode=bicycling&origin=" + encodeURIComponent(origin || ORIGIN) + "&destination=" + encodeURIComponent(s.name.replace(/\(.*\)/, "") + " " + s.addr);

  // 作業に合うお店(タグで選ぶ)
  function forJob(shops, job) {
    const want = { custom: ["カスタム", "他店購入OK"], overhaul: ["オーバーホール"], quick: ["パンク", "駅近", "修理"], giant: ["GIANT"] }[job] || [];
    return (shops || []).filter((s) => (s.tags || []).some((t) => want.includes(t)));
  }

  return { ORIGIN, DEFAULTS, mapUrl, routeUrl, forJob };
})();

if (typeof module !== "undefined") module.exports = Shops;
