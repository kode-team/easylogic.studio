import _refreshSelection from "./_refreshSelection";

export default {
    command : 'arrowKeydownCanvasView',
    execute: function (editor, key, isAlt = false, isShift = false) {
        var dx = 0;
        var dy = 0; 
        var t = 1; 

        if (isAlt) {
            t = 5;
        } else if (isShift) {
            t = 10; 
        }

        switch(key) {
        case 'ArrowDown': dy = 1; break; 
        case 'ArrowUp': dy = -1; break; 
        case 'ArrowLeft': dx = -1; break; 
        case 'ArrowRight': dx = 1; break; 
        }

        editor.selection.move(dx * t, dy * t); 
        editor.emit('refresh')

        _refreshSelection(editor, true);
    }
}