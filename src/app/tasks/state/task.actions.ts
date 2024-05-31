import { Task } from '../models/task.model';

export class AddTask {
  static readonly type = '[Task] Add';
  constructor(public payload: Task) {}
}

export class UpdateTask {
  static readonly type = '[Task] Update';
  constructor(public payload: Task) {}
}

export class DeleteTask {
  static readonly type = '[Task] Delete';
  constructor(public payload: string) {}
}

export class ToggleCompleteTask {
  static readonly type = '[Task] Toggle Complete';
  constructor(public payload: string) {}
}
