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
                groupLayer.insertBefore(child);
            })

            editor.selection.select(...layers);
            editor.emit('refreshAll')            
        }

    }
}