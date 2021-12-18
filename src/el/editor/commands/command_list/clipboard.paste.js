export default {
    command : 'clipboard.paste',

    execute : async function (editor, event) {

        /** todo : support history */
        if (!editor.clipboard.isEmpty) {

            const data = editor.clipboard.pop();

            if (data.type == 'copy') {
                const ids = data.data;

                // 1. copy 리스트 구하기                 
                const items = await editor.json.renderAll(ids.map(it => editor.get(it)));

                const newIds = []
                const length = items.length;

                // 2. 개별 모델 생성하기 
                items.forEach(itemJSON => {

                    // copy 레퍼런스 구하기 
                    const referenceId = itemJSON.referenceId;
                    const sourceItem = editor.get(referenceId);

                    // copy 레퍼런스가 있으면 그것을 기준으로 새로운 레퍼런스 생성하기
                    const model = editor.createModel(itemJSON)

                    // 동일한 이름이 존재하면 이름 바꾸기 
                    model.renameWithCount()

                    // 10, 10 기본 이동 
                    model.move([10, 10, 0])
                    
                    if (length === 1) {
                        // 하나 일 때는 sourceItem 옆으로 생성하기 
                        sourceItem.appendBefore(model);
                    } else {
                        // 원본 부모의 마지막에 생성하기                        
                        sourceItem.parent.appendChild(model);
                    }
                    

                    // 최종 생성된 model 의 id 를 수집하기
                    newIds.push(model.id)
                })

                // history, 추가에 대한 newIds 를  저장하고, undo 할 때는 newIds 를 삭제해준다. 

                // 새로 생성된 model 의 id 를 선택하기 
                editor.selection.select(...newIds);

                // 전체 갱신에 대한 명령어를 다시 만들어야할 듯 
                editor.emit('refreshAll')                
            }

        } else {
            var text = await navigator.clipboard.readText()

            if (text) {
                editor.emit('convertPasteText', text)
            }            
        }
    }
}