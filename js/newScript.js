// ------------------ Настройки времени ------------------
var times = {
    focus: 30 * 60,  // 30 минут
    short: 5 * 60,   // короткий перерыв
    long: 15 * 60    // длинный перерыв
}

// ------------------ Начальные переменные ------------------
let currentMode = 'focus'
let sessionIndex = 0
let remainingSeconds = times[currentMode]
let permission = await Notification.requestPermission()

const timerDisplay = document.querySelector('.timer__circle-numbers')
const timerBlock = document.querySelector('.timer')
const btnPlay = document.querySelector('.btn__toggle-play')
const btnStop = document.querySelector('.btn__toggle-stop')
const btnSkip = document.querySelector('.btn-skip')
const dots = document.querySelectorAll('.dot')

let timerStatus = false
let timerInterval = null

// ------------------ Форматирование времени ------------------
function formatTime(seconds) {
    const minut = Math.floor(seconds / 60)
    const second = seconds % 60
    return `${minut.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`
}

// ------------------ Обновление дисплея ------------------
function updateDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds)
}

// ------------------ Обновление режима и фона ------------------
function updateMode() {
    // Меняем id таймера, чтобы CSS применял цвет
    timerBlock.id = currentMode

    // Обновляем label
    const label = timerBlock.querySelector('.label')
    switch (currentMode) {
        case 'focus':
            label.textContent = 'Focus Time'
            break
        case 'short':
            label.textContent = 'Short Break'
            break
        case 'long':
            label.textContent = 'Long Break'
            break
    }
}

// ------------------ Обновление кнопок ------------------
function updateBtns() {
    if (timerStatus) {
        btnPlay.classList.remove('active')
        btnStop.classList.add('active')
    } else {
        btnStop.classList.remove('active')
        btnPlay.classList.add('active')
    }
}

// ------------------ Обновление dots ------------------
function updateDots() {
    dots.forEach((dot, index) => {
        if (index < sessionIndex % 4) {
            dot.classList.add('active')
        } else {
            dot.classList.remove('active')
        }
    })
}

// ------------------ Сброс таймера ------------------
function resetTimer(mode = currentMode, autoStart = true) {
    currentMode = mode
    clearInterval(timerInterval)
    timerStatus = false

    if (mode === 'focus') remainingSeconds = times.focus
    else if (mode === 'short') remainingSeconds = times.short
    else if (mode === 'long') remainingSeconds = times.long

    updateDisplay()
    updateBtns()
    updateMode()
    updateDots()

    // Автоматический старт таймера
    if (autoStart) {
        startTimer()
    }
}

// ------------------ Запуск таймера ------------------
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

            if (currentMode === 'focus') {
                sessionIndex++
                if (sessionIndex % 4 === 0) {
                    resetTimer('long')   // длинный перерыв
                } else {
                    resetTimer('short')  // короткий перерыв
                }
            } else {
                resetTimer('focus')      // после перерыва — фокус
            }

            updateBtns()
        }
    }, 1000)
    if (remainingSeconds <= 0) {
        clearInterval(timerInterval)
        timerStatus = false

        if (currentMode === 'focus') {
            sessionIndex++
            if (sessionIndex % 4 === 0) {
                resetTimer('long')   // таймер стартует автоматически
            } else {
                resetTimer('short')
            }
        } else {
            resetTimer('focus')
        }

        updateBtns()
    }
}

// ------------------ Остановка таймера ------------------
function stopTimer() {
    if (!timerStatus) return
    timerStatus = false
    clearInterval(timerInterval)
    updateBtns()
}

// ------------------ Кнопка Skip ------------------
btnSkip.addEventListener('click', () => {
    if (currentMode === 'focus') {
        sessionIndex++
        if (sessionIndex % 4 === 0) {
            resetTimer('long', true)   // автостарт = true
        } else {
            resetTimer('short', true)
        }
    } else {
        resetTimer('focus', true)
    }
})



// ------------------ Кнопки Play/Stop ------------------
btnPlay.addEventListener('click', startTimer)
btnStop.addEventListener('click', stopTimer)

// ------------------ Инициализация ------------------
updateDisplay()
updateMode()
updateDots()
updateBtns()