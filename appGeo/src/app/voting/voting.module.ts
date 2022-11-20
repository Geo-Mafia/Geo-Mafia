import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VotingComponent } from './voting.component';
import { NativeScriptFormsModule } from "@nativescript/angular";
import { NativeScriptModule } from "@nativescript/angular";


@NgModule({
  imports: [
    CommonModule,
    NativeScriptModule,
    NativeScriptFormsModule
  ],
  declarations: [
    VotingComponent
  ]
})
export class VotingModule {}