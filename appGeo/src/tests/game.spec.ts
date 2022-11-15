
// QUnit.test("Game Constructors and Basic Getters and Setters", function(assert) {
//     const now = new Date();
//     const next_week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

//     const test_map = new GeoMafMap();

//     const Location1 = new Location(1);

//     const player1 = new Player(1, 'player1', Location1, ALIVE); 
//     const player2 = new Player(1, 'player2', Location1, ALIVE);
//     const player3 = new Player(1, 'player3', Location1, ALIVE);
//     const player4 = new Player(1, 'player4', Location1, ALIVE);
//     const player5 = new Player(1, 'player4', Location1, ALIVE);
//     const playerArray = [player1, player2, player3, player4, player5];

//     const game1 = new Game(next_week, test_map);
//     assert_false(game1.isGameActive(), "New game is not active");
//     assert_equal(game1.getEndDate(), next_week, "End date is set time");
//     assert_equal(game1.getCurrentGameTime(), now, "Current game time updates over time");
//     assert_equal(game1.getMap(), test_map, "Map has been set properly");

//     const three_days_from_now = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
//     const test_map2 = new GeoMafMap();

//     assert_equal(game1.setEndDate(three_days_from_now), SUCCESS, "End date successfully set");
//     assert_equal(game1.getMap(test_map2), SUCCESS, "New map successfully set");

//     assert_equal(game1.getEndDate(), three_days_from_now, "End date is new set time");
//     assert_equal(game1.getMap(), test_map2, "Map has been set properly");

//     const game2 = new Game(playerArray, next_week, test_map);
//     assert_equal(game2.getPlayers(), playerArray, "game players set properly in constructor");
//     assert_false(game2.isGameActive(), "New game is not active");
//     assert_equal(game2.getEndDate(), next_week, "End date is set time");
//     assert_equal(game2.getCurrentGameTime(), now, "Current game time updates over time");
//     assert_equal(game2.getMap(), test_map, "Map has been set properly");

//     game1.start();

//     assert_true(game1.isGameActive(), "Game reads as active after start");

// }

// QUnit.test("Game Hashtable Handling", function(assert) {
//     onst now = new Date();
//     const next_week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

//     const test_map = new GeoMafMap();

//     const Location1 = new Location(1);

//     const player1 = new Player(1, 'player1', Location1, ALIVE); 
//     const player2 = new Player(1, 'player2', Location1, ALIVE);
//     const player3 = new Player(1, 'player3', Location1, ALIVE);
//     const player4 = new Player(1, 'player4', Location1, ALIVE);
//     const player5 = new Player(1, 'player5', Location1, ALIVE);
//     const playerArray = [player1, player2, player3];

//     const game1 = new Game(playerArray, next_week, test_map);
//     assert_equal(game1.getPlayers(), playerArray, "game players set properly in constructor");
    
//     assert_equal(game1.addPlayer(player4), SUCCESS, "Player added successfully");
//     playerArray.push(player4);
//     assert_equal(game1.getPlayers(), playerArray, "players list successfully updated");
//     assert_equal(game1.getPlayer(player4.getPlayerID()), player4, "Can get player from list");
//     assert_equal(game1.addPlayer(player5), SUCCESS, "Player added successfully");
//     playerArray.push(player5);
//     assert_equal(game1.getPlayers(), playerArray, "players list successfully updated");

//     assert_equal(game1.removePlayer(player5.getPlayerID()), player5, "Player removed successfully");
//     playerArray.pop();
//     assert_equal(game1.getPlayers(), playerArray, "players list successfully updated");

//     assert_equal(game1.getPlayer(player5.getPlayerID()), "", "A lack of player should return failure");

//     const snap1 = new GMSnapshot();
//     const snap2 = new GMSnapshot();
//     const snap3 = new GMSnapshot();

//     const snapArray = [snap1];

//     assert_equal(game1.addSnapshot(snap1), SUCCESS, "Snapshot added successfully");
//     assert_equal(game1.getSnapshots(), snapArray, "Snap list successfully updated");
//     assert_equal(game1.getSnapshot(snap1.getSnapshotID()), snap1, "Can successfully get snapshot");

//     assert_equal(game1.addSnapshot(snap2), SUCCESS, "Snapshot added successfully");
//     snapArray.push(snap2);
//     assert_equal(game1.getSnapshots(), snapArray, "Snap list successfully updated");
//     assert_equal(game1.getSnapshot(snap2.getSnapshotID()), snap2, "Can successfully get snapshot");

//     assert_equal(game1.addSnapshot(snap3), SUCCESS, "Snapshot added successfully");
//     snapArray.push(snap3);
//     assert_equal(game1.getSnapshots(), snapArray, "Snap list successfully updated");

