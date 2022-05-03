# 에디터 레이아웃 

에디터는 크게 4가지 영역으로 이루어져있습니다. 

## Header 

Dropdown 형태의 툴바를 렌더링 하는 영역입니다. 

## Left Panel 

left 영역에 배치되는 Panel 입니다. 
현재는 아래와 같은 기능이 적용되어 있습니다. 

* LayerTree 
* Asset 
* Custom Component 

## Right 

right 영역에 배치되는 Panel 입니다. 
현재는 아래와 같은 기능이 적용되어 있습니다. 

* Inspector 

## Canvas 

에디터 가운데 위치하는 영역입니다. 렌더링 되는 모든 형식은 이 안에서 이루어집니다. 


# Inject Manager 

영역별 컴포넌트 삽입하기 

몇가지 UI 레이아웃에서는 해당 영역으로 바로 UI 를 삽입 할 수 있는 기능이 있습니다. 

```js
editor.registerUI('canvas.view', {
    TestView: class extends EditorElement {

    }
}, orderNumber = 1000)

orderNumber 를 지정하게 되면  오름차순으로 정렬이 됩니다. 

```

삽입 가능한 영역 리스트는 아래와 같습니다. 

* popup - 전체화면 영역에서 표시할 컴포넌트 
* inspector.tab.style - inspector 의 style 탭 , 주로 property 설정이 올라감 
* inspector.tab.transition - inspector 의 transition 탭,  액션에 대한 설정이 올라감 
* inspector.tab.code - inspector 의 code 탭, code를 보여주는 view 적용 
* asset - 에셋 관련된 뷰 
* library - 라이브러리 관련된 뷰 
* toolbar.right - toolbar 의 right 영역 
* canvas.view - canvas 영역에 추가될 뷰 
* page.subeditor.view 
* page.tools

# ContextMenu 

컨텍스트 메뉴는 아래와 같이 2가지 방식으로 데이타를 가지고 와서 사용할 수 있다. 


```js
// 메뉴 리스트 등록
editor.registerMenu("context.menu.layer", [
    { type: 'button', title: 'yellow', action: (editor) => {
        console.log('emit')
        editor.emit(UPDATE_VIEWPORT);
    } }
])

editor.emit('openContextMenu', {
    x: e.clientX,
    y: e.clientY,
    // 동적으로 메뉴 설정 
    items: [
        .... menus
    ],
    // 또는  설정된 메뉴를 가지고 온다. 
    target: "context.menu.layer",

})

```

메뉴 시스템에 대한 자세한 이야기는 [메뉴시스템](./MenuSystem.md) 에서 확인 할 수 있습니다. 

# 확장 

에디터의 레이아웃은 현재 하나만 구현되어져 있습니다. 

src/apps/designeditor 

현재는 design editor 용 하나만 구현되어져 있습니다. 하지만 필요에 따라 designeditor 와 다른 레이아웃을 만들 수 있습니다. 

