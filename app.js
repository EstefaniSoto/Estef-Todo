// Esta línea de código se asegura de que la página esté totalmente lista antes de que comience a ejecutarse el JavaScript.
document.addEventListener("DOMContentLoaded", () => {
    // Obtener elementos del DOM
    const todoList = document.getElementById("TodoList"); // Contenedor de la lista de tareas
    const noTasksMessage = document.getElementById("noTasksMessage"); // Mensaje cuando no hay tareas
    const addTodoForm = document.querySelector(".AddTodoForm"); // Formulario para agregar nuevas tareas
    const todoInput = document.getElementById("todoInput"); // Campo de entrada para nueva tarea

    // Recuperar la lista de tareas almacenada en localStorage o iniciar una lista vacía
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    // Función para renderizar las tareas en el DOM
    const renderTodos = () => {
        todoList.innerHTML = ""; // Limpiar la lista de tareas actual en el DOM
        
        // Mostrar u ocultar el mensaje que verifica si hay o no tarea
        noTasksMessage.classList.toggle("d-none", todos.length > 0);

        todos.forEach((todo, index) => {
            // Crear un nuevo elemento de lista para cada tarea
            const todoItem = document.createElement("li");
            todoItem.className = "d-flex justify-content-between todoList mb-2";
            todoItem.innerHTML = `
                <div class="d-flex gap-2 align-items-center">
                    <input type="checkbox" id="checkbox" ${todo.completed ? 'checked' : ''}>
                    <p class="text ${todo.completed ? 'line-through' : ''}">${todo.text}</p>
                </div>
                <button class="btn-delete">
                    <i class="bi bi-trash3-fill" style="font-size: 1.3rem;"></i>
                </button>
            `;
            // Añadir el nuevo elemento a la lista
            todoList.appendChild(todoItem);

            // Manejar el cambio en el estado del checkbox (completar tarea)
            todoItem.querySelector("#checkbox").addEventListener("change", () => {
                todos[index].completed = !todos[index].completed; // Cambiar el estado completado
                updateLocalStorage(); // Actualizar el almacenamiento local
                renderTodos(); // Volver a renderizar la lista de tareas
            });

            // Manejar el clic en el botón de eliminar tarea
            todoItem.querySelector(".btn-delete").addEventListener("click", () => {
                todos.splice(index, 1); // Eliminar la tarea del array
                updateLocalStorage(); // Actualizar el almacenamiento local
                renderTodos(); // Volver a renderizar la lista de tareas
            });
        });
    };

    // Función para actualizar el almacenamiento local con la lista de tareas
    const updateLocalStorage = () => {
        localStorage.setItem("todos", JSON.stringify(todos)); // Guardar la lista de tareas en localStorage
    };

    // Manejar el envío del formulario para agregar una nueva tarea
    addTodoForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Evitar el envío del formulario por defecto
        
        // Obtiene el texto de la nueva tarea y elimina espacios en blanco al principio y al final
        const newTodoText = todoInput.value.trim();
        
        // Valida que el texto no esté vacío y que la tarea no exista ya
        if (newTodoText === "") {
            // Mostrar alerta si el texto está vacío
            Swal.fire({
                title: 'Error!',
                text: 'La tarea no puede estar vacía.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                didOpen: () => {
                    document.body.style.overflow = 'hidden'; // Evita el scroll
                },
                didClose: () => {
                    document.body.style.overflow = ''; // Restaura el scroll
                }
            });
            

        } else if (todos.some(todo => todo.text.toLowerCase() === newTodoText.toLowerCase())) {
            // Mostrar alerta si la tarea ya existe (sin importar mayúsculas o minúsculas)
            Swal.fire({
                title: 'Error!',
                text: 'La tarea ya existe.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });

        } else {
            // Añadir nueva tarea a la lista si la validación es exitosa
            todos.push({ text: newTodoText, completed: false });
            updateLocalStorage(); // Actualizar el almacenamiento local
            renderTodos(); // Volver a renderizar la lista de tareas
            todoInput.value = ""; // Limpiar el campo de entrada
        }
    });

    // Función para actualizar la fecha actual en el elemento <p>
    const updateDate = () => {
        const dateElement = document.getElementById("currentDate");
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
        dateElement.textContent = `Hoy, ${now.toLocaleDateString('es-ES', options)}`;
    };

    // Ejecuta la función de actualización de la fecha
    updateDate();

    renderTodos(); // Renderiza las tareas al cargar la página
});
