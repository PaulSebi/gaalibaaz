function login(e) {
    var username = document.getElementById('username').value,
        passcode = document.getElementById('passcode').value;
    
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
            window.location = '/dev/v0/rateables?languages=english';
        } else {
            alert('Try Again');
        }
        return false;
    });
}