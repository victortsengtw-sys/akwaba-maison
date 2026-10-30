/* AKWABA · 非洲品味之家 — static site builder (no dependencies required).
   Optional: `npm i opencc-js` enables the Simplified-Chinese (/zh-hans/) edition.
   Usage: node build.js   → writes ./dist                                         */
const fs = require("fs"), path = require("path");
const A = require("./src/art.js");
const cfg = JSON.parse(fs.readFileSync("config.json", "utf8"));
const load = f => JSON.parse(fs.readFileSync(path.join("data", f), "utf8"));
const cards = load("cards.json").sort((a, b) => a.order - b.order);
const routes = load("routes.json").sort((a, b) => a.order - b.order);
const occasions = load("occasions.json").sort((a, b) => a.order - b.order);
const base = cards.filter(c => c.layer === "底圖");
const body = cards.filter(c => c.layer !== "底圖");
const byId = id => cards.find(c => c.id === id);
const BASE = (cfg.basePath || "").replace(/\/$/, "");
const SITE = (cfg.siteUrl || "").replace(/\/$/, "");
const OUT = "dist";
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const host = u => { try { return new URL(u).hostname.replace(/^www\./, "") } catch (e) { return u } };
const DOMAINS = ["藝術", "時尚", "工藝", "音樂", "飲食", "空間", "節慶", "人物", "自然"];
const BUILD_DATE = new Date();

/* ---------- Simplified edition: mainland naming first, then OpenCC ---------- */
let conv = null;
try { const OpenCC = require("opencc-js"); conv = OpenCC.Converter({ from: "twp", to: "cn" }); }
catch (e) { console.warn("opencc-js not installed → skipping /zh-hans/ edition"); }
const CN = [["象牙海岸", "科特迪瓦"], ["阿必尚", "阿比让"], ["大巴薩姆", "大巴萨姆"], ["亞穆蘇克羅", "亚穆苏克罗"], ["班熱維爾", "班热维尔"], ["達卡", "达喀尔"], ["迦納", "加纳"], ["布吉納法索", "布基纳法索"], ["馬利", "马里"], ["塞內加爾", "塞内加尔"], ["奈及利亞", "尼日利亚"], ["幾內亞", "几内亚"], ["賴比瑞亞", "利比里亚"], ["獅子山", "塞拉利昂"], ["衣索比亞", "埃塞俄比亚"], ["盧安達", "卢旺达"], ["貝南", "贝宁"], ["厄瓜多", "厄瓜多尔"], ["尼日河", "尼日尔河"], ["奈比多", "内比都"], ["畢卡索", "毕加索"], ["若望保祿二世", "若望·保禄二世"], ["教宗", "教皇"], ["碧昂絲", "碧昂丝"], ["非洲盃", "非洲杯"], ["世界盃", "世界杯"], ["計程車", "出租车"], ["資訊", "信息"], ["網路", "网络"], ["影片", "视频"], ["品質", "质量"], ["透過", "通过"], ["飯店", "酒店"], ["伴手禮", "伴手礼"], ["墾丁", "垦丁"]];
const toHans = html => { for (const [a, b] of CN) html = html.split(a).join(b); return conv(html); };

