"""サイト全体の OGP 画像（public/og/site.png、1200×630）を作る。
Mac の画面に PaperLens を映した宣材（public/screenshots/hero-mac.webp）を右に、ロゴとキャッチを左に置く。
python3 -I scripts/make-og.py  （macOS のヒラギノを使う）"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
FONTS = Path("/System/Library/Fonts")
W, H = 1200, 630
TOP, BOT = (60, 66, 121), (29, 32, 54)  # --navy-800 → --navy-950

img = Image.new("RGB", (W, H))
d = ImageDraw.Draw(img)
for y in range(H):
    k = y / (H - 1)
    d.line((0, y, W, y), fill=tuple(round(TOP[i] + (BOT[i] - TOP[i]) * k) for i in range(3)))
# 右上をほんのり明るく
glow = Image.new("L", (W, H), 0)
ImageDraw.Draw(glow).ellipse((650, -250, 1450, 450), fill=70)
img = Image.composite(Image.new("RGB", (W, H), (120, 128, 200)), img, glow.filter(ImageFilter.GaussianBlur(120)))

# 宣材（Mac）を右に。台座まで見せて「PC に映ったアプリ」と分かるようにする
mac = Image.open(ROOT / "public/screenshots/hero-mac.webp").convert("RGBA")
mw = 680
mac = mac.resize((mw, round(mac.height * mw / mac.width)), Image.LANCZOS)
img.paste(mac, (W - mw + 20, (H - mac.height) // 2 + 30), mac)

# 左: ロゴ・名前・キャッチ・一行
d = ImageDraw.Draw(img)
mark = Image.open(ROOT / "brand/icon-mark-light.png").convert("RGBA").resize((64, 64), Image.LANCZOS)
img.paste(mark, (64, 70), mark)
sans_b = ImageFont.truetype(str(FONTS / "ヒラギノ角ゴシック W6.ttc"), 40)
sans = ImageFont.truetype(str(FONTS / "ヒラギノ角ゴシック W4.ttc"), 24)
mincho = ImageFont.truetype(str(FONTS / "ヒラギノ明朝 ProN.ttc"), 62, index=1)
d.text((144, 78), "PaperLens", font=sans_b, fill=(255, 255, 255))
d.text((64, 200), "伝えるスライド。", font=mincho, fill=(255, 255, 255))
d.text((64, 285), "確かめる原文。", font=mincho, fill=(255, 255, 255))
bw = d.textlength("確かめる原文。", font=mincho)
d.rectangle((64, 362, 64 + bw, 368), fill=(255, 224, 131))  # マーカーの黄
d.text((64, 410), "スライドと論文を直接つなぐ、", font=sans, fill=(214, 218, 245))
d.text((64, 446), "輪講と精読のための論文リーダー。", font=sans, fill=(214, 218, 245))

out = ROOT / "public/og/site.png"
img.save(out, optimize=True)
print(out, img.size)
