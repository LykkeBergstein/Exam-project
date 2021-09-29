const APIaddress = 'http://127.0.0.1:8113/api';
const flowerSelect = document.getElementById('flowerSelect');
const registerDiv = document.getElementById('registerDiv');
const loginDiv = document.getElementById('loginDiv');
const registerUserBtn = document.getElementById('registerUserBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const addFlower = document.getElementById('addFlower');
const userEmail = document.querySelector('#userEmail');
const userPassword = document.querySelector('#userPassword');
const userName = document.querySelector('#userName');
const islandName = document.querySelector('#islandName');
const removeFlower = document.getElementById('removeFlower');

createPage();

function createPage() {
    const url = window.location.href;
    if (url.indexOf('flowerHelp') > -1) {
        getAllFlowers();
    } else if (url.indexOf('addFlowers') > -1) {
        getAllFlowers();
    } else if (url.indexOf('island') > -1) {
        getIslandFlowers();
    } else if (url.indexOf('deleteFlowers') > -1) {
        getIslandFlowers();
    }
}

function getAllFlowers() {
    let text;

    const fetchOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    fetch(APIaddress + '/flowers', fetchOptions)
        .then(response => {
            return response.json()
        })
        .then(flowers => {
            flowers.recordset.forEach(flower => {
                if (flower.flowerColor == null) {
                    text += `
                    <option value="${flower.flowerId}">${flower.flowerType}</option> 
                `;
                } else {
                    text += `
                    <option value="${flower.flowerId}">${flower.flowerColor} ${flower.flowerType}</option> 
                `;
                }

            });
            document.getElementById('flowerSelect').innerHTML = text;
        })
        .catch(error => {
            console.log(error);
        })
}

if (flowerSelect) {
    const url = window.location.href;
    if (url.indexOf('flowerHelp') > -1) {
        flowerSelect.addEventListener('change', (event) => {
            console.log(event.target.value);
            const fetchOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            fetch(APIaddress + '/flowers/' + event.target.value, fetchOptions)
                .then(response => {
                    return response.json()
                })
                .then(flowers => {
                    if (flowers[2]) {
                        text = `
                        To get a ${flowers[0].flowerColor} ${flowers[0].flowerType} breed a ${flowers[1].flowerColor} ${flowers[1].flowerType} and a ${flowers[2].flowerColor} ${flowers[2].flowerType} 
                        `;
                    } else {
                        text = `${flowers[0].note}`;
                    }

                    if (document.getElementById('output')) {
                        document.getElementById('output').innerHTML = text;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        });
    } else if (url.indexOf('addFlowers') > -1) {
        addFlower.addEventListener('click', (event => {
            let token = window.localStorage.getItem('x-authenticate-token');
            const payload = {
                userId: JSON.parse(window.localStorage.getItem('accountInfo')).userId,
                flowerId: flowerSelect.value
            }

            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-authenticate-token': token
                },
                body: JSON.stringify(payload)
            }

            fetch(APIaddress + '/island', fetchOptions)
                .then(response => {
                    return response.json()
                })
                .then(flower => {
                    if (flower.errorMessage) {
                        alert('Flower is already on your island');
                    } else {
                        if (flower[0].flowerColor != null) {
                            let text = `${flower[0].flowerColor} ${flower[0].flowerType} is added to ${JSON.parse(window.localStorage.getItem('accountInfo')).islandName}'s flowers!`;
                            document.getElementById('addOutput').innerHTML = text;
                        } else {
                            let text = `${flower[0].flowerType} is added to ${JSON.parse(window.localStorage.getItem('accountInfo')).islandName}'s flowers!`;
                            document.getElementById('addOutput').innerHTML = text;
                        }
                    }

                })
                .catch(error => {
                    console.log(error);
                })
        }));
    } else if (url.indexOf('deleteFlowers') > -1) {
        removeFlower.addEventListener('click', (event => {
            let token = window.localStorage.getItem('x-authenticate-token');
            const payload = {
                userId: JSON.parse(window.localStorage.getItem('accountInfo')).userId,
                flowerId: flowerSelect.value
            }

            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-authenticate-token': token
                },
                body: JSON.stringify(payload)
            }

            fetch(APIaddress + '/island/remove', fetchOptions)
                .then(response => {
                    return response.json()
                })
                .then(flower => {
                    if (flower.errorMessage) {
                        alert('Flower is not on your island :(');
                    } else {
                        if (flower[0].flowerColor != null) {
                            let text = `${flower[0].flowerColor} ${flower[0].flowerType} is removed from ${JSON.parse(window.localStorage.getItem('accountInfo')).islandName}'s flowers!`;
                            document.getElementById('deleteOutput').innerHTML = text;
                        } else {
                            let text = `${flower[0].flowerType} is removed from ${JSON.parse(window.localStorage.getItem('accountInfo')).islandName}'s flowers!`;
                            document.getElementById('deleteOutput').innerHTML = text;
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }));
    }
}

if (registerDiv) {
    registerUserBtn.addEventListener('click', (event) => {
        if (userEmail.value && userPassword.value && userName.value && islandName.value) {
            const payload = {
                userEmail: userEmail.value,
                userPassword: userPassword.value,
                userName: userName.value,
                islandName: islandName.value
            }

            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }

            fetch(APIaddress + '/accounts', fetchOptions)
                .then(response => {
                    return response.json()
                })
                .then(accountInfo => {
                    console.log(accountInfo);
                    if (!accountInfo.errorMessage) {

                        window.location.replace("http://127.0.0.1:5500/login.html");
                    }

                })
                .catch(error => {
                    console.log(error);
                })
        }
    });
}

if (loginDiv) {
    loginBtn.addEventListener('click', (event) => {
        if (userEmail.value && userPassword.value) {
            const payload = {
                userEmail: userEmail.value,
                userPassword: userPassword.value
            }

            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }

            fetch(APIaddress + '/accounts/login', fetchOptions)
                .then(response => {
                    const token = response.headers.get('x-authenticate-token');
                    window.localStorage.setItem('x-authenticate-token', token);
                    console.log(token);

                    return response.json()
                })
                .then(data => {
                    console.log(data);
                    window.localStorage.setItem('accountInfo', JSON.stringify(data));
                    console.log(window.localStorage.getItem('accountInfo'));
                    if (data.errorMessage) {
                        alert('Invalid user name or password.');
                    } else {
                        window.location.replace("http://127.0.0.1:5500/island.html");
                    }
                })
                .catch(error => {
                    alert('Invalid user name or password.');
                })
        }
    })

}

function getIslandFlowers() {
    const url = window.location.href;
    if (url.indexOf('island') > -1) {
        let userId = JSON.parse(window.localStorage.getItem('accountInfo')).userId;
        let token = window.localStorage.getItem('x-authenticate-token');
        console.log(userId + ": " + token)
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-authenticate-token': token
            },
        }

        fetch(APIaddress + '/island/' + userId, fetchOptions)
            .then(response => {
                return response.json()
            })
            .then(flowers => {
                let islandName = JSON.parse(window.localStorage.getItem('accountInfo')).islandName;
                let text = `Flowers on ${islandName}`;
                document.querySelector('h1').innerHTML = text;
                if (flowers.errorMessage) {
                    document.getElementById('output').innerHTML += `<p>${flowers.errorMessage}</p>`;

                } else {
                    flowers.forEach(flower => {
                        if (flower.flowerType == "Cosmos") {
                            document.getElementById('cosmosTable').innerHTML += `<p>${flower.flowerColor} ${flower.flowerType}</p>`;
                        } else if (flower.flowerType == "Hyacinth") {
                            document.getElementById('hyacinthTable').innerHTML += `<p>${flower.flowerColor} ${flower.flowerType}</p>`;
                        } else if (flower.flowerType == "Lily") {
                            document.getElementById('lilyTable').innerHTML += `<p>${flower.flowerColor} ${flower.flowerType}</p>`;
                        } else if (flower.flowerType == "Lily of the valley") {
                            document.getElementById('lilyTable').innerHTML += `<p>${flower.flowerType}</p>`;
                        } else if (flower.flowerType == "Mum") {
                            document.getElementById('mumTable').innerHTML += `<p>${flower.flowerColor} ${flower.flowerType}</p>`;
                        } else if (flower.flowerType == "Pansy") {
                            document.getElementById('pansyTable').innerHTML += `<p>${flower.flowerColor} ${flower.flowerType}</p>`;
                        } else if (flower.flowerType == "Rose") {
                            document.getElementById('roseTable').innerHTML += `<p>${flower.flowerColor} ${flower.flowerType}</p>`;
                        } else if (flower.flowerType == "Tulip") {
                            document.getElementById('tulipTable').innerHTML += `<p>${flower.flowerColor} ${flower.flowerType}</p>`;
                        } else if (flower.flowerType == "Windflower") {
                            document.getElementById('windflowerTable').innerHTML += `<p>${flower.flowerColor} ${flower.flowerType}</p>`;
                        }
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    } else if (url.indexOf('deleteFlowers') > -1) {
        let userId = JSON.parse(window.localStorage.getItem('accountInfo')).userId;
        let token = window.localStorage.getItem('x-authenticate-token');
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-authenticate-token': token
            },
        }

        fetch(APIaddress + '/island/' + userId, fetchOptions)
            .then(response => {
                return response.json()
            })
            .then(flowers => {
                let text = "";
                if (flowers.errorMessage) {
                    document.getElementById('output').innerHTML += `<p>${flowers.errorMessage}</p>`;
                } else {
                    flowers.forEach(flower => {
                        if (flower.flowerColor == null) {
                            text += `
                            <option value="${flower.flowerId}">${flower.flowerType}</option> 
                        `;
                        } else {
                            text += `
                            <option value="${flower.flowerId}">${flower.flowerColor} ${flower.flowerType}</option> 
                        `;
                        }
        
                    });
                    document.getElementById('flowerSelect').innerHTML = text;
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

}

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        window.localStorage.removeItem('x-authenticate-token');
        window.localStorage.removeItem('accountInfo');
        console.log('Account logged out.');
        window.location.replace("http://127.0.0.1:5500/index.html");
    });
}



