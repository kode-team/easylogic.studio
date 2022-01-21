# 렌더러 

[모델](./Model.md)을 렌더링 하기 위한 도구입니다.  모델이 데이타만 가지고 있다면 렌더링은 그 데이타를 가지고 실제로 렌더링을 하는 기능을 수행하도록 합니다. 

현재 구현된 렌더러는 총 3가지 입니다. 

* HTMLRenderer 
* SVGRenderer 
* JSONRenderer 

# HTMLRenderer 

에디터의 기본 렌더러입니다. CSS 기반의 렌더링을 해주기 때문에 웹브라우저 기능에 최적화 되어 있습니다. 

# SVGRenderer 

개별 렌더링 Layer 의 부분 이미지 캡쳐나 이미지 리소스를 다운로드 받기 위한 렌더링을 수행합니다. 

# JSONRenderer 

최종 결과물을 JSON 형태로 만들어줍니다.  프로젝트의 모델을 저장하기 위한 용도로 사용됩니다. 


자세한 사항은 아래를 리스트를 참고하세요. 
* src/plugins/renderer-html
* src/plugins/renderer-svg 
* src/plugins/renderer-json 