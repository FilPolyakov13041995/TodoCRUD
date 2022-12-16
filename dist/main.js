const urlLimit10 = 'https://jsonplaceholder.typicode.com/todos?_limit=10';
const urlAllTasks = 'https://jsonplaceholder.typicode.com/todos';
class TodoToHTML {
    constructor(id, completed, title) {
        this.id = id;
        this.completed = completed;
        this.title = title;
        this.id = id;
        this.completed = completed;
        this.title = title;
    }
    renderHTML() {
        const taskCard = document.querySelector('.task__card');
        taskCard.insertAdjacentHTML('beforeend', `
            <li id="todo${this.id}">
                <div class="name__task">${this.title}</div>
                <div class="control__task">
                    <input onchange="upDate(${this.id})" type="checkbox" ${this.completed && 'checked'}>
                    <img onclick="delTodo(${this.id})" src="img/close-delete-remove-3-svgrepo-com.svg" alt="delete">
                </div>
            </li>
        `);
    }
}
//==================================GET======================================//
function getAllTodos(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Что-то не так с сервером...');
        }
        else {
            return response.json();
        }
    });
}
getAllTodos(urlLimit10)
    .then(data => {
    data.forEach(({ id, completed, title }) => {
        new TodoToHTML(id, completed, title).renderHTML();
    });
})
    .catch(err => console.log(err));
//===========================POST===============================//
const addTodo = document.getElementById('addTodo');
addTodo.addEventListener('click', (event) => {
    event.preventDefault();
    const input = document.getElementById('todoText');
    const title = input.value;
    if (title) {
        const postTodo = (method, url) => {
            return fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, completed: false })
            })
                .then(response => {
                if (!response.ok) {
                    throw new Error('Что-то не так с сервером...');
                }
                else {
                    return response.json();
                }
            });
        };
        postTodo('POST', urlAllTasks)
            .then(data => new TodoToHTML(data.id, data.completed, data.title).renderHTML())
            .catch(err => console.log(err));
        input.value = '';
    }
});
//========================DELETE=============================//
function delTodo(id) {
    return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Что-то не так с сервером...');
        }
        else {
            return response.json();
        }
    })
        .then(data => {
        if (data) {
            document.getElementById(`todo${id}`).remove();
        }
    })
        .catch(err => console.log(err));
}
//========================UPDATE================================//
function upDate(id) {
    const completed = document.querySelector(`#todo${id} input`).checked;
    return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed })
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Что-то не так с сервером...');
        }
        else {
            return response.json();
        }
    })
        .catch(err => console.log(err));
}
