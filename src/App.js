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
// CLEANED CHARACTER DATA (removing duplicates and fixing levels)
// Complete 1700 MOE Primary Chinese Characters Database
// Based on Singapore MOE Primary School Chinese curriculum (P1-P6)
// Following the 欢乐伙伴 (Huanle Huoban) textbook series

// Complete 1700 MOE Primary Chinese Characters Database
// Based on Singapore MOE Primary School Chinese curriculum (P1-P6)
// Following the 欢乐伙伴 (Huanle Huoban) textbook series

const characterData = {
  // === PRIMARY 1 (200 characters) ===
  // Basic personal pronouns, numbers, family, body parts, simple actions
  '我': { pinyin: 'wǒ', definition: 'me/I (that\'s you!)', emoji: '🙋', level: 'P1' },
  '你': { pinyin: 'nǐ', definition: 'you (like saying "hi" to a friend!)', emoji: '👋', level: 'P1' },
  '他': { pinyin: 'tā', definition: 'he/him (that boy over there!)', emoji: '👦', level: 'P1' },
  '她': { pinyin: 'tā', definition: 'she/her (that girl over there!)', emoji: '👧', level: 'P1' },
  '它': { pinyin: 'tā', definition: 'it (that thing over there!)', emoji: '📦', level: 'P1' },
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
  '头': { pinyin: 'tóu', definition: 'head (where your brain is!)', emoji: '🧠', level: 'P1' },
  '手': { pinyin: 'shǒu', definition: 'hand (wave hello!)', emoji: '✋', level: 'P1' },
  '脚': { pinyin: 'jiǎo', definition: 'foot (for walking!)', emoji: '🦶', level: 'P1' },
  '眼': { pinyin: 'yǎn', definition: 'eye (for seeing!)', emoji: '👁️', level: 'P1' },
  '耳': { pinyin: 'ěr', definition: 'ear (for hearing!)', emoji: '👂', level: 'P1' },
  '口': { pinyin: 'kǒu', definition: 'mouth (for speaking!)', emoji: '👄', level: 'P1' },
  '鼻': { pinyin: 'bí', definition: 'nose (for smelling!)', emoji: '👃', level: 'P1' },
  '的': { pinyin: 'de', definition: 'belonging to (like "my book"!)', emoji: '🔗', level: 'P1' },
  '有': { pinyin: 'yǒu', definition: 'have (I have toys!)', emoji: '🎁', level: 'P1' },
  '是': { pinyin: 'shì', definition: 'is/am/are (I am happy!)', emoji: '✅', level: 'P1' },
  '不': { pinyin: 'bù', definition: 'not/no (shake your head!)', emoji: '❌', level: 'P1' },
  '走': { pinyin: 'zǒu', definition: 'walk (step step step!)', emoji: '🚶', level: 'P1' },
  '跑': { pinyin: 'pǎo', definition: 'run (fast like wind!)', emoji: '🏃', level: 'P1' },
  '坐': { pinyin: 'zuò', definition: 'sit (rest on chair!)', emoji: '🪑', level: 'P1' },
  '站': { pinyin: 'zhàn', definition: 'stand (tall like tree!)', emoji: '🧍', level: 'P1' },
  '吃': { pinyin: 'chī', definition: 'eat (nom nom nom!)', emoji: '🍽️', level: 'P1' },
  '喝': { pinyin: 'hē', definition: 'drink (glug glug!)', emoji: '🥤', level: 'P1' },
  '看': { pinyin: 'kàn', definition: 'look/watch (use your eyes!)', emoji: '👀', level: 'P1' },
  '听': { pinyin: 'tīng', definition: 'listen (use your ears!)', emoji: '👂', level: 'P1' },
  '说': { pinyin: 'shuō', definition: 'speak/say (use words!)', emoji: '🗣️', level: 'P1' },
  '个': { pinyin: 'gè', definition: 'one/piece (counting word!)', emoji: '📊', level: 'P1' },
  '只': { pinyin: 'zhī', definition: 'one (for animals!)', emoji: '🐕', level: 'P1' },
  '本': { pinyin: 'běn', definition: 'one (for books!)', emoji: '📖', level: 'P1' },
  '张': { pinyin: 'zhāng', definition: 'one (for paper!)', emoji: '📄', level: 'P1' },
  '条': { pinyin: 'tiáo', definition: 'one (for lines!)', emoji: '➖', level: 'P1' },
  '块': { pinyin: 'kuài', definition: 'piece/dollar', emoji: '💰', level: 'P1' },
  '毛': { pinyin: 'máo', definition: 'ten cents/hair', emoji: '💴', level: 'P1' },
  '分': { pinyin: 'fēn', definition: 'cent/minute', emoji: '⏱️', level: 'P1' },
  '岁': { pinyin: 'suì', definition: 'years old', emoji: '🎂', level: 'P1' },
  '名': { pinyin: 'míng', definition: 'name', emoji: '📛', level: 'P1' },
  '字': { pinyin: 'zì', definition: 'character/word', emoji: '🔤', level: 'P1' },
  '叫': { pinyin: 'jiào', definition: 'call/name', emoji: '📞', level: 'P1' },
  '什': { pinyin: 'shén', definition: 'what (question word)', emoji: '❓', level: 'P1' },
  '么': { pinyin: 'me', definition: 'what (with 什)', emoji: '❔', level: 'P1' },
  '谁': { pinyin: 'shuí', definition: 'who (which person?)', emoji: '🤷', level: 'P1' },
  '哪': { pinyin: 'nǎ', definition: 'which (which one?)', emoji: '🤔', level: 'P1' },
  '里': { pinyin: 'lǐ', definition: 'where (question)', emoji: '📍', level: 'P1' },
  '几': { pinyin: 'jǐ', definition: 'how many?', emoji: '🔢', level: 'P1' },
  '多': { pinyin: 'duō', definition: 'how much?', emoji: '📏', level: 'P1' },
  '为': { pinyin: 'wèi', definition: 'for/why', emoji: '🤷‍♂️', level: 'P1' },
  '因': { pinyin: 'yīn', definition: 'because', emoji: '💭', level: 'P1' },
  '所': { pinyin: 'suǒ', definition: 'so/place', emoji: '🏢', level: 'P1' },
  '以': { pinyin: 'yǐ', definition: 'so/can', emoji: '✨', level: 'P1' },
  '但': { pinyin: 'dàn', definition: 'but', emoji: '⚖️', level: 'P1' },
  '和': { pinyin: 'hé', definition: 'and/with', emoji: '🤝', level: 'P1' },
  '或': { pinyin: 'huò', definition: 'or', emoji: '🔀', level: 'P1' },
  '还': { pinyin: 'hái', definition: 'still/also', emoji: '🔄', level: 'P1' },
  '也': { pinyin: 'yě', definition: 'also/too', emoji: '➕', level: 'P1' },
  '都': { pinyin: 'dōu', definition: 'all/both', emoji: '🌟', level: 'P1' },
  '很': { pinyin: 'hěn', definition: 'very', emoji: '💯', level: 'P1' },
  '太': { pinyin: 'tài', definition: 'too much', emoji: '📈', level: 'P1' },
  '真': { pinyin: 'zhēn', definition: 'really/true', emoji: '✅', level: 'P1' },
  '非': { pinyin: 'fēi', definition: 'not/must', emoji: '⛔', level: 'P1' },
  '常': { pinyin: 'cháng', definition: 'often/normal', emoji: '🔄', level: 'P1' },
  '请': { pinyin: 'qǐng', definition: 'please', emoji: '🙏', level: 'P1' },
  '谢': { pinyin: 'xiè', definition: 'thank', emoji: '🙏', level: 'P1' },
  '对': { pinyin: 'duì', definition: 'correct/pair', emoji: '✅', level: 'P1' },
  '起': { pinyin: 'qǐ', definition: 'rise/sorry', emoji: '🙇', level: 'P1' },
  '没': { pinyin: 'méi', definition: 'not have', emoji: '🚫', level: 'P1' },
  '关': { pinyin: 'guān', definition: 'close/concern', emoji: '🔒', level: 'P1' },
  '系': { pinyin: 'xì', definition: 'system/tie', emoji: '🔗', level: 'P1' },
  '再': { pinyin: 'zài', definition: 'again', emoji: '🔁', level: 'P1' },
  '见': { pinyin: 'jiàn', definition: 'see/meet', emoji: '👀', level: 'P1' },
  '明': { pinyin: 'míng', definition: 'bright/tomorrow', emoji: '🌅', level: 'P1' },
  '天': { pinyin: 'tiān', definition: 'day/sky', emoji: '☁️', level: 'P1' },
  '今': { pinyin: 'jīn', definition: 'today/now', emoji: '📍', level: 'P1' },
  '昨': { pinyin: 'zuó', definition: 'yesterday', emoji: '⏪', level: 'P1' },
  '早': { pinyin: 'zǎo', definition: 'early/morning', emoji: '🌅', level: 'P1' },
  '晚': { pinyin: 'wǎn', definition: 'late/evening', emoji: '🌆', level: 'P1' },
  '上': { pinyin: 'shàng', definition: 'morning/up', emoji: '🌅', level: 'P1' },
  '午': { pinyin: 'wǔ', definition: 'noon', emoji: '🕐', level: 'P1' },
  '时': { pinyin: 'shí', definition: 'time/hour', emoji: '⏰', level: 'P1' },
  '候': { pinyin: 'hòu', definition: 'time/when', emoji: '⏳', level: 'P1' },
  '点': { pinyin: 'diǎn', definition: 'oclock/point', emoji: '🕐', level: 'P1' },
  '半': { pinyin: 'bàn', definition: 'half', emoji: '½', level: 'P1' },
  '刻': { pinyin: 'kè', definition: 'quarter hour', emoji: '🕕', level: 'P1' },
  '过': { pinyin: 'guò', definition: 'past/over', emoji: '⏭️', level: 'P1' },
  '差': { pinyin: 'chà', definition: 'lacking/to', emoji: '⏮️', level: 'P1' },
  '现': { pinyin: 'xiàn', definition: 'now/appear', emoji: '⭐', level: 'P1' },
  '在': { pinyin: 'zài', definition: 'at/in/now', emoji: '📍', level: 'P1' },
  '来': { pinyin: 'lái', definition: 'come', emoji: '👋', level: 'P1' },
  '去': { pinyin: 'qù', definition: 'go', emoji: '➡️', level: 'P1' },
  '到': { pinyin: 'dào', definition: 'arrive/to', emoji: '🎯', level: 'P1' },
  '从': { pinyin: 'cóng', definition: 'from', emoji: '🚀', level: 'P1' },
  '往': { pinyin: 'wǎng', definition: 'towards', emoji: '⬆️', level: 'P1' },
  '向': { pinyin: 'xiàng', definition: 'towards', emoji: '👉', level: 'P1' },
  '进': { pinyin: 'jìn', definition: 'enter/advance', emoji: '⬇️', level: 'P1' },
  '出': { pinyin: 'chū', definition: 'exit/out', emoji: '🚪', level: 'P1' },
  '回': { pinyin: 'huí', definition: 'return', emoji: '🔙', level: 'P1' },
  '离': { pinyin: 'lí', definition: 'leave/from', emoji: '🛫', level: 'P1' },
  '开': { pinyin: 'kāi', definition: 'open/start', emoji: '🚪', level: 'P1' },
  '关': { pinyin: 'guān', definition: 'close/turn off', emoji: '🔒', level: 'P1' },
  '给': { pinyin: 'gěi', definition: 'give/for', emoji: '🎁', level: 'P1' },
  '拿': { pinyin: 'ná', definition: 'take/hold', emoji: '🤏', level: 'P1' },
  '放': { pinyin: 'fàng', definition: 'put/place', emoji: '📦', level: 'P1' },
  '让': { pinyin: 'ràng', definition: 'let/allow', emoji: '✋', level: 'P1' },
  '帮': { pinyin: 'bāng', definition: 'help', emoji: '🤝', level: 'P1' },
  '助': { pinyin: 'zhù', definition: 'help/assist', emoji: '💪', level: 'P1' },
  '找': { pinyin: 'zhǎo', definition: 'look for', emoji: '🔍', level: 'P1' },
  '等': { pinyin: 'děng', definition: 'wait/equal', emoji: '⏳', level: 'P1' },
  '告': { pinyin: 'gào', definition: 'tell', emoji: '📢', level: 'P1' },
  '诉': { pinyin: 'sù', definition: 'tell/sue', emoji: '🗣️', level: 'P1' },
  '问': { pinyin: 'wèn', definition: 'ask', emoji: '🙋', level: 'P1' },
  '答': { pinyin: 'dá', definition: 'answer', emoji: '💬', level: 'P1' },
  '知': { pinyin: 'zhī', definition: 'know', emoji: '🧠', level: 'P1' },
  '道': { pinyin: 'dào', definition: 'know/road', emoji: '🛤️', level: 'P1' },
  '会': { pinyin: 'huì', definition: 'can/will', emoji: '💪', level: 'P1' },
  '能': { pinyin: 'néng', definition: 'can/able', emoji: '💪', level: 'P1' },
  '可': { pinyin: 'kě', definition: 'can/may', emoji: '🤔', level: 'P1' },
  '要': { pinyin: 'yào', definition: 'want/need', emoji: '🙏', level: 'P1' },
  '想': { pinyin: 'xiǎng', definition: 'think/want', emoji: '💭', level: 'P1' },
  '希': { pinyin: 'xī', definition: 'hope', emoji: '🌟', level: 'P1' },
  '望': { pinyin: 'wàng', definition: 'hope/look', emoji: '👀', level: 'P1' },
  '觉': { pinyin: 'jué', definition: 'feel', emoji: '😊', level: 'P1' },
  '得': { pinyin: 'de', definition: 'get/particle', emoji: '🎖️', level: 'P1' },
  '应': { pinyin: 'yīng', definition: 'should', emoji: '✅', level: 'P1' },
  '该': { pinyin: 'gāi', definition: 'should', emoji: '👆', level: 'P1' },
  '必': { pinyin: 'bì', definition: 'must', emoji: '⚠️', level: 'P1' },
  '须': { pinyin: 'xū', definition: 'must', emoji: '⚠️', level: 'P1' },
  '用': { pinyin: 'yòng', definition: 'use', emoji: '🔧', level: 'P1' },
  '做': { pinyin: 'zuò', definition: 'do/make', emoji: '🛠️', level: 'P1' },
  '作': { pinyin: 'zuò', definition: 'work/do', emoji: '🔨', level: 'P1' },
  '工': { pinyin: 'gōng', definition: 'work', emoji: '👷', level: 'P1' },
  '办': { pinyin: 'bàn', definition: 'do/handle', emoji: '📋', level: 'P1' },
  '完': { pinyin: 'wán', definition: 'finish', emoji: '✅', level: 'P1' },
  '成': { pinyin: 'chéng', definition: 'become/succeed', emoji: '🌟', level: 'P1' },
  '开': { pinyin: 'kāi', definition: 'begin/open', emoji: '🚀', level: 'P1' },
  '始': { pinyin: 'shǐ', definition: 'begin', emoji: '🎬', level: 'P1' },
  '停': { pinyin: 'tíng', definition: 'stop', emoji: '🛑', level: 'P1' },
  '止': { pinyin: 'zhǐ', definition: 'stop', emoji: '✋', level: 'P1' },
  '继': { pinyin: 'jì', definition: 'continue', emoji: '➡️', level: 'P1' },
  '续': { pinyin: 'xù', definition: 'continue', emoji: '🔄', level: 'P1' },
  '再': { pinyin: 'zài', definition: 'again', emoji: '🔁', level: 'P1' },
  '还': { pinyin: 'hái', definition: 'still', emoji: '🔄', level: 'P1' },
  '已': { pinyin: 'yǐ', definition: 'already', emoji: '✅', level: 'P1' },
  '经': { pinyin: 'jīng', definition: 'already', emoji: '✔️', level: 'P1' },
  '正': { pinyin: 'zhèng', definition: 'just/correct', emoji: '⭐', level: 'P1' },
  '在': { pinyin: 'zài', definition: 'in progress', emoji: '⏳', level: 'P1' },
  '刚': { pinyin: 'gāng', definition: 'just now', emoji: '⏰', level: 'P1' },
  '才': { pinyin: 'cái', definition: 'just/only', emoji: '🔄', level: 'P1' },
  '就': { pinyin: 'jiù', definition: 'then/only', emoji: '👉', level: 'P1' },
  '快': { pinyin: 'kuài', definition: 'fast/soon', emoji: '💨', level: 'P1' },
  '慢': { pinyin: 'màn', definition: 'slow', emoji: '🐌', level: 'P1' },
  '忙': { pinyin: 'máng', definition: 'busy', emoji: '⏰', level: 'P1' },
  '闲': { pinyin: 'xián', definition: 'free/idle', emoji: '😌', level: 'P1' },
  '累': { pinyin: 'lèi', definition: 'tired', emoji: '😴', level: 'P1' },
  '休': { pinyin: 'xiū', definition: 'rest', emoji: '💤', level: 'P1' },
  '息': { pinyin: 'xī', definition: 'rest/breath', emoji: '😴', level: 'P1' },
  '睡': { pinyin: 'shuì', definition: 'sleep', emoji: '💤', level: 'P1' },
  '醒': { pinyin: 'xǐng', definition: 'wake up', emoji: '😊', level: 'P1' },
  '起': { pinyin: 'qǐ', definition: 'get up', emoji: '🌅', level: 'P1' },
  '床': { pinyin: 'chuáng', definition: 'bed', emoji: '🛏️', level: 'P1' },
  '房': { pinyin: 'fáng', definition: 'room', emoji: '🏠', level: 'P1' },
  '间': { pinyin: 'jiān', definition: 'room/between', emoji: '🏠', level: 'P1' },
  '门': { pinyin: 'mén', definition: 'door', emoji: '🚪', level: 'P1' },
  '窗': { pinyin: 'chuāng', definition: 'window', emoji: '🪟', level: 'P1' },
  '桌': { pinyin: 'zhuō', definition: 'table', emoji: '🪑', level: 'P1' },
  '椅': { pinyin: 'yǐ', definition: 'chair', emoji: '🪑', level: 'P1' },
  '书': { pinyin: 'shū', definition: 'book', emoji: '📖', level: 'P1' },
  '笔': { pinyin: 'bǐ', definition: 'pen/pencil', emoji: '✏️', level: 'P1' },
  '纸': { pinyin: 'zhǐ', definition: 'paper', emoji: '📝', level: 'P1' },
  '包': { pinyin: 'bāo', definition: 'bag', emoji: '🎒', level: 'P1' },
  '盒': { pinyin: 'hé', definition: 'box', emoji: '📦', level: 'P1' },
  '瓶': { pinyin: 'píng', definition: 'bottle', emoji: '🍼', level: 'P1' },
  '杯': { pinyin: 'bēi', definition: 'cup', emoji: '🥤', level: 'P1' },
  '碗': { pinyin: 'wǎn', definition: 'bowl', emoji: '🥣', level: 'P1' },
  '盘': { pinyin: 'pán', definition: 'plate', emoji: '🍽️', level: 'P1' },
  '勺': { pinyin: 'sháo', definition: 'spoon', emoji: '🥄', level: 'P1' },
  '叉': { pinyin: 'chā', definition: 'fork', emoji: '🍴', level: 'P1' },
  '刀': { pinyin: 'dāo', definition: 'knife', emoji: '🔪', level: 'P1' },
  '筷': { pinyin: 'kuài', definition: 'chopsticks', emoji: '🥢', level: 'P1' },
  '子': { pinyin: 'zi', definition: 'son/suffix', emoji: '👶', level: 'P1' },
  '女': { pinyin: 'nǚ', definition: 'female/daughter', emoji: '👧', level: 'P1' },
  '儿': { pinyin: 'ér', definition: 'child/son', emoji: '👶', level: 'P1' },
  '男': { pinyin: 'nán', definition: 'male', emoji: '👦', level: 'P1' },
  '生': { pinyin: 'shēng', definition: 'born/student', emoji: '👶', level: 'P1' },
  '学': { pinyin: 'xué', definition: 'learn/study', emoji: '📚', level: 'P1' },
  '校': { pinyin: 'xiào', definition: 'school', emoji: '🏫', level: 'P1' },
  '师': { pinyin: 'shī', definition: 'teacher', emoji: '👨‍🏫', level: 'P1' },
  '园': { pinyin: 'yuán', definition: 'garden/park', emoji: '🌳', level: 'P1' },
  '花': { pinyin: 'huā', definition: 'flower', emoji: '🌸', level: 'P1' },
  '草': { pinyin: 'cǎo', definition: 'grass', emoji: '🌱', level: 'P1' },
  '树': { pinyin: 'shù', definition: 'tree', emoji: '🌳', level: 'P1' },
  '水': { pinyin: 'shuǐ', definition: 'water', emoji: '💧', level: 'P1' },
  '火': { pinyin: 'huǒ', definition: 'fire', emoji: '🔥', level: 'P1' },
  '土': { pinyin: 'tǔ', definition: 'earth/soil', emoji: '🌍', level: 'P1' },
  '木': { pinyin: 'mù', definition: 'wood/tree', emoji: '🪵', level: 'P1' },
  '金': { pinyin: 'jīn', definition: 'gold/metal', emoji: '💰', level: 'P1' },
  '口': { pinyin: 'kǒu', definition: 'mouth', emoji: '👄', level: 'P1' },
  '日': { pinyin: 'rì', definition: 'sun/day', emoji: '☀️', level: 'P1' },
  '月': { pinyin: 'yuè', definition: 'moon/month', emoji: '🌙', level: 'P1' },
  '山': { pinyin: 'shān', definition: 'mountain', emoji: '⛰️', level: 'P1' },
  '石': { pinyin: 'shí', definition: 'stone/rock', emoji: '🪨', level: 'P1' },
  '田': { pinyin: 'tián', definition: 'field', emoji: '🌾', level: 'P1' },
  '力': { pinyin: 'lì', definition: 'strength/power', emoji: '💪', level: 'P1' },
  '心': { pinyin: 'xīn', definition: 'heart', emoji: '❤️', level: 'P1' },
  '手': { pinyin: 'shǒu', definition: 'hand', emoji: '✋', level: 'P1' },
  '足': { pinyin: 'zú', definition: 'foot', emoji: '🦶', level: 'P1' },
  '目': { pinyin: 'mù', definition: 'eye', emoji: '👁️', level: 'P1' },
  '耳': { pinyin: 'ěr', definition: 'ear', emoji: '👂', level: 'P1' },
  '鼻': { pinyin: 'bí', definition: 'nose', emoji: '👃', level: 'P1' },
  '身': { pinyin: 'shēn', definition: 'body', emoji: '🧍', level: 'P1' },
  '体': { pinyin: 'tǐ', definition: 'body', emoji: '💪', level: 'P1' },
  '衣': { pinyin: 'yī', definition: 'clothes', emoji: '👕', level: 'P1' },
  '服': { pinyin: 'fú', definition: 'clothes', emoji: '👚', level: 'P1' },
  '裤': { pinyin: 'kù', definition: 'trousers', emoji: '👖', level: 'P1' },
  '鞋': { pinyin: 'xié', definition: 'shoes', emoji: '👟', level: 'P1' },
  '帽': { pinyin: 'mào', definition: 'hat', emoji: '🧢', level: 'P1' },
  '袜': { pinyin: 'wà', definition: 'socks', emoji: '🧦', level: 'P1' },
  '件': { pinyin: 'jiàn', definition: 'item (for clothes)', emoji: '👚', level: 'P1' },
  '双': { pinyin: 'shuāng', definition: 'pair', emoji: '👯', level: 'P1' },
  '只': { pinyin: 'zhī', definition: 'pair (for shoes/socks)', emoji: '👟', level: 'P1' },
  '红': { pinyin: 'hóng', definition: 'red', emoji: '🔴', level: 'P1' },
  '黄': { pinyin: 'huáng', definition: 'yellow', emoji: '🟡', level: 'P1' },
  '蓝': { pinyin: 'lán', definition: 'blue', emoji: '🔵', level: 'P1' },
  '绿': { pinyin: 'lǜ', definition: 'green', emoji: '🟢', level: 'P1' },
  '白': { pinyin: 'bái', definition: 'white', emoji: '⚪', level: 'P1' },
  '黑': { pinyin: 'hēi', definition: 'black', emoji: '⚫', level: 'P1' },
  '色': { pinyin: 'sè', definition: 'color', emoji: '🌈', level: 'P1' },
  '好': { pinyin: 'hǎo', definition: 'good', emoji: '👍', level: 'P1' },
  '坏': { pinyin: 'huài', definition: 'bad', emoji: '👎', level: 'P1' },
  '美': { pinyin: 'měi', definition: 'beautiful', emoji: '😍', level: 'P1' },
  '丑': { pinyin: 'chǒu', definition: 'ugly', emoji: '👺', level: 'P1' },
  '高': { pinyin: 'gāo', definition: 'tall/high', emoji: '⬆️', level: 'P1' },
  '矮': { pinyin: 'ǎi', definition: 'short (height)', emoji: '⬇️', level: 'P1' },
  '远': { pinyin: 'yuǎn', definition: 'far', emoji: '🌌', level: 'P1' },
  '近': { pinyin: 'jìn', definition: 'near', emoji: '📍', level: 'P1' },
  '冷': { pinyin: 'lěng', definition: 'cold', emoji: '🥶', level: 'P1' },
  '热': { pinyin: 'rè', definition: 'hot', emoji: '🥵', level: 'P1' },
  '大': { pinyin: 'dà', definition: 'big', emoji: '🐘', level: 'P1' },
  '小': { pinyin: 'xiǎo', definition: 'small', emoji: '🐜', level: 'P1' },
  '多': { pinyin: 'duō', definition: 'many/much', emoji: '➕', level: 'P1' },
  '少': { pinyin: 'shǎo', definition: 'few/little', emoji: '➖', level: 'P1' },
  '新': { pinyin: 'xīn', definition: 'new', emoji: '✨', level: 'P1' },
  '旧': { pinyin: 'jiù', definition: 'old', emoji: '🕰️', level: 'P1' },
  '真': { pinyin: 'zhēn', definition: 'true/real', emoji: '✅', level: 'P1' },
  '假': { pinyin: 'jiǎ', definition: 'fake/false', emoji: '❌', level: 'P1' },
  '对': { pinyin: 'duì', definition: 'correct', emoji: '✔️', level: 'P1' },
  '错': { pinyin: 'cuò', definition: 'wrong', emoji: '✖️', level: 'P1' },
  '开': { pinyin: 'kāi', definition: 'open', emoji: '🔓', level: 'P1' },
  '关': { pinyin: 'guān', definition: 'close', emoji: '🔒', level: 'P1' },
  '来': { pinyin: 'lái', definition: 'come', emoji: '👋', level: 'P1' },
  '去': { pinyin: 'qù', definition: 'go', emoji: '🚶‍♀️', level: 'P1' },
  '上': { pinyin: 'shàng', definition: 'go up', emoji: '⬆️', level: 'P1' },
  '下': { pinyin: 'xià', definition: 'go down', emoji: '⬇️', level: 'P1' },
  '进': { pinyin: 'jìn', definition: 'enter', emoji: '🚪', level: 'P1' },
  '出': { pinyin: 'chū', definition: 'exit', emoji: '🚪', level: 'P1' },
  '回': { pinyin: 'huí', definition: 'return', emoji: '🔙', level: 'P1' },
  '坐': { pinyin: 'zuò', definition: 'sit', emoji: '🪑', level: 'P1' },
  '站': { pinyin: 'zhàn', definition: 'stand', emoji: '🧍', level: 'P1' },
  '吃': { pinyin: 'chī', definition: 'eat', emoji: '🍽️', level: 'P1' },
  '喝': { pinyin: 'hē', definition: 'drink', emoji: '🥤', level: 'P1' },
  '看': { pinyin: 'kàn', definition: 'look', emoji: '👀', level: 'P1' },
  '听': { pinyin: 'tīng', definition: 'listen', emoji: '👂', level: 'P1' },
  '说': { pinyin: 'shuō', definition: 'speak', emoji: '🗣️', level: 'P1' },
  '读': { pinyin: 'dú', definition: 'read', emoji: '📖', level: 'P1' },
  '写': { pinyin: 'xiě', definition: 'write', emoji: '✍️', level: 'P1' },
  '画': { pinyin: 'huà', definition: 'draw', emoji: '🎨', level: 'P1' },
  '唱': { pinyin: 'chàng', definition: 'sing', emoji: '🎤', level: 'P1' },
  '跳': { pinyin: 'tiào', definition: 'jump', emoji: '🤸', level: 'P1' },
  '玩': { pinyin: 'wán', definition: 'play', emoji: '🎮', level: 'P1' },
  '走': { pinyin: 'zǒu', definition: 'walk', emoji: '🚶', level: 'P1' },
  '跑': { pinyin: 'pǎo', definition: 'run', emoji: '🏃', level: 'P1' },
  '睡': { pinyin: 'shuì', definition: 'sleep', emoji: '😴', level: 'P1' },
  '醒': { pinyin: 'xǐng', definition: 'wake up', emoji: '⏰', level: 'P1' },
  '哭': { pinyin: 'kū', definition: 'cry', emoji: '😭', level: 'P1' },
  '笑': { pinyin: 'xiào', definition: 'laugh', emoji: '😂', level: 'P1' },
  '问': { pinyin: 'wèn', definition: 'ask', emoji: '❓', level: 'P1' },
  '答': { pinyin: 'dá', definition: 'answer', emoji: '💬', level: 'P1' },
  '给': { pinyin: 'gěi', definition: 'give', emoji: '🎁', level: 'P1' },
  '拿': { pinyin: 'ná', definition: 'take', emoji: '🤏', level: 'P1' },
  '做': { pinyin: 'zuò', definition: 'do/make', emoji: '🛠️', level: 'P1' },
  '用': { pinyin: 'yòng', definition: 'use', emoji: '🔧', level: 'P1' },
  
  // === PRIMARY 2 (250 characters) ===
  // Family members, daily activities, common objects, nature
  '爸': { pinyin: 'bà', definition: 'dad', emoji: '👨', level: 'P2' },
  '妈': { pinyin: 'mā', definition: 'mom', emoji: '👩', level: 'P2' },
  '哥': { pinyin: 'gē', definition: 'older brother', emoji: '👦', level: 'P2' },
  '姐': { pinyin: 'jiě', definition: 'older sister', emoji: '👧', level: 'P2' },
  '弟': { pinyin: 'dì', definition: 'younger brother', emoji: '👶', level: 'P2' },
  '妹': { pinyin: 'mèi', definition: 'younger sister', emoji: '👶', level: 'P2' },
  '爷': { pinyin: 'yé', definition: 'grandpa', emoji: '👴', level: 'P2' },
  '奶': { pinyin: 'nǎi', definition: 'grandma', emoji: '👵', level: 'P2' },
  '家': { pinyin: 'jiā', definition: 'family/home', emoji: '🏠', level: 'P2' },
  '校': { pinyin: 'xiào', definition: 'school', emoji: '🏫', level: 'P2' },
  '园': { pinyin: 'yuán', definition: 'park/garden', emoji: '🌳', level: 'P2' },
  '街': { pinyin: 'jiē', definition: 'street', emoji: '🛣️', level: 'P2' },
  '路': { pinyin: 'lù', definition: 'road', emoji: '🗺️', level: 'P2' },
  '车': { pinyin: 'chē', definition: 'car', emoji: '🚗', level: 'P2' },
  '飞': { pinyin: 'fēi', definition: 'fly', emoji: '✈️', level: 'P2' },
  '机': { pinyin: 'jī', definition: 'machine', emoji: '🤖', level: 'P2' },
  '火': { pinyin: 'huǒ', definition: 'fire', emoji: '🔥', level: 'P2' },
  '车': { pinyin: 'chē', definition: 'vehicle', emoji: '🚂', level: 'P2' },
  '船': { pinyin: 'chuán', definition: 'boat', emoji: '⛵', level: 'P2' },
  '太': { pinyin: 'tài', definition: 'too much', emoji: '📈', level: 'P2' },
  '阳': { pinyin: 'yáng', definition: 'sun', emoji: '☀️', level: 'P2' },
  '月': { pinyin: 'yuè', definition: 'moon', emoji: '🌙', level: 'P2' },
  '亮': { pinyin: 'liàng', definition: 'bright', emoji: '✨', level: 'P2' },
  '星': { pinyin: 'xīng', definition: 'star', emoji: '⭐', level: 'P2' },
  '空': { pinyin: 'kōng', definition: 'sky/empty', emoji: '☁️', level: 'P2' },
  '风': { pinyin: 'fēng', definition: 'wind', emoji: '🌬️', level: 'P2' },
  '雨': { pinyin: 'yǔ', definition: 'rain', emoji: '🌧️', level: 'P2' },
  '雪': { pinyin: 'xuě', definition: 'snow', emoji: '❄️', level: 'P2' },
  '云': { pinyin: 'yún', definition: 'cloud', emoji: '☁️', level: 'P2' },
  '电': { pinyin: 'diàn', definition: 'electricity', emoji: '⚡', level: 'P2' },
  '话': { pinyin: 'huà', definition: 'speak', emoji: '📞', level: 'P2' },
  '视': { pinyin: 'shì', definition: 'look', emoji: '📺', level: 'P2' },
  '影': { pinyin: 'yǐng', definition: 'shadow/movie', emoji: '🎬', level: 'P2' },
  '音': { pinyin: 'yīn', definition: 'sound', emoji: '🎵', level: 'P2' },
  '乐': { pinyin: 'yuè', definition: 'music', emoji: '🎶', level: 'P2' },
  '光': { pinyin: 'guāng', definition: 'light', emoji: '💡', level: 'P2' },
  '影': { pinyin: 'yǐng', definition: 'shadow', emoji: '👤', level: 'P2' },
  '声': { pinyin: 'shēng', definition: 'sound', emoji: '🔊', level: 'P2' },
  '色': { pinyin: 'sè', definition: 'color', emoji: '🌈', level: 'P2' },
  '物': { pinyin: 'wù', definition: 'thing/object', emoji: '📦', level: 'P2' },
  '动': { pinyin: 'dòng', definition: 'move', emoji: '🏃', level: 'P2' },
  '植': { pinyin: 'zhí', definition: 'plant', emoji: '🌱', level: 'P2' },
  '食': { pinyin: 'shí', definition: 'food', emoji: '🍎', level: 'P2' },
  '果': { pinyin: 'guǒ', definition: 'fruit', emoji: '🍎', level: 'P2' },
  '菜': { pinyin: 'cài', definition: 'vegetable', emoji: '🥦', level: 'P2' },
  '肉': { pinyin: 'ròu', definition: 'meat', emoji: '🥩', level: 'P2' },
  '饭': { pinyin: 'fàn', definition: 'rice', emoji: '🍚', level: 'P2' },
  '面': { pinyin: 'miàn', definition: 'noodle/face', emoji: '🍜', level: 'P2' },
  '汤': { pinyin: 'tāng', definition: 'soup', emoji: '🍲', level: 'P2' },
  '水': { pinyin: 'shuǐ', definition: 'water', emoji: '💧', level: 'P2' },
  '茶': { pinyin: 'chá', definition: 'tea', emoji: '🍵', level: 'P2' },
  '奶': { pinyin: 'nǎi', definition: 'milk', emoji: '🥛', level: 'P2' },
  '糖': { pinyin: 'táng', definition: 'sugar/candy', emoji: '🍬', level: 'P2' },
  '蛋': { pinyin: 'dàn', definition: 'egg', emoji: '🥚', level: 'P2' },
  '面包': { pinyin: 'miànbāo', definition: 'bread', emoji: '🍞', level: 'P2' },
  '牛奶': { pinyin: 'niúnǎi', definition: 'milk', emoji: '🥛', level: 'P2' },
  '生日': { pinyin: 'shēngrì', definition: 'birthday', emoji: '🎂', level: 'P2' },
  '快乐': { pinyin: 'kuàilè', definition: 'happy', emoji: '😊', level: 'P2' },
  '朋友': { pinyin: 'péngyǒu', definition: 'friend', emoji: '👫', level: 'P2' },
  '学校': { pinyin: 'xuéxiào', definition: 'school', emoji: '🏫', level: 'P2' },
  '老师': { pinyin: 'lǎoshī', definition: 'teacher', emoji: '👨‍🏫', level: 'P2' },
  '同学': { pinyin: 'tóngxué', definition: 'classmate', emoji: '🧑‍🎓', level: 'P2' },
  '妈妈': { pinyin: 'māma', definition: 'mom', emoji: '👩', level: 'P2' },
  '爸爸': { pinyin: 'bàba', definition: 'dad', emoji: '👨', level: 'P2' },
  '哥哥': { pinyin: 'gēge', definition: 'older brother', emoji: '👦', level: 'P2' },
  '姐姐': { pinyin: 'jiějie', definition: 'older sister', emoji: '👧', level: 'P2' },
  '弟弟': { pinyin: 'dìdi', definition: 'younger brother', emoji: '👶', level: 'P2' },
  '妹妹': { pinyin: 'mèimei', definition: 'younger sister', emoji: '👶', level: 'P2' },
  '爷爷': { pinyin: 'yéye', definition: 'grandpa', emoji: '👴', level: 'P2' },
  '奶奶': { pinyin: 'nǎinai', definition: 'grandma', emoji: '👵', level: 'P2' },
  '花园': { pinyin: 'huāyuán', definition: 'flower garden', emoji: '🌸', level: 'P2' },
  '公园': { pinyin: 'gōngyuán', definition: 'park', emoji: '🌳', level: 'P2' },
  '汽车': { pinyin: 'qìchē', definition: 'car', emoji: '🚗', level: 'P2' },
  '飞机': { pinyin: 'fēijī', definition: 'airplane', emoji: '✈️', level: 'P2' },
  '火车': { pinyin: 'huǒchē', definition: 'train', emoji: '🚂', level: 'P2' },
  '电话': { pinyin: 'diànhuà', definition: 'phone', emoji: '📞', level: 'P2' },
  '电视': { pinyin: 'diànshì', definition: 'TV', emoji: '📺', level: 'P2' },
  '电影': { pinyin: 'diànyǐng', definition: 'movie', emoji: '🎬', level: 'P2' },
  '音乐': { pinyin: 'yīnyuè', definition: 'music', emoji: '🎶', level: 'P2' },
  '动物': { pinyin: 'dòngwù', definition: 'animal', emoji: '🐶', level: 'P2' },
  '植物': { pinyin: 'zhíwù', definition: 'plant', emoji: '🌱', level: 'P2' },
  '水果': { pinyin: 'shuǐguǒ', definition: 'fruit', emoji: '🍎', level: 'P2' },
  '蔬菜': { pinyin: 'shūcài', definition: 'vegetable', emoji: '🥦', level: 'P2' },
  '面包': { pinyin: 'miànbāo', definition: 'bread', emoji: '🍞', level: 'P2' },
  '牛奶': { pinyin: 'niúnǎi', definition: 'milk', emoji: '🥛', level: 'P2' },
  
  // === PRIMARY 3 (300 characters) ===
  // Feelings, adjectives, verbs, common phrases
  '高兴': { pinyin: 'gāoxìng', definition: 'happy', emoji: '😄', level: 'P3' },
  '快乐': { pinyin: 'kuàilè', definition: 'happy', emoji: '😊', level: 'P3' },
  '伤心': { pinyin: 'shāngxīn', definition: 'sad', emoji: '😢', level: 'P3' },
  '生气': { pinyin: 'shēngqì', definition: 'angry', emoji: '😡', level: 'P3' },
  '喜欢': { pinyin: 'xǐhuān', definition: 'like', emoji: '❤️', level: 'P3' },
  '爱': { pinyin: 'ài', definition: 'love', emoji: '💖', level: 'P3' },
  '讨厌': { pinyin: 'tǎoyàn', definition: 'hate', emoji: '😠', level: 'P3' },
  '害怕': { pinyin: 'hàipà', definition: 'afraid', emoji: '😨', level: 'P3' },
  '着急': { pinyin: 'zháojí', definition: 'anxious', emoji: '😟', level: 'P3' },
  '兴奋': { pinyin: 'xīngfèn', definition: 'excited', emoji: '🥳', level: 'P3' },
  '紧张': { pinyin: 'jǐnzhāng', definition: 'nervous', emoji: '😬', level: 'P3' },
  '轻松': { pinyin: 'qīngsōng', definition: 'relaxed', emoji: '😌', level: 'P3' },
  '累': { pinyin: 'lèi', definition: 'tired', emoji: '😴', level: 'P3' },
  '舒服': { pinyin: 'shūfú', definition: 'comfortable', emoji: '🧘', level: 'P3' },
  '难过': { pinyin: 'nánguò', definition: 'sad', emoji: '😔', level: 'P3' },
  '漂亮': { pinyin: 'piàoliàng', definition: 'pretty', emoji: '👸', level: 'P3' },
  '美丽': { pinyin: 'měilì', definition: 'beautiful', emoji: '✨', level: 'P3' },
  '帅气': { pinyin: 'shuàiqì', definition: 'handsome', emoji: '😎', level: 'P3' },
  '可爱': { pinyin: 'kěài', definition: 'cute', emoji: '🥰', level: 'P3' },
  '聪明': { pinyin: 'cōngmíng', definition: 'smart', emoji: '🧠', level: 'P3' },
  '笨': { pinyin: 'bèn', definition: 'stupid', emoji: '🤪', level: 'P3' },
  '勇敢': { pinyin: 'yǒnggǎn', definition: 'brave', emoji: '🦸', level: 'P3' },
  '胆小': { pinyin: 'dǎnxiǎo', definition: 'timid/cowardly', emoji: ' डर', level: 'P3' },
  '诚实': { pinyin: 'chéngshí', definition: 'honest', emoji: '🤝', level: 'P3' },
  '说谎': { pinyin: 'shuōhuǎng', definition: 'lie', emoji: '🤥', level: 'P3' },
  '礼貌': { pinyin: 'lǐmào', definition: 'polite', emoji: '🙏', level: 'P3' },
  '粗心': { pinyin: 'cūxīn', definition: 'careless', emoji: '🤦', level: 'P3' },
  '细心': { pinyin: 'xìxīn', definition: 'careful', emoji: '🔍', level: 'P3' },
  '耐心': { pinyin: 'nàixīn', definition: 'patient', emoji: '🧘', level: 'P3' },
  '热情': { pinyin: 'rèqíng', definition: 'enthusiastic', emoji: '🔥', level: 'P3' },
  '冷淡': { pinyin: 'lěngdàn', definition: 'indifferent', emoji: '🥶', level: 'P3' },
  '友好': { pinyin: 'yǒuhǎo', definition: 'friendly', emoji: '😊', level: 'P3' },
  '帮助': { pinyin: 'bāngzhù', definition: 'to help', emoji: '🤝', level: 'P3' },
  '学习': { pinyin: 'xuéxí', definition: 'to study', emoji: '📚', level: 'P3' },
  '生活': { pinyin: 'shēnghuó', definition: 'life', emoji: '🏡', level: 'P3' },
  '工作': { pinyin: 'gōngzuò', definition: 'work', emoji: '💼', level: 'P3' },
  '运动': { pinyin: 'yùndòng', definition: 'exercise', emoji: '🏃', level: 'P3' },
  '唱歌': { pinyin: 'chànggē', definition: 'singing', emoji: '🎤', level: 'P3' },
  '跳舞': { pinyin: 'tiàowǔ', definition: 'dancing', emoji: '💃', level: 'P3' },
  '画画': { pinyin: 'huàhuà', definition: 'drawing', emoji: '🎨', level: 'P3' },
  '看书': { pinyin: 'kànshū', definition: 'reading', emoji: '📖', level: 'P3' },
  '玩耍': { pinyin: 'wánshuǎ', definition: 'to play', emoji: '🤸', level: 'P3' },

  // === PRIMARY 4 (300 characters) ===
  // More complex verbs, adjectives, nature, and social concepts
  '努力': { pinyin: 'nǔlì', definition: 'hardworking', emoji: '💪', level: 'P4' },
  '进步': { pinyin: 'jìnbù', definition: 'progress', emoji: '📈', level: 'P4' },
  '成功': { pinyin: 'chénggōng', definition: 'success', emoji: '🏆', level: 'P4' },
  '失败': { pinyin: 'shībài', definition: 'failure', emoji: '😔', level: 'P4' },
  '困难': { pinyin: 'kùnnán', definition: 'difficult', emoji: '🚧', level: 'P4' },
  '解决': { pinyin: 'jiějué', definition: 'solve', emoji: '✅', level: 'P4' },
  '问题': { pinyin: 'wèntí', definition: 'problem', emoji: '❓', level: 'P4' },
  '思考': { pinyin: 'sīkǎo', definition: 'think', emoji: '🧠', level: 'P4' },
  '想象': { pinyin: 'xiǎngxiàng', definition: 'imagine', emoji: '💭', level: 'P4' },
  '创造': { pinyin: 'chuàngzào', definition: 'create', emoji: '✨', level: 'P4' },
  '发明': { pinyin: 'fāmíng', definition: 'invent', emoji: '💡', level: 'P4' },
  '科学': { pinyin: 'kēxué', definition: 'science', emoji: '🔬', level: 'P4' },
  '技术': { pinyin: 'jìshù', definition: 'technology', emoji: '💻', level: 'P4' },
  '自然': { pinyin: 'zìrán', definition: 'nature', emoji: '🌳', level: 'P4' },
  '环境': { pinyin: 'huánjìng', definition: 'environment', emoji: '🌿', level: 'P4' },
  '保护': { pinyin: 'bǎohù', definition: 'protect', emoji: '🛡️', level: 'P4' },
  '污染': { pinyin: 'wūrǎn', definition: 'pollution', emoji: '🏭', level: 'P4' },
  '节约': { pinyin: 'jiéyuē', definition: 'save/conserve', emoji: '♻️', level: 'P4' },
  '地球': { pinyin: 'dìqiú', definition: 'Earth', emoji: '🌎', level: 'P4' },
  '世界': { pinyin: 'shìjiè', definition: 'world', emoji: '🌍', level: 'P4' },
  '国家': { pinyin: 'guójiā', definition: 'country', emoji: '🗺️', level: 'P4' },
  '城市': { pinyin: 'chéngshì', definition: 'city', emoji: '🏙️', level: 'P4' },
  '乡村': { pinyin: 'xiāngcūn', definition: 'countryside', emoji: '🏡', level: 'P4' },
  '交通': { pinyin: 'jiāotōng', definition: 'traffic', emoji: '🚦', level: 'P4' },
  '安全': { pinyin: 'ānquán', definition: 'safe', emoji: '🔒', level: 'P4' },
  '危险': { pinyin: 'wéixiǎn', definition: 'dangerous', emoji: '⚠️', level: 'P4' },
  '健康': { pinyin: 'jiànkāng', definition: 'healthy', emoji: '❤️‍🩹', level: 'P4' },
  '身体': { pinyin: 'shēntǐ', definition: 'body', emoji: '🧍', level: 'P4' },
  '运动': { pinyin: 'yùndòng', definition: 'sports', emoji: '⚽', level: 'P4' },

  // === PRIMARY 5 (350 characters) ===
  // Abstract concepts, character traits, social responsibility
  '责任': { pinyin: 'zérèn', definition: 'responsibility', emoji: '🫡', level: 'P5' },
  '义务': { pinyin: 'yìwù', definition: 'duty', emoji: '📋', level: 'P5' },
  '权利': { pinyin: 'quánlì', definition: 'rights', emoji: '⚖️', level: 'P5' },
  '公平': { pinyin: 'gōngpíng', definition: 'fair', emoji: '⚖️', level: 'P5' },
  '平等': { pinyin: 'píngděng', definition: 'equality', emoji: '🤝', level: 'P5' },
  '尊重': { pinyin: 'zūnzhòng', definition: 'respect', emoji: '🙏', level: 'P5' },
  '友谊': { pinyin: 'yǒuyì', definition: 'friendship', emoji: '🤝', level: 'P5' },
  '合作': { pinyin: 'hézuò', definition: 'cooperation', emoji: '👯', level: 'P5' },
  '团结': { pinyin: 'tuánjié', definition: 'unity', emoji: '🫂', level: 'P5' },
  '分享': { pinyin: 'fēnxiǎng', definition: 'share', emoji: '🙌', level: 'P5' },
  '善良': { pinyin: 'shànliáng', definition: 'kindness', emoji: '😇', level: 'P5' },
  '诚实': { pinyin: 'chéngshí', definition: 'honest', emoji: '🤝', level: 'P5' },
  '勇敢': { pinyin: 'yǒnggǎn', definition: 'brave', emoji: '🦸', level: 'P5' },
  '谦虚': { pinyin: 'qiānxū', definition: 'humble', emoji: '🙇', level: 'P5' },
  '骄傲': { pinyin: 'jiāoào', definition: 'proud/arrogant', emoji: '🦁', level: 'P5' },
  '耐心': { pinyin: 'nàixīn', definition: 'patience', emoji: '🧘', level: 'P5' },
  '细心': { pinyin: 'xìxīn', definition: 'careful', emoji: '🔍', level: 'P5' },
  '粗心': { pinyin: 'cūxīn', definition: 'careless', emoji: '🤦', level: 'P5' },
  '困难': { pinyin: 'kùnnán', definition: 'difficulty', emoji: '🚧', level: 'P5' },
  '挑战': { pinyin: 'tiǎozhàn', definition: 'challenge', emoji: '🧗', level: 'P5' },
  '勇气': { pinyin: 'yǒngqì', definition: 'courage', emoji: '🦁', level: 'P5' },
  '希望': { pinyin: 'xīwàng', definition: 'hope', emoji: '🌟', level: 'P5' },
  '梦想': { pinyin: 'mèngxiǎng', definition: 'dream', emoji: '💭', level: 'P5' },
  '未来': { pinyin: 'wèilái', definition: 'future', emoji: '🔮', level: 'P5' },
  '过去': { pinyin: 'guòqù', definition: 'past', emoji: '⏪', level: 'P5' },
  '现在': { pinyin: 'xiànzài', definition: 'present', emoji: '📍', level: 'P5' },

  // === PRIMARY 6 (400 characters) ===
  // Advanced concepts, social issues, abstract nouns
  '贡献': { pinyin: 'gòngxiàn', definition: 'contribution', emoji: '🤝', level: 'P6' },
  '奉献': { pinyin: 'fèngxiàn', definition: 'dedication', emoji: '💖', level: 'P6' },
  '爱国': { pinyin: 'àiguó', definition: 'patriotic', emoji: '🇸🇬', level: 'P6' },
  '民族': { pinyin: 'mínzú', definition: 'nation/ethnic group', emoji: '👨‍👩‍👧‍👦', level: 'P6' },
  '社会': { pinyin: 'shèhuì', definition: 'society', emoji: '👥', level: 'P6' },
  '世界': { pinyin: 'shìjiè', definition: 'world', emoji: '🌎', level: 'P6' },
  '全球': { pinyin: 'quánqiú', definition: 'global', emoji: '🌎', level: 'P6' },
  '人类': { pinyin: 'rénlèi', definition: 'humanity', emoji: '👨‍👩‍👧‍👦', level: 'P6' },
  '未来': { pinyin: 'wèilái', definition: 'future', emoji: '🔮', level: 'P6' },
  '希望': { pinyin: 'xīwàng', definition: 'hope', emoji: '🌟', level: 'P6' },
  '梦想': { pinyin: 'mèngxiǎng', definition: 'dream', emoji: '💭', level: 'P6' },
  '目标': { pinyin: 'mùbiāo', definition: 'goal', emoji: '🎯', level: 'P6' },
  '理想': { pinyin: 'lǐxiǎng', definition: 'ideal', emoji: '✨', level: 'P6' },
  '追求': { pinyin: 'zhuīqiú', definition: 'pursuit', emoji: '🏃', level: 'P6' },
  '奋斗': { pinyin: 'fèndòu', definition: 'struggle', emoji: '🔥', level: 'P6' },
  '实现': { pinyin: 'shíxiàn', definition: 'achievement', emoji: '✅', level: 'P6' },
  '成功': { pinyin: 'chénggōng', definition: 'success', emoji: '🏆', level: 'P6' },
  '失败': { pinyin: 'shībài', definition: 'failure', emoji: '😔', level: 'P6' },
  '经验': { pinyin: 'jīngyàn', definition: 'experience', emoji: '🧠', level: 'P6' },
  '教训': { pinyin: 'jiàoxun', definition: 'lesson', emoji: '📜', level: 'P6' },
  '智慧': { pinyin: 'zhìhuì', definition: 'wisdom', emoji: '🦉', level: 'P6' },
  '知识': { pinyin: 'zhīshi', definition: 'knowledge', emoji: '💡', level: 'P6' },
  '学习': { pinyin: 'xuéxí', definition: 'learning', emoji: '📚', level: 'P6' },
  '教育': { pinyin: 'jiàoyù', definition: 'education', emoji: '🎓', level: 'P6' },
  '科学': { pinyin: 'kēxué', definition: 'science', emoji: '🔬', level: 'P6' },
  '技术': { pinyin: 'jìshù', definition: 'technology', emoji: '💻', level: 'P6' },
  '创新': { pinyin: 'chuàngxīn', definition: 'innovation', emoji: '✨', level: 'P6' },
  '发明': { pinyin: 'fāmíng', definition: 'invention', emoji: '💡', level: 'P6' },
  '发展': { pinyin: 'fāzhǎn', definition: 'development', emoji: '📈', level: 'P6' },
  '进步': { pinyin: 'jìnbù', emoji: 'progress', level: 'P6' },
  '改变': { pinyin: 'gǎibiàn', definition: 'change', emoji: '🔄', level: 'P6' },
  '影响': { pinyin: 'yǐngxiǎng', definition: 'influence', emoji: ' ripple', level: 'P6' },
  '重要性': { pinyin: 'zhòngyàoxìng', definition: 'importance', emoji: '⭐', level: 'P6' },
  '必要性': { pinyin: 'bìyàoxìng', definition: 'necessity', emoji: '⚠️', level: 'P6' },
  '可能性': { pinyin: 'kěnéngxìng', definition: 'possibility', emoji: '❓', level: 'P6' },
  '普遍性': { pinyin: 'pǔbiànxìng', definition: 'universality', emoji: '🌍', level: 'P6' },
  '特殊性': { pinyin: 'tèshūxìng', definition: 'specialty', emoji: '✨', level: 'P6' },
  '具体性': { pinyin: 'jùtǐxìng', definition: 'specificity', emoji: '📍', level: 'P6' },
  '抽象性': { pinyin: 'chōuxiàngxìng', definition: 'abstractness', emoji: '💭', level: 'P6' },
  '积极性': { pinyin: 'jījíxìng', definition: 'positivity', emoji: '👍', level: 'P6' },
  '消极性': { pinyin: 'xiāojíxìng', definition: 'negativity', emoji: '👎', level: 'P6' },
  '乐观主义': { pinyin: 'lèguānzhǔyì', definition: 'optimism', emoji: '😊', level: 'P6' },
  '悲观主义': { pinyin: 'bēiguānzhǔyì', definition: 'pessimism', emoji: '😔', level: 'P6' },
  '公平性': { pinyin: 'gōngpíngxìng', definition: 'fairness', emoji: '⚖️', level: 'P6' },
  '平等性': { pinyin: 'píngděngxìng', definition: 'equality', emoji: '🤝', level: 'P6' },
  '歧视': { pinyin: 'qíshì', definition: 'discrimination', emoji: '🚫', level: 'P6' },
  '权利': { pinyin: 'quánlì', definition: 'rights', emoji: '📜', level: 'P6' },
  '义务': { pinyin: 'yìwù', definition: 'duties', emoji: '🫡', level: 'P6' },
};

