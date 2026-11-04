/* AKWABA · 非洲品味之家 — static site builder (no dependencies required).
   Optional: `npm i opencc-js` enables the Simplified-Chinese (/zh-hans/) edition.
   English edition (/en/) is built from data/en/*.json overlays (items without a translation are skipped).
   Usage: node build.js   → writes ./dist                                         */
const fs = require("fs"), path = require("path");
const A = require("./src/art.js");
const cfg = JSON.parse(fs.readFileSync("config.json", "utf8"));
const load = f => JSON.parse(fs.readFileSync(path.join("data", f), "utf8"));
const ZH = { cards: load("cards.json").sort((a, b) => a.order - b.order), routes: load("routes.json").sort((a, b) => a.order - b.order), occasions: load("occasions.json").sort((a, b) => a.order - b.order) };
const loadEn = f => { try { return JSON.parse(fs.readFileSync(path.join("data", "en", f), "utf8")) } catch (e) { return {} } };
const EN_RAW = { cards: loadEn("cards.json"), routes: loadEn("routes.json"), occasions: loadEn("occasions.json") };
const loadFr = f => { try { return JSON.parse(fs.readFileSync(path.join("data", "fr", f), "utf8")) } catch (e) { return {} } };
const FR_RAW = { cards: loadFr("cards.json"), routes: loadFr("routes.json"), occasions: loadFr("occasions.json") };
const DOM_FR = { 藝術: "Art", 時尚: "Mode", 工藝: "Artisanat", 音樂: "Musique", 飲食: "Cuisine", 空間: "Architecture", 節慶: "Fêtes", 人物: "Portraits", 自然: "Nature", 脈絡: "Contexte" };
const REG_FR = { 中西部: "Centre-Ouest", 中部: "Centre", 中部與東部: "Centre et Est", 中部與西部: "Centre et Ouest", 亞穆蘇克羅: "Yamoussoukro", 全國: "Tout le pays", 北部: "Nord", 大巴薩姆: "Grand-Bassam", 西南與東北: "Sud-Ouest et Nord-Est", 西部: "Ouest", 達卡: "Dakar", 阿必尚: "Abidjan", 阿西尼: "Assinie" };
const DOM_EN = { 藝術: "Art", 時尚: "Fashion", 工藝: "Craft", 音樂: "Music", 飲食: "Food", 空間: "Architecture", 節慶: "Festivals", 人物: "People", 自然: "Nature", 脈絡: "Context" };
const REG_EN = { 中西部: "Centre-west", 中部: "Centre", 中部與東部: "Centre and east", 中部與西部: "Centre and west", 亞穆蘇克羅: "Yamoussoukro", 全國: "Nationwide", 北部: "North", 大巴薩姆: "Grand-Bassam", 西南與東北: "South-west and north-east", 西部: "West", 達卡: "Dakar", 阿必尚: "Abidjan", 阿西尼: "Assinie" };
const EN = {
  cards: ZH.cards.filter(c => EN_RAW.cards[c.id]).map(c => ({ ...c, ...EN_RAW.cards[c.id], domain: DOM_EN[c.domain] || c.domain, region: REG_EN[c.region] ?? c.region, verified: "Verified" })),
  routes: ZH.routes.filter(r => EN_RAW.routes[r.id]).map(r => { const o = EN_RAW.routes[r.id]; return { ...r, ...o, costs: r.costs.map((c, i) => ({ label: (o.costs[i] || [])[0] || c.label, range: (o.costs[i] || [])[1] || c.range })), stops: r.stops.map((st, i) => ({ ...st, time: ({ 午後: "Afternoon", 夜: "Night", 上午: "Morning", 下午: "Afternoon", 傍晚: "Evening", 晚上: "Evening", 中午: "Midday" })[st.time] || st.time, name: (o.stops[i] || [])[0] || st.name, note: (o.stops[i] || [])[1] || st.note })) } }),
  occasions: ZH.occasions.filter(o => EN_RAW.occasions[o.id]).map(o => ({ ...o, ...EN_RAW.occasions[o.id] }))
};
const overlay = (RAW, DOM, REG, verified, TIME) => ({
  cards: ZH.cards.filter(c => RAW.cards[c.id]).map(c => ({ ...c, ...RAW.cards[c.id], domain: DOM[c.domain] || c.domain, region: REG[c.region] ?? c.region, verified })),
  routes: ZH.routes.filter(r => RAW.routes[r.id]).map(r => { const o = RAW.routes[r.id]; return { ...r, ...o, costs: r.costs.map((c, i) => ({ label: (o.costs[i] || [])[0] || c.label, range: (o.costs[i] || [])[1] || c.range })), stops: r.stops.map((st, i) => ({ ...st, time: TIME[st.time] || st.time, name: (o.stops[i] || [])[0] || st.name, note: (o.stops[i] || [])[1] || st.note })) } }),
  occasions: ZH.occasions.filter(o => RAW.occasions[o.id]).map(o => ({ ...o, ...RAW.occasions[o.id] }))
});
const FR = overlay(FR_RAW, DOM_FR, REG_FR, "Vérifié", { 午後: "Après-midi", 夜: "Soir", 上午: "Matin", 下午: "Après-midi", 傍晚: "Fin d’après-midi", 晚上: "Soir", 中午: "Midi" });
let LANG = "hant", cards, routes, occasions, base, body;
const byId = id => cards.find(c => c.id === id);
const U = (zh, en, fr) => LANG === "en" ? en : LANG === "fr" ? fr : zh;
function useData(D) { A.setT(t => LANG === "en" ? ({ "路線示意地圖": "Route map", "插圖：": "Illustration: ", "示意圖 · 非比例": "Schematic · not to scale" })[t] || t : LANG === "fr" ? ({ "路線示意地圖": "Carte de l’itinéraire", "插圖：": "Illustration : ", "示意圖 · 非比例": "Schéma · pas à l’échelle" })[t] || t : t); cards = D.cards; routes = D.routes; occasions = D.occasions; base = cards.filter(c => c.layer === "底圖"); body = cards.filter(c => c.layer !== "底圖"); }
useData(ZH);
const BASE = (cfg.basePath || "").replace(/\/$/, "");
const SITE = (cfg.siteUrl || "").replace(/\/$/, "");
const OUT = "dist";
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const host = u => { try { return new URL(u).hostname.replace(/^www\./, "") } catch (e) { return u } };
const DOMAINS_ZH = ["藝術", "時尚", "工藝", "音樂", "飲食", "空間", "節慶", "人物", "自然"];
const DOMAINS = () => LANG === "en" ? DOMAINS_ZH.map(d => DOM_EN[d]) : LANG === "fr" ? DOMAINS_ZH.map(d => DOM_FR[d]) : DOMAINS_ZH;
const BUILD_DATE = new Date();

