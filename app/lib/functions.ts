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
export async function isDayOff(year: number, month: number, day: number) {
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`
  }

  const formattedMonth = formatNumber(month + 1) // Добавляем 1 к месяцу, так как JavaScript Date месяц начинается с 0
  const formattedDay = formatNumber(day)

  const date = `${year}-${formattedMonth}-${formattedDay}`
  try {
    const response = await fetch(`https://isdayoff.ru/${date}`)

    const json = await response.json()
    return json == 1
  } catch (error) {
    console.error('Ошибка при выполнении запроса к isDayOff API:', error)
    return false
  }
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
