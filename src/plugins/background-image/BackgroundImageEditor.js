
import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { LOAD, CLICK, DRAGSTART, DRAGOVER, DROP, PREVENT, DEBOUNCE, SUBSCRIBE, DOMDIFF, SUBSCRIBE_SELF } from "el/sapa/Event";
import icon, { iconUse } from "el/editor/icon/icon";
import { CSS_TO_STRING, STRING_TO_CSS } from "el/utils/func";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './BackgroundImageEditor.scss';
import { createComponent, createComponentList } from "el/sapa/functions/jsx";
import { VisibilityType } from "el/editor/types/model";


const names = {
    'image-resource': "Image",
    'url': "Image",
    image: "Image",
    "static-gradient": "Static",
    "linear-gradient": "Linear",
    "repeating-linear-gradient": `Linear`,
    "radial-gradient": "Radial",
    "repeating-radial-gradient": `Radial`,
    "conic-gradient": "Conic",
    "repeating-conic-gradient": `Conic`
  };
  
  const types = {
    image: "image",
    'image-resource': "image",    
    'url': 'image',

    "static-gradient": "gradient",
    "linear-gradient": "gradient",
    "repeating-linear-gradient": "gradient",
    "radial-gradient": "gradient",
    "repeating-radial-gradient": "gradient",
    "conic-gradient": "gradient",
    "repeating-conic-gradient": "gradient"
  };

export default class BackgroundImageEditor extends EditorElement {

    initState() {

        return {
            hideLabel: this.props.hideLabel || false,
            value: this.props.value, 
            images : this.parseBackgroundImage(this.props.value)
        }
    }

    parseBackgroundImage(str) {
        if (str === '') return [];
        return BackgroundImage.parseStyle(STRING_TO_CSS(str));
    }

    setValue (value) {
        this.setState({
            value, 
            images : this.parseBackgroundImage(value)
        })
    }

    template () {
        return /*html*/`
            <div class='elf--background-image-editor' >
                <div class='fill-list' ref='$fillList'></div>
            </div>
        `
    }


    [LOAD('$fillList') + DOMDIFF] () {

        const current = this.$selection.current || {color: 'black'};

        return this.state.images.map((it, index) => {
            var image = it.image;

            var backgroundType = types[image.type];

            const selectedClass = it.selected ? "selected" : "";
      
            if (it.selected) {
              this.selectedIndex = index;
            }
      
            return /*html*/`
            <div class='fill-item ${selectedClass}' data-index='${index}' ref="fillIndex${index}"  draggable='true' data-fill-type="${backgroundType}" >
                <label draggable="true" data-index="${index}">${iconUse('drag_indicator')}</label>
                ${createComponentList(
                    ["BackgroundPositionEditor", {
                        key: "background-position",
                        index,
                        ref: `$bp${index}`,
                        x: it.x,
                        y: it.y,
                        width: it.width,
                        height: it.height,
                        repeat: it.repeat,
                        size: it.size,
                        blendMode: it.blendMode,
                        onchange: 'changePattern'
                    }],
                    ["GradientSingleEditor" ,{
                        index,
                        ref: `$gse${index}`,
                        image: it.image,
                        color: current.color,
                        key: "background-image",
                        onchange: 'changePattern'
                    }]
                )}
                <div class='fill-info'>
                  <div class='gradient-info'>
                    <div class='blend'>
                        ${createComponent("BlendSelectEditor", {
                            ref: `$blend_${index}`,
                            key: 'blendMode',
                            // label: 'tonality',
                            value: it.blendMode,
                            params: index,
                            compact: true,
                            onchange: "changeRangeEditor" 
                        })}
                    </div>
                    <div class='tools'>
                      <button type="button" class='visibility' data-index='${index}' title="Visibility">${iconUse(it.visibility === VisibilityType.HIDDEN ? 'visible_off' : 'visible')}</button>
                    </div>                                       
                    <div class='tools'>
                      <button type="button" class='copy' data-index='${index}' title="Copy Item">${iconUse('add')}</button>
                    </div>                    
                    <div class='tools'>
                      <button type="button" class='remove' data-index='${index}' title="Remove Item">${iconUse('remove2')}</button>
                    </div>
                  </div>
                </div>
            </div>
            `;
        });
    }

