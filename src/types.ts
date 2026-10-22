export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Position = { x: number; y: number };
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameState = 'idle' | 'playing' | 'paused' | 'gameover' | 'shop' | 'casino';

export interface Boss {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  type: 'roshan' | 'ancient' | 'tormentor';
  name: string;
  lastMove: number;
  moveInterval: number;
  direction: Direction;
  active: boolean;
  hitFlash: number;
  reward: number;
  goldReward: number;
  size: number;
  stunned: number;
}

export interface DamageNumber {
  x: number;
  y: number;
  value: number;
  timestamp: number;
  color: string;
  crit?: boolean;
}

export interface Item {
  id: string;
  name: string;
  icon: string;
  cost: number;
  description: string;
  type: 'active' | 'passive';
  cooldown?: number;
  tier: 'basic' | 'mid' | 'luxury';
  color: string;
}

export interface InventorySlot {
  item: Item | null;
  cooldownRemaining: number;
}

export interface Skin {
  id: string;
  name: string;
  icon: string;
  cost: number;
  headColor: string;
  bodyColorStart: string;
  bodyColorEnd: string;
  glowColor: string;
  eyeColor: string;
  owned: boolean;
}

export interface CSGOSkin {
  id: string;
  name: string;
  icon: string;
  weapon: string;
  rarity: 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'special';
  price: number;
  description: string;
}

export const ITEMS: Item[] = [
  { id: 'tango', name: 'Tango', icon: '🍖', cost: 50, description: 'Пассивно: +длина змейки при сборе еды', type: 'passive', tier: 'basic', color: 'from-amber-700 to-amber-900' },
  { id: 'boots', name: 'Boots of Speed', icon: '🥾', cost: 100, description: 'Пассивно: +30% скорости', type: 'passive', tier: 'basic', color: 'from-yellow-700 to-yellow-900' },
  { id: 'blink', name: 'Blink Dagger', icon: '💨', cost: 150, description: 'Телепорт в случайное место (КД 15с)', type: 'active', cooldown: 150, tier: 'mid', color: 'from-blue-600 to-blue-900' },
  { id: 'shadow_blade', name: 'Shadow Blade', icon: '🗡️', cost: 200, description: 'Невидимость 5с, боссы замирают (КД 25с)', type: 'active', cooldown: 250, tier: 'mid', color: 'from-slate-600 to-slate-900' },
  { id: 'bkb', name: 'Black King Bar', icon: '🛡️', cost: 250, description: 'Иммунитет к боссам 6с (КД 30с)', type: 'active', cooldown: 300, tier: 'mid', color: 'from-yellow-600 to-orange-900' },
  { id: 'daedalus', name: 'Daedalus', icon: '⚔️', cost: 280, description: '25% шанс крита x2 по боссам', type: 'passive', tier: 'luxury', color: 'from-red-700 to-red-950' },
  { id: 'mjollnir', name: 'Mjollnir', icon: '⚡', cost: 300, description: '30% шанс оглушить босса на 3с', type: 'passive', tier: 'luxury', color: 'from-cyan-600 to-blue-900' },
  { id: 'aghanim', name: "Aghanim's Scepter", icon: '💎', cost: 400, description: 'x2 золота, +1 урон, щит дольше', type: 'passive', tier: 'luxury', color: 'from-purple-600 to-fuchsia-900' },
];

export const SKINS: Skin[] = [
  { id: 'classic', name: 'Классика', icon: '🟢', cost: 0, headColor: '#2ed573', bodyColorStart: '#2ed573', bodyColorEnd: '#1a8a4a', glowColor: '#2ed573', eyeColor: '#ffffff', owned: true },
  { id: 'fire', name: 'Пламя', icon: '🔥', cost: 500, headColor: '#ff6b35', bodyColorStart: '#ff4500', bodyColorEnd: '#8b0000', glowColor: '#ff6347', eyeColor: '#ffd700', owned: false },
  { id: 'ice', name: 'Лёд', icon: '❄️', cost: 500, headColor: '#00d4ff', bodyColorStart: '#4fc3f7', bodyColorEnd: '#01579b', glowColor: '#00bcd4', eyeColor: '#e0f7fa', owned: false },
  { id: 'shadow', name: 'Тень', icon: '🌑', cost: 800, headColor: '#9c27b0', bodyColorStart: '#6a1b9a', bodyColorEnd: '#1a0033', glowColor: '#ce93d8', eyeColor: '#ff00ff', owned: false },
  { id: 'golden', name: 'Золото', icon: '👑', cost: 1500, headColor: '#ffd700', bodyColorStart: '#ffb300', bodyColorEnd: '#8b6914', glowColor: '#ffeb3b', eyeColor: '#fff8e1', owned: false },
  { id: 'rainbow', name: 'Радуга', icon: '🌈', cost: 2000, headColor: '#ff0080', bodyColorStart: '#7928ca', bodyColorEnd: '#0070f3', glowColor: '#ff0080', eyeColor: '#ffffff', owned: false },
  { id: 'toxic', name: 'Токсин', icon: '☢️', cost: 1000, headColor: '#76ff03', bodyColorStart: '#64dd17', bodyColorEnd: '#1b5e20', glowColor: '#b2ff59', eyeColor: '#f4ff81', owned: false },
  { id: 'cyber', name: 'Кибер', icon: '🤖', cost: 1200, headColor: '#00e5ff', bodyColorStart: '#18ffff', bodyColorEnd: '#006064', glowColor: '#00e5ff', eyeColor: '#ff1744', owned: false },
];

