function  rate(e){
    console.log('here');
    var ratings = [];
    for(i=0; i<5; i++){
        var div = document.getElementById('div'+i);
        var doc = {
            id : div.getElementsByTagName('p')[0].innerHTML,
            poll : parseInt(div.getElementsByTagName('input')[0].value),
            rated : parseInt(div.getElementsByTagName('span')[0].innerHTML),
            ratedBy : parseInt(div.getElementsByTagName('h2')[0].innerHTML),
        }
        ratings.push(doc);
    };   
    console.log('rating', ratings);

    fetch('/dev/v0/rateables', {
        method: 'put',
        body: JSON.stringify(ratings)
    }).then(function(response){
        return response.json();
    }).then(function(response) {
        if (response.error) {
            alert('Try Again')
        } else {
            console.log(response);
            window.location = '/dev/v0/gamerooms';
        } 
    });
}