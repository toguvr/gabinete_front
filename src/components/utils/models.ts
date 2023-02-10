import { KanbanColumns } from './enums';

export interface TaskModel {
  id: number;
  title: string;
  description: string;
  column: KanbanColumns;
  color: string;
  priority: number;
  owner: string;
  responsible: string;
}
