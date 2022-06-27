let messagesListBox = document.querySelector(".messageslist");

let sendButton = document.querySelector(".userinteraction ion-icon");

let theLastObject = {

    from: "",
    to: "",
    text: "",
    type: "",
    time: ""

};

let userNameObject = {

    name: ""

};

let userNamePromise;

let messagesPromise;

function enterRoom() {

    userNameObject.name = prompt("Qual é o seu nome?");

    userNamePromise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userNameObject);

    userNamePromise.catch(enterNewName);
    userNamePromise.then(workChat);

}

function enterNewName() {

    userNameObject.name = prompt(`O nome "${userNameObject.name}" já está em uso. Por favor, insira outro nome.`);

    userNamePromise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userNameObject);

    userNamePromise.catch(enterNewName);
    userNamePromise.then(workChat);

}

function workChat() {

    sendButton.setAttribute("onClick", "sendMessage();");

    getMessages();
    setInterval(getMessages, 3000);

    beStillOnline();
    setInterval(beStillOnline, 5000);

}

function beStillOnline() {

    const stillOnline = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userNameObject);

}

function getMessages() {

    messagesPromise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    messagesPromise.catch(getMessages);
    messagesPromise.then(renderMessages);

}

function renderMessages(getResponse) {

    const messagesObjects = getResponse.data;
    let messagesRendered = [];
    let counter = 1;

    messagesListBox.innerHTML = "";

    for (let i = 0; i < messagesObjects.length; i++) {

        if (messagesObjects[i].type === "status") {

            messagesRendered.push(messagesObjects[i]);

            messagesListBox.innerHTML += `
                
                <div class="statusmessage a${i + 1 - counter}">
                    <span>(${messagesObjects[i].time}) </span>
                    <span>${messagesObjects[i].from} </span>
                    <span>${messagesObjects[i].text}</span>
                </div>
                `
        } else if (messagesObjects[i].type === "message") {

            messagesRendered.push(messagesObjects[i]);

            messagesListBox.innerHTML += `

                <div class="publicmessage a${i + 1 - counter}">
                    <span>(${messagesObjects[i].time}) </span>
                    <span>${messagesObjects[i].from} </span>
                    <span>para </span>
                    <span>${messagesObjects[i].to}: </span>
                    <span>${messagesObjects[i].text}</span>
                </div>
                `
        } else if (messagesObjects[i].type === "private_message" && (userNameObject.name === messagesObjects[i].from || userNameObject.name === messagesObjects[i].to)) {

            messagesRendered.push(messagesObjects[i]);

            messagesListBox.innerHTML += `

                <div class="privatemessage a${i + 1 - counter}">
                    <span>(${messagesObjects[i].time}) </span>
                    <span>${messagesObjects[i].from} </span>
                    <span>reservadamente para </span>
                    <span>${messagesObjects[i].to}: </span>
                    <span>${messagesObjects[i].text}</span>
                </div>
                `
        } else {

            counter++;

        }

    }

    if (!equalObjects(theLastObject, messagesRendered[messagesRendered.length - 1])) {

        const theLastElement = document.querySelector(`.a${messagesRendered.length - 1}`);
        theLastElement.scrollIntoView();
        theLastObject = messagesRendered[messagesRendered.length - 1];
        console.log("diferente");

    }

}

function equalObjects(theLast1, theLast2) {

    const a = theLast1.from === theLast2.from;
    const b = theLast1.to === theLast2.to;
    const c = theLast1.text === theLast2.text;
    const d = theLast1.type === theLast2.type;
    const e = theLast1.time === theLast2.time;

    return a && b && c && d && e;

}

function sendMessage() {

    const messageText = document.querySelector(".inputbox textarea").value;

    if (messageText !== "") {

        document.querySelector(".inputbox textarea").value = "";

        const objectToSend = {

            from: userNameObject.name,
            to: "Todos",
            text: messageText,
            type: "message"

        };

        const sendPromise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objectToSend);

        sendPromise.catch(reloadPage);
        sendPromise.then(getMessages);

    }

}

function reloadPage() {

    window.location.reload();

}

enterRoom();