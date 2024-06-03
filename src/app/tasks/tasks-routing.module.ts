import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';

const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'add', loadChildren: () => import('./task-add/task-add.module').then(m => m.TaskAddModule) },
  { path: 'edit/:id', loadChildren: () => import('./task-edit/task-edit.module').then(m => m.TaskEditModule) },
  { path: '**',redirectTo:'/tasks'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
