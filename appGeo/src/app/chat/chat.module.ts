import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
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
