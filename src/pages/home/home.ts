import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public currentUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth) {
    this.currentUser = this.afAuth.auth.currentUser;
  }

}
