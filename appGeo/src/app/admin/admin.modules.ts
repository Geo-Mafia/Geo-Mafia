import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { NativeScriptFormsModule } from "@nativescript/angular";
import { NativeScriptModule } from "@nativescript/angular";


@NgModule({
  imports: [
    CommonModule,
    NativeScriptModule,
    NativeScriptFormsModule
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule {}