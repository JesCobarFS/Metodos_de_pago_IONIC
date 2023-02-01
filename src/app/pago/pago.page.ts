import { Component, OnInit } from '@angular/core';
import { AlertButton, AlertController, NavController, ToastController } from '@ionic/angular';

declare var paypal: any;
@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {

  monto = ""
  constructor(private toastCtrl: ToastController, private navCtrl: NavController ) { }

  ngOnInit() {

    const paypalButtonsComponent = paypal.Buttons({
      // optional styling for buttons
      // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
      style: {
        color: "gold",
        shape: "rect",
        layout: "vertical",
       
       
      },
      createOrder: (data: any, actions: { order: { create: (arg0: { purchase_units: { amount: { value: string; }; }[]; }) => any; }; }) => {
        // pass in any options from the v2 orders create call:
        // https://developer.paypal.com/api/orders/v2/#orders-create-request-body
        const createOrderPayload = {
            purchase_units: [
                {
                    amount: {
                        value: ""+this.monto,
                      
                        
                        
                    }
                }
            ]
        };

        return actions.order.create(createOrderPayload);
    },  

    onApprove: (data: any, actions: { order: { capture: () => Promise<any>; }; }) => {
      const captureOrderHandler = (details: { payer: { name: { given_name: any; }; }; }) => {
          const payerName = details.payer.name.given_name;
          console.log('Transaction completed');
          this.navCtrl.navigateRoot('home');
          this.presentAlert('Transaccion completada');
          

      };

      return actions.order.capture().then(captureOrderHandler);
  },
  onError: (err: any) => {
    this.presentAlert('Un error impidió que el comprador pagara con PayPal')
    console.error('Un error impidió que el comprador pagara con PayPal');
},
  onCancel: function(data:any){
    
    this.presentAlert("pago cancelado");
  
  }
});

paypalButtonsComponent
.render("#paypal-button-container")
.catch((err: any) => {
    console.error('PayPal Buttons failed to render');
    this.presentAlert('PayPal Buttons failed to render')
    
    
    });

  }

  async presentAlert(text:String) {
    const toast = await this.toastCtrl.create({
      message: ''+text,
      duration: 2000
    });
    toast.present();
  }

}
