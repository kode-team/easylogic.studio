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
* Support code viewer  
* Support png & svg download  

### Drawing 
* Support mini path editor 

### Assets 
* Color - refer to https://github.com/easylogic/editor-plugin-color
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

# Plugins 

please refer to  https://github.com/easylogic/awesome-easylogic-studio 

# Data Model  

todo 

# Plugin System 

please refer to src/el/plugins for detail 

```js
import {Component, MenuItem, HTMLLayerRender} from '@easylogic/editor';
const AREA_CHART_TYPE = 'area-chart';

var app = new EasyLogic.createDesignEditor({
  plugins: [
    function (editor) {
      
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
      editor.registerRenderer('html', AREA_CHART_TYPE, new (class AreaChartHTMLRender extends HTMLLayerRender {... }) )    

      // register control ui 
      editor.registElement({ 
          AddAreaChart: class extends MenuItem {},
      })
    }
  ]
})

```

# Define Layer (item) 
please refer to src/el/plugins for detail 
```js

export default class SimpleLayer extends Component {

  // set default value 
  getDefaultObject() {
    return super.getDefaultObject({
      itemType: 'simple-layer',
      name: "New Simple",
      options: [1, 2, 3, 4, 5],
      value: 1,
    }); 
  }

  // update data 
  convert(json) {
    json = super.convert(json);

    // To set fixed number always 
    if (typeof json.value !== 'number') {
      json.value = Math.floor(json.value);
    }

    return json; 
  }

  // return clone values 
  toCloneObject() {

    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'options',
      ),
    }
  }

  // wheather layer has children 
  enableHasChildren() {
    return false; 
  }

  // default title 
  getDefaultTitle() {
    return "Simple";
  }

}


```

# Define Renderer (html) 
please refer to src/el/plugins for detail 

A renderer is actually a tool that draws a Layer .

```js
export default class SimpleHTMLRender extends HTMLLayerRender {

  // update rendered layer 
  // you can use dom manipulation library like jquery 
  async update (item, currentElement) {
    
    const $value = currentElement.$('.value-value');

    if ($value.data('value') !== `${item.value}`){
      $value.data('value', item.value);
      $value.text(item.value);
    }
  }

  // initialize layer template 
  // default has domdiff system.
  /**
  * 
  * @param {Item} item 
  */
  render (item) {
    var {id, options, value} = item;

    return /*html*/`
      <div class='element-item simple-layer' data-id="${id}">
        <div class='simple-area' style="width:100%;height:100%;overflow:auto;padding:10px;pointer-events:none;">
          <div class='value-value' data-value='${value}'>${value}</div>
          ${options.map(it => `<div>option ${it}</div>`)}
        </div>
      </div>`
  }

}
```

# Define MenuItem (as UI) 
please refer to src/el/plugins for detail 
```js
function (editor) {
  editor.registerMenuItem('sidebar', { 
    MyElement: class extends MenuItem {

    } 
  });

  editor.registerMenuItem('statusbar.right', { 
    MyElement: class extends MenuItem {

    } 
  });  

```

# Define Inspector (TODO)
please refer to src/el/plugins for detail 
```js
function (editor) {
  editor.registerMenuItem('inspector.tab.style', { 
    MyProperty: class extends BaseProperty {

    } 
  });
}
```

# Import property UI  in area 

```js
function (editor) {
  editor.registerMenuItem('inspector.tab.style', { 
    MyElement: class extends EditorElement
  });
  .....
}

```

### Event List 

