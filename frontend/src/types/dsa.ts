export type ChapterId =
  | 'array'
  | 'stack'
  | 'queue'
  | 'circular_queue'
  | 'linked_list'
  | 'doubly_linked_list'
  | 'binary_tree'
  | 'bst'
  | 'heap'
  | 'graph'
  | 'searching'
  | 'sorting'
  | 'hash_table'
  | 'recursion';

export type Language = 'c' | 'cpp' | 'java' | 'python';

export type Speed = 'very-slow' | 'slow' | 'normal' | 'fast' | 'very-fast';

export type ComplexityInfo = {
  timeBest: string;
  timeAverage: string;
  timeWorst: string;
  space: string;
  notes: string;
};

export type ExecutionEvent = {
  step: number;
  type: string;
  operation: string;
  data_structure: ChapterId;
  line: number;
  description: string;
  state: any;
  variables: Record<string, any>;
  call_stack?: string[];
  highlight?: {
    indices?: number[];
    range?: [number, number];
    pointers?: Record<string, number | string | undefined>;
    nodes?: (string | number)[];
    edges?: [string | number, string | number][];
    decisionPath?: string;
    swapping?: [number, number];
    sortedIndex?: number;
    pivotIndex?: number;
    partitionRange?: [number, number];
    compareIndices?: [number, number];
  };
  log?: {
    type: 'INFO' | 'STEP' | 'SUCCESS' | 'WARN' | 'ERROR';
    message: string;
  };
};

export type ProgramItem = {
  id: string;
  name: string;
  description: string;
  chapterId: ChapterId;
  complexity: ComplexityInfo;
  defaultInput?: string;
  code: Record<Language, string>;
  generateTrace: () => ExecutionEvent[];
};
