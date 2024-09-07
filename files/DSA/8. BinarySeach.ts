/*
    Binary search is a more efficient algorithm that works on sorted arrays by repeatedly dividing 
    the search interval in half. It only works if the array is sorted.

    It repeatedly divides the search interval in half. It requires the array to be sorted.
    It has a time complexity of O(log n), where n is the number of elements in the array. 
    
    The compareFn parameter is used to compare elements and is essential for binary search to function correctly.
    
 */

console.log('----- Binary Search -----');

function binarySearch<T>(arr: T[], target: T, compareFn: (a: T, b: T) => number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const comparison = compareFn(arr[mid], target);

        if (comparison === 0) {
            return mid; // Target found
        } else if (comparison < 0) {
            left = mid + 1; // Search in the right half
        } else {
            right = mid - 1; // Search in the left half
        }
    }
    return -1; // Target not found
}

// Comparison function for numbers
const numberCompareFn = (a: number, b: number): number => a - b;

// Example usage
const sortedNumbers = [2, 3, 5, 6, 8];
const index = binarySearch(sortedNumbers, 6, numberCompareFn);
console.log(index); // Output: 3
