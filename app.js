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
const rotateRegex = /rotate\(\d+deg\)/;
const scaleRegex = /scale\(\d+\.*\d*\)/;
const scaleXRegex = /scaleX\(\d+\)/
const numberRegex = /\d+\.*\d*/;

function getTransformValues(prop, regex){
    let transform = fruit.dom.style.transform;
    let matchedProp = transform.match(regex);
    let propString = matchedProp[0].match(numberRegex);
    let propValue = Number(propString[0]);

    switch (prop){
        case 'scale':
            scaleValue = propValue;
            break;
        case 'rotate':
            rotateValue = propValue;
            break;
        case 'scaleX':
            flipValue = propValue;
            break;
        default:
            break;
    }
}

document.addEventListener('pointerdown', (event) => {
    if (event.target.classList.contains('fruit') || event.target.classList.contains('letter')){
        event.preventDefault()
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
            scaleValue = 1;
            rotateValue = 0;
            rotateInput.value = rotateValue;
            flipValue = 1;
        }

        event.target.style.zIndex = `${maxIndex += 1}`
        getTransformValues('scale', scaleRegex);
        getTransformValues('rotate', rotateRegex);
        getTransformValues('scaleX', scaleXRegex);

        fruit.dom.style.transform = changeTransformProp()
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
    fruit.dom.style.cursor = 'auto';
    fruit.dom = null

})

/***********DUPLICATE FRUIT FEATURES************/

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('fruitBtn')){
        let newFruit = document.createElement('img');
        newFruit.classList.add('fruit');

        const setFruitAttribute = (src, alt) => {
            newFruit.setAttribute('src', src);
            newFruit.setAttribute('alt', alt);
        }

        switch (event.target.id){
            case 'strawberry':
                setFruitAttribute("./fruits/strawberry.png", 'strawberry');
                break;
            case 'banana':
                setFruitAttribute("./fruits/banana.png", 'banana');
                break;
            case 'melon':
                setFruitAttribute("./fruits/melon.png", 'melon');
                break;
            case 'orange':
                setFruitAttribute("./fruits/orange.png", 'orange slice');
                break;
            case 'cherry':
                setFruitAttribute("./fruits/fruit_sakuranbo.png", 'cherry');
                break;
            case 'apple':
                setFruitAttribute("./fruits/fruit_slice08_apple.png", 'apple slice');
                break;
            case 'pineapple':
                setFruitAttribute("./fruits/fruit_slice03_pineapple_ring.png", 'pineapple ring');
                break;
            case 'peach':
                setFruitAttribute("./fruits/furit_mark16_momo_cut.png", 'peach slice');
                break;
            case 'kiwi-fruit':
                setFruitAttribute("./fruits/cut_fruit_kiwi.png", 'kiwi slice');
                break;
            default:
                break;
        }

        event.target.append(newFruit)
    }

    if (event.target.classList.contains('letterBtn')){
        let newLetter = document.createElement('div');
        newLetter.classList.add('letter');
        newLetter.innerHTML = event.target.id;
        event.target.append(newLetter);
    }
})

/***********ENLARGING AND SHRINKING FEATURES************/
let scaleValue = 1;
let zoomSpeed = 0.1;

document.addEventListener('wheel', (event) => {
    if (event.target.classList.contains('moved')){
        if (event.deltaY > 0 && scaleValue > 0.3){
            scaleValue -= zoomSpeed
            event.target.style.transform = changeTransformProp();
        } else if (event.deltaY < 0 && scaleValue < 3){
            scaleValue += zoomSpeed
            event.target.style.transform = changeTransformProp()
        }
    }
})

/***********CLEAR BUTTON FEATURES************/
const clearBtn = document.getElementById('clear');

clearBtn.onclick = () => {
    let allLetters = document.querySelectorAll('div.moved');
    let allFruits = document.querySelectorAll('img.moved');

    allFruits.forEach((movedFruit) => {
        movedFruit.remove();
    })

    allLetters.forEach((movedLetter) => {
        movedLetter.remove();
    })
}

/***********ROTATE FEATURES************/
const rotateInput = document.getElementById('rotate');
let rotateValue = 0;


rotateInput.addEventListener('input', (event) => {
    rotateValue = event.target.value;
    currentFruit.dom.style.transform = changeTransformProp()
});

let flipBtn = document.getElementById('flip');
let flipValue = 1;

flipBtn.onclick = () => {
    flipValue *= -1;
    currentFruit.dom.style.transform = changeTransformProp()
}

/***********CAKE COLORS FEATURES************/
document.addEventListener('click', (event) => {
    switch(event.target.id){
        case 'white':
            cake.style.backgroundImage = `url(./white-cake.png)`
            break;
        case 'pink':
            cake.style.backgroundImage = `url(./pink-cake.png)`;
            break;
        case 'brown':
            cake.style.backgroundImage = `url(./brown-cake.png)`;
            break;
        default:
            break;
    }
})

/***********ALPHABET LETTERS FEATURES************/
function createLetters(){
    const letters = document.getElementById('letters');

    for (let i = 0; i < 26; i++){
        let button = document.createElement('button');
        button.setAttribute("id", `${String.fromCharCode(65 + i)}`);
        button.classList.add("letterBtn");
        button.innerHTML = `<div class="letter">${String.fromCharCode(65 + i)}</div>`;
        letters.appendChild(button);
    }
}

window.addEventListener('load', createLetters)

/***********REFACTORED FUNCTIONS************/
//CHANGE the string if you add anything to the transform property
function changeTransformProp(){
    let transformString = `scale(${scaleValue}) rotate(${rotateValue}deg) scaleX(${flipValue})`

    return transformString;
}
