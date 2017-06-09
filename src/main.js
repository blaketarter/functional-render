function mount(rootComponent, rootNodeSelector) {
  const rootNode = document.querySelector(rootNodeSelector);
  rootNode.innerHTML = renderComponent(rootComponent());
}
  
function renderComponent(component) {
  if (component.willRender) {
    component.willRender();
  }

  const renderedHtml = component.render();

  if (component.didRender) {
    component.didRender();
  }

  return renderedHtml;
}

function isComponent(maybeComponent) {
  return (typeof maybeComponent === 'object' && maybeComponent.render);
}
  
function maybeRenderComponent(maybeComponent) {
  if (isComponent(maybeComponent)) {
    return renderComponent(maybeComponent);
  } else {
    return maybeComponent;
  }
}
  
function html(strings, ...children) {
  let result = '';
  let remainingStrings = strings.slice();

  if (remainingStrings.length < 2) {
    return remainingStrings[0];
  }

  result += remainingStrings.shift();

  while (children.length) {
    result += maybeRenderComponent(children.shift());

    if (remainingStrings.length > 1) {
      result += remainingStrings.shift();
    }
  }

  result += remainingStrings.pop();

  return result;
}

export default {
  mount,
  html,
};
