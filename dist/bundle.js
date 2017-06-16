(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.S = factory());
}(this, (function () { 'use strict';

function mount(rootComponent, rootNodeSelector) {
  var vDom = {};
  var rootNode = document.querySelector(rootNodeSelector);

  rootNode.innerHTML = renderComponent(rootComponent, vDom, null, true);
  console.log(vDom);
}

var uniqueId = 0;

function getId() {
  return uniqueId++;
}

function initComponent(component) {
  var componentAfterInit = component();
  componentAfterInit.id = getId();

  return componentAfterInit;
}

function wrapComponentWithId(html, id) {
  // return `<div id="${id}">${html}</div>`;
  return '\n    <!-- <fr id: ' + id + '> -->\n    ' + html + '\n    <!-- </fr id: ' + id + '> -->\n  ';
}

function attatchVDomComponent(componentAfterInit, vDomComponent, parentComponent, isNonComponent) {
  if (isNonComponent) {
    if (!parentComponent) {
      vDomComponent[componentAfterInit] = { component: componentAfterInit, children: {} };
    } else {
      vDomComponent.children[componentAfterInit] = { component: componentAfterInit, children: {} };
    }
  } else {
    if (!parentComponent) {
      vDomComponent[componentAfterInit.id] = { component: componentAfterInit, children: {} };
    } else {
      vDomComponent.children[componentAfterInit.id] = { component: componentAfterInit, children: {} };
    }
  }
}

function cacheVDomRender(component, vDomComponent, parentComponent, html, isNonComponent) {
  if (isNonComponent) {
    if (!parentComponent) {
      vDomComponent[component].cache = html;
    } else {
      vDomComponent.children[component].cache = html;
    }
  } else {
    if (!parentComponent) {
      vDomComponent[component.id].cache = html;
    } else {
      vDomComponent.children[component.id].cache = html;
    }
  }
}

function renderComponent(component) {
  var vDomComponent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var parentComponent = arguments[2];
  var isInit = arguments[3];

  var componentAfterInit = initComponent(component);

  if (isInit) {
    attatchVDomComponent(componentAfterInit, vDomComponent, parentComponent);
  }

  if (componentAfterInit.willRender) {
    componentAfterInit.willRender();
  }

  var componentRaw = componentAfterInit.render();
  var renderedHtml = toHtml(componentRaw.strings, componentRaw.children, vDomComponent[componentAfterInit.id], component, isInit);

  if (componentAfterInit.didRender) {
    componentAfterInit.didRender();
  }
  cacheVDomRender(componentAfterInit, vDomComponent, parentComponent, renderedHtml);

  // return renderedHtml;
  return wrapComponentWithId(renderedHtml, componentAfterInit.id);
}

function renderNonComponent(nonComponent, vDomComponent, parentComponent, isInit) {
  if (isInit) {
    attatchVDomComponent(nonComponent, vDomComponent, parentComponent, true);
  }
  cacheVDomRender(nonComponent, vDomComponent, parentComponent, nonComponent, true);

  return nonComponent;
}

function isComponent(maybeComponent) {
  return typeof maybeComponent === 'function';
}

function maybeRenderComponent(maybeComponent, vDomComponent, parentComponent, isInit) {
  if (isComponent(maybeComponent)) {
    return renderComponent(maybeComponent, vDomComponent, parentComponent, isInit);
  } else {
    return renderNonComponent(maybeComponent, vDomComponent, parentComponent, isInit);
  }
}

function toHtml(strings, children, vDomComponent, component, isInit) {
  var result = '';
  var remainingStrings = strings.slice();

  if (remainingStrings.length < 2) {
    return remainingStrings[0];
  }

  result += remainingStrings.shift();

  while (children.length) {
    result += maybeRenderComponent(children.shift(), vDomComponent, component, isInit);

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
