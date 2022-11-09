import {Chat} from '../app/chat/chat_class_declaration.js';
import {Message} from '../app/chat/chat_class_declaration.js';
import {Player} from '../app/player/player_class_declaration.js';
import {Killer} from '../app/player/player_class_declaration.js';

QUnit.module("chat_tests");

const SUCCESS = 10
const FAILURE = -10
const DEAD = 0
const ALIVE = 1

const Message1 = new Message("Testing Message 1");
const Message2 = new Message("Testing Message 2");

const Chat1 = new Chat(1);
const Chat2 = new Chat(2);

export class Location{
    location // An int

    constructor(location){
        this.location = location
    }
}

const Location1 = new Location(1);
const Location2 = new Location(2);

const Player1 = new Player(1, 'player1', Location1, ALIVE);
const Player2 = new Player(2, 'player2', Location1, ALIVE); 
const Killer1 = new Killer(3, 'killer1', Location2, ALIVE); 

QUnit.test("Retrieving message_id when only initialized", assert => {
    assert.equal(Message1.getMessageID(), -1);
});

QUnit.test("retrieving message content", assert => {
    assert.equal(Message1.getMessageContent(), "Testing Message 1");
});

QUnit.test("Printing out a Message", assert => {
    assert.equal(Message1.printMessage(), SUCCESS);
});


QUnit.test("Retrieving LowerID for a Chat", assert => {
    assert.equal(Chat1.getLowerID(), 0);
});

QUnit.test("Retrieving Current ID for a Chat", assert => {
    assert.equal(Chat1.getCurrID(), 0);
});

QUnit.test("Retrieving Chat ID for a Chat", assert => {
    assert.equal(Chat1.getChatID(), 1);
});

QUnit.test("Retrieving Player List for an empty Chat", assert => {
    assert.equal(Chat1.getPlayerList(), []);
});

//----------------------- Now Test doing actions to the Chat ------------------ 

QUnit.test("Inserting Player1 into Chat1", assert => {
    assert.equal(Chat1.insertPlayer(Player1), SUCCESS);
    assert.equal(Chat1.getPlayerList(), [Player1]);
    assert.equal(Player1.getChatList(), [Chat1]);
    assert.equal(Player1.getChat(1), Chat1);

    //Since have added Player1 object, should be able to retrieve with getPlayer(1)
    assert.equal(Chat1.getPlayer(1), Player1);

    //Haven't added Player2 yet, so shouldn't be able to retrieve 
    assert.equal(Chat1.getPlayer(2), null);
});

QUnit.test("Player1 sends a message to Chat1", assert => {
    assert.equal(Player1.sendChatMessage(1, "First Message Sent"), SUCCESS);
    var msg_list = Chat1.history();
    assert.equal(msg_list.length, 1)
    assert.equal(msg_list[1].getMessageContent(), "First Message Sent")
});

QUnit.test("Add Player2 into Chat 1 and see if can see the message previously sent", assert => {
    assert.equal(Chat1.insertPlayer(Player2), SUCCESS);
    assert.equal(Chat1.getPlayerList(), [Player1, Player2]);
    assert.equal(Player2.getChatList(), [Chat1]);
    assert.eequal(Player2.getChat(1), Chat1);
    //The Chat Objects that are returned by both Player 2 and Player 1 _should_ be the same
    assert.equal(Player2.getChat(1), Player1.getChat(1));
    var msg_list_for_Player2 = Player2.getChat(1).history();
    assert.equal(msg_list_for_Player2.length, 1);
    assert.equal(msg_list_for_Player2[1].getMessageContent(), "First Message Sent");
});

QUnit.test("Inserting messages into Chat2", assert => {
    assert.equal(Chat2.insertMessage(Message2), SUCCESS);
    var msg_list = Chat2.history();
    assert.equal(msg_list.length, 1);
    assert.equal(msg_list[1].getMessageContent(), "Testing Message 2");
    //Ensure that the Message ID was set when being inserted into the Chat and
    //is no longer the default value
    assert.equal(msg_list[1].getMessageID(), 0);
});

/* The followin test would show how the general Game Logic would play out! */
QUnit.test("Begin a Vote in Chat 1 with Player 1 & 2; and Killer 1", assert => {
    Chat1.insertPlayer(Killer1);
    var player_list = Chat1.getPlayerList();
    assert.equal(player_list.length, 3);

    //Before Sending out the Vote Commence
    var msg_list_before = Chat1.history();
    assert.equal(msg_list_before.length, 1)

    //Send out the Vote Commence
    assert.equal(Chat1.voteCommence(), SUCCESS);

    //After Sending out the Vote Commence
    var msg_list_after = Chat1.history();
    assert.equal(msg_list_after.length, 2);

    Player1.voteForExecution(3);
    assert.equal(Killer1.getVotes(), 1);

    Player2.voteForExecution(3);
    assert.equal(Killer1.getVotes(), 2);

    Killer1.voteForExecution(1);
    assert.equal(Killer1.getVotes(), 1);

    //Killer 1 has been successfully voted off!!! -------------->>>>>>>>>>>>>>>
    assert.equal(Killer1.getKilled(), SUCCESS);
    assert.equal(Killer1.getAliveStatus(), DEAD);

    //Killer 1 should no longer be able to send messages
    assert.equal(Killer1.sendChatMessage(1, "This should never be sent"), FAILURE);
    var after_msg_list = Chat1.history();
    assert.equal(after_msg_list.length, 2)
});