//     assert_equal(game1.getSnapshot(snap3.getSnapshotID()), snap3, "Can successfully get snapshot");

//     assert_equal(game1.removeSnapshot(snap3.getSnapshotID()), snap3, "Can successfully remove snapshot");
//     snapArray.pop();
//     assert_equal(game1.getSnapshots(), snapArray, "Snap list successfully updated");

//     assert_equal(game1.getSnapshot(snap3.getSnapshotID()), "", "A lack of snapshot should return failure");

//     const chat1 = new GMChat();
//     const chat2 = new GMChat();
//     const chat3 = new GMChat();

//     const chatArray = [chat1];

//     assert_equal(game1.addChat(chat1), SUCCESS, "Chat added successfully");
//     assert_equal(game1.getChats(), chatArray, "chat list successfully updated");
//     assert_equal(game1.getChat(chat1.getChatID()), chat1, "Can successfully get Chat");

//     assert_equal(game1.addChat(chat2), SUCCESS, "Chat added successfully");
//     chatArray.push(chat2);
//     assert_equal(game1.getChats(), chatArray, "chat list successfully updated");
//     assert_equal(game1.getChat(chat2.getChatID()), chat2, "Can successfully get Chat");

//     assert_equal(game1.addChat(chat3), SUCCESS, "Chat added successfully");
//     chatArray.push(chat3);
//     assert_equal(game1.getChats(), chatArray, "chat list successfully updated");

//     assert_equal(game1.getChat(chat3.getChatID()), chat3, "Can successfully get Chat");

//     assert_equal(game1.removeChat(chat3.getChatID()), chat3, "Can successfully remove Chat");
//     chatArray.pop();
//     assert_equal(game1.getChats(), chatArray, "chat list successfully updated");

//     assert_equal(game1.getChat(chat3.getChatID()), "", "A lack of Chat should return failure");


// }

// QUnit.test("Game Start and End", function(assert) {
//     const now = new Date();
//     const next_week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

//     const test_map = new GeoMafMap();

//     const Location1 = new Location(1);

//     const Location1 = new Location(1);

//     const player1 = new Player(1, 'player1', Location1, ALIVE); 
//     const player2 = new Player(1, 'player2', Location1, ALIVE);
//     const player3 = new Player(1, 'player3', Location1, ALIVE);

//     playerArray = [player1, player2, player3];

//     const test_game = new Game(playerArray, next_week, test_map);

//     assert_equal(test_game.start(), FAILURE, "Game cannot start with too few players");
//     assert_false(game1.isGameActive(), "Unstarted game is not active");
//     assert_equal(test_game.end(),FAILURE, "Unstarted game cannot end");
//     assert_false(game1.isGameActive(), "Unstarted game is not active");

//     const player4 = new Player(1, 'player4', Location1, ALIVE);
//     const player5 = new Player(1, 'player5', Location1, ALIVE);

//     test_game.add(player4);
//     test_game.add(player5);

//     assert_equal(test_game.getPlayerCount(), 3, "Can count players outside of game");
//     assert_equal(test_game.getRoleCount(CIVILIAN), 0, "No role assigned, no civilians");
//     assert_equal(test_game.getRoleCount(KILLER), 0, "No role assigned, no killers");

//     assert_equal(test_game.getFractionRole(CIVILIAN), 0, "No role assigned, no civilians");
//     assert_equal(test_game.getFractionRole(KILLER), 0, "No role assigned, no killers");

//     assert_equal(test_game.end(),FAILURE, "Unstarted game cannot end");
//     assert_false(test_game.isGameActive(), "Unstarted game is not active");

//     assert_equal(test_game.start(), SUCCESS, "Game can start with five or more players");
//     assert_true(test_game.isGameActive(), "Started game is active");

//     assert_equal(test_game.getPlayerCount(), 5, "Can count players in game");
//     assert_equal(test_game.getRoleCount(CIVILIAN), 3, "Should start game with 3 civilians");
//     assert_equal(test_game.getRoleCount(KILLER), 1, "Should start game with 1 killer");

//     assert_equal(test_game.getFractionRole(CIVILIAN), 0.8, "Should be 80% civilians");
//     assert_equal(test_game.getFractionRole(KILLER), 0.2, "Should be 20% killers");

//     assert_equal(test_game.end(), SUCCESS, "Can stop a game");
//     assert_false(test_game.isGameActive(), "Stopped game is not active");

//     playerArray.push(player4);
//     playerArray.push(player5);

//     const soon = new Date(now.getTime() + 1000);

//     const test_game2 = new Game(playerArray, next_week, test_map);
//     assert_equal(test_game.start(), SUCCESS, "Game can start with five or more players");

