#!/usr/bin/env python3
"""Print one verse (or a range) from the generated source data.
Usage: python3 show.py 2 47            -> full verse incl. commentary
       python3 show.py 2 47 --brief    -> without commentary
       python3 show.py 2 intro         -> chapter intro (avatarnika) + closing
       python3 show.py grep 'पदार्थ'     -> find verses whose commentary contains text
"""
import json, sys, os, re
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'src', 'data', 'generated', 'chapters')
def ch(c): return json.load(open(f'{D}/chapter-{int(c):02d}.json'))
def blocks(bs):
    for b in bs:
        pre = '### ' if b['type'] == 'heading' else ('> ' if b['type'] == 'verse' else '')
        print(pre + b['text']); print()
a = sys.argv[1:]
if a[0] == 'grep':
    pat = a[1]
    for c in range(1, 19):
        for v in ch(c)['verses']:
            txt = ' '.join(b['text'] for b in v['commentary']['hi'] + v['appendix']['hi'] + v['commentary']['en'] + v['appendix']['en'])
            n = txt.count(pat)
            if n: print(v['id'], n)
    sys.exit()
C = ch(a[0])
if a[1] == 'intro':
    print(C['titleSa'], '|', C['yogaSa']); print(C['colophon']); print('--- INTRO (avatarnika) ---'); blocks(C['intro']['hi']); print('--- CLOSING ---'); blocks(C['closing']['hi']); sys.exit()
n = int(a[1]); brief = '--brief' in a
for v in C['verses']:
    if v['verse'] != n: continue
    print(f"=== {v['id']}  group={v['group']}  hiPage={v['source']['hiPage']} enPage={v['source']['enPage']}")
    if v['speaker']: print(v['speaker'])
    print('\n'.join(v['sanskrit'])); print('\n'.join(v['iast']))
    print('WORDS:', '; '.join(f"{w['sa']}={w['hi']}" for w in v['words']))
    print('HINDI:', v['hindi']); print('ENGLISH:', v['english'])
    print('LINK hi:', v['link']['hi']); print('LINK en:', v['link']['en'])
    if brief: break
    print('--- COMMENTARY (hi) ---'); blocks(v['commentary']['hi'])
    print('--- APPENDIX / परिशिष्ट भाव (hi) ---'); blocks(v['appendix']['hi'])
    print('--- COMMENTARY (en, OCR) ---'); blocks(v['commentary']['en'])
    print('--- APPENDIX (en, OCR) ---'); blocks(v['appendix']['en'])
    print('--- NOTES ---'); print(v['notes'])
