import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../enviornment/enviornment';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login: any = {
    email: "",
    password: "",
    password_message: "",
    user_message: "",
    general: ""
  };

  http = inject(HttpClient);
  router = inject(Router);
  env = environment;
  res:any = {};
  onLogin() {
    this.res = {};
    this.http.post(`${this.env.apiUrl}/login`, this.login).subscribe({
      next: response => {
        this.res = response
        console.log("this" + this.res)

          this.login = { email : "", password: "", password_message: "", user_message: "" };

          localStorage.setItem("token", JSON.stringify(this.res.token));
          localStorage.setItem("employeeApp", JSON.stringify(this.res.data));
          this.router.navigateByUrl("dashboard");
       
      },
      error: err => {
        console.error('Error:', err);
        if (err.status === 400) {
          console.log(err.error.message)
          if (!Array.isArray(err.error.message) && typeof err.error.message != "object" ) {// checking not to object and array
            // alert(err.error.message);
            this.login.password_message = ' ';
            this.login.email_message = ' ';
            this.login.general = err.error.message
          } else {
            let error = err.error.message;
            this.login.password_message = error.password ? error.password[0] : "";
            this.login.email_message = error.email ? error.email[0] : "";
          }
          console.log(this.login.password_message)
        }
      }
    });
  }
}
