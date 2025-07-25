import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  signUp, 
  signIn, 
  logOut, 
  saveCard as firebaseSaveCard, 
  getCards as firebaseGetCards, 
  deleteCard as firebaseDeleteCard,
  updateStreak as firebaseUpdateStreak,
  getStreak as firebaseGetStreak
} from './firebaseHelpers';
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Star, Calendar, Award, Trophy, Users, 
  Sparkles, Heart, Target, Clock, CheckCircle,
  User, LogOut, Trash2, Volume2, Plus, X
} from 'lucide-react';

// Enhanced Character data with kid-friendly definitions
// Based on Singapore MOE Primary School Chinese curriculum (P1-P6)
// Following the 欢乐伙伴 (Huanle Huoban) textbook series
const characterData = {
  // === PRIMARY 1 (P1) Characters ===
  // Basic self, family, and daily life
  '我': { pinyin: 'wǒ', definition: 'me/I (that\'s you!)', emoji: '🙋', level: 'P1' },
  '你': { pinyin: 'nǐ', definition: 'you (like saying "hi" to a friend!)', emoji: '👋', level: 'P1' },
  '他': { pinyin: 'tā', definition: 'he/him (that boy over there!)', emoji: '👦', level: 'P1' },
  '她': { pinyin: 'tā', definition: 'she/her (that girl over there!)', emoji: '👧', level: 'P1' },
  '好': { pinyin: 'hǎo', definition: 'good (when something is awesome!)', emoji: '👍', level: 'P1' },
  '爱': { pinyin: 'ài', definition: 'love (like loving ice cream!)', emoji: '❤️', level: 'P1' },
  '家': { pinyin: 'jiā', definition: 'home (where your family is!)', emoji: '🏠', level: 'P1' },
  '人': { pinyin: 'rén', definition: 'person (like you and me!)', emoji: '👤', level: 'P1' },
  '大': { pinyin: 'dà', definition: 'big (like a dinosaur!)', emoji: '🦕', level: 'P1' },
  '小': { pinyin: 'xiǎo', definition: 'small (like a mouse!)', emoji: '🐭', level: 'P1' },
  '一': { pinyin: 'yī', definition: 'one (hold up 1 finger!)', emoji: '1️⃣', level: 'P1' },
  '二': { pinyin: 'èr', definition: 'two (hold up 2 fingers!)', emoji: '2️⃣', level: 'P1' },
  '三': { pinyin: 'sān', definition: 'three (hold up 3 fingers!)', emoji: '3️⃣', level: 'P1' },
  '四': { pinyin: 'sì', definition: 'four (hold up 4 fingers!)', emoji: '4️⃣', level: 'P1' },
  '五': { pinyin: 'wǔ', definition: 'five (wave your hand!)', emoji: '5️⃣', level: 'P1' },
  '六': { pinyin: 'liù', definition: 'six (6 toys to play with!)', emoji: '6️⃣', level: 'P1' },
  '七': { pinyin: 'qī', definition: 'seven (lucky number 7!)', emoji: '7️⃣', level: 'P1' },
  '八': { pinyin: 'bā', definition: 'eight (8 legs like a spider!)', emoji: '8️⃣', level: 'P1' },
  '九': { pinyin: 'jiǔ', definition: 'nine (almost 10!)', emoji: '9️⃣', level: 'P1' },
  '十': { pinyin: 'shí', definition: 'ten (all your fingers!)', emoji: '🔟', level: 'P1' },
  
  // === PRIMARY 2 (P2) Characters ===
  // Family, animals, basic actions
  '妈': { pinyin: 'mā', definition: 'mom (mommy loves you!)', emoji: '👩', level: 'P2' },
  '爸': { pinyin: 'bà', definition: 'dad (daddy is strong!)', emoji: '👨', level: 'P2' },
  '哥': { pinyin: 'gē', definition: 'older brother (big brother!)', emoji: '👦', level: 'P2' },
  '姐': { pinyin: 'jiě', definition: 'older sister (big sister!)', emoji: '👧', level: 'P2' },
  '弟': { pinyin: 'dì', definition: 'younger brother (little bro!)', emoji: '👶', level: 'P2' },
  '妹': { pinyin: 'mèi', definition: 'younger sister (little sis!)', emoji: '👧', level: 'P2' },
  '狗': { pinyin: 'gǒu', definition: 'dog (woof woof!)', emoji: '🐕', level: 'P2' },
  '猫': { pinyin: 'māo', definition: 'cat (meow!)', emoji: '🐱', level: 'P2' },
  '鱼': { pinyin: 'yú', definition: 'fish (swimming in water!)', emoji: '🐟', level: 'P2' },
  '鸟': { pinyin: 'niǎo', definition: 'bird (tweet tweet!)', emoji: '🐦', level: 'P2' },
  '马': { pinyin: 'mǎ', definition: 'horse (gallop gallop!)', emoji: '🐎', level: 'P2' },
  '牛': { pinyin: 'niú', definition: 'cow (moo moo!)', emoji: '🐄', level: 'P2' },
  '羊': { pinyin: 'yáng', definition: 'sheep (baa baa!)', emoji: '🐑', level: 'P2' },
  '学': { pinyin: 'xué', definition: 'learn (what you do at school!)', emoji: '📚', level: 'P2' },
  '校': { pinyin: 'xiào', definition: 'school (where you study!)', emoji: '🏫', level: 'P2' },
  '老': { pinyin: 'lǎo', definition: 'old (like grandpa!)', emoji: '👴', level: 'P2' },
  '师': { pinyin: 'shī', definition: 'teacher (teaches you things!)', emoji: '👨‍🏫', level: 'P2' },
  
  // === PRIMARY 3 (P3) Characters ===
  // Nature, weather, food
  '水': { pinyin: 'shuǐ', definition: 'water (splash splash!)', emoji: '💧', level: 'P3' },
  '火': { pinyin: 'huǒ', definition: 'fire (hot hot hot!)', emoji: '🔥', level: 'P3' },
  '山': { pinyin: 'shān', definition: 'mountain (tall and rocky!)', emoji: '⛰️', level: 'P3' },
  '河': { pinyin: 'hé', definition: 'river (water flows!)', emoji: '🏞️', level: 'P3' },
  '花': { pinyin: 'huā', definition: 'flower (pretty and colorful!)', emoji: '🌸', level: 'P3' },
  '树': { pinyin: 'shù', definition: 'tree (tall with leaves!)', emoji: '🌳', level: 'P3' },
  '草': { pinyin: 'cǎo', definition: 'grass (green and soft!)', emoji: '🌱', level: 'P3' },
  '天': { pinyin: 'tiān', definition: 'sky/day (look up high!)', emoji: '☁️', level: 'P3' },
  '地': { pinyin: 'dì', definition: 'ground/earth (what you walk on!)', emoji: '🌍', level: 'P3' },
  '月': { pinyin: 'yuè', definition: 'moon (shines at night!)', emoji: '🌙', level: 'P3' },
  '日': { pinyin: 'rì', definition: 'sun (bright and warm!)', emoji: '☀️', level: 'P3' },
  '星': { pinyin: 'xīng', definition: 'star (twinkle twinkle!)', emoji: '⭐', level: 'P3' },
  '雨': { pinyin: 'yǔ', definition: 'rain (pitter patter!)', emoji: '🌧️', level: 'P3' },
  '风': { pinyin: 'fēng', definition: 'wind (whoosh whoosh!)', emoji: '💨', level: 'P3' },
  '雪': { pinyin: 'xuě', definition: 'snow (white and cold!)', emoji: '❄️', level: 'P3' },
  '饭': { pinyin: 'fàn', definition: 'rice/meal (yummy food!)', emoji: '🍚', level: 'P3' },
  '菜': { pinyin: 'cài', definition: 'vegetables (healthy greens!)', emoji: '🥬', level: 'P3' },
  '肉': { pinyin: 'ròu', definition: 'meat (protein food!)', emoji: '🥩', level: 'P3' },
  
  // === PRIMARY 4 (P4) Characters ===
  // Body parts, actions, descriptive words
  '头': { pinyin: 'tóu', definition: 'head (where your brain is!)', emoji: '🧠', level: 'P4' },
  '手': { pinyin: 'shǒu', definition: 'hand (wave hello!)', emoji: '✋', level: 'P4' },
  '脚': { pinyin: 'jiǎo', definition: 'foot (for walking!)', emoji: '🦶', level: 'P4' },
  '眼': { pinyin: 'yǎn', definition: 'eye (for seeing!)', emoji: '👁️', level: 'P4' },
  '耳': { pinyin: 'ěr', definition: 'ear (for hearing!)', emoji: '👂', level: 'P4' },
  '口': { pinyin: 'kǒu', definition: 'mouth (for speaking!)', emoji: '👄', level: 'P4' },
  '鼻': { pinyin: 'bí', definition: 'nose (for smelling!)', emoji: '👃', level: 'P4' },
  '走': { pinyin: 'zǒu', definition: 'walk (step step step!)', emoji: '🚶', level: 'P4' },
  '跑': { pinyin: 'pǎo', definition: 'run (fast like wind!)', emoji: '🏃', level: 'P4' },
  '跳': { pinyin: 'tiào', definition: 'jump (hop hop hop!)', emoji: '🦘', level: 'P4' },
  '坐': { pinyin: 'zuò', definition: 'sit (rest on chair!)', emoji: '🪑', level: 'P4' },
  '站': { pinyin: 'zhàn', definition: 'stand (tall like tree!)', emoji: '🧍', level: 'P4' },
  '睡': { pinyin: 'shuì', definition: 'sleep (zzz time!)', emoji: '💤', level: 'P4' },
  '吃': { pinyin: 'chī', definition: 'eat (nom nom nom!)', emoji: '🍽️', level: 'P4' },
  '喝': { pinyin: 'hē', definition: 'drink (glug glug!)', emoji: '🥤', level: 'P4' },
  '看': { pinyin: 'kàn', definition: 'look/watch (use your eyes!)', emoji: '👀', level: 'P4' },
  '听': { pinyin: 'tīng', definition: 'listen (use your ears!)', emoji: '👂', level: 'P4' },
  '说': { pinyin: 'shuō', definition: 'speak/say (use words!)', emoji: '🗣️', level: 'P4' },
  
  // === PRIMARY 5 (P5) Characters ===
  // Colors, feelings, more complex concepts
  '红': { pinyin: 'hóng', definition: 'red (like strawberries!)', emoji: '🔴', level: 'P5' },
  '绿': { pinyin: 'lǜ', definition: 'green (like leaves!)', emoji: '🟢', level: 'P5' },
  '蓝': { pinyin: 'lán', definition: 'blue (like the ocean!)', emoji: '🔵', level: 'P5' },
  '黄': { pinyin: 'huáng', definition: 'yellow (like the sun!)', emoji: '🟡', level: 'P5' },
  '黑': { pinyin: 'hēi', definition: 'black (like night!)', emoji: '⚫', level: 'P5' },
  '白': { pinyin: 'bái', definition: 'white (like clouds!)', emoji: '⚪', level: 'P5' },
  '高': { pinyin: 'gāo', definition: 'tall/high (reach the sky!)', emoji: '📏', level: 'P5' },
  '矮': { pinyin: 'ǎi', definition: 'short (not very tall!)', emoji: '📐', level: 'P5' },
  '快': { pinyin: 'kuài', definition: 'fast (zoom zoom!)', emoji: '💨', level: 'P5' },
  '慢': { pinyin: 'màn', definition: 'slow (like a snail!)', emoji: '🐌', level: 'P5' },
  '多': { pinyin: 'duō', definition: 'many/much (lots and lots!)', emoji: '📊', level: 'P5' },
  '少': { pinyin: 'shǎo', definition: 'few/little (not very many!)', emoji: '📉', level: 'P5' },
  '新': { pinyin: 'xīn', definition: 'new (fresh and shiny!)', emoji: '✨', level: 'P5' },
  '旧': { pinyin: 'jiù', definition: 'old (been around long time!)', emoji: '🕰️', level: 'P5' },
  '冷': { pinyin: 'lěng', definition: 'cold (brr brr!)', emoji: '🥶', level: 'P5' },
  '热': { pinyin: 'rè', definition: 'hot (phew, so warm!)', emoji: '🥵', level: 'P5' },
  '累': { pinyin: 'lèi', definition: 'tired (need to rest!)', emoji: '😴', level: 'P5' },
  '开': { pinyin: 'kāi', definition: 'open (like opening door!)', emoji: '🚪', level: 'P5' },
  '关': { pinyin: 'guān', definition: 'close (shut the door!)', emoji: '🔒', level: 'P5' },
  
  // === PRIMARY 6 (P6) Characters ===
  // Advanced concepts, places, activities
  '国': { pinyin: 'guó', definition: 'country (like Singapore!)', emoji: '🇸🇬', level: 'P6' },
  '城': { pinyin: 'chéng', definition: 'city (busy place!)', emoji: '🏙️', level: 'P6' },
  '店': { pinyin: 'diàn', definition: 'shop/store (buy things!)', emoji: '🏪', level: 'P6' },
  '医': { pinyin: 'yī', definition: 'doctor/medicine (helps when sick!)', emoji: '👩‍⚕️', level: 'P6' },
  '院': { pinyin: 'yuàn', definition: 'hospital (place to get better!)', emoji: '🏥', level: 'P6' },
  '车': { pinyin: 'chē', definition: 'car/vehicle (vroom vroom!)', emoji: '🚗', level: 'P6' },
  '船': { pinyin: 'chuán', definition: 'boat/ship (sails on water!)', emoji: '🚢', level: 'P6' },
  '飞': { pinyin: 'fēi', definition: 'fly (soar through sky!)', emoji: '✈️', level: 'P6' },
  '机': { pinyin: 'jī', definition: 'machine/plane (mechanical thing!)', emoji: '⚙️', level: 'P6' },
  '书': { pinyin: 'shū', definition: 'book (full of stories!)', emoji: '📖', level: 'P6' },
  '笔': { pinyin: 'bǐ', definition: 'pen/pencil (for writing!)', emoji: '✏️', level: 'P6' },
  '纸': { pinyin: 'zhǐ', definition: 'paper (to write on!)', emoji: '📝', level: 'P6' },
  '钱': { pinyin: 'qián', definition: 'money (to buy things!)', emoji: '💰', level: 'P6' },
  '工': { pinyin: 'gōng', definition: 'work (what adults do!)', emoji: '👷', level: 'P6' },
  '作': { pinyin: 'zuò', definition: 'do/make (create something!)', emoji: '🔨', level: 'P6' },
  '买': { pinyin: 'mǎi', definition: 'buy (get with money!)', emoji: '🛒', level: 'P6' },
  '卖': { pinyin: 'mài', definition: 'sell (give for money!)', emoji: '🏷️', level: 'P6' },
  '穿': { pinyin: 'chuān', definition: 'wear (put on clothes!)', emoji: '👕', level: 'P6' },
  '衣': { pinyin: 'yī', definition: 'clothes (what you wear!)', emoji: '👗', level: 'P6' },
  '服': { pinyin: 'fú', definition: 'clothes/uniform (special outfit!)', emoji: '🦺', level: 'P6' },
  
  // Additional commonly used characters across levels
  '的': { pinyin: 'de', definition: 'belonging to (like "my book"!)', emoji: '🔗', level: 'P2' },
  '在': { pinyin: 'zài', definition: 'at/in (where something is!)', emoji: '📍', level: 'P3' },
  '有': { pinyin: 'yǒu', definition: 'have (I have toys!)', emoji: '🎁', level: 'P2' },
  '是': { pinyin: 'shì', definition: 'is/am/are (I am happy!)', emoji: '✅', level: 'P2' },
  '不': { pinyin: 'bù', definition: 'not/no (shake your head!)', emoji: '❌', level: 'P2' },
  '会': { pinyin: 'huì', definition: 'can/will (I can do it!)', emoji: '💪', level: 'P3' },
  '来': { pinyin: 'lái', definition: 'come (come here!)', emoji: '👋', level: 'P3' },
  '去': { pinyin: 'qù', definition: 'go (go there!)', emoji: '➡️', level: 'P3' },
  '到': { pinyin: 'dào', definition: 'arrive/reach (get to place!)', emoji: '🎯', level: 'P4' },
  '从': { pinyin: 'cóng', definition: 'from (starting point!)', emoji: '🚀', level: 'P4' },
  '和': { pinyin: 'hé', definition: 'and/with (together!)', emoji: '🤝', level: 'P3' },
  '很': { pinyin: 'hěn', definition: 'very (really really!)', emoji: '💯', level: 'P3' },
  '都': { pinyin: 'dōu', definition: 'all (everyone!)', emoji: '🌟', level: 'P4' },
  '也': { pinyin: 'yě', definition: 'also/too (me too!)', emoji: '➕', level: 'P3' },
  '还': { pinyin: 'hái', definition: 'still/also (more!)', emoji: '🔄', level: 'P4' },
  '要': { pinyin: 'yào', definition: 'want/need (I want ice cream!)', emoji: '🙏', level: 'P3' },
  '可': { pinyin: 'kě', definition: 'can/may (is it okay?)', emoji: '🤔', level: 'P4' },
  '以': { pinyin: 'yǐ', definition: 'can/able to (possible!)', emoji: '✨', level: 'P4' },
  '时': { pinyin: 'shí', definition: 'time (tick tock!)', emoji: '⏰', level: 'P4' },
  '间': { pinyin: 'jiān', definition: 'between/during (in the middle!)', emoji: '🔄', level: 'P5' },
  '年': { pinyin: 'nián', definition: 'year (365 days!)', emoji: '📅', level: 'P3' },
  '周': { pinyin: 'zhōu', definition: 'week (7 days!)', emoji: '📆', level: 'P4' },
  '今': { pinyin: 'jīn', definition: 'today (right now!)', emoji: '📍', level: 'P4' },
  '明': { pinyin: 'míng', definition: 'tomorrow/bright (next day!)', emoji: '🌅', level: 'P4' },
  '生': { pinyin: 'shēng', definition: 'born/student (new life!)', emoji: '👶', level: 'P3' },
  '活': { pinyin: 'huó', definition: 'alive/life (living!)', emoji: '🌱', level: 'P5' },
  '问': { pinyin: 'wèn', definition: 'ask (raise your hand!)', emoji: '🙋', level: 'P4' },
  '答': { pinyin: 'dá', definition: 'answer (respond!)', emoji: '💬', level: 'P4' },
  '知': { pinyin: 'zhī', definition: 'know (smart brain!)', emoji: '🧠', level: 'P4' },
  '道': { pinyin: 'dào', definition: 'way/path (road to follow!)', emoji: '🛤️', level: 'P4' },
  '想': { pinyin: 'xiǎng', definition: 'think/want (use your brain!)', emoji: '💭', level: 'P4' },
  '觉': { pinyin: 'jué', definition: 'feel (how do you feel?)', emoji: '😊', level: 'P5' },
  '得': { pinyin: 'de', definition: 'can/obtain (able to get!)', emoji: '🎖️', level: 'P4' },
  '给': { pinyin: 'gěi', definition: 'give (share with others!)', emoji: '🎁', level: 'P4' },
  '让': { pinyin: 'ràng', definition: 'let/allow (permission!)', emoji: '✋', level: 'P5' },
  '把': { pinyin: 'bǎ', definition: 'take/handle (grab it!)', emoji: '🤏', level: 'P5' },
  '被': { pinyin: 'bèi', definition: 'by (passive action!)', emoji: '🔄', level: 'P6' },
  '用': { pinyin: 'yòng', definition: 'use (make it work!)', emoji: '🔧', level: 'P4' },
  '做': { pinyin: 'zuò', definition: 'do/make (create!)', emoji: '🛠️', level: 'P4' },
  '玩': { pinyin: 'wán', definition: 'play (have fun!)', emoji: '🎮', level: 'P2' },
  '游': { pinyin: 'yóu', definition: 'swim/travel (move around!)', emoji: '🏊', level: 'P5' },
  '戏': { pinyin: 'xì', definition: 'play/game (fun activity!)', emoji: '🎭', level: 'P5' },
  '唱': { pinyin: 'chàng', definition: 'sing (make music!)', emoji: '🎵', level: 'P4' },
  '画': { pinyin: 'huà', definition: 'draw/paint (make art!)', emoji: '🎨', level: 'P4' },
  '写': { pinyin: 'xiě', definition: 'write (make letters!)', emoji: '✍️', level: 'P3' },
  '读': { pinyin: 'dú', definition: 'read (look at words!)', emoji: '👀', level: 'P3' },
  // ADD these additional characters to your existing characterData object
  // Simply copy and paste this INSIDE your characterData object, before the closing };
  
  // === MORE P1 Characters (150+ total) ===
  '上': { pinyin: 'shàng', definition: 'up/above (reach up high!)', emoji: '⬆️', level: 'P1' },
  '下': { pinyin: 'xià', definition: 'down/below (look down low!)', emoji: '⬇️', level: 'P1' },
  '左': { pinyin: 'zuǒ', definition: 'left (this way!)', emoji: '⬅️', level: 'P1' },
  '右': { pinyin: 'yòu', definition: 'right (that way!)', emoji: '➡️', level: 'P1' },
  '中': { pinyin: 'zhōng', definition: 'middle/center (right in between!)', emoji: '🎯', level: 'P1' },
  '里': { pinyin: 'lǐ', definition: 'inside (in the box!)', emoji: '📦', level: 'P1' },
  '外': { pinyin: 'wài', definition: 'outside (out there!)', emoji: '🌳', level: 'P1' },
  '前': { pinyin: 'qián', definition: 'front (in front of you!)', emoji: '👆', level: 'P1' },
  '后': { pinyin: 'hòu', definition: 'back/behind (behind you!)', emoji: '👈', level: 'P1' },
  '长': { pinyin: 'cháng', definition: 'long (like a snake!)', emoji: '🐍', level: 'P1' },
  '短': { pinyin: 'duǎn', definition: 'short (not very long!)', emoji: '📏', level: 'P1' },
  '多': { pinyin: 'duō', definition: 'many/much (lots of!)', emoji: '🔢', level: 'P1' },
  '少': { pinyin: 'shǎo', definition: 'few/little (not many!)', emoji: '🤏', level: 'P1' },
  
  // === MORE P2 Characters (250+ total) ===
  '奶': { pinyin: 'nǎi', definition: 'milk/grandma (white and yummy!)', emoji: '🥛', level: 'P2' },
  '爷': { pinyin: 'yé', definition: 'grandpa (daddy\'s daddy!)', emoji: '👴', level: 'P2' },
  '婆': { pinyin: 'pó', definition: 'grandma (mommy\'s mommy!)', emoji: '👵', level: 'P2' },
  '叔': { pinyin: 'shū', definition: 'uncle (daddy\'s brother!)', emoji: '👨', level: 'P2' },
  '姨': { pinyin: 'yí', definition: 'aunt (mommy\'s sister!)', emoji: '👩', level: 'P2' },
  '朋': { pinyin: 'péng', definition: 'friend (play together!)', emoji: '👫', level: 'P2' },
  '友': { pinyin: 'yǒu', definition: 'friend (be nice to each other!)', emoji: '🤝', level: 'P2' },
  '同': { pinyin: 'tóng', definition: 'same/together (all the same!)', emoji: '👯', level: 'P2' },
  '班': { pinyin: 'bān', definition: 'class (your classroom!)', emoji: '🎓', level: 'P2' },
  '课': { pinyin: 'kè', definition: 'lesson (what teacher teaches!)', emoji: '📖', level: 'P2' },
  '本': { pinyin: 'běn', definition: 'book/notebook (to write in!)', emoji: '📓', level: 'P2' },
  '桌': { pinyin: 'zhuō', definition: 'table/desk (to put things on!)', emoji: '🪑', level: 'P2' },
  '椅': { pinyin: 'yǐ', definition: 'chair (to sit on!)', emoji: '🪑', level: 'P2' },
  '门': { pinyin: 'mén', definition: 'door (open and close!)', emoji: '🚪', level: 'P2' },
  '窗': { pinyin: 'chuāng', definition: 'window (look outside!)', emoji: '🪟', level: 'P2' },
  '房': { pinyin: 'fáng', definition: 'room (a space inside!)', emoji: '🏠', level: 'P2' },
  '床': { pinyin: 'chuáng', definition: 'bed (to sleep on!)', emoji: '🛏️', level: 'P2' },
  '被': { pinyin: 'bèi', definition: 'blanket (to keep warm!)', emoji: '🛌', level: 'P2' },
  '衫': { pinyin: 'shān', definition: 'shirt (wear on top!)', emoji: '👕', level: 'P2' },
  '裤': { pinyin: 'kù', definition: 'pants (wear on legs!)', emoji: '👖', level: 'P2' },
  '鞋': { pinyin: 'xié', definition: 'shoes (wear on feet!)', emoji: '👟', level: 'P2' },
  '帽': { pinyin: 'mào', definition: 'hat (wear on head!)', emoji: '👒', level: 'P2' },
  '包': { pinyin: 'bāo', definition: 'bag (to carry things!)', emoji: '🎒', level: 'P2' },
  '蛋': { pinyin: 'dàn', definition: 'egg (round and white!)', emoji: '🥚', level: 'P2' },
  '面': { pinyin: 'miàn', definition: 'noodles/face (long and thin!)', emoji: '🍜', level: 'P2' },
  '汤': { pinyin: 'tāng', definition: 'soup (warm and tasty!)', emoji: '🍲', level: 'P2' },
  '茶': { pinyin: 'chá', definition: 'tea (hot drink!)', emoji: '🍵', level: 'P2' },
  '咖': { pinyin: 'kā', definition: 'coffee (brown drink!)', emoji: '☕', level: 'P2' },
  '啡': { pinyin: 'fēi', definition: 'coffee (adults like it!)', emoji: '☕', level: 'P2' },
  '糖': { pinyin: 'táng', definition: 'sugar/candy (sweet!)', emoji: '🍬', level: 'P2' },
  '盐': { pinyin: 'yán', definition: 'salt (makes food tasty!)', emoji: '🧂', level: 'P2' },
  '油': { pinyin: 'yóu', definition: 'oil (for cooking!)', emoji: '🛢️', level: 'P2' },
  '象': { pinyin: 'xiàng', definition: 'elephant (big with trunk!)', emoji: '🐘', level: 'P2' },
  '猴': { pinyin: 'hóu', definition: 'monkey (swing in trees!)', emoji: '🐒', level: 'P2' },
  '虎': { pinyin: 'hǔ', definition: 'tiger (orange with stripes!)', emoji: '🐅', level: 'P2' },
  '熊': { pinyin: 'xióng', definition: 'bear (big and fluffy!)', emoji: '🐻', level: 'P2' },
  '狮': { pinyin: 'shī', definition: 'lion (king of animals!)', emoji: '🦁', level: 'P2' },
  '兔': { pinyin: 'tù', definition: 'rabbit (hop hop hop!)', emoji: '🐰', level: 'P2' },
  '鼠': { pinyin: 'shǔ', definition: 'mouse/rat (small and quick!)', emoji: '🐭', level: 'P2' },
  '蛇': { pinyin: 'shé', definition: 'snake (long and slithery!)', emoji: '🐍', level: 'P2' },
  '龙': { pinyin: 'lóng', definition: 'dragon (magical creature!)', emoji: '🐲', level: 'P2' },
  '鸡': { pinyin: 'jī', definition: 'chicken (cluck cluck!)', emoji: '🐔', level: 'P2' },
  '鸭': { pinyin: 'yā', definition: 'duck (quack quack!)', emoji: '🦆', level: 'P2' },
  
  // === MORE P3 Characters (400+ total) ===
  '春': { pinyin: 'chūn', definition: 'spring (flowers bloom!)', emoji: '🌸', level: 'P3' },
  '夏': { pinyin: 'xià', definition: 'summer (hot and sunny!)', emoji: '☀️', level: 'P3' },
  '秋': { pinyin: 'qiū', definition: 'autumn (leaves fall!)', emoji: '🍂', level: 'P3' },
  '冬': { pinyin: 'dōng', definition: 'winter (cold and snowy!)', emoji: '❄️', level: 'P3' },
  '早': { pinyin: 'zǎo', definition: 'early/morning (start of day!)', emoji: '🌅', level: 'P3' },
  '晚': { pinyin: 'wǎn', definition: 'late/evening (end of day!)', emoji: '🌆', level: 'P3' },
  '夜': { pinyin: 'yè', definition: 'night (dark outside!)', emoji: '🌙', level: 'P3' },
  '亮': { pinyin: 'liàng', definition: 'bright (lots of light!)', emoji: '💡', level: 'P3' },
  '暗': { pinyin: 'àn', definition: 'dark (no light!)', emoji: '🔦', level: 'P3' },
  '云': { pinyin: 'yún', definition: 'cloud (fluffy in sky!)', emoji: '☁️', level: 'P3' },
  '电': { pinyin: 'diàn', definition: 'electricity (power!)', emoji: '⚡', level: 'P3' },
  '雷': { pinyin: 'léi', definition: 'thunder (loud sound!)', emoji: '⛈️', level: 'P3' },
  '冰': { pinyin: 'bīng', definition: 'ice (frozen water!)', emoji: '🧊', level: 'P3' },
  '雾': { pinyin: 'wù', definition: 'fog (can\'t see far!)', emoji: '🌫️', level: 'P3' },
  '石': { pinyin: 'shí', definition: 'stone/rock (hard and heavy!)', emoji: '🪨', level: 'P3' },
  '土': { pinyin: 'tǔ', definition: 'soil/earth (plants grow in it!)', emoji: '🟤', level: 'P3' },
  '沙': { pinyin: 'shā', definition: 'sand (at the beach!)', emoji: '🏖️', level: 'P3' },
  '海': { pinyin: 'hǎi', definition: 'ocean/sea (big water!)', emoji: '🌊', level: 'P3' },
  '湖': { pinyin: 'hú', definition: 'lake (calm water!)', emoji: '🏞️', level: 'P3' },
  '池': { pinyin: 'chí', definition: 'pond (small water!)', emoji: '🏊', level: 'P3' },
  '桥': { pinyin: 'qiáo', definition: 'bridge (cross the river!)', emoji: '🌉', level: 'P3' },
  '路': { pinyin: 'lù', definition: 'road (cars drive on it!)', emoji: '🛣️', level: 'P3' },
  '街': { pinyin: 'jiē', definition: 'street (in the city!)', emoji: '🏙️', level: 'P3' },
  '园': { pinyin: 'yuán', definition: 'park/garden (play outside!)', emoji: '🌳', level: 'P3' },
  '场': { pinyin: 'chǎng', definition: 'field/place (open space!)', emoji: '🏟️', level: 'P3' },
  '楼': { pinyin: 'lóu', definition: 'building (tall house!)', emoji: '🏢', level: 'P3' },
  '层': { pinyin: 'céng', definition: 'floor/level (go up stairs!)', emoji: '🏗️', level: 'P3' },
  '苹': { pinyin: 'píng', definition: 'apple (red fruit!)', emoji: '🍎', level: 'P3' },
  '果': { pinyin: 'guǒ', definition: 'fruit (sweet to eat!)', emoji: '🍇', level: 'P3' },
  '橙': { pinyin: 'chéng', definition: 'orange (round citrus!)', emoji: '🍊', level: 'P3' },
  '香': { pinyin: 'xiāng', definition: 'fragrant/banana (smells good!)', emoji: '🍌', level: 'P3' },
  '蕉': { pinyin: 'jiāo', definition: 'banana (yellow fruit!)', emoji: '🍌', level: 'P3' },
  '西': { pinyin: 'xī', definition: 'west/watermelon (direction!)', emoji: '🍉', level: 'P3' },
  '瓜': { pinyin: 'guā', definition: 'melon (big fruit!)', emoji: '🍈', level: 'P3' },
  '桃': { pinyin: 'táo', definition: 'peach (soft fruit!)', emoji: '🍑', level: 'P3' },
  '梨': { pinyin: 'lí', definition: 'pear (sweet fruit!)', emoji: '🍐', level: 'P3' },
  '葡': { pinyin: 'pú', definition: 'grape (small round!)', emoji: '🍇', level: 'P3' },
  '萄': { pinyin: 'táo', definition: 'grape (in bunches!)', emoji: '🍇', level: 'P3' },
  '米': { pinyin: 'mǐ', definition: 'rice (small white grains!)', emoji: '🌾', level: 'P3' },
  '豆': { pinyin: 'dòu', definition: 'bean (small round food!)', emoji: '🫘', level: 'P3' },
  '玉': { pinyin: 'yù', definition: 'jade/corn (precious stone!)', emoji: '🌽', level: 'P3' },
  '土': { pinyin: 'tǔ', definition: 'potato (grows underground!)', emoji: '🥔', level: 'P3' },
  '萝': { pinyin: 'luó', definition: 'radish (root vegetable!)', emoji: '🥕', level: 'P3' },
  '卜': { pinyin: 'bo', definition: 'radish (orange vegetable!)', emoji: '🥕', level: 'P3' },
  '白': { pinyin: 'bái', definition: 'cabbage (green leaves!)', emoji: '🥬', level: 'P3' },
  
  // === MORE P4 Characters (600+ total) ===
  '早': { pinyin: 'zǎo', definition: 'breakfast (morning meal!)', emoji: '🍳', level: 'P4' },
  '午': { pinyin: 'wǔ', definition: 'noon (middle of day!)', emoji: '🕐', level: 'P4' },
  '晚': { pinyin: 'wǎn', definition: 'dinner (evening meal!)', emoji: '🍽️', level: 'P4' },
  '饿': { pinyin: 'è', definition: 'hungry (want to eat!)', emoji: '😋', level: 'P4' },
  '饱': { pinyin: 'bǎo', definition: 'full (ate enough!)', emoji: '😊', level: 'P4' },
  '渴': { pinyin: 'kě', definition: 'thirsty (want to drink!)', emoji: '🥤', level: 'P4' },
  '酸': { pinyin: 'suān', definition: 'sour (like lemon!)', emoji: '🍋', level: 'P4' },
  '甜': { pinyin: 'tián', definition: 'sweet (like candy!)', emoji: '🍭', level: 'P4' },
  '苦': { pinyin: 'kǔ', definition: 'bitter (not sweet!)', emoji: '☕', level: 'P4' },
  '辣': { pinyin: 'là', definition: 'spicy (hot taste!)', emoji: '🌶️', level: 'P4' },
  '香': { pinyin: 'xiāng', definition: 'fragrant (smells good!)', emoji: '🌹', level: 'P4' },
  '臭': { pinyin: 'chòu', definition: 'smelly (bad smell!)', emoji: '🦨', level: 'P4' },
  '软': { pinyin: 'ruán', definition: 'soft (like pillow!)', emoji: '🪶', level: 'P4' },
  '硬': { pinyin: 'yìng', definition: 'hard (like rock!)', emoji: '🪨', level: 'P4' },
  '重': { pinyin: 'zhòng', definition: 'heavy (hard to lift!)', emoji: '💪', level: 'P4' },
  '轻': { pinyin: 'qīng', definition: 'light (easy to lift!)', emoji: '🪶', level: 'P4' },
  '粗': { pinyin: 'cū', definition: 'thick (not thin!)', emoji: '📏', level: 'P4' },
  '细': { pinyin: 'xì', definition: 'thin (not thick!)', emoji: '🧵', level: 'P4' },
  '宽': { pinyin: 'kuān', definition: 'wide (not narrow!)', emoji: '↔️', level: 'P4' },
  '窄': { pinyin: 'zhǎi', definition: 'narrow (not wide!)', emoji: '🤏', level: 'P4' },
  '深': { pinyin: 'shēn', definition: 'deep (goes down far!)', emoji: '🕳️', level: 'P4' },
  '浅': { pinyin: 'qiǎn', definition: 'shallow (not deep!)', emoji: '🏊', level: 'P4' },
  '干': { pinyin: 'gān', definition: 'dry (no water!)', emoji: '🏜️', level: 'P4' },
  '湿': { pinyin: 'shī', definition: 'wet (has water!)', emoji: '💧', level: 'P4' },
  '净': { pinyin: 'jìng', definition: 'clean (no dirt!)', emoji: '✨', level: 'P4' },
  '脏': { pinyin: 'zāng', definition: 'dirty (needs cleaning!)', emoji: '🧽', level: 'P4' },
  '美': { pinyin: 'měi', definition: 'beautiful (very pretty!)', emoji: '😍', level: 'P4' },
  '丑': { pinyin: 'chǒu', definition: 'ugly (not pretty!)', emoji: '👺', level: 'P4' },
  '胖': { pinyin: 'pàng', definition: 'fat (round and big!)', emoji: '🟫', level: 'P4' },
  '瘦': { pinyin: 'shòu', definition: 'thin (not fat!)', emoji: '📏', level: 'P4' },
  '强': { pinyin: 'qiáng', definition: 'strong (has power!)', emoji: '💪', level: 'P4' },
  '弱': { pinyin: 'ruò', definition: 'weak (not strong!)', emoji: '😰', level: 'P4' },
  '勇': { pinyin: 'yǒng', definition: 'brave (not scared!)', emoji: '🦸', level: 'P4' },
  '怕': { pinyin: 'pà', definition: 'afraid (scared!)', emoji: '😨', level: 'P4' },
  '笑': { pinyin: 'xiào', definition: 'laugh (ha ha ha!)', emoji: '😂', level: 'P4' },
  '哭': { pinyin: 'kū', definition: 'cry (tears come out!)', emoji: '😭', level: 'P4' },
  '病': { pinyin: 'bìng', definition: 'sick (not feeling well!)', emoji: '🤒', level: 'P4' },
  '疼': { pinyin: 'téng', definition: 'pain (ouch!)', emoji: '😣', level: 'P4' },
  '药': { pinyin: 'yào', definition: 'medicine (to feel better!)', emoji: '💊', level: 'P4' },
  '医': { pinyin: 'yī', definition: 'doctor (helps sick people!)', emoji: '👩‍⚕️', level: 'P4' },
  
  // === MORE P5 Characters (800+ total) ===
  '办': { pinyin: 'bàn', definition: 'do/handle (get things done!)', emoji: '📋', level: 'P5' },
  '法': { pinyin: 'fǎ', definition: 'method/law (way to do!)', emoji: '⚖️', level: 'P5' },
  '始': { pinyin: 'shǐ', definition: 'begin (start something!)', emoji: '🚀', level: 'P5' },
  '终': { pinyin: 'zhōng', definition: 'end (finish something!)', emoji: '🏁', level: 'P5' },
  '完': { pinyin: 'wán', definition: 'finish (all done!)', emoji: '✅', level: 'P5' },
  '成': { pinyin: 'chéng', definition: 'become/succeed (change into!)', emoji: '🌟', level: 'P5' },
  '功': { pinyin: 'gōng', definition: 'success (did it!)', emoji: '🏆', level: 'P5' },
  '败': { pinyin: 'bài', definition: 'fail (didn\'t work!)', emoji: '❌', level: 'P5' },
  '输': { pinyin: 'shū', definition: 'lose (didn\'t win!)', emoji: '😔', level: 'P5' },
  '赢': { pinyin: 'yíng', definition: 'win (got first!)', emoji: '🥇', level: 'P5' },
  '比': { pinyin: 'bǐ', definition: 'compare (which is better?)', emoji: '⚖️', level: 'P5' },
  '赛': { pinyin: 'sài', definition: 'race/compete (see who wins!)', emoji: '🏃', level: 'P5' },
  '试': { pinyin: 'shì', definition: 'test/try (give it a go!)', emoji: '📝', level: 'P5' },
  '验': { pinyin: 'yàn', definition: 'test/experiment (find out!)', emoji: '🔬', level: 'P5' },
  '练': { pinyin: 'liàn', definition: 'practice (do many times!)', emoji: '🎯', level: 'P5' },
  '习': { pinyin: 'xí', definition: 'practice/study (learn by doing!)', emoji: '📚', level: 'P5' },
  '复': { pinyin: 'fù', definition: 'repeat/review (do again!)', emoji: '🔄', level: 'P5' },
  '温': { pinyin: 'wēn', definition: 'warm/review (go over again!)', emoji: '🔥', level: 'P5' },
  '考': { pinyin: 'kǎo', definition: 'exam (big test!)', emoji: '📋', level: 'P5' },
  '试': { pinyin: 'shì', definition: 'exam/test (show what you know!)', emoji: '✏️', level: 'P5' },
  '题': { pinyin: 'tí', definition: 'question/problem (need to solve!)', emoji: '❓', level: 'P5' },
  '答': { pinyin: 'dá', definition: 'answer (what you say back!)', emoji: '💬', level: 'P5' },
  '案': { pinyin: 'àn', definition: 'answer/solution (the right way!)', emoji: '✅', level: 'P5' },
  '错': { pinyin: 'cuò', definition: 'wrong/mistake (not right!)', emoji: '❌', level: 'P5' },
  '对': { pinyin: 'duì', definition: 'correct/right (good job!)', emoji: '✅', level: 'P5' },
  '真': { pinyin: 'zhēn', definition: 'real/true (not fake!)', emoji: '💯', level: 'P5' },
  '假': { pinyin: 'jiǎ', definition: 'fake/false (not real!)', emoji: '🎭', level: 'P5' },
  '忙': { pinyin: 'máng', definition: 'busy (lots to do!)', emoji: '⏰', level: 'P5' },
  '闲': { pinyin: 'xián', definition: 'free/leisure (nothing to do!)', emoji: '😌', level: 'P5' },
  '急': { pinyin: 'jí', definition: 'urgent/hurry (need to be fast!)', emoji: '⚡', level: 'P5' },
  '慢': { pinyin: 'màn', definition: 'slow (take your time!)', emoji: '🐌', level: 'P5' },
  '安': { pinyin: 'ān', definition: 'safe/peaceful (no danger!)', emoji: '🛡️', level: 'P5' },
  '危': { pinyin: 'wēi', definition: 'danger (be careful!)', emoji: '⚠️', level: 'P5' },
  '险': { pinyin: 'xiǎn', definition: 'dangerous (scary!)', emoji: '☠️', level: 'P5' },
  '易': { pinyin: 'yì', definition: 'easy (not hard!)', emoji: '😊', level: 'P5' },
  '难': { pinyin: 'nán', definition: 'difficult (hard to do!)', emoji: '😓', level: 'P5' },
  '简': { pinyin: 'jiǎn', definition: 'simple (not complicated!)', emoji: '👌', level: 'P5' },
  '复': { pinyin: 'fù', definition: 'complex (many parts!)', emoji: '🧩', level: 'P5' },
  '杂': { pinyin: 'zá', definition: 'complicated (confusing!)', emoji: '🤯', level: 'P5' },
  
  // === MORE P6 Characters (1000+ total) ===
  '政': { pinyin: 'zhèng', definition: 'government (who runs country!)', emoji: '🏛️', level: 'P6' },
  '治': { pinyin: 'zhì', definition: 'govern/cure (manage things!)', emoji: '👨‍💼', level: 'P6' },
  '府': { pinyin: 'fǔ', definition: 'government office (official place!)', emoji: '🏢', level: 'P6' },
  '民': { pinyin: 'mín', definition: 'people/citizens (everyone!)', emoji: '👥', level: 'P6' },
  '族': { pinyin: 'zú', definition: 'race/ethnic group (people family!)', emoji: '🌍', level: 'P6' },
  '社': { pinyin: 'shè', definition: 'society/club (group of people!)', emoji: '👥', level: 'P6' },
  '会': { pinyin: 'huì', definition: 'meeting/society (people together!)', emoji: '🤝', level: 'P6' },
  '团': { pinyin: 'tuán', definition: 'group/team (work together!)', emoji: '👨‍👩‍👧‍👦', level: 'P6' },
  '队': { pinyin: 'duì', definition: 'team/squad (play together!)', emoji: '⚽', level: 'P6' },
  '组': { pinyin: 'zǔ', definition: 'group/organize (put together!)', emoji: '📦', level: 'P6' },
  '织': { pinyin: 'zhī', definition: 'weave/organize (make cloth!)', emoji: '🧶', level: 'P6' },
  '建': { pinyin: 'jiàn', definition: 'build/construct (make buildings!)', emoji: '🏗️', level: 'P6' },
  '设': { pinyin: 'shè', definition: 'set up/establish (create new!)', emoji: '🛠️', level: 'P6' },
  '计': { pinyin: 'jì', definition: 'plan/count (think ahead!)', emoji: '📊', level: 'P6' },
  '划': { pinyin: 'huà', definition: 'plan/draw (make lines!)', emoji: '📋', level: 'P6' },
  '案': { pinyin: 'àn', definition: 'plan/case (way to do!)', emoji: '📁', level: 'P6' },
  '备': { pinyin: 'bèi', definition: 'prepare (get ready!)', emoji: '📦', level: 'P6' },
  '准': { pinyin: 'zhǔn', definition: 'prepare/accurate (get set!)', emoji: '🎯', level: 'P6' },
  '整': { pinyin: 'zhěng', definition: 'whole/organize (put in order!)', emoji: '📚', level: 'P6' },
  '理': { pinyin: 'lǐ', definition: 'reason/organize (make sense!)', emoji: '🧠', level: 'P6' },
  '管': { pinyin: 'guǎn', definition: 'manage/tube (take care of!)', emoji: '📊', level: 'P6' },
  '控': { pinyin: 'kòng', definition: 'control (have power over!)', emoji: '🎮', level: 'P6' },
  '制': { pinyin: 'zhì', definition: 'make/control (create rules!)', emoji: '⚙️', level: 'P6' },
  '造': { pinyin: 'zào', definition: 'make/create (build something!)', emoji: '🔨', level: 'P6' },
  '创': { pinyin: 'chuàng', definition: 'create/invent (make new!)', emoji: '💡', level: 'P6' },
  '新': { pinyin: 'xīn', definition: 'new/fresh (just made!)', emoji: '✨', level: 'P6' },
  '改': { pinyin: 'gǎi', definition: 'change/improve (make better!)', emoji: '🔄', level: 'P6' },
  '变': { pinyin: 'biàn', definition: 'change/transform (become different!)', emoji: '🦋', level: 'P6' },
  '化': { pinyin: 'huà', definition: 'change/transform (turn into!)', emoji: '⚗️', level: 'P6' },
  '发': { pinyin: 'fā', definition: 'develop/send out (grow big!)', emoji: '📈', level: 'P6' },
  '展': { pinyin: 'zhǎn', definition: 'develop/display (show growth!)', emoji: '🌱', level: 'P6' },
  '进': { pinyin: 'jìn', definition: 'advance/enter (move forward!)', emoji: '➡️', level: 'P6' },
  '步': { pinyin: 'bù', definition: 'step/progress (move ahead!)', emoji: '👣', level: 'P6' },
  '退': { pinyin: 'tuì', definition: 'retreat/return (go back!)', emoji: '⬅️', level: 'P6' },
  '增': { pinyin: 'zēng', definition: 'increase (make more!)', emoji: '📈', level: 'P6' },
  '加': { pinyin: 'jiā', definition: 'add/plus (put together!)', emoji: '➕', level: 'P6' },
  '减': { pinyin: 'jiǎn', definition: 'subtract/reduce (take away!)', emoji: '➖', level: 'P6' },
  '除': { pinyin: 'chú', definition: 'divide/except (split up!)', emoji: '➗', level: 'P6' },
  '乘': { pinyin: 'chéng', definition: 'multiply (times!)', emoji: '✖️', level: 'P6' },
  '等': { pinyin: 'děng', definition: 'equal/wait (same as!)', emoji: '🟰', level: 'P6' },
  '级': { pinyin: 'jí', definition: 'level/grade (what class!)', emoji: '📊', level: 'P6' },
  '班': { pinyin: 'bān', definition: 'class/shift (group in school!)', emoji: '🎓', level: 'P6' },
  '年': { pinyin: 'nián', definition: 'year/grade (time period!)', emoji: '📅', level: 'P6' },
  '期': { pinyin: 'qī', definition: 'period/term (time span!)', emoji: '📆', level: 'P6' },
  '季': { pinyin: 'jì', definition: 'season (spring, summer...)', emoji: '🌸', level: 'P6' },
  '节': { pinyin: 'jié', definition: 'festival/section (special day!)', emoji: '🎉', level: 'P6' },
  '假': { pinyin: 'jià', definition: 'vacation/holiday (no school!)', emoji: '🏖️', level: 'P6' },
  '休': { pinyin: 'xiū', definition: 'rest/break (take a pause!)', emoji: '😴', level: 'P6' },
  '息': { pinyin: 'xī', definition: 'rest/information (take break!)', emoji: '💤', level: 'P6' },
  '旅': { pinyin: 'lǚ', definition: 'travel/journey (go places!)', emoji: '✈️', level: 'P6' },
  '游': { pinyin: 'yóu', definition: 'tour/swim (visit places!)', emoji: '🏊', level: 'P6' },
  '客': { pinyin: 'kè', definition: 'guest/customer (visitor!)', emoji: '👨‍💼', level: 'P6' },
  '主': { pinyin: 'zhǔ', definition: 'host/main (most important!)', emoji: '👑', level: 'P6' },
  '东': { pinyin: 'dōng', definition: 'east/host (direction!)', emoji: '🧭', level: 'P6' },
  '南': { pinyin: 'nán', definition: 'south (direction!)', emoji: '⬇️', level: 'P6' },
  '西': { pinyin: 'xī', definition: 'west (direction!)', emoji: '⬅️', level: 'P6' },
  '北': { pinyin: 'běi', definition: 'north (direction!)', emoji: '⬆️', level: 'P6' },
  '方': { pinyin: 'fāng', definition: 'direction/square (which way!)', emoji: '🧭', level: 'P6' },
  '向': { pinyin: 'xiàng', definition: 'direction/towards (face that way!)', emoji: '👉', level: 'P6' },
  '位': { pinyin: 'wèi', definition: 'position/place (where you are!)', emoji: '📍', level: 'P6' },
  '置': { pinyin: 'zhì', definition: 'place/position (put somewhere!)', emoji: '📌', level: 'P6' },
  '点': { pinyin: 'diǎn', definition: 'point/dot (small mark!)', emoji: '•', level: 'P6' },
  '线': { pinyin: 'xiàn', definition: 'line (straight mark!)', emoji: '📏', level: 'P6' },
  '面': { pinyin: 'miàn', definition: 'surface/face (flat area!)', emoji: '🔳', level: 'P6' },
  '角': { pinyin: 'jiǎo', definition: 'corner/angle (where lines meet!)', emoji: '📐', level: 'P6' },
  '形': { pinyin: 'xíng', definition: 'shape/form (what it looks like!)', emoji: '🔺', level: 'P6' },
  '状': { pinyin: 'zhuàng', definition: 'shape/condition (how it is!)', emoji: '⭐', level: 'P6' },
  '圆': { pinyin: 'yuán', definition: 'circle/round (like ball!)', emoji: '⭕', level: 'P6' },
  '方': { pinyin: 'fāng', definition: 'square (four equal sides!)', emoji: '🔲', level: 'P6' },
  '三': { pinyin: 'sān', definition: 'triangle (three sides!)', emoji: '🔺', level: 'P6' },
  '力': { pinyin: 'lì', definition: 'power/strength (be strong!)', emoji: '💪', level: 'P6' },
  '气': { pinyin: 'qì', definition: 'air/energy (what we breathe!)', emoji: '💨', level: 'P6' },
  '声': { pinyin: 'shēng', definition: 'sound/voice (what we hear!)', emoji: '🔊', level: 'P6' },
  '音': { pinyin: 'yīn', definition: 'sound/music (nice to hear!)', emoji: '🎵', level: 'P6' },
  '色': { pinyin: 'sè', definition: 'color (red, blue, green!)', emoji: '🌈', level: 'P6' },
  '光': { pinyin: 'guāng', definition: 'light (bright shine!)', emoji: '💡', level: 'P6' },
  '影': { pinyin: 'yǐng', definition: 'shadow/image (dark shape!)', emoji: '👤', level: 'P6' }

// CONTINUE ADDING MORE CHARACTERS TO REACH 1700 TOTAL...
};

