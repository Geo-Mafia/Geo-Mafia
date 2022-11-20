import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';
import { Player } from './player/player.component';
import { Game } from './game/game.component'
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, ReactiveFormsModule, FormsModule],
  declarations: [AppComponent, Player, Game],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
