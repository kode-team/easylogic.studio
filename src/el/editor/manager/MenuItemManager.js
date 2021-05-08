export class MenuItemManager {
  constructor(editor) {
    this.editor = editor;
    this.menuItems = {} 
  }

  registerMenuItem (target, obj) {

    if (!this.menuItems[target]){
      this.menuItems[target] = []
    }

    Object.keys(obj).forEach(refClass => {
      this.menuItems[target].push({
        refClass, 
        class: obj[refClass]
      })
    })
  }

  getTargetMenuItems(target) {
    return this.menuItems[target] || [];
  }
};
