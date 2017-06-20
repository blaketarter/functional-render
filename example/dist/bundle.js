(function () {
'use strict';

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

function initComponent(component) {
  return new component();
}

function mountComponent(component) {
  if (component.willMount) {
    component.willMount();
  }

  var renderResults = component.render();

  if (component.didMount) {
    component.didMount();
  }

  return renderResults;
}

var Component = function Component() {
  classCallCheck(this, Component);

  this._id = getId();
};

function isComponent(maybeComponent) {
  return typeof maybeComponent === 'function';
}

function generateVDom(rootComponent) {
  var vDom = {
    root: null
  };

  vDom.root = createVDomNode(rootComponent);

  return vDom;
}

function createVDomNode(maybeComponent, parentNode) {
  if (isComponent(maybeComponent)) {
    return createVDomNodeFromComponent(maybeComponent, parentNode);
  }

  return createVDomNodeFromNonComponent(maybeComponent, parentNode);
}

function createVDomNodeFromComponent(component, parentNode) {
  var componentAfterInit = initComponent(component);
  var mountResults = mountComponent(componentAfterInit);

  var node = {
    id: componentAfterInit._id,
    component: componentAfterInit,
    parentNode: parentNode,
    cache: [],
    html: mountResults.strings,
    children: [],
    isComponent: true
  };

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
    isComponent: false
  };

  return node;
}

function cacheVDomChild(vDomNode, childIndex, html) {
  vDomNode.cache[childIndex] = html;
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

function mount(rootComponent, rootNodeSelector) {
  var rootNode = document.querySelector(rootNodeSelector);
  var vDom = generateVDom(rootComponent);

  rootNode.innerHTML = createHtml(vDom.root);
  console.log(vDom);
}

function html(strings) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return { strings: strings, children: children };
}

var _templateObject = taggedTemplateLiteral(['<p>Foo</p>'], ['<p>Foo</p>']);
var _templateObject2 = taggedTemplateLiteral(['\n      <h1>Hello World</h1>\n      ', '\n      ', '\n    '], ['\n      <h1>Hello World</h1>\n      ', '\n      ', '\n    ']);

var staticHr = '<hr />';

var Foo = function (_Component) {
  inherits(Foo, _Component);

  function Foo() {
    classCallCheck(this, Foo);
    return possibleConstructorReturn(this, (Foo.__proto__ || Object.getPrototypeOf(Foo)).apply(this, arguments));
  }

  createClass(Foo, [{
    key: 'render',
    value: function render() {
      return html(_templateObject);
    }
  }]);
  return Foo;
}(Component);

var App = function (_Component2) {
  inherits(App, _Component2);

  function App() {
    classCallCheck(this, App);

    var _this2 = possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    console.log('App constructor');
    return _this2;
  }

  createClass(App, [{
    key: 'willMount',
    value: function willMount() {
      console.log('App willMount');
    }
  }, {
    key: 'didMount',
    value: function didMount() {
      console.log('App didMount');
    }
  }, {
    key: 'render',
    value: function render() {
      console.log('App Render');
      return html(_templateObject2, staticHr, Foo);
    }
  }]);
  return App;
}(Component);

mount(App, '.app');

}());
