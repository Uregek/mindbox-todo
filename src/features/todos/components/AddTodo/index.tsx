import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useAppDispatch } from 'shared/hooks/react-redux';
import { addTodo } from 'features/todos/slice';

export const AddTodo = () => {
  const dispatch = useAppDispatch();

  const [task, setTask] = useState('');

  const handleAddTodoClick = () => {
    dispatch(addTodo(task));
    setTask('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
      <TextField
        value={task}
        onChange={e => setTask(e.target.value)}
        sx={{ flexGrow: 1 }}
        label="What needs to be done?"
        size="small"
        variant="outlined"
        inputProps={{ 'data-testid': 'task-input' }}
      />
      <Button
        data-testid="add-todo-button"
        disabled={!task.length}
        size="small"
        variant="outlined"
        onClick={handleAddTodoClick}
      >
        Add todo
      </Button>
    </Box>
  );
};
