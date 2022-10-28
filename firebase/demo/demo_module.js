import {writeData, readData, updateData, deleteData, resetDatabase} from "../src/database.js"

console.log("adding something");
console.log(writeData("/test", {
    field1 : "abc",
    field2 : "bcd",
    field3 : "asd"
}));

console.log("reading data");
let read = readData("/test")
console.log(read);

/*
console.log("resetting the database")



console.log(resetDatabase());
*/