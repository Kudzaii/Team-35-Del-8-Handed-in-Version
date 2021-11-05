import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClientService } from 'src/app/dashboard/Client/services/client.service';
import { AlertComponent } from 'src/app/shared/utils/modals/alert/alert.component';
import { SimpleModalService } from 'ngx-simple-modal';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-FinalPurchase',
  templateUrl: './FinalPurchase.component.html',
  styleUrls: ['./FinalPurchase.component.scss']
})
export class FinalPurchaseComponent implements OnInit {

  @Input() regForm: FormGroup;
  constructor(private clientService:ClientService,
    private SimpleModalService: SimpleModalService) { }

    amount = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
  ngOnInit() {
    this.stripePaymentGateway();
  }



  strikeCheckout:any = null;


  checkout(amount) {

    let tempString = 'Are You Sure You Want To Purchase This Package?';
    let resultPopupString =  "Successfully Purchased!"
    let form =  this.regForm.value.PurchaseDetails
    let form2 =  this.regForm.value.ChoosePackageDetails


  Swal.fire({
    title: tempString,
    showDenyButton: true,
    confirmButtonText: 'Yes',
    denyButtonText: `No`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {

      if( form.Quantity != null)
      {
        let pack = {Package_ID:form2.PackageID,Client_ID: form2.Client_ID,Quantity:form.Quantity}

       this.clientService.PurchasePackage(pack).subscribe(res=>{

         console.log(res)
         const strikeCheckout = (<any>window).StripeCheckout.configure({
           key: 'pk_test_51JUghHBHH2M1dTncWJ2ml3WFgELSn75lagjL3xyUMxu1fM1D2heIw3ZF42P0JKweXie7mz8umfaod0wsFarkQdfj00FNxHtaqg',
           locale: 'auto',
           token: function (stripeToken: any) {
             this.SimpleModalService.addModal(AlertComponent, { message: 'Payment via stripe successfull!' }, { closeOnEscape: true});
           }
         });


         strikeCheckout.open({
           name: 'RemoteStack',
           description: 'Payment widgets',
           amount: amount * 100
         });


       })

      }
      else{
        alert("Payment now confirmed or quantity listed")
      }

    } else if (result.isDenied) {

    }
  })








  }

  stripePaymentGateway() {
    if(!window.document.getElementById('stripe-script')) {
      const scr = window.document.createElement("script");
      scr.id = "stripe-script";
      scr.type = "text/javascript";
      scr.src = "https://checkout.stripe.com/checkout.js";

      scr.onload = () => {
        this.strikeCheckout = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51JUghHBHH2M1dTncWJ2ml3WFgELSn75lagjL3xyUMxu1fM1D2heIw3ZF42P0JKweXie7mz8umfaod0wsFarkQdfj00FNxHtaqg',
          locale: 'auto',
          token: function (token: any) {
            console.log(token)


          }
        });
      }

      window.document.body.appendChild(scr);
    }
  }

  step1Submitted() {
    let form =  this.regForm.value.PurchaseDetails
    let form2 =  this.regForm.value.ChoosePackageDetails

   if( form.Quantity != null)
   {
     let pack = {Package_ID:form2.PackageID,Client_ID: form2.Client_ID,Quantity:form.Quantity}

    this.clientService.PurchasePackage(pack).subscribe(res=>{

      console.log(res)
        this.SimpleModalService.addModal(AlertComponent, { message: 'Payment via stripe successful!' }, { closeOnEscape: true});

    })

   }
   else{
     alert("Payment now confirmed or quantity listed")
   }

  }

}
