let cursor = {
    x: null,
    y: null
}

let fruit = {
    dom: null,
    x: null,
    y: null,
}

let currentFruit = {
    dom: null,
    x: null,
    y: null,
}

let maxIndex = 0;
const container = document.getElementById('container')
const menu = document.getElementById('menu')
const cake = document.getElementById('cake')

document.addEventListener('pointerdown', (event) => {
    if (event.target.classList.contains('fruit')){
        cursor = {
            x: event.clientX,
            y: event.clientY
        }
        fruit = {
            dom: event.target,
            x: event.target.getBoundingClientRect().left,
            y: event.target.getBoundingClientRect().top
        }

        if (event.target.classList.contains('moved') === false){
            event.target.classList.add('moved');
            event.target.parentNode.click();
            event.target.style.fontSize = '100px'
        }

        event.target.style.zIndex = `${maxIndex += 1}`
    }
})

document.addEventListener('pointermove', (event) => {
    if(fruit.dom === null) return;
    let currentCursor = {
        x: event.clientX,
        y: event.clientY
    }
    let distance = {
        x: currentCursor.x - cursor.x,
        y: currentCursor.y - cursor.y
    }

    currentFruit = {
        x: fruit.x + distance.x,
        y: fruit.y + distance.y
    }
    fruit.dom.style.left = (currentFruit.x) + "px";
    fruit.dom.style.top = (currentFruit.y) + "px";
    fruit.dom.style.cursor = 'grab';
})

document.addEventListener('pointerup', () => {
    //Removes the fruit whenever it's around the menu
    if (currentFruit.x >= menu.getBoundingClientRect().left - 100 || fruit.dom.style.left == '') {
        fruit.dom.remove();
        currentFruit.dom = null;
    } else {
        fruit.dom.parentNode.removeChild(fruit.dom);
        cake.appendChild(fruit.dom);
        currentFruit.dom = fruit.dom;
    }

    fruit.dom = null
    fruit.dom.style.cursor = 'auto';
})

/***********DUPLICATE FRUIT FEATURES************/

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('fruitBtn')){
        let newFruit = document.createElement('div');
        newFruit.classList.add('fruit');

        switch (event.target.id){
            case 'strawberry':
                newFruit.innerHTML = '🍓';
                break;
            case 'banana':
                newFruit.innerHTML = '🍌';
                break;
            case 'melon':
                newFruit.innerHTML = '🍈';
                break;
            case 'orange':
                newFruit.innerHTML = '🍊';
                break;
            case 'cherry':
                newFruit.innerHTML = '🍒';
                break;
            case 'apple':
                newFruit.innerHTML = '🍎';
                break;
            case 'pineapple':
                newFruit.innerHTML = '🍍';
                break;
            case 'peach':
                newFruit.innerHTML = '🍑';
                break;
            case 'kiwi-fruit':
                newFruit.innerHTML = '🥝';
                break;
            default:
                break;
        }

        event.target.append(newFruit)
    }
})

/***********ENLARGING AND SHRINKING FEATURES************/
let zoom = 1;
let zoomSpeed = 0.1;

document.addEventListener('wheel', (event) => {
    if (event.target.classList.contains('moved')){
        if (event.deltaY > 0 && event.target.getBoundingClientRect().width > 50){
            event.target.style.transform = `scale(${(zoom -= zoomSpeed)}) rotate(${rotateValue}deg)`;
        } else if (event.deltaY < 0 && event.target.getBoundingClientRect().width < 400){
            event.target.style.transform = `scale(${zoom += zoomSpeed}) rotate(${rotateValue}deg)`
        }
    }
})

/***********CLEAR BUTTON FEATURES************/
const clearBtn = document.getElementById('clear');

clearBtn.onclick = () => {
    let allFruits = document.querySelectorAll('div.moved');

    allFruits.forEach((movedFruit) => {
        movedFruit.remove();
    })
}

/***********ROTATE FEATURES************/
const rotateInput = document.getElementById('rotate');
let rotateValue = 0;


rotateInput.addEventListener('input', (event) => {
    rotateValue = event.target.value;
    currentFruit.dom.style.transform = `scale(${zoom}) rotate(${rotateValue}deg)`
});

/***********CAKE COLORS FEATURES************/
document.addEventListener('click', (event) => {
    switch(event.target.id){
        case 'white':
            cake.style.backgroundImage = `url(./sweets_marzipan_cake.png)`
            break;
        case 'pink':
            cake.style.backgroundImage = `url(./king_oukan.png)`;
            break;
        case 'brown':
            cake.style.backgroundImage = `url(./medical_bannouyaku.png)`;
            break;
        default:
            break;
    }
})
