# Otaku

This is a realtime chating webapp similar to slack, allowing users to create and join channels.

`Localstorage` is used insted of a database to store `sessions`.

`/static` contains the javascript and css files.

`/templates` contains the html layout of pages. `layout.html` is the basic templete used by others.

`application.py` is the main application.

`helpers.py` has the **login_required** decorator, to falicitate only logged users to be directed to certain pages.

Feature to delete one's own messages is implemeted.

## Usage

- Go to the [site](https://otaku-chat.herokuapp.com/).
- Enter a username.
- Join or make a new channel.
- Chat with other users.

## Screenshots
