# 모델 

에디터는 렌더링 영역에 표시될 기본 Model 을 가지고 있습니다.  

기본 모델에 대한 리스트는  src/elf/editor/model/* 에서 확인 하실 수 있습니다. 

에디터는 현재 아래와 같은 형태로 모델을 관리합니다. 


# 구조 

모델은 아래와 같은 상속 구조를 가집니다. 

BaseModel - 모든 모델의 베이스 클래스, 데이타 저장, 로드, 하위 레이어 관리 
+ BaseAssetModel - 개별 그리기 객체가 가져야 하는 기본 에셋 관리 
  + MovableModel  - 화면상에 그려질 좌표와 레이아웃의 위치 관리 
    + GroupModel - layout 상태 관리 
      + DomModel - CSS 로 표현되는 여러가지 속성 관리 
        

# 모델 추가 

모델은 에디터에서 확장(plugin)을 통해서 추가할 수 있습니다. 

아래 코드는 `iframe` 이라는 itemType 을 가지고 있는 모델을 추가합니다. 

```js

    class IFrameLayer extends Component { 
        ....
    }

    editor.registerComponent('iframe', IFrameLayer);
```


# 기본 사용 모델 

## Project 

하나의 프로젝트를 관리하는 최상위 모델입니다.  하위 렌더링 모델 과 프로젝트에서만 사용되는 여러가지 에셋을 관리합니다. 

## Artboard 

하나의 페이지 단위의 표현 영역입니다. 

## RectLayer

CSS 기반의 사각형을 그립니다. clip-path, background-image, box-shadow 등 여러가지 속성을 가집니다. 

## CircleLayer 

기본적으로 RectLayer 와 같고 border-radius 가 항상 100% 인 것만 다릅니다. 

# ImageLayer 

이미지 태그를 사용해서 이미지를 표현합니다. 


# TextLayer 

텍스트를 표현합니다. 

# TemplateLayer  

복잡한 svg, html 태그를 모아서 렌더링 할 수 있는 레이어 입니다. 내부적으로는 템플릿 형태로 속성을 바로 관리할 수 있습니다. 


# SVGPathItem 

svg path 를 그려주는 레이어입니다. 

# SVGPolygonItem 

svg 기반의 다각형을 그려주는 레이어입니다. 

# SVGStarItem 

svg 기반의 star 를 그려주는 레이어입니다. 

# SVGTextPathItem 

svg 기반의 textpath 를 그려주는 레이어입니다. 기본적으로  path 속성을 가지고 있어서 path 에디터를 활용할 수 있습니다. 

# BooleanPathItem 

svg 기반의 boolean path 를 구현합니다.  boolean path 기능 자체는 skia 엔진에서 분리된 pathkit.wasm 을 사용해서 구현되어져 있습니다. 



이상으로 기본 모델에 대해서 알아보았습니다. 

모델을 확장하기 위한 자세한 사항은 src/plugins/default-items/index.js  를 참고하세요. 