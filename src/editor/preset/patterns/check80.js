import _checkPattern from "./_checkPattern"

export default { 
    key: 'check20', 
    color: '#DDB104',
    backgroundColor: 'rgba(254,240,188,0.9)',
    execute: function () {
        return _checkPattern(80);
    }
}
