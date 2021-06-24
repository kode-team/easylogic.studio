# EasyLogic Studio


EasyLogic Studio is built using CSS and SVG to reduce the gap between web design and code. The goal is to have the same point in time between the designer's design and the developer's output.


* manual : https://www.easylogic.studio/docs/getting-started.html
* editor : https://editor.easylogic.studio/
* player: https://editor.easylogic.studio/player.html


This project is [sapa](https://github.com/easylogic/sapa) based. 

# Screen Shot 

<img src='https://www.easylogic.studio/images/editor.png' />


# Features 

### Support Element 

* Rect 
* Circle 
* Text 
* Image 
* Cube 
* Cylinder 
* SVG Path 
* SVG Rect with path 
* SVG Circle with path 
* SVG Text 
* SVG TextPath


### Style

* Alignment 
* Position 
* Size 
* BoxModel 
* Transform 
  * Support transform ui  (rotate X,Y,Z )
* Many styling tools 
  * background
  * font & text style 
  * gradient (multiple background images)
  * border & radius 
  * filter
  * clip-path
  * box-shadows 
  * text-shadows 


### Animation 
* Transition 
* Animation & Keyframes 
* Support cubic-bezier editor 
* Support timeline editor 

### Code & Share 
* Support export to CodePen 
* Support code viewer  
* Support png & svg download  

### Drawing 
* Support mini path and polygon editor 
* Support draw star polygon 

### Assets 
* Color
* Gradient
* SVG Filter 
* Image 


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

# Development - Electron 

```
git clone https://github.com/easylogic/editor.git
cd editor
npm install 
npm install electron 
open terminal (open local web server)
-> npm run dev:electron 
open terminal (run electron)
-> npm run electron 

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
        {itemType: 'rect', x: '0px', y: '0px', width: '100px', height: '100px', 'background-color': 'red'},
        {itemType: 'rect', x: '20px', y: '20px', width: '100px', height: '100px', 'background-color': 'green'},
        {itemType: 'rect', x: '40px', y: '40px', width: '100px', height: '100px', 'background-color': 'blue'}
      ]
    }],
  },
  plugins: [
    function (editor) {
      console.log(editor);
    }
  ]
});

```

# Data Model  

todo 

# Plugin System 

please refer to src/el/plugins for detail 

```js
export const AREA_CHART_TYPE = 'area-chart';

var app = new EasyLogic.createDesignEditor({
  plugins: [
    function (editor, { Component, MenuItem, LayerRender}) {
      
      // register item (as model)
      editor.registerItem(AREA_CHART_TYPE, class AreaChartLayer extends Component )    

      // register inspector editor 
      editor.registerInspector(AREA_CHART_TYPE, (item) => {
        return [
            'Simple Value Editor Group',
            {
              key: `value`, 
              editor: 'SelectEditor', 
              editorOptions: {
                label: 'Option Value',
                options: item.options
              }, 
              refresh: true, 
              defaultValue: item['value'] 
            },
            {
              key: `value`, 
              editor: 'SimpleEditor', 
              editorOptions: {
                label: 'Simple Value',
              }, 
              refresh: true, 
              defaultValue: item['value'] 
            }
          ]
      })

      // register html renderer 
      editor.registerRenderer('html', AREA_CHART_TYPE, new (class AreaChartHTMLRender extends LayerRender {... }) )    

      // register control ui 
      editor.registElement({ 
          AddAreaChart: class extends MenuItem {},
      })
    }
  ]
})

```

# Define Component (item) 
please refer to src/el/plugins for detail 
```js

```

# Define Renderer (html) 
please refer to src/el/plugins for detail 
```js

```

# Define MenuItem (as UI) 
please refer to src/el/plugins for detail 
```js

```

# Define Inspector (TODO)
please refer to src/el/plugins for detail 
```js
```

# Thanks to 

* icon - https://material.io/resources/icons/?style=baseline


# License : MIT
