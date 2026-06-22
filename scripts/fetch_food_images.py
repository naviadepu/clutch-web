#!/usr/bin/env python3
"""Pull a relevant photo for every loggable food into public/images/food/.

Source: TheMealDB (free, no key) — plated meal thumbnails for dishes, clean
ingredient cut-outs for single ingredients. Saves the first candidate that
returns a real image, then prints a manifest we use to build the TS map.
"""
import json, os, sys, urllib.request, urllib.parse

OUT = "public/images/food"
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (clutch-build)"}


def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20)


def ing_urls(name):
    n = urllib.parse.quote(name)
    base = "https://www.themealdb.com/images/ingredients"
    return [f"{base}/{n}-Medium.png", f"{base}/{n}.png", f"{base}/{n}-Small.png"]


def meal_urls(query):
    url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + urllib.parse.quote(query)
    try:
        meals = json.load(fetch(url)).get("meals") or []
    except Exception:
        return []
    return [m["strMealThumb"] for m in meals if m.get("strMealThumb")]


# slug -> ordered candidate sources. ("m", q)=meal search, ("i", name)=ingredient
PLAN = {
    "dal": [("m", "dal"), ("i", "Red Lentils"), ("i", "Lentils")],
    "roti": [("m", "roti"), ("m", "chapati"), ("i", "Flour")],
    "rice": [("i", "Rice"), ("m", "rice")],
    "curd": [("i", "Yogurt"), ("i", "Greek Yogurt")],
    "chai": [("m", "masala chai"), ("i", "Tea"), ("m", "chai")],
    "paneer": [("i", "Paneer"), ("m", "paneer")],
    "idli": [("m", "idli"), ("m", "idly")],
    "dosa": [("m", "dosa"), ("m", "masala dosa")],
    "rajma": [("m", "rajma"), ("i", "Kidney Beans")],
    "sabzi": [("m", "sabzi"), ("m", "bhaji"), ("i", "Spinach")],
    "pickle": [("i", "Gherkin"), ("i", "Pickle")],
    "ghee": [("i", "Ghee"), ("i", "Butter")],
    "hummus": [("i", "Hummus"), ("m", "hummus")],
    "olive oil": [("i", "Olive Oil")],
    "grilled fish": [("m", "grilled fish"), ("m", "salmon"), ("i", "Salmon")],
    "feta": [("i", "Feta"), ("m", "feta")],
    "falafel": [("m", "falafel"), ("i", "Falafel")],
    "tabbouleh": [("m", "tabbouleh"), ("i", "Bulgur Wheat")],
    "pita": [("i", "Pita Bread"), ("i", "Bread")],
    "lentil soup": [("m", "lentil soup"), ("m", "lentil"), ("i", "Lentils")],
    "greek yogurt": [("i", "Greek Yogurt"), ("i", "Yogurt")],
    "olives": [("i", "Olives"), ("i", "Black Olives")],
    "miso udon": [("m", "udon"), ("m", "miso"), ("i", "Udon Noodles")],
    "tofu": [("i", "Tofu"), ("m", "tofu")],
    "kimchi": [("i", "Kimchi"), ("m", "kimchi")],
    "ramen": [("m", "ramen"), ("i", "Noodles")],
    "congee": [("m", "congee"), ("i", "Rice")],
    "dumplings": [("m", "dumplings"), ("i", "Dumplings")],
    "edamame": [("i", "Edamame"), ("m", "edamame")],
    "beans": [("i", "Black Beans"), ("i", "Kidney Beans")],
    "tortilla": [("i", "Tortillas"), ("i", "Flour Tortilla")],
    "avocado": [("i", "Avocado"), ("m", "avocado")],
    "eggs": [("i", "Eggs"), ("i", "Egg")],
    "salsa": [("i", "Salsa"), ("m", "salsa")],
    "plantain": [("i", "Plantain"), ("m", "plantain")],
    "oatmeal": [("i", "Oats"), ("i", "Oatmeal"), ("m", "porridge")],
    "smoothie": [("m", "smoothie"), ("i", "Strawberries")],
    "sandwich": [("m", "sandwich"), ("i", "Bread")],
    "coffee": [("i", "Coffee"), ("i", "Instant Coffee")],
    "salad": [("m", "salad"), ("i", "Lettuce")],
}


def candidate_urls(kind, val):
    if kind == "i":
        return ing_urls(val)
    if kind == "m":
        return meal_urls(val)
    return []


def slugify(s):
    return s.replace(" ", "-")


manifest = {}
misses = []
for item, cands in PLAN.items():
    slug = slugify(item)
    saved = None
    for kind, val in cands:
        for url in candidate_urls(kind, val):
            try:
                data = fetch(url).read()
            except Exception:
                continue
            if len(data) < 3000:
                continue
            ext = ".png" if url.lower().split("?")[0].endswith(".png") else ".jpg"
            path = f"{OUT}/{slug}{ext}"
            with open(path, "wb") as f:
                f.write(data)
            saved = f"{slug}{ext}"
            print(f"  ✓ {item:14s} <- [{kind}] {val:18s} {len(data)//1024}kb")
            break
        if saved:
            break
    if saved:
        manifest[item] = saved
    else:
        misses.append(item)
        print(f"  ✗ {item:14s} (no image found)")

with open(f"{OUT}/manifest.json", "w") as f:
    json.dump(manifest, f, indent=2)

print(f"\nDONE: {len(manifest)}/{len(PLAN)} downloaded.")
if misses:
    print("MISSES:", ", ".join(misses))
