/*
    A stack is a linear data structure that follows the Last In, First Out (LIFO) principle. Elements are added and removed from the same end, called the "top."

    Time Complexity:

    Push (add an element): O(1)
    Pop (remove an element): O(1)
    Peek (view the top element): O(1)
    
    Example: Think of a stack of plates where you can only add or remove the top plate

 */

console.log('----- Stack -----');

class Stack<T> {
    private items: T[] = [];

    // Push an element onto the stack
    push(item: T): void {
        this.items.push(item);
    }

    // Pop an element from the stack
    pop(): T | undefined {
        return this.items.pop();
    }

    // Peek at the top element of the stack
    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    // Check if the stack is empty
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    // Get the size of the stack
    size(): number {
        return this.items.length;
    }
}

// Example usage
const stack = new Stack<number>();
stack.push(10);
stack.push(20);
console.log(stack.peek()); // Output: 20
console.log(stack.pop());  // Output: 20
console.log(stack.isEmpty()); // Output: false
    
