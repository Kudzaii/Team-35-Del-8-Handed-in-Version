import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-TraineePerformanceReport',
  templateUrl: './TraineePerformanceReport.component.html',
  styleUrls: ['./TraineePerformanceReport.component.scss']
})
export class TraineePerformanceReportComponent implements OnInit {
  Trainees: Array<any>;
  TraineesData: Array<any>;
  Trainee:any;
  view: [number, number] = [1000, 700];
  isClicked: boolean =false;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Mubers of packages';
  dropdown = false;
  form = new FormGroup({
    traineeID: new FormControl('', Validators.required)
  });
  public legendPosition: LegendPosition = LegendPosition.Right;
  public colorScheme: string | Color = {
    name: '',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5'],
  };;



  constructor(private reportService: ReportsService) { }


  ngOnInit() {
    this.getTrainees();
  }



  getTrainees() {

    this.reportService.ViewTrainees().subscribe(res =>{
        console.log(res);
        this.Trainees = res;
    })
  }
  Generate(data)
  {
    console.log(Number(data.traineeID));


    this.reportService.TraineePerformanceReport(Number(data.traineeID)).subscribe((res:any)=>{
      console.log(res);
      this.isClicked = true;
      this.Trainee = res

    })
  }

  onSelect(data)
  {

  }

}

export var TraineesData = [
  {
    "name": "",
    "value": 0
  },

]
