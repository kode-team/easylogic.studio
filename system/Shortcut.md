# 단축키 (Shortcut)

에디터는 단축키 시스템을 지원합니다. 

## 단축키 위치 

아래 디렉토리를 참고하세요.

src/elf/editor/shortcuts/shortcuts_list/

## 단축키 정의 

* category: 단축키를 표현하는 그룹입니다. 
* key: 실제 바인딩 될 키 리스트 입니다. 키의 구분은 `+` 로 합니다. 
* command : 단축키가 실행될 때 같이 실행될 command 입니다. 
* description : 단축키가 어떤 수행을 하는지 설명합니다. 
* when : 에디터가 특정 모드 일 때 단축키를 수행하도록 지정합니다. 

```js
export default {
    category: 'View',        
    key: 'Equal',
    command: 'zoom.in',
    description: 'zoom in',
    when: 'CanvasView'
}
```

## 외부에서 단축키 정의 

플러그인에서 단축키를 정의할 수 있습니다. 

```js

editor.registerShortcut({
    category: 'View',        
    key: 'Equal',
    command: 'zoom.in',
    description: 'zoom in',
    when: 'CanvasView'
})

```