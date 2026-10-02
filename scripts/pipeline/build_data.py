"""Merge Hindi + English extractions into the app's generated data files.

Writes:
  app/src/data/generated/chapters/chapter-XX.json  (full source text per chapter)
  app/src/data/generated/chapters-index.json       (light per-chapter meta + verse list)
  app/public/data/search-index.json                (client-side search corpus)
"""
import json, re, os, collections
from translit import iast

OUT = '../app/src/data/generated'
PUB = '../app/public/data'
os.makedirs(OUT + '/chapters', exist_ok=True)
os.makedirs(PUB, exist_ok=True)

H = json.load(open('hi_verses.json'))
E = json.load(open('en_verses.json'))

# printed page numbers
def printed_pages_en():
    raw = open('en.txt').read()
    parts = re.split(r'\n=====PAGE (\d+)=====\n', raw)
    res = {}
    for i in range(1, len(parts), 2):
        p = int(parts[i])
        for h in parts[i + 1].split('\n')[:4]:
            if re.fullmatch(r'\d{1,4}', h.strip()):
                res[p] = int(h.strip()); break
    # fill gaps by neighbours
    ks = sorted(res)
    return res

EN_PAGES = printed_pages_en()

def en_printed(p):
    if p in EN_PAGES:
        return EN_PAGES[p]
    for d in (1, -1, 2, -2):
        if p + d in EN_PAGES:
            return EN_PAGES[p + d] - d
    return None

def clean_hi(t):
    t = t.replace(' ', ' ')
    t = re.sub(r'\*\*\s*\*\*', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def blocks_hi(bs):
    out = []
    for b in bs:
        x = clean_hi(b['x'])
        if not x or x in ('अवतरणिका—',):
            continue
        if b['t'] == 'h':
            out.append({'type': 'heading', 'text': x.replace('**', '')})
        elif b['t'] == 'q':
            out.append({'type': 'verse', 'text': b['x'].strip()})
        else:
            out.append({'type': 'para', 'text': x})
    return out

def blocks_en(ps):
    out = []
    for p in ps:
        p = p.strip()
        if not p:
            continue
        if p.startswith('## '):
            out.append({'type': 'heading', 'text': p[3:]})
        else:
            out.append({'type': 'para', 'text': p})
    return out

SPEAKER_EN = {'धृतराष्ट्र उवाच': 'Dhritarashtra said', 'सञ्जय उवाच': 'Sanjaya said', 'अर्जुन उवाच': 'Arjuna said',
              'श्रीभगवानुवाच': 'The Blessed Lord said', 'भगवानुवाच': 'The Lord said'}

def hi_page(p):
    return p - 1  # pdf page -> printed page (cover offset)

index = []
search = []
expected = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 34, 27, 20, 24, 28, 78]
for c in H:
    cn = c['chapter']
    vs = c['verses']
    byn = {v['n']: v for v in vs}
    # resolve groups: shared words/commentary live on the last verse of a group
    groups = {}
    for v in vs:
        g = tuple(v['group'])
        groups.setdefault(g, []).append(v)
    out_verses = []
    for v in vs:
        g = groups[tuple(v['group'])]
        lead = g[0]
        tail = g[-1]
        words = tail['words'] if len(g) > 1 else v['words']
        hindi = tail['hindi'] if len(g) > 1 else v['hindi']
        comm = tail['commentary'] if len(g) > 1 else v['commentary']
        appx = tail['appendix'] if len(g) > 1 else v['appendix']
        notes = tail['notes'] if len(g) > 1 else v['notes']
        link = lead['link']
        e = E.get(str(cn), {}).get(str(v['n']))
        en_tr = None
        en_block = None
        if e:
            en_tr = e['translation'].strip() or None
            ratio = len(en_tr or '') / max(1, len(hindi))
            if en_tr and (ratio > 2.4 or ratio < 0.22):
                en_tr = None
            en_block = e
        sp = v.get('speaker')
        sanskrit = [l.strip() for l in v['sanskrit']]
        item = {
            'id': f'{cn}.{v["n"]}',
            'chapter': cn,
            'verse': v['n'],
            'group': v['group'],
            'speaker': {'sa': sp, 'en': SPEAKER_EN.get(sp)} if sp else None,
            'sanskrit': sanskrit,
            'iast': [iast(l) for l in sanskrit],
            'words': [{'sa': w, 'hi': m} for w, m in words if w or m],
            'hindi': hindi,
            'english': en_tr,
            'link': {
                'hi': ' '.join(clean_hi(b['x']) for b in link if b['t'] == 'p') or None,
                'en': (en_block['link'][0] if en_block and en_block['link'] else None),
            },
            'commentary': {'hi': blocks_hi(comm), 'en': blocks_en(en_block['commentary']) if en_block else []},
            'appendix': {'hi': blocks_hi(appx), 'en': blocks_en(en_block['appendix']) if en_block else []},
            'notes': {'hi': [clean_hi(n['x']).replace('**', '') for n in notes], 'en': en_block['notes'] if en_block else []},
            'source': {
                'book': 'Sadhak Sanjivani',
                'author': 'Swami Ramsukhdas',
                'hiPage': hi_page(tail['page'] if len(g) > 1 else v['page']),
                'enPage': en_printed(en_block['page']) if en_block else None,
                'enVerses': en_block['nums'] if en_block else None,
            },
        }
        out_verses.append(item)
        search.append({
            'id': item['id'], 'c': cn, 'v': v['n'],
            'sa': ' '.join(sanskrit), 'tr': ' '.join(item['iast']),
            'hi': hindi, 'en': en_tr or '',
        })
    colophon = c.get('colophon', '')
    m = re.search(r'संवादे\s*(.+?)\s*नाम', colophon)
    yoga_sa = m.group(1).strip() if m else ''
    chapter = {
        'chapter': cn,
        'titleSa': c['title'],
        'yogaSa': yoga_sa,
        'colophon': colophon,
        'intro': {'hi': blocks_hi(c['intro'])},
        'closing': {'hi': blocks_hi(c['closing'])},
        'sourcePage': hi_page(c['page']),
        'verses': out_verses,
    }
    json.dump(chapter, open(f'{OUT}/chapters/chapter-{cn:02d}.json', 'w'), ensure_ascii=False)
    index.append({'chapter': cn, 'yogaSa': yoga_sa, 'verseCount': len(out_verses), 'sourcePage': hi_page(c['page']),
                  'verses': [{'n': x['verse'], 'first': x['sanskrit'][0], 'hasEnglish': bool(x['english'])} for x in out_verses]})
    assert len(out_verses) == expected[cn - 1], (cn, len(out_verses))

json.dump(index, open(f'{OUT}/chapters-index.json', 'w'), ensure_ascii=False)
json.dump(search, open(f'{PUB}/search-index.json', 'w'), ensure_ascii=False)
print('ok', sum(len(x['verses']) for x in index), 'verses;',
      sum(1 for s in search if s['en']), 'with English;',
      os.path.getsize(f'{PUB}/search-index.json') // 1024, 'KB search index')
