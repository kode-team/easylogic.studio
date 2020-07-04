import _refreshSelection from "./_refreshSelection";

const createItem = (editor, obj) => {

    obj.layers = obj.layers.map(it => {
        return createItem(editor, it);
    })

    return editor.components.createComponent(obj.itemType, obj);
}


export default {
    command: 'load.json', 
    execute: function (editor, json) {

        json = json || editor.loadResource('projects', []);

        // 값이 아무것도 없을 때 project 를 설정해준다. 
        if (json.length === 0) {
            json = [{itemType: 'project', layers: []}]
        }

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

            editor.load(projects);
            _refreshSelection(editor)            
        } else {
            // 아무 것도 없을 때는 artboard 하나를 자동으로 만들어준다. 
            editor.emit('addArtBoard');
        }
    }
}