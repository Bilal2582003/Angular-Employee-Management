import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MasterService } from '../service/master.service';

@Component({
  selector: 'app-project',
  imports: [NgIf, ReactiveFormsModule, NgFor],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent  implements OnInit {
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
    projectContactNo: ''
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
    this.masterService.createProject(formValue).subscribe({
      next: (res: any) => {
        console.log(res)
        this.vars.projectName = ""
        this.vars.projectClient = ""
        this.vars.projectStartDate = ""
        this.vars.projectEmployeeLead = ""
        this.vars.projectContactPerson = ""
        this.vars.projectContactNo = ""
        this.vars.submit = "Submit"
        this.showTemporaryMessageSuccess(res.message)
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

  getProjectData(){
    this.masterService.getProject().subscribe(res=>{
      console.log(res);
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
