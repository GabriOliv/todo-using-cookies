// Utility functions for cookies
function setCookie(name, value, days) {
	const date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
	const cookies = document.cookie.split('; ');
	for (let cookie of cookies) {
		const [key, value] = cookie.split('=');
		if (key === name) {
			return decodeURIComponent(value);
		}
	}
	return null;
}

// Load tasks from cookies
function loadTasks() {
	const tasks = getCookie('tasks');
	return tasks ? JSON.parse(tasks) : [];
}

// Save tasks to cookies
function saveTasks(tasks) {
	setCookie('tasks', JSON.stringify(tasks), 7);
}

// Render the task list
function renderTasks() {
	const taskList = document.getElementById('task-list');
	taskList.innerHTML = '';
	tasks.forEach((task, index) => {
		const li = document.createElement('li');
		li.className = 'task-item list-group-item d-flex justify-content-between align-items-center';
		li.innerHTML = `
			<span style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.text}</span>
			<div>
				<button class="btn btn-success btn-sm" onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
				<button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">Delete</button>
			</div>
		`;
		taskList.appendChild(li);
	});
}

// Add a new task
function addTask() {
	const input = document.getElementById('task-input');
	const taskText = input.value.trim();
	if (taskText) {
		const task = { text: taskText, completed: false };
		tasks.push(task);
		saveTasks(tasks);
		renderTasks();
		input.value = '';
	}
}

// Toggle task completion
function toggleComplete(index) {
	tasks[index].completed = !tasks[index].completed;
	saveTasks(tasks);
	renderTasks();
}

// Delete a task
function deleteTask(index) {
	tasks.splice(index, 1);
	saveTasks(tasks);
	renderTasks();
}

// Clear all tasks
function clearTasks() {
	if (confirm('Are you sure you want to clear all tasks?')) {
		tasks = [];
		saveTasks(tasks);
		renderTasks();
	}
}

// Initialize the app
let tasks = loadTasks();
renderTasks();

// Event listeners
document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('clear-tasks-btn').addEventListener('click', clearTasks);
document.getElementById('task-input').addEventListener('keydown', function(event) {
	if (event.key === 'Enter') {
		addTask();
	}
});

// Remove completed tasks
function removeCompletedTasks() {
	tasks = tasks.filter(task => !task.completed);
	saveTasks(tasks);
	renderTasks();
}

document.getElementById('remove-completed-tasks-btn').addEventListener('click', removeCompletedTasks);