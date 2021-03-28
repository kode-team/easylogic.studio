export default {
    command : 'group.item',
    execute: function (editor) {

        if (editor.selection.length === 0) return; 

        const project = editor.selection.currentProject

        if (project) {

            // no 캐쉬 
            project.generateListNumber()

            // depth 캐쉬 
            const list = editor.selection.map(item => {
                return {depth: item.depth, item }
            })
    
            // no, depth 로 정렬 
            list.sort((a, b) => {
                if (a.depth === b.depth) {
                    return a.no > b.no ? -1 : 1; 
                }
    
                return a.depth > b.depth ? 1 : -1; 
            })

            // 객체 생성             
            const groupLayer = editor.createItem({
                itemType: 'rect',
                ...editor.selection.itemRect
            })

            // 마지막, 레이어 상으로는 가장 위 레이어 옆으로 추가 
            list[0].item.appendAfter(groupLayer);

            // selected 된 items 을 모두 group Layer 에 추가 
            list.forEach(({ item }) => {
                groupLayer.appendChildItem(item); 
            })

            editor.selection.select(groupLayer);

            editor.emit('refreshAll')
        }

    }
}