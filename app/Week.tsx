import React, { useState, useReducer, useEffect } from 'react';
import { todoReducer,  saveTasksToLocalStorage, loadTasksFromLocalStorage} from './lib/functions';
import { months } from './lib/defs';
import { WeekProps, Todo } from './lib/defs';
import styles from './page.module.css';
import Image from 'next/image'
const changeInput = { width: '300px' };
const changer = { width: 'auto', height: '20px', border: 'none', marginLeft: '5px', background: 'transparent' };
function monthNamer(num: number) {
    const goal = months.find((month) => month.value == num);
    if (goal) {
        return goal.name
    } else return
}
function uniquer(tasks: Todo[]) {
    return tasks.map((task, index) => ({
    ...task,
    id: Math.random()
  }));
}


export default function Weeklist({ year, month, tasks, close, username, index }: WeekProps) {
    function initialTasksWithUniqueIds() {
        const storedTasks = loadTasksFromLocalStorage(year, month, index, username);
        const uniqueTasks = uniquer(tasks);
        return storedTasks.length > 0 ? storedTasks : uniqueTasks;
      };
      const [todos, dispatch] = useReducer(todoReducer, initialTasksWithUniqueIds());
  const [input, turnInput] = useState(false);
  const [selectedId, setSelect] = useState<number | null>(null);
  const [nextId, setNext] = useState(0);
  const monthName = monthNamer(month);
  
  
  useEffect(() => {
    const maxId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) : 0;
    setNext(maxId + 1);
  }, []);
  useEffect(() => {
    
    saveTasksToLocalStorage(year, month, index, username, todos);
  }, [todos]);

  

  function addTodo(text: string) {
    dispatch({
      type: 'added',
      content: text,
      id: nextId + 1,
    })
    setNext(nextId + 1)
  }
  function completeTodo(id: number) {
    dispatch({
      type: 'completed',
      id: id,
    })
  }
  function deleteTodo(id: number) {
    dispatch({
      type: 'delete',
      id: id,
    })
  }
  function changeTodo(id: number, text: string) {
    dispatch({
      type: 'changed',
      id: id,
      content: text,
    })
  }
  function onTurn(id: number | null) {
    turnInput(true);
    setSelect(id);
  }

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTodoText = formData.get('newtodo') as string;
    if (!newTodoText) {
      alert('Type something');
    }
    if (newTodoText.trim()) {
      addTodo(newTodoText);
      e.currentTarget.reset();
    }
  };

  const handleChangeSubmit = (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTodoText = formData.get('newvalue') as string;
    if (newTodoText.trim()) {
      changeTodo(id, newTodoText);
      e.currentTarget.reset();
    }
    turnInput(false);
  };

  return (
    <div className={styles.todo}>
      <h2>
        TodoList for {index} week of {monthName}
      </h2>
      <div className={styles.todoContent}>
        <form className={styles.form} onSubmit={handleAddSubmit}>
          <input type="text" name="newtodo" />
          <button
            className={styles.changer}
            style={{ width: '39px', height: '39px' }}
            type="submit"
          >
            +
          </button>
        </form>
        {todos.length == 0 && (
          <h1 className={styles.empter}>TodoList is empty right now. Add something </h1>
        )}
        {todos.map((todo: Todo, index: number) => (
          <div className={styles.todoItem} key={index}>
            {input && todo.id == selectedId ? (
              <form className={styles.changeZone} onSubmit={e => handleChangeSubmit(e, todo.id)}>
                <input
                  className={styles.changeInput}
                  style={changeInput}
                  type="text"
                  name="newvalue"
                />
                <button style={{ height: '40px', width: 'auto', marginLeft: '10px' }} type="submit">
                  Ok
                </button>
              </form>
            ) : (
              <>
                <input
                  type="checkbox"
                  id={`todo-${todo.id}`}
                  onChange={() => completeTodo(todo.id)}
                  checked={todo.completed}
                />
                <label htmlFor={`todo-${todo.id}`}>{todo.text}</label>
                <button onClick={() => onTurn(todo.id)} style={changer}>
                  <Image src="/pencil.png" width={25} height={25} alt="Pencil Icon" />
                </button>
                <button onClick={() => deleteTodo(todo.id)} style={changer}>
                  <Image src="/trash.png" width={25} height={25} alt="Trash Icon" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <button
        className={styles.closer}
        style={{ width: '42px', height: '42px', borderRadius: '6px' }}
        onClick={close}
      >
        X
      </button>
    </div>
  );
}