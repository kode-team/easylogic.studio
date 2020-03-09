import _currentArtboard from "./_currentArtBoard"
import { isArray } from "../../util/functions/func"

export default {
    command: 'addTimelineProperty',
    execute:  function (editor, layerList, options = {timing: 'linear'}) {
        _currentArtboard(editor, (artboard, timeline) => {

            if (isArray(layerList) === false) {
                layerList = [layerList]
            }
    
            var list = []  
            layerList.forEach(layerId => {
                var keyframeObj = { 
                    layerId: layerId, 
                    property: options.property, 
                    value: options.value + "", 
                    timing: options.timing,
                    editor: options.editor
                }
                var obj = artboard.addTimelineKeyframe(keyframeObj);

                if (obj) {
                    list.push(obj);
                }
            })

            editor.timeline.select(...list);

            editor.emit('refreshTimeline');
            editor.emit('refreshSelectedOffset');
        }) 
        
    }
}