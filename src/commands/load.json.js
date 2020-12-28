import { Editor } from "@manager/Editor";
import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command: 'load.json', 

    /**
     * 
     * @param {Editor} editor 
     * @param {*} json 
     */
    execute: function (editor, json) {

        json = json || editor.loadResource('projects', []);

        // 값이 아무것도 없을 때 project 를 설정해준다. 
        if (json.length === 0) {
            json = [{itemType: 'project', layers: [{
                itemType: 'artboard',
                name: "New ArtBoard",
                x: '300px',
                y: '200px',
                width: '375px',
                height: '667px',
                'background-color': 'white', 
                layer: []
            }]}]
        }

        var projects = json.map(p => editor.createItem(p))

        projects.forEach(p => {
            p.artboards.forEach(artboard => {
                p.selectTimeline(artboard.id)
            })
        })

        if (projects.length) {
            var project = projects[0]
            editor.selection.selectProject(project)

            editor.load(projects);
            _doForceRefreshSelection(editor)
            editor.nextTick(() => {
                editor.emit('reloadProject');
            })

        }
    }
}