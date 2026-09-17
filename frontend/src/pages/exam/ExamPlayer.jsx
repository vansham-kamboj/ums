import { useState, useEffect, useRef } from 'react';
import { Clock, ChevronRight, ChevronLeft, Flag, CheckCircle, AlertCircle, Loader2, Timer } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';

const DEMO_EXAM = {
  title: 'Data Structures - Mid Term',
  duration: 45,
  totalQuestions: 15,
  questions: Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    text: [
      'What is the time complexity of binary search?',
      'Which data structure uses FIFO principle?',
      'What is the worst-case complexity of quicksort?',
      'Which traversal of BST gives sorted output?',
      'What is a complete binary tree?',
      'Which data structure is used for BFS?',
      'What is the space complexity of merge sort?',
      'What is the maximum height of an AVL tree with n nodes?',
      'Which sorting algorithm is stable?',
      'What is hashing?',
      'Explain the difference between stack and queue.',
      'What is a graph data structure?',
      'What is dynamic programming?',
      'Explain linked list reversal.',
      'What is the amortized cost of ArrayList add?',
    ][i],
    type: i < 10 ? 'mcq' : 'short',
    options: i < 10 ? [
      { id: 'a', text: ['O(log n)', 'Queue', 'O(n²)', 'Inorder', 'All levels full except last', 'Queue', 'O(n)', 'O(log n)', 'Merge Sort', 'Mapping keys to values'][i] },
      { id: 'b', text: ['O(n)', 'Stack', 'O(n log n)', 'Preorder', 'All leaves at same level', 'Stack', 'O(1)', 'O(n)', 'Quick Sort', 'Linear probing'][i] },
      { id: 'c', text: ['O(n²)', 'Array', 'O(n)', 'Postorder', 'Each node has 2 children', 'Priority Queue', 'O(log n)', 'O(n log n)', 'Heap Sort', 'Binary search'][i] },
      { id: 'd', text: ['O(1)', 'Linked List', 'O(log n)', 'Level order', 'Max 2 children', 'Deque', 'O(n²)', 'O(sqrt(n))', 'Selection Sort', 'Sorting'][i] },
    ] : [],
    marks: i < 10 ? 2 : 4,
    correctAnswer: 'a',
  })),
};

