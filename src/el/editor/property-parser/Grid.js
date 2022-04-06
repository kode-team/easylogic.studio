import { parseValue } from "el/utils/css-function-parser";
import { FuncType } from 'el/editor/types/model';

export class Grid {
    static parseStyle(value) {

        const units = [];

        // column width
        parseValue(value).forEach((it) => {
            switch (it.func) {
                case FuncType.REPEAT:
                    for (var i = 0, len = it.parsed.count; i < len; i++) {
                        units.push(it.parsed.length);
                    }
                    break;
                case FuncType.LENGTH:
                    units.push(it.parsed);
                    break;
                case FuncType.KEYWORD:
                    units.push(it.matchedString);
                    break;
            }
        });

        return units;
    }

    static join(values = []) {
        return values.join(' ');
    }
}