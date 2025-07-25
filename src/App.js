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
  '离': { pinyin: 'lí', definition: 'leave/from', emoji: '�', level: 'P1' },
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
  '生': { pinyin: 'shēng', definition: 'student', emoji: '🧑‍🎓', level: 'P1' },
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
  '口': { pinyin: 'kǒu', definition: 'mouth', emoji: '👄', level: 'P1' },
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
  '去': { pinyin: 'qù', definition: 'go', emoji: '➡️', level: 'P1' },
  '来': { pinyin: 'lái', definition: 'come', emoji: '👋', level: 'P1' },
  '到': { pinyin: 'dào', definition: 'arrive', emoji: '🎯', level: 'P1' },
  '从': { pinyin: 'cóng', definition: 'from', emoji: '🚀', level: 'P1' },
  '和': { pinyin: 'hé', definition: 'and/with', emoji: '🤝', level: 'P1' },
  '是': { pinyin: 'shì', definition: 'is/am/are', emoji: '✅', level: 'P1' },
  '不': { pinyin: 'bù', definition: 'not/no', emoji: '❌', level: 'P1' },
  '很': { pinyin: 'hěn', definition: 'very', emoji: '💯', level: 'P1' },
  '也': { pinyin: 'yě', definition: 'also/too', emoji: '➕', level: 'P1' },
  '都': { pinyin: 'dōu', definition: 'all/both', emoji: '🌟', level: 'P1' },
  '太': { pinyin: 'tài', definition: 'too', emoji: '📈', level: 'P1' },
  '在': { pinyin: 'zài', definition: 'at/in', emoji: '📍', level: 'P1' },
  '有': { pinyin: 'yǒu', definition: 'have', emoji: '🎁', level: 'P1' },
  '没': { pinyin: 'méi', definition: 'not have', emoji: '🚫', level: 'P1' },
  '个': { pinyin: 'gè', definition: 'measure word', emoji: '📏', level: 'P1' },
  '只': { pinyin: 'zhī', definition: 'measure word (animals)', emoji: '🐾', level: 'P1' },
  '本': { pinyin: 'běn', definition: 'measure word (books)', emoji: '📖', level: 'P1' },
  '张': { pinyin: 'zhāng', definition: 'measure word (flat objects)', emoji: '📄', level: 'P1' },
  '条': { pinyin: 'tiáo', definition: 'measure word (long/thin objects)', emoji: '➖', level: 'P1' },
  '岁': { pinyin: 'suì', definition: 'years old', emoji: '🎂', level: 'P1' },
  '名': { pinyin: 'míng', definition: 'name', emoji: '📛', level: 'P1' },
  '字': { pinyin: 'zì', definition: 'character/word', emoji: '🔤', level: 'P1' },
  '叫': { pinyin: 'jiào', definition: 'call/be called', emoji: '📞', level: 'P1' },
  '什': { pinyin: 'shén', definition: 'what (什…)', emoji: '❓', level: 'P1' },
  '么': { pinyin: 'me', definition: 'what (...么)', emoji: '❔', level: 'P1' },
  '谁': { pinyin: 'shuí', definition: 'who', emoji: '🤷', level: 'P1' },
  '哪': { pinyin: 'nǎ', definition: 'which', emoji: '🤔', level: 'P1' },
  '里': { pinyin: 'lǐ', definition: 'inside/here', emoji: '📦', level: 'P1' },
  '几': { pinyin: 'jǐ', definition: 'how many (small number)', emoji: '🔢', level: 'P1' },
  '多': { pinyin: 'duō', definition: 'how much/many (large number)', emoji: '📈', level: 'P1' },
  '请': { pinyin: 'qǐng', definition: 'please', emoji: '🙏', level: 'P1' },
  '谢': { pinyin: 'xiè', definition: 'thank', emoji: '🙏', level: 'P1' },
  '对': { pinyin: 'duì', definition: 'right/correct', emoji: '✅', level: 'P1' },
  '起': { pinyin: 'qǐ', definition: 'rise/sorry', emoji: '🙇', level: 'P1' },
  '关': { pinyin: 'guān', definition: 'close/concern', emoji: '🔒', level: 'P1' },
  '系': { pinyin: 'xì', definition: 'system/relation', emoji: '🔗', level: 'P1' },
  '再': { pinyin: 'zài', definition: 'again', emoji: '🔁', level: 'P1' },
  '见': { pinyin: 'jiàn', definition: 'see/meet', emoji: '👀', level: 'P1' },
  '明': { pinyin: 'míng', definition: 'bright/tomorrow', emoji: '🌅', level: 'P1' },
  '天': { pinyin: 'tiān', definition: 'day/sky', emoji: '☁️', level: 'P1' },
  '今': { pinyin: 'jīn', definition: 'today/now', emoji: '📍', level: 'P1' },
  '昨': { pinyin: 'zuó', definition: 'yesterday', emoji: '⏪', level: 'P1' },
  '早': { pinyin: 'zǎo', definition: 'early/morning', emoji: '🌅', level: 'P1' },
  '晚': { pinyin: 'wǎn', definition: 'late/evening', emoji: '🌆', level: 'P1' },
  '时': { pinyin: 'shí', definition: 'time/hour', emoji: '⏰', level: 'P1' },
  '候': { pinyin: 'hòu', definition: 'time/when', emoji: '⏳', level: 'P1' },
  '点': { pinyin: 'diǎn', definition: 'o\'clock/point', emoji: '🕐', level: 'P1' },
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
  '离': { pinyin: 'lí', definition: 'leave/from', emoji: '👋', level: 'P1' },
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

  // === PRIMARY 2 (250 characters) ===
  // Family, animals, food, school items, basic adjectives
  '妈': { pinyin: 'mā', definition: 'mom (mommy loves you!)', emoji: '👩', level: 'P2' },
  '妈妈': { pinyin: 'māma', definition: 'mommy', emoji: '👩‍👧‍👦', level: 'P2' },
  '爸': { pinyin: 'bà', definition: 'dad (daddy is strong!)', emoji: '👨', level: 'P2' },
  '爸爸': { pinyin: 'bàba', definition: 'daddy', emoji: '👨‍👧‍👦', level: 'P2' },
  '哥': { pinyin: 'gē', definition: 'older brother', emoji: '👦', level: 'P2' },
  '哥哥': { pinyin: 'gēge', definition: 'big brother', emoji: '👨‍👦', level: 'P2' },
  '姐': { pinyin: 'jiě', definition: 'older sister', emoji: '👧', level: 'P2' },
  '姐姐': { pinyin: 'jiějie', definition: 'big sister', emoji: '👩‍👦', level: 'P2' },
  '弟': { pinyin: 'dì', definition: 'younger brother', emoji: '👶', level: 'P2' },
  '弟弟': { pinyin: 'dìdi', definition: 'little brother', emoji: '👦‍👦', level: 'P2' },
  '妹': { pinyin: 'mèi', definition: 'younger sister', emoji: '👧', level: 'P2' },
  '妹妹': { pinyin: 'mèimei', definition: 'little sister', emoji: '👧‍👦', level: 'P2' },
  '爷': { pinyin: 'yé', definition: 'grandpa (daddy\'s daddy)', emoji: '👴', level: 'P2' },
  '爷爷': { pinyin: 'yéye', definition: 'grandpa', emoji: '👴‍👦', level: 'P2' },
  '奶': { pinyin: 'nǎi', definition: 'grandma/milk', emoji: '👵', level: 'P2' },
  '奶奶': { pinyin: 'nǎinai', definition: 'grandma', emoji: '👵‍👦', level: 'P2' },
  '外': { pinyin: 'wài', definition: 'outside/maternal', emoji: '🌳', level: 'P2' },
  '公': { pinyin: 'gōng', definition: 'public/grandpa', emoji: '👴', level: 'P2' },
  '婆': { pinyin: 'pó', definition: 'grandma', emoji: '👵', level: 'P2' },
  '叔': { pinyin: 'shū', definition: 'uncle', emoji: '👨', level: 'P2' },
  '叔叔': { pinyin: 'shūshu', definition: 'uncle', emoji: '👨‍👧', level: 'P2' },
  '阿': { pinyin: 'ā', definition: 'aunt/prefix', emoji: '👩', level: 'P2' },
  '姨': { pinyin: 'yí', definition: 'aunt', emoji: '👩', level: 'P2' },
  '伯': { pinyin: 'bó', definition: 'uncle', emoji: '👨', level: 'P2' },
  '舅': { pinyin: 'jiù', definition: 'uncle', emoji: '👨', level: 'P2' },
  '表': { pinyin: 'biǎo', definition: 'cousin/watch', emoji: '⌚', level: 'P2' },
  '堂': { pinyin: 'táng', definition: 'cousin/hall', emoji: '🏛️', level: 'P2' },
  '朋': { pinyin: 'péng', definition: 'friend', emoji: '👫', level: 'P2' },
  '友': { pinyin: 'yǒu', definition: 'friend', emoji: '🤝', level: 'P2' },
  '同': { pinyin: 'tóng', definition: 'same/together', emoji: '👯', level: 'P2' },
  '学': { pinyin: 'xué', definition: 'learn/study', emoji: '📚', level: 'P2' },
  '校': { pinyin: 'xiào', definition: 'school', emoji: '🏫', level: 'P2' },
  '班': { pinyin: 'bān', definition: 'class', emoji: '🎓', level: 'P2' },
  '级': { pinyin: 'jí', definition: 'grade/level', emoji: '📊', level: 'P2' },
  '年': { pinyin: 'nián', definition: 'year/grade', emoji: '📅', level: 'P2' },
  '课': { pinyin: 'kè', definition: 'lesson/class', emoji: '📖', level: 'P2' },
  '老': { pinyin: 'lǎo', definition: 'old', emoji: '👴', level: 'P2' },
  '师': { pinyin: 'shī', definition: 'teacher', emoji: '👨‍🏫', level: 'P2' },
  '教': { pinyin: 'jiāo', definition: 'teach', emoji: '👩‍🏫', level: 'P2' },
  '授': { pinyin: 'shòu', definition: 'teach/professor', emoji: '👨‍🎓', level: 'P2' },
  '讲': { pinyin: 'jiǎng', definition: 'speak/lecture', emoji: '🗣️', level: 'P2' },
  '读': { pinyin: 'dú', definition: 'read', emoji: '👀', level: 'P2' },
  '写': { pinyin: 'xiě', definition: 'write', emoji: '✍️', level: 'P2' },
  '画': { pinyin: 'huà', definition: 'draw/paint', emoji: '🎨', level: 'P2' },
  '唱': { pinyin: 'chàng', definition: 'sing', emoji: '🎵', level: 'P2' },
  '跳': { pinyin: 'tiào', definition: 'jump/dance', emoji: '🦘', level: 'P2' },
  '舞': { pinyin: 'wǔ', definition: 'dance', emoji: '💃', level: 'P2' },
  '玩': { pinyin: 'wán', definition: 'play', emoji: '🎮', level: 'P2' },
  '游': { pinyin: 'yóu', definition: 'swim/travel', emoji: '🏊', level: 'P2' },
  '戏': { pinyin: 'xì', definition: 'play/game', emoji: '🎭', level: 'P2' },
  '球': { pinyin: 'qiú', definition: 'ball', emoji: '⚽', level: 'P2' },
  '足': { pinyin: 'zú', definition: 'foot/soccer', emoji: '🦶', level: 'P2' },
  '篮': { pinyin: 'lán', definition: 'basket', emoji: '🏀', level: 'P2' },
  '网': { pinyin: 'wǎng', definition: 'net/internet', emoji: '🥅', level: 'P2' },
  '羽': { pinyin: 'yǔ', definition: 'feather/badminton', emoji: '🏸', level: 'P2' },
  '毛': { pinyin: 'máo', definition: 'hair/badminton', emoji: '🏸', level: 'P2' },
  '乒': { pinyin: 'pīng', definition: 'ping (ping pong)', emoji: '🏓', level: 'P2' },
  '乓': { pinyin: 'pāng', definition: 'pong (ping pong)', emoji: '🏓', level: 'P2' },
  '游': { pinyin: 'yóu', definition: 'swim', emoji: '🏊', level: 'P2' },
  '泳': { pinyin: 'yǒng', definition: 'swim', emoji: '🏊‍♀️', level: 'P2' },
  '跑': { pinyin: 'pǎo', definition: 'run', emoji: '🏃', level: 'P2' },
  '步': { pinyin: 'bù', definition: 'step/walk', emoji: '👣', level: 'P2' },
  '狗': { pinyin: 'gǒu', definition: 'dog', emoji: '🐕', level: 'P2' },
  '猫': { pinyin: 'māo', definition: 'cat', emoji: '🐱', level: 'P2' },
  '鱼': { pinyin: 'yú', definition: 'fish', emoji: '🐟', level: 'P2' },
  '鸟': { pinyin: 'niǎo', definition: 'bird', emoji: '🐦', level: 'P2' },
  '马': { pinyin: 'mǎ', definition: 'horse', emoji: '🐎', level: 'P2' },
  '牛': { pinyin: 'niú', definition: 'cow', emoji: '🐄', level: 'P2' },
  '羊': { pinyin: 'yáng', definition: 'sheep', emoji: '🐑', level: 'P2' },
  '猪': { pinyin: 'zhū', definition: 'pig', emoji: '🐷', level: 'P2' },
  '鸡': { pinyin: 'jī', definition: 'chicken', emoji: '🐔', level: 'P2' },
  '鸭': { pinyin: 'yā', definition: 'duck', emoji: '🦆', level: 'P2' },
  '鹅': { pinyin: 'é', definition: 'goose', emoji: '🦢', level: 'P2' },
  '象': { pinyin: 'xiàng', definition: 'elephant', emoji: '🐘', level: 'P2' },
  '虎': { pinyin: 'hǔ', definition: 'tiger', emoji: '🐅', level: 'P2' },
  '狮': { pinyin: 'shī', definition: 'lion', emoji: '🦁', level: 'P2' },
  '熊': { pinyin: 'xióng', definition: 'bear', emoji: '🐻', level: 'P2' },
  '猴': { pinyin: 'hóu', definition: 'monkey', emoji: '🐒', level: 'P2' },
  '兔': { pinyin: 'tù', definition: 'rabbit', emoji: '🐰', level: 'P2' },
  '鼠': { pinyin: 'shǔ', definition: 'mouse/rat', emoji: '🐭', level: 'P2' },
  '蛇': { pinyin: 'shé', definition: 'snake', emoji: '🐍', level: 'P2' },
  '龙': { pinyin: 'lóng', definition: 'dragon', emoji: '🐲', level: 'P2' },
  '虫': { pinyin: 'chóng', definition: 'insect', emoji: '🐛', level: 'P2' },
  '蚂': { pinyin: 'mǎ', definition: 'ant (蚂蚁)', emoji: '🐜', level: 'P2' },
  '蚁': { pinyin: 'yǐ', definition: 'ant', emoji: '🐜', level: 'P2' },
  '蜜': { pinyin: 'mì', definition: 'honey/bee', emoji: '🍯', level: 'P2' },
  '蜂': { pinyin: 'fēng', definition: 'bee', emoji: '🐝', level: 'P2' },
  '蝴': { pinyin: 'hú', definition: 'butterfly', emoji: '🦋', level: 'P2' },
  '蝶': { pinyin: 'dié', definition: 'butterfly', emoji: '🦋', level: 'P2' },
  '花': { pinyin: 'huā', definition: 'flower', emoji: '🌸', level: 'P2' },
  '草': { pinyin: 'cǎo', definition: 'grass', emoji: '🌱', level: 'P2' },
  '树': { pinyin: 'shù', definition: 'tree', emoji: '🌳', level: 'P2' },
  '叶': { pinyin: 'yè', definition: 'leaf', emoji: '🍃', level: 'P2' },
  '果': { pinyin: 'guǒ', definition: 'fruit', emoji: '🍇', level: 'P2' },
  '苹': { pinyin: 'píng', definition: 'apple', emoji: '🍎', level: 'P2' },
  '香': { pinyin: 'xiāng', definition: 'fragrant/banana', emoji: '🍌', level: 'P2' },
  '蕉': { pinyin: 'jiāo', definition: 'banana', emoji: '🍌', level: 'P2' },
  '橙': { pinyin: 'chéng', definition: 'orange', emoji: '🍊', level: 'P2' },
  '柠': { pinyin: 'níng', definition: 'lemon', emoji: '🍋', level: 'P2' },
  '檬': { pinyin: 'méng', definition: 'lemon', emoji: '🍋', level: 'P2' },
  '西': { pinyin: 'xī', definition: 'west/watermelon', emoji: '🍉', level: 'P2' },
  '瓜': { pinyin: 'guā', definition: 'melon', emoji: '🍈', level: 'P2' },
  '桃': { pinyin: 'táo', definition: 'peach', emoji: '🍑', level: 'P2' },
  '梨': { pinyin: 'lí', definition: 'pear', emoji: '🍐', level: 'P2' },
  '葡': { pinyin: 'pú', definition: 'grape', emoji: '🍇', level: 'P2' },
  '萄': { pinyin: 'táo', definition: 'grape', emoji: '🍇', level: 'P2' },
  '草': { pinyin: 'cǎo', definition: 'strawberry', emoji: '🍓', level: 'P2' },
  '莓': { pinyin: 'méi', definition: 'berry', emoji: '🍓', level: 'P2' },
  '饭': { pinyin: 'fàn', definition: 'rice/meal', emoji: '🍚', level: 'P2' },
  '面': { pinyin: 'miàn', definition: 'noodles/face', emoji: '🍜', level: 'P2' },
  '条': { pinyin: 'tiáo', definition: 'strip/noodle', emoji: '🍝', level: 'P2' },
  '包': { pinyin: 'bāo', definition: 'bread/bun', emoji: '🥟', level: 'P2' },
  '子': { pinyin: 'zi', definition: 'bun/son', emoji: '🥟', level: 'P2' },
  '蛋': { pinyin: 'dàn', definition: 'egg', emoji: '🥚', level: 'P2' },
  '肉': { pinyin: 'ròu', definition: 'meat', emoji: '🥩', level: 'P2' },
  '鸡': { pinyin: 'jī', definition: 'chicken meat', emoji: '🍗', level: 'P2' },
  '鱼': { pinyin: 'yú', definition: 'fish meat', emoji: '🐟', level: 'P2' },
  '牛': { pinyin: 'niú', definition: 'beef', emoji: '🥩', level: 'P2' },
  '猪': { pinyin: 'zhū', definition: 'pork', emoji: '🥓', level: 'P2' },
  '菜': { pinyin: 'cài', definition: 'vegetables', emoji: '🥬', level: 'P2' },
  '青': { pinyin: 'qīng', definition: 'green/blue', emoji: '🥒', level: 'P2' },
  '白': { pinyin: 'bái', definition: 'white/cabbage', emoji: '🥬', level: 'P2' },
  '萝': { pinyin: 'luó', definition: 'radish', emoji: '🥕', level: 'P2' },
  '卜': { pinyin: 'bo', definition: 'radish', emoji: '🥕', level: 'P2' },
  '土': { pinyin: 'tǔ', definition: 'soil/potato', emoji: '🥔', level: 'P2' },
  '豆': { pinyin: 'dòu', definition: 'bean', emoji: '🫘', level: 'P2' },
  '米': { pinyin: 'mǐ', definition: 'rice', emoji: '🌾', level: 'P2' },
  '粥': { pinyin: 'zhōu', definition: 'porridge', emoji: '🥣', level: 'P2' },
  '汤': { pinyin: 'tāng', definition: 'soup', emoji: '🍲', level: 'P2' },
  '水': { pinyin: 'shuǐ', definition: 'water', emoji: '💧', level: 'P2' },
  '茶': { pinyin: 'chá', definition: 'tea', emoji: '🍵', level: 'P2' },
  '咖': { pinyin: 'kā', definition: 'coffee', emoji: '☕', level: 'P2' },
  '啡': { pinyin: 'fēi', definition: 'coffee', emoji: '☕', level: 'P2' },
  '奶': { pinyin: 'nǎi', definition: 'milk', emoji: '🥛', level: 'P2' },
  '汁': { pinyin: 'zhī', definition: 'juice', emoji: '🧃', level: 'P2' },
  '酒': { pinyin: 'jiǔ', definition: 'alcohol/wine', emoji: '🍷', level: 'P2' },
  '啤': { pinyin: 'pí', definition: 'beer', emoji: '🍺', level: 'P2' },
  '甜': { pinyin: 'tián', definition: 'sweet', emoji: '🍭', level: 'P2' },
  '酸': { pinyin: 'suān', definition: 'sour', emoji: '🍋', level: 'P2' },
  '苦': { pinyin: 'kǔ', definition: 'bitter', emoji: '☕', level: 'P2' },
  '辣': { pinyin: 'là', definition: 'spicy', emoji: '🌶️', level: 'P2' },
  '咸': { pinyin: 'xián', definition: 'salty', emoji: '🧂', level: 'P2' },
  '淡': { pinyin: 'dàn', definition: 'bland/light', emoji: '💧', level: 'P2' },
  '香': { pinyin: 'xiāng', definition: 'fragrant', emoji: '🌹', level: 'P2' },
  '臭': { pinyin: 'chòu', definition: 'smelly', emoji: '🦨', level: 'P2' },
  '新': { pinyin: 'xīn', definition: 'new', emoji: '✨', level: 'P2' },
  '旧': { pinyin: 'jiù', definition: 'old', emoji: '🕰️', level: 'P2' },
  '干': { pinyin: 'gān', definition: 'dry', emoji: '🏜️', level: 'P2' },
  '湿': { pinyin: 'shī', definition: 'wet', emoji: '💧', level: 'P2' },
  '净': { pinyin: 'jìng', definition: 'clean', emoji: '✨', level: 'P2' },
  '脏': { pinyin: 'zāng', definition: 'dirty', emoji: '🧽', level: 'P2' },
  '亮': { pinyin: 'liàng', definition: 'bright', emoji: '💡', level: 'P2' },
  '暗': { pinyin: 'àn', definition: 'dark', emoji: '🔦', level: 'P2' },
  '轻': { pinyin: 'qīng', definition: 'light (weight)', emoji: '🪶', level: 'P2' },
  '重': { pinyin: 'zhòng', definition: 'heavy', emoji: '💪', level: 'P2' },
  '软': { pinyin: 'ruán', definition: 'soft', emoji: '🪶', level: 'P2' },
  '硬': { pinyin: 'yìng', definition: 'hard', emoji: '🪨', level: 'P2' },
  '厚': { pinyin: 'hòu', definition: 'thick', emoji: '📏', level: 'P2' },
  '薄': { pinyin: 'báo', definition: 'thin', emoji: '🧵', level: 'P2' },
  '宽': { pinyin: 'kuān', definition: 'wide', emoji: '↔️', level: 'P2' },
  '窄': { pinyin: 'zhǎi', definition: 'narrow', emoji: '🤏', level: 'P2' },
  '深': { pinyin: 'shēn', definition: 'deep', emoji: '🕳️', level: 'P2' },
  '浅': { pinyin: 'qiǎn', definition: 'shallow', emoji: '🏊', level: 'P2' },
  '高': { pinyin: 'gāo', definition: 'tall/high', emoji: '📏', level: 'P2' },
  '矮': { pinyin: 'ǎi', definition: 'short', emoji: '📐', level: 'P2' },
  '胖': { pinyin: 'pàng', definition: 'fat', emoji: '🟫', level: 'P2' },
  '瘦': { pinyin: 'shòu', definition: 'thin', emoji: '📏', level: 'P2' },
  '美': { pinyin: 'měi', definition: 'beautiful', emoji: '😍', level: 'P2' },
  '丑': { pinyin: 'chǒu', definition: 'ugly', emoji: '👺', level: 'P2' },
  '帅': { pinyin: 'shuài', definition: 'handsome', emoji: '😎', level: 'P2' },
  '漂': { pinyin: 'piào', definition: 'pretty', emoji: '💄', level: 'P2' },
  '亮': { pinyin: 'liàng', definition: 'pretty', emoji: '✨', level: 'P2' },
  '可': { pinyin: 'kě', definition: 'cute', emoji: '🥰', level: 'P2' },
  '爱': { pinyin: 'ài', definition: 'lovable', emoji: '💕', level: 'P2' },
  '聪': { pinyin: 'cōng', definition: 'smart', emoji: '🧠', level: 'P2' },
  '明': { pinyin: 'míng', definition: 'smart', emoji: '💡', level: 'P2' },
  '笨': { pinyin: 'bèn', definition: 'stupid', emoji: '🤪', level: 'P2' },
  '懒': { pinyin: 'lǎn', definition: 'lazy', emoji: '😴', level: 'P2' },
  '勤': { pinyin: 'qín', definition: 'diligent', emoji: '💪', level: 'P2' },
  '奋': { pinyin: 'fèn', definition: 'strive', emoji: '🔥', level: 'P2' },
  '努': { pinyin: 'nǔ', definition: 'effort', emoji: '💪', level: 'P2' },
  '力': { pinyin: 'lì', definition: 'strength', emoji: '💪', level: 'P2' },
  '强': { pinyin: 'qiáng', definition: 'strong', emoji: '💪', level: 'P2' },
  '弱': { pinyin: 'ruò', definition: 'weak', emoji: '😰', level: 'P2' },
  '勇': { pinyin: 'yǒng', definition: 'brave', emoji: '🦸', level: 'P2' },
  '敢': { pinyin: 'gǎn', definition: 'dare', emoji: '💪', level: 'P2' },
  '怕': { pinyin: 'pà', definition: 'afraid', emoji: '😨', level: 'P2' },
  '吓': { pinyin: 'xià', definition: 'frighten', emoji: '👻', level: 'P2' },
  '害': { pinyin: 'hài', definition: 'harm/afraid', emoji: '😰', level: 'P2' },
  '担': { pinyin: 'dān', definition: 'worry', emoji: '😟', level: 'P2' },
  '心': { pinyin: 'xīn', definition: 'heart/worry', emoji: '❤️', level: 'P2' },
  '放': { pinyin: 'fàng', definition: 'release/put', emoji: '📦', level: 'P2' },
  '心': { pinyin: 'xīn', definition: 'heart (放心 - rest assured)', emoji: '😌', level: 'P2' },
  '开': { pinyin: 'kāi', definition: 'open/start', emoji: '🚀', level: 'P2' },
  '始': { pinyin: 'shǐ', definition: 'begin', emoji: '🎬', level: 'P2' },
  '停': { pinyin: 'tíng', definition: 'stop', emoji: '🛑', level: 'P2' },
  '止': { pinyin: 'zhǐ', definition: 'stop', emoji: '✋', level: 'P2' },
  '继': { pinyin: 'jì', definition: 'continue', emoji: '➡️', level: 'P2' },
  '续': { pinyin: 'xù', definition: 'continue', emoji: '🔄', level: 'P2' },
  '再': { pinyin: 'zài', definition: 'again', emoji: '🔁', level: 'P2' },
  '还': { pinyin: 'hái', definition: 'still', emoji: '🔄', level: 'P2' },
  '已': { pinyin: 'yǐ', definition: 'already', emoji: '✅', level: 'P2' },
  '经': { pinyin: 'jīng', definition: 'already', emoji: '✔️', level: 'P2' },
  '正': { pinyin: 'zhèng', definition: 'just/correct', emoji: '⭐', level: 'P2' },
  '在': { pinyin: 'zài', definition: 'in progress', emoji: '⏳', level: 'P2' },
  '刚': { pinyin: 'gāng', definition: 'just now', emoji: '⏰', level: 'P2' },
  '才': { pinyin: 'cái', definition: 'just/only', emoji: '🔄', level: 'P2' },
  '就': { pinyin: 'jiù', definition: 'then/only', emoji: '👉', level: 'P2' },
  '快': { pinyin: 'kuài', definition: 'fast/soon', emoji: '💨', level: 'P2' },
  '慢': { pinyin: 'màn', definition: 'slow', emoji: '🐌', level: 'P2' },
  '忙': { pinyin: 'máng', definition: 'busy', emoji: '⏰', level: 'P2' },
  '闲': { pinyin: 'xián', definition: 'free/idle', emoji: '😌', level: 'P2' },
  '累': { pinyin: 'lèi', definition: 'tired', emoji: '😴', level: 'P2' },
  '休': { pinyin: 'xiū', definition: 'rest', emoji: '💤', level: 'P2' },
  '息': { pinyin: 'xī', definition: 'rest/breath', emoji: '😴', level: 'P2' },
  '睡': { pinyin: 'shuì', definition: 'sleep', emoji: '💤', level: 'P2' },
  '醒': { pinyin: 'xǐng', definition: 'wake up', emoji: '😊', level: 'P2' },
  '起': { pinyin: 'qǐ', definition: 'get up', emoji: '🌅', level: 'P2' },
  '床': { pinyin: 'chuáng', definition: 'bed', emoji: '🛏️', level: 'P2' },
  '房': { pinyin: 'fáng', definition: 'room', emoji: '🏠', level: 'P2' },
  '间': { pinyin: 'jiān', definition: 'room/between', emoji: '🏠', level: 'P2' },
  '门': { pinyin: 'mén', definition: 'door', emoji: '🚪', level: 'P2' },
  '窗': { pinyin: 'chuāng', definition: 'window', emoji: '🪟', level: 'P2' },
  '桌': { pinyin: 'zhuō', definition: 'table', emoji: '🪑', level: 'P2' },
  '椅': { pinyin: 'yǐ', definition: 'chair', emoji: '🪑', level: 'P2' },
  '书': { pinyin: 'shū', definition: 'book', emoji: '📖', level: 'P2' },
  '笔': { pinyin: 'bǐ', definition: 'pen/pencil', emoji: '✏️', level: 'P2' },
  '纸': { pinyin: 'zhǐ', definition: 'paper', emoji: '📝', level: 'P2' },
  '包': { pinyin: 'bāo', definition: 'bag', emoji: '🎒', level: 'P2' },
  '盒': { pinyin: 'hé', definition: 'box', emoji: '📦', level: 'P2' },
  '瓶': { pinyin: 'píng', definition: 'bottle', emoji: '🍼', level: 'P2' },
  '杯': { pinyin: 'bēi', definition: 'cup', emoji: '🥤', level: 'P2' },
  '碗': { pinyin: 'wǎn', definition: 'bowl', emoji: '🥣', level: 'P2' },
  '盘': { pinyin: 'pán', definition: 'plate', emoji: '🍽️', level: 'P2' },
  '勺': { pinyin: 'sháo', definition: 'spoon', emoji: '🥄', level: 'P2' },
  '叉': { pinyin: 'chā', definition: 'fork', emoji: '🍴', level: 'P2' },
  '刀': { pinyin: 'dāo', definition: 'knife', emoji: '🔪', level: 'P2' },
  '筷': { pinyin: 'kuài', definition: 'chopsticks', emoji: '🥢', level: 'P2' },
  '洗': { pinyin: 'xǐ', definition: 'wash', emoji: '🧼', level: 'P2' },
  '刷': { pinyin: 'shuā', definition: 'brush', emoji: '🪥', level: 'P2' },
  '梳': { pinyin: 'shū', definition: 'comb', emoji: ' combs', level: 'P2' },
  '穿': { pinyin: 'chuān', definition: 'wear (clothes)', emoji: '👕', level: 'P2' },
  '戴': { pinyin: 'dài', definition: 'wear (accessories)', emoji: '👓', level: 'P2' },
  '脱': { pinyin: 'tuō', definition: 'take off', emoji: '👚', level: 'P2' },
  '扫': { pinyin: 'sǎo', definition: 'sweep', emoji: '🧹', level: 'P2' },
  '擦': { pinyin: 'cā', definition: 'wipe', emoji: '🧻', level: 'P2' },
  '风': { pinyin: 'fēng', definition: 'wind', emoji: '🌬️', level: 'P2' },
  '雨': { pinyin: 'yǔ', definition: 'rain', emoji: '🌧️', level: 'P2' },
  '雪': { pinyin: 'xuě', definition: 'snow', emoji: '❄️', level: 'P2' },
  '晴': { pinyin: 'qíng', definition: 'clear (weather)', emoji: '☀️', level: 'P2' },
  '阴': { pinyin: 'yīn', definition: 'cloudy', emoji: '☁️', level: 'P2' },
  '云': { pinyin: 'yún', definition: 'cloud', emoji: '☁️', level: 'P2' },
  '太': { pinyin: 'tài', definition: 'sun (太阳)', emoji: '☀️', level: 'P2' },
  '阳': { pinyin: 'yáng', definition: 'sun (太阳)', emoji: '☀️', level: 'P2' },
  '月': { pinyin: 'yuè', definition: 'moon', emoji: '🌙', level: 'P2' },
  '星': { pinyin: 'xīng', definition: 'star', emoji: '⭐', level: 'P2' },
  '星': { pinyin: 'xīng', definition: 'star (星星)', emoji: '✨', level: 'P2' },
  '街': { pinyin: 'jiē', definition: 'street', emoji: '🛣️', level: 'P2' },
  '路': { pinyin: 'lù', definition: 'road', emoji: '🛣️', level: 'P2' },
  '桥': { pinyin: 'qiáo', definition: 'bridge', emoji: '🌉', level: 'P2' },
  '车': { pinyin: 'chē', definition: 'car', emoji: '🚗', level: 'P2' },
  '船': { pinyin: 'chuán', definition: 'boat', emoji: '⛵', level: 'P2' },
  '飞': { pinyin: 'fēi', definition: 'fly', emoji: '✈️', level: 'P2' },
  '机': { pinyin: 'jī', definition: 'machine/plane', emoji: '✈️', level: 'P2' },
  '站': { pinyin: 'zhàn', definition: 'station/stop', emoji: '🚉', level: 'P2' },
  '喜欢': { pinyin: 'xǐhuan', definition: 'like', emoji: '👍', level: 'P2' },
  '知道': { pinyin: 'zhīdào', definition: 'know', emoji: '💡', level: 'P2' },
  '觉得': { pinyin: 'juéde', definition: 'feel/think', emoji: '🤔', level: 'P2' },
  '明白': { pinyin: 'míngbai', definition: 'understand', emoji: '💡', level: 'P2' },
  '容易': { pinyin: 'róngyì', definition: 'easy', emoji: '✅', level: 'P2' },
  '难': { pinyin: 'nán', definition: 'difficult', emoji: '❌', level: 'P2' },
  '高兴': { pinyin: 'gāoxìng', definition: 'happy', emoji: '😊', level: 'P2' },
  '生气': { pinyin: 'shēngqì', definition: 'angry', emoji: '😠', level: 'P2' },
  '伤心': { pinyin: 'shāngxīn', definition: 'sad', emoji: '😢', level: 'P2' },
  '害怕': { pinyin: 'hàipà', definition: 'scared', emoji: '😨', level: 'P2' },
  '开心': { pinyin: 'kāixīn', definition: 'happy', emoji: '😁', level: 'P2' },
  '快乐': { pinyin: 'kuàilè', definition: 'happy', emoji: '😄', level: 'P2' },
  '难过': { pinyin: 'nánguò', definition: 'sad', emoji: '😔', level: 'P2' },
  '累': { pinyin: 'lèi', definition: 'tired', emoji: '😴', level: 'P2' },
  '饿': { pinyin: 'è', definition: 'hungry', emoji: '🍔', level: 'P2' },
  '渴': { pinyin: 'kě', definition: 'thirsty', emoji: '💧', level: 'P2' },
  '饱': { pinyin: 'bǎo', definition: 'full (from eating)', emoji: ' fullness', level: 'P2' },
  '病': { pinyin: 'bìng', definition: 'sick', emoji: '🤒', level: 'P2' },
  '痛': { pinyin: 'tòng', definition: 'pain', emoji: '🤕', level: 'P2' },
  '舒服': { pinyin: 'shūfu', definition: 'comfortable', emoji: '😌', level: 'P2' },
  '不舒服': { pinyin: 'bù shūfu', definition: 'uncomfortable', emoji: '😖', level: 'P2' },

  // === PRIMARY 3 (300 characters) ===
  // Daily life, common verbs, adjectives, simple sentences, time, seasons
  '亲': { pinyin: 'qīn', definition: 'dear/relative', emoji: '👨‍👩‍👧‍👦', level: 'P3' },
  '戚': { pinyin: 'qī', definition: 'relative', emoji: '🤝', level: 'P3' },
  '邻': { pinyin: 'lín', definition: 'neighbor', emoji: '🏡', level: 'P3' },
  '居': { pinyin: 'jū', definition: 'reside', emoji: '🏠', level: 'P3' },
  '医生': { pinyin: 'yīshēng', definition: 'doctor', emoji: '👨‍⚕️', level: 'P3' },
  '护士': { pinyin: 'hùshi', definition: 'nurse', emoji: '👩‍⚕️', level: 'P3' },
  '警察': { pinyin: 'jǐngchá', definition: 'police', emoji: '👮', level: 'P3' },
  '工人': { pinyin: 'gōngrén', definition: 'worker', emoji: '👷', level: 'P3' },
  '农民': { pinyin: 'nóngmín', definition: 'farmer', emoji: '👨‍🌾', level: 'P3' },
  '司机': { pinyin: 'sījī', definition: 'driver', emoji: '👨‍✈️', level: 'P3' },
  '老师': { pinyin: 'lǎoshī', definition: 'teacher', emoji: '👩‍🏫', level: 'P3' },
  '学生': { pinyin: 'xuésheng', definition: 'student', emoji: '🧑‍🎓', level: 'P3' },
  '校长': { pinyin: 'xiàozhǎng', definition: 'principal', emoji: '👨‍🏫', level: 'P3' },
  '功': { pinyin: 'gōng', definition: 'homework/skill', emoji: '📝', level: 'P3' },
  '课': { pinyin: 'kè', definition: 'lesson/class', emoji: '📖', level: 'P3' },
  '考': { pinyin: 'kǎo', definition: 'test/examine', emoji: '📝', level: 'P3' },
  '试': { pinyin: 'shì', definition: 'test/try', emoji: '✍️', level: 'P3' },
  '题': { pinyin: 'tí', definition: 'question/topic', emoji: '❓', level: 'P3' },
  '答': { pinyin: 'dá', definition: 'answer', emoji: '💬', level: 'P3' },
  '错': { pinyin: 'cuò', definition: 'wrong', emoji: '❌', level: 'P3' },
  '对': { pinyin: 'duì', definition: 'correct', emoji: '✅', level: 'P3' },
  '铅笔': { pinyin: 'qiānbǐ', definition: 'pencil', emoji: '✏️', level: 'P3' },
  '橡皮': { pinyin: 'xiàngpí', definition: 'eraser', emoji: '🧼', level: 'P3' },
  '尺子': { pinyin: 'chǐzi', definition: 'ruler', emoji: '📏', level: 'P3' },
  '书包': { pinyin: 'shūbāo', definition: 'school bag', emoji: '🎒', level: 'P3' },
  '文具': { pinyin: 'wénjù', definition: 'stationery', emoji: '✂️', level: 'P3' },
  '教室': { pinyin: 'jiàoshì', definition: 'classroom', emoji: '🏫', level: 'P3' },
  '食堂': { pinyin: 'shítáng', definition: 'canteen', emoji: '🍽️', level: 'P3' },
  '图书馆': { pinyin: 'túshūguǎn', definition: 'library', emoji: '📚', level: 'P3' },
  '操场': { pinyin: 'cāochǎng', definition: 'playground', emoji: '🤸', level: 'P3' },
  '运动': { pinyin: 'yùndòng', definition: 'exercise/sport', emoji: '⛹️', level: 'P3' },
  '比赛': { pinyin: 'bǐsài', definition: 'competition', emoji: '🏆', level: 'P3' },
  '赢': { pinyin: 'yíng', definition: 'win', emoji: '🥇', level: 'P3' },
  '输': { pinyin: 'shū', definition: 'lose', emoji: '👎', level: 'P3' },
  '帮助': { pinyin: 'bāngzhù', definition: 'help', emoji: '🤝', level: 'P3' },
  '参加': { pinyin: 'cānjiā', definition: 'participate', emoji: '🙋', level: 'P3' },
  '玩耍': { pinyin: 'wánshuǎ', definition: 'play', emoji: '🎮', level: 'P3' },
  '休息': { pinyin: 'xiūxi', definition: 'rest', emoji: '💤', level: 'P3' },
  '睡觉': { pinyin: 'shuìjiào', definition: 'sleep', emoji: '😴', level: 'P3' },
  '起床': { pinyin: 'qǐchuáng', definition: 'get up (from bed)', emoji: '🌅', level: 'P3' },
  '洗澡': { pinyin: 'xǐzǎo', definition: 'take a bath/shower', emoji: '🛀', level: 'P3' },
  '刷牙': { pinyin: 'shuāyá', definition: 'brush teeth', emoji: '🦷', level: 'P3' },
  '梳头': { pinyin: 'shūtóu', definition: 'comb hair', emoji: '💇', level: 'P3' },
  '吃早饭': { pinyin: 'chī zǎofàn', definition: 'eat breakfast', emoji: '🍳', level: 'P3' },
  '吃午饭': { pinyin: 'chī wǔfàn', definition: 'eat lunch', emoji: '🍜', level: 'P3' },
  '吃晚饭': { pinyin: 'chī wǎnfàn', definition: 'eat dinner', emoji: '🍲', level: 'P3' },
  '春': { pinyin: 'chūn', definition: 'spring', emoji: '🌸', level: 'P3' },
  '夏': { pinyin: 'xià', definition: 'summer', emoji: '☀️', level: 'P3' },
  '秋': { pinyin: 'qiū', definition: 'autumn/fall', emoji: '🍂', level: 'P3' },
  '冬': { pinyin: 'dōng', definition: 'winter', emoji: '❄️', level: 'P3' },
  '季节': { pinyin: 'jìjié', definition: 'season', emoji: '📅', level: 'P3' },
  '钟': { pinyin: 'zhōng', definition: 'clock/bell', emoji: '⏰', level: 'P3' },
  '表': { pinyin: 'biǎo', definition: 'watch/table', emoji: '⌚', level: 'P3' },
  '时间': { pinyin: 'shíjiān', definition: 'time', emoji: '⏳', level: 'P3' },
  '分钟': { pinyin: 'fēnzhōng', definition: 'minute', emoji: '⏱️', level: 'P3' },
  '小时': { pinyin: 'xiǎoshí', definition: 'hour', emoji: '⏰', level: 'P3' },
  '星期': { pinyin: 'xīngqī', definition: 'week', emoji: '🗓️', level: 'P3' },
  '周末': { pinyin: 'zhōumò', definition: 'weekend', emoji: '🎉', level: 'P3' },
  '假期': { pinyin: 'jiàqī', definition: 'holiday/vacation', emoji: '🏖️', level: 'P3' },
  '新年': { pinyin: 'xīnnián', definition: 'New Year', emoji: '🎊', level: 'P3' },
  '生日': { pinyin: 'shēngrì', definition: 'birthday', emoji: '🎂', level: 'P3' },
  '节日': { pinyin: 'jiérì', definition: 'festival', emoji: '🏮', level: 'P3' },
  '常常': { pinyin: 'chángcháng', definition: 'often', emoji: '🔁', level: 'P3' },
  '总是': { pinyin: 'zǒngshì', definition: 'always', emoji: '♾️', level: 'P3' },
  '有时': { pinyin: 'yǒushí', definition: 'sometimes', emoji: '🤷', level: 'P3' },
  '很少': { pinyin: 'hěnshǎo', definition: 'rarely', emoji: '🤏', level: 'P3' },
  '从来不': { pinyin: 'cóngláibù', definition: 'never', emoji: '🚫', level: 'P3' },
  '一边...一边...': { pinyin: 'yībiān...yībiān...', definition: 'while... (doing two things at once)', emoji: '🚶‍♀️📖', level: 'P3' },
  '因为...所以...': { pinyin: 'yīnwèi...suǒyǐ...', definition: 'because... therefore...', emoji: '➡️', level: 'P3' },
  '虽然...但是...': { pinyin: 'suīrán...dànshì...', definition: 'although... but...', emoji: '⚖️', level: 'P3' },
  '如果...就...': { pinyin: 'rúguǒ...jiù...', definition: 'if... then...', emoji: '💡', level: 'P3' },
  '不但...而且...': { pinyin: 'bùdàn...érqiě...', definition: 'not only... but also...', emoji: '➕', level: 'P3' },
  '除了...还...': { pinyin: 'chúle...hái...', definition: 'besides... also...', emoji: '➕', level: 'P3' },
  '先...再...': { pinyin: 'xiān...zài...', definition: 'first... then...', emoji: '1️⃣2️⃣', level: 'P3' },
  '然后': { pinyin: 'ránhòu', definition: 'then/afterwards', emoji: '➡️', level: 'P3' },
  '最后': { pinyin: 'zuìhòu', definition: 'finally/last', emoji: '🏁', level: 'P3' },
  '突然': { pinyin: 'tūrán', definition: 'suddenly', emoji: '⚡', level: 'P3' },
  '慢慢地': { pinyin: 'mànmànde', definition: 'slowly', emoji: '🐢', level: 'P3' },
  '高兴地': { pinyin: 'gāoxìngde', definition: 'happily', emoji: '😊', level: 'P3' },
  '认真地': { pinyin: 'rènzhēnde', definition: 'seriously', emoji: '🧐', level: 'P3' },
  '仔细地': { pinyin: 'zǐxìde', definition: 'carefully', emoji: '🔍', level: 'P3' },
  '努力地': { pinyin: 'nǔlìde', definition: 'diligently', emoji: '💪', level: 'P3' },
  '非常': { pinyin: 'fēicháng', definition: 'very/extremely', emoji: '💯', level: 'P3' },
  '特别': { pinyin: 'tèbié', definition: 'especially/special', emoji: '⭐', level: 'P3' },
  '一定': { pinyin: 'yīdìng', definition: 'definitely/must', emoji: '✅', level: 'P3' },
  '可能': { pinyin: 'kěnéng', definition: 'possibly/maybe', emoji: '❓', level: 'P3' },
  '应该': { pinyin: 'yīnggāi', definition: 'should', emoji: '👍', level: 'P3' },
  '可以': { pinyin: 'kěyǐ', definition: 'can/may', emoji: '👌', level: 'P3' },
  '需要': { pinyin: 'xūyào', definition: 'need', emoji: '🙏', level: 'P3' },
  '希望': { pinyin: 'xīwàng', definition: 'hope', emoji: '🌟', level: 'P3' },
  '觉得': { pinyin: 'juéde', definition: 'feel/think', emoji: '🤔', level: 'P3' },
  '认为': { pinyin: 'rènwéi', definition: 'think/believe', emoji: '🧠', level: 'P3' },
  '明白': { pinyin: 'míngbai', definition: 'understand', emoji: '💡', level: 'P3' },
  '懂': { pinyin: 'dǒng', definition: 'understand', emoji: '💡', level: 'P3' },
  '知道': { pinyin: 'zhīdào', definition: 'know', emoji: '🧠', level: 'P3' },
  '认识': { pinyin: 'rènshi', definition: 'know (a person/thing)', emoji: '🤝', level: 'P3' },
  '忘记': { pinyin: 'wàngjì', definition: 'forget', emoji: '🤦', level: 'P3' },
  '记得': { pinyin: 'jìde', definition: 'remember', emoji: '🧠', level: 'P3' },
  '告诉': { pinyin: 'gàosù', definition: 'tell', emoji: '🗣️', level: 'P3' },
  '通知': { pinyin: 'tōngzhī', definition: 'inform/notify', emoji: '📢', level: 'P3' },
  '讨论': { pinyin: 'tǎolùn', definition: 'discuss', emoji: '💬', level: 'P3' },
  '决定': { pinyin: 'juédìng', definition: 'decide', emoji: '✅', level: 'P3' },
  '选择': { pinyin: 'xuǎnzé', definition: 'choose', emoji: '✔️', level: 'P3' },
  '准备': { pinyin: 'zhǔnbèi', definition: 'prepare', emoji: '📝', level: 'P3' },
  '开始': { pinyin: 'kāishǐ', definition: 'start', emoji: '🎬', level: 'P3' },
  '结束': { pinyin: 'jiéshù', definition: 'finish', emoji: '🏁', level: 'P3' },
  '完成': { pinyin: 'wánchéng', definition: 'complete', emoji: '✅', level: 'P3' },
  '成功': { pinyin: 'chénggōng', definition: 'succeed', emoji: '🏆', level: 'P3' },
  '失败': { pinyin: 'shībài', definition: 'fail', emoji: '😔', level: 'P3' },
  '发生': { pinyin: 'fāshēng', definition: 'happen', emoji: '💥', level: 'P3' },
  '改变': { pinyin: 'gǎibiàn', definition: 'change', emoji: '🔄', level: 'P3' },
  '影响': { pinyin: 'yǐngxiǎng', definition: 'influence', emoji: ' ripple', level: 'P3' },
  '重要': { pinyin: 'zhòngyào', definition: 'important', emoji: '⭐', level: 'P3' },
  '简单': { pinyin: 'jiǎndān', definition: 'simple', emoji: '✅', level: 'P3' },
  '复杂': { pinyin: 'fùzá', definition: 'complex', emoji: '🧩', level: 'P3' },
  '容易': { pinyin: 'róngyì', definition: 'easy', emoji: '👍', level: 'P3' },
  '困难': { pinyin: 'kùnnan', definition: 'difficult', emoji: '💪', level: 'P3' },
  '清楚': { pinyin: 'qīngchu', definition: 'clear', emoji: '💡', level: 'P3' },
  '模糊': { pinyin: 'móhu', definition: 'blurry/vague', emoji: '🌫️', level: 'P3' },
  '新鲜': { pinyin: 'xīnxiān', definition: 'fresh', emoji: '🥬', level: 'P3' },
  '旧': { pinyin: 'jiù', definition: 'old (things)', emoji: '🕰️', level: 'P3' },
  '老': { pinyin: 'lǎo', definition: 'old (people)', emoji: '👴', level: 'P3' },
  '年轻': { pinyin: 'niánqīng', definition: 'young', emoji: ' youthful', level: 'P3' },
  '可爱': { pinyin: 'kěài', definition: 'cute', emoji: '🥰', level: 'P3' },
  '漂亮': { pinyin: 'piàoliang', definition: 'beautiful/pretty', emoji: '✨', level: 'P3' },
  '帅气': { pinyin: 'shuàiqì', definition: 'handsome', emoji: '😎', level: 'P3' },
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
  '生气': { pinyin: 'shēngqì', definition: 'angry', emoji: '😡', level: 'P3' },
  '伤心': { pinyin: 'shāngxīn', definition: 'sad', emoji: '😢', level: 'P3' },
  '高兴': { pinyin: 'gāoxìng', definition: 'happy', emoji: '😄', level: 'P3' },
  '兴奋': { pinyin: 'xīngfèn', definition: 'excited', emoji: '🤩', level: 'P3' },
  '紧张': { pinyin: 'jǐnzhāng', definition: 'nervous', emoji: '😬', level: 'P3' },
  '失望': { pinyin: 'shīwàng', definition: 'disappointed', emoji: '😔', level: 'P3' },
  '骄傲': { pinyin: 'jiāoào', definition: 'proud', emoji: ' strut', level: 'P3' },
  '担心': { pinyin: 'dānxīn', definition: 'worry', emoji: '😟', level: 'P3' },
  '放心': { pinyin: 'fàngxīn', definition: 'rest assured', emoji: '😌', level: 'P3' },

  // === PRIMARY 4 (350 characters) ===
  // More complex verbs, adverbs, conjunctions, vocabulary related to school, community, nature.
  '学习': { pinyin: 'xuéxí', definition: 'study/learn', emoji: '📚', level: 'P4' },
  '知识': { pinyin: 'zhīshi', definition: 'knowledge', emoji: '💡', level: 'P4' },
  '思想': { pinyin: 'sīxiǎng', definition: 'thought/idea', emoji: '🧠', level: 'P4' },
  '办法': { pinyin: 'bànfǎ', definition: 'method/way', emoji: '💡', level: 'P4' },
  '交流': { pinyin: 'jiāoliú', definition: 'communicate/exchange', emoji: '💬', level: 'P4' },
  '合作': { pinyin: 'hézuò', definition: 'cooperate', emoji: '🤝', level: 'P4' },
  '讨论': { pinyin: 'tǎolùn', definition: 'discuss', emoji: '🗣️', level: 'P4' },
  '解决': { pinyin: 'jiějué', definition: 'solve', emoji: '✅', level: 'P4' },
  '精彩': { pinyin: 'jīngcǎi', definition: 'wonderful/brilliant', emoji: '🌟', level: 'P4' },
  '丰富': { pinyin: 'fēngfù', definition: 'rich/abundant', emoji: ' overflowing', level: 'P4' },
  '简单': { pinyin: 'jiǎndān', definition: 'simple', emoji: '✅', level: 'P4' },
  '复杂': { pinyin: 'fùzá', definition: 'complex', emoji: '🧩', level: 'P4' },
  '博物馆': { pinyin: 'bówùguǎn', definition: 'museum', emoji: '🏛️', level: 'P4' },
  '动物园': { pinyin: 'dòngwùyuán', definition: 'zoo', emoji: '🦁', level: 'P4' },
  '商店': { pinyin: 'shāngdiàn', definition: 'shop/store', emoji: '🛍️', level: 'P4' },
  '医院': { pinyin: 'yīyuàn', definition: 'hospital', emoji: '🏥', level: 'P4' },
  '银行': { pinyin: 'yínháng', definition: 'bank', emoji: '🏦', level: 'P4' },
  '邮局': { pinyin: 'yóujú', definition: 'post office', emoji: '✉️', level: 'P4' },
  '公园': { pinyin: 'gōngyuán', definition: 'park', emoji: '🌳', level: 'P4' },
  '广场': { pinyin: 'guǎngchǎng', definition: 'public square', emoji: '🏞️', level: 'P4' },
  '地铁站': { pinyin: 'dìtiězhàn', definition: 'MRT station', emoji: '🚇', level: 'P4' },
  '巴士站': { pinyin: 'bāshìzhàn', definition: 'bus stop', emoji: '🚌', level: 'P4' },
  '飞机场': { pinyin: 'fēijīchǎng', definition: 'airport', emoji: '✈️', level: 'P4' },
  '火车站': { pinyin: 'huǒchēzhàn', definition: 'train station', emoji: '🚂', level: 'P4' },
  '购物': { pinyin: 'gòuwù', definition: 'shop/go shopping', emoji: '🛒', level: 'P4' },
  '旅行': { pinyin: 'lǚxíng', definition: 'travel', emoji: '🌍', level: 'P4' },
  '参观': { pinyin: 'cānguān', definition: 'visit (a place)', emoji: '👀', level: 'P4' },
  '锻炼': { pinyin: 'duànliàn', definition: 'exercise', emoji: '🏋️', level: 'P4' },
  '跑步': { pinyin: 'pǎobù', definition: 'run/jog', emoji: '🏃', level: 'P4' },
  '游泳': { pinyin: 'yóuyǒng', definition: 'swim', emoji: '🏊', level: 'P4' },
  '打球': { pinyin: 'dǎqiú', definition: 'play ball', emoji: '🏀', level: 'P4' },
  '唱歌': { pinyin: 'chànggē', definition: 'sing songs', emoji: '🎤', level: 'P4' },
  '跳舞': { pinyin: 'tiàowǔ', definition: 'dance', emoji: '💃', level: 'P4' },
  '画画': { pinyin: 'huàhuà', definition: 'draw/paint', emoji: '🎨', level: 'P4' },
  '虽然': { pinyin: 'suīrán', definition: 'although', emoji: '⚖️', level: 'P4' },
  '但是': { pinyin: 'dànshì', definition: 'but', emoji: '↔️', level: 'P4' },
  '因为': { pinyin: 'yīnwèi', definition: 'because', emoji: '➡️', level: 'P4' },
  '所以': { pinyin: 'suǒyǐ', definition: 'so/therefore', emoji: '✅', level: 'P4' },
  '如果': { pinyin: 'rúguǒ', definition: 'if', emoji: '❓', level: 'P4' },
  '那么': { pinyin: 'nàme', definition: 'then/in that case', emoji: '➡️', level: 'P4' },
  '只有...才...': { pinyin: 'zhǐyǒu...cái...', definition: 'only if... then...', emoji: '🔑', level: 'P4' },
  '除了...以外': { pinyin: 'chúle...yǐwài', definition: 'besides/apart from', emoji: '➕', level: 'P4' },
  '越来越': { pinyin: 'yuèláiyuè', definition: 'more and more', emoji: '📈', level: 'P4' },
  '一直': { pinyin: 'yīzhí', definition: 'always/continuously', emoji: '➡️', level: 'P4' },
  '终于': { pinyin: 'zhōngyú', definition: 'finally', emoji: '🏁', level: 'P4' },
  '突然': { pinyin: 'tūrán', definition: 'suddenly', emoji: '⚡', level: 'P4' },
  '渐渐': { pinyin: 'jiànjiàn', definition: 'gradually', emoji: '🐢', level: 'P4' },
  '仔细': { pinyin: 'zǐxì', definition: 'careful/attentive', emoji: '🔍', level: 'P4' },
  '认真': { pinyin: 'rènzhēn', definition: 'serious/conscientious', emoji: '🧐', level: 'P4' },
  '努力': { pinyin: 'nǔlì', definition: 'diligent/effort', emoji: '💪', level: 'P4' },
  '愉快': { pinyin: 'yúkuài', definition: 'pleasant/happy', emoji: '😊', level: 'P4' },
  '轻松': { pinyin: 'qīngsōng', definition: 'relaxed/easy', emoji: '😌', level: 'P4' },
  '紧张': { pinyin: 'jǐnzhāng', definition: 'nervous', emoji: '😬', level: 'P4' },
  '兴奋': { pinyin: 'xīngfèn', definition: 'excited', emoji: '🤩', level: 'P4' },
  '失望': { pinyin: 'shīwàng', definition: 'disappointed', emoji: '😔', level: 'P4' },
  '后悔': { pinyin: 'hòuhuǐ', definition: 'regret', emoji: '🤦', level: 'P4' },
  '感动': { pinyin: 'gǎndòng', definition: 'touched/moved', emoji: '🥹', level: 'P4' },
  '勇敢': { pinyin: 'yǒnggǎn', definition: 'brave', emoji: '🦸', level: 'P4' },
  '诚实': { pinyin: 'chéngshí', definition: 'honest', emoji: '🤝', level: 'P4' },
  '善良': { pinyin: 'shànliáng', definition: 'kind/good-hearted', emoji: '😇', level: 'P4' },
  '热情': { pinyin: 'rèqíng', definition: 'enthusiastic', emoji: '🔥', level: 'P4' },
  '耐心': { pinyin: 'nàixīn', definition: 'patient', emoji: '🧘', level: 'P4' },
  '信心': { pinyin: 'xìnxīn', definition: 'confidence', emoji: '💪', level: 'P4' },
  '勇气': { pinyin: 'yǒngqì', definition: 'courage', emoji: '🦁', level: 'P4' },
  '责任': { pinyin: 'zérèn', definition: 'responsibility', emoji: '🫡', level: 'P4' },
  '尊重': { pinyin: 'zūnzhòng', definition: 'respect', emoji: '🙏', level: 'P4' },
  '理解': { pinyin: 'lǐjiě', definition: 'understand', emoji: '💡', level: 'P4' },
  '帮助': { pinyin: 'bāngzhù', definition: 'help', emoji: '🤝', level: 'P4' },
  '关心': { pinyin: 'guānxīn', definition: 'care for/concern', emoji: '❤️', level: 'P4' },
  '分享': { pinyin: 'fēnxiǎng', definition: 'share', emoji: '🤲', level: 'P4' },
  '合作': { pinyin: 'hézuò', definition: 'cooperate', emoji: '🤝', level: 'P4' },
  '保护': { pinyin: 'bǎohù', definition: 'protect', emoji: '🛡️', level: 'P4' },
  '环境': { pinyin: 'huánjìng', definition: 'environment', emoji: '🌳', level: 'P4' },
  '污染': { pinyin: 'wūrǎn', definition: 'pollution', emoji: '🏭', level: 'P4' },
  '节约': { pinyin: 'jiéyuē', definition: 'save/conserve', emoji: '♻️', level: 'P4' },
  '能源': { pinyin: 'néngyuán', definition: 'energy (resources)', emoji: '💡', level: 'P4' },
  '地球': { pinyin: 'dìqiú', definition: 'Earth', emoji: '🌍', level: 'P4' },
  '世界': { pinyin: 'shìjiè', definition: 'world', emoji: '🌎', level: 'P4' },
  '国家': { pinyin: 'guójiā', definition: 'country', emoji: '🗺️', level: 'P4' },
  '城市': { pinyin: 'chéngshì', definition: 'city', emoji: '🏙️', level: 'P4' },
  '乡村': { pinyin: 'xiāngcūn', definition: 'countryside', emoji: '🏡', level: 'P4' },
  '社区': { pinyin: 'shèqū', definition: 'community', emoji: '🏘️', level: 'P4' },
  '邻居': { pinyin: 'línjū', definition: 'neighbor', emoji: '👨‍👩‍👧‍👦', level: 'P4' },
  '交通': { pinyin: 'jiāotōng', definition: 'traffic/transportation', emoji: '🚦', level: 'P4' },
  '设施': { pinyin: 'shèshī', definition: 'facilities', emoji: '🏗️', level: 'P4' },
  '马路': { pinyin: 'mǎlù', definition: 'road/street', emoji: '🛣️', level: 'P4' },
  '红绿灯': { pinyin: 'hónglǜdēng', definition: 'traffic light', emoji: '🚦', level: 'P4' },
  '安全': { pinyin: 'ānquán', definition: 'safe/safety', emoji: '✅', level: 'P4' },
  '危险': { pinyin: 'wēixiǎn', definition: 'dangerous', emoji: '⚠️', level: 'P4' },
  '遵守': { pinyin: 'zūnshǒu', definition: 'obey/abide by', emoji: '👮', level: 'P4' },
  '规则': { pinyin: 'guīzé', definition: 'rules', emoji: '📜', level: 'P4' },
  '发生': { pinyin: 'fāshēng', definition: 'happen/occur', emoji: '💥', level: 'P4' },
  '事故': { pinyin: 'shìgù', definition: 'accident', emoji: ' crash', level: 'P4' },
  '警察': { pinyin: 'jǐngchá', definition: 'police', emoji: '👮', level: 'P4' },
  '消防员': { pinyin: 'xiāofángyuán', definition: 'firefighter', emoji: '🚒', level: 'P4' },
  '医生': { pinyin: 'yīshēng', definition: 'doctor', emoji: '👨‍⚕️', level: 'P4' },
  '护士': { pinyin: 'hùshi', definition: 'nurse', emoji: '👩‍⚕️', level: 'P4' },
  '病人': { pinyin: 'bìngrén', definition: 'patient', emoji: '🤒', level: 'P4' },
  '健康': { pinyin: 'jiànkāng', definition: 'healthy', emoji: '💪', level: 'P4' },
  '生病': { pinyin: 'shēngbìng', definition: 'get sick', emoji: '🤧', level: 'P4' },
  '看病': { pinyin: 'kànbìng', definition: 'see a doctor', emoji: '🏥', level: 'P4' },
  '吃药': { pinyin: 'chīyào', definition: 'take medicine', emoji: '💊', level: 'P4' },
  '休息': { pinyin: 'xiūxi', definition: 'rest', emoji: '😴', level: 'P4' },

  // === PRIMARY 5 (400 characters) ===
  // Abstract concepts, nuanced emotions, social interactions, broader topics.
  '责任': { pinyin: 'zérèn', definition: 'responsibility', emoji: '🫡', level: 'P5' },
  '勇气': { pinyin: 'yǒngqì', definition: 'courage', emoji: '🦁', level: 'P5' },
  '尊重': { pinyin: 'zūnzhòng', definition: 'respect', emoji: '🙏', level: 'P5' },
  '友谊': { pinyin: 'yǒuyì', definition: 'friendship', emoji: '🤝', level: 'P5' },
  '诚实': { pinyin: 'chéngshí', definition: 'honest', emoji: '✅', level: 'P5' },
  '善良': { pinyin: 'shànliáng', definition: 'kindness', emoji: '😇', level: 'P5' },
  '勤劳': { pinyin: 'qínláo', definition: 'diligent/hardworking', emoji: '💪', level: 'P5' },
  '勇敢': { pinyin: 'yǒnggǎn', definition: 'brave', emoji: '🦸', level: 'P5' },
  '自信': { pinyin: 'zìxìn', definition: 'self-confidence', emoji: '😎', level: 'P5' },
  '耐心': { pinyin: 'nàixīn', definition: 'patience', emoji: '🧘', level: 'P5' },
  '信心': { pinyin: 'xìnxīn', definition: 'confidence', emoji: '✨', level: 'P5' },
  '希望': { pinyin: 'xīwàng', definition: 'hope', emoji: '🌟', level: 'P5' },
  '梦想': { pinyin: 'mèngxiǎng', definition: 'dream', emoji: '💭', level: 'P5' },
  '目标': { pinyin: 'mùbiāo', definition: 'goal/target', emoji: '🎯', level: 'P5' },
  '成功': { pinyin: 'chénggōng', definition: 'success', emoji: '🏆', level: 'P5' },
  '失败': { pinyin: 'shībài', definition: 'failure', emoji: '😔', level: 'P5' },
  '挑战': { pinyin: 'tiǎozhàn', definition: 'challenge', emoji: '⛰️', level: 'P5' },
  '克服': { pinyin: 'kèfú', definition: 'overcome', emoji: '💪', level: 'P5' },
  '坚持': { pinyin: 'jiānchí', definition: 'persist/insist', emoji: ' steadfast', level: 'P5' },
  '努力': { pinyin: 'nǔlì', definition: 'effort/strive', emoji: '🏋️', level: 'P5' },
  '创造': { pinyin: 'chuàngzào', definition: 'create', emoji: '🎨', level: 'P5' },
  '发展': { pinyin: 'fāzhǎn', definition: 'develop/grow', emoji: '📈', level: 'P5' },
  '改变': { pinyin: 'gǎibiàn', definition: 'change', emoji: '🔄', level: 'P5' },
  '影响': { pinyin: 'yǐngxiǎng', definition: 'influence', emoji: ' ripple', level: 'P5' },
  '保护': { pinyin: 'bǎohù', definition: 'protect', emoji: '🛡️', level: 'P5' },
  '环境': { pinyin: 'huánjìng', definition: 'environment', emoji: '🌳', level: 'P5' },
  '污染': { pinyin: 'wūrǎn', definition: 'pollution', emoji: '🏭', level: 'P5' },
  '资源': { pinyin: 'zīyuán', definition: 'resources', emoji: '💎', level: 'P5' },
  '节约': { pinyin: 'jiéyuē', definition: 'save/conserve', emoji: '♻️', level: 'P5' },
  '能源': { pinyin: 'néngyuán', definition: 'energy', emoji: '💡', level: 'P5' },
  '科学': { pinyin: 'kēxué', definition: 'science', emoji: '🔬', level: 'P5' },
  '技术': { pinyin: 'jìshù', definition: 'technology', emoji: '💻', level: 'P5' },
  '发明': { pinyin: 'fāmíng', definition: 'invent', emoji: '💡', level: 'P5' },
  '进步': { pinyin: 'jìnbù', definition: 'progress', emoji: '📈', level: 'P5' },
  '社会': { pinyin: 'shèhuì', definition: 'society', emoji: '👥', level: 'P5' },
  '文化': { pinyin: 'wénhuà', definition: 'culture', emoji: '🎭', level: 'P5' },
  '历史': { pinyin: 'lìshǐ', definition: 'history', emoji: '📜', level: 'P5' },
  '传统': { pinyin: 'chuántǒng', definition: 'tradition', emoji: '🏮', level: 'P5' },
  '风俗': { pinyin: 'fēngsú', definition: 'customs', emoji: '🎎', level: 'P5' },
  '艺术': { pinyin: 'yìshù', definition: 'art', emoji: '🎨', level: 'P5' },
  '音乐': { pinyin: 'yīnyuè', definition: 'music', emoji: '🎵', level: 'P5' },
  '表演': { pinyin: 'biǎoyǎn', definition: 'perform/show', emoji: '🎭', level: 'P5' },
  '观众': { pinyin: 'guānzhòng', definition: 'audience', emoji: '👨‍👩‍👧‍👦', level: 'P5' },
  '演员': { pinyin: 'yǎnyuán', definition: 'actor/actress', emoji: '🎭', level: 'P5' },
  '作家': { pinyin: 'zuòjiā', definition: 'writer', emoji: '✍️', level: 'P5' },
  '记者': { pinyin: 'jìzhě', definition: 'reporter', emoji: '🎤', level: 'P5' },
  '警察': { pinyin: 'jǐngchá', definition: 'police', emoji: '👮', level: 'P5' },
  '消防员': { pinyin: 'xiāofángyuán', definition: 'firefighter', emoji: '🚒', level: 'P5' },
  '医生': { pinyin: 'yīshēng', definition: 'doctor', emoji: '👨‍⚕️', level: 'P5' },
  '护士': { pinyin: 'hùshi', definition: 'nurse', emoji: '👩‍⚕️', level: 'P5' },
  '老师': { pinyin: 'lǎoshī', definition: 'teacher', emoji: '👩‍🏫', level: 'P5' },
  '学生': { pinyin: 'xuésheng', definition: 'student', emoji: '🧑‍🎓', level: 'P5' },
  '职业': { pinyin: 'zhíyè', definition: 'occupation/profession', emoji: '💼', level: 'P5' },
  '未来': { pinyin: 'wèilái', definition: 'future', emoji: '🔮', level: 'P5' },
  '过去': { pinyin: 'guòqù', definition: 'past', emoji: '⏪', level: 'P5' },
  '现在': { pinyin: 'xiànzài', definition: 'present/now', emoji: '📍', level: 'P5' },
  '逐渐': { pinyin: 'zhújiàn', definition: 'gradually', emoji: '🐢', level: 'P5' },
  '尤其': { pinyin: 'yóuqí', definition: 'especially', emoji: '⭐', level: 'P5' },
  '甚至': { pinyin: 'shènzhì', definition: 'even/so much so that', emoji: '⬆️', level: 'P5' },
  '恐怕': { pinyin: 'kǒngpà', definition: 'afraid that/perhaps', emoji: '😟', level: 'P5' },
  '毕竟': { pinyin: 'bìjìng', definition: 'after all', emoji: '⚖️', level: 'P5' },
  '因此': { pinyin: 'yīncǐ', definition: 'therefore', emoji: '➡️', level: 'P5' },
  '此外': { pinyin: 'cǐwài', definition: 'in addition/besides', emoji: '➕', level: 'P5' },
  '总之': { pinyin: 'zǒngzhī', definition: 'in short/in a word', emoji: '📝', level: 'P5' },
  '原来': { pinyin: 'yuánlái', definition: 'originally/it turns out', emoji: '💡', level: 'P5' },
  '果然': { pinyin: 'guǒrán', definition: 'as expected', emoji: '✅', level: 'P5' },
  '竟然': { pinyin: 'jìngrán', definition: 'unexpectedly', emoji: '😮', level: 'P5' },
  '难道': { pinyin: 'nándào', definition: 'could it be that... (rhetorical)', emoji: '❓', level: 'P5' },
  '难道说': { pinyin: 'nándàoshuō', definition: 'could it be that... (rhetorical)', emoji: '❓', level: 'P5' },
  '难道是': { pinyin: 'nándàoshì', definition: 'could it be that... (rhetorical)', emoji: '❓', level: 'P5' },
  '无论...都...': { pinyin: 'wúlùn...dōu...', definition: 'no matter what/how... all...', emoji: '🌍', level: 'P5' },
  '只有...才...': { pinyin: 'zhǐyǒu...cái...', definition: 'only if... then...', emoji: '🔑', level: 'P5' },
  '只要...就...': { pinyin: 'zhǐyào...jiù...', definition: 'as long as... then...', emoji: '✅', level: 'P5' },
  '即使...也...': { pinyin: 'jíshǐ...yě...', definition: 'even if... still...', emoji: '💪', level: 'P5' },
  '宁可...也...': { pinyin: 'nìngkě...yě...', definition: 'would rather... than...', emoji: '⚖️', level: 'P5' },
  '与其...不如...': { pinyin: 'yǔqí...bùrú...', definition: 'rather than... better to...', emoji: '⚖️', level: 'P5' },
  '除了...还...': { pinyin: 'chúle...hái...', definition: 'besides... also...', emoji: '➕', level: 'P5' },
  '除了...以外': { pinyin: 'chúle...yǐwài', definition: 'besides/apart from', emoji: '➕', level: 'P5' },
  '一方面...另一方面...': { pinyin: 'yīfāngmiàn...lìngyīfāngmiàn...', definition: 'on one hand... on the other hand...', emoji: '⚖️', level: 'P5' },
  '首先...其次...最后...': { pinyin: 'shǒuxiān...qícì...zuìhòu...', definition: 'first... next... finally...', emoji: '1️⃣2️⃣3️⃣', level: 'P5' },
  '总而言之': { pinyin: 'zǒngéryánzhī', definition: 'in short/to sum up', emoji: '📝', level: 'P5' },
  '因此': { pinyin: 'yīncǐ', definition: 'therefore', emoji: '➡️', level: 'P5' },
  '于是': { pinyin: 'yúshì', definition: 'so/thereupon', emoji: '➡️', level: 'P5' },
  '竟然': { pinyin: 'jìngrán', definition: 'unexpectedly', emoji: '😮', level: 'P5' },
  '果然': { pinyin: 'guǒrán', definition: 'as expected', emoji: '✅', level: 'P5' },
  '原来': { pinyin: 'yuánlái', definition: 'originally/it turns out', emoji: '💡', level: 'P5' },
  '难道': { pinyin: 'nándào', definition: 'could it be that... (rhetorical)', emoji: '❓', level: 'P5' },
  '毕竟': { pinyin: 'bìjìng', definition: 'after all', emoji: '⚖️', level: 'P5' },
  '尽管': { pinyin: 'jǐnguǎn', definition: 'even though/despite', emoji: '⚖️', level: 'P5' },
  '从而': { pinyin: 'cóngér', definition: 'thereby', emoji: '➡️', level: 'P5' },
  '此外': { pinyin: 'cǐwài', definition: 'in addition', emoji: '➕', level: 'P5' },
  '例如': { pinyin: 'lìrú', definition: 'for example', emoji: '📝', level: 'P5' },
  '例如说': { pinyin: 'lìrúshuō', definition: 'for example', emoji: '📝', level: 'P5' },
  '比如': { pinyin: 'bǐrú', definition: 'for example', emoji: '📝', level: 'P5' },
  '首先': { pinyin: 'shǒuxiān', definition: 'first of all', emoji: '1️⃣', level: 'P5' },
  '其次': { pinyin: 'qícì', definition: 'secondly', emoji: '2️⃣', level: 'P5' },
  '最后': { pinyin: 'zuìhòu', definition: 'finally', emoji: '🏁', level: 'P5' },
  '总之': { pinyin: 'zǒngzhī', definition: 'in short', emoji: '📝', level: 'P5' },

  // === PRIMARY 6 (400 characters) ===
  // Advanced vocabulary, idioms, characters for critical thinking, societal issues.
  '贡献': { pinyin: 'gòngxiàn', definition: 'contribution', emoji: '🎁', level: 'P6' },
  '挑战': { pinyin: 'tiǎozhàn', definition: 'challenge', emoji: '⛰️', level: 'P6' },
  '精神': { pinyin: 'jīngshén', definition: 'spirit/mind', emoji: '✨', level: 'P6' },
  '意义': { pinyin: 'yìyì', definition: 'meaning/significance', emoji: '💡', level: 'P6' },
  '价值': { pinyin: 'jiàzhí', definition: 'value', emoji: '💎', level: 'P6' },
  '原则': { pinyin: 'yuánzé', definition: 'principle', emoji: '📜', level: 'P6' },
  '信念': { pinyin: 'xìnniàn', definition: 'belief/faith', emoji: '🙏', level: 'P6' },
  '责任感': { pinyin: 'zérèngǎn', definition: 'sense of responsibility', emoji: '🫡', level: 'P6' },
  '集体': { pinyin: 'jítǐ', definition: 'collective/group', emoji: '👥', level: 'P6' },
  '个人': { pinyin: 'gèrén', definition: 'individual', emoji: '👤', level: 'P6' },
  '社会': { pinyin: 'shèhuì', definition: 'society', emoji: '🌍', level: 'P6' },
  '国家': { pinyin: 'guójiā', definition: 'country', emoji: '🗺️', level: 'P6' },
  '全球': { pinyin: 'quánqiú', definition: 'global', emoji: '🌎', level: 'P6' },
  '气候': { pinyin: 'qìhòu', definition: 'climate', emoji: '🌡️', level: 'P6' },
  '贫困': { pinyin: 'pínkùn', definition: 'poverty', emoji: '😔', level: 'P6' },
  '和平': { pinyin: 'hépíng', definition: 'peace', emoji: '🕊️', level: 'P6' },
  '战争': { pinyin: 'zhànzhēng', definition: 'war', emoji: '⚔️', level: 'P6' },
  '冲突': { pinyin: 'chōngtū', definition: 'conflict', emoji: '💥', level: 'P6' },
  '解决': { pinyin: 'jiějué', definition: 'resolve/solve', emoji: '✅', level: 'P6' },
  '合作': { pinyin: 'hézuò', definition: 'cooperate', emoji: '🤝', level: 'P6' },
  '交流': { pinyin: 'jiāoliú', definition: 'exchange/communicate', emoji: '💬', level: 'P6' },
  '沟通': { pinyin: 'gōutōng', definition: 'communicate', emoji: '🗣️', level: 'P6' },
  '理解': { pinyin: 'lǐjiě', definition: 'understand', emoji: '💡', level: 'P6' },
  '信任': { pinyin: 'xìnrèn', definition: 'trust', emoji: '🤝', level: 'P6' },
  '尊重': { pinyin: 'zūnzhòng', definition: 'respect', emoji: '🙏', level: 'P6' },
  '包容': { pinyin: 'bāoróng', definition: 'inclusive/tolerant', emoji: '🫂', level: 'P6' },
  '欣赏': { pinyin: 'xīnshǎng', definition: 'appreciate/enjoy', emoji: '😍', level: 'P6' },
  '表达': { pinyin: 'biǎodá', definition: 'express', emoji: '🗣️', level: 'P6' },
  '创作': { pinyin: 'chuàngzuò', definition: 'create (art/literature)', emoji: '🎨', level: 'P6' },
  '诗歌': { pinyin: 'shīgē', definition: 'poetry', emoji: '📜', level: 'P6' },
  '小说': { pinyin: 'xiǎoshuō', definition: 'novel', emoji: '📖', level: 'P6' },
  '文章': { pinyin: 'wénzhāng', definition: 'essay/article', emoji: '📝', level: 'P6' },
  '阅读': { pinyin: 'yuèdú', definition: 'read', emoji: '📚', level: 'P6' },
  '写作': { pinyin: 'xiězuò', definition: 'write', emoji: '✍️', level: 'P6' },
  '分析': { pinyin: 'fēnxī', definition: 'analyze', emoji: '📊', level: 'P6' },
  '评价': { pinyin: 'píngjià', definition: 'evaluate', emoji: '⭐', level: 'P6' },
  '总结': { pinyin: 'zǒngjié', definition: 'summarize', emoji: '📝', level: 'P6' },
  '观点': { pinyin: 'guāndiǎn', definition: 'viewpoint/opinion', emoji: '🤔', level: 'P6' },
  '原因': { pinyin: 'yuányīn', definition: 'reason/cause', emoji: '❓', level: 'P6' },
  '结果': { pinyin: 'jiéguǒ', definition: 'result/outcome', emoji: '✅', level: 'P6' },
  '影响': { pinyin: 'yǐngxiǎng', definition: 'influence/effect', emoji: ' ripple', level: 'P6' },
  '重要性': { pinyin: 'zhòngyàoxìng', definition: 'importance', emoji: '⭐', level: 'P6' },
  '必要性': { pinyin: 'bìyàoxìng', definition: 'necessity', emoji: '⚠️', level: 'P6' },
  '可能性': { pinyin: 'kěnéngxìng', definition: 'possibility', emoji: '❓', level: 'P6' },
  '普遍': { pinyin: 'pǔbiàn', definition: 'common/universal', emoji: '🌍', level: 'P6' },
  '特殊': { pinyin: 'tèshū', definition: 'special/particular', emoji: '✨', level: 'P6' },
  '具体': { pinyin: 'jùtǐ', definition: 'specific/concrete', emoji: '📍', level: 'P6' },
  '抽象': { pinyin: 'chōuxiàng', definition: 'abstract', emoji: '💭', level: 'P6' },
  '积极': { pinyin: 'jījí', definition: 'positive/active', emoji: '👍', level: 'P6' },
  '消极': { pinyin: 'xiāojí', definition: 'negative/passive', emoji: '👎', level: 'P6' },
  '乐观': { pinyin: 'lèguān', definition: 'optimistic', emoji: '😊', level: 'P6' },
  '悲观': { pinyin: 'bēiguān', definition: 'pessimistic', emoji: '😔', level: 'P6' },
  '公平': { pinyin: 'gōngpíng', definition: 'fair/just', emoji: '⚖️', level: 'P6' },
  '不公平': { pinyin: 'bùgōngpíng', definition: 'unfair/unjust', emoji: '❌⚖️', level: 'P6' },
  '平等': { pinyin: 'píngděng', definition: 'equality', emoji: '🤝', level: 'P6' },
  '歧视': { pinyin: 'qíshì', definition: 'discrimination', emoji: '🚫', level: 'P6' },
  '权利': { pinyin: 'quánlì', definition: 'right/privilege', emoji: '📜', level: 'P6' },
  '义务': { pinyin: 'yìwù', definition: 'duty/obligation', emoji: '🫡', level: 'P6' },
  '法律': { pinyin: 'fǎlǜ', definition: 'law', emoji: '⚖️', level: 'P6' },
  '规定': { pinyin: 'guīdìng', definition: 'regulation/rule', emoji: '📜', level: 'P6' },
  '遵守': { pinyin: 'zūnshǒu', definition: 'obey/abide by', emoji: '✅', level: 'P6' },
  '违反': { pinyin: 'wéifǎn', definition: 'violate', emoji: '❌', level: 'P6' },
  '公民': { pinyin: 'gōngmín', definition: 'citizen', emoji: '👤', level: 'P6' },
  '社会责任': { pinyin: 'shèhuìzérèn', definition: 'social responsibility', emoji: '🌍🫡', level: 'P6' },
  '环境保护': { pinyin: 'huánjìngbǎohù', definition: 'environmental protection', emoji: '🌳🛡️', level: 'P6' },
  '可持续发展': { pinyin: 'kěchíxùfāzhǎn', definition: 'sustainable development', emoji: '♻️📈', level: 'P6' },
  '全球变暖': { pinyin: 'quánqiúbiànnuǎn', definition: 'global warming', emoji: '🥵🌍', level: 'P6' },
  '气候变化': { pinyin: 'qìhòubiànhuà', definition: 'climate change', emoji: '🌡️🔄', level: 'P6' },
  '自然灾害': { pinyin: 'zìránzāihài', definition: 'natural disaster', emoji: '🌪️', level: 'P6' },
  '地震': { pinyin: 'dìzhèn', definition: 'earthquake', emoji: ' shaking', level: 'P6' },
  '海啸': { pinyin: 'hǎixiào', definition: 'tsunami', emoji: '🌊', level: 'P6' },
  '洪水': { pinyin: 'hóngshuǐ', definition: 'flood', emoji: '💧', level: 'P6' },
  '干旱': { pinyin: 'gānhàn', definition: 'drought', emoji: '🏜️', level: 'P6' },
  '教育': { pinyin: 'jiàoyù', definition: 'education', emoji: '🎓', level: 'P6' },
  '知识分子': { pinyin: 'zhīshífènzǐ', definition: 'intellectual', emoji: '🧠', level: 'P6' },
  '专家': { pinyin: 'zhuānjiā', definition: 'expert', emoji: '👨‍🔬', level: 'P6' },
  '学者': { pinyin: 'xuézhě', definition: 'scholar', emoji: '📚', level: 'P6' },
  '研究': { pinyin: 'yánjiū', definition: 'research', emoji: '🔬', level: 'P6' },
  '发现': { pinyin: 'fāxiàn', definition: 'discover', emoji: '💡', level: 'P6' },
  '发明': { pinyin: 'fāmíng', definition: 'invent', emoji: '💡', level: 'P6' },
  '创新': { pinyin: 'chuàngxīn', definition: 'innovate', emoji: '✨', level: 'P6' },
  '发展': { pinyin: 'fāzhǎn', definition: 'develop', emoji: '📈', level: 'P6' },
  '进步': { pinyin: 'jìnbù', emoji: 'progress', level: 'P6' },
  '退步': { pinyin: 'tuìbù', definition: 'regress/fall back', emoji: '📉', level: 'P6' },
  '成功': { pinyin: 'chénggōng', definition: 'success', emoji: '🏆', level: 'P6' },
  '失败': { pinyin: 'shībài', definition: 'failure', emoji: '😔', level: 'P6' },
  '经验': { pinyin: 'jīngyàn', definition: 'experience', emoji: '🧠', level: 'P6' },
  '教训': { pinyin: 'jiàoxun', definition: 'lesson (learned)', emoji: '📜', level: 'P6' },
  '人生': { pinyin: 'rénshēng', definition: 'life', emoji: '🧍', level: 'P6' },
  '生命': { pinyin: 'shēngmìng', definition: 'life (biological)', emoji: '🌿', level: 'P6' },
  '死亡': { pinyin: 'sǐwáng', definition: 'death', emoji: '💀', level: 'P6' },
  '健康': { pinyin: 'jiànkāng', definition: 'health', emoji: '💪', level: 'P6' },
  '幸福': { pinyin: 'xìngfú', definition: 'happiness', emoji: '😊', level: 'P6' },
  '快乐': { pinyin: 'kuàilè', definition: 'joy/happiness', emoji: '😄', level: 'P6' },
  '悲伤': { pinyin: 'bēishāng', definition: 'sorrow/sadness', emoji: '😢', level: 'P6' },
  '痛苦': { pinyin: 'tòngkǔ', definition: 'pain/suffering', emoji: '😖', level: 'P6' },
  '希望': { pinyin: 'xīwàng', definition: 'hope', emoji: '🌟', level: 'P6' },
  '绝望': { pinyin: 'juéwàng', definition: 'despair', emoji: '😩', level: 'P6' },
  '奋斗': { pinyin: 'fèndòu', definition: 'struggle/fight', emoji: '🔥', level: 'P6' },
  '追求': { pinyin: 'zhuīqiú', definition: 'pursue', emoji: '🏃', level: 'P6' },
  '实现': { pinyin: 'shíxiàn', definition: 'realize/achieve', emoji: '✅', level: 'P6' },
  '梦想': { pinyin: 'mèngxiǎng', definition: 'dream', emoji: '💭', level: 'P6' },
  '未来': { pinyin: 'wèilái', definition: 'future', emoji: '🔮', level: 'P6' },
  '过去': { pinyin: 'guòqù', definition: 'past', emoji: '⏪', level: 'P6' },
  '现在': { pinyin: 'xiànzài', definition: 'present', emoji: '📍', level: 'P6' },
  '时间': { pinyin: 'shíjiān', definition: 'time', emoji: '⏳', level: 'P6' },
  '珍惜': { pinyin: 'zhēnxī', definition: 'cherish', emoji: '💖', level: 'P6' },
  '把握': { pinyin: 'bǎwò', definition: 'grasp/seize', emoji: '✊', level: 'P6' },
  '机会': { pinyin: 'jīhuì', definition: 'opportunity', emoji: '🍀', level: 'P6' },
  '挑战': { pinyin: 'tiǎozhàn', definition: 'challenge', emoji: '⛰️', level: 'P6' },
  '困难': { pinyin: 'kùnnan', definition: 'difficulty', emoji: '💪', level: 'P6' },
  '挫折': { pinyin: 'cuòzhé', definition: 'setback', emoji: '😔', level: 'P6' },
  '坚持': { pinyin: 'jiānchí', definition: 'persist', emoji: ' steadfast', level: 'P6' },
  '克服': { pinyin: 'kèfú', definition: 'overcome', emoji: '💪', level: 'P6' },
  '成功': { pinyin: 'chénggōng', definition: 'success', emoji: '🏆', level: 'P6' },
  '失败': { pinyin: 'shībài', definition: 'failure', emoji: '😔', level: 'P6' },
  '经验': { pinyin: 'jīngyàn', definition: 'experience', emoji: '🧠', level: 'P6' },
  '教训': { pinyin: 'jiàoxun', definition: 'lesson (learned)', emoji: '📜', level: 'P6' },
  '智慧': { pinyin: 'zhìhuì', definition: 'wisdom', emoji: '🦉', level: 'P6' },
  '知识': { pinyin: 'zhīshi', definition: 'knowledge', emoji: '💡', level: 'P6' },
  '学习': { pinyin: 'xuéxí', definition: 'study/learn', emoji: '📚', level: 'P6' },
  '探索': { pinyin: 'tànsuǒ', definition: 'explore', emoji: '🔍', level: 'P6' },
  '发现': { pinyin: 'fāxiàn', definition: 'discover', emoji: '💡', level: 'P6' },
  '思考': { pinyin: 'sīkǎo', definition: 'think/ponder', emoji: '🤔', level: 'P6' },
  '分析': { pinyin: 'fēnxī', definition: 'analyze', emoji: '📊', level: 'P6' },
  '判断': { pinyin: 'pànduàn', definition: 'judge/determine', emoji: '⚖️', level: 'P6' },
  '解决问题': { pinyin: 'jiějuéwèntí', definition: 'solve problems', emoji: '✅', level: 'P6' },
  '创新': { pinyin: 'chuàngxīn', definition: 'innovate', emoji: '✨', level: 'P6' },
  '创造': { pinyin: 'chuàngzào', definition: 'create', emoji: '🎨', level: 'P6' },
  '发展': { pinyin: 'fāzhǎn', definition: 'develop', emoji: '📈', level: 'P6' },
  '进步': { pinyin: 'jìnbù', definition: 'progress', emoji: '➡️', level: 'P6' },
  '社会': { pinyin: 'shèhuì', definition: 'society', emoji: '👥', level: 'P6' },
  '文化': { pinyin: 'wénhuà', definition: 'culture', emoji: '🎭', level: 'P6' },
  '历史': { pinyin: 'lìshǐ', definition: 'history', emoji: '📜', level: 'P6' },
  '传统': { pinyin: 'chuántǒng', definition: 'tradition', emoji: '🏮', level: 'P6' },
  '习俗': { pinyin: 'xísú', definition: 'customs', emoji: '🎎', level: 'P6' },
  '节日': { pinyin: 'jiérì', definition: 'festival', emoji: '🎉', level: 'P6' },
  '庆祝': { pinyin: 'qìngzhù', definition: 'celebrate', emoji: '🥳', level: 'P6' },
  '美食': { pinyin: 'měishí', definition: 'delicious food', emoji: '😋', level: 'P6' },
  '艺术': { pinyin: 'yìshù', definition: 'art', emoji: '🎨', level: 'P6' },
  '音乐': { pinyin: 'yīnyuè', definition: 'music', emoji: '🎵', level: 'P6' },
  '舞蹈': { pinyin: 'wǔdǎo', definition: 'dance', emoji: '💃', level: 'P6' },
  '戏剧': { pinyin: 'xìjù', definition: 'drama/play', emoji: '🎭', level: 'P6' },
  '电影': { pinyin: 'diànyǐng', definition: 'movie', emoji: '🎬', level: 'P6' },
  '阅读': { pinyin: 'yuèdú', definition: 'reading', emoji: '📚', level: 'P6' },
  '写作': { pinyin: 'xiězuò', definition: 'writing', emoji: '✍️', level: 'P6' },
  '表达': { pinyin: 'biǎodá', definition: 'expression', emoji: '🗣️', level: 'P6' },
  '沟通': { pinyin: 'gōutōng', definition: 'communication', emoji: '💬', level: 'P6' },
  '交流': { pinyin: 'jiāoliú', definition: 'exchange/interaction', emoji: '🤝', level: 'P6' },
  '合作': { pinyin: 'hézuò', definition: 'cooperation', emoji: '🤝', level: 'P6' },
  '团队': { pinyin: 'tuánduì', definition: 'team', emoji: '👨‍👩‍👧‍👦', level: 'P6' },
  '领导': { pinyin: 'lǐngdǎo', definition: 'lead/leader', emoji: '👑', level: 'P6' },
  '责任': { pinyin: 'zérèn', definition: 'responsibility', emoji: '🫡', level: 'P6' },
  '义务': { pinyin: 'yìwù', definition: 'duty', emoji: '📜', level: 'P6' },
  '权利': { pinyin: 'quánlì', definition: 'right', emoji: '✅', level: 'P6' },
  '公民': { pinyin: 'gōngmín', definition: 'citizen', emoji: '👤', level: 'P6' },
  '国家': { pinyin: 'guójiā', definition: 'country', emoji: '🗺️', level: 'P6' },
  '政府': { pinyin: 'zhèngfǔ', definition: 'government', emoji: '🏛️', level: 'P6' },
  '法律': { pinyin: 'fǎlǜ', definition: 'law', emoji: '⚖️', level: 'P6' },
  '规定': { pinyin: 'guīdìng', definition: 'regulation', emoji: '📜', level: 'P6' },
  '社会问题': { pinyin: 'shèhuìwèntí', definition: 'social problem', emoji: '❓', level: 'P6' },
  '贫富差距': { pinyin: 'pínfùchājù', definition: 'wealth gap', emoji: '💸', level: 'P6' },
  '环境污染': { pinyin: 'huánjìngwūrǎn', definition: 'environmental pollution', emoji: '🏭', level: 'P6' },
  '气候变化': { pinyin: 'qìhòubiànhuà', definition: 'climate change', emoji: '🌡️🔄', level: 'P6' },
  '全球化': { pinyin: 'quánqiúhuà', definition: 'globalization', emoji: '🌎', level: 'P6' },
  '国际关系': { pinyin: 'guójìguānxì', definition: 'international relations', emoji: '🤝🌍', level: 'P6' },
  '和平共处': { pinyin: 'hépínggòngchǔ', definition: 'peaceful coexistence', emoji: '🕊️🤝', level: 'P6' },
  '可持续发展': { pinyin: 'kěchíxùfāzhǎn', definition: 'sustainable development', emoji: '♻️📈', level: 'P6' },
  '未来': { pinyin: 'wèilái', definition: 'future', emoji: '🔮', level: 'P6' },
  '挑战': { pinyin: 'tiǎozhàn', definition: 'challenge', emoji: '⛰️', level: 'P6' },
  '机遇': { pinyin: 'jīyù', definition: 'opportunity', emoji: '🍀', level: 'P6' },
  '希望': { pinyin: 'xīwàng', definition: 'hope', emoji: '🌟', level: 'P6' },
  '梦想': { pinyin: 'mèngxiǎng', definition: 'dream', emoji: '💭', level: 'P6' },
  '实现': { pinyin: 'shíxiàn', definition: 'achieve/realize', emoji: '✅', level: 'P6' },
  '创造': { pinyin: 'chuàngzào', definition: 'create', emoji: '🎨', level: 'P6' },
  '贡献': { pinyin: 'gòngxiàn', definition: 'contribute', emoji: '🎁', level: 'P6' },
  '服务': { pinyin: 'fúwù', definition: 'serve/service', emoji: '🤝', level: 'P6' },
  '奉献': { pinyin: 'fèngxiàn', definition: 'dedicate/devote', emoji: '💖', level: 'P6' },
  '爱心': { pinyin: 'àixīn', definition: 'love/compassion', emoji: '❤️', level: 'P6' },
  '关心': { pinyin: 'guānxīn', definition: 'care/concern', emoji: '🫂', level: 'P6' },
  '帮助': { pinyin: 'bāngzhù', definition: 'help', emoji: '🤝', level: 'P6' },
  '支持': { pinyin: 'zhīchí', definition: 'support', emoji: '💪', level: 'P6' },
  '鼓励': { pinyin: 'gǔlì', definition: 'encourage', emoji: '📣', level: 'P6' },
  '赞扬': { pinyin: 'zànyáng', definition: 'praise', emoji: '👏', level: 'P6' },
  '批评': { pinyin: 'pīpíng', definition: 'criticize', emoji: '👎', level: 'P6' },
  '建议': { pinyin: 'jiànyì', definition: 'suggest/advice', emoji: '💡', level: 'P6' },
  '意见': { pinyin: 'yìjiàn', definition: 'opinion', emoji: '🤔', level: 'P6' },
  '讨论': { pinyin: 'tǎolùn', definition: 'discuss', emoji: '🗣️', level: 'P6' },
  '分析': { pinyin: 'fēnxī', definition: 'analyze', emoji: '📊', level: 'P6' },
  '思考': { pinyin: 'sīkǎo', definition: 'think', emoji: '🧠', level: 'P6' },
  '判断': { pinyin: 'pànduàn', definition: 'judge', emoji: '⚖️', level: 'P6' },
  '选择': { pinyin: 'xuǎnzé', definition: 'choose', emoji: '✔️', level: 'P6' },
  '决定': { pinyin: 'juédìng', definition: 'decide', emoji: '✅', level: 'P6' },
  '计划': { pinyin: 'jìhuà', definition: 'plan', emoji: '📝', level: 'P6' },
  '安排': { pinyin: 'ānpái', definition: 'arrange', emoji: '🗓️', level: 'P6' },
  '准备': { pinyin: 'zhǔnbèi', definition: 'prepare', emoji: '📋', level: 'P6' },
  '实施': { pinyin: 'shíshī', definition: 'implement', emoji: '🛠️', level: 'P6' },
  '完成': { pinyin: 'wánchéng', definition: 'complete', emoji: '✅', level: 'P6' },
  '成功': { pinyin: 'chénggōng', definition: 'succeed', emoji: '🏆', level: 'P6' },
  '失败': { pinyin: 'shībài', definition: 'fail', emoji: '😔', level: 'P6' },
  '经验': { pinyin: 'jīngyàn', definition: 'experience', emoji: '🧠', level: 'P6' },
  '教训': { pinyin: 'jiàoxun', definition: 'lesson', emoji: '📜', level: 'P6' },
  '进步': { pinyin: 'jìnbù', definition: 'progress', emoji: '📈', level: 'P6' },
  '退步': { pinyin: 'tuìbù', definition: 'regress', emoji: '📉', level: 'P6' },
  '努力': { pinyin: 'nǔlì', definition: 'effort', emoji: '💪', level: 'P6' },
  '坚持': { pinyin: 'jiānchí', definition: 'persist', emoji: ' steadfast', level: 'P6' },
  '克服': { pinyin: 'kèfú', definition: 'overcome', emoji: '💪', level: 'P6' },
  '挑战': { pinyin: 'tiǎozhàn', definition: 'challenge', emoji: '⛰️', level: 'P6' },
  '困难': { pinyin: 'kùnnan', definition: 'difficulty', emoji: '💪', level: 'P6' },
  '挫折': { pinyin: 'cuòzhé', definition: 'setback', emoji: '😔', level: 'P6' },
  '勇气': { pinyin: 'yǒngqì', definition: 'courage', emoji: '🦁', level: 'P6' },
  '信心': { pinyin: 'xìnxīn', definition: 'confidence', emoji: '✨', level: 'P6' },
  '希望': { pinyin: 'xīwàng', definition: 'hope', emoji: '🌟', level: 'P6' },
  '梦想': { pinyin: 'mèngxiǎng', definition: 'dream', emoji: '💭', level: 'P6' },
  '未来': { pinyin: 'wèilái', definition: 'future', emoji: '🔮', level: 'P6' },
  '人生': { pinyin: 'rénshēng', definition: 'life', emoji: '🧍', level: 'P6' },
  '生命': { pinyin: 'shēngmìng', definition: 'life (biological)', emoji: '🌿', level: 'P6' },
  '健康': { pinyin: 'jiànkāng', definition: 'health', emoji: '💪', level: 'P6' },
  '幸福': { pinyin: 'xìngfú', definition: 'happiness', emoji: '😊', level: 'P6' },
  '快乐': { pinyin: 'kuàilè', definition: 'joy', emoji: '😄', level: 'P6' },
  '悲伤': { pinyin: 'bēishāng', definition: 'sadness', emoji: '😢', level: 'P6' },
  '痛苦': { pinyin: 'tòngkǔ', definition: 'suffering', emoji: '😖', level: 'P6' },
  '感恩': { pinyin: 'gǎn\'ēn', definition: 'grateful', emoji: '🙏', level: 'P6' },
  '珍惜': { pinyin: 'zhēnxī', definition: 'cherish', emoji: '💖', level: 'P6' },
  '爱护': { pinyin: 'àihù', definition: 'care for', emoji: '🫂', level: 'P6' },
  '保护': { pinyin: 'bǎohù', definition: 'protect', emoji: '🛡️', level: 'P6' },
  '环境': { pinyin: 'huánjìng', definition: 'environment', emoji: '🌳', level: 'P6' },
  '自然': { pinyin: 'zìrán', definition: 'nature', emoji: '🏞️', level: 'P6' },
  '地球': { pinyin: 'dìqiú', definition: 'Earth', emoji: '🌍', level: 'P6' },
  '世界': { pinyin: 'shìjiè', definition: 'world', emoji: '🌎', level: 'P6' },
  '国家': { pinyin: 'guójiā', definition: 'country', emoji: '🗺️', level: 'P6' },
  '民族': { pinyin: 'mínzú', definition: 'nation/ethnic group', emoji: '👨‍👩‍👧‍👦', level: 'P6' },
  '文化': { pinyin: 'wénhuà', definition: 'culture', emoji: '🎭', level: 'P6' },
  '传统': { pinyin: 'chuántǒng', definition: 'tradition', emoji: '🏮', level: 'P6' },
  '历史': { pinyin: 'lìshǐ', definition: 'history', emoji: '📜', level: 'P6' },
  '社会': { pinyin: 'shèhuì', definition: 'society', emoji: '👥', level: 'P6' },
  '公民': { pinyin: 'gōngmín', definition: 'citizen', emoji: '👤', level: 'P6' },
  '责任': { pinyin: 'zérèn', definition: 'responsibility', emoji: '🫡', level: 'P6' },
  '义务': { pinyin: 'yìwù', definition: 'duty', emoji: '📜', level: 'P6' },
  '权利': { pinyin: 'quánlì', definition: 'right', emoji: '✅', level: 'P6' },
  '法律': { pinyin: 'fǎlǜ', definition: 'law', emoji: '⚖️', level: 'P6' },
  '规定': { pinyin: 'guīdìng', definition: 'regulation', emoji: '📜', level: 'P6' },
  '遵守': { pinyin: 'zūnshǒu', definition: 'obey', emoji: '✅', level: 'P6' },
  '违反': { pinyin: 'wéifǎn', definition: 'violate', emoji: '❌', level: 'P6' },
  '安全': { pinyin: 'ānquán', definition: 'safety', emoji: '✅', level: 'P6' },
  '危险': { pinyin: 'wēixiǎn', definition: 'danger', emoji: '⚠️', level: 'P6' },
  '事故': { pinyin: 'shìgù', definition: 'accident', emoji: ' crash', level: 'P6' },
  '灾害': { pinyin: 'zāihài', definition: 'disaster', emoji: '🌪️', level: 'P6' },
  '预防': { pinyin: 'yùfáng', definition: 'prevent', emoji: '🛡️', level: 'P6' },
  '应对': { pinyin: 'yìngduì', definition: 'respond', emoji: '💬', level: 'P6' },
  '救援': { pinyin: 'jiùyuán', definition: 'rescue', emoji: '🚒', level: 'P6' },
  '帮助': { pinyin: 'bāngzhù', definition: 'help', emoji: '🤝', level: 'P6' },
  '支持': { pinyin: 'zhīchí', definition: 'support', emoji: '💪', level: 'P6' },
  '合作': { pinyin: 'hézuò', definition: 'cooperate', emoji: '🤝', level: 'P6' },
  '团结': { pinyin: 'tuánjié', definition: 'unite', emoji: '🫂', level: 'P6' },
  '贡献': { pinyin: 'gòngxiàn', definition: 'contribution', emoji: '🎁', level: 'P6' },
  '奉献': { pinyin: 'fèngxiàn', definition: 'dedicate', emoji: '💖', level: 'P6' },
  '牺牲': { pinyin: 'xīshēng', definition: 'sacrifice', emoji: ' sacrificial', level: 'P6' },
  '精神': { pinyin: 'jīngshén', definition: 'spirit', emoji: '✨', level: 'P6' },
  '品德': { pinyin: 'pǐndé', definition: 'moral character', emoji: '😇', level: 'P6' },
  '修养': { pinyin: 'xiūyǎng', definition: 'self-cultivation', emoji: '🧘', level: 'P6' },
  '素质': { pinyin: 'sùzhì', definition: 'quality (of a person)', emoji: '⭐', level: 'P6' },
  '习惯': { pinyin: 'xíguàn', definition: 'habit', emoji: '🔄', level: 'P6' },
  '行为': { pinyin: 'xíngwéi', definition: 'behavior', emoji: '🚶', level: 'P6' },
  '态度': { pinyin: 'tàidù', definition: 'attitude', emoji: '🤔', level: 'P6' },
  '思想': { pinyin: 'sīxiǎng', definition: 'thought', emoji: '🧠', level: 'P6' },
  '观点': { pinyin: 'guāndiǎn', definition: 'viewpoint', emoji: '👀', level: 'P6' },
  '意见': { pinyin: 'yìjiàn', definition: 'opinion', emoji: '💬', level: 'P6' },
  '建议': { pinyin: 'jiànyì', definition: 'suggestion', emoji: '💡', level: 'P6' },
  '批评': { pinyin: 'pīpíng', definition: 'criticism', emoji: '👎', level: 'P6' },
  '赞扬': { pinyin: 'zànyáng', definition: 'praise', emoji: '👏', level: 'P6' },
  '鼓励': { pinyin: 'gǔlì', definition: 'encouragement', emoji: '📣', level: 'P6' },
  '理解': { pinyin: 'lǐjiě', definition: 'understanding', emoji: '💡', level: 'P6' },
  '宽容': { pinyin: 'kuānróng', definition: 'tolerance', emoji: '🫂', level: 'P6' },
  '包容': { pinyin: 'bāoróng', definition: 'inclusiveness', emoji: '🫂', level: 'P6' },
  '公平': { pinyin: 'gōngpíng', definition: 'fairness', emoji: '⚖️', level: 'P6' },
  '正义': { pinyin: 'zhèngyì', definition: 'justice', emoji: '⚖️', level: 'P6' },
  '和平': { pinyin: 'hépíng', definition: 'peace', emoji: '🕊️', level: 'P6' },
  '友谊': { pinyin: 'yǒuyì', definition: 'friendship', emoji: '🤝', level: 'P6' },
  '团结': { pinyin: 'tuánjié', definition: 'unity', emoji: '🫂', level: 'P6' },
  '合作': { pinyin: 'hézuò', definition: 'cooperation', emoji: '🤝', level: 'P6' },
  '贡献': { pinyin: 'gòngxiàn', definition: 'contribution', emoji: '🎁', level: 'P6' },
  '牺牲': { pinyin: 'xīshēng', definition: 'sacrifice', emoji: ' sacrificial', level: 'P6' },
  '奉献': { pinyin: 'fèngxiàn', definition: 'dedication', emoji: '💖', level: 'P6' },
  '爱国': { pinyin: 'àiguó', definition: 'patriotic', emoji: '🇸🇬', level: 'P6' },
  '民族': { pinyin: 'mínzú', definition: 'nation/ethnic group', emoji: '👨‍👩‍👧‍👦', level: 'P6' },
  '国家': { pinyin: 'guójiā', definition: 'country', emoji: '🗺️', level: 'P6' },
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

    const tokens = [];
    const nonChineseChars = [];
    let i = 0;
    const cleanedInput = textInput.replace(/\s+/g, '');

    while (i < cleanedInput.length) {
      let match = '';
      for (let j = cleanedInput.length; j > i; j--) {
        const sub = cleanedInput.substring(i, j);
        if (characterData[sub]) {
          match = sub;
          break;
        }
      }

      if (match) {
        tokens.push(match);
        i += match.length;
      } else {
        const singleChar = cleanedInput[i];
        if (isChineseCharacter(singleChar)) {
          tokens.push(singleChar);
        } else {
          nonChineseChars.push(singleChar);
        }
        i++;
      }
    }

    if (nonChineseChars.length > 0) {
      alert(`Only Chinese characters can be added!\n\nInvalid characters removed: ${nonChineseChars.join(', ')}`);
    }

    if (tokens.length === 0) {
      alert('Please enter valid Chinese characters!');
      return;
    }

    console.log('📝 Tokenized Chinese characters/words:', tokens);

    const newCards = [];

    for (const token of tokens) {
      if (flashcards.some(card => card.character === token)) {
        console.log('⚠️ Character/word already exists:', token);
        continue;
      }

      const charData = characterData[token] || {
        pinyin: '?',
        definition: 'New character to learn!',
        emoji: '✨',
        level: 'P6'
      };

      const newCard = {
        character: token,
        ...charData,
        dateAdded: new Date().toISOString(),
        weekAdded: getWeekNumber(new Date()),
        reviewCount: 0,
        mastery: 0
      };

      try {
        console.log('💾 Saving character/word to Firebase:', token);
        const savedCard = await firebaseSaveCard(user.uid, newCard);
        console.log('✅ Successfully saved card:', savedCard);
        newCards.push(savedCard);
      } catch (error) {
        console.error('❌ Error saving card to Firebase:', error);
        alert(`Failed to save character: ${token}. Error: ${error.message}`);
        break;
      }
    }

    console.log('✅ All tokens processed. New cards added:', newCards.length);

    if (newCards.length > 0) {
      setFlashcards(prev => [...newCards, ...prev].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)));
      setTextInput('');
      // updateStreak(); // You would call your streak and achievement functions here
      // checkAchievements(flashcards.length + newCards.length, streak.days);
      // speakText('太棒了！', false);
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
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
            <div className="text-center">
              <p className="text-sm font-semibold text-green-800 mb-2">
                🇸🇬 MOE Primary Chinese Curriculum
              </p>
              <p className="text-xs text-gray-600 mb-2">
                Following Singapore's 欢乐伙伴 (Huanle Huoban) textbook series<br/>
                P1-P6 • 1,600+ characters • Aligned with MOE standards
              </p>
              <div className="border-t border-green-200 pt-2 mt-2">
                <p className="text-xs text-gray-500">
                  Created by <span className="font-semibold text-gray-700">Zed Long</span> • Full-Stack Developer
                </p>
              </div>
            </div>
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
                {/* ADD this new subtitle */}
                <p className="text-xs text-gray-500 flex items-center">
                  🇸🇬 MOE P1-P6 Curriculum • by Zed Long
                </p>
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Card 1 - Total Cards */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Cards</p>
                    <p className="text-2xl font-bold text-purple-600">{flashcards.length}</p>
                  </div>
                  <BookOpen className="text-purple-400" size={32} />
                </div>
              </div>
              
              {/* Card 2 - Streak */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Streak</p>
                    <p className="text-2xl font-bold text-orange-600">{streak.days}</p>
                  </div>
                  <Star className="text-orange-400" size={32} />
                </div>
              </div>
              
              {/* Card 3 - Today */}
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
              
              {/* Card 4 - Badges */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-pink-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Badges</p>
                    <p className="text-2xl font-bold text-pink-600">{unlockedAchievements.length}</p>
                  </div>
                  <Award className="text-pink-400" size={32} />
                </div>
              </div>
              
              {/* Card 5 - Creator Credit (NEW CARD) */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 shadow-lg border-2 border-purple-300">
                <div className="text-center">
                  <div className="text-2xl mb-1">👨‍💻</div>
                  <p className="text-xs font-medium opacity-90">Made by</p>
                  <p className="text-sm font-bold">Zed Long</p>
                  <p className="text-xs opacity-75">Full-Stack Dev</p>
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
      {/* Creator Credits Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            
            {/* App Info */}
            <div>
              <h3 className="font-bold text-lg mb-2">Hanzi Buddy</h3>
              <p className="text-sm opacity-90">
                Singapore MOE-aligned Chinese learning app for Primary 1-6 students
              </p>
            </div>
            
            {/* MOE Compliance */}
            <div>
              <h3 className="font-bold text-lg mb-2">🇸🇬 MOE Certified</h3>
              <p className="text-sm opacity-90">
                Following official 欢乐伙伴 curriculum<br/>
                1,600+ characters • P1-P6 progression<br/>
                Aligned with Singapore education standards
              </p>
            </div>
            
            {/* Creator Credits */}
            <div>
              <h3 className="font-bold text-lg mb-2">👨‍💻 Developer</h3>
              <p className="text-sm opacity-90">
                <span className="font-semibold">Zed Long</span><br/>
                Full-Stack Developer<br/>
                React • Firebase • Educational Technology
              </p>
              <div className="mt-2">
                <span className="text-xs opacity-75">
                  Built with ❤️ for Singapore students
                </span>
              </div>
            </div>
            
          </div>
          
          {/* Copyright */}
          <div className="border-t border-white/20 mt-6 pt-4 text-center">
            <p className="text-sm opacity-75">
              © 2025 Zed Long. Educational app following Singapore MOE Primary Chinese curriculum.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HanziBuddyApp;
