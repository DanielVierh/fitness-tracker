export class Message {
    
    // define a propery for types 
    static types = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info',
    };

    constructor(message, type, duration) {
        this.message = message;
        this.type = type;
        this.duration = duration;
    }

    showMessage() {
        // create a div element
        const messageElement = document.createElement('div');
        // add a class to the div element
        messageElement.classList.add('message');
        // add a class to the div element
        messageElement.classList.add(this.type);
        // add the message to the div element
        messageElement.textContent = this.message;
        // append the div element to the body
        document.body.appendChild(messageElement);
        // remove the message after a certain duration
        setTimeout(() => {
            messageElement.remove();
        }, this.duration);
    }
}