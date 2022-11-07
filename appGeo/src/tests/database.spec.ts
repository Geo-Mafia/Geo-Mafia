import { firebase } from "@nativescript/firebase-core";
import { databaseInit, databaseAdd, databaseGet, databaseUpdate, databaseRemove, databaseEventListener } from "../modules/database";


const projectId = "geo-mafia";


/**
 * Functions that pass the test: databaseInit(), databaseAdd(), databaseGet(), databaseRemove(), databaseUpdate()
 * Functions that need the test: databaseEventListener()
 */


databaseInit();
QUnit.test("Firebase write then read API Unit Testing", function(assert) {
    const successData = {
        username: "name",
        email: "email",
        profile_picture : "imageUrl"
      };

    const dir = "users/test";
    // writeData should return true
    assert.equal(databaseAdd(dir, successData), true);

    // able to read data now
    const read = databaseGet(dir);
    
    read.then(
        result => {
            assert.deepEqual(result, successData);
        })
        .catch(error => {
            assert.throws(function () {
                throw new Error('error: ' + error);
              });
    });

    console.log("test1 yayyy");
});

QUnit.test("Firebase delete API Unit Testing", function(assert) {
    const data = {
        username: "name",
        email: "email",
        profile_picture : "imageUrl"
    };
    const dir = "users/test";
    // writeData should return true
    assert.equal(databaseAdd(dir, data), true);

    // able to read data now
    const read = databaseGet(dir);
      
    read.then(
        result => {
            assert.deepEqual(result, data);
        })
        .catch(error => {
            assert.throws(function () {
                throw new Error('error: ' + error);
              });
    });
  
    // delete data now
    assert.equal(databaseRemove(dir), true);

    console.log("test2 yayyy");

});

QUnit.test("Update API Unit Testing", function(assert) {
    const data = {
        username: "name",
        email: "email",
        profile_picture : "imageUrl"
    };
    const dir = "users/test";
    // writeData should return true
    assert.equal(databaseAdd(dir, data), true);

    // able to read data now
    const read = databaseGet(dir);

    read.then(
        result => {
            assert.deepEqual(result, data);
        })
        .catch(error => {
            assert.throws(function () {
                throw new Error('error: ' + error);
              });
    });

    const data2 = {
        username: "new",
        email: "new email",
        profile_picture : "test2"
    };
  
    // update data now
    assert.equal(databaseUpdate(dir, data2), true);

    // shouldn't be able to read now
    const read2 = databaseGet(dir);

    read2.then(
        result => {
            console.log("result: " + JSON.stringify(result));
            assert.deepEqual(result, data2);
        })
        .catch(error => {
            assert.throws(function () {
                throw new Error('error: ' + error);
              });
    });
    // delete data again
    assert.equal(databaseRemove(dir), true);
    console.log("test3 yayyy");

});