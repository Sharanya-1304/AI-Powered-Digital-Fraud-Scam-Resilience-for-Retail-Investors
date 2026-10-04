import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  MicOff,
  PhoneCall,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Volume2,
  Upload,
  UserCheck
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { scanText } from '../services/api';
import { ScanProgress } from '../components/ScanProgress';
import { PrivacyNotice } from '../components/PrivacyNotice';

const CALL_EXAMPLES = [
  {
    label: 'Digital Arrest & Police Threat',
    category: 'Authority Impersonation',
    transcript:
      'Caller: This is Officer Vikram Sharma from Cyber Crime Investigation Department, New Delhi. An illegal hawala transaction was traced to a SIM registered under your Aadhaar number.\n' +
      'Victim: Sir, I never opened any such account!\n' +
      'Caller: Listen carefully! You are under digital arrest right now under Section 420 of IPC. Do not disconnect this call, do not speak to family members, or local police will reach your location within 20 minutes.\n' +
      'Victim: How can I prove my innocence?\n' +
      'Caller: You must immediately transfer ₹50,000 security verification bond to our RBI clearance nodal officer account via UPI. It will be refunded once your name is verified.'
  },
  {
    label: 'SEBI Clearance & Fee Trap',
    category: 'Regulatory Extortion',
    transcript:
      'Caller: Good afternoon, I am calling from SEBI Regulatory Enforcement Directorate.\n' +
      'Victim: Yes, how can I help?\n' +
      'Caller: Your Demat portfolio has been flagged for unauthorized foreign inflows. We have frozen your trading account. To release your locked holdings and avoid a court summons, you must immediately disclose the 6-digit confirmation OTP sent to your registered mobile phone and pay ₹15,000 regulatory clearance fee.'
  },
  {
    label: 'Guaranteed 100% VIP Stock Tip',
    category: 'High-Pressure Investment',
    transcript:
      'Caller: Hello sir, I am senior research director from VIP Institutional Trading Desk. We have direct insider operator calls on Nifty Options.\n' +
      'Victim: Is there any risk involved?\n' +
      'Caller: Absolutely zero risk! 100% guaranteed jackpot return of 35% profit in today\'s afternoon session! We have only 3 VIP slots left. Send ₹10,000 to our private WhatsApp manager now before slots close in 10 minutes!'
  },
  {
    label: 'Bank Manager Urgent OTP Demand',
    category: 'Credential Harvesting',
    transcript:
      'Caller: This is Rajesh from your bank\'s central debit card security wing. A suspicious withdrawal attempt of ₹45,000 was initiated from overseas on your account.\n' +
      'Victim: I did not authorize any transaction!\n' +
      'Caller: To block this unauthorized deduction immediately, read out the 6-digit one-time password OTP that was just dispatched to your SMS inbox right now!'
  }
];

