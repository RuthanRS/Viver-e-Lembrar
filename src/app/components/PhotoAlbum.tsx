import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, X, Trash2, Mic, Square, Play, Pause, Upload, Image } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { speak } from '../utils/speech';

interface Photo {
  id: string;
  url: string;
  name: string;
  relationship: string;
  audioUrl?: string;
}

export function PhotoAlbum() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const [newPhoto, setNewPhoto] = useState({
    name: '',
    relationship: '',
    url: '',
    audioUrl: ''
  });
  
  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('alzheimer-photos');
    if (saved) {
      setPhotos(JSON.parse(saved));
    } else {
      // Default photos
      const defaultPhotos: Photo[] = [
        { id: '1', url: '', name: 'Maria Silva', relationship: 'Esposa' },
        { id: '2', url: '', name: 'João Silva', relationship: 'Filho' },
        { id: '3', url: '', name: 'Ana Silva', relationship: 'Filha' },
        { id: '4', url: '', name: 'Pedro Silva', relationship: 'Neto' },
      ];
      setPhotos(defaultPhotos);
      localStorage.setItem('alzheimer-photos', JSON.stringify(defaultPhotos));
    }
  }, []);

  const addPhoto = () => {
    if (!newPhoto.name || !newPhoto.relationship) {
      speak('Por favor, preencha pelo menos o nome e o relacionamento');
      alert('Por favor, preencha pelo menos o nome e o relacionamento');
      return;
    }

    const photo: Photo = {
      id: Date.now().toString(),
      name: newPhoto.name,
      relationship: newPhoto.relationship,
      url: newPhoto.url,
      audioUrl: newPhoto.audioUrl
    };

    const updated = [...photos, photo];
    setPhotos(updated);
    localStorage.setItem('alzheimer-photos', JSON.stringify(updated));
    
    speak(`Foto de ${newPhoto.name} adicionada ao álbum`);
    
    setNewPhoto({ name: '', relationship: '', url: '', audioUrl: '' });
    setShowAddModal(false);
  };

  const confirmDelete = (photo: Photo) => {
    setPhotoToDelete(photo);
    setShowDeleteConfirm(true);
    setSelectedPhoto(null);
  };

  const deletePhoto = () => {
    if (photoToDelete) {
      const updated = photos.filter(p => p.id !== photoToDelete.id);
      setPhotos(updated);
      localStorage.setItem('alzheimer-photos', JSON.stringify(updated));
      speak(`Foto de ${photoToDelete.name} removida do álbum`);
      setShowDeleteConfirm(false);
      setPhotoToDelete(null);
    }
  };

  const viewPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    speak(`Visualizando foto de ${photo.name}, ${photo.relationship}`);
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        setNewPhoto({ ...newPhoto, audioUrl: audioUrl });
        audioChunksRef.current = [];
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      speak('Gravação iniciada');

      // Start recording time
      const startTime = Date.now();
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(Date.now() - startTime);
      }, 1000);
    } catch (err) {
      console.error('Erro ao iniciar gravação:', err);
      
      let errorMessage = 'Não foi possível acessar o microfone. ';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage += 'Por favor, permita o acesso ao microfone nas configurações do seu navegador.';
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'Nenhum microfone foi encontrado no seu dispositivo.';
        } else if (err.name === 'NotReadableError') {
          errorMessage += 'O microfone está sendo usado por outro aplicativo.';
        } else {
          errorMessage += 'Erro: ' + err.message;
        }
      }
      
      alert(errorMessage);
      speak('Erro ao acessar o microfone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop recording time
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      speak('Tipo de arquivo inválido. Selecione uma imagem');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem é muito grande. Por favor, selecione uma imagem menor que 5MB');
      speak('Imagem muito grande. Selecione uma imagem menor');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setNewPhoto({ ...newPhoto, url: base64 });
      speak('Foto carregada com sucesso');
    };
    reader.onerror = () => {
      alert('Erro ao carregar a imagem');
      speak('Erro ao carregar a imagem');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl text-blue-600 ml-4">Álbum de Fotos</h1>
        </div>

        <p className="text-gray-600 mb-6">Pessoas que você ama ❤️</p>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <button
                onClick={() => viewPhoto(photo)}
                className="w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
                  {photo.url ? (
                    <ImageWithFallback 
                      src={photo.url} 
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                  {/* Audio indicator */}
                  {photo.audioUrl && (
                    <div className="absolute bottom-2 right-2 bg-purple-500 text-white rounded-full p-1.5 shadow-md">
                      <Mic className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg mb-1">{photo.name}</h3>
                <p className="text-sm text-gray-500">{photo.relationship}</p>
              </button>
              
              {/* Delete button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(photo);
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Photo Button */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full bg-blue-400 text-white py-4 rounded-full text-lg shadow-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Adicionar Foto
        </button>

        {/* View Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="ml-auto block p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                {selectedPhoto.url ? (
                  <ImageWithFallback 
                    src={selectedPhoto.url} 
                    alt={selectedPhoto.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">👤</span>
                )}
              </div>
              
              <h2 className="text-2xl mb-2 text-center">{selectedPhoto.name}</h2>
              <p className="text-gray-600 text-center mb-6">{selectedPhoto.relationship}</p>
              
              {/* Audio Player */}
              {selectedPhoto.audioUrl && (
                <div className="mb-4 bg-purple-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-purple-700">Áudio Gravado</span>
                    </div>
                    <button
                      onClick={() => {
                        if (audioRef.current) {
                          if (isPlaying) {
                            pauseAudio();
                          } else {
                            playAudio();
                          }
                        }
                      }}
                      className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                  <audio 
                    ref={audioRef} 
                    src={selectedPhoto.audioUrl}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              )}
              
              <button
                onClick={() => confirmDelete(selectedPhoto)}
                className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-colors"
              >
                Remover Foto
              </button>
            </div>
          </div>
        )}

        {/* Add Photo Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-blue-600">Adicionar Foto</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Nome da Pessoa</label>
                  <input
                    type="text"
                    value={newPhoto.name}
                    onChange={(e) => setNewPhoto({ ...newPhoto, name: e.target.value })}
                    placeholder="Ex: Maria Silva"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Relacionamento</label>
                  <input
                    type="text"
                    value={newPhoto.relationship}
                    onChange={(e) => setNewPhoto({ ...newPhoto, relationship: e.target.value })}
                    placeholder="Ex: Esposa, Filho, Amigo"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Carregar Imagem (opcional)</label>
                  <div className="bg-blue-50 rounded-xl p-4">
                    {newPhoto.url && !newPhoto.url.startsWith('http') ? (
                      <div className="mb-3">
                        <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden mb-2">
                          <img 
                            src={newPhoto.url} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewPhoto({ ...newPhoto, url: '' })}
                          className="w-full text-sm text-red-500 hover:text-red-700"
                        >
                          Remover imagem
                        </button>
                      </div>
                    ) : null}
                    <label 
                      htmlFor="imageUpload"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-colors bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">
                        {newPhoto.url && !newPhoto.url.startsWith('http') ? 'Trocar Imagem' : 'Carregar do Dispositivo'}
                      </span>
                    </label>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      📸 Selecione uma foto do seu dispositivo (máx. 5MB)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Gravar Áudio (opcional)</label>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                          isRecording 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        {isRecording ? (
                          <>
                            <Square className="w-4 h-4" />
                            <span className="text-sm">Parar</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4" />
                            <span className="text-sm">Gravar</span>
                          </>
                        )}
                      </button>
                      {isRecording && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-600">Gravando...</span>
                        </div>
                      )}
                    </div>
                    {recordedAudioUrl && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-purple-700">✓ Áudio gravado</span>
                          <button
                            type="button"
                            onClick={() => {
                              setRecordedAudioUrl('');
                              setNewPhoto({ ...newPhoto, audioUrl: '' });
                            }}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Permita o acesso ao microfone quando solicitado
                    </p>
                  </div>
                </div>

                <button
                  onClick={addPhoto}
                  className="w-full bg-blue-500 text-white py-3 rounded-full text-lg hover:bg-blue-600 transition-colors"
                >
                  Salvar Foto
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && photoToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl mb-2">Tem certeza?</h2>
                <p className="text-gray-600">
                  Deseja realmente remover a foto de <strong>{photoToDelete.name}</strong>?
                </p>
                <p className="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={deletePhoto}
                  className="w-full bg-red-500 text-white py-3 rounded-full text-lg hover:bg-red-600 transition-colors"
                >
                  Sim, Remover
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setPhotoToDelete(null);
                  }}
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