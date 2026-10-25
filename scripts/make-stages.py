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
                {"ja": "左の論文一覧。検索欄、並べ替え、BibTeX の書き出しがある。", "en": "The paper list on the left, with search, sorting, and BibTeX export."}),
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


def scene(frame, rect, callouts, caption, mobile=None):
    """mobile: 狭い画面（≤1000px の静止画）で使う、より寄った範囲。省略時はページ側で吹き出しから決める。"""
    return {"frame": frame, "rect": rect, "callouts": callouts, "caption": caption, "mobile": mobile}


# ヒーロー（トップの最初の画面）の切り出し。スライドのグループ・赤い線・論文の該当箇所が真ん中に来る範囲。
HERO_RECT = (112, 318, 2934, 1729)          # 2:1。左のリボンを外し、スライドと論文の見出しから 2 枚目のスライドの下まで
HERO_MOBILE_RECT = (190, 29, 2600, 1836)    # 4:3。グループの左端から論文の右上の印まで（両端が入る最小の幅）

# 何度も使う位置（slides-linked の窓のピクセル）
GROUP = (206, 820, 586, 1422)               # スライドのグループ Markup-02.01
PASSAGE = (2095, 780, 2505, 980)            # 論文側: 式 (1)(2) の囲み（四隅の印にかからない外側）
MARK_TOP = (2440, 688, 2516, 764)           # 論文側の色の印（右上の文の先頭）
MARK_LOW = (2100, 1180, 2176, 1256)         # 論文側の色の印（左下の文の先頭）
PAPER_SIDE = (1382, 330, 2934, 1300)        # 線が論文に入るところ（×1.89）

