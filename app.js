document.addEventListener("DOMContentLoaded", () => {
    // Esta constante se encarga de almacenar la lista donde se mostrarán las tareas
    const todoList = document.getElementById("TodoList");

    // Esta constante muestra un mensaje si no hay tareas en la lista
    const noTasksMessage = document.getElementById("noTasksMessage");

    // Aquí capturo el formulario que me permitirá agregar nuevas tareas
    const addTaskForm = document.getElementById("addTaskForm");

    // Recupero las tareas que he guardado previamente en el almacenamiento local, o creo un array vacío si no hay ninguna
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    // Esta función se encarga de mostrar todas las tareas en la interfaz
    const renderTodos = () => {
        // Limpio la lista antes de agregar las tareas actualizadas
        todoList.innerHTML = "";

        // Si hay tareas, oculto el mensaje de "No hay tareas"; de lo contrario, lo muestro
        noTasksMessage.classList.toggle("d-none", todos.length > 0);

        // Recorro cada tarea y la agrego a la lista
        todos.forEach((todo, index) => {
            // Creo un elemento 'li' para cada tarea
            const todoItem = document.createElement("li");
            todoItem.className = `todoItem ${todo.completed ? 'completed' : ''}`;

            // Aquí defino el contenido de cada tarea en la lista
            todoItem.innerHTML = `
                <div class="title">${todo.title}</div>
                <div class="description">${todo.description}</div>
                <div class="date-time">${todo.date} ${todo.time}</div>
                <div class="actions">
                    <input type="checkbox" id="checkbox" ${todo.completed ? 'checked' : ''}>
                    <button class="btn-delete">
                        <i class="bi bi-trash3-fill" style="font-size: 1.3rem;"></i>
                    </button>
                </div>
            `;

            // Agrego la tarea al DOM
            todoList.appendChild(todoItem);

            // Manejo el cambio de estado de la tarea (completada/no completada)
            todoItem.querySelector("#checkbox").addEventListener("change", () => {
                todos[index].completed = !todos[index].completed;
                updateLocalStorage();
                renderTodos(); // Vuelvo a renderizar las tareas para reflejar los cambios
            });

            // Manejo la eliminación de una tarea
            todoItem.querySelector(".btn-delete").addEventListener("click", () => {
                todos.splice(index, 1); // Elimino la tarea del array
                updateLocalStorage();
                renderTodos(); // Vuelvo a renderizar las tareas después de eliminar una
            });
        });
    };

    // Esta función guarda las tareas actualizadas en el almacenamiento local
    const updateLocalStorage = () => {
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    // Aquí manejo el evento de envío del formulario para agregar una nueva tarea
    addTaskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Obtengo y limpio los valores ingresados por el usuario
        const title = document.getElementById("taskTitle").value.trim();
        const description = document.getElementById("taskDescription").value.trim();
        const date = document.getElementById("taskDate").value;
        const time = document.getElementById("taskTime").value;

        // Valido que todos los campos estén completos antes de agregar la tarea
        if (title === "" || description === "" || date === "" || time === "") {
            Swal.fire({
                title: 'Error!',
                text: 'Todos los campos son requeridos.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        } else if (todos.some(todo => todo.title.toLowerCase() === title.toLowerCase() && todo.date === date && todo.time === time)) {
            Swal.fire({
                title: 'Error!',
                text: 'La tarea ya existe.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        } else {
            // Agrego la nueva tarea al array y actualizo la interfaz y el almacenamiento
            todos.push({ title, description, date, time, completed: false });
            updateLocalStorage();
            renderTodos();
            
            // Cierro el modal después de agregar la tarea
            const modalElement = document.getElementById('addTaskModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();

            // Reseteo el formulario para dejarlo limpio para la próxima tarea
            addTaskForm.reset();
        }
    });

    // Esta función se encarga de actualizar y mostrar la fecha actual en la interfaz
    const updateDate = () => {
        const dateElement = document.getElementById("currentDate");
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
        dateElement.textContent = `Hoy, ${now.toLocaleDateString('es-ES', options)}`;
    };

    // Llamo a las funciones iniciales cuando la página carga
    updateDate();
    renderTodos();
});
