export default {
    command : 'group.item',
    execute: function (editor) {

        if (editor.selection.length === 0) return; 

        const artboard = editor.selection.currentArtboard

        if (artboard) {

            // no 캐쉬 
            artboard.generateListNumber()

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
    

            // 선택 영역 스크린 사이트 구하기
            const rect = editor.selection.allRect;

            // 객체 생성             
            const groupLayer = editor.createItem({
                itemType: 'rect',
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            })

            // 마지막, 레이어 상으로는 가장 위 레이어 옆으로 추가 
            list[0].item.add(groupLayer, 'after');

            if (rect.x) { groupLayer.setScreenX(rect.x.value); }
            if (rect.y) { groupLayer.setScreenY(rect.y.value); }

            // selected 된 items 을 모두 group Layer 에 추가 
            list.forEach(({ item }) => {
                groupLayer.add(item); 
            })

            editor.selection.select(groupLayer);

            editor.emit('refreshArtboard')
        }

    }
}