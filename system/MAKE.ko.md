# 에디터 만들기 

이 문서는 에디터의 기본기능 구현 또는 확장을 위한 문서입니다. 


# 에디터 시작하기 

에디터를 실행하기 위해서는 먼저 프로젝트를 fork 해주세요. 
그런 다음 clone 을 받아서 실행해줍니다. 

```
git clone https://github.com/easylogic/editor 
cd editor
npm install 
npm run dev 
```

# 빌드 시스템 

빌드시스템은 [vitejs](https://vitejs.dev/) 가 필요합니다.  

총 3가지 형태로 실행을 합니다. 

* vite.config.js - 로컬 개발용 설정파일 
* vite.dist.config.js - npm 배포용 설정파일 
* vite.prod.config.js - github pages 배포용 설정 파일 

# 테스트 하기 

프로젝트는 간단하게 테스트를 수행할 수 있습니다. 

```
npm test 
```

내부적으로는 vitest 를 사용해서 테스트 합니다. 

xxx.test.js 형태로 테스트 파일을 작성하면 됩니다. ([여기](src/elf/core/parser/PathParser.test.js)를 참고해주세요.)

# Sapa 와 이벤트 시스템 

Sapa 는 에디터를 개발하기 위한 UI 시스템과  이벤트 시스템이 합쳐져 있는 라이브러리입니다. 

Sapa 에 대한 간략한 소개는 [여기](https://sapa.easylogic.studio/) 를 봐주세요. 
한글은 [개발자, UI라이브러리를 만들다](https://velog.io/@easylogic/%EA%B0%9C%EB%B0%9C%EC%9E%90-UI-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC%EB%A5%BC-%EB%A7%8C%EB%93%A4%EB%8B%A4)를 참고해주세요.

기본적으로 에디터의 모든 UI 와 이벤트는 Sapa 를 통해서 구현되어 집니다. 

# JS & JSX 

에디터는 js 파일을 사용해서 작성할 수 있고 때에 따라서는 jsx 문법을 사용할 수 있습니다.  jsx 에서 번역된 템플릿은 모두 html 문자열로 대체됩니다. 


# 에디터 기능 만들기 

이제 실제로 에디터를 확장해볼 시간입니다. 에디터는 아래와 같은 몇가지 형태로 확장이 가능합니다. 

에디터는 크게  렌더링 영역을 표현하는  모델과 렌더러 가 존재하고  에디터 자체를 구성하는 영역으로 나뉩니다. 

## 렌더링 영역 

* [모델](./Model.md)
* [렌더러](./Renderer.md)

## 에디터 영역 

* [에디터 레이아웃](./Layout.md) 
* [속성편집기](./Inspector.md) 
* [커맨드](./Command.md) 
* [단축키](./Shortcut.md) 
* [설정](./Config.md)
* [UI 만들기](./UI.md)

## 유틸리티 영역 

* [좌표 시스템](./Geometry.md)

# 플러그인 만들기 

위에 나열한 모든 내용들은 플러그인 형태로 확장을 할 수 있습니다. 

src/plugins/ 를 참고하세요. 

플러그인을 만들기 위해서는 [여기](./Plugin.md)을 참고하세요.


# 유용한 API 모음 

### 렌더링 레이어 속성 변경하기 

```js

// 커맨드 상에서 
editor.context.commands.executeCommand('setAttribute', 'change property', editor.context.selection.packByValue({
    'background-color': 'red'
}))

// ui 상에서 
this.$context.commands.executeCommand('setAttribute', 'change property', this.$context.selection.packByValue({
    'background-color': 'red'
}))

```

### 현재 선택된 레이어 얻어오기 

```js
const layer = editor.context.selection.current;

// or 
const layer = this.$context.selection.current;

```