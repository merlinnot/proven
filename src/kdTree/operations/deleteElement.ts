import { isEmpty } from '../properties/isEmpty';
import { isEqual } from '../properties/isEqual';
import { isGreaterInDimension } from '../properties/isGreaterInDimension';
import { isNode } from '../properties/isNode';
import { isSmallerInDimension } from '../properties/isSmallerInDimension';
import { empty } from '../structure/empty';
import type { KdTree, Node } from '../structure/types';

const smaller = <Value extends Comparable, Comparable>(
  first: Node<Value, Comparable>,
  second: Node<Value, Comparable>,
  dimension: number,
): Node<Value, Comparable> => {
  const accessor = first.meta.accessors[dimension];

  return accessor(first.value) < accessor(second.value) ? first : second;
};

const findMinimum = <Value extends Comparable, Comparable>(
  tree: Node<Value, Comparable>,
  dimension: number,
): Node<Value, Comparable> => {
  if (tree.meta.dimension === dimension) {
    return isEmpty(tree.left) ? tree : findMinimum(tree.left, dimension);
  }

  return isEmpty(tree.left)
    ? isEmpty(tree.right)
      ? tree
      : smaller(tree, findMinimum(tree.right, dimension), dimension)
    : isEmpty(tree.right)
    ? smaller(tree, findMinimum(tree.left, dimension), dimension)
    : smaller(
        smaller(tree, findMinimum(tree.left, dimension), dimension),
        findMinimum(tree.right, dimension),
        dimension,
      );
};

const deleteSelf = <Value extends Comparable, Comparable>(
  tree: Node<Value, Comparable>,
  point: Comparable,
  filter: (value: Value) => boolean = (): boolean => true,
): KdTree<Value, Comparable> => {
  if (isNode(tree.right)) {
    const replacement = findMinimum(tree.right, tree.meta.dimension);
    const right = deleteElement(
      deleteElement<Value, Comparable>(tree.right, replacement.value),
      point,
      filter,
    );

    return {
      left: tree.left,
      meta: {
        ...tree.meta,
        size: tree.left.meta.size + right.meta.size + 1,
      },
      right: right,
      value: replacement.value,
    };
  } else if (isNode(tree.left)) {
    const replacement = findMinimum(tree.left, tree.meta.dimension);
    const left = deleteElement<Value, Comparable>(tree.left, replacement.value);

    return {
      left,
      meta: {
        ...tree.meta,
        size: left.meta.size + tree.right.meta.size + 1,
      },
      right: tree.right,
      value: replacement.value,
    };
  } else {
    return empty(tree.meta.accessors);
  }
};

const maybeDeleteInLeftSubtree = <Value extends Comparable, Comparable>(
  tree: Node<Value, Comparable>,
  point: Comparable,
  filter: (value: Value) => boolean = (): boolean => true,
): KdTree<Value, Comparable> => {
  const maybeNewLeft = deleteElement(tree.left, point, filter);

  return Object.is(tree.left, maybeNewLeft)
    ? tree
    : {
        left: maybeNewLeft,
        meta: {
          ...tree.meta,
          size: maybeNewLeft.meta.size + tree.right.meta.size + 1,
        },
        right: tree.right,
        value: tree.value,
      };
};

const maybeDeleteInRightSubtree = <Value extends Comparable, Comparable>(
  tree: Node<Value, Comparable>,
  point: Comparable,
  filter: (value: Value) => boolean = (): boolean => true,
): KdTree<Value, Comparable> => {
  const maybeNewRight = deleteElement(tree.right, point, filter);

  return Object.is(tree.right, maybeNewRight)
    ? tree
    : {
        left: tree.left,
        meta: {
          ...tree.meta,
          size: tree.left.meta.size + maybeNewRight.meta.size + 1,
        },
        right: maybeNewRight,
        value: tree.value,
      };
};

const maybeDeleteInRoot = <Value extends Comparable, Comparable>(
  tree: Node<Value, Comparable>,
  point: Comparable,
  filter: (value: Value) => boolean = (): boolean => true,
): KdTree<Value, Comparable> =>
  filter(tree.value)
    ? deleteSelf(tree, point, filter)
    : maybeDeleteInRightSubtree(tree, point, filter);

export const deleteElement = <Value extends Comparable, Comparable>(
  tree: KdTree<Value, Comparable>,
  point: Comparable,
  filter: (value: Value) => boolean = (): boolean => true,
): KdTree<Value, Comparable> =>
  isEmpty(tree)
    ? tree
    : isSmallerInDimension(tree, point)
    ? maybeDeleteInLeftSubtree(tree, point, filter)
    : isGreaterInDimension(tree, point)
    ? maybeDeleteInRightSubtree(tree, point, filter)
    : isEqual(tree, point)
    ? maybeDeleteInRoot(tree, point, filter)
    : tree;
