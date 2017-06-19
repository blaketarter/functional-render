(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.S = factory());
}(this, (function () { 'use strict';

var uniqueId = 0;

function getId() {
  return uniqueId++;
}

function initComponent(component) {
  var componentAfterInit = component();
  componentAfterInit.id = getId();

  return componentAfterInit;
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
    id: componentAfterInit.id,
    component: componentAfterInit,
    parentNode: parentNode,
    cache: null,
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
    cache: null,
    html: null,
    children: null,
    isComponent: false
  };

  return node;
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
    html += createHtml(vDomNode.children[i]);

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

var main = {
  mount: mount,
  html: html
};

return main;

})));
