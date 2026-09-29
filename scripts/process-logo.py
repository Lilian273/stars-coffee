"""Remove black background; render side stars white."""
from __future__ import annotations

import math
from collections import deque
from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parents[1] / "FRONTEND" / "assets" / "logo.png"
OUT = SRC


def luminance(r: int, g: int, b: int) -> int:
    return r + g + b


def is_green(r: int, g: int, b: int) -> bool:
    return g > 95 and g > r + 15 and g > b + 5


def is_white(r: int, g: int, b: int) -> bool:
    return r > 200 and g > 200 and b > 200


def emblem_radius(px, w: int, h: int) -> tuple[float, float, float]:
    cx, cy = w / 2, h / 2
    r_max = 0.0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_green(r, g, b) or is_white(r, g, b):
                r_max = max(r_max, math.hypot(x - cx, y - cy))
    return cx, cy, r_max


def flood_transparent(px, w: int, h: int, match_fn, seeds: list[tuple[int, int]]) -> None:
    seen = set()
    q = deque(seeds)
    while q:
        x, y = q.popleft()
        if (x, y) in seen or x < 0 or y < 0 or x >= w or y >= h:
            continue
        r, g, b, a = px[x, y]
        if a == 0 or not match_fn(r, g, b):
            continue
        seen.add((x, y))
        px[x, y] = (r, g, b, 0)
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])


def neighbors4(x: int, y: int) -> list[tuple[int, int]]:
    return [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]


def is_stroke_black(px, w: int, h: int, x: int, y: int) -> bool:
    """Keep 1px outlines; drop solid black fills (inner disk, etc.)."""
    has_white = has_green = has_clear = False
    dark_near = 0
    for dy in range(-1, 2):
        for dx in range(-1, 2):
            if dx == 0 and dy == 0:
                continue
            nx, ny = x + dx, y + dy
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                has_clear = True
                continue
            nr, ng, nb, na = px[nx, ny]
            if na == 0:
                has_clear = True
            elif is_white(nr, ng, nb):
                has_white = True
            elif is_green(nr, ng, nb):
                has_green = True
            if na and luminance(nr, ng, nb) <= 12:
                dark_near += 1
    if has_clear and (has_white or has_green):
        return True
    if has_white and has_green:
        return True
    if has_white and dark_near <= 4:
        return True
    return False


def remove_black_fills(px, w: int, h: int) -> None:
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or luminance(r, g, b) > 12:
                continue
            if is_stroke_black(px, w, h, x, y):
                continue
            px[x, y] = (0, 0, 0, 0)


def clean_gray_fringe(px, w: int, h: int) -> None:
    """Remove neutral gray leftovers from anti-aliased black fills."""
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or is_green(r, g, b) or is_white(r, g, b):
                continue
            if max(r, g, b) - min(r, g, b) > 18:
                continue
            if luminance(r, g, b) < 200:
                px[x, y] = (0, 0, 0, 0)


def whiten_side_stars(px, w: int, h: int, cx: float, cy: float, r_emblem: float) -> None:
    """After background removal, remaining dark pixels outside the wreath are stars."""
    margin = 10
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or luminance(r, g, b) > 100:
                continue
            if math.hypot(x - cx, y - cy) <= r_emblem + margin:
                continue
            px[x, y] = (255, 255, 255, 255)


def main() -> None:
    # Always process from the original upload if present.
    original = Path(
        r"C:\Users\lilia\.cursor\projects\c-Users-lilia-OneDrive-Desktop-stars-coffee\assets"
        r"\c__Users_lilia_AppData_Roaming_Cursor_User_workspaceStorage_e7584cf66b02c933574460019a82b891_images_ZZZZ-4b7ecdb5-d631-4465-99e7-908e2a47d019.png"
    )
    source = original if original.is_file() else SRC
    im = Image.open(source).convert("RGBA")
    w, h = im.size
    px = im.load()
    cx, cy, r_emblem = emblem_radius(px, w, h)

    def is_bg_black(r: int, g: int, b: int) -> bool:
        return luminance(r, g, b) <= 12

    seeds: list[tuple[int, int]] = []
    for x in range(w):
        seeds.append((x, 0))
        seeds.append((x, h - 1))
    for y in range(h):
        seeds.append((0, y))
        seeds.append((w - 1, y))

    flood_transparent(px, w, h, is_bg_black, seeds)
    whiten_side_stars(px, w, h, cx, cy, r_emblem)

    remove_black_fills(px, w, h)
    clean_gray_fringe(px, w, h)

    im.save(OUT, "PNG")
    og = OUT.parent / "og-image.png"
    im.save(og, "PNG")
    print(f"Wrote {OUT} and {og}")


if __name__ == "__main__":
    main()
