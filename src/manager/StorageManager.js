import { uuid } from "@core/functions/math";
import JSONRenderer from "@renderer/JSONRenderer";

/**
 * localStorage Manager
 * 
 * @class StorageManager 
 */
export class StorageManager {
    constructor (editor) {
        this.editor = editor; 
    }

    getArtboardList () {
        let isNew = false; 
        const artboards = (this.editor.loadItem("artboards") || []).map(it => {
            if (!it.id) {
                it.id = uuid();
                isNew = true; 
            }
            return it;
        })

        if (isNew) {
            this.setArtboardList(artboards);
        }

        return artboards; 
    }

    setArtboardList (list) {
        this.editor.saveItem('artboards', list);
    }

    getArtBoard (id) {
        const it = this.getArtboardList().find(it => it.id === id);

        if (it && it.artboard) {
            return it.artboard;
        }

        return null; 
    }

    /**
     * 저장될 preview 이미지를 포함해서 보여주기 
     * 
     * @param {string} datauri  image datauri 
     */
    saveArtboard(datauri = '') {
        const current = this.editor.selection.current;

        if (current) {
            const json = JSONRenderer.render(current);
            json.x = "0px"
            json.y = "0px"
            this.setArtboardList([...this.getArtboardList(), {
                id: uuid(),
                preview: datauri,
                artboard: json 
            }]);
        }
    }

}