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

document.addEventListener('mousedown', (event) => {
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
            event.target.style.fontSize = '70px'
        }

        event.target.style.zIndex = `${maxIndex += 1}`
    }
})

document.addEventListener('mousemove', (event) => {
    if(fruit.dom === null) return;
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

document.addEventListener('mouseup', () => {
    fruit.dom = null
    fruit.dom.style.cursor = 'auto';
})

//Create a pseudocode to create a new fruit when the button is clicked

//CLICK the fruit button
    //CREATE a new div element (newFruit)
    //ADD a class attribute of 'fruit'
    //IF the button id is strawberry
        //THEN put a strawberry in the div html
    //APPEND the newFruit to the button

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('fruitBtn')){
        let newFruit = document.createElement('div');
        newFruit.classList.add('fruit');

        switch (event.target.id){
            case 'strawberry':
                newFruit.innerHTML = '🍓';
                break;
        }

        event.target.append(newFruit)
    }
})