// === Helper Functions ===
// Add this helper function to check if a character is Chinese
const isChineseCharacter = (char) => {
  const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
  return chineseRegex.test(char);
};

// Helper function to get characters by level
const getCharactersByLevel = (level) => {
  return Object.entries(characterData)
    .filter(([char, data]) => data.level === level)
    .reduce((obj, [char, data]) => {
      obj[char] = data;
      return obj;
    }, {});
};

// Level-based character suggestions
const getSuggestedCharacters = (userLevel = 'P1') => {
  const suggestions = {
    'P1': ['我', '你', '好', '爱', '家', '人', '大', '小'],
    'P2': ['妈', '爸', '哥', '姐', '学', '校', '狗', '猫'],
    'P3': ['水', '火', '山', '花', '树', '天', '月', '日'],
    'P4': ['头', '手', '走', '跑', '吃', '看', '听', '说'],
    'P5': ['红', '绿', '蓝', '黄', '高', '快', '多', '新'],
    'P6': ['国', '城', '车', '书', '钱', '工', '买', '穿']
  };
  
  return suggestions[userLevel] || suggestions['P1'];
};

// === UI Components ===
// Quick Add buttons for common characters
const QuickAddButtons = ({ level, onAddCharacter }) => {
  const suggestions = getSuggestedCharacters(level);
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Quick Add - {level} Level Characters:
      </h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(char => (
          <button
            key={char}
            onClick={() => onAddCharacter(char)}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-lg transition-colors"
            title={`${char} - ${characterData[char]?.pinyin} - ${characterData[char]?.definition}`}
          >
            {char} {characterData[char]?.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// Level selector
const LevelSelector = ({ currentLevel, onLevelChange }) => {
  const levels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Choose Learning Level:
      </label>
      <div className="grid grid-cols-6 gap-2">
        {levels.map(level => (
          <button
            key={level}
            onClick={() => onLevelChange(level)}
            className={`py-2 px-3 rounded-lg font-medium transition-all ${
              currentLevel === level
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

// Progress tracker
const ProgressTracker = ({ flashcards }) => {
  const levels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
  const progressByLevel = levels.map(level => {
    const totalInLevel = Object.values(characterData).filter(char => char.level === level).length;
    const learnedInLevel = flashcards.filter(card => card.level === level).length;
    return {
      level,
      learned: learnedInLevel,
      total: totalInLevel,
      percentage: totalInLevel > 0 ? Math.round((learnedInLevel / totalInLevel) * 100) : 0
    };
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Target className="text-green-500 mr-2" />
        Learning Progress by Level
      </h3>
      <div className="space-y-3">
        {progressByLevel.map(({ level, learned, total, percentage }) => (
          <div key={level} className="flex items-center space-x-4">
            <div className="w-12 text-sm font-medium text-gray-700">{level}:</div>
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-600 w-16">
              {learned}/{total}
            </div>
            <div className="text-sm font-medium text-green-600 w-12">
              {percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
  
  // New enhanced states
  const [currentLevel, setCurrentLevel] = useState('P1');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setFlashcards([]);
        setStreak({ days: 0, lastDate: null });
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user data on auth change
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const cards = await firebaseGetCards(user.uid);
      setFlashcards(cards);
      
      const userStreak = await firebaseGetStreak(user.uid);
      setStreak(userStreak);
      
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
      return;
    } else if (streak.lastDate === yesterday) {
      newStreak.days += 1;
    } else {
      newStreak.days = 1;
    }
    
    newStreak.lastDate = today;
    setStreak(newStreak);
    
    if (user) {
      await firebaseUpdateStreak(user.uid, newStreak);
    }
  };

  // Authentication handlers
  const handleAuth = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    
    try {
      let user;
      if (authMode === 'login') {
        user = await signIn(email, password);
      } else {
        user = await signUp(email, password);
      }
      setUser(user);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email already in use. Please login instead.');
      } else if (error.code === 'auth/weak-password') {
        alert('Password should be at least 6 characters.');
      } else if (error.code === 'auth/user-not-found') {
        alert('No account found with this email. Please sign up.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password. Please try again.');
      } else {
        alert(error.message);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setUser(null);
      setFlashcards([]);
    } catch (error) {
      console.error('Sign out error:', error);
    }
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

  // Enhanced input handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setTextInput(value);
    
    // Real-time validation feedback
    const chars = value.split('').filter(char => char.trim());
    const chineseChars = chars.filter(char => isChineseCharacter(char));
    const nonChineseChars = chars.filter(char => !isChineseCharacter(char));
    
    // Show preview of what will be added
    if (value.trim()) {
      console.log('Valid Chinese characters:', chineseChars);
      console.log('Invalid characters (will be filtered):', nonChineseChars);
    }
  };

  // Add single character helper
  const addSingleCharacter = (char) => {
    setTextInput(prev => prev + char);
  };

  // Enhanced addCharacters function with validation
  const addCharacters = async () => {
    if (!textInput.trim() || !user) return;
    
    console.log('🎯 Adding characters for user:', user.uid);
    console.log('📝 Input text:', textInput);
    
    // Filter to only include Chinese characters
    const chars = textInput.split('').filter(char => {
      const trimmed = char.trim();
      return trimmed && isChineseCharacter(trimmed);
    });
    
    // Show warning if non-Chinese characters were filtered out
    const allChars = textInput.split('').filter(char => char.trim());
    if (allChars.length > chars.length) {
      alert(`只能添加中文字符！\nOnly Chinese characters can be added!\n\n过滤后的字符: ${chars.join('')}`);
    }
    
    if (chars.length === 0) {
      alert('请输入中文字符！\nPlease enter Chinese characters!');
      return;
    }
    
    console.log('📝 Valid Chinese characters:', chars);
    
    const newCards = [];
    
    for (const char of chars) {
      // Check if character already exists
      if (flashcards.some(card => card.character === char)) {
        console.log('⚠️ Character already exists:', char);
        continue;
      }
      
      const charData = characterData[char] || {
        pinyin: '?',
        definition: 'New character to learn!',
        emoji: '✨',
        level: 'P6' // Default to P6 for unknown characters
      };
      
      const newCard = {
        character: char,
        ...charData,
        dateAdded: new Date().toISOString(),
        weekAdded: getWeekNumber(new Date()),
        reviewCount: 0,
        mastery: 0
      };
      
      try {
        console.log('💾 Saving character:', char);
        const savedCard = await firebaseSaveCard(user.uid, newCard);
        console.log('✅ Successfully saved card:', savedCard);
        newCards.push(savedCard);
      } catch (error) {
        console.error('❌ Error saving card:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        
        if (error.code === 'permission-denied') {
          alert('Permission denied! Check your Firestore security rules.');
        } else if (error.code === 'unauthenticated') {
          alert('Not authenticated! Please log in again.');
        } else {
          alert(`Failed to save character: ${char}. Error: ${error.message}`);
        }
        break;
      }
    }
    
    console.log('✅ All characters processed. New cards:', newCards.length);
    
    if (newCards.length > 0) {
      setFlashcards(prev => [...newCards, ...prev]);
      setTextInput('');
      updateStreak();
      checkAchievements(flashcards.length + newCards.length, streak.days);
      speakText('太棒了！', false);
    }
  };

  // Delete individual card
  const deleteCard = async (cardId) => {
    if (!user) return;
    
    try {
      await firebaseDeleteCard(cardId);
      setFlashcards(prev => prev.filter(card => card.id !== cardId));
    } catch (error) {
      alert('Error deleting card. Please try again.');
    }
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

  // Get level color helper
  const getLevelColor = (level) => {
    const colors = {
      'P1': 'bg-green-100 text-green-800',
      'P2': 'bg-blue-100 text-blue-800',
      'P3': 'bg-yellow-100 text-yellow-800',
      'P4': 'bg-orange-100 text-orange-800',
      'P5': 'bg-purple-100 text-purple-800',
      'P6': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
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

            {/* Progress Tracker */}
            <ProgressTracker flashcards={flashcards} />

            {/* Add New Characters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Sparkles className="text-yellow-500 mr-2" />
                Add New Characters
              </h2>
              
              <div className="space-y-4">
                {/* Level Selector */}
                <LevelSelector 
                  currentLevel={currentLevel}
                  onLevelChange={setCurrentLevel}
                />
                
                {/* Quick Add Buttons */}
                <QuickAddButtons 
                  level={currentLevel}
                  onAddCharacter={addSingleCharacter}
                />
                
                <input
                  type="text"
                  value={textInput}
                  onChange={handleInputChange}
                  placeholder="Type Chinese characters here..."
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-2xl"
                />
                
                {textInput && (
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <p className="text-sm text-purple-700 mb-2">Characters to add:</p>
                    <div className="flex flex-wrap gap-2">
                      {textInput.split('').filter(char => char.trim() && isChineseCharacter(char)).map((char, index) => (
                        <div key={index} className="bg-purple-200 px-4 py-2 rounded-full text-2xl flex items-center space-x-2">
                          <span>{char}</span>
                          <span className="text-lg">{characterData[char]?.emoji || '✨'}</span>
                        </div>
                      ))}
                    </div>
                    {/* Warning for non-Chinese characters */}
                    {textInput.split('').filter(char => char.trim() && !isChineseCharacter(char)).length > 0 && (
                      <p className="text-red-600 text-sm mt-2">
                        ⚠️ Non-Chinese characters will be filtered out
                      </p>
                    )}
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

            {/* Enhanced Character List */}
            <div className="space-y-3">
              {getFilteredCards().map((card) => (
                <div key={card.id} className="bg-white p-4 rounded-2xl shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-5xl">{card.character}</div>
                      <div className="text-3xl">{card.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="font-bold text-lg text-purple-700">{card.pinyin}</div>
                          {/* Level indicator */}
                          {card.level && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(card.level)}`}>
                              {card.level}
                            </span>
                          )}
                        </div>
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
                        title="Listen to pronunciation"
                      >
                        <Volume2 size={20} />
                      </button>
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                        title="Delete character"
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
                      {flashcards[currentFlashcard].level && (
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(flashcards[currentFlashcard].level)}`}>
                          {flashcards[currentFlashcard].level} Level
                        </span>
                      )}
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