/* ---------- page shell ---------- */
const NAV = [["", "首頁"], ["story/", "故事"], ["explore/", "探索"], ["routes/", "路線"], ["savoir-vivre/", "場合"], ["about/", "關於"]];
function shell({ lang, p, title, desc, body, ld, nav }) {
  const pre = lang === "hans" ? "/zh-hans" : "";
  const url = (l, pp) => `${SITE}${BASE}${l === "hans" ? "/zh-hans" : ""}/${pp}`;
  const L = pp => `${BASE}${pre}/${pp}`;
  const ga = cfg.ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${cfg.ga4}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${cfg.ga4}');</script>` : "";
  const gsc = cfg.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleSiteVerification)}">` : "";
  return `<!DOCTYPE html>
<html lang="${lang === "hans" ? "zh-Hans" : "zh-Hant"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url(lang, p)}">
<link rel="alternate" hreflang="zh-Hant" href="${url("hant", p)}">
${conv ? `<link rel="alternate" hreflang="zh-Hans" href="${url("hans", p)}">` : ""}
<link rel="alternate" hreflang="x-default" href="${url("hant", p)}">
<meta property="og:type" content="${ld && ld["@type"] === "Article" ? "article" : "website"}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url(lang, p)}">
<meta property="og:image" content="${SITE}${BASE}/assets/og.png">
<meta property="og:locale" content="${lang === "hans" ? "zh_CN" : "zh_TW"}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F7F3EC">
<meta name="author" content="Victor Tseng 曾浩瑜">
<meta name="copyright" content="© Victor Tseng 曾浩瑜. All rights reserved.">
<link rel="icon" href="${BASE}/assets/favicon.svg" type="image/svg+xml">
${gsc}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Noto+Serif+TC:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}/assets/site.css?v=${+BUILD_DATE}">
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ""}
${ga}
</head>
<body>
<a class="skip" href="#main">跳到內容</a>
<header class="wrap top"><a class="brand" href="${L("")}" aria-label="AKWABA 首頁">${A.mono(28, "#141414", "#F7F3EC")}AKWABA</a>
<div class="tg" role="group" aria-label="語言"><a href="${BASE}/${p}" class="${lang !== "hans" ? "on" : ""}" hreflang="zh-Hant" lang="zh-Hant">繁</a>${conv ? `<a href="${BASE}/zh-hans/${p}" class="${lang === "hans" ? "on" : ""}" hreflang="zh-Hans" lang="zh-Hans">简</a>` : ""}</div></header>
<nav class="main" aria-label="主選單"><div class="in wrap">${NAV.map(([pp, t]) => `<a href="${L(pp)}" class="${nav === pp ? "on" : ""}">${t}</a>`).join("")}</div></nav>
<main id="main">${body(L)}</main>
<footer><div class="wrap">AKWABA · 非洲品味之家 · MAISON DE GOÛT AFRICAIN<br>內容每週更新與查核 · 最後更新 ${BUILD_DATE.toISOString().slice(0, 10)}<br>© 2026–${BUILD_DATE.getFullYear()} Victor Tseng 曾浩瑜 · 版權所有，未經授權請勿轉載 · <a href="${L("about/")}">合作與授權洽詢</a></div></footer>
<div class="drv" id="drv" role="dialog" aria-modal="true"><div class="q">Bonjour, je voudrais aller à :</div><div class="p" id="drvP"></div><div class="q" id="drvZ"></div><div class="q" style="margin-top:28px">（點一下關閉）</div></div>
<script src="${BASE}/assets/site.js?v=${+BUILD_DATE}" defer></script>
</body></html>`;
}

/* ---------- components ---------- */
const nm = c => c.layer === "底圖" ? c.name : (c.nameZh || c.name);
const cardPath = c => c.layer === "底圖" ? `story/${c.id}/` : `explore/${c.id}/`;
const srcList = list => (list || []).length ? `<ul class="srcs">${list.map((u, i) => `<li><a href="${esc(u)}" target="_blank" rel="noopener"><span>${i + 1}</span><span>${esc(host(u))}<small>${esc(u.length > 80 ? u.slice(0, 80) + "…" : u)}</small></span><span aria-hidden="true">↗</span></a></li>`).join("")}</ul>` : `<p class="note">尚待補上來源</p>`;
const chapRow = (c, i, L) => `<a class="chap" href="${L(cardPath(c))}"><span class="n">${pad(i + 1)}</span>${A.artSvg(c, "")}<span><span class="tt">${esc(c.name)}</span><br><span class="ee">${esc((c.era || "").replace(/^底圖 \d+ · /, ""))} · ${esc(c.nameZh || "")}</span></span><span aria-hidden="true">→</span></a>`;
const tile = (c, L) => `<a class="tile" href="${L(cardPath(c))}" data-d="${esc(c.domain)}">${A.artSvg(c, "")}<span class="tx"><span class="nm">${esc(nm(c))}</span><br><span class="dm">${esc(c.domain)} · ${esc(c.region || "")}</span></span></a>`;
const routeCard = (r, L, attrs = "") => `<a class="rcard" href="${L(`routes/${r.id}/`)}" ${attrs}>${A.routePlate(r, "")}<span class="in" style="display:block"><span class="caps" style="color:var(--goldT)">路線 ${esc(r.code)} · ${r.days} 天 · ${esc(r.zone)}</span><span class="tl" style="display:block">${esc(r.title)}</span><span class="meta"><span>${esc(r.span)}</span><span>${r.stops.length} 站</span></span><span class="tot" style="display:block">${esc(r.total)} <small style="color:var(--muted)">FCFA</small></span></span></a>`;
function isoWeek(d) { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return Math.ceil(((t - y0) / 864e5 + 1) / 7) }

