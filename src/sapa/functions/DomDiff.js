import { isFunction } from "./func";

const setBooleanProp = (el, name, value) => {
  if (value) {
    el.setAttribute(name, name);
    el[name] = value;
  } else {
    el.removeAttribute(name);
    el[name] = value;
  }
};

const setProp = (el, name, value) => {
  if (typeof value === "boolean") {
    setBooleanProp(el, name, value);
  } else {
    el.setAttribute(name, value);
  }
};

const removeBooleanProp = (node, name) => {
  node.removeAttribute(name);
  node[name] = false;
};

const removeUndefinedProp = (node, name) => {
  node.removeAttribute(name);
};

const removeProp = (node, name, value) => {
  if (typeof value === "boolean") {
    removeBooleanProp(node, name);
  } else if (name) {
    removeUndefinedProp(node, name);
  }
};

const updateProp = (node, name, newValue, oldValue) => {
  // 필드만 있는 것들은 value 가 없을 수 있기 때문에, 기본 value 를 채워주자.
  if (!newValue) {
    removeProp(node, name, oldValue);
  } else if (!oldValue || newValue !== oldValue) {
    setProp(node, name, newValue);
  } else {
    // console.log(node, name, newValue, oldValue, "noop");
  }
};

const updateProps = (node, newProps = {}, oldProps = {}) => {
  const keyList = [];
  keyList.push.apply(keyList, Object.keys(newProps));
  keyList.push.apply(keyList, Object.keys(oldProps));

  const props = new Set(keyList);

  props.forEach((key) => {
    updateProp(node, key, newProps[key], oldProps[key]);
  });
};

/**
 * TEXT_NODE 일 때   둘 다 공백일 때는  비교하지 않는다.
 *
 * @param {*} node1
 *
 * @param {*} node2
 */
function changed(node1, node2) {
  return (
    (node1.nodeType === window.Node.TEXT_NODE &&
      node1.textContent !== node2.textContent) ||
    node1.nodeName !== node2.nodeName
  );
}

function hasPassed(node1) {
  // <!-- comment -->  형태의 주석일 때는 그냥 패스
  if (node1?.nodeType === 8) {
    return true;
  }

  return (
    node1.nodeType !== window.Node.TEXT_NODE &&
    node1.getAttribute("data-domdiff-pass") === "true"
  );
}

/**
 * refClass 속성을 가지고 있으면 기존 el 을 대체한다.
 *
 */
function hasRefClass(node1) {
  return (
    node1.nodeType !== window.Node.TEXT_NODE && node1.getAttribute("refClass")
  );
}

function getProps(attributes) {
  var results = {};
  const len = attributes.length;
  for (let i = 0; i < len; i++) {
    const t = attributes[i];
    results[t.name] = t.value;
  }

  return results;
}

function checkAllHTML(newEl, oldEl) {
  // console.log(newEl.outerHTML, oldEl.outerHTML);
  return newEl.outerHTML == oldEl.outerHTML;
}

function updateElement(parentElement, oldEl, newEl, i, options = {}) {
  if (!oldEl) {
    parentElement.appendChild(newEl.cloneNode(true));
  } else if (!newEl) {
    parentElement.removeChild(oldEl);
  } else if (hasPassed(oldEl) || hasPassed(newEl)) {
    // NOOP
    // data-domdiff-pass="true" 일 때는 아무것도 비교하지 않고 끝낸다.
  } else if (checkAllHTML(newEl, oldEl)) {
    // outerHTML 이 동일하면 그냥 변경하지 않는다.
    // 자식 비교도 멈춘다.
    // console.log("outerHTML 동일하면 그냥 변경하지 않는다.", newEl, oldEl);
    return;
  } else if (changed(newEl, oldEl) || hasRefClass(newEl)) {
    // node 가 같지 않으면 바꾸고, refClass 속성이 있으면 바꾸고
    parentElement.replaceChild(newEl.cloneNode(true), oldEl);
  } else if (
    newEl.nodeType !== window.Node.TEXT_NODE &&
    newEl.nodeType !== window.Node.COMMENT_NODE &&
    newEl.toString() !== "[object HTMLUnknownElement]"
  ) {
    if (options.checkPassed && options.checkPassed(oldEl, newEl)) {
      // NOOP
      // 정상적인 노드에서 checkPassed 가 true 이면 아무것도 하지 않는다.
      // 다만 자식의 속성은 변경해야한다.
    } else {
      updateProps(
        oldEl,
        getProps(newEl.attributes),
        getProps(oldEl.attributes)
      ); // added
    }

    var oldChildren = children(oldEl);
    var newChildren = children(newEl);
    var max = Math.max(oldChildren.length, newChildren.length);

    for (var index = 0; index < max; index++) {
      updateElement(
        oldEl,
        oldChildren[index],
        newChildren[index],
        index,
        options
      );
    }
  }
}

