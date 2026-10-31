const fs=require('fs');const OpenCC=require('opencc-js');const conv=OpenCC.Converter({from:"twp",to:"cn"});
const src=fs.readFileSync('build.js','utf8');const m=src.match(/const CN = (\[\[.*?\]\]);/s);const CN=eval(m[1]);
const inp=JSON.parse(fs.readFileSync('tools/hant.json','utf8'));const out={};
for(const [k,v] of Object.entries(inp)){let s=v;for(const [a,b] of CN)s=s.split(a).join(b);out[k]=conv(s)}
fs.writeFileSync('tools/hans.json',JSON.stringify(out,null,1));console.log(Object.keys(out).length);
