import { Component, OnInit } from '@angular/core';
import { databaseAdd, databaseGet, databaseEventListener } from '../../modules/database'
import { firebase } from "@nativescript/firebase";

@Component({
  selector: 'Chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class Chat implements OnInit {

  public chats: Array<any>; //change String to any or Message class later


  constructor() { 
    this.chats = [];
  }

  ngOnInit(): void {
    this.chats = this.getMsgs();
    databaseEventListener("game/chats", this.updateMsg.bind(this));
    console.log("got to chat");
  }

  getMsgs() {
    let msgs = [];
    databaseGet('game/chats').then(value => {
      //console.log("val: " + value);
      msgs = value;
      //console.log("all msgs: " + msgs);
    });
    return msgs;
  } 

  updateMsg(data: object) {
    //get current chats
    this.chats = [];

    //console.log("data: " + JSON.stringify(data));
    let list = data["value"];
    this.chats = list;
  }

}

// export class Message{
// }
