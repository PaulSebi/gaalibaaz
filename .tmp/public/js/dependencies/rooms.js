$(document).ready(function(){
    io.socket.get('/dev/v0/rooms/subscribe', function(res){
        console.log('res', res);
    });

    io.socket.on('room', function(e){
        console.log('socket', e);
        switch(e.verb){
            case 'updated' :
                updated(e);
                break;
            case 'created' :
                created(e);
                break;
            default:
                break;
        }
    });
})

function created(e){
    console.log(e);
    $('#existing').append('<div id="room'+e.id+'"><p style="display:inline-block">'+e.id+'</p>&nbsp&nbsp&nbsp|&nbsp&nbsp&nbsp<p style="display:inline-block">'+e.data.max_limit+'</p>&nbsp&nbsp&nbsp|&nbsp&nbsp&nbsp<p style="display:inline-block">'+e.data.total+'</p>&nbsp&nbsp&nbsp|&nbsp&nbsp&nbsp'+(e.data.max_limit == e.data.total?'<input type="button" value = "join" onclick="joinRoom(\'room'+e.id+'\')" disabled>':'<input type="button" value = "join" onclick="joinRoom(\'room'+e.id+'\')">')+'</div><br>');
}

function updated(e){
    var room = document.getElementById('room'+e.id);
    console.log('making changes', e.data);
    room.getElementsByTagName('p')[2].innerHTML = e.data.total;
    if(e.data.total==e.data.max_limit)
        room.getElementsByTagName('input')[0].setAttribute('disabled', true);
    else room.getElementsByTagName('input')[0].setAttribute('disabled', false);
}

function createRoom(){
    var limit = parseInt(document.getElementById('limit').value),
        user = JSON.parse(window.localStorage.getItem('user'));
    
    io.socket.post('/dev/v0/rooms', {
        id : user.id,
        username : user.username,
        max_limit : limit,
        admin : true    
    }, function(res){
        console.log('res', res);
    });
}

function joinRoom(roomId){
    console.log('room', roomId);
    var room = document.getElementById(roomId).getElementsByTagName('p'),
        user = JSON.parse(window.localStorage.getItem('user'));
    console.log('element', room);
    io.socket.put('/dev/v0/rooms', {
        roomId : room[0].innerHTML,
        userId : user.id,
        username : user.username,
        admin : false
    }, function(res){
        console.log('res', res);
    });
}