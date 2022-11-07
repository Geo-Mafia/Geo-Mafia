## Functions

Firebase API functions. You may import the module by
```ts
import { /*functions*/ } from "module/database";
```
Please read over the documentation for API functions.  
You may use other functions not in this API. Check https://github.com/EddyVerbruggen/nativescript-plugin-firebase for more Firebase functions. 
### databaseInit
```ts
databaseInit() : void
```
databaseInit initializes Firebase Database. The function should only be called once. 
<details>
 <summary>Usage</summary>

```ts
databaseInit();
```
</details>


### databaseAdd
```ts
databaseAdd(path: string, data: object): boolean
```
databaseAdd adds the data object (JSON) to the initialized Firebase Database, in the specified path.
Returns true if successful and false if error.
<details>
 <summary>Usage</summary>

```ts
databaseInit();
//add JSON into users/gypark23
databaseAdd("users/gypark23", {
name : "Kyu Park",
id : "gypark23"
});
```
</details>


### databaseGet
```ts
async databaseGet(path: string, func: Function): Promise<any>
```
databaseGet fetches the data object (JSON) in the specified path, and returns a Promise of the object. In order to get value of Promise, one needs to use the .then() function when calling databaseGet. See example below.
<details>
 <summary>Usage</summary>

```ts
databaseInit();
//add JSON into users/gypark23
databaseAdd("users/gypark23", {
name : "Kyu Park",
id : "gypark23"
});
//take console.log as the function
const value = databaseGet("users/gypark23");
value.then(
    result => {
        // do stuff
    }
).catch(error => {
    //throw exception or error
});
```
</details>


### databaseUpdate
```ts
databaseUpdate(path: string, data: object): boolean
```
databaseUpdate updates the data object (JSON) to the initialized Firebase Database, in the specified path. Returns true if successful and false if error.
<details>
 <summary>Usage</summary>

```ts
databaseInit();
//add JSON into users/gypark23
databaseAdd("users/gypark23", {
name : "Kyu Park",
id : "gypark23"
});
//update the content
databaseUpdate("users/gypark23", {
name : "Jason Chee",
id : "jchee1"
});
```
</details>


### databaseRemove
```ts
databaseRemove(path: string): boolean
```
databaseRemove removes the node of the specified path, **including the node's children**. Returns true if successful and false if error.
<details>
 <summary>Usage</summary>

```ts
databaseInit();
//add JSON into users/gypark23/1234
databaseAdd("users/gypark23/1234", {
name : "Kyu Park",
id : "gypark23"
});
//will delete both gypark23 and gypark23/1234
databaseRemove("users")
```
</details>


### databaseEventListener
```ts
databaseEventListener(path: string, func: (data: firebase.FBData) => void)
```
databaseEventListener puts a listener on the path, and then execute the function whenever a change in the node is detected.


## Contact
The APIs and API Documentations are written by Kyu and Jason. Please ask any clarification questions to us. 
