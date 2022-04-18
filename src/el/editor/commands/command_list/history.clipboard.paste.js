import _doForceRefreshSelection from "./_doForceRefreshSelection";
import { ClipboardActionType } from 'el/editor/types/editor';

export default {
    command: 'history.clipboard.paste',
    description: 'paste in clipboard ',
    description_ko: [
        '클립보드 데이타를 기준으로 paste 를 적용한다. '
    ],
    execute: async function (editor, message, clipboardData = undefined, hasHistory = true) {

        const data = clipboardData || editor.clipboard.last; // 마지막 클립보드 입력 

        if (data.type == ClipboardActionType.COPY) {
            // copy 일 경우 히스토리 적용방법 
            // 1. data 에서 ids 를 가져온다.
            // 2. ids 를 기준으로 item 의 data 를 만든다. (이때 json renderer 를 사용한다.)
            // 2.1 json renderer 로 생성된 객체는 world 좌표만 가진다. 
            // 3. editor.createModel(data) 을 통해 새로운 item 을 생성한다.
            // 4. 10, 10 을 absolute 기준으로 이동한다. 
            // 5. model 을 부모에 추가한다. 
            // 6. 부모 정보를 수집한다. 
            // 7. 부모의 children 의 변경점을 수집한다. 
            // 8. 자식,부모 정보를 setAttributeForMulti 로 업데이트 한다. 
            // 9. history 에 추가한다. 

            const ids = data.data;

            // 1. copy 리스트 구하기                 
            const items = await editor.json.renderAll(ids.map(it => editor.get(it)));

            const newIds = []
            const length = items.length;

            const itemList = {};
            const parentList = {};

            let updateData = {}


            // 2. 개별 모델 생성하기 
            items.forEach(itemJSON => {

                // copy 레퍼런스 구하기 
                const referenceId = itemJSON.referenceId;
                const sourceItem = editor.get(referenceId);

                // 부모 정보 구하기 
                parentList[sourceItem.parentId] = sourceItem.parent;

                // copy 레퍼런스가 있으면 그것을 기준으로 새로운 레퍼런스 생성하기
                const model = editor.createModel(itemJSON)

                // 동일한 이름이 존재하면 이름 바꾸기 
                model.renameWithCount()

                console.log(model.attrs('x', 'y'))

                // 10, 10 기본 이동 
                model.absoluteMove([10, 10, 0])

                if (length === 1) {
                    // 하나 일 때는 sourceItem 옆으로 생성하기 
                    sourceItem.insertBefore(model);
                } else {
                    sourceItem.insertAfter(model);
                    // // 원본 부모의 마지막에 생성하기                        
                    // sourceItem.parent.appendChild(model);
                }


                // 최종 생성된 model 의 id 를 수집하기
                newIds.push(model.id)

                // 모든 정보를 가지고 오기 
                itemList[model.id] = itemJSON
                updateData[model.id] = model.json
            })

            // 부모 변경 상태 저장 
            Object.values(parentList).forEach(parent => {
                updateData = {
                    ...updateData,
                    ...parent.attrsWithId('children')
                }
            })

            // history, 추가에 대한 newIds 를  저장하고, undo 할 때는 newIds 를 삭제해준다. 
            // 수집된 커맨드 동시에 실행
            editor.emit('setAttributeForMulti', updateData);

            editor.nextTick(() => {
                // 새로 생성된 model 의 id 를 선택하기 
                editor.selection.select(...newIds);

                // history 체크 할 때만 히스토리로 저장 
                if (hasHistory) {

                    editor.history.add(message, this, {
                        currentValues: [
                            data
                        ],
                        undoValues: [
                            newIds,
                            editor.selection.ids,
                        ],
                    })
                }


                // editor.selection.reselect();
                editor.history.saveSelection()
            })
        }
    },

    // redo 는 마지막에 했던  clipboard data 를 다시 실행한다. 
    redo: function (editor, { currentValues: [data] }) {
        editor.emit('history.clipboard.paste', 'paste', data, false)
    },

    /**
     * 새로 생성된 newIds 를 기준으로 아이템을 다시 삭제한다. 
     * 
     * @param {*} editor 
     * @param {{undoValues: [ newIds ]}}} param1 
     */
    undo: function (editor, { currentValues: [data], undoValues: [newIds, selectedIds] }) {

        if (data.type === ClipboardActionType.COPY) {

            const parentList = {};

            // 현재 존재하는 item 을 삭제 한다. 
            // 삭제 하는 시점에 부모 정보를 먼저 수집한다. 
            newIds.forEach(id => {
                const item = editor.get(id);

                // 부모 정보 구하기
                parentList[item.parentId] = item.parent;

                if (item) {
                    item.remove();
                }

            })

            let updateData = {}
            // 자식들이 삭제가 되었으므로 갱신될 부모의 children 정보를 수집한다. 
            Object.values(parentList).forEach(parent => {
                updateData = {
                    ...updateData,
                    ...parent.attrsWithId('children')
                }
            })

            // 이전 ids 를 선택해준다. 
            editor.selection.select(...selectedIds)

            // 부모를 다시 그린다. 
            editor.emit('setAttributeForMulti', updateData);


        }
    }
}