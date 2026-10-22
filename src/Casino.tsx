import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CSGO_SKINS, RARITY_NAMES, RARITY_COLORS, type CSGOSkin } from './types';

interface CasinoProps {
  gold: number;
  setGold: (gold: number) => void;
  onClose: () => void;
  addToInventory: (itemId: string) => void;
}

export default function Casino({ gold, setGold, onClose, addToInventory }: CasinoProps) {
  const [game, setGame] = useState<'menu' | 'roulette' | 'blackjack' | 'cases'>('menu');

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/50 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {game === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                🎰 Казино
              </h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">✕</button>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 border border-yellow-500/30">
              <div className="text-sm text-slate-400">Ваш баланс</div>
              <div className="text-3xl font-bold text-yellow-400">💰 {gold}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setGame('roulette')}
                className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 p-6 rounded-xl transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-2">🎰</div>
                <div className="text-xl font-bold text-white">Рулетка</div>
                <div className="text-sm text-red-200">Классическая рулетка</div>
              </button>

              <button
                onClick={() => setGame('blackjack')}
                className="bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 p-6 rounded-xl transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-2">🃏</div>
                <div className="text-xl font-bold text-white">Блэкджек</div>
                <div className="text-sm text-green-200">21 очко</div>
              </button>

              <button
                onClick={() => setGame('cases')}
                className="bg-gradient-to-br from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700 p-6 rounded-xl transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-2">📦</div>
                <div className="text-xl font-bold text-white">Кейсы CS:GO</div>
                <div className="text-sm text-orange-200">Открой и получи скин!</div>
              </button>
            </div>
          </div>
        )}

        {game === 'roulette' && <Roulette gold={gold} setGold={setGold} onClose={() => setGame('menu')} addToInventory={addToInventory} />}
        {game === 'blackjack' && <Blackjack gold={gold} setGold={setGold} onClose={() => setGame('menu')} addToInventory={addToInventory} />}
        {game === 'cases' && <Cases gold={gold} setGold={setGold} onClose={() => setGame('menu')} addToInventory={addToInventory} />}
      </div>
    </div>
  );
}

