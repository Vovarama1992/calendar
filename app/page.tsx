'use client'
import React, { useState, useEffect } from 'react'
import Weeklist from './Week';
import { Todo } from './lib/defs';
import styles from './page.module.css'
import { getDays, isDayOff } from './lib/functions'
import { months, daysOfWeek } from './lib/defs'
import TodoListModal from './Todo'



export default function Home() {
  const [year, setYear] = useState(2024)
  const [uName, setName] = useState('');
  const [month, setMonth] = useState(5)
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false);
  const [day, setDay] = useState(1)
  const [holidays, setHolidays] = useState<number[]>([])
  const [weekTasks, setWeekTasks] = useState<Todo[]>([]);
  const [openWeek, setOpenWeek] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const days = getDays(year, month)
  useEffect(() => {
    const your_name = prompt("Enter your name") || 'User';
    setName(your_name.toUpperCase());
  }, []
  )
  useEffect(() => {
    const fetchHolidays = async () => {
      const promises = days.map(dayObj => isDayOff(year, month, dayObj.date))
      const results = await Promise.all(promises)
      const newHolidays = days.filter((dayObj, index) => results[index])
      setHolidays(newHolidays.map(dayObj => dayObj.date))
    }
    fetchHolidays()
  }, [year, month, days])
  const shift = days[0].dayOfWeek
  const hideForModal: React.CSSProperties = {
    opacity: open || openWeek ? '0' : '1',
    pointerEvents: open ? 'none' : 'auto',
    transition: 'opacity 0.3s ease',
  };
  const onHover = {background: 'rgb(184, 184, 53)'};

  function weekHover(weekIndex: number) {
           if (!open && !openWeek) {
            setSelectedWeek(weekIndex);
           setHover(true);
           }
  }
  
  function openModal(e: React.MouseEvent<HTMLButtonElement>, day: number) {
    setOpen(true);
    setDay(day);
    e.stopPropagation();
  }
  function openWeekModal(weekIndex: number) {
    if (!open) {
      const tasks: Todo[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dayNumber = weekIndex * 7 + dayIndex + 2 - shift;
      if (dayNumber >= 1 && dayNumber <= days.length) {
        const dayTasks = JSON.parse(localStorage.getItem(`todo_${year}_${month}_${dayNumber}_${uName}`) || '[]');
        tasks.push(...dayTasks);
      }
    }
    setWeekTasks(tasks);
    
      setOpenWeek(true);
   
    setSelectedWeek(weekIndex + 1);
  }
  };
  const dayOff = { color: 'red' }
  return (
    <main className={styles.container}>
      <div className={styles.selector} style={hideForModal}>
        <select name="year" value={year} onChange={e => setYear(Number(e.target.value))}>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
        <select
          name="month"
          value={month}
          style={hideForModal}
          onChange={e => setMonth(Number(e.target.value))}
        >
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
              <tr className={styles.week} onMouseOver={() => weekHover(weekIndex)} 
              onMouseOut={() => setHover(false)} style={hover && weekIndex == selectedWeek ? onHover : {}} onClick={(e) => {
                openWeekModal(weekIndex)
                e.stopPropagation();
              }} key={weekIndex}>
                {Array(7)
                  .fill(null)
                  .map((_, dayIndex) => {
                    const dayNumber = weekIndex * 7 + dayIndex + 2 - shift;
                    if (dayNumber < 1 || dayNumber > days.length) {
                      return <td className={styles.td} style={hideForModal} key={dayIndex}></td>;
                    } else {
                      return (
                        <td className={styles.td} key={dayIndex}>
                          <button
                            style={hideForModal}
                            className={styles.todoButton}
                            onClick={(e) => {
                              
                              openModal(e, dayNumber);
                            }}
                          >
                            <span style={holidays.includes(dayNumber) ? dayOff : {}}>
                              {dayNumber}
                            </span>
                          </button>
                          {open && day === dayNumber && (
                            <TodoListModal
                            username={uName}
                              close={() => setOpen(false)}
                              day={day}
                              month={month}
                              year={year}
                            />
                          )}
                        </td>
                      );
                    }
                  })}
              </tr>
            ))}
        </tbody>
      </table>
      {openWeek && (
        <Weeklist  username={uName}
          year={year}
          month={month}
          tasks={weekTasks}
          close={() => setOpenWeek(false)}
          index={selectedWeek}
        />
      )}
    </main>
  )
}
