#!/usr/bin/env python3
"""Validate Indian Philosophy OS entity files: ids, cross-references, required fields, no quoted verse text.
Usage (from project root): python3 app/scripts/os/validate.py [kind ...]
"""
import json, os, re, sys, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
APP = os.path.abspath(os.path.join(ROOT, '..', '..'))
REG = json.load(open(os.path.join(ROOT, 'registry.json')))
OS = os.path.join(APP, 'src', 'data', 'os')
COUNTS = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 34, 27, 20, 24, 28, 78]
GITA_Q = {q['id'] for q in json.load(open(os.path.join(APP, 'src', 'data', 'curated', 'questions.json')))}
KIND_DIR = {'tradition': 'traditions', 'text': 'texts', 'thinker': 'thinkers', 'concept': 'concepts',
            'question': 'questions', 'comparison': 'comparisons', 'path': 'paths'}
REGKEY = {'tradition': 'traditions', 'text': 'texts', 'thinker': 'thinkers', 'concept': 'concepts',
          'question': 'questions', 'comparison': 'comparisons', 'path': 'paths', 'tool': 'tools'}
MOTIFS = set('conch lamp wheel flame lotus seed sun cosmos eye scales tree crown mountain ocean moon path river chariot bow'.split())
errs = []

def gita_ok(v):
    m = re.fullmatch(r'(\d{1,2})\.(\d{1,2})', str(v))
    return bool(m) and 1 <= int(m[1]) <= 18 and 1 <= int(m[2]) <= COUNTS[int(m[1]) - 1]

def ref(kind, i, where):
    if kind == 'gita':
        if not gita_ok(i): errs.append(f'{where}: bad Gita verse id {i}')
        return
    if kind not in REGKEY:
        errs.append(f'{where}: unknown kind {kind}'); return
    if i not in REG[REGKEY[kind]]:
        errs.append(f'{where}: unknown {kind} id "{i}"')

def ids(kind, lst, where):
    for i in lst or []:
        ref(kind, i, where)

def need(o, keys, where):
    for k in keys:
        if o.get(k) in (None, '', [], {}):
            errs.append(f'{where}: missing "{k}"')

DEVA_VERSE = re.compile(r'[ऀ-ॿ][ऀ-ॿ\s]{40,}')  # long Devanagari runs = verse text

def scan_text(o, where):
    if isinstance(o, str):
        if DEVA_VERSE.search(o):
            errs.append(f'{where}: contains a long Devanagari passage — no source text allowed')
        if re.search(r'[਀-੿஀-௿]{12,}', o):
            errs.append(f'{where}: contains Gurmukhi/Tamil text — no source text allowed')
    elif isinstance(o, list):
        for x in o: scan_text(x, where)
    elif isinstance(o, dict):
        for k, v in o.items():
            if k in ('name', 'title'): continue
            if k in ('quote', 'verse', 'translation'): errs.append(f'{where}: field "{k}" not allowed')
            scan_text(v, f'{where}.{k}')