//     //should delay by 1 second, need to write this in

//     assert_false(test_game.isGameActive(), "Stopped game is not active");

// }

// QUnit.test("Players remaining plus no killers", function(assert) {
//     const now = new Date();
//     const next_week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

//     const test_map = new CampusMap();

//     const Location1 = new Location(1);

//     const player1 = new Player(1, 'player1', Location1, ALIVE); 
//     const player2 = new Player(2, 'player2', Location1, ALIVE);
//     const player3 = new Player(3, 'player3', Location1, ALIVE);

//     const playerArray = [player1, player2, player3];
//     const player_map = new Map(
//         playerArray.map(object => {
//           return [object.getUserID(), object];
//         }),
//       );

//     const test_game = new Game(next_week, test_map, player_map);

//     const remaining_players = test_game.playersRemaining();
//     const remaining_civilians = test_game.civiliansRemaining();
//     const remaining_killers = test_game.killersRemaining();
//     assert.equal(remaining_players, 3);
//     assert.equal(remaining_civilians, 3);
//     assert.equal(remaining_killers, 0);

//     //Kill off Player 1
//     player1.getKilled();
//     assert.equal(player1.getAliveStatus(), DEAD);
//     assert.equal(player2.getAliveStatus(), ALIVE);
//     assert.equal(player3.getAliveStatus(), ALIVE);

//     const new_remaining_civilians = test_game.civiliansRemaining();
//     assert.equal(new_remaining_civilians, 2);

//     const winning_con = test_game.winningCondition();
//     assert.equal(winning_con, CIVILIAN);
// });

// QUnit.test("Players remainding + Killers win", function(assert) {
//     const now = new Date();
//     const next_week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

//     const test_map = new CampusMap();

//     const Location1 = new Location(1);

//     const player1 = new Player(1, 'player1', Location1, ALIVE); 
//     const player2 = new Player(2, 'player2', Location1, ALIVE);
//     const player3 = new Killer(3, 'player3', Location1, ALIVE);

//     const playerArray = [player1, player2, player3];
//     const player_map = new Map(
//         playerArray.map(object => {
//           return [object.getUserID(), object];
//         }),
//       );

//     const test_game = new Game(next_week, test_map, player_map);

//     const remaining_players = test_game.playersRemaining();
//     const remaining_civilians = test_game.civiliansRemaining();
//     const remaining_killers = test_game.killersRemaining();
//     assert.equal(remaining_players, 3);
//     assert.equal(remaining_civilians, 2);
//     assert.equal(remaining_killers, 1);

//     //Kill off Player 1
//     player1.getKilled();
//     player2.getKilled();
//     assert.equal(player1.getAliveStatus(), DEAD);
//     assert.equal(player2.getAliveStatus(), DEAD);
//     assert.equal(player3.getAliveStatus(), ALIVE);

//     const new_remaining_civilians = test_game.civiliansRemaining();
//     assert.equal(new_remaining_civilians, 0);

//     const winning_con = test_game.winningCondition();
//     assert.equal(winning_con, KILLER);
// });

// QUnit.test("Players remainding + Game in Progress", function(assert) {
//     const now = new Date();
//     const next_week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

//     const test_map = new CampusMap();

//     const Location1 = new Location(1);

//     const player1 = new Player(1, 'player1', Location1, ALIVE); 
//     const player2 = new Player(2, 'player2', Location1, ALIVE);
//     const player3 = new Killer(3, 'player3', Location1, ALIVE);

//     const playerArray = [player1, player2, player3];
//     const player_map = new Map(
//         playerArray.map(object => {
//           return [object.getUserID(), object];
//         }),
//       );

//     const test_game = new Game(next_week, test_map, player_map);

//     const remaining_players = test_game.playersRemaining();
//     const remaining_civilians = test_game.civiliansRemaining();
//     const remaining_killers = test_game.killersRemaining();
//     assert.equal(remaining_players, 3);
//     assert.equal(remaining_civilians, 2);
//     assert.equal(remaining_killers, 1);

//     //Kill off Player 1
//     player1.getKilled();
//     assert.equal(player1.getAliveStatus(), DEAD);
//     assert.equal(player2.getAliveStatus(), ALIVE);
//     assert.equal(player3.getAliveStatus(), ALIVE);

//     const new_remaining_civilians = test_game.civiliansRemaining();
//     const new_remaining_killers = test_game.killersRemaining();
//     assert.equal(new_remaining_civilians, 1);
//     assert.equal(new_remaining_killers, 1);

//     const winning_con = test_game.winningCondition();
//     assert.equal(winning_con, INPROGRESS);
// });

