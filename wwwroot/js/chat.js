"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;


// this is the JS functon being called by the Hub on the server
connection.on("ReceiveMessage", function (user, message) {
  var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  var encodedMsg = user + " says " + msg;
  var p = document.createElement("p");
  p.textContent = encodedMsg;
  document.getElementById("messagesList").appendChild(p);
});

connection.start().then(function(){
  document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
  return console.error(err.toString());
});

// the JS is calling method on server SendMessage(), in ChatHubs.cs, passing params of user & message
document.getElementById("sendButton").addEventListener("click", function (event) {
  var user = document.getElementById("userInput").value;
  var message = document.getElementById("messageInput").value;
  connection.invoke("SendMessage", user, message).catch(function (err) {
    return console.error(err.toString());
  });
  event.preventDefault();
});
