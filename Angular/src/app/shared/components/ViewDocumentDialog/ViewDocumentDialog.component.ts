import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ViewDocumentDialog',
  templateUrl: './ViewDocumentDialog.component.html',
  styleUrls: ['./ViewDocumentDialog.component.scss']
})
export class ViewDocumentDialogComponent implements OnInit {
  src = this.data.pdfUrl
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewDocumentDialogComponent>,
  ) { }


  ngOnInit() {
    this.src = this.data.pdfUrl
    console.log(this.data.pdfUrl)
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
