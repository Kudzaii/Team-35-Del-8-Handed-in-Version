import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {
  fileName= 'ExcelSheet.xlsx';
  public query: any = '';
  AuditLog: Array<any>

   constructor(private admin: AdminService,  private location: Location) { }

   p: number = 1;

  ngOnInit() {
    this.GetAuditTrail()
  }

  GetAuditTrail() {

    this.admin.GetAuditTrail().subscribe(res =>{
      console.log(res)
          this.AuditLog =res;
    })
  }
  Export()
  {
/* pass here the table id */
      let element = document.getElementById('excel-table');
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, this.fileName);
  }

  
goBack(): void {
  this.location.back();
}

}
