/*
    An ordered collection of elements with fixed sizes and potentially different types.
    
    Time Complexity:

    Access: O(1)
    Insertion/Deletion: Not directly supported as tuples are immutable.
 */

console.log('----- Tuple -----'); 

// Define a tuple
let user: [string, number] = ['Alice', 30];

// Access elements
console.log(user[0]); // Output: Alice
console.log(user[1]); // Output: 30

// Update elements
user[1] = 31;
