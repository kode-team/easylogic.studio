import { DOMDIFF, LOAD } from "@core/Event";
import UIElement, { EVENT } from "@core/UIElement";

let pathString = []

export default class HorizontalRuler extends UIElement {
    template () {
        return /*html*/`
            <div class="horizontal-ruler">
                <div class='horizontal-ruler-container' ref='$layerRuler'></div>                            
                <div class='horizontal-ruler-container' ref='$ruler'></div>
            </div>
        `
    }

    afterRender() {
        this.refreshCanvasSize();
    }

    refreshCanvasSize () {
        this.state.rect = this.$el.rect();
    }    

    makeLine (pathString,  baseNumber, minX, maxX, realWidth, width, epsilon = 3, lineWidth = 30, expect = 10) {
        let startX = minX - (minX % baseNumber); 
        let endX = maxX + (maxX % baseNumber); 

        // if (width / realWidth < 1) return;

        const firstX = ((startX - minX)/realWidth) * width; 
        const secondX = ((startX + baseNumber - minX)/realWidth) * width; 

        if (Math.abs(secondX - firstX) < epsilon) return;

        for(var i = startX; i < endX; i += baseNumber) {

            if (i != 0 && i % expect === 0) continue;

            const x = Math.floor(((i - minX)/realWidth) * width);

            pathString.push(`M ${x} ${30 - lineWidth} L ${x} 30 `);
        }

    }     
    
    makeLineText (baseNumber, minX, maxX, realWidth, width, epsilon = 3, lineWidth = 30, expect = 10) {
        const text = [];
        let startX = minX - (minX % baseNumber); 
        let endX = maxX + (maxX % baseNumber); 

        // if (width / realWidth < 1) return;

        const firstX = ((startX - minX)/realWidth) * width; 
        const secondX = ((startX + baseNumber - minX)/realWidth) * width; 

        if (Math.abs(secondX - firstX) < epsilon) return;

        for(var i = startX; i < endX; i += baseNumber) {

            if (i != 0 && i % expect === 0) continue;

            const x = Math.floor(((i - minX)/realWidth) * width);

            text.push(`<text x="${x}" y="${0}" dx="2" dy="8" text-anchor="middle" alignment-baseline="bottom" >${i}</text>`)
        }

        return text.join('');
    }         

    makeRulerForCurrentArtboard () {
        const current = this.$selection.current;

        if (!current) return '';

        const currentArtboard = current.artboard;

        if (!currentArtboard) return '';

        const verties = currentArtboard.verties();

        const {minX, maxX, width: realWidth} = this.$viewport;
        const width = this.state.rect.width;

        const firstX = ((verties[0][0] - minX)/realWidth) * width; 
        const secondX = ((verties[2][0] - minX)/realWidth) * width; 

        return `
            M ${firstX} 20 
            L ${firstX} 30 
            L ${secondX} 30 
            L ${secondX} 20 
            Z
        `
    }

    makeRulerForCurrent () {
        const current = this.$selection.current;

        if (!current) return '';


        // current
        const verties = this.$selection.verties;
        const xList = verties.map(it => it[0]);
        const currentMinX = Math.min(...xList);
        const currentMaxX = Math.max(...xList);

        // viewport 
        const {minX, width: realWidth} = this.$viewport;
        const width = this.state.rect.width;

        const firstX = ((currentMinX - minX)/realWidth) * width; 
        const secondX = ((currentMaxX - minX)/realWidth) * width; 

        return `
            M ${firstX} 10 
            L ${firstX} 20 
            L ${secondX} 20 
            L ${secondX} 10 
            Z
        `
    }

    makeRuler () {

        const {minX,maxX, width: realWidth} = this.$viewport;
        const width = this.state.rect.width;

        pathString = []
    
        this.makeLine(pathString, 200, minX, maxX, realWidth, width, 10, 20, 10000);        
        this.makeLine(pathString, 100, minX, maxX, realWidth,width, 10, 20, 200);
        this.makeLine(pathString, 50, minX, maxX, realWidth,width, 10, 20, 100);
        this.makeLine(pathString, 10, minX, maxX, realWidth,width, 10, 20, 50);
        this.makeLine(pathString, 5, minX, maxX, realWidth,width, 10, 20, 10);
        this.makeLine(pathString, 1, minX, maxX, realWidth,width, 10, 20, 5);        
        this.makeLine(pathString, 0.5, minX, maxX, realWidth,width, 10, 20, 1);

        return pathString.join('');
    }    


    makeRulerText () {

        const {minX,maxX, width: realWidth} = this.$viewport;
        const width = this.state.rect.width;

        return [
            this.makeLineText(200, minX, maxX, realWidth, width, 5, 25, 10000),
            this.makeLineText(100, minX, maxX, realWidth,width, 5, 20, 200),
            this.makeLineText(50, minX, maxX, realWidth,width, 20, 18, 100),
            this.makeLineText(10, minX, maxX, realWidth,width, 20, 15, 50),
            this.makeLineText(5, minX, maxX, realWidth,width, 20, 13, 10),    
            this.makeLineText(1, minX, maxX, realWidth,width, 20, 20, 5),
        ].join('');
    }    

    [LOAD('$ruler') + DOMDIFF] () { 

        if (!this.state.rect || this.state.rect.width == 0) {
            this.state.rect = this.$el.rect();
        }

        return /*html*/`
            <svg width="100%" width="100%" overflow="hidden">
                <path d="${this.makeRuler()}" fill="transparent" stroke-width="0.5" stroke="white" transform="translate(0.5, 0)" />
                ${this.makeRulerText()}                
            </svg>
        `
    }

    [LOAD('$layerRuler') + DOMDIFF] () { 

        if (!this.state.rect || this.state.rect.width == 0) {
            this.state.rect = this.$el.rect();
        }

        return /*html*/`
            <svg width="100%" width="100%" overflow="hidden">
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