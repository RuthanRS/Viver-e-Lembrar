export interface VoiceSettings {
  userName: string;
  voiceType: 'female' | 'male' | 'default';
  ttsEnabled: boolean;
}

// Get saved voice settings
export function getVoiceSettings(): VoiceSettings {
  const saved = localStorage.getItem('alzheimer-voice-settings');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    userName: '',
    voiceType: 'female',
    ttsEnabled: true
  };
}

// Save voice settings
export function saveVoiceSettings(settings: VoiceSettings) {
  localStorage.setItem('alzheimer-voice-settings', JSON.stringify(settings));
}

// Get the best available voice based on user preference
function getBestVoice(voiceType: 'female' | 'male' | 'default'): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  
  // Debug: Log available voices
  console.log('Vozes disponíveis:', voices.map(v => ({ name: v.name, lang: v.lang })));
  
  // Filter Portuguese (Brazil) voices
  const ptBRVoices = voices.filter(voice => 
    voice.lang === 'pt-BR' || voice.lang.startsWith('pt')
  );

  console.log('Vozes em português:', ptBRVoices.map(v => v.name));

  if (ptBRVoices.length === 0) {
    console.warn('Nenhuma voz em português encontrada');
    return null;
  }

  // Try to find voice based on preference
  if (voiceType === 'female') {
    // Look for common female voice names
    const femaleVoice = ptBRVoices.find(voice => 
      voice.name.toLowerCase().includes('luciana') ||
      voice.name.toLowerCase().includes('fernanda') ||
      voice.name.toLowerCase().includes('maria') ||
      voice.name.toLowerCase().includes('joana') ||
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('mulher') ||
      voice.name.toLowerCase().includes('feminina') ||
      voice.name.toLowerCase().includes('woman')
    );
    if (femaleVoice) {
      console.log('Voz feminina selecionada:', femaleVoice.name);
      return femaleVoice;
    }
    
    // If no specific female voice found, try to use Google voices which typically have female as default
    const googleFemale = ptBRVoices.find(voice => 
      voice.name.toLowerCase().includes('google') && !voice.name.toLowerCase().includes('male')
    );
    if (googleFemale) {
      console.log('Voz Google feminina selecionada:', googleFemale.name);
      return googleFemale;
    }
  } else if (voiceType === 'male') {
    // Look for common male voice names
    const maleVoice = ptBRVoices.find(voice => 
      voice.name.toLowerCase().includes('felipe') ||
      voice.name.toLowerCase().includes('daniel') ||
      voice.name.toLowerCase().includes('ricardo') ||
      voice.name.toLowerCase().includes('helio') ||
      voice.name.toLowerCase().includes('male') ||
      voice.name.toLowerCase().includes('homem') ||
      voice.name.toLowerCase().includes('masculino') ||
      voice.name.toLowerCase().includes('man')
    );
    if (maleVoice) {
      console.log('Voz masculina selecionada:', maleVoice.name);
      return maleVoice;
    }
  }

  // Return first available Portuguese voice
  console.log('Usando primeira voz em português:', ptBRVoices[0].name);
  return ptBRVoices[0];
}

// Speak text with configured voice settings
export function speak(text: string, customSettings?: { rate?: number; pitch?: number }) {
  const settings = getVoiceSettings();
  
  // Check if TTS is enabled
  if (!settings.ttsEnabled) {
    return; // Don't speak if TTS is disabled
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  utterance.lang = 'pt-BR';
  utterance.rate = customSettings?.rate ?? 0.85; // Slightly slower for better clarity
  
  // Set pitch based on voice type
  if (customSettings?.pitch !== undefined) {
    utterance.pitch = customSettings.pitch;
  } else {
    utterance.pitch = settings.voiceType === 'female' ? 1.2 : settings.voiceType === 'male' ? 0.9 : 1;
  }
  
  // Wait for voices to load
  const setVoice = () => {
    const voice = getBestVoice(settings.voiceType);
    if (voice) {
      utterance.voice = voice;
      console.log('Usando voz:', voice.name, '- Tipo:', settings.voiceType);
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

// Speak with temporary settings (useful for testing)
export function speakWithSettings(text: string, voiceType: 'female' | 'male' | 'default', ttsEnabled: boolean) {
  if (!ttsEnabled) {
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  utterance.lang = 'pt-BR';
  utterance.rate = 0.85;
  utterance.pitch = voiceType === 'female' ? 1.2 : voiceType === 'male' ? 0.9 : 1;
  
  // Wait for voices to load
  const setVoice = () => {
    const voice = getBestVoice(voiceType);
    if (voice) {
      utterance.voice = voice;
      console.log('Testando voz:', voice.name, '- Tipo:', voiceType);
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