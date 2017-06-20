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

import {
  createHtml
} from './render';

export function generateVDom(rootComponent, rootDomNode) {
  const vDom = createVDomNode(rootComponent);
  vDom.domNode = rootDomNode;

  return vDom;
}

function createVDomNode(maybeComponent, parentNode) {
  if (isComponent(maybeComponent)) {
    return createVDomNodeFromComponent(maybeComponent, parentNode);
  }

  return createVDomNodeFromNonComponent(maybeComponent, parentNode);
}

function createVDomNodeFromComponent(component, parentNode) {
  const node = {
    id: null,
    component: null,
    parentNode: parentNode,
    cache: [],
    html: null,
    children: [],
    isComponent: true,
    domNode: null,
  };
  
  const componentAfterInit = initComponent(component, node);
  const mountResults = mountComponent(componentAfterInit);

  node.id = componentAfterInit._id;
  node.component = componentAfterInit;
  node.html = mountResults.strings;

  node.children = mountResults.children.map(child => createVDomNode(child, node));

  return node;
}

function createVDomNodeFromNonComponent(nonComponent, parentNode) {
  const id = getId();

  const node = {
    id: id,
    component: nonComponent,
    parentNode: parentNode,
    cache: [],
    html: null,
    children: null,
    isComponent: false,
    domNode: null,
  };

  return node;
}

export function cacheVDomChild(vDomNode, childIndex, html) {
  vDomNode.cache[childIndex] = html;
}

export function reRenderVDomNode(vDomNode) {
  let currentNode = vDomNode;
  let domNode = vDomNode.domNode;

  if (currentNode.parentNode) {
    const currentNodeIndex = currentNode.parentNode.children.indexOf(currentNode);
    currentNode.parentNode.children[currentNodeIndex] = createVDomNode(currentNode.component, currentNode.parentNode);
  } else {
    currentNode = createVDomNode(currentNode.component);
    currentNode.domNode = domNode;
  }

  while (currentNode.parentNode) {
    currentNode = currentNode.parentNode;
  }

  currentNode.domNode.innerHTML = createHtml(currentNode);
}
