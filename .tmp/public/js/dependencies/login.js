function login(e) {
    var username = document.getElementById('username').value,
        passcode = document.getElementById('passcode').value,
        language = document.getElementById('language').value;

    if(language != 'english' && language!='hinglish'){
        alert('please check language should be english or hinglish');
        returnl;
    }
    
    fetch('/dev/v0/users/login', {
        method: 'post',
        body: JSON.stringify({
            username: username,
            passcode: passcode
        })
    }).then(function(response){
        return response.json();
    }).then(function(response) {
        if (response.error) {
            alert('Wrong Password')
        } else if (response.result) {
            console.log(typeof response.result);
            window.localStorage.setItem('user', JSON.stringify(response.result));
            window.location = '/dev/v0/rateables?languages='+language;
        } else {
            alert('Try Again');
        }
    });
}