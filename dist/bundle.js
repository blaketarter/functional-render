(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.S = factory());
}(this, (function () { 'use strict';

function mount(rootComponent, rootNodeSelector) {
  var vDom = {};
  var rootNode = document.querySelector(rootNodeSelector);

  rootNode.innerHTML = renderComponent(rootComponent, vDom, null);
  console.log(vDom);
}

function renderComponent(component) {
  var vDomComponent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var parentComponent = arguments[2];

  var componentAfterInit = component();

  if (!parentComponent) {
    console.log('root');
    vDomComponent[component.name] = { component: componentAfterInit, children: {} };
  } else {
    vDomComponent.children[component.name] = { component: componentAfterInit, children: {} };
  }

  if (componentAfterInit.willRender) {
    componentAfterInit.willRender();
  }

  var componentRaw = componentAfterInit.render();
  var renderedHtml = toHtml(componentRaw.strings, componentRaw.children, vDomComponent[component.name], component);

  if (componentAfterInit.didRender) {
    componentAfterInit.didRender();
  }

  return renderedHtml;
}

function renderNonComponent(nonComponent, vDomComponent, parentComponent) {

  if (!parentComponent) {
    console.log('root non component');
    vDomComponent[nonComponent] = { component: nonComponent, children: {} };
  } else {
    vDomComponent.children[nonComponent] = { component: nonComponent, children: {} };
  }

  return nonComponent;
}

function isComponent(maybeComponent) {
  return typeof maybeComponent === 'function';
}

function maybeRenderComponent(maybeComponent, vDomComponent, parentComponent) {
  if (isComponent(maybeComponent)) {
    return renderComponent(maybeComponent, vDomComponent, parentComponent);
  } else {
    return renderNonComponent(maybeComponent, vDomComponent, parentComponent);
  }
}

function toHtml(strings, children, vDomComponent, component) {
  var result = '';
  var remainingStrings = strings.slice();

  if (remainingStrings.length < 2) {
    return remainingStrings[0];
  }

  result += remainingStrings.shift();

  while (children.length) {
    result += maybeRenderComponent(children.shift(), vDomComponent, component);

    if (remainingStrings.length > 1) {
      result += remainingStrings.shift();
    }
  }

  result += remainingStrings.pop();

  return result;
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
