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

let input = {
    startDistance: 0,
    x1: null,
    y1: null,
    x2: null,
    y2: null,
    startScale: 1,
    currentScale: 1,

    storeFingerPosition(event){
        this.x1 = event.touches[0].clientX;
        this.y1 = event.touches[0].clientY;
        this.x2 = event.touches[1].clientX;
        this.y2 = event.touches[1].clientY;
        fruit.dom = event.touches[0].target
    },

    calcFingerDistance(){
        let dx = this.x2 - this.x1;
        let dy = this.y2 - this.y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    reset(){
        this.startDistance = 0;
        this.x1 = null;
        this.y1 = null;
        this.x2 = null;
        this.y2 = null;
    },

    setStartScale(){
        getTransformValues('scale', scaleRegex);
        this.startScale = scaleValue;
    }
}

let maxIndex = 0;
const container = document.getElementById('container');
const menu = document.getElementById('menu');
const letters = document.getElementById('letters');
const cake = document.getElementById('cake');
const rotateRegex = /rotate\(\d+deg\)/;
const scaleRegex = /scale\(\d+\.*\d*\)/;
const scaleXRegex = /scaleX\(\d+\)/
const numberRegex = /\d+\.*\d*/;
let prevDiff = -1;
let scaleValue = 1;
let transX = 0;
let transY = 0;

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

document.addEventListener('touchstart', (event) => {
    if (event.target.classList.contains('fruit') || event.target.classList.contains('letter')){
        event.preventDefault();
        event.stopPropagation();

        switch(event.touches.length){
            case 1:
                cursor = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                }
                fruit = {
                    dom: event.touches[0].target,
                    x: event.touches[0].target.getBoundingClientRect().left,
                    y: event.touches[0].target.getBoundingClientRect().top
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
                break;

            case 2:
                input.storeFingerPosition(event);
                input.startDistance = input.calcFingerDistance();
                input.setStartScale();
                break;
        }

            event.target.style.zIndex = `${maxIndex += 1}`
            getTransformValues('scale', scaleRegex);
            getTransformValues('rotate', rotateRegex);
            getTransformValues('scaleX', scaleXRegex);

            fruit.dom.style.transform = changeTransformProp()
    }

})

document.addEventListener('touchmove', (event) => {
    if(fruit.dom === null) return;

    event.preventDefault();
    event.stopPropagation();

    switch(event.touches.length){
        case 1:
            let currentCursor = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
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
            break;

        case 2:
            input.storeFingerPosition(event);
            let newDistance = input.calcFingerDistance();
            let scaleChange = newDistance - input.startDistance;
            input.currentScale = input.startScale + scaleChange * 0.01;
            scaleValue = input.currentScale;

            if (scaleValue > 3) scaleValue = 3;
            if (scaleValue < 1) scaleValue = 1;

            fruit.dom.style.transform = changeTransformProp()

            //CENTER the image after scaling
            transX = ((fruit.dom.offsetWidth * scaleValue) / 2) - (fruit.dom.offsetWidth / 2);
            transY = ((fruit.dom.offsetHeight * scaleValue) / 2) - (fruit.dom.offsetHeight / 2);

            transX = transX / scaleValue;
            transY = transY / scaleValue;
    }
})

document.addEventListener('touchend', () => {
    //Removes the fruit whenever it's around the menu
        if (currentFruit.x >= menu.getBoundingClientRect().left - 100 || fruit.dom.style.left == '' || currentFruit.x <= letters.getBoundingClientRect().left + 100) {
            fruit.dom.remove();
            currentFruit.dom = null;
        } else {
            fruit.dom.parentNode.removeChild(fruit.dom);
            cake.appendChild(fruit.dom);
            currentFruit.dom = fruit.dom;
        }

        input.reset();
        prevDiff = -1;
        fruit.dom = null;
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
                setFruitAttribute("./fruits/cherry.png", 'cherry');
                break;
            case 'apple':
                setFruitAttribute("./fruits/apple.png", 'apple slice');
                break;
            case 'pineapple':
                setFruitAttribute("./fruits/pineapple.png", 'pineapple ring');
                break;
            case 'peach':
                setFruitAttribute("./fruits/peach.png", 'peach slice');
                break;
            case 'kiwi-fruit':
                setFruitAttribute("./fruits/kiwifruit.png", 'kiwi slice');
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
// let zoomSpeed = 0.1;

// document.addEventListener('wheel', (event) => {
//     if (event.target.classList.contains('moved')){
//         if (event.deltaY > 0 && scaleValue > 1){
//             scaleValue -= zoomSpeed
//             event.target.style.transform = changeTransformProp();
//         } else if (event.deltaY < 0 && scaleValue < 3){
//             scaleValue += zoomSpeed
//             event.target.style.transform = changeTransformProp()
//         }
//     }

//         transX = ((event.target.offsetWidth * scaleValue) / 2) - (event.target.offsetWidth / 2);
//         transY = ((event.target.offsetHeight * scaleValue) / 2) - (event.target.offsetHeight / 2);

//         transX = transX / scaleValue;
//         transY = transY / scaleValue;
//         event.target.style.transform = changeTransformProp()
// })

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
            cake.style.backgroundImage = `url(./whitecake.png)`
            break;
        case 'pink':
            cake.style.backgroundImage = `url(./pinkcake.png)`;
            break;
        case 'brown':
            cake.style.backgroundImage = `url(./browncake.png)`;
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
    let transformString = `scale(${scaleValue}) rotate(${rotateValue}deg) scaleX(${flipValue}) translate(${transX}px, ${transY}px)`

    return transformString;
}
