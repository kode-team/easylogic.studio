import _currentArtboard from "./_currentArtBoard"

export default {
    command: 'addTimelineCurrentProperty',
    execute: function (editor, options = {timing: 'linear'}) {

        _currentArtboard(editor, (artboard, timeline) => {
            var list = []
            editor.selection.each(item => {

                var keyframeObj = {
                    layerId: item.id,
                    property: options.property, 
                    value: item[options.property] + "", 
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
            editor.trigger('refreshSelectedOffset');
        })        
    }
}