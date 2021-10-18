import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Location } from '@angular/common'
@Component({
  selector: 'app-Exit-wavers',
  templateUrl: './Exit-wavers.component.html',
  styleUrls: ['./Exit-wavers.component.scss']
})
export class ExitWaversComponent implements OnInit {
  fileUploads=[];
  searchText = '';
toggleSearch = false;
  constructor(private firestore: AngularFirestore,private location: Location ) { }

  ngOnInit() {

    this.firestore.collection('Documents').snapshotChanges().subscribe(items => {
      this.fileUploads = [];
      items.forEach(a => {
        const item: any = a.payload.doc.data();
        item.id = a.payload.doc.id;
        console.log(item);
        this.fileUploads.push(item)
        // tslint:disable-next-line: triple-equals
        // if (item.userId == this.id) {
        //    // if driver is applicant add date to the array

        // }
      });
      console.log(this.fileUploads);
    });
  }
  goBack(): void {
    this.location.back();
  }


}
