import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { ChatComponent } from '../chat/chat.component'
//The Chat is added here so that the template can be represented
import { CampusMap } from '../map/campus-map.component'
import {Bubble} from '../map/map.component'

import { HomeComponent } from './home.component'

const routes: Routes = [
  {path: "Chat", component: ChatComponent},
  { path: '',
    component: HomeComponent
  },
  { path: 'campusMap', component: CampusMap, pathMatch: 'full'},

]


@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule {}