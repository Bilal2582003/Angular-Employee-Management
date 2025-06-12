import { Component, inject, OnInit, signal } from '@angular/core';
import { MasterService } from '../service/master.service';
import { FormsModule } from '@angular/forms'; // <-- Import this
import { NgClass, NgFor, NgIf } from '@angular/common';
import { single } from 'rxjs';

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
    update: 'Update',
    success: '', // for success sms
    tableList: []
  };

  //  it is for post. 2 way binding with add new employee form
  employee: any = {
    id: '',
    name: '',
    email: '',
    password: '',
    depart_id: '',
    role: ''
  };

 isAddModalSingal = signal<boolean>(false);
 openModal(){
  this.isAddModalSingal.set(true);
}
closeModal(){
  this.isAddModalSingal.set(false);
 }

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
    this.employeeList()

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

  // Fetch employee table
  employeeList(id?: any) {
    this.departService.getEmployeeList(id).subscribe((res: any) => {
      this.vars.tableList = res.success === 200 ? res.data : [];
    })
  }


  deleteEmployee(id: any) {
    var result = confirm("Are you sure?");
    if (result) {
      this.departService.deleteEmployee(id).subscribe((res: any) => {
        res.status == 200 ? alert(res.message) : alert(res.message)
      })
    }
    this.employeeList();
  }

  editEmployee(obj: any, depart?: any) {
    // console.log(obj)
    this.employee.id = obj.id;
    this.employee.name = obj.name;
    this.employee.email = obj.email;
    this.employee.password = obj.password;
    this.employee.depart_id = depart.id ? depart.id : '';
    this.employee.role = depart.pivot.role ? depart.pivot.role : '';

    // console.log(this.employee)
  }

  onUpate() {
    this.vars.update = "Loading"
    this.departService.editEmployee(this.employee).subscribe({
      next: (res: any) => {
        console.log(res)
        this.vars.general = '';
        this.vars.name = "";
        this.vars.email = "";
        this.vars.password = "";
        this.vars.department = "";
        this.vars.update = "Submit"
        this.vars.role = "";

        this.employee.name = "";
        this.employee.email = "";
        this.employee.password = "";
        this.employee.depart_id = "";
        this.employee.role = "";

        this.showTemporaryMessageSuccess("User Successfully Edit.");
        this.employeeList();
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
            this.vars.name = error.name ? error.name[0] : "";
            this.vars.email = error.email ? error.email[0] : "";
            this.vars.password = error.password ? error.password[0] : "";
            this.vars.department = error.depart_id ? error.depart_id[0].replace("id", "") : "";
            this.vars.role = error.role ? error.role[0] : "";
          }
        } else if (err.status == 500) {
          console.log("this" + JSON.stringify(err))
          this.showTemporaryMessageGeneralError(err.error.message)
        }
        this.vars.update = "Update"
      }
    })
  }

  // for submit new employee from  
  onSubmit() {
    this.vars.submit = "Loading"
    console.log(this.employee)
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
        this.employeeList();
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
        } else if (err.status == 500) {
          console.log("this" + JSON.stringify(err))
          this.showTemporaryMessageGeneralError(err.error.message)
        }
        this.vars.submit = "Submit"
      }
    });
  }



}
