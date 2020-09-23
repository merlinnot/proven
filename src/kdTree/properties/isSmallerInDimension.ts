import type { Node } from '../structure/types';

export const isSmallerInDimension = <Value extends Comparable, Comparable>(
  node: Node<Value, Comparable>,
  comparable: Comparable,
): boolean => {
  const accessor = node.meta.accessors[node.meta.dimension];

  return accessor(comparable) < accessor(node.value);
};
