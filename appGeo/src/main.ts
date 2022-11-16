import { platformNativeScript, runNativeScriptAngularApp } from '@nativescript/angular';
import { firebase } from "@nativescript/firebase";
import { AppModule } from './app/app.module';

//console.log('runnnnnnnnnnnnnnnnnnnnning');
runNativeScriptAngularApp({
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});
firebase.init()
firebase.addValueEventListener(console.log, "game/users")
//console.log("doneneee");