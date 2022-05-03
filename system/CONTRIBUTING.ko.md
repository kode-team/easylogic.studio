# Welcome to EasyLogic Studio  contributing guide <!-- omit in toc -->

이지로직 스튜디오 프로젝트에 와주셔서 감사합니다. 이지로직 스튜디오는 오픈소스로 개발되는 웹디자인 툴입니다. 

관심있는 영역의 기능을 언제든지 같이 만들고 배포할 수 있습니다. 

이 가이드에서 PR 생성과 리뷰, 머지에 대한 정보를 얻으실 수 있습니다. 



## 시작하기

### 빌드시스템 

vite 를 기반으로 빌드되어집니다. 
vite 는 빠른 빌드 속도와 서버 구동을 지원하기 때문에 선택하였습니다. 

### 파일/디렉토리 구조 설명하기 

* src/ - 에디터의 소스가 존재합니다. 
* dist/ - npm 에 배포될 디렉토리입니다. 
* public/ - 로컬에서 개발서버를 띄울 때 사용하는 static 리소스가 들어있습니다. 
* docs/ - github pages 를 위한 디렉토리입니다. 
* index.html - vite 서버가 실행되는 페이지입니다. 

### src 

* src/index.jsx - 에디터의 시작점 파일입니다. 
* src/apps - 에디터의 레이아웃 구조가 있는 디렉토리입니다. 
* src/el - 에디터를 이루는 여러가지 자료구조, UI 라이브러리(sapa), 각종 파서 등이 있습니다. 
  * editor  
    * commands - 에디터 내부에서 사용되는 command 리스트 모음 
    * icon - 아이콘 리스트 모음 
    * items - 내부 아이템 자료형 
    * layout-engine - 레이아웃 엔진 모음, 
    * manager - 에디터에서 사용될 공용 Storage 모음
    * menus - dropdown toolbar 메뉴를 지정합니다.  
    * model - 그리기 기본 모델 모음 
    * parser - 패스 관련된 파서 모음 
    * preset - box-shadow, clip-path  등 여러가지 에셋 모음 
    * property-parser - css 속성 관련된 파서 모음 
    * shortcuts - 단축키 모음 
    * types - 타입 정의를 위한 클래스 모음 
    * ui - sapa 로 만든 기본 UI 모음 
    * unit 
    * util - 에디터 기본 함수들 모음 
  * sapa - 기본 UI 라이브러리 
  * utils - 색상, 수학, 행렬, 충돌 관련 여러가지 함수 모음 
* src/export-library - npm 으로 배포 될 때 외부로 오픈할 클래스, 함수 등을 지정하는 파일입니다. 
* src/plugins - 에디터의 기능을 이루는 여러가지 플러그인들이 있습니다. 
* src/scss - 에디터에서 사용되는 기본 style 을 지정합니다. 


### 개발 서버 실행하기 

개발서버, 빌드는 vite 를 통해서 이루어집니다. 

```
git clone https://github.com/easylogic/editor 
cd editor 
npm install && npm run dev 
```

### 테스트 코드 실행 

테스트 코드는 vitest 를 통해서 수행되어 집니다. 

```
npm test 
```

### Issues

#### 이슈 생성 

디자인툴에서  관심있는 주제나 구현해보고 싶은 기능, 사용하시다가 이상한 점이 있으시면 이슈로 올려주세요. 


#### 이슈 해결

관심 있는 이슈에 assign 을 할당하고 PR 을 만들어주세요. 


### Pull Request 만들기 

* 관심있는 이슈를 선택하거나 필요한 이슈를 생성합니다. 
* 프로젝트를 fork 해서 새로운 레파지토리를 만든다음 
* 해당 사항을 고치고 PR을 보냅니다. 
* PR 을 보낼 때는 develop 브랜치로 보내주세요. 

### Pull Request 에 있으면 좋은 내용 

PR 에서는 아래와 같은 내용이 적혀 있으면 좋습니다. 

* 해결하기 위한 문제 설명 
* 추가된 기능 설명 
* 삭제된 기능 설명 
* 테스트 방법 

### Pull Request 병합 

축하드립니다. 이제부터 진자 컨트리뷰터가 됩니다. 

* 보내주신 PR은 몇가지 테스트를 거친후 병합됩니다. 
* PR 이 병합이 되면 contributor 가 됩니다.    


### 기타 

* 내부적으로 k-opensource 사용하기 운동을 하고 있습니다. 
* 괜찮은 k-opensource 라이브러리가 있으면 같이 포함해서 사용하면 좋습니다. 
* 현재 아래와 같은 라이브러리를 사용해볼려고 합니다. 
  * @entityjs/entityjs
  * array-organizer
  * open-color
  * yorkie-js-sdk
  * adorable-css

#### 궁금하신 사항은 언제든 이슈로 남겨주세요.