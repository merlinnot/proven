import type { DimensionalAccessor, Node } from '../structure/types';

export const isEqual = <Value extends Comparable, Comparable>(
  { meta: { accessors }, value }: Node<Value, Comparable>,
  comparable: Comparable,
): boolean =>
  accessors.every(
    (accessor: DimensionalAccessor<Comparable>): boolean =>
      accessor(value) === accessor(comparable),
  );
