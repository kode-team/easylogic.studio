export default function _currentProject (editor, callback) {
    var project = editor.selection.currentProject;

    if (project) {
        var timeline = project.getSelectedTimeline();

        callback && callback (project, timeline)
    }

}