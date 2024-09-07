class Node<T> {
    value: T;
    next: Node<T> | null = null;

    constructor(value: T) {
        this.value = value;
    }
}

class LinkedList<T> {
    head: Node<T> | null = null;

    append(value: T): void {
        const newNode = new Node(value);
        if (this.head === null) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    print(): void {
        let current = this.head;
        while (current) {
            console.log(current.value);
            current = current.next;
        }
    }
}

// Example usage
const list = new LinkedList<number>();
list.append(1);
list.append(2);
list.append(3);
list.print(); // Output: 1 2 3
