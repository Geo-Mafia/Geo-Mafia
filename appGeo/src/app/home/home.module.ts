import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'

import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './home.component'
import {Bubble} from '../map/map.component'

@NgModule({
  imports: [NativeScriptCommonModule, HomeRoutingModule],
  declarations: [HomeComponent, Bubble],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeModule {}
