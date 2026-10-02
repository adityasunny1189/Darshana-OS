"""Parse the OCR'd English Sadhak Sanjivani into per-verse translation + commentary."""
import json, re, collections

raw = open('en.txt').read()
pages = re.split(r'\n=====PAGE (\d+)=====\n', raw)
# pages: ['', '1', text, '2', text, ...]
P = [(int(pages[i]), pages[i + 1]) for i in range(1, len(pages), 2)]

HDR = re.compile(r'^(\[?\s*Chapter\s*\d*\s*\]?|Verses?\s*[\d\s\-—,]*\]?|\d{1,4}|.*S[A-Z]{2,}.*(SANJ|SMU|SAN|GITA|GIT|GIIA|GlTA|GHA).*|SRI.*|SR.MAD.*|.*BHAGAVAD.*)$')
STOP = set('the and of to is in who his my not by with for are be you he that it as from this on your their they have has was were which all these those one when what me i o shall will do does an or but him us we our its whose there'.split())
GARB = re.compile(r'[~|{}\\^<>§¥•@#$%&*_=+\[\]]')

def is_header(line, idx, n):
    s = line.strip()
    if not s:
        return True
    if idx <= 3 and len(s) <= 30 and HDR.match(s):
        return True
    return False

def englishy(s):
    words = re.findall(r"[A-Za-z']+", s)
    if len(words) < 3:
        return False
    lw = [w.lower().strip("'") for w in words]
    return sum(w in STOP for w in lw) >= 1

DICT = set(w.strip().lower() for w in open('/usr/share/dict/words'))
SKT = set('na ca hi tu va api eva iti sa te me ma yah so tat tam tvam aham mam yo ye kim sah atha tatha yatha yada tada mama tava'.split())
def dictish(s):
    ws = [w.lower() for w in re.findall(r"[A-Za-z]+", s)]
    if not ws:
        return False
    if any(w in SKT for w in ws) and len(ws) <= 2:
        return False
    good = sum(1 for w in ws if w in DICT or w in STOP or (w.endswith('s') and w[:-1] in DICT) or (w.endswith('ed') and w[:-2] in DICT))
    return good / len(ws) >= 0.75

def garbage(s):
    s = s.strip()
    if not s:
        return False
    g = len(GARB.findall(s)) + len(re.findall(r'[^\x00-\x7f]', s))
    return g / max(1, len(s)) > 0.08 or bool(re.search(r'II\s*[~\d]', s)) or '~' in s

# flatten to lines with footnotes separated
lines = []  # (page, text, kind)
for pno, text in P:
    ls = text.split('\n')
    body = [l for l in ls]
    # strip headers at top
    out = []
    for idx, l in enumerate(body):
        if is_header(l, idx, len(body)):
            continue
        out.append(l)
    # footnote: last '*'-starting line near bottom
    fn_at = None
    for k in range(len(out) - 1, max(-1, len(out) - 10), -1):
        if out[k].lstrip().startswith('*') and not out[k].lstrip().startswith('**'):
            fn_at = k
    for k, l in enumerate(out):
        kind = 'fn' if fn_at is not None and k >= fn_at else 'body'
        lines.append((pno, l.rstrip(), kind))

body = [(p, l) for p, l, k in lines if k == 'body']
fns = collections.defaultdict(list)
for p, l, k in lines:
    if k == 'fn':
        fns[p].append(l)

COMMENT = re.compile(r"^\s*Comment\s*[:;]?\s*[-—~]+\s*(.*)$")
LINK = re.compile(r"^\s*Link\s*[:;]?\s*[-—~]+\s*(.*)$")
APPX = re.compile(r"^\s*Appendix\s*[-—~:]+\s*(.*)$")
NUM_END = re.compile(r"(?:^|\s)(\d{1,2})(?:\s*[-—,]\s*(\d{1,2}))?\s*[.]?\s*$")

