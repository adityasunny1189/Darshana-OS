"""Segment the converted Hindi Sadhak Sanjivani into structured verses.

Output: hi_verses.json  — list of chapters with verses:
  { chapter, intro: [paras], verses: [{ n, sanskrit:[lines], speaker, words:[[w,m]], hindi, link:[paras], commentary:[blocks], appendix:[blocks], notes:[..] }] }
Blocks are {"t": "p"|"h", "x": text}. Bold spans are wrapped in **..**.
"""
import json, re, collections

L = json.load(open('hi_lines.json'))
DEV = str.maketrans('०१२३४५६७८९', '0123456789')
MID = 215

def text(l, bold=True):
    out = []
    for w, sz, t in l['s']:
        if w == 'd':
            continue
        if bold and w == 'b' and sz >= 13.4 and t.strip() and not is_shloka(l):
            lead = t[:len(t) - len(t.lstrip())]
            trail = t[len(t.rstrip()):]
            out.append(f"{lead}**{t.strip()}**{trail}")
        else:
            out.append(t)
    return ''.join(out)

def plain(l):
    return ''.join(t for w, sz, t in l['s'] if w != 'd')

def maxsz(l):
    return max(s[1] for s in l['s'])

def is_shloka(l):
    return any(w == 'b' and 19.5 <= sz <= 22.5 for w, sz, t in l['s'])

def is_speaker(l):
    t = plain(l).strip()
    return bool(re.fullmatch(r'[^\s]+(\s[^\s]+)?\s(उवाच|बोले—)', t)) or t.endswith(' उवाच') and len(t) < 30

def wide(l):
    if is_shloka(l) or is_speaker(l):
        return True
    return l['x'] < 150 and l['x1'] > 280

# ---- page ordering ----
pages = collections.defaultdict(list)
for l in L:
    pages[l['p']].append(l)

def order_page(ls):
    ls = [l for l in ls if not (l['y'] < 16 and maxsz(l) <= 14)]  # running header / page no
    ls = [l for l in ls if maxsz(l) > 7.5 or not plain(l).startswith('गीतागीता')]
    ls = [l for l in ls if not plain(l).startswith('गीतागीता')]
    ls.sort(key=lambda l: (l['y'], l['x']))
    runs, cur, curw = [], [], None
    for l in ls:
        w = wide(l)
        if curw is None or w == curw:
            cur.append(l)
        else:
            runs.append((curw, cur)); cur = [l]
        curw = w
    if cur:
        runs.append((curw, cur))
    out = []
    for w, run in runs:
        if w:
            out += [('line', l) for l in run]
            continue
        eq = [l for l in run if plain(l).lstrip().startswith('=') or '=' in plain(l)]
        if len(eq) >= 2:
            gb = max(l['y'] for l in eq)
            gt = min(l['y'] for l in eq) - 4
            mxs = sorted(set(round(s_x(l)) for l in eq))
            grid, rest = [], []
            for l in run:
                t = plain(l)
                if gt <= l['y'] <= gb + 2:
                    grid.append(l)
                elif gb < l['y'] <= gb + 40 and any(mx + 3 <= l['x'] <= mx + 16 for mx in mxs) and not t.startswith(' '):
                    grid.append(l)
                else:
                    rest.append(l)
            above = [l for l in rest if l['y'] < gt]
            below = [l for l in rest if l['y'] >= gt]
            out += two_col(above)
            out.append(('grid', grid))
            out += two_col(below)
        else:
            out += two_col(run)
    return out

def s_x(l):
    # x where the '=' meaning starts for this line
    t = plain(l)
    if t.lstrip().startswith('='):
        return l['x']
    # word + meaning in one line: approximate by x of the grid column + 58
    return l['x'] + 58

def two_col(run):
    left = sorted([l for l in run if l['x'] < MID - 5], key=lambda l: l['y'])
    right = sorted([l for l in run if l['x'] >= MID - 5], key=lambda l: l['y'])
    return [('line', l) for l in left + right]

def cont(a, b):
    a = a.rstrip()
    return a + b if a.endswith('-') else a + ' ' + b

