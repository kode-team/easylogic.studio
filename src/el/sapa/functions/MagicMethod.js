
export const MAGIC_METHOD_REG = /^@magic\:([a-zA-Z][a-zA-Z0-9]*)[\W]{1}(.*)*$/g;
export const MAGIC_METHOD = "@magic:";
export const SPLITTER = "|";
export const FUNC_REGEXP = /(([\$a-z_\-]+)\([^\(\)]*\)|([a-z_\-]+))/gi;
export const FUNC_START_CHARACTER = "(";
export const FUNC_END_CHARACTER = ")";

export default class MagicMethod {

    static make (str, ...args) {
        return `${MAGIC_METHOD}${str} ${args.join(SPLITTER)}`;
    }

    static check(str) {
        return str.match(MAGIC_METHOD_REG) !== null;
    }

    static parse (str)  {
        const matches = str.match(MAGIC_METHOD_REG);
    
        if (!matches) {
            return undefined;
        }    

        const result = matches[0].split(MAGIC_METHOD)[1].split(SPLITTER).map(item => item.trim());

        let [ initializer, ...pipes ] = result;
        const [ method, ...args ] = initializer.split(" ");

        const pipeList = pipes.map(it => {
            return this.parsePipe(it);
        }).filter(it => it.value);

        const pipeObjects = {
            'function': [],
            'keyword': [],
            'value': []
        };
        
        pipeList.forEach(pipe => {
            if (pipe.type === "function") {
                pipeObjects.function.push(pipe);
            } else if (pipe.type === "keyword") {
                pipeObjects.keyword.push(pipe);
            } else {
                pipeObjects.value.push(pipe);
            }
        });

        return {
            originalMethod: str,
            method,
            args,
            pipes: pipeList,
            keys: pipeObjects
        };
    }

    static parsePipe(it) {
        const result = it.match(FUNC_REGEXP);

        if (!result) {
            return {
                type: "value",
                value: it
            };
        }

        const [value] = result;

        if (value.includes(FUNC_START_CHARACTER)) {

            const [func, rest] = value.split(FUNC_START_CHARACTER)
            const [args] = rest.split(FUNC_END_CHARACTER);        
            return {
                type: "function",
                value,
                func,
                args: args.split(",").map(it => it.trim()).filter(Boolean)
            }
        } 

        return {
            type: "keyword",
            value: result[0]
        }
    }
}