import { uuid } from "@sapa/functions/math";
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

    async getArtboardList () {
        let isNew = false; 
        const artboards = (this.editor.loadItem("artboards") || []).map(it => {
            if (!it.id) {
                it.id = uuid();
                isNew = true; 
            }
            return it;
        })

        if (isNew) {
            await this.setArtboardList(artboards);
        }

        return artboards; 
    }

    async setArtboardList (list) {
        this.editor.saveItem('artboards', list);
    }

    async getArtBoard (id) {
        const artboardList = await this.getArtboardList()
        const it = artboardList.find(it => it.id === id);

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
    async saveArtboard(datauri = '') {
        const current = this.editor.selection.current;

        if (current) {
            const artboardList = await this.getArtboardList();
            const json = await JSONRenderer.render(current);

            json.x = "0px"
            json.y = "0px"
            await this.setArtboardList([
                ...artboardList, 
                {
                    id: uuid(),
                    preview: datauri,
                    artboard: json 
                }
            ]);
        }
    }

    async removeArtboard (id) {
        const artboardList = await this.getArtboardList();
        await this.setArtboardList(artboardList.filter(it => {
            return it.id !== id
        }));
    }

}