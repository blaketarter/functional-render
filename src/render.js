import {
  cacheVDomChild
} from './vDom';

import {
  findHtmlTag
} from './utils';

export function createHtml(vDomNode) {
  if (vDomNode.isComponent) {
    return createHtmlFromComponent(vDomNode);
  }

  return createHtmlFromNonComponent(vDomNode);
}

function getStyles(component) {
  if (!component.getStyles) {
    return '';
  }
  return `<style scoped>${ component.getStyles() }</style>`;
}

function attatchIdAndStyles(html, tagMatch, vDomNode) {
  return [
    html.substring(0, tagMatch[0].length - 1 + tagMatch.index),
    ` s:id="${vDomNode.id}">`,
    getStyles(vDomNode.component),
    html.substring(tagMatch[0].length + tagMatch.index),
  ].join('');
}

function createHtmlFromComponent(vDomNode) {
  let html = '';
  let foundFirstTag = false;

  html += vDomNode.html[0];

  for (let i = 0, ii = vDomNode.children.length; i < ii; i++) {
    if (!foundFirstTag) {
      let tagMatch = findHtmlTag(html);

      if (tagMatch.length) {
        foundFirstTag = true;
        html = attatchIdAndStyles(html, tagMatch, vDomNode);
      }
    }

    const childHtml = createHtml(vDomNode.children[i]);
    html += childHtml;
    
    cacheVDomChild(vDomNode, i, childHtml);

    if (vDomNode.html.length > i) {
      html += vDomNode.html[i + 1];
    }
  }

  // if (!vDomNode.children.length && vDomNode.html.length > 1) {
  //   html += vDomNode.html[vDomNode.html.length - 1];
  // }

  return html;
}

function createHtmlFromNonComponent(vDomNode) {
  return vDomNode.component;
}


