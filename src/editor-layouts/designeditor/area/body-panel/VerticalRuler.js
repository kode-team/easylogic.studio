import { LOAD, DOMDIFF, SUBSCRIBE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

let pathString = []


export default class VerticalRuler extends EditorElement {
    template () {
        return /*html*/`
            <div class="vertical-ruler">
                <div class='vertical-ruler-container' ref='$layerRuler'></div>                                        
                <div class='vertical-ruler-container' ref='$body'></div>
            </div>
        `
    }

    afterRender() {
        this.refreshCanvasSize();
    }

    refreshCanvasSize () {
        this.state.rect = this.$el.rect();
    }    

    makeLine (pathString,  baseNumber, minY, maxY, realHeight, height, epsilon = 3, lineWidth = 30, expect = 10) {
        let startY = minY - (minY % baseNumber); 
        let endY = maxY + (maxY % baseNumber); 

        // if (height / realHeight < 1) return;

        const firstY = ((startY - minY)/realHeight) * height; 
        const secondY = ((startY + baseNumber - minY)/realHeight) * height; 

        if (Math.abs(secondY - firstY) < epsilon) return;

        for(var i = startY; i < endY; i += baseNumber) {

            if (i != 0 && i % expect === 0) continue;

            const y = Math.floor(((i - minY)/realHeight) * height);

            pathString.push(`M ${30 - lineWidth} ${y} L 30 ${y}`);
        }

    }    
    
    makeLineText (baseNumber, minY, maxY, realHeight, height, epsilon = 3) {
        const text = [];
        let startY = minY - (minY % baseNumber); 
        let endY = maxY + (maxY % baseNumber); 

        // if (height / realHeight < 1) return;

        const firstY = ((startY - minY)/realHeight) * height; 
        const secondY = ((startY + baseNumber - minY)/realHeight) * height; 

        if (Math.abs(secondY - firstY) < epsilon) return;

        for(var i = startY; i < endY; i += baseNumber) {

            const y = Math.floor(((i - minY)/realHeight) * height);

            text.push(`<text x="${1}" y="${y}" dy="6" dominant-baseline="central" transform="rotate(-90, 1, ${y})">${i}</text>`)
        }

        return text.join('');
    }        

    makeRulerForCurrentArtboard () {
        const current = this.$selection.current;

        if (!current) return '';

        const currentArtboard = current.artboard;

        if (!currentArtboard) return '';

        const verties = currentArtboard.verties;

        const {minY,maxY, height: realHeight} = this.$viewport;
        const height = this.state.rect.height;

        const firstY = ((verties[0][1] - minY)/realHeight) * height; 
        const secondY = ((verties[2][1] - minY)/realHeight) * height; 

        return `
            M 20 ${firstY}
            L 30 ${firstY}
            L 30 ${secondY}
            L 20 ${secondY}
            Z
        `
    }

    makeRulerForCurrent () {
        const current = this.$selection.current;

        if (!current) return '';

        // viewport 
        const {minY, height: realHeight} = this.$viewport;
        const height = this.state.rect.height;

        // current
        const verties = this.$selection.verties;
        const yList = verties.map(it => it[1]);
        const currentMinY = Math.min.apply(Math, yList);
        const currentMaxY = Math.max.apply(Math, yList);

        const firstY = ((currentMinY - minY)/realHeight) * height; 
        const secondY = ((currentMaxY - minY)/realHeight) * height; 

        return `
            M 15 ${firstY}
            L 20 ${firstY}
            L 20 ${secondY}
            L 15 ${secondY}
            Z
        `
    }

    makeRuler () {

        const {minY,maxY, height: realHeight} = this.$viewport;
        const height = this.state.rect.height;

        pathString = []
    
        this.makeLine(pathString, 200, minY, maxY, realHeight, height, 10, 18, 10000);        
        this.makeLine(pathString, 100, minY, maxY, realHeight,height, 10, 18, 200);
        this.makeLine(pathString, 50, minY, maxY, realHeight,height, 10, 18, 100);
        this.makeLine(pathString, 10, minY, maxY, realHeight,height, 10, 18, 50);
        this.makeLine(pathString, 5, minY, maxY, realHeight,height, 10, 15, 10);
        this.makeLine(pathString, 1, minY, maxY, realHeight,height, 10, 14, 5);        

        return pathString.join('');
    }    

    makeRulerText () {

        const {minY,maxY, height: realHeight} = this.$viewport;
        const height = this.state.rect.height;

        const dist = Math.abs(maxY - minY);

        return [
            dist > 3000 ? this.makeLineText(500, minY, maxY, realHeight, height, 20) : '',
            (1000 < dist && dist < 3000) ? this.makeLineText(100, minY, maxY, realHeight,height, 20) : '',
            (800 < dist && dist < 1000) ? this.makeLineText(100, minY, maxY, realHeight,height, 20) : '',
            (500 < dist && dist < 800) ? this.makeLineText(100, minY, maxY, realHeight,height, 20) : '',
            (500 < dist && dist < 800) ? this.makeLineText(50, minY, maxY, realHeight,height, 20) : '',
            (200 < dist && dist < 500) ? this.makeLineText(50, minY, maxY, realHeight,height, 20) : '',
            (50 < dist && dist < 200) ? this.makeLineText(10, minY, maxY, realHeight,height, 20) : '',            
            (15 < dist && dist < 50) ? this.makeLineText(5, minY, maxY, realHeight,height, 20) : '',                        
            (0 < dist && dist < 15) ? this.makeLineText(1, minY, maxY, realHeight,height, 20) : '',                                    
        ].join('');
    }

    [LOAD('$body') + DOMDIFF] () { 

        if (!this.state.rect || this.state.rect.width == 0) {
            this.state.rect = this.$el.rect();
        }

        return /*html*/`
            <svg width="100%" height="100%" overflow="hidden">
                <path d="${this.makeRuler()}" fill="transparent" stroke-width="0.5" stroke="white" transform="translate(0, 0.5)" />
                ${this.makeRulerText()}
            </svg>
        `
    }

    [LOAD('$layerRuler') + DOMDIFF] () { 

        if (!this.state.rect || this.state.rect.width == 0) {
            this.state.rect = this.$el.rect();
        }

        return /*html*/`
            <svg width="100%" height="100%" overflow="hidden">
                <path d="${this.makeRulerForCurrent()}" fill="rgba(100, 255, 255, 0.5)" />
            </svg>
        `
    }    

    refresh() {
        if (this.$config.get('ruler.show')) {
            this.load();
        }

    }    

    [SUBSCRIBE('updateViewport')] () {
        this.refresh();
    }

    [SUBSCRIBE('refreshSelectionStyleView')] () {
        if (this.$selection.current) {
            const current = this.$selection.current;

            if (current.hasChangedField('x', 'y', 'width', 'height', 'transform', 'rotateZ', 'rotate')) {
                this.refresh();
            }

        }
    }

    [SUBSCRIBE('refreshSelection')] () {
        this.load('$layerRuler');      
    }    

    [SUBSCRIBE('resize.window', 'resizeCanvas')] () {
        this.refreshCanvasSize();
    }        
}