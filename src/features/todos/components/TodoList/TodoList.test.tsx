import { TodoList } from './index';
import { render } from 'shared/utils/test-utils';
import { store } from 'store';
import { addTodo, toggleTodoDone } from 'features/todos/slice';
import { Todo } from 'features/todos/models';
import { fireEvent, getByTestId, waitFor } from '@testing-library/react';

const todos: Todo['task'][] = ['todo 1', 'todo 2', 'todo 3', 'todo 4'];

function fillTodos(todos: Todo['task'][]) {
  todos.forEach(todo => store.dispatch(addTodo(todo)));
  const todosInStore = store.getState().todos.items;
  store.dispatch(toggleTodoDone(todosInStore[0].id));
  store.dispatch(toggleTodoDone(todosInStore[todosInStore.length - 1].id));
}

describe('TodoList', () => {
  it('empty list on initial render. contains only functions bellow', () => {
    const component = render(<TodoList />);

    const todoList = component.getByTestId('todo-list') as HTMLDivElement;
    const todoListFunctions = component.getByTestId('list-functions') as HTMLDivElement;

    expect(todoList.childElementCount).toBe(1);
    expect(todoList.children[0]).toEqual(todoListFunctions);
  });

  it('should render todos', () => {
    fillTodos(todos);
    const component = render(<TodoList />);

    const todoList = component.getByTestId('todo-list') as HTMLDivElement;

    expect(todoList.childElementCount).toBe(1 + todos.length);
  });

  it('todo with done = true should be strikethrough; todo with done = false should be without decorations', () => {
    fillTodos(todos);
    const component = render(<TodoList />);

    const todoList = component.getByTestId('todo-list') as HTMLDivElement;

    const todosInStore = store.getState().todos.items;

    todosInStore.forEach(todo => {
      const todoStyle = getComputedStyle(getByTestId(todoList, `todo-${todo.id}`));
      expect(todoStyle.textDecoration).toBe(todo.done ? 'line-through' : '');
    });
  });

  it('click on todo should be toggle todo done flag', () => {
    fillTodos(todos);
    const component = render(<TodoList />);

    const todoList = component.getByTestId('todo-list') as HTMLDivElement;

    const todosInStore = store.getState().todos.items;

    const strikethroughTodoId = todosInStore[0].id;
    const strikethroughTodo = getByTestId(todoList, `todo-${strikethroughTodoId}`);

    fireEvent.click(strikethroughTodo);

    expect(store.getState().todos.items[0].done).toBe(!todosInStore[0].done);
  });

  it('click on "clear completed" should be delete all todos with done = true flag', () => {
    fillTodos(todos);
    const component = render(<TodoList />);

    const todosInStoreBefore = store.getState().todos.items;
    const clearCompletedButton = component.getByTestId('clear-completed-button');

    fireEvent.click(clearCompletedButton);

    const todosInStoreAfter = store.getState().todos.items;

    expect(todosInStoreAfter.length).toBe(
      todosInStoreBefore.filter(todo => todo.done === false).length,
    );
    expect(todosInStoreAfter.filter(todo => todo.done === false).map(todo => todo.task)).toEqual(
      todosInStoreBefore.filter(todo => todo.done === false).map(todo => todo.task),
    );
  });

  describe('filtering works correctly', () => {
    it('"Active" filter should show all todos with done = false flag', async () => {
      fillTodos(todos);
      const component = render(<TodoList />);
      const todoList = component.getByTestId('todo-list') as HTMLDivElement;
      const todosInStore = store.getState().todos.items;
      const filterInput = component
        .getByTestId('filter-selector')
        .querySelector('input') as HTMLInputElement;

      fireEvent.change(filterInput, { target: { value: 'Active' } });

      await waitFor(() => {
        expect(todoList.childElementCount).toBe(
          1 + todosInStore.filter(todo => todo.done === false).length,
        );
      });

      const activeTodos = todosInStore.filter(todo => todo.done === false);
      activeTodos.forEach(todo => {
        return component.getByTestId(`todo-${todo.id}`);
      });
    });

    it('"Completed" filter should show all todos with done = true flag', async () => {
      fillTodos(todos);
      const component = render(<TodoList />);
      const todoList = component.getByTestId('todo-list') as HTMLDivElement;
      const todosInStore = store.getState().todos.items;
      const filterInput = component
        .getByTestId('filter-selector')
        .querySelector('input') as HTMLInputElement;

      fireEvent.change(filterInput, { target: { value: 'Completed' } });

      await waitFor(() => {
        expect(todoList.childElementCount).toBe(
          1 + todosInStore.filter(todo => todo.done === true).length,
        );
      });

      const activeTodos = todosInStore.filter(todo => todo.done === true);
      activeTodos.forEach(todo => {
        return component.getByTestId(`todo-${todo.id}`);
      });
    });
  });
});
