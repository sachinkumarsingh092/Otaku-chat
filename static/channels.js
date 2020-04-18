document.addEventListener('DOMContentLoaded', () =>{

    // connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // logger/debugger
    socket.on('log', data =>{
        console.log(data.msg);
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

            // time-stamp object
            let timestamp = new Date();

            timestamp=timestamp.toLocaleTimeString();
            
            let msg = document.getElementById("usermsg").value;

            socket.emit('send message', msg, timestamp);

            // clear text box
            document.getElementById("usermsg").value = '';

        });
    });

    socket.on('status', data =>{
        // message when user enters the room 
        let msg = `${data.msg}`;
        document.querySelector('#chatbox').append(msg);

        localStorage.setItem('last_channel', data.channel);
    });

    socket.on('announce message', data =>{

        // message user posts in the chat-room
        let msg = `@${data.user} => ${data.msg}\n`;


        // Create new post.
        const post = document.createElement('div');
        post.className = 'post';
        post.style.color = 'rgb(51, 102, 255)'
        post.innerHTML = msg;

        // Time in post
        const time = document.createElement('span');
        time.className = 'time';
        time.innerHTML = data.timestamp
        time.style.color = 'rgb(153, 51, 255)'
        post.append(time);

        // Add button to hide post.
        const hide = document.createElement('button');
        hide.className = 'btn btn-outline-dark btn-sm float-right ';
        hide.innerHTML = 'Hide';
        post.append(hide);

    
    
        // When hide button is clicked, remove post.
        hide.onclick = function() {
            this.parentElement.remove();
        };

        
        // Add post to DOM.
        document.querySelector("#chatbox").append(post);

        // https://stackoverflow.com/a/29585990
        document.getElementById('chatbox').lastChild.scrollIntoView(false);
      
            

    });
});