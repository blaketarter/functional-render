(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.S = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function mount(rootComponent, rootNodeSelector) {
  var rootNode = document.querySelector(rootNodeSelector);
  rootNode.innerHTML = renderComponent(rootComponent());
}

function renderComponent(component) {
  if (component.willRender) {
    component.willRender();
  }

  var renderedHtml = component.render();

  if (component.didRender) {
    component.didRender();
  }

  return renderedHtml;
}

function isComponent(maybeComponent) {
  return (typeof maybeComponent === 'undefined' ? 'undefined' : _typeof(maybeComponent)) === 'object' && maybeComponent.render;
}

function maybeRenderComponent(maybeComponent) {
  if (isComponent(maybeComponent)) {
    return renderComponent(maybeComponent);
  } else {
    return maybeComponent;
  }
}

function html(strings) {
  var result = '';
  var remainingStrings = strings.slice();

  if (remainingStrings.length < 2) {
    return remainingStrings[0];
  }

  result += remainingStrings.shift();

  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  while (children.length) {
    result += maybeRenderComponent(children.shift());

    if (remainingStrings.length > 1) {
      result += remainingStrings.shift();
    }
  }

  result += remainingStrings.pop();

  return result;
}

var main = {
  mount: mount,
  html: html
};

return main;

})));
