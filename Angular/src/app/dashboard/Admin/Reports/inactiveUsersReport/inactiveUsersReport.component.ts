import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from '../reports.service';
declare let google: any;
@Component({
  selector: 'app-inactiveUsersReport',
  templateUrl: './inactiveUsersReport.component.html',
  styleUrls: ['./inactiveUsersReport.component.scss']
})
export class InactiveUsersReportComponent implements OnInit {

    UserRoles: Array<any>;
    option
    initOpts
    dropdown = false;
    form = new FormGroup({
      role: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)

    });



     constructor(private reportService: ReportsService) { }

  ngOnInit() {
    this. getUserRoles();
  }


  getUserRoles() {

    this.reportService.ViewUserRoles().subscribe(res =>{
        console.log(res);
        this.UserRoles = res;
        this.UserRoles =this.UserRoles.splice(1)
    })
  }
  getReportResults(date) {
    if(Number(this.form.controls.role.value) != undefined && Number(this.form.controls.role.value) != null && Number(this.form.controls.role.value) != 0)
    {
      console.log(Number(this.form.controls.role.value));
      this.reportService.InactiveUsersReport(Number(this.form.controls.role.value),date).subscribe((res:any)=>{
        console.log(res);
        let Months = [];
        let numbers = [];
        res.Results.forEach(element => {
          Months.push(element.Month)
          numbers.push(element.UsersInactiveSince)
        });
        this.buildGraph(numbers,Months)
      })
    }

  }
  touched(){
    this.dropdown = !this.dropdown
  }

  buildGraph(data: Array<number>,months: Array<string>)

  {
    console.log(data, ">>", months);
    this.initOpts = {
      renderer: 'svg',
      width: 900,
      height: 500
    };

    this.option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: months,
          axisTick: {
            alignWithLabel: true
          },
          z: 10,
        }
      ],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: 'UsersInactiveSince',
        barCategoryGap: '40%',
        barGap: '-100%',
        type: 'bar',
        data: data
      }]
    };
  }
}
