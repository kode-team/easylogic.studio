import _checkPattern from "./_checkPattern"

export default { 
    key: 'check', 
    title: 'Check',
    execute: function () {
        return [
            { pattern: `check(20px 20px, 10px 10px, black, transparent)` },
            { pattern: `check(40px 40px, 20px 20px, black, transparent)` },
            { pattern: `check(60px 60px, 30px 30px, #DDB104, rgba(254,240,188,0))` },
            { pattern: `check(80px 80px, 40px 40px, #DDB104, rgba(254,240,188,0))` },
        ]
    }
}