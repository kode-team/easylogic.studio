import { ComponentManager } from "../manager/ComponentManager";
import { TimelineItem } from "./TimelineItem";
import { SVGFilter } from "@property-parser/SVGFilter";

export class Project extends TimelineItem {
  getDefaultTitle() {
    return "New Project";
  }

  get isAbsolute  (){
    return false;
  }  

  get parent () {
    return null;
  }

  toRootVariableCSS () {
    var obj = {}
    this.json.rootVariable.split(';').filter(it => it.trim()).forEach(it => {
      var [key, value] = it.split(':')

      obj[`--${key}`] = value; 
    })

    return obj;
  }  

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "project",
      name: 'new Project',
      description: '',
      rootVariable: '',            
      ...obj
    });
  }

  toCloneObject() {
    var { name, description, rootVariable } = this.json;
    return {
      ...super.toCloneObject(),
      name,
      description, 
      rootVariable
    }
  }

  get artboards () {
    return this.json.layers || [];
  }

  get html () {
    return this.artboards.map(it => it.html).join('\n\n');
  }

 
  toSVGString () {

    var filterString = this.json.svgfilters.map(svgfilter => {

      var filters = svgfilter.filters.map(filter => {
        return SVGFilter.parse(filter);
      })

      return /*html*/`<filter id='${svgfilter.id}'>
  ${filters.join('\n')}
</filter>
`

    }).join('\n\n')

    return filterString
  }  
}

ComponentManager.registerComponent('project', Project);
