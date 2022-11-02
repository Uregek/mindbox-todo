import { useAppDispatch, useAppSelector } from 'shared/hooks/react-redux';
import { selectFilter, selectTodos } from 'features/todos/slice/selectors';
import {
  Box,
  Collapse,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { clearCompletedTodos, setFilter, toggleTodoDone } from 'features/todos/slice';
import { RadioButtonUnchecked, TaskAlt } from '@mui/icons-material';
import { Filter, filters } from 'features/todos/constaints';
import { useEffect, useState } from 'react';
import { Todo } from 'features/todos/models';

export const TodoList = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);
  const currentFilter = useAppSelector(selectFilter);

  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  const notDoneTodosCount = todos.filter(todo => !todo.done).length;

  const handleFilterChange = (e: SelectChangeEvent) => {
    dispatch(setFilter(e.target.value as Filter));
  };

  useEffect(() => {
    switch (currentFilter) {
      case 'Active':
        setFilteredTodos(todos.filter(todo => todo.done === false));
        break;
      case 'Completed':
        setFilteredTodos(todos.filter(todo => todo.done === true));
        break;
      default:
        setFilteredTodos([...todos]);
    }
  }, [currentFilter, todos]);

  return (
    <TransitionGroup data-testid="todo-list">
      {filteredTodos.map((todo, index) => (
        <Collapse key={todo.id}>
          <Box sx={{ mt: index === 0 ? 0 : 1 }}>
            <Paper
              data-testid={`todo-${todo.id}`}
              onClick={() => dispatch(toggleTodoDone(todo.id))}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                wordBreak: 'break-word',
                gap: 1,
                alignItems: 'center',
                p: 1,
                textDecoration: todo.done ? 'line-through' : undefined,
                cursor: 'pointer',
              }}
              variant="outlined"
              key={todo.id}
            >
              {todo.done ? <TaskAlt /> : <RadioButtonUnchecked />}
              {todo.task}
            </Paper>
          </Box>
        </Collapse>
      ))}
      <Collapse data-testid="list-functions">
        <Paper
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1,
            p: 1,
          }}
        >
          <Typography>{notDoneTodosCount} items left</Typography>

          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="filter-selector">Filter</InputLabel>
            <Select
              data-testid="filter-selector"
              labelId="filter-selector"
              id="filter-selector"
              value={currentFilter}
              label="Filter"
              onChange={handleFilterChange}
            >
              {filters.map(filter => (
                <MenuItem key={filter} value={filter}>
                  {filter}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Link
            data-testid="clear-completed-button"
            underline="hover"
            sx={{ cursor: 'pointer' }}
            onClick={() => dispatch(clearCompletedTodos())}
          >
            clear completed
          </Link>
        </Paper>
      </Collapse>
    </TransitionGroup>
  );
};
