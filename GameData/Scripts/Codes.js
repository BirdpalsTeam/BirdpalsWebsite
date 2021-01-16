var inputField = document.getElementById("message");

var messageContents = inputField.value;

function sendMessage() {
  messageContents = inputField.value;
  switch (messageContents) {
    case "/join town":
      if (room != town) {
        changeRoom(town, townObjects, 409, 380, 0, 0);
      }
      break;
    case "/join forest":
      if (room != forest) {
        changeRoom(forest, forestObjects, 100, 400, 0, -150);
      }
      break;
    default:
      char.chatMessage(messageContents);
      console.log("Bird says: " + messageContents);
  }
  inputField.value = "";
  setTimeout(function(){char.chatMessage("")}, 5000);
}
