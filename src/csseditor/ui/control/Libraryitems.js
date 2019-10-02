import UIElement from "../../../util/UIElement";

export default class LibraryItems extends UIElement {
  components() {
    return {

    }
  }
  template() {
    return /*html*/`
      <div class='library-items'>
        <div class='group'>
          <div class='title'><label>Form</label></div>
          <div class='list'>
            <div class='item'>
              <div class='thumbnail'></div>
              <label>Input</label>
            </div>
          </div>
        </div>
      </div>
    `;
  }

}
