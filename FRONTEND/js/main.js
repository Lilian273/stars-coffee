/* Stars Coffee — interactions
   Design & development: DEVBYLILIAN */

/* ================= MARQUEE ================= */
(() => {
  const chunk = CATS.map(c => `<span>${c.name}<svg aria-hidden="true"><use href="#star"/></svg></span>`).join("");
  document.getElementById("track").innerHTML = chunk + chunk + chunk + chunk;
})();
document.getElementById("bentoArt").innerHTML = ILL.waffle;

/* ================= MENU ================= */
const grid = document.getElementById("grid"), chips = document.getElementById("chips"), q = document.getElementById("q");
let activeCat = "all";
function tint(c){ return `color-mix(in srgb, ${c} 22%, var(--surface-2))`; }
function renderMenu(){
  const term = q.value.trim();
  let list = activeCat === "all" ? ALL : ALL.filter(x => x.cat.id === activeCat);
  if(term) list = ALL.filter(x => (x.n + " " + x.d + " " + x.cat.name).includes(term));
  grid.classList.remove("anim"); void grid.offsetWidth; grid.classList.add("anim");
  grid.innerHTML = list.length ? list.map((x,i) => `
    <article class="card" style="animation-delay:${Math.min(i,12)*35}ms">
      <div class="pic" style="background:${tint(x.cat.color)}">${ILL[x.cat.ill]}</div>
      <div class="cat"><i style="background:${x.cat.color}"></i>${x.cat.name}</div>
      <h3>${x.n}</h3><p>${x.d}</p>
    </article>`).join("") : `<div class="empty">ما لقينا "${term.replace(/[<>&"]/g,"")}" بالمنيو. جرّب كلمة تانية.</div>`;
}
[{id:"all",name:"الكل"}, ...CATS].forEach(c => {
  const b = document.createElement("button");
  b.className = "chip"; b.type = "button"; b.textContent = c.name; b.dataset.id = c.id;
  b.setAttribute("aria-pressed", c.id === activeCat);
  b.onclick = () => { activeCat = c.id; q.value = ""; [...chips.children].forEach(x => x.setAttribute("aria-pressed", x.dataset.id === c.id)); renderMenu(); };
  chips.appendChild(b);
});
q.addEventListener("input", () => {
  [...chips.children].forEach(x => x.setAttribute("aria-pressed", q.value.trim() ? "false" : String(x.dataset.id === activeCat)));
  renderMenu();
});
renderMenu();

