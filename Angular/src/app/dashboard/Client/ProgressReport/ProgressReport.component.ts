import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { Location } from '@angular/common'
@Component({
  selector: 'app-ProgressReport',
  templateUrl: './ProgressReport.component.html',
  styleUrls: ['./ProgressReport.component.scss']
})
export class ProgressReportComponent implements OnInit {

  ReportData:any ={ Description: "No description given yet", Feedback: "No Feedback given"}
  constructor(private clientservice:ClientService,private location: Location) { }

  ngOnInit() {
    this.clientservice.ProgressReport().subscribe(res=>{

      this.ReportData = res;

    })
  }
  goBack(): void {
    this.location.back();
  }


}
