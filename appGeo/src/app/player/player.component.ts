import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { InjectableAnimationEngine } from '@nativescript/angular';
import { ChangeType } from '@nativescript/core';
import { Bubble } from '../map/map.component';
import {Chat, FullMessage} from '../chat/chat.component'
import { databaseAdd, databaseUpdate } from '../../modules/database'
//import{Location} from './location_class_declaration';

const DEAD = 0
const ALIVE = 1
const DAILYMAXKILLCOUNT = 2
const SUCCESS = 10
const FAILURE = -10

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})


export class Player implements OnInit{
    userID: number // An int
    username: string // A String
    //geolocation // Object that is retunred from the Nativescript plugin
    location // A Coordinate Object
    alive: number // A Boolean
    votes: number // An int
    chat_lists // List of Chat Objects that Player is a part of
    isAdmin : boolean // boolean whether this player is an admin (as in responsible for running the game start function)
    
    
    //edited by Kyu
    email: string;
    userIDString: string //String (modified by Kyu)

    have_already_voted: boolean = false

    databasePath: string


    constructor(){
        //edited by Kyu
        this.userIDString = "";
        this.username = "";
        this.email = "";
        this.votes = 0;
        this.chat_lists = new Array();
        this.databasePath = "";
        this.isAdmin = false;
        
    }
    //init(userID: number, userIDString: string, username: string, email:string, location, alive: number){
    init(userID: number, username: string, location, alive: number){
        /* NOTE: we may not even need location anymore. After setting up geolocation
         * we should be able to just use this as well as get functions (getLongitue &
         * getLatitue) throughout rest of code. May need to refactor this part
         * SIDENOTE: Since other teams may use the field "location", maybe just delete current
         *           location and rename "geolocatoin" as new location
        */
        //this.geolocation = Location();
        this.userID = userID;
        this.username = username;
        this.location = location;
        this.alive = alive;
        //this.votes = 0;
        //this.chat_lists = new Array()
    }
    ngOnInit(): void {
    }

    getDatabasePath(){
        return this.databasePath;
    }
    
    getUserID(){
        return this.userID;
    }
    getUsername(){
        return this.username;
    }
    setLocation(latitude, longitude){
        this.location = new Location(latitude, longitude)
        databaseUpdate(this.databasePath, this);
    }
    getAliveStatus(){
        return this.alive;
    }
    getVotes(){
        return this.votes;
    }
    getChatList(){
        return this.chat_lists;
    }
    getLocation(){
        return this.location;
    }
    /* getChat: Function that returns the Chat object corresponding to chatID */
    getChat(chatID){
        for(var i = 0; i < this.chat_lists.length; i++){
            var curr_chat = this.chat_lists[i]
            if (curr_chat.getChatID() == chatID)
                return this.chat_lists[i];
        }
        // In case that accessing an unavailable chat
        return null
    }

    getKilled(){
        this.alive = DEAD;
        // update in database
        databaseUpdate(this.databasePath, this);
        return SUCCESS;
    }

    // takeSnapshot(){
    //     const scene_capture = new Snapshot() //Create a Snapshot object
    //     // Note: Snapshot class not done yet, will want some function to add
    //     // all information required for a snapshot
    //     if (scene_capture == 1){
    //         return SUCCESS;
    //     }
    //     return FAILURE;
    // }

    // openSnapshot(Snapshot){
    //     const open = Snapshot.view();
    //     if (open == 1) {
    //         return SUCCESS;
    //     }
    //     return FAILURE;
    // }

    seePeopleInBubble(All_players: Player[]){
        // Take in as input list of all players in Game
        // The hash table maps each player's userID to the player's location
        var player_list = new Array();
        // Sift through Hash Table and find nearby players
        for (var i in All_players) {
            var curr_player = All_players[i];
            if (curr_player.getLocation() == this.location && curr_player.getAliveStatus() != DEAD) {
                player_list.push(All_players[i]);
            }
        }
        return player_list;
    }

    openChat(chat){
        const open = chat.view()
        if (open == 1) {
            return SUCCESS;
        }
        return FAILURE;
    }

    /* sendChatMessage: Insert a message that Player wants to send into a Chat
     * Input:
     *      - chatID: A chatID representing the Chat Object that should be modified
     *      - message: The string that the Player wants to send in chat
    */
    sendChatMessage(chatID, message){

        var main_chat = this.getChat(chatID);

        if (this.getAliveStatus() == DEAD || main_chat == null){
            return FAILURE;
        } 

        const msg = new FullMessage(message, this.username);
        const sent = main_chat.insertMessage(msg);
        if (sent == SUCCESS) {
            return SUCCESS;
        }
        else {
            console.log("error occured during when inserting new message into Chat");
            return FAILURE;
        }
    }

    /* insertChat(): Inserts a Chat object into the Chat List field within Player Object */
    insertChat(chat){
        this.chat_lists.push(chat)
        // update in database
        databaseUpdate(this.databasePath, this);
        return SUCCESS;
    }

