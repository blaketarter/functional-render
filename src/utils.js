import {
  Component
} from './component';

export function isComponent(maybeComponent) {
  return typeof maybeComponent === 'function' || maybeComponent instanceof Component;
}
