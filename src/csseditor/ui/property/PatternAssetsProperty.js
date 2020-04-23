import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, DRAGSTART, CLICK } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import patterns from "../../../editor/preset/patterns";

export default class PatternAssetsProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('pattern.asset.property.title');
  }

  initState() {
    return {
      mode: 'grid',
    }
  }

  [EVENT('changePreset')] (key, value) {

    this.setState({
      [key]: value
    })
  }

  getClassName() {
    return 'pattern-assets-property'
  }


  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.show();
  }

  getBody() {
    return /*html*/`
      <div class='property-item pattern-assets'>
        <div class='pattern-list' ref='$patternList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [DRAGSTART('$patternList .pattern-item')] (e) {
    const pattern = patterns[+e.$dt.attr('data-index')].execute();
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/pattern", pattern);
  }

  [LOAD("$patternList")]() {

    var results = patterns.map( (item, index) => { 

      const patternStyle = item.execute()

      return /*html*/`
        <div class='pattern-item' data-index="${index}" data-custom="${item.custom}">
          <div class='preview' title="${item.title}" draggable="true">
            <div class='pattern-view' style='color: ${item.color};background-color: ${item.backgroundColor};${patternStyle}'></div>
          </div>
        </div>
      `
    })

    return results
  }


  [CLICK("$patternList .pattern-item")](e) {

    const info = patterns[+e.$dt.attr('data-index')]

    const pattern = info.execute();

    const value = { pattern, color: info.color, backgroundColor: info.backgroundColor }

    // view 에 따라 다른 속성을 가진다. 
    if (this.$editor.modeView === 'CanvasView') { 
      this.emit('addBackgroundImagePattern', value);
    } else {
      this.emit('setPatternAsset', value)
    }
  }  

}
