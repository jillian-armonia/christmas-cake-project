let cursor = {
    x: null,
    y: null,
}

let item = {
    dom: null,
    x: null,
    y: null,
}

let currentItem = {
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
    },

    calcFingerDistance(){
        let dx = this.x2 - this.x1;
        let dy = this.y2 - this.y1;
        return Math.sqrt(dx * dx + dy * dy);
    }


}

const cake = document.getElementById('cake');

function onTouchStart(event){
    event.preventDefault();
    event.stopPropagation();

    if (event.target.classList.contains('fruit')){
        //IF there is only ONE finger used (MOVE FEATURE)...

        if (event.touches.length === 1){
            cursor = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            }

            item = {
                dom: event.touches[0].target,
                x: event.touches[0].target.getBoundingClientRect().left,
                y: event.touches[0].target.getBoundingClientRect().top
            }
        }
    } else if (event.touches.length === 2){
        input.storeFingerPosition(event)
        input.startDistance = input.calcFingerDistance();
    }


        //IF there are TWO fingers used (PINCH SCALE FEATURE)...
}

function onTouchMove(event){
    if (item.dom === null) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.touches.length == 1){
        let currentCursor = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };

        let distance = {
            x: currentCursor.x - cursor.x,
            y: currentCursor.y - cursor.y
        }

        currentItem = {
            x: item.x + distance.x,
            y: item.y + distance.y
        }

        item.dom.style.left = (currentItem.x) + "px";
        item.dom.style.top = (currentItem.y) + "px";
    } else if (event.touches.length == 2){
        input.storeFingerPosition(event);
        let newDistance = input.calcFingerDistance();
        let scaleChange = newDistance - input.startDistance;
        input.currentScale = input.startScale + scaleChange * 0.01;

        if (input.currentScale <= 2 || input.currentScale >= 0.3){
            item.dom.style.transform = `scale(${scaleChange})`
        }

    }
}

function onTouchEnd(event){
    event.preventDefault();
    event.stopPropagation();

    item.dom.parentNode.removeChild(item.dom);
    cake.appendChild(item.dom);
    currentItem.dom = item.dom;
    item.dom = null;
}

document.addEventListener('touchstart', onTouchStart);
document.addEventListener('touchmove', onTouchMove);
document.addEventListener('touchend', onTouchEnd)
