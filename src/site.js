/* AKWABA site behaviour: weekly route, explore filter, driver card, missions, GA4 events */
(function(){
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce)document.querySelectorAll("svg").forEach(function(s){try{s.pauseAnimations()}catch(e){}});
  function isoWeek(d){var t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));var day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);var y0=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t-y0)/864e5+1)/7)}
  var wk=document.querySelector(".weekly");
  if(wk){var cards=wk.querySelectorAll(".rcard[data-i]"),w=isoWeek(new Date()),i=w%cards.length;
    cards.forEach(function(c){c.hidden=+c.dataset.i!==i});var l=wk.querySelector(".wk");if(l)l.textContent="W"+w}
  var tiles=document.getElementById("tiles");
  if(tiles){document.querySelectorAll("[data-filter]").forEach(function(b){b.addEventListener("click",function(){
    var d=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(function(x){x.classList.toggle("on",x===b)});
    tiles.querySelectorAll(".tile").forEach(function(t){t.hidden=!(d==="*"||t.dataset.d===d||b.textContent===t.dataset.d)});
    if(window.gtag)gtag("event","filter_domain",{domain:d});})})}
  var drv=document.getElementById("drv");
  document.querySelectorAll("[data-fr]").forEach(function(b){b.addEventListener("click",function(){
    document.getElementById("drvP").textContent=b.dataset.fr;document.getElementById("drvZ").textContent=b.dataset.zh||"";drv.classList.add("on");
    if(window.gtag)gtag("event","show_driver_card",{place:b.dataset.fr});})});
  if(drv)drv.addEventListener("click",function(){drv.classList.remove("on")});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&drv)drv.classList.remove("on")});
  var store={};try{store=JSON.parse(localStorage.getItem("ak-missions")||"{}")}catch(e){}
  document.querySelectorAll("[data-m]").forEach(function(cb){cb.checked=!!store[cb.dataset.m];cb.addEventListener("change",function(){
    store[cb.dataset.m]=cb.checked;try{localStorage.setItem("ak-missions",JSON.stringify(store))}catch(e){}
    if(cb.checked&&window.gtag)gtag("event","mission_done",{mission:cb.dataset.m});})});
  document.querySelectorAll("[data-ga]").forEach(function(a){a.addEventListener("click",function(){if(window.gtag)gtag("event",a.dataset.ga)})});
})();

// 首頁第一屏高度＋往下提示
(function(){var f=document.querySelector(".first");if(!f)return;
function fit(){document.documentElement.style.setProperty("--fold-top",(f.getBoundingClientRect().top+window.scrollY)+"px")}
fit();window.addEventListener("load",fit);var w=innerWidth;window.addEventListener("resize",function(){if(innerWidth!==w){w=innerWidth;fit()}});
var c=f.querySelector(".cue");if(c){var t=function(){c.classList.toggle("gone",window.scrollY>60)};window.addEventListener("scroll",t,{passive:true});t()}})();

// 電腦版主視覺：依容器比例拉寬四色帶，滿版不留黑邊
(function(){var s=document.querySelector(".hero-four");if(!s)return;var box=s.parentNode;
function q(a){return s.querySelectorAll(a)}
function lay(){var W=338,H=220;if(window.innerWidth>=900){var r=box.getBoundingClientRect();if(r.height>0&&r.width>0){var k=r.width/r.height;if(k>=338/220){W=Math.round(220*k)}else{H=Math.round(338/k)}}}
var bw=W/4;q("[data-b]").forEach(function(e,i){e.setAttribute("x",i*bw);e.setAttribute("width",bw+.5);e.setAttribute("height",H)});
q("[data-d]").forEach(function(e,i){e.setAttribute("d","M"+(i+1)*bw+" 0 V"+H)});
q("[data-l]").forEach(function(e,i){e.setAttribute("transform","translate("+(i*bw+bw/2)+" "+(H-220)+")")});
s.querySelector("[data-m]").setAttribute("transform","translate("+(W/2-169)+" "+(H-220)/2+")");
var f=s.querySelector("[data-f]");f.setAttribute("width",W-6);f.setAttribute("height",H-6);s.setAttribute("viewBox","0 0 "+W+" "+H)}
lay();window.addEventListener("load",lay);window.addEventListener("resize",lay)})();