# locate comment markers
idxs = [i for i, (p, l) in enumerate(body) if COMMENT.match(l)]
entries = []
for j, ci in enumerate(idxs):
    # translation: walk back
    k = ci - 1
    # skip footnote / stray lines between translation and 'Comment:-'
    for kk in range(ci - 1, max(-1, ci - 45), -1):
        sk = body[kk][1].strip()
        if COMMENT.match(sk) or LINK.match(sk):
            break
        if re.search(r"[a-z,.;)?!'\"]\s*\d{1,2}(\s*[-—,]\s*\d{1,2})?\s*$", sk) and not garbage(sk):
            k = kk
            break
    tr = []
    while k >= 0:
        s = body[k][1].strip()
        if not s:
            k -= 1; continue
        if COMMENT.match(s) or LINK.match(s):
            break
        if garbage(s):
            break
        if englishy(s) or dictish(s) or (not tr and NUM_END.search(s) and len(s.split()) >= 2):
            tr.insert(0, s); k -= 1; continue
        break
    capped = False
    m0 = NUM_END.search(' '.join(tr))
    span = 1
    if m0 and m0.group(2):
        span = max(1, int(m0.group(2)) - int(m0.group(1)) + 1)
    lim = 8 * span + 2
    if sum(len(x) for x in tr) > 70 * lim:
        # walked into preceding prose: keep only the tail that fits
        keep, tot = [], 0
        for x in reversed(tr):
            tot += len(x)
            if tot > 70 * lim:
                break
            keep.insert(0, x)
        tr = keep; capped = True
    trans = ' '.join(tr)
    if capped:
        mm = re.search(r'[.?!"]\s+(?=[A-Z"\'])', trans)
        if mm:
            trans = trans[mm.end():]
    m = NUM_END.search(trans)
    nums = None
    if m:
        a = int(m.group(1)); b = int(m.group(2)) if m.group(2) else a
        if b >= a and b - a < 12:
            nums = (a, b)
            trans = trans[:m.start()].strip()
    # commentary: forward until next link / next verse block
    end = idxs[j + 1] if j + 1 < len(idxs) else len(body)
    seg = body[ci:end]
    first = COMMENT.match(seg[0][1]).group(1)
    comm_lines = [(seg[0][0], first)] if first.strip() else []
    stop = len(seg)
    for t in range(1, len(seg)):
        s = seg[t][1]
        if LINK.match(s) or garbage(s):
            stop = t; break
    # trailing translation lines of the next verse were before a garbage line; commentary ends at stop
    comm_lines += seg[1:stop]
    link_lines = []
    if stop < len(seg) and LINK.match(seg[stop][1]):
        # link text continues until garbage
        t = stop
        link_lines.append(LINK.match(seg[t][1]).group(1))
        t += 1
        while t < len(seg) and not garbage(seg[t][1]) and not COMMENT.match(seg[t][1]):
            link_lines.append(seg[t][1]); t += 1
    pages_used = sorted(set(p for p, _ in seg))
    entries.append({'nums': nums, 'translation': trans, 'comm': comm_lines, 'next_link': link_lines,
                    'page': body[ci][0], 'pages': pages_used})

# paragraphs
def paras(ls):
    out, cur = [], ''
    for p, l in ls:
        s = l.strip()
        if not s:
            continue
        mh = re.match(r"^[I\[|]\s*([A-Z][A-Za-z\s\-']{2,48}?)\s*[I\]|]$", s)
        if mh and len(s) < 56:
            if cur:
                out.append(cur); cur = ''
            out.append('## ' + mh.group(1).strip())
            continue
        starts_new = bool(re.match(r"^['‘\"]\S", s)) and cur.rstrip().endswith(('.', '?', '!', ':', '"', "'"))
        if cur and starts_new:
            out.append(cur); cur = ''
        if cur.endswith('-') and not cur.endswith('--') and re.match(r'[a-z]', s):
            cur = cur[:-1] + s
        else:
            cur = (cur + ' ' + s).strip()
        if len(s) < 48 and s.endswith(('.', '?', '!', '."', ".'", ')')):
            out.append(cur); cur = ''
    if cur:
        out.append(cur)
    return out

