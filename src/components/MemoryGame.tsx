import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const emojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🍀', '🌿'];

  const initializeGame = () => {
    const gameEmojis = emojis.slice(0, 6);
    const cardPairs = [...gameEmojis, ...gameEmojis];
    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      const [first, second] = flippedCards;
      
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === first || idx === second 
              ? { ...card, isMatched: true }
              : card
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === first || idx === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  const handleCardClick = (index: number) => {
    if (
      isChecking || 
      cards[index].isFlipped || 
      cards[index].isMatched || 
      flippedCards.length >= 2
    ) {
      return;
    }

    setCards(prev => prev.map((card, idx) => 
      idx === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, index]);
  };

  const allMatched = cards.length > 0 && cards.every(card => card.isMatched);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl text-pink-600 ml-4">Jogo da Memória</h1>
          </div>
          <button
            onClick={initializeGame}
            className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">Encontre os pares! 🧠</p>

        {/* Score */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-md">
          <p className="text-center text-lg">
            Movimentos: <span className="text-2xl text-pink-600">{moves}</span>
          </p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={card.isMatched || card.isFlipped || isChecking}
              className={`aspect-square rounded-2xl text-5xl flex items-center justify-center transition-all duration-300 transform ${
                card.isFlipped || card.isMatched
                  ? 'bg-white shadow-lg scale-100'
                  : 'bg-gradient-to-br from-pink-200 to-purple-200 hover:scale-105 shadow-md'
              } ${card.isMatched ? 'opacity-60' : ''}`}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
            </button>
          ))}
        </div>

        {/* Victory Message */}
        {allMatched && (
          <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-2xl mb-2">🎉 Parabéns!</p>
            <p className="text-lg mb-4">Você encontrou todos os pares!</p>
            <p className="text-sm">Movimentos: {moves}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-2xl p-4 mt-6">
          <h3 className="text-lg mb-2">Como jogar:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Clique em duas cartas para virá-las</li>
            <li>• Encontre os pares iguais</li>
            <li>• Tente completar com menos movimentos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
