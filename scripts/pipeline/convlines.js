const c=require("./fastconv.js");const fs=require("fs");
const L=JSON.parse(fs.readFileSync("hi_lines_legacy.json","utf8"));
const post=t=>t.replace(/ॢ(.)/g,'र्$1ि').replace(/\?ा/g,'झ').replace(/\?ो/g,'झे').replace(/\?ौ/g,'झै').replace(/ú/g,'ॐ').replace(/Ÿो/g,'श्रे').replace(/ö/g,'ह्ण').replace(/(^|[\s—‘(])ङ्क्ष([क-ह])/g,'$1$2िं').normalize('NFD').replace(/([डढ])([क-ह])\u093c/g,'$1\u093c$2');
for(const l of L){
  // a reph (legacy "ü") that landed in its own span belongs to the previous span
  for(let i=1;i<l.s.length;i++){ const t=l.s[i][2]; if(t.startsWith('\u00FC')&&l.s[i-1][0]!=='d'){ l.s[i-1][2]+= '\u00FC'; l.s[i][2]=t.slice(1);} }
  // tiny non-bold fragments glued to a bold word (halant, reph, matra) belong to that word
  for(let i=l.s.length-1;i>0;i--){ const t=l.s[i][2]; if(l.s[i-1][0]==='b' && l.s[i][0]==='r' && t.trim() && t.trim().length<=3 && !/[=\d]/.test(t) && !/^\s/.test(t)){ l.s[i-1][2]+=t; l.s.splice(i,1);} }
  for(const s of l.s){ if(s[0]!=="d") s[2]=post(c(s[2])); }}
fs.writeFileSync("hi_lines.json",JSON.stringify(L));
