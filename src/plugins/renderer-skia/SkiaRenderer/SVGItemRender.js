import Color from "el/base/Color";
import Dom from "el/base/Dom";
import { Item } from "el/editor/items/Item";
import { SVGFill } from "el/editor/property-parser/SVGFill";
import LayerRender from "./LayerRender";

export default class SVGItemRender extends LayerRender {

 
    /**
     * Def 업데이트 하기 
     * 
     * @param {Item} item 
     * @param {Dom} currentElement 
     */
    updateDefString (item, currentElement) {

        var $defs = currentElement.$('defs');
        if ($defs) {
            $defs.updateSVGDiff(`<defs>${this.toDefInnerString(item)}</defs>`)
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

    cachedStroke(item) {

        if (item.getCache('__cachedStroke') === item.stroke && item.getCache('__parsedStroke')) {
            return item.getCache('__parsedStroke');
        }

        item.addCache('__cachedStroke', item.stroke);
        item.addCache('__parsedStroke', SVGFill.parseImage(item.stroke || 'black'));

        return item.getCache('__parsedStroke');
    }

    cachedFill(item) {

        if (item.getCache('__cachedFill') === item.fill && item.getCache('__parsedFill')) {
            return item.getCache('__parsedFill');
        }

        item.addCache('__cachedFill', item.fill);
        item.addCache('__parsedFill', SVGFill.parseImage(item.fill || 'black'));

        return item.getCache('__parsedFill');
    }    


    toFillSVG (item) {
        const fillValue = this.cachedFill(item);
        return fillValue.toSVGString(this.fillId(item));
    }

    toStrokeSVG (item) { 
        const strokeValue = this.cachedStroke(item);
        return strokeValue.toSVGString(this.strokeId(item));
    }  

    toFillValue (item) {

        const fillValue = this.cachedFill(item);

        return  fillValue.toFillValue(this.fillId(item)); 
    }

    toFillOpacityValue (item) {
        return  Color.parse(item.fill || 'transparent').a;
    }  

    toStrokeValue (item) {

        const strokeValue = this.cachedStroke(item);

        return strokeValue.toFillValue(this.strokeId(item));
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

    /**
     * 
     * @param {Item} item 
     */
    toSVGAttribute (item) {
        return this.toDefaultCSS(item);
    }
}