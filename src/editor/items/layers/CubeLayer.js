import { CSS_TO_STRING } from "../../../util/functions/func";
import { Component } from "../Component";

export class CubeLayer extends Component {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'cube',
      name: "New Cube",
      'transform-style':'preserve-3d',
      transform: 'rotateX(10deg) rotateY(30deg)',
      'front.color': '',
      ...obj
    }); 
  }

  getProps() {
    return [
      {key: 'front.color', editor: 'ColorViewEditor', editorOptions: {
        label: 'Front Color', params: 'front.color'
      }, defaultValue: 'rgba(0, 0, 0, 1)' }
    ]
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      'front.color': this.json['front.color']
    }
  }

  enableHasChildren() {
    return true; 
  }


  getDefaultTitle() {
    return "Cube";
  }


  toDefaultCSS(isExport = false) {
    var obj = {}

    if (this.json.x)  obj.left = this.json.x ;
    if (this.json.y)  obj.top = this.json.y ;    

    return {
      ...obj,
      ...this.toKeyListCSS(
        'position', 'right','bottom', 'width','height', 'opacity',
        'transform-origin', 'transform-style', 'perspective', 'perspective-origin',
        // 'filter',
      )
    }

  }  

  toCSS(isExport = false) {

    return {
      ...this.toVariableCSS(),
      ...this.toDefaultCSS(isExport),
      ...this.toWebkitCSS(),      
      ...this.toBoxModelCSS(),
      ...this.toTransformCSS(),      
      ...this.toAnimationCSS(),
      ...this.toTransitionCSS()
    };
  }

  toNestedCSS() {
    var json = this.json; 

    var width = json.width; 
    var height = json.height; 
    var borderColor = '#333'
    var halfWidth = width.value/2
    var halfHeight = height.value/2

    var css = {
      ...this.toKeyListCSS(
        'filter', 'mix-blend-mode'
      ),      
      ...this.toBackgroundImageCSS(),
      ...this.toBorderCSS(),
      ...this.toBorderRadiusCSS()
    }

    return [
      { selector: 'div', cssText: `
          position: absolute;
          left: 0px;
          top: 0px;
          bottom: 0px;
          right: 0px;
          opacity: 1;
          pointer-events: none;
          background-color: ${json['background-color']};
          border: 1px solid ${borderColor};
          ${CSS_TO_STRING(css)}
        `
      },
      {
        selector: '.front', cssText: `
          transform:rotateY(0deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};     
          ${json['front.color'] ? `background-color: ${json['front.color']}`: ''}
        `
      },
      {
        selector: '.back', cssText: `
          transform: rotateY(180deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};                    
        `
      },
      {
        selector: '.left', cssText:  `
          transform: rotateY(-90deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};                    
        `
      },
      {
        selector: '.right', cssText: `
          transform: rotateY(90deg) translateZ(${halfWidth}px);
          width: ${width};
          height: ${height};                    
        `
      },
      {
        selector: '.top', cssText: `
          transform: rotateX(90deg) translateZ(${halfHeight}px);
          top: ${halfHeight - halfWidth}px;
          width: ${width};
          height: ${width};
        `
      },
      {
        selector: '.bottom', cssText: `
          transform: rotateX(-90deg) translateZ(${halfHeight}px);
          top: ${halfHeight - halfWidth}px;          
          width: ${width};
          height: ${width};          
        `
      }
    ]
  }

  get html () {
    var {id, itemType} = this.json;

    return `
      <div class='element-item ${itemType}' data-id="${id}">
        <div class='front'></div>
        <div class='back'></div>
        <div class='left'></div>
        <div class='right'></div>
        <div class='top'></div>
        <div class='bottom'></div>
      </div>
    `
  }

}
 