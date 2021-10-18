import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from '../reports.service';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-package-sales-report',
  templateUrl: './package-sales-report.component.html',
  styleUrls: ['./package-sales-report.component.scss']
})
export class PackageSalesReportComponent implements OnInit {



  UserRoles: Array<any>;
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
    date: new FormControl('', Validators.required)

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

}



getReportResults(date) {

    console.log(Number(this.form.controls.date.value));
    this.reportService.BookingsPerPackage(date).subscribe((res:any)=>{
      console.log(res);

      UserRoles = res.Data.map(datum => ({ name: datum.PackageName, value: datum.Count }));
      Object.assign(this, { UserRoles })
      UserRoles.sort((a:any, b:any) => parseFloat(b.value) - parseFloat(a.value))
      this.isClicked = true;
      //this.buildGraph(numbers,Months)
    })


}
touched(){
  this.dropdown = !this.dropdown
}

onSelect(event) {
  console.log(event);
}
}

export var UserRoles = [
  {
    "name": "",
    "value": 0
  },

];

