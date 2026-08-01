import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private router: Router
    ){}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
       console.log(this.tasks);
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

  editTask(task: Task){
    this.router.navigate(['/tasks/edit', task.id]);
  }
}
