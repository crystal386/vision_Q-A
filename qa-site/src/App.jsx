import { useState } from 'react'
import './App.css'

const initialQuestions = [
  {
    id: 1,
    title: 'React で状態管理を行う最佳な方法は何ですか？',
    content: '現在、useState を使用していますが、複雑な状態管理が必要になりました。Redux や Context API など、どのような選択肢がありますか？それぞれの利点と欠点を教えてください。',
    author: 'tanaka_dev',
    likes: 24,
    answers: 5,
    tags: ['React', 'JavaScript', '状態管理'],
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'TypeScript のジェネリクスについて理解したい',
    content: 'ジェネリクスの概念は理解できるのですが、実際のプロジェクトでどのように活用すればよいのかがわかりません。具体的な使用例を教えてください。',
    author: 'yamada_code',
    likes: 18,
    answers: 3,
    tags: ['TypeScript', 'JavaScript'],
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    title: 'CSS Grid と Flexbox の使い分け方は？',
    content: 'レイアウトを作成する際に、Grid と Flexbox のどちらを使うべきか迷います。それぞれの適したユースケースを教えてください。',
    author: 'suzuki_css',
    likes: 32,
    answers: 7,
    tags: ['CSS', 'レイアウト'],
    createdAt: '2024-01-13'
  }
]

function App() {
  const [questions, setQuestions] = useState(initialQuestions)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', tags: '' })

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSubmitQuestion = (e) => {
    e.preventDefault()
    const question = {
      id: questions.length + 1,
      title: newQuestion.title,
      content: newQuestion.content,
      author: 'guest_user',
      likes: 0,
      answers: 0,
      tags: newQuestion.tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: new Date().toISOString().split('T')[0]
    }
    setQuestions([question, ...questions])
    setNewQuestion({ title: '', content: '', tags: '' })
    setShowModal(false)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">Q</span>
            QA Site
          </h1>
          <div className="search-box">
            <input
              type="text"
              placeholder="質問を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            className="ask-btn"
            onClick={() => setShowModal(true)}
          >
            質問する
          </button>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-number">{questions.length}</span>
              <span className="stat-label">質問</span>
            </div>
            <div className="stat">
              <span className="stat-number">{questions.reduce((sum, q) => sum + q.answers, 0)}</span>
              <span className="stat-label">回答</span>
            </div>
            <div className="stat">
              <span className="stat-number">{questions.reduce((sum, q) => sum + q.likes, 0)}</span>
              <span className="stat-label">いいね</span>
            </div>
          </div>

          <div className="questions-list">
            {filteredQuestions.map(question => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="no-results">
              <p>該当する質問が見つかりませんでした</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmitQuestion} className="question-form">
            <h2>新しい質問</h2>
            <div className="form-group">
              <label>タイトル</label>
              <input
                type="text"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                placeholder="質問のタイトルを入力"
                required
              />
            </div>
            <div className="form-group">
              <label>内容</label>
              <textarea
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                placeholder="詳細な説明を入力"
                rows="5"
                required
              />
            </div>
            <div className="form-group">
              <label>タグ（カンマ区切り）</label>
              <input
                type="text"
                value={newQuestion.tags}
                onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                placeholder="React, JavaScript, CSS"
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                キャンセル
              </button>
              <button type="submit" className="submit-btn">
                投稿する
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function QuestionCard({ question }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(question.likes)

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1)
    } else {
      setLikes(likes - 1)
    }
    setLiked(!liked)
  }

  return (
    <article className="question-card">
      <div className="question-votes">
        <button 
          className={`vote-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          ▲
        </button>
        <span className="vote-count">{likes}</span>
      </div>
      
      <div className="question-content">
        <h3 className="question-title">{question.title}</h3>
        <p className="question-excerpt">{question.content}</p>
        
        <div className="question-meta">
          <div className="tags">
            {question.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          
          <div className="meta-info">
            <span className="author">{question.author}</span>
            <span className="date">{question.createdAt}</span>
            <span className="answers-count">{question.answers} 回答</span>
          </div>
        </div>
      </div>
    </article>
  )
}

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
}

export default App