    /* display: Function that displays all messages in a specific Chat
     * Input:
     *      - chatID: The chat we are interseted in accessing
     * Output: Print out for Player all the message contents
    */
    display(chatID){
        //First, retrieve the Chat Object interested in
        var main_chat = this.getChat(chatID);

        //Secondly, get list of messages from the Chat 
        var messages_list = main_chat.history();

        //Lastly, loop through list of messages and display
        for (var i = 0; i < messages_list.length; i++){
            var curr_msg = messages_list[i];
            curr_msg.printMessage();
        }

        return SUCCESS;
    }

    /* voteForExecution(): Let current player vote for _another_ player to be executed
     * Input: 
     *      - A Player ID that will get looked up on the main General Chat 
    */
    voteForExecution(voted_player_ID){
        //Can't vote if you are dead OR if you have already voted in this round
        if (this.getAliveStatus() == DEAD || this.have_already_voted == true){
            return FAILURE;
        }

        var main_chat = this.getChat(1) //Which a player should always be added to General Chat
        var Voted = main_chat.getPlayer(voted_player_ID) //Which a player would never pick a user ID that isn't present in the chat
        Voted.increaseVoteCount();

        this.have_already_voted = true;
        databaseUpdate(this.databasePath, this)
        return SUCCESS;
    }

    /* increaseVoteCount(): Increase current Player's number of votes
     * Note: This function added for privacy concersn (don't want other players
     * directly modifying the field of another player)
    */
    increaseVoteCount(){
        this.votes++;
        // update in database
        databaseUpdate(this.databasePath, this);
    }

    /* resetVotes(): Reset current Player's number of votes back down to 0
     * Note: This will be called at the end of each day / in vote process logic
    */
    resetVotes(){
        this.votes = 0;
        this.have_already_voted = false;
        // update in database
        databaseUpdate(this.databasePath, this);
    }

}

export class Civilian extends Player{
    /* Currently will be just the same as Player Superclass, however this info
    may change when implementing chat feature or in the future */
    constructor(){
      super()
    }
    init(userID: number, username: string, location, alive: number){
        /* NOTE: we may not even need location anymore. After setting up geolocation
         * we should be able to just use this as well as get functions (getLongitue &
         * getLatitue) throughout rest of code. May need to refactor this part
         * SIDENOTE: Since other teams may use the field "location", maybe just delete current
         *           location and rename "geolocatoin" as new location
        */
        //this.geolocation = Location();
        this.userID = userID;
        this.username = username;
        this.location = location;
        this.alive = alive;
        this.votes = 0;
        this.chat_lists = new Array()
    }
}

export class Killer extends Player{
    //Define some maximum amount of kills per day
    max_daily_kill_count //An integer
    remaining_daily_kill_count //An integer
    total_kill_count //An integer

    constructor(){
      super();
    }

    init(userID, username, location, alive){
                /* NOTE: we may not even need location anymore. After setting up geolocation
         * we should be able to just use this as well as get functions (getLongitue &
         * getLatitue) throughout rest of code. May need to refactor this part
         * SIDENOTE: Since other teams may use the field "location", maybe just delete current
         *           location and rename "geolocatoin" as new location
        */
        //this.geolocation = Location();
        this.userID = userID;
        this.username = username;
        this.location = location;
        this.alive = alive;
        this.votes = 0;
        this.chat_lists = new Array()
        this.max_daily_kill_count = DAILYMAXKILLCOUNT;
        this.remaining_daily_kill_count = DAILYMAXKILLCOUNT;
        this.total_kill_count = 0;
    }

    getTotalKillCount(){
        return this.total_kill_count;
    }
    getRemainingDailyKillCount(){
        return this.remaining_daily_kill_count;
    }
    getMaxDailyKillCount(){
        return this.max_daily_kill_count;
    }

    /* killPlayer: Allows a killer to eliminate a Player from the game
     * Input: 
     *      -player_id: Player Object of whoever is about to be killed
     * 
    */
    killPlayer(player_to_be_killed){
        if (this.getRemainingDailyKillCount() > 0 && this.getAliveStatus() == ALIVE){
            // Killer has kills remaining, victim is in bubble and alive, can kill
            player_to_be_killed.getKilled();
            this.total_kill_count++;
            this.remaining_daily_kill_count--;
           return SUCCESS;
        } else {
            // Notify User in some way that they don't have any kills left for the day
            return FAILURE;
        }
    }

    // killPlayer(player_id, All_players){
    //     //Take in from Game Class Players hash table and remove player_id
    //     var people_can_be_killed = this.seePeopleInBubble(All_players)

    //     if (people_can_be_killed.includes(player_id) == false){
    //         // Then the person Killer attempted to kill is NOT in their own bubble
    //         // Invalid Move!
    //         return FAILURE;
    //     }
    //     if (this.getRemainingDailyKillCount() > 0 && this.getAliveStatus() == ALIVE){
    //         // Killer has kills remaining, victim is in bubble and alive, can kill
    //         player_id.getKilled();
    //         remove_from_hash(player_id, All_players);
    //         this.total_kill_count++;
    //         remaining_daily_kill_count--;
            
    //        return SUCCESS;
    //     } else {
    //         // Notify User in some way that they don't have any kills left for the day
    //         return FAILURE;
    //     }
    // }
}

export class Location{
    longitude;
    latitude;

    constructor(lontitude_to_set, latitude_to_set){
        this.longitude = lontitude_to_set;
        this.latitude = latitude_to_set;
    }
}