const APIaddress = 'http://127.0.0.1:8113';
const FlowerSelect = document.getElementById('FlowerSelect');

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
                if(flower.flowerColor == null) {
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
                if (flower.flowerColor == null){
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