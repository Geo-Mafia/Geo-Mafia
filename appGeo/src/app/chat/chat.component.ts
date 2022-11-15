import { Component, OnInit } from '@angular/core';
import { databaseAdd, databaseGet } from '../../modules/database'
import { firebase } from "@nativescript/firebase";

@Component({
  selector: 'Chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class Chat implements OnInit {

  public chats: String[]; //change String to any or Message class later


  constructor() { 
    this.chats = [];
  }

  ngOnInit(): void {
    this.chats = this.getMsgs();
    firebase.addValueEventListener(this.updateMsg, "game/chats");
  }

  getMsgs() {
    let msgs = [];
    databaseGet('game/chats').then(value => {
      msgs.concat(value);
      console.log("all msgs: " + msgs);
    });
    return msgs;
  }

  updateMsg(data: object) {
    var list = data["value"];
    this.chats = list;
  }

}

// export class Message{
// }