/* ---------- pages ---------- */
const pages = [];
// 暫時隱藏的頁面：不產生、不進 sitemap。要恢復就從這裡移除，並把它加回 NAV。
const HIDDEN = ["signes/"];
const add = (p, nav, title, desc, body, ld) => { if (!HIDDEN.includes(p)) pages.push({ p, nav, title, desc, body, ld }); };
const SITE_DESC = "用故事讀懂象牙海岸（科特迪瓦）的藝術、建築、工藝、音樂、飲食與社交禮儀：12 章底圖、" + body.length + " 張有來源的解讀卡、" + routes.length + " 條分區路線，附預估花費與中法對照站名。";

// home
add("", "", "AKWABA · 非洲品味之家｜象牙海岸藝術、文化與生活指南", SITE_DESC, L => {
  const wk = isoWeek(BUILD_DATE), first = base[0];
  return `<div class="first"><section class="hero"><div class="id">${A.mono(110, "#141414", "#F7F3EC")}<h1 class="word">AKWABA</h1><div class="zhname">非洲品味之家</div><div class="tag">MAISON DE GOÛT AFRICAIN</div><p style="margin:6px 0 0;letter-spacing:.12em">看懂非洲的品味，從一個跡象開始</p><a class="cue" href="#more" aria-label="往下看更多內容"><span>往下探索</span><i aria-hidden="true"></i></a></div>
  <div class="poster">${A.plate("circles", "four", "", "四大文化圈", true)}</div></section>
  <div class="tri" aria-hidden="true"><i style="background:#D69A2D"></i><i style="background:#B4452A"></i><i style="background:#1E2A55"></i></div>
  <div class="stats"><a href="${L("story/")}"><b style="color:var(--ox)">${base.length}</b><span>章故事</span></a><a href="${L("explore/")}"><b style="color:var(--fo)">${body.length}</b><span>張解讀卡</span></a><a href="${L("routes/")}"><b style="color:var(--la)">${routes.length}</b><span>條路線</span></a></div></div>
  <div class="wrap" id="more"><div class="two">
   <section class="sec"><div class="rule caps"><span>從這裡開始</span><i></i><span>01 / ${pad(base.length)}</span></div>
    <h2 class="t">${esc(first.name)}</h2><div class="sub">${esc(first.nameZh)}</div>
    <p class="lead">${esc(first.what.slice(0, 120))}…</p>
    <p class="note">來源 ${first.sources.length} 筆 · 延伸閱讀 ${first.links.length} 張卡</p>
    <a class="more" href="${L("story/b01/")}">閱讀全文與來源 →</a></section>
   <section class="sec weekly" data-week="${wk}"><div class="rule caps"><span>本週路線</span><i></i><span class="wk">W${wk}</span></div><div style="margin-top:14px">${routes.map((r, i) => routeCard(r, L, `data-i="${i}" ${i === wk % routes.length ? "" : "hidden"}`)).join("")}</div><p class="note">每週一自動更換 · <a href="${L("routes/")}">看全部 ${routes.length} 條路線</a></p></section>
  </div>
  <section class="sec"><div class="rule caps"><span>象牙海岸的底圖</span><i></i><span>共 ${base.length} 章</span></div><div class="chaps">${base.slice(0, 6).map((c, i) => chapRow(c, i, L)).join("")}</div><a class="more" href="${L("story/")}">看全部 ${base.length} 章 →</a></section>
  <section class="sec"><div class="rule caps"><span>近期</span><i></i></div><p>大巴薩姆的 Abissa 節：通常在 10 月底到 11 月初。達卡雙年展 Dak'Art：2026 年 11 月 19 日至 12 月 19 日。</p></section></div>`;
}, { "@context": "https://schema.org", "@type": "WebSite", name: "AKWABA · 非洲品味之家", alternateName: "AKWABA · Maison de Goût Africain", url: SITE + BASE + "/", inLanguage: "zh-Hant", author: { "@type": "Person", name: "Victor Tseng" } });