FIX = [
    (r"Kr[~s][^\s,.;:'\-)]{0,4}a\b", 'Krsna'), (r"\bKr\S{1,4}a's\b", "Krsna's"),
    (r"\bG[IiHh1l][tTHh][ao]\b", 'Gita'), (r"\bGiHi\b", 'Gita'), (r"\bGmi\b", 'Gita'), (r"\bGIro\b", 'Gita'),
    (r"\b0 ", 'O '), (r"^o\s", 'O '), (r"([.!?]\s)o\s", r"\1O "), (r"SADHAKA-\S+", 'Sadhaka-Sanjivani'),
    (r"\bArjuna\s*,", 'Arjuna,'), (r"\s+([,.;:])", r'\1'), (r"([a-z])\.([A-Z][a-z])", r'\1. \2'),
    (r"\s{2,}", ' '),
]
NAMES = {
 'Saiijaya': 'Sanjaya', 'Saiijayat': 'Sanjaya', 'Dhanaiijaya': 'Dhananjaya', 'Madhusiidana': 'Madhusudana', 'Arisiidana': 'Arisudana',
 'Adhibhiita': 'Adhibhuta', 'Siidra': 'Sudra', 'Siidras': 'Sudras', 'Siirya': 'Surya', 'Visvariipa': 'Visvarupa', 'Brahmasiitra': 'Brahmasutra',
 'Bhiirisrava': 'Bhurisrava', 'Droniiciirya': 'Dronacarya', 'Piificajanya': 'Panchajanya', 'Bhiirata': 'Bharata', 'Riijasika': 'Rajasika',
 'riijasika': 'rajasika', 'tiimasika': 'tamasika', 'Siittvika': 'Sattvika', 'Kartii': 'Karta', 'sraddhii': 'sraddha', 'Kriyii': 'Kriya',
 'Siilikhyayogi': 'Sankhyayogi', 'Dhyiinayogi': 'Dhyanayogi', 'mahiibiiho': 'mahabaho', 'RajoguQa': 'Rajoguna', 'Avadhiita': 'Avadhuta',
 'PaQ4avas': 'Pandavas', 'PiiI}4u': 'Pandu', 'GaJ}.4iva': 'Gandiva', 'Gitii': 'Gita', 'GIla': 'Gita', 'GItii': 'Gita', 'Gltii': 'Gita', 'GltiiLord': 'Gita. Lord',
 'AIjuna': 'Arjuna', 'fIre': 'fire', 'fIrst': 'first', 'fIfty': 'fifty', 'selfIsh': 'selfish', 'theVedas': 'the Vedas', 'toLord': 'to Lord',
 'worshipMe': 'worship Me', 'ofHis': 'of His', 'knowledgeLord': 'knowledge Lord', 'regardedLord': 'regarded Lord', 'attribute1ess': 'attributeless',
 'otTers': 'offers', 'iinmortal': 'immortal', 'rel1fain': 'remain', 'upon6ther': 'upon other',
}
ROMAN = {'ii', 'iii', 'vii', 'viii', 'xii', 'xiii', 'xvii', 'xviii'}
def fix_word(w):
    core = w.strip(".,;:'\"()[]!?-")
    if not core:
        return w
    if core in NAMES:
        return w.replace(core, NAMES[core])
    if core.lower() in ROMAN or core.isupper():
        return w
    c = core
    c = re.sub(r"(?:l\}\.?|I:t|J\.t|l\.t|1:t|l;t|3l\.t|3J\.t)$", "h", c)
    c = c.replace('J}', 'n').replace('l}', 'n').replace('Q4', 'nd')
    c = c.replace('jiia', 'jna').replace('Jiia', 'Jna').replace('jfia', 'jna').replace('Jfia', 'Jna').replace('iij', 'nj').replace('iic', 'nc')
    c = c.replace('bhii', 'bhu').replace('Bhii', 'Bhu').replace('piir', 'pur').replace('riip', 'rup').replace('siit', 'sut')
    c = re.sub(r'(?<=[a-z])ii(?=[a-z]|$)', 'a', c)
    c = re.sub(r'(?<=[a-z])S(?=[a-z])', 's', c)
    c = re.sub(r'(?<=[a-z])Q(?=[a-z])', 'n', c)
    c = c.replace('~', 's')
    return w.replace(core, c)

