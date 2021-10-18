import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-application-request-management',
  templateUrl: './application-request-management.component.html',
  styleUrls: ['./application-request-management.component.scss']
})
export class ApplicationRequestManagementComponent implements OnInit {
  content:string = "content1";
  constructor( private location: Location) { 
  
    }

  ngOnInit() {
  }

  Change(num:number){
    this.content = "content"+num.toString();
  }

  goBack(): void {
    this.location.back();
  }
}
