import { useNavigate } from 'react-router';
import welcomeImg from 'figma:asset/f6c240a6ae1c2bcc591c1638da9e9ebb82ddcccc.png';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Phone Notch */}
        <div className="bg-black h-8 rounded-b-3xl mx-auto w-40"></div>
        
        <div className="p-8 text-center">
          {/* Header */}
          <h1 className="text-4xl text-blue-400 mb-2">Viver é Lembrar</h1>
          <p className="text-gray-600 mb-8">Cuidando das memórias com carinho</p>
          
          {/* Main Image */}
          <div className="mb-8">
            <img 
              src={welcomeImg} 
              alt="Cuidador e pessoa idosa"
              className="w-full h-auto"
            />
          </div>
          
          {/* Buttons */}
          <button 
            onClick={() => navigate('/home')}
            className="w-full bg-blue-400 text-white py-4 rounded-full text-xl mb-4 hover:bg-blue-500 transition-colors"
          >
            Entrar
          </button>
          
          <button 
            onClick={() => navigate('/home')}
            className="w-full bg-white text-orange-500 py-4 rounded-full text-xl border-2 border-orange-500 hover:bg-orange-50 transition-colors"
          >
            Criar Conta
          </button>
          
          {/* Bottom Decoration */}
          <div className="mt-12">
            <div className="h-32 bg-gradient-to-t from-yellow-100 to-transparent rounded-2xl"></div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-8 pb-4">
          <p className="text-gray-500 text-sm">Sobre o App</p>
        </div>
      </div>
    </div>
  );
}