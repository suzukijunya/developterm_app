// 見本カード(添付いただいた3枚をこのツールの入力フォーマットで書き起こしたもの)。
// イラストは未設定なので、各カードに写真・画像を追加して使う。
const SAMPLE_CARDS = [
  {
    "id": "sample-kyo",
    "cardType": "effect",
    "name": "海外転売仙人 キョウ",
    "attribute": "custom",
    "customAttribute": {
      "text": "商",
      "color": "#de2910",
      "image": "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%2030%2020%27%20width%3D%27300%27%20height%3D%27200%27%3E%3Crect%20width%3D%2730%27%20height%3D%2720%27%20fill%3D%27%23de2910%27/%3E%3Cdefs%3E%3Cpolygon%20id%3D%27s%27%20points%3D%270%2C-1%200.2245%2C-0.309%200.951%2C-0.309%200.363%2C0.118%200.588%2C0.809%200%2C0.382%20-0.588%2C0.809%20-0.363%2C0.118%20-0.951%2C-0.309%20-0.2245%2C-0.309%27%20fill%3D%27%23ffde00%27/%3E%3C/defs%3E%3Cuse%20href%3D%27%23s%27%20transform%3D%27translate%285%2C5%29%20scale%283%29%27/%3E%3Cuse%20href%3D%27%23s%27%20transform%3D%27translate%2810%2C2%29%20rotate%2823%29%20scale%281%29%27/%3E%3Cuse%20href%3D%27%23s%27%20transform%3D%27translate%2812%2C4%29%20rotate%2846%29%20scale%281%29%27/%3E%3Cuse%20href%3D%27%23s%27%20transform%3D%27translate%2812%2C7%29%20rotate%2870%29%20scale%281%29%27/%3E%3Cuse%20href%3D%27%23s%27%20transform%3D%27translate%2810%2C9%29%20rotate%2821%29%20scale%281%29%27/%3E%3C/svg%3E"
    },
    "level": 7,
    "tribe": "商人族",
    "abilities": "効果",
    "effect": "このカードは、自分フィールドに「雅さん」と「テスラ」が存在する場合のみ、手札またはデッキから特殊召喚できる。\n①：このカードが召喚・特殊召喚に成功した場合に発動できる。デッキから「中国バイヤー」モンスターを２体まで特殊召喚する。\n②：１ターンに１度、自分が「ボックス」を100箱以上完売した場合に発動できる。自分はデッキから１枚ドローする。",
    "atk": "3800",
    "def": "1500",
    "cardCode": "WBCT-031",
    "copyright": "©2024 WB ARGO",
    "nameColor": "gold",
    "art": {
      "image": null,
      "zoom": 1,
      "x": 0,
      "y": 0,
      "effect": "gold",
      "intensity": 0.8
    },
    "member": {
      "realName": "キョウ",
      "department": "海外事業部",
      "role": "越境EC・仕入れ担当",
      "skills": "ポケカのBOXを海外に売りさばく",
      "personality": "いつも笑顔",
      "episode": "雅さんとテスラ(社用車)がそろうと本気を出す",
      "tone": "面白く"
    }
  },
  {
    "id": "sample-suzuki",
    "cardType": "effect",
    "name": "財務統括魔導士スズキ",
    "attribute": "光",
    "level": 6,
    "tribe": "CFO族",
    "abilities": "効果",
    "effect": "このカードがフィールドに存在する限り、相手の「グレー金融」「曖昧契約」の効果は無効化される。\n①：１ターンに１度、相手が「リターン請求」を発動した時に発動できる。このカードは「法務確認」を発動する。",
    "atk": "2400",
    "def": "2100",
    "cardCode": "WBHC-024",
    "copyright": "©2024 WB ARGO",
    "nameColor": "gold",
    "art": {
      "image": null,
      "zoom": 1,
      "x": 0,
      "y": 0,
      "effect": "gold",
      "intensity": 0.7
    },
    "member": {
      "realName": "スズキ",
      "department": "管理本部",
      "role": "CFO",
      "skills": "財務・契約チェック",
      "personality": "冷静沈着。電卓が相棒",
      "episode": "怪しい契約は必ず見抜く",
      "tone": "かっこよく"
    }
  },
  {
    "id": "sample-yonaha",
    "cardType": "effect",
    "name": "税務幻術師ヨナハ",
    "attribute": "闇",
    "level": 6,
    "tribe": "悪魔族",
    "abilities": "効果",
    "effect": "「グレー金融」の使い手。\n---\nこのカードが場に出た時、相手を混乱させる税務トリックを発動できる。「なお、二重課税なんて些細な問題ですよ」と発言することで全てを曖昧にする。",
    "atk": "1200",
    "def": "1600",
    "cardCode": "YGWH-021",
    "copyright": "©2024 ARGO WB",
    "nameColor": "gold",
    "art": {
      "image": null,
      "zoom": 1,
      "x": 0,
      "y": 0,
      "effect": "purple",
      "intensity": 0.75
    },
    "member": {
      "realName": "ヨナハ",
      "department": "経理部",
      "role": "税務担当",
      "skills": "税務・節税スキーム",
      "personality": "穏やかな笑顔で難題をかわす",
      "episode": "口癖は「些細な問題ですよ」",
      "tone": "面白く"
    }
  }
];
