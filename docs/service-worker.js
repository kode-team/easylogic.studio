if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return c[e]||(r=new Promise(async r=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=r}else importScripts(e),r()})),r.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},r=(r,c)=>{Promise.all(r.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(r)};self.define=(r,a,i)=>{c[r]||(c[r]=Promise.resolve().then(()=>{let c={};const s={uri:location.origin+r.slice(1)};return Promise.all(a.map(r=>{switch(r){case"exports":return c;case"module":return s;default:return e(r)}})).then(e=>{const r=i(...e);return c.default||(c.default=r),c})}))}}define("./service-worker.js",["./workbox-d9851aed"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/./index.html",revision:"908e1376c92ef3ab565a70d82ffef32f"},{url:"/./player.html",revision:"fbffe9f2024c4f6c61bdae877a700764"},{url:"/3a8ca398e6a5c3b83f4de7c60843a9a0.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"/color-assets.js?912a9b7f3b7951c26052",revision:"e07008bdd503d5bb6eae7480d6207e74"},{url:"/editor.css?7ef2856dcac0e10d074b",revision:"0dc88b95bc122ffaae4aa9f3bc21c73e"},{url:"/editor.js?7a948a9e57d0e7150bb8",revision:"5f1c70da6fd97043aec230864e361563"},{url:"/icon.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"/player.css?7ef2856dcac0e10d074b",revision:"0dc88b95bc122ffaae4aa9f3bc21c73e"},{url:"/player.js?a0c93f455ccde05ce18e",revision:"57d40c93bddc637a8d408e7fe8f8e563"}],{})}));