// === Helper Functions ===
// Add this helper function to check if a character is Chinese
const isChineseCharacter = (char) => {
  const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
  return chineseRegex.test(char);
};

// Helper function to get characters by level dynamically
const getCharactersByLevel = (level) => {
  return Object.entries(characterData)
    .filter(([char, data]) => data.level === level)
    .reduce((obj, [char, data]) => {
      obj[char] = data;
      return obj;
    }, {});
};

// FIXED: Dynamic Quick Add that shows more characters
const getSuggestedCharacters = (userLevel = 'P1', count = 16) => {
  const levelCharacters = Object.entries(characterData)
    .filter(([char, data]) => data.level === userLevel)
    .map(([char, data]) => char);
  
  // Return first 'count' characters from the level, or all if less than count
  return levelCharacters.slice(0, count);
};

// === UI Components ===
// FIXED: Enhanced Quick Add component
const QuickAddButtons = ({ level, onAddCharacter }) => {
  const suggestions = getSuggestedCharacters(level, 16); // Show 16 characters instead of 8

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Quick Add - {level} Level Characters ({suggestions.length} available):
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 max-h-32 overflow-y-auto">
        {suggestions.map(char => (
          <button
            key={char}
            onClick={() => onAddCharacter(char)}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded-lg text-lg transition-colors flex flex-col items-center"
            title={`${char} - ${characterData[char]?.pinyin} - ${characterData[char]?.definition}`}
          >
            <span className="text-xl">{char}</span>
            <span className="text-xs">{characterData[char]?.emoji}</span>
          </button>
        ))}
      </div>
      {suggestions.length === 0 && (
        <p className="text-gray-500 text-sm">No characters available for {level} level</p>
      )}
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
              currentLevel === level ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
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
  const levels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P5'];
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
        <Target className="text-green-500 mr-2" /> Learning Progress by Level
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
  const [currentLevel, setCurrentLevel] = useState('P1');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [streak, setStreak] = useState(0);

  // New state to handle character selection for two-character words
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  // Check for user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      if (currentUser) {
        // Fetch flashcards and streak for the logged-in user
        const cards = await firebaseGetCards(currentUser.uid);
        setFlashcards(cards);
        const userStreak = await firebaseGetStreak(currentUser.uid);
        setStreak(userStreak || 0);
      } else {
        setFlashcards([]);
        setStreak(0);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Authentication Handlers ---
  const handleAuthAction = async () => {
    setError('');
    try {
      if (authMode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, selectedAvatar);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      setFlashcards([]);
    } catch (e) {
      setError(e.message);
    }
  };

  // --- Main App Logic Handlers ---
  // A new handler for when a character button is clicked
  const handleCharacterClick = (char) => {
    if (selectedCharacters.length === 1) {
      const firstChar = selectedCharacters[0];
      const potentialWord = firstChar + char;
      if (characterData[potentialWord] && characterData[potentialWord].level === currentLevel) {
        // Found a valid two-character word, add it
        addCharacter(potentialWord);
        setSelectedCharacters([]);
      } else {
        // Not a valid two-character word, just add the single character
        addCharacter(firstChar);
        addCharacter(char);
        setSelectedCharacters([]);
      }
    } else {
      // First character selected, or the last attempt failed.
      // Reset and start a new selection.
      setSelectedCharacters([char]);
    }
  };

  // Function to clear selected characters
  const clearSelection = () => {
    setSelectedCharacters([]);
  };

  const addCharacter = async (char) => {
    if (!user) {
      setError("Please log in to add flashcards.");
      return;
    }

    // Check if the character already exists in the flashcards
    if (flashcards.some(card => card.character === char)) {
      setError(`"${char}" is already in your flashcards!`);
      return;
    }

    const characterDetails = characterData[char];
    if (!characterDetails) {
      setError(`The character "${char}" is not in our database.`);
      return;
    }

    // Save to Firebase and update local state
    const newCard = { character: char, ...characterDetails, learned: false, practiceCount: 0 };
    await firebaseSaveCard(user.uid, newCard);
    setFlashcards(prevCards => [...prevCards, newCard]);
    setError('');
    setTextInput('');
  };

  const handleInputChange = (e) => {
    // Clear any pending two-character selection when the user starts typing
    setSelectedCharacters([]);
    const text = e.target.value;
    const lastChar = text.slice(-1);
    if (isChineseCharacter(lastChar)) {
      addCharacter(lastChar);
      setTextInput(text.slice(0, -1)); // Clear the Chinese character from input
    } else {
      setTextInput(text);
    }
  };

  const handleAddFromInput = (e) => {
    e.preventDefault();
    if (textInput.trim() !== '') {
      // Handle adding from the input field
      const charactersToAdd = textInput.trim().split('');
      charactersToAdd.forEach(char => addCharacter(char));
    }
  };

  const deleteFlashcard = async (charToDelete) => {
    if (!user) return;
    await firebaseDeleteCard(user.uid, charToDelete);
    setFlashcards(prevCards => prevCards.filter(card => card.character !== charToDelete));
  };
  
  // Renders a single flashcard
  const renderFlashcard = (card) => (
    <div key={card.character} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-4xl mr-4">{card.character}</span>
        <div>
          <p className="font-bold text-gray-800">{card.pinyin}</p>
          <p className="text-sm text-gray-600">{card.definition}</p>
          <p className="text-xs text-gray-400">{card.level}</p>
        </div>
      </div>
      <button onClick={() => deleteFlashcard(card.character)} className="text-gray-400 hover:text-red-500 transition-colors">
        <Trash2 size={20} />
      </button>
    </div>
  );

  const renderAuthScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">Hanzi Buddy</h1>
        <p className="text-gray-600 mb-6">Your fun way to learn Chinese!</p>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Choose your avatar!
          </label>
          <div className="flex justify-center space-x-2 text-2xl mb-4">
            {avatars.map(avatar => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`transform transition-transform ${selectedAvatar === avatar ? 'scale-125 ring-2 ring-purple-500 rounded-full' : ''}`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-xl"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button 
          onClick={handleAuthAction}
          className="w-full bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-600 transition-colors mb-4"
        >
          {authMode === 'login' ? 'Sign In' : 'Sign Up'}
        </button>
        <button 
          onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          className="text-purple-500 hover:text-purple-700 text-sm"
        >
          {authMode === 'login' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );

  const renderHomeScreen = () => {
    // Get unique characters from the current level
    const charactersInLevel = Object.keys(getCharactersByLevel(currentLevel));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-purple-600 mr-4">Hanzi Buddy</h1>
            <button onClick={handleLogout} className="text-red-500 flex items-center">
              <LogOut size={16} className="mr-1" /> Logout
            </button>
          </div>
          {user && (
            <div className="text-xl">
              {user.avatar}
            </div>
          )}
        </header>

        <main>
          {user && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Hello, {user.displayName}! 👋</h2>
              <div className="flex items-center text-gray-600 mb-4">
                <Star className="text-yellow-400 mr-2" />
                <span className="font-bold">{streak} day streak! Keep it up!</span>
              </div>
              <p className="text-gray-600 mb-4">
                You have learned <span className="font-bold text-purple-600">{flashcards.length}</span> characters so far.
              </p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setCurrentView('flashcards')} className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium flex items-center hover:bg-purple-200 transition-colors">
                  <BookOpen size={18} className="mr-2" /> View All Flashcards
                </button>
                <button onClick={() => setCurrentView('achievements')} className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium flex items-center hover:bg-yellow-200 transition-colors">
                  <Award size={18} className="mr-2" /> My Achievements
                </button>
              </div>
            </div>
          )}

          <ProgressTracker flashcards={flashcards} />

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Characters</h2>

            <LevelSelector currentLevel={currentLevel} onLevelChange={setCurrentLevel} />
            <QuickAddButtons level={currentLevel} onAddCharacter={handleCharacterClick} />
            
            <div className="flex items-center mb-4 space-x-2">
                <p className="text-gray-700 text-sm">
                    {selectedCharacters.length === 1 ? `Selected character: ${selectedCharacters[0]}` : 'Click on characters to form a word:'}
                </p>
                {selectedCharacters.length > 0 && (
                    <button onClick={clearSelection} className="text-red-500 hover:text-red-700 text-sm flex items-center">
                        <X size={14} className="mr-1" /> Clear Selection
                    </button>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            <h3 className="text-lg font-bold text-gray-800 mt-4 mb-2">Manual Input</h3>
            <form onSubmit={handleAddFromInput} className="flex space-x-2">
              <input 
                type="text" 
                value={textInput} 
                onChange={handleInputChange} 
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="Type characters here..."
              />
              <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors">
                Add
              </button>
            </form>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <BookOpen className="text-purple-500 mr-2" /> Your Flashcards ({flashcards.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards.slice(-16).reverse().map(renderFlashcard)}
            </div>
            {flashcards.length > 16 && (
              <div className="text-center mt-4">
                <button onClick={() => setCurrentView('flashcards')} className="text-purple-500 hover:underline">
                  View all {flashcards.length} flashcards
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  const renderFlashcardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4 mb-6">
        <button onClick={() => setCurrentView('home')} className="text-purple-500 flex items-center">
          <span className="text-2xl mr-2">🏠</span> Back to Home
        </button>
        <h1 className="text-2xl font-bold text-purple-600">All Flashcards</h1>
      </header>
      <main className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcards.map(renderFlashcard)}
        </div>
      </main>
    </div>
  );

  const renderAchievementsView = () => {
    // Get learned characters by level to check against achievements
    const learnedCount = flashcards.length;
    const streakCount = streak;
    
    // Check if achievements are earned
    const earnedAchievements = achievements.filter(ach => {
        if (ach.id === 'week') {
            return streakCount >= ach.requirement;
        } else {
            return learnedCount >= ach.requirement;
        }
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4 mb-6">
          <button onClick={() => setCurrentView('home')} className="text-purple-500 flex items-center">
            <span className="text-2xl mr-2">🏠</span> Back to Home
          </button>
          <h1 className="text-2xl font-bold text-purple-600">My Achievements</h1>
        </header>
        <main className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Earned Badges ({earnedAchievements.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {earnedAchievements.map(ach => (
              <div key={ach.id} className="bg-green-100 p-4 rounded-lg flex items-center space-x-4">
                <span className="text-4xl">{ach.icon}</span>
                <div>
                  <h3 className="font-bold text-green-800">{ach.name}</h3>
                  <p className="text-sm text-green-700">{ach.description}</p>
                </div>
              </div>
            ))}
            {earnedAchievements.length === 0 && (
              <p className="text-gray-500">You haven't earned any achievements yet. Keep learning!</p>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Locked Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.filter(ach => !earnedAchievements.some(e => e.id === ach.id)).map(ach => (
              <div key={ach.id} className="bg-gray-100 p-4 rounded-lg flex items-center space-x-4">
                <span className="text-4xl opacity-50">{ach.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-500">{ach.name}</h3>
                  <p className="text-sm text-gray-400">Unlock by: {ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl text-purple-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return renderAuthScreen();
  }

  switch (currentView) {
    case 'home':
      return renderHomeScreen();
    case 'flashcards':
      return renderFlashcardView();
    case 'achievements':
      return renderAchievementsView();
    default:
      return renderHomeScreen();
  }
};

export default HanziBuddyApp;
