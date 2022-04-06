# PathSegmentView 

패스 에디터를 다시 만든다. 

이유는 flex 레이아웃 기능이 들어가면서 레이어들이 주변의 상태에 영향을 받아서 크기가 변경이 가능하게 되었다. 
하지만 기존 [PathEditorView](./PathEditorView.js)는  원래 패스 데이타를 캐슁해두고 작업하기 때문에 이를 제대로 대응할 수가 없다. 

그래서 현재 시점의 변경된 패스 정보를 실시간으로 편집할 수 있는 에디터가 필요하다. 

# 구현해야할 기능들 

* [ ] Segment 표현 
* [ ] Segment 이동 
* [ ] Segment 이동시 연결된 점들도 같이 이동하기 
* [ ] Segment 이동시 스냅
* [ ] curve 가이드 라인 
* [ ] curve 와 연결된 반대쪽 커브도 이동하기 
* [ ] Segment 삭제 
* [ ] Split Segment, 원하는 위치에 점으로 하나의 segment 를 둘로 나눈다. 
* [ ] change to curve, 원하는 점을 curve 로 변경하거나 다시 점(Line)으로 돌린다. 
* [ ] segment 멀티 선택 
* [ ] segment 멀티 이동 
* [ ] segment 멀티 삭제 
* [ ] 패스 그리기 모드 
* [ ] 멀티패스 그리기 
* [ ] 멀티패스에서 개별 패스 선택 하기 
* [ ] 부분패스 이동하기 모드
