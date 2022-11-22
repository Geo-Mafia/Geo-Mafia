import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { ChatComponent } from '../chat/chat.component'
import { KillingComponent } from '../player/killing.component'
import { VotingComponent } from '../voting/voting.component'
//The Chat is added here so that the template can be represented
import { CampusMap } from '../map/campus-map.component'
import {Bubble} from '../map/map.component'
import {SnapshotComponent} from '../snapshot/snapshot.component'
import { LocationComponent } from "../location/location.component"
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here

import { HomeComponent } from './home.component'


import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptFormsModule } from "@nativescript/angular";
import { NativeScriptModule } from "@nativescript/angular";





const routes: Routes = [
  {path: "Killing", component: KillingComponent},
  {path: "Voting", component: VotingComponent},
  {path: "Chat", component: ChatComponent},
  {path: "Location", component: LocationComponent},
  { path: 'campusMap', component: CampusMap, pathMatch: 'full'},
  { path: '',
    component: HomeComponent
  },
  { path: 'campusMap', component: CampusMap, pathMatch: 'full'},
  {path: "Snapshot", component: SnapshotComponent},

]


@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes), FormsModule, NativeScriptFormsModule, CommonModule,
    ReactiveFormsModule,],
  exports: [NativeScriptRouterModule],
})
export class HomeRoutingModule {}
