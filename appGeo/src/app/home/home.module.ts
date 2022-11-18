import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'

import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './home.component'
import { ChatComponent} from '../chat/chat.component'
import {Bubble} from '../map/map.component'
import {CampusMap} from '../map/campus-map.component'
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here
@NgModule({
  imports: [NativeScriptCommonModule, HomeRoutingModule, FormsModule],
  declarations: [HomeComponent, Bubble, CampusMap, ChatComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeModule {}