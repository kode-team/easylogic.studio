if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return c[e]||(r=new Promise(async r=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=r}else importScripts(e),r()})),r.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},r=(r,c)=>{Promise.all(r.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(r)};self.define=(r,d,i)=>{c[r]||(c[r]=Promise.resolve().then(()=>{let c={};const a={uri:location.origin+r.slice(1)};return Promise.all(d.map(r=>{switch(r){case"exports":return c;case"module":return a;default:return e(r)}})).then(e=>{const r=i(...e);return c.default||(c.default=r),c})}))}}define("./service-worker.js",["./workbox-d9851aed"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/./embed.html",revision:"0ab76989e9efbade275711d97c83c6b4"},{url:"/./index.html",revision:"d0a03c359bf3b20fad24e8dcfc70db0a"},{url:"/./player.html",revision:"00445063ec5084526ce2677becea2c29"},{url:"/3a8ca398e6a5c3b83f4de7c60843a9a0.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"/editor.css?4d8ec7018f88b2dd3f2e",revision:"45afa7dcae86f099679f1cdc1c7da04c"},{url:"/editor.js?c9fa15fc8bd5131c3f85",revision:"e1bd9d80306480d53fd1b33a0dc50738"},{url:"/embed.css?7eec9ad5babd341764af",revision:"508805821e5e3fc52580e1450561d6a1"},{url:"/embed.js?78a7f3299fcbbb681489",revision:"8f91f353d7dd336079d9b4abb55efdf8"},{url:"/icon.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"/player.css?84346683594321d4fe0b",revision:"e1a215c80a9478968ec8ea9af64c3846"},{url:"/player.js?97472fc075f59e304d66",revision:"785cb7ad15cbdb12d4594bdfb0eafa5d"}],{})}));
