import { GameRules, SUCCESS, FAILURE } from '~/app/game/game-rules.component';

QUnit.module("Game Rule Tests")

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
    assert.equal(gameRule.getVoteTime(), 960, "Default vote time is 16 hours into game")
    assert.equal(gameRule.getMaxSoloKill(), 1, "Default maximum kills per day by a killer is 1")
    assert.equal(gameRule.getMaxGlobalKill(), Infinity, "Default maximum kills per day overall is infinity")

    assert.equal(gameRule.setGameDurations(1500, 250, 125, 125), SUCCESS, "Can set game durations to minimum relations")
    assert.equal(gameRule.setGameDurations(600, 100, 50, 50), FAILURE, "Cannot set too small a game length")
    assert.equal(gameRule.setGameDurations(1600, 500, 50, 50), FAILURE, "Cannot set day cycle longer than 1/6 of game length")
    assert.equal(gameRule.setGameDurations(1600, 100, 75, 50), FAILURE, "Cannot set safe time longer than 1/2 of day cycle")
    assert.equal(gameRule.setGameDurations(1600, 100, 50, 51), FAILURE, "Cannot set vote time longer than safe time")

    assert.equal(gameRule.getGameLength(), 1500, "game length sets correctly")
    assert.equal(gameRule.getDayCycleLength(), 250, "game cycle sets correctly")
    assert.equal(gameRule.getSafeLength(), 125, "safe period sets correctly")
    assert.equal(gameRule.getVoteLength(), 125, "vote period sets correctly")

    assert.equal(gameRule.setMinPlayers(10), SUCCESS, "Can set larger min players")
    assert.equal(gameRule.setMinPlayers(4), FAILURE, "Cannot set min players smaller than 5")
    assert.equal(gameRule.getMinPlayers(), 10, "Set min players updates")

    assert.equal(gameRule.setFractionKillers(0.4), SUCCESS, "Can change killer frac")
    assert.equal(gameRule.setFractionKillers(0), FAILURE, "Cannot set min players as 0")
    assert.equal(gameRule.setFractionKillers(1.1), FAILURE, "Cannot set min players bigger than 1")
    assert.equal(gameRule.getFractionKillers(), 0.4, "Killer fraciton updates correctly")

    assert.equal(gameRule.setMaxSoloKill(30), SUCCESS, "Can set Max Solo Kill higher")
    assert.equal(gameRule.setMaxSoloKill(0), FAILURE, "Can set Max Solo Kill higher")
    assert.equal(gameRule.setMaxSoloKill(-30), FAILURE, "Can set Max Solo Kill higher")

    assert.equal(gameRule.getMaxSoloKill(), 30, "Max Solo Kill set properly")

    assert.equal(gameRule.setMaxGlobalKill(50), SUCCESS, "Can set Max Global Kill higher")
    assert.equal(gameRule.setMaxGlobalKill(0), FAILURE, "Can set Max Global Kill higher")
    assert.equal(gameRule.setMaxGlobalKill(-50), FAILURE, "Can set Max Global Kill higher")

    assert.equal(gameRule.getMaxGlobalKill(), 50, "Max Global Kill set properly")

}

);