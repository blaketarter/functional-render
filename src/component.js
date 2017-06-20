import { getId } from './id';
import { reRenderVDomNode } from './vDom';

export function initComponent(component, vDomNode) {
  if (component._isInitialized) {
    return component;
  }

  const componentAfterInit = new component();

  componentAfterInit._isInitialized = true;
  componentAfterInit._setVDomNode(vDomNode);

  return componentAfterInit;
}

export function mountComponent(component) {
  if (!component._isMounted && component.willMount) {
    component.willMount();
  }

  const renderResults = component.render();

  if (!component._isMounted && component.didMount) {
    component.didMount();
  }

  component._isMounted = true;  

  return renderResults;
}

export class Component {
  constructor() {
    this._id = getId();
    this._isComponent = true;
    this._isMounted = false;
    this._isInitialized = false;
  }

  _setVDomNode(vDomNode) {
    this._vDomNode = vDomNode;
  }

  setState(newState) {
    if (typeof this.state === 'Object' && typeof newState === 'Object') {
      this.state = { ...this.state, ...newState };
    } else {
      this.state = newState;
    }

    reRenderVDomNode(this._vDomNode);
  }
}
