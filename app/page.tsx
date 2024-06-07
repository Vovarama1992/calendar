'use client'
import React, { useState } from 'react'
import styles from './page.module.css'
import { getDays } from './lib/functions'
import { months, daysOfWeek } from './lib/defs'
import TodoListModal from './Todo'

export default function Home() {
  const [year, setYear] = useState(2024)
  const [month, setMonth] = useState(5)
  const [open, setOpen] = useState(false)
  const [day, setDay] = useState(1)
  const days = getDays(year, month)
  const shift = days[0].dayOfWeek
  function openModal(day: number) {
    setOpen(true)
    setDay(day)
  }
  return (
    <main className={styles.container}>
      <div className={styles.selector}>
        <select name="year" value={year} onChange={e => setYear(Number(e.target.value))}>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
        <select name="month" value={month} onChange={e => setMonth(Number(e.target.value))}>
          {months.map(m => (
            <option key={m.value} value={m.value}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      <table className={styles.calendar}>
        <thead>
          <tr>
            {daysOfWeek.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(Math.ceil((days.length + shift) / 7))
            .fill(null)
            .map((_, weekIndex) => (
              <tr key={weekIndex}>
                {Array(7)
                  .fill(null)
                  .map((_, dayIndex) => {
                    const dayNumber = weekIndex * 7 + dayIndex + 1 - shift
                    if (dayNumber < 1 || dayNumber > days.length) {
                      return <td className={styles.td} key={dayIndex}></td>
                    } else {
                      return (
                        <td className={styles.td} key={dayIndex}>
                          <button onClick={() => openModal(dayNumber)}>{dayNumber}</button>
                          {open && (
                            <TodoListModal
                              close={() => setOpen(false)}
                              day={day}
                              month={month}
                              year={year}
                            />
                          )}
                        </td>
                      )
                    }
                  })}
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  )
}
