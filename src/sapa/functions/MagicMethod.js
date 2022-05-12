export const MAGIC_METHOD_REG = /^@magic:([a-zA-Z][a-zA-Z0-9]*)[\W]{1}(.*)*$/g;
export const MAGIC_METHOD = "@magic:";
export const SPLITTER = "|";
// eslint-disable-next-line no-useless-escape
export const FUNC_REGEXP = /(([\$a-z_\-]+)\([^\(\)]*\)|([a-z_\-]+))/gi;
export const FUNC_START_CHARACTER = "(";
export const FUNC_END_CHARACTER = ")";

const MAGICMETHOD_EXTRA = {
  KEYWORD: "keyword",
  FUNCTION: "function",
  VALUE: "value",
};

export class MagicMethod {
  constructor(obj) {
    this.context = obj.context;
    this.originalMethod = obj.originalMethod;
    this.method = obj.method;
    this.args = obj.args;
    this.pipes = obj.pipes;
    this.keys = obj.keys;
    this.__cache = new Map();
  }

  setCache(key, value) {
    this.__cache.set(key, value);
  }

  hasCache(key) {
    return this.__cache.has(key);
  }

  getCache(key) {
    return this.__cache.get(key);
  }

  /**
   * 특정 키워드가 존재하는지 체크
   *
   * @param {string} keyword
   * @returns {boolean}
   */
  hasKeyword(keyword) {
    if (this.hasCache(keyword)) {
      return this.getCache(keyword);
    }

    let exists = false;

    this.pipes.forEach((pipe) => {
      switch (pipe.type) {
        case MAGICMETHOD_EXTRA.KEYWORD:
          if (pipe.value === keyword) {
            exists = true;
          }
          break;
      }
    });

    this.setCache(keyword, exists);

    return exists;
  }

  /**
   * 특정 키워드가 존재하는지 체크
   *
   * @param {string} keyword
   * @returns {boolean}
   */
  hasFunction(funcName) {
    if (this.hasCache(funcName)) {
      return this.getCache(funcName);
    }

    let exists = !!this.getFunction(funcName);

    this.setCache(funcName, exists);

    return exists;
  }

  /**
   * 함수 파이프 얻어오기
   *
   * @param {string} funcName
   * @returns
   */
  getFunction(funcName) {
    return this.functions.find((pipe) => pipe.func === funcName);
  }

  /**
   * 특정 함수 이름을 가지고 있는 함수 리스트 조회
   *
   * @param {string} funcName
   * @returns
   */
  getFunctionList(funcName) {
    return this.functions.filter((pipe) => pipe.func === funcName);
  }

  get originalCallback() {
    return this.context[this.originalMethod];
  }

  /**
   * keyword 목록 조회
   */
  get keywords() {
    return this.keys[MAGICMETHOD_EXTRA.KEYWORD].map((pipe) => pipe.value);
  }

  /**
   * function 목록 조회
   */
  get functions() {
    return this.keys[MAGICMETHOD_EXTRA.FUNCTION];
  }

  /**
   * 값 목록 조회
   */
  get values() {
    return this.keys[MAGICMETHOD_EXTRA.VALUE].map((pipe) => pipe.value);
  }

  /**
   * context 를 기준으로 original method 를 실행한다.
   *
   * @param  {...any} args
   * @returns
   */
  execute(...args) {
    return this.originalCallback.call(this.context, ...args);
  }

  executeWithContext(context, ...args) {
    return this.originalCallback.call(context, ...args);
  }

  static make(str, ...args) {
    return `${MAGIC_METHOD}${str} ${args.join(SPLITTER)}`;
  }

  static check(str) {
    return str.match(MAGIC_METHOD_REG) !== null;
  }

  static parse(str, context = {}) {
    const matches = str.match(MAGIC_METHOD_REG);

    if (!matches) {
      return undefined;
    }

    const result = matches[0]
      .split(MAGIC_METHOD)[1]
      .split(SPLITTER)
      .map((item) => item.trim());

    let [initializer, ...pipes] = result;
    const [method, ...args] = initializer.split(" ");

    const pipeList = pipes
      .map((it) => {
        return this.parsePipe(it);
      })
      .filter((it) => it.value);

    const pipeObjects = {
      function: [],
      keyword: [],
      value: [],
    };

    pipeList.forEach((pipe) => {
      if (pipe.type === "function") {
        pipeObjects.function.push(pipe);
      } else if (pipe.type === "keyword") {
        pipeObjects.keyword.push(pipe);
      } else {
        pipeObjects.value.push(pipe);
      }
    });

    return new MagicMethod({
      context,
      originalMethod: str,
      method,
      args,
      pipes: pipeList,
      keys: pipeObjects,
    });
  }

  static parsePipe(it) {
    const result = it.match(FUNC_REGEXP);

    if (!result) {
      return {
        type: "value",
        value: it,
      };
    }

    const [value] = result;

    if (value.includes(FUNC_START_CHARACTER)) {
      const [func, rest] = value.split(FUNC_START_CHARACTER);
      const [args] = rest.split(FUNC_END_CHARACTER);
      return {
        type: "function",
        value,
        func,
        args: args
          .split(",")
          .map((it) => it.trim())
          .filter(Boolean),
      };
    }

    return {
      type: "keyword",
      value: result[0],
    };
  }
}
