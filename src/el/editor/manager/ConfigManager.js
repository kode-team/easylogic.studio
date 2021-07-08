export class ConfigManager {

    constructor (editor) {
        this.editor = editor;
        this.config = new Map();
        this.initialize()
    }

    initialize() {
        this.set('canvas.width', 10000)
        this.set('canvas.height', 10000)
        this.set('body.move.ms', 30);
        this.set('grid.preview.position', []);
        this.set('debug', false);
        this.set('fixedAngle', 15);
        this.set('ruler.show', true);
        this.set('show.left.panel', true);
        this.set('show.right.panel', true);
    }

    /**
     *  key 에 해당하는 config 를 가지고 온다. 
     * 
     * @param {string} key 
     */
    get (key) {
        return this.config[key]
    }

    set (key, value) {
        const oldValue = this.config[key]
        if (oldValue != value) {
            this.config[key] = value; 
            this.editor.emit("config:" + key);
        }
    }

    setAll (obj) {
        Object.keys(obj).forEach(key => {
            this.set(key, obj[key])
        })
    }

    toggle(key) {
        this.set(key, !this.get(key));
    }

    true(key) {
        return this.get(key) === true;
    }

    false(key) {
        return this.get(key) === false;
    }

    remove (key) {
        delete this.config[key];
        this.editor.emit("config:" + key);        
    }

}