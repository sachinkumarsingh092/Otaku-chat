import os
from collections import deque
from helpers import login_required

from flask import Flask, url_for, render_template, session, request, flash, redirect
from flask_socketio import SocketIO, emit, join_room, leave_room


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY") or b'_5#y2L"F4Q8z\n\xec]/'
socketio = SocketIO(app)


# Total number of channels
allChannels = []

# Messages in the channels
messages = dict()


@app.route("/")
@login_required
def index():
    """ chatroom """
    return render_template("index.html", channels = allChannels)


@app.route("/login", methods=["GET", "POST"])
def login():
    """ login page """
    if request.method == 'POST':

        # Check if username is entered #
        if not request.form.get('username'):
            return render_template("error.html", error="Username required")

        # Add user information is client-side session #
        session['username'] = request.form['username'].strip()
        session['logged_in'] = True

        # Authenticate user in session #
        try:
            if session['username'] != request.form['username']:
                return render_template("error.html", error="Wrong username")
        except Exception:
            return render_template("error.html", error="User not found. Please register")

        # Display message #
        flash('Welcome', 'info')

        # session.permanent = True
        
        return redirect('/')

    else:
        # If method is 'GET' #
        return render_template("login.html")



@app.route("/logout", methods=["GET"])
@login_required
def logout():
    """ Removes user from the session stack """

    # To clear all user info if he/she logs out use below line. #
    session.clear()

    # If user is logged out
    session['logged_in'] = False

    return redirect("/login")



@app.route("/create", methods=["POST", "GET"])
@login_required
def create():
    """ Create channel and redirect user to it. """

    global messages

    if request.method == 'POST':

        newChannel = request.form.get('channel')

        # check for uniqueness of the channel created
        if newChannel in allChannels:
            return render_template("error.html", error="Channel name not unique. Try another name")
        
        # put it in the global channel list
        allChannels.append(newChannel)

        messages[newChannel] = deque()

        # redirect to the channel created
        return redirect("/channels/" + newChannel)
    else:
        # redirect to channel creating page
        return render_template("index.html", channels=allChannels)



@app.route("/channels/<string:channel>", methods=["GET", "POST"])
@login_required
def enter_channel(channel):
    global messages
    
    # open the session for the current channel
    session['current_channel'] = channel

    if request.method == 'POST':

        return redirect("/")
    else:
        return render_template("channel.html", channels=allChannels, messages=messages[channel])



@socketio.on('join')
def join():
    """ Sends a joining message from client-side. """

    # Using join_room function to connect to a room
    # see https://flask-socketio.readthedocs.io/en/latest/#rooms

    room = session.get('current_channel')
    join_room(room)
    emit(
        'status', 
        {
            'user': session['username'],
            'channel': room,
            'msg': session['username'] + " joined :)"
        },
        room=room
    )


@socketio.on('left')
def left():
    """ Sends a leave message from client-side. """

    # Using leave_room function to leave a room
    # see https://flask-socketio.readthedocs.io/en/latest/#rooms

    room = session.get('current_channel')
    leave_room(room)
    emit(
        'status', 
        {
            'user': session['username'],
            'channel': room,
            'msg': session['username'] + "left:("
        },
        room=room
    )



@socketio.on('send_message')
def send_msg(msg, timestamp):
    global messages
    """ Message with the timestamp. """
    room = session.get('current_channel')

    messages[room].append([timestamp, session.get('username'), msg])

    emit(
        'announce', 
        {
            'user' : session.get('username'),
            'timestamp': timestamp,
            'msg': msg
        }, 
        room=room
    )


if __name__ == "__main__":
    app.run(debug=True)
    socketio.run(app)
