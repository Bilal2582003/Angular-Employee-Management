import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../enviornment/enviornment';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }
  env = environment;

  getToken() {
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

  getEmployeeList(id?: any) {
    var url = this.env.apiUrl + "/employee-list";

    url += id ? "/" + id : '';
    console.log(url)
    const headers = this.getToken();
    return this.http.get(url, { headers });
  }

  deleteEmployee(id: any) {
    const headers = this.getToken();
    return this.http.get(this.env.apiUrl + `/employee-list/delete/${id}`, { headers });
  }

  editEmployee(data: { id?: string, name: string, email: string, password?: string, department?: string, role?: string }) {
    const headers = this.getToken();

    return this.http.post(this.env.apiUrl + '/updateEmployee', data, { headers });
  }

  createProject(data: { id?: number, name: string, client: string, startDate: string, employeeLead: number, contactPerson: string, contactNo: string }) {
    const headers = this.getToken();

    return this.http.post(this.env.apiUrl + '/createProject', data, { headers });
  }
  updateProject(data: { id?: number, name: string, client: string, startDate: string, employeeLead: number, contactPerson: string, contactNo: string }) {
    const headers = this.getToken();

    return this.http.post(this.env.apiUrl + '/updateProject', data, { headers });
  }
  deleteproject(id: any) {
    const headers = this.getToken();
    return this.http.get(this.env.apiUrl + `/deleteProject/${id}`, { headers });
  }
  
  getProject() {
    const headers = this.getToken();
    
    return this.http.get(this.env.apiUrl + '/projectList', { headers });
  }
  saveProjectEmployee(data: {id?:number, employeeId:number, projectId: number, assignDate: Date, role:string}) {
     const headers = this.getToken();
     console.log(data);
     const addUrl = (data.id != 0 && data.id != null) ? '/projectEmployeeList/update' : '/projectEmployeeList'; 
    return this.http.post(this.env.apiUrl + addUrl, data ,{ headers });
  }
  getProjectEmployeeList() {
    const headers = this.getToken();
    return this.http.get(this.env.apiUrl + '/projectEmployeeList' ,{ headers });
  }
  getProjectEmployeeById(id:any) {
     const headers = this.getToken();
     return this.http.get(this.env.apiUrl + '/projectEmployeeList/'+id ,{ headers });
    }
    
    deleteEmployeeProject(id: any) {
      const headers = this.getToken();
      return this.http.get(this.env.apiUrl + `/projectEmployeeList/delete/${id}`, { headers });
    }

    getDashboard(){
      const headers = this.getToken();
      return this.http.get(this.env.apiUrl + `/dashboard`, { headers });
    }
    
}
