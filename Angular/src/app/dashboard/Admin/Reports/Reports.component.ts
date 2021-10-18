import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
@Component({
  selector: 'app-Reports',
  templateUrl: './Reports.component.html',
  styleUrls: ['./Reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor( private location: Location) { }

  ngOnInit() {
  }

  goBack(): void {
    this.location.back();
  }
}
