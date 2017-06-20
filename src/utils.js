import {
  Component
} from './component';

export function isComponent(maybeComponent) {
  return typeof maybeComponent === 'function' || maybeComponent instanceof Component || isComponentArray(maybeComponent);
}

export function isComponentArray(maybeComponentArray) {
  return maybeComponentArray instanceof Array && (typeof maybeComponentArray[0] === 'function' || maybeComponentArray[0] instanceof Component);
}
