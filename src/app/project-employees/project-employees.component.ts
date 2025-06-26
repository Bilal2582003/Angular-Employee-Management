import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MasterService } from '../service/master.service';
import { Project } from '../service/Project.model';
import { User } from '../service/Employee.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-employees',
  imports: [CommonModule, NgIf, NgFor, ReactiveFormsModule ],
  templateUrl: './project-employees.component.html',
  styleUrl: './project-employees.component.css'
})
export class ProjectEmployeesComponent implements OnInit {
  isAddModalSingal = signal<boolean>(false);
  openModal() {
    this.isAddModalSingal.set(true);
  }
  closeModal() {
    this.isAddModalSingal.set(false);
  }

  vars = {
    general: "",
    success: "",
    projectIdError: "",
    employeeIdError: "",
    assignDateError: "",
    roleError: "",
    submit: 'Submit',
    update: 'Update',
    allProjectEmployeeProjectList: []
  }

  masterServie = inject(MasterService);
  allProjectList: Project[] = [];
  allEmployeeList: User[] = [];

  ngOnInit(): void {
    this.ProjectEmployeeList();
    // Project Select box 
    this.masterServie.getProject().subscribe({
      next: (res: any) => {
        this.allProjectList = res.data
        console.log(this.allProjectList)
      },
      error: (err) => {
        console.log(err)
        this.showTemporaryMessageGeneralError(err.error.message)
      }
    })
    // Employee Select box 
    this.masterServie.getEmployeeList().subscribe({
      next: (res: any) => {
        this.allEmployeeList = res.data
        console.log(this.allEmployeeList)
      },
      error: (err) => {
        console.log(err)
        this.showTemporaryMessageGeneralError(err.error.message)
      }
    })

  }
  
  // Add this method inside your component to get the role for an employee
  getRoleForEmployee(employee: User): string {
    if (employee.departs && employee.departs.length > 0) {
      // Assuming employee has at least one department assigned
      return employee.departs[0].pivot.role;  // This will get the role of the first department assigned to the employee
    }
    return 'No Role';  // Default if no role is found
  }
  
  projectEmployeeForm: FormGroup = new FormGroup({});
  constructor() {
     this.initializeForm();
  }

  initializeForm() {
    this.projectEmployeeForm = new FormGroup({
      id: new FormControl(0),
      employeeId: new FormControl(""),
      projectId: new FormControl(""),
      assignDate: new FormControl(""),
      role: new FormControl("")
    })
  }

  onSubmit(){
    this.vars.submit = "Loading"
    const formValue = this.projectEmployeeForm.value;
    console.log(formValue)

    this.masterServie.saveProjectEmployee(formValue).subscribe({
      next: (res: any) => {
        console.log(res)
        this.vars.general = '';
        this.vars.projectIdError = "";
        this.vars.employeeIdError = "";
        this.vars.assignDateError = "";
        this.vars.roleError = "";
        this.vars.submit = "Submit"

        this.showTemporaryMessageSuccess("Project Assigned Successfully.");
      },
      error: (err:any) => {
        // console.log(err)
        this.vars.submit = "Submit"
        if (err.status == 400) {
          if (!Array.isArray(err.error.message) && typeof err.error.message != "object")// checking not to object and array
          {
            this.showTemporaryMessageGeneralError(err.error.message)
          }
          else {
            let error = err.error.message;
            // console.log("this"+error)
            this.vars.projectIdError = error.projectId ? error.projectId[0].replace("id", "") : "";
            this.vars.employeeIdError = error.employeeId ? error.employeeId[0].replace("id", "") : "";
            this.vars.assignDateError = error.assignDate ? error.assignDate[0]: "";
            this.vars.roleError = error.role ? error.role[0] : "";
          }
        } else if (err.status == 500) {
          console.log("this" + JSON.stringify(err))
          this.showTemporaryMessageGeneralError(err.error.message)
        }
        else{
          this.showTemporaryMessageGeneralError(( err.error.message || 'Something went wrong'));
        }
      }
    });
  }

  ProjectEmployeeList(){
   this.masterServie.getProjectEmployeeList().subscribe((res:any)=>{
    console.log(res)
    if(res.status == 200){
     this.vars.allProjectEmployeeProjectList = res.data
     console.log(this.vars.allProjectEmployeeProjectList)
    }else{

    }
   })
  }

  onDelete(id:any){

  }
  onEdit(id:any){

  }

  // show success sms here 
  showTemporaryMessageSuccess(success: any) {
    this.vars.success = success;

    setTimeout(() => {
      this.vars.success = "";
    }, 6000);
  }
  // show error sms here
  showTemporaryMessageGeneralError(error: any) {
    this.vars.general = error
    setTimeout(() => {
      this.vars.general = "";
    }, 6000);
  }

}
