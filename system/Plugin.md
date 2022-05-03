# 플러그인

에디터는 기본적으로 플러그인 형태로 동작합니다.

## 플러그인 정의

플러그인 기본적으로 하나의 함수로 정의를 합니다.

함수는 [Editor](./Editor.md) 객체를 받습니다.

```js
import {createDesignEditor} from "apps";

function startEditor() {
  return createDesignEditor({
    container: document.getElementById("app"),
    plugins: [
      function (editor) {
        // this is plugin
      },
    ],
  });
}
```

## Editor 객체를 통해서 확장하기

```js
// Model 확장
editor.registerComponent("iframe", IFrameLayer);
// or 
editor.registerItem("rect", RectLayer);

// Inspector 확장
editor.registerUI("inspector.tab.style", {
  IFrameProperty,
});

// Renderer 정의
editor.registerRenderer("html", "iframe", new HTMLIFrameRender());

// UI 정의, sapa 로 만들어진 UI 
editor.registerElement({
  ColorMatrixEditor,
  FuncFilterEditor,
  SVGFilterSelectEditor,
  SVGFilterEditor,
});

// ObjectProperty 를 통해서 json 기반의 속성 편집기 정의
// 정해진 영역(inspector.tab.style) 에 속성 편집기를 표현한다.
editor.registerUI("inspector.tab.style", {
  SVGItemProperty: ObjectProperty.create({
    title: editor.$i18n("svg.item.property.title"),
    editableProperty: "svg-item", // itemType 이 맞으면 속성 편집기가 열림
    preventUpdate: true, // 마우스를 드래그 하는 동안은 업데이트 하지 않음.
  }),
});

// svg-item 이 모델의 itemType 일 때 아래의 inspector 를 실행
editor.registerInspector("svg-item", (current) => {
  return [
    {
      key: "edit",  // key: 응답 받을 데이타의 key
      editor: "Button", // UI 타입
      editorOptions: {  // UI 속성
        text: "Edit",
        action: ["open.editor", current],   // 클릭 했을 때 실행될 command
      },
    },
    ...
  ];
});

// 팝업 정의
editor.registerUI('popup', {
    SVGFilterPopup
})

// alias 지정 
editor.registerAlias({
    'toggle-checkbox': 'ToggleCheckBox',
    'toggle-button': 'ToggleButton',
    'button': 'Button',
})

// menu 정의 
editor.registerMenu("toolbar.right", [
  {
    type: "button",
    title: "Layer",
  },
  {
    type: 'dropdown', 
    title: '',
    icon: '',
    selectedKey: () => "yellow",
    items: [
      ....
    ]
  }
])

```


# 플러그인들 

다양한 플러그인 설정은  src/plugins/ 를 참고하세요. 