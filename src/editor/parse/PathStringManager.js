export default class PathStringManager {
    constructor () {
        this.pathArray = [] 
    }

    reset () {
        this.pathArray = []
    }

    getPointString (values) {
        return values.map(v => `${v.x} ${v.y}`).join(' ')
    }

    makeString (command, values = []) {
        this.pathArray.push(`${command} ${this.getPointString(values)}`)
        return this; 
    }

    M (...values) {
        return this.makeString('M', values);
    }

    L (...values) {
        return this.makeString('L', values);
    }    

    Q (...values) {
        return this.makeString('Q', values);
    }    

    C (...values) {
        return this.makeString('C', values);
    }    

    Z () {
        return this.makeString('Z');
    }        

    get d () {
        return this.pathArray.join(' ').trim();
    }

    toString (className = 'object') {
        return /*html*/`<path d="${this.d}" class='${className}'/>`
    }

}

