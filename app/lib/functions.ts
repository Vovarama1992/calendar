import { Todo, ActionType } from './defs'
export function getDays(year: number, month: number) {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)
  const days = []

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay()
    days.push({ date: date.getDate(), dayOfWeek: dayOfWeek })
  }

  return days
}

export function todoReducer(todos: Todo[], action: ActionType): Todo[] {
  switch (action.type) {
    case 'added': {
      return [
        ...todos,
        {
          id: todos.length,
          text: action.content,
          completed: false,
        },
      ]
    }
    case 'delete': {
      return todos.filter(todo => todo.id !== action.id)
    }
    case 'changed': {
      return todos.map(todo => (todo.id === action.id ? { ...todo, text: action.content } : todo))
    }
    case 'completed': {
      return todos.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      )
    }
    default: {
      return todos
    }
  }
}
