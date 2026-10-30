const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));let T=s=>s;
/* ---------- illustration system v5: bold pattern ground + medallion ----------
   Every pattern is tied to a documented, Côte d'Ivoire–rooted source (see 符號 page):
   akan   = geometric Akan goldweights (spiral flanked by comb teeth)
   dida   = Dida stitch-resist raffia: clustered rings, yellow→red→black
   sudan  = Sudanese-style mud mosques of the north: buttresses + toron stakes
   korhogo= hand-painted Korhogo cloth animals (fish, birds), no masks
   kita   = narrow-strip woven cloth (Baoulé / Kita)
   lagoon = Ébrié / Aby lagoons
   modern = Abidjan 1960–70s modernist sun-screens (brise-soleil)
   wax    = commercial wax-print circles
   forest = forest leaves (cocoa belt, Taï)
   sea    = Atlantic (Dakar)                                                     */
const K="#141414",IV="#F2E8D5",OC="#D69A2D",TE="#B4452A",IN="#1E2A55",GR="#1F4A3A",BR="#5B2A1C",GD="#C9A34E",RA="#E2B85C";
function patDef(id,name,anim){
  const mv=(dx,dy,s)=>anim?`<animateTransform attributeName="patternTransform" type="translate" from="0 0" to="${dx} ${dy}" dur="${s}s" repeatCount="indefinite"/>`:"";
  const P=(w,h,body,dx,dy,s)=>`<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${body}${mv(dx??w,dy??0,s??30)}</pattern>`;
  switch(name){
  case "akan": return P(64,64,`<rect width="64" height="64" fill="${OC}"/><rect x="4" y="4" width="56" height="56" fill="none" stroke="${K}" stroke-width="4"/>
    <path d="M32 32 a3 3 0 0 1 3 3 a6 6 0 0 1 -6 6 a9 9 0 0 1 -9 -9 a12 12 0 0 1 12 -12 a15 15 0 0 1 15 15" fill="none" stroke="${K}" stroke-width="4"/>
    <path d="M10 12 h6 M10 22 h6 M10 32 h6 M10 42 h6 M10 52 h6 M48 12 h6 M48 22 h6 M48 32 h6 M48 42 h6 M48 52 h6" stroke="${K}" stroke-width="4"/>`,0,64,40);
  case "dida": return P(56,56,`<rect width="56" height="56" fill="${RA}"/>
    <g fill="none" stroke="${TE}" stroke-width="5"><circle cx="14" cy="14" r="8"/><circle cx="42" cy="18" r="6"/><circle cx="28" cy="42" r="9"/></g>
    <g fill="${K}"><circle cx="14" cy="14" r="3"/><circle cx="42" cy="18" r="2.5"/><circle cx="28" cy="42" r="3.5"/><circle cx="48" cy="46" r="3"/><circle cx="6" cy="40" r="2.5"/></g>`,56,0,50);
  case "sudan": return P(60,90,`<rect width="60" height="90" fill="#C17A45"/><path d="M8 90 V22 L18 8 L28 22 V90 Z" fill="#A9643A" stroke="${K}" stroke-width="4"/>
    <path d="M2 34 H34 M2 56 H34 M2 78 H34" stroke="${K}" stroke-width="5"/><path d="M38 90 V44 H58" fill="none" stroke="${K}" stroke-width="4"/><rect x="44" y="58" width="8" height="14" fill="${K}"/>`,60,0,60);
  case "korhogo": return P(90,70,`<rect width="90" height="70" fill="#EFE3C8"/>
    <path d="M8 22 C18 10 34 10 42 22 C34 34 18 34 8 22 Z M42 22 L52 12 V32 Z" fill="#3A2318"/><circle cx="16" cy="20" r="2.2" fill="#EFE3C8"/>
    <path d="M58 58 C58 46 70 40 78 46 L86 42 L82 50 C84 60 74 66 64 64 L56 68 Z" fill="#3A2318"/>
    <g fill="#3A2318"><circle cx="10" cy="54" r="2.5"/><circle cx="20" cy="54" r="2.5"/><circle cx="30" cy="54" r="2.5"/><circle cx="62" cy="14" r="2.5"/><circle cx="72" cy="14" r="2.5"/><circle cx="82" cy="14" r="2.5"/></g>`,90,0,70);
  case "kita": return P(48,48,`<rect width="48" height="48" fill="${K}"/><rect width="24" height="24" fill="${OC}"/><rect x="24" y="24" width="24" height="24" fill="${TE}"/>
    <path d="M5 34 H19 M5 39 H19 M29 9 H43 M29 14 H43" stroke="${IV}" stroke-width="3"/><path d="M24 0 V48" stroke="${IV}" stroke-width="1.5" stroke-dasharray="3 3"/>`,0,48,40);
  case "lagoon": return P(56,30,`<rect width="56" height="30" fill="${IN}"/><path d="M0 15 Q14 2 28 15 T56 15" fill="none" stroke="${IV}" stroke-width="5"/>`,56,0,8);
  case "modern": return P(44,44,`<rect width="44" height="44" fill="${IV}"/><path d="M0 2 H44 M2 0 V44" stroke="${K}" stroke-width="5"/><path d="M10 10 L34 34 M10 22 L22 34" stroke="${K}" stroke-width="3.5"/><rect x="26" y="8" width="10" height="10" fill="${OC}"/>`,44,44,50);
  case "wax": return P(76,76,`<rect width="76" height="76" fill="${IV}"/><circle cx="38" cy="38" r="30" fill="${TE}"/><circle cx="38" cy="38" r="20" fill="${OC}"/><circle cx="38" cy="38" r="10" fill="${IN}"/>
    <g stroke="${K}" stroke-width="4" fill="none"><circle cx="38" cy="38" r="30"/><circle cx="38" cy="38" r="20"/></g><circle cx="0" cy="0" r="9" fill="${GR}"/><circle cx="76" cy="0" r="9" fill="${GR}"/><circle cx="0" cy="76" r="9" fill="${GR}"/><circle cx="76" cy="76" r="9" fill="${GR}"/>`,76,0,60);
  case "forest": return P(60,60,`<rect width="60" height="60" fill="${GR}"/><path d="M10 50 C10 30 26 18 40 14 C38 32 28 46 10 50 Z" fill="#2E6B52" stroke="${K}" stroke-width="3"/><path d="M10 50 L34 22" stroke="${OC}" stroke-width="3"/><circle cx="46" cy="44" r="5" fill="${OC}"/>`,0,60,45);
  case "sea": return P(40,40,`<rect width="40" height="40" fill="#2B4C7E"/><path d="M0 12 H40 M0 28 H40" stroke="${IV}" stroke-width="3"/><circle cx="20" cy="20" r="3.5" fill="${OC}"/>`,40,0,20);
  }
  return P(10,10,`<rect width="10" height="10" fill="${IV}"/>`);
}
/* bold icons, drawn on a 338x220 canvas centred at 169,110 */
const S=(d,f,w)=>`<path d="${d}" fill="${f||"none"}" stroke="${K}" stroke-width="${w||9}" stroke-linejoin="round" stroke-linecap="round"/>`;
const ICON={
 pyramid:()=>S("M169 38 L250 178 H88 Z",OC)+`<path d="M104 152 H234 M119 126 H219 M134 100 H204 M149 74 H189" stroke="${K}" stroke-width="7"/>`,
 tower:()=>S("M140 182 V44 H198 V182",IN)+S("M94 182 V104 H140",TE)+`<path d="M152 64 H186 M152 88 H186 M152 112 H186 M152 136 H186 M152 160 H186" stroke="${IV}" stroke-width="7"/>`+S("M74 182 H264"),
 dome:()=>S("M104 182 V124 H234 V182",IV)+S("M116 124 A53 53 0 0 1 222 124 Z",TE)+`<path d="M134 182 V140 M169 182 V140 M204 182 V140" stroke="${K}" stroke-width="8"/><path d="M169 70 V40 M156 52 H182" stroke="${GD}" stroke-width="8" stroke-linecap="round"/>`,
 mosque:()=>S("M92 182 V106 H246 V182 Z",OC)+S("M112 106 V64 L128 46 L144 64 V106",OC)+S("M194 106 V56 L210 38 L226 56 V106",OC)+`<path d="M104 78 H152 M104 92 H152 M186 72 H234 M186 88 H234 M84 130 H100 M84 158 H100 M238 130 H254 M238 158 H254" stroke="${K}" stroke-width="7"/>`+S("M156 182 V146 A13 13 0 0 1 182 146 V182",K,6),
 columns:()=>S("M90 98 L169 54 L248 98 Z",TE)+S("M98 182 V98 H240 V182",IV)+`<path d="M120 182 V112 M146 182 V112 M192 182 V112 M218 182 V112" stroke="${K}" stroke-width="9"/>`+S("M78 182 H260"),
 cocoa:()=>S("M169 30 C210 52 222 104 210 146 C200 176 182 188 169 190 C156 188 138 176 128 146 C116 104 128 52 169 30 Z",TE)+`<path d="M169 40 V182 M148 54 C138 92 140 140 152 176 M190 54 C200 92 198 140 186 176" stroke="${OC}" stroke-width="6" fill="none"/>`+S("M169 30 C166 18 174 10 188 8",null,7),
 cloth:()=>{let s="";for(let i=0;i<4;i++)for(let j=0;j<3;j++){const x=106+i*32,y=56+j*36;s+=`<rect x="${x}" y="${y}" width="32" height="36" fill="${(i+j)%2?OC:TE}"/>`+((i+j)%2?`<path d="M${x+16} ${y+8} L${x+26} ${y+18} L${x+16} ${y+28} L${x+6} ${y+18} Z" fill="${K}"/>`:`<path d="M${x+6} ${y+12} H${x+26} M${x+6} ${y+24} H${x+26}" stroke="${IV}" stroke-width="4"/>`)}return s+S("M106 56 H234 V164 H106 Z",null,8)+`<path d="M138 56 V164 M170 56 V164 M202 56 V164" stroke="${K}" stroke-width="4"/>`},
 face:()=>S("M169 34 C202 34 216 70 214 110 C212 152 194 184 169 190 C144 184 126 152 124 110 C122 70 136 34 169 34 Z",OC)+S("M144 104 C152 94 162 94 166 104 C160 110 150 110 144 104 Z",K,5)+S("M172 104 C176 94 186 94 194 104 C188 110 178 110 172 104 Z",K,5)+`<path d="M169 112 V146" stroke="${K}" stroke-width="7"/><path d="M156 162 H182" stroke="${K}" stroke-width="7"/><path d="M140 62 H198" stroke="${TE}" stroke-width="8"/>`,
 drum:()=>S("M121 64 L138 178 H200 L217 64 Z",TE)+S("M121 64 A48 14 0 0 0 217 64 A48 14 0 0 0 121 64 Z",IV)+`<path d="M126 82 L152 122 L140 172 M212 82 L186 122 L198 172 M152 122 H186" stroke="${OC}" stroke-width="6" fill="none"/>`,
 bowl:()=>S("M92 112 H246 C242 152 210 180 169 180 C128 180 96 152 92 112 Z",TE)+S("M150 180 L146 194 H192 L188 180",IV,7)+`<path d="M138 52 C130 66 146 74 138 90 M169 44 C161 60 177 70 169 88 M200 52 C192 66 208 74 200 90" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M106 126 H232" stroke="${OC}" stroke-width="6"/>`,
 frame:()=>S("M98 40 H240 V180 H98 Z",IV)+`<rect x="114" y="56" width="110" height="108" fill="${IN}"/><circle cx="196" cy="88" r="16" fill="${OC}"/><path d="M114 164 L150 112 L176 142 L196 122 L224 164 Z" fill="${TE}"/>`+S("M114 56 H224 V164 H114 Z",null,6),
 leaf:()=>S("M169 70 C130 70 102 98 98 132 C134 132 160 110 169 70 Z",GR)+S("M169 96 C208 96 236 124 240 158 C204 158 178 136 169 96 Z","#2E6B52")+S("M169 186 V56",null,8)+`<circle cx="169" cy="48" r="12" fill="${OC}" stroke="${K}" stroke-width="6"/>`,
 circles:()=>`<g stroke="${K}" stroke-width="7"><circle cx="146" cy="86" r="36" fill="${OC}"/><circle cx="192" cy="86" r="36" fill="${RA}" fill-opacity=".9"/><circle cx="146" cy="134" r="36" fill="#C17A45" fill-opacity=".9"/><circle cx="192" cy="134" r="36" fill="#EFE3C8" fill-opacity=".9"/></g><circle cx="169" cy="110" r="9" fill="${K}"/>`,
 river:()=>S("M150 76 L156 52 L164 66 L169 46 L174 66 L182 52 L188 76 Z",GD,7)+`<path d="M86 116 C116 104 140 128 169 118 S222 104 252 116" stroke="${IN}" stroke-width="12" fill="none"/><path d="M86 146 C116 134 140 158 169 148 S222 134 252 146" stroke="${IN}" stroke-width="12" fill="none"/>`,
 mend:()=>S("M104 58 H234 V176 H104 Z",IV)+`<path d="M104 58 L150 110 L130 140 L169 176 M234 58 L194 100 L212 128 L169 176" stroke="${GD}" stroke-width="10" fill="none" stroke-linejoin="round"/>`,
 speech:()=>S("M84 56 H188 V120 H126 L104 142 V120 H84 Z",IV)+S("M150 98 H254 V162 H234 V184 L212 162 H150 Z",OC)+`<path d="M100 78 H170 M100 98 H150 M166 120 H238 M166 140 H214" stroke="${K}" stroke-width="7"/>`,
 scales:()=>S("M169 46 V180 M134 180 H204")+S("M104 72 H234",null,9)+S("M84 128 C90 142 124 142 130 128 Z",OC,7)+S("M208 128 C214 142 248 142 254 128 Z",TE,7)+`<path d="M104 72 L84 128 M104 72 L130 128 M234 72 L208 128 M234 72 L254 128" stroke="${K}" stroke-width="5"/><circle cx="169" cy="44" r="10" fill="${GD}" stroke="${K}" stroke-width="6"/>`,
 coin:()=>S("M112 56 H226 V164 H112 Z",GD)+`<path d="M169 110 a5 5 0 0 1 5 5 a10 10 0 0 1 -10 10 a15 15 0 0 1 -15 -15 a20 20 0 0 1 20 -20 a25 25 0 0 1 25 25" fill="none" stroke="${K}" stroke-width="7"/><path d="M124 70 h10 M124 88 h10 M124 106 h10 M124 124 h10 M124 142 h10 M204 70 h10 M204 88 h10 M204 106 h10 M204 124 h10 M204 142 h10" stroke="${K}" stroke-width="7"/>`,
 portrait:()=>S("M96 186 C100 144 130 126 169 126 C208 126 238 144 242 186 Z",IN)+S("M169 52 C188 52 200 66 200 88 C200 110 186 124 169 124 C152 124 138 110 138 88 C138 66 150 52 169 52 Z",OC)+`<path d="M169 140 L180 156 L169 172 L158 156 Z" fill="${GD}" stroke="${K}" stroke-width="5"/>`,
 map:()=>S("M134 36 L196 38 L234 52 L244 92 L238 132 L258 168 L252 178 L196 176 L140 172 L108 160 L86 132 L94 104 L84 72 L108 50 Z",OC)+`<circle cx="214" cy="160" r="10" fill="${TE}" stroke="${K}" stroke-width="6"/>`,
 mountain:()=>S("M70 184 L128 104 L152 132 L188 60 L202 84 L216 62 L268 184 Z",GR)+`<path d="M188 60 L202 84 L216 62" stroke="${IV}" stroke-width="8" fill="none"/><path d="M236 116 V184 M248 110 V184" stroke="${IV}" stroke-width="6"/><circle cx="104" cy="62" r="18" fill="${OC}" stroke="${K}" stroke-width="7"/>`,
 loom:()=>`<rect x="70" y="96" width="74" height="42" fill="${OC}"/>`+S("M70 96 H144 V138 H70 Z",null,7)+`<path d="M144 102 L268 112 M144 110 L268 114 M144 118 L268 116 M144 126 L268 118 M144 132 L268 120" stroke="${K}" stroke-width="3"/>`+S("M160 64 V170 M192 64 V170 M160 64 H192 M160 170 H192",null,8)+`<path d="M84 104 L94 117 L84 130 L74 117 Z M116 104 L126 117 L116 130 L106 117 Z" fill="${TE}"/>`,
 boat:()=>S("M84 132 C126 150 214 150 256 130 L246 150 C204 168 130 168 96 150 Z",TE)+S("M168 132 L184 90",null,8)+`<circle cx="186" cy="80" r="9" fill="${K}"/>`+S("M206 98 L226 172",null,7)+`<path d="M70 182 C104 174 136 190 169 182 S236 174 268 182" stroke="${IN}" stroke-width="9" fill="none"/><circle cx="246" cy="58" r="18" fill="${OC}" stroke="${K}" stroke-width="7"/>`,
 palm:()=>S("M172 186 C170 146 164 108 168 74",null,10)+S("M168 74 C138 58 108 66 92 88 C120 80 146 80 168 74 Z",GR,7)+S("M168 74 C192 52 226 52 248 70 C220 68 194 70 168 74 Z",GR,7)+S("M168 74 C154 46 158 28 172 16 C180 36 176 56 168 74 Z","#2E6B52",7)+`<circle cx="164" cy="82" r="8" fill="${OC}" stroke="${K}" stroke-width="5"/><circle cx="180" cy="84" r="8" fill="${OC}" stroke="${K}" stroke-width="5"/>`,
 baobab:()=>S("M144 186 C150 154 148 124 138 104 L200 104 C190 124 188 154 194 186 Z","#8A5A3B")+S("M138 104 C122 96 108 94 94 82 M144 104 C140 86 132 72 126 58 M169 104 V58 M194 104 C198 86 206 72 214 58 M200 104 C216 96 230 94 244 82",null,9)+`<circle cx="250" cy="46" r="16" fill="${OC}" stroke="${K}" stroke-width="7"/>`,
 fish:()=>S("M92 110 C120 70 196 70 222 110 C196 150 120 150 92 110 Z","#3A2318")+S("M222 110 L256 84 V136 Z","#3A2318")+`<circle cx="120" cy="104" r="7" fill="#EFE3C8"/><path d="M150 90 V130 M172 88 V132 M194 92 V128" stroke="#EFE3C8" stroke-width="5"/>`,
 mic:()=>S("M150 52 A19 19 0 0 1 188 52 V110 A19 19 0 0 1 150 110 Z",OC)+S("M132 100 C132 128 148 142 169 142 C190 142 206 128 206 100",null,8)+S("M169 142 V176 M146 178 H192",null,9)
};
const PAT_BY_ID={b01:"four",b02:"akan",b03:"sudan",b04:"lagoon",b05:"modern",b06:"forest",b07:"kita",b08:"lagoon",b09:"modern",b10:"sudan",b11:"akan",b12:"kita",
 pyramide:"modern",ivoire:"modern",basilica:"modern",mosques:"sudan",bassam:"lagoon",stpaul:"modern",mcci:"akan",fakhoury:"modern",donwahi:"modern",guirandou:"modern",watts:"modern",aboudia:"wax",
 artweek:"modern",dakart:"sea",masa:"kita",femua:"lagoon",abissa:"akan",baoule:"akan",goldweights:"akan",kita:"kita",wax:"wax",senufo:"korhogo",dan:"forest",zaouli:"kita",patheo:"wax",loza:"wax",
 zouglou:"lagoon",alpha:"lagoon",drogba:"kita",kourouma:"sudan",chocolatier:"forest",maquis:"lagoon",kedjenou:"akan",bangui:"forest",assinie:"lagoon",parks:"forest"};
