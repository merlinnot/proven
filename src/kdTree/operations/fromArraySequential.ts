import { insertElement } from './insertElement';
import { empty } from '../structure/empty';
import type { DimensionalAccessors, KdTree } from '../structure/types';

export const fromArraySequential = <Value extends Comparable, Comparable>(
  accessors: DimensionalAccessors<Comparable>,
  values: readonly Value[],
): KdTree<Value, Comparable> =>
  values.reduce(
    (
      accumulator: KdTree<Value, Comparable>,
      value: Value,
    ): KdTree<Value, Comparable> => insertElement(accumulator, value),
    empty(accessors),
  );
