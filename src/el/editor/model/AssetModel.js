import { Keyframe } from "../property-parser/Keyframe";
import { BaseModel } from "./BaseModel";

export class AssetModel extends BaseModel {

  getDefaultObject(obj = {}) { 
    return super.getDefaultObject({
      comments: [],   // { id: xxxx, pos: [0, 0, 0], comments: [ { userId: '', message: '', createdAt: '', updatedAt : '' } ] }
      colors: [],
      gradients: [],
      svgfilters: [],
      svgimages: [],
      keyframes: [],      
      images: [],     //  { id: xxxx, url : '' }
      imageKeys: [],
      videos: [],     //  { id: xxxx, url : '' }
      videoKeys: [],      
      audios: [],     //  { id: xxxx, url : '' }
      ...obj
    });
  }


  addKeyframe(keyframe) {
    this.json.keyframes.push(keyframe);
    return keyframe;
  }     


  createKeyframe(data = {}) {
    return this.addKeyframe(
      new Keyframe({
        checked: true,
        ...data
      })
    );
  }    
  

  removeKeyframe(removeIndex) {
    this.removePropertyList(this.json.keyframes, removeIndex);
  }    


  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }

  sortKeyframe(startIndex, targetIndex) {
    this.sortItem(this.json.keyframes, startIndex, targetIndex);
  }    


  updateKeyframe(index, data = {}) {
    this.json.keyframes[+index].reset(data);
  }      


