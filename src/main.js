import {
  generateVDom
} from './vDom';

import {
  createHtml
} from './render';

function mount(rootComponent, rootNodeSelector) {
  const rootNode = document.querySelector(rootNodeSelector);
  const vDom = generateVDom(rootComponent);

  rootNode.innerHTML = createHtml(vDom.root);
  console.log(vDom);
}

function html(strings, ...children) {
  return { strings, children };
}

export default {
  mount,
  html,
};
