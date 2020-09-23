import { isEmpty } from '../properties/isEmpty';
import { isSmallerInDimension } from '../properties/isSmallerInDimension';
import { singleton } from '../structure/singleton';
import type { KdTree, Node } from '../structure/types';

export const insertElement = <Value extends Comparable, Comparable>(
  tree: KdTree<Value, Comparable>,
  value: Value,
): Node<Value, Comparable> =>
  isEmpty(tree)
    ? singleton(tree, value)
    : isSmallerInDimension(tree, value)
    ? {
        left: insertElement(tree.left, value),
        meta: { ...tree.meta, size: tree.meta.size + 1 },
        right: tree.right,
        value: tree.value,
      }
    : {
        left: tree.left,
        meta: { ...tree.meta, size: tree.meta.size + 1 },
        right: insertElement(tree.right, value),
        value: tree.value,
      };
