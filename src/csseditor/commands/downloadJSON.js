import downloadFile from "../../editor/util/downloadFile";

export default {
    command: 'downloadJSON',
    execute: function (editor, filename) {
        var json = JSON.stringify(editor.projects)
        var datauri = 'data:application/json;base64,' + window.btoa(json);

        downloadFile(datauri, filename || 'easylogic.json')
    }

}