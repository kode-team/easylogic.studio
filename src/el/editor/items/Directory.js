import { Item } from "./Item";

export class Directory extends Item {

    getDefaultTitle () { return 'Directory' }  

    add (item) {
        if (item.itemType == 'directory' || item.itemType == 'layer') {
            return super.add(item);
        } else {
            throw new Error('잘못된 객체입니다.');
        }
    }

    get directories () {
        return this.search({itemType: 'directory'})
    }    

    get layers () {
        return this.search({itemType: 'layer'})
    }        

    get texts () {
        return this.search({itemType: 'layer', type: 'text'})
    }            

    get images () {
        return this.search({itemType: 'layer', type: 'image'})
    }                
    
    getDefaultObject (obj = {}) {
        return {
            ...super.getDefaultObject(), 
            ...{ itemType: 'directory' },
            ...obj
        }
    }
} 