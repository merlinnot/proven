import { isEmpty } from '../properties/isEmpty';
import { isSmallerInDimension } from '../properties/isSmallerInDimension';
import type { DimensionalAccessor, KdTree, Node } from '../structure/types';

const squareDistance = <Value extends Comparable, Comparable>(
  { value, meta: { accessors } }: Node<Value, Comparable>,
  comparable: Comparable,
): number =>
  accessors.reduce(
    (accumulator: number, accessor: DimensionalAccessor<Comparable>): number =>
      accumulator + (accessor(value) - accessor(comparable)) ** 2,
    0,
  );

const squareSubspaceDistance = <Value extends Comparable, Comparable>(
  { meta: { accessors, subspace } }: Node<Value, Comparable>,
  comparable: Comparable,
): number =>
  accessors.reduce(
    (
      accumulator: number,
      accessor: DimensionalAccessor<Comparable>,
      dimension: number,
    ): number => {
      const { min, max } = subspace[dimension];
      const comparableValue = accessor(comparable);

      return (
        accumulator +
        (min <= comparableValue && comparableValue <= max
          ? 0
          : Math.min(
              (min - comparableValue) ** 2,
              (max - comparableValue) ** 2,
            ))
      );
    },

    0,
  );

interface FindNearestMetadata<Value, Comparable> {
  best: Node<Value, Comparable>;
  bestDistance: number;
}

const nearest = <Value extends Comparable, Comparable>(
  tree: KdTree<Value, Comparable>,
  point: Comparable,
  metadata: FindNearestMetadata<Value, Comparable>,
): FindNearestMetadata<Value, Comparable> => {
  if (
    isEmpty(tree) ||
    squareSubspaceDistance(tree, point) >= metadata.bestDistance
  ) {
    return metadata;
  }

  const distanceFromNode = squareDistance(tree, point);

  const currentMetadata: FindNearestMetadata<Value, Comparable> =
    distanceFromNode < metadata.bestDistance
      ? { best: tree, bestDistance: distanceFromNode }
      : metadata;

  const [promising, unpromising] = isSmallerInDimension(tree, point)
    ? [tree.left, tree.right]
    : [tree.right, tree.left];

  const nearestPromising = nearest(promising, point, currentMetadata);
  const nearestUnpromising = nearest(unpromising, point, nearestPromising);

  return nearestUnpromising;
};

export const findNearest = <Value extends Comparable, Comparable>(
  tree: KdTree<Value, Comparable>,
  point: Comparable,
): Value | undefined => {
  if (isEmpty(tree)) {
    return undefined;
  }

  return nearest(tree, point, { best: tree, bestDistance: Infinity }).best
    .value;
};
