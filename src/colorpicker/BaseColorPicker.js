import Dom from '../util/Dom'
import ColorSetsList from './module/ColorSetsList'
import ColorManager from './module/ColorManager';
import { MOUSEUP } from '../util/Event';
import { defaultValue, isFunction } from '../util/functions/func';
import { px } from '../util/css/types';
import UIElement from '../util/UIElement';
import BaseStore from '../util/BaseStore';

export default class BaseColorPicker extends UIElement {

    created () {
        this.isColorPickerShow = false;
        this.isShortCut = false;
        this.hideDelay = +defaultValue(this.opt.hideDeplay, 2000);
        this.timerCloseColorPicker;
        this.autoHide = this.opt.autoHide || true;
        this.outputFormat = this.opt.outputFormat
        this.$checkColorPickerClass = this.checkColorPickerClass.bind(this);
    }

    initialize (modules = []) {
        this.$body = null;
        this.$root = null; 
        
        this.$store = new BaseStore({
            modules: [
                ColorManager,
                ColorSetsList,
                ...modules
            ]
        });

        this.callbackChange = () => {
            this.callbackChangeValue()
        }

        this.colorpickerShowCallback = function () { };
        this.colorpickerHideCallback = function () { };           


        this.$body = new Dom(this.getContainer());
        this.$root = new Dom('div', 'codemirror-colorpicker');

        //  append colorpicker to container (ex : body)
        if (this.opt.position == 'inline') {
            this.$body.append(this.$root);
        }

        if (this.opt.type) {    // to change css style
            this.$root.addClass(this.opt.type);
        }

        if (this.opt.hideInformation) {
            this.$root.addClass('hide-information')
        }

        if (this.opt.hideColorsets) {
            this.$root.addClass('hide-colorsets')
        }        

        if (this.opt.width) {
            this.$root.css('width', this.opt.width)
        }

        this.$arrow = new Dom('div', 'arrow');
        
        this.$root.append(this.$arrow);

        this.dispatch('setUserPalette', this.opt.colorSets);

        this.render(this.$root)

        this.initColorWithoutChangeEvent(this.opt.color);

        // 이벤트 연결 
        this.initializeEvent();           

    }

    initColorWithoutChangeEvent (color) {
        this.dispatch('initColor', color);
    }

    /** 
     * public method 
     * 
     */

    /**
     * 
     * show colorpicker with position  
     * 
     * @param {{left, top, hideDelay, isShortCut}} opt 
     * @param {String|Object} color  
     * @param {Function} showCallback  it is called when colorpicker is shown
     * @param {Function} hideCallback  it is called once when colorpicker is hidden
     */
    show(opt, color, showCallback, hideCallback) {

        // 매번 이벤트를 지우고 다시 생성할 필요가 없어서 초기화 코드는 지움. 
        // this.destroy();
        // this.initializeEvent();
        // define colorpicker callback
        this.colorpickerShowCallback = showCallback;
        this.colorpickerHideCallback = hideCallback;        
        this.$root.css(this.getInitalizePosition()).show();

        this.definePosition(opt);

        this.isColorPickerShow = true;
        this.isShortCut = opt.isShortCut || false;
        this.outputFormat = opt.outputFormat  

        // define hide delay
        this.hideDelay = +defaultValue (opt.hideDelay, 2000);
        if (this.hideDelay > 0) {
            this.setHideDelay(this.hideDelay);
        }        
        
        this.$root.appendTo(this.$body);

        this.initColorWithoutChangeEvent(color);
    }     

    /**
     * 
     * initialize color for colorpicker
     * 
     * @param {String|Object} newColor 
     * @param {String} format  hex, rgb, hsl
     */
    initColor(newColor, format) {
        this.dispatch('changeColor', newColor, format);
    }


    /**
     * hide colorpicker 
     * 
     */
    hide() {
        if (this.isColorPickerShow) {
            // this.destroy();
            this.$root.hide();
            this.$root.remove();  // not empty 
            this.isColorPickerShow = false;

            this.callbackHideValue()
        }
    }

    /**
     * set to colors in current sets that you see 
     * @param {Array} colors 
     */
    setColorsInPalette (colors = []) {
        this.dispatch('setCurrentColorAll', colors);
    }    

    /**
     * refresh all color palette 
     * 
     * @param {*} list 
     */
    setUserPalette (list = []) {
        this.dispatch('setUserPalette', list);
    }


