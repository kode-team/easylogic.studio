# UI 만들기 

에디터에 적용되어 있는  UI 시스템에에 간략하게 설명합니다. 

UI 는 기본적으로 [Sapa](https://sapa.easylogic.studio/) 를 사용하고 있습니다. 

(한글 문서는 [여기](https://velog.io/@easylogic/%EA%B0%9C%EB%B0%9C%EC%9E%90-UI-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC%EB%A5%BC-%EB%A7%8C%EB%93%A4%EB%8B%A4)를 참고하세요.)


# UI 정의 

에디터에서는 Sapa의 UIElement 를 확장한 EditorElement 를 사용합니다.  기본 방법을 Sapa 와 같고  몇가지 이벤트 시스템과 에디터 객체와 매니저를 다루는 방법이  추가된게 다릅니다. 

```js
class MyElement extends EditorElement {
    template () {
        return `<div>my element</div>`
    }
}

```

## DOM 이벤트 정의 

```js
class MyElement extends EditorElement {
    template () {
        return `<div>my element</div>`
    }

    [CLICK('$el')] () {
        console.log('click is fired');
    }
}
```

## DOM 이벤트 필터링 

DOM 이벤트는 몇가지 필터링 기능을 제공합니다. 필터링은 해당 조건이 참이어야함 이벤트를 실행합니다. ([여기](https://sapa.easylogic.studio/#alt)를 참고해주세요.)

```js
class MyElement extends EditorElement {
    template () {
        return `<div>my element</div>`
    }

    [CLICK('$el') + ALT] () {
        console.log('click is fired with alt key');
    }
}
```


## 다른 컴포넌트에서 메세지 받기 

```js
class MyElement extends EditorElement {
    template () {
        return `<div>my element</div>`
    }

    [SUBSCRIBE(REFRESH_SELECTION)] () {
        console.log('Some layer is selected', this.$context.selection.current);
    }
}

```

## 마우스 이벤트 제어하기 

드래그가 많은 에디터 특성상 마우스 이벤트를 쉽게 제어할 수 있는 방법을 제공합니다. 

```js

class MyElement extends EditorElement {

    [POINTERSTART('$el') + MOVE('moveCursor') + END('moveEndCursor')] (e) {
        // initialize pointerstart event 
    }

    moveCursor(dx, dy) {
        console.log(dx, dy);
    }

    moveEndCursor(dx, dy) {
        if (dx === 0 && dy === 0) {
            console.log('this is not moved');
        }
    }
}

```

