export const months = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 },
]
export const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export type Todo = {
  completed: boolean
  id: number 
  text: string
}
export type ActionType =
  | { type: 'added'; content: string; id: number }
  | { type: 'delete'; id: number }
  | { type: 'changed'; id: number; content: string }
  | { type: 'completed'; id: number }

export type TodoProps = {
  day: number
  month: number
  index: number
  username: string
  year: number
  close: () => void
}
export type WeekProps = Omit<TodoProps, 'day'> & { tasks: Todo[] };