/* ---------- Simplified edition: mainland naming first, then OpenCC ---------- */
let conv = null;
try { const OpenCC = require("opencc-js"); conv = OpenCC.Converter({ from: "twp", to: "cn" }); }
catch (e) { console.warn("opencc-js not installed → skipping /zh-hans/ edition"); }
const CN = [["象牙海岸", "科特迪瓦"], ["阿必尚", "阿比让"], ["大巴薩姆", "大巴萨姆"], ["亞穆蘇克羅", "亚穆苏克罗"], ["班熱維爾", "班热维尔"], ["達卡", "达喀尔"], ["迦納", "加纳"], ["布吉納法索", "布基纳法索"], ["馬利", "马里"], ["塞內加爾", "塞内加尔"], ["奈及利亞", "尼日利亚"], ["幾內亞", "几内亚"], ["賴比瑞亞", "利比里亚"], ["獅子山", "塞拉利昂"], ["衣索比亞", "埃塞俄比亚"], ["盧安達", "卢旺达"], ["貝南", "贝宁"], ["厄瓜多", "厄瓜多尔"], ["尼日河", "尼日尔河"], ["奈比多", "内比都"], ["畢卡索", "毕加索"], ["若望保祿二世", "若望·保禄二世"], ["教宗", "教皇"], ["碧昂絲", "碧昂丝"], ["非洲盃", "非洲杯"], ["世界盃", "世界杯"], ["計程車", "出租车"], ["資訊", "信息"], ["網路", "网络"], ["影片", "视频"], ["品質", "质量"], ["透過", "通过"], ["飯店", "酒店"], ["伴手禮", "伴手礼"], ["墾丁", "垦丁"]];
const toHans = html => { for (const [a, b] of CN) html = html.split(a).join(b); return conv(html); };

/* ---------- page shell ---------- */
const NAV = () => [["", U("首頁", "Home", "Accueil")], ["story/", U("故事", "Stories", "Histoires")], ["explore/", U("探索", "Explore", "Explorer")], ["routes/", U("路線", "Routes", "Itinéraires")], ["savoir-vivre/", U("場合", "Occasions", "Occasions")], ["about/", U("關於", "About", "À propos")]];
let EN_PATHS = new Set(), ZH_PATHS = new Set(), FR_PATHS = new Set();
function shell({ lang, p, title, desc, body, ld, nav }) {
  const PRE = { hant: "", hans: "/zh-hans", en: "/en", fr: "/fr" };
  const pre = PRE[lang];
  const url = (l, pp) => `${SITE}${BASE}${PRE[l]}/${pp}`;
  const hasEn = EN_PATHS.has(p), hasZh = ZH_PATHS.has(p), hasFr = FR_PATHS.has(p);
  const L = pp => `${BASE}${pre}/${pp}`;
  const ga = cfg.ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${cfg.ga4}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${cfg.ga4}');</script>` : "";
  const gsc = cfg.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleSiteVerification)}">` : "";
  return `<!DOCTYPE html>
<html lang="${{ hant: "zh-Hant", hans: "zh-Hans", en: "en", fr: "fr" }[lang]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url(lang, p)}">
${hasZh ? `<link rel="alternate" hreflang="zh-Hant" href="${url("hant", p)}">` : ""}
${conv && hasZh ? `<link rel="alternate" hreflang="zh-Hans" href="${url("hans", p)}">` : ""}
${hasEn ? `<link rel="alternate" hreflang="en" href="${url("en", p)}">` : ""}
${hasFr ? `<link rel="alternate" hreflang="fr" href="${url("fr", p)}">` : ""}
<link rel="alternate" hreflang="x-default" href="${url(hasZh ? "hant" : "en", p)}">
<meta property="og:type" content="${ld && ld["@type"] === "Article" ? "article" : "website"}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url(lang, p)}">
<meta property="og:image" content="${SITE}${BASE}/assets/og.png">
<meta property="og:locale" content="${{ hant: "zh_TW", hans: "zh_CN", en: "en_US", fr: "fr_FR" }[lang]}">
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
<a class="skip" href="#main">${U("跳到內容", "Skip to content", "Aller au contenu")}</a>
<header class="wrap top"><a class="brand" href="${L("")}" aria-label="${U("AKWABA 首頁", "AKWABA home", "Accueil AKWABA")}">${A.mono(28, "#141414", "#F7F3EC")}AKWABA</a>
<div class="tg" role="group" aria-label="${U("語言", "Language", "Langue")}"><a href="${BASE}/${hasZh ? p : ""}" class="${lang === "hant" ? "on" : ""}" hreflang="zh-Hant" lang="zh-Hant">繁</a>${conv ? `<a href="${BASE}/zh-hans/${hasZh ? p : ""}" class="${lang === "hans" ? "on" : ""}" hreflang="zh-Hans" lang="zh-Hans">简</a>` : ""}<a href="${BASE}/en/${hasEn ? p : ""}" class="${lang === "en" ? "on" : ""}" hreflang="en" lang="en">EN</a><a href="${BASE}/fr/${hasFr ? p : ""}" class="${lang === "fr" ? "on" : ""}" hreflang="fr" lang="fr">FR</a></div></header>
<nav class="main" aria-label="${U("主選單", "Main menu", "Menu principal")}"><div class="in wrap">${NAV().map(([pp, t]) => `<a href="${L(pp)}" class="${nav === pp ? "on" : ""}">${t}</a>`).join("")}</div></nav>
<main id="main">${body(L)}</main>
<aside class="xgame" aria-label="${U("遊戲", "Game", "Jeu")}"><div class="wrap"><div class="xk">${U("先玩一趟，再讀懂", "Play it first", "Jouez d’abord")}</div><p>${U("《Akwaba！非洲大冒險》：15 分鐘免費手機遊戲，跟著亞洲旅人走進象牙海岸的日常。", "Akwaba! An African Adventure — a free 15-minute game through everyday life in Côte d’Ivoire.", "Akwaba ! L’aventure africaine — un jeu gratuit de 15 minutes au cœur du quotidien ivoirien.")}</p><a class="xb" href="https://play.victseng.com/${{ hant: "", hans: "sc.html", en: "en.html", fr: "fr.html" }[lang]}?c=maison&amp;utm_source=akwaba_maison&amp;utm_medium=crosslink&amp;utm_campaign=evergreen&amp;utm_content=${{ hant: "zh-hant", hans: "zh-hans", en: "en", fr: "fr" }[lang]}_footer" target="_blank" rel="noopener" onclick="if(window.gtag)gtag('event','game_click',{from:'footer'})">${U("免費玩 →", "Play free →", "Jouer gratuitement →")}</a></div></aside>
<footer><div class="wrap">AKWABA · ${U("非洲品味之家 · MAISON DE GOÛT AFRICAIN", "House of African Taste · MAISON DE GOÛT AFRICAIN", "MAISON DE GOÛT AFRICAIN")}<br>${U("內容每週更新與查核 · 最後更新", "Updated and checked weekly · Last update", "Mis à jour et vérifié chaque semaine · Dernière mise à jour")} ${BUILD_DATE.toISOString().slice(0, 10)}<br>© 2026–${BUILD_DATE.getFullYear()} Victor Tseng 曾浩瑜 · ${U("版權所有，未經授權請勿轉載", "All rights reserved. Do not reproduce without permission", "Tous droits réservés. Reproduction interdite sans autorisation")} · <a href="${L("about/")}">${U("合作與授權洽詢", "Partnerships and licensing", "Partenariats et licences")}</a></div></footer>
<div class="drv" id="drv" role="dialog" aria-modal="true"><div class="q">Bonjour, je voudrais aller à :</div><div class="p" id="drvP"></div><div class="q" id="drvZ"></div><div class="q" style="margin-top:28px">${U("（點一下關閉）", "(tap to close)", "(touchez pour fermer)")}</div></div>
<script src="${BASE}/assets/site.js?v=${+BUILD_DATE}" defer></script>
</body></html>`;
}

