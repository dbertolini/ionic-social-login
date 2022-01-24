import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { User } from '../../models/user';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-phone-verify',
  templateUrl: 'phone-verify.html',
})
export class PhoneVerifyPage {

  user = {} as User;

  verificationId;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loading: LoadingController,
    public toast: ToastController) {

    this.verificationId = this.navParams.get('verificationId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhoneVerifyPage');
  }

  verify() {
    // Loading spinner
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();

    const credential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.user.phoneVerifyCode);

    firebase.auth().signInWithCredential(credential)
    .then(user => {
      console.log(user);
      loader.dismiss();

      // Toast message about event
      let toaster = this.toast.create({
        message: 'Login succeded',
        duration: 3000
      });
      toaster.present();

      this.navCtrl.push(TabsPage);
    })
    .catch(err => {
      loader.dismiss();
      // Toast message about event
      let toaster = this.toast.create({
        message: 'Verify failed',
        duration: 3000
      });
      toaster.present();
      console.error(err);
    });
  }
}
