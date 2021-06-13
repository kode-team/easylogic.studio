import { BackgroundImage } from "el/editor/property-parser/BackgroundImage";
import { LOAD, CLICK, DRAGSTART, DRAGOVER, DROP, PREVENT, DEBOUNCE, SUBSCRIBE, DOMDIFF } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { CSS_TO_STRING, STRING_TO_CSS } from "el/base/functions/func";
import { LinearGradient } from "el/editor/property-parser/image-resource/LinearGradient";
import { ColorStep } from "el/editor/property-parser/image-resource/ColorStep";
import ".";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";

const names = {
    'image-resource': "Image",
    'url': "Image",
    image: "Image",
    "static-gradient": "Static",
    "linear-gradient": "Linear",
    "repeating-linear-gradient": `${icon.repeat} Linear`,
    "radial-gradient": "Radial",
    "repeating-radial-gradient": `${icon.repeat} Radial`,
    "conic-gradient": "Conic",
    "repeating-conic-gradient": `${icon.repeat} Conic`
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
            hideLabel: this.props['hide-label'] === 'true' ? true: false,
            value: this.props.value, 
            images : this.parseBackgroundImage(this.props.value)
        }
    }

    parseBackgroundImage(str) {
        if (str === '') return [];
        return BackgroundImage.parseStyle(STRING_TO_CSS(str));
    }

    setValue (value) {
        console.log('aaaa', value);
        this.setState({
            value, 
            images : this.parseBackgroundImage(value)
        })
    }

    template () {
        var labelClass = this.state.hideLabel ? 'hide' : '';
        return /*html*/`
            <div class='background-image-editor' >
                <div class='label ${labelClass}'>
                    <label>${this.props.title||''}</label>
                    <div class='tools'>
                        <button type="button" ref='$add'>${icon.add} ${this.props.title ? '' : 'Add'}</button>
                    </div>
                </div>
                <div class='fill-list' ref='$fillList'></div>
            </div>
        `
    }

    templateForBlendMode(index, blendMode) {
        return /*html*/`
        <div class='popup-item'>
          <object refClass="BlendSelectEditor" 
                ref='$blend_${index}' 
                key='blendMode' 
                value="${blendMode}" 
                params="${index}" 
                onchange="changeRangeEditor" 
            />
        </div>
        `;
    }    
    

    [LOAD('$fillList') + DOMDIFF] () {

        const current = this.$selection.current || {color: 'black'};


        return this.state.images.map((it, index) => {
            var image = it.image;

            var backgroundType = types[image.type];
            var backgroundTypeName = names[image.type];

            const selectedClass = it.selected ? "selected" : "";
      
            if (it.selected) {
              this.selectedIndex = index;
            }
      
            return /*html*/`
            <div class='fill-item ${selectedClass}' data-index='${index}' ref="fillIndex${index}"  draggable='true' data-fill-type="${backgroundType}" >
                <object refClass="BackgroundPositionEditor" 
                    key="background-position"
                    index="${index}"
                    ref="$bp${index}"
                    x="${it.x}"
                    y="${it.y}"
                    width="${it.width}"
                    height="${it.height}"
                    repeat="${it.repeat}"
                    size="${it.size}"
                    blendMode="${it.blendMode}"     
                    onchange='changePattern' />
                <object refClass="GradientSingleEditor" 
                    index="${index}"
                    ref="$gse${index}"
                    image="${it.image}"
                    color="${current.color}"
                    key="background-image"
                    onchange='changePattern'

                />
                <div class='fill-info'>
                  <div class='gradient-info'>
                    <div class='fill-title' ref="fillTitle${index}">${backgroundTypeName}</div>
                    <div class='blend'>
                      ${this.templateForBlendMode(index, it.blendMode)}
                    </div>
                    <div class='tools'>
                      <button type="button" class='remove' data-index='${index}'>${icon.remove2}</button>
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

    [SUBSCRIBE('add')] () {

        this.state.images.push(new BackgroundImage({

            image: new LinearGradient({
                angle: 90,
                colorsteps: [
                    new ColorStep({ percent: 0, color: 'white', index: 0}),
                    new ColorStep({ percent: 100, color: 'black', index: 1})
                ]
            })
        }));

        this.refresh();

        this.modifyBackgroundImage();        
    }

    [CLICK('$add')] () {

        this.trigger('add')
    }


    [DRAGSTART("$fillList .fill-item")](e) {
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

        // this.viewFillPopup(this.getRef("preview", this.selectedIndex));

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

    [SUBSCRIBE('changeRangeEditor')] (key, value, params) {
        this.trigger('changePattern', key, {[key]: value}, params);
    }

    [SUBSCRIBE('changePattern')] (key, value, params) {
        var index = +params;
        var image = this.state.images[index];

        image.reset(value);

        this.modifyBackgroundImage();
        this.refresh();
    }
}

registElement({ BackgroundImageEditor })