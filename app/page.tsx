'use client'
import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import { getDays, isDayOff } from './lib/functions'
import { months, daysOfWeek } from './lib/defs'
import TodoListModal from './Todo'

export default function Home() {
  const [year, setYear] = useState(2024)
  const [month, setMonth] = useState(5)
  const [open, setOpen] = useState(false)
  const [day, setDay] = useState(1)
  const [holidays, setHolidays] = useState<number[]>([]);
  const days = getDays(year, month)
  useEffect(() => {
    const fetchHolidays = async () => {
      const promises = days.map(dayObj => isDayOff(year, month, dayObj.date));
      const results = await Promise.all(promises);
      const newHolidays = days.filter((dayObj, index) => results[index]);
      setHolidays(newHolidays.map(dayObj => dayObj.date));
    };
    fetchHolidays();
  }, [year, month, days]);
  const shift = days[0].dayOfWeek
  const hideForModal = {
    opacity: open ? '0' : '1',
    
    transition: 'opacity 0.3s ease' // Плавный переход прозрачности
  };
  function openModal(day: number) {
    setOpen(true)
    setDay(day)
  }
  const dayOff = {'color': 'red'};
  return (
    <main className={styles.container}>
      <div className={styles.selector} style={hideForModal}>
        <select name="year" value={year} onChange={e => setYear(Number(e.target.value))}>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
        <select name="month" value={month} style={hideForModal} onChange={e => setMonth(Number(e.target.value))}>
          {months.map(m => (
            <option key={m.value} value={m.value}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      <table className={styles.calendar}>
        <thead style={hideForModal}>
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
                    const dayNumber = weekIndex * 7 + dayIndex + 2 - shift
                    if (dayNumber < 1 || dayNumber > days.length) {
                      return <td className={styles.td} style={hideForModal} key={dayIndex}></td>
                    } else {
                      return (
                        <td className={styles.td} key={dayIndex}>
                          <button style={hideForModal}  className={styles.todoButton} onClick={() => openModal(dayNumber)}>
                          <span style={holidays.includes(dayNumber) ? dayOff : {}}>
                                     {dayNumber}
                           </span>
                            </button>
                          {open && (
                            <TodoListModal
                              close={() => setOpen(false)}
                              day={day}
                              month={month}
                              year={year}
                              open={open}
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
