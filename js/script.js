let messagesListBox = document.querySelector(".messageslist")

getMessages();
setInterval(getMessages, 3000);

function getMessages() {

    const messagesPromise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    messagesPromise.then(renderMessages);

}

function renderMessages(getResponse) {

    const messagesObjects = getResponse.data;
    let counter = 1;

    messagesListBox.innerHTML = "";

    for (let i = 0; i < messagesObjects.length; i++) {

        if (messagesObjects[i].type === "status") {

            messagesListBox.innerHTML += `
                
                <div class="statusmessage a${i}">
                    <span>(${messagesObjects[i].time}) </span>
                    <span>${messagesObjects[i].from} </span>
                    <span>${messagesObjects[i].text}</span>
                </div>
                `
        } else if (messagesObjects[i].type === "message") {

            messagesListBox.innerHTML += `

                <div class="publicmessage a${i}">
                    <span>(${messagesObjects[i].time}) </span>
                    <span>${messagesObjects[i].from} </span>
                    <span>para </span>
                    <span>${messagesObjects[i].to}: </span>
                    <span>${messagesObjects[i].text}</span>
                </div>
                `
        } else if (messagesObjects[i].type === "private_message") {

            messagesListBox.innerHTML += `

                <div class="privatemessage a${i}">
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

    const actualSize = messagesObjects.length;
    const theLastElement = document.querySelector(`.a${actualSize-counter}`);
    theLastElement.scrollIntoView();

}

