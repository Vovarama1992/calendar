export const months = [
  { name: 'January', value: 0 },
  { name: 'February', value: 1 },
  { name: 'March', value: 2 },
  { name: 'April', value: 3 },
  { name: 'May', value: 4 },
  { name: 'June', value: 5 },
  { name: 'July', value: 6 },
  { name: 'August', value: 7 },
  { name: 'September', value: 8 },
  { name: 'October', value: 9 },
  { name: 'November', value: 10 },
  { name: 'December', value: 11 },
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
  year: number
  close: () => void
}
