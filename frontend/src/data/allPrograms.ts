import type { ChapterId, ProgramItem } from '../types/dsa';
import { DSA_PROGRAMS } from './dsaPrograms';
import { ALGO_PROGRAMS } from './algoPrograms';
import { LINKED_LIST_PROGRAMS } from './linkedListPrograms';
import { QUEUE_PROGRAMS } from './queuePrograms';
import { TREE_PROGRAMS } from './treePrograms';
import { GRAPH_PROGRAMS } from './graphPrograms';

export const ALL_PROGRAMS: Record<string, ProgramItem> = {
  ...DSA_PROGRAMS,
  ...ALGO_PROGRAMS,
  ...LINKED_LIST_PROGRAMS,
  ...QUEUE_PROGRAMS,
  ...TREE_PROGRAMS,
  ...GRAPH_PROGRAMS,
};

export function getProgram(chapterId: ChapterId, programId: string): ProgramItem | null {
  const key = `${chapterId}-${programId}`;
  if (ALL_PROGRAMS[key]) return ALL_PROGRAMS[key];

  // Fallback search by programId
  const match = Object.values(ALL_PROGRAMS).find(
    (p) => p.chapterId === chapterId && (p.id === programId || p.id.toLowerCase() === programId.toLowerCase())
  );
  if (match) return match;

  // Fallback first program of chapter
  const chapterFirst = Object.values(ALL_PROGRAMS).find((p) => p.chapterId === chapterId);
  return chapterFirst || null;
}
