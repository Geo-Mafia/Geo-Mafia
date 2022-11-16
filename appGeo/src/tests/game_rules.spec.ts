import { GameRules, SUCCESS, FAILURE } from '~/app/game/game-rules.component';

QUnit.test("Constructor and Setting", function(assert) {
    const gameRule = new GameRules();

    assert.true(gameRule.isScheduledEnd(), "Scheduled End is true by default")
    assert.true(gameRule.isWipeoutEnd(), "Wipeout End is true by default")
    assert.false(gameRule.isTestingOverrule(), "Testing Overrule is true by default")

    assert.equal(gameRule.getMinPlayers(), 5, "Default min players is 5")
    assert.equal(gameRule.getFractionKillers(), 0.2, "Default fraction killers is 0.2")
    assert.equal(gameRule.getGameLengthHours(), 168, "Default game length is one week")
    assert.equal(gameRule.getDayCycleLength(), 1440, "Default game cycle is 24 hours")
    assert.equal(gameRule.getSafeLength(), 480, "Default safe period is 8 hours")
    assert.equal(gameRule.getVoteLength(), 60, "Default vote period is 1 hour")
    assert.equal(gameRule.getVoteTime, 960, "Default vote time is 16 hours into game")
    assert.equal(gameRule.getMaxSoloKill, 1, "Default maximum kills per day by a killer is 1")
    assert.equal(gameRule.getMaxGlobalKill, Infinity, "Default maximum kills per day overall is infinity")

    assert.equal(gameRule.setGameDurations(1500, 250, 125, 125), SUCCESS, "Can set game durations to minimum relations")
    assert.equal(gameRule.setGameDurations(600, 100, 50, 50), FAILURE, "Cannot set too small a game length")
    assert.equal(gameRule.setGameDurations(1500, 500, 50, 50), FAILURE, "Cannot set day cycle longer than 1/6 of game length")
    assert.equal(gameRule.setGameDurations(1500, 100, 75, 50), FAILURE, "Cannot set safe time longer than 1/2 of day cycle")
    assert.equal(gameRule.setGameDurations(1500, 100, 50, 51), FAILURE, "Cannot set vote time longer than safe time")

    assert.equal(gameRule.gameLength, 1500, "game length sets correctly")
    assert.equal(gameRule.dayCycleLength, 250, "game cycle sets correctly")
    assert.equal(gameRule.safeLength, 125, "safe period sets correctly")
    assert.equal(gameRule.voteLength, 125, "vote period sets correctly")

    assert.equal(gameRule.setMinPlayers(10), SUCCESS, "Can set larger min players")
    assert.equal(gameRule.setMinPlayers(4), FAILURE, "Cannot set min players smaller than 5")
    assert.equal(gameRule.getMinPlayers(), 10, "Set min players updates")

    assert.equal(gameRule.setFractionKillers(0.4), SUCCESS, "Can change killer frac")
    assert.equal(gameRule.setFractionKillers(0.1), FAILURE, "Cannot set min players smaller than 0.2")
    assert.equal(gameRule.setFractionKillers(1.1), FAILURE, "Cannot set min players bigger than 1")
    assert.equal(gameRule.getFractionKillers(), 0.4, "Killer fraciton updates correctly")

}

);