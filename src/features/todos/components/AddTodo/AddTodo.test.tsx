import { AddTodo } from './index';
import { render } from 'shared/utils/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';
import { store } from 'store';

describe('AddTodo', () => {
  it('"Add todo" should be disabled if input for task is empty', () => {
    const component = render(<AddTodo />);

    const taskField = component.getByTestId('task-input') as HTMLInputElement;

    expect(taskField.value).toBe('');
  });

  it('"Add todo" should be active if input for task is not empty', () => {
    const component = render(<AddTodo />);

    const taskField = component.getByTestId('task-input') as HTMLInputElement;

    fireEvent.change(taskField, { target: { value: 'Some task' } });

    const addTodoButton = component.getByTestId('add-todo-button') as HTMLButtonElement;

    expect(addTodoButton).not.toBeDisabled();
  });

  it('click on "Add todo" button with no empty input for task should add new todo with task to the end', () => {
    const component = render(<AddTodo />);

    const taskField = component.getByTestId('task-input') as HTMLInputElement;

    const todoTask = 'Some task';

    const addTodoButton = component.getByTestId('add-todo-button') as HTMLButtonElement;
    fireEvent.change(taskField, { target: { value: todoTask } });
    fireEvent.click(addTodoButton);

    const newTodo = store.getState().todos.items.find(todo => todo.task === todoTask);

    expect(newTodo).not.toBe(undefined);
    expect(newTodo?.task).toBe(todoTask);
  });

  it('should create new todo with done as false by default', () => {
    const component = render(<AddTodo />);

    const taskField = component.getByTestId('task-input') as HTMLInputElement;

    const todoTask = 'Some task';

    const addTodoButton = component.getByTestId('add-todo-button') as HTMLButtonElement;
    fireEvent.change(taskField, { target: { value: todoTask } });
    fireEvent.click(addTodoButton);

    const newTodo = store.getState().todos.items.find(todo => todo.task === todoTask);

    expect(newTodo).not.toBe(undefined);
    expect(newTodo?.done).toBe(false);
  });
});
