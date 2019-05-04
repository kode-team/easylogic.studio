import { ACTION_PREFIX, GETTER_PREFIX } from "./Store";

export default class BaseModule {
    constructor ($store) {
        this.$store = $store;
        this.initialize();
    }

    afterDispatch() {
        
    }

    initialize() {
        this.filterProps(ACTION_PREFIX).forEach(key => {
            this.$store.action(key, this);
        });

        this.filterProps(GETTER_PREFIX).forEach(key => {
            this.$store.getter(key, this);
        });        
    }

    filterProps (pattern = '/') {
        return Object.getOwnPropertyNames(this.__proto__).filter(key => {
            return key.startsWith(pattern);
        });
    }

    get (id) {
        return this.$store.items[id] || {}
    }

    set (id, opt) {
        this.$store.items[id] = opt; 
    }

    config (key, defaultValue) {
        return isUndefined(this.$store.tool[key]) ? defaultValue : this.$store.tool[key]
    }   
    
    initConfig (key, value) {
        this.$store.tool[key] = value;
    }

}