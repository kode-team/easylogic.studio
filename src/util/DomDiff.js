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
    if (typeof value === 'boolean') {
        setBooleanProp(el, name, value);
    } else {
        el.setAttribute(name, value);
    }
};


const removeBooleanProp = (node, name) => {
    node.removeAttribute(name);
    node[name] = false;
};
  
const removeProp = (node, name, value) => {
    if (typeof value === 'boolean') {
        removeBooleanProp(node, name);
    }
};
  

const updateProp = (node, name, newValue, oldValue) => {
    if (!newValue) {
      removeProp(node, name, oldValue);
    } else if (!oldValue || newValue === oldValue) {
      setProp(node, name, newValue);
    }
  };


const updateProps = (node, newProps = {}, oldProps = {}) => {
    const props = {...newProps,...oldProps};
  
    Object.keys(props).forEach((name) => {
      updateProp(node, name, newProps[name], oldProps[name]);
    });
};

function changed(node1, node2) {
    return (
        (node1 !== node2) 
        || (node1.nodeType === Node.TEXT_NODE && node1 !== node2) 
        || node1.nodeName !== node2.nodeName
    )
}

function getProps (attributes) {
    var len = attributes.length;

    var results = {}
    for(var i = 0; i < len; i++) {
        results[attributes[i].name] = attributes[i].value;
    }

    return results;
    
}

function updateElement ($parent, oldEl, newEl, i) {
    if (!oldEl) {
        $parent.appendChild(newEl.cloneNode(true));
    } else if (!newEl) {
        $parent.removeChild(oldEl);
    } else if (changed(newEl, oldEl)) {
        $parent.replaceChild(newEl.cloneNode(true), oldEl);
    } else if (newEl.nodeType != Node.TEXT_NODE) {
        updateProps(oldEl, getProps(oldEl.attributes), getProps(oldEl.attributes)); // added        
        var oldChildren = children(oldEl);
        var newChildren = chlidren(newEl);
        var max = Math.max(oldChildren.length, newChildren.length);

        for (var i = 0; i < max; i++) {
            updateElement(oldEl, oldChildren[i], newChildren[i], i);
        }
    }

}

const children = (el) => {
    var element = el.firstElementChild; 

    if (!element) {
        return [] 
    }

    var results = [] 

    do {
        results.push(element);
        element = element.nextElementSibling;
    } while (element);

    return results; 
}


export function DomDiff (A, B) {
    var aC = children(A);
    var bC = children(B); 

    var len = Math.max(aC.length, bC.length);

    for (var i = 0; i < len; i++) {
        updateElement(A, aC[i], bC[i], i);
    }
}
