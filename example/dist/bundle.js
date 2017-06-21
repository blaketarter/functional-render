(function () {
'use strict';

var uniqueId = 0;

function getId() {
  return uniqueId++;
}

function isComponent(maybeComponent) {
  return typeof maybeComponent === 'function' || maybeComponent instanceof Component || isComponentArray(maybeComponent);
}

function isComponentArray(maybeComponentArray) {
  return maybeComponentArray instanceof Array && (typeof maybeComponentArray[0] === 'function' || maybeComponentArray[0] instanceof Component);
}

var htmlRegex = /<[^>]*>/;

function findHtmlTag(string) {
  return string.match(htmlRegex);
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



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};









var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

function initComponent(component, vDomNode) {
  var props = {};
  var realComponent = void 0;

  if (isComponentArray(component)) {
    realComponent = component[0];
    props = component[1];
  } else {
    realComponent = component;
  }

  if (realComponent._isInitialized) {
    return realComponent;
  }

  var componentAfterInit = new realComponent(props);

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
      if (!this._isMounted) {
        return;
      }

      if (typeof this.state === 'Object' && typeof newState === 'Object') {
        this.state = _extends({}, this.state, newState);
      } else {
        this.state = newState;
      }

      reRenderVDomNode(this._vDomNode);
    }
  }], [{
    key: 'props',
    value: function props(newProps) {
      return [this, newProps];
    }
  }]);
  return Component;
}();

function createHtml(vDomNode) {
  if (vDomNode.isComponent) {
    return createHtmlFromComponent(vDomNode);
  }

  return createHtmlFromNonComponent(vDomNode);
}

function getStyles(component) {
  if (!component.getStyles) {
    return '';
  }
  return '<style scoped>' + component.getStyles() + '</style>';
}

function attatchIdAndStyles(html, tagMatch, vDomNode) {
  return [html.substring(0, tagMatch[0].length - 1 + tagMatch.index), ' data-s-id="' + vDomNode.id + '">', getStyles(vDomNode.component), html.substring(tagMatch[0].length + tagMatch.index)].join('');
}

function createHtmlFromComponent(vDomNode) {
  var html = '';
  var foundFirstTag = false;

  html += vDomNode.html[0];

  for (var i = 0, ii = vDomNode.children.length; i < ii; i++) {
    if (!foundFirstTag) {
      var tagMatch = findHtmlTag(html);

      if (tagMatch.length) {
        foundFirstTag = true;
        html = attatchIdAndStyles(html, tagMatch, vDomNode);
      }
    }

    var childHtml = createHtml(vDomNode.children[i]);
    html += childHtml;

    cacheVDomChild(vDomNode, i, childHtml);

    if (vDomNode.html.length > i) {
      html += vDomNode.html[i + 1];
    }
  }

  // if (!vDomNode.children.length && vDomNode.html.length > 1) {
  //   html += vDomNode.html[vDomNode.html.length - 1];
  // }

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

  // console.dir(document.querySelectorAll(`[data-s-id="${currentNode.id}"]`)[0]);

  // document.querySelectorAll(`[data-s-id="${currentNode.id}"]`)[0].outerHTML = createHtml(currentNode);
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

var _templateObject = taggedTemplateLiteral(['<p>Foo ', '</p>'], ['<p>Foo ', '</p>']);
var _templateObject2 = taggedTemplateLiteral(['\n      <h1 onClick="', '">Hello World ', '</h1>\n      ', '\n      ', '\n    '], ['\n      <h1 onClick="', '">Hello World ', '</h1>\n      ', '\n      ', '\n    ']);

var staticHr = '<hr />';

var Foo = function (_Component) {
  inherits(Foo, _Component);

  function Foo(props) {
    classCallCheck(this, Foo);

    var _this = possibleConstructorReturn(this, (Foo.__proto__ || Object.getPrototypeOf(Foo)).call(this));

    _this.state = {
      bar: props.bar
    };
    return _this;
  }

  createClass(Foo, [{
    key: 'render',
    value: function render() {
      return html(_templateObject, this.state.bar);
    }
  }]);
  return Foo;
}(Component);

var App = function (_Component2) {
  inherits(App, _Component2);

  function App() {
    classCallCheck(this, App);

    var _this2 = possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this2.state = 0;
    console.log('App constructor');
    return _this2;
  }

  createClass(App, [{
    key: 'getStyles',
    value: function getStyles() {
      return '\n      h1 {\n        color: blue;\n      }\n    ';
    }
  }, {
    key: 'willMount',
    value: function willMount() {
      console.log('App willMount');
    }
  }, {
    key: 'didMount',
    value: function didMount() {
      var _this3 = this;

      console.log('App didMount');
      setTimeout(function () {
        return _this3.setState(10);
      }, 1000);
    }
  }, {
    key: 'onClick',
    value: function onClick() {
      this.setState(this.state++);
    }
  }, {
    key: 'render',
    value: function render() {
      console.log('App Render');
      return html(_templateObject2, this.onClick.bind(this), this.state, staticHr, Foo.props({ bar: 'Baz' }));
    }
  }]);
  return App;
}(Component);

mount(App, '.app');

}());
