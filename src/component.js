import { getId } from './id';

export function initComponent(component) {
  return new component();
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

export class Component {
  constructor() {
    this._id = getId();
  }
}
