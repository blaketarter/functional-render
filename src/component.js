import { getId } from './id';
import { reRenderVDomNode } from './vDom';
import { isComponentArray } from './utils';

export function initComponent(component, vDomNode) {
  let props = {};
  let realComponent;

  if (isComponentArray(component)) {
    realComponent = component[0];
    props = component[1];
  } else {
    realComponent = component;
  }

  if (realComponent._isInitialized) {
    return realComponent;
  }

  const componentAfterInit = new realComponent(props);

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
    if (!this._isMounted) {
      return;
    }

    if (typeof this.state === 'Object' && typeof newState === 'Object') {
      this.state = { ...this.state, ...newState };
    } else {
      this.state = newState;
    }

    reRenderVDomNode(this._vDomNode);
  }

  static props(newProps) {
    return [this, newProps];
  }
}
