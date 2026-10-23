"""brand/source/icon-original.png（象牙色の P と虫眼鏡、背景は透明）から、アプリのタイルとサイト用の印を作る。"""
import sys
from PIL import Image, ImageDraw, ImageChops
src, out = sys.argv[1], sys.argv[2]
g = Image.open(src).convert("RGBA")
# ほぼ透明なにじみ（alpha 1 の白）を消す
a = g.split()[3].point(lambda v: 0 if v < 8 else v)
g.putalpha(a)
g = g.crop(a.getbbox())  # 図柄だけ
NAVY_TOP, NAVY_BOT = (30, 36, 96), (11, 14, 42)  # --navy-800 → --navy-950

def tile(size, margin, radius, glyph_ratio):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    t = size - margin * 2
    grad = Image.new("RGBA", (t, t))
    d = ImageDraw.Draw(grad)
    for y in range(t):
        k = y / (t - 1)
        d.line((0, y, t, y), fill=tuple(round(NAVY_TOP[i] + (NAVY_BOT[i] - NAVY_TOP[i]) * k) for i in range(3)) + (255,))
    mask = Image.new("L", (t, t), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, t - 1, t - 1), radius, fill=255)
    im.paste(grad, (margin, margin), mask)
    gw = round(t * glyph_ratio)
    gh = round(g.height * gw / g.width)
    gl = g.resize((gw, gh), Image.LANCZOS)
    im.alpha_composite(gl, (margin + (t - gw) // 2, margin + (t - gh) // 2))
    return im

tile(1024, 100, 185, 0.66).save(f"{out}/icon.png")
fb = tile(1024, 0, 0, 0.62).convert("RGB")
fb.save(f"{out}/icon-full-bleed.png")

def mark(color=None):
    side = round(max(g.size) * 1.06)
    im = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    gl = g.copy()
    if color:
        solid = Image.new("RGBA", gl.size, color + (255,))
        solid.putalpha(gl.split()[3])
        gl = solid
    im.alpha_composite(gl, ((side - gl.width) // 2, (side - gl.height) // 2))
    return im.resize((1024, 1024), Image.LANCZOS)

mark().save(f"{out}/icon-mark-light.png")          # 暗い背景用（象牙色）
mark((20, 26, 74)).save(f"{out}/icon-mark.png")     # 明るい背景用（--navy-900）
print("ok", g.size)
