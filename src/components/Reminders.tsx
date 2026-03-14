import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Check, Clock } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  type: 'medication' | 'task';
}

export function Reminders() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('alzheimer-reminders');
    if (saved) {
      setReminders(JSON.parse(saved));
    } else {
      const defaultReminders: Reminder[] = [
        { id: '1', title: 'Tomar remédio da pressão', time: '08:00', completed: false, type: 'medication' },
        { id: '2', title: 'Café da manhã', time: '08:30', completed: false, type: 'task' },
        { id: '3', title: 'Tomar vitamina', time: '12:00', completed: false, type: 'medication' },
        { id: '4', title: 'Almoço', time: '12:30', completed: false, type: 'task' },
        { id: '5', title: 'Caminhada', time: '16:00', completed: false, type: 'task' },
        { id: '6', title: 'Tomar remédio da noite', time: '20:00', completed: false, type: 'medication' },
      ];
      setReminders(defaultReminders);
      localStorage.setItem('alzheimer-reminders', JSON.stringify(defaultReminders));
    }
  }, []);

  const toggleReminder = (id: string) => {
    const updated = reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    setReminders(updated);
    localStorage.setItem('alzheimer-reminders', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl text-green-600 ml-4">Lembretes</h1>
        </div>

        <p className="text-gray-600 mb-6">Suas atividades de hoje 📋</p>

        {/* Reminders List */}
        <div className="space-y-3 mb-6">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`bg-white rounded-2xl p-4 shadow-md transition-all ${
                reminder.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                    reminder.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {reminder.completed && <Check className="w-5 h-5 text-white" />}
                </button>
                
                <div className="flex-1">
                  <h3 className={`text-lg mb-1 ${reminder.completed ? 'line-through' : ''}`}>
                    {reminder.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{reminder.time}</span>
                    <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {reminder.type === 'medication' ? '💊 Medicamento' : '✅ Tarefa'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Reminder Button */}
        <button className="w-full bg-green-500 text-white py-4 rounded-full text-lg shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-6 h-6" />
          Adicionar Lembrete
        </button>
      </div>
    </div>
  );
}
