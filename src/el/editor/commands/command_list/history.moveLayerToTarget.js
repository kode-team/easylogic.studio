import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command: 'history.moveLayerToTarget',
    description: 'move layer to target in world ',
    execute: function (editor, message, layer, target, dist = [0, 0, 0], targetAction = 'appendChild' ) {

        const currentLayer = editor.get(layer);
        const currentParentLayer = currentLayer.parent;
        const currentTarget = editor.get(target);

        const lastValues = currentLayer.hierachy;

        currentLayer.absoluteMove(dist);

        let currentValues = {}

        if (targetAction === 'appendChild') {
            currentTarget.appendChild(currentLayer);
            currentValues = currentTarget.attrsWithId('children');
        } else if (targetAction === 'appendBefore') {
            currentTarget.appendBefore(currentLayer);
            currentValues = currentTarget.parent.attrsWithId('children');
        } else if (targetAction === 'appendAfter') {
            currentTarget.appendAfter(currentLayer);
            currentValues = currentTarget.parent.attrsWithId('children');
        }

        // 수집된 커맨드 동시에 실행
        editor.emit('setAttributeForMulti', {
            // 현재 객체 정보 변경 
            ...currentLayer.attrsWithId('x', 'y', 'angle'),

            // target item 의 부모 정보 변경 
            ...currentValues,

            // 이전 부모 정보 변경 
            // 이걸 해야 이전 부모의 자식들의 위치를 제대로 맞춰줄 수 있음. 
            ...(currentParentLayer && currentParentLayer.isNot('project') ? currentParentLayer.attrsWithId('children') : {})
        });                

        editor.nextTick(() => {
            editor.history.add(message, this, {
                currentValues: [currentLayer.hierachy],
                undoValues: [lastValues, current.parentId],
            })
            editor.emit('refreshAllCanvas');            
        })

        editor.nextTick(() =>  {
          editor.history.saveSelection()  
        })        
    },

    redo: function (editor, {currentValues: [info]}) {


        const currentLayer = editor.get(info.id);
        const currentTarget = editor.get(info.parentId);

        currentTarget.insertChild(currentLayer, info.index);
        currentLayer.reset(info.attrs);

        editor.emit('setAttributeForMulti', {
            ...currentLayer.attrsWithId('x', 'y', 'angle'),
            ...currentTarget.attrsWithId('children')
        });


        editor.nextTick(() => {
            editor.emit('refreshAllCanvas');
        })
    },

    undo: function (editor, { undoValues: [lastValues, currentParentId] }) {

        const currentLayer = lastValues;

        const lastLayer = editor.get(currentLayer.id);
        const lastParent = editor.get(currentLayer.parentId);
        const currentParent = editor.get(currentParentId);

        // FIXME: prev, next 에 따른 위치를 찾아서 이동해야함 , 그래야 버그 가능성을 줄일 수 있다. 
        const lastIndex = currentLayer.index;

        lastParent.insertChild(lastLayer, lastIndex);
        lastLayer.reset(lastValues.attrs);

        editor.emit('setAttributeForMulti', {
            ...lastLayer.attrsWithId('x', 'y', 'angle'),
            ...lastParent.attrsWithId('children'),
            ...currentParent.attrsWithId('children')
        });

        editor.nextTick(() => {
            editor.emit('refreshAllCanvas');
        })

    }
}