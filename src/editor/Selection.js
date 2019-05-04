import { Length } from "./unit/Length";
import { CHANGE_SELECTION } from "../csseditor/types/event";
import { RectItem } from "./items/RectItem";

export class Selection {
  constructor(editor) {
    this.editor = editor;

    this._mode = "";
    this._ids = [];
    this._idSet = new Set();
    this.currentRect = null;
  }

  initialize() {
    this._mode = "";
    this._ids = [];
    this._idSet.clear();
  }

  /**
   * get id string list for selected items
   */
  get ids() {
    return this._ids;
  }

  /**
   * get item instance
   */
  get items() {
    return this._ids.map(id => this.editor.get(id));
  }

  /**
   * get first item instance
   */
  get current() {
    var item = this.editor.get(this.ids[0]);
    if (!item) return null;

    return item.itemType == "project" ? null : item;
  }

  get layers() {
    return this.search("layer");
  }
  get layer() {
    return this.layers[0];
  }
  get artboards() {
    return this.search("artboard");
  }
  get artboard() {
    return this.artboards[0];
  }
  get projects() {
    return this.search("project");
  }
  get project() {
    return this.projects[0];
  }
  get directories() {
    return this.search("directory");
  }
  get directory() {
    return this.directories[0];
  }

  get currentDirectory() {
    return this._directory;
  }
  get currentArtBoard() {
    return this._artboard;
  }
  get currentProject() {
    return this._project;
  }
  get currentLayer() {
    return this._layer;
  }

  get mode() {
    return this._mode;
  }
  set mode(mode) {
    if (this._mode != mode) {
      this._mode = mode;
    }
  }

  updateLayer(event, attrs = {}, context = null) {
    var layer = this.currentLayer;
    if (layer) {
      layer.reset(attrs);
    }
    (context || this.editor).emit(event, layer);
  }

  updateRect(event, attrs = {}, context = null) {
    var rect = this.currentRect;
    if (rect) {
      rect.reset(attrs);
    }
    (context || this.editor).emit(event, rect);
  }

  updateArtBoard(event, attrs = {}, context = null) {
    var artboard = this.currentArtBoard;
    if (artboard) {
      artboard.reset(attrs);
    }
    (context || this.editor).emit(event, artboard);
  }

  updateDirectory(event, attrs = {}, context = null) {
    var directory = this.currentDirectory;
    if (directory) {
      directory.reset(attrs);
    }
    (context || this.editor).emit(event, directory);
  }

  updateProject(event, attrs = {}, context = null) {
    var project = this.currentProject;
    if (project) {
      project.reset(attrs);
    }
    (context || this.editor).emit(event, project);
  }

  check(id) {
    var hasKey = this._idSet.has(id);

    if (!hasKey) {
      var isArtBoard = this._artboard && this._artboard.id == id;
      if (isArtBoard) {
        return true;
      }

      var isProject = this._project && this._project.id == id;
      if (isProject) return true;

      return false;
    }

    return true;
  }

  checkOne(id) {
    return this._idSet.has(id);
  }

  isEmpty() {
    return this._ids.length === 0;
  }

  isNotEmpty() {
    return this._ids.length > 0;
  }

  count() {
    return this._ids.length;
  }

  unitValues() {
    return this.items.map(item => {
      var x = item.x.value;
      var y = item.y.value;
      var width = item.width.value;
      var height = item.height.value;
      var id = item.id;

      return {
        id,
        x,
        y,
        width,
        height,
        x2: x + width,
        y2: y + height,
        centerX: x + width / 2,
        centerY: y + height / 2
      };
    });
  }

  search(itemType) {
    return this.items.filter(item => item.itemType === itemType);
  }

  is(mode) {
    return this._mode === mode;
  }

  select(...args) {
    var isAll = args
      .map(id => {
        return this._idSet.has(id);
      })
      .every(it => it);

    this._ids = args
      .map(it => {
        if (it.id) {
          return it.id;
        }

        return it;
      })
      .filter(id => this.editor.has(id));
    this._idSet = new Set(this._ids);

    this.generateCache();

    if (!isAll) {
      this.editor.send(CHANGE_SELECTION);
    }

    this.initRect();
  }

  refresh() {
    this.select(
      ...this._ids.filter(id => {
        return this.editor.get(id);
      })
    );
  }

  generateCache() {
    if (this._ids.length) {
      var parents = this.editor.get(this._ids[0]).path();

      this._layer = parents.filter(it => it.itemType === "layer")[0];
      this._directory = parents.filter(it => it.itemType === "directory")[0];
      this._artboard = parents.filter(it => it.itemType === "artboard")[0];
      this._project = parents.filter(it => it.itemType === "project")[0];
    } else {
      this._layer = null;
      this._directory = null;
    }
  }

  area(rect) {
    var selectItems = this.editor.layers
      .filter(layer => {
        return !layer.isLayoutItem() && !layer.lock && layer.checkInArea(rect);
      })
      .map(it => it.id);

    if (selectItems) {
      this.select(...selectItems);
    } else {
      var project = this.currentProject;
      project && project.select();
    }
  }

  initRect() {
    this.currentRect = this.rect();
  }

  rect() {
    var minX = Number.MAX_SAFE_INTEGER;
    var minY = Number.MAX_SAFE_INTEGER;
    var maxX = Number.MIN_SAFE_INTEGER;
    var maxY = Number.MIN_SAFE_INTEGER;

    this.items.forEach(item => {
      if (!item.screenX) return;

      var x = item.screenX.value;
      var y = item.screenY.value;
      var x2 = item.screenX2.value;
      var y2 = item.screenY2.value;

      if (minX > x) minX = x;
      if (minY > y) minY = y;
      if (maxX < x2) maxX = x2;
      if (maxY < y2) maxY = y2;
    });

    if (this.isEmpty()) {
      minX = 0;
      minY = 0;
      maxX = 0;
      maxY = 0;
    }

    var x = minX;
    var y = minY;
    var x2 = maxX;
    var y2 = maxY;

    var width = x2 - x;
    var height = y2 - y;

    x = Length.px(x);
    y = Length.px(y);
    width = Length.px(width);
    height = Length.px(height);

    return new RectItem({ x, y, width, height });
  }
}
