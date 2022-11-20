import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KillingComponent } from './killing.component';
import { NativeScriptFormsModule } from "@nativescript/angular";
import { NativeScriptModule } from "@nativescript/angular";


@NgModule({
  imports: [
    CommonModule,
    NativeScriptModule,
    NativeScriptFormsModule
  ],
  declarations: [
    KillingComponent
  ]
})
export class KillingModule {}
