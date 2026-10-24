"""ScreenStage 用の画像と場面データを作る。

    python3 -I scripts/make-stages.py <shots-in フォルダ> <ref フォルダ> [確認用の出力フォルダ]

作るもの
- public/screenshots/stages/<frame>.webp（2400w）と <frame>-800.webp（800w）
- public/og/feature-<slug>.png と public/og/site.png（1200×630）
- lib/scenes.ts（場面データ。このファイルから書き出すので、直すときはここを直す）
- 確認用の出力フォルダを渡すと、場面ごとの拡大範囲と吹き出しを描いた PNG をそこへ出す

決まりごと
- 1 つの Stage の中の画像（Stage.src と各 Scene.src）は、どれもアプリの窓全体を同じ大きさ
  （2934×1836 から縮小）に切り出してある。だから割合の座標は、場面で画像を替えてもずれない。
- 座標はここでは切り出した窓のピクセルで書き、lib/scenes.ts には 0〜100 の割合で書き出す。
- 拡大範囲（rect）は、枠の縦横比（横長は 16:10、論文一覧は 3:4）に広げてから書き出す。
- 吹き出し: box は (x, y) が左上で w, h が大きさ。dot は (x, y) が中心。underline は (x, y) が
  線の左端で w が長さ。label は (x, y) が吹き出しの左上。
- 実際の画面を切り出して縮小するだけで、UI は描き足さない。発表者名はぼかし、1 枚目の
  「検索」のツールチップは消す（scripts/make-screenshots.py と同じ処理）。
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SHOTS = Path(sys.argv[1])
REF = Path(sys.argv[2])
DEBUG = Path(sys.argv[3]) if len(sys.argv) > 3 else None

OUT = ROOT / "public/screenshots/stages"
OG = ROOT / "public/og"
WEB = "/screenshots/stages"
OUT.mkdir(parents=True, exist_ok=True)
OG.mkdir(parents=True, exist_ok=True)

CW, CH = 2934, 1836  # 窓の切り出しの大きさ（Retina の実ピクセル）
BIG, SMALL = 2400, 800
BG = (31, 31, 37)
NAVY = (42, 46, 80)  # --navy-900


# ---------------------------------------------------------------- 画像の切り出し

def blur(im, box, r=9):
    im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(r)), box[:2])


def window(path, top, fix=None):
    """スクリーンショットから窓を切り出す。top は窓の上端（上の黒い帯の下）から 2px 下。"""
    im = Image.open(path).convert("RGB")
    if fix:
        fix(im)
    return im.crop((0, top, CW, top + CH))


def fix_shot1(im):
    # 「検索」のツールチップを消し、隠れていた論文一覧のアイコンを 2 枚目から戻す
    icon = Image.open(SHOTS / "2.png").convert("RGB").crop((26, 26, 82, 82))
    ImageDraw.Draw(im).rectangle((0, 33, 113, 128), fill=BG)
    im.paste(icon, (28, 64))
    blur(im, (270, 930, 640, 980))  # 発表者名


def fix_shot2(im):
    blur(im, (270, 462, 610, 502))  # 発表者名


def fix_ref_slides(im):
    blur(im, (235, 935, 480, 985))  # 発表者名
    blur(im, (1740, 935, 1950, 960), 6)  # 論文の連絡先メール


FRAMES = {
    # name: (画像, alt)
    "overview": (lambda: window(SHOTS / "1.png", 34, fix_shot1),
                 {"ja": "左にスライド、右に論文を並べた PaperLens の画面。", "en": "PaperLens with slides on the left and the paper on the right."}),
    "slides-import": (lambda: window(REF / "app-slides.png", 2, fix_ref_slides),
                      {"ja": "取り込んだスライドの 1 枚目が、論文の 1 ページ目の左に並んでいる。", "en": "The first imported slide sits to the left of the paper's first page."}),
    "slides-linked": (lambda: window(SHOTS / "2.png", 2, fix_shot2),
                      {"ja": "スライドの囲み Markup-02.01 から、論文の文と数式へ色の線が伸びている。", "en": "Colored lines run from the box Markup-02.01 on a slide to a sentence and an equation in the paper."}),
    "equation": (lambda: window(SHOTS / "3.png", 4),
                 {"ja": "論文の隣の補足情報で、数式タブに式 (11) の TeX と記号の意味が出ている。", "en": "The Equations tab beside the paper shows equation (11) in TeX with each symbol explained."}),
    "glossary": (lambda: window(SHOTS / "4.png", 2),
                 {"ja": "補足情報の用語タブ。意味、この論文での使われ方、関連する用語が並ぶ。", "en": "The Terms tab: meaning, how this paper uses the term, and related terms."}),
    "graph-term": (lambda: window(SHOTS / "5.png", 6),
                   {"ja": "グラフで用語 FORCE 学習を選び、意味と出てくる論文が出ている。", "en": "The graph with the term FORCE learning selected, showing its meaning and the paper that uses it."}),
    "graph-overview": (lambda: window(REF / "app-graph.png", 4),
                       {"ja": "3 本の論文と用語を線で結んだグラフ。", "en": "A graph joining three papers and their terms."}),
    "wordbook": (lambda: window(SHOTS / "7.png", 12),
                 {"ja": "すべての論文の用語を集めた単語帳。", "en": "The wordbook, with terms from every paper."}),
    "library": (lambda: Image.open(REF / "app-paper-list.png").convert("RGB").crop((0, 0, 636, 1330)),
                {"ja": "左の論文一覧。検索欄、段階のチップ、並べ替え、BibTeX の書き出しがある。", "en": "The paper list on the left, with search, status chips, sorting, and BibTeX export."}),
}

frames, sizes = {}, {}


def export(name, im):
    w = min(BIG, im.width)
    big = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS) if im.width > w else im
    big.save(OUT / f"{name}.webp", "WEBP", quality=84, method=6)
    sizes[name] = big.size
    if im.width > SMALL:
        small = im.resize((SMALL, round(im.height * SMALL / im.width)), Image.LANCZOS)
        small.save(OUT / f"{name}-800.webp", "WEBP", quality=84, method=6)
    print(name, big.size)


for name, (make, _) in FRAMES.items():
    frames[name] = make()
    export(name, frames[name])


def src(name):
    return f"{WEB}/{name}.webp"


def srcset(name):
    w, _ = sizes[name]
    if frames[name].width > SMALL:
        return f"{WEB}/{name}-800.webp 800w, {WEB}/{name}.webp {w}w"
    return f"{WEB}/{name}.webp {w}w"


# ---------------------------------------------------------------- 場面

def L(ja, en):
    return {"ja": ja, "en": en}


def box(x0, y0, x1, y1, text=None):
    return ("box", x0, y0, x1, y1, text)


def dot(x, y, text=None):
    return ("dot", x, y, None, None, text)


def underline(x0, y, x1, text=None):
    return ("underline", x0, y, x1, None, text)


FULL = None


def scene(frame, rect, callouts, caption):
    return {"frame": frame, "rect": rect, "callouts": callouts, "caption": caption}


STAGES = {
    # 1 枚目（スライドと論文を並べた画面）から始める、トップのヒーロー用
    "hero": {
        "base": "overview", "aspect": 16 / 10,
        "scenes": [
            scene("overview", FULL, [underline(136, 362, 360), underline(2056, 362, 2212)],
                  L("スライドと論文を並べて、1 つの画面で読みます。", "Slides and the paper sit side by side in one window.")),
            scene("slides-linked", (180, 115, 2934, 1836), [box(208, 824, 585, 1412), box(2110, 794, 2480, 980)],
                  L("スライドで囲んだグループと論文の箇所が、同じ色の線で結ばれます。", "A box on a slide and a passage in the paper are joined by a line in the same color.")),
            scene("equation", (1000, 150, 2934, 1359), [box(2545, 206, 2912, 292), underline(1050, 482, 1740)],
                  L("［補足情報］に切り替えると、論文の隣に対訳・訳・用語・数式のタブが並びます。", "Switch to the companion panel, and tabs for translation, terms, and equations sit beside the paper.")),
            scene("glossary", (1000, 380, 2934, 1589), [box(1072, 846, 2834, 1030)],
                  L("用語には、意味とこの論文での使われ方がまとまります。", "Each term comes with its meaning and how this paper uses it.")),
        ],
    },
    # E-1 スライドと論文をつなぐ
    "slides-link": {
        "base": "slides-linked", "aspect": 16 / 10,
        "scenes": [
            scene("slides-import", FULL, [dot(54, 414), underline(136, 362, 390), underline(1616, 362, 1772)],
                  L("取り込んだスライド（PDF・PPTX）が、論文の左に並びます。", "Imported slides (PDF or PPTX) appear to the left of the paper.")),
            scene("slides-linked", (0, 100, 1000, 1450), [box(318, 126, 474, 188), box(208, 824, 585, 1412)],
                  L("「囲む」でスライドをドラッグすると、Markup-02.01 のような名前のグループになります。", "Drag across the slide with \"Box,\" and the area becomes a group named like Markup-02.01.")),
            scene("slides-linked", (1550, 190, 2934, 1055), [box(1606, 208, 1980, 292), box(2110, 794, 2480, 980)],
                  L("グループを選んだまま論文の文・図・数式を指定すると、同じ色の線で結ばれます。", "With the group selected, pick a sentence, figure, or equation in the paper, and a line in the group's color joins them.")),
            scene("slides-linked", FULL, [dot(243, 850), dot(2480, 722), dot(2137, 1213)],
                  L("グループを押すと論文の該当箇所へ、論文側の色の印を押すとスライドへ移ります。", "Click a group to jump to the passage; click the colored marker in the paper to jump back to the slide.")),
            scene("slides-linked", (700, 150, 2934, 1546), [box(2333, 208, 2507, 292)],
                  L("「全画面」（P）で、スライドと論文を線ごと映して発表できます。", "Press \"Full screen\" (P) to present the slides and paper, lines included.")),
        ],
    },
    # E-2 補足情報
    "supplement": {
        "base": "equation", "aspect": 16 / 10,
        "scenes": [
            scene("equation", (0, 820, 1100, 1508), [box(560, 1138, 910, 1202)],
                  L("PDF の語や文をドラッグで選ぶと、マーカーと「訳す」「用語を調べる」「数式にする」が出ます。", "Drag over a word or sentence in the PDF to get highlight colors plus \"Translate,\" \"Look up term,\" and \"Make equation.\"")),
            scene("glossary", (1020, 380, 2900, 1555), [underline(1287, 482, 1450), box(1072, 846, 2834, 1030), box(1072, 1040, 2300, 1158)],
                  L("「用語を調べる」で、意味・詳しい説明・この論文での使われ方・関連する用語がまとまります。", "\"Look up term\" gathers a definition, details, how this paper uses it, and related terms.")),
            scene("equation", (1000, 555, 2934, 1764), [box(1083, 996, 2851, 1197, L("TeX", "TeX")), box(1083, 1226, 2851, 1379, L("式の役割", "What it does")), box(1083, 1418, 2854, 1759)],
                  L("「数式にする」で式を TeX に書き起こし、式の役割と記号ごとの意味を添えます。", "\"Make equation\" transcribes it to TeX, with what it does and what each symbol means.")),
            scene("equation", (1020, 330, 2100, 1005), [box(1053, 400, 1155, 480)],
                  L("Claude に頼んだ全文の訳は、対訳タブに 1 文ずつ並びます。", "The full translation you asked Claude for fills the Translation tab, one sentence at a time.")),
            scene("equation", FULL, [box(2545, 206, 2912, 292), box(210, 1450, 560, 1614)],
                  L("スライドの画面でも［論文｜補足情報］に切り替えられ、式や用語の場所を押すと論文がそこへ動きます。", "The slides view switches to [paper | companion panel] too; click an entry's location, and the paper moves there.")),
        ],
    },
    # E-3 単語帳とグラフ
    "wordbook-graph": {
        "base": "wordbook", "aspect": 16 / 10,
        "scenes": [
            scene("wordbook", FULL, [dot(56, 236), box(884, 204, 1062, 286)],
                  L("左端の「リスト」を開くと、すべての論文の用語が単語帳に並びます。", "Open \"Lists\" on the left edge, and terms from all your papers fill the wordbook.")),
            scene("wordbook", (150, 140, 2650, 1702), [box(176, 166, 777, 252), box(2016, 266, 2584, 350)],
                  L("検索欄で絞り込み、論文・ページ順と五十音・ABC 順を切り替えます。", "Narrow the list with the search box, and switch between paper-and-page and alphabetical order.")),
            scene("wordbook", (860, 470, 2120, 1257), [box(884, 870, 1026, 940)],
                  L("項目のページ番号を押すと、その論文の該当ページが開きます。", "Click an entry's page number to open the paper at that page.")),
            scene("wordbook", (150, 140, 1450, 952), [box(178, 430, 777, 506)],
                  L("数式帳に切り替えると、書き起こした式が論文ごとに並びます。", "Switch to the equation book to see your transcribed equations, grouped by paper.")),
            scene("graph-term", (566, 105, 2934, 1585), [box(988, 936, 1540, 1014), box(2048, 966, 2834, 1152), dot(1060, 1542)],
                  L("「グラフ」では論文と用語が線で結ばれ、用語を選ぶと意味と出てくる論文が出ます。", "In \"Graph,\" papers and terms are joined by lines; select a term to see its meaning and the papers that use it.")),
        ],
    },
    # E-4 Claude から操作する（MCP）。Claude の画面は無いので、MCP が書き込んだ結果の画面だけを見せる。
    # ページ側で CSS のチャットと組み合わせる（チャットの i 行目 = 場面 i）。
    "mcp": {
        "base": "equation", "aspect": 16 / 10,
        "scenes": [
            scene("equation", (0, 1000, 1340, 1836), [dot(56, 1692)],
                  L("設定の「AI エージェント（MCP）」から登録方法をコピーし、Claude Desktop か Claude Code に貼ります。", "Copy the setup from Settings → \"AI agents (MCP)\" and paste it into Claude Desktop or Claude Code.")),
            scene("equation", (1020, 330, 2100, 1005), [box(1053, 400, 1155, 480)],
                  L("「全文を訳して」と頼むと、訳が対訳タブに 1 文ずつ入ります。", "Ask Claude to \"translate the whole paper,\" and the Translation tab fills sentence by sentence.")),
            scene("equation", (1000, 330, 2934, 1539), [underline(1458, 482, 1632), box(1083, 626, 2851, 987)],
                  L("「式 (11) を解説して」と頼むと、Claude が書き起こして数式タブに登録します。", "Ask \"explain equation (11),\" and Claude writes it up and adds it to the Equations tab.")),
            scene("slides-linked", (0, 640, 1300, 1452), [box(208, 824, 585, 1412)],
                  L("「この箇所のメモに残して」と頼むと、文・マーカー・スライドのグループにメモが付きます。", "Say \"save that as a note here,\" and it's attached to a sentence, a highlight, or a slide group.")),
            scene("glossary", (1000, 380, 2934, 1589), [box(2648, 492, 2742, 545), box(1048, 494, 2878, 1178)],
                  L("アプリを開いていれば Claude の書き込みはすぐ画面に出て、「編集」でいつでも直せます。", "If the app is open, Claude's changes appear right away, and \"Edit\" lets you change them.")),
        ],
    },
    # 論文一覧と検索（縦長の枠）
    "library-search": {
        "base": "library", "aspect": 3 / 4,
        "scenes": [
            scene("library", (0, 0, 636, 848), [dot(53, 63)],
                  L("左端の「論文一覧」に、取り込んだ論文が並びます。", "Papers you import are listed under \"Papers\" on the left edge.")),
            scene("library", (0, 90, 636, 938), [box(130, 128, 620, 218), box(130, 222, 510, 302)],
                  L("検索欄と段階のチップで、題名・著者・タグなどから絞り込みます。", "Filter by title, author, tags, and more with the search box and status chips.")),
            scene("library", (0, 330, 636, 1178), [box(264, 394, 518, 456)],
                  L("追加日・題名・発行年・段階で並べ替えられます。", "Sort by date added, title, year, or reading stage.")),
            scene("library", (0, 482, 636, 1330), [box(158, 1232, 584, 1298)],
                  L("「すべての BibTeX を書き出す」で、一覧の論文をまとめて書き出せます。", "\"Export all BibTeX\" exports every paper in the list at once.")),
            scene("library", (0, 0, 636, 848), [dot(53, 155)],
                  L("左端の「検索」では、論文の題名と、書き留めた訳・メモ・用語・数式を探せます。", "\"Search\" on the left edge looks through paper titles and what you've written down: translations, notes, terms, equations.")),
        ],
    },
}

# 場面に合う画面がまだ無く、近い画面で代わりに見せている場面（0 始まり）。撮り直したら差し替える。
PLACEHOLDERS = {
    "supplement": {0: "PDF で文を選んだときのメニュー（マーカー・訳す・用語を調べる・数式にする）", 3: "対訳タブを開いた補足情報"},
    "wordbook-graph": {3: "数式帳を開いたリスト"},
    "mcp": {0: "設定の「AI エージェント（MCP）」", 1: "対訳タブを開いた補足情報", 3: "メモが付いた文・マーカー・グループ"},
    "library-search": {4: "左端の「検索」を開いた画面"},
}


def fit(rect, frame, aspect):
    """rect を aspect（幅/高さ）に広げ、画像の内側に収める。"""
    W, H = frame.size
    if rect is None:
        return (0, 0, W, H)
    x0, y0, x1, y1 = rect
    w, h = x1 - x0, y1 - y0
    if w / h < aspect:
        w = h * aspect
    else:
        h = w / aspect
    if w > W:
        w, h = W, W / aspect
    if h > H:
        h, w = H, H * aspect
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    nx0 = min(max(cx - w / 2, 0), W - w)
    ny0 = min(max(cy - h / 2, 0), H - h)
    return (nx0, ny0, nx0 + w, ny0 + h)


def pct(v, total):
    return round(v / total * 100, 2)


def callout_json(c, W, H):
    kind, a, b, c2, d, text = c
    o = {"kind": kind}
    if kind == "box":
        o.update(x=pct(a, W), y=pct(b, H), w=pct(c2 - a, W), h=pct(d - b, H))
    elif kind == "dot":
        o.update(x=pct(a, W), y=pct(b, H))
    elif kind == "underline":
        o.update(x=pct(a, W), y=pct(b, H), w=pct(c2 - a, W))
    if text:
        o["text"] = text
    return o


def build():
    out = {}
    for key, st in STAGES.items():
        base = st["base"]
        W, H = frames[base].size
        scenes = []
        for sc in st["scenes"]:
            fr = frames[sc["frame"]]
            assert fr.size == (W, H), (key, sc["frame"])
            r = fit(sc["rect"], fr, st["aspect"])
            o = {
                "rect": {"x": pct(r[0], W), "y": pct(r[1], H), "w": pct(r[2] - r[0], W), "h": pct(r[3] - r[1], H)},
                "callouts": [callout_json(c, W, H) for c in sc["callouts"]],
                "caption": sc["caption"],
            }
            if sc["frame"] != base:
                o["src"] = src(sc["frame"])
            scenes.append(o)
        bw, bh = sizes[base]
        out[key] = {
            "id": key, "src": src(base), "srcSet": srcset(base),
            "width": bw, "height": bh, "alt": FRAMES[base][1], "scenes": scenes,
        }
    return out


def ts_value(v, ind=0):
    pad = "  " * ind
    if isinstance(v, dict):
        if set(v) <= {"ja", "en"} or set(v) <= {"x", "y", "w", "h", "kind"}:
            return "{ " + ", ".join(f"{k}: {ts_value(x)}" for k, x in v.items()) + " }"
        items = [f"{pad}  {json.dumps(k) if '-' in k else k}: {ts_value(x, ind + 1)}," for k, x in v.items()]
        return "{\n" + "\n".join(items) + f"\n{pad}}}"
    if isinstance(v, list):
        if not v:
            return "[]"
        return "[\n" + "\n".join(f"{pad}  {ts_value(x, ind + 1)}," for x in v) + f"\n{pad}]"
    if isinstance(v, float) and v.is_integer():
        return str(int(v))
    return json.dumps(v, ensure_ascii=False)


def write_ts(data):
    keys = list(STAGES)
    meta = {}
    for k, st in STAGES.items():
        m = {"aspect": "3/4" if st["aspect"] < 1 else "16/10"}
        if k == "mcp":
            m["pairWithChat"] = True
        if k in PLACEHOLDERS:
            m["placeholders"] = sorted(PLACEHOLDERS[k])
        meta[k] = m
    lines = [
        "/**",
        " * ScreenStage の場面データ。scripts/make-stages.py が書き出す（手で直さず、スクリプトを直して再実行する）。",
        " *",
        " * - 座標はすべて画像に対する割合（0〜100）。1 つの Stage の中の画像（src と各 scene.src）は同じ大きさ。",
        " * - scene.src の 800w 版は同じ名前に -800 を付けたファイル（例: equation.webp → equation-800.webp）。",
        " * - 吹き出し: box は (x, y) が左上で w, h が大きさ。dot は (x, y) が中心。underline は (x, y) が左端で w が長さ。",
        " * - rect は枠の縦横比（stageMeta[key].aspect）に合わせてある。",
        " * - 場面 i は、lib/i18n の詳細ページの手順 i と 1 対 1（hero と library-search は詳細ページの手順なし）。",
        " */",
        'import type { Stage } from "./stage-types";',
        "",
        "export type StageKey = " + " | ".join(json.dumps(k) for k in keys) + ";",
        "",
        "export const stages: Record<StageKey, Stage> = " + ts_value(data) + ";",
        "",
        "/**",
        " * 場面データの補足。",
        " * - aspect: 枠の縦横比。",
        " * - pairWithChat: Claude の画面は無く、MCP が書き込んだ結果のアプリ画面だけ。CSS のチャットと組み合わせる（チャットの i 行目 = 場面 i）。",
        " * - placeholders: 合う画面がまだ無く、近い画面で代わりに見せている場面の番号（0 始まり）。",
        " */",
        "export const stageMeta: Record<StageKey, { aspect: \"16/10\" | \"3/4\"; pairWithChat?: boolean; placeholders?: number[] }> = "
        + "{\n" + "\n".join(f"  {json.dumps(k)}: {json.dumps(v)}," for k, v in meta.items()) + "\n};",
        "",
    ]
    (ROOT / "lib/scenes.ts").write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------- 確認用の画像

def font(size, bold=False):
    for p in ["/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc" if bold else "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
              "/System/Library/Fonts/Hiragino Sans GB.ttc"]:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            pass
    return ImageFont.load_default()


def draw_callouts(d, cs, tf, k, color=(255, 224, 131)):
    for c in cs:
        kind, a, b, c2, dd, text = c
        if kind == "box":
            x0, y0 = tf(a, b)
            x1, y1 = tf(c2, dd)
            d.rounded_rectangle((x0, y0, x1, y1), 6, outline=color, width=3)
            if text:
                d.text((x0, y0 - 22), text["ja"], fill=color, font=font(16, True))
        elif kind == "dot":
            x, y = tf(a, b)
            d.ellipse((x - 10, y - 10, x + 10, y + 10), fill=color, outline=(255, 255, 255), width=2)
        elif kind == "underline":
            x0, y = tf(a, b)
            x1, _ = tf(c2, b)
            d.rectangle((x0, y - 2, x1, y + 2), fill=color)


def debug_sheets():
    DEBUG.mkdir(parents=True, exist_ok=True)
    for key, st in STAGES.items():
        portrait = st["aspect"] < 1
        vw = 420 if portrait else 880
        vh = round(vw / st["aspect"])
        n = len(st["scenes"])
        cols = 3 if portrait else 2
        rows = (n + cols - 1) // cols
        cap_h = 70
        sheet = Image.new("RGB", (cols * (vw + 20) + 20, rows * (vh + cap_h + 20) + 20), (250, 250, 250))
        for i, sc in enumerate(st["scenes"]):
            fr = frames[sc["frame"]]
            r = fit(sc["rect"], fr, st["aspect"])
            view = fr.crop(tuple(round(v) for v in r)).resize((vw, vh), Image.LANCZOS)
            k = vw / (r[2] - r[0])
            d = ImageDraw.Draw(view)
            draw_callouts(d, sc["callouts"], lambda x, y: ((x - r[0]) * k, (y - r[1]) * k), k)
            col, row = i % cols, i // cols
            ox, oy = 20 + col * (vw + 20), 20 + row * (vh + cap_h + 20)
            sheet.paste(view, (ox, oy))
            sd = ImageDraw.Draw(sheet)
            tag = " [仮]" if i in PLACEHOLDERS.get(key, {}) else ""
            sd.text((ox, oy + vh + 6), f"{i + 1}. {sc['frame']}{tag}  ×{k * fr.width / vw:.2f}", fill=(90, 90, 90), font=font(14))
            cap = sc["caption"]["ja"]
            width = 44 if not portrait else 22
            for j in range(0, min(len(cap), width * 2), width):
                sd.text((ox, oy + vh + 26 + (j // width) * 20), cap[j:j + width], fill=(20, 20, 20), font=font(15))
        sheet.save(DEBUG / f"stage-{key}.png")
        # 全体図: 元の画像に拡大範囲（枠の比に広げた後）を重ねる
        base = frames[st["base"]]
        s = (700 if portrait else 1400) / base.width if not portrait else 700 / base.height
        ov = base.resize((round(base.width * s), round(base.height * s)))
        d = ImageDraw.Draw(ov)
        for i, sc in enumerate(st["scenes"]):
            if sc["frame"] != st["base"]:
                continue
            r = fit(sc["rect"], base, st["aspect"])
            d.rectangle(tuple(v * s for v in r), outline=(255, 80, 80), width=2)
            d.text((r[0] * s + 6, r[1] * s + 4), str(i + 1), fill=(255, 80, 80), font=font(20, True))
            draw_callouts(d, sc["callouts"], lambda x, y: (x * s, y * s), s)
        ov.save(DEBUG / f"stage-{key}-map.png")
    print("debug ->", DEBUG)


# ---------------------------------------------------------------- OGP 画像

def rounded(im, r):
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width - 1, im.height - 1), r, fill=255)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


def og_canvas(card, pos):
    W, H = 1200, 630
    cv = Image.new("RGBA", (W, H), NAVY + (255,))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    x, y = pos
    ImageDraw.Draw(sh).rounded_rectangle((x - 2, y + 10, x + card.width + 2, y + card.height + 18), 16, fill=(0, 0, 0, 120))
    cv.alpha_composite(sh.filter(ImageFilter.GaussianBlur(14)))
    ring = Image.new("RGBA", (card.width + 12, card.height + 12), (0, 0, 0, 0))
    ImageDraw.Draw(ring).rounded_rectangle((0, 0, ring.width - 1, ring.height - 1), 18, fill=(20, 19, 24, 255))
    cv.alpha_composite(ring, (x - 6, y - 6))
    cv.alpha_composite(rounded(card.convert("RGB"), 12), (x, y))
    mark = Image.open(ROOT / "brand/icon.png").convert("RGBA").resize((72, 72), Image.LANCZOS)
    cv.alpha_composite(mark, (72, 22))
    return cv.convert("RGB")


def og_crop(frame, rect, size=(1040, 478)):
    fr = frames[frame]
    r = fit(rect, fr, size[0] / size[1])
    return fr.crop(tuple(round(v) for v in r)).resize(size, Image.LANCZOS)


def make_og():
    picks = {
        "slides-link": ("slides-linked", (180, 300, 2934, 1677)),
        "supplement": ("equation", (1000, 520, 2934, 1487)),
        "wordbook-graph": ("wordbook", (150, 140, 2800, 1465)),
        "mcp": ("glossary", (1000, 495, 2934, 1382)),
    }
    for slug, (frame, rect) in picks.items():
        og_canvas(og_crop(frame, rect), (80, 116)).save(OG / f"feature-{slug}.png", optimize=True)
        print("og", slug)
    lib = frames["library"]
    h = 478
    card = lib.resize((round(lib.width * h / lib.height), h), Image.LANCZOS)
    og_canvas(card, ((1200 - card.width) // 2, 116)).save(OG / "feature-library-search.png", optimize=True)
    print("og library-search")
    # トップ: ヒーローの Mac の画像（make-screenshots.py が作ったもの）を紺の地に置く
    hero = Image.open(ROOT / "public/screenshots/hero-mac.webp").convert("RGBA")
    s = min(1060 / hero.width, 560 / hero.height)
    hero = hero.resize((round(hero.width * s), round(hero.height * s)), Image.LANCZOS)
    cv = Image.new("RGBA", (1200, 630), NAVY + (255,))
    cv.alpha_composite(hero, ((1200 - hero.width) // 2, 630 - hero.height - 30))
    mark = Image.open(ROOT / "brand/icon.png").convert("RGBA").resize((80, 80), Image.LANCZOS)
    cv.alpha_composite(mark, (36, 26))
    cv.convert("RGB").save(OG / "site.png", optimize=True)
    print("og site")


data = build()
write_ts(data)
make_og()
if DEBUG:
    debug_sheets()
