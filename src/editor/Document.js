import { editor } from "./editor";
import { keyEach, isString } from "../../../util/functions/func";
import { Project } from "./Project";
import { ArtBoard } from "./ArtBoard";
import { Group } from "./Group";
import { Layer } from "./Layer";
import { ClipPath } from "./css-property/ClipPath";
import { ImageResource } from "./image-resource/ImageResource";
import { ColorStep } from "./image-resource/ColorStep";
import { BackgroundImage } from "./css-property/BackgroundImage";
import { Filter } from "./css-property/Filter";
import { BackdropFilter } from "./css-property/BackdropFilter";
import { BoxShadow } from "./css-property/BoxShadow";
import { MaskImage } from "./css-property/MaskImage";
import { TextShadow } from "./css-property/TextShadow";
import { LinearGradient } from "./image-resource/LinearGradient";
import { RadialGradient } from "./image-resource/RadialGradient";
import { RepeatingRadialGradient } from "./image-resource/RepeatingRadialGradient";
import { RepeatingConicGradient } from "./image-resource/RepeatingConicGradient";
import { Rect } from "./shape/Rect";
import { Circle } from "./shape/Circle";
import { Shape } from "./shape/Shape";
import { StaticGradient } from "./image-resource/StaticGradient";


const ClassList = {
    'project': Project,
    'artboard': ArtBoard,
    'directory': Directory,
    'layer': Layer,
    'clip-path': ClipPath,
    'image-resource': ImageResource,
    'colorstep': ColorStep,
    'background-image': BackgroundImage,
    'filter': Filter,
    'backdrop-filter': BackdropFilter,
    'box-shadow': BoxShadow,
    'mask-image': MaskImage,
    'text-shadow': TextShadow
}

const LayerClassList = {
    'rect': Rect,
    'circle' : Circle,
    'shape': Shape
}


const ImageResourceClassList = {
    'static-gradient': StaticGradient,
    'linear-gradient': LinearGradient,
    'repeating-linear-gradient': RepeatingLinearGradient,
    'radial-gradient': RadialGradient,
    'repeating-radial-gradient': RepeatingRadialGradient,
    'conic-gradient': ConicGradient,
    'repeating-conic-gradient': RepeatingConicGradient,        
    'url': URLImageResource
}

const ItemTypeClassList = {
    'layer': LayerClassList,
    'image-resource': ImageResourceClassList
}

var getDefinedClass = (itemType, type) => {
    const classList = ItemTypeClassList[itemType];

    if (classList) {
        return classList[item.type]
    }

}

export class Document {
    static toJSON () {
        return JSON.stringify(editor.all)
    }

    static load (json) {
        editor.clear();
        if (isString(json)) {
            json = JSON.parse(json);
        }

        keyEach(json, (id, item) => {
            let BaseClass = ClassList[item.itemType]

            const childClass = getDefinedClass(item.itemType, item.type);

            if (childClass) {
                BaseClass = childClass;
            }

            editor.set(id, new BaseClass(item));
        })
    }
}