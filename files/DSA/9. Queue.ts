/*
    A queue is a linear data structure that follows the First In, First Out (FIFO) principle. Elements are added at the rear (end) and removed from the front.

    Time Complexity:

    Enqueue (add an element): O(1)
    Dequeue (remove an element): O(1)
    Peek (view the front element): O(1)
    
    Example: Think of a line of people waiting at a checkout counter where the first person in line is the first to be served.

    Note: Both stacks and queues can be implemented using arrays or linked lists, and their operations are efficient due to the constant time 
    complexity for adding, removing, and accessing elements at their respective ends.

 */
console.log('----- Queue -----');

class Queue<T> {
    private items: T[] = [];

    // Enqueue an element to the queue
    enqueue(item: T): void {
        this.items.push(item);
    }

    // Dequeue an element from the queue
    dequeue(): T | undefined {
        return this.items.shift();
    }

    // Peek at the front element of the queue
    peek(): T | undefined {
        return this.items[0];
    }

    // Check if the queue is empty
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    // Get the size of the queue
    size(): number {
        return this.items.length;
    }
}

// Example usage
const queue = new Queue<number>();
queue.enqueue(10);
queue.enqueue(20);
console.log(queue.peek()); // Output: 10
console.log(queue.dequeue()); // Output: 10
console.log(queue.isEmpty()); // Output: false
    
    
