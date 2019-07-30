import { Property } from "../items/Property";
const CLIPPATH_REG = /(content\-box|padding\-box|border\-box|margin\-box|view\-box|stroke\-box|fill\-box|none|(inset|circle|ellipse|polygon|path|url)(\(([^\)]*)\))?)/gi;
export class ClipPath extends Property {

    getDefaultObject(obj = {}) {
        return super.getDefaultObject( { 
            itemType: 'clip-path', 
            type: 'none',
            value: '',
            ...obj 
        })
    }

    toCloneObject() {
        return {
            ...super.toCloneObject(),
            value: this.json.value
        }
    }

    toString() {
        var type = this.json.type; 
        var value = this.json.value;
        var box = this.json.box; 

        var results = '';

        switch(type) {
            case 'circle':
            case 'inset':
            case 'ellipse':
            case 'polygon':
            case 'path':
                results = `${type}(${value})`;
                break;                
            case 'svg':
                results = `url(#${value})`;
                break;
            default: 
                results = 'none';
                break;
        }

        return box ? `${box} ${results}` : results;
    }    

    toCSS () {
        return {
            'clip-path': this.toString()
        }
    }


    static toCSS (obj) {
        return new ClipPath(obj).toCSS()
    }

    static toString (obj) {
        return ClipPath.toCSS(obj)['clip-path']
    }

    static parse (obj) {
        return new ClipPath(obj);
    }

    static parseStyle (str) {

        var clippath = {};

        if (!str) return {};
    
        var matches = (str.match(CLIPPATH_REG) || []);

        matches.forEach((value, index) => {

            if (value.includes('-box')) {
                clippath.box = value; 
            } else {
                var [clipPathName, clipPathValue] = value.split("(");

                clipPathValue = clipPathValue || ''; 

                if (clipPathName === 'none') {
                    clipPathValue = ''
                } else {
                    clipPathValue = clipPathValue.split(")")[0];
                }
    
                clippath.type = clipPathName;
                clippath.value = clipPathValue;
            }
        });

        return clippath;
    }

}
