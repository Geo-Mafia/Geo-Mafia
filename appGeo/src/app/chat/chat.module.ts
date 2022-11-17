import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here



@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ChatComponent },
    ])
  ]
})
export class ChatModule {}
