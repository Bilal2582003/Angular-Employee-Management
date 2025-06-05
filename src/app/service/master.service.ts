import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../enviornment/enviornment';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }
  env = environment;

  getToken(){
    const token = JSON.parse(localStorage.getItem("token") || 'null');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  getDepartment() {
    const headers = this.getToken();

    return this.http.get(this.env.apiUrl + "/getDepart", { headers });
  }

  saveEmployee(data: { name: string, email: string, password?: string, department?: string, role?: string }) {
    const headers = this.getToken();

    return this.http.post(this.env.apiUrl + '/register', data, { headers });
  }

  getEmployeeList(){
    const headers = this.getToken();
    return this.http.get(this.env.apiUrl+"/getEmployee", {headers});
  }


}
