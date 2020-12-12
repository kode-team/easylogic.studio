export default {
    command : 'ungroup.item',
    execute: function (editor) {

        if (editor.selection.length === 0) return; 

        const current = editor.selection.current;

        if (current) {

            let groupLayer = current;
            let layers = [...groupLayer.layers];

            layers.reverse();

            layers.forEach(child => {
                groupLayer.appendAfter(child);
            })

            editor.selection.selection(...layers);
            editor.emit('refreshAll')            
        }

    }
}