// story index
add("story/", "story/", "象牙海岸的底圖：12 章讀懂科特迪瓦｜AKWABA", "四大文化圈、Abla Pokou 傳說、Kong 帝國、四個首都、象牙奇蹟、可可經濟、危機年代、Nouchi、宗教、節慶與迦納：用 12 章建立理解象牙海岸的底圖。", L => `<div class="wrap narrow"><section class="sec"><div class="rule caps"><span>LES CHAPITRES</span><i></i><span>共 ${base.length} 章</span></div><h1 class="t">象牙海岸的底圖</h1><div class="sub">先讀懂這幾章，再看任何東西都有脈絡</div><div style="margin-top:10px">${base.map((c, i) => chapRow(c, i, L)).join("")}</div></section></div>`);

// explore index
add("explore/", "explore/", "探索：象牙海岸的藝術、建築、時尚與飲食｜AKWABA", `${body.length} 張有來源的解讀卡：畫廊、設計師、面具、手織布、清真寺、maquis、音樂與節慶，每張都告訴你看到什麼、為什麼、怎麼用。`, L => `<div class="wrap"><section class="sec"><div class="rule caps"><span>EXPLORER</span><i></i><span>共 ${body.length} 張</span></div><h1 class="t">探索</h1><div class="sub">一張卡，一個跡象，一段故事</div>
 <div class="chips" style="margin-top:14px" role="group" aria-label="篩選領域">${["全部", ...DOMAINS].map((d, i) => `<button class="chip${i ? "" : " on"}" data-filter="${d}">${d}</button>`).join("")}</div>
 <div class="grid" id="tiles">${body.map(c => tile(c, L)).join("")}</div></section></div>`);

