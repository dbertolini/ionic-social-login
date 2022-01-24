import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhoneVerifyPage } from './phone-verify';

@NgModule({
  declarations: [
    PhoneVerifyPage,
  ],
  imports: [
    IonicPageModule.forChild(PhoneVerifyPage),
  ],
})
export class PhoneVerifyPageModule {}
