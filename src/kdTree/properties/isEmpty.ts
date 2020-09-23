import type { Empty, KdTree } from '../structure/types';

export const isEmpty = <Value extends Comparable, Comparable>(
  tree: KdTree<Value, Comparable>,
): tree is Empty<Comparable> => tree.meta.size === 0;
