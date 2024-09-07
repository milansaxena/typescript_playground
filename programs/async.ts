async function fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
}

fetchData('https://jsonplaceholder.typicode.com/todos/1')
    .then(data => console.log('data: ', JSON.stringify(data)))
    .catch(error => console.error(error));