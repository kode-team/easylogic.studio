if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return c[e]||(r=new Promise(async r=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=r}else importScripts(e),r()})),r.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},r=(r,c)=>{Promise.all(r.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(r)};self.define=(r,i,s)=>{c[r]||(c[r]=Promise.resolve().then(()=>{let c={};const o={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return c;case"module":return o;default:return e(r)}})).then(e=>{const r=s(...e);return c.default||(c.default=r),c})}))}}define("./service-worker.js",["./workbox-d9851aed"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/./index.html",revision:"c008ad506e5bedc1cdf0816fdcb3985e"},{url:"/./player.html",revision:"13e8e58e5521e75d609b9fe9ae4dd74e"},{url:"/3a8ca398e6a5c3b83f4de7c60843a9a0.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"/editor.css?456c6c00bdfe80b9a085",revision:"460bc16fbb0e5620a5f8de30a9596e3d"},{url:"/icon.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"/player.css?456c6c00bdfe80b9a085",revision:"460bc16fbb0e5620a5f8de30a9596e3d"},{url:"/player.js?42a1225888809dcd7c90",revision:"f5f5111e8cbeec92a147370554967e9c"}],{})}));
