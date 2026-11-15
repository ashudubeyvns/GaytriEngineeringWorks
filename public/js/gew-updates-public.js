import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const configured = firebaseConfig.apiKey !== "PASTE_FIREBASE_API_KEY";
const esc = s => String(s || "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dateText = v => v?.toDate ? v.toDate().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "";
const card = p => `<article class="gew-update-card">${p.imageUrl ? `<img class="gew-update-image" src="${esc(p.imageUrl)}" alt="${esc(p.title)}" loading="lazy">` : ""}<div class="gew-update-body"><div class="gew-update-meta"><span class="gew-update-category">${esc(p.category || "Company News")}</span><span>${dateText(p.createdAt)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></div></article>`;
let app,db;
async function load(target,max=3,category=""){
 const el=document.getElementById(target); if(!el)return;
 if(!configured){el.innerHTML='<div class="gew-updates-empty">Firebase setup is required before posts can appear.</div>';return;}
 try{
  if(!app){app=initializeApp(firebaseConfig);db=getFirestore(app);}
  const filters=[where("published","==",true)]; if(category)filters.push(where("category","==",category));
  const q=query(collection(db,"gewUpdates"),...filters,orderBy("createdAt","desc"),limit(max)),snap=await getDocs(q);
  el.innerHTML=snap.empty?'<div class="gew-updates-empty">No updates published yet. Please check back soon.</div>':snap.docs.map(d=>card(d.data())).join("");
 }catch(e){console.error("GEW updates",e);el.innerHTML='<div class="gew-updates-empty">Updates are temporarily unavailable.</div>';}
}
window.GEWUpdates={load};load("home-updates-list",3);load("all-updates-list",60);