const ICON_BY_ID={b01:"circles",b02:"river",b03:"mosque",b04:"columns",b05:"pyramid",b06:"cocoa",b07:"mend",b08:"speech",b09:"scales",b10:"dome",b11:"drum",b12:"cloth",pyramide:"pyramid",ivoire:"tower",basilica:"dome",mosques:"mosque",bassam:"columns",stpaul:"dome",mcci:"coin",chocolatier:"cocoa",kita:"loom",wax:"cloth",goldweights:"coin",senufo:"fish",dan:"mountain",baoule:"face",zaouli:"drum",parks:"leaf",assinie:"boat",maquis:"bowl",kedjenou:"bowl",bangui:"palm",dakart:"baobab",artweek:"frame",femua:"mic",masa:"drum",abissa:"drum",loza:"cloth",patheo:"cloth",zouglou:"mic",alpha:"mic",drogba:"portrait",kourouma:"portrait",watts:"frame",aboudia:"frame",fakhoury:"frame",donwahi:"frame",guirandou:"frame"};
const ICON_BY_DOMAIN={藝術:"frame",時尚:"cloth",工藝:"loom",音樂:"drum",飲食:"bowl",空間:"columns",節慶:"drum",人物:"portrait",自然:"leaf",脈絡:"map"};
const PAT_BY_DOMAIN={藝術:"modern",時尚:"wax",工藝:"kita",音樂:"lagoon",飲食:"forest",空間:"modern",節慶:"akan",人物:"kita",自然:"forest",脈絡:"kita"};
const ROUTE_PAT={pyramid:"modern",cloth:"wax",boat:"lagoon",dome:"akan",palm:"forest",loom:"korhogo",mountain:"forest",baobab:"sea"};
let _pid=0;
function plate(icon,pat,cls,label,anim){
  const id="p"+(++_pid);const four=pat==="four";
  const ground=four?`<defs>${patDef(id+"a","akan",anim)}${patDef(id+"b","dida",anim)}${patDef(id+"c","sudan",anim)}${patDef(id+"d","korhogo",anim)}</defs>
    <rect x="0" y="0" width="85" height="220" fill="url(#${id}a)"/><rect x="85" y="0" width="84" height="220" fill="url(#${id}b)"/><rect x="169" y="0" width="85" height="220" fill="url(#${id}c)"/><rect x="254" y="0" width="84" height="220" fill="url(#${id}d)"/>
    <path d="M85 0 V220 M169 0 V220 M254 0 V220" stroke="${K}" stroke-width="5"/>`
   :`<defs>${patDef(id,pat,anim)}</defs><rect width="338" height="220" fill="url(#${id})"/>`;
  const labels=four?`<g font-family="Jost,Arial,sans-serif" font-weight="700" font-size="11" letter-spacing="2" text-anchor="middle">${[["AKAN",42],["KRU",127],["MANDÉ",211],["GUR",296]].map(([t,x])=>`<rect x="${x-34}" y="188" width="68" height="20" fill="${K}"/><text x="${x}" y="202" fill="${IV}">${t}</text>`).join("")}</g>`:"";
  const ring=anim?`<circle cx="169" cy="110" r="84" fill="none" stroke="${GD}" stroke-width="3" stroke-dasharray="2 9"><animateTransform attributeName="transform" type="rotate" from="0 169 110" to="360 169 110" dur="60s" repeatCount="indefinite"/></circle>`:"";
  const med=`<circle cx="169" cy="110" r="76" fill="${IV}" stroke="${K}" stroke-width="8"/><circle cx="169" cy="110" r="65" fill="none" stroke="${GD}" stroke-width="3"/>${ring}<g transform="translate(169 110) scale(.6) translate(-169 -110)">${(ICON[icon]||ICON.map)()}</g>`;
  return `<svg ${cls?`class="${cls}"`:""} viewBox="0 0 338 220" ${label?`role="img" aria-label="${esc(label)}"`:'aria-hidden="true"'}>${ground}${med}${labels}<rect x="3" y="3" width="332" height="214" fill="none" stroke="${K}" stroke-width="6"/></svg>`;
}
const iconOf=c=>c.art||ICON_BY_ID[c.id]||ICON_BY_DOMAIN[c.domain]||"map";
const patOf=c=>c.pat||PAT_BY_ID[c.id]||PAT_BY_DOMAIN[c.domain]||"kita";
const artSvg=(c,cls="art",anim)=>plate(iconOf(c),patOf(c),cls,"插圖："+(c.nameZh||c.name),anim);
const routePlate=(r,cls,anim)=>plate(r.art||"map",r.pat||ROUTE_PAT[r.art]||"kita",cls,"",anim);

