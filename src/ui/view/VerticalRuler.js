import { LOAD, DOMDIFF } from "@core/Event";
import UIElement, { EVENT } from "@core/UIElement";

let pathString = []


export default class VerticalRuler extends UIElement {
    template () {
        return /*html*/`
            <div class="vertical-ruler">
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

            pathString.push(`M ${30 - lineWidth} ${y}`);
            pathString.push(`L 30 ${y}`);
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

            text.push(`<text x="${1}" y="${y}" dy="-2" text-anchor="start" fill="white" font-size="8" alignment-baseline="bottom" >${i}</text>`)
        }

        return text.join('');
    }        

    makeRulerForCurrentArtboard () {
        const current = this.$selection.current;

        if (!current) return '';

        const currentArtboard = current.artboard;

        if (!currentArtboard) return '';

        const verties = currentArtboard.verties();

        const minY = this.$viewport.verties[0][1]
        const maxY = this.$viewport.verties[2][1];
        const height = this.state.rect.height;

        const firstY = ((verties[0][1] - minY)/(maxY - minY)) * height; 
        const secondY = ((verties[2][1] - minY)/(maxY - minY)) * height; 

        return `
            M 0 ${firstY}
            L 30 ${firstY}
            L 30 ${secondY}
            L 0 ${secondY}
            Z
        `
    }

    makeRulerForCurrent () {
        const current = this.$selection.current;

        if (!current) return '';

        const verties = this.$selection.verties;

        const minY = this.$viewport.verties[0][1]
        const maxY = this.$viewport.verties[2][1];
        const height = this.state.rect.height;

        const firstY = ((verties[0][1] - minY)/(maxY - minY)) * height; 
        const secondY = ((verties[2][1] - minY)/(maxY - minY)) * height; 

        return `
            M 0 ${firstY}
            L 30 ${firstY}
            L 30 ${secondY}
            L 0 ${secondY}
            Z
        `
    }

    makeRuler () {

        const minY = this.$viewport.verties[0][1]
        const maxY = this.$viewport.verties[2][1];
        const realHeight = maxY - minY;
        const height = this.state.rect.height;

        pathString = []
    
        this.makeLine(pathString, 200, minY, maxY, realHeight, height, 5, 30, 10000);        
        this.makeLine(pathString, 100, minY, maxY, realHeight,height, 5, 30, 200);
        this.makeLine(pathString, 50, minY, maxY, realHeight,height, 5, 18, 100);
        this.makeLine(pathString, 10, minY, maxY, realHeight,height, 5, 15, 50);
        this.makeLine(pathString, 5, minY, maxY, realHeight,height, 5, 12, 10);
        this.makeLine(pathString, 1, minY, maxY, realHeight,height, 5, 10, 5);        
        this.makeLine(pathString, 0.5, minY, maxY, realHeight,height, 5, 5, 1);

        return pathString.join('');
    }    

    makeRulerText () {

        const minY = this.$viewport.verties[0][1]
        const maxY = this.$viewport.verties[2][1];
        const realHeight = maxY - minY;
        const height = this.state.rect.height;

        return [
            this.makeLineText(200, minY, maxY, realHeight, height, 5, 25, 10000),            
            this.makeLineText(100, minY, maxY, realHeight,height, 5, 22, 200),
            this.makeLineText(50, minY, maxY, realHeight,height, 20, 18, 100),
            this.makeLineText(10, minY, maxY, realHeight,height, 40, 15, 50),
            this.makeLineText(5, minY, maxY, realHeight,height, 60, 12, 10)            
        ].join('');
    }

    [LOAD('$body')] () { 

        if (!this.state.rect || this.state.rect.width == 0) {
            this.state.rect = this.$el.rect();
        }

        return /*html*/`
            <svg width="100%" height="100%" overflow="hidden">
                <path d="${this.makeRulerForCurrentArtboard()}" fill="rgba(100, 100, 255, 0.6)" />
                <path d="${this.makeRulerForCurrent()}" fill="rgba(100, 255, 255, 0.5)" />
                <path d="${this.makeRuler()}" fill="transparent" stroke-width="0.5" stroke="white" transform="translate(0, 0.5)" />
                ${this.makeRulerText()}
            </svg>
        `
    }

    [EVENT('updateViewport', 'refreshSelection', 'refreshRect')] () {
        this.refresh();      
    }

    [EVENT('resize.window', 'resizeCanvas')] () {
        this.refreshCanvasSize();
    }    
}