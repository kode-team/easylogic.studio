export default {
    command : 'ungroup.item',
    execute: function (editor) {

        if (editor.selection.length === 0) return; 

        const current = editor.selection.current;

        if (current) {

            let groupLayer = current;

            do {
                if (groupLayer.is('artboard')) {
                    groupLayer = undefined;
                    break;
                }
                if (groupLayer.isGroup) break; 
                groupLayer = groupLayer.parent;
            } while (true);

            let lastChild = groupLayer;  
            [...groupLayer.layers].forEach(child => {
                lastChild.add(child, 'after');
                lastChild = child; 
            })
            groupLayer.remove();

            editor.selection.empty();
            editor.emit('refreshArtboard')            
        }

    }
}