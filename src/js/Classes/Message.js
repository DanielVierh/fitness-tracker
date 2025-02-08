export class Message {
    
    // define a propery for types 
    static types = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info',
    };

    constructor(title, message, type, duration) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.duration = duration;
    }

    showMessage() {
        const message_title = document.createElement('div');
        message_title.innerHTML = this.title;
        message_title.classList.add('message-title');

        const message_text = document.createElement('div');
        message_text.innerHTML = this.message;
        message_text.classList.add('message-text');

        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(this.type);
        messageElement.appendChild(message_title);
        messageElement.appendChild(message_text);
        document.body.appendChild(messageElement);

        setTimeout(() => {
            messageElement.classList.add('active');
        }, 50);
        setTimeout(() => {
            messageElement.classList.remove('active');
            setTimeout(() => {
                messageElement.remove();
            }, 200);
        }, this.duration);
    }
}