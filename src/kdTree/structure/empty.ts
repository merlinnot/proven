import type { DimensionalAccessors, Empty, KdTree } from './types';

export const empty = <Value extends Comparable, Comparable>(
  accessors: DimensionalAccessors<Comparable>,
): Empty<Comparable> => ({
  meta: {
    accessors,
    dimension: 0,
    size: 0,
    subspace: Array.from({ length: accessors.length }, (): KdTree<
      Value,
      Comparable
    >['meta']['subspace'][number] => ({
      max: Infinity,
      min: -Infinity,
    })),
  },
});
