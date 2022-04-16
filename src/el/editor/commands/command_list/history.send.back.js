import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command: 'history.send.back',
    description: 'send back',
    execute: function (editor, message, layer = editor.selection.current) {

        // 다음으로 보내기 
        const currentLayer = editor.get(layer);
        const lastValues = currentLayer.hierarchy;        
        const oldParentLayer = currentLayer.parent;

        // 마지막일때 
        // 다음 부모의 첫번째 자식을 선택한다. 
        let currentValues = {}
        if (currentLayer.isFirst()) {
            // NOOP
            return;
        } else {

            currentLayer.parent.sendBack(currentLayer.id);

            currentValues = currentLayer.hierarchy;
        }

        // 마지막을 다시 업데이트 함 
        // 수집된 커맨드 동시에 실행
        editor.emit('setAttributeForMulti', {
            // 현재 객체 정보 변경 
            ...oldParentLayer.attrsWithId('children'),

            ...currentLayer.attrsWithId('x', 'y', 'angle', 'parentId'),
        });   

        editor.nextTick(() => {
            editor.history.add(message, this, {
                currentValues: [currentValues],
                undoValues: [lastValues],
            })      
        })

        editor.nextTick(() =>  {
          editor.history.saveSelection()  
        })        
    },

    redo: function (editor, {currentValues: [newValues], undoValues: [lastValues]}) {


        const currentLayer = editor.get(newValues.id);
        const currentTarget = editor.get(newValues.parentId);

        currentTarget.insertChild(currentLayer, newValues.index);
        currentLayer.reset(newValues.attrs);

        editor.emit('setAttributeForMulti', {
            ...currentLayer.attrsWithId('x', 'y', 'angle', 'parentId'),
            ...currentTarget.attrsWithId('children')
        });
    },

    undo: function (editor, { currentValues: [newValues], undoValues: [lastValues] }) {

        const currentLayer = lastValues;

        const lastLayer = editor.get(currentLayer.id);
        const lastParent = editor.get(currentLayer.parentId);

        // FIXME: prev, next 에 따른 위치를 찾아서 이동해야함 , 그래야 버그 가능성을 줄일 수 있다. 
        const lastIndex = currentLayer.index;

        lastParent.insertChild(lastLayer, lastIndex);

        editor.emit('setAttributeForMulti', {
            ...lastLayer.attrsWithId('x', 'y', 'angle', 'parentId'),
            ...lastParent.attrsWithId('children'),
        });
    }
}