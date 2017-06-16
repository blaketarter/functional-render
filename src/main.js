function mount(rootComponent, rootNodeSelector) {
  let vDom = {};
  const rootNode = document.querySelector(rootNodeSelector);

  rootNode.innerHTML = renderComponent(rootComponent, vDom, null, true);
  console.log(vDom);
}

let uniqueId = 0;

function getId() {
  return uniqueId++;
}

function initComponent(component) {
  const componentAfterInit = component();
  componentAfterInit.id = getId();

  return componentAfterInit;
}

function wrapComponentWithId(html, id) {
  // return `<div id="${id}">${html}</div>`;
  return `
    <!-- <fr id: ${id}> -->
    ${html}
    <!-- </fr id: ${id}> -->
  `;
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
  
function renderComponent(component, vDomComponent = {}, parentComponent, isInit) {
  const componentAfterInit = initComponent(component);

  if (isInit) {
    attatchVDomComponent(componentAfterInit, vDomComponent, parentComponent);
  }

  if (componentAfterInit.willRender) {
    componentAfterInit.willRender();
  }

  const componentRaw = componentAfterInit.render();
  const renderedHtml = toHtml(componentRaw.strings, componentRaw.children, vDomComponent[componentAfterInit.id], component, isInit);

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
  return (typeof maybeComponent === 'function');
}
  
function maybeRenderComponent(maybeComponent, vDomComponent, parentComponent, isInit) {
  if (isComponent(maybeComponent)) {
    return renderComponent(maybeComponent, vDomComponent, parentComponent, isInit);
  } else {
    return renderNonComponent(maybeComponent, vDomComponent, parentComponent, isInit);
  }
}
  
function toHtml(strings, children, vDomComponent, component, isInit) {
  let result = '';
  let remainingStrings = strings.slice();

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

function html(strings, ...children) {
  return { strings, children };
}

export default {
  mount,
  html,
};
