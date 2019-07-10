import { DomItem } from "./DomItem";

export class Project extends DomItem {
  getDefaultTitle() {
    return "New Project";
  }

  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: "project",
      name: 'Project',
      colors: [],
      gradients: [],
      ...obj
    });
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      name: this.json.name,
      colors: JSON.parse(JSON.stringify(this.json.colors)),
      gradients: JSON.parse(JSON.stringify(this.json.gradients))
    }
  }


  removeColor(removeIndex) {
    this.removePropertyList(this.json.colors, removeIndex);
  }      


  copyColor(index) {
    var copyObject = {...this.json.colors[index]};
    this.json.colors.splice(index, 0, copyObject);
  }        

  sortColor(startIndex, targetIndex) {
    this.sortItem(this.json.colors, startIndex, targetIndex);
  }    

  setColorValue(index, value) {
    var obj = this.json.colors[index]
    if (obj) {
      this.json.colors[index] = { ...obj, ...value}
    }
  }

  getColor (name) {
    var filteredColor = this.json.colors.filter(c => c.name === name)

    if (!filteredColor.length) return name; 
    return filteredColor[0].color || name 
  }

  addColor(obj) {
    this.json.colors.push(obj)
    return obj; 
  }

  createColor(data = {}) {
    return this.addColor(data)
  }  


  removeGradient(removeIndex) {
    this.removePropertyList(this.json.gradients, removeIndex);
  }      


  copyGradient(index) {
    var copyObject = {...this.json.gradients[index]};
    this.json.gradients.splice(index, 0, copyObject);
  }        

  sortGradient(startIndex, targetIndex) {
    this.sortItem(this.json.gradients, startIndex, targetIndex);
  }    

  setGradientValue(index, value) {
    var obj = this.json.gradients[index]
    if (obj) {
      this.json.gradients[index] = { ...obj, ...value}
    }
  }

  getGradient (name) {
    var filteredGradient = this.json.gradients.filter(c => c.name === name)

    if (!filteredGradient.length) return name; 
    return filteredGradient[0].gradient || name 
  }

  addGradient(obj) {
    this.json.gradients.push(obj)
    return obj; 
  }

  createGradient(data = {}) {
    return this.addGradient(data)
  }  


  get artboards () {
    return this.json.layers || [];
  }

  get html () {
    return this.artboards.map(it => it.html).join('\n\n');
  }
}
