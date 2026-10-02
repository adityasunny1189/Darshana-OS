#!/usr/bin/env python3
"""Validate curated JSON files against the source text.
Usage: python3 validate_curated.py file.json [file2.json ...]
Accepts a list of curated verses, or an object with a "verses" list, or chapter/concept files.
"""
import json, sys, os, re

D = os.path.join(os.path.dirname(__file__), '../app/src/data/generated/chapters')
_cache = {}
def chapter(c):
    if c not in _cache:
        _cache[c] = json.load(open(f'{D}/chapter-{c:02d}.json'))
    return _cache[c]

def verse(vid):
    try:
        c, v = map(int, vid.split('.'))
        for x in chapter(c)['verses']:
            if x['verse'] == v:
                return x
    except Exception:
        return None
    return None

def norm(s):
    import unicodedata
    s = unicodedata.normalize('NFD', s)
    s = re.sub(r'([डढ])([क-ह])़', r'\1' + '़' + r'\2', s)
    s = s.replace('**', '').replace(' ', ' ')
    s = re.sub(r'[‘’\'"“”]', '', s)
    return re.sub(r'\s+', ' ', s).strip()

CONCEPTS = set('atma sharira karma phala nishkama-karma dharma svadharma yoga samatva jnana viveka bhakti sharanagati vairagya asakti kama krodha ahankara prakriti purusha guna maya shraddha tyaga sannyasa sthitaprajna dhyana moksha ishvara yajna'.split())

def bil(obj, path, errs, required=True):
    if obj is None:
        if required:
            errs.append(f'{path}: missing')
        return
    if not isinstance(obj, dict) or not obj.get('en') or not obj.get('hi'):
        errs.append(f'{path}: needs non-empty en + hi')

def check_verse(cv, errs):
    vid = cv.get('id', '?')
    v = verse(vid)
    if not v:
        errs.append(f'{vid}: unknown verse id'); return
    for k in ('headline', 'essence', 'idea'):
        bil(cv.get(k), f'{vid}.{k}', errs)
    if cv.get('essence') and len(cv['essence'].get('en', '').split()) > 32:
        errs.append(f'{vid}.essence.en too long')
    src = norm(' '.join(b['text'] for b in v['commentary']['hi'] + v['appendix']['hi'] + ([{'text': v['link']['hi']}] if v['link']['hi'] else [])))
    for i, ex in enumerate(cv.get('examples', []) or []):
        bil(ex.get('title'), f'{vid}.examples[{i}].title', errs)
        bil(ex.get('text'), f'{vid}.examples[{i}].text', errs)
        q = (ex.get('quote') or {}).get('hi', '')
        if not q:
            errs.append(f'{vid}.examples[{i}].quote.hi missing')
        elif norm(q) not in src:
            errs.append(f'{vid}.examples[{i}].quote.hi NOT an exact substring of the source commentary: {q[:60]}…')
        elif len(q.split()) > 90:
            errs.append(f'{vid}.examples[{i}].quote.hi too long (>90 words)')
    for i, m in enumerate(cv.get('modern', []) or []):
        bil(m.get('text'), f'{vid}.modern[{i}].text', errs)
    for c in cv.get('concepts', []) or []:
        if c not in CONCEPTS:
            errs.append(f'{vid}: unknown concept id {c}')
    for r in cv.get('related', []) or []:
        if not verse(r):
            errs.append(f'{vid}: related verse {r} does not exist')
    for i, t in enumerate(cv.get('terms', []) or []):
        if not t.get('sa'):
            errs.append(f'{vid}.terms[{i}].sa missing')
        bil(t.get('meaning'), f'{vid}.terms[{i}].meaning', errs)

def main():
    total = 0
    for f in sys.argv[1:]:
        data = json.load(open(f))
        errs = []
        items = data if isinstance(data, list) else data.get('verses', [])
        for cv in items:
            if 'id' in cv and '.' in str(cv['id']):
                check_verse(cv, errs); total += 1
        # generic verse refs anywhere
        def walk(o, p=''):
            if isinstance(o, dict):
                for k, x in o.items():
                    if k in ('verses', 'keyVerses', 'related') and isinstance(x, list) and x and isinstance(x[0], str):
                        for r in x:
                            if not verse(r): errs.append(f'{f}{p}.{k}: verse {r} does not exist')
                    elif k == 'concepts' and isinstance(x, list) and x and isinstance(x[0], str):
                        for c in x:
                            if c not in CONCEPTS: errs.append(f'{f}{p}.{k}: unknown concept {c}')
                    else:
                        walk(x, f'{p}.{k}')
            elif isinstance(o, list):
                for i, x in enumerate(o):
                    walk(x, f'{p}[{i}]')
        if not isinstance(data, list):
            walk({k: v for k, v in data.items() if k != 'verses'})
        print(f'{f}: {len(errs)} error(s)')
        for e in errs:
            print('  -', e)
    print('checked', total, 'curated verses')

main()
