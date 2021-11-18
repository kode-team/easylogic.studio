export class ConfigManager {

    constructor (editor) {
        this.editor = editor;
        this.configList = [];
        this.config = new Map();

        // this.load();
    }

    load () {
        const obj = this.editor.loadItem('config') || {};

        Object.keys(obj).forEach(key => {
            this.config.set(key, obj[key]);
        })

    }
    
    /**
     *  key 에 해당하는 config 를 가지고 온다. 
     * 
     * todo: config default 값을 설정할 수 있어야 한다. 
     * 
     * ```js
     * config {
     *  ['set.tool.hand']: {
     *      name: 'set.tool.hand',
     *      description: '', 
     *      defaultValue: '',
     *       type: 'boolean',
     *      type: 'list',
     *      selectionType: 'one',
     *      items: [
     *          'value',
     *          {value: '1', label: 'value' }
     *      ]
     *  }
     * }
     * ```
     * 
     * @param {string} key 
     */
    get (key) {
        if (this.config.has(key) === false) {
           this.config.set(key, this.configList.find(it => it.key == key)?.defaultValue);
        }

        return this.config.get(key);
    }

    set (key, value, isSave = true) {
        const oldValue = this.config.get(key);

        if (oldValue !== value) {
            //todo: type 체크
            this.config.set(key, value); 
            this.editor.emit("config:" + key, value, oldValue);

            if (isSave) {
                this.save();
            }
        }
    }

    init (key, value) {
        this.config.set(key, value, false);
    }

    save () {
        const obj = {};
        this.config.forEach((value, key) => {
            obj[key] = value;
        });

        this.editor.saveItem('config', obj);
    }

    setAll (obj) {
        Object.keys(obj).forEach(key => {
            this.set(key, obj[key])
        })
    }

    getType(key) {
        return this.configList.find(it => it.key == key)?.type;
    }

    isType (key, type) {
        return this.getType(key) === type;
    }

    isBoolean(key) {
        return this.isType(key, 'boolean');
    }

    toggle(key) {
        if (this.isBoolean(key)) {
            this.set(key, !this.get(key));
        }
    }

    true(key) {
        return this.get(key) === true;
    }

    false(key) {
        return this.get(key) === false;
    }

    /**
     * key 에 해당하는 config 의 값을 비교한다.
     * 
     * 
     * @param {string} key 
     * @param {any} value 
     * @returns {boolean}
     */
    is(key, value) {
        return this.get(key) === value;
    }

    remove (key) {
        this.config.delete(key);
        this.editor.emit("config:" + key);        
    }


    /**
     * config 기본 설정을 등록한다. 
     * 
     * @param {Object} config 
     * @param {string} config.type config key 자료형 
     * @param {string} config.key config key 이름 
     * @param {any} config.defaultValue config key 기본 값 
     * @param {string} config.title config key 제목 
     * @param {string} config.description config key 설명  
     */ 
    registerConfig (config) {
        this.config.set(config.key, config.defaultValue);
        this.configList.push(config);
    }
}