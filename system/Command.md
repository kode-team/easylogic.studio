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
        editor.context.viewport.zoomIn(0.02);

    }
}

```

### 히스토리를 가지는 커맨드 

커맨드는 undo, redo 함수를 재정의 함으로써  history 형태의 구조를 설계할 수 있습니다.  


```js
export default {
    command : 'history.setAttribute',
    execute: function (editor, message, multiAttrs = {}, context = {origin: '*'}) {

        editor.context.commands.emit('setAttribute', multiAttrs, context)

        editor.context.history.add(message, this, {
            currentValues: [multiAttrs],
            undoValues: editor.context.history.getUndoValues(multiAttrs)
        })

        editor.nextTick(() =>  {
          editor.context.history.saveSelection()  
        })        
    },

    redo: function (editor, {currentValues}) {
        editor.context.commands.emit('setAttribute', ...currentValues)
        editor.nextTick(() => {
            editor.context.selection.reselect();            
            editor.emit('refreshAll');         
        })

    },

    undo: function (editor, { undoValues }) {
        const ids = Object.keys(undoValues)
        const items = editor.context.selection.itemsByIds(ids)

        items.forEach(item => {
            item.reset(undoValues[item.id]);
        })
        editor.context.selection.reselect();

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
editor.context.commands.emit('zoom.in')

// UI 에서 실행 

this.$commands.emit('zoom.in');

```