// card pages
for (const seqName of ["base", "body"]) {
  const seq = seqName === "base" ? base : body;
  seq.forEach((c, k) => {
    const isBase = seqName === "base", prev = seq[k - 1], next = seq[k + 1];
    const rel = (c.links || []).map(byId).filter(Boolean);
    const onRoutes = routes.filter(r => r.stops.some(s => s.card === c.id));
    const commons = "https://commons.wikimedia.org/w/index.php?title=Special:MediaSearch&type=image&search=" + encodeURIComponent(c.img || c.name);
    const title = `${nm(c)}${isBase ? "" : "｜" + c.name}｜${isBase ? "象牙海岸底圖第 " + (k + 1) + " 章" : c.domain + " · " + (c.region || "")}｜AKWABA`;
    const desc = (c.what || "").slice(0, 150);
    add(cardPath(c), isBase ? "story/" : "explore/", title, desc, L => `
 <div class="rbar"><div class="wrap narrow"><div class="row"><a class="back" href="${L(isBase ? "story/" : "explore/")}">← ${isBase ? "故事" : "探索"}</a><span><b>${pad(k + 1)}</b> / ${pad(seq.length)} ${isBase ? "章" : "張"}</span></div><div class="prog" style="margin-top:8px"><b style="width:${(k + 1) / seq.length * 100}%"></b></div></div></div>
 <div class="wrap narrow"><article class="sec">
  <div class="rule caps"><span>${isBase ? "CHAPITRE " + pad(k + 1) : esc(c.domain)}</span><i></i><span>${esc(isBase ? (c.era || "").replace(/^底圖 \d+ · /, "") : (c.region || ""))}</span></div>
  <h1 class="t">${esc(nm(c))}</h1><div class="sub">${esc(isBase ? c.nameZh : c.name)}</div>
  <span class="verified">✓ ${esc(c.verified || "已查證")} · ${(c.sources || []).length} 個來源</span>
  ${A.artSvg(c, "art", true)}
  ${c.what ? `<p>${esc(c.what)}</p>` : ""}${c.why ? `<p>${esc(c.why)}</p>` : ""}
  ${c.signal ? `<div class="box fo"><div class="caps">CE QUE VOUS VERREZ · 你會看到</div>${esc(c.signal)}</div>` : ""}
  ${c.meaning ? `<div class="box la"><div class="caps">POURQUOI · 所以呢</div>${esc(c.meaning)}</div>` : ""}
  ${c.use ? `<div class="box ox"><div class="caps">SAVOIR-FAIRE · 你可以怎麼用</div>${esc(c.use)}</div>` : ""}
  ${c.bridge ? `<div class="kv"><span class="caps">亞洲・歐洲對照</span>${esc(c.bridge)}</div>` : ""}
  ${c.where ? `<div class="kv"><span class="caps">去哪裡體驗</span>${esc(c.where)}</div>` : ""}
  ${onRoutes.length ? `<div class="kv"><span class="caps">出現在這些路線</span><div class="rel">${onRoutes.map(r => `<a href="${L(`routes/${r.id}/`)}">${esc(r.title)}</a>`).join("")}</div></div>` : ""}
  ${rel.length ? `<div class="kv"><span class="caps">延伸閱讀</span><div class="rel">${rel.map(x => `<a href="${L(cardPath(x))}">${esc(nm(x))}</a>`).join("")}</div></div>` : ""}
  <div class="kv"><span class="caps">資料來源</span>${srcList(c.sources)}</div>
  <div class="acts"><a class="btn" href="${commons}" target="_blank" rel="noopener">看實景照片（Wikimedia）↗</a></div>
  ${next ? `<a class="nextbig" href="${L(cardPath(next))}"><span class="caps">${isBase ? "下一章" : "下一張"} · ${pad(k + 2)} / ${pad(seq.length)}</span><span class="nt"><span>${esc(nm(next))}</span><span aria-hidden="true">→</span></span></a>` : `<a class="nextbig" href="${L(isBase ? "explore/" : "routes/")}"><span class="caps">${isBase ? "底圖讀完了" : "全部看完了"}</span><span class="nt"><span>${isBase ? "開始探索解讀卡" : "去看路線"}</span><span aria-hidden="true">→</span></span></a>`}
  ${prev ? `<a class="prevlink" href="${L(cardPath(prev))}">← ${isBase ? "上一章" : "上一張"}：${esc(nm(prev))}</a>` : ""}
 </article></div>`, { "@context": "https://schema.org", "@type": "Article", headline: nm(c), alternativeHeadline: isBase ? c.nameZh : c.name, description: desc, inLanguage: "zh-Hant", author: { "@type": "Person", name: "Victor Tseng" }, dateModified: BUILD_DATE.toISOString(), about: { "@type": "Place", name: "Côte d'Ivoire" }, citation: c.sources });
  });
}

