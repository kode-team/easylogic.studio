# EasyLogic Studio


EasyLogic Studio is built using CSS and SVG to reduce the gap between web design and code. The goal is to have the same point in time between the designer's design and the developer's output.


* manual : https://www.easylogic.studio/docs/getting-started.html
* editor : https://editor-core.easylogic.studio/
* player: https://editor-core.easylogic.studio/player.html
* editor-with-plugin: https://editor.easylogic.studio/


This project is [sapa](https://github.com/easylogic/sapa) based. 

# Screen Shot 

<img src='https://www.easylogic.studio/images/editor.png' />


# Features 

### Support Element 

* Artboard 
* Rect 
* Circle 
* Text 
* Image 
* SVG Path (with Rect, Circle) 
* SVG Spline
* SVG Polygon
* SVG Star 
* SVG TextPath


### Style

* Alignment 
* Position 
* Size (pixel based)
* Layout (flex, grid, abolute) 
* Constraints (auto resizing)
* Many styling tools 
  * background (support resizing tool)
  * font & text style 
  * gradient (multiple background images )
  * border & radius 
  * filter 
  * clip-path (support svg path )
  * box-shadows  (multiple)
  * text-shadows (multiple)


### Animation 
* Transition 
* Animation & Keyframes 
* Support cubic-bezier editor 

### Code & Share 
* Support code viewer  
* Support png & svg download  

### Drawing 
* Support mini path editor 


### Theming  
* dark
* light


# Development 

```
git clone https://github.com/easylogic/editor.git
cd editor
npm install 
npm run dev 
``` 

# build 

```
npm run build 
```

# Open Editor 

please refer to src/index.html, src/index.js 

```html
  <body>
    <div id="app"></div>    
  </body>
```

```js

import EasyLogic from "@easylogic/editor";

var app = new EasyLogic.createDesignEditor({
  container: document.getElementById('app'),
  data: {
    projects: [{
      itemType: 'project', 
      layers: [
        {itemType: 'rect', x: 0, y: 0, width: 100, height: 100, 'background-color': 'red'},
        {itemType: 'rect', x: 20, y: 20, width: 100, height: 100, 'background-color': 'green'},
        {itemType: 'rect', x: 40, y: 40, width: 100, height: 100, 'background-color': 'blue'}
      ]
    }],
  },
  plugins: [
    // define plugin 
    function (editor) {
      console.log(editor);
    }
  ]
});

```

# Configs 

You can set some useful configs.

```js
var app = new EasyLogic.createDesignEditor({
  container: document.getElementById('app'),
  config: {
    "style.canvas.backgroud.color": "#FDC111"
    "show.ruler": false,
    "show.left.panel": false,
    "show.right.panel": false
  },
})
```

# Plugins 

please refer to  [MakeEditor](./system/MAKE.ko.md)


# Thanks to 

* icon - https://material.io/resources/icons/?style=baseline


# License : MIT
