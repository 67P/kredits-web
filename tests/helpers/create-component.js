import { getContext } from '@ember/test-helpers';

export default function createComponent(lookupPath, named = {}) {
  let { owner } = getContext();
  let componentManager = owner.lookup('component-manager:glimmer');
  let { class: componentClass } = owner.factoryFor(lookupPath);
  return componentManager.createComponent(componentClass, { named });
}
