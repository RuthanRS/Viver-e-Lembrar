import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { User, Volume2, Check, ArrowRight } from 'lucide-react';
import { saveVoiceSettings, speak, type VoiceSettings } from '../utils/speech';

export function Setup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<VoiceSettings>({
    userName: '',
    voiceType: 'female',
    ttsEnabled: true
  });

  useEffect(() => {
    // Play welcome message
    speak('Bem-vindo ao Viver é Lembrar! Vamos configurar o aplicativo para você.');
  }, []);

  const handleNext = () => {
    if (step === 1) {
      if (!settings.userName.trim()) {
        alert('Por favor, digite seu nome');
        return;
      }
      speak(`Prazer em conhecer você, ${settings.userName}! Agora vamos escolher a voz das orientações.`);
      setStep(2);
    } else {
      // Save and go to home
      saveVoiceSettings(settings);
      speak(`Configuração concluída! Bem-vindo ao aplicativo, ${settings.userName}!`);
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    }
  };

  const testVoice = () => {
    const message = `Olá ${settings.userName}, esta é a voz ${settings.voiceType === 'female' ? 'feminina' : settings.voiceType === 'male' ? 'masculina' : 'padrão'} que será usada no aplicativo.`;
    speak(message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white">
      <div className="max-w-md mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${
            step >= 1 ? 'bg-blue-500' : 'bg-gray-300'
          }`}>
            1
          </div>
          <div className="w-16 h-1 bg-gray-300">
            <div className={`h-full bg-blue-500 transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${
            step >= 2 ? 'bg-blue-500' : 'bg-gray-300'
          }`}>
            2
          </div>
        </div>

        {/* Step 1: Name Input */}
        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl text-blue-600 mb-3">Qual é o seu nome?</h1>
              <p className="text-gray-600 text-lg">
                Vamos personalizar o aplicativo para você 😊
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <label className="block text-gray-600 mb-3 text-lg">Digite seu nome:</label>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) => setSettings({ ...settings, userName: e.target.value })}
                placeholder="Ex: Maria, João..."
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl text-xl focus:border-blue-400 focus:outline-none"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleNext()}
              />
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white py-5 rounded-2xl text-xl shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
            >
              Continuar
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Step 2: Voice Selection */}
        {step === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Volume2 className="w-10 h-10 text-purple-600" />
              </div>
              <h1 className="text-3xl text-purple-600 mb-3">Escolha a Voz</h1>
              <p className="text-gray-600 text-lg">
                Qual voz você prefere para as orientações?
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg space-y-4">
              {/* Female Voice */}
              <button
                onClick={() => setSettings({ ...settings, voiceType: 'female' })}
                className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  settings.voiceType === 'female'
                    ? 'border-purple-400 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="text-left">
                  <div className="text-xl mb-1">🎀 Voz Feminina</div>
                  <div className="text-sm text-gray-600">Voz suave e acolhedora</div>
                </div>
                {settings.voiceType === 'female' && (
                  <Check className="w-7 h-7 text-purple-600" />
                )}
              </button>

              {/* Male Voice */}
              <button
                onClick={() => setSettings({ ...settings, voiceType: 'male' })}
                className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  settings.voiceType === 'male'
                    ? 'border-purple-400 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="text-left">
                  <div className="text-xl mb-1">👔 Voz Masculina</div>
                  <div className="text-sm text-gray-600">Voz clara e firme</div>
                </div>
                {settings.voiceType === 'male' && (
                  <Check className="w-7 h-7 text-purple-600" />
                )}
              </button>

              {/* Default Voice */}
              <button
                onClick={() => setSettings({ ...settings, voiceType: 'default' })}
                className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  settings.voiceType === 'default'
                    ? 'border-purple-400 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="text-left">
                  <div className="text-xl mb-1">🔊 Voz Padrão</div>
                  <div className="text-sm text-gray-600">Voz padrão do sistema</div>
                </div>
                {settings.voiceType === 'default' && (
                  <Check className="w-7 h-7 text-purple-600" />
                )}
              </button>

              {/* Test Voice Button */}
              <button
                onClick={testVoice}
                className="w-full mt-2 bg-purple-100 text-purple-700 py-4 rounded-2xl hover:bg-purple-200 transition-colors text-lg"
              >
                🔊 Testar Voz
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleNext}
                className="w-full bg-blue-500 text-white py-5 rounded-2xl text-xl shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
              >
                Começar a Usar
                <Check className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => setStep(1)}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl text-lg hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}