import sys
from PIL import Image
B = sys.argv[1]
tile = Image.open(f"{B}/source/app-icon-original.png").convert("RGBA")
# 角丸タイル(不透明部分)を Apple の基準どおり 1024 中 824px にそろえる
x0, y0, x1, y1 = tile.split()[3].point(lambda v: 255 if v > 200 else 0).getbbox()
side = max(x1 - x0, y1 - y0)
s = 824 / side
small = tile.resize((round(tile.width * s), round(tile.height * s)), Image.LANCZOS)
cx, cy = (x0 + x1) / 2 * s, (y0 + y1) / 2 * s
out = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
out.alpha_composite(small, (round(512 - cx), round(512 - cy)))
out.save(f"{B}/icon.png")
# apple-touch-icon 用: 角丸の外を塗りつぶした正方形
cside = min(x1 - x0, y1 - y0)
mx, my = (x0 + x1) / 2, (y0 + y1) / 2
sq = tile.crop((round(mx - cside / 2), round(my - cside / 2), round(mx + cside / 2), round(my + cside / 2)))
bg = Image.new("RGBA", sq.size, tile.getpixel((round(x0 + 60), round(my)))[:3] + (255,))
bg.alpha_composite(sq)
bg.convert("RGB").resize((1024, 1024), Image.LANCZOS).save(f"{B}/icon-full-bleed.png")
# タイル無しの印: 図柄を中央に置いた正方形
mark = Image.open(f"{B}/source/mark-original.png").convert("RGBA")
x0, y0, x1, y1 = mark.split()[3].point(lambda v: 255 if v > 200 else 0).getbbox()
side = max(x1 - x0, y1 - y0) * 1.08
mx, my = (x0 + x1) / 2, (y0 + y1) / 2
mark.crop((round(mx - side / 2), round(my - side / 2), round(mx + side / 2), round(my + side / 2))).resize((1024, 1024), Image.LANCZOS).save(f"{B}/icon-mark.png")
print("ok", tile.getpixel((round(x0), round(my))))