// routes index + pages
add("routes/", "routes/", "象牙海岸與達卡的分區路線：1–3 天行程與預估花費｜AKWABA", `${routes.length} 條依區域串成的路線：阿必尚、班熱維爾、大巴薩姆、Assinie、亞穆蘇克羅、Korhogo、Man、達卡。每一站附法文站名，可直接給司機看。`, L => `<div class="wrap"><section class="sec"><div class="rule caps"><span>ITINÉRAIRES</span><i></i><span>共 ${routes.length} 條</span></div><h1 class="t">路線</h1><div class="sub">同一區域串成一天，不在城市兩端來回奔波；每一站附法文站名，可直接給司機看</div>
 ${[1, 2, 3].map(d => { const l = routes.filter(r => r.days === d); return l.length ? `<h2 class="caps" style="margin-top:28px;color:var(--muted)">${d} 天行程</h2><div class="rgrid">${l.map(r => routeCard(r, L)).join("")}</div>` : "" }).join("")}</section></div>`);
routes.forEach(r => {
  const days = [...new Set(r.stops.map(s => s.day))]; let n = 0;
  add(`routes/${r.id}/`, "routes/", `${r.title}｜${r.days} 天路線 · ${r.zone}｜AKWABA`, (r.intro || "").slice(0, 150), L => `
 <div class="rbar"><div class="wrap"><div class="row"><a class="back" href="${L("routes/")}">← 路線</a><span><b>${esc(r.code)}</b> · ${r.days} 天 · ${r.stops.length} 站</span></div><div style="height:8px"></div></div></div>
 <div class="wrap"><article class="sec">
  <div class="rule caps"><span>ITINÉRAIRE ${esc(r.code)}</span><i></i><span>${esc(r.zone)}</span></div>
  <h1 class="t">${esc(r.title)}</h1><div class="sub">${esc(r.span)}</div>
  <div class="route-layout"><div class="stick">${A.routePlate(r, "art", true)}<p>${esc(r.intro)}</p>${A.mapSvg(r)}</div>
  <div>
  ${days.map(d => `<div class="day">${days.length > 1 ? `<h2 class="dayh">第 ${d} 天</h2>` : ""}${r.stops.filter(s => s.day === d).map(s => { const num = s.x != null; if (num) n++; const card = s.card && byId(s.card); return `<div class="stop"><span class="tm">${esc(s.time || "")}</span><div><div class="nm">${num ? n + "　" : ""}${esc(s.name)}</div>${s.fr ? `<div class="fr" lang="fr">${esc(s.fr)}</div>` : ""}${s.note ? `<div class="nt">${esc(s.note)}</div>` : ""}<div class="lk">${card ? `<a href="${L(cardPath(card))}">讀這一站的故事</a>` : ""}${s.fr ? `<button type="button" data-fr="${esc(s.fr)}" data-zh="${esc(s.name)}">給司機看</button>` : ""}</div></div></div>` }).join("")}</div>`).join("")}
  <div class="kv"><span class="caps">交通</span>${esc(r.transport)}</div>
  <div class="kv"><span class="caps">預估花費（每人 · FCFA）</span><div class="costs">${r.costs.map(c => `<div class="cost"><div class="lb">${esc(c.label)}</div><b>${esc(c.range)}</b></div>`).join("")}</div><div class="total"><span>合計</span><b>${esc(r.total)}</b></div>${r.costNote ? `<p class="note">${esc(r.costNote)}</p>` : ""}</div>
  <div class="kv"><span class="caps">MISSIONS · 任務</span>${r.missions.map((m, i) => `<label class="mission"><input type="checkbox" data-m="${r.id}_${i}"><span>${esc(m)}</span></label>`).join("")}<p class="note">勾選紀錄只存在你自己的瀏覽器裡。</p></div>
  <div class="kv"><span class="caps">費用與資訊來源</span>${srcList(r.sources)}</div>
  </div></div></article></div>`, { "@context": "https://schema.org", "@type": "TouristTrip", name: r.title, description: r.intro, touristType: "Cultural tourism", itinerary: { "@type": "ItemList", itemListElement: r.stops.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.fr || s.name })) } });
});

