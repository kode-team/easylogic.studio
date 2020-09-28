import Color from "@core/Color";
import Dom from "@core/Dom";
import { Item } from "@items/Item";
import { SVGFill } from "@property-parser/SVGFill";
import SVGLayerRender from "./SVGLayerRender";

export default class SVGItemRender extends SVGLayerRender {


    /**
     * Def 업데이트 하기 
     * 
     * @param {Item} item 
     * @param {Dom} currentElement 
     */
    updateDefString (item, currentElement) {

        var $defs = currentElement.$('defs');
        if ($defs) {
            $defs.html(this.toDefInnerString(item))          
        } else {
            var str = this.toDefString(item).trim();
            currentElement.prepend(Dom.createByHTML(str));
        }      
    }  

    /**
     * 
     * @param {Item} item 
     */
    toDefInnerString (item) {
        return /*html*/`
            ${this.toFillSVG(item)}
            ${this.toStrokeSVG(item)}
        `
    }

    /**
     * 
     * @param {Item} item 
     */
    toDefString (item) {

        const str = this.toDefInnerString(item).trim();

        return /*html*/`
            <defs>
            ${str}
            </defs>
        `
    }

    fillId (item) {
        return this.getInnerId(item, 'fill')
    }

    strokeId (item) {
        return this.getInnerId(item, 'stroke')
    }

    toFillSVG (item) {
        return SVGFill.parseImage(item.fill || 'transparent').toSVGString(this.fillId(item));
    }

    toStrokeSVG (item) {
        return SVGFill.parseImage(item.stroke || 'black').toSVGString(this.strokeId(item));
    }  

    toFillValue (item) {
        return  SVGFill.parseImage(item.fill || 'transparent').toFillValue(this.fillId(item));
    }

    toFillOpacityValue (item) {
        return  Color.parse(item.fill || 'transparent').a;
    }  

    toStrokeValue (item) {
        return  SVGFill.parseImage(item.stroke || 'black').toFillValue(this.strokeId(item));
    }  

    toFilterValue (item) {

        if (!item.svgfilter) {
            return '';
        }

        return `url(#${item.svgfilter})`
    }

    /**
     * @override
     * @param {Item} item
     */
    toLayoutCSS(item) {
        return {}
    }

    /**
     * 
     * @param {Item} item 
     */
    toDefaultCSS(item) {
        return {
            ...super.toDefaultCSS(item),
            ...this.toKeyListCSS(item, [
                'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
                'fill-opacity', 'fill-rule', 'text-anchor'
            ])
        }
    }

    toSVGAttribute () {
        return {
            ...this.toDefaultSVGCSS(),
            ...this.toKeyListCSS(
                'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
                'fill-opacity', 'fill-rule', 'text-anchor'
            )
        }
    }
}