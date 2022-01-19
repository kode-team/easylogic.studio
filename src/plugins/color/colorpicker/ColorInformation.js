import { CLICK, KEYUP, INPUT, IF, PASTE } from 'el/sapa/Event'
import { EditorElement } from 'el/editor/ui/common/EditorElement';
import { iconUse } from 'el/editor/icon/icon';

export default class ColorInformation extends EditorElement {

    template () {
        return /*html*/`
        <div class="information hex">
            <div ref="$informationChange" class="information-change">
                <button ref="$formatChangeButton" type="button" class="format-change-button">
                    ${iconUse("unfold")}
                </button>
            </div>
            <div class="information-item hex">
                <div class="input-field hex">
                    <input ref="$hexCode" class="input" type="text" />
                    <div class="title">HEX</div>
                </div>
            </div>
            <div class="information-item rgb">
                <div class="input-field rgb-r">
                    <input ref="$rgb_r" class="input" type="number" step="1" min="0" max="255" />
                    <div class="title">R</div>
                </div>
                <div class="input-field rgb-g">
                    <input ref="$rgb_g" class="input" type="number" step="1" min="0" max="255" />
                    <div class="title">G</div>
                </div>
                <div class="input-field rgb-b">
                    <input ref="$rgb_b" class="input" type="number" step="1" min="0" max="255" />
                    <div class="title">B</div>
                </div>          
                <div class="input-field rgb-a">
                    <input ref="$rgb_a" class="input" type="number" step="0.01" min="0" max="1" />
                    <div class="title">A</div>
                </div>                                                            
            </div>
            <div class="information-item hsl">
                <div class="input-field hsl-h">
                    <input ref="$hsl_h" class="input" type="number" step="1" min="0" max="360" />
                    <div class="title">H</div>
                </div>
                <div class="input-field hsl-s">
                    <input ref="$hsl_s" class="input" type="number" step="1" min="0" max="100" />
                    <div class="postfix">%</div>
                    <div class="title">S</div>
                </div>
                <div class="input-field hsl-l">
                    <input ref="$hsl_l" class="input" type="number" step="1" min="0" max="100" />
                    <div class="postfix">%</div>                        
                    <div class="title">L</div>
                </div>
                <div class="input-field hsl-a">
                    <input ref="$hsl_a" class="input" type="number" step="0.01" min="0" max="1" />
                    <div class="title">A</div>
                </div>
            </div>
        </div>
        `
    }

    get manager () {
        return this.parent.manager;
    }
    
    setCurrentFormat (format) {
        this.format = format

        this.initFormat();
    }
    
    initFormat () {
        var current_format = this.format || 'hex';
    
        ['hex', 'rgb', 'hsl'].filter(it => it !== current_format).forEach(formatString => {
            this.$el.removeClass(formatString);
        })

        this.$el.addClass(current_format);
    }
    
    nextFormat() {
        var current_format = this.format || 'hex';

        var next_format = 'hex';
        if (current_format == 'hex') {
            next_format = 'rgb';
        } else if (current_format == 'rgb') {
            next_format = 'hsl';
        } else if (current_format == 'hsl') {
            if (this.parent.alpha == 1) {
                next_format = 'hex';
            } else {
                next_format = 'rgb';
            }
        }

        this.format = next_format;

        this.initFormat();

        this.parent.changeFormat(this.format)
    }

    goToFormat(to_format) {
        this.format = to_format;
        if (to_format === 'rgb' || to_format === 'hsl') {
            this.initFormat();
        }

        this.parent.changeFormat(this.format)        
    }    
    
    getFormat () {
        return this.format || 'hex';   
    }

    changeRgbColor () {
        this.parent.lastUpdateColor({
            type: 'rgb',
            r : this.refs.$rgb_r.int(),
            g : this.refs.$rgb_g.int(),
            b : this.refs.$rgb_b.int(),
            a : this.refs.$rgb_a.float()
        })
    }

    changeHslColor () {
        this.parent.lastUpdateColor({
            type: 'hsl',
            h : this.refs.$hsl_h.int(),
            s : this.refs.$hsl_s.int(),
            l : this.refs.$hsl_l.int(),
            a : this.refs.$hsl_a.float()
        })        
    }    

    hasValue(e) {
        if (e.target.value === '') {
            return false; 
        }

        return true; 
    }

    [INPUT('$rgb_r') + IF('hasValue')] (e) {  this.changeRgbColor(); }
    [INPUT('$rgb_g') + IF('hasValue')] (e) {  this.changeRgbColor(); }
    [INPUT('$rgb_b') + IF('hasValue')] (e) {  this.changeRgbColor(); }
    [INPUT('$rgb_a') + IF('hasValue')] (e) {  this.changeRgbColor(); }  
    
    [INPUT('$hsl_h') + IF('hasValue')] (e) {  this.changeHslColor(); }
    [INPUT('$hsl_s') + IF('hasValue')] (e) {  this.changeHslColor(); }
    [INPUT('$hsl_l') + IF('hasValue')] (e) {  this.changeHslColor(); }
    [INPUT('$hsl_a') + IF('hasValue')] (e) {  this.changeHslColor(); }      

    [KEYUP('$hexCode') + IF('hasValue')] (e) {
        var code = this.refs.$hexCode.val();
    
        if(code.charAt(0) == '#' && (code.length == 7 || code.length === 9)) {
            this.parent.lastUpdateColor(code);
        }
    }

    [PASTE('$hexCode') + IF('hasValue')] (e) {
        var code = this.refs.$hexCode.val();

        if(code.charAt(0) == '#' && (code.length == 7 || code.length === 9)) {
            this.parent.lastUpdateColor(code);
        }
    }
    
    [CLICK('$formatChangeButton')] (e) {
        this.nextFormat();        
    }

    [CLICK('$el .information-item.hex .input-field .title')] (e) {
        this.goToFormat('hex');
    }    

    [CLICK('$el .information-item.rgb .input-field .title')] (e) {
        this.goToFormat('hsl');
    }    

    [CLICK('$el .information-item.hsl .input-field .title')] (e) {
        this.goToFormat('rgb');
    }        

    setRGBInput() {
        this.refs.$rgb_r.val(this.manager.rgb.r);
        this.refs.$rgb_g.val(this.manager.rgb.g);
        this.refs.$rgb_b.val(this.manager.rgb.b);
        this.refs.$rgb_a.val(this.manager.alpha);
    }
    
    setHSLInput() {
        this.refs.$hsl_h.val(this.manager.hsl.h);
        this.refs.$hsl_s.val(this.manager.hsl.s);
        this.refs.$hsl_l.val(this.manager.hsl.l);
        this.refs.$hsl_a.val(this.manager.alpha);
    }    

    setHexInput () {
        this.refs.$hexCode.val(this.manager.toString('hex'));
    }

    setValue () {
        this.refresh();
    }

    refresh () {
        this.setCurrentFormat(this.manager.format);
        this.setRGBInput();
        this.setHSLInput();
        this.setHexInput();
    }
}
