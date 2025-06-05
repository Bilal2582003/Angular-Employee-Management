import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../service/master.service';
import { FormsModule } from '@angular/forms'; // <-- Import this
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-employee',
  imports: [FormsModule, NgIf, NgFor, NgClass],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {

  vars: any = {
    general: '', // for general errors
    departmentData: [], // for show department list in html
    name: '', // for name error in add employee
    email: '',// for email error in add employee
    password: '',// for password error in add employee
    department: '',// for department error in add employee
    role: '',// for role error in add employee
    submit: 'Submit',// text change Loading or Submit according to Actions
    success: '' // for success sms
  };

  //  it is for post. 2 way binding with add new employee form
  employee: any = {
    name: '',
    email: '',
    password: '',
    depart_id: '',
    role: ''
  };



  departService = inject(MasterService); // it is shortest way instead of constructor

  trackById(index: number, item: any): number {
    return item.id;
  }

  ngOnInit() {
    this.departService.getDepartment().subscribe({
      next: (res: any) => {
        this.vars.departmentData = res.data // passing data to array
      },
      error: (err) => {
        if (err.status === 401) {
          this.showTemporaryMessageGeneralError(err.error.message || 'Unauthorized') // cal Error sms funtion
          console.error("Unauthorized:", err.error.message);
        } else {
          console.error("API error:", err);
        }
      }
    });


  }

  // show success sms here 
  showTemporaryMessageSuccess(success:any) {
    this.vars.success = success;

    setTimeout(() => {
      this.vars.success = "";
    }, 6000);
  }
  // show error sms here
  showTemporaryMessageGeneralError(error:any) {
    this.vars.general = error
    setTimeout(() => {
      this.vars.general = "";
    }, 6000);
  }

// Fetch employee table
  


  // for submit new employee from  
  onSubmit() {
    this.vars.submit = "Loading"
    this.departService.saveEmployee(this.employee).subscribe({
      next: (res: any) => {
        console.log(res)
        this.vars.general = '';
        this.vars.name = "";
        this.vars.email = "";
        this.vars.password = "";
        this.vars.department = "";
        this.vars.submit = "Submit"
        this.vars.role = "";

        this.employee.name = "";
        this.employee.email = "";
        this.employee.password = "";
        this.employee.depart_id = "";
        this.employee.role = "";

        this.showTemporaryMessageSuccess("User Successfully added.");

      },
      error: (err) => {
        if (err.status == 400) {
          if (!Array.isArray(err.error.message) && typeof err.error.message != "object")// checking not to object and array
          {
            this.showTemporaryMessageGeneralError(err.error.message)
          }
          else {
            let error = err.error.message;
            this.vars.name = error.name ? error.name[0] : "";
            this.vars.email = error.email ? error.email[0] : "";
            this.vars.password = error.password ? error.password[0] : "";
            this.vars.department = error.depart_id ? error.depart_id[0].replace("id", "") : "";
            this.vars.role = error.role ? error.role[0] : "";
          }
        }else if(err.status == 500){
          console.log("this"+JSON.stringify(err))
          this.showTemporaryMessageGeneralError(err.error.message)
        }
        this.vars.submit = "Submit"
      }
    });
  }



}
