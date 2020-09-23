import { isEmpty } from '../properties/isEmpty';
import type { KdTree } from '../structure/types';

export const values = <Value extends Comparable, Comparable>(
  tree: KdTree<Value, Comparable>,
): Value[] =>
  isEmpty(tree)
    ? []
    : [...values(tree.left), tree.value, ...values(tree.right)];
