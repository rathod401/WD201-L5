//  listTodos.js
const raw = require("./models/index");

const listTodo = async () => {
  try {
    await raw.Todo.showList();
  } catch (error) {
    console.error(error);
  }
};
(async () => {
  await listTodo();
})();
