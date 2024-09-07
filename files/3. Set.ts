// Create a set
let uniqueNumbers: Set<number> = new Set([1, 2, 3]);

// Add elements
uniqueNumbers.add(4);
uniqueNumbers.add(2); // Won't add, as 2 is already in the set

// Check existence
console.log(uniqueNumbers.has(3)); // Output: true

// Delete an element
uniqueNumbers.delete(4);
