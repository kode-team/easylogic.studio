import { DomItem } from "./DomItem";
import AssetParser from "../parse/AssetParser";
import { SVGFilter } from "../css-property/SVGFilter";

export class AssetItem extends DomItem {

  getDefaultObject(obj = {}) { 
    return super.getDefaultObject({
      colors: [],
      gradients: [],
      svgfilters: [],
      svgimages: [],
      images: [],     //  { id: xxxx, url : '' }
      ...obj
    });
  }


 
  toSVGString () {

    var imageString = this.svgimageList.map(svgimage => {

      var objectInfo = svgimage.info.objectInfo;

      return objectInfo.svgimage 

    }).join('\n\n')


    var filterString = this.svgfilterList.map(svgfilter => {

      var objectInfo = svgfilter.info.objectInfo;

      var filters = objectInfo.filters.map(filter => {
        return SVGFilter.parse(filter);
      })

      return `
        <filter id='${objectInfo.id}'>
          ${filters.join('\n')}
        </filter>
      `

    }).join('\n\n')

    return `
      ${imageString}
      ${filterString}
    `
  }


  get colorList () {
    return this.json.colors.map(obj => {
      var info = AssetParser.parse(obj.datauri);
      return {...obj, info}
    })
  }

  get gradientList () {
    return this.json.gradients.map(obj => {
      var info = AssetParser.parse(obj.datauri);
      return {...obj, info}
    })
  }  

  get svgfilterList () {
    return this.json.svgfilters.map(obj => {
      var info = AssetParser.parse(obj.datauri)

      return {...obj, info}
    })
  }


  get svgimageList () {
    return this.json.svgimages.map(obj => {
      var info = AssetParser.parse(obj.datauri)

      return {...obj, info}
    })
  }  

  get svgpathsList () {
    return this.json.svgpaths.map(obj => {
      var info = AssetParser.parse(obj.datauri)

      return {...obj, info}
    })
  }  

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      colors: JSON.parse(JSON.stringify(this.json.colors)),
      gradients: JSON.parse(JSON.stringify(this.json.gradients)),
      svgfilters: JSON.parse(JSON.stringify(this.json.svgfilters)),
      svgimages: JSON.parse(JSON.stringify(this.json.svgimages)),
      images: JSON.parse(JSON.stringify(this.json.images))
    }
  }

  /* color assets manage */ 

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

    var asset = this.json.colors[index];
    asset.datauri = AssetParser.changeColor(asset.datauri, value)
  }

  getColor (name) {
    var filteredColor = this.json.colors.filter(c => c.datauri.includes(`/${name}/`))

    if (!filteredColor.length) return name; 
    return AssetParser.parse(filteredColor[0])
  }

  addColor(obj) {
    var colorAsset = {
      datauri: AssetParser.generateColor(null, obj),
      localurl: '' 
    }

    this.json.colors.push(colorAsset)
    return obj; 
  }

  createColor(data = {}) {
    return this.addColor(data)
  }  

  /* color assets manage */ 


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

    var asset = this.json.gradients[index];
    asset.datauri = AssetParser.changeGradient(asset.datauri, value)

  }

  getGradient (name) {
    var filteredAsset = this.json.gradients.filter(c => c.datauri.includes(`/${name}/`))

    if (!filteredAsset.length) return {}; 
    return AssetParser.parse(filteredAsset[0])
  }

  addGradient(obj) {
    var asset = {
      datauri: AssetParser.generateGradient(null, obj),
      localurl: '' 
    }

    this.json.gradients.push(asset)
    return obj; 
  }

  createGradient(data = {}) {
    return this.addGradient(data)
  }  


  /* svg filters  */

  removeSVGFilter(removeIndex) {
    this.removePropertyList(this.json.svgfilters, removeIndex);
  }      


  copySVGFilter(index) {
    var copyObject = {...this.json.svgfilters[index]};
    this.json.svgfilters.splice(index, 0, copyObject);
  }        

  sortSVGFilter(startIndex, targetIndex) {
    this.sortItem(this.json.svgfilters, startIndex, targetIndex);
  }    

  setSVGFilterValue(index, value) {

    var asset = this.json.svgfilters[index];
    asset.datauri = AssetParser.changeSVGFilter(asset.datauri, value)

  }

  addSVGFilter(obj) {
    var asset = {
      datauri: AssetParser.generateSVGFilter(null, obj),
      localurl: '' 
    }

    this.json.svgfilters.push(asset)
    return obj; 
  }

  createSVGFilter(data = {}) {
    return this.addSVGFilter(data)
  }  


  /* svg images  */

  removeSVGImage(removeIndex) {
    this.removePropertyList(this.json.svgimages, removeIndex);
  }      


  copySVGImage(index) {
    var copyObject = {...this.json.svgimages[index]};
    this.json.svgimages.splice(index, 0, copyObject);
  }        

  sortSVGImage(startIndex, targetIndex) {
    this.sortItem(this.json.svgimages, startIndex, targetIndex);
  }    

  setSVGImageValue(index, value) {

    var asset = this.json.svgimages[index];
    asset.datauri = AssetParser.changeSVGImage(asset.datauri, value)

  }

  addSVGImage(obj) {
    var asset = {
      datauri: AssetParser.generateSVGImage(null, obj),
      localurl: '' 
    }

    this.json.svgimages.push(asset)
    return obj; 
  }

  createSVGImage(data = {}) {
    return this.addSVGImage(data)
  }  

}
