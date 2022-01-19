
import { LOAD, CLICK, DRAGSTART, DRAGOVER, DROP, PREVENT, DEBOUNCE, SUBSCRIBE } from "el/sapa/Event";
import icon, { iconUse } from "el/editor/icon/icon";
import { Pattern } from "el/editor/property-parser/Pattern";
import patterns from "el/editor/preset/patterns";

import { EditorElement } from "el/editor/ui/common/EditorElement";

import './PatternEditor.scss';
import { createComponent } from "el/sapa/functions/jsx";

export default class PatternEditor extends EditorElement {
    
    initState() {
        return {
            hideLabel: this.props.hideLabel,
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
            <div class='elf--pattern-editor' >
                <div class='pattern-list' ref='$patternList'></div>
            </div>
        `
    }


    [LOAD('$patternList')] () {

        return this.state.patterns.map((it, index) => {

            const selectedClass = it.selected ? "selected" : "";
      
            if (it.selected) {
              this.selectedIndex = index;
            }

            return /*html*/`
            <div class='pattern-item ${selectedClass}' data-index='${index}' ref="fillIndex${index}"  draggable='true'>
                ${createComponent("PatternSizeEditor" , {
                    key: "pattern-size",
                    ref: `$bp${index}`,
                    type: it.type,
                    x: it.x,
                    y: it.y,
                    width: it.width,
                    height: it.height,
                    index,
                    foreColor: it.foreColor,
                    backColor: it.backColor,
                    blendMode: it.blendMode,
                    lineWidth: it.lineWidth,
                    lineHeight: it.lineHeight,
                    onchange: 'changePatternSizeInfo'
                })}
                <div class='tools'>
                    <button type="button" class='remove' title='Remove a pattern' data-index='${index}'>${iconUse('remove')}</button>
                </div>
            </div>
            `;
        });
    }

    modifyPattern () {
        var value = Pattern.join(this.state.patterns);

        this.parent.trigger(this.props.onchange, this.props.key, value)
    }

    [SUBSCRIBE('add')] (type = 'check') {

        var pattern = patterns.find(it => it.key === type)

        if (pattern) {

            const data = Pattern.parseStyle(pattern.execute()[0].pattern)

            this.state.patterns.push.apply(this.state.patterns, data);

            this.refresh();
    
            this.modifyPattern();        
        }

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

        this.modifyPattern()

        this.refresh();


    }



    getCurrentPattern() {
        return this.state.patterns[this.selectedIndex];
    }


    [CLICK("$patternList .tools .remove")](e) {
        var removeIndex = +e.$dt.attr("data-index");

        this.state.patterns.splice(removeIndex, 1);
        this.modifyPattern()
        this.refresh();

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

    [SUBSCRIBE('changePatternSizeInfo') + DEBOUNCE(10)] (key, value, index) {
        var pattern = this.state.patterns[index];

        pattern.reset(value)
        this.modifyPattern();
        this.refresh();
    }
}