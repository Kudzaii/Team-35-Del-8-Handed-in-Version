import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IdleService } from 'src/app/shared/services/idle.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-Timesetter',
  templateUrl: './Timesetter.component.html',
  styleUrls: ['./Timesetter.component.scss'],
})
export class TimesetterComponent implements OnInit {
  value = 0;
  constructor(
    public dialogRef: MatDialogRef<TimesetterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private idleService: IdleService,

  ) {}

  SetTimer() {
    console.log(this.value)
    this.sharedService.UpdateTimer(this.value*60).subscribe(res => {
      console.log(res)
      this.idleService.reset();
      this.idleService.Timer(this.value);
      this.onNoClick()
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}
  // https://stackblitz.com/edit/idle-timer?file=app%2Fidle.service.ts
}
