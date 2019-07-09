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

    return `
      <div class='element-item ${itemType}' data-id="${id}">
        <canvas class='redgl-canvas-item'></canvas>
      </div>
    `
  }

  initRedGLSize () {
    if (this.json.redGL) {
      var width = this.json.width;
      var height = this.json.height;       
      this.json.redGL.setSize(width.value, height.value)
    }
  }

  removeRedGL () {
    this.json.redGL = null; 
  }

  initRedGL ($canvas) {
    var self = this; 
    var width = this.json.width;
    var height = this.json.height; 
    var selfId = this.id; 
    RedGL($canvas.el, function (v) {
      // console.log(v, selfId)
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
          // tView = RedView(uuid(), this, tScene, tController);
          tView = RedView(this, tScene, tController);
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
          self.json.redGL = this; 


         //////////////////////////////////////////////////////////////////
          // RedPointCloud 설정
          var i;
          var interleaveData;
          var testRedPointCloud;
          // 인터리브 정보 생성
          interleaveData = [];
          i = 1000
          while (i--) {
            // position
            interleaveData.push(
              Math.random() * 30 - 15, // x
              Math.random() * 30 - 15, // y
              Math.random() * 30 - 15 // z
            );
            // pointSize
            interleaveData.push(Math.random() * 1);
            // color
            interleaveData.push(Math.random(), Math.random(), Math.random(), 1);
          }
          // 포인트 유닛 생성
          testRedPointCloud = RedColorPointCloud(
            this,
            interleaveData,
            [
              RedInterleaveInfo('aVertexPosition', 3),
              RedInterleaveInfo('aPointSize', 1),
              RedInterleaveInfo('aVertexColor', 4)
            ]
          );
          tScene.addChild(testRedPointCloud);
          // 렌더시작
          tRenderer.start(this, function (time) {
            // 인터리브 데이터 업데이트
            interleaveData.forEach(function (v, index) {
              if (index % 4 == 0) interleaveData[index] = v + Math.sin(time / 1000 + index / 100) / 10
              else if (index % 4 == 1) interleaveData[index] = v + Math.sin(time / 1000 + index / 100) / 10
              else if (index % 4 == 2) interleaveData[index] = v + Math.cos(time / 1000 + index / 100) / 10
              else interleaveData[index] = Math.cos(time / 500 + index / 100)
            });
            testRedPointCloud.update(interleaveData);
          }); 

      } else {
          alert('초기화 실패!')
      }
    });
  }
}
