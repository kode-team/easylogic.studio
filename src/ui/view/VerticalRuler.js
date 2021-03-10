import { LOAD, DOMDIFF } from "@core/Event";
import { registElement } from "@core/registerElement";
import UIElement, { EVENT } from "@core/UIElement";

let pathString = []


export default class VerticalRuler extends UIElement {
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
    
    makeLineText (baseNumber, minY, maxY, realHeight, height, epsilon = 3, lineWidth = 30, expect = 10) {
        const text = [];
        let startY = minY - (minY % baseNumber); 
        let endY = maxY + (maxY % baseNumber); 

        // if (height / realHeight < 1) return;

        const firstY = ((startY - minY)/realHeight) * height; 
        const secondY = ((startY + baseNumber - minY)/realHeight) * height; 

        if (Math.abs(secondY - firstY) < epsilon) return;

        for(var i = startY; i < endY; i += baseNumber) {

            if (i > 0 && i % expect === 0) continue;

            const y = Math.floor(((i - minY)/realHeight) * height);

            text.push(`<text x="${1}" y="${y}" dy="3" dx="-4" transform="rotate(270, 5, ${y})">${i}</text>`)
        }

        return text.join('');
    }        

    makeRulerForCurrentArtboard () {
        const current = this.$selection.current;

        if (!current) return '';

        const currentArtboard = current.artboard;

        if (!currentArtboard) return '';

        const verties = currentArtboard.verties();

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
        const {minY,maxY, height: realHeight} = this.$viewport;
        const height = this.state.rect.height;

        // current
        const verties = this.$selection.verties;
        const yList = verties.map(it => it[1]);
        const currentMinY = Math.min.apply(Math, yList);
        const currentMaxY = Math.max.apply(Math, yList);

        const firstY = ((currentMinY - minY)/realHeight) * height; 
        const secondY = ((currentMaxY - minY)/realHeight) * height; 

        return `
            M 10 ${firstY}
            L 20 ${firstY}
            L 20 ${secondY}
            L 10 ${secondY}
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
        this.makeLine(pathString, 5, minY, maxY, realHeight,height, 10, 18, 10);
        this.makeLine(pathString, 1, minY, maxY, realHeight,height, 10, 18, 5);        
        this.makeLine(pathString, 0.5, minY, maxY, realHeight,height, 10, 18, 1);

        return pathString.join('');
    }    

    makeRulerText () {

        const {minY,maxY, height: realHeight} = this.$viewport;
        const height = this.state.rect.height;

        return [
            this.makeLineText(200, minY, maxY, realHeight, height, 5, 25, 10000),            
            this.makeLineText(100, minY, maxY, realHeight,height, 5, 22, 200),
            this.makeLineText(50, minY, maxY, realHeight,height, 20, 18, 100),
            this.makeLineText(10, minY, maxY, realHeight,height, 20, 15, 50),
            this.makeLineText(5, minY, maxY, realHeight,height, 20, 12, 10),            
            this.makeLineText(1, minY, maxY, realHeight,height, 20, 10, 5),
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

    [EVENT('updateViewport')] () {
        this.refresh();      
    }

    [EVENT('refreshSelection', 'refreshRect')] () {
        this.load('$layerRuler');      
    }    

    [EVENT('resize.window', 'resizeCanvas')] () {
        this.refreshCanvasSize();
    }        
}

registElement({ VerticalRuler })