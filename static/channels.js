document.addEventListener('DOMContentLoaded', function () {

    console.log("DEBUG!!!")

    // connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // logger/debugger
    socket.on('log', data => {
        console.log(data.msg);
    });

    // When connected
    socket.on('connect', () => {

        console.log("JOINED!")
        
        socket.emit('join');

        // when used clicks +channel, forget his last channel
        document.getElementById('newChannel').addEventListener('click', () => {
            localStorage.removeItem('last_channel');
        });

        // when user leaves, redirect to '/'
        document.getElementById('Exit').addEventListener('click', () => {

            socket.emit('left');

            localStorage.removeItem('last_channel');
            window.location.replace('/');

        });

        document.getElementById("usermsg").addEventListener('keydown', (event) => {
            if (event.key == "Enter") {
                document.getElementById("sendmsg").click();
            }
        });

        // `send:)` button emits a message when pressed
        document.getElementById('sendmsg').addEventListener('click', (event) => {

            let timestamp = new Date();
            timestamp = timestamp.toLocaleTimeString();
            
            // get message from chatbox
            const msg = document.getElementById("usermsg").value;
            // clear text box
            document.getElementById("usermsg").value = '';
            
            socket.emit('send_message', msg, timestamp);
        });

    });

    socket.on('status', (data) => {
        console.log("STATUS:", data);
        let announce = `== ${data.msg} ==\n`;
        document.getElementById("chatbox").value += announce;

        localStorage.setItem('last_channel', data.channel);
    });

    socket.on('announce', (data) => {
        console.log("ANNOUNCE:", data);
        const msg = `${data.timestamp} => ${data.user} : ${data.msg}\n`;
        document.getElementById("chatbox").value += msg;
    });

});