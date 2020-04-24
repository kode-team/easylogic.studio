import UIElement, { EVENT } from "../../../util/UIElement";
import { LOAD, CLICK, DRAGSTART, DRAGOVER, DROP, PREVENT } from "../../../util/Event";
import icon from "../icon/icon";
import { OBJECT_TO_PROPERTY } from "../../../util/functions/func";
import PatternSizeEditor from "./PatternSizeEditor";
import { blend_list } from "../../../editor/util/Resource";
import SelectEditor from "./SelectEditor";
import { Pattern, CheckPattern } from "../../../editor/css-property/Pattern";
import ColorSingleEditor from "./ColorSingleEditor";

export default class PatternEditor extends UIElement {

    components() {
        return {
            SelectEditor,
            ColorSingleEditor,
            PatternSizeEditor
        }
    }

    initState() {
        return {
            hideLabel: this.props['hide-label'] === 'true' ? true: false,
            value: this.props.value, 
            patterns : this.parsePattern(this.props.value)
        }
    }

    parsePattern(str) {
        return Pattern.parseStyle(str);
    }

    setValue (value) {
        this.setState({
            value, 
            patterns : this.parsePattern(value)
        })
    }

    template () {
        var labelClass = this.state.hideLabel ? 'hide' : '';
        return /*html*/`
            <div class='pattern-editor' >
                <div class='label ${labelClass}'>
                    <label>${this.props.title||''}</label>
                    <div class='tools'>
                        <button type="button" ref='$add'>${icon.add} ${this.props.title ? '' : 'Add'}</button>
                    </div>
                </div>
                <div class='pattern-list' ref='$patternList'></div>
            </div>
        `
    }


    getBlendList () {
        return blend_list.split(',').map(it => {
            return `${it}:${this.$i18n(`blend.${it}`)}`
        }).join(',');
    }

    templateForBlendMode(index, blendMode) {

        if (!this.state.blendListString) {
            this.state.blendListString = this.getBlendList();
        }


        return /*html*/`
        <div class='popup-item'>
          <SelectEditor 
                ref='$blend_${index}' 
                key='blendMode' 
                value="${blendMode}" 
                params="${index}" 
                options="${this.state.blendListString}" 
                onchange="changePattern" 
            />
        </div>
        `;
    }    
    

    [LOAD('$patternList')] () {

        return this.state.patterns.map((it, index) => {

            const selectedClass = it.selected ? "selected" : "";
      
            if (it.selected) {
              this.selectedIndex = index;
            }
      
            return /*html*/`
            <div class='pattern-item ${selectedClass}' data-index='${index}' ref="fillIndex${index}"  draggable='true'>
                <PatternSizeEditor ${OBJECT_TO_PROPERTY({
                    key: 'pattern-size',
                    ref: `$bp${index}`,
                    type: it.type,
                    x: it.x,
                    y: it.y,
                    width: it.width,
                    height: it.height,
                    foreColor: it.foreColor,
                    backColor: it.backColor,
                })} onchange='changePattern' />
                <ColorSingleEditor ${OBJECT_TO_PROPERTY({
                    ref: `$gse${index}`,
                    color: it.foreColor,
                    key: 'foreColor',
                    params: index,                    
                    onchange: 'changePattern'
                })} />
                <ColorSingleEditor ${OBJECT_TO_PROPERTY({
                    ref: `$gseBack${index}`,
                    color: it.backColor,
                    key: 'backColor',
                    params: index,
                    onchange: 'changePattern'
                })} />

                <div class='blend'>
                    ${this.templateForBlendMode(index, it.blendMode)}
                </div>
                <div class='tools'>
                    <button type="button" class='remove' data-index='${index}'>${icon.remove2}</button>
                </div>
            </div>
            `;
        });
    }

    modifyPattern () {
        var value = Pattern.join(this.state.patterns);

        this.parent.trigger(this.props.onchange, this.props.key, value)
    }

    [EVENT('add')] () {

        this.state.patterns.push(new CheckPattern());

        this.refresh();

        this.modifyPattern();        
    }

    [CLICK('$add')] () {
        this.trigger('add')
    }


    [DRAGSTART("$patternList .pattern-item")](e) {
        this.startIndex = +e.$dt.attr("data-index");
    }

    [DRAGOVER("$patternList .pattern-item") + PREVENT](e) {}


    sortItem(arr, startIndex, targetIndex) {
        arr.splice(
          targetIndex + (startIndex < targetIndex ? -1 : 0),
          0,
          ...arr.splice(startIndex, 1)
        );
    }

    sortPattern(startIndex, targetIndex) {
        this.sortItem(this.state.patterns, startIndex, targetIndex);
    }

    [DROP("$patternList .pattern-item") + PREVENT](e) {
        var targetIndex = +e.$dt.attr("data-index");


        this.selectItem(this.startIndex, true);

        this.sortPattern(this.startIndex, targetIndex);

        this.refresh();

        this.modifyPattern()

    }



    getCurrentPattern() {
        return this.state.patterns[this.selectedIndex];
    }


    [CLICK("$patternList .tools .remove")](e) {
        var removeIndex = +e.$dt.attr("data-index");

        this.state.patterns.splice(removeIndex, 1);

        this.refresh();

        this.modifyPattern()
    }

    selectItem(selectedIndex, isSelected = true) {
        if (isSelected) {
            this.refs[`fillIndex${selectedIndex}`].addClass("selected");
        } else {
            this.refs[`fillIndex${selectedIndex}`].removeClass("selected");
        }

        
        this.state.patterns.forEach((it, index) => {
            it.selected = index === selectedIndex;
        });
        
    }

    [EVENT('changePattern')] (key, value, params) {
        var index = +params;
        var pattern = this.state.patterns[index];

        pattern.reset({
            [key]: value
        });

        this.modifyPattern();
        this.refresh();
    }
}