    /**
     * private method 
     */

    getOption(key) {
        return this.opt[key];
    }

    setOption (key, value) {
        this.opt[key] = value; 
    }

    getContainer () {
        return this.opt.container || document.body;
    }

    getColor(type) {
        return this.read('toColor', type);
    }

    definePositionForArrow(opt, elementScreenLeft, elementScreenTop) {
        // console.log(arguments)
    }

    definePosition(opt) {

        var width = this.$root.width();
        var height = this.$root.height();

        // set left position for color picker
        var elementScreenLeft = opt.left - this.$body.scrollLeft();
        if (width + elementScreenLeft > window.innerWidth) {
            elementScreenLeft -= (width + elementScreenLeft) - window.innerWidth;
        }
        if (elementScreenLeft < 0) { elementScreenLeft = 0; }

        // set top position for color picker
        var elementScreenTop = opt.top - this.$body.scrollTop();
        if (height + elementScreenTop > window.innerHeight) {
            elementScreenTop -= (height + elementScreenTop) - window.innerHeight;
        }
        if (elementScreenTop < 0) { elementScreenTop = 0; }

        // set position
        this.$root.css({
            left: px(elementScreenLeft),
            top: px(elementScreenTop)
        });

        // this.definePositionForArrow(opt, elementScreenLeft, elementScreenTop);
    }

    getInitalizePosition() {
        if (this.opt.position == 'inline') {
            return {
                position: 'relative',
                left: 'auto',
                top: 'auto',
                display: 'inline-block'
            }
        } else {
            var position = this.opt.position == 'absolute' ? 'absolute' : 'fixed'
            return {
                position,  // color picker has fixed position
                left: '-10000px',
                top: '-10000px'
            }
        }
    }

    

    setHideDelay(delayTime) {
        delayTime = delayTime || 0;

        const hideCallback = this.hide.bind(this);

        this.$root.off('mouseenter');
        this.$root.off('mouseleave');

        this.$root.on('mouseenter', () => {
            clearTimeout(this.timerCloseColorPicker);
        });

        this.$root.on('mouseleave', () => {
            clearTimeout(this.timerCloseColorPicker);
            this.timerCloseColorPicker = setTimeout(hideCallback, delayTime);
        });

        clearTimeout(this.timerCloseColorPicker);
        // this.timerCloseColorPicker = setTimeout(hideCallback, delayTime);
    }

    callbackChangeValue(color) {
        color = color || this.getCurrentColor();

        if (isFunction(this.opt.onChange)) {
            this.opt.onChange.call(this, color);
        }

        if (isFunction(this.colorpickerShowCallback)) {
            this.colorpickerShowCallback(color);
        }        
    }

    callbackHideValue(color) {
        color = color || this.getCurrentColor();
        if (isFunction(this.opt.onHide)) {
            this.opt.onHide.call(this, color);
        }

        if (isFunction(this.colorpickerHideCallback)) {
            this.colorpickerHideCallback(color);
        }        
    }    

    getCurrentColor() {
        return this.read('toColor', this.outputFormat);
    }


    checkColorPickerClass(el) {
        var $el = new Dom(el);
        var hasColorView = $el.closest('codemirror-colorview');
        var hasColorPicker = $el.closest('codemirror-colorpicker');
        var hasCodeMirror = $el.closest('CodeMirror');
        var IsInHtml = el.nodeName == 'HTML';

        return !!(hasColorPicker || hasColorView || hasCodeMirror);
    }

    checkInHtml(el) {
        var IsInHtml = el.nodeName == 'HTML';

        return IsInHtml;
    }

    initializeStoreEvent () {
        super.initializeStoreEvent()

        this.$store.on('changeColor', this.callbackChange, this)
        this.$store.on('changeFormat', this.callbackChange, this)        
    }
 
    destroy() {
        super.destroy();

        this.$store.off('changeColor', this.callbackChange);
        this.$store.off('changeFormat', this.callbackChange);

        this.callbackChange = undefined; 

        // remove color picker callback
        this.colorpickerShowCallback = undefined;
        this.colorpickerHideCallback = undefined;   
    }


     // Event Bindings 
     [MOUSEUP('document')] (e) {

        // when color picker clicked in outside
        if (this.checkInHtml(e.target)) {
            //this.setHideDelay(hideDelay);
        } else if (this.checkColorPickerClass(e.target) == false) {
            this.hide();
        }
    }
    
}