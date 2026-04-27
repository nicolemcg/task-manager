import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService){}

  ngOnInit(): void {
    this.loadTasks();

    this.taskService.taskCreated$
    .pipe(takeUntil(this.destroy$))
    .subscribe(()=> {
      this.loadTasks();
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    })
  }

  deleteTask(id: number){
    this.taskService.deleteTask(id).subscribe(()=>{
      this.loadTasks();
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
