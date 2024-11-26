let cursor = {
    x: null,
    y: null
}

let fruit = {
    dom: null,
    x: null,
    y: null,
}

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
        console.table(fruit)
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
