import{Message} from '../chat/chat_class_declaration.js';
import{Chat} from '../chat/chat_class_declaration.js';
import{Location} from './location_class_declaration.js';

const DEAD = 0
const ALIVE = 1
const DAILYMAXKILLCOUNT = 2
const SUCCESS = 10
const FAILURE = -10

export class Player{
    userID // An int
    username // A String
    geolocation // Object that is retunred from the Nativescript plugin
    location // A Coordinate Object
    alive // A Boolean
    votes // An int
    chat_lists // List of Chat Objects that Player is a part of

    constructor(userID, username, location, alive){
        /* NOTE: we may not even need location anymore. After setting up geolocation
         * we should be able to just use this as well as get functions (getLongitue &
         * getLatitue) throughout rest of code. May need to refactor this part
         * SIDENOTE: Since other teams may use the field "location", maybe just delete current
         *           location and rename "geolocatoin" as new location
        */
        this.geolocation = Location();
        this.userID = userID;
        this.username = username;
        this.location = location;
        this.alive = alive;
        this.votes = 0;
    }

    getUserID(){
        return this.userID;
    }
    getUsername(){
        return this.username;
    }
    getGeolocation(){
        return this.geolocation;
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
    /* getChat: Function that returns the Chat object corresponding to chatID */
    getChat(chatID){
        for(i = 0; i < this.chat_lists.length; i++){
            if (this.chat_lists[i].getChatID() == chatID)
                return this.chat_lists[i];
        }
        // In case that accessing an unavailable chat
        return null
    }

    getKilled(){
        this.alive = DEAD;
        return SUCCESS;
    }

    takeSnapshot(){
        const scene_capture = new Snapshot() //Create a Snapshot object
        // Note: Snapshot class not done yet, will want some function to add
        // all information required for a snapshot
        if (scene_capture == 1){
            return SUCCESS;
        }
        return FAILURE;
    }

    openSnapshot(Snapshot){
        const open = Snapshot.view();
        if (open == 1) {
            return SUCCESS;
        }
        return FAILURE;
    }

    seePeopleInBubble(All_players){
        // Take in as input hash table from Map Class of Players
        // The hash table maps each player's userID to the player's location
        player_list = [];
        // Sift through Hash Table and find nearby players
        for (var i in All_players) {
            if (All_players[i] = this.location) {
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

        main_chat = this.getChat(chatID);

        if (this.getAliveStatus() == DEAD || main_chat == null){
            return FAILURE;
        }

        const msg = new Message(message);
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
        return SUCCESS;
    }

    /* display: Function that displays all messages in a specific Chat
     * Input:
     *      - chatID: The chat we are interseted in accessing
     * Output: Print out for Player all the message contents
    */
    display(chatID){
        //First, retrieve the Chat Object interested in
        main_chat = this.getChat(chatID);

        //Secondly, get list of messages from the Chat
        messages_list = main_chat.history();

        //Lastly, loop through list of messages and display
        for (i = 0; i < messages_list.length; i++){
            curr_msg = messages_list[i];
            curr_msg.printMessage();
        }

        return SUCCESS;
    }

    /* voteForExecution(): Let current player vote for _another_ player to be executed
     * Input:
     *      - A Player ID that will get looked up on the main General Chat
    */
    voteForExecution(player){
        main_chat = this.getChat(1) //Which a player should always be added to General Chat
        Voted = main_chat.getPlayer(voted_player_ID) //Which a player would never pick a user ID that isn't present in the chat
        Voted.increaseVoteCount();
        return SUCCESS;
    }

    /* increaseVoteCount(): Increase current Player's number of votes
     * Note: This function added for privacy concersn (don't want other players
     * directly modifying the field of another player)
    */
    increaseVoteCount(){
        this.votes++;
    }

}

export class Civilian extends Player{
    /* Currently will be just the same as Player Superclass, however this info
    may change when implementing chat feature or in the future */
    constructor(userID, username, location, alive){
        super(userID, username, location, alive);
    }
}

export class Killer extends Player{
    //Define some maximum amount of kills per day
    max_daily_kill_count //An integer
    remaining_daily_kill_count //An integer
    total_kill_count //An integer

    constructor(userID, username, location, alive, votes){
        super(userID, username, location, alive, votes);
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
     *      -player_id: Player ID of whoever will be eliminated
     *      -All_players: Hash Table that contains all players
     *
    */
    killPlayer(player_id, All_players){
        //Take in from Game Class Players hash table and remove player_id
        people_can_be_killed = this.seePeopleInBubble(All_players)

        if (people_can_be_killed.includes(player_id) == false){
            // Then the person Killer attempted to kill is NOT in their own bubble
            // Invalid Move!
            return FAILURE;
        }
        if (this.getRemainingDailyKillCount() > 0 && this.getAliveStatus() == ALIVE){
            // Killer has kills remaining, victim is in bubble and alive, can kill
            player_id.getKilled();
            remove_from_hash(player_id, All_players);
            this.total_kill_count++;
            remaining_daily_kill_count--;

           return SUCCESS;
        } else {
            // Notify User in some way that they don't have any kills left for the day
            return FAILURE;
        }
    }
}
