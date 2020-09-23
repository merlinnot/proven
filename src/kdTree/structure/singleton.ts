import type { Empty, Node } from './types';

export const singleton = <Value extends Comparable, Comparable>(
  tree: Empty<Comparable>,
  value: Value,
): Node<Value, Comparable> => {
  const { accessors, dimension, subspace } = tree.meta;
  const splitPoint = accessors[dimension](value);
  const childDimension = (dimension + 1) % accessors.length;

  const [subspacePrefix, dimensionSlice, subspaceSuffix] = [
    subspace.slice(0, dimension),
    subspace[dimension],
    subspace.slice(dimension + 1, subspace.length),
  ];
  const leftSubspace = [
    ...subspacePrefix,
    { ...dimensionSlice, max: splitPoint },
    ...subspaceSuffix,
  ];
  const rightSubspace = [
    ...subspacePrefix,
    { ...dimensionSlice, min: splitPoint },
    ...subspaceSuffix,
  ];

  return {
    left: {
      meta: {
        accessors,
        dimension: childDimension,
        size: 0,
        subspace: leftSubspace,
      },
    },
    meta: { ...tree.meta, size: 1 },
    right: {
      meta: {
        accessors,
        dimension: childDimension,
        size: 0,
        subspace: rightSubspace,
      },
    },
    value,
  };
};
