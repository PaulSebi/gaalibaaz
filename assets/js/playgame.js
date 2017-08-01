$(document).ready(function(){

    var roomId = $('#roomId').html();
    io.socket.get('/dev/v0/rooms/subscribe?id='+roomId, function(res){
        console.log(res);
    });

    io.socket.on('room', function(e){
        // console.log('socket ', e);
        switch(e.verb){
            case 'updated' :
                updated(e.data);
                break;
            case 'messaged' :
                if(e.data.tick>=0)
                    $('#timer').html(e.data.tick);
                else if(e.data.tick<0){
                    // alert('timeup!');
                    $('#submitGaali').attr('disabled', true);
                }
                else if(e.data.winner){
                    console.log('winner', e.data);
                    alert('Winner is ' + e.data.winner.username);
                    window.location = '/dev/v0/gamerooms';
                }
                
            default:
                break;
        }
    });

});

function updated(data){
    if(data.newUser){
        var user = data.newUser;
        $('#users').append('<div id = "user'+(data.total-1)+'"><h3 style="display:inline-block">'+user.username+'</h3><span style="display:inline-block">&nbsp&nbsp|&nbsp&nbsp </span><p style="display:inline-block">'+user.points+'</p><span style="display:inline-block">&nbsp&nbsp|&nbsp&nbsp</span><p style="display:inline-block">'+user.ready+'</p></div><br><br>');
    }
    else if(typeof data.ready=='boolean'){
        var user = document.getElementById('user'+data.index);
        user.getElementsByTagName('p')[1].innerHTML = data.ready;
    }
    else if(data.start){
        play();
    }
    else if(data.points){
        var user = document.getElementById('user'+data.index);
        user.getElementsByTagName('p')[0].innerHTML = data.points;
    }
}

function ready(){
    var user = JSON.parse(window.localStorage.getItem('user'));
    var ready = $('#ready').val()=='ready'?true:false;
    io.socket.put('/dev/v0/rooms', {
        roomId : $('#roomId').html(),
        userId : user.id,
        ready : ready
    }, function(res){
        $('#ready').val(ready?'not ready':'ready');
    })
}

function play(){
    $('#ready').attr('disabled', true);
    alert('TIme Starts Now!');
    $('#submitGaali').removeAttr('disabled');
    io.socket.post('/dev/v0/rooms/playgame', {
        id: $('#roomId').html()
    }, function(res){
    });
}

function submitGaali(){
    var user = JSON.parse(window.localStorage.getItem('user'));
    io.socket.post('/dev/v0/rooms/gaali', {
        roomId : $('#roomId').html(),
        userId : user.id,
        gaali : $('#gaali').val()
    }, function(res){
        console.log(res);
        $('#gaali').val="";
    });
}