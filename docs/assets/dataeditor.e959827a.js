import{b as n}from"./index.4df08a36.js";function l(){return["app"].map(i=>n({container:document.getElementById(i),onChange:(o,t,e)=>{console.log(o.getValue(),t,e)},inspector:[{editor:"Button",editorOptions:{text:"Edit",onClick:()=>{console.log("a")}}},{type:"column",size:[1,1],columns:[{key:"column1",editor:"color-view",editorOptions:{label:"Color"}}]},{type:"folder",label:"folder test",children:[{key:"column1",editor:"color-view",editorOptions:{label:"Color"}},{type:"column",size:[1,1],columns:[{key:"column1",editor:"color-view",editorOptions:{label:"Color"}}]}]}],config:{"editor.theme":"light"},plugins:[function(o){o.on("changed",(t,e,c)=>{})}]}))}window.EasylogicEditor=l();
