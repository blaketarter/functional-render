function mount(rootComponent, rootNodeSelector) {
  let vDom = {};
  const rootNode = document.querySelector(rootNodeSelector);

  rootNode.innerHTML = renderComponent(rootComponent, vDom, null);
  console.log(vDom);
}
  
function renderComponent(component, vDomComponent = {}, parentComponent) {
  const componentAfterInit = component();

  if (!parentComponent) {
    console.log('root');
    vDomComponent[component.name] = { component: componentAfterInit, children: {} };
  } else {
    vDomComponent.children[component.name] = { component: componentAfterInit, children: {} };
  }

  if (componentAfterInit.willRender) {
    componentAfterInit.willRender();
  }

  const componentRaw = componentAfterInit.render();
  const renderedHtml = toHtml(componentRaw.strings, componentRaw.children, vDomComponent[component.name], component);

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
  return (typeof maybeComponent === 'function');
}
  
function maybeRenderComponent(maybeComponent, vDomComponent, parentComponent) {
  if (isComponent(maybeComponent)) {
    return renderComponent(maybeComponent, vDomComponent, parentComponent);
  } else {
    return renderNonComponent(maybeComponent, vDomComponent, parentComponent);
  }
}
  
function toHtml(strings, children, vDomComponent, component) {
  let result = '';
  let remainingStrings = strings.slice();

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

function html(strings, ...children) {
  return { strings, children };
}

export default {
  mount,
  html,
};