/* ---------- components ---------- */
const eraShort = c => (c.era || "").replace(/^底圖 \d+ · /, "").replace(/^Chapter \d+ · /, "");
const nm = c => c.layer === "底圖" ? c.name : (c.nameZh || c.name);
const cardPath = c => c.layer === "底圖" ? `story/${c.id}/` : `explore/${c.id}/`;
const srcList = list => (list || []).length ? `<ul class="srcs">${list.map((u, i) => `<li><a href="${esc(u)}" target="_blank" rel="noopener"><span>${i + 1}</span><span>${esc(host(u))}<small>${esc(u.length > 80 ? u.slice(0, 80) + "…" : u)}</small></span><span aria-hidden="true">↗</span></a></li>`).join("")}</ul>` : `<p class="note">${U("尚待補上來源", "Sources to be added", "Sources à compléter")}</p>`;
const chapRow = (c, i, L) => `<a class="chap" href="${L(cardPath(c))}"><span class="n">${pad(i + 1)}</span>${A.artSvg(c, "")}<span><span class="tt">${esc(c.name)}</span><br><span class="ee">${esc(eraShort(c))} · ${esc(c.nameZh || "")}</span></span><span aria-hidden="true">→</span></a>`;
const tile = (c, L) => `<a class="tile" href="${L(cardPath(c))}" data-d="${esc(c.domain)}">${A.artSvg(c, "")}<span class="tx"><span class="nm">${esc(nm(c))}</span><br><span class="dm">${esc(c.domain)} · ${esc(c.region || "")}</span></span></a>`;
const routeCard = (r, L, attrs = "") => `<a class="rcard" href="${L(`routes/${r.id}/`)}" ${attrs}>${A.routePlate(r, "")}<span class="in" style="display:block"><span class="caps" style="color:var(--goldT)">${U("路線", "Route", "Itinéraire")} ${esc(r.code)} · ${r.days} ${U("天", r.days > 1 ? "days" : "day", r.days > 1 ? "jours" : "jour")} · ${esc(r.zone)}</span><span class="tl" style="display:block">${esc(r.title)}</span><span class="meta"><span>${esc(r.span)}</span><span>${r.stops.length} ${U("站", "stops", "étapes")}</span></span><span class="tot" style="display:block">${esc(r.total)} <small style="color:var(--muted)">FCFA</small></span></span></a>`;
function isoWeek(d) { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return Math.ceil(((t - y0) / 864e5 + 1) / 7) }

