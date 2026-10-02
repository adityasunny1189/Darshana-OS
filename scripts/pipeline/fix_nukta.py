"""Apply the same nukta normalisation used on the source to curated JSON files (in place)."""
import json, re, sys, unicodedata
def fix(s):
    s = unicodedata.normalize('NFD', s)
    return re.sub(r'([डढ])([क-ह])\u093c', '\\1\u093c\\2', s)
def walk(o):
    if isinstance(o, str): return fix(o)
    if isinstance(o, list): return [walk(x) for x in o]
    if isinstance(o, dict): return {k: walk(v) for k, v in o.items()}
    return o
for f in sys.argv[1:]:
    d = json.load(open(f)); json.dump(walk(d), open(f, 'w'), ensure_ascii=False, indent=1); print('fixed', f)
