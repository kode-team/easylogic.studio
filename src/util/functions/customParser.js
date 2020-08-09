export function getCustomParseIndexString(it, prefix = '@' ) {
    return `${prefix}${it.startIndex}`.padEnd(10, '0');
}

export function customParseMatches (str, regexp) {
    const matches = str.match(regexp);
    let result = [];

    if (!matches) {
        return result;
    }

    for (var i = 0, len = matches.length; i < len; i++) {
        result.push({ parsedString: matches[i] });
    }

    var pos = { next: 0 }
    result.forEach(item => {
        const startIndex = str.indexOf(item.parsedString, pos.next);

        item.startIndex = startIndex;
        item.endIndex = startIndex + item.parsedString.length;

        pos.next = item.endIndex;
    });

    return result;
}

export function customParseConvertMatches (str, regexp) {
    const m = customParseMatches(str, regexp); 

    m.forEach(it => {
        str = str.replace(it.parsedString, getCustomParseIndexString(it))
    })

    return { str, matches: m }
}

export function customParseReverseMatches (str, matches) {
    matches.forEach(it => {
        str = str.replace(getCustomParseIndexString(it), it.parsedString)
    })

    return str;
}