/* ---------- pages ---------- */
let pages = [];
function definePages() {
// 暫時隱藏的頁面：不產生、不進 sitemap。要恢復就從這裡移除，並把它加回 NAV。
const HIDDEN = ["signes/"];
const add = (p, nav, title, desc, body, ld) => { if (!HIDDEN.includes(p)) pages.push({ p, nav, title, desc, body, ld }); };
const SITE_DESC = U("用故事讀懂象牙海岸（科特迪瓦）的藝術、建築、工藝、音樂、飲食與社交禮儀：12 章底圖、" + body.length + " 張有來源的解讀卡、" + routes.length + " 條分區路線，附預估花費與中法對照站名。", "Read Côte d'Ivoire's art, architecture, crafts, music, food and etiquette through stories: 12 background chapters, " + body.length + " sourced interpretation cards and " + routes.length + " area routes with cost estimates and French stop names.", "Comprendre l’art, l’architecture, l’artisanat, la musique, la cuisine et les codes sociaux de la Côte d’Ivoire à travers des histoires : 12 chapitres de fond, " + body.length + " fiches sourcées et " + routes.length + " itinéraires par zone, avec budgets estimés.");

// home
add("", "", U("AKWABA · 非洲品味之家｜象牙海岸藝術、文化與生活指南", "AKWABA · House of African Taste | A guide to the art, culture and life of Côte d'Ivoire", "AKWABA · Maison de goût africain | Guide de l’art, de la culture et de la vie en Côte d’Ivoire"), SITE_DESC, L => {
  const wk = isoWeek(BUILD_DATE), first = base[0];
  return `<div class="first"><section class="hero"><div class="id">${A.mono(110, "#141414", "#F7F3EC")}<h1 class="word">AKWABA</h1>${LANG === "fr" ? "" : `<div class="zhname">${U("非洲品味之家", "House of African Taste", "")}</div>`}<div class="tag">MAISON DE GOÛT AFRICAIN</div><p style="margin:6px 0 0;letter-spacing:.12em">${U("看懂非洲的品味，從一個跡象開始", "Reading African taste starts with a single sign", "Lire le goût africain commence par un signe")}</p><a class="cue" href="#more" aria-label="${U("往下看更多內容", "Scroll for more", "Faire défiler pour en voir plus")}"><span>${U("往下探索", "Explore", "Explorer")}</span><i aria-hidden="true"></i></a></div>
  <div class="poster">${A.heroFour(U("四大文化圈", "The four cultural worlds", "Les quatre aires culturelles"))}</div></section>
  <div class="tri" aria-hidden="true"><i style="background:#D69A2D"></i><i style="background:#B4452A"></i><i style="background:#1E2A55"></i></div>
  <div class="stats"><a href="${L("story/")}"><b style="color:var(--ox)">${base.length}</b><span>${U("章故事", "stories", "histoires")}</span></a><a href="${L("explore/")}"><b style="color:var(--fo)">${body.length}</b><span>${U("張解讀卡", "cards", "fiches")}</span></a><a href="${L("routes/")}"><b style="color:var(--la)">${routes.length}</b><span>${U("條路線", "routes", "itinéraires")}</span></a></div></div>
  <div class="wrap" id="more"><div class="two">
   <section class="sec"><div class="rule caps"><span>${U("從這裡開始", "Start here", "Commencer ici")}</span><i></i><span>01 / ${pad(base.length)}</span></div>
    <h2 class="t">${esc(first.name)}</h2><div class="sub">${esc(first.nameZh)}</div>
    <p class="lead">${esc(first.what.slice(0, U(120, 260, 260)))}…</p>
    <p class="note">${U(`來源 ${first.sources.length} 筆 · 延伸閱讀 ${first.links.length} 張卡`, `${first.sources.length} source${first.sources.length === 1 ? "" : "s"} · ${first.links.length} related card${first.links.length === 1 ? "" : "s"}`, `${first.sources.length} source${first.sources.length === 1 ? "" : "s"} · ${first.links.length} fiche${first.links.length === 1 ? "" : "s"} liée${first.links.length === 1 ? "" : "s"}`)}</p>
    <a class="more" href="${L("story/b01/")}">${U("閱讀全文與來源", "Read the full chapter and sources", "Lire le chapitre complet et ses sources")} →</a></section>
   <section class="sec weekly" data-week="${wk}"><div class="rule caps"><span>${U("本週路線", "Route of the week", "L’itinéraire de la semaine")}</span><i></i><span class="wk">W${wk}</span></div><div style="margin-top:14px">${routes.map((r, i) => routeCard(r, L, `data-i="${i}" ${i === wk % routes.length ? "" : "hidden"}`)).join("")}</div><p class="note">${U("每週一自動更換", "Changes every Monday", "Change chaque lundi")} · <a href="${L("routes/")}">${U(`看全部 ${routes.length} 條路線`, `See all ${routes.length} routes`, `Voir les ${routes.length} itinéraires`)}</a></p></section>
  </div>
  <section class="sec"><div class="rule caps"><span>${U("象牙海岸的底圖", "The background of Côte d'Ivoire", "Les fondamentaux de la Côte d’Ivoire")}</span><i></i><span>${U(`共 ${base.length} 章`, `${base.length} chapters`, `${base.length} chapitres`)}</span></div><div class="chaps">${base.slice(0, 6).map((c, i) => chapRow(c, i, L)).join("")}</div><a class="more" href="${L("story/")}">${U(`看全部 ${base.length} 章`, `All ${base.length} chapters`, `Les ${base.length} chapitres`)} →</a></section>
  <section class="sec"><div class="rule caps"><span>${U("近期", "Coming up", "À venir")}</span><i></i></div><p>${U("大巴薩姆的 Abissa 節：通常在 10 月底到 11 月初。達卡雙年展 Dak'Art：2026 年 11 月 19 日至 12 月 19 日。", "Abissa in Grand-Bassam: usually late October to early November. Dakar Biennale (Dak'Art): 19 November to 19 December 2026.", "Abissa à Grand-Bassam : généralement de fin octobre à début novembre. Biennale de Dakar (Dak’Art) : du 19 novembre au 19 décembre 2026.")}</p></section></div>`;
}, { "@context": "https://schema.org", "@type": "WebSite", name: U("AKWABA · 非洲品味之家", "AKWABA · House of African Taste", "AKWABA · Maison de goût africain"), alternateName: "AKWABA · Maison de Goût Africain", url: SITE + BASE + U("/", "/en/", "/fr/"), inLanguage: U("zh-Hant", "en", "fr"), author: { "@type": "Person", name: "Victor Tseng" } });

// story index
add("story/", "story/", U("象牙海岸的底圖：12 章讀懂科特迪瓦｜AKWABA", "The background of Côte d'Ivoire in 12 chapters | AKWABA", "Les fondamentaux de la Côte d’Ivoire en 12 chapitres | AKWABA"), U("四大文化圈、Abla Pokou 傳說、Kong 帝國、四個首都、象牙奇蹟、可可經濟、危機年代、Nouchi、宗教、節慶與迦納：用 12 章建立理解象牙海岸的底圖。", "The four cultural worlds, the legend of Abla Pokou, the Kong empire, four capitals, the Ivorian miracle, cocoa, the crisis years, Nouchi, religion, festivals and Ghana: 12 chapters to build your understanding of Côte d'Ivoire.", "Les quatre aires culturelles, la légende d’Abla Pokou, l’empire de Kong, quatre capitales, le miracle ivoirien, le cacao, les années de crise, le nouchi, la religion, les fêtes et le Ghana : 12 chapitres pour comprendre la Côte d’Ivoire."), L => `<div class="wrap narrow"><section class="sec"><div class="rule caps"><span>LES CHAPITRES</span><i></i><span>${U(`共 ${base.length} 章`, `${base.length} chapters`, `${base.length} chapitres`)}</span></div><h1 class="t">${U("象牙海岸的底圖", "The background of Côte d'Ivoire", "Les fondamentaux de la Côte d’Ivoire")}</h1><div class="sub">${U("先讀懂這幾章，再看任何東西都有脈絡", "Read these chapters first and everything else will have context", "Lisez d’abord ces chapitres : tout le reste prendra son sens")}</div><div style="margin-top:10px">${base.map((c, i) => chapRow(c, i, L)).join("")}</div></section></div>`);

// explore index
add("explore/", "explore/", U("探索：象牙海岸的藝術、建築、時尚與飲食｜AKWABA", "Explore the art, architecture, fashion and food of Côte d'Ivoire | AKWABA", "Explorer l’art, l’architecture, la mode et la cuisine de Côte d’Ivoire | AKWABA"), U(`${body.length} 張有來源的解讀卡：畫廊、設計師、面具、手織布、清真寺、maquis、音樂與節慶，每張都告訴你看到什麼、為什麼、怎麼用。`, `${body.length} sourced cards on galleries, designers, masks, woven cloth, mosques, maquis, music and festivals: what you will see, why it matters and how to use it.`, `${body.length} fiches sourcées sur les galeries, créateurs, masques, tissages, mosquées, maquis, musiques et fêtes : ce que vous verrez, pourquoi c’est important et comment en tirer parti.`), L => `<div class="wrap"><section class="sec"><div class="rule caps"><span>EXPLORER</span><i></i><span>${U(`共 ${body.length} 張`, `${body.length} cards`, `${body.length} fiches`)}</span></div><h1 class="t">${U("探索", "Explore", "Explorer")}</h1><div class="sub">${U("一張卡，一個跡象，一段故事", "One card, one sign, one story", "Une fiche, un signe, une histoire")}</div>
 <div class="chips" style="margin-top:14px" role="group" aria-label="${U("篩選領域", "Filter by field", "Filtrer par domaine")}">${[U("全部", "All", "Tout"), ...DOMAINS()].map((d, i) => `<button class="chip${i ? "" : " on"}" data-filter="${i ? d : "*"}">${d}</button>`).join("")}</div>
 <div class="grid" id="tiles">${body.map(c => tile(c, L)).join("")}</div></section></div>`);

// card pages
for (const seqName of ["base", "body"]) {
  const seq = seqName === "base" ? base : body;
  seq.forEach((c, k) => {
    const isBase = seqName === "base", prev = seq[k - 1], next = seq[k + 1];
    const rel = (c.links || []).map(byId).filter(Boolean);
    const onRoutes = routes.filter(r => r.stops.some(s => s.card === c.id));
    const commons = "https://commons.wikimedia.org/w/index.php?title=Special:MediaSearch&type=image&search=" + encodeURIComponent(c.img || c.name);
    const title = `${nm(c)}${isBase || c.name === nm(c) ? "" : U("｜", " | ", " | ") + c.name}${U("｜", " | ", " | ")}${isBase ? U("象牙海岸底圖第 " + (k + 1) + " 章", "Côte d'Ivoire background, chapter " + (k + 1), "Fondamentaux de la Côte d’Ivoire, chapitre " + (k + 1)) : c.domain + " · " + (c.region || "")}${U("｜", " | ", " | ")}AKWABA`;
    const desc = (c.what || "").slice(0, U(150, 300, 300));
    add(cardPath(c), isBase ? "story/" : "explore/", title, desc, L => `
 <div class="rbar"><div class="wrap narrow"><div class="row"><a class="back" href="${L(isBase ? "story/" : "explore/")}">← ${isBase ? U("故事", "Stories", "Histoires") : U("探索", "Explore", "Explorer")}</a><span><b>${pad(k + 1)}</b> / ${pad(seq.length)} ${isBase ? U("章", "chapters", "chapitres") : U("張", "cards", "fiches")}</span></div><div class="prog" style="margin-top:8px"><b style="width:${(k + 1) / seq.length * 100}%"></b></div></div></div>
 <div class="wrap narrow"><article class="sec">
  <div class="rule caps"><span>${isBase ? "CHAPITRE " + pad(k + 1) : esc(c.domain)}</span><i></i><span>${esc(isBase ? eraShort(c) : (c.region || ""))}</span></div>
  <h1 class="t">${esc(nm(c))}</h1><div class="sub">${esc(isBase ? c.nameZh : c.name)}</div>
  <span class="verified">✓ ${esc(c.verified || U("已查證", "Verified", "Vérifié"))} · ${(c.sources || []).length} ${U("個來源", (c.sources || []).length === 1 ? "source" : "sources", (c.sources || []).length === 1 ? "source" : "sources")}</span>
  ${A.artSvg(c, "art", true)}
  ${c.what ? `<p>${esc(c.what)}</p>` : ""}${c.why ? `<p>${esc(c.why)}</p>` : ""}
  ${c.signal ? `<div class="box fo"><div class="caps">CE QUE VOUS VERREZ · ${U("你會看到", "What you will see", "Ce que vous verrez")}</div>${esc(c.signal)}</div>` : ""}
  ${c.meaning ? `<div class="box la"><div class="caps">POURQUOI · ${U("所以呢", "So what", "Pourquoi c’est important")}</div>${esc(c.meaning)}</div>` : ""}
  ${c.use ? `<div class="box ox"><div class="caps">SAVOIR-FAIRE · ${U("你可以怎麼用", "How to use it", "Comment en tirer parti")}</div>${esc(c.use)}</div>` : ""}
  ${c.bridge ? `<div class="kv"><span class="caps">${U("亞洲・歐洲對照", "Asian and European parallels", "Parallèles asiatiques et européens")}</span>${esc(c.bridge)}</div>` : ""}
  ${c.where ? `<div class="kv"><span class="caps">${U("去哪裡體驗", "Where to experience it", "Où le découvrir")}</span>${esc(c.where)}</div>` : ""}
  ${onRoutes.length ? `<div class="kv"><span class="caps">${U("出現在這些路線", "On these routes", "Sur ces itinéraires")}</span><div class="rel">${onRoutes.map(r => `<a href="${L(`routes/${r.id}/`)}">${esc(r.title)}</a>`).join("")}</div></div>` : ""}
  ${rel.length ? `<div class="kv"><span class="caps">${U("延伸閱讀", "Further reading", "Pour aller plus loin")}</span><div class="rel">${rel.map(x => `<a href="${L(cardPath(x))}">${esc(nm(x))}</a>`).join("")}</div></div>` : ""}
  <div class="kv"><span class="caps">${U("資料來源", "Sources", "Sources")}</span>${srcList(c.sources)}</div>
  <div class="acts"><a class="btn" href="${commons}" target="_blank" rel="noopener">${U("看實景照片（Wikimedia）", "See real photos (Wikimedia)", "Voir de vraies photos (Wikimedia)")} ↗</a></div>
  ${next ? `<a class="nextbig" href="${L(cardPath(next))}"><span class="caps">${isBase ? U("下一章", "Next chapter", "Chapitre suivant") : U("下一張", "Next card", "Fiche suivante")} · ${pad(k + 2)} / ${pad(seq.length)}</span><span class="nt"><span>${esc(nm(next))}</span><span aria-hidden="true">→</span></span></a>` : `<a class="nextbig" href="${L(isBase ? "explore/" : "routes/")}"><span class="caps">${isBase ? U("底圖讀完了", "Background complete", "Fondamentaux terminés") : U("全部看完了", "You have seen them all", "Vous avez tout vu")}</span><span class="nt"><span>${isBase ? U("開始探索解讀卡", "Start exploring the cards", "Explorer les fiches") : U("去看路線", "See the routes", "Voir les itinéraires")}</span><span aria-hidden="true">→</span></span></a>`}
  ${prev ? `<a class="prevlink" href="${L(cardPath(prev))}">← ${isBase ? U("上一章", "Previous chapter", "Chapitre précédent") : U("上一張", "Previous card", "Fiche précédente")}${U("：", ": ", " : ")}${esc(nm(prev))}</a>` : ""}
 </article></div>`, { "@context": "https://schema.org", "@type": "Article", headline: nm(c), alternativeHeadline: isBase ? c.nameZh : c.name, description: desc, inLanguage: U("zh-Hant", "en", "fr"), author: { "@type": "Person", name: "Victor Tseng" }, dateModified: BUILD_DATE.toISOString(), about: { "@type": "Place", name: "Côte d'Ivoire" }, citation: c.sources });
  });
}

// routes index + pages
add("routes/", "routes/", U("象牙海岸與達卡的分區路線：1–3 天行程與預估花費｜AKWABA", "Area routes in Côte d'Ivoire and Dakar: 1–3 day itineraries with cost estimates | AKWABA", "Itinéraires par zone en Côte d’Ivoire et à Dakar : 1 à 3 jours, avec budgets estimés | AKWABA"), U(`${routes.length} 條依區域串成的路線：阿必尚、班熱維爾、大巴薩姆、Assinie、亞穆蘇克羅、Korhogo、Man、達卡。每一站附法文站名，可直接給司機看。`, `${routes.length} routes grouped by area: Abidjan, Bingerville, Grand-Bassam, Assinie, Yamoussoukro, Korhogo, Man and Dakar. Every stop has its French name to show your driver.`, `${routes.length} itinéraires regroupés par zone : Abidjan, Bingerville, Grand-Bassam, Assinie, Yamoussoukro, Korhogo, Man et Dakar. Chaque étape a une fiche à montrer à votre chauffeur.`), L => `<div class="wrap"><section class="sec"><div class="rule caps"><span>ITINÉRAIRES</span><i></i><span>${U(`共 ${routes.length} 條`, `${routes.length} routes`, `${routes.length} itinéraires`)}</span></div><h1 class="t">${U("路線", "Routes", "Itinéraires")}</h1><div class="sub">${U("同一區域串成一天，不在城市兩端來回奔波；每一站附法文站名，可直接給司機看", "Each day stays in one area, with no crossing the city back and forth; every stop has its French name to show your driver", "Chaque journée reste dans une même zone, sans traverser la ville dans tous les sens ; chaque étape a une fiche à montrer à votre chauffeur")}</div>
 ${[1, 2, 3].map(d => { const l = routes.filter(r => r.days === d); return l.length ? `<h2 class="caps" style="margin-top:28px;color:var(--muted)">${U(`${d} 天行程`, `${d}-day ${d > 1 ? "itineraries" : "itineraries"}`, `Itinéraires de ${d} jour${d > 1 ? "s" : ""}`)}</h2><div class="rgrid">${l.map(r => routeCard(r, L)).join("")}</div>` : "" }).join("")}</section></div>`);
routes.forEach(r => {
  const days = [...new Set(r.stops.map(s => s.day))]; let n = 0;
  add(`routes/${r.id}/`, "routes/", U(`${r.title}｜${r.days} 天路線 · ${r.zone}｜AKWABA`, `${r.title} | ${r.days}-day route · ${r.zone} | AKWABA`, `${r.title} | itinéraire de ${r.days} jour${r.days > 1 ? "s" : ""} · ${r.zone} | AKWABA`), (r.intro || "").slice(0, U(150, 300, 300)), L => `
 <div class="rbar"><div class="wrap"><div class="row"><a class="back" href="${L("routes/")}">← ${U("路線", "Routes", "Itinéraires")}</a><span><b>${esc(r.code)}</b> · ${r.days} ${U("天", r.days > 1 ? "days" : "day", r.days > 1 ? "jours" : "jour")} · ${r.stops.length} ${U("站", "stops", "étapes")}</span></div><div style="height:8px"></div></div></div>
 <div class="wrap"><article class="sec">
  <div class="rule caps"><span>ITINÉRAIRE ${esc(r.code)}</span><i></i><span>${esc(r.zone)}</span></div>
  <h1 class="t">${esc(r.title)}</h1><div class="sub">${esc(r.span)}</div>
  <div class="route-layout"><div class="stick">${A.routePlate(r, "art", true)}<p>${esc(r.intro)}</p>${A.mapSvg(r)}</div>
  <div>
  ${days.map(d => `<div class="day">${days.length > 1 ? `<h2 class="dayh">${U(`第 ${d} 天`, `Day ${d}`, `Jour ${d}`)}</h2>` : ""}${r.stops.filter(s => s.day === d).map(s => { const num = s.x != null; if (num) n++; const card = s.card && byId(s.card); return `<div class="stop"><span class="tm">${esc(s.time || "")}</span><div><div class="nm">${num ? n + "　" : ""}${esc(s.name)}</div>${s.fr ? `<div class="fr" lang="fr">${esc(s.fr)}</div>` : ""}${s.note ? `<div class="nt">${esc(s.note)}</div>` : ""}<div class="lk">${card ? `<a href="${L(cardPath(card))}">${U("讀這一站的故事", "Read the story of this stop", "Lire l’histoire de cette étape")}</a>` : ""}${s.fr ? `<button type="button" data-fr="${esc(s.fr)}" data-zh="${esc(s.name)}">${U("給司機看", "Show the driver", "Montrer au chauffeur")}</button>` : ""}</div></div></div>` }).join("")}</div>`).join("")}
  <div class="kv"><span class="caps">${U("交通", "Getting around", "Se déplacer")}</span>${esc(r.transport)}</div>
  <div class="kv"><span class="caps">${U("預估花費（每人 · FCFA）", "Estimated cost (per person · FCFA)", "Budget estimé (par personne · FCFA)")}</span><div class="costs">${r.costs.map(c => `<div class="cost"><div class="lb">${esc(c.label)}</div><b>${esc(c.range)}</b></div>`).join("")}</div><div class="total"><span>${U("合計", "Total", "Total")}</span><b>${esc(r.total)}</b></div>${r.costNote ? `<p class="note">${esc(r.costNote)}</p>` : ""}</div>
  <div class="kv"><span class="caps">MISSIONS · ${U("任務", "Missions", "Missions")}</span>${r.missions.map((m, i) => `<label class="mission"><input type="checkbox" data-m="${r.id}_${i}"><span>${esc(m)}</span></label>`).join("")}<p class="note">${U("勾選紀錄只存在你自己的瀏覽器裡。", "Your ticks are saved only in your own browser.", "Vos coches sont enregistrées uniquement dans votre navigateur.")}</p></div>
  <div class="kv"><span class="caps">${U("費用與資訊來源", "Sources for costs and information", "Sources des prix et des informations")}</span>${srcList(r.sources)}</div>
  </div></div></article></div>`, { "@context": "https://schema.org", "@type": "TouristTrip", name: r.title, description: r.intro, touristType: "Cultural tourism", itinerary: { "@type": "ItemList", itemListElement: r.stops.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.fr || s.name })) } });
});

