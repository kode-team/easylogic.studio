import UIElement, { EVENT } from "../../../../../util/UIElement";
import { Length } from "../../../../../editor/unit/Length";
import { LOAD, POINTERSTART, MOVE, END, CLICK, IF, INPUT, PREVENT } from "../../../../../util/Event";
import { Offset } from "../../../../../editor/css-property/Offset";
import Dom from "../../../../../util/Dom";
import { isUndefined } from "../../../../../util/functions/func";
import CSSPropertyEditor from "./CSSPropertyEditor";
import RangeEditor from "./RangeEditor";


export default class OffsetEditor extends UIElement {

  components() {
    return {
      RangeEditor,
      CSSPropertyEditor
    }
  }

  initState() {
    return {
      offsets: []
    };
  }

  updateData(opt) {
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.modifyOffset();
  }

  modifyOffset () {
    this.emit("changeOffsetEditor", this.state);  
  }

  template() {
    return `
    <div class='editor offset-editor' ref='$editor'>
        ${this.templateForOffset()}
        ${this.templateForOffsetInput()}
        ${this.templateForProperty()}        
    </div>`;
  }



  templateForOffsetInput () {
    return `
      <div class='offset-input' >
        <div class='title'>
          <label>Offset</label>
          <div class='tools'>
            <RangeEditor key='offset' calc='false' min='0' max='100' step="0.01" ref='$offsetInput' options="%" onchange='changeRangeEditor' />
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
    return `<CSSPropertyEditor ref='$offsetPropertyEditor' onchange='changeCSSPropertyEditor' />`
  }  

  templateForOffset () {
    return `<div class='offset' ref='$offset' data-selected-value="-1"></div>`
  }

  makeOffset (offset, index) {
    var css = `left: ${offset.offset}; background-color: ${offset.color};`
    
    return `<div class='offset-item' style='${css}' data-offset-index='${index.toString()}'></div>`
  }


  // 객체를 선택하는 괜찮은 패턴이 어딘가에 있을 텐데......
  // 언제까지 selected 를 설정해야하는가?
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
    this.currentOffsetleft =  Length.parse(e.$delegateTarget.css('left'))

    this.currentOffset = e.$delegateTarget;
    this.currentOffsetIndex = +e.$delegateTarget.attr('data-offset-index')
    this.currentOffsetXY = e.xy;
    this.baseOffsetMin = this.baseOffsetArea.left;
    this.baseOffsetMax = this.baseOffsetArea.left + this.baseOffsetWidth;

    this.selectItem(this.currentOffsetIndex, true)    
    this.refreshOffsetInput()
  }

  moveOffset(dx, dy) {

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

  endOffset (dx, dy) {
    setTimeout(() => {
      this.currentOffset = null;       
      this.refreshOffsetInput();
      this.refreshOffsetProperty();
      this.modifyOffset();
    }, 10);

  }

  // 개별 속성을 변경할 때  state 로 저장 하기 

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
