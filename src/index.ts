import postmanCollection from "postman-collection";

const coll = new postmanCollection.Collection("aaa");
coll.variables.get("aaa")
console.log(coll);