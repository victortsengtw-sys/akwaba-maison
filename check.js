/* Content checks run on every pull request (weekly updates included). */
const fs=require("fs");const load=f=>JSON.parse(fs.readFileSync("data/"+f,"utf8"));
const cards=load("cards.json"),routes=load("routes.json"),occ=load("occasions.json");const errs=[];
const ids=new Set();const DOM=["藝術","時尚","工藝","音樂","飲食","空間","節慶","人物","自然","脈絡"];
const MAPS=["abidjan","coast","country","north","west","dakar"];
const ART=["pyramid","tower","dome","mosque","columns","cocoa","cloth","face","drum","bowl","frame","leaf","circles","river","mend","speech","scales","coin","portrait","map","mountain","loom","boat","palm","baobab","fish","mic"];
const url=u=>/^https?:\/\/\S+$/.test(u);
for(const c of cards){if(ids.has(c.id))errs.push("重複的卡片 id："+c.id);ids.add(c.id);
 for(const k of ["id","order","layer","domain","name","what"])if(c[k]===undefined||c[k]==="")errs.push(`卡片 ${c.id} 缺少 ${k}`);
 if(!DOM.includes(c.domain))errs.push(`卡片 ${c.id} 的領域不正確：${c.domain}`);
 if(c.verified==="已查證"&&!(c.sources||[]).length)errs.push(`卡片 ${c.id} 標為已查證但沒有來源`);
 (c.sources||[]).forEach(u=>{if(!url(u))errs.push(`卡片 ${c.id} 的來源網址不正確：${u}`)});}
for(const c of cards)(c.links||[]).forEach(l=>{if(!ids.has(l))errs.push(`卡片 ${c.id} 連到不存在的卡片：${l}`)});
const rids=new Set();
for(const r of routes){if(rids.has(r.id))errs.push("重複的路線 id："+r.id);rids.add(r.id);
 if(![1,2,3].includes(r.days))errs.push(`路線 ${r.id} 的天數必須是 1–3`);
 if(!MAPS.includes(r.map))errs.push(`路線 ${r.id} 的地圖不正確：${r.map}`);
 if(r.art&&!ART.includes(r.art))errs.push(`路線 ${r.id} 的插圖不正確：${r.art}`);
 if(!(r.sources||[]).length)errs.push(`路線 ${r.id} 沒有來源`);
 (r.stops||[]).forEach((s,i)=>{if(!s.fr)errs.push(`路線 ${r.id} 第 ${i+1} 站缺少法文站名 fr`);if(s.card&&!ids.has(s.card))errs.push(`路線 ${r.id} 第 ${i+1} 站連到不存在的卡片：${s.card}`);if(s.x!=null&&(s.x<0||s.x>338||s.y<0||s.y>220))errs.push(`路線 ${r.id} 第 ${i+1} 站座標超出地圖`)});}
for(const o of occ)for(const k of ["title","language","dress","etiquette","avoid"])if(!o[k])errs.push(`場合 ${o.id} 缺少 ${k}`);
const simp=/[们这说时为国过还发会对动种开关应两门问东车长书网语见边际传头间]/;
for(const c of cards)for(const k of ["name","nameZh","what","why","meaning","use","signal","bridge","where"])if(c[k]&&simp.test(c[k]))errs.push(`卡片 ${c.id} 的 ${k} 好像混到簡體字`);
if(errs.length){console.error(errs.join("\n"));process.exit(1)}console.log(`OK：${cards.length} 張卡、${routes.length} 條路線、${occ.length} 種場合`);
