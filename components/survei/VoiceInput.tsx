'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Volume2, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { transcribeAndSummarizeVoiceObservation } from '@/lib/ai/assistant';

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function VoiceInput({ label, value, onChange, placeholder }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [supportSpeech, setSupportSpeech] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [structuredNotes, setStructuredNotes] = useState<{
    catatanTerstruktur: string;
    poinKunci: string[];
    anomaliTerdeteksi?: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSupportSpeech(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            onChange(value ? `${value} ${currentTranscript}` : currentTranscript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [value, onChange]);

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Speech start error:', e);
      }
    }
  };

  const handleSummarizeWithAI = () => {
    if (!value.trim()) return;
    setIsSummarizing(true);
    setTimeout(() => {
      const res = transcribeAndSummarizeVoiceObservation(value);
      setStructuredNotes(res);
      setIsSummarizing(false);
    }, 400);
  };

  const applyStructuredNotes = () => {
    if (structuredNotes) {
      onChange(structuredNotes.catatanTerstruktur);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-2">
          {supportSpeech && (
            <button
              type="button"
              onClick={toggleListen}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isListening ? 'Merekam...' : 'Input Suara'}</span>
            </button>
          )}

          {value.trim().length > 10 && (
            <button
              type="button"
              onClick={handleSummarizeWithAI}
              disabled={isSummarizing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
            >
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>{isSummarizing ? 'Merangkum...' : 'AI Rangkum Observasi'}</span>
            </button>
          )}
        </div>
      </div>

      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Ketik atau klik tombol rekam suara untuk mencatat observasi lapangan...'}
        className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
      />

      {/* Structured AI Analysis Preview */}
      {structuredNotes && (
        <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-[11px]">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hasil Analisis Catatan AI Lapangan:</span>
            </span>
            <button
              type="button"
              onClick={applyStructuredNotes}
              className="text-[10px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 hover:bg-indigo-100"
            >
              Gunakan Format Rapi
            </button>
          </div>

          <div className="space-y-1 text-slate-700">
            {structuredNotes.poinKunci.map((poin, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{poin}</span>
              </div>
            ))}
          </div>

          {structuredNotes.anomaliTerdeteksi && (
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>{structuredNotes.anomaliTerdeteksi}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VoiceInput;
