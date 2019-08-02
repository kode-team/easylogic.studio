import UIElement, { EVENT } from "../../../util/UIElement";
import icon from "../icon/icon";
import { CLICK, BIND } from "../../../util/Event";

export default class StarManager extends UIElement {

    initState() {
        return {
            count: 5,
            radius: 0.5 
        }
    }

  template() {
    return `
      <div class='star-manager'>
        <div class='text'>
            <label>Star Count</label>
            <span class='count' ref='$c'>
                <button type="button" data-type='plus'>${icon.add}</button>
                <input type="number" min="2" max="100" ref='$count'/>
                <button type="button" data-type='minus'>${icon.remove2}</button>
            </span>
            <label>Radius Rate</label>
            <span class='radius' ref='$r'>
                <button type="button" data-type='plus'>${icon.add}</button>
                <input type="number" min="0" max="10" step="0.1" ref='$radius'/>
                <button type="button" data-type='minus'>${icon.remove2}</button>
            </span>            
        </div>
      </div>    
    `;
  }

  [BIND('$count')] () {
    return { value: this.state.count }
  }

  [BIND('$radius')] () {
    return { value: this.state.radius  }
  }  

  refresh() {
    this.load();
  }

  [CLICK('$c [data-type]')] (e) {
    var type = e.$delegateTarget.attr('data-type')
    var step = type === 'plus' ? 1 : -1; 

    this.updateData({
        count: this.state.count + step 
    })
    this.refresh();    
  }


  [CLICK('$r [data-type]')] (e) {
    var type = e.$delegateTarget.attr('data-type')
    var step = type === 'plus' ? 0.1 : -0.1; 

    this.updateData({
        radius: this.state.radius + step 
    });
    this.refresh();
  }  

  updateData(obj = {}) {

    this.setState(obj, false)
    this.emit(this.state.changeEvent, this.state.count, this.state.radius);
  }

  [EVENT('changeStarManager')] (count, radius) {
    this.setState({count, radius}, false)

    this.refresh();
  }

  [EVENT('showStarManager')] (obj = {}) {
      obj.changeEvent = obj.changeEvent || 'changeStarManager';
      this.setState(obj, false)
      this.refresh();
      this.$el.show('inline-block');
  }

  [EVENT('hideStarManager')] () {
      this.$el.hide();
  }

  [EVENT('hideSubEditor')] () {
    this.trigger('hideStarManager');
  }

}
