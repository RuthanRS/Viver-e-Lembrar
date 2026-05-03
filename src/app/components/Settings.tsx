import { useNavigate } from 'react-router';
import { ArrowLeft, User, Volume2, Check, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getVoiceSettings, saveVoiceSettings, speak, type VoiceSettings } from '../utils/speech';

export function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<VoiceSettings>({
    userName: '',
    voiceType: 'female',
    ttsEnabled: true
  });
  const [saved, setSaved] = useState(false);
  const [showTtsConfirm, setShowTtsConfirm] = useState(false);

  useEffect(() => {
    const loadedSettings = getVoiceSettings();
    setSettings(loadedSettings);
  }, []);

  const handleSave = () => {
    saveVoiceSettings(settings);
    setSaved(true);
    
    const message = settings.userName 
      ? `Configurações salvas, ${settings.userName}!`
      : 'Configurações salvas!';
    speak(message);
    
    setTimeout(() => setSaved(false), 2000);
  };

  const testVoice = () => {
    if (!settings.ttsEnabled) {
      alert('O auxílio de voz está desativado. Ative-o para testar.');
      return;
    }
    const message = settings.userName
      ? `Olá ${settings.userName}, esta é a voz ${settings.voiceType === 'female' ? 'feminina' : 'masculina'} que será usada no aplicativo.`
      : `Esta é a voz ${settings.voiceType === 'female' ? 'feminina' : 'masculina'} que será usada no aplicativo.`;
    speak(message);
  };

  const handleTtsToggle = () => {
    setShowTtsConfirm(true);
  };

  const confirmTtsToggle = () => {
    const newTtsValue = !settings.ttsEnabled;
    setSettings({ ...settings, ttsEnabled: newTtsValue });
    setShowTtsConfirm(false);
    
    // Only speak if enabling TTS
    if (newTtsValue) {
      // Temporarily enable to speak confirmation
      const tempSettings = { ...settings, ttsEnabled: true };
      saveVoiceSettings(tempSettings);
      speak('Auxílio de voz ativado');
      setSettings(tempSettings);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="mb-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl text-purple-600 mb-2">⚙️ Configurações</h1>
          <p className="text-gray-600">Personalize o seu aplicativo</p>
        </div>

        <div className="space-y-6">
          {/* User Name Section */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-xl">Seu Nome</h2>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Digite seu nome para uma experiência mais personalizada
            </p>
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => setSettings({ ...settings, userName: e.target.value })}
              placeholder="Digite seu nome aqui..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-400 focus:outline-none"
            />
          </div>

          {/* Voice Type Section */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <Volume2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl">Tipo de Voz</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Escolha o tipo de voz para as orientações
            </p>
            
            <div className="space-y-3">
              {/* Female Voice */}
              <button
                onClick={() => setSettings({ ...settings, voiceType: 'female' })}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  settings.voiceType === 'female'
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">🎀 Voz Feminina</div>
                  <div className="text-sm text-gray-600">Voz suave e acolhedora</div>
                </div>
                {settings.voiceType === 'female' && (
                  <Check className="w-6 h-6 text-purple-600" />
                )}
              </button>

              {/* Male Voice */}
              <button
                onClick={() => setSettings({ ...settings, voiceType: 'male' })}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  settings.voiceType === 'male'
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">👔 Voz Masculina</div>
                  <div className="text-sm text-gray-600">Voz clara e firme</div>
                </div>
                {settings.voiceType === 'male' && (
                  <Check className="w-6 h-6 text-purple-600" />
                )}
              </button>
            </div>

            {/* Test Voice Button */}
            <button
              onClick={testVoice}
              className="w-full mt-4 bg-purple-100 text-purple-700 py-3 rounded-xl hover:bg-purple-200 transition-colors"
            >
              🔊 Testar Voz
            </button>
          </div>

          {/* TTS Toggle Section */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${settings.ttsEnabled ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                {settings.ttsEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </div>
              <h2 className="text-xl">Auxílio de Voz</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Ative ou desative todas as orientações por voz do aplicativo
            </p>
            
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div>
                <div className="font-medium">Status do Auxílio de Voz</div>
                <div className="text-sm text-gray-600">
                  {settings.ttsEnabled ? '🔊 Ativado' : '🔇 Desativado'}
                </div>
              </div>
              <button
                onClick={handleTtsToggle}
                className={`relative w-16 h-8 rounded-full transition-colors ${
                  settings.ttsEnabled ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.ttsEnabled ? 'transform translate-x-8' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`w-full py-4 rounded-2xl text-xl transition-all shadow-md ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {saved ? '✓ Salvo!' : '💾 Salvar Configurações'}
          </button>
        </div>

        {/* TTS Confirmation Modal */}
        {showTtsConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  settings.ttsEnabled ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {settings.ttsEnabled ? (
                    <VolumeX className="w-8 h-8 text-red-500" />
                  ) : (
                    <Volume2 className="w-8 h-8 text-green-500" />
                  )}
                </div>
                <h2 className="text-2xl mb-2">Tem certeza?</h2>
                <p className="text-gray-600">
                  {settings.ttsEnabled 
                    ? 'Deseja desativar o auxílio de voz? Você não ouvirá mais as orientações faladas.'
                    : 'Deseja ativar o auxílio de voz? O aplicativo falará as orientações para você.'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={confirmTtsToggle}
                  className={`w-full text-white py-3 rounded-full text-lg transition-colors ${
                    settings.ttsEnabled 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  Sim, Confirmar
                </button>
                <button
                  onClick={() => setShowTtsConfirm(false)}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-full text-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}