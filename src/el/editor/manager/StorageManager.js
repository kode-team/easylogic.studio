import { uuid } from "el/base/functions/math";


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

    async getCustomComponentList () {
        let isNew = false; 
        const components = (this.editor.loadItem("custom-components") || []).map(it => {
            if (!it.id) {
                it.id = uuid();
                isNew = true; 
            }
            return it;
        })

        if (isNew) {
            await this.setCustomComponentList(components);
        }

        return components; 
    }    

    async setArtboardList (list) {
        this.editor.saveItem('artboards', list);
    }

    async setCustomComponentList (list) {
        this.editor.saveItem('custom-components', list);
    }    

    async getArtBoard (id) {
        const artboardList = await this.getArtboardList()
        const it = artboardList.find(it => it.id === id);

        if (it && it.artboard) {
            return it.artboard;
        }

        return null; 
    }

    async getCustomComponent (id) {
        const componentList = await this.getCustomComponentList()
        const it = componentList.find(it => it.id === id);

        if (it && it.component) {
            return it.component;
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
            const json = await this.editor.json.render(current);

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


    /**
     * 저장될 preview 이미지를 포함해서 보여주기 
     * 
     * @param {string} datauri  image datauri 
     */
     async saveCustomComponent(datauri = '') {
        const current = this.editor.selection.current;

        if (current) {
            const componentList = await this.getCustomComponentList();
            const json = await this.editor.json.render(current);

            json.x = "0px"
            json.y = "0px"
            await this.setCustomComponentList([
                ...componentList, 
                {
                    id: uuid(),
                    preview: datauri,
                    component: json 
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

    async removeCustomComponent (id) {
        const componentList = await this.getCustomComponentList();
        await this.setCustomComponentList(componentList.filter(it => {
            return it.id !== id
        }));
    }

}