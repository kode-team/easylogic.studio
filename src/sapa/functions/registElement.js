import { isString } from "./func";
import { uuidShort } from "./uuid";

const map = {};
const handlerMap = {};
const aliasMap = {};
const __rootInstance = new Set();
const __tempVariables = new Map();
const __tempVariablesGroup = new Map();

export const VARIABLE_SAPARATOR = "v:";

/**
 * props 를 넘길 때 해당 참조를 그대로 넘기기 위한 함수
 *
 * @param {any} value
 * @returns {string} 참조 id 생성
 */
export function variable(value, groupId = "") {
  const id = `${VARIABLE_SAPARATOR}${uuidShort()}`;

  __tempVariables.set(id, value);

  if (groupId) {
    __tempVariablesGroup.has(groupId) ||
      __tempVariablesGroup.set(groupId, new Set());
    __tempVariablesGroup.get(groupId).add(id);
  }

  return id;
}

/**
 * groupId 로 지정된 변수를 초기화 해준다.
 *
 * @copilot
 * @param {*} groupId
 */
export function initializeGroupVariables(groupId) {
  if (__tempVariablesGroup.has(groupId)) {
    __tempVariablesGroup.get(groupId).forEach((id) => {
      __tempVariables.delete(id);
    });
    __tempVariablesGroup.delete(groupId);
  }
}

/**
 * 참조 id 를 가지고 있는 variable 을 복구한다.
 *
 * @param {string} id
 * @returns {any}
 */
export function recoverVariable(id, removeVariable = true) {
  if (isString(id) === false) {
    return id;
  }

  let value = id;

  if (__tempVariables.has(id)) {
    value = __tempVariables.get(id);

    if (removeVariable) {
      __tempVariables.delete(id);
    }
  }

  return value;
}

export function getVariable(idOrValue) {
  if (__tempVariables.has(idOrValue)) {
    return __tempVariables.get(idOrValue);
  }

  return idOrValue;
}

export function hasVariable(id) {
  return __tempVariables.has(id);
}

/**
 * 객체를 key=value 문자열 리스트로 변환한다.
 *
 * @param {object} obj
 * @returns {string}
 */
export function spreadVariable(obj) {
  return Object.entries(obj)
    .map(([key, value]) => {
      return `${key}=${variable(value)}`;
    })
    .join(" ");
}

export function registElement(classes = {}) {
  Object.keys(classes).forEach((key) => {
    map[key] = classes[key];
  });
}

export function replaceElement(module) {
  if (map[module.name]) {
    map[module.name] = module;
  }
}

export function registAlias(a, b) {
  aliasMap[a] = b;
}

export function retriveAlias(key) {
  return aliasMap[key];
}

export function retriveElement(className) {
  return map[retriveAlias(className) || className];
}

export function registRootElementInstance(instance) {
  __rootInstance.add(instance);
}

export function getRootElementInstanceList() {
  return [...__rootInstance];
}

export function renderRootElementInstance(module) {
  replaceElement(module);

  getRootElementInstanceList().forEach((instance) => {
    instance.hmr();
  });
}

export function registHandler(handlers) {
  Object.keys(handlers).forEach((key) => {
    handlerMap[key] = handlers[key];
  });
}

export function retriveHandler(className) {
  return handlerMap[className];
}

export function createHandlerInstance(context) {
  return Object.keys(handlerMap)
    .filter((key) => Boolean(handlerMap[key]))
    .map((key) => {
      const HandlerClass = handlerMap[key];
      return new HandlerClass(context);
    });
}