STAGES = {
    # トップ用。スライドと論文が線で結ばれた画面（ヒーローの画像と同じ画面）から始める
    "hero": {
        "base": "slides-linked", "aspect": 16 / 10,
        "scenes": [
            scene("slides-linked", HERO_RECT, [box(*GROUP), box(*PASSAGE)],
                  L("スライドで囲んだグループと、論文の文や数式が、同じ色の線で結ばれます。",
                    "A group boxed on a slide and a sentence or equation in the paper are joined by lines in the same color.")),
            scene("slides-linked", (100, 720, 1300, 1470), [box(*GROUP)],
                  L("スライドの一部を囲むと、Markup-02.01 のような名前のグループになります。",
                    "Box part of a slide, and it becomes a group with a name like Markup-02.01.")),
            scene("slides-linked", PAPER_SIDE, [box(*PASSAGE), box(*MARK_TOP)],
                  L("線の先は論文の文や数式です。論文側の色の印を押すと、スライドのそのページが開きます。",
                    "The lines end at sentences and equations in the paper. Click a colored marker there to open that slide.")),
            scene("equation", (1000, 150, 2934, 1359), [box(2740, 206, 2912, 292), underline(1050, 482, 1740)],
                  L("［補足情報］に切り替えると、論文の右に対訳・訳・用語・数式のタブが並びます。",
                    "Switch to 補足情報 (Companion), and tabs for 対訳 (Side by side), 訳 (Highlights), 用語 (Terms), and 数式 (Equations) sit beside the paper.")),
            scene("glossary", (1000, 380, 2934, 1589), [box(1072, 846, 2834, 1030)],
                  L("「用語を調べる」を押すと、Claude が意味とこの論文での使われ方をまとめます。",
                    "Choose 用語を調べる (Look up term), and Claude writes up the meaning and how this paper uses it.")),
        ],
    },
    # E-1 スライドと論文をつなぐ（場面 i = 詳細ページの手順 i）
    "slides-link": {
        "base": "slides-linked", "aspect": 16 / 10,
        "scenes": [
            scene("slides-import", FULL, [box(18, 382, 92, 448), underline(136, 362, 390), underline(1616, 362, 1772)],
                  L("左端の「発表スライドと論文の対応」から PDF か PPTX を取り込むと、スライドが論文の左に並びます。",
                    "Import a PDF or PPTX from 発表スライドと論文の対応 (Slides and paper) on the left edge, and the slides appear to the left of the paper."),
                  mobile=(0, 180, 1500, 1118)),
            scene("slides-linked", (100, 740, 1300, 1450), [box(*GROUP)],
                  L("「囲む」（R）でスライドをドラッグすると、Markup-02.01 のような名前のグループになります。",
                    "Drag across the slide with 囲む (Box, R), and the area becomes a group named like Markup-02.01.")),
            scene("slides-linked", (1550, 130, 2934, 995), [box(1612, 206, 1998, 290, L("文章・図・数式", "文章 · 図 · 数式")), box(*PASSAGE)],
                  L("グループを選んだまま、論文の文・図・数式を選ぶと、同じ色の線で結ばれます。",
                    "With the group selected, pick a sentence (文章), figure (図), or equation (数式) in the paper, and a line in the group's color joins them.")),
            scene("slides-linked", FULL, [box(*GROUP), box(*MARK_TOP, L("色の印", "Marker")), box(*MARK_LOW)],
                  L("グループを押すと論文の該当箇所へ、論文側の色の印を押すとスライドへ移ります。",
                    "Click a group to jump to the passage; click the colored marker in the paper to jump to the slide."),
                  mobile=(1300, 600, 2934, 1421)),
            scene("slides-linked", (1640, 150, 2934, 960),
                  [box(2012, 206, 2306, 290, L("選んだ線だけ", "選んだ線だけ (Selected lines)")), box(2333, 208, 2507, 292, L("全画面 P", "全画面 (Full screen) P"))],
                  L("「全画面」（P）で、スライドと論文を線ごと映して発表できます。「選んだ線だけ」で、選んでいるグループの線だけを表示します。",
                    "全画面 (Full screen, P) presents the slides and paper, lines included. 選んだ線だけ (Selected lines) shows only the selected group's lines.")),
        ],
    },
    # E-2 補足情報（場面 i = 詳細ページの手順 i）
    "supplement": {
        "base": "equation", "aspect": 16 / 10,
        "scenes": [
            scene("equation", (1020, 150, 2934, 1100), [box(2740, 206, 2912, 292), underline(1050, 482, 1740)],
                  L("右上の［補足情報］に切り替えると、論文の右に対訳・訳・用語・数式のタブが並びます。",
                    "Switch to 補足情報 (Companion) at the top right, and tabs for 対訳 (Side by side), 訳 (Highlights), 用語 (Terms), and 数式 (Equations) sit to the right of the paper.")),
            scene("glossary", (1020, 380, 2900, 1555),
                  [underline(1287, 482, 1450), box(1072, 846, 2834, 1030), box(1072, 1040, 2300, 1158)],
                  L("「用語を調べる」を押すと、Claude が意味・詳しい説明・この論文での使われ方・関連する用語をまとめます。",
                    "Choose 用語を調べる (Look up term), and Claude writes up the meaning, details, how this paper uses it, and related terms.")),
            scene("equation", (1000, 555, 2934, 1764), [box(1083, 996, 2851, 1197, L("TeX", "TeX")), underline(1083, 1379, 2851), box(1083, 1418, 2854, 1759)],
                  L("式を選んで「数式にする」を押すと、Claude が TeX に書き起こし、式の役割と記号ごとの意味を添えます。",
                    "Select an equation and choose 数式にする (Make equation). Claude transcribes it into TeX and explains what it does and what each symbol means.")),
            # 仮: 対訳タブの画面がまだ無い。吹き出しは付けない（ページ側で「画面は準備中」を出す）
            scene("equation", (1020, 330, 2100, 1005), [],
                  L("Claude に頼んだ全文の訳は、対訳タブに 1 文ずつ並びます。",
                    "The full translation you ask Claude for fills the 対訳 (Side by side) tab, one sentence at a time.")),
            scene("equation", FULL, [box(210, 1450, 560, 1614), box(2740, 206, 2912, 292)],
                  L("スライドの画面でも［論文｜補足情報］に切り替えられます。式や用語の場所を押すと、論文がそこへ動きます。",
                    "The slides view can switch to [paper | 補足情報] too. Click where an equation or term appears, and the paper moves there."),
                  mobile=(0, 1000, 1460, 1836)),
        ],
    },
    # E-3 単語帳とグラフ（場面 0〜2 = 単語帳、3〜4 = グラフ）
    "wordbook-graph": {
        "base": "wordbook", "aspect": 16 / 10,
        "scenes": [
            scene("wordbook", FULL, [box(18, 198, 96, 278), box(884, 204, 1062, 286)],
                  L("左端の「リスト（用語・数式）」を開くと、すべての論文の用語が単語帳に並びます。",
                    "Open リスト (Lists) on the left edge, and terms from all your papers fill the 単語帳 (Wordbook)."),
                  mobile=(0, 150, 800, 650)),
            scene("wordbook", (150, 90, 2650, 1652),
                  [box(176, 166, 777, 252, L("検索", "Search")), box(178, 430, 777, 506), box(2016, 266, 2584, 350, L("並べ替え", "Sort"))],
                  L("検索欄で絞り込み、「論文・ページ順」と「五十音・ABC順」を切り替えます。「数式帳」には書き起こした式が並びます。",
                    "Narrow the list with the search box, and switch between 論文・ページ順 (by paper and page) and 五十音・ABC順 (alphabetical). 数式帳 (Equations) lists your transcribed equations.")),
            scene("wordbook", (860, 470, 2120, 1257), [box(884, 870, 1026, 940)],
                  L("項目のページ番号を押すと、その論文の該当ページが開きます。",
                    "Click an entry's page number to open the paper at that page.")),
            scene("graph-overview", (760, 380, 2480, 1760),
                  [box(1076, 654, 1745, 704), box(1774, 1260, 2440, 1310), box(1300, 850, 1460, 1000, L("共通の用語", "Shared terms"))],
                  L("「グラフ」では論文と用語が線で結ばれます。同じ用語を使う論文どうしは、その用語を通してつながります。",
                    "In グラフ (Graph), papers and terms are joined by lines. Papers that use the same term connect through it."),
                  mobile=(1000, 560, 2460, 1473)),
            scene("graph-term", (566, 105, 2934, 1585), [box(988, 936, 1540, 1014), box(2048, 966, 2834, 1152)],
                  L("用語を選ぶと、意味と「出てくる論文」が表示されます。",
                    "Select a term to see its meaning and 出てくる論文 (the papers that use it).")),
        ],
    },
    # E-4 Claude と使う（MCP）。Claude の画面は無いので、MCP で書き込んだ結果のアプリ画面だけを見せる。
    # ページ側で CSS のチャットと組み合わせる（チャットの i 行目 = 場面 i）。
    "mcp": {
        "base": "equation", "aspect": 16 / 10,
        "scenes": [
            # add_equation
            scene("equation", (1000, 330, 2934, 1539), [underline(1458, 482, 1632), box(1083, 626, 2851, 987)],
                  L("「式 (11) を解説して」と頼むと、Claude が TeX に書き起こし、数式タブに登録します。",
                    "Ask \"Explain equation (11),\" and Claude transcribes it into TeX and adds it to the 数式 (Equations) tab.")),
            # add_term
            scene("glossary", (1000, 380, 2934, 1589), [box(1048, 494, 2878, 1178), box(2648, 492, 2742, 545)],
                  L("「この用語も調べて入れておいて」と頼むと、用語タブに入ります。「編集」でいつでも直せます。",
                    "Ask \"Look this term up too,\" and it goes into the 用語 (Terms) tab. 編集 (Edit) lets you change it any time.")),
            # link_slide_markup
            scene("slides-linked", HERO_RECT, [box(*GROUP), box(*PASSAGE)],
                  L("スライドのグループを論文の箇所とリンクするよう頼むと、両方が同じ色の線で結ばれます。",
                    "Ask Claude to link a slide group to a passage in the paper, and a line in the group's color joins them."),
                  mobile=PAPER_SIDE),
        ],
    },
    # 論文一覧と検索（縦長の枠）
    "library-search": {
        "base": "library", "aspect": 3 / 4,
        "scenes": [
            scene("library", (0, 0, 636, 848), [box(16, 28, 90, 102)],
                  L("左端の「論文一覧」に、取り込んだ論文が並びます。",
                    "Papers you import are listed under 論文一覧 (Papers) on the left edge.")),
            scene("library", (0, 90, 636, 938), [box(130, 128, 620, 218)],
                  L("一覧の上の検索欄に、題名・著者・年・タグを入れて絞り込みます。",
                    "Type a title, author, year, or tag into the search box to narrow the list.")),
            scene("library", (0, 330, 636, 1178), [box(264, 394, 518, 456)],
                  L("追加日・題名・発行年で並べ替えられます。",
                    "Sort by date added, title, or year.")),
            scene("library", (0, 482, 636, 1330), [box(158, 1232, 584, 1298)],
                  L("「すべての BibTeX を書き出す」で、一覧の論文をまとめて書き出せます。",
                    "すべての BibTeX を書き出す (Export all BibTeX) exports every paper in the list at once.")),
            scene("library", (0, 0, 636, 848), [box(16, 116, 90, 190)],
                  L("左端の「検索」では、論文の題名と、マーカーに付けた訳・メモ、用語、数式を探せます。",
                    "検索 (Search) on the left edge looks through paper titles and what you've written down: highlight translations and notes, terms, and equations.")),
        ],
    },
}

