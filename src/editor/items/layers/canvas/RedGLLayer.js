import { CanvasLayer } from "../CanvasLayer";

export class RedGLLayer extends CanvasLayer {
  getDefaultObject(obj = {}) {
    return super.getDefaultObject({
      itemType: 'redgl-canvas',
      name: "New RedGL",
      ...obj
    });
  }

  getDefaultTitle() {
    return "RedGL";
  }

  get html () {
    var {id, itemType} = this.json;

    var selected = this.json.selected ? 'selected' : ''

    return `
      <div class='element-item ${selected} ${itemType}' data-id="${id}">
        <canvas class='redgl-canvas-item'></canvas>
      </div>
    `
  }

  initRedGLSize () {
    if (this.redGL) {
      var width = this.json.width;
      var height = this.json.height;       
      this.redGL.setSize(width.value, height.value)
    }
  }

  initRedGL ($canvas) {
    var self = this; 
    var width = this.json.width;
    var height = this.json.height; 
    RedGL($canvas.el, function (v) {
      if (v) {
          console.log('초기화 성공!', v, this);
          var tWorld, tView, tScene, tController, tRenderer;
          // 월드 생성
          this['world'] = tWorld = RedWorld();
          // 씬 생성
          tScene = RedScene(this);
          // 카메라 생성
          tController = RedObitController(this);
          tController.pan = 45;
          tController.tilt = -45;
          // 렌더러 생성
          tRenderer = RedRenderer();
          // 뷰생성 및 적용
          tView = RedView(uuid(), this, tScene, tController);
          tWorld.addView(tView);
          // 그리드 설정
          tScene['grid'] = RedGrid(this);
          // axis 설정
          tScene['axis'] = RedAxis(this);
          // 렌더시작
          tRenderer.start(this, function (time) {
          //   console.log(time)
          });
          // 렌더 디버거 활성화
          tRenderer.setDebugButton();

          this.setSize(width.value, height.value)
          self.redGL = this; 

      } else {
          alert('초기화 실패!')
      }
    });
  }
}
