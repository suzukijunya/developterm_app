"""聞き流し用の日本語の音声ファイルを Google Cloud Text-to-Speech(Neural2)で作る。

使い方(アプリのフォルダ uscpa_app で):
  python3 tools/make_audio.py            # 単語の日本語訳・一言説明・決まり文句
  python3 tools/make_audio.py all        # 「詳しく聞く」の説明文も(文字数・容量が増える)

APIキーは環境変数 GOOGLE_TTS_KEY、またはネットワーク側で X-Goog-Api-Key を付ける設定で渡す。
できた音声は audio/ja/<ハッシュ>.mp3、一覧は js/data/audio_ja.js。すでにある音声は作り直さない。
ハッシュは js/listen.js の RecAudio.hash と同じ計算(FNV-1a 32bit、UTF-16 単位)。
"""
import base64, json, os, ssl, subprocess, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "audio", "ja")
VOICE = os.environ.get("TTS_VOICE", "ja-JP-Neural2-B")  # B:女性 / C,D:男性


def fnv1a(text):
    h = 0x811C9DC5
    b = text.encode("utf-16-le")
    for i in range(0, len(b), 2):
        h ^= b[i] | (b[i + 1] << 8)
        h = (h * 0x01000193) & 0xFFFFFFFF
    return "%08x" % h


def ctx():
    ca = "/root/.ccr/ca-bundle.crt"
    return ssl.create_default_context(cafile=ca) if os.path.exists(ca) else ssl.create_default_context()


def synth(text):
    body = json.dumps({
        "input": {"text": text},
        "voice": {"languageCode": "ja-JP", "name": VOICE},
        "audioConfig": {"audioEncoding": "MP3", "sampleRateHertz": 24000, "speakingRate": 1.0},
    }).encode()
    req = urllib.request.Request("https://texttospeech.googleapis.com/v1/text:synthesize", data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("X-Goog-Api-Key", os.environ.get("GOOGLE_TTS_KEY", "placeholder"))
    with urllib.request.urlopen(req, context=ctx(), timeout=60) as r:
        return base64.b64decode(json.loads(r.read())["audioContent"])


def main():
    os.makedirs(OUT, exist_ok=True)
    args = [sys.argv[1]] if len(sys.argv) > 1 and sys.argv[1] == "all" else []
    texts = json.loads(subprocess.check_output(["node", os.path.join(HERE, "tools", "dump_ja_texts.js"), HERE] + args))
    todo = [t for t in texts if not os.path.exists(os.path.join(OUT, fnv1a(t) + ".mp3"))]
    print(f"文章 {len(texts)} 件 / 新しく作る {len(todo)} 件(約 {sum(len(t) for t in todo):,} 文字)")
    errors = []

    def one(t):
        try:
            data = synth(t)
            with open(os.path.join(OUT, fnv1a(t) + ".mp3"), "wb") as f:
                f.write(data)
        except Exception as e:  # 失敗した文は端末の声で読まれるだけなので、続ける
            errors.append((t[:30], str(e)[:200]))

    with ThreadPoolExecutor(max_workers=6) as ex:
        for i, _ in enumerate(ex.map(one, todo), 1):
            if i % 100 == 0:
                print(f"  {i}/{len(todo)}")
    have = sorted(f[:-4] for f in os.listdir(OUT) if f.endswith(".mp3"))
    with open(os.path.join(HERE, "js", "data", "audio_ja.js"), "w") as f:
        f.write("// 自然な声の日本語の音声ファイルがある文章のハッシュ(tools/make_audio.py が書き出す)\n")
        f.write("const AUDIO_JA = " + json.dumps(have) + ";\n")
    print(f"音声ファイル {len(have)} 件。失敗 {len(errors)} 件")
    for e in errors[:10]:
        print("  失敗:", e)


if __name__ == "__main__":
    main()
