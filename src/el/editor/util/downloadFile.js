export default function downloadFile (datauri, filename = 'easylogic.json') {
    var a = document.createElement('a');
    a.href = datauri; 
    a.download = filename 
    a.click();
}