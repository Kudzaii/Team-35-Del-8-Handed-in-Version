import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
@Component({
  selector: 'app-purchase-questionnaire',
  templateUrl: './purchase-questionnaire.component.html',
  styleUrls: ['./purchase-questionnaire.component.scss']
})
export class PurchaseQuestionnaireComponent implements OnInit {

  strikeCheckout:any = null;

  constructor( private location: Location) { }

  ngOnInit() {
    this.stripePaymentGateway();
  }

  checkout(amount) {
    const strikeCheckout = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51JUghHBHH2M1dTncWJ2ml3WFgELSn75lagjL3xyUMxu1fM1D2heIw3ZF42P0JKweXie7mz8umfaod0wsFarkQdfj00FNxHtaqg',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken)
        alert('Stripe token generated!');
      }
    });

    strikeCheckout.open({
      name: 'RemoteStack',
      description: 'Payment widgets',
      amount: amount * 100
    });
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
            alert('Payment via stripe successfull!');
          }
        });
      }

      window.document.body.appendChild(scr);
    }
  }
  goBack(): void {
    this.location.back();
  }
}