'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, CheckCircle, Circle } from 'lucide-react';

export function TodoList() {
  const { isSignedIn, isLoaded } = useUser();
  const [newTodo, setNewTodo] = useState('');

  // tRPC queries and mutations
  const todosQuery = api.todos.list.useQuery(undefined, {
    enabled: isSignedIn,
  });

  const addTodoMutation = api.todos.add.useMutation({
    onSuccess: () => {
      todosQuery.refetch();
      setNewTodo('');
    },
  });

  const deleteTodoMutation = api.todos.delete.useMutation({
    onSuccess: () => {
      todosQuery.refetch();
    },
  });

  const toggleTodoMutation = api.todos.toggle.useMutation({
    onSuccess: () => {
      todosQuery.refetch();
    },
  });

  function handleAddTodo() {
    if (newTodo.trim()) {
      addTodoMutation.mutate({ title: newTodo.trim() });
    }
  }

  function handleDeleteTodo(id: number) {
    deleteTodoMutation.mutate({ id });
  }

  function handleToggleTodo(id: number) {
    toggleTodoMutation.mutate({ id });
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  }

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Badge variant='default' className='h-2 w-2 rounded-full p-0' />
            <CardTitle>Todo List</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground text-sm'>Loading...</div>
        </CardContent>
      </Card>
    );
  }

  // Show sign-in message for non-authenticated users
  if (!isSignedIn) {
    return (
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary' className='h-2 w-2 rounded-full p-0' />
            <CardTitle>Todo List</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground py-8 text-center'>
            <p>You need to sign in to view your todos.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Badge variant='default' className='h-2 w-2 rounded-full p-0' />
          <CardTitle>Todo List</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Add new todo */}
        <div className='flex gap-2'>
          <input
            type='text'
            placeholder='Add a new todo...'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            className='border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2'
            disabled={addTodoMutation.isPending}
          />
          <Button
            onClick={handleAddTodo}
            disabled={!newTodo.trim() || addTodoMutation.isPending}
            size='sm'
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        {/* Todo list */}
        <div className='space-y-2'>
          {todosQuery.isLoading && (
            <div className='text-muted-foreground py-4 text-center text-sm'>
              Loading todos...
            </div>
          )}

          {todosQuery.isError && (
            <div className='text-destructive py-4 text-center text-sm'>
              Error loading todos: {todosQuery.error.message}
            </div>
          )}

          {todosQuery.data && todosQuery.data.length === 0 && (
            <div className='text-muted-foreground py-4 text-center text-sm'>
              No todos yet. Add one above!
            </div>
          )}

          {todosQuery.data?.map((todo) => (
            <div
              key={todo.id}
              className='bg-card flex items-center gap-3 rounded-md border p-3'
            >
              <button
                onClick={() => handleToggleTodo(todo.id)}
                className='text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors'
                disabled={toggleTodoMutation.isPending}
              >
                {todo.completed ? (
                  <CheckCircle className='h-4 w-4 text-green-500' />
                ) : (
                  <Circle className='h-4 w-4' />
                )}
              </button>

              <span
                className={`flex-1 ${
                  todo.completed
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground'
                }`}
              >
                {todo.title}
              </span>

              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className='text-muted-foreground hover:text-destructive flex-shrink-0 transition-colors'
                disabled={deleteTodoMutation.isPending}
              >
                <Trash2 className='h-4 w-4' />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