def clean(s):
    for a, b in FIX:
        s = re.sub(a, b, s)
    s = ' '.join(fix_word(w) for w in s.split(' '))
    return s.strip()

def split_appx(ps):
    comm, appx, cur = [], [], None
    cur = comm
    for p in ps:
        m = APPX.match(p)
        if m:
            cur = appx
            p = m.group(1)
            if not p.strip():
                continue
        cur.append(clean(p))
    return comm, appx

# page -> chapter from running headers
hdr = {}
for pno, text in P:
    for h in text.split('\n')[:4]:
        m = re.search(r'Chapter\s*(\d{1,2})\b', h)
        if m and 1 <= int(m.group(1)) <= 18:
            hdr[pno] = int(m.group(1)); break
ks = sorted(hdr)
# drop values not monotonic w.r.t. neighbours
good = {}
for i, k in enumerate(ks):
    prv = [hdr[x] for x in ks[max(0, i - 3):i]]
    nxt = [hdr[x] for x in ks[i + 1:i + 4]]
    v = hdr[k]
    if (not prv or v >= sorted(prv)[len(prv) // 2]) and (not nxt or v <= sorted(nxt)[len(nxt) // 2]):
        good[k] = v
page_ch = {}
cur = 1
gk = sorted(good)
for pno, _ in P:
    if pno in good:
        cur = good[pno]
    page_ch[pno] = cur
# chapter openings: a page whose header says N but verse 1 appears before first header -> handled via reset below
ch = 1
last = 0
res = collections.defaultdict(dict)
pending_link = []
for e in entries:
    if e['nums'] is None:
        e['chapter'] = None
        pending_link = e['next_link']
        # attach commentary to previous
        continue
    a, b = e['nums']
    pc = page_ch.get(e['page'], ch)
    EXP = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 34, 27, 20, 24, 28, 78]
    if ch < 18 and a <= 3 and last >= EXP[ch - 1] - 4:
        ch += 1
    elif pc >= ch + 1 and a <= 5:
        ch = pc
    if a > EXP[ch - 1]:
        continue
    last = b
    comm, appx = split_appx(paras(e['comm']))
    notes = []
    for p in e['pages']:
        notes += fns.get(p, [])
    item = {'nums': [a, b], 'translation': clean(e['translation']), 'commentary': comm, 'appendix': appx,
            'link': [clean(' '.join(pending_link))] if pending_link else [], 'page': e['page'],
            'notes': [clean(' '.join(fns[p])) for p in e['pages'] if fns.get(p)]}
    for n in range(a, b + 1):
        res[ch][n] = item
    pending_link = e['next_link']

out = {c: {n: v for n, v in sorted(d.items())} for c, d in res.items()}
json.dump(out, open('en_verses.json', 'w'), ensure_ascii=False, indent=0)
expected = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 34, 27, 20, 24, 28, 78]
print('chapters', len(out))
tot = 0
for c in sorted(out):
    got = len(out[c]); tot += got
    exp = expected[c - 1] if c <= 18 else 0
    miss = [k for k in range(1, exp + 1) if k not in out[c]]
    print(c, got, exp, 'missing', miss[:20])
print('total', tot, 'unnumbered', sum(1 for e in entries if e['nums'] is None))
