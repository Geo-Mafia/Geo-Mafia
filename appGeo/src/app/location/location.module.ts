import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LocationComponent } from './location.component';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here


@NgModule({
  declarations: [
    LocationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {path: '', component: LocationComponent},
    ])
  ]
})
export class LocationModule { }
