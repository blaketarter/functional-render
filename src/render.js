import {
  cacheVDomChild
} from './vDom';

export function createHtml(vDomNode) {
  if (vDomNode.isComponent) {
    return createHtmlFromComponent(vDomNode);
  }

  return createHtmlFromNonComponent(vDomNode);
}

function createHtmlFromComponent(vDomNode) {
  let html = '';

  html += vDomNode.html[0];

  for (let i = 0, ii = vDomNode.children.length; i < ii; i++) {
    const childHtml = createHtml(vDomNode.children[i]);
    html += childHtml;
    
    cacheVDomChild(vDomNode, i, childHtml);

    if (vDomNode.html.length > i) {
      html += vDomNode.html[i + 1];
    }
  }

  if (vDomNode.html.length > 1) {
    html += vDomNode.html[vDomNode.html.length - 1];
  }

  return html;
}

function createHtmlFromNonComponent(vDomNode) {
  return vDomNode.component;
}


