const fs=require('fs');
const M=JSON.parse(fs.readFileSync(__dirname+'/map.json','utf8'));
const MATRAS=new Set("ािीुूृेैोौं:ँॅ".split(''));
function conv(t){
  if(!t) return t;
  t=t.replace(/·/g,'•');
  for(const [a,b] of M){ if(t.includes(a)){ let prev; do{prev=t;t=t.split(a).join(b);}while(t!==prev && t.includes(a)); } }
  t=t.replace(/ç([\s\S])/g,'$1ि');
  let prev;
  do{prev=t;t=t.replace(/ि्(.)/g,'्$1ि');}while(prev!==t);
  do{prev=t;t=t.replace(/िं्(.)/g,'्$1िं');}while(prev!==t);
  let i=t.indexOf('ü');
  while(i>0){let p=i-1;while(p>0&&MATRAS.has(t.charAt(p)))p--;t=t.slice(0,p)+'र्'+t.slice(p,i)+t.slice(i+1);i=t.indexOf('ü');}
  t=t.replace(/Ò/g,'‘').replace(/Ó/g,'’').replace(/ï/g,'');
  return t;
}
module.exports=conv;
if(require.main===module){
  const c=require('./runconv.js');
  const p=JSON.parse(fs.readFileSync('hi_legacy.json','utf8'));
  let diff=0;for(const k of [50,119,300,700]){const a=conv(p[k]),b=c(p[k]).replace(/ï/g,'');if(a!==b){diff++;for(let j=0;j<a.length;j++)if(a[j]!==b[j]){console.log(k,JSON.stringify(a.slice(j-20,j+20)),JSON.stringify(b.slice(j-20,j+20)));break;}}}
  console.log('diffs',diff);
}
