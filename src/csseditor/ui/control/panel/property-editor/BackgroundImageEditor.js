import UIElement, { EVENT } from "../../../../../util/UIElement";
import { BackgroundImage } from "../../../../../editor/css-property/BackgroundImage";
import { LOAD, CLICK, DRAGSTART, DRAGOVER, DROP, PREVENT, DEBOUNCE } from "../../../../../util/Event";
import icon from "../../../icon/icon";
import { keyEach, combineKeyArray, CSS_TO_STRING } from "../../../../../util/functions/func";


const names = {
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
    "static-gradient": "gradient",
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
           if (key != '') {
            style[key] = value; 
           }
        })

        return BackgroundImage.parseStyle(style);
    }

    template () {
        return `
            <div class='background-image-editor' >
                <div class='label'>
                    <label>${this.props.title||''}</label>
                    <div class='tools'>
                        <button type="button" ref='$add'>${icon.add} ${this.props.title ? '' : 'Add'}</button>
                    </div>
                </div>
                <div class='fill-list' ref='$fillList'></div>
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
    
        return '';
    }

    getColorStepString(colorsteps) {
        return colorsteps
            .map((step, index) => {
                return `<div class='step' data-index="${index}" data-cut="${step.cut}" data-selected='${step.selected}' style='background-color:${step.color};'></div>`;
            })
            .join('');
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


    [CLICK("$fillList .colorsteps .step")](e) {
        this.getRef('colorsteps', this.selectedIndex).$(`[data-selected="true"]`).removeAttr('data-selected')
        e.$delegateTarget.attr('data-selected', true);

        var selectColorStepIndex = e.$delegateTarget.attr("data-index");
        var $preview = e.$delegateTarget.closest("fill-item").$(".preview");
        this.viewFillPopup($preview, selectColorStepIndex);
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

        this.viewFillPopup(this.getRef("preview", this.selectedIndex));

        this.modifyBackgroundImage()

    }



    getCurrentBackgroundImage() {
        return this.state.images[this.selectedIndex];
    }


    [CLICK("$fillList .tools .remove")](e) {
        var removeIndex = +e.$delegateTarget.attr("data-index");

        this.state.images.splice(removeIndex, 1);

        this.refresh();

        this.modifyBackgroundImage()
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

    viewFillPopup($preview, selectColorStepIndex) {
        if (typeof this.selectedIndex === "number") {
            this.selectItem(this.selectedIndex, false);
        }

        this.selectedIndex = +$preview.attr("data-index");
        this.selectItem(this.selectedIndex, true);

        this.currentBackgroundImage =  this.getCurrentBackgroundImage()


        const back = this.currentBackgroundImage;

        const x = back.x;
        const y = back.y;
        const width = back.width;
        const height = back.height;
        const repeat = back.repeat;
        const size = back.size;
        const blendMode = back.blendMode;

        this.emit("showFillPopup", {
            hideBackgroundProperty: false,
            changeEvent: 'changeBackgroundImageEditor',
            x,
            y,
            width,
            height,
            repeat,
            size,
            blendMode,            
            // 왜 그런지는 모르겠지만 image 를 객체 그대로 넘기니 뭔가 맞지 않아서  문자열로 변환해서 넘긴다. 
            image: this.currentBackgroundImage.image + '',  
            selectColorStepIndex,
            refresh: true,
            isImageHidden: true
        });
    }

    [CLICK("$fillList .preview")](e) {
        this.viewFillPopup(e.$delegateTarget);
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

    [EVENT("selectFillPopupTab")](type, data) {
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

    [EVENT("changeBackgroundProperty") + DEBOUNCE(10)](data) {
        if (this.currentBackgroundImage) {
            this.currentBackgroundImage.reset(data);

            this.modifyBackgroundImage();
        }
    }
}