* resize.window 
* refreshProjectList
* refreshArtboard
* refreshTimeline
* resizeEditor
* resizeCanvas
* toggleFooterEnd
* keymap.keydown - e, keydown 이벤트 받기 
* keymap.keyup - e , keyup 이벤트 받기 
* moveSelectionToCenter - boolean, viewport 의 중앙으로 보내기  
* refreshCursor - string, 캔버스 커서 설정, svg 이미지 사용 가능 
* recoverCursor - 'auto', 캔버스 커서 복구 
* addStatusBarMessage - string , statusbar 메세지 설정하기 
* startGesture - viewport 드래그 시작 
* endGesture - viewport 드래그 종료 
* refreshSelectionTool - selection tool 다시 그리기 
* history.refreshSelection - selection 변경 후 history 에 입력 
* removeGuideLine - 가이드 라인 삭제 
* refreshContent - 
* refreshLayerTreeView - LayerTreeView 변경 
* refreshSelectionStyleView - 선택된 레이어 style 변경 
* refreshRect - x, y, width, height, transform, transform-origin 이 변경 될 때 
* updateViewport - viewport 수치가 변경 됐을 때 
* bodypanel.toggle.fullscreen - fullscreen 적용 
* newComponent - type, {}, selected,  새로운 컴포넌트 추가 
* change.mode.view - 현재 ViewMode 변경 
* udpateImage - 이미지 컴포넌트 추가 
* updateVideo - 비디오 컴포넌트 추가 
* refreshAll - 모든 객체 다시 렌더링 
* refreshAllCanvas - Canvas 영역만 다시 렌더링 
* savePNG - string, PNG 로 저장 ,외부 메세지로 전달 
* load.json - project[], 프로젝트 리스트  로드 
* dropImageUrl - url 로 이미지 추가 하기 
* setAttributeForMulti - 여러개의 객체 동시 속성 설정하기 
* showPathEditor - path editor 열기 
* addBackgroundColor - color, id  ,  백그라운드 색상 설정 
* addBackgroundImageGradient - gradient string, id , 백그라운드 gradient 이미지 추가 
* addBackgroundImagePattern - pattern string, id, 백그라운드 pattern 이미지 추가 
* addArtBoard - data, center , 아트보드 추가 
* addImage - obj, 이미지 추가 
* updateResource - file 추가 
* moveToCenter - 특정 객체영역을 viewport 가운데로 유지 
* noti - alert, title, description ,  notification 띄우기 
* deleteSegment -  path 편집 시 segment 삭제 
* moveSegment - path 편집시 segment 이동 
* refreshElement - 특정 item 다시 렌더링 
* changed.locale - locale 변경 이후 
* moveLayer - dx, dy,  선택한 layer 움직이기 
* moveLayerForItems - 
* changeTheme - 테마 변경 
* refreshHistory -  history 가 변경 되었을 때 메세지 
* changeHoverItem - hover 된 아이템이 변경 되었을 때 메세지 
* addLayerView - type, 특정 타입으로 드래그 영역 이후에 위치와 크기를 가진 상태로 추가 할 때 
* sort.bottom - 선택한 레이어들 아래 기준 정렬 
* sort.center - 선택한 레이어들 가운데(수평, 왼쪽, 오른쪽) 기준 정렬 
* sort.right - 오른쪽 기준으로 정렬 
* sort.top - 위쪽 기준으로 정렬
* same.width - 같은 넓이로 만들기 
* same.height - 같은 높이로 만들기 
* open.projects - project 리스트 열기 
* saveJSON - localStorage 에 json 으로 저장하기
* addProject - project 추가 
* refreshAllSelectProject - 모든 선택된 project 다시 렌더링 
* refreshSVGArea - svgfilter 등 글로벌하게 사용되는 svg 리소스 갱신 
* setEditorLayout - layout 변경 
* switchTheme - theme, theme 변경 
* lastUpdateColor- 마지막으로 컬러가 수정되었을때 
* downloadSVG - svg 다운로드 할 때 
* downloadPNG - png 다운로드 할 때 
* refreshAllElementBoundSize - layout 이 변경되어 실제 위치를 미리 캐슁할 때 
* 


### Support area 
* inspector.tab.style 
* inspector.tab.text 
* inspector.tab.transition 
* inspector.tab.code
* inspector.tab.history
* inspector.tab { value, icon, title, loadElements: [  'XXXX' ] } 
* leftbar.tab { value, icon, title, loadElements: [  'XXXX' ] } 
* library 
* asset
* sidebar
* search 
* statusbar.right
* statusbar.left 
* toolbar.left
* toolbar.right 

If there is an area in the editor you would like to expand, please let me know.

### Event 

```js
editor.on('getChangeValue', function(id, value) {
  console.log(id, value);
}) 
```

### API 

# save json to localStorage 

```js
this.$editor.emit('saveJSON');
```

#### Get Position 
```js
// e: MouseEvent 
const worldPosition = this.$viewport.getWorldPosition(e);  // return vec3 

// 
const screenPosition = this.$viewport.applyVertex(newMousePoint); // return vec3 
```

# Thanks to 

* icon - https://material.io/resources/icons/?style=baseline


# License : MIT
