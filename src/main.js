import {
  generateVDom
} from './vDom';

import {
  createHtml
} from './render';

import {
  Component
} from './component';

function mount(rootComponent, rootNodeSelector) {
  const rootNode = document.querySelector(rootNodeSelector);
  const vDom = generateVDom(rootComponent, rootNode);

  rootNode.innerHTML = createHtml(vDom);
  console.log(vDom);
}

function html(strings, ...children) {
  return { strings, children };
}

export {
  mount,
  html,
  Component,
};
