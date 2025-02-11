const socket = io();
let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
let sendButton = document.querySelector('#sendIcon');
let fileInput = document.querySelector('#fileInput'); 

do {
    name = prompt('Please enter your name: ');
} while (!name);

sendButton.addEventListener('click', () => {
    if (textarea.value.trim()) {
        sendMessage(textarea.value.trim(), null); 
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        sendImage(fileInput.files[0]); 
    }
});

textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (textarea.value.trim()) {
            sendMessage(textarea.value.trim(), null);
        }
    }
});

function sendMessage(message, imageUrl) {
    if (!message && !imageUrl) return; 

    let msg = {
        user: name,
        message: message,
        image: imageUrl
    };

    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    socket.emit('message', msg);
}

function sendImage(file) {
    let reader = new FileReader();
    reader.onload = function (event) {
        sendMessage(null, event.target.result); 
        fileInput.value = ''; 
    };
    reader.readAsDataURL(file);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    mainDiv.classList.add(type, 'message');

    let markup = `<h4>${msg.user}</h4>`;

    if (msg.message) {
        markup += `<p>${msg.message}</p>`;
    }

    if (msg.image) {
        markup += `<img src="${msg.image}" alt="Image" style="max-width: 200px; border-radius: 5px;">`;
    }

    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
