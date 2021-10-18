import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss']
})
export class AssignComponent implements OnInit {
  content:string = "content1";
  constructor( private location: Location) { }

  ngOnInit() {
  }

  Change(num:number){
    this.content = "content"+num.toString();
    return this.content;
  }

  goBack(): void {
    this.location.back();
  }
}


