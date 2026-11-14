import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { quizzes } from './data'
import { assess, answeredPrefix, nextQuestionIndex } from './engine'
import type { Answers, Assessment, Outcome, Quiz } from './types'

type Stage = 'intro' | 'question' | 'result' | 'preview'
type Save = Record<string, Answers>
const STORAGE_KEY = 'quiz-site-builder-demo-v1'
const modeNames: Record<Quiz['mode'], string> = {
  personality: '人格映射', survival: '剧情生存', diagnostic: '优势探索',
}

function readSaved(): Save {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Save : {}
  } catch { return {} }
}

function resultUrl(quiz: Quiz, resultId: string): string {
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('quiz', quiz.id)
  url.searchParams.set('result', resultId)
  return url.toString()
}

function makeShareCard(quiz: Quiz, outcome: Outcome, result: Assessment | null) {
  const canvas = document.createElement('canvas')
  canvas.width = 900
  canvas.height = 1200
  const c = canvas.getContext('2d')
  if (!c) return
  const accent = quiz.theme.accent
  c.fillStyle = quiz.theme.paper
  c.fillRect(0, 0, 900, 1200)
  c.globalAlpha = .17
  c.strokeStyle = accent
  for (let i = 0; i < 6; i++) {
    c.lineWidth = i % 2 ? 2 : 1
    c.beginPath()
    c.arc(725, 220, 120 + i * 45, 0, Math.PI * 2)
    c.stroke()
  }
  c.globalAlpha = 1
  c.strokeStyle = accent
  c.lineWidth = 3
  c.strokeRect(43, 43, 814, 1114)
  c.lineWidth = 1
  c.strokeRect(56, 56, 788, 1088)
  c.fillStyle = accent
  c.font = '600 26px system-ui, sans-serif'
  c.fillText('QUIZ SITE BUILDER  /  心象测试局', 102, 148)
  c.fillStyle = '#403D39'
  c.font = '30px system-ui, sans-serif'
  c.fillText(quiz.title, 102, 258)
  if (result?.episode) {
    c.font = '26px system-ui, sans-serif'
    c.fillStyle = accent
    c.fillText(`剧情抵达 · 第 ${result.episode} 幕`, 102, 326)
  }
  c.fillStyle = '#262421'
  c.font = 'bold 94px "Noto Serif CJK SC", "Songti SC", serif'
  c.fillText(outcome.title, 98, 471)
  c.fillStyle = accent
  c.fillRect(102, 515, 80, 5)
  c.fillStyle = '#292824'
  wrapCanvasText(c, outcome.subtitle, 102, 595, 680, 56, 'bold 40px system-ui, sans-serif', 2)
  c.fillStyle = '#5D5952'
  wrapCanvasText(c, outcome.story, 102, 760, 690, 43, '30px system-ui, sans-serif', 5)
  c.fillStyle = accent
  c.font = 'bold 29px system-ui, sans-serif'
  wrapCanvasText(c, outcome.shareLine, 102, 1045, 690, 40, 'bold 29px system-ui, sans-serif', 2)
  c.fillStyle = '#77716B'
  c.font = '24px system-ui, sans-serif'
  c.fillText('原创互动测试 · 娱乐与自我探索', 102, 1114)
  const a = document.createElement('a')
  a.download = `${quiz.id}-${outcome.title}-结果卡.png`
  a.href = canvas.toDataURL('image/png')
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function wrapCanvasText(
  c: CanvasRenderingContext2D, text: string, x: number, y: number,
  maxWidth: number, lineHeight: number, font: string, maxLines: number,
) {
  c.font = font
  let line = ''
  let row = 0
  for (const char of Array.from(text)) {
    if (c.measureText(line + char).width > maxWidth && line) {
      c.fillText(line, x, y + row * lineHeight)
      row++
      line = ''
      if (row >= maxLines) return
    }
    line += char
  }
  if (row < maxLines && line) c.fillText(line, x, y + row * lineHeight)
}

function App() {
  const initial = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const qid = params.get('quiz')
    const quiz = quizzes.find(q => q.id === qid) ?? quizzes[0]
    const rid = params.get('result')
    return { quiz, rid: rid && quiz.outcomes[rid] ? rid : null }
  }, [])
  const [quizId, setQuizId] = useState(initial.quiz.id)
  const [stage, setStage] = useState<Stage>(initial.rid ? 'preview' : 'intro')
  const [previewId, setPreviewId] = useState<string | null>(initial.rid)
  const [saved, setSaved] = useState<Save>(readSaved)
  const [cursor, setCursor] = useState(0)
  const [toast, setToast] = useState('')
  const quiz = quizzes.find(q => q.id === quizId) ?? quizzes[0]
  const answers = saved[quiz.id] ?? {}
  const assessment = assess(quiz, answers)
  const currentQuestion = quiz.questions[Math.min(cursor, quiz.questions.length - 1)]
  const shownId = stage === 'preview' ? previewId : assessment?.outcomeId
  const outcome = shownId ? quiz.outcomes[shownId] : null

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)) } catch { /* safe fallback */ }
  }, [saved])

  function selectQuiz(id: string) {
    setQuizId(id)
    setStage('intro')
    setPreviewId(null)
    setToast('')
    window.history.replaceState({}, '', window.location.pathname)
  }
  function startQuiz() {
    setPreviewId(null)
    const target = nextQuestionIndex(quiz, answers)
    if (target >= quiz.questions.length) setStage('result')
    else { setCursor(Math.max(0, target)); setStage('question') }
  }
  function answerQuestion(optionId: string) {
    const prefix = Object.fromEntries(quiz.questions.slice(0, cursor).map(q => [q.id, answers[q.id]]).filter((x): x is [string, string] => typeof x[1] === 'string'))
    const nextAnswers = { ...prefix, [currentQuestion.id]: optionId }
    setSaved(prev => ({ ...prev, [quiz.id]: nextAnswers }))
    setToast('')
    const result = assess(quiz, nextAnswers)
    if (result) setStage('result')
    else setCursor(cursor + 1)
  }
  function resetQuiz() {
    setSaved(prev => ({ ...prev, [quiz.id]: {} }))
    setStage('question')
    setPreviewId(null)
    setCursor(0)
    setToast('')
    window.history.replaceState({}, '', window.location.pathname)
  }
  async function copyLink() {
    if (!shownId) return
    const url = resultUrl(quiz, shownId)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(url)
      setToast('结果预览链接已复制，发给朋友看看吧。')
    } catch {
      window.prompt('复制下面的结果预览链接', url)
      setToast('可手动复制上面的链接。')
    }
  }
  function back() {
    if (cursor === 0) setStage('intro')
    else setCursor(cursor - 1)
  }
  const completedCount = answeredPrefix(quiz, answers)
  const isResumable = completedCount > 0 && !assessment

  return (
    <div className="app-shell" style={{ '--accent': quiz.theme.accent, '--paper': quiz.theme.paper } as CSSProperties}>
      <header className="site-header">
        <button className="brand" onClick={() => { setStage('intro'); setPreviewId(null) }} aria-label="返回测试首页">
          <span className="brand-mark">◈</span><span>心象测试局 <small>QUIZ STUDIO</small></span>
        </button>
        <span className="header-right"><span className="tiny-dot"/> ORIGINAL QUIZZES</span>
      </header>
      <main className="main">
        {stage === 'intro' && (
          <>
            <div className="section-label"><span className="number">01</span> CHOOSE YOUR STORY <span className="line" /></div>
            <div className="intro-layout">
              <section className="intro-copy">
                <div className="eyebrow">三个主题 · 三种探索自己的方式</div>
                <h1>你的故事，<br/><em>从选择开始。</em></h1>
                <p className="intro-desc">不是给你贴上一个标签，而是把那些习惯性的选择，变成一份可以保存的小小答案。</p>
                <div className="feature-tags"><span>无需注册</span><span>约 2 分钟</span><span>专属结果卡</span></div>
              </section>
              <section className="main-card">
                <div className="card-topline"><span>FEATURED EXPERIENCE</span><span>№ 00{quizzes.findIndex(q => q.id === quiz.id) + 1}</span></div>
                <div className="ornament" aria-hidden="true"><div className="ornament-inner">✦</div><div className="orbit orbit-a"/><div className="orbit orbit-b"/></div>
                <div className="mode-label">{modeNames[quiz.mode]} · {quiz.questions.length} 道题</div>
                <h2>{quiz.title}</h2>
                <p className="tagline">{quiz.tagline}</p>
                <p className="card-desc">{quiz.description}</p>
                <button className="primary-btn" onClick={startQuiz}>{assessment ? '查看我的结果 ↗' : isResumable ? `继续测试 · ${completedCount}/${quiz.questions.length} →` : '开始探索 →'}</button>
                <div className="card-foot"><span>THERE IS NO WRONG ANSWER</span><span>✶</span></div>
              </section>
            </div>
            <section className="choose-area" aria-label="切换测试类型">
              <div className="section-label"><span className="number">02</span> EXPLORE OTHER WORLDS <span className="line" /></div>
              <div className="quiz-switches">
                {quizzes.map((q, i) => (
                  <button key={q.id} onClick={() => selectQuiz(q.id)} className={`switch-card ${q.id === quiz.id ? 'active' : ''}`} aria-pressed={q.id === quiz.id}>
                    <span>0{i + 1} / {modeNames[q.mode]}</span><strong>{q.title}</strong><small>{q.tagline}</small><b>↗</b>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
        {stage === 'question' && (
          <section className="question-view">
            <div className="question-nav"><button className="text-btn" onClick={back}>← 返回</button><span>{quiz.title}</span><button className="text-btn" onClick={() => setStage('intro')}>退出</button></div>
            <div className="progress-label"><span>CHAPTER {String(cursor + 1).padStart(2, '0')} / {String(quiz.questions.length).padStart(2, '0')}</span><span>{Math.round(cursor / quiz.questions.length * 100)}%</span></div>
            <div className="progress-track"><span style={{ width: `${cursor / quiz.questions.length * 100}%` }}/></div>
            <div className="question-panel">
              <div className="question-illustration" aria-hidden="true"><span>✧</span><span>◈</span><span>✦</span></div>
              <div className="question-scene">{currentQuestion.scene || 'FOLLOW YOUR INSTINCT'}</div>
              {quiz.mode === 'survival' && <p className="episode">剧情节点 · 第 {currentQuestion.episode} 幕</p>}
              <h2>{currentQuestion.prompt}</h2>
              <div className="choices">
                {currentQuestion.options.map((opt, i) => (
                  <button key={opt.id} onClick={() => answerQuestion(opt.id)} className={`choice ${answers[currentQuestion.id] === opt.id ? 'chosen' : ''}`}>
                    <span className="letter">{String.fromCharCode(65 + i)}</span><span>{opt.label}</span><span className="choice-arrow">↗</span>
                  </button>
                ))}
              </div>
              <p className="privacy-note">没有对错 · 选择更接近真实想法的一项</p>
            </div>
          </section>
        )}
        {(stage === 'result' || stage === 'preview') && outcome && (
          <section className="result-view">
            <div className="result-heading"><span>✦ YOUR STORY REVEALED</span><button className="text-btn" onClick={() => { setStage('intro'); setPreviewId(null) }}>全部测试 ↗</button></div>
            {stage === 'preview' && <div className="preview-banner">这是一份好友分享的结果预览，并不是你的答题结果。</div>}
            <div className="result-paper">
              <div className="result-paper-top"><span>{quiz.title}</span><span>PERSONAL ARCHIVE · 001</span></div>
              <div className="seal">✦</div>
              <p className="result-pre">你的故事关键词</p>
              <h1>{outcome.title}</h1>
              <p className="result-sub">{outcome.subtitle}</p>
              {assessment?.episode && stage === 'result' && <p className="result-episode">剧情抵达 · 第 {assessment.episode} 幕</p>}
              <div className="fine-line" />
              <p className="result-story">{outcome.story}</p>
              <div className="insights"><div><h3>闪光时刻</h3>{outcome.strengths.map(x => <p key={x}>· {x}</p>)}</div><div><h3>下一步探索</h3>{outcome.advice.map(x => <p key={x}>· {x}</p>)}</div></div>
              <p className="result-quote">“{outcome.shareLine}”</p>
              <div className="result-paper-bottom">QUIZ STUDIO / MAKE SOMETHING MEANINGFUL</div>
            </div>
            <div className="result-actions"><button className="primary-btn" onClick={() => makeShareCard(quiz, outcome, stage === 'result' ? assessment : null)}>↓ 下载 3:4 结果卡</button><button className="outline-btn" onClick={copyLink}>↗ 复制结果链接</button></div>
            <button className="text-btn reset-link" onClick={resetQuiz}>{stage === 'preview' ? '我也要测试 →' : '再测一次 ↺'}</button>
            {toast && <p className="toast" role="status">{toast}</p>}
          </section>
        )}
      </main>
      <footer><span>心象测试局 · MADE WITH QUIZ SITE BUILDER</span><span>原创娱乐测评 · 结果仅供探索与分享</span></footer>
    </div>
  )
}

export default App
