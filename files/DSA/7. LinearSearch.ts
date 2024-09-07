/*
    Linear Search

    Linear search is a simple search algorithm that checks each element of the list 
    sequentially until the target element is found or the list ends.

    It iterates through each element in the array and compares it with the target. 
    It has a time complexity of O(n), where n is the number of elements in the array.

 */

console.log('----- Linear Search -----');

function linearSearch<T>(arr: T[], target: T): number {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Return the index of the target
        }
    }
    return -1; // Return -1 if the target is not found
}

// Example usage
const numbers = [5, 3, 8, 6, 2];
const index = linearSearch(numbers, 6);
console.log(index); // Output: 3
