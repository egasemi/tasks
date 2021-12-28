
//variables globales

var formUI = document.querySelector("#form");
var tasksUI = document.querySelector("#tasks");

let tasks = [];

class Task {
    constructor(desc = "", done = false, id = Date.now()) {
        this.desc = desc;
        this.done = done;
        this.id = id;
    }
    get icon() {
        return this.setIcon()
    }
    get text() {
        return this.setText()
    }
    setIcon() {
        if (this.done) {
            return 'done'
        } else {
            return 'check_box_outline_blank'
        }
    }

    setText() {
        if(this.done) {
            return 'text-decoration-line-through'
        } else {
            return ''
        }
    }
}

//function 

const printTasks = () => {
    tasksUI.innerHTML = '';
    jsonTasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = jsonTasks.map(task => {
        return new Task(task.desc, task.done, task.id)
    })

    if (!tasks) {
        tasks = []
    } else {
        tasks.forEach(task => {
            tasksUI.innerHTML += 
            `<div class="alert alert-${task.done ? 'success' : 'danger'} d-flex align-items-center justify-content-between" role="alert" id="${task.id}">
                <span class="material-icons me-3">task</span><b class="${task.text}">${task.desc}</b>
                <span>
                    <button class="btn btn-outline-ligth btn-sm material-icons text-success" id="edit">${task.icon}</button>
                    <button class="btn btn-outline-ligth btn-sm material-icons text-danger" id="del">clear</button>
                </span>
            </div>`
            
        });
    }
}

const save = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
    printTasks()
}

const crud = {
    add: (desc) => {
        var classes = formUI.childNodes[1].classList
        if(desc.trim().length > 0) {
            classes.remove('is-invalid')
            let task = new Task(desc)
            tasks.unshift(task)
        } else {
            classes.add('is-invalid')
            formUI.childNodes[1].classList.add('is-invalid')
        }
    },

    del: (id) => {
        tasks = tasks.filter(task => task.id != id)
    },
    
    edit: (id) => {
        tasks = tasks.map(task => {
            if(task.id == id) {
                task.done = !task.done
                return task
            } else {
                return task
            }
        })
    }
}

// events

formUI.addEventListener('submit', (e) => {
    e.preventDefault()
    let desc = document.querySelector("#desc").value
    crud.add(desc)
    save()
    formUI.reset()
});

document.addEventListener('DOMContentLoaded', printTasks)

tasksUI.addEventListener('click', (e) => {
    e.preventDefault()
    var action = e.path[0].id
    crud[action](e.path[2].id)
    save()
})