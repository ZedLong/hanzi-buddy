import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Star, Calendar, Award, Trophy, Users, 
  Sparkles, Heart, Target, Clock, CheckCircle,
  User, LogOut, Trash2, Volume2, Plus, X
} from 'lucide-react';

// Firebase configuration (you'll need to add your own config)
const FIREBASE_CONFIG = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Mock authentication and database functions
// In production, replace these with actual Firebase SDK calls
const mockAuth = {
  currentUser: null,
  signIn: async (email, password) => {
    // Simulate auth
    mockAuth.currentUser = { uid: 'user123', email };
    return { user: mockAuth.currentUser };
  },
  signUp: async (email, password) => {
    mockAuth.currentUser = { uid: 'user' + Date.now(), email };
    return { user: mockAuth.currentUser };
  },
  signOut: async () => {
    mockAuth.currentUser = null;
  }
};

const mockDb = {
  saveCard: async (userId, card) => {
    const cards = JSON.parse(localStorage.getItem(`cards_${userId}`) || '[]');
    cards.push(card);
    localStorage.setItem(`cards_${userId}`, JSON.stringify(cards));
    return card;
  },
  getCards: async (userId) => {
    return JSON.parse(localStorage.getItem(`cards_${userId}`) || '[]');
  },
  deleteCard: async (userId, cardId) => {
    const cards = JSON.parse(localStorage.getItem(`cards_${userId}`) || '[]');
    const updated = cards.filter(c => c.id !== cardId);
    localStorage.setItem(`cards_${userId}`, JSON.stringify(updated));
  },
  updateStreak: async (userId, streak) => {
    localStorage.setItem(`streak_${userId}`, JSON.stringify(streak));
  },
  getStreak: async (userId) => {
    return JSON.parse(localStorage.getItem(`streak_${userId}`) || '{ days: 0, lastDate: null }');
  }
};

// Character data with kid-friendly definitions
const characterData = {
  '你': { pinyin: 'nǐ', definition: 'you (like saying "hi" to a friend!)', emoji: '👋' },
  '好': { pinyin: 'hǎo', definition: 'good (when something is awesome!)', emoji: '👍' },
  '我': { pinyin: 'wǒ', definition: 'me/I (that\'s you!)', emoji: '🙋' },
  '爱': { pinyin: 'ài', definition: 'love (like loving ice cream!)', emoji: '❤️' },
  '学': { pinyin: 'xué', definition: 'learn (what you do at school!)', emoji: '📚' },
  '家': { pinyin: 'jiā', definition: 'home (where your family is!)', emoji: '🏠' },
  '水': { pinyin: 'shuǐ', definition: 'water (splash splash!)', emoji: '💧' },
  '火': { pinyin: 'huǒ', definition: 'fire (hot hot hot!)', emoji: '🔥' },
  '大': { pinyin: 'dà', definition: 'big (like a dinosaur!)', emoji: '🦕' },
  '小': { pinyin: 'xiǎo', definition: 'small (like a mouse!)', emoji: '🐭' },
  '狗': { pinyin: 'gǒu', definition: 'dog (woof woof!)', emoji: '🐕' },
  '猫': { pinyin: 'māo', definition: 'cat (meow!)', emoji: '🐱' },
  '鱼': { pinyin: 'yú', definition: 'fish (swimming in water!)', emoji: '🐟' },
  '鸟': { pinyin: 'niǎo', definition: 'bird (tweet tweet!)', emoji: '🐦' },
  '花': { pinyin: 'huā', definition: 'flower (pretty and colorful!)', emoji: '🌸' },
  '树': { pinyin: 'shù', definition: 'tree (tall with leaves!)', emoji: '🌳' },
  '月': { pinyin: 'yuè', definition: 'moon (shines at night!)', emoji: '🌙' },
  '日': { pinyin: 'rì', definition: 'sun (bright and warm!)', emoji: '☀️' },
  '星': { pinyin: 'xīng', definition: 'star (twinkle twinkle!)', emoji: '⭐' },
  '雨': { pinyin: 'yǔ', definition: 'rain (pitter patter!)', emoji: '🌧️' }
};

