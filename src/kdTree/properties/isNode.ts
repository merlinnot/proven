import type { KdTree, Node } from '../structure/types';

export const isNode = <Value extends Comparable, Comparable>(
  tree: KdTree<Value, Comparable>,
): tree is Node<Value, Comparable> => tree.meta.size !== 0;
