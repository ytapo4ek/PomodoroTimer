class pomodoroTimer {
    constructor(options = {}) {
        this.root = document.querySelector(options.rootSelector)
        this.times = options.times || {
            focus: 30 * 60,  // 30 минут
            short: 5 * 60,   // короткий перерыв
            long: 15 * 60    // длинный перерыв
        }

        // ------------------ Начальные переменные ------------------
        this.currentMode = 'focus'
        this.sessionIndex = 0
        this.remainingSeconds = this.times[this.currentMode]
        this.timerStatus = false
        this.timerInterval = null

        this.timerDisplay = document.querySelector('.timer__circle-numbers')
        this.timerBlock = document.querySelector('.timer')
        this.btnPlay = document.querySelector('.btn__toggle-play')
        this.btnStop = document.querySelector('.btn__toggle-stop')
        this.btnSkip = document.querySelector('.btn-skip')
        this.dots = document.querySelectorAll('.dot')
        this.notify = document.getElementById('notifyTrigger')

        this.bindivents()
        this.updateDisplay()
        this.updateBtns()
        this.updateMode()
        this.updateDots()
    }
    // ------------------ Назначение кнопок ------------------
    bindivents() {
        this.btnPlay.addEventListener('click', () => this.startTimer())
        this.btnStop.addEventListener('click', () => this.stopTimer())
        this.btnSkip.addEventListener('click', () => this.skipTimer())
        if (this.notify) {
            this.notify.addEventListener('click', () => this.requestNotify())

        }

    }
    // ------------------ Запрос на уведомления ------------------
    requestNotify() {
        if (!('Notification' in window)) {
            alert('Браузер не поддерживает уведомления')
            return
        }
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                this.notify.style.display = 'none'
            }
        })
    }
    // ------------------ Форматирование времени ------------------
    formatTime(seconds) {
        const minut = Math.floor(seconds / 60)
        const second = seconds % 60
        return `${minut.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`
    }
    // ------------------ Обновление дисплея ------------------
    updateDisplay() {
        this.timerDisplay.textContent = this.formatTime(this.remainingSeconds)
    }
    // ------------------ Обновление режима и фона ------------------
    updateMode() {
        // Меняем id таймера, чтобы CSS применял цвет
        this.timerBlock.id = this.currentMode

        // Обновляем label
        const label = this.timerBlock.querySelector('.label')
        switch (this.currentMode) {
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
    updateBtns() {
        if (this.timerStatus) {
            this.btnPlay.classList.remove('active')
            this.btnStop.classList.add('active')
        } else {
            this.btnStop.classList.remove('active')
            this.btnPlay.classList.add('active')
        }
    }
    // ------------------ Обновление dots ------------------
    updateDots() {
        this.dots.forEach((dot, index) => {
            if (index < this.sessionIndex % 4) {
                dot.classList.add('active')
            } else {
                dot.classList.remove('active')
            }
        })
    }
    // ------------------ Сброс таймера ------------------
    resetTimer(mode = this.currentMode, autoStart = true) {
        this.currentMode = mode
        clearInterval(this.timerInterval)
        this.timerStatus = false

        if (mode === 'focus') this.remainingSeconds = this.times.focus
        else if (mode === 'short') this.remainingSeconds = this.times.short
        else if (mode === 'long') this.remainingSeconds = this.times.long
        // this.reminingSeconds = this.timer[mode]

        this.updateDisplay()
        this.updateBtns()
        this.updateMode()
        this.updateDots()

        // Автоматический старт таймера
        if (autoStart) {
            this.startTimer()
        }
    }
    startTimer() {
        if (this.timerStatus) return
        this.timerStatus = true
        this.updateBtns()
        const greeting = new Notification('pomodoro запущен!')
        setTimeout(() => greeting.close(), 2000)
        this.timerInterval = setInterval(() => {
            this.remainingSeconds--
            this.updateDisplay()

            if (this.remainingSeconds <= 0) {
                clearInterval(this.timerInterval)
                this.timerStatus = false

                if (this.currentMode === 'focus') {
                    this.sessionIndex++
                    if (this.sessionIndex % 4 === 0) {
                        this.resetTimer('long')   // длинный перерыв
                    } else {
                        this.resetTimer('short')  // короткий перерыв
                    }
                } else {
                    this.resetTimer('focus')      // после перерыва — фокус
                }

                this.updateBtns()
            }
        }, 1000)
        if (this.remainingSeconds <= 0) {
            clearInterval(this.timerInterval)
            this.timerStatus = false

            if (this.currentMode === 'focus') {
                this.sessionIndex++
                if (this.sessionIndex % 4 === 0) {
                    this.resetTimer('long')   // таймер стартует автоматически
                } else {
                    this.resetTimer('short')
                }
            } else {
                this.resetTimer('focus')
            }

            this.updateBtns()
        }
    }
    // ------------------ Остановка таймера ------------------
    stopTimer() {
        if (!this.timerStatus) return
        this.timerStatus = false
        clearInterval(this.timerInterval)
        this.updateBtns()
    }
    // ------------------ Кнопка Skip ------------------
    skipTimer() {

        if (this.currentMode === 'focus') {
            this.sessionIndex++
            if (this.sessionIndex % 4 === 0) {
                this.resetTimer('long', true)   // автостарт = true
            } else {
                this.resetTimer('short', true)
            }
        } else {
            this.resetTimer('focus', true)
        }
    }
}

const pomodoro = new pomodoroTimer()