export default function ExamPlayer() {
  const toast = useToast();
  const navigate = useNavigate();
  const [exam] = useState(DEMO_EXAM);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (started && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, submitted]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (qId, answer) => {
    setAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const toggleFlag = (qId) => {
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(qId) ? next.delete(qId) : next.add(qId);
      return next;
    });
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    setSubmitted(true);
    setShowSubmitConfirm(false);
    toast.success('Exam submitted successfully!');
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = exam.totalQuestions - answeredCount;
  const question = exam.questions[currentQ];
  const isWarning = timeLeft < 300; // < 5 min

  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="bg-surface border border-border rounded-md p-8 max-w-lg text-center">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
            <Timer className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">{exam.title}</h1>
          <div className="space-y-2 mb-6 text-sm text-text-secondary">
            <p>{exam.totalQuestions} Questions • {exam.duration} Minutes</p>
            <p>Total Marks: {exam.questions.reduce((s, q) => s + q.marks, 0)}</p>
          </div>
          <div className="bg-warning-100 text-warning-600 rounded-md p-3 text-xs mb-6">
            <AlertCircle className="w-4 h-4 inline mr-1" /> Timer starts once you click Begin. Do not refresh the page during the exam.
          </div>
          <button onClick={() => setStarted(true)}
            className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-md transition-colors text-sm">
            Begin Exam
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="bg-surface border border-border rounded-md p-8 max-w-lg text-center">
          <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Exam Submitted</h1>
          <p className="text-sm text-text-secondary mb-4">You answered {answeredCount} out of {exam.totalQuestions} questions</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-bg rounded-md p-3">
              <p className="text-xs text-text-disabled">Answered</p>
              <p className="text-lg font-bold text-success-600">{answeredCount}</p>
            </div>
            <div className="bg-bg rounded-md p-3">
              <p className="text-xs text-text-disabled">Skipped</p>
              <p className="text-lg font-bold text-warning-600">{unansweredCount}</p>
            </div>
          </div>
          <button onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md transition-colors">
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in" style={{ minHeight: 'calc(100vh - 160px)' }}>
      {/* Question Panel */}
      <div className="flex-1 flex flex-col">
        {/* Timer Header */}
        <div className="bg-surface border border-border rounded-md px-5 py-3 mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">{exam.title}</h2>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-mono font-bold ${
            isWarning ? 'bg-danger-100 text-danger-600 animate-pulse' : 'bg-bg text-text-primary'
          }`}>
            <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question */}
        <div className="bg-surface border border-border rounded-md p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-text-disabled">Question {currentQ + 1} of {exam.totalQuestions}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 bg-brand-100 text-brand-600 rounded">{question.marks} marks</span>
              <button onClick={() => toggleFlag(question.id)}
                className={`p-1.5 rounded-md transition-colors ${flagged.has(question.id) ? 'bg-warning-100 text-warning-600' : 'text-text-disabled hover:text-warning-600 hover:bg-warning-100'}`}>
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-base text-text-primary font-medium mb-6">{question.text}</p>

          {question.type === 'mcq' ? (
            <div className="space-y-3">
              {question.options.map(opt => (
                <button key={opt.id} onClick={() => handleAnswer(question.id, opt.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-md border-2 transition-all ${
                    answers[question.id] === opt.id
                      ? 'border-brand-600 bg-brand-100/50'
                      : 'border-border hover:border-brand-500/30'
                  }`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full border mr-3 text-xs font-medium ${
                    answers[question.id] === opt.id ? 'bg-brand-600 text-white border-brand-600' : 'border-border text-text-disabled'
                  }`}>{opt.id.toUpperCase()}</span>
                  <span className="text-sm text-text-primary">{opt.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <textarea value={answers[question.id] || ''} onChange={e => handleAnswer(question.id, e.target.value)}
              placeholder="Type your answer here..." rows={5}
              className="w-full px-4 py-3 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 resize-none" />
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-auto pt-6">
            <button onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))} disabled={currentQ === 0}
              className="px-4 py-2 border border-border text-text-secondary text-sm rounded-md hover:bg-bg disabled:opacity-30 inline-flex items-center gap-1.5">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {currentQ < exam.totalQuestions - 1 ? (
              <button onClick={() => setCurrentQ(prev => prev + 1)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm rounded-md inline-flex items-center gap-1.5">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setShowSubmitConfirm(true)}
                className="px-6 py-2 bg-success-600 hover:bg-success-600/90 text-white text-sm font-medium rounded-md inline-flex items-center gap-1.5">
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Navigator Sidebar */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-surface border border-border rounded-md p-4 sticky top-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Question Navigator</h3>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {exam.questions.map((q, i) => {
              const answered = answers[q.id] !== undefined;
              const isFlagged = flagged.has(q.id);
              const isCurrent = i === currentQ;
              return (
                <button key={q.id} onClick={() => setCurrentQ(i)}
                  className={`w-full aspect-square rounded-md text-xs font-medium transition-all relative ${
                    isCurrent ? 'ring-2 ring-brand-600 ring-offset-1' : ''
                  } ${
                    answered ? 'bg-success-600 text-white' :
                    isFlagged ? 'bg-warning-100 text-warning-600 border border-warning-300' :
                    'bg-bg text-text-disabled border border-border'
                  }`}>
                  {i + 1}
                  {isFlagged && <Flag className="w-2 h-2 absolute top-0.5 right-0.5" />}
                </button>
              );
            })}
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-success-600" /><span className="text-text-secondary">Answered ({answeredCount})</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-bg border border-border" /><span className="text-text-secondary">Not Answered ({unansweredCount})</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-warning-100 border border-warning-300" /><span className="text-text-secondary">Flagged ({flagged.size})</span></div>
          </div>
          <button onClick={() => setShowSubmitConfirm(true)}
            className="w-full mt-4 py-2.5 bg-success-600 hover:bg-success-600/90 text-white text-sm font-medium rounded-md transition-colors">
            Submit Exam
          </button>
        </div>
      </div>

      <Modal isOpen={showSubmitConfirm} onClose={() => setShowSubmitConfirm(false)} title="Submit Exam?">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Are you sure you want to submit? You cannot change answers after submission.</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-success-100 rounded-md p-2"><p className="text-lg font-bold text-success-600">{answeredCount}</p><p className="text-xs text-success-600">Answered</p></div>
            <div className="bg-bg rounded-md p-2"><p className="text-lg font-bold text-text-primary">{unansweredCount}</p><p className="text-xs text-text-disabled">Unanswered</p></div>
            <div className="bg-warning-100 rounded-md p-2"><p className="text-lg font-bold text-warning-600">{flagged.size}</p><p className="text-xs text-warning-600">Flagged</p></div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowSubmitConfirm(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Review Again</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-success-600 text-white text-sm font-medium rounded-md hover:bg-success-600/90">Submit</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
