import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {

  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ){
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  onSubmit(){
    
    if(this.taskForm.valid){
      const newTask = {
        ...this.taskForm.value,
        // title: this.taskForm.value.title,
        // description: this.taskForm.value.description,
        completed: false
      };

      this.taskService.createTask(newTask).subscribe(() => {
        this.taskForm.reset();
        this.taskService.notifyTaskCreated();
      });
    }
  }
}
