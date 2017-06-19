import { getId } from './id';

export function initComponent(component) {
  const componentAfterInit = component();
  componentAfterInit.id = getId();

  return componentAfterInit;
}

export function mountComponent(component) {
  if (component.willMount) {
    component.willMount();
  }

  const renderResults = component.render();

  if (component.didMount) {
    component.didMount();
  }

  return renderResults;
}
