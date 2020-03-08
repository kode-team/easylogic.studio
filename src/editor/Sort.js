export default class Sort {

    static getContainer (editor) {
        return editor.selection.items.length === 1 ? editor.selection.currentArtboard : editor.selection.allRect;
    }

    static left (editor) {

        var x =  Sort.getContainer(editor).screenX.value

        editor.selection.each(item => {
            item.setScreenX(x);
        })

        editor.selection.setRectCache();
    }

    static top (editor) {
        var y =  Sort.getContainer(editor).screenY.value

        editor.selection.each(item => {
            item.setScreenY(y);
        })

        editor.selection.setRectCache();
    }

    static center (editor) {
        var container = Sort.getContainer(editor)        
        var x = container.screenX.value + container.width.value / 2; 

        editor.selection.each(item => {
            item.setScreenXCenter(x);
        })

        editor.selection.setRectCache();
    }

    static middle (editor) {
        var container = Sort.getContainer(editor)        
        var y = container.screenY.value + container.height.value / 2;         

        editor.selection.each(item => {
            item.setScreenYMiddle(y);
        })

        editor.selection.setRectCache();
    }    

    static right (editor) {
        var container = Sort.getContainer(editor)        
        var x2 = container.screenX2.value;         

        editor.selection.each(item => {
            item.setScreenX2(x2);
        })

        editor.selection.setRectCache();
    } 


    static bottom (editor) {
        var container = Sort.getContainer(editor)        
        var y2 = container.screenY2.value;         

        editor.selection.each(item => {
            item.setScreenY2(y2);
        })

        editor.selection.setRectCache();
    }     

    static sameWidth (editor) {

        var len = editor.selection.items.length ;

        if (len == 1) {
            // artboard 랑 크기를 맞출지 고민해보자. 
        } else if (len > 1) {
            editor.selection.each(item => {
                item.setScreenX(editor.selection.allRect.x.value);
                item.width.set( editor.selection.allRect.width.value);
            })

            editor.selection.setRectCache();            
        }


    }

    static sameHeight (editor) {

        var len = editor.selection.items.length ;

        if (len == 1) {
            // artboard 랑 크기를 맞출지 고민해보자. 
        } else if (len > 1) {
            editor.selection.each(item => {
                item.setScreenY(editor.selection.allRect.y.value);
                item.height.set( editor.selection.allRect.height.value);
            })

            editor.selection.setRectCache();
        }
    }
}