// Fun avatars for kids to choose
const avatars = ['🦁', '🐯', '🐻', '🐼', '🐨', '🐸', '🦊', '🦝', '🦄', '🐉'];

// Achievement badges
const achievements = [
  { id: 'first', name: 'First Steps', icon: '👶', requirement: 1, description: 'Add your first character!' },
  { id: 'five', name: 'High Five', icon: '🖐️', requirement: 5, description: 'Learn 5 characters!' },
  { id: 'ten', name: 'Perfect Ten', icon: '🔟', requirement: 10, description: 'Learn 10 characters!' },
  { id: 'week', name: 'Week Warrior', icon: '📅', requirement: 7, description: '7 day streak!' },
  { id: 'twenty', name: 'Super Star', icon: '🌟', requirement: 20, description: 'Learn 20 characters!' }
];

const HanziBuddyApp = () => {
  // Authentication states
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  
  // App states
  const [flashcards, setFlashcards] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [textInput, setTextInput] = useState('');
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState({ days: 0, lastDate: null });
  const [filter, setFilter] = useState('all'); // all, today, week
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);

  // Load user data on auth change
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const cards = await mockDb.getCards(user.uid);
      setFlashcards(cards);
      
      const userStreak = await mockDb.getStreak(user.uid);
      setStreak(userStreak);
      
      // Check for new achievements
      checkAchievements(cards.length, userStreak.days);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Check and unlock achievements
  const checkAchievements = (cardCount, streakDays) => {
    const unlocked = [];
    achievements.forEach(achievement => {
      if (achievement.id === 'week' && streakDays >= achievement.requirement) {
        unlocked.push(achievement.id);
      } else if (achievement.id !== 'week' && cardCount >= achievement.requirement) {
        unlocked.push(achievement.id);
      }
    });
    
    const newAchievements = unlocked.filter(id => !unlockedAchievements.includes(id));
    if (newAchievements.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newAchievements]);
      setShowAchievement(achievements.find(a => a.id === newAchievements[0]));
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  // Update streak
  const updateStreak = async () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = { ...streak };
    
    if (streak.lastDate === today) {
      // Already practiced today
      return;
    } else if (streak.lastDate === yesterday) {
      // Continuing streak
      newStreak.days += 1;
    } else {
      // Starting new streak
      newStreak.days = 1;
    }
    
    newStreak.lastDate = today;
    setStreak(newStreak);
    
    if (user) {
      await mockDb.updateStreak(user.uid, newStreak);
    }
  };

  // Authentication handlers
  const handleAuth = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    
    try {
      if (authMode === 'login') {
        const result = await mockAuth.signIn(email, password);
        setUser(result.user);
      } else {
        const result = await mockAuth.signUp(email, password);
        setUser(result.user);
      }
    } catch (error) {
      alert('Auth error: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    await mockAuth.signOut();
    setUser(null);
    setFlashcards([]);
    setStreak({ days: 0, lastDate: null });
  };

  // Text-to-speech with fun voice
  const speakText = (text, isCharacter = true) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = isCharacter ? 0.7 : 0.8; // Slower for single characters
      utterance.pitch = 1.1; // Slightly higher pitch for kid-friendly sound
      speechSynthesis.speak(utterance);
    }
  };

  // Add characters with individual IDs
  const addCharacters = async () => {
    if (!textInput.trim() || !user) return;
    
    const chars = textInput.split('').filter(char => char.trim());
    const newCards = [];
    
    for (const char of chars) {
      // Skip if character already exists
      if (flashcards.some(card => card.character === char)) continue;
      
      const charData = characterData[char] || {
        pinyin: '?',
        definition: 'New character to learn!',
        emoji: '✨'
      };
      
      const newCard = {
        id: `${user.uid}_${Date.now()}_${Math.random()}`, // Unique ID
        character: char,
        ...charData,
        dateAdded: new Date().toISOString(),
        weekAdded: getWeekNumber(new Date()),
        reviewCount: 0,
        mastery: 0
      };
      
      newCards.push(newCard);
      await mockDb.saveCard(user.uid, newCard);
    }
    
    setFlashcards(prev => [...newCards, ...prev]);
    setTextInput('');
    
    // Update streak when adding new cards
    updateStreak();
    
    // Check achievements
    checkAchievements(flashcards.length + newCards.length, streak.days);
    
    // Fun success animation
    if (newCards.length > 0) {
      speakText('太棒了！', false); // "Awesome!" in Chinese
    }
  };

  // Delete individual card
  const deleteCard = async (cardId) => {
    if (!user) return;
    
    await mockDb.deleteCard(user.uid, cardId);
    setFlashcards(prev => prev.filter(card => card.id !== cardId));
  };

  // Get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  };

  // Filter cards
  const getFilteredCards = () => {
    const today = new Date().toDateString();
    const currentWeek = getWeekNumber(new Date());
    
    switch (filter) {
      case 'today':
        return flashcards.filter(card => 
          new Date(card.dateAdded).toDateString() === today
        );
      case 'week':
        return flashcards.filter(card => 
          card.weekAdded === currentWeek
        );
      default:
        return flashcards;
    }
  };

  // Authentication Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🐼</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Hanzi Buddy</h1>
            <p className="text-gray-600">Learn Chinese characters the fun way!</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent's Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Your Avatar
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {avatars.map(avatar => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`text-3xl p-2 rounded-lg transition-all ${
                        selectedAvatar === avatar 
                          ? 'bg-purple-200 scale-110' 
                          : 'hover:bg-purple-100'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center mt-6">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-purple-600 hover:text-purple-800 text-sm"
            >
              {authMode === 'login' 
                ? "Don't have an account? Sign up!" 
                : "Already have an account? Login!"
              }
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800 text-center">
              <strong>💡 Free to use!</strong><br/>
              For production, connect to Firebase (free tier available)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-yellow-400 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3">
            <span className="text-4xl">{showAchievement.icon}</span>
            <div>
              <p className="font-bold text-lg">{showAchievement.name}</p>
              <p className="text-sm">{showAchievement.description}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-purple-400">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">{selectedAvatar || '🐼'}</div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Hanzi Buddy
                </h1>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-orange-500 font-bold flex items-center">
                    <Trophy size={16} className="mr-1" />
                    {streak.days} day streak!
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Sign out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {currentView === 'home' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Cards</p>
                    <p className="text-2xl font-bold text-purple-600">{flashcards.length}</p>
                  </div>
                  <BookOpen className="text-purple-400" size={32} />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Streak</p>
                    <p className="text-2xl font-bold text-orange-600">{streak.days}</p>
                  </div>
                  <Star className="text-orange-400" size={32} />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today</p>
                    <p className="text-2xl font-bold text-green-600">
                      {getFilteredCards().filter(c => 
                        new Date(c.dateAdded).toDateString() === new Date().toDateString()
                      ).length}
                    </p>
                  </div>
                  <Calendar className="text-green-400" size={32} />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-pink-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Badges</p>
                    <p className="text-2xl font-bold text-pink-600">{unlockedAchievements.length}</p>
                  </div>
                  <Award className="text-pink-400" size={32} />
                </div>
              </div>
            </div>

            {/* Add New Characters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Sparkles className="text-yellow-500 mr-2" />
                Add New Characters
              </h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type Chinese characters here..."
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-2xl"
                />
                
                {textInput && (
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <p className="text-sm text-purple-700 mb-2">Characters to add:</p>
                    <div className="flex flex-wrap gap-2">
                      {textInput.split('').filter(char => char.trim()).map((char, index) => (
                        <div key={index} className="bg-purple-200 px-4 py-2 rounded-full text-2xl flex items-center space-x-2">
                          <span>{char}</span>
                          <span className="text-lg">{characterData[char]?.emoji || '✨'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={addCharacters}
                  disabled={!textInput.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
                >
                  Add Characters ✨
                </button>
              </div>
            </div>

            {/* Study Button */}
            {flashcards.length > 0 && (
              <button
                onClick={() => {
                  setCurrentView('study');
                  setCurrentFlashcard(0);
                  setShowAnswer(false);
                  updateStreak();
                }}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-3"
              >
                <Target size={28} />
                <span>Start Daily Practice!</span>
              </button>
            )}

            {/* Filter Tabs */}
            <div className="flex space-x-2 bg-white rounded-xl p-1 shadow-md">
              {['all', 'today', 'week'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    filter === f
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f === 'all' ? 'All Cards' : f === 'today' ? "Today's Cards" : "This Week"}
                </button>
              ))}
            </div>

            {/* Character List */}
            <div className="space-y-3">
              {getFilteredCards().map((card) => (
                <div key={card.id} className="bg-white p-4 rounded-2xl shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-5xl">{card.character}</div>
                      <div className="text-3xl">{card.emoji}</div>
                      <div>
                        <div className="font-bold text-lg text-purple-700">{card.pinyin}</div>
                        <div className="text-gray-600">{card.definition}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Added: {new Date(card.dateAdded).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => speakText(card.character)}
                        className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                      >
                        <Volume2 size={20} />
                      </button>
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredCards().length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-gray-600 text-lg">
                  {filter === 'today' 
                    ? "No cards added today yet!"
                    : filter === 'week'
                    ? "No cards added this week!"
                    : "Add some Chinese characters to start learning!"
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {currentView === 'study' && flashcards.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-600">Practice Time!</h2>
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium">
                  {currentFlashcard + 1} / {flashcards.length}
                </span>
              </div>

              <div className="text-center space-y-6">
                <div className="text-9xl font-light mb-4">{flashcards[currentFlashcard].character}</div>
                
                {!showAnswer && (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    Show Answer 👀
                  </button>
                )}

                {showAnswer && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="text-6xl">{flashcards[currentFlashcard].emoji}</div>
                    <div className="bg-purple-50 p-6 rounded-2xl">
                      <p className="text-3xl font-bold text-purple-700 mb-2">
                        {flashcards[currentFlashcard].pinyin}
                      </p>
                      <p className="text-xl text-gray-700">
                        {flashcards[currentFlashcard].definition}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => speakText(flashcards[currentFlashcard].character)}
                      className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors mx-auto"
                    >
                      <Volume2 size={28} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => {
                    setCurrentFlashcard(Math.max(0, currentFlashcard - 1));
                    setShowAnswer(false);
                  }}
                  disabled={currentFlashcard === 0}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium disabled:opacity-50 hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
                
                {currentFlashcard === flashcards.length - 1 ? (
                  <button
                    onClick={() => setCurrentView('home')}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                  >
                    Finish! 🎉
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentFlashcard(currentFlashcard + 1);
                      setShowAnswer(false);
                    }}
                    className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Achievement Gallery */}
      {currentView === 'home' && (
        <div className="max-w-4xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Trophy className="text-yellow-500 mr-2" />
              Achievement Gallery
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {achievements.map(achievement => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`text-center p-4 rounded-xl transition-all ${
                      isUnlocked 
                        ? 'bg-yellow-100 border-2 border-yellow-400' 
                        : 'bg-gray-100 border-2 border-gray-300 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{isUnlocked ? achievement.icon : '🔒'}</div>
                    <p className="text-xs font-medium">{achievement.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HanziBuddyApp;
