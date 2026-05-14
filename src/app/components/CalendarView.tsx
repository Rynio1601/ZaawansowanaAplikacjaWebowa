import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

interface Session {
  id: string;
  date: Date;
  time: string;
  client: string;
  type: string;
  color?: string;
}

interface CalendarViewProps {
  sessions: Session[];
  onDateSelect?: (date: Date) => void;
  onSessionClick?: (session: Session) => void;
}

export default function CalendarView({ sessions, onDateSelect, onSessionClick }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (value: any) => {
    setSelectedDate(value);
    onDateSelect?.(value);
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return (
        sessionDate.getDate() === date.getDate() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const selectedDateSessions = getSessionsForDate(selectedDate);

  const tileContent = ({ date, view }: any) => {
    if (view === 'month') {
      const dateSessions = getSessionsForDate(date);
      if (dateSessions.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className="flex gap-0.5">
              {dateSessions.slice(0, 3).map((session, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: session.color || '#2563EB' }}
                />
              ))}
              {dateSessions.length > 3 && (
                <span className="text-xs ml-0.5" style={{ color: '#64748B' }}>+{dateSessions.length - 3}</span>
              )}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2 p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-white mb-4" style={{ fontWeight: 600, fontSize: '1.1rem' }}>Kalendarz sesji</h3>
        <div className="calendar-container">
          <style>{`
            .calendar-container .react-calendar {
              width: 100%;
              background: transparent;
              border: none;
              font-family: inherit;
              color: #F1F5F9;
            }
            .calendar-container .react-calendar__tile {
              padding: 1rem 0.5rem;
              background: #0D1525;
              border: 1px solid rgba(255,255,255,0.06);
              border-radius: 8px;
              margin: 2px;
              color: #94A3B8;
              font-size: 0.875rem;
            }
            .calendar-container .react-calendar__tile:enabled:hover {
              background: rgba(37,99,235,0.1);
              border-color: rgba(37,99,235,0.3);
            }
            .calendar-container .react-calendar__tile--active {
              background: rgba(37,99,235,0.2) !important;
              border-color: rgba(37,99,235,0.5) !important;
              color: #60A5FA !important;
            }
            .calendar-container .react-calendar__tile--now {
              background: rgba(16,185,129,0.1);
              border-color: rgba(16,185,129,0.3);
            }
            .calendar-container .react-calendar__month-view__weekdays {
              color: #64748B;
              font-size: 0.75rem;
              font-weight: 600;
              text-transform: uppercase;
            }
            .calendar-container .react-calendar__navigation {
              margin-bottom: 1rem;
            }
            .calendar-container .react-calendar__navigation button {
              color: #F1F5F9;
              background: #0D1525;
              border: 1px solid rgba(255,255,255,0.06);
              border-radius: 8px;
              padding: 0.5rem;
              font-size: 0.875rem;
              font-weight: 600;
            }
            .calendar-container .react-calendar__navigation button:enabled:hover {
              background: rgba(37,99,235,0.1);
              border-color: rgba(37,99,235,0.3);
            }
            .calendar-container .react-calendar__navigation button:disabled {
              opacity: 0.5;
            }
          `}</style>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={tileContent}
            locale="pl-PL"
            prev2Label={null}
            next2Label={null}
            prevLabel={<ChevronLeft size={16} />}
            nextLabel={<ChevronRight size={16} />}
          />
        </div>
      </div>

      {/* Sessions for selected date */}
      <div className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-white mb-4" style={{ fontWeight: 600 }}>
          {selectedDate.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}
        </h3>
        <p className="text-xs mb-4" style={{ color: '#64748B' }}>
          {selectedDateSessions.length} {selectedDateSessions.length === 1 ? 'sesja' : 'sesji'}
        </p>
        <div className="space-y-3">
          {selectedDateSessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: '#475569' }}>Brak sesji w tym dniu</p>
            </div>
          ) : (
            selectedDateSessions.map(session => (
              <div
                key={session.id}
                onClick={() => onSessionClick?.(session)}
                className="p-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: `${session.color || '#2563EB'}15`,
                  border: `1px solid ${session.color || '#2563EB'}30`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${session.color || '#2563EB'}25`;
                  e.currentTarget.style.borderColor = `${session.color || '#2563EB'}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${session.color || '#2563EB'}15`;
                  e.currentTarget.style.borderColor = `${session.color || '#2563EB'}30`;
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} style={{ color: session.color || '#2563EB' }} />
                  <span className="text-sm" style={{ color: session.color || '#2563EB', fontWeight: 600 }}>
                    {session.time}
                  </span>
                </div>
                <p className="text-sm text-white mb-1" style={{ fontWeight: 500 }}>{session.type}</p>
                <div className="flex items-center gap-2">
                  <User size={12} style={{ color: '#64748B' }} />
                  <span className="text-xs" style={{ color: '#64748B' }}>{session.client}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
