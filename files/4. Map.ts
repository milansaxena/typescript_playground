// Create a map
let ages: Map<string, number> = new Map();

// Set key-value pairs
ages.set('Alice', 30);
ages.set('Bob', 25);

// Get a value by key
console.log(ages.get('Alice')); // Output: 30

// Check if a key exists
console.log(ages.has('Bob')); // Output: true

// Delete a key-value pair
ages.delete('Alice');
