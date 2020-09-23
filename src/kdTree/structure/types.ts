type DimensionalValue = number;

type DimensionalAccessor<Comparable> = (
  comparable: Comparable,
) => DimensionalValue;

type DimensionalAccessors<Comparable> = ReadonlyArray<
  DimensionalAccessor<Comparable>
>;

interface Internal<Comparable> {
  readonly accessors: DimensionalAccessors<Comparable>;
  readonly dimension: number;
  readonly subspace: ReadonlyArray<{ max: number; min: number }>;
}

interface EmptyInternal<Comparable> extends Internal<Comparable> {
  readonly size: 0;
}

interface NodeInternal<Comparable> extends Internal<Comparable> {
  readonly size: number;
}

interface Empty<Comparable> {
  readonly meta: EmptyInternal<Comparable>;
}

interface Node<Value, Comparable> {
  readonly left: Node<Value, Comparable> | Empty<Comparable>;
  readonly meta: NodeInternal<Comparable>;
  readonly right: Node<Value, Comparable> | Empty<Comparable>;
  readonly value: Value;
}

type KdTree<Value, Comparable> = Empty<Comparable> | Node<Value, Comparable>;

export { DimensionalAccessor, DimensionalAccessors, Empty, KdTree, Node };
