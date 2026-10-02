"""Devanagari -> IAST transliteration (for Sanskrit verses)."""
import re

V = {'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū', 'ऋ': 'ṛ', 'ॠ': 'ṝ', 'ऌ': 'ḷ', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au'}
M = {'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū', 'ृ': 'ṛ', 'ॄ': 'ṝ', 'ॢ': 'ḷ', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au'}
C = {'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ṅ', 'च': 'c', 'छ': 'ch', 'ज': 'j', 'झ': 'jh', 'ञ': 'ñ',
     'ट': 'ṭ', 'ठ': 'ṭh', 'ड': 'ḍ', 'ढ': 'ḍh', 'ण': 'ṇ', 'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
     'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
     'श': 'ś', 'ष': 'ṣ', 'स': 's', 'ह': 'h', 'ळ': 'ḷ'}
O = {'ं': 'ṃ', 'ः': 'ḥ', 'ँ': 'm̐', 'ऽ': "'", '।': '|', '॥': '||', 'ॐ': 'oṃ', ':': 'ḥ'}
D = str.maketrans('०१२३४५६७८९', '0123456789')


def iast(s):
    out = []
    i = 0
    n = len(s)
    while i < n:
        ch = s[i]
        if ch in C:
            base = C[ch]
            nxt = s[i + 1] if i + 1 < n else ''
            if nxt == '़':
                i += 1
                nxt = s[i + 1] if i + 1 < n else ''
            if nxt == '्':
                out.append(base); i += 2; continue
            if nxt in M:
                out.append(base + M[nxt]); i += 2; continue
            out.append(base + 'a'); i += 1; continue
        if ch in V:
            out.append(V[ch]); i += 1; continue
        if ch in O:
            # visarga written as ':' in the Hindi source
            out.append(O[ch]); i += 1; continue
        out.append(ch)
        i += 1
    t = ''.join(out).translate(D)
    t = t.replace('||', '‖').replace('|', '।').replace('‖', '॥')
    return t


def plain(s):
    """ascii-fold for fuzzy matching"""
    import unicodedata
    s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z]', '', s.lower())


if __name__ == '__main__':
    print(iast('कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।'))
    print(iast('मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥ ४७॥'))
    print(iast('धृतराष्ट्र उवाच धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सव:।'))