// ---- appended: monogram + maps (shared with the Claude preview page) ----
function mono(size,ink,bg){
  /* two heavy, even-stroke A's: legs interlace once (right A passes over left A), one shared bar binds both */
  const W=10,top=14,foot=86,half=24,c1=38,c2=62,yb=64;
  const x=(c,s,y)=>c+s*half*(y-top)/(foot-top);
  const legs=c=>`M${x(c,-1,foot+10).toFixed(2)} ${foot+10} L${c} ${top} L${x(c,1,foot+10).toFixed(2)} ${foot+10}`;
  const id="m"+Math.random().toString(36).slice(2,7);
  const st=(d,w,col,j)=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="${j||"miter"}" stroke-miterlimit="8"/>`;
  const bar=`M${x(c1,-1,yb).toFixed(2)} ${yb} L${x(c2,1,yb).toFixed(2)} ${yb}`;
  return `<svg viewBox="6 -2 88 90" width="${size}" height="${size}" role="img" aria-label="AKWABA"><defs><clipPath id="${id}"><rect x="0" y="-10" width="100" height="${foot+10}"/></clipPath></defs><g clip-path="url(#${id})">
  ${st(legs(c1),W,ink)}${st(legs(c2),W+5,bg)}${st(legs(c2),W,ink)}${st(bar,W*.78,ink,"round")}</g></svg>`;
}

function baseMap(type){
  const I="#3A4A6E",lab=(x,y,t,a)=>`<text x="${x}" y="${y}" ${a?`text-anchor="${a}"`:""} font-family="Jost,sans-serif" font-weight="700" font-size="10" letter-spacing="1.4" fill="#141414">${t}</text>`;
  const water=`fill="#1E2A55" opacity=".85"`;
  if(type==="abidjan")return `<path d="M0 118 C46 108 76 134 116 126 C146 120 156 148 186 148 C226 148 246 124 286 128 C310 131 322 122 338 124 V144 C322 142 310 151 286 148 C246 144 226 168 186 168 C156 168 146 140 116 146 C76 154 46 128 0 138 Z" ${water}/>${lab(18,92,"YOPOUGON")}${lab(104,98,"PLATEAU")}${lab(218,40,"COCODY")}${lab(92,206,"TREICHVILLE")}${lab(196,206,"MARCORY")}${lab(326,24,"BINGERVILLE →","end")}`;
  if(type==="coast")return `<rect x="0" y="152" width="338" height="68" ${water}/><path d="M0 114 C60 106 110 120 160 112 S260 104 338 110 V124 C260 118 210 128 160 124 S60 118 0 126 Z" ${water}/>${lab(20,206,"OCÉAN ATLANTIQUE")}${lab(20,102,"LAGUNE")}${lab(24,170,"ABIDJAN")}${lab(132,170,"GRAND-BASSAM")}${lab(250,170,"ASSINIE")}`;
  if(type==="north")return `<circle cx="166" cy="106" r="34" fill="none" stroke="${I}" stroke-width=".5" stroke-dasharray="2 3"/>${lab(180,98,"KORHOGO")}${lab(188,140,"WARANIÉNÉ")}${lab(84,172,"FAKAHA")}${lab(162,44,"KONI")}${lab(26,78,"KOUTO")}${lab(320,206,"示意圖 · 非比例","end")}`;
  if(type==="west")return `<path d="M120 60 L140 40 L160 58 L190 30 L210 62 L232 44 L260 70" fill="none" stroke="${I}" stroke-width=".7"/>${lab(182,118,"MAN")}${lab(226,74,"DENT DE MAN")}${lab(96,120,"CASCADE")}${lab(206,162,"GBÊPLEU")}${lab(96,188,"LIEUPLEU")}${lab(320,206,"示意圖 · 非比例","end")}`;
  if(type==="dakar")return `<rect width="338" height="220" ${water}/><path d="M60 40 C110 30 170 50 214 80 C246 102 270 128 282 160 C270 176 238 178 214 168 C190 156 168 128 140 112 C112 96 76 84 52 62 Z" fill="#F1EADD" stroke="${I}" stroke-width=".6"/><circle cx="300" cy="182" r="7" fill="#F1EADD" stroke="${I}" stroke-width=".6"/>${lab(60,32,"ALMADIES")}${lab(166,80,"VILLAGE DES ARTS")}${lab(250,178,"PLATEAU","end")}${lab(316,206,"GORÉE","end")}`;
  return `<path d="M120 20 L210 24 L262 40 L276 96 L268 150 L296 196 L290 206 L200 204 L120 200 L70 186 L40 150 L50 110 L36 70 L70 40 Z" fill="#F1EADD" stroke="${I}" stroke-width=".7"/>${lab(150,52,"KORHOGO")}${lab(52,124,"MAN")}${lab(204,86,"BOUAKÉ")}${lab(66,172,"YAMOUSSOUKRO")}${lab(222,212,"ABIDJAN")}`;
}
function mapSvg(r){
  const pts=(r.stops||[]).filter(s=>s.x!=null);
  const line=pts.length>1?`<path d="M${pts.map(p=>p.x+" "+p.y).join(" L")}" fill="none" stroke="#B4452A" stroke-width="3.5" stroke-dasharray="7 5"/>`:"";
  const dots=pts.map((p,i)=>`<path d="M${p.x} ${p.y-12} L${p.x+12} ${p.y} L${p.x} ${p.y+12} L${p.x-12} ${p.y} Z" fill="#141414" stroke="#D69A2D" stroke-width="2"/><text x="${p.x}" y="${p.y+3.5}" text-anchor="middle" font-family="Jost,sans-serif" font-weight="600" font-size="11" fill="#F7F3EC">${i+1}</text>`).join("");
  return `<svg class="art" viewBox="0 0 338 220" role="img" aria-label="${esc(T("路線示意地圖"))}"><rect width="338" height="220" fill="#EFE3C8"/>${baseMap(r.map)}<rect x="3" y="3" width="332" height="214" fill="none" stroke="#141414" stroke-width="6"/>${line}${dots}</svg>`;
}


// 首頁主視覺：四色帶可依容器比例自動拉寬（site.js 會改 viewBox 與各元素位置）
function heroFour(label){
  const id="h"+(++_pid);
  const bands=["akan","dida","sudan","korhogo"].map((n,i)=>`<rect data-b="${i}" x="${i*84.5}" y="0" width="84.5" height="220" fill="url(#${id}${i})"/>`).join("");
  const divs=[1,2,3].map(i=>`<path data-d="${i}" d="M${i*84.5} 0 V220" stroke="${K}" stroke-width="5"/>`).join("");
  const labs=[["AKAN",0],["KRU",1],["MANDÉ",2],["GUR",3]].map(([t,i])=>`<g data-l="${i}" transform="translate(${i*84.5+42.25} 0)"><rect x="-34" y="188" width="68" height="20" fill="${K}"/><text x="0" y="202" fill="${IV}">${t}</text></g>`).join("");
  const ring=`<circle cx="169" cy="110" r="84" fill="none" stroke="${GD}" stroke-width="3" stroke-dasharray="2 9"><animateTransform attributeName="transform" type="rotate" from="0 169 110" to="360 169 110" dur="60s" repeatCount="indefinite"/></circle>`;
  const med=`<g data-m><circle cx="169" cy="110" r="76" fill="${IV}" stroke="${K}" stroke-width="8"/><circle cx="169" cy="110" r="65" fill="none" stroke="${GD}" stroke-width="3"/>${ring}<g transform="translate(169 110) scale(.6) translate(-169 -110)">${ICON.circles()}</g></g>`;
  return `<svg class="hero-four" viewBox="0 0 338 220" role="img" aria-label="${esc(label)}"><defs>${["akan","dida","sudan","korhogo"].map((n,i)=>patDef(id+i,n,true)).join("")}</defs>${bands}${divs}${med}<g font-family="Jost,Arial,sans-serif" font-weight="700" font-size="11" letter-spacing="2" text-anchor="middle">${labs}</g><rect data-f x="3" y="3" width="332" height="214" fill="none" stroke="${K}" stroke-width="6"/></svg>`;
}

module.exports={heroFour,plate,patDef,artSvg,routePlate,mono,mapSvg,setT:f=>{T=f}};
