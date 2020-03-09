import _refreshSelection from "./_refreshSelection";

const createItem = (editor, obj) => {

    obj.layers = obj.layers.map(it => {
        return createItem(editor, it);
    })

    return editor.components.createComponent(obj.itemType, obj);
}


export default {
    command: 'loadJSON', 
    execute: function (editor, json) {

        json = json || editor.loadResource('projects', []);

        var projects = json.map(p => createItem(editor, p))

        projects.forEach(p => {
            p.artboards.forEach(artboard => {
                artboard.selectTimeline()
            })
        })

        if (projects.length) {
            var project = projects[0]
            editor.selection.selectProject(project)
            if (project.artboards.length) {
                var artboard = project.artboards[0]
                editor.selection.selectArtboard(artboard)

                if (artboard.layers.length) {
                    editor.selection.select(artboard.layers[0])
                } else {
                    editor.selection.select(artboard);
                }
            }
        }


        editor.load(projects);
        _refreshSelection(editor)
    }
}