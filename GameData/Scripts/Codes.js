var inputField = document.getElementById("message");

var messageContents = inputField.value;

function sendMessage(){
	messageContents = inputField.value;
	switch(messageContents){
		case "/join town":
			changeRoom(town, townObjects, 409, 380, 0, 0);
			break;
		case "/join forest":
			changeRoom(forest, forestObjects, 100, 400, 0, 400 - canvas.height/2);
			break;
		case "/join dome":
			changeRoom(dome, domeObjects, 563, 400, 0, 0);
			break;
	}
}