/**
   * `@keyframes` 문자열만 따로 생성 
   */
  toKeyframeString (isAnimate = false) {
    return this.json.keyframes
              .map(keyframe => keyframe.toString(isAnimate))
              .join('\n\n')
  }  


  copyPropertyList(arr, index) {
    var copyObject = {...arr[index]};
    arr.splice(index, 0, copyObject);
  }

  toCloneObject() {
    var json = this.json; 
    return {
      ...super.toCloneObject(),
      ...this.attrs(
        'colors',
        'gradients',
        'svgfilters',
        'svgimages',
        'images',
        'keyframes',      
      )

    }
  }


  removePropertyList(arr, removeIndex) {
    arr.splice(removeIndex, 1);
  }  

  /* color assets manage */ 

  removeColor(removeIndex) {
    this.removePropertyList(this.json.colors, removeIndex);
  }      


  copyColor(index) {
    this.copyPropertyList(this.json.colors, index);
  }        

  sortColor(startIndex, targetIndex) {
    this.sortItem(this.json.colors, startIndex, targetIndex);
  }    

  setColorValue(index, value = {}) {
    this.json.colors[index] = {...this.json.colors[index], ...value}
  }

  getColorIndex (index) {
    return this.json.colors[index]
  }

  getColor (name) {
    return this.json.colors.filter(item => item.name === name)[0];
  }

  addColor (obj) {
    this.json.colors.push(obj);
    return obj; 
  }

  createColor(data = {}) {
    return this.addColor(data)
  }  


  /* image assets manage */ 

  removeImage(removeIndex) {
    this.removePropertyList(this.json.images, removeIndex);
    this.refreshImageKeys();
  }      


  copyImage(index) {
    this.copyPropertyList(this.json.images, index);
    this.refreshImageKeys();
  }        

  sortImage(startIndex, targetIndex) {
    this.sortItem(this.json.images, startIndex, targetIndex);
  }    


  setImageValue(index, value = {}) {
    this.json.images[index] = {...this.json.images[index], ...value}
    this.refreshImageKeys();
  }  

  getImageValueById (id) {
    const image = this.json.imageKeys[id]
    if (!image) return undefined;

    return image.local;
  }

  refreshImageKeys() {
    let imageKeys = {}
    this.json.images.forEach(it => {
      imageKeys[it.id] = it; 
    })

    this.reset({
      imageKeys
    })
  }

  addImage(obj) {
    this.json.images.push(obj)
    this.refreshImageKeys();
    return obj; 
  }

  createImage(data = {}) {
    return this.addImage(data)
  }  



  /* video assets manage */ 

  removeVideo(removeIndex) {
    this.removePropertyList(this.json.videos, removeIndex);
    this.refreshVideoKeys()    
  }      


  copyVideo(index) {
    this.copyPropertyList(this.json.videos, index);
    this.refreshVideoKeys()    
  }        

  sortVideo(startIndex, targetIndex) {
    this.sortItem(this.json.videos, startIndex, targetIndex);
  }    


  setVideoValue(index, value = {}) {
    this.json.videos[index] = {...this.json.videos[index], ...value}
  }  

  getVideoValueById (id) {
    const video = this.json.videoKeys[id]
    if (!video) return undefined;

    return video.local;
  }

  refreshVideoKeys() {
    let videoKeys = {}
    this.json.videos.forEach(it => {
      videoKeys[it.id] = it; 
    })

    this.reset({
      videoKeys
    })
  } 

  addVideo(obj) {
    this.json.videos.push(obj)
    this.refreshVideoKeys()
    return obj; 
  }

  createVideo(data = {}) {
    return this.addVideo(data)
  }    

  /* gradient assets manage */ 


  removeGradient(removeIndex) {
    this.removePropertyList(this.json.gradients, removeIndex);
  }      


  copyGradient(index) {
    this.copyPropertyList(this.json.gradients, index);
  }        

  sortGradient(startIndex, targetIndex) {
    this.sortItem(this.json.gradients, startIndex, targetIndex);
  }    

  setGradientValue(index, value) {
    this.json.gradients[index] = {...this.json.gradients[index], ...value}
  }

  getGradientIndex (index) {
    return this.json.gradients[index]
  }

  getGradient (name) {
    return this.json.gradients.filter(item => item.name === name)[0]
  }

  addGradient(obj = {}) {
    this.json.gradients.push(obj)
    return obj; 
  }

  createGradient(data = {}) {
    return this.addGradient(data)
  }  


  /* svg filters  */

  getSVGFilterIndex (id) {

    var filter = this.json.svgfilters.map( (it, index) => {
      return { id: it.id, index }
    }).filter(it => {
      return it.id === id 
    });

    return filter.length ? filter?.[0]?.index : -1;
  }

  removeSVGFilter(removeIndex) {
    this.removePropertyList(this.json.svgfilters, removeIndex);
  }      


  copySVGFilter(index) {
    this.copyPropertyList(this.json.svgfilters, index);    
  }        

  sortSVGFilter(startIndex, targetIndex) {
    this.sortItem(this.json.svgfilters, startIndex, targetIndex);
  }    

  setSVGFilterValue(index, value) {
    this.json.svgfilters[index] = {...this.json.svgfilters[index], ...value}
  }

  addSVGFilter(obj = {}) {
    this.json.svgfilters.push(obj)
    var index = this.json.svgfilters.length - 1;
    return index; 
  }

  createSVGFilter(data = {}) {
    return this.addSVGFilter(data)
  }  

 

  /* svg clip-path images   */

  getSVGImageIndex (id) {

    var filter = this.json.svgimages.map( (it, index) => {
      return { id: it.id, index }
    }).filter(it => {
      return it.id === id 
    })[0];

    return filter ? filter.index : -1;
  }

  removeSVGImage(removeIndex) {
    this.removePropertyList(this.json.svgimages, removeIndex);
  }      


  copySVGImage(index) {
    this.copyPropertyList(this.json.svgimages, index);    
  }        

  sortSVGImage(startIndex, targetIndex) {
    this.sortItem(this.json.svgimages, startIndex, targetIndex);
  }    

  setSVGImageValue(index, value) {
    this.json.svgimages[index] = {...this.json.svgimages[index], ...value}
  }

  addSVGImage(obj = {}) {
    this.json.svgimages.push(obj)
    var index = this.json.svgimages.length - 1;
    return index; 
  }

  createSVGImage(data = {}) {
    return this.addSVGImage(data)
  }   
}
