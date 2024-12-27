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
const container = document.getElementById('container');
const menu = document.getElementById('menu');
const letters = document.getElementById('letters');
const cake = document.getElementById('cake');
const rotateRegex = /rotate\(\d+deg\)/;
const scaleRegex = /scale\(\d+\.*\d*\)/;
const scaleXRegex = /scaleX\(\d+\)/
const numberRegex = /\d+\.*\d*/;
const evCache = [];
let prevDiff = -1;

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
        //PUSH the event  to the event cache to count the number of pointers
        evCache.push(event)

        //IF there is only one event, continue to the move feature
        if (evCache.length < 2){
            event.preventDefault();
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
    }

})

document.addEventListener('pointermove', (event) => {
    /***********ENLARGING AND SHRINKING BY PINCH ZOOM************/
    //FIND the index of the current event in the evCache
    const index = evCache.findIndex(
        (cachedEv) => cachedEv.pointerId === event.pointerId
    )
    //REASSIGN the cached event with the current event
    evCache[index] = event;

    //IF there is only one pointerID, continue to the move feature
    if (evCache.length == 1){
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
    } else if (evCache.length === 2){ //ELSE IF there are two pointerIDs AND they are the same, continue to zoom feature
        const absDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);

        if (prevDiff > 0){
            if (absDiff > prevDiff && scaleValue < 3){
                scaleValue += zoomSpeed;
                event.target.style.transform = changeTransformProp();
            } else if (absDiff < prevDiff && scaleValue > 0.7){
                scaleValue -= zoomSpeed;
                event.target.style.transform = changeTransformProp();
            }
        }

        prevDiff = absDiff
    }

})

document.addEventListener('pointerup', (event) => {
    /***********ENLARGING AND SHRINKING BY PINCH ZOOM************/
    //IF there had been two pointers
        //REMOVE the pointer from the cache
    function removeEvent(ev){
        for (let i = 0; i < evCache.length; i++){
            if (evCache[i].pointerId == ev.pointerId){
                evCache.splice(i, 1);
                break;
            }
        }
    }

    if (evCache.length > 1) removeEvent(event);
    //ELSE IF there had been only one pointer, reset the diff tracker and continue to the move feature
    //Removes the fruit whenever it's around the menu
    if (evCache.length == 1){
        if (currentFruit.x >= menu.getBoundingClientRect().left - 100 || fruit.dom.style.left == '' || currentFruit.x <= letters.getBoundingClientRect().left + 100) {
            fruit.dom.remove();
            currentFruit.dom = null;
        } else {
            fruit.dom.parentNode.removeChild(fruit.dom);
            cake.appendChild(fruit.dom);
            currentFruit.dom = fruit.dom;
        }

        prevDiff = -1;
        fruit.dom.style.cursor = 'pointer';
        fruit.dom = null
        removeEvent(event);
    }



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
let scaleValue = 1;
let zoomSpeed = 0.1;

document.addEventListener('wheel', (event) => {
    if (event.target.classList.contains('moved')){
        if (event.deltaY > 0 && scaleValue > 0.7){
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
    let transformString = `scale(${scaleValue}) rotate(${rotateValue}deg) scaleX(${flipValue})`

    return transformString;
}
