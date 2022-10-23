/* eslint-disable no-undef */
const raw = require("../models");

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const tday = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(tday.getTime() + days * oneDay)
}

describe("Test list of items", function () {
  beforeAll(async () => {
    await raw.sequelize.sync({ force: true })
  });

  test("Add overdue item", async () => {
    const todo = await raw.Todo.addTask({ title: "This is a sample item", dueDate: getJSDate(-2), completed: false });
    const items = await raw.Todo.overdue();
    expect(items.length).toBe(1);
  });

  test("Add due tday item", async () => {
    const dueTdayItems = await raw.Todo.dueTday();
    const todo = await raw.Todo.addTask({ title: "This is a sample item", dueDate: getJSDate(0), completed: false });
    const items = await raw.Todo.dueTday();
    expect(items.length).toBe(dueTdayItems.length + 1);
  });

  test("Add due later item", async () => {
    const dueLaterItems = await raw.Todo.dueLater();
    const todo = await raw.Todo.addTask({ title: "This is a sample item", dueDate: getJSDate(2), completed: false });
    const items = await raw.Todo.dueLater();
    expect(items.length).toBe(dueLaterItems.length + 1);
  });

  test("Mark as complete functionality", async () => {
    const overdueItems = await raw.Todo.overdue()
    const aTodo = overdueItems[0];
    expect(aTodo.completed).toBe(false);
    await raw.Todo.markAsComplete(aTodo.id);
    await aTodo.reload();

    expect(aTodo.completed).toBe(true);
  })

  test("Test completed displayable string", async () => {
    const overdueItems = await raw.Todo.overdue()
    const aTodo = overdueItems[0];
    expect(aTodo.completed).toBe(true);
    const displayValue = aTodo.displayableString()
    expect(displayValue).toBe(`${aTodo.id}. [x] ${aTodo.title} ${aTodo.dueDate}`)
  })

  test("Test incomplete displayable string", async () => {
    const dueLaterItems = await raw.Todo.dueLater()
    const aTodo = dueLaterItems[0];
    expect(aTodo.completed).toBe(false);
    const displayValue = aTodo.displayableString()
    expect(displayValue).toBe(`${aTodo.id}. [ ] ${aTodo.title} ${aTodo.dueDate}`)
  })

  test("Test incomplete dueTday displayable string", async () => {
    const dueTdayItems = await raw.Todo.dueTday()
    const aTodo = dueTdayItems[0];
    expect(aTodo.completed).toBe(false);
    const displayValue = aTodo.displayableString()
    expect(displayValue).toBe(`${aTodo.id}. [ ] ${aTodo.title}`)
  })

  test("Test completed dueTday displayable string", async () => {
    const dueTdayItems = await raw.Todo.dueTday()
    const aTodo = dueTdayItems[0];
    expect(aTodo.completed).toBe(false);
    await raw.Todo.markAsComplete(aTodo.id);
    await aTodo.reload();
    const displayValue = aTodo.displayableString()
    expect(displayValue).toBe(`${aTodo.id}. [x] ${aTodo.title}`)
  })
});
