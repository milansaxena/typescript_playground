// math.ts
function add(a: number, b: number): number {
    return a + b;
}

function subtract(a: number, b: number): number {
    return a - b;
}

function multiply(a: number, b: number): number {
    return a * b;
}

function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Error('Division by zero is not allowed');
    }
    return a / b;
}

console.log('Add: ', add(10, 5));
console.log('Subtract: ', subtract(10, 5));
console.log('Multiply: ', multiply(10, 5));
console.log('Divide: ', divide(10, 5));
