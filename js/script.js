var times = {
    focus: 30 * 60,
    short: 5 * 60,
    long: 15 * 60
}

let currentMode = 'focus'

const timerDisplay = document.querySelector('.timer__circle-numbers')
const timerBlock = document.querySelector('.timer')
const btnPlay = document.querySelector('.btn__toggle-play')
const btnStop = document.querySelector('.btn__toggle-stop')
const btnSkip = document.querySelector('.btn-skip')
const dots = document.querySelectorAll('.dot')


let sessionIndex = 0
let remainingSeconds = 30 * 60

var timerStatus = false
var timerInterval = null

function formatTime(times) {
    const minut = Math.floor(times / 60)
    const second = times % 60
    return `${minut.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds)
}

function updateMode() {
    timerDisplay.id = currentMode
}

function updateBtns() {
    if (timerStatus) {
        btnPlay.classList.remove('active')
        btnStop.classList.add('active')
    } else {
        btnStop.classList.remove('active')
        btnPlay.classList.add('active')
    }
}
// FFFFFFFFFFFFFFFF
// function toggleTimer() {
//     if (timerStatus) {
//         stopTimer()
//         console.log(2)
//     } else if (!timerStatus) {
//         startTimer()
//         console.log(1)
//     }

// }

function startTimer() {
    if (timerStatus) return
    timerStatus = true
    updateBtns()
    timerInterval = setInterval(() => {
        remainingSeconds--
        updateDisplay()
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval)
            timerStatus = false
            remainingSeconds = times.short
            console.log(currentMode)
            resetTImer('short')
            updateMode()
            updateDisplay()
            updateBtns()
        }
    }, 1000)
}

function stopTimer() {
    if (!timerStatus) return
    timerStatus = false
    clearInterval(timerInterval)
    updateBtns()
}

function resetTimer(mode = currentMode) {
    currentMode = mode
    clearInterval(timerInterval)
    timerStatus = false
    remainingSeconds = times.currentMode
    updateDisplay()
    updateBtns()
    updateMode()
}

btnSkip.addEventListener('click', () => {
    if (currentMode === 'focus') {
        resetTimer('short')
    } else {
        resetTimer('focus')
    }
}
)

btnPlay.addEventListener('click', startTimer)
btnStop.addEventListener('click', stopTimer)

updateDisplay()