def check(kind, o, f):
    w = f'{kind}:{o.get("id", os.path.basename(f))}'
    if o.get('id') + '.json' != os.path.basename(f): errs.append(f'{w}: file name must be <id>.json')
    ref(kind, o.get('id'), w)
    scan_text(o, w)
    if kind == 'tradition':
        need(o, ['name', 'family', 'tagline', 'overview', 'beginner', 'coreQuestions', 'coreConcepts'], w)
        if o.get('parent'): ref('tradition', o['parent'], w + '.parent')
        ids('concept', o.get('coreConcepts'), w); ids('text', o.get('texts'), w); ids('thinker', o.get('thinkers'), w)
        for r in o.get('relatedTraditions', []): ref('tradition', r.get('id'), w + '.relatedTraditions')
        for d in o.get('disagreements', []):
            x = d.get('with');
            if x not in REG['traditions'] and x not in REG['thinkers']: errs.append(f'{w}.disagreements: unknown "{x}"')
        if o['id'] in ('nyaya', 'vaisheshika', 'sankhya', 'yoga', 'mimamsa', 'vedanta', 'advaita', 'vishishtadvaita', 'dvaita', 'buddhism', 'jainism'):
            need(o.get('darshana') or {}, ['problem', 'real', 'pramanas', 'self', 'bondage', 'liberation', 'path'], w + '.darshana')
    elif kind == 'text':
        need(o, ['title', 'category', 'sourceType', 'traditions', 'difficulty', 'themes', 'summary', 'whyRead', 'keyTeachings', 'concepts'], w)
        ids('tradition', o.get('traditions'), w); ids('concept', o.get('concepts'), w); ids('thinker', o.get('thinkers'), w)
        if o.get('author'): ref('thinker', o['author'], w + '.author')
        for r in o.get('relatedTexts', []): ref('text', r.get('id'), w + '.relatedTexts')
        for p in o.get('passages', []):
            need(p, ['ref', 'about'], w + '.passages')
            ids('gita', p.get('gita'), w + '.passages')
        if o.get('ingested') and o['id'] not in ('bhagavad-gita', 'sadhak-sanjivani'): errs.append(f'{w}: only the Gita is ingested')
    elif kind == 'thinker':
        need(o, ['name', 'traditions', 'period', 'context', 'coreIdeas'], w)
        ids('tradition', o.get('traditions'), w); ids('text', o.get('works'), w); ids('concept', o.get('concepts'), w)
        for k in ('influences', 'influenced', 'relatedThinkers'): ids('thinker', o.get(k), w + '.' + k)
        for d in o.get('disagreements', []):
            x = d.get('with')
            if x not in REG['traditions'] and x not in REG['thinkers']: errs.append(f'{w}.disagreements: unknown "{x}"')
    elif kind == 'concept':
        need(o, ['name', 'short', 'beginner', 'what', 'traditions', 'relatedConcepts'], w)
        ids('tradition', o.get('traditions'), w); ids('text', o.get('texts'), w); ids('concept', o.get('relatedConcepts'), w)
        ids('question', o.get('questions'), w); ids('gita', o.get('gitaVerses'), w)
        for p in o.get('perspectives', []): ref('tradition', p.get('tradition'), w + '.perspectives')
        for s in o.get('follow', []): ref(s.get('kind'), s.get('id'), w + '.follow')
    elif kind == 'question':
        need(o, ['q', 'quickAnswer', 'concepts', 'traditions', 'perspectives', 'startHere'], w)
        if o.get('motif') not in MOTIFS: errs.append(f'{w}: motif must be one of {sorted(MOTIFS)}')
        ids('concept', o.get('concepts'), w); ids('tradition', o.get('traditions'), w); ids('question', o.get('related'), w)
        for p in o.get('perspectives', []):
            ref('tradition', p.get('tradition'), w + '.perspectives')
            for s in p.get('sources', []): ref('text', s.get('text'), w + '.perspectives.sources')
        s = o.get('startHere') or {}; ref(s.get('kind'), s.get('id'), w + '.startHere')
        for s in o.get('goDeeper', []): ref(s.get('kind'), s.get('id'), w + '.goDeeper')
        for g in o.get('gitaQuestions', []):
            if g not in GITA_Q: errs.append(f'{w}: unknown Gita question {g}')
    elif kind == 'comparison':
        need(o, ['topic', 'intro', 'rows'], w)
        if o.get('concept'): ref('concept', o['concept'], w)
        for r in o.get('rows', []):
            ref('tradition', r.get('tradition'), w + '.rows')
            need(r, ['claim', 'detail'], w + '.rows')
            for s in r.get('sources', []): ref('text', s.get('text'), w + '.rows.sources')
            ids('concept', r.get('concepts'), w + '.rows')
    elif kind == 'path':
        need(o, ['title', 'level', 'description', 'steps'], w)
        for s in o.get('steps', []):
            ref(s.get('kind'), s.get('id'), w + '.steps'); need(s, ['title', 'note'], w + '.steps')

kinds = sys.argv[1:] or list(KIND_DIR)
count = {}
for k in kinds:
    files = sorted(glob.glob(os.path.join(OS, KIND_DIR[k], '*.json')))
    count[k] = len(files)
    for f in files:
        try:
            o = json.load(open(f))
        except Exception as e:
            errs.append(f'{f}: invalid JSON: {e}'); continue
        check(k, o, f)
    missing = set(REG[REGKEY[k]]) - {os.path.basename(f)[:-5] for f in files}
    if missing: print(f'note: {k} not yet written ({len(missing)}): {", ".join(sorted(missing))}')
print('files:', count)
print(f'{len(errs)} error(s)')
for e in errs: print('  -', e)
sys.exit(1 if errs else 0)
