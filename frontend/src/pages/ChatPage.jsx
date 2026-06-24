import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getPesan, konfirmasiSelesai, BASE_URL } from '../services/api';
import Layout from '../components/Layout';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function BubbleChat({ pesan, isMe }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isMe && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-2 flex-shrink-0 self-end"
          style={{ background: '#1f1f1f', color: '#8C8C8C' }}>
          {pesan.namaPengirim?.[0]?.toUpperCase() || '?'}
        </div>
      )}
      <div className="max-w-[70%]">
        {!isMe && (
          <p className="text-xs mb-1 ml-1" style={{ color: '#555' }}>{pesan.namaPengirim}</p>
        )}
        <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
          style={{
            background:    isMe ? '#C8FF00' : '#1f1f1f',
            color:         isMe ? '#0D0D0D' : '#E5E5E5',
            borderRadius:  isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            wordBreak: 'break-word'
          }}>
          {pesan.isiPesan}
        </div>
        <p className={`text-xs mt-1 ${isMe ? 'text-right mr-1' : 'ml-1'}`} style={{ color: '#444' }}>
          {pesan.createdAt
            ? new Date(pesan.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            : ''}
        </p>
      </div>
      {isMe && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ml-2 flex-shrink-0 self-end"
          style={{ background: '#C8FF00', color: '#0D0D0D' }}>
          {pesan.namaPengirim?.[0]?.toUpperCase() || 'A'}
        </div>
      )}
    </motion.div>
  );
}

export default function ChatPage() {
  const { matchId }   = useParams();
  const { user }      = useAuth();
  const navigate      = useNavigate();
  const bottomRef     = useRef(null);
  const stompClientRef = useRef(null);

  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(true);
  const [sending,   setSending]   = useState(false);
  const [error,     setError]     = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchInitialMessages = useCallback(async () => {
    try {
      const res = await getPesan(matchId);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      if (e.response?.status !== 401) setError('Gagal memuat pesan.');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchInitialMessages();

    // WebSocket Setup
    const token = localStorage.getItem('token');
    const socket = new SockJS(`${BASE_URL}/ws?token=${token}`);
    const client = Stomp.over(socket);
    
    // Disable logging in production
    client.debug = () => {};

    client.connect({ Authorization: `Bearer ${token}` }, () => {
      // Subscribe ke topik match
      client.subscribe(`/topic/chat/${matchId}`, (message) => {
        if (message.body) {
          const newMsg = JSON.parse(message.body);
          setMessages((prev) => {
            // Cek duplikasi jika echo dari server
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      });
    }, (error) => {
      console.error('WebSocket Error:', error);
      setError('Koneksi chat terputus. Silakan muat ulang halaman.');
    });

    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
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
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.send(`/app/chat.send/${matchId}`, {}, JSON.stringify({ 
          isiPesan: txt,
          nimPengirim: user?.nim 
        }));
      } else {
        setError('Koneksi belum terhubung. Coba lagi.');
      }
    } catch (e) {
      setError('Gagal mengirim pesan via WebSocket.');
    }
  };

  const handleKonfirmasi = async () => {
    try {
      await konfirmasiSelesai(matchId);
      setConfirmed(true);
      setShowConfirmModal(false);
    } catch (e) {
      setError(e.response?.data?.message || 'Gagal konfirmasi.');
    }
  };

  return (
    <Layout noPadding>
      <div className="flex flex-col h-screen" style={{ maxHeight: 'calc(100vh)' }}>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-3 px-6 py-4"
          style={{ background: '#111', borderBottom: '1px solid #1f1f1f' }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/notifikasi')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            ←
          </motion.button>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold truncate">Chat Match #{matchId}</p>
            <p className="text-xs" style={{ color: '#8C8C8C' }}>
              Pesan akan diperbarui otomatis
            </p>
          </div>
          {!confirmed && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowConfirmModal(true)}
              className="text-xs px-3 py-2 rounded-xl font-semibold flex-shrink-0"
              style={{ background: 'rgba(200,255,0,0.1)', color: '#C8FF00', border: '1px solid rgba(200,255,0,0.2)' }}>
              ✅ Selesai
            </motion.button>
          )}
          {confirmed && (
            <span className="text-xs px-3 py-2 rounded-xl font-semibold flex-shrink-0"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#34D399', border: '1px solid rgba(16,185,129,0.2)' }}>
              ✅ Dikonfirmasi
            </span>
          )}
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div key="err" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="flex-shrink-0 px-6 py-2 text-xs"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', borderBottom: '1px solid rgba(239,68,68,0.15)' }}>
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: '#C8FF00', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: '#8C8C8C' }}>Memuat pesan...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <span className="text-5xl">💬</span>
              <p className="font-semibold text-white">Belum ada pesan</p>
              <p className="text-sm text-center max-w-xs" style={{ color: '#8C8C8C' }}>
                Mulai percakapan untuk mengklaim barang atau konfirmasi kepemilikan
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((msg) => (
                <BubbleChat
                  key={msg.id}
                  pesan={msg}
                  isMe={msg.nimPengirim === user?.nim}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 px-6 py-4" style={{ background: '#111', borderTop: '1px solid #1f1f1f' }}>
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
              disabled={sending || confirmed}
            />
            <motion.button type="submit" disabled={!input.trim() || sending || confirmed}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg transition-all"
              style={{
                background: input.trim() && !sending && !confirmed ? '#C8FF00' : '#1a1a1a',
                color:      input.trim() && !sending && !confirmed ? '#0D0D0D' : '#444',
              }}>
              {sending ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : '↑'}
            </motion.button>
          </form>
          {confirmed && (
            <p className="text-center text-xs mt-2" style={{ color: '#34D399' }}>
              ✅ Kasus ini telah selesai — chat dinonaktifkan
            </p>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Selesai */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div key="modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            onClick={() => setShowConfirmModal(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 max-w-sm w-full text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-lg font-black text-white mb-2">Konfirmasi Selesai?</h3>
              <p className="text-sm mb-6" style={{ color: '#8C8C8C' }}>
                Ini akan menandai barang telah kembali ke pemiliknya dan menutup laporan ini.
              </p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: '#1a1a1a', color: '#8C8C8C', border: '1px solid #2a2a2a' }}>
                  Batal
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleKonfirmasi}
                  className="flex-1 py-3 rounded-xl text-sm font-bold btn-lime">
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
