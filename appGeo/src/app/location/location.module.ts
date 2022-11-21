import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationComponent } from './location.component';
import { NativeScriptFormsModule } from "@nativescript/angular";
import { NativeScriptModule } from "@nativescript/angular";


@NgModule({
  imports: [
    CommonModule,
    NativeScriptModule,
    NativeScriptFormsModule
  ],
  declarations: [
    LocationComponent
  ]
})
export class LocationModule {}
