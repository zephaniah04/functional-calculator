const calculator = document.querySelector('.calculator');
        const keys = calculator.querySelector('.calculator-keys');
        const display = calculator.querySelector('.calculator-display h1');

        // --- Calculator State Variables ---
        let displayValue = '0';
        let firstOperand = null;
        let operator = null;
        let waitingForSecondOperand = false;

        // --- Functions ---

        /**
         * Updates the calculator display with the current displayValue.
         */
        function updateDisplay() {
            display.textContent = displayValue;
        }

        /**
         * @param {string} digit 
         */

        function inputDigit(digit) {
            if (waitingForSecondOperand) {
                displayValue = digit;
                waitingForSecondOperand = false;
            } else {
                displayValue = displayValue === '0' ? digit : displayValue + digit;
            }
        }

        function inputDecimal() {
            if (waitingForSecondOperand) {
                displayValue = '0.';
                waitingForSecondOperand = false;
                return;
            }
            if (!displayValue.includes('.')) {
                displayValue += '.';
            }
        }

        /**
         * Handles operator button presses (+, -, *, /).
         * @param {string} nextOperator 
         */
        function handleOperator(nextOperator) {
            const inputValue = parseFloat(displayValue);

            if (operator && waitingForSecondOperand) {
                operator = nextOperator;
                return;
            }

            if (firstOperand === null && !isNaN(inputValue)) {
                firstOperand = inputValue;
            } else if (operator) {
                const result = performCalculation[operator](firstOperand, inputValue);
                displayValue = `${parseFloat(result.toFixed(7))}`;
                firstOperand = result;
            }

            waitingForSecondOperand = true;
            operator = nextOperator;
        }

        // --- Calculation Logic ---
        const performCalculation = {
            '/': (first, second) => second === 0 ? 'Error' : first / second,
            '*': (first, second) => first * second,
            '+': (first, second) => first + second,
            '-': (first, second) => first - second,
            '=': (first, second) => second,
        };

        /**
         * Resets the calculator to its initial state.
         */
        function resetCalculator() {
            displayValue = '0';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
        }
        
        /**
         * Toggles the sign of the current display value.
         */
        function toggleSign() {
            displayValue = (parseFloat(displayValue) * -1).toString();
        }

        /**
         * Calculates the percentage of the current display value.
         */
        function calculatePercentage() {
            displayValue = (parseFloat(displayValue) / 100).toString();
        }

        //  Event Listener 
        keys.addEventListener('click', (event) => {
            const { target } = event;
            const { value, dataset } = target;

            // Exit if the clicked element is not a button
            if (!target.matches('button')) {
                return;
            }

            switch (dataset.action) {
                case 'operator':
                    handleOperator(value);
                    break;
                case 'decimal':
                    inputDecimal();
                    break;
                case 'clear':
                    resetCalculator();
                    break;
                case 'toggle-sign':
                    toggleSign();
                    break;
                case 'percentage':
                    calculatePercentage();
                    break;
                case 'calculate':
                    handleOperator(value); // Let handleOperator process the '='
                    operator = null; // Reset operator after calculation
                    waitingForSecondOperand = false;
                    break;
                default:
                    // If the key is a number
                    if (!isNaN(value)) {
                        inputDigit(value);
                    }
            }

            updateDisplay();
        });

        // Initial Display Update 
        updateDisplay();
