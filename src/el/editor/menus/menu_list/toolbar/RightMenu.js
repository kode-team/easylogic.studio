export default [
    {
        type: 'button', 
        icon: (editor) => {
            if (editor.config.is('editor.theme', 'dark')) {
                return 'dark';
            } else {
                return 'light';
            }
        }, 
        action: (editor) => {
            if (editor.config.get('editor.theme') === 'dark') {
                editor.config.set('editor.theme', 'light');
            } else {
                editor.config.set('editor.theme', 'dark');
            }
        }
    }
]