// occasions
add("savoir-vivre/", "savoir-vivre/", U("象牙海岸社交禮儀：商務、婚禮、葬禮、晚宴該說什麼、穿什麼｜AKWABA", "Etiquette in Côte d'Ivoire: what to say and wear at meetings, weddings, funerals and dinners | AKWABA", "Savoir-vivre en Côte d’Ivoire : que dire et que porter en rendez-vous, mariage, funérailles et dîner | AKWABA"), U("九種場合的語言、穿著、禮儀與禁忌：商務初見、帶亞洲貴賓參訪、婚禮與 Dot、葬禮、正式晚宴、maquis、與穆斯林夥伴往來、拜訪傳統首領。", "Language, dress, etiquette and what to avoid on nine occasions: a first business meeting, hosting Asian VIPs, weddings and the Dot, funerals, formal dinners, the maquis, Muslim partners and visits to traditional chiefs.", "Langue, tenue, usages et faux pas à éviter dans neuf situations : premier rendez-vous d’affaires, accueil de VIP asiatiques, mariage et dot, funérailles, dîner officiel, maquis, partenaires musulmans et visite à un chef traditionnel."), L => `<div class="wrap"><section class="sec"><div class="rule caps"><span>SAVOIR-VIVRE</span><i></i><span>${U(`共 ${occasions.length} 種場合`, `${occasions.length} occasions`, `${occasions.length} occasions`)}</span></div><h1 class="t">${U("場合指南", "A guide to occasions", "Guide des occasions")}</h1><div class="sub">${U("說什麼語言、穿什麼、注意什麼", "What language to use, what to wear, what to watch for", "Quelle langue parler, que porter, à quoi faire attention")}</div><p class="note" style="margin-bottom:18px">${U("這是經驗法則，慣例會因族群、家庭和場合而不同；拿不準時，先問熟悉當地的朋友。", "These are rules of thumb; customs vary by people, family and occasion. When in doubt, ask a friend who knows the place.", "Ce sont des repères : les usages varient selon les peuples, les familles et les circonstances. En cas de doute, demandez à un ami qui connaît bien le terrain.")}</p>
 <div class="occgrid">${occasions.map(o => `<div class="occ"><h2>${esc(o.title)}</h2>${[[U("語言", "Language", "Langue"), o.language], [U("穿著", "Dress", "Tenue"), o.dress], [U("禮儀", "Etiquette", "Usages"), o.etiquette], [U("避免", "Avoid", "À éviter"), o.avoid, "av"]].map(([k, v, cl]) => v ? `<div class="k ${cl || ""}">${k}</div><div>${esc(v)}</div>` : "").join("")}</div>`).join("")}</div></section></div>`);

