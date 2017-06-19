import {
  initComponent,
  mountComponent,
} from './component';

import {
  isComponent,
} from './utils';

import {
  getId,
} from './id';

export function generateVDom(rootComponent) {
  const vDom = {
    root: null,
  };

  vDom.root = createVDomNode(rootComponent);

  return vDom;
}

function createVDomNode(maybeComponent, parentNode) {
  if (isComponent(maybeComponent)) {
    return createVDomNodeFromComponent(maybeComponent, parentNode);
  }

  return createVDomNodeFromNonComponent(maybeComponent, parentNode);
}

function createVDomNodeFromComponent(component, parentNode) {
  const componentAfterInit = initComponent(component);
  const mountResults = mountComponent(componentAfterInit);

  const node = {
    id: componentAfterInit.id,
    component: componentAfterInit,
    parentNode: parentNode,
    cache: null,
    html: mountResults.strings,
    children: [],
    isComponent: true,
  };

  node.children = mountResults.children.map(child => createVDomNode(child, node));

  return node;
}

function createVDomNodeFromNonComponent(nonComponent, parentNode) {
  const id = getId();

  const node = {
    id: id,
    component: nonComponent,
    parentNode: parentNode,
    cache: null,
    html: null,
    children: null,
    isComponent: false,
  };

  return node;
}
