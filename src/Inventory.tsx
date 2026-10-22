import { useState } from 'react';
import { motion } from 'framer-motion';
import { CSGO_SKINS, RARITY_NAMES, RARITY_COLORS } from './types';

interface InventoryProps {
  inventory: string[];
  gold: number;
  onSell: (itemId: string) => void;
  onUpgrade: (fromId: string, toId: string) => void;
  onClose: () => void;
}

export default function Inventory({ inventory, gold, onSell, onUpgrade, onClose }: InventoryProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [upgradeTarget, setUpgradeTarget] = useState<string | null>(null);
  const [showUpgradeAnimation, setShowUpgradeAnimation] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState<'success' | 'fail' | null>(null);

  const getSkinById = (id: string) => {
    return CSGO_SKINS.find(skin => skin.id === id);
  };

  const calculateUpgradeChance = (fromPrice: number, toPrice: number): number => {
    const ratio = fromPrice / toPrice;
    return Math.max(5, Math.min(95, ratio * 100));
  };

  const handleUpgrade = () => {
    if (!selectedItem || !upgradeTarget) return;

    setShowUpgradeAnimation(true);

    const fromSkin = getSkinById(selectedItem);
    const toSkin = getSkinById(upgradeTarget);
    if (!fromSkin || !toSkin) return;

    const chance = calculateUpgradeChance(fromSkin.price, toSkin.price);
    const roll = Math.random() * 100;

    setTimeout(() => {
      if (roll < chance) {
        setUpgradeResult('success');
        onUpgrade(selectedItem, upgradeTarget);
      } else {
        setUpgradeResult('fail');
        onSell(selectedItem);
      }

      setTimeout(() => {
        setShowUpgradeAnimation(false);
        setUpgradeResult(null);
        setSelectedItem(null);
        setUpgradeTarget(null);
      }, 2000);
    }, 2000);
  };

  const availableUpgrades = selectedItem
    ? CSGO_SKINS.filter(skin => {
        const fromSkin = getSkinById(selectedItem);
        if (!fromSkin) return false;
        return skin.price > fromSkin.price * 1.5;
      })
    : [];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-orange-500/50 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            🎒 Инвентарь
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">✕</button>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-yellow-500/30 mb-6">
          <div className="text-sm text-slate-400">Ваш баланс</div>
          <div className="text-2xl font-bold text-yellow-400">💰 {gold}</div>
        </div>

        {inventory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <div className="text-xl text-slate-400">Инвентарь пуст</div>
            <div className="text-sm text-slate-500 mt-2">Откройте кейсы в казино!</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Левая колонка - Инвентарь */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Ваши предметы</h3>
              <div className="grid grid-cols-2 gap-3">
                {inventory.map((itemId, index) => {
                  const skin = getSkinById(itemId);
                  if (!skin) return null;

                  const rarityColor = RARITY_COLORS[skin.rarity as keyof typeof RARITY_COLORS];
                  const isSelected = selectedItem === itemId;

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setSelectedItem(itemId);
                        setUpgradeTarget(null);
                      }}
                      className={`bg-gradient-to-br ${rarityColor.bg} rounded-xl border-2 ${
                        isSelected ? 'border-yellow-400 ring-2 ring-yellow-400' : rarityColor.border
                      } p-3 cursor-pointer transition-all`}
                    >
                      <div className="text-3xl mb-2">{skin.icon}</div>
                      <div className="text-xs text-slate-300">{skin.weapon}</div>
                      <div className="text-sm font-bold text-white">{skin.name}</div>
                      <div className={`text-[10px] ${rarityColor.text} mt-1`}>
                        {RARITY_NAMES[skin.rarity as keyof typeof RARITY_NAMES]}
                      </div>
                      <div className="text-xs text-yellow-300 mt-1">💰 {skin.price}</div>
                    </motion.div>
                  );
                })}
              </div>

              {selectedItem && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onSell(selectedItem)}
                    className="flex-1 py-2 bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                    💰 Продать
                  </button>
                </div>
              )}
            </div>

            {/* Правая колонка - Апгрейд */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">⚡ Апгрейд</h3>
              
              {!selectedItem ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-4xl mb-2">👆</div>
                  <div>Выберите предмет для апгрейда</div>
                </div>
              ) : !upgradeTarget ? (
                <div>
                  <div className="text-sm text-slate-400 mb-3">Выберите целевой предмет:</div>
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {availableUpgrades.map(skin => {
                      const fromSkin = getSkinById(selectedItem);
                      if (!fromSkin) return null;

                      const chance = calculateUpgradeChance(fromSkin.price, skin.price);
                      const rarityColor = RARITY_COLORS[skin.rarity as keyof typeof RARITY_COLORS];
                      const isSelected = upgradeTarget === skin.id;

                      return (
                        <motion.div
                          key={skin.id}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setUpgradeTarget(skin.id)}
                          className={`bg-gradient-to-br ${rarityColor.bg} rounded-lg border-2 ${
                            isSelected ? 'border-yellow-400 ring-2 ring-yellow-400' : rarityColor.border
                          } p-2 cursor-pointer transition-all`}
                        >
                          <div className="text-2xl mb-1">{skin.icon}</div>
                          <div className="text-[10px] text-slate-300">{skin.weapon}</div>
                          <div className="text-xs font-bold text-white">{skin.name}</div>
                          <div className="text-[10px] text-yellow-300 mt-1">💰 {skin.price}</div>
                          <div className="text-[10px] text-green-400 mt-1">Шанс: {chance.toFixed(1)}%</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/30 mb-4">
                    <div className="text-sm text-slate-400 mb-2">Апгрейд:</div>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        {(() => {
                          const fromSkin = getSkinById(selectedItem);
                          if (!fromSkin) return null;
                          const rarityColor = RARITY_COLORS[fromSkin.rarity as keyof typeof RARITY_COLORS];
                          return (
                            <div className={`bg-gradient-to-br ${rarityColor.bg} rounded-lg border-2 ${rarityColor.border} p-2`}>
                              <div className="text-2xl">{fromSkin.icon}</div>
                              <div className="text-xs text-white">{fromSkin.name}</div>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="text-2xl">→</div>
                      <div className="text-center">
                        {(() => {
                          const toSkin = getSkinById(upgradeTarget);
                          if (!toSkin) return null;
                          const rarityColor = RARITY_COLORS[toSkin.rarity as keyof typeof RARITY_COLORS];
                          return (
                            <div className={`bg-gradient-to-br ${rarityColor.bg} rounded-lg border-2 ${rarityColor.border} p-2`}>
                              <div className="text-2xl">{toSkin.icon}</div>
                              <div className="text-xs text-white">{toSkin.name}</div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <div className="text-sm text-slate-400">Шанс успеха:</div>
                      <div className="text-2xl font-bold text-green-400">
                        {calculateUpgradeChance(
                          getSkinById(selectedItem)?.price || 0,
                          getSkinById(upgradeTarget)?.price || 0
                        ).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleUpgrade}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
                  >
                    ⚡ Апгрейднуть!
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Анимация апгрейда */}
        {showUpgradeAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="text-9xl"
            >
              ⚡
            </motion.div>
            
            {upgradeResult && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute text-center"
              >
                <div className="text-6xl mb-4">
                  {upgradeResult === 'success' ? '🎉' : '💀'}
                </div>
                <div className={`text-4xl font-bold ${
                  upgradeResult === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {upgradeResult === 'success' ? 'УСПЕХ!' : 'ПРОВАЛ!'}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
