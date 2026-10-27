// 基本情報 学習ノート：オフライン用のサービスワーカー
const CACHE="fe-d8bcd28adf";
const FILES=["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon-v2.png", "icons/icon-192-v2.png", "icons/icon-512-v2.png", "icons/maskable-512-v2.png", "pq/2023r05a10.png", "pq/2023r05a11.png", "pq/2023r05a13.png", "pq/2023r05a2.png", "pq/2023r05b1_1.png", "pq/2023r05b2_1.png", "pq/2023r05b3_1.png", "pq/2023r05b3_2.png", "pq/2023r05b4_1.png", "pq/2023r05b4_2.png", "pq/2023r05b5_1.png", "pq/2023r05b5_2.png", "pq/2023r05b6_1.png", "pq/2023r05b6_2.png", "pq/2024r06a13.png", "pq/2024r06a19.png", "pq/2024r06a3.png", "pq/2024r06b1_1.png", "pq/2024r06b2_1.png", "pq/2024r06b3_1.png", "pq/2024r06b3_2.png", "pq/2024r06b4_1.png", "pq/2024r06b4_2.png", "pq/2024r06b5_1.png", "pq/2024r06b5_2.png", "pq/2024r06b5_3.png", "pq/2024r06b6_1.png", "pq/2024r06b6_2.png", "pq/2025r07a14.png", "pq/2025r07a3.png", "pq/2025r07b1_1.png", "pq/2025r07b1_2.png", "pq/2025r07b2_1.png", "pq/2025r07b3_1.png", "pq/2025r07b3_2.png", "pq/2025r07b4_1.png", "pq/2025r07b5_1.png", "pq/2025r07b5_2.png", "pq/2025r07b6_1.png", "pq/2025r07b6_2.png", "pq/2026r08a6.png", "pq/2026r08b1_1.png", "pq/2026r08b2_1.png", "pq/2026r08b3_1.png", "pq/2026r08b4_1.png", "pq/2026r08b4_2.png", "pq/2026r08b5_1.png", "pq/2026r08b5_2.png", "pq/2026r08b6_1.png", "pq/2026r08b6_2.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k.startsWith("fe-")).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const url=new URL(req.url);
  // フォント：保存してあればそれを使い、裏で新しくする
  if(/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.open("fe-fonts").then(async c=>{ const hit=await c.match(req); const net=fetch(req).then(r=>{ if(r.ok||r.type==="opaque") c.put(req,r.clone()); return r; }).catch(()=>hit); return hit||net; }));
    return;
  }
  if(url.origin!==location.origin) return;
  // ページ本体：電波があれば最新を取りに行き、なければ保存した版
  if(req.mode==="navigate"||url.pathname.endsWith("/index.html")){
    e.respondWith(fetch(req,{cache:"no-store"}).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put("index.html",cp)); return r; }).catch(()=>caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req)));
});
