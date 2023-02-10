import { KanbanColumns } from './enums';

export interface TaskModel {
  id: string;
  title: string;
  description: string;
  column: KanbanColumns;
  color: string;
  priority: number;
  owner: string;
  responsible: string;
}

export interface DragItem {
  index: number;
  id: TaskModel['id'];
  from: KanbanColumns;
}
