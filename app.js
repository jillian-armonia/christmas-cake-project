let cursor = {
    x: null,
    y: null
}

let fruit = {
    dom: null,
    x: null,
    y: null,
}

let maxIndex = 0;
let container = document.getElementById('container')

document.addEventListener('pointerdown', (event) => {
    if (event.target.classList.contains('fruit')){
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
            event.target.style.fontSize = '70px'
        }

        event.target.style.zIndex = `${maxIndex += 1}`
    }
})

document.addEventListener('pointermove', (event) => {
    if(fruit.dom === null) return;
    event.preventDefault();
    let currentCursor = {
        x: event.clientX,
        y: event.clientY
    }
    let distance = {
        x: currentCursor.x - cursor.x,
        y: currentCursor.y - cursor.y
    }
    fruit.dom.style.left = (fruit.x + distance.x) + "px";
    fruit.dom.style.top = (fruit.y + distance.y) + "px";
    fruit.dom.style.cursor = 'grab';
})

document.addEventListener('pointerup', () => {
    fruit.dom = null
    fruit.dom.style.cursor = 'auto';
})

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
let zoomSpeed = 0.06

document.addEventListener('wheel', (event) => {
    if (event.target.classList.contains('moved')){
        event.preventDefault()
        if (event.deltaY > 0){
            event.target.style.transform = `scale(${(zoom += zoomSpeed)})`;
        } else {
            event.target.style.transform = `scale(${zoom -= zoomSpeed})`
        } //Please limit the largest it can go and the smallest it can go
    }

})

/***********CLEAR BUTTON FEATURES************/
let clearBtn = document.getElementById('clear');

clearBtn.onclick = () => {
    let allFruits = document.querySelectorAll('div.moved');

    allFruits.forEach((movedFruit) => {
        movedFruit.remove();
    })
}
