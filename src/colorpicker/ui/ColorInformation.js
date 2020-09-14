import Event, { CLICK, KEYUP, INPUT, KEYDOWN } from '@core/Event'
import UIElement, { EVENT } from '@core/UIElement';

export default class ColorInformation extends UIElement {

    template () {
        return /*html*/`
        <div class="information hex">
            <div ref="$informationChange" class="information-change">
                <button ref="$formatChangeButton" type="button" class="format-change-button arrow-button"></button>
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

        this.parent.manager.changeFormat(this.format)
        this.emit('lastUpdateColor');        
    }

    goToFormat(to_format) {
        this.format = to_format;
        if (to_format === 'rgb' || to_format === 'hsl') {
            this.initFormat();
        }

        this.parent.manager.changeFormat(this.format)
    }    
    
    getFormat () {
        return this.format || 'hex';   
    }

    changeRgbColor () {
        this.parent.changeColor({
            type: 'rgb',
            r : this.refs.$rgb_r.int(),
            g : this.refs.$rgb_g.int(),
            b : this.refs.$rgb_b.int(),
            a : this.refs.$rgb_a.float()
        })
        this.emit('lastUpdateColor')
    }

    changeHslColor () {
        this.parent.changeColor({
            type: 'hsl',
            h : this.refs.$hsl_h.int(),
            s : this.refs.$hsl_s.int(),
            l : this.refs.$hsl_l.int(),
            a : this.refs.$hsl_a.float()
        })        
        this.emit('lastUpdateColor')        
    }    

    [EVENT('changeColor', 'initColor')] () {
        this.refresh()
    }

    [INPUT('$rgb_r')] (e) {  this.changeRgbColor(); }
    [INPUT('$rgb_g')] (e) {  this.changeRgbColor(); }
    [INPUT('$rgb_b')] (e) {  this.changeRgbColor(); }
    [INPUT('$rgb_a')] (e) {  this.changeRgbColor(); }  
    
    [INPUT('$hsl_h')] (e) {  this.changeHslColor(); }
    [INPUT('$hsl_s')] (e) {  this.changeHslColor(); }
    [INPUT('$hsl_l')] (e) {  this.changeHslColor(); }
    [INPUT('$hsl_a')] (e) {  this.changeHslColor(); }      

    [KEYUP('$hexCode')] (e) {
        var code = this.refs.$hexCode.val();
    
        if(code.charAt(0) == '#' && (code.length == 7 || code.length === 9)) {
            this.parent.initColor(code)
            this.emit('lastUpdateColor')
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
        this.refs.$rgb_r.val(this.parent.rgb.r);
        this.refs.$rgb_g.val(this.parent.rgb.g);
        this.refs.$rgb_b.val(this.parent.rgb.b);
        this.refs.$rgb_a.val(this.parent.alpha);
    }
    
    setHSLInput() {
        this.refs.$hsl_h.val(this.parent.hsl.h);
        this.refs.$hsl_s.val(this.parent.hsl.s);
        this.refs.$hsl_l.val(this.parent.hsl.l);
        this.refs.$hsl_a.val(this.parent.alpha);
    }    

    setHexInput () {
        this.refs.$hexCode.val(this.parent.manager.toString('hex'));
    }

    refresh () {
        this.setCurrentFormat(this.parent.format);
        this.setRGBInput();
        this.setHSLInput();
        this.setHexInput();
    }
}
