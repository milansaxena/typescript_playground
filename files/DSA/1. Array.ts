/*
    A collection of elements stored at contiguous memory locations, accessible by index.

    Time Complexity:

    Access: O(1)
    Insertion/Deletion (at end): O(1)
    Insertion/Deletion (at arbitrary position): O(n)

 */

console.log('----- Array -----');    

// Define an array of numbers
let numbers: number[] = [1, 2, 3, 4, 5];

// Access an element
console.log('First node: ', numbers[0]); // Output: 1

// Add an element
numbers.push(6);

// Remove the last element
numbers.pop();

console.log('Updated array: ', numbers.toString()); 
