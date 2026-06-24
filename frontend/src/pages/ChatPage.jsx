import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getPesan, konfirmasiSelesai, getMatchById, BASE_URL } from '../services/api';
import Layout from '../components/Layout';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function BubbleChat({ pesan, isMe }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}
    >
      {!isMe && (
        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mr-2 flex-shrink-0 self-end">
          {pesan.namaPengirim?.[0]?.toUpperCase() || '?'}
        </div>
      )}
      <div className="max-w-[70%]">
        {!isMe && (
          <p className="text-xs text-slate-400 mb-1 ml-1">{pesan.namaPengirim}</p>
        )}
        <div className="px-4 py-2.5 text-sm leading-relaxed"
          style={{
            background:   isMe ? '#2563EB' : '#F1F5F9',
            color:        isMe ? '#FFFFFF' : '#1E293B',
            borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            wordBreak: 'break-word',
          }}>
          {pesan.isiPesan}
        </div>
        <p className={`text-[10px] mt-1 text-slate-400 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
          {pesan.createdAt
            ? new Date(pesan.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            : ''}
        </p>
      </div>
      {isMe && (
        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs ml-2 flex-shrink-0 self-end">
          {pesan.namaPengirim?.[0]?.toUpperCase() || 'A'}
        </div>
      )}
    </motion.div>
  );
}

export default function ChatPage() {
  const { matchId }    = useParams();
  const { user }       = useAuth();
  const navigate       = useNavigate();
  const bottomRef      = useRef(null);
  const stompClientRef = useRef(null);

  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(true);
  const [sending,   setSending]   = useState(false);
  const [error,     setError]     = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [matchData, setMatchData] = useState(null);

  const fetchInitialMessages = useCallback(async () => {
    try {
      const [resPesan, resMatch] = await Promise.all([
        getPesan(matchId),
        getMatchById(matchId).catch(() => null)
      ]);
      
      setMessages(Array.isArray(resPesan.data) ? resPesan.data : []);
      
      if (resMatch && resMatch.data) {
        setMatchData(resMatch.data);
        if (resMatch.data.status === 'CONFIRMED' || resMatch.data.status === 'REJECTED') {
          setConfirmed(true);
        }
      }
    } catch (e) {
      if (e.response?.status !== 401) setError('Gagal memuat pesan.');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchInitialMessages();
    const token = localStorage.getItem('token');
    const socket = new SockJS(`${BASE_URL}/ws?token=${token}`);
    const client = Stomp.over(socket);
    client.debug = () => {};
    client.connect({ Authorization: `Bearer ${token}` }, () => {
      client.subscribe(`/topic/chat/${matchId}`, (message) => {
        if (message.body) {
          const newMsg = JSON.parse(message.body);
          setMessages((prev) => {
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      });
    }, () => {
      setError('Koneksi chat terputus. Silakan muat ulang halaman.');
    });
    stompClientRef.current = client;
    return () => {
      if (stompClientRef.current?.connected) stompClientRef.current.disconnect();
    };
  }, [fetchInitialMessages, matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const txt = input.trim();
    if (!txt || sending) return;
    setInput('');
    setError('');
    try {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.send(`/app/chat.send/${matchId}`, {}, JSON.stringify({ isiPesan: txt, nimPengirim: user?.nim }));
      } else {
        setError('Koneksi belum terhubung. Coba lagi.');
      }
    } catch {
      setError('Gagal mengirim pesan.');
    }
  };

  const handleKonfirmasi = async () => {
    try {
      await konfirmasiSelesai(matchId);
      setConfirmed(true);
      setShowModal(false);
    } catch (e) {
      setError(e.response?.data?.message || 'Gagal konfirmasi.');
    }
  };

  const isHilang = matchData?.laporanHilang?.user?.nim === user?.nim;
  const opponent = isHilang ? matchData?.laporanTemuan?.user : matchData?.laporanHilang?.user;
  const opponentRole = isHilang ? 'Penemu' : 'Pemilik';

  return (
    <Layout noPadding>
      <div className="flex flex-col h-screen bg-white" style={{ maxHeight: '100vh' }}>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-100 shadow-sm z-10">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/pesan')}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </motion.button>
          
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            {opponent?.nama?.[0]?.toUpperCase() || '👤'}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-slate-900 font-bold text-sm truncate">
              {opponent ? opponent.nama : `Chat Match #${matchId}`}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                {opponentRole}
              </span>
              <p className="text-xs text-slate-400">Pesan langsung</p>
            </div>
          </div>
          {!confirmed ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowModal(true)}
              className="text-xs px-3.5 py-2 rounded-xl font-semibold flex-shrink-0 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
              Tandai Selesai
            </motion.button>
          ) : (
            <span className="text-xs px-3.5 py-2 rounded-xl font-semibold flex-shrink-0 bg-green-50 text-green-700 border border-green-200">
              ✅ Selesai
            </span>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div key="err" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="flex-shrink-0 px-6 py-2.5 text-xs flex items-center gap-2 bg-red-50 border-b border-red-100 text-red-600">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-slate-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-8 h-8 rounded-full border-slate-200 border-t-blue-600 animate-spin" style={{ borderWidth: '3px' }} />
              <p className="text-sm text-slate-400 font-medium">Memuat pesan...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">💬</div>
              <p className="font-semibold text-slate-700">Belum ada pesan</p>
              <p className="text-sm text-slate-400 text-center max-w-xs">Mulai percakapan untuk mengklaim barang atau konfirmasi kepemilikan.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((msg) => (
                <BubbleChat key={msg.id} pesan={msg} isMe={msg.nimPengirim === user?.nim} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 px-5 py-4 bg-white border-t border-slate-100">
          {confirmed ? (
            <div className="py-3 px-4 bg-green-50 border border-green-200 rounded-xl text-center">
              <p className="text-sm text-green-700 font-semibold">
                ✅ Kasus ini telah selesai
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                Percakapan telah ditutup dan tidak dapat membalas pesan.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex gap-3 items-end">
              <textarea
                id="chat-input"
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }
                }}
                placeholder="Ketik pesan... (Enter untuk kirim)"
                className="flex-1 input-field resize-none overflow-hidden"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                disabled={sending}
              />
              <motion.button type="submit" disabled={!input.trim() || sending}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: (input.trim() && !sending) ? '#2563EB' : '#E2E8F0',
                  color:      (input.trim() && !sending) ? '#FFFFFF' : '#94A3B8',
                }}>
                {sending ? (
                  <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )}
              </motion.button>
            </form>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi */}
      <AnimatePresence>
        {showModal && (
          <motion.div key="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🤝</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Konfirmasi Selesai?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Ini akan menandai barang telah kembali ke pemiliknya dan menutup laporan ini.
              </p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  Batal
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleKonfirmasi}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Ya, Selesai!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
