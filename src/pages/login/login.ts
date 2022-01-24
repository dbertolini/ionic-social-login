import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController, Events } from 'ionic-angular';
import firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireAuth } from 'angularfire2/auth';

import { RecoverPage } from '../recover/recover';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';
import { PhoneVerifyPage } from '../phone-verify/phone-verify';

//import { FCM } from '@ionic-native/fcm';

import { User } from '../../models/user';

interface Window {
  FirebasePlugin: any;
}

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public currentUser: any;

  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public googlePlus: GooglePlus,
    public facebook: Facebook,
    public platform: Platform,
    public loading: LoadingController,
    public toast: ToastController,
    public events: Events
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  getUser(): firebase.User {
    // Get user information
    return this.afAuth.auth.currentUser;
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

    if(this.isEmpty(user.email) || this.isEmpty(user.password)) {
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

    if(user.password.trim().length < 6) {
      this.toast.create({
        message: 'La clave debe contener al menos 6 caracteres.',
        duration: 4000
      }).present();
      return false;
    }

    return true;
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  recover() {
    this.navCtrl.push(RecoverPage);
  }

  emailLogin(user: User) {
    // Validate data form
    if(this.validate(user)) {
      // Loading spinner
      let loader = this.loading.create({
        content: "Please wait..."
      });
      loader.present();

      // Request login to firebase
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(success => {
        loader.dismiss();
        // Is the user verified?
        if(!success.emailVerified) {          
          console.error("Usuario no validado");
          this.toast.create({
            message: 'Aún no se verificó el correo electrónico. Por favor realice la validación a través del email enviado a su casilla.',
            duration: 5000
          }).present();
          this.afAuth.auth.currentUser.sendEmailVerification();
          this.afAuth.auth.signOut();
        }
        else
        {
          console.log(success);

          this.currentUser = this.afAuth.auth.currentUser;
          // Store the user logged in
          localStorage.setItem('displayName',this.currentUser.displayName);
          localStorage.setItem('email',this.currentUser.email);
          localStorage.setItem('photoURL',this.currentUser.photoURL);
          localStorage.setItem('uid',this.currentUser.uid);
          localStorage.setItem('loginType','login');

          // Throw an event to refresh sidemenu
          this.events.publish('user:logged');

          // Redirects to TabsPage after login ok
          this.navCtrl.setRoot(TabsPage);
        }
      })
      .catch(error => {
        loader.dismiss();
        // Toast message about event
        let toaster = this.toast.create({
          message: 'Login failed',
          duration: 3000
        });
        toaster.present();

        console.error(error);
      });
    }
  }

  googleLogin() {
    // Loading spinner
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();

    // If it is a browser, gets the common login
    if(this.platform.is('core') || this.platform.is('mobileweb')) {

      // Performs login
      var provider = new firebase.auth.GoogleAuthProvider();
      //provider.addScope('email');
      //provider.addScope('profile');
      return this.afAuth.auth.signInWithPopup(provider)
      // Login OK
      .then(success => {

        this.currentUser = this.afAuth.auth.currentUser;
        // Store the user logged in
        localStorage.setItem('displayName',this.currentUser.displayName);
        localStorage.setItem('email',this.currentUser.email);
        localStorage.setItem('photoURL',this.currentUser.photoURL);
        localStorage.setItem('uid',this.currentUser.uid);
        localStorage.setItem('loginType','google');

        loader.dismiss();

        // Toast message about event
        let toaster = this.toast.create({
          message: 'Login succeeded',
          duration: 3000
        });
        toaster.present();

        console.log(success);

        // Throw an event to refresh sidemenu
        this.events.publish('user:logged');

        // Redirects to TabsPage after login ok
        this.navCtrl.setRoot(TabsPage);
      })
      // Login ERROR
      .catch(error => {
        loader.dismiss();

        // Toast message about event
        let toaster = this.toast.create({
          message: 'Login failed',
          duration: 3000
        });
        toaster.present();

        console.error(error);
      });
    }
    // If it is a device, do the native login
    else {

      // Performs login
      return this.googlePlus
      .login({
        webClientId:
          'XXXXXXXXX-XXXXXXX.apps.googleusercontent.com',
        offline: true
      })
      .then(res => {
        const credential = firebase.auth.GoogleAuthProvider.credential(res.idToken);

        this.afAuth.auth.signInWithCredential(credential)
        // Login OK
        .then(success => {

          this.currentUser = this.afAuth.auth.currentUser;
        // Store the user logged in
        localStorage.setItem('displayName',this.currentUser.displayName);
        localStorage.setItem('email',this.currentUser.email);
        localStorage.setItem('photoURL',this.currentUser.photoURL);
        localStorage.setItem('uid',this.currentUser.uid);
        localStorage.setItem('loginType','google');

          loader.dismiss();

          // Toast message about event
          let toaster = this.toast.create({
            message: 'Login succeeded',
            duration: 3000
          });
          toaster.present();

          console.log(success);

          // Throw an event to refresh sidemenu
          this.events.publish('user:logged');

          // Redirects to TabsPage after login ok
          this.navCtrl.setRoot(TabsPage);
        })
        // Login ERROR
        .catch(error => {
          loader.dismiss();

          // Toast message about event
          let toaster = this.toast.create({
            message: 'Login failed',
            duration: 3000
          });
          toaster.present();

          console.error(error);
        });
      })
      // Login ERROR
      .catch(err => {
        loader.dismiss();

        // Toast message about event
        let toaster = this.toast.create({
          message: 'Login failed',
          duration: 3000
        });
        toaster.present();

        console.error(err);
      });
    }
  }

  facebookLogin() {
    // Loading spinner
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();

    // If it is a browser, gets the common login
    if(this.platform.is('core') || this.platform.is('mobileweb')) {
      // Performs login
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('email');
      provider.addScope('public_profile');
      return this.afAuth.auth.signInWithPopup(provider)
      // Login OK
      .then(success => {

        this.currentUser = this.afAuth.auth.currentUser;
        // Store the user logged in
        localStorage.setItem('displayName',this.currentUser.displayName);
        localStorage.setItem('email',this.currentUser.email);
        localStorage.setItem('photoURL',this.currentUser.photoURL);
        localStorage.setItem('uid',this.currentUser.uid);
        localStorage.setItem('loginType','facebook');

        loader.dismiss();

        // Toast message about event
        let toaster = this.toast.create({
          message: 'Login succeeded',
          duration: 3000
        });
        toaster.present();

        console.log(success);

        // Throw an event to refresh sidemenu
        this.events.publish('user:logged');

        // Redirects to TabsPage after login ok
        this.navCtrl.setRoot(TabsPage);
      })
      // Login ERROR
      .catch(error => {

        loader.dismiss();

        // If are there another credential with the same email, it is linked
        if(error.code == 'auth/account-exists-with-different-credential'){
          // Toast message about event
          let toaster = this.toast.create({
            message: 'Ya existe otra cuenta con el email ingresado',
            duration: 3000
          });
          toaster.present();
        }
        else {
          // Toast message about event
          let toaster = this.toast.create({
            message: 'Login failed',
            duration: 3000
          });
          toaster.present();
        }

        console.error(error);
      });
    }
    else {
      // Performs a crossplatform login
      return this.facebook.login(['email'])
      .then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);

        this.afAuth.auth.signInWithCredential(facebookCredential)
        // Login OK
        .then(success => {

          this.currentUser = this.afAuth.auth.currentUser;
          // Store the user logged in
          localStorage.setItem('displayName',this.currentUser.displayName);
          localStorage.setItem('email',this.currentUser.email);
          localStorage.setItem('photoURL',this.currentUser.photoURL);
          localStorage.setItem('uid',this.currentUser.uid);
          localStorage.setItem('loginType','facebook');

          loader.dismiss();

          // Toast message about event
          let toaster = this.toast.create({
            message: 'Login succeeded',
            duration: 3000
          });
          toaster.present();

          console.log(success);

          // Throw an event to refresh sidemenu
          this.events.publish('user:logged');

          // Redirects to TabsPage after login ok
          this.navCtrl.setRoot(TabsPage);
        })
        // Login ERROR
        .catch(error => {
          loader.dismiss();

          // Toast message about event
          let toaster = this.toast.create({
            message: error,
            duration: 3000
          });
          toaster.present();

          console.error(error);
        });
      })
      // Login ERROR
      .catch(err => {
        loader.dismiss();

        // Toast message about event
        let toaster = this.toast.create({
          message: 'Login failed',
          duration: 3000
        });
        toaster.present();

        console.error(err);
      });
    }
  }

  emailRegister() {
    this.navCtrl.push(RegisterPage);
  }

  emailRecover() {
    this.navCtrl.push(RecoverPage);
  }
  
  verificationId: any;
  code: string = "";
  recaptchaVerifier: any;

  phoneLogin(user: User) {
    // If it is a browser, gets the common login
    if(this.platform.is('core') || this.platform.is('mobileweb')) {

      // // Loading spinner
      // let loader = this.loading.create({
      //   content: "Please wait..."
      // });
      // loader.present();
      
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

      // this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('phone-sign-in-recaptcha', {
      //   'size': 'invisible',
      //   'callback': function(response) {
      //     // reCAPTCHA solved - will proceed with submit function
      //   },
      //   'expired-callback': function() {
      //     // Reset reCAPTCHA?
      //   }
      // });
      
      this.afAuth.auth.signInWithPhoneNumber(this.user.phone, this.recaptchaVerifier)
      .then(data => {
        // Toast message about event
        let toaster = this.toast.create({
          message: 'Por favor introduzca el código enviado por SMS',
          duration: 3000
        });
        toaster.present();
        console.log(data);
        
        this.navCtrl.push(PhoneVerifyPage, {'verificationId': data.verificationId});
      }).catch(err => {
        // Toast message about event
        let toaster = this.toast.create({
          message: 'Error while sending SMS',
          duration: 3000
        });
        toaster.present();
        console.error(err);
      });

    }
    else {

      // Loading spinner
      let loader = this.loading.create({
        content: "Please wait..."
      });
      loader.present();

      (<any>window).FirebasePlugin.verifyPhoneNumber(this.user.phone, 60, (credential) => {
        // Toast message about event
        let toaster = this.toast.create({
          message: 'Por favor introduzca el código enviado por SMS',
          duration: 3000
        });
        toaster.present();

        console.log(credential);

        this.verificationId = credential.verificationId;

        loader.dismiss();
        
        this.navCtrl.push(PhoneVerifyPage, {'verificationId': this.verificationId});

      },(error) => {
        loader.dismiss();

        // Toast message about event
        let toaster = this.toast.create({
          message: JSON.stringify(error),
          duration: 3000
        });
        toaster.present();
        
        console.error(error);
      });
    }
  }
}
