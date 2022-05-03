# 설정 (Config)

에디터는 여러가지 Config 를 가질 수 있습니다. 


## Config 정의 

src/plugins/default-configs/configs/config_list/ 에 정의된 config 는 자동등록 됩니다. 

```js
export default {
    key: "snap.grid",
    defaultValue: 50,
    title: "Snap grid size between objects",
    description: "Set snap grid size",
    type: "number"
}
```

* key: config key 이름 
* defaultValue: config 에 값이 없을 때 사용하는 기본 값 
* title: config 제목 
* description: config 설명 
* type: 자료형  (TODO: enum 타입 등 몇가지 타입 추가 필요)

## Config 사용 

```js

// editor 에서 사용 
const bodyEvent = editor.context.config.get('bodyEvent');

// ui 에서 사용 
const bodyEvent = this.$config.get('bodyEvent');


```

## Config 값 설정 

```js
this.$config.set('bodyEvent', { x: 10, y: 10 })
```

## Config 변경 이벤트 받기 

config 를 설정하게 되면 UI 에서 이벤트를 받을 수 있다. 

```js

class MyElement extends EditorElement {

    // config 변경 이벤트 설정 
    [CONFIG('bodyEvent')]() {
        console.log(this.$config.get('bodyEvent'))
    }
}

```