declare module "@easylogic/editor" {

    interface IKeyValue {
        [key: string]: any;
    }

    interface EditorInterface {
        createDesignEditor: (opt: IKeyValue = {}) => EditorInterface;
    }

    const exampleLib: EditorInterface;
    export default editor;
}