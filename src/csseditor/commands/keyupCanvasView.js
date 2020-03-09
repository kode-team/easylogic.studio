function getAddCommand (key) {
    switch(key) {
    case '1': return ['addComponentType', 'rect'];
    case '2': return ['addComponentType', 'circle'];
    case '3': return ['addComponentType', 'text'];
    case '4': return ['addComponentType', 'image'];
    case '5': return ['addComponentType', 'cube'];
    case '6': return ['addComponentType', 'svgrect'];
    case '7': return ['addPath'];
    case '8': return ['addPolygon'];
    case '9': return ['addStar'];
    }
}


export default {
    command: 'keyupCanvasView',
    execute: function (editor, key) {
        editor.emit(...getAddCommand(key));
    }
}