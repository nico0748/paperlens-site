"""サイト用のスクリーンショットを作る。python3 shots.py <入力フォルダ> <出力フォルダ>"""
import sys
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
BG = (31, 31, 37)


def load(n):
    return Image.open(f"{src}/{n}.png").convert("RGB")


def blur(im, box):
    region = im.crop(box).filter(ImageFilter.GaussianBlur(9))
    im.paste(region, box[:2])


def save(im, name, width):
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(f"{out}/{name}.webp", "WEBP", quality=84, method=6)
    print(name, im.size)


# 1 枚目: ツールチップを消し、発表者名をぼかして、Mac の画面に入れる
a = load(1)
icon = load(2).crop((26, 26, 82, 82))
d = ImageDraw.Draw(a)
d.rectangle((0, 33, 113, 128), fill=BG)
a.paste(icon, (56 - 28, 92 - 28))
blur(a, (270, 930, 640, 980))
a = a.crop((0, 33, a.width, a.height))

W = 2200
H = round(W * a.height / a.width)
screen = a.resize((W, H), Image.LANCZOS)
bez, top, R = 30, 44, 56
fw, fh = W + bez * 2, H + bez + top
base_h, lip = 64, 18
cw = fw + 220
canvas = Image.new("RGBA", (cw, fh + base_h + 40), (0, 0, 0, 0))
ox = (cw - fw) // 2
# 影
shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
ImageDraw.Draw(shadow).rounded_rectangle((60, fh + base_h - 10, cw - 60, fh + base_h + 22), 30, fill=(0, 0, 0, 150))
canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(14)))
d = ImageDraw.Draw(canvas)
# 外枠（アルミの縁）と黒いベゼル
d.rounded_rectangle((ox - 4, -0, ox + fw + 4, fh + 2), R + 4, fill=(120, 122, 130))
d.rounded_rectangle((ox, 3, ox + fw, fh), R, fill=(10, 10, 12))
canvas.paste(screen, (ox + bez, top))
# ノッチ
nw = 220
d.rounded_rectangle((ox + fw // 2 - nw // 2, 0, ox + fw // 2 + nw // 2, top + 12), 16, fill=(10, 10, 12))
d.ellipse((ox + fw // 2 - 7, 14, ox + fw // 2 + 7, 28), fill=(30, 32, 40))
# 本体（キーボード側の縁）
by = fh
body = Image.new("RGBA", (cw, base_h), (0, 0, 0, 0))
bd = ImageDraw.Draw(body)
for i in range(base_h - 18):
    t = i / (base_h - 18)
    c = tuple(round(v) for v in (214 - 70 * t, 216 - 70 * t, 222 - 68 * t))
    bd.line((0 + i * 0.6, i, cw - i * 0.6, i), fill=c + (255,))
bd.rounded_rectangle((60, base_h - 22, cw - 60, base_h - 4), 10, fill=(96, 98, 104, 255))
bd.rounded_rectangle((cw // 2 - 200, 0, cw // 2 + 200, lip), 12, fill=(150, 152, 160, 255))
canvas.alpha_composite(body, (0, by))
canvas = canvas.resize((1600, round(canvas.height * 1600 / canvas.width)), Image.LANCZOS)
canvas.save(f"{out}/hero-mac.webp", "WEBP", quality=86, method=6)
canvas.save(f"{out}/hero-mac-preview.png")
print("hero-mac", canvas.size)

# 2 枚目: スライドと論文をつなぐ線（発表者名をぼかす）
b = load(2)
blur(b, (270, 462, 610, 502))
save(b.crop((118, 740, 2940, 1757)), "slides-link", 1800)
# 3 枚目: 数式の解説
save(load(3).crop((1036, 507, 2888, 1786)), "equation", 1400)
# 4 枚目: 用語の解説
save(load(4).crop((1029, 492, 2888, 1760)), "glossary", 1400)
# 5 枚目: グラフ（用語の詳細）
save(load(5).crop((118, 110, 2940, 1779)), "graph-term", 1600)
# 6 枚目: グラフ（全体）
save(load(6).crop((118, 206, 2925, 1764)), "graph-overview", 1600)
# 7 枚目: 単語帳
save(load(7).crop((147, 147, 2793, 1717)), "wordbook", 1600)