def parse_grid(grid):
    """Column-major word/meaning pairs."""
    # columns by x of bold word lines / '=' lines
    items = []
    for l in grid:
        for w, sz, t in l['s']:
            pass
    cols = collections.defaultdict(list)
    for l in grid:
        x = l['x']
        c = 0 if x < 140 else (1 if x < 290 else 2)
        cols[c].append(l)
    pairs = []
    for c in sorted(cols):
        # rows: treat lines within 4px vertically as the same row (word + its meaning)
        rows = sorted(cols[c], key=lambda l: l['y'])
        clustered, cur_y = [], None
        for l in rows:
            if cur_y is None or l['y'] - cur_y > 4:
                cur_y = l['y']
            clustered.append((cur_y, l['x'], l))
        rows = [l for _, _, l in sorted(clustered, key=lambda t: (t[0], t[1]))]
        # merge lines on same y (word line + meaning line)
        for l in rows:
            word = ''.join(t for w, sz, t in l['s'] if w == 'b').strip()
            mean = ''.join(t for w, sz, t in l['s'] if w != 'b' and w != 'd').strip()
            if word and not mean.startswith('=') and not mean:
                if pairs and (pairs[-1][0].rstrip().endswith(',') or (pairs[-1][1] is None and pairs[-1][0].rstrip().endswith('-'))):
                    pairs[-1][0] = cont(pairs[-1][0], word)
                else:
                    pairs.append([word, None])
            elif mean.startswith('='):
                if word and pairs and pairs[-1][1] is None and pairs[-1][0].rstrip().endswith(('-', ',')):
                    pairs[-1][0] = cont(pairs[-1][0], word)
                    pairs[-1][1] = mean[1:].strip()
                elif word:
                    pairs.append([word, mean[1:].strip()])
                elif pairs and pairs[-1][1] is None:
                    pairs[-1][1] = mean[1:].strip()
                elif pairs:
                    pairs[-1][1] = join(pairs[-1][1], mean[1:].strip())
                else:
                    pairs.append(['', mean[1:].strip()])
            else:
                txt = (word + ' ' + mean).strip()
                if pairs:
                    if pairs[-1][1] is None:
                        pairs[-1][1] = txt
                    else:
                        pairs[-1][1] = join(pairs[-1][1], txt)
    return [[w, m or ''] for w, m in pairs]

def join(a, b):
    if a.endswith('-'):
        return a + b.lstrip()
    return a.rstrip() + ' ' + b.lstrip()

# ---- sequential parse ----
seq = []
for p in sorted(pages):
    if p < 20:
        continue
    for kind, x in order_page(pages[p]):
        seq.append((p, kind, x))

chapters = []
ch = None
verse = None
mode = None  # intro, link, words, comm, app
pending_link = []
pending_speaker = None
para = None
sanskrit_buf = []

def flush_para():
    global para
    if para is None:
        return
    tgt, blk = para
    blk['x'] = re.sub(r'\s+', ' ', blk['x']).strip()
    if blk['x']:
        tgt.append(blk)
    para = None

def target():
    if mode == 'intro':
        return ch['intro']
    if mode == 'link':
        return pending_link
    if mode == 'app':
        return verse['appendix']
    if mode == 'comm':
        return verse['commentary']
    return None

def add_text(l):
    global para, mode
    t = text(l)
    raw = plain(l)
    st = raw.strip()
    sz = maxsz(l)
    # headings
    if 16.5 <= sz <= 19 and not is_shloka(l):
        flush_para()
        tg = target()
        if tg is not None:
            tg.append({'t': 'h', 'x': st})
        return
    # footnotes
    if sz <= 12.6 and (st.startswith('*') or re.match(r'^[१२३४५६७८९]+-', st)) and verse is not None:
        flush_para()
        verse['notes'].append({'t': 'p', 'x': t.strip()})
        para_set(verse['notes'], None)
        return
    starts = raw.startswith(' ') or raw.startswith(' ')
    tg = target()
    if tg is None:
        return
    if para is None or starts or para[0] is not tg:
        flush_para()
        para_set(tg, t)
    else:
        blk = para[1]
        blk['x'] = join(blk['x'], t)

def para_set(tg, t):
    global para
    if t is None:
        para = (tg, tg[-1]); tg.pop()
        return
    para = (tg, {'t': 'p', 'x': t})

def norm_sh(t):
    t = re.sub(r'॥\s*\.?\s*([०-९]+)', r'॥ \1', t)
    return t.rstrip('*').strip()

