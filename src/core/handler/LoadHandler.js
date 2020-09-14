import BaseHandler from "./BaseHandler";
import { LOAD_SAPARATOR } from "../Event";

export default class LoadHandler extends BaseHandler {


    initialize() {
        this._domEvents = null;
    }


    destroy() {
        this._loadMethods = undefined;
    }


    /**
     * 특정 load 함수를 실행한다.  문자열을 그대로 return 한다. 
     * @param  {...any} args 
     */
    loadTemplate (...args) {
        return this[LOAD(args.join(''))].call(this)
    }

    load(...args) {
        if (!this._loadMethods) {
            this._loadMethods = this.filterProps(CHECK_LOAD_PATTERN);
        }

        const methods = this._loadMethods.filter(callbackName => {
            const elName = callbackName.split(LOAD_SAPARATOR)[1].split(CHECK_SAPARATOR)[0];
            if (!args.length) return true; 
            return args.indexOf(elName) > -1
        })
 
        methods.forEach(callbackName => {
            let methodName = callbackName.split(LOAD_SAPARATOR)[1];
            var [elName, ...checker] = methodName.split(CHECK_SAPARATOR).map(it => it.trim())

            checker = checker.map(it => it.trim())

            var isVdom = checker.indexOf(VDOM.value) > -1;
 
            if (this.refs[elName]) {
                
                var newTemplate = this[callbackName].call(this, ...args);

                if (isArray(newTemplate)) {
                    newTemplate = newTemplate.join('');
                }

                const fragment = this.context.parseTemplate(html`${newTemplate}`, true);

                if (isVdom) {
                    this.refs[elName].htmlDiff(fragment);
                } else {
                    this.refs[elName].html(fragment);
                }

            }
        });

        this.context.runHandlers('load');
        this.context.parseComponent();
        
    }    

}