import { Component, OnInit } from '@angular/core';
import { Package } from 'src/app/models/Package';
import { ClientService } from '../services/client.service';
import { Location } from '@angular/common'
@Component({
  selector: 'app-MyPackages',
  templateUrl: './MyPackages.component.html',
  styleUrls: ['./MyPackages.component.scss']
})
export class MyPackagesComponent implements OnInit {
  Packages : any
  constructor(private clientServe:ClientService,  private location: Location) { }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.clientServe.getMyPackages().subscribe(res=>{
      console.log(res);
      this.Packages = res;
    })
  }
  goBack(): void {
    this.location.back();
  }
}
