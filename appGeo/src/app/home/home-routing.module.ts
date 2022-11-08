import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { CampusMap } from '../map/campus-map.component'
import {Bubble} from '../map/map.component'

import { HomeComponent } from './home.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'campusMap', component: CampusMap}

]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule {}
