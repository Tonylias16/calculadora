        let currentInput = '0';
        let previousInput = '';
        let operation = null;
        let resetScreen = false;
        
        const resultDisplay = document.getElementById('result');
        const historyDisplay = document.getElementById('history');
        const themeToggle = document.getElementById('theme-toggle');
        
        // Cargar preferencia de tema
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }
        
        // Alternar modo oscuro
        themeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode');
            
            // Guardar preferencia
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
        
        function updateDisplay() {
            resultDisplay.textContent = currentInput;
            historyDisplay.textContent = previousInput + (operation ? ' ' + operation : '');
        }
        
        function appendNumber(number, event) {
            if (currentInput === '0' || resetScreen) {
                currentInput = '';
                resetScreen = false;
            }
            
            if (number === '.' && currentInput.includes('.')) return;
            
            currentInput += number;
            updateDisplay();
            animateButton(event.target);
        }
        
        function appendOperator(op, event) {
            if (operation !== null) calculate(event);
            previousInput = currentInput;
            operation = op;
            resetScreen = true;
            updateDisplay();
            animateButton(event.target);
        }
        
        function calculate(event) {
            let computation;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            if (isNaN(prev)) return;
            
            switch (operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '/':
                    computation = prev / current;
                    break;
                case '%':
                    computation = prev % current;
                    break;
                default:
                    return;
            }
            
            currentInput = computation.toString();
            operation = null;
            previousInput = '';
            resetScreen = true;
            updateDisplay();
            animateButton(event.target);
        }
        
        function clearAll(event) {
            currentInput = '0';
            previousInput = '';
            operation = null;
            updateDisplay();
            animateButton(event.target);
        }
        
        function backspace(event) {
            if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
                currentInput = '0';
            } else {
                currentInput = currentInput.slice(0, -1);
            }
            updateDisplay();
            animateButton(event.target);
        }
        
        function animateButton(button) {
            button.classList.add('pressed');
            setTimeout(() => {
                button.classList.remove('pressed');
            }, 200);
        }
        
        // Manejo de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                const button = document.querySelector(`.buttons button:not(.operator):not(.equals):not(.clear):not(.delete)[onclick*="${e.key}"]`);
                if (button) {
                    appendNumber(e.key, {target: button});
                }
            }
            else if (e.key === '.') {
                const button = document.querySelector(`.buttons button[onclick*="'.'"]`);
                if (button) {
                    appendNumber('.', {target: button});
                }
            }
            else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') {
                const button = document.querySelector(`.buttons button.operator[onclick*="${e.key}"]`);
                if (button) {
                    appendOperator(e.key, {target: button});
                }
            }
            else if (e.key === 'Enter' || e.key === '=') {
                const button = document.querySelector('.equals');
                if (button) {
                    calculate({target: button});
                }
            }
            else if (e.key === 'Escape') {
                const button = document.querySelector('.clear');
                if (button) {
                    clearAll({target: button});
                }
            }
            else if (e.key === 'Backspace') {
                const button = document.querySelector('.delete');
                if (button) {
                    backspace({target: button});
                }
            }
        });