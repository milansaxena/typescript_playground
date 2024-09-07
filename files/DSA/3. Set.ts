/*
    A collection of unique values with no specific order, supporting efficient membership tests.
    
    Time Complexity:

    Insertion/Deletion/Lookup: O(1) on average (assuming good hash function, though can be O(n) in worst-case scenarios).

 */

console.log('----- Set -----');

// Create a set
let uniqueNumbers: Set<number> = new Set([1, 2, 3]);

// Add elements
uniqueNumbers.add(4);
uniqueNumbers.add(2); // Won't add, as 2 is already in the set

// Check existence
console.log(uniqueNumbers.has(3)); // Output: true

// Delete an element
uniqueNumbers.delete(4);
