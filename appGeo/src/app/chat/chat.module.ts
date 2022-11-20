import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { NativeScriptFormsModule } from "@nativescript/angular";
import { NativeScriptModule } from "@nativescript/angular";


@NgModule({
  imports: [
    CommonModule,
    NativeScriptModule,
    NativeScriptFormsModule
    // ReactiveFormsModule,
    // RouterModule.forChild([
    //   { path: '', component: ChatComponent },
    // ])
  ],
  declarations: [
    ChatComponent
  ]
})
export class ChatModule {}
