const tasks = [];
let nextId = 1;

export function getTasks() {
  return tasks;
}

export function getTaskById(id) {
  return tasks.find((task) => task.id === id);
}

export function createTask({ title, description, completed }) {
  const task = {
    id: nextId,
    title,
    description,
    completed,
    createdAt: new Date().toISOString(),
  };

  nextId += 1;
  tasks.push(task);
  return task;
}

export function updateTask(id, updates) {
  const task = getTaskById(id);
  if (!task) {
    return null;
  }

  Object.assign(task, updates);
  return task;
}

export function deleteTask(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return null;
  }

  return tasks.splice(taskIndex, 1)[0];
}
