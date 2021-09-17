const APIaddress = 'http://127.0.0.1:8113';
const FlowerSelect = document.getElementById('FlowerSelect');
const registerDiv = document.getElementById('registerDiv');
const loginDiv = document.getElementById('loginDiv');
const registerUserBtn = document.getElementById('registerUserBtn');
const userEmail = document.querySelector('#userEmail');
const userPassword = document.querySelector('#userPassword');
const userName = document.querySelector('#userName');
const islandName = document.querySelector('#islandName');


createPage();

function createPage() {
    const url = window.location.href;
    if (url.indexOf('flowerHelp') > -1) {
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
            document.getElementById('FlowerSelect').innerHTML = text;
        })
        .catch(error => {
            console.log(error);
        })
}

if (FlowerSelect) {
    FlowerSelect.addEventListener('change', (event) => {
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
                document.getElementById('output').innerHTML = text;
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

                    //document.getElementById('output').innerHTML = text;
                })
                .catch(error => {
                    console.log(error);
                })
        }
    });
}

if (loginDiv) {
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

                loginDiv.classList.toggle('hidden');
                logoutDiv.classList.toggle('hidden');
            })
            .catch(error => {
                alert('Invalid user name or password.');
            })

    } else {
        alert('Please enter user email and password!');
    }
}