import * as fc from 'fast-check';

import * as kdTree from '.';
import type { KdTree } from './structure/types';

type Value = number[];
type Data = Value[];
type Accessor = (array: Value) => number;
type Accessors = readonly Accessor[];

const MIN_DIMENSION = 1;
const MAX_DIMENSION = 32;

const makeArbitraryValue = (dimensions: number): fc.Arbitrary<Value> =>
  fc.array(fc.integer(), dimensions, dimensions);
const makeArbitraryData = (dimensions: number): fc.Arbitrary<Data> =>
  fc.array(makeArbitraryValue(dimensions));
const makeArbitraryAccessors = (dimensions: number): fc.Arbitrary<Accessors> =>
  fc.constant(
    Array.from(
      { length: dimensions },
      (_: unknown, index: number): Accessor => (array: Value): number =>
        array[index],
    ),
  );

interface Space {
  accessors: Accessors;
  data: Data;
}

const arbitrarySpace = fc.integer(MIN_DIMENSION, MAX_DIMENSION).chain(
  (dimensions: number): fc.Arbitrary<Space> =>
    fc.record({
      accessors: makeArbitraryAccessors(dimensions),
      data: makeArbitraryData(dimensions),
    }),
);

interface SpaceWithValues extends Space {
  values: Value[];
}

const makeArbitrarySpaceWithValues = (
  numberOfValues: number,
): fc.Arbitrary<SpaceWithValues> =>
  fc.integer(MIN_DIMENSION, MAX_DIMENSION).chain(
    (dimensions: number): fc.Arbitrary<SpaceWithValues> =>
      fc.record({
        accessors: makeArbitraryAccessors(dimensions),
        data: makeArbitraryData(dimensions),
        values: fc.array(
          makeArbitraryValue(dimensions),
          numberOfValues,
          numberOfValues,
        ),
      }),
  );

const isValid = (tree: KdTree<number[], number[]>): boolean =>
  kdTree.isEmpty(tree) ||
  (isValid(tree.left) &&
    isValid(tree.right) &&
    kdTree
      .values(tree.left)
      .every(
        (value: number[]): boolean =>
          value[tree.meta.dimension] < tree.value[tree.meta.dimension],
      ) &&
    kdTree
      .values(tree.right)
      .every(
        (value: number[]): boolean =>
          value[tree.meta.dimension] >= tree.value[tree.meta.dimension],
      ));

describe('delete', (): void => {
  it('the tree is the same after deleting an inserted element', (): void => {
    expect.hasAssertions();

    fc.assert(
      fc.property(
        makeArbitrarySpaceWithValues(1),
        ({ accessors, data, values: [value] }: SpaceWithValues): void => {
          const tree = kdTree.fromArraySequential(accessors, data);
          const treeWithValue = kdTree.insert(tree, value);
          const treeWithoutValue = kdTree.delete(treeWithValue, value);

          console.log(
            tree.meta.size,
            treeWithValue.meta.size,
            treeWithoutValue.meta.size,
          );

          expect(kdTree.values(tree).sort()).toStrictEqual(
            kdTree.values(treeWithoutValue).sort(),
          );
        },
      ),
    );
  });
});

describe('fromArrayNaive', (): void => {
  it('creates a valid tree', (): void => {
    expect.hasAssertions();

    fc.assert(
      fc.property(arbitrarySpace, ({ accessors, data }: Space): void => {
        const tree = kdTree.fromArraySequential(accessors, data);

        expect(isValid(tree)).toStrictEqual(true);
      }),
    );
  });

  it('creates a tree of size equal to input data size', (): void => {
    expect.hasAssertions();

    fc.assert(
      fc.property(arbitrarySpace, ({ accessors, data }: Space): void => {
        const tree = kdTree.fromArraySequential(accessors, data);

        expect(kdTree.size(tree)).toStrictEqual(data.length);
      }),
    );
  });

  it('creates a tree where all input values can be found', (): void => {
    expect.hasAssertions();

    fc.assert(
      fc.property(arbitrarySpace, ({ accessors, data }: Space): void => {
        const tree = kdTree.fromArraySequential(accessors, data);

        for (const value of data) {
          expect(kdTree.findNearest(tree, value)).toStrictEqual(value);
        }
      }),
    );
  });
});

describe('insert', (): void => {
  it('creates a valid tree', (): void => {
    expect.hasAssertions();

    fc.assert(
      fc.property(
        makeArbitrarySpaceWithValues(1),
        ({ accessors, data, values: [value] }: SpaceWithValues): void => {
          const tree = kdTree.fromArraySequential(accessors, data);
          const treeWithValue = kdTree.insert(tree, value);

          expect(isValid(treeWithValue)).toStrictEqual(true);
        },
      ),
    );
  });

  it('creates a tree where both the new and all previous values can be found', (): void => {
    expect.hasAssertions();

    fc.assert(
      fc.property(
        makeArbitrarySpaceWithValues(1),
        ({ accessors, data, values: [insertValue] }: SpaceWithValues): void => {
          const tree = kdTree.fromArraySequential(accessors, data);
          const treeWithValue = kdTree.insert(tree, insertValue);

          expect(kdTree.findNearest(treeWithValue, insertValue)).toStrictEqual(
            insertValue,
          );

          for (const value of data) {
            expect(kdTree.findNearest(tree, value)).toStrictEqual(value);
          }
        },
      ),
    );
  });

  it('creates equivalent trees regardless of the insertion order', (): void => {
    expect.hasAssertions();

    fc.assert(
      fc.property(
        makeArbitrarySpaceWithValues(2),
        ({
          accessors,
          data,
          values: [first, second],
        }: SpaceWithValues): void => {
          const tree = kdTree.fromArraySequential(accessors, data);

          expect(
            kdTree
              .values(kdTree.insert(kdTree.insert(tree, first), second))
              .sort(),
          ).toStrictEqual(
            kdTree
              .values(kdTree.insert(kdTree.insert(tree, second), first))
              .sort(),
          );
        },
      ),
    );
  });
});

describe('kdTree.isEmpty', (): void => {
  it('returns true for a tree of size 0', (): void => {
    expect.assertions(1);

    expect(kdTree.isEmpty(kdTree.fromArraySequential([], []))).toStrictEqual(
      true,
    );
  });
});
