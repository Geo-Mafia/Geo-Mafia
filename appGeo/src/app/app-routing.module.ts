import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('~/app/home/home.module').then((m) => m.HomeModule),
  },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes), FormsModule],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
