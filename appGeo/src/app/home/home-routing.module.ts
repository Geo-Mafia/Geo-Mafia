import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { Chat } from '../chat/chat.component'
//The Chat is added here so that the template can be represented
import { CampusMap } from '../map/campus-map.component'
import {Bubble} from '../map/map.component'

import { HomeComponent } from './home.component'

const routes: Routes = [
  { path: '',
    component: HomeComponent,
    children: [
      {path: "Chat", component: Chat}] },
  { path: 'campusMap', component: CampusMap, pathMatch: 'full'},

]


@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule {}
