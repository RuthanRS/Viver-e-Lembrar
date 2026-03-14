import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Photo {
  id: string;
  url: string;
  name: string;
  relationship: string;
}

export function PhotoAlbum() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

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

  const deletePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    localStorage.setItem('alzheimer-photos', JSON.stringify(updated));
    setSelectedPhoto(null);
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
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                {photo.url ? (
                  <ImageWithFallback 
                    src={photo.url} 
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              <h3 className="text-lg mb-1">{photo.name}</h3>
              <p className="text-sm text-gray-500">{photo.relationship}</p>
            </button>
          ))}
        </div>

        {/* Add Photo Button */}
        <button className="w-full bg-blue-400 text-white py-4 rounded-full text-lg shadow-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-6 h-6" />
          Adicionar Foto
        </button>

        {/* Photo Modal */}
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
              
              <button
                onClick={() => deletePhoto(selectedPhoto.id)}
                className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-colors"
              >
                Remover Foto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}