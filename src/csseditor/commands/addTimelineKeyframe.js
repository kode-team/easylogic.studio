import _currentArtboard from "./_currentArtBoard";

export default {
    command: 'addTimelineKeyframe',
    execute: function (editor, options = {timing : 'linear'}) {
        _currentArtboard(editor, (artboard, timeline) => {
            var item = artboard.searchById(options.layerId);

            var keyframeObj = {
                layerId: options.layerId,
                property: options.property,
                time: options.time,
                value: item[options.property] + "",
                timing: options.timing,
                editor: options.editor
            }
            var obj = artboard.addTimelineKeyframe(keyframeObj);
            editor.timeline.select(obj);            
            editor.emit('refreshTimeline');
            editor.emit('refreshSelectedOffset');
        })        
    }
}