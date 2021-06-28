declare module "@easylogic/editor" {

    interface IKeyValue {
        [key: string]: any;
    }

    interface EditorInterface {
        createDesignEditor: (opt: IKeyValue = {}) => EditorInterface;
    }

    const editor: EditorInterface;
    export default editor;
}