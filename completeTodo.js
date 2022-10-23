// completeTodo.js
var argv = require("minimist")(process.argv.slice(2));
const raw = require("./models/index");
const markAsComplete = async (id) => {
  try {
    await raw.Todo.markAsComplete(id);
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  const { id } = argv;
  if (!id) {
    throw new Error("Need to pass an id");
  }
  if (!Number.isInteger(id)) {
    throw new Error("The id needs to be an integer");
  }
  await markAsComplete(id);
  await raw.Todo.showList();
})();
