const config = new Map()

export class Config {

    constructor (editor) {
        this.editor = editor;

        this.initialize()
    }

    initialize() {
        this.set('canvas.width', 10000)
        this.set('canvas.height', 10000)
        this.set('body.move.ms', 15);
        this.set('grid.preview.position', []);
    }

    get (key) {
        return config[key]
    }

    set (key, value) {
        config[key] = value; 
    }

    remove (key) {
        delete config[key];
    }

}