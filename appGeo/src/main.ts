import { platformNativeScript, runNativeScriptAngularApp } from '@nativescript/angular';
import { firebase } from "@nativescript/firebase";
import { AppModule } from './app/app.module';
import { databaseInit } from './modules/database';

//console.log('runnnnnnnnnnnnnnnnnnnnning');
runNativeScriptAngularApp({
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});

databaseInit();
 //firebase.init()
// firebase.addValueEventListener(console.log, "game/users")
//console.log("doneneee");