import UIElement, { EVENT } from "../../../../../util/UIElement";
import { BackgroundImage } from "../../../../../editor/css-property/BackgroundImage";
import { LOAD, CLICK, DRAGSTART, DRAGOVER, DROP, PREVENT } from "../../../../../util/Event";
import icon from "../../../icon/icon";
import { EMPTY_STRING } from "../../../../../util/css/types";
import { keyEach, combineKeyArray } from "../../../../../util/functions/func";
import { CSS_TO_STRING } from "../../../../../util/css/make";
import { Position } from "../../../../../editor/unit/Length";


const names = {
    image: "Image",
    static: "Static",
    "static-gradient": "Static",
    linear: "Linear",
    "repeating-linear": `${icon.repeat} Linear`,
    radial: "Radial",
    "repeating-radial": `${icon.repeat} Radial`,
    conic: "Conic",
    "repeating-conic": `${icon.repeat} Conic`,
    "linear-gradient": "Linear",
    "repeating-linear-gradient": `${icon.repeat} Linear`,
    "radial-gradient": "Radial",
    "repeating-radial-gradient": `${icon.repeat} Radial`,
    "conic-gradient": "Conic",
    "repeating-conic-gradient": `${icon.repeat} Conic`
  };
  
  const types = {
    image: "image",
    static: "gradient",
    "static-gradient": "gradient",
    linear: "gradient",
    "repeating-linear": "gradient",
    radial: "gradient",
    "repeating-radial": "gradient",
    conic: "gradient",
    "repeating-conic": "gradient",
    "linear-gradient": "gradient",
    "repeating-linear-gradient": "gradient",
    "radial-gradient": "gradient",
    "repeating-radial-gradient": "gradient",
    "conic-gradient": "gradient",
    "repeating-conic-gradient": "gradient"
  };

export default class BackgroundImageEditor extends UIElement {

    initState() {
        return {
            value: this.props.value, 
            images : this.parseBackgroundImage(this.props.value)
        }
    }

    parseBackgroundImage(str) {
        var style = {}
        str.split(';').forEach(it => {
           var [key, value] = it.split(':').map(it => it.trim())
           if (key != EMPTY_STRING) {
            style[key] = value; 
           }
        })

        return BackgroundImage.parseStyle(style);
    }

    template () {
        return `
            <div class='background-image-editor' >
                <div class='label'>

                    <div class='tools'>
                        <button type="button" ref='$add'>${icon.input} Load</button>
                        <button type="button" ref='$add'>${icon.add} Add</button>
                    </div>
                </div>
                <div class='fill-list' ref='$fillList'>
                    ${this.loadTemplate('$fillList')}
                </div>
            </div>
        `
    }


    getColorStepList(image) {
        switch (image.type) {
          case "static-gradient":
          case "linear-gradient":
          case "repeating-linear-gradient":
          case "radial-gradient":
          case "repeating-radial-gradient":
          case "conic-gradient":
          case "repeating-conic-gradient":
            return this.getColorStepString(image.colorsteps);
        }
    
        return EMPTY_STRING;
      }
    
      getColorStepString(colorsteps) {
        return colorsteps
          .map(step => {
            return `<div class='step' data-colorstep-id="${
              step.id
            }" data-selected='${step.selected}' style='background-color:${step.color};'></div>`;
          })
          .join(EMPTY_STRING);
      }
    

