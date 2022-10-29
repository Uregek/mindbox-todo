import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from 'features/todos/models';
import { Filter } from 'features/todos/constaints';

interface TodosState {
  items: Todo[];
  filter: Filter;
}

const initialState: TodosState = {
  items: [],
  filter: 'All',
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo(state, { payload }: PayloadAction<Todo['task']>) {
      state.items.push({
        id: nanoid(),
        task: payload,
        done: false,
      });
    },
    toggleTodoDone(state, { payload }: PayloadAction<Todo['id']>) {
      const currentTodo = state.items.find(todo => todo.id === payload);
      if (currentTodo) {
        currentTodo.done = !currentTodo.done;
      }
    },
    clearCompletedTodos(state) {
      state.items = state.items.filter(todo => todo.done === false);
    },
    setFilter(state, { payload }: PayloadAction<TodosState['filter']>) {
      state.filter = payload;
    },
  },
});

export const { addTodo, toggleTodoDone, clearCompletedTodos, setFilter } = todosSlice.actions;

export default todosSlice.reducer;