# 場面に合う画面がまだ無く、近い画面で代わりに見せている場面（0 始まり）。吹き出しは付けない。撮り直したら差し替える。
PLACEHOLDERS = {
    "supplement": {3: "対訳タブを開いた補足情報"},
}

# Stage を始める場面（いちばん機能が伝わる場面）。0 始まり
STRONGEST = {"hero": 0, "slides-link": 2, "supplement": 2, "wordbook-graph": 4, "mcp": 0, "library-search": 1}


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
            if sc["mobile"]:
                m = fit(sc["mobile"], fr, st["aspect"])
                o["mobileRect"] = {"x": pct(m[0], W), "y": pct(m[1], H), "w": pct(m[2] - m[0], W), "h": pct(m[3] - m[1], H)}
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
            for i in PLACEHOLDERS[k]:
                assert not st["scenes"][i]["callouts"], (k, i, "仮の場面には吹き出しを付けない")
        m["strongestScene"] = STRONGEST[k]
        assert 0 <= STRONGEST[k] < len(st["scenes"]), k
        meta[k] = m
    lines = [
        "/**",
        " * ScreenStage の場面データ。scripts/make-stages.py が書き出す（手で直さず、スクリプトを直して再実行する）。",
        " *",
        " * - 座標はすべて画像に対する割合（0〜100）。1 つの Stage の中の画像（src と各 scene.src）は同じ大きさ。",
        " * - scene.src の 800w 版は同じ名前に -800 を付けたファイル（例: equation.webp → equation-800.webp）。",
        " * - 吹き出し: box は (x, y) が左上で w, h が大きさ。dot は (x, y) が中心。underline は (x, y) が左端で w が長さ。",
        " * - rect と mobileRect は枠の縦横比（stageMeta[key].aspect）に合わせてある。mobileRect は狭い画面の静止画用の、より寄った範囲（無い場面もある）。",
        " * - 場面の並びは詳細ページの手順の順（components/features/data.tsx の stepScenes で対応させる）。最初に見せる場面は stageMeta[key].strongestScene。",
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
        " * - placeholders: 合う画面がまだ無く、近い画面で代わりに見せている場面の番号（0 始まり）。吹き出しは付けていない。",
        " * - strongestScene: 機能がいちばん伝わる場面の番号（0 始まり）。Stage はここから始める。",
        " */",
        "export const stageMeta: Record<StageKey, { aspect: \"16/10\" | \"3/4\"; pairWithChat?: boolean; placeholders?: number[]; strongestScene: number }> = "
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
            tag = (" [仮]" if i in PLACEHOLDERS.get(key, {}) else "") + (" ★" if i == STRONGEST[key] else "") + (" +mobile" if sc["mobile"] else "")
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
            if sc["mobile"]:
                m = fit(sc["mobile"], base, st["aspect"])
                d.rectangle(tuple(v * s for v in m), outline=(80, 220, 255), width=2)
                d.text((m[0] * s + 6, m[1] * s + 4), f"{i + 1}m", fill=(80, 220, 255), font=font(18, True))
        ov.save(DEBUG / f"stage-{key}-map.png")
        # 狭い画面（358px）での見え方: mobileRect があればそれ、無ければ rect
        mw = 358
        mh = round(mw / st["aspect"])
        msheet = Image.new("RGB", (n * (mw + 16) + 16, mh + 60), (250, 250, 250))
        for i, sc in enumerate(st["scenes"]):
            fr = frames[sc["frame"]]
            r = fit(sc["mobile"] or sc["rect"], fr, st["aspect"])
            view = fr.crop(tuple(round(v) for v in r)).resize((mw, mh), Image.LANCZOS)
            k = mw / (r[2] - r[0])
            draw_callouts(ImageDraw.Draw(view), sc["callouts"], lambda x, y: ((x - r[0]) * k, (y - r[1]) * k), k)
            msheet.paste(view, (16 + i * (mw + 16), 16))
            ImageDraw.Draw(msheet).text((16 + i * (mw + 16), mh + 24), f"{i + 1}{' mobileRect' if sc['mobile'] else ''}", fill=(60, 60, 60), font=font(14))
        msheet.save(DEBUG / f"stage-{key}-mobile.png")
    print("debug ->", DEBUG)


# ---------------------------------------------------------------- ヒーローの画像

def save_widths(im, name, widths):
    for i, w in enumerate(widths):
        out = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        out.save(OUT / (f"{name}.webp" if i == 0 else f"{name}-{w}.webp"), "WEBP", quality=86, method=6)
        print(name, w, out.size)


def make_hero():
    """トップのヒーロー: スライドと論文が線で結ばれた画面（発表者名はぼかし済み）。
    hero-linked.webp（2400w, 2:1）と -1200 / -800、狭い画面用の hero-linked-mobile.webp（1200w, 4:3）と -800。"""
    fr = frames["slides-linked"]
    save_widths(fr.crop(HERO_RECT), "hero-linked", [2400, 1200, 800])
    save_widths(fr.crop(HERO_MOBILE_RECT), "hero-linked-mobile", [1200, 800])


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
        "slides-link": ("slides-linked", HERO_RECT),
        "supplement": ("equation", (1000, 520, 2934, 1487)),
        "wordbook-graph": ("graph-overview", (420, 300, 2500, 1760)),
        # MCP は補足情報の画面だと supplement と見分けにくいので、Claude がつないだ線が論文に入るところ
        "mcp": ("slides-linked", (1300, 560, 2934, 1310)),
    }
    for slug, (frame, rect) in picks.items():
        og_canvas(og_crop(frame, rect), (80, 116)).save(OG / f"feature-{slug}.png", optimize=True)
        print("og", slug)
    lib = frames["library"]
    h = 478
    card = lib.resize((round(lib.width * h / lib.height), h), Image.LANCZOS)
    og_canvas(card, ((1200 - card.width) // 2, 116)).save(OG / "feature-library-search.png", optimize=True)
    print("og library-search")
    # トップ: ヒーローと同じ、スライドと論文が線で結ばれた画面
    card = frames["slides-linked"].crop(HERO_RECT).resize((1000, 500), Image.LANCZOS)
    og_canvas(card, (100, 108)).save(OG / "site.png", optimize=True)
    print("og site")


data = build()
write_ts(data)
make_hero()
make_og()
if DEBUG:
    debug_sheets()
