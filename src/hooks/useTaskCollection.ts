import { useLocalStorage } from 'usehooks-ts';

import { v4 as uuidv4 } from 'uuid';
import { KanbanColumns } from '../utils/enums';
import { TaskModel } from '../utils/models';

function useTaskCollection() {
  return useLocalStorage<{
    [key in KanbanColumns]: TaskModel[];
  }>('tasks', {
    'A Fazer': [
      {
        id: uuidv4(),
        column: KanbanColumns.TODO,
        title: 'Task 1',
        color: 'blue.300',
        description: 'This is a description',
        priority: 1,
        owner: 'John Doe',
        responsible: 'John Doe',
      },
    ],
    Fazendo: [
      {
        id: uuidv4(),
        column: KanbanColumns.DOING,
        title: 'Task 2',
        color: 'yellow.300',
        description: 'This is a description',
        priority: 1,
        owner: 'John Doe',
        responsible: 'John Doe',
      },
    ],
    Impedimento: [
      {
        id: uuidv4(),
        column: KanbanColumns.BLOCKED,
        title: 'Task 3',
        color: 'red.300',
        description: 'This is a description',
        priority: 1,
        owner: 'John Doe',
        responsible: 'John Doe',
      },
    ],
    Completa: [
      {
        id: uuidv4(),
        column: KanbanColumns.DONE,
        title: 'Task 4',
        color: 'green.300',
        description: 'This is a description',
        priority: 1,
        owner: 'John Doe',
        responsible: 'John Doe',
      },
    ],
  });
}

export default useTaskCollection;
