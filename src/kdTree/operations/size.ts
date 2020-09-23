import type { KdTree } from '../structure/types';

export const size = <Value extends Comparable, Comparable>(
  tree: KdTree<Value, Comparable>,
): number => tree.meta.size;
