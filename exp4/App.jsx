import { useState } from 'react'
import './App.css'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const initialEvents = [
  { id: 1, day: 2, title: 'Brand Launch', category: 'work', time: '09:00' },
  { id: 2, day: 4, title: 'Family Dinner', category: 'personal', time: '18:30' },
  { id: 3, day: 1, title: 'Math Quiz', category: 'study', time: '16:00' },
  { id: 4, day: 5, title: 'Project Deadline', category: 'deadline', time: '12:00' },
  { id: 5, day: 3, title: 'Team Sync', category: 'general', time: '11:00' },
]

function App() {
  const [events, setEvents] = useState(initialEvents)
  const [draggedEventId, setDraggedEventId] = useState(null)
  const [dragCycleCount, setDragCycleCount] = useState(0)
  const [dragOverDay, setDragOverDay] = useState(null)

  const handleDrop = (targetDay) => {
    if (draggedEventId === null) return

    setEvents((currentEvents) => {
      const eventToMove = currentEvents.find((event) => event.id === draggedEventId)

      if (!eventToMove || eventToMove.day === targetDay) {
        return currentEvents
      }

      const updatedEvents = currentEvents.map((event) =>
        event.id === draggedEventId ? { ...event, day: targetDay } : event,
      )

      return updatedEvents
    })

    setDragCycleCount((count) => count + 1)
    setDraggedEventId(null)
    setDragOverDay(null)
  }

  return (
    <div className="calendar-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">Planner</p>
            <h1>Smart Interactive Calendar</h1>
          </div>
        </div>

        <nav className="nav-panel">
          <button className="nav-item active">Overview</button>
          <button className="nav-item">Posts</button>
          <button className="nav-item">Campaigns</button>
          <button className="nav-item">Reports</button>
        </nav>

        <div className="mini-card">
          <p className="eyebrow">This week</p>
          <h3>{events.length} scheduled</h3>
          <div className="stats-row">
            <div className="stat-box">
              <span>Cycles</span>
              <strong>{dragCycleCount}</strong>
            </div>
            <div className="stat-box">
              <span>Moved</span>
              <strong>{dragCycleCount}</strong>
            </div>
          </div>
          <div className="progress-bar"><span /></div>
        </div>
      </aside>

      <main className="calendar-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Schedule</p>
            <h2>September 2026</h2>
          </div>
          <div className="header-actions">
            <button className="ghost-btn">Today</button>
            <button className="primary-btn">+ New Event</button>
          </div>
        </header>

        <div className="calendar-grid">
          <div className="day-labels">
            {days.map((day) => (
              <div key={day} className="day-label">{day}</div>
            ))}
          </div>

          <div className="calendar-days">
            {[...Array(35)].map((_, index) => {
              const dayNumber = index + 1
              const isCurrentDay = dayNumber === 14
              const cellDay = (index % 7) + 1
              const event = events.find((item) => item.day === cellDay)

              return (
                <div
                  key={index}
                  className={`day-cell ${isCurrentDay ? 'today' : ''} ${dragOverDay === cellDay ? 'drag-over' : ''}`}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setDragOverDay(cellDay)
                  }}
                  onDragLeave={() => setDragOverDay((current) => (current === cellDay ? null : current))}
                  onDrop={(event) => {
                    event.preventDefault()
                    handleDrop(cellDay)
                  }}
                >
                  <span className="day-number">{dayNumber}</span>
                  {event && (
                    <div
                      className={`event-chip ${event.category}`}
                      draggable
                      onDragStart={() => setDraggedEventId(event.id)}
                      onDragEnd={() => {
                        setDraggedEventId(null)
                        setDragOverDay(null)
                      }}
                    >
                      {event.title}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