const children = (el) => {
  var element = el.firstChild;

  if (!element) {
    return [];
  }

  var results = [];

  do {
    results.push(element);
    element = element.nextSibling;
  } while (element);

  return results;
};

// // reconcile children
// // instance 를 그대로 유지하는게 관건이다.
// export function reconcile(childrenA = [], childrenB = []) {
//   const lenA = childrenA.length;
//   const lenB = childrenB.length;
//   const newA = new Array(lenA);
//   const newB = new Array(lenB);

//   const AObj = {};
//   const BObj = {};

//   for (let i = 0; i < lenA; i++) {
//     AObj[childrenA[i].getAttribute("key")] = { index: i, el: childrenA[i] };
//   }

//   for (let i = 0; i < lenB; i++) {
//     newB[i] = {
//       el: childrenB[i],

//       // 같은 키로 sourceEl 이 존재하면 그걸 그대로 사용
//       // 같은 키로 sourceEl 이 존재하지 않으면 그냥 새로 생성한다.
//       sourceEl: AObj[childrenB[i].getAttribute("key")],
//     };
//     BObj[childrenB[i].getAttribute("key")] = { index: i, el: childrenB[i] };
//   }

//   for (let i = 0; i < lenA; i++) {
//     const key = childrenA[i].getAttribute("key");
//     newA[i] = {
//       el: childrenA[i],
//       sourceEl: BObj[key],
//     };
//   }

//   const max = Math.max(lenA, lenB);
//   const lastB = [];
//   for (let i = 0; i < max; i++) {
//     const newAEl = newA[i].el;
//     const newBEl = newB[i].el;
//     const newAKey = newAEl.getAttribute("key");
//     const newBKey = newBEl.getAttribute("key");

//     // newA[i] 의 sourceEl 이 존재하지 않으면 삭제한다.
//     if (!newA[i].sourceEl) {
//       lastB.push(null);
//     }

//     // newB[i] 의 sourceEl 이 존재하지 않으면 추가한다.
//     if (!newB[i].sourceEl) {
//       lastB.push(newB[i].el);
//     }

//     if (newAKey === newBKey) {
//     } else if (newAKey) {
//       // A 에만 있는 것은 삭제
//       newA[i].el.remove();
//     } else if (newBKey) {
//       // B 에만 있는 것은 추가
//       newB[i].el.remove();
//     } else {
//       // 없는 것은 추가
//       newB[i].el.remove();
//     }
//   }

//   return [newA, newB];
// }

/**
 *
 *  DomDiff 를 수행한다.
 *
 *  TODO: id 기반으로 reconcile 을 할 수 있도록 맞춰야 한다.
 *
 * @param {*} A
 * @param {*} B
 * @param {object} options
 * @param {function} [options.checkPassed=undefined]
 */
export function DomDiff(A, B, options = {}) {
  // initialize options parameter
  options.checkPassed = isFunction(options.checkPassed)
    ? options.checkPassed
    : undefined;
  options.removedElements = [];

  A = A.el || A;
  B = B.el || B;

  var childrenA = children(A);
  var childrenB = children(B);

  // reconcile(childrenA, childrenB);

  var len = Math.max(childrenA.length, childrenB.length);
  if (len === 0) {
    return;
  }

  if (childrenA.length === 0 && childrenB.length > 0) {
    // children B 만 존재할 때는 b 에 있는 것을 모두 A 로 추가한다.
    // B 에서 모든 자식을 A 에 추가한다.
    A.append(...childrenB);
  } else if (childrenA.length > 0 && childrenB.length === 0) {
    // children A 만 존재할 때는 A에 있는 것을 모두 삭제한다.
    // noop
    A.textContent = "";
  } else {
    for (var i = 0; i < len; i++) {
      updateElement(A, childrenA[i], childrenB[i], i, options);
    }
  }
}
