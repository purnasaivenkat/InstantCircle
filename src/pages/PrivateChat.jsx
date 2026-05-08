import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { insforge } from '../lib/insforge';
import ChatMessage from '../components/ChatMessage';

const PrivateChat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chat, setChat] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [showGame, setShowGame] = useState(false);
  const scrollRef = useRef(null);

  const fetchChatDetails = async () => {
    try {
      // Simplified query to avoid join syntax issues
      const { data: chatData, error } = await insforge.database
        .from('private_chats')
        .select('*')
        .eq('id', chatId)
        .single();

      if (error) throw error;
      if (chatData) {
        setChat(chatData);
        const otherUserId = chatData.user1_id === user.id ? chatData.user2_id : chatData.user1_id;
        
        // Fetch target profile separately for better compatibility
        const { data: targetProfile } = await insforge.database
          .from('profiles')
          .select('id, username')
          .eq('id', otherUserId)
          .single();
        
        if (targetProfile) setTargetUser(targetProfile);
      }
    } catch (err) {
      console.error('Error fetching chat details:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await insforge.database
        .from('private_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    if (!chatId || !user) return;
    fetchChatDetails();
    fetchMessages();

    const subscription = insforge
      .channel(`private-${chatId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'private_messages', filter: `chat_id=eq.${chatId}` }, (payload) => {
        if (payload.event === 'INSERT') setMessages((prev) => [...prev, payload.new]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'private_chats', filter: `id=eq.${chatId}` }, (payload) => {
        setChat(payload.new);
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [chatId, user]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText('');
    try {
      await insforge.database.from('private_messages').insert([{ chat_id: chatId, sender_id: user.id, text: textToSend }]);
    } catch (err) {
      console.error('Error sending private message:', err);
    }
  };

  const updateGameState = async (newState) => {
    try {
      await insforge.database.from('private_chats').update({ game_state: newState }).eq('id', chatId);
    } catch (err) {
      console.error('Error updating game state:', err);
    }
  };

  const selectGame = async (type) => {
    try {
      await insforge.database.from('private_chats').update({ game_type: type, game_state: {} }).eq('id', chatId);
    } catch (err) {
      console.error('Error selecting game:', err);
    }
  };

  const TicTacToe = () => {
    const state = chat?.game_state || {};
    const board = state.board || Array(9).fill(null);
    const xIsNext = state.xIsNext !== undefined ? state.xIsNext : true;
    const winner = calculateWinner(board);
    const isPlayerX = chat?.user1_id === user.id;
    const isMyTurn = (isPlayerX && xIsNext) || (!isPlayerX && !xIsNext);

    const handleClick = (i) => {
      if (winner || board[i] || !isMyTurn) return;
      const nextBoard = board.slice();
      nextBoard[i] = xIsNext ? 'X' : 'O';
      updateGameState({ board: nextBoard, xIsNext: !xIsNext });
    };

    return (
      <div className="glass p-6 rounded-[2rem] border border-white/5 mb-8 max-w-sm mx-auto text-center">
        <h4 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Tic-Tac-Toe</h4>
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, i) => (
            <button key={i} onClick={() => handleClick(i)} className="w-16 h-16 glass rounded-xl flex items-center justify-center text-2xl font-black text-white" disabled={!isMyTurn || winner || cell}>{cell}</button>
          ))}
        </div>
      </div>
    );
  };

  const RockPaperScissors = () => {
    const state = chat?.game_state || {};
    const myChoice = state[user.id];
    const otherChoice = state[targetUser?.id];
    const choices = [{ id: 'rock', emoji: '✊' }, { id: 'paper', emoji: '✋' }, { id: 'scissors', emoji: '✌️' }];

    const handleChoice = (choiceId) => {
      if (myChoice) return;
      updateGameState({ ...state, [user.id]: choiceId });
    };

    const result = (myChoice && otherChoice) ? (myChoice === otherChoice ? 'Tie!' : 'Match Result Ready') : null;

    return (
      <div className="glass p-6 rounded-[2rem] border border-white/5 mb-8 max-w-sm mx-auto text-center">
        <h4 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">RPS</h4>
        <div className="flex justify-center gap-2">
          {choices.map((c) => (
            <button key={c.id} onClick={() => handleChoice(c.id)} className={`w-14 h-14 glass rounded-xl text-xl ${myChoice === c.id ? 'border-amber-500 bg-amber-500/20' : 'opacity-50'}`}>{c.emoji}</button>
          ))}
        </div>
        {result && <p className="mt-4 text-xs font-black text-amber-500">{result}</p>}
      </div>
    );
  };

  const GameSelector = () => (
    <div className="glass p-6 rounded-[2rem] border border-white/5 mb-8 max-w-sm mx-auto text-center">
      <h4 className="text-xs font-black text-[#F8FAFC] mb-4 uppercase tracking-widest">Select a Game</h4>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => selectGame('tic-tac-toe')} className="glass py-3 rounded-xl text-[10px] font-black text-amber-500 uppercase">Tic-Tac-Toe</button>
        <button onClick={() => selectGame('rps')} className="glass py-3 rounded-xl text-[10px] font-black text-indigo-400 uppercase">RPS</button>
      </div>
    </div>
  );

  function calculateWinner(squares) {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i=0; i<lines.length; i++) {
      const [a,b,c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  }

  return (
    <div className="flex-1 flex flex-col items-center h-full relative bg-[#050505]">
      <div className="w-full max-w-5xl h-full flex flex-col relative z-10 border-x border-white/5 bg-[#050505]">
        {/* Header */}
        <div className="px-6 py-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 rounded-full hover:bg-white/5 text-[#64748B] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <div>
              <h3 className="font-black text-xl text-[#F8FAFC] tracking-tighter">{targetUser?.username || 'Private Chat'}</h3>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                <p className="text-[8px] text-[#64748B] uppercase tracking-widest font-black">SECURE CHANNEL</p>
              </div>
            </div>
          </div>
          <button onClick={() => setShowGame(!showGame)} className={`p-3 rounded-2xl transition-all ${showGame ? 'bg-amber-500 text-black' : 'glass text-[#64748B]'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4M8 10v4M15 13a1 1 0 100-2 1 1 0 000 2zM18 11a1 1 0 100-2 1 1 0 000 2z" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth scrollbar-thin">
          <AnimatePresence>
            {(showGame || chat?.game_type) && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                {!chat?.game_type ? <GameSelector /> : chat.game_type === 'tic-tac-toe' ? <TicTacToe /> : <RockPaperScissors />}
              </motion.div>
            )}
          </AnimatePresence>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} user={msg.sender_id === user.id ? profile?.username : targetUser?.username} text={msg.text} isCurrentUser={msg.sender_id === user.id} />
          ))}
        </div>

        {/* Input */}
        <div className="px-6 py-8 border-t border-white/5">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send a private thought..."
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-full px-8 py-5 text-base outline-none focus:border-amber-500/20 text-[#F8FAFC]"
            />
            <button type="submit" className="absolute right-3 top-3 bottom-3 aspect-square flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
