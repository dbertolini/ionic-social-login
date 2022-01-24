import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { User } from '../../models/user';

import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../../../src/pages/login/login';

@IonicPage()
@Component({
  selector: 'page-recover',
  templateUrl: 'recover.html',
})
export class RecoverPage {

  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToastController,
    public angularFireAuthModule: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoverPage');
  }

  isEmpty(obj):boolean {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  }

  validate(user:User):boolean {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    console.log(user);

    if(this.isEmpty(user.email)) {
      this.toast.create({
        message: 'Por favor verifique los datos ingresados.',
        duration: 4000
      }).present();
      return false;
    }

    if(user.email.trim().length <=3 || !re.test(user.email.toLowerCase())) {
      this.toast.create({
        message: 'Por favor verifique el email ingresado.',
        duration: 4000
      }).present();
      return false;
    }

    return true;
  }

  async changePass(user:User) {

    try {
      if(this.validate(user)) {
        const result = await this.angularFireAuthModule.auth.sendPasswordResetEmail(user.email);
        console.log(result);
        this.toast.create({
          message: 'Se ha enviado un correo electrónico a esa casilla para recuperar la clave.',
          duration: 4000
        }).present();
        this.navCtrl.setRoot(LoginPage);
      }
    }
    catch(e) {
      console.error(e)
      if(e.code=='auth/user-not-found') {
        this.toast.create({
          message: 'No existen registros con ese correo electrónico.',
          duration: 4000
        }).present();
      }
      else{
        this.toast.create({
          message: 'Se ha producido un error. Compruebe su conexión a internet.',
          duration: 4000
        }).present();
      }
    }
  }

}
