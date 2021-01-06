var inputField = document.getElementById("message");

var messageContents = inputField.value;

function sendMessage(){
	messageContents = inputField.value;
	switch(messageContents){
		case "/join town":
			changeRoom(town, townObjects, 409, 380);
			break;
		case "/join forest":
			changeRoom(forest, forestObjects, 0, 0);
			break;
		case "/join dome":
			changeRoom(dome, domeObjects, 0, 0);
			break;
	}
}