/* ================= BUILDER ================= */
const pick = { base:"waffle", sauce:"nutella", top:"straw" };
const PTS = [[88,92],[132,84],[112,112],[150,118],[76,124],[124,138],[98,146]];
function topping(id,x,y){
  if(id==="straw") return `<g transform="translate(${x} ${y})"><path d="M0 9C-9 9-12 1-9-5c4-5 14-5 18 0 3 6 0 14-9 14Z" fill="#E8435A"/><path d="M-5-6l5-3 5 3" stroke="#3FA35B" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#FFD3DA"><circle cx="-3" cy="0" r="1"/><circle cx="3" cy="3" r="1"/><circle cx="0" cy="-2" r="1"/></g></g>`;
  if(id==="banana") return `<g transform="translate(${x} ${y})"><circle r="9" fill="#FBEDB5" stroke="#E9CF6B" stroke-width="2.5"/><circle r="2.5" fill="#E9CF6B"/></g>`;
  if(id==="oreo") return `<g transform="translate(${x} ${y})"><circle r="9" fill="#2B2B2B"/><circle r="6" fill="#F6F1E7"/><circle r="4" fill="#2B2B2B" opacity=".25"/></g>`;
  return `<g transform="translate(${x} ${y}) rotate(${(x*7)%60})"><ellipse rx="7" ry="4.5" fill="#B07A45"/><path d="M-4 0h8" stroke="#8A5A2E" stroke-width="1.5"/></g>`;
}
function baseSvg(id){
  if(id==="waffle") return `<g transform="rotate(-6 120 115)"><rect x="56" y="60" width="128" height="112" rx="20" fill="#E3A54F"/><g stroke="#C07F2F" stroke-width="7"><path d="M88 64v104M120 62v108M152 64v104M60 88h120M58 116h124M60 144h120"/></g><rect x="56" y="60" width="128" height="112" rx="20" fill="none" stroke="#C07F2F" stroke-width="6"/></g>`;
  if(id==="crepe") return `<path d="M44 164 196 164 124 52Z" fill="#EFC985" stroke="#D9A85C" stroke-width="6" stroke-linejoin="round"/><path d="M60 140c40 14 90 14 124 0" stroke="#D9A85C" stroke-width="4" fill="none" opacity=".7"/>`;
  return `<g fill="#D9974A">${[[80,140],[120,146],[160,140],[100,112],[140,112],[120,84]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="22"/>`).join("")}</g><g fill="#EFB870">${[[72,132],[112,138],[152,132],[92,104],[132,104],[112,76]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="7" ry="5"/>`).join("")}</g>`;
}
function renderPreview(){
  const sauce = OPTS.sauce.find(s => s.id === pick.sauce).c;
  const drizzle = pick.base === "crepe"
    ? `<path d="M84 128c14-10 22 8 36-2s22 8 36-2M100 104c10-8 16 6 26-2s16 6 22-2" stroke="${sauce}" stroke-width="8" fill="none" stroke-linecap="round"/>`
    : `<path d="M62 100c16-14 28 12 44 0s28 12 44 0 20 10 30 6M70 132c14-10 24 10 38 0s24 10 38 0 16 8 26 4" stroke="${sauce}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  const pts = pick.base === "crepe" ? PTS.filter(([x,y]) => y > 100 && x > 80 && x < 160) : PTS;
  document.getElementById("preview").innerHTML = `<svg class="pop" viewBox="0 0 240 200" role="img" aria-label="معاينة الطلبية">
    <ellipse cx="120" cy="178" rx="104" ry="18" fill="#000" opacity=".18"/>
    <ellipse cx="120" cy="170" rx="104" ry="20" fill="#FFF4E3"/><ellipse cx="120" cy="170" rx="80" ry="13" fill="#EADAC0"/>
    ${baseSvg(pick.base)}${drizzle}${pts.map(([x,y]) => topping(pick.top,x,y)).join("")}</svg>`;
  const n = k => OPTS[k].find(o => o.id === pick[k]).name;
  document.getElementById("yourOrder").innerHTML = `<small>طلبيتك</small>${n("base")} مع ${n("sauce")} و${n("top")}`;
}
document.querySelectorAll(".opts").forEach(box => {
  const g = box.dataset.group;
  OPTS[g].forEach(o => {
    const b = document.createElement("button");
    b.className = "opt"; b.type = "button"; b.dataset.id = o.id;
    b.innerHTML = `<i style="background:${o.c}"></i>${o.name}`;
    b.setAttribute("aria-pressed", pick[g] === o.id);
    b.onclick = () => { pick[g] = o.id; [...box.children].forEach(x => x.setAttribute("aria-pressed", x.dataset.id === o.id)); renderPreview(); };
    box.appendChild(b);
  });
});
renderPreview();
const toast = document.getElementById("toast");
function showToast(t){ toast.textContent = t; toast.classList.add("show"); clearTimeout(showToast.t); showToast.t = setTimeout(() => toast.classList.remove("show"), 2200); }
document.getElementById("copyBtn").onclick = async () => {
  const txt = document.getElementById("yourOrder").textContent.replace("طلبيتك","").trim();
  try{ await navigator.clipboard.writeText("طلبية Stars Coffee: " + txt); showToast("انسخت الطلبية، هلأ اتصل على " + PHONE); }
  catch(e){ showToast("طلبيتك: " + txt); }
};

/* ================= TIME / STATUS ================= */
const DAYS = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
function nazNow(){
  const parts = new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Jerusalem",hour:"2-digit",minute:"2-digit",hour12:false,weekday:"short"}).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t)?.value;
  const wd = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(get("weekday"));
  return { h:+get("hour") % 24, m:+get("minute"), wd };
}
const fmtH = h => String(h % 24).padStart(2,"0") + ":00";
function tick(){
  let t; try{ t = nazNow(); }catch(e){ return; }
  const open = t.h >= HOURS.open && t.h < HOURS.close;
  const msg = open ? "مفتوحين هلأ، لنص الليل" : `مسكّرين، منفتح الساعة ${HOURS.open}:00`;
  ["status","status2"].forEach(id => document.getElementById(id).classList.toggle("is-open", open));
  document.getElementById("statusText").textContent = msg;
  document.getElementById("statusText2").textContent = msg;
  document.getElementById("clock").textContent = String(t.h).padStart(2,"0") + ":" + String(t.m).padStart(2,"0");
  const now = document.getElementById("dayNow");
  if(open){
    const pct = ((t.h + t.m/60) - HOURS.open) / (HOURS.close - HOURS.open) * 100;
    now.hidden = false; now.style.insetInlineStart = pct + "%";
    document.querySelectorAll(".stage").forEach(s => s.classList.toggle("active", t.h >= +s.dataset.from && t.h < +s.dataset.to));
  } else {
    now.hidden = true;
    document.getElementById("dayNote").textContent = `مسكّرين هلأ. منستناكم بكرا من الساعة ${HOURS.open}:00.`;
  }
  const hl = document.getElementById("hours");
  if(!hl.children.length){
    hl.innerHTML = DAYS.map((d,i) => `<li data-i="${i}"><span>${d}</span><span class="num">${fmtH(HOURS.open)} – ${fmtH(HOURS.close)}</span></li>`).join("");
  }
  [...hl.children].forEach(li => li.classList.toggle("today", +li.dataset.i === t.wd));
}
tick(); setInterval(tick, 30000);
document.getElementById("yr").textContent = new Date().getFullYear();

/* ================= THEME ================= */
const root = document.documentElement, themeBtn = document.getElementById("themeBtn"), themeIcon = document.getElementById("themeIcon");
const SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
const MOON = '<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z"/>';
const cur = () => root.dataset.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
try{ const s = localStorage.getItem("stars-theme"); if(s) root.dataset.theme = s; }catch(e){}
const setIcon = () => themeIcon.innerHTML = cur() === "dark" ? SUN : MOON;
setIcon();
themeBtn.onclick = () => { root.dataset.theme = cur() === "dark" ? "light" : "dark"; try{ localStorage.setItem("stars-theme", root.dataset.theme); }catch(e){} setIcon(); };

/* ================= STARRY SKY ================= */
(() => {
  const c = document.getElementById("sky"), ctx = c.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, stars = [], pointer = null, trail = [];
  const col = n => getComputedStyle(root).getPropertyValue(n).trim();
  function resize(){
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = c.clientWidth; H = c.clientHeight; c.width = W*dpr; c.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    stars = Array.from({length:Math.round(W*H/4800)}, () => ({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,t:Math.random()*6.3,s:Math.random()*.02+.004,g:Math.random()<.08}));
  }
  function draw(){
    const ink = col("--ink"), gold = col("--gold");
    ctx.clearRect(0,0,W,H);
    let near = [];
    for(const s of stars){
      if(!reduce) s.t += s.s;
      ctx.globalAlpha = .3 + .7*Math.abs(Math.sin(s.t)); ctx.fillStyle = s.g ? gold : ink;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,6.3); ctx.fill();
      if(pointer){ const d = Math.hypot(s.x-pointer.x, s.y-pointer.y); if(d < 160) near.push([s,d]); }
    }
    if(pointer && near.length > 1){
      near = near.sort((a,b) => a[1]-b[1]).slice(0,7).map(n => n[0]).sort((a,b) => Math.atan2(a.y-pointer.y,a.x-pointer.x) - Math.atan2(b.y-pointer.y,b.x-pointer.x));
      ctx.strokeStyle = gold; ctx.lineWidth = 1; ctx.globalAlpha = .5; ctx.beginPath();
      near.forEach((s,i) => i ? ctx.lineTo(s.x,s.y) : ctx.moveTo(s.x,s.y)); ctx.closePath(); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = gold;
      near.forEach(s => { ctx.beginPath(); ctx.arc(s.x,s.y,s.r+1.4,0,6.3); ctx.fill(); });
    }
    ctx.globalAlpha = 1;
    if(!reduce) requestAnimationFrame(draw);
  }
  const hero = c.parentElement;
  const setP = e => { const r = c.getBoundingClientRect(), p = e.touches ? e.touches[0] : e; pointer = {x:p.clientX-r.left,y:p.clientY-r.top}; if(reduce) draw(); };
  hero.addEventListener("pointermove", setP);
  hero.addEventListener("touchmove", setP, {passive:true});
  hero.addEventListener("pointerleave", () => { pointer = null; if(reduce) draw(); });
  addEventListener("resize", () => { resize(); if(reduce) draw(); });
  new MutationObserver(() => { if(reduce) draw(); }).observe(root,{attributes:true,attributeFilter:["data-theme"]});
  resize(); draw();
})();