// Рулетка
function Roulette({ gold, setGold, onClose, addToInventory }: CasinoProps) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [resultColor, setResultColor] = useState<string>('');
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [rotation, setRotation] = useState(0);

  const ROULETTE_NUMBERS = [
    { num: 0, color: 'green' },
    { num: 32, color: 'red' }, { num: 15, color: 'black' }, { num: 19, color: 'red' }, { num: 4, color: 'black' },
    { num: 21, color: 'red' }, { num: 2, color: 'black' }, { num: 25, color: 'red' }, { num: 17, color: 'black' },
    { num: 34, color: 'red' }, { num: 6, color: 'black' }, { num: 27, color: 'red' }, { num: 13, color: 'black' },
    { num: 36, color: 'red' }, { num: 11, color: 'black' }, { num: 30, color: 'red' }, { num: 8, color: 'black' },
    { num: 23, color: 'red' }, { num: 10, color: 'black' }, { num: 5, color: 'red' }, { num: 24, color: 'black' },
    { num: 16, color: 'red' }, { num: 33, color: 'black' }, { num: 1, color: 'red' }, { num: 20, color: 'black' },
    { num: 14, color: 'red' }, { num: 31, color: 'black' }, { num: 9, color: 'red' }, { num: 22, color: 'black' },
    { num: 18, color: 'red' }, { num: 29, color: 'black' }, { num: 7, color: 'red' }, { num: 28, color: 'black' },
    { num: 12, color: 'red' }, { num: 35, color: 'black' }, { num: 3, color: 'red' }, { num: 26, color: 'black' },
  ];

  const generateRouletteGradient = () => {
    const totalNumbers = ROULETTE_NUMBERS.length;
    const segmentAngle = 360 / totalNumbers;
    let gradient = 'conic-gradient(from 0deg';
    
    ROULETTE_NUMBERS.forEach((item, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      const color = item.color === 'red' ? '#dc2626' : item.color === 'black' ? '#000000' : '#16a34a';
      gradient += `, ${color} ${startAngle}deg ${endAngle}deg`;
    });
    
    gradient += ')';
    return gradient;
  };

  const spin = () => {
    if (!selectedBet || spinning) return;
    if (gold < betAmount) {
      setMessage('❌ Недостаточно золота!');
      return;
    }

    setSpinning(true);
    setMessage('');
    setResult(null);

    const resultIndex = Math.floor(Math.random() * ROULETTE_NUMBERS.length);
    const resultNum = ROULETTE_NUMBERS[resultIndex];

    const segmentAngle = 360 / ROULETTE_NUMBERS.length;
    const targetRotation = rotation + 360 * 5 + (resultIndex * segmentAngle) + (segmentAngle / 2);
    setRotation(targetRotation);

    setTimeout(() => {
      setResult(resultNum.num);
      setResultColor(resultNum.color);
      setSpinning(false);

      let winnings = 0;
      const bet = selectedBet;

      if (bet === 'red' && resultNum.color === 'red') winnings = betAmount * 2;
      else if (bet === 'black' && resultNum.color === 'black') winnings = betAmount * 2;
      else if (bet === 'green' && resultNum.color === 'green') winnings = betAmount * 36;
      else if (bet === 'odd' && resultNum.num % 2 === 1 && resultNum.num !== 0) winnings = betAmount * 2;
      else if (bet === 'even' && resultNum.num % 2 === 0 && resultNum.num !== 0) winnings = betAmount * 2;
      else if (bet === '1-18' && resultNum.num >= 1 && resultNum.num <= 18) winnings = betAmount * 2;
      else if (bet === '19-36' && resultNum.num >= 19 && resultNum.num <= 36) winnings = betAmount * 2;
      else if (!isNaN(Number(bet)) && Number(bet) === resultNum.num) winnings = betAmount * 36;

      if (winnings > 0) {
        setGold(gold - betAmount + winnings);
        setMessage(`🎉 Выигрыш: +${winnings}💰!`);
      } else {
        setGold(gold - betAmount);
        setMessage(`😢 Проигрыш: -${betAmount}💰`);
      }
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-green-400">🎰 Рулетка</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">← Назад</button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-yellow-500/30">
        <div className="text-sm text-slate-400">Ваш баланс</div>
        <div className="text-2xl font-bold text-yellow-400">💰 {gold}</div>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <div
            className="w-64 h-64 rounded-full border-8 border-yellow-600 transition-transform duration-[3000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: generateRouletteGradient()
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-yellow-400" />
        </div>
      </div>

      {result !== null && (
        <div className={`text-center text-3xl font-bold p-4 rounded-xl ${
          resultColor === 'red' ? 'bg-red-600' : resultColor === 'black' ? 'bg-black' : 'bg-green-600'
        } text-white`}>
          {result}
        </div>
      )}

      <div className="flex gap-2 items-center justify-center">
        <span className="text-slate-400">Ставка:</span>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
          className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
          disabled={spinning}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setSelectedBet('red')}
          disabled={spinning}
          className={`p-3 rounded-lg font-bold transition-all ${
            selectedBet === 'red' ? 'bg-red-600 ring-2 ring-yellow-400' : 'bg-red-700 hover:bg-red-600'
          } text-white disabled:opacity-50`}
        >
          🔴 Красное
        </button>
        <button
          onClick={() => setSelectedBet('black')}
          disabled={spinning}
          className={`p-3 rounded-lg font-bold transition-all ${
            selectedBet === 'black' ? 'bg-black ring-2 ring-yellow-400' : 'bg-slate-900 hover:bg-slate-800'
          } text-white border border-slate-600 disabled:opacity-50`}
        >
          ⚫ Чёрное
        </button>
        <button
          onClick={() => setSelectedBet('green')}
          disabled={spinning}
          className={`p-3 rounded-lg font-bold transition-all ${
            selectedBet === 'green' ? 'bg-green-600 ring-2 ring-yellow-400' : 'bg-green-700 hover:bg-green-600'
          } text-white disabled:opacity-50`}
        >
          🟢 Зеро
        </button>
        <button
          onClick={() => setSelectedBet('odd')}
          disabled={spinning}
          className={`p-3 rounded-lg font-bold transition-all ${
            selectedBet === 'odd' ? 'bg-purple-600 ring-2 ring-yellow-400' : 'bg-purple-700 hover:bg-purple-600'
          } text-white disabled:opacity-50`}
        >
          Нечёт
        </button>
        <button
          onClick={() => setSelectedBet('even')}
          disabled={spinning}
          className={`p-3 rounded-lg font-bold transition-all ${
            selectedBet === 'even' ? 'bg-blue-600 ring-2 ring-yellow-400' : 'bg-blue-700 hover:bg-blue-600'
          } text-white disabled:opacity-50`}
        >
          Чёт
        </button>
        <button
          onClick={() => setSelectedBet('1-18')}
          disabled={spinning}
          className={`p-3 rounded-lg font-bold transition-all ${
            selectedBet === '1-18' ? 'bg-orange-600 ring-2 ring-yellow-400' : 'bg-orange-700 hover:bg-orange-600'
          } text-white disabled:opacity-50`}
        >
          1-18
        </button>
        <button
          onClick={() => setSelectedBet('19-36')}
          disabled={spinning}
          className={`p-3 rounded-lg font-bold transition-all col-span-2 ${
            selectedBet === '19-36' ? 'bg-orange-600 ring-2 ring-yellow-400' : 'bg-orange-700 hover:bg-orange-600'
          } text-white disabled:opacity-50`}
        >
          19-36
        </button>
      </div>

      <button
        onClick={spin}
        disabled={!selectedBet || spinning || gold < betAmount}
        className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {spinning ? '🎰 Крутится...' : '🎰 Крутить!'}
      </button>

      {message && (
        <div className={`text-center font-bold text-lg ${
          message.includes('Выигрыш') ? 'text-green-400' : 'text-red-400'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

// Блэкджек
interface Card {
  suit: string;
  value: string;
  numValue: number;
}

function createDeck(): Card[] {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      let numValue = parseInt(value);
      if (value === 'A') numValue = 11;
      else if (['J', 'Q', 'K'].includes(value)) numValue = 10;
      deck.push({ suit, value, numValue });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

function calculateHand(cards: Card[]): number {
  let sum = cards.reduce((acc, card) => acc + card.numValue, 0);
  let aces = cards.filter(card => card.value === 'A').length;
  while (sum > 21 && aces > 0) {
    sum -= 10;
    aces--;
  }
  return sum;
}

function Blackjack({ gold, setGold, onClose, addToInventory }: CasinoProps) {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [betAmount, setBetAmount] = useState(10);
  const [gamePhase, setGamePhase] = useState<'betting' | 'playing' | 'dealer' | 'ended'>('betting');
  const [message, setMessage] = useState('');
  const [showDealerCard, setShowDealerCard] = useState(false);

  const startGame = () => {
    if (gold < betAmount) {
      setMessage('❌ Недостаточно золота!');
      return;
    }

    const newDeck = createDeck();
    setDeck(newDeck);
    setPlayerHand([newDeck.pop()!, newDeck.pop()!]);
    setDealerHand([newDeck.pop()!, newDeck.pop()!]);
    setGamePhase('playing');
    setShowDealerCard(false);
    setMessage('');

    if (calculateHand(playerHand) === 21) {
      setShowDealerCard(true);
      setGamePhase('ended');
      setGold(gold + Math.floor(betAmount * 1.5));
      setMessage('🎉 Блэкджек! Вы выиграли x1.5!');
    }
  };

  const hit = () => {
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newHand = [...playerHand, card];
    setDeck(newDeck);
    setPlayerHand(newHand);

    const sum = calculateHand(newHand);
    if (sum > 21) {
      setShowDealerCard(true);
      setGamePhase('ended');
      setGold(gold - betAmount);
      setMessage('💥 Перебор! Вы проиграли.');
    } else if (sum === 21) {
      stand();
    }
  };

  const stand = () => {
    setShowDealerCard(true);
    setGamePhase('dealer');

    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];

    const dealerPlay = () => {
      while (calculateHand(currentDealerHand) < 17) {
        currentDealerHand.push(currentDeck.pop()!);
      }

      setDealerHand(currentDealerHand);
      setDeck(currentDeck);

      const playerSum = calculateHand(playerHand);
      const dealerSum = calculateHand(currentDealerHand);

      if (dealerSum > 21) {
        setGold(gold + betAmount);
        setMessage('🎉 Дилер перебрал! Вы выиграли!');
      } else if (playerSum > dealerSum) {
        setGold(gold + betAmount);
        setMessage('🎉 Вы выиграли!');
      } else if (playerSum < dealerSum) {
        setGold(gold - betAmount);
        setMessage('😢 Дилер выиграл.');
      } else {
        setMessage('🤝 Ничья!');
      }

      setGamePhase('ended');
    };

    setTimeout(dealerPlay, 500);
  };

  const CardComponent = ({ card, hidden = false }: { card: Card; hidden?: boolean }) => {
    if (hidden) {
      return (
        <div className="w-16 h-24 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg border-2 border-blue-500 flex items-center justify-center shadow-lg">
          <span className="text-3xl">🂠</span>
        </div>
      );
    }
    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <div className="w-16 h-24 bg-white rounded-lg border-2 border-slate-300 flex flex-col items-center justify-center shadow-lg">
        <div className={`text-xl font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.value}
        </div>
        <div className={`text-2xl ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-red-400">🃏 Блэкджек</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">← Назад</button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-yellow-500/30">
        <div className="text-sm text-slate-400">Ваш баланс</div>
        <div className="text-2xl font-bold text-yellow-400">💰 {gold}</div>
      </div>

      <div>
        <div className="text-sm text-slate-400 mb-2">Дилер {showDealerCard && `(${calculateHand(dealerHand)})`}</div>
        <div className="flex gap-2 min-h-[96px]">
          {dealerHand.map((card, i) => (
            <CardComponent key={i} card={card} hidden={i === 1 && !showDealerCard} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm text-slate-400 mb-2">Вы ({calculateHand(playerHand)})</div>
        <div className="flex gap-2 min-h-[96px]">
          {playerHand.map((card, i) => (
            <CardComponent key={i} card={card} />
          ))}
        </div>
      </div>

      {gamePhase === 'betting' && (
        <>
          <div className="flex gap-2 items-center justify-center">
            <span className="text-slate-400">Ставка:</span>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <button
            onClick={startGame}
            disabled={gold < betAmount}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
          >
            🃏 Раздать карты
          </button>
        </>
      )}

      {gamePhase === 'playing' && (
        <div className="flex gap-2">
          <button
            onClick={hit}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
          >
            ➕ Ещё
          </button>
          <button
            onClick={stand}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
          >
            ✋ Хватит
          </button>
        </div>
      )}

      {gamePhase === 'ended' && (
        <button
          onClick={() => {
            setGamePhase('betting');
            setPlayerHand([]);
            setDealerHand([]);
            setMessage('');
          }}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
        >
          🔄 Играть снова
        </button>
      )}

      {message && (
        <div className={`text-center font-bold text-lg ${
          message.includes('выиграли') || message.includes('Блэкджек') ? 'text-green-400' :
          message.includes('Ничья') ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

// Кейсы CS:GO
function Cases({ gold, setGold, onClose, addToInventory }: CasinoProps) {
  const [opening, setOpening] = useState(false);
  const [wonItem, setWonItem] = useState<any>(null);
  const [spinningItems, setSpinningItems] = useState<any[]>([]);
  const [spinPosition, setSpinPosition] = useState(0);
  const [showChoice, setShowChoice] = useState(false);

  const CASE_COST = 100;

  const openCase = () => {
    if (gold < CASE_COST) return;

    setGold(gold - CASE_COST);
    setOpening(true);
    setWonItem(null);
    setShowChoice(false);

    // Определяем выигрышный предмет СРАЗУ
    const rand = Math.random();
    let rarity: 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'special';
    
    if (rand < 0.01) rarity = 'special';
    else if (rand < 0.05) rarity = 'covert';
    else if (rand < 0.15) rarity = 'classified';
    else if (rand < 0.35) rarity = 'restricted';
    else if (rand < 0.65) rarity = 'milspec';
    else if (rand < 0.85) rarity = 'industrial';
    else rarity = 'consumer';

    const possibleItems = CSGO_SKINS.filter(item => item.rarity === rarity);
    const wonSkin = possibleItems[Math.floor(Math.random() * possibleItems.length)];

    // Создаём ленту из 30 предметов, выигрышный на позиции 25
    const items: CSGOSkin[] = [];
    const winPosition = 25;
    
    for (let i = 0; i < 30; i++) {
      if (i === winPosition) {
        items.push(wonSkin);
      } else {
        const allItems = CSGO_SKINS.filter(item => item.rarity !== 'special');
        items.push(allItems[Math.floor(Math.random() * allItems.length)]);
      }
    }

    setSpinningItems(items);
    setSpinPosition(0);

    setTimeout(() => {
      setSpinPosition(winPosition);
    }, 100);

    setTimeout(() => {
      setWonItem(wonSkin);
      setOpening(false);
      setShowChoice(true);
    }, 4000);
  };

  const handleKeep = () => {
    if (wonItem) {
      addToInventory(wonItem.id);
      setWonItem(null);
      setShowChoice(false);
    }
  };

  const handleSell = () => {
    if (wonItem) {
      const sellPrice = Math.floor(wonItem.price * 0.7);
      setGold(gold + sellPrice);
      setWonItem(null);
      setShowChoice(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-orange-400">📦 Кейсы CS:GO</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">← Назад</button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-yellow-500/30">
        <div className="text-sm text-slate-400">Ваш баланс</div>
        <div className="text-2xl font-bold text-yellow-400">💰 {gold}</div>
      </div>

      <div className="flex justify-center">
        <motion.div
          animate={!opening && !wonItem ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 2, repeat: !opening && !wonItem ? Infinity : 0 }}
          className="w-32 h-32 bg-gradient-to-br from-orange-600 to-red-700 rounded-xl border-4 border-yellow-500 flex items-center justify-center shadow-2xl"
        >
          <span className="text-6xl">📦</span>
        </motion.div>
      </div>

      {(opening || wonItem) && (
        <div className="w-full overflow-hidden relative h-24 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-400 z-10 -translate-x-1/2 shadow-lg shadow-yellow-400/50" />
          <motion.div
            className="flex gap-2 absolute top-1/2 -translate-y-1/2"
            animate={{ x: `calc(50% - ${spinPosition * 84 + 40}px)` }}
            transition={{ duration: 3.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {spinningItems.map((item, i) => {
              const rarityColor = RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS];
              return (
                <div key={i} className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br ${rarityColor.bg} rounded-lg border-2 ${rarityColor.border} flex flex-col items-center justify-center p-1`}>
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[8px] text-white font-bold text-center leading-tight truncate w-full">{item.name}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      )}

      {wonItem && showChoice && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-full bg-gradient-to-br ${RARITY_COLORS[wonItem.rarity as keyof typeof RARITY_COLORS].bg} rounded-xl border-4 ${RARITY_COLORS[wonItem.rarity as keyof typeof RARITY_COLORS].border} p-4 text-center shadow-2xl`}
        >
          <div className="text-5xl mb-2">{wonItem.icon}</div>
          <div className={`text-xs font-bold uppercase ${RARITY_COLORS[wonItem.rarity as keyof typeof RARITY_COLORS].text}`}>
            {RARITY_NAMES[wonItem.rarity as keyof typeof RARITY_NAMES]}
          </div>
          <div className="text-lg font-bold text-white mb-1">{wonItem.weapon} | {wonItem.name}</div>
          <div className="text-sm text-slate-200 mb-2">{wonItem.description}</div>
          <div className="text-lg text-yellow-300 font-bold mb-3">💰 {wonItem.price}</div>
          
          <div className="flex gap-2">
            <button
              onClick={handleKeep}
              className="flex-1 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-lg hover:scale-105 transition-transform"
            >
              ✓ Оставить
            </button>
            <button
              onClick={handleSell}
              className="flex-1 py-2 bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold rounded-lg hover:scale-105 transition-transform"
            >
              💰 Продать ({Math.floor(wonItem.price * 0.7)})
            </button>
          </div>
        </motion.div>
      )}

      {!opening && !wonItem && (
        <button
          onClick={openCase}
          disabled={gold < CASE_COST}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
        >
          📦 Открыть кейс ({CASE_COST}💰)
        </button>
      )}

      {wonItem && !showChoice && (
        <button
          onClick={() => setWonItem(null)}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
        >
          🔄 Открыть ещё
        </button>
      )}
    </div>
  );
}
