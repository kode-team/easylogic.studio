import UIElement, { EVENT } from "@sapa/UIElement";
import { Length } from "@unit/Length";
import { LOAD, POINTERSTART, MOVE, END, CLICK, IF, PREVENT } from "@sapa/Event";
import { Offset } from "@property-parser/Offset";
import Dom from "@sapa/Dom";
import { isUndefined } from "@sapa/functions/func";
import "./CSSPropertyEditor";
import "./RangeEditor";
import "./InputRangeEditor";
import { registElement } from "@sapa/registerElement";


export default class OffsetEditor extends UIElement {

  initState() {
    return {
      offsets: []
    };
  }

  updateData(opt) {
    this.setState(opt, false); 
    this.modifyOffset();
  }

  modifyOffset () {
    this.emit("changeOffsetEditor", this.state);  
  }

  template() {
    return /*html*/`
    <div class='editor offset-editor' ref='$editor'>
        ${this.templateForOffset()}
        ${this.templateForOffsetInput()}
        ${this.templateForProperty()}        
    </div>`;
  }



  templateForOffsetInput () {
    return /*html*/`
      <div class='offset-input' >
        <div class='title'>
          <label>Offset</label>
          <div class='tools'>
            <object refClass="InputRangeEditor" 
              key='offset' 
              min='0' 
              max='100' 
              step="0.01" 
              value="${Length.percent(0)}" 
              ref='$offsetInput' 
              units="%" 
              onchange='changeRangeEditor' 
            />
          </div>
        </div>
      </div>
    `
  }

  [EVENT('changeRangeEditor')] (key, value) {
    var offset = this.state.offsets[this.selectedIndex];
    if (offset) {
      offset.offset = value.clone()
      this.refresh();      
      this.modifyOffset();      
    }
  }

  templateForProperty() {
    return /*html*/`<object refClass="CSSPropertyEditor" ref='$offsetPropertyEditor' hide-refresh="true" onchange='changeCSSPropertyEditor' />`
  }  

  templateForOffset () {
    return `<div class='offset' ref='$offset' data-selected-value="-1"></div>`
  }

  makeOffset (offset, index) {
    return `<div class='offset-item' style='left: ${offset.offset};' data-offset-index='${index.toString()}'></div>`
  }


  
  selectItem(selectedIndex, isSelected = true) {
    
    if (isUndefined(selectedIndex)) {
      selectedIndex = -1; 
      for(var i = 0, len = this.state.offsets.length; i < len; i++) {
        if (this.state.offsets[i].selected) {
          selectedIndex = i;
          break; 
        }
      }

      if (selectedIndex === -1) {
        selectedIndex = 0;
      }  
    }

    this.getRef('$offset').attr('data-selected-value', selectedIndex);
    this.selectedIndex = selectedIndex;

    this.state.offsets.forEach( (it, index) => {
      it.selected = index === selectedIndex;
    });

    var selectedList = this.state.offsets.filter(it => it.selected);
    this.selectedOffsetItem = (selectedList.length) ? selectedList[0] : {} 

    this.refreshOffsetInput()
  }  

  refreshOffsetInput() {
    var offset = this.state.offsets[this.selectedIndex];

    if (offset) {
      this.children.$offsetInput.setValue(offset.offset);
    }
  }

  [LOAD('$offset')] () {
    return this.state.offsets.map( (it, index) => {
      return this.makeOffset(it, index);
    })
  }

  isNotOffsetItem (e) {
    return ! (Dom.create (e.target).hasClass('offset-item')) && !this.currentOffset
  }

  [CLICK('$offset') + IF('isNotOffsetItem') + PREVENT] (e) {
    this.baseOffsetWidth = this.refs.$offset.width();
    this.baseOffsetArea = this.refs.$offset.offset();
    var currentX = e.xy.x;  

    var newOffset = Length.percent((currentX - this.baseOffsetArea.left) / this.baseOffsetWidth * 100).round(100)

    this.state.offsets.push(new Offset({
      offset: newOffset
    }))

    this.selectItem(this.state.offsets.length-1, true)    
    this.refresh();    
    this.modifyOffset();

  }



  refreshOffsetProperty() {
    this.emit('showCSSPropertyEditor', this.selectedOffsetItem.properties)
  }
  
  [POINTERSTART('$offset .offset-item') + MOVE('moveOffset') + END('endOffset')] (e) {
    this.baseOffsetWidth = this.refs.$offset.width();
    this.baseOffsetArea = this.refs.$offset.offset();
    this.currentOffsetleft =  Length.parse(e.$dt.css('left'))

    this.currentOffset = e.$dt;
    this.currentOffsetIndex = +e.$dt.attr('data-offset-index')
    this.currentOffsetXY = e.xy;
    this.baseOffsetMin = this.baseOffsetArea.left;
    this.baseOffsetMax = this.baseOffsetArea.left + this.baseOffsetWidth;
    this.isRemoveOffset = false; 

    if (e.altKey) {
      this.isRemoveOffset = true; 
    } else {

      this.selectItem(this.currentOffsetIndex, true)    
      this.refreshOffsetInput()
    }

  }

  moveOffset(dx, dy) {

    if (this.isRemoveOffset) return; 

    var currentX = this.currentOffsetXY.x + dx 

    if (currentX < this.baseOffsetMin) {
      currentX = this.baseOffsetMin;
    } 

    if (currentX > this.baseOffsetMax) {
      currentX = this.baseOffsetMax;
    }

    var newOffset = Length.percent((currentX - this.baseOffsetMin) / this.baseOffsetWidth * 100).round(100);


    this.state.offsets[this.currentOffsetIndex].offset.set(newOffset.value)
    this.currentOffset.css('left', newOffset)
    this.refreshOffsetInput()
    this.modifyOffset();
  }

  removeOffset (index) {
    this.state.offsets.splice(index, 1);
    this.selectItem(0);
    this.refresh();    
    this.modifyOffset();    
  }

  endOffset (dx, dy) {


    if (this.isRemoveOffset) {
      setTimeout( () => {
        this.currentOffset = null; 
        this.removeOffset(this.currentOffsetIndex)
      }, 10);

    } else {

      setTimeout(() => {
        this.currentOffset = null;         
        this.refreshOffsetInput();
        this.refreshOffsetProperty();
        this.modifyOffset();
      }, 10);
    }


  }

  refresh() {
    this.load();
    this.refreshOffsetProperty();

  }

  [EVENT("showOffsetEditor")](data) {
    this.setState(data);
    this.selectItem()            
    this.refresh();

  }

  [EVENT('changeCSSPropertyEditor')] (properties = []) {
    var offset = this.state.offsets[this.selectedIndex];
    if (offset) {
      offset.properties = [...properties];
    }
    this.modifyOffset()
  }
}

registElement({ OffsetEditor })