// symbols
const SYM = require("./src/symbols.js")(A);
add("signes/", "signes/", "品牌符號與文化檢查：每個非洲圖樣的出處｜AKWABA", "AKWABA 使用的每一個圖樣：Akan 金砝碼幾何紋、Dida 拉菲亞紮染、北部泥造清真寺、Korhogo 繪布、窄帶手織布，從哪裡來、為什麼用、避開了什麼。", L => `<div class="wrap narrow"><section class="sec"><div class="rule caps"><span>SIGNES</span><i></i><span>${SYM.length}</span></div><h1 class="t">品牌符號</h1><div class="sub">每一個圖樣從哪裡來、為什麼用、用的時候避開了什麼</div>
 ${SYM.map(s => `<div class="sym"><div>${s.svg}</div><div><h2>${esc(s.t)}</h2><div class="v">${esc(s.v)}</div><div class="ck"><b>文化檢查</b>　${esc(s.ck)}</div>${s.src ? `<p class="note">${s.src.map(u => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(host(u))} ↗</a>`).join("　")}</p>` : ""}</div></div>`).join("")}</section></div>`);

// about
add("about/", "about/", U("關於 Victor Tseng｜亞非之間的品味 · 合作洽詢｜AKWABA", "About Victor Tseng | Taste between Asia and Africa · Work with me | AKWABA", "À propos de Victor Tseng | Le goût entre l’Asie et l’Afrique · Travailler ensemble | AKWABA"), U("Victor Tseng 曾浩瑜，維策顧問 VicTseng Consult 創辦人，以阿必尚為基地，為亞洲貴賓與企業提供非洲文化行程、跨文化簡報與考察團在地安排。", "Victor Tseng, founder of VicTseng Consult, based in Abidjan, offers cultural itineraries, cross-cultural briefings and on-the-ground support for business delegations to Asian guests and companies.", "Victor Tseng, fondateur de VicTseng Consult, basé à Abidjan, propose aux visiteurs et entreprises asiatiques des parcours culturels, des formations interculturelles et un accompagnement sur le terrain pour les délégations d’affaires."), L => {
  const svc = LANG === "fr" ? [["Parcours culturels privés", "Pour les visiteurs et chefs d’entreprise asiatiques : des journées guidées à Abidjan, Grand-Bassam et Yamoussoukro, du musée qui donne les clés de lecture aux galeries, ateliers de créateurs et dîners.", "akan"], ["Formations interculturelles pour les entreprises", "Pour les équipes asiatiques en poste en Afrique de l’Ouest : langue, occasions, usages, rythme des affaires et pièges à éviter, opérationnel en une demi-journée.", "kita"], ["Accompagnement des délégations d’affaires", "Mise en relation des industriels et délégations asiatiques avec partenaires locaux, clients potentiels et distributeurs ; organisation des visites, interprétariat et rythme des rendez-vous.", "modern"], ["Contenus et conférences", "Faire découvrir l’art, le design et la vie en Afrique : chroniques, conférences et événements de marque.", "wax"]] : LANG === "en" ? [["Private cultural itineraries", "For visiting Asian guests and business owners: guided days in Abidjan, Grand-Bassam and Yamoussoukro, from the museum's base map to galleries, designers' studios and dinners.", "akan"], ["Cross-cultural briefings for companies", "For Asian teams posted to West Africa: language, occasions, etiquette, business rhythm and pitfalls, ready to use in half a day.", "kita"], ["On-the-ground support for business delegations", "Connecting Asian manufacturers and delegations with local partners, prospective clients and distributors; arranging visits, interpreting and the pace of meetings.", "modern"], ["Content and speaking", "Introducing African art, design and life: columns, talks and brand events.", "wax"]] : [["私人文化行程", "為來訪的亞洲貴賓與企業主，設計中文導覽的阿必尚、大巴薩姆、亞穆蘇克羅行程：從博物館的底圖，到畫廊、設計師工作室與晚宴。", "akan"], ["企業跨文化簡報", "給派駐西非的亞洲團隊：語言、場合、禮儀、商務節奏和避雷清單，半天就能上手。", "kita"], ["商務考察團在地安排", "幫亞洲廠商與考察團對接在地夥伴、潛在客戶與通路，安排拜訪、翻譯與會面節奏。", "modern"], ["內容與演講合作", "以繁體中文介紹非洲藝術、設計與生活：專欄、講座、品牌活動。", "wax"]];
  return `<div class="hero"><div class="id"><h1 class="t" style="margin:0">Victor Tseng 曾浩瑜</h1><div class="sub">${U("亞非之間的品味 · 維策顧問 VicTseng Consult 創辦人", "Taste between Asia and Africa · Founder, VicTseng Consult", "Le goût entre l’Asie et l’Afrique · Fondateur de VicTseng Consult")}</div>
  <div class="acts" style="justify-content:center"><a class="btn on" href="mailto:${esc(cfg.email)}?subject=${encodeURIComponent(U("合作洽詢 · AKWABA", "Enquiry · AKWABA", "Demande · AKWABA"))}" data-ga="contact_email">✉ ${esc(cfg.email)}</a><a class="btn" href="${esc(cfg.linkedin)}" target="_blank" rel="noopener" data-ga="contact_linkedin">LinkedIn ↗</a></div></div>
  <div class="poster">${A.plate("portrait", "dida", "", "Victor Tseng", true)}</div></div>
  <div class="wrap narrow"><section class="sec"><div class="rule caps"><span>À PROPOS</span><i></i><span>CONTACT</span></div>
  <p class="lead">${U("來自台灣，以阿必尚為基地。專長是行銷、專案管理與商務開發，畢業於法國 IAE Paris-Est。我做 AKWABA，是因為發現亞洲人來到非洲，最缺的不是資訊，而是一張看得懂的「底圖」：知道眼前的東西是什麼、為什麼是這樣、在什麼場合該怎麼做。", "I am from Asia and based in Abidjan, working in marketing, project management and business development, and a graduate of IAE Paris-Est in France. I made AKWABA because I found that what Asians arriving in Africa lack most is not information but a base map they can read: what they are looking at, why it is the way it is, and how to behave on each occasion.", "Originaire d’Asie et installé à Abidjan, je travaille dans le marketing, la gestion de projet et le développement commercial ; je suis diplômé de l’IAE Paris-Est. J’ai créé AKWABA parce que ce qui manque le plus aux Asiatiques qui arrivent en Afrique, ce n’est pas l’information, mais une grille de lecture : comprendre ce qu’ils voient, pourquoi c’est ainsi, et comment se comporter selon les occasions.")}</p>
  ${svc.map(([t, d, p]) => `<div class="sym" style="grid-template-columns:72px 1fr"><div><svg viewBox="0 0 72 72" style="width:72px"><defs>${A.patDef("a" + p, p)}</defs><rect width="72" height="72" fill="url(#a${p})"/><rect x="2" y="2" width="68" height="68" fill="none" stroke="#141414" stroke-width="4"/></svg></div><div><h2>${t}</h2><div class="v">${d}</div></div></div>`).join("")}
  <div class="kv" style="margin-top:28px"><span class="caps">${U("合作洽詢", "Work with me", "Travailler ensemble")}</span><p>${U("請簡單說明來訪時間、人數與想看的主題，我會在兩個工作天內回覆。", "Tell me briefly when you are coming, how many people and what you would like to see; I reply within two working days.", "Indiquez-moi brièvement vos dates, le nombre de personnes et ce que vous aimeriez voir ; je réponds sous deux jours ouvrés.")}</p><div class="acts"><a class="btn on" href="mailto:${esc(cfg.email)}?subject=${encodeURIComponent(U("合作洽詢 · AKWABA", "Enquiry · AKWABA", "Demande · AKWABA"))}" data-ga="contact_email">✉ ${U("寫信給我", "Email me", "M’écrire")}</a><a class="btn" href="${esc(cfg.linkedin)}" target="_blank" rel="noopener" data-ga="contact_linkedin">LinkedIn ↗</a></div></div></section></div>`;
}, { "@context": "https://schema.org", "@type": "Person", name: "Victor Tseng", alternateName: "曾浩瑜", jobTitle: "Founder, VicTseng Consult", email: "mailto:" + cfg.email, sameAs: [cfg.linkedin], workLocation: { "@type": "Place", name: "Abidjan, Côte d'Ivoire" } });

}

/* ---------- write ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
const write = (p, html) => { const f = path.join(OUT, p, "index.html"); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
// collect which paths exist in each language first (for hreflang and the language switch)
LANG = "en"; useData(EN); pages = []; definePages(); EN_PATHS = new Set(pages.map(pg => pg.p));
LANG = "fr"; useData(FR); pages = []; definePages(); FR_PATHS = new Set(pages.map(pg => pg.p));
LANG = "hant"; useData(ZH); pages = []; definePages(); const ZH_PAGES = pages; ZH_PATHS = new Set(pages.map(pg => pg.p));
for (const pg of ZH_PAGES) {
  write(pg.p, shell({ lang: "hant", ...pg }));
  if (conv) write("zh-hans/" + pg.p, toHans(shell({ lang: "hans", ...pg })));
}
LANG = "en"; useData(EN); pages = []; definePages(); const EN_PAGES = pages;
for (const pg of EN_PAGES) write("en/" + pg.p, shell({ lang: "en", ...pg }));
LANG = "fr"; useData(FR); pages = []; definePages(); const FR_PAGES = pages;
for (const pg of FR_PAGES) write("fr/" + pg.p, shell({ lang: "fr", ...pg }));
LANG = "hant"; useData(ZH);
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });
fs.copyFileSync("src/site.css", path.join(OUT, "assets/site.css"));
fs.copyFileSync("src/site.js", path.join(OUT, "assets/site.js"));
fs.writeFileSync(path.join(OUT, "assets/favicon.svg"), A.mono(64, "#141414", "#F7F3EC").replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '));
if (fs.existsSync("src/og.png")) fs.copyFileSync("src/og.png", path.join(OUT, "assets/og.png"));
const urls = [...ZH_PAGES.flatMap(pg => [`${SITE}${BASE}/${pg.p}`, ...(conv ? [`${SITE}${BASE}/zh-hans/${pg.p}`] : [])]), ...EN_PAGES.map(pg => `${SITE}${BASE}/en/${pg.p}`), ...FR_PAGES.map(pg => `${SITE}${BASE}/fr/${pg.p}`)];
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${u}</loc><lastmod>${BUILD_DATE.toISOString().slice(0, 10)}</lastmod></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}${BASE}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, "404.html"), shell({ lang: "hant", p: "404.html", nav: "", title: "找不到這一頁｜AKWABA", desc: "找不到這一頁", body: L => `<div class="wrap narrow"><section class="sec"><h1 class="t">找不到這一頁</h1><p><a class="more" href="${L("")}">回首頁 →</a></p></section></div>` }));
if (cfg.customDomain) fs.writeFileSync(path.join(OUT, "CNAME"), cfg.customDomain + "\n");
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
if (fs.existsSync("src/static")) for (const f of fs.readdirSync("src/static")) fs.copyFileSync(path.join("src/static", f), path.join(OUT, f));
console.log(`built ${ZH_PAGES.length} pages${conv ? " ×2 (zh-Hant + zh-Hans)" : " (zh-Hant)"} + ${EN_PAGES.length} English + ${FR_PAGES.length} French → ${OUT}/`);