    [LOAD('$fillList')] () {
        return this.state.images.map((it, index) => {
            var image = it.image;
            var backgroundType = types[image.type];
            var backgroundTypeName = names[image.type];
      
            const imageCSS = `background-image: ${image.toString()}; background-size: cover;`;
            const selectedClass = it.selected ? "selected" : "";
      
            if (it.selected) {
              this.selectedIndex = index;
            }
      
            return `
            <div class='fill-item ${selectedClass}' data-index='${index}' ref="fillIndex${index}"  draggable='true' data-fill-type="${backgroundType}" >
                <div class='preview' data-index="${index}" ref="preview${index}">
                    <div class='mini-view' >
                      <div class='color-view' style="${imageCSS}" ref="miniView${index}"></div>
                    </div>
                </div>
                <div class='fill-info'>
                  <div class='gradient-info'>
                    <div class='fill-title' ref="fillTitle${index}">${backgroundTypeName}</div>
                    <div class='colorsteps' ref="colorsteps${index}">
                      ${this.getColorStepList(image)}
                    </div>
                    <div class='tools'>
                      <button type="button" class='remove' data-index='${index}'>${icon.remove2}</button>
                    </div>
                  </div>
                  <div class='background-image-info'>
                    <div ref="size${index}">${it.width}/${it.height}</div>
                    <div ref="repeat${index}">${it.repeat}</div>
                    <div class='blend-mode' ref="blendMode${index}">${it.blendMode}</div>
                  </div>
                </div>
            </div>
            `;
        });
    }


    toPropertyCSS(list, isExport = false) {
        var results = {};
        list.forEach(item => {
            keyEach(item.toCSS(isExport), (key, value) => {
                if (!results[key]) results[key] = [];
                results[key].push(value);
            });
        });

        return combineKeyArray(results);
    }

    modifyBackgroundImage () {
        var value = CSS_TO_STRING(this.toPropertyCSS(this.state.images));

        this.parent.trigger(this.props.onchange, value)
    }

    [CLICK('$add')] () {

        this.state.images.push(new BackgroundImage());

        this.refresh();

        this.modifyBackgroundImage();
    }

    refresh() {
        this.load();
    }


    getFillData(backgroundImage) {
        let data = {
            type: backgroundImage.type
        };

        switch (data.type) {
        case "image":
            data.url = backgroundImage.image ? backgroundImage.image.url : "";
            break;
        default:
            if (backgroundImage.image) {
                const image = backgroundImage.image;

                data.type = image.type;
                data.colorsteps = [...image.colorsteps];
                data.angle = image.angle;
                data.radialType = image.radialType || "ellipse";
                data.radialPosition = image.radialPosition || Position.CENTER;
            } else {
                data.colorsteps = [];
                data.angle = 0;
                data.radialType = "ellipse";
                data.radialPosition = Position.CENTER;
            }

            break;
        }

        return data;
    }


    [CLICK("$fillList .colorsteps .step")](e) {
        this.getRef('colorsteps', this.selectedIndex).$(`[data-selected="true"]`).removeAttr('data-selected')
        var selectColorStepId = e.$delegateTarget.attr("data-colorstep-id");
        e.$delegateTarget.attr('data-selected', true);

        var selectColorStepId = e.$delegateTarget.attr("data-colorstep-id");
        var $preview = e.$delegateTarget.closest("fill-item").$(".preview");
        this.viewFillPicker($preview, selectColorStepId);
    }



    [DRAGSTART("$fillList .fill-item")](e) {
        this.startIndex = +e.$delegateTarget.attr("data-index");
    }

    // drop 이벤트를 걸 때 dragover 가 같이 선언되어 있어야 한다.
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
        var targetIndex = +e.$delegateTarget.attr("data-index");


        this.selectItem(this.startIndex, true);

        this.sortBackgroundImage(this.startIndex, targetIndex);

        this.refresh();

        this.viewFillPicker(this.getRef("preview", this.selectedIndex));