CH_TITLE = re.compile(r'^अथ\s*(.+?)ऽध्याय:$|^अथ\s+(.+)$')
last_n = 0
chapter_no = 0
i = 0
while i < len(seq):
    p, kind, x = seq[i]
    if kind == 'grid':
        if verse is not None and mode == 'words':
            verse['words'] += parse_grid(x)
        i += 1
        continue
    l = x
    st = plain(l).strip()
    sz = maxsz(l)
    if sz >= 30 and st == 'आरती':
        break
    if sz >= 30:  # chapter title
        flush_para()
        chapter_no += 1
        ch = {'chapter': chapter_no, 'title': st, 'intro': [], 'verses': [], 'page': p, 'closing': []}
        chapters.append(ch)
        verse = None
        mode = 'intro'
        last_n = 0
        i += 1
        continue
    if ch is None:
        i += 1
        continue
    if (st.startswith('ॐ तत्सदिति') or st.startswith('ॐ तत्सत्')) and not is_shloka(l):
        flush_para()
        # colophon: collect this and following shloka-ish lines
        col = [st]
        i += 1
        while i < len(seq) and seq[i][1] == 'line' and '॥' not in col[-1]:
            col.append(plain(seq[i][2]).strip()); i += 1
        ch['colophon'] = ' '.join(col)
        mode = 'closing'
        verse = None
        continue
    if is_speaker(l):
        flush_para()
        if st.endswith('उवाच'):
            pending_speaker = st
        elif verse is not None and verse['words'] == [] and st.endswith('बोले—'):
            verse['speakerHi'] = st.rstrip('—')
        i += 1
        continue
    if is_shloka(l):
        flush_para()
        # gather shloka lines until verse number
        buf = [norm_sh(st)]
        while not re.search(r'॥\s*[०-९]+\s*॥?\s*$', buf[-1]) and i + 1 < len(seq) and seq[i + 1][1] == 'line' and (is_shloka(seq[i + 1][2]) or maxsz(seq[i + 1][2]) >= 19):
            i += 1
            buf.append(norm_sh(plain(seq[i][2]).strip()))
        m = re.search(r'॥\s*([०-९]+)\s*॥?\s*$', buf[-1])
        if not m:
            # not a verse (e.g. a big quoted shloka inside commentary)
            if mode in ('comm', 'app', 'intro', 'link') and target() is not None:
                target().append({'t': 'q', 'x': '\n'.join(buf)})
            i += 1
            continue
        n = int(m.group(1).translate(DEV))
        if n <= last_n or n > last_n + 8:
            # quoted verse inside commentary
            tg = target()
            if tg is not None:
                tg.append({'t': 'q', 'x': '\n'.join(buf)})
            i += 1
            continue
        # consecutive shlokas in the same group share words/commentary
        if verse is not None and mode == 'words' and verse['words'] == []:
            grp = verse['group']
        else:
            grp = None
        verse = {'n': n, 'sanskrit': buf, 'speaker': pending_speaker, 'words': [], 'link': pending_link,
                 'commentary': [], 'appendix': [], 'notes': [], 'page': p}
        if grp is not None:
            verse['group'] = grp
            verse['link'] = []
            grp.append(n)
        else:
            verse['group'] = [n]
        pending_link = []
        pending_speaker = None
        ch['verses'].append(verse)
        last_n = n
        mode = 'words'
        i += 1
        continue
    if st.startswith('व्याख्या') and verse is not None:
        flush_para()
        mode = 'comm'
        rest = text(l).split('—', 1)
        para_set(verse['commentary'], rest[1] if len(rest) > 1 else '')
        i += 1
        continue
    if st.startswith('परिशिष्ट भाव') and verse is not None:
        flush_para()
        mode = 'app'
        rest = text(l).split('—', 1)
        para_set(verse['appendix'], rest[1] if len(rest) > 1 else '')
        i += 1
        continue
    if st.startswith('सम्बन्ध—') and mode != 'intro':
        flush_para()
        mode = 'link'
        pending_link = []
        rest = text(l).split('—', 1)
        para_set(pending_link, rest[1] if len(rest) > 1 else '')
        i += 1
        continue
    if mode == 'words':
        # stray text in words section (e.g. translation continuation) -> ignore
        i += 1
        continue
    if mode == 'closing':
        para_target = ch['closing']
        mode_bak = mode
        # treat as intro-like text for closing
        t = text(l)
        if para is None or plain(l).startswith(' ') or para[0] is not ch['closing']:
            flush_para(); para_set(ch['closing'], t)
        else:
            para[1]['x'] = join(para[1]['x'], t)
        i += 1
        continue
    add_text(l)
    i += 1
flush_para()

for c in chapters:
    for v in c['verses']:
        v['hindi'] = re.sub(r'\s+', ' ', ' '.join(m for w, m in v['words'])).strip()
json.dump(chapters, open('hi_verses.json', 'w'), ensure_ascii=False, indent=0)
print(len(chapters), [len(c['verses']) for c in chapters], sum(len(c['verses']) for c in chapters))
for c in chapters:
    ns = [v['n'] for v in c['verses']]
    missing = [k for k in range(1, max(ns) + 1) if k not in ns]
    if missing:
        print('ch', c['chapter'], 'missing', missing)
