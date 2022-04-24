# Editor 스토어 

에디터를 중앙에서 관리하는 스토어 개념의 객체입니다. 

Editor 스토어는 여러가지 Manager 를 통해서 데이타를 관리합니다. 

자세힌 코드는 아래를 참고하세요. 

src/elf/editor/manager

* AssetManager - 에셋 관리 매니저 
* ClipboardManager - 클립보드 관리 매니저 
* CommandMaker - 커맨드를 통합해서 실행할 수 있게 해주는 유틸리티 
* CommandManager - 커맨드 관리 매니저 
* ComponentManager - 컴포넌트 관리 매니저 
* ConfigManager - 설정 관리 매니저 
* CursorManager - 커서 관리 매니저 
* Editor - 매니저를 통합하는 스토어 
* ExportManager - 내보내기 관리 매니저 
* HistoryManager - 히스토리 관리 매니저 
* I18nManager - 다국어 관리 매니저 
* IconManager - 아이콘 관리 매니저 
* InjectManager - UI 인젝션 관리 매니저 
* KeyboardManager - 키보드 관리 매니저 
* LocaleManager - 로케일 설정 관리 매니저 
* LockManager - 렌더링 레이어 lock 설정 관리 매니저 
* ModelManager - Model 생성 관리 매니저 
* ModeViewManager - 에디터 모드 관리 매니저 
* PathKitManager - patkit.wasm 관리 매니저 
* PluginManager - 플러그인 관리 매니저 
* RendererManager - 렌더러 관리 매니저 
* ResourceManager - 리소스 관리 매니저 
* SegmentSelectionManager - 페스에디터에서 사용할 Segment 관리 매니저 
* SelectionManager - 레이어 선택 관리 매니저 
* ShortCutManager - 단축키 관리 매니저 
* SnapManager - 스냅(자석효과) 관리 매니저 
* StorageManager - 프로젝트 저장 관리 매니저 
* ViewportManager - 뷰포트 관리 매니저 
* VisibleManager - 레이어 보이기여부 관리 매니저 
* WorkbenchManager - 에디터 레이아웃 관리 매니저 