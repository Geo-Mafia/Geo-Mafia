import { platformNativeScript, runNativeScriptAngularApp } from '@nativescript/angular';
import { firebase } from "@nativescript/firebase";
import { AppModule } from './app/app.module';
import { databaseInit, databaseGet } from './modules/database';
import { Player } from './app/player/player.component';
import { Game } from './app/game/game.component';

global.loggedIn = false;
global.player = new Player();
global.playerlist = new Map<number, Player>();


console.log('runnnnnnnnnnnnnnnnnnnnning');
runNativeScriptAngularApp({
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});
databaseInit();
 //firebase.init()
// firebase.addValueEventListener(console.log, "game/users")
console.log("doneneee");