// occasions
add("savoir-vivre/", "savoir-vivre/", "象牙海岸社交禮儀：商務、婚禮、葬禮、晚宴該說什麼、穿什麼｜AKWABA", "九種場合的語言、穿著、禮儀與禁忌：商務初見、帶亞洲貴賓參訪、婚禮與 Dot、葬禮、正式晚宴、maquis、與穆斯林夥伴往來、拜訪傳統首領。", L => `<div class="wrap"><section class="sec"><div class="rule caps"><span>SAVOIR-VIVRE</span><i></i><span>共 ${occasions.length} 種場合</span></div><h1 class="t">場合指南</h1><div class="sub">說什麼語言、穿什麼、注意什麼</div><p class="note" style="margin-bottom:18px">這是經驗法則，慣例會因族群、家庭和場合而不同；拿不準時，先問熟悉當地的朋友。</p>
 <div class="occgrid">${occasions.map(o => `<div class="occ"><h2>${esc(o.title)}</h2>${[["語言", o.language], ["穿著", o.dress], ["禮儀", o.etiquette], ["避免", o.avoid, "av"]].map(([k, v, cl]) => v ? `<div class="k ${cl || ""}">${k}</div><div>${esc(v)}</div>` : "").join("")}</div>`).join("")}</div></section></div>`);

