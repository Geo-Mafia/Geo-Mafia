import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnapshotComponent } from './snapshot.component';
import { NativeScriptFormsModule } from "@nativescript/angular";
import { NativeScriptModule } from "@nativescript/angular";

@NgModule({
  imports: [
    CommonModule,
    NativeScriptModule,
    NativeScriptFormsModule
  ],
  declarations: [
    SnapshotComponent
  ]
})
export class SnapshotModule {}