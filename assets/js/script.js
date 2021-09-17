const APIaddress = 'http://127.0.0.1:8113';
const flowerSelect = document.getElementById('flowerSelect');
const registerDiv = document.getElementById('registerDiv');
const loginDiv = document.getElementById('loginDiv');
const registerUserBtn = document.getElementById('registerUserBtn');
const loginBtn = document.getElementById('loginBtn');
const userEmail = document.querySelector('#userEmail');
const userPassword = document.querySelector('#userPassword');
const userName = document.querySelector('#userName');
const islandName = document.querySelector('#islandName');


createPage();

function createPage() {
    const url = window.location.href;
    if (url.indexOf('flowerHelp') > -1) {
        getAllFlowers();
    } else if (url.indexOf('addFlowers') > -1) {
        getAllFlowers();
    }
}

function getAllFlowers() {
    let text;
    //         

    //document.getElementById('FlowerSelect').innerHTML = text;
    const fetchOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(APIaddress + '/api/flowers', fetchOptions)
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
    flowerSelect.addEventListener('change', (event) => {
        console.log(event.target.value);
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(APIaddress + '/api/flowers/' + event.target.value, fetchOptions)
            .then(response => {
                return response.json()
            })
            .then(flowers => {
                console.log(flowers);
                flowers.forEach(flower => {
                    if (flower.flowerColor == null) {
                        text = `${flower.note}`;
                    } else if (flower.breedingFlower1 == null) {
                        text = `${flower.note}`;
                    } else {
                        text = `To get ${flower.flowerColor} ${flower.flowerType} breed ${flower.breedingFlower1} and ${flower.breedingFlower2}`;
                    }
                })
                if(document.getElementById('output')) {
                    document.getElementById('output').innerHTML = text;
                }
            })
            .catch(error => {
                console.log(error);
            })
    });
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

            fetch(APIaddress + '/api/accounts', fetchOptions)
                .then(response => {
                    return response.json()
                })
                .then(accountInfo => {
                    console.log(accountInfo);
                    if (accountInfo.errorMessage) {
                        alert(accountInfo.errorMessage);
                    }
                    if (!accountInfo.errorMessage) {
                        window.location.replace("http://127.0.0.1:5500/login.html");
                    }
                    /* if (accountInfo) {
                        window.location.replace("http://127.0.0.1:5500/login.html");
                    } */
                    //document.getElementById('output').innerHTML = text;
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

            fetch(APIaddress + '/api/accounts/login', fetchOptions)
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
                if(data.errorMessage) {
                    alert('Invalid user name or password.');
                }
                /* if(data.success) {
                    
                } else {
                    throw new Error;
                } */

                /* if (window.localStorage.getItem('accountInfo')) {
                    console.log(window.localStorage.getItem('accountInfo'));
                } else {
                    alert(data.errorMessage);
                } */
            })
            .catch(error => {
                alert('Invalid user name or password.');
            })
        }
    })
    
}