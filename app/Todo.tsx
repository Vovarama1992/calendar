import React, { useState, useReducer, useEffect } from 'react'
import { loadTasksFromLocalStorage,  mergeDayAndWeekTasks} from  './lib/functions';
import { formatNumber } from './lib/functions'
import Image from 'next/image'
import { todoReducer } from './lib/functions'
import { Todo, TodoProps } from './lib/defs'
import styles from './page.module.css'
const changeInput = { width: '300px' }
const changer = { width: 'auto', height: '20px', marginLeft: '5px', background: 'transparent' }

export default function TodoListModal({ day, month, year, index, username, close }: TodoProps) {
  const startid = Math.random();
    const localStorageKey = `todo_${year}_${month}_${day}_${username}`
    const weekStorageKey = `tasks_${year}_${month}_${index}_${username}`
  const [input, turnInput] = useState(false)
  const [selectedId, setSelect] = useState<number | null>(null)
  const [todos, dispatch] = useReducer(todoReducer, [], initTodos)
  const [name, setName] = useState<string | null>(null);
  const [nextId, setNext] = useState(startid);
  
  
  
  
  function initTodos() {
    const dayKey = localStorageKey;
    const weekKey = weekStorageKey;
  
    const storedTodos = localStorage.getItem(dayKey);
    const storedWeekTodos = localStorage.getItem(weekKey);
  
    let dailyTodos = storedTodos ? JSON.parse(storedTodos) : [];
    const weeklyTodos = storedWeekTodos ? JSON.parse(storedWeekTodos) : [];
  
    
    dailyTodos = dailyTodos.map((todo: Todo) => {
      
      const correspondingTodo = weeklyTodos.find((weekTodo: Todo) => weekTodo.id === todo.id);
  
      
      return correspondingTodo || null;
    }).filter((todo: Todo) => todo !== null); 
  
    
    localStorage.setItem(dayKey, JSON.stringify(dailyTodos));
  
    return dailyTodos;
  }
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(todos))
    console.log('local: ' + localStorageKey)

  }, [todos])
  
  useEffect(() => {
    const weekTasks = loadTasksFromLocalStorage(year, month, index, username);
    console.log(weekTasks);
    const updatedWeekTasks = mergeDayAndWeekTasks(weekTasks, todos);
    
    localStorage.setItem(weekStorageKey , JSON.stringify(updatedWeekTasks))

  }, [todos])

  

  function addTodo(text: string, id: number) {
    const random = Math.random();
    setNext(random);
    dispatch({
      type: 'added',
      content: text,
      id: id
    })
    
    
    
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
    turnInput(true)
    setSelect(id)
  }

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newTodoText = formData.get('newtodo') as string
    if (!newTodoText) {
      alert('type something')
    }
    if (newTodoText.trim()) {
      addTodo(newTodoText, nextId)
      e.currentTarget.reset()
    }
  }
  const handleChangeSubmit = (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newTodoText = formData.get('newvalue') as string
    if (newTodoText.trim()) {
      changeTodo(id, newTodoText)
      e.currentTarget.reset()
    }
    turnInput(false)
  }

  return (
    <div className={styles.todo} >
      <h2>
        TodoList for {formatNumber(day)}.{formatNumber(month)}.{year}
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
                <button style={{height: '40px', width: 'auto', marginLeft: '10px'}} type='submit'>Ok</button>
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
  )
}
