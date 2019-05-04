import { editor } from "./editor";
import { Layer } from "./items/Layer";
import { Segment } from "./util/Segment";

class GridItemPositionCalc {

    clear () {
        this.direction = null; 
        this.newRect = null;
        this.rect = null; 
    }

    initialize (direction) {
        this.direction = direction || editor.config.get('selection.direction');
        this.newRect = editor.selection.rect();
        this.rect = this.newRect.clone();
    }

    calculate (dx, dy) {
        var e = editor.config.get('bodyEvent');

        var isAlt = e.altKey;
        var direction = this.direction;

        if (Segment.isMove(direction)) {  this.calculateMove(dx, dy, {isAlt}); }
        else {
            if (Segment.isRight(direction)) {  this.calculateRight(dx, dy, {isAlt}); }
            if (Segment.isBottom(direction)) {  this.calculateBottom(dx, dy, {isAlt}); } 
            if (Segment.isTop(direction)) { this.calculateTop(dx, dy, {isAlt}); } 
            if (Segment.isLeft(direction)) { this.calculateLeft(dx, dy, {isAlt}); }
        }

    }

    setupX (cacheItem) {
        var minX = this.rect.screenX.value; 
        var maxX = this.rect.screenX2.value; 
        var width = maxX - minX; 

        var xDistRate = (cacheItem.screenX.value - minX) / width;
        var x2DistRate = (cacheItem.screenX2.value - minX) / width;

        return {xDistRate, x2DistRate}
    }    


    setupY (cacheItem) {
        var minY = this.rect.screenY.value; 
        var maxY = this.rect.screenY2.value; 
        var height = maxY - minY; 

        var yDistRate = (cacheItem.screenY.value - minY) / height;
        var y2DistRate = (cacheItem.screenY2.value - minY) / height;

        return {yDistRate, y2DistRate}
    }


    setY (item, minY, maxY, yrate, y2rate) {
        var distY = Math.round(yrate);
        var distY2 = Math.round(y2rate);
        var height = distY2 - distY;

        item.y.set(distY + minY) 
        if (item instanceof Layer) {
            item.y.sub(editor.get(item.parentPosition).screenY)
        }

        item.height.set(height )
    }


    setX (item, minX, maxX, xrate, x2rate) {
        var distX = Math.round(xrate);
        var distX2 = Math.round(x2rate);
        var width = distX2 - distX;

        item.x.set(distX + minX) 
        if (item instanceof Layer) {
            item.x.sub(editor.get(item.parentPosition).screenX)
        }

        item.width.set(width )
    }


    calculateMove (dx, dy, opt) {
        this.newRect.x.set(this.rect.x.value + dx);
        this.newRect.y.set(this.rect.y.value + dy);
    }    

    calculateRight (dx, dy, opt) {

        var minX = this.rect.screenX.value;
        var maxX = this.rect.screenX2.value; 

        if (maxX + dx >= minX) {
            var newX = maxX + dx
            var dist = newX - minX; 
            this.newRect.width.set(dist);
        }
    }

    calculateBottom (dx, dy, opt) {    
        var minY = this.rect.screenY.value;
        var maxY = this.rect.screenY2.value; 
        var centerY = this.rect.centerY.value;

        var newY = minY;        
        var newY2 = maxY + dy ; 

        if (newY2 < minY) {
            this.newRect.y.set(minY);
            this.newRect.height.set(1);                           
            return;            
        }

        if (opt.isAlt && newY2 < centerY) {
            this.newRect.y.set(centerY);
            this.newRect.height.set(1);                           
            return;
        }

        if (opt.isAlt) newY -= dy; 

        var dist = newY2 - newY; 
        this.newRect.y.set(newY);
        this.newRect.height.set(dist);

  
    }


    calculateTop (dx, dy, opt) {   
        var minY = this.rect.screenY.value;
        var maxY = this.rect.screenY2.value; 
        var centerY = this.rect.centerY.value; 

        var newY = minY + dy; 
        var newY2 = maxY;

        if (newY > maxY) {
            this.newRect.y.set(maxY-1);
            this.newRect.height.set(1);
            return;                            
        }

        if (opt.isAlt && newY > centerY) {
            this.newRect.y.set(centerY);
            this.newRect.height.set(1);                
            return;
        }

        if (opt.isAlt) newY2 += -dy; 

        var dist = newY2 - newY; 
        this.newRect.y.set(newY);
        this.newRect.height.set(dist);

    }


    calculateLeft (dx, dy) {
        var minX = this.rect.screenX.value;
        var maxX = this.rect.screenX2.value; 

        var newX = minX + dx; 

        if (newX <= maxX) {
            var dist = maxX - newX; 
            this.newRect.x.set(newX);
            this.newRect.width.set(dist);
        }
    }

}

export const gridItemPositionCalc = new GridItemPositionCalc()