    modifyBackgroundImage () {
        var value = CSS_TO_STRING(BackgroundImage.toPropertyCSS(this.state.images));

        this.parent.trigger(this.props.onchange, this.props.key, value)
    }

    makeGradient (type) {
        switch(type) {
        case 'static-gradient': return `static-gradient(black)`;            
        case 'linear-gradient': return `linear-gradient(90deg, white 0%, black 100%)`;
        case 'repeating-linear-gradient': return `repeating-linear-gradient(90deg, white 2%, black 4%)`;
        case 'radial-gradient': return `radial-gradient(circle, white 0%, black 100%)`;
        case 'repeating-radial-gradient': return `repeating-radial-gradient(circle, white 2%, black 4%)`;
        case 'conic-gradient': return `conic-gradient(white 0%, black 100%)`;
        case 'repeating-conic-gradient': return `repeating-conic-gradient(white 50%, black 100%)`;
        }
    }

    [SUBSCRIBE('add')] (gradientType) {

        this.state.images.unshift(new BackgroundImage({
            image: BackgroundImage.parseImage(this.makeGradient(gradientType))
        }));

        this.refresh();

        this.modifyBackgroundImage();        
    }

    [CLICK('$add')] () {

        this.trigger('add')
    }


    [DRAGSTART("$fillList .fill-item > label")](e) {
        this.startIndex = +e.$dt.attr("data-index");
    }

    [DRAGOVER("$fillList .fill-item") + PREVENT](e) {}


    sortItem(arr, startIndex, targetIndex) {
        arr.splice(
          targetIndex + (startIndex < targetIndex ? -1 : 0),
          0,
          ...arr.splice(startIndex, 1)
        );
    }

    sortBackgroundImage(startIndex, targetIndex) {
        this.sortItem(this.state.images, startIndex, targetIndex);
    }

    [DROP("$fillList .fill-item") + PREVENT](e) {
        var targetIndex = +e.$dt.attr("data-index");


        this.selectItem(this.startIndex, true);

        this.sortBackgroundImage(this.startIndex, targetIndex);

        this.refresh();

        this.modifyBackgroundImage()

    }

    getCurrentBackgroundImage() {
        return this.state.images[this.selectedIndex];
    }

    [CLICK("$fillList .tools .remove")](e) {
        var removeIndex = +e.$dt.attr("data-index");

        this.state.images.splice(removeIndex, 1);

        this.refresh();

        this.modifyBackgroundImage()
    }

    [CLICK("$fillList .tools .visibility")](e) {
        var index = +e.$dt.attr("data-index");

        // visibility 
        this.state.images[index].visibility = this.state.images[index].visibility === VisibilityType.HIDDEN ? VisibilityType.VISIBLE : VisibilityType.HIDDEN;

        this.refresh();

        this.modifyBackgroundImage()
    }    

    [CLICK("$fillList .tools .copy")](e) {
        var index = +e.$dt.attr("data-index");

        const current = this.state.images[index]

        this.state.images.splice(index, 0, current);

        this.refresh();

        this.modifyBackgroundImage()
    }    

    selectItem(selectedIndex, isSelected = true) {
        if (isSelected) {
            this.refs[`fillIndex${selectedIndex}`].addClass("selected");
        } else {
            this.refs[`fillIndex${selectedIndex}`].removeClass("selected");
        }

        
        this.state.images.forEach((it, index) => {
            it.selected = index === selectedIndex;
        });
        
    }

    [SUBSCRIBE("selectFillPopupTab")](type, data) {
        var typeName = types[type];
        var $fillItem = this.refs[`fillIndex${this.selectedIndex}`];
        $fillItem.attr("data-fill-type", typeName);
    }

    [SUBSCRIBE_SELF('changeRangeEditor')] (key, value, params) {
        this.trigger('changePattern', key, {[key]: value}, params);
    }

    [SUBSCRIBE_SELF('changePattern')] (key, value, params) {
        var index = +params;
        var image = this.state.images[index];

        image.reset(value);

        this.modifyBackgroundImage();
        this.refresh();
    }
}