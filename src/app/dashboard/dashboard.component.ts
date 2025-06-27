import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../service/master.service';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  project: any = {
    total: 0,
    TypeList: "",
    selectedType: "All",
    AllTypeData: [],
    totalForShow: 0
  }
  employee: any = {
    total: 0
  }
  masterSevice = inject(MasterService);

  ngOnInit(): void {
    this.masterSevice.getDashboard().subscribe((res: any) => {
      console.log(res)
      if (res.status == 200) {
        this.project.total = res.projectCount
        this.project.totalForShow = res.projectCount
        if (res.projectCount > 0) {
          this.project.TypeList = res.projectTypeData.map((e: any) => e.projectStatus);
          this.project.AllTypeData = res.projectTypeData;
        } else {
          this.project.TypeList = [];
        }
      }
    })
  }
  changeType(type: string) {
    // Handle the click event
    this.project.selectedType = type;
    if (type != 'All') {
      const selectedStatus = this.project.AllTypeData.find((res: any) => res.projectStatus == type);
      console.log(this.project.AllTypeData)
      if (selectedStatus) {
        this.project.totalForShow = selectedStatus.total;  // Assuming `total` is directly under `res`
      }
    } else {
      this.project.totalForShow =  this.project.total;
    }
  }
}
