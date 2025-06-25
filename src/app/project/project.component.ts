import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MasterService } from '../service/master.service';
import { Router } from 'express';

@Component({
  selector: 'app-project',
  imports: [NgIf, ReactiveFormsModule, NgFor, CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  vars: any = {
    general: '', // for general errors
    employeeData: [], // for show department list in html
    submit: 'Submit',// text change Loading or Submit according to Actions
    update: 'Update',
    success: '', // for success sms
    tableList: [],
    projectName: '',
    projectClient: '',
    projectStartDate: '',
    projectContactPerson: '',
    projectContactNo: '',
    projectList: [],
    projectId: 0
  };

  masterService = inject(MasterService);
  isAddModalSingal = signal<boolean>(false);
  openModal() {
    this.isAddModalSingal.set(true);
  }
  closeModal() {
    this.isAddModalSingal.set(false);
  }

  projectForm: FormGroup = new FormGroup({});
  constructor() {
    this.initializeForm();
    this.employeeList();
  }
  ngOnInit(): void {
    this.getProjectData()
  }


  initializeForm() {
    this.projectForm = new FormGroup({
      projectId: new FormControl(0),
      projectName: new FormControl(""),
      projectClient: new FormControl(""),
      projectStartDate: new FormControl(""),
      projectEmployeeLead: new FormControl(""),
      projectContactPerson: new FormControl(""),
      projectContactNo: new FormControl(""),
    })
  }

  // Fetch employee table
  employeeList(id?: any) {
    this.masterService.getEmployeeList(id).subscribe((res: any) => {
      this.vars.employeeData = res.success === 200 ? res.data : [];
      console.log(this.vars.employeeData)
    })
  }

  saveProject() {
    this.vars.submit = "Loading"
    const formValue = this.projectForm.value;
    console.log(formValue)

    // ======== Run condition base Service for INSERT & UPDATE ======== 
    var functionName = this.vars.projectId == 0 ? this.masterService.createProject(formValue) : this.masterService.updateProject(formValue)
    functionName.subscribe({
      next: (res: any) => {
        console.log(res)
        this.vars.projectId = 0
        this.vars.projectName = ""
        this.vars.projectClient = ""
        this.vars.projectStartDate = ""
        this.vars.projectEmployeeLead = ""
        this.vars.projectContactPerson = ""
        this.vars.projectContactNo = ""
        this.vars.submit = "Submit"
        this.showTemporaryMessageSuccess(res.message)
        this.getProjectData();
        this.projectForm.reset(); // Clear form
      },
      error: (err) => {
        console.log(err)
        if (err.status == 400) {
          if (!Array.isArray(err.error.message) && typeof err.error.message != "object")// checking not to object and array
          {
            this.showTemporaryMessageGeneralError(err.error.message)
          }
          else {
            let error = err.error.message;
            this.vars.projectName = error.projectName ? error.projectName[0] : "";
            this.vars.projectClient = error.projectClient ? error.projectClient[0] : "";
            this.vars.projectStartDate = error.projectStartDate ? error.projectStartDate[0] : "";
            this.vars.projectEmployeeLead = error.projectEmployeeLead ? error.projectEmployeeLead[0] : "";
            this.vars.projectContactPerson = error.projectContactPerson ? error.projectContactPerson[0] : "";
            this.vars.projectContactNo = error.projectContactNo ? error.projectContactNo[0] : "";
          }
        } else if (err.status == 500) {
          console.log("this" + JSON.stringify(err))
          this.showTemporaryMessageGeneralError(err.error.message)
        }
        this.vars.submit = "Submit"
      }


    })
  }

  getProjectData() {
    this.masterService.getProject().subscribe((res: any) => {
      console.log(res);
      if (res.success == 200) {
        this.vars.projectList = res.data;
      } else {
        this.showTemporaryMessageGeneralError(res.message);
      }
    })
  }

  onEdit(id: any) {
    this.openModal();
    const match = this.vars.projectList.find((item: any) => item.id === id);
    console.log(match);
    this.vars.submit = "Update";
    this.vars.projectId = id;
    this.projectForm = new FormGroup({
      projectId: new FormControl(id),
      projectName: new FormControl(match.name),
      projectClient: new FormControl(match.client),
      projectStartDate: new FormControl(match.startDate),
      projectEmployeeLead: new FormControl(match.employeeLeadId),
      projectContactPerson: new FormControl(match.contactPerson),
      projectContactNo: new FormControl(match.contactNo),
    })
  }
  onDelete(id: any) {
    var api = this.masterService.deleteproject(id).subscribe({
      next: (res: any) => {
        alert(res.message)
        this.getProjectData();
      },
      error: (e) => {
        alert(e.error.message)
      }
    })

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
