const urlLimit10: string = 'https://jsonplaceholder.typicode.com/todos?_limit=10';
const urlAllTasks: string = 'https://jsonplaceholder.typicode.com/todos';

class TodoToHTML {
    constructor (
        public id: string, 
        public completed: string, 
        public title: string) {

            this.id = id
            this.completed = completed
            this.title = title
    }

    renderHTML() {
        const taskCard: HTMLDivElement = document.querySelector('.task__card');
        taskCard.insertAdjacentHTML('beforeend', `
            <li id="todo${this.id}">
                <div class="name__task">${this.title}</div>
                <div class="control__task">
                    <input onchange="changeStatusTodo(${this.id})" type="checkbox" ${this.completed && 'checked'}>
                    <img onclick="deleteTodo(${this.id})" src="img/close-delete-remove-3-svgrepo-com.svg" alt="delete">
                </div>
            </li>
        `);
    }
}


//==================================GET======================================//
function getAllTodo(url: string): Promise<any> {
    return fetch(url).then(response => {
        if(!response.ok) {
            throw new Error('Что-то не так с сервером...');
        } else {
            return response.json();
        }
    });
}

getAllTodo(urlLimit10)
    .then(data => {
        data.forEach(({id, completed, title}) => {
            new TodoToHTML(id, completed, title).renderHTML()
        });
    })
    .catch(err => console.log(err))



//===========================POST===============================//
const addTodoButton: HTMLElement = document.getElementById('addTodo');

addTodoButton.addEventListener('click', (event) => {
    event.preventDefault();
    const input = document.getElementById('todoText') as HTMLInputElement
    const title = input.value;

    if(title) {
        const postTodo = (method: string, url: string): Promise<any> => {
            return fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title, completed: false})
            })
            .then(response => {
                if(!response.ok) {
                    throw new Error('Что-то не так с сервером...');
                } else {
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
function deleteTodo(id: string): Promise<any> {
    return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Что-то не так с сервером...');
        } else {
            return response.json();
        }
    })
    .then(data => {
        if(data) {
            document.getElementById(`todo${id}`).remove();
        }
    })
    .catch(err => console.log(err));
}

//========================UPDATE================================//
function changeStatusTodo(id: string): Promise<Response> {
    const completed: HTMLInputElement = document.querySelector(`#todo${id} input`) 
    if(completed.checked) {
        return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({completed})
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Что-то не так с сервером...');
        } else {
            return response.json();
        }
    })
    .catch(err => console.log(err));
    }
}