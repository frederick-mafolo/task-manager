import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Task } from '../models/task.model';
import { Injectable } from '@angular/core';
import { AddTask, UpdateTask, DeleteTask, ToggleCompleteTask } from './task.actions';

export class TaskStateModel {
  tasks: Task[] = [];
}

@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    tasks: []
  }
})
@Injectable()
export class TaskState {

  @Selector()
  static getTasks(state: TaskStateModel) {
    return state.tasks;
  }

  @Action(AddTask)
  addTask({ getState, patchState }: StateContext<TaskStateModel>, { payload }: AddTask) {
    const state = getState();
    patchState({
      tasks: [...state.tasks, payload]
    });
  }

  @Action(UpdateTask)
  updateTask({ getState, setState }: StateContext<TaskStateModel>, { payload }: UpdateTask) {
    const state = getState();
    const tasks = [...state.tasks];
    const taskIndex = tasks.findIndex(task => task.id === payload.id);
    tasks[taskIndex] = payload;
    setState({
      ...state,
      tasks
    });
  }

  @Action(DeleteTask)
  deleteTask({ getState, setState }: StateContext<TaskStateModel>, { payload }: DeleteTask) {
    const state = getState();
    const filteredTasks = state.tasks.filter(task => task.id !== payload);
    setState({
      ...state,
      tasks: filteredTasks
    });
  }

  @Action(ToggleCompleteTask)
  toggleCompleteTask({ getState, setState }: StateContext<TaskStateModel>, { payload }: ToggleCompleteTask) {
    const state = getState();
    const tasks = state.tasks.map(task => {
      if (task.id === payload) {
        task.completed = !task.completed;
      }
      return task;
    });
    setState({
      ...state,
      tasks
    });
  }
}
