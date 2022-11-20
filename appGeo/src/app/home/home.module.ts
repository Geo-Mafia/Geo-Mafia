import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'

import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './home.component'
import { ChatComponent} from '../chat/chat.component'
import { KillingComponent } from '../player/killing.component'
import {Bubble} from '../map/map.component'
import {CampusMap} from '../map/campus-map.component'
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptFormsModule } from "@nativescript/angular";
import { NativeScriptModule } from "@nativescript/angular";

@NgModule({
  imports: [NativeScriptCommonModule, HomeRoutingModule, FormsModule, NativeScriptFormsModule, CommonModule, ReactiveFormsModule],
  declarations: [HomeComponent, Bubble, CampusMap, ChatComponent, KillingComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeModule {}