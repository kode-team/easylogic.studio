export default class SVGExport {
    static generate (root) {
        return SVGExport.traverse(root, 0);
    }

    constructor (root) {
        this.root = root; 
        this.svg = []; 
        this.style = []; 
        this.result = this.traverse(this.root);
    }

    makeItem (item, depth = 0) {
        return 
    }

    makeChildren (item, depth = 0) {
        return item.layers.map(it => {
            return SVGExport.traverse(it, depth + 1);
        }).join('');
    }

    makeGroup(item, depth = 0) {
        return /*html*/`
            <g transform="translate(${item.x.value}, ${item.y.value})">
                ${SVGExport.makeChildren(item, depth + 1)}
            </g>
        `
    }

    makeRoot (item) {
        return /*html*/`
            <svg width="${item.width}" height="${item.height}">
                ${SVGExport.makeChildren([item], depth)}
            </svg>
        `
    }

    traverse (item, depth = 0) {

        // root 는 svg를 출력한다. 

        var isRoot = depth === 0; 

        // 자식을 가지고 있는 객첸는 g 로 표현하고 내부에 transform 으로 좌표를 지정한다. 
        var hasChildren = item.layers.length > 0;

        if (isRoot) {
            return this.makeRoot(item);
        } else if (hasChildren) {
            return this.makeGroup(item);
        } else {
            return this.makeItem(item);
        }

    }
}