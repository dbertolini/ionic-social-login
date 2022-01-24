import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private angularFireDatabaseModule: AngularFireDatabase, private toast: ToastController, private angularFireAuthModule:AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
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

  // Validate all user data
  validate(user:User):boolean {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    console.log(user);

    if(this.isEmpty(user.email) || this.isEmpty(user.password) || this.isEmpty(user.passwordVerification)) {
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

    if(user.password.trim().length < 6 || user.passwordVerification.trim().length < 6) {
      this.toast.create({
        message: 'La clave debe contener al menos 6 caracteres.',
        duration: 4000
      }).present();
      return false;
    }

    if(user.password.trim().toLowerCase() != user.passwordVerification.trim().toLowerCase()) {
      this.toast.create({
        message: 'Las claves no coinciden. Por favor verificar la validación de la misma.',
        duration: 4000
      }).present();
      return false;
    }

    return true;
  }

  // Click on register button
  async register(user: User) {
    try {
      if(this.validate(user)) {
        //Create the new user
        const result = await this.angularFireAuthModule.auth.createUserWithEmailAndPassword(user.email.toLowerCase(), user.password);
        if(result) {
          console.log(result);

          // Sets the display name property
          await this.angularFireAuthModule.auth.currentUser.updateProfile({
            displayName: user.displayName,
            photoURL: ''
          });

          // Send an email to the address to confirm
          this.angularFireAuthModule.auth.currentUser.sendEmailVerification();
          this.toast.create({
            message: 'Usuario registrado exitosamente. Por favor valide su correo electrónico.',
            duration: 4000
          }).present();

          // Obtain the user id to store in the database
          user.uid = this.angularFireAuthModule.auth.currentUser.uid;

          // Store in the database the user data
          this.angularFireDatabaseModule.list("/users/").push(user);

          // Return to login page for login with email verification
          this.navCtrl.setRoot(LoginPage);
        }
      }
    }
    catch(e) {
      console.error(e);
      if(e.code == 'auth/email-already-in-use'){
        this.toast.create({
          message: 'El correo electrónico ya se encuentra en uso.',
          duration: 4000
        }).present();
      }
      else
      {
        this.toast.create({
          message: 'Se ha producido un error. Compruebe su conexión a internet.',
          duration: 4000
        }).present();
      }
    }

  }


}