        this.modifyBackgroundImage()

    }



    getCurrentBackgroundImage() {
        return this.state.images[this.selectedIndex];
    }


    [CLICK("$fillList .tools .remove")](e) {
        var removeIndex = e.$delegateTarget.attr("data-index");
        var currentBackgroundImage = this.getCurrentBackgroundImage();

        if (currentBackgroundImage) {
            this.state.images.splice(removeIndex, 1);

            this.refresh();

            this.modifyBackgroundImage()
        }
    }

      // 객체를 선택하는 괜찮은 패턴이 어딘가에 있을 텐데......
    // 언제까지 selected 를 설정해야하는가?
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

    viewFillPicker($preview, selectColorStepId) {
        if (typeof this.selectedIndex === "number") {
            this.selectItem(this.selectedIndex, false);
        }

        this.selectedIndex = +$preview.attr("data-index");
        this.selectItem(this.selectedIndex, true);

        this.currentBackgroundImage =  this.getCurrentBackgroundImage()

        this.emit("showFillPicker", {
            changeEvent: 'changeBackgroundImageEditor',
            ...this.getFillData(this.currentBackgroundImage),
            selectColorStepId,
            refresh: true,
            isImageHidden: true
        });
        this.viewBackgroundPropertyPopup();
    }

    viewBackgroundPropertyPopup(position) {

        this.currentBackgroundImage =  this.getCurrentBackgroundImage()

        const back = this.currentBackgroundImage;

        const x = back.x;
        const y = back.y;
        const width = back.width;
        const height = back.height;
        const repeat = back.repeat;
        const size = back.size;
        const blendMode = back.blendMode;
        const image = back.image;

        const changeEvent = 'changeBackgroundImageEditorProperty'

        this.emit("showBackgroundPropertyPopup", {
            changeEvent,
            image,
            position,
            x,
            y,
            width,
            height,
            repeat,
            size,
            blendMode
        });
        // this.emit("hideFillPicker");
    }

    [CLICK("$fillList .preview")](e) {
        this.viewFillPicker(e.$delegateTarget);
    }

    viewChangeImage(data) {
        var backgroundImage = this.currentBackgroundImage;
        if (!backgroundImage) return;
        var $el = this.getRef("miniView", this.selectedIndex);
        if ($el) {
            $el.css({
                ...backgroundImage.toCSS(),
                "background-size": "cover"
            });
        }

        var $el = this.getRef("fillTitle", this.selectedIndex);
        if ($el) {
            $el.html(names["image"]);
        }

        var $el = this.getRef("colorsteps", this.selectedIndex);
        if ($el) {
            $el.empty();
        }
    }

    setImage(data) {
        if (this.currentBackgroundImage) {
            this.currentBackgroundImage.setImageUrl(data);

            this.viewChangeImage(data);

            this.modifyBackgroundImage()
        }
    }

    [EVENT("selectFillPickerTab")](type, data) {
        var typeName = types[type];
        var $fillItem = this.refs[`fillIndex${this.selectedIndex}`];
        $fillItem.attr("data-fill-type", typeName);
    }

    viewChangeGradient(data) {
        var backgroundImage = this.currentBackgroundImage;

        if (!backgroundImage) return;
        var $el = this.getRef("miniView", this.selectedIndex);
        if ($el) {
            $el.cssText(backgroundImage.toString());
        }

        var $el = this.getRef("fillTitle", this.selectedIndex);
        if ($el) {
            $el.html(names[data.type]);
        }

        var $el = this.getRef("colorsteps", this.selectedIndex);
        if ($el) {
            $el.html(this.getColorStepString(data.colorsteps));
        }
    }

    setGradient(data) {
        // console.log(this.currentBackgroundImage, data);
        if (this.currentBackgroundImage) {
            this.currentBackgroundImage.setGradient(data);
            this.viewChangeGradient(data);

            this.modifyBackgroundImage();
        }
    }

    [EVENT("changeBackgroundImageEditor")](data) {
        switch (data.type) {
        case "image":
            this.setImage(data);
            break;
        default:
            this.setGradient(data);
            break;
        }
    }

    refreshBackgroundPropertyInfo(image, data) {
        if (data.blendMode) {
            var $element = this.getRef(`blendMode`, this.selectedIndex);
            $element.text(data.blendMode);
        } else if (data.width || data.height || data.size) {
            var $element = this.getRef(`size`, this.selectedIndex);

            switch (image.size) {
                case "contain":
                case "cover":
                var text = image.size;
                break;
                default:
                var text = `${image.width}/${image.height}`;
                break;
            }
            $element.text(text);
        } else if (data.repeat) {
            var $element = this.getRef(`repeat`, this.selectedIndex);
            $element.text(data.repeat);
        }
    }

    [EVENT("changeBackgroundImageEditorProperty")](data) {
        if (this.currentBackgroundImage) {
            this.currentBackgroundImage.reset(data);

            this.modifyBackgroundImage();
            this.refreshBackgroundPropertyInfo(this.currentBackgroundImage, data);
        }
    }
}