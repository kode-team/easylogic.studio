import _currentArtboard from "./_currentArtBoard";

export default {
    command: 'removeAnimationItem',
    execute: function (editor, id) {
        _currentArtboard(editor, (artboard, timeline) => {
            artboard.removeAnimation(id);

            editor.timeline.empty();
            editor.emit('refreshTimeline')
            editor.emit('removeAnimation');
        })
    }
}