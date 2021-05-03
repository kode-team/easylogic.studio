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

    toggle(key) {
        this.set(key, !this.get(key));
    }

    remove (key) {
        delete this.config[key];
        this.editor.emit("config:" + key);        
    }

}