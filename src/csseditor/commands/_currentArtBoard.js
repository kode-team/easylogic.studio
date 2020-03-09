export default function _currentArtboard (editor, callback) {
    var artboard = editor.selection.currentArtboard;

    if (artboard) {
        var timeline = artboard.getSelectedTimeline();

        callback && callback (artboard, timeline)
    }

}