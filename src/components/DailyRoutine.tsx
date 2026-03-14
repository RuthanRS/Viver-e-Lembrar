import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Sun, Cloud, Moon } from 'lucide-react';

interface RoutineItem {
  id: string;
  time: string;
  activity: string;
  period: 'morning' | 'afternoon' | 'evening';
}

export function DailyRoutine() {
  const navigate = useNavigate();
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('alzheimer-routine');
    if (saved) {
      setRoutineItems(JSON.parse(saved));
    } else {
      const defaultRoutine: RoutineItem[] = [
        { id: '1', time: '07:00', activity: 'Acordar e tomar água', period: 'morning' },
        { id: '2', time: '07:30', activity: 'Tomar banho', period: 'morning' },
        { id: '3', time: '08:00', activity: 'Tomar café da manhã', period: 'morning' },
        { id: '4', time: '09:00', activity: 'Ler jornal ou assistir TV', period: 'morning' },
        { id: '5', time: '12:00', activity: 'Almoço', period: 'afternoon' },
        { id: '6', time: '13:00', activity: 'Descanso', period: 'afternoon' },
        { id: '7', time: '15:00', activity: 'Lanche da tarde', period: 'afternoon' },
        { id: '8', time: '16:00', activity: 'Caminhada leve', period: 'afternoon' },
        { id: '9', time: '19:00', activity: 'Jantar', period: 'evening' },
        { id: '10', time: '20:00', activity: 'Tempo com família', period: 'evening' },
        { id: '11', time: '21:30', activity: 'Preparar para dormir', period: 'evening' },
      ];
      setRoutineItems(defaultRoutine);
      localStorage.setItem('alzheimer-routine', JSON.stringify(defaultRoutine));
    }
  }, []);

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning':
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'afternoon':
        return <Cloud className="w-6 h-6 text-blue-400" />;
      case 'evening':
        return <Moon className="w-6 h-6 text-indigo-500" />;
      default:
        return null;
    }
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'morning':
        return 'Manhã';
      case 'afternoon':
        return 'Tarde';
      case 'evening':
        return 'Noite';
      default:
        return '';
    }
  };

  const groupedRoutine = {
    morning: routineItems.filter(item => item.period === 'morning'),
    afternoon: routineItems.filter(item => item.period === 'afternoon'),
    evening: routineItems.filter(item => item.period === 'evening'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl text-orange-600 ml-4">Rotina Diária</h1>
        </div>

        <p className="text-gray-600 mb-6">Suas atividades do dia 🌅</p>

        {/* Morning */}
        {groupedRoutine.morning.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl text-gray-700">Manhã</h2>
            </div>
            <div className="space-y-2">
              {groupedRoutine.morning.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <div className="text-2xl bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                    {item.time.split(':')[0]}
                    <span className="text-sm">h</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <p className="text-lg">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Afternoon */}
        {groupedRoutine.afternoon.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl text-gray-700">Tarde</h2>
            </div>
            <div className="space-y-2">
              {groupedRoutine.afternoon.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <div className="text-2xl bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                    {item.time.split(':')[0]}
                    <span className="text-sm">h</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <p className="text-lg">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evening */}
        {groupedRoutine.evening.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl text-gray-700">Noite</h2>
            </div>
            <div className="space-y-2">
              {groupedRoutine.evening.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <div className="text-2xl bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                    {item.time.split(':')[0]}
                    <span className="text-sm">h</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <p className="text-lg">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
