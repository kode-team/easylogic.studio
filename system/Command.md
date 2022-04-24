# Command 

에디터는 여러가지 Command 를 가지고 통신을 할 수 있습니다. 


## 리소스 

에디터에서 사용되는 커맨드 목록은 아래 위치를 참고하세요. 

src/elf/editor/commands/command_list

## 커맨드 정의 

커맨드는 아래와 같이 몇가지 키워드로 정의됩니다. 

```js
export default {
    command: 'zoom.in',
    execute: function (editor) {
        editor.viewport.zoomIn(0.02);

    }
}

```

### 히스토리를 가지는 커맨드 

커맨드는 undo, redo 함수를 재정의 함으로써  history 형태의 구조를 설계할 수 있습니다.  


```js
export default {
    command : 'history.setAttributeForMulti',
    execute: function (editor, message, multiAttrs = {}, context = {origin: '*'}) {

        editor.emit('setAttributeForMulti', multiAttrs, context)

        editor.history.add(message, this, {
            currentValues: [multiAttrs],
            undoValues: editor.history.getUndoValuesForMulti(multiAttrs)
        })

        editor.nextTick(() =>  {
          editor.history.saveSelection()  
        })        
    },

    redo: function (editor, {currentValues}) {
        editor.emit('setAttributeForMulti', ...currentValues)
        editor.nextTick(() => {
            editor.selection.reselect();            
            editor.emit('refreshAll');         
        })

    },

    undo: function (editor, { undoValues }) {
        const ids = Object.keys(undoValues)
        const items = editor.selection.itemsByIds(ids)

        items.forEach(item => {
            item.reset(undoValues[item.id]);
        })
        editor.selection.reselect();

        editor.nextTick(() => {
            editor.emit('refreshAll');
        })
    }
}
```

# 커맨드 실행 

editor 객체의 emit 메소드를 통해서 특정 커맨드를 실행합니다. 


```js

// command 내에서 실행 
editor.emit('zoom.in')

// UI 에서 실행 

this.$editor.emit('zoom.in');

```

