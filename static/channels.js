document.addEventListener('DOMContentLoaded', () =>{

    // connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // logger/debugger
    socket.on('log', data =>{
        console.log(`${data.msg}`);
    });

    // When connected
    socket.on('connect', () =>{
        
        socket.emit('joined');

        // when used clicks +channel, forget his last channel
        document.querySelector('#newChannel').addEventListener('click', () =>{
            localStorage.removeItem('last_channel');
        });

        // when user leaves, redirect to '/'
        document.querySelector('#Exit').addEventListener('click', () =>{

            socket.emit('left');

            localStorage.removeItem('last_channel');
            window.location.replace('/');

        });

        // when user exits, forget the channel
        document.querySelector('#Exit').addEventListener('click', () =>{
            localStorage.removeItem('last_channel');
        });
        
        document.querySelector("#usermsg").addEventListener('keydown', event =>{
            if(event.key == "Enter"){
                document.getElementById("sendmsg").click();
            };
        });

        // send:) button emits a message when pressed
        document.querySelector('#sendmsg').addEventListener('click', () =>{

            let timestamp = new Date;

            timestamp=timestamp.toLocaleTimeString();
            
            let msg = document.getElementById("usermsg").value;

            socket.emit('message', msg, timestamp);

            // clear text box
            document.getElementById("usermsg").value = '';

        });
    });

    socket.on('status', data =>{
        let announce = "==" + `${data.msg}` + "==";
        document.querySelector('#chatbox').value += announce+'\n';

        localStorage.setItem('last_channel', data.channel);
    });

    socket.on('announce', data =>{
        let msg = `${data.timestamp}` + " => " + `${data.user}` + ": " + `${data.msg}`;
        document.querySelector("#chatbox").value += msg+'\n';
    });
});