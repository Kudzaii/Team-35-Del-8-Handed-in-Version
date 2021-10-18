import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'


@Component({
  selector: 'app-Access',
  templateUrl: './Access.component.html',
  styleUrls: ['./Access.component.scss']
})
export class AccessComponent implements OnInit {

  content:string = "content1";
  constructor( 
    private router:Router,
    private location: Location
    ) { }

  ngOnInit() {


  }

  Change(num:number){
    this.content = "content"+num.toString();
  }

  goBack(): void {
    this.location.back();
  }

}
