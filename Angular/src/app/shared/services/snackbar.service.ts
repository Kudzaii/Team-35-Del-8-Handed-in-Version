import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
@Injectable({
  providedIn: 'any'
})
export class SnackbarService {


constructor(public snackBar: MatSnackBar) {}

openSnackBar(message: string) {
  this.openSnackBarWithAction(message, 'Close');
}

openSnackBarWithAction(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 2000,
    verticalPosition: 'bottom',
    panelClass: ['blue-snackbar']
  });
}

}
