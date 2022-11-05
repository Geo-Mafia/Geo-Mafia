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
databaseAdd(path: string, data: object): void
```
databaseAdd adds the data object (JSON) to the initialized Firebase Database, in the specified path.
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
databaseGet(path: string, func: Function): void
```
databaseGet fetches the data object (JSON) in the specified path, and then runs the function taking the JSON object as the argument. **Note that databaseGet WILL NOT return the fetched JSON object.**\
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
databaseGet("users/gypark23", console.log)
//prints the JSON Object
```
</details>


### databaseUpdate
```ts
databaseUpdate(path: string, data: object): void
```
databaseUpdate updates the data object (JSON) to the initialized Firebase Database, in the specified path.
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
databaseRemove(path: string): void
```
databaseRemove removes the node of the specified path, **including the node's children**. 
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