export const CSGO_SKINS: CSGOSkin[] = [
  // Consumer Grade
  { id: 'glock_sand_dune', name: 'Sand Dune', icon: '🔫', weapon: 'Glock-18', rarity: 'consumer', price: 50, description: 'Пустынная классика' },
  { id: 'p250_sand_dune', name: 'Sand Dune', icon: '🔫', weapon: 'P250', rarity: 'consumer', price: 60, description: 'Песочный стиль' },
  { id: 'mac10_palm', name: 'Palm', icon: '🔫', weapon: 'MAC-10', rarity: 'consumer', price: 70, description: 'Тропический рисунок' },
  
  // Industrial Grade
  { id: 'mp7_army_recon', name: 'Army Recon', icon: '🔫', weapon: 'MP7', rarity: 'industrial', price: 120, description: 'Армейская разведка' },
  { id: 'nova_antique', name: 'Antique', icon: '🔫', weapon: 'Nova', rarity: 'industrial', price: 150, description: 'Винтажный дизайн' },
  { id: 'famas_cyan', name: 'Cyanospatter', icon: '🔫', weapon: 'FAMAS', rarity: 'industrial', price: 180, description: 'Голубой камуфляж' },
  
  // Mil-Spec
  { id: 'ak47_blue_laminate', name: 'Blue Laminate', icon: '🔫', weapon: 'AK-47', rarity: 'milspec', price: 250, description: 'Синий ламинат' },
  { id: 'm4a1_boreal_forest', name: 'Boreal Forest', icon: '🔫', weapon: 'M4A1-S', rarity: 'milspec', price: 300, description: 'Северный лес' },
  { id: 'awp_safari_mesh', name: 'Safari Mesh', icon: '🎯', weapon: 'AWP', rarity: 'milspec', price: 350, description: 'Сетка для сафари' },
  
  // Restricted
  { id: 'ak47_redline', name: 'Redline', icon: '🔫', weapon: 'AK-47', rarity: 'restricted', price: 500, description: 'Красная линия' },
  { id: 'awp_asimov', name: 'Asiimov', icon: '🎯', weapon: 'AWP', rarity: 'restricted', price: 600, description: 'Футуристический дизайн' },
  { id: 'm4a4_asiimov', name: 'Asiimov', icon: '🔫', weapon: 'M4A4', rarity: 'restricted', price: 700, description: 'Белый с оранжевым' },
  
  // Classified
  { id: 'ak47_vulcan', name: 'Vulcan', icon: '🔫', weapon: 'AK-47', rarity: 'classified', price: 1000, description: 'Вулканическая мощь' },
  { id: 'awp_hyper_beast', name: 'Hyper Beast', icon: '🎯', weapon: 'AWP', rarity: 'classified', price: 1200, description: 'Гипер зверь' },
  { id: 'm4a1s_hot_rod', name: 'Hot Rod', icon: '🔫', weapon: 'M4A1-S', rarity: 'classified', price: 1400, description: 'Горячий стержень' },
  
  // Covert
  { id: 'ak47_fire_serpent', name: 'Fire Serpent', icon: '🔫', weapon: 'AK-47', rarity: 'covert', price: 2000, description: 'Огненный змей' },
  { id: 'awp_dragon_lore', name: 'Dragon Lore', icon: '🎯', weapon: 'AWP', rarity: 'covert', price: 2500, description: 'Легенда драконов' },
  { id: 'm4a4_howl', name: 'Howl', icon: '🔫', weapon: 'M4A4', rarity: 'covert', price: 2800, description: 'Вой оборотня' },
  
  // Special/Exceedingly Rare
  { id: 'karambit_fade', name: 'Fade', icon: '🗡️', weapon: 'Karambit', rarity: 'special', price: 4000, description: 'Градиент заката' },
  { id: 'butterfly_doppler', name: 'Doppler', icon: '🦋', weapon: 'Butterfly Knife', rarity: 'special', price: 4500, description: 'Эффект Доплера' },
  { id: 'm9_bayonet_crimson_web', name: 'Crimson Web', icon: '🗡️', weapon: 'M9 Bayonet', rarity: 'special', price: 5000, description: 'Багровая паутина' },
];

export const RARITY_NAMES = {
  consumer: 'Consumer Grade',
  industrial: 'Industrial Grade',
  milspec: 'Mil-Spec',
  restricted: 'Restricted',
  classified: 'Classified',
  covert: 'Covert',
  special: 'Special Rare',
};

export const RARITY_COLORS = {
  consumer: { text: 'text-gray-400', border: 'border-gray-500', bg: 'from-gray-600 to-gray-800' },
  industrial: { text: 'text-blue-300', border: 'border-blue-400', bg: 'from-blue-500 to-blue-700' },
  milspec: { text: 'text-blue-500', border: 'border-blue-600', bg: 'from-blue-600 to-blue-800' },
  restricted: { text: 'text-purple-400', border: 'border-purple-500', bg: 'from-purple-600 to-purple-800' },
  classified: { text: 'text-pink-400', border: 'border-pink-500', bg: 'from-pink-600 to-pink-800' },
  covert: { text: 'text-red-400', border: 'border-red-500', bg: 'from-red-600 to-red-800' },
  special: { text: 'text-yellow-400', border: 'border-yellow-500', bg: 'from-yellow-500 to-orange-600' },
};

export const GRID_SIZE = 20;
export const CELL_SIZE = 1;
export const SPEED_MAP: Record<Difficulty, number> = { easy: 150, medium: 100, hard: 60 };
export const DIFFICULTY_LABELS: Record<Difficulty, string> = { easy: 'Легко', medium: 'Средне', hard: 'Сложно' };
export const DIFFICULTY_COLORS: Record<Difficulty, string> = { easy: 'from-green-500 to-emerald-600', medium: 'from-yellow-500 to-orange-500', hard: 'from-red-500 to-rose-600' };
