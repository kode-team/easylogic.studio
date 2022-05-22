# BaseLayout 

에디터를 만들기 위한 몇가지 시점을 제공한다. 

* 플러그인 로드 
* Config 로드 
* Theme  설정 
* pointer event 설정 

위의 작업이 끝난 이후에 에디터가 렌더링 되면 별로 문제가 없을 듯 하다. 

_isPluginLoaded 매개변수가 true 일 때  render 함수를 제대로 실행하도록 한다. 


# DefaultLayout 

BaseLayout 을 확장한 Layout 이다.  

top, left, body, right  패널을 가지고 있다. 

left 는 splitter 를 가지고 조절이 가능하다. 