(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.S = global.S || {})));
}(this, (function (exports) { 'use strict';

var uniqueId = 0;

function getId() {
  return uniqueId++;
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function initComponent(component, vDomNode) {
  if (component._isInitialized) {
    return component;
  }

  var componentAfterInit = new component();

  componentAfterInit._isInitialized = true;
  componentAfterInit._setVDomNode(vDomNode);

  return componentAfterInit;
}

function mountComponent(component) {
  if (!component._isMounted && component.willMount) {
    component.willMount();
  }

  var renderResults = component.render();

  if (!component._isMounted && component.didMount) {
    component.didMount();
  }

  component._isMounted = true;

  return renderResults;
}

var Component = function () {
  function Component() {
    classCallCheck(this, Component);

    this._id = getId();
    this._isComponent = true;
    this._isMounted = false;
    this._isInitialized = false;
  }

  createClass(Component, [{
    key: '_setVDomNode',
    value: function _setVDomNode(vDomNode) {
      this._vDomNode = vDomNode;
    }
  }, {
    key: 'setState',
    value: function setState(newState) {
      if (typeof this.state === 'Object' && typeof newState === 'Object') {
        this.state = _extends({}, this.state, newState);
      } else {
        this.state = newState;
      }

      reRenderVDomNode(this._vDomNode);
    }
  }]);
  return Component;
}();

function isComponent(maybeComponent) {
  return typeof maybeComponent === 'function' || maybeComponent instanceof Component;
}

function createHtml(vDomNode) {
  if (vDomNode.isComponent) {
    return createHtmlFromComponent(vDomNode);
  }

  return createHtmlFromNonComponent(vDomNode);
}

function createHtmlFromComponent(vDomNode) {
  var html = '';

  html += vDomNode.html[0];

  for (var i = 0, ii = vDomNode.children.length; i < ii; i++) {
    var childHtml = createHtml(vDomNode.children[i]);
    html += childHtml;

    cacheVDomChild(vDomNode, i, childHtml);

    if (vDomNode.html.length > i) {
      html += vDomNode.html[i + 1];
    }
  }

  if (vDomNode.html.length > 1) {
    html += vDomNode.html[vDomNode.html.length - 1];
  }

  return html;
}

function createHtmlFromNonComponent(vDomNode) {
  return vDomNode.component;
}

function generateVDom(rootComponent, rootDomNode) {
  var vDom = createVDomNode(rootComponent);
  vDom.domNode = rootDomNode;

  return vDom;
}

function createVDomNode(maybeComponent, parentNode) {
  if (isComponent(maybeComponent)) {
    return createVDomNodeFromComponent(maybeComponent, parentNode);
  }

  return createVDomNodeFromNonComponent(maybeComponent, parentNode);
}

function createVDomNodeFromComponent(component, parentNode) {
  var node = {
    id: null,
    component: null,
    parentNode: parentNode,
    cache: [],
    html: null,
    children: [],
    isComponent: true,
    domNode: null
  };

  var componentAfterInit = initComponent(component, node);
  var mountResults = mountComponent(componentAfterInit);

  node.id = componentAfterInit._id;
  node.component = componentAfterInit;
  node.html = mountResults.strings;

  node.children = mountResults.children.map(function (child) {
    return createVDomNode(child, node);
  });

  return node;
}

function createVDomNodeFromNonComponent(nonComponent, parentNode) {
  var id = getId();

  var node = {
    id: id,
    component: nonComponent,
    parentNode: parentNode,
    cache: [],
    html: null,
    children: null,
    isComponent: false,
    domNode: null
  };

  return node;
}

function cacheVDomChild(vDomNode, childIndex, html) {
  vDomNode.cache[childIndex] = html;
}

function reRenderVDomNode(vDomNode) {
  var currentNode = vDomNode;
  var domNode = vDomNode.domNode;

  if (currentNode.parentNode) {
    var currentNodeIndex = currentNode.parentNode.children.indexOf(currentNode);
    currentNode.parentNode.children[currentNodeIndex] = createVDomNode(currentNode.component, currentNode.parentNode);
  } else {
    currentNode = createVDomNode(currentNode.component);
    currentNode.domNode = domNode;
  }

  while (currentNode.parentNode) {
    currentNode = currentNode.parentNode;
  }

  currentNode.domNode.innerHTML = createHtml(currentNode);
}

function mount(rootComponent, rootNodeSelector) {
  var rootNode = document.querySelector(rootNodeSelector);
  var vDom = generateVDom(rootComponent, rootNode);

  rootNode.innerHTML = createHtml(vDom);
  console.log(vDom);
}

function html(strings) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return { strings: strings, children: children };
}

exports.mount = mount;
exports.html = html;
exports.Component = Component;

Object.defineProperty(exports, '__esModule', { value: true });

})));
