import {Chat, FullMessage} from '../app/chat/chat.component';
import {Player, Killer} from '../app/player/player.component';

QUnit.module("chat_tests");

//--------IMPORTANT: .length returns 1 higher than the highest index!!!--------


const SUCCESS = 10
const FAILURE = -10
const DEAD = 0
const ALIVE = 1

export class Location{
    location // An int

    constructor(location){
        this.location = location
    }
}

const Location1 = new Location(1);
const Location2 = new Location(2);

const Player1 = new Player();
Player1.init(1, 'player1', Location1, ALIVE);
const Player2 = new Player()
Player2.init(2, 'player2', Location1, ALIVE);
const Killer1 = new Killer()
Killer1.init(3, 'killer1', Location2, ALIVE); 

const Message1 = new FullMessage("Testing FullMessage 1", Player1.getUsername());
const Message2 = new FullMessage("Testing FullMessage 2", Player2.getUsername());

const Chat1 = new Chat(1);
const Chat2 = new Chat(2);


QUnit.test("Retrieving message_id when only initialized", assert => {
    assert.equal(Message1.getMessageID(), -1, "When first initialized ID only -1");
});

QUnit.test("retrieving message content", assert => {
    assert.equal(Message1.getMessageContent(), "Testing FullMessage 1");
});

QUnit.test("Printing out a FullMessage", assert => {
    assert.equal(Message1.printMessage(), SUCCESS, "Printing message is SUCCESS");
});


QUnit.test("Retrieving LowerID for a Chat", assert => {
    assert.equal(Chat1.getLowerID(), 0, "Lower ID of a chat is 0");
});

QUnit.test("Retrieving Current ID for a Chat", assert => {
    assert.equal(Chat1.getCurrID(), 0, "Current ID for a chat is 0");
});

QUnit.test("Retrieving Chat ID for a Chat", assert => {
    assert.equal(Chat1.getChatID(), 1, "First Chat is ID 1");
});

QUnit.test("Retrieving Player List for an empty Chat", assert => {
    assert.equal(Chat1.getPlayerList().length, 0, "There is no players yet in the Player List");
});

QUnit.test("Retrieving Player Name for a message sent", assert => {
    assert.equal(Message1.getPlayerName(), 'player1', "There is no players yet in the Player List");
});

//----------------------- Now Test doing actions to the Chat ------------------ 

QUnit.test("Inserting Player1 into Chat1", assert => {
    assert.equal(Chat1.insertPlayer(Player1), SUCCESS, "inserted player successfully");
    var chat1_players = Chat1.getPlayerList();
    var chat1_player1 = chat1_players[0];
    assert.equal(chat1_player1.getUserID(), Player1.getUserID(), "Found the player 1 through chat functions");

    var player1_chats = Player1.getChatList();
    var player1_chat1 = player1_chats[0]
    assert.equal(player1_chat1.getChatID(), Chat1.getChatID(), "Found chat information from Player info only");

    //Since have added Player1 object, should be able to retrieve with getPlayer(1)
    var player_found = Chat1.getPlayer(1);
    assert.equal(player_found.getUserID(), Player1.getUserID(), "Get a player from the chat");

    //Haven't added Player2 yet, so shouldn't be able to retrieve 
    assert.equal(Chat1.getPlayer(2), null), "Retrieve player not added yet into a Chat";
});

QUnit.test("Player1 sends a message to Chat1", assert => {
    assert.equal(Player1.sendChatMessage(1, "First FullMessage Sent"), SUCCESS);
    var msg_list = Chat1.history();
    var msg1 = msg_list[0]
    assert.equal(msg_list.length, 2, "After sending 1st message check length")
    assert.equal(msg1.getMessageContent(), "First FullMessage Sent")
});

QUnit.test("Add Player2 into Chat 1 and see if can see the message previously sent", assert => {
    assert.equal(Chat1.insertPlayer(Player2), SUCCESS);
    //The Chat Objects that are returned by both Player 2 and Player 1 _should_ be the same
    var player2_chat = Player2.getChat(1);
    var player1_chat = Player1.getChat(1);
    assert.equal(player2_chat.getChatID(), player1_chat.getChatID(), "Get player 2 through player1's chat");

    var msg_list_for_Player2 = player2_chat.history();
    assert.equal(msg_list_for_Player2.length, 2);
    assert.equal(msg_list_for_Player2[0].getMessageContent(), "First FullMessage Sent");
});

QUnit.test("Inserting messages into Chat2", assert => {
    assert.equal(Chat2.insertMessage(Message2), SUCCESS);
    var msg_list = Chat2.history();
    assert.equal(msg_list.length, 2);
    assert.equal(msg_list[0].getMessageContent(), "Testing FullMessage 2");
    //Ensure that the FullMessage ID was set when being inserted into the Chat and
    //is no longer the default value
    assert.equal(msg_list[0].getMessageID(), 0, "FullMessage should no longer have ID of -1");
});

/* The followin test would show how the general Game Logic would play out! */
QUnit.test("Begin a Vote in Chat 1 with Player 1 & 2; and Killer 1", assert => {
    Chat1.insertPlayer(Killer1);
    var player_list = Chat1.getPlayerList();
    assert.equal(player_list.length, 3, "There are three players at the start");

    //Before Sending out the Vote Commence
    var msg_list_before = Chat1.history();
    assert.equal(msg_list_before.length, 2, "There should be a message from prior")

    //Send out the Vote Commence
    assert.equal(Chat1.voteCommence(), SUCCESS);

    //After Sending out the Vote Commence
    var msg_list_after = Chat1.history();
    assert.equal(msg_list_after.length, 3, "After starting vote sequence, there is a new message");

    Player1.voteForExecution(3);
    assert.equal(Killer1.getVotes(), 1, "Player 1 voted for Killer");

    Player2.voteForExecution(3);
    assert.equal(Killer1.getVotes(), 2, "Player 2 voted for killer");

    Killer1.voteForExecution(1);
    assert.equal(Player1.getVotes(), 1, "Killer voted for Player1");

    //Killer 1 has been successfully voted off!!! -------------->>>>>>>>>>>>>>>
    assert.equal(Killer1.getKilled(), SUCCESS, "Killer has been killed off by votes");
    assert.equal(Killer1.getAliveStatus(), DEAD, "Killer has indeed been confirmed killed");

    //Killer 1 should no longer be able to send messages
    assert.equal(Killer1.sendChatMessage(1, "This should never be sent"), FAILURE, "Dead cannot send message");
    var after_msg_list = Chat1.history();
    assert.equal(after_msg_list.length, 3, "We still have the same number of messages as before")
});


