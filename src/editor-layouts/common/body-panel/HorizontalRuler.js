import { DEBOUNCE, DOMDIFF, LOAD, SUBSCRIBE, THROTTLE } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import './HorizontalRuler.scss';

let pathString = []

export default class HorizontalRuler extends EditorElement {
    template () {
        return /*html*/`
            <div class="elf--horizontal-ruler">
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

            pathString[pathString.length] = `M ${x} ${30 - lineWidth} L ${x} 30 `;
        }

    }     
    
    makeLineText (baseNumber, minX, maxX, realWidth, width, epsilon = 3) {
        const text = [];
        let startX = minX - (minX % baseNumber); 
        let endX = maxX + (maxX % baseNumber); 

        // if (width / realWidth < 1) return;

        const firstX = ((startX - minX)/realWidth) * width; 
        const secondX = ((startX + baseNumber - minX)/realWidth) * width; 

        if (Math.abs(secondX - firstX) < epsilon) return;

        for(var i = startX; i < endX; i += baseNumber) {

            const x = Math.floor(((i - minX)/realWidth) * width);

            text[text.length] = `<text x="${x}" y="${0}" dx="0" dy="8" text-anchor="middle" alignment-baseline="bottom" >${i}</text>`
        }

        return text.join('');
    }         

    makeRulerForCurrentArtboard () {
        const current = this.$selection.current;

        if (!current) return '';

        const currentArtboard = current.artboard;

        if (!currentArtboard) return '';

        const verties = currentArtboard.verties;

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
        const currentMinX = Math.min.apply(Math, xList);
        const currentMaxX = Math.max.apply(Math, xList);

        // viewport 
        const {minX, width: realWidth} = this.$viewport;
        const width = this.state.rect.width;

        const firstX = ((currentMinX - minX)/realWidth) * width; 
        const secondX = ((currentMaxX - minX)/realWidth) * width; 

        return `
            M ${firstX} 15 
            L ${firstX} 20 
            L ${secondX} 20 
            L ${secondX} 15 
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
        this.makeLine(pathString, 10, minX, maxX, realWidth,width, 10, 18, 50);
        this.makeLine(pathString, 5, minX, maxX, realWidth,width, 10, 15, 10);
        this.makeLine(pathString, 1, minX, maxX, realWidth,width, 10, 13, 5);        

        return pathString.join('');
    }    


    makeRulerText () {

        const {minX,maxX, width: realWidth} = this.$viewport;
        const width = this.state.rect.width;

        const dist = Math.abs(maxX - minX);



        return [
            dist > 3000 ? this.makeLineText(500, minX, maxX, realWidth, width, 20) : '',
            (1000 < dist && dist < 3000) ? this.makeLineText(100, minX, maxX, realWidth,width, 20) : '',
            (800 < dist && dist < 1000) ? this.makeLineText(100, minX, maxX, realWidth,width, 20) : '',
            (500 < dist && dist < 800) ? this.makeLineText(100, minX, maxX, realWidth,width, 20) : '',
            (500 < dist && dist < 800) ? this.makeLineText(50, minX, maxX, realWidth,width, 20) : '',
            (200 < dist && dist < 500) ? this.makeLineText(50, minX, maxX, realWidth,width, 20) : '',
            (50 < dist && dist < 200) ? this.makeLineText(10, minX, maxX, realWidth,width, 20) : '',            
            (15 < dist && dist < 50) ? this.makeLineText(5, minX, maxX, realWidth,width, 20) : '',                        
            (0 < dist && dist < 15) ? this.makeLineText(1, minX, maxX, realWidth,width, 20) : '',                                    
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
    
    refresh() {

        if (this.$config.get('show.ruler')) {
            this.load();
        }

    }

    [SUBSCRIBE('updateViewport', 'refreshSelection')] () {
        this.refresh();      
    }

    [SUBSCRIBE('refreshSelectionStyleView') + THROTTLE(10)] () {
        if (this.$selection.current) {
            const current = this.$selection.current;

            if (current.hasChangedField('x', 'y', 'width', 'height', 'transform', 'rotateZ', 'rotate')) {
                this.refresh();
            }

        }
    }

    [SUBSCRIBE('resize.window', 'resizeCanvas')] () {
        this.refreshCanvasSize();
    }    
}