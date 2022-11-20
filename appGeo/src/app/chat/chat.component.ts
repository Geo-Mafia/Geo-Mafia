import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { databaseAdd, databaseGet, databaseEventListener } from '../../modules/database'
import { firebase } from "@nativescript/firebase";
import { fromObject, ScrollView, ScrollEventData} from '@nativescript/core';

const model = {
    msg_to_send : "What Message to Send"
}

const bindingContext = fromObject(model) 

// onLoaded = args => {
//     const page = args.object

//     page.bindingContext = bindingContext
// }

@Component({
  selector: 'Chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

    text: string = ""
    save() {
        console.log(this.text);
        // Send values to your DB
        this.sendMsg()
        this.text = "";
    }


//   curr_built_msg: string = ""
  public chats: Array<any>; //change String to any or Message class later
  public msg_sender = "hi"
  //#region that contains all alphabet
//   a: string = "a"
//   b: string = "b"
//   c: string = "c"
//   d: string = "d"
//   e: string = "e"
//   f: string = "f"
//   g: string = "g"
//   h: string = "h"
//   i: string = "i"
//   j: string = "j"
//   k: string = "k"
//   l: string = "l"
//   m: string = "m"
//   n: string = "n"
//   o: string = "o"
//   p: string = "p"
//   q: string = "q"
//   r: string = "r"
//   s: string = "s"
//   t: string = "t"
//   u: string = "u"
//   v: string = "v"
//   w: string = "w"
//   x: string = "x"
//   y: string = "y"
//   z: string = "z"
//   havePressedShift: boolean = false
  //#endregion

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

  sendMsg(){
    //var data = "Testing"
    console.log("Inside the send Message function")
    //NOTE: HERE WE NEED TO PASS IN THE PLAYER NAME
    var new_msg = new Message(this.text, 'testing player name')
    //this.chats.push(this.text);
    this.chats.push(new_msg)
    console.log("What is currently the message to send:", this.text)
    console.log("The timestamp that we are printing out is: ", new_msg.getTimestamp())
    console.log("The name of the player that is sending the message is: ", new_msg.getPlayerName())

    //sending to firebase
    databaseAdd('game/chats', this.chats);

    // this.reset()
    // console.log("After having reset, the string is now: ", this.text)
    // console.log("What if we use binding context", `${bindingContext.get('msg_to_send')}`)
    // console.log("Text is currently being set to: ", this.text)
  }

//   onPressEnter(args){
//     console.log("Inside the onPressEnter case!")
//     console.log("What the user inputted was: ", args.target.value)
//   }

  onScroll(args: ScrollEventData){
    const scrollView = args.object as ScrollView;

    console.log("scrollX: " + args.scrollX);
    console.log("scrollY: " + args.scrollY);
  }
  //#region Below are all functions that make keyboard buttons work
//   setNextCapitalized(){
//     if (this.havePressedShift == true){
//         this.havePressedShift = false;
//     }
//     else{
//         this.havePressedShift = true;
//     }
//     console.log("We have set the shift parameter over to: ", this.havePressedShift)
//   }

//   addToString(str: string){
//     console.log("Before having done the concat: ", this.curr_built_msg)
//     if (this.havePressedShift == true){
//         str = str.toUpperCase();
//     }
//     this.havePressedShift = false;

//     console.log("Are we passing the correct string to concat: ", str)
//     this.curr_built_msg = this.curr_built_msg.concat(str);
//     console.log("Having just added letter to the built message:", this.curr_built_msg)
//   }

//   backspace(){
//     if (this.curr_built_msg == null || this.curr_built_msg.length == 0){
//         console.log("We can't backspace when it's empty, just return")
//         return
//     }
//     else{
//         this.curr_built_msg = (this.curr_built_msg.substring(0, this.curr_built_msg.length - 1))
//         console.log("We have backspaced in order to get: ", this.curr_built_msg)
//         return;
//     }
//   }

//   addSpace(){
//     this.curr_built_msg = this.curr_built_msg.concat(" ")
//   }

//   reset(){
//     this.curr_built_msg = ""
//   }
  //#endregion

}

const SUCCESS = 10
const FAILURE = -10
const MAXMESSAGECOUNT = 100
export class Message{
    timestamp; //Formatting of "mm/dd/yy hh:mm" 
    message_content;
    player_name;

    constructor(content, name_of_player){
        //Get the current time right now (in local time) in following format:
        //"MM/DD/YYYY, HH:MM AM/PM"
        var date = new Date();
        this.timestamp = date.toLocaleString('en-US', {
                            timeZone: 'CST',
                            dateStyle: 'short',
                            timeStyle: 'short',
                        })
        //this.message_id = -1 //Default value for ID, nothing should happen here
        this.message_content = content
        this.player_name = name_of_player
    }

    getTimestamp(){
        return this.timestamp;
    }
    getMessageContent(){
        return this.message_content;
    }
    getPlayerName(){
        return this.player_name;
    }

    printMessage(){
        //Prints out in following format: "MM/DD/YYYY HH:MM AM/PM <Message content>"
        //let time = this.timestamp;
        let msg = this.message_content;
        //console.log(time.concat(" ", msg));
        console.log(msg)
        return SUCCESS;
    }

}

export class Chat{
    lower_ID; //Lowest ID of a message that should be displayed to a Player
    curr_ID; //Tracks what next message that gets added to this Chat should have
    chat_ID; //ID that marks a unique chat
    hash_ID_to_message;
    player_list; //Tracks all the Player Objects that are in the Chat

    constructor(unique_chat){
        this.lower_ID = 0;
        this.curr_ID = 0;
        this.chat_ID = unique_chat
        this.hash_ID_to_message = new Map();
        this.player_list = new Array();
    }

    getLowerID(){
        return this.lower_ID;
    }
    getCurrID(){
        return this.curr_ID;
    }
    getChatID(){
        return this.chat_ID;
    }
    getHash(){
        return this.hash_ID_to_message;
    }
    getPlayerList(){
        return this.player_list;
    }
    
    // Function that returns Player object that corresponds to the ID given as input
    getPlayer(id_to_find){
        for(var i = 0; i < this.player_list.length; i++){
            var curr_player = this.player_list[i];
            if (curr_player.getUserID() == id_to_find){
                return curr_player;
            }
        }
        //If couldn't find associated userID --->
        return null
    }


    setLowerID(new_lower){
        //Take care of the edge cases, what if pass lower than 0 ID
        if (new_lower <= 0){
            new_lower = 0;
        }

        //Take care of the edge cases, what if pass a HIGHER ID than what is currently being used
        if (new_lower >= this.curr_ID){
            new_lower = this.curr_ID;
        }

        this.lower_ID = new_lower
        return SUCCESS;
    }
    setChatID(new_ID){
        //Could be used in case the Game logic decides that hasn't optimally set ID of chat
        this.chat_ID = new_ID;
        return SUCCESS;
    }

    /* Take in a Player Object and add him to the Chat*/
    insertPlayer(player_to_add){
        // First, add the Player to the Player List within the chat
        this.player_list.push(player_to_add);

        // Then, Player Object gets updated so they know they've been updated with a Chat
        player_to_add.insertChat(this);

        return SUCCESS;
    }

    /* prints out all Player Usernames that are currently in the chat */
    printPlayers(){
        for (var i = 0; i < this.player_list.length; i++){
            var curr_player = this.player_list[i];
            console.log(curr_player.getUsername())
        }

        return SUCCESS;
    }

    history(){
        //Function that returns list of Messages
        //here is when we can use lower_ID and upper_ID so that we don’t overload users
        var message_list = new Array();
        for (let i = this.lower_ID; i <= this.curr_ID; i++){
            var curr_message = this.hash_ID_to_message.get(i)
            message_list.push(curr_message);
        }
        return message_list
    }
    insertMessage(incoming_message){
        //Set the MessageID for the current incoming message
        var bool = incoming_message.setMessageID(this.curr_ID);
        if (bool == FAILURE){
            console.log("error occured during setMessageID() function")
            return FAILURE
        }

        //Want to ensure maximum distance betwen lower ID and curr ID is MAXMESSAGECOUNT
        if (this.curr_ID - this.lower_ID + 1 >= MAXMESSAGECOUNT){
            this.lower_ID++;
        }
        this.curr_ID++;

        //Lastly, update the hash with the appropriate key and message
        this.hash_ID_to_message.set(incoming_message.getMessageID(), incoming_message);
        return SUCCESS;
    }
    voteCommence(){
        //Function that inserts a Message Letting everyone know that voting has started
        var message_content = "---Voting will now commense---"
        var vote_message = new FullMessage(message_content, "ADMIN");
        var bool = this.insertMessage(vote_message);
        if (bool == SUCCESS){
            return SUCCESS
        }
        else{
            console.log("error occured during insert Message function");
            return FAILURE
        }
    }

    view(){
        //Will need to be taken care of by the UI
        return SUCCESS
    }
} 

export class FullMessage{
    timestamp; //Formatting of "mm/dd/yy hh:mm" 
    message_id; //Still to determine if unique to within a Chat or not
    message_content;
    player_name;

    constructor(content, name_of_player){
        //Get the current time right now (in local time) in following format:
        //"MM/DD/YYYY, HH:MM AM/PM"
        var date = new Date();
        this.timestamp = date.toLocaleString('en-US', {
                            timeZone: 'CST',
                            dateStyle: 'short',
                            timeStyle: 'short',
                        })
        //this.message_id = -1 //Default value for ID, nothing should happen here
        this.message_content = content
        this.player_name = name_of_player
    }

    getTimestamp(){
        return this.timestamp;
    }
    getMessageContent(){
        return this.message_content;
    }
    getMessageID(){
        return this.message_id;
    }
    getPlayerName(){
        return this.player_name;
    }
    setMessageID(id_to_set){
        this.message_id = id_to_set;
        return SUCCESS;
    }

    printMessage(){
        //Prints out in following format: "MM/DD/YYYY HH:MM AM/PM <Message content>"
        //let time = this.timestamp;
        let msg = this.message_content;
        //console.log(time.concat(" ", msg));
        console.log(msg)
        return SUCCESS;
    }

}