function getCurrentCoordinates() {
    return fetch("https://ipinfo.io");
}

function init() {
    console.log('Start');

    return getCurrentCoordinates()
        .then(currentLocation => {
            console.log(currentLocation);
        })
        .catch(err => {
            console.log(err);
        });
}

init();