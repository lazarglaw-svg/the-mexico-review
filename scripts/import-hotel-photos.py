#!/usr/bin/env python3
"""Import three licence-verified Commons photographs as first-party WebP media.

Intentionally fetches binary media in CI, not browsers; commits the verified assets
and replaces all brittle Commons thumbnail URLs site-wide. No generated imagery.
"""
from __future__ import annotations
import hashlib
import io
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "nima-local-house": "A_house_in_Colonia_Roma,_Mexico_City.jpg",
    "casa-tortugas": "Laguna_Nichupté.jpg",
    "villa-ganz": "Vaulted_Brick_Ceiling_(16684853114).jpg",
}
AGENT = "TheMexicoReviewMediaImporter/1.0 (https://themexicoreview.com/; editorial)"
OUT = ROOT / "assets/editorial/hotels"
OUT.mkdir(parents=True, exist_ok=True)


def get_bytes(url):
    req = urllib.request.Request(url, headers={
        "User-Agent": AGENT,
        "Accept": "image/jpeg,image/*;q=0.8,*/*;q=0.5",
        "Referer": "https://commons.wikimedia.org/",
    })
    with urllib.request.urlopen(req, timeout=35) as response:
        blob = response.read(12 * 1024 * 1024)
        if len(blob) < 5_000 or not blob.startswith(b"\xff\xd8\xff"):
            raise ValueError("Invalid JPEG content; code " + str(response.status))
        return blob


def download_source(name):
    digest = hashlib.md5(name.encode("utf-8")).hexdigest()
    encoded = urllib.parse.quote(name, safe="")
    base = f"https://upload.wikimedia.org/wikipedia/commons/{digest[0]}/{digest[:2]}/{encoded}"
    candidates = [
        base,
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/" + encoded,
    ]
    errors = []
    for url in candidates:
        for attempt in range(3):
            try:
                data = get_bytes(url)
                print("Downloaded", name, len(data), "bytes", flush=True)
                return data
            except Exception as ex:
                errors.append(f"{url} ({type(ex).__name__}: {ex})")
                time.sleep(attempt + 1)
    raise RuntimeError("Could not download Commons file " + name + ": " + "; ".join(errors))


def optimize(data, path):
    with Image.open(io.BytesIO(data)) as original:
        original.verify()
    with Image.open(io.BytesIO(data)) as original:
        rgb = ImageOps.exif_transpose(original).convert("RGB")
        rgb.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        rgb.save(path, "WEBP", quality=85, method=6)
        print("Saved", path.relative_to(ROOT), rgb.size, path.stat().st_size, flush=True)
        with Image.open(path) as check:
            check.verify()
        if path.stat().st_size < 10_000:
            raise ValueError("Output unexpectedly small: " + str(path))


def swap_html(slug, filename):
    # Each old image was a thumb.wikimedia resource; match any invalid hash or size.
    escaped = re.escape(urllib.parse.quote(filename, safe=""))
    thumb_pattern = re.compile(
        r"https://upload\.wikimedia\.org/wikipedia/commons/thumb/"
        r"[0-9a-f]/[0-9a-f]{2}/" + escaped + r"/[^\"'<>\s]+?\.jpg",
        re.IGNORECASE,
    )
    target = "/assets/editorial/hotels/" + slug + ".webp"
    edits = []
    instances = 0
    for file in ROOT.rglob("index.html"):
        if any(part in {".git", "node_modules"} for part in file.parts):
            continue
        text = file.read_text(encoding="utf-8")
        updated, count = thumb_pattern.subn(target, text)
        if count:
            updated = updated.replace(
                "Displayed cropped; original photo unmodified.",
                "Locally optimized as WebP and displayed cropped; original photograph remains on Commons.",
            ).replace(
                "Visualización recortada; archivo original sin modificar.",
                "Archivo optimizado a WebP y mostrado recortado; la foto original permanece en Commons.",
            )
            file.write_text(updated, encoding="utf-8")
            edits.append(str(file.relative_to(ROOT)))
            instances += count
    if instances < 2:
        raise RuntimeError(f"Expected site references not found for {filename}: only {instances}")
    print("Updated", instances, "references for", slug, "across", len(edits), "pages", flush=True)
    return instances


def main():
    # Fetch and validate all sources before updating HTML to guarantee atomically valid pages.
    for slug, filename in FILES.items():
        raw = download_source(filename)
        optimize(raw, OUT / (slug + ".webp"))
    total = sum(swap_html(slug, filename) for slug, filename in FILES.items())
    if total < 24:
        raise RuntimeError(f"Too few references updated ({total}); aborting")
    print("All hotel images downloaded, verified and localized;", total, "HTML image references updated.", flush=True)


if __name__ == "__main__":
    main()
