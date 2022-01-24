import { Component, ViewChild } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../models/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('content') nav;

  rootPage:any;
  user = {} as User;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public afAuth: AngularFireAuth,
    public events: Events) {

    if(localStorage.getItem('photoURL')=='null')
      this.user.photoURL = 'assets/imgs/profile_user.gif';
    else
      this.user.photoURL = localStorage.getItem('photoURL');
    this.user.displayName = localStorage.getItem('displayName');
    this.user.email = localStorage.getItem('email');

    // Set a listener to this call to load images and data in side menu
    events.subscribe('user:logged', (user, time) => {
      if(localStorage.getItem('photoURL')=='null')
        this.user.photoURL = 'assets/imgs/profile_user.gif';
      else
        this.user.photoURL = localStorage.getItem('photoURL');
      this.user.displayName = localStorage.getItem('displayName');
      this.user.email = localStorage.getItem('email');
    });

    afAuth.authState.subscribe( user => {
      if (user){
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage;
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  logout() {
    // Remove all stored variables
    localStorage.removeItem('displayName');
    localStorage.removeItem('email');
    localStorage.removeItem('photoURL');
    localStorage.removeItem('uid');
    localStorage.removeItem('loginType');

    // Logout from afAuth
    this.afAuth.auth.signOut();
  }
}

