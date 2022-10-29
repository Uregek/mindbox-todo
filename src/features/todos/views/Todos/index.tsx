import { Box, Typography } from '@mui/material';
import { AddTodo, TodoList } from 'features/todos/components';

export const Todos = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3, mb: 3 }}>
      <Typography sx={{ textAlign: 'center' }} variant="h4" component="h1">
        todos
      </Typography>
      <AddTodo />
      <TodoList />
    </Box>
  );
};