// symbols
const SYM = require("./src/symbols.js")(A);
add("signes/", "signes/", "品牌符號與文化檢查：每個非洲圖樣的出處｜AKWABA", "AKWABA 使用的每一個圖樣：Akan 金砝碼幾何紋、Dida 拉菲亞紮染、北部泥造清真寺、Korhogo 繪布、窄帶手織布，從哪裡來、為什麼用、避開了什麼。", L => `<div class="wrap narrow"><section class="sec"><div class="rule caps"><span>SIGNES</span><i></i><span>${SYM.length}</span></div><h1 class="t">品牌符號</h1><div class="sub">每一個圖樣從哪裡來、為什麼用、用的時候避開了什麼</div>
 ${SYM.map(s => `<div class="sym"><div>${s.svg}</div><div><h2>${esc(s.t)}</h2><div class="v">${esc(s.v)}</div><div class="ck"><b>文化檢查</b>　${esc(s.ck)}</div>${s.src ? `<p class="note">${s.src.map(u => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(host(u))} ↗</a>`).join("　")}</p>` : ""}</div></div>`).join("")}</section></div>`);

// about
add("about/", "about/", "關於 Victor Tseng｜亞非之間的品味 · 合作洽詢｜AKWABA", "Victor Tseng 曾浩瑜，維策顧問 VicTseng Consult 創辦人，以阿必尚為基地，為亞洲貴賓與企業提供非洲文化行程、跨文化簡報與考察團在地安排。", L => {
  const svc = [["私人文化行程", "為來訪的亞洲貴賓與企業主，設計中文導覽的阿必尚、大巴薩姆、亞穆蘇克羅行程：從博物館的底圖，到畫廊、設計師工作室與晚宴。", "akan"], ["企業跨文化簡報", "給派駐西非的亞洲團隊：語言、場合、禮儀、商務節奏和避雷清單，半天就能上手。", "kita"], ["商務考察團在地安排", "幫亞洲廠商與考察團對接在地夥伴、潛在客戶與通路，安排拜訪、翻譯與會面節奏。", "modern"], ["內容與演講合作", "以繁體中文介紹非洲藝術、設計與生活：專欄、講座、品牌活動。", "wax"]];
  return `<div class="hero"><div class="id"><h1 class="t" style="margin:0">Victor Tseng 曾浩瑜</h1><div class="sub">亞非之間的品味 · 維策顧問 VicTseng Consult 創辦人</div>
  <div class="acts" style="justify-content:center"><a class="btn on" href="mailto:${esc(cfg.email)}?subject=${encodeURIComponent("合作洽詢 · AKWABA")}" data-ga="contact_email">✉ ${esc(cfg.email)}</a><a class="btn" href="${esc(cfg.linkedin)}" target="_blank" rel="noopener" data-ga="contact_linkedin">LinkedIn ↗</a></div></div>
  <div class="poster">${A.plate("portrait", "dida", "", "Victor Tseng", true)}</div></div>
  <div class="wrap narrow"><section class="sec"><div class="rule caps"><span>À PROPOS</span><i></i><span>CONTACT</span></div>
  <p class="lead">來自台灣，以阿必尚為基地。專長是行銷、專案管理與商務開發，畢業於法國 IAE Paris-Est。我做 AKWABA，是因為發現亞洲人來到非洲，最缺的不是資訊，而是一張看得懂的「底圖」：知道眼前的東西是什麼、為什麼是這樣、在什麼場合該怎麼做。</p>
  ${svc.map(([t, d, p]) => `<div class="sym" style="grid-template-columns:72px 1fr"><div><svg viewBox="0 0 72 72" style="width:72px"><defs>${A.patDef("a" + p, p)}</defs><rect width="72" height="72" fill="url(#a${p})"/><rect x="2" y="2" width="68" height="68" fill="none" stroke="#141414" stroke-width="4"/></svg></div><div><h2>${t}</h2><div class="v">${d}</div></div></div>`).join("")}
  <div class="kv" style="margin-top:28px"><span class="caps">合作洽詢</span><p>請簡單說明來訪時間、人數與想看的主題，我會在兩個工作天內回覆。</p><div class="acts"><a class="btn on" href="mailto:${esc(cfg.email)}?subject=${encodeURIComponent("合作洽詢 · AKWABA")}" data-ga="contact_email">✉ 寫信給我</a><a class="btn" href="${esc(cfg.linkedin)}" target="_blank" rel="noopener" data-ga="contact_linkedin">LinkedIn ↗</a></div></div></section></div>`;
}, { "@context": "https://schema.org", "@type": "Person", name: "Victor Tseng", alternateName: "曾浩瑜", jobTitle: "Founder, VicTseng Consult", email: "mailto:" + cfg.email, sameAs: [cfg.linkedin], workLocation: { "@type": "Place", name: "Abidjan, Côte d'Ivoire" } });

/* ---------- write ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
const write = (p, html) => { const f = path.join(OUT, p, "index.html"); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
for (const pg of pages) {
  write(pg.p, shell({ lang: "hant", ...pg }));
  if (conv) write("zh-hans/" + pg.p, toHans(shell({ lang: "hans", ...pg })));
}
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });
fs.copyFileSync("src/site.css", path.join(OUT, "assets/site.css"));
fs.copyFileSync("src/site.js", path.join(OUT, "assets/site.js"));
fs.writeFileSync(path.join(OUT, "assets/favicon.svg"), A.mono(64, "#141414", "#F7F3EC").replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '));
if (fs.existsSync("src/og.png")) fs.copyFileSync("src/og.png", path.join(OUT, "assets/og.png"));
const urls = pages.flatMap(pg => [`${SITE}${BASE}/${pg.p}`, ...(conv ? [`${SITE}${BASE}/zh-hans/${pg.p}`] : [])]);
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${u}</loc><lastmod>${BUILD_DATE.toISOString().slice(0, 10)}</lastmod></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}${BASE}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, "404.html"), shell({ lang: "hant", p: "404.html", nav: "", title: "找不到這一頁｜AKWABA", desc: "找不到這一頁", body: L => `<div class="wrap narrow"><section class="sec"><h1 class="t">找不到這一頁</h1><p><a class="more" href="${L("")}">回首頁 →</a></p></section></div>` }));
if (cfg.customDomain) fs.writeFileSync(path.join(OUT, "CNAME"), cfg.customDomain + "\n");
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
if (fs.existsSync("src/static")) for (const f of fs.readdirSync("src/static")) fs.copyFileSync(path.join("src/static", f), path.join(OUT, f));
console.log(`built ${pages.length} pages${conv ? " ×2 (zh-Hant + zh-Hans)" : " (zh-Hant only)"} → ${OUT}/`);
