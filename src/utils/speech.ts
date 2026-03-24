export interface VoiceSettings {
  userName: string;
  voiceType: 'female' | 'male' | 'default';
}

// Get saved voice settings
export function getVoiceSettings(): VoiceSettings {
  const saved = localStorage.getItem('alzheimer-voice-settings');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    userName: '',
    voiceType: 'female'
  };
}

// Save voice settings
export function saveVoiceSettings(settings: VoiceSettings) {
  localStorage.setItem('alzheimer-voice-settings', JSON.stringify(settings));
}

// Get the best available voice based on user preference
function getBestVoice(voiceType: 'female' | 'male' | 'default'): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  
  // Filter Portuguese (Brazil) voices
  const ptBRVoices = voices.filter(voice => 
    voice.lang === 'pt-BR' || voice.lang.startsWith('pt')
  );

  if (ptBRVoices.length === 0) {
    return null;
  }

  // Try to find voice based on preference
  if (voiceType === 'female') {
    // Look for common female voice names
    const femaleVoice = ptBRVoices.find(voice => 
      voice.name.toLowerCase().includes('luciana') ||
      voice.name.toLowerCase().includes('fernanda') ||
      voice.name.toLowerCase().includes('maria') ||
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('mulher')
    );
    if (femaleVoice) return femaleVoice;
  } else if (voiceType === 'male') {
    // Look for common male voice names
    const maleVoice = ptBRVoices.find(voice => 
      voice.name.toLowerCase().includes('felipe') ||
      voice.name.toLowerCase().includes('male') ||
      voice.name.toLowerCase().includes('homem')
    );
    if (maleVoice) return maleVoice;
  }

  // Return first available Portuguese voice
  return ptBRVoices[0];
}

// Speak text with configured voice settings
export function speak(text: string, customSettings?: { rate?: number; pitch?: number }) {
  const settings = getVoiceSettings();
  const utterance = new SpeechSynthesisUtterance(text);
  
  utterance.lang = 'pt-BR';
  utterance.rate = customSettings?.rate ?? 0.85; // Slightly slower for better clarity
  utterance.pitch = customSettings?.pitch ?? (settings.voiceType === 'female' ? 1.3 : 1);
  
  // Wait for voices to load
  const setVoice = () => {
    const voice = getBestVoice(settings.voiceType);
    if (voice) {
      utterance.voice = voice;
    }
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    setVoice();
  } else {
    // Some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      setVoice();
    };
  }

  window.speechSynthesis.speak(utterance);
}

// Get personalized greeting
export function getPersonalizedGreeting(): string {
  const settings = getVoiceSettings();
  if (settings.userName) {
    return `Olá, ${settings.userName}! 👋`;
  }
  return 'Olá! 👋';
}