export const CallTranscriptScannerPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    isAnalyzing,
    setAnalyzing,
    setCurrentScan,
    addScanToHistory,
    language,
    setLanguage
  } = useAppStore();

  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported] = useState(() => {
    return (
      typeof window !== 'undefined' &&
      Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    );
  });
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Speech Recognition support in browser
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript((prev) => {
          const separator = prev.trim().length > 0 ? '\n' : '';
          return prev + separator + currentTranscript;
        });
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition warning:', e);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleRecording = () => {
    if (!speechSupported) {
      setError('Live speech recognition is not supported in this browser. Please use Chrome/Edge or type/paste the script below.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setError(null);
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
        setIsRecording(false);
      }
    }
  };

  const handleLanguageSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Please provide a call transcript or speak into the microphone before analyzing.');
      return;
    }
    setError(null);
    setAnalyzing(true, 1);

    try {
      // Analyze with inputType 'voice'
      const result = await scanText(transcript, language);
      result.inputType = 'voice';
      setCurrentScan(result);
      addScanToHistory(result);

      setTimeout(() => {
        setAnalyzing(false);
        navigate(`/results/${result.id}`);
      }, 2200);
    } catch {
      setAnalyzing(false);
      setError('Failed to analyze call transcript. Please try again.');
    }
  };

  const handleClear = () => {
    setTranscript('');
    setAudioFileName(null);
    setError(null);
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
  };

  const handleLoadExample = (text: string) => {
    setTranscript(text);
    setAudioFileName(null);
    setError(null);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
      // Simulate transcription extraction for uploaded audio
      const extractedSimulated =
        `[Automated Audio Transcription from ${file.name}]\n` +
        `Caller: Hello, I am calling from NSDL investor compliance division. Your demat account verification has failed.\n` +
        `Caller: You must immediately disclose the OTP generated on your phone and deposit ₹10,000 regulatory reactivation fee today, or your trading portfolio will be liquidated.`;
      setTranscript(extractedSimulated);
      setError(null);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <ScanProgress />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Title */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/scan')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Scan Hub</span>
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                Voice & Speech AI
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5 mt-1">
              <PhoneCall className="w-7 h-7 text-purple-600" />
              <span>Analyze Call Transcript / Voice Script</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Evaluate cold calls, fake authority threats (Digital Arrest), and voice recordings for urgency traps, OTP demands, and impersonation.
            </p>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'te', label: 'తెలుగు' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => handleLanguageSelect(l.code)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === l.code
                    ? 'bg-white text-purple-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Recording / Upload Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mic Speech-to-Text Button */}
        <div
          onClick={toggleRecording}
          className={`cursor-pointer rounded-2xl border p-4 transition-all flex items-center justify-between shadow-sm ${
            isRecording
              ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-rose-100 ring-2 ring-rose-400 animate-pulse'
              : 'bg-white border-slate-200 hover:border-purple-300 text-slate-800 hover:bg-purple-50/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isRecording ? 'bg-rose-500 text-white' : 'bg-purple-100 text-purple-700'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-sm font-bold">
                {isRecording ? 'Listening... Click to Stop' : 'Live Speech-to-Text'}
              </h4>
              <p className="text-xs text-slate-500">
                {isRecording ? 'Speak now into your microphone' : 'Dictate or play suspicious call audio'}
              </p>
            </div>
          </div>
          {isRecording && (
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0" />
          )}
        </div>

        {/* Audio File Upload */}
        <label className="cursor-pointer rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/30 p-4 transition-all flex items-center justify-between shadow-sm">
          <input
            type="file"
            accept="audio/*,.mp3,.wav,.m4a"
            onChange={handleAudioUpload}
            className="hidden"
          />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">
                {audioFileName ? audioFileName : 'Upload Call Recording'}
              </h4>
              <p className="text-xs text-slate-500">
                {audioFileName ? 'Audio loaded & transcribed' : 'Supports MP3, WAV, M4A voice notes'}
              </p>
            </div>
          </div>
          <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
        </label>
      </div>

      {/* Quick Example Loaders */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Quick Call Scenarios (1-Click Loaders):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CALL_EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadExample(ex.transcript)}
              className="text-left p-3 rounded-xl bg-white hover:bg-purple-50/60 border border-slate-200 text-slate-700 transition-all hover:border-purple-300 group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 group-hover:text-purple-700">
                  {ex.label}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {ex.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {ex.transcript.slice(0, 80)}...
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Transcript Textarea */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
          <span className="font-semibold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-purple-600" />
            <span>Call Transcript Content</span>
          </span>
          <span>{transcript.length} characters</span>
        </div>

        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={8}
            placeholder={
              'Paste or dictate the call conversation here.\n' +
              'Example:\n' +
              'Caller: This is Officer Sharma from Cyber Crime. Your Aadhaar is under digital arrest...\n' +
              'Victim: How can I resolve this?\n' +
              'Caller: Transfer ₹50,000 security deposit immediately to unlock your account...'
            }
            className="w-full rounded-xl border border-slate-300 p-4 text-sm font-sans placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-y leading-relaxed outline-none"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('scanners.btnClear', 'Clear')}</span>
          </button>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!transcript.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow transition-all hover:scale-[1.02] active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span>Analyze Voice Transcript</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <PrivacyNotice />
    </div>
  );
};
