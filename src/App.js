import { useState } from 'react'
import './styles.css'

export default function App() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) return

    setLoading(true)
    setResult('')
    
    try {
      const response = await fetch(`https://api.genderize.io?name=${name.trim()}`)
      const data = await response.json()
      
      if (data.gender) {
        setResult(`${data.name}: ${data.gender} (${Math.round(data.probability * 100)}% confidence)`)
      } else {
        setResult(`Gender for "${data.name}" could not be determined`)
      }
    } catch (error) {
      setResult('Error: Unable to fetch gender prediction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Gender Predictor</h1>
        <GenderForm 
          name={name} 
          onNameChange={setName} 
          onSubmit={handleSubmit}
          loading={loading}
        />
        {result && <div className="result">{result}</div>}
      </div>
    </div>
  )
}

function GenderForm({ name, onNameChange, onSubmit, loading }) {
  const handleFormSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form className="form" onSubmit={handleFormSubmit}>
      <input
        className="input"
        type="text"
        placeholder="Enter a name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        disabled={loading}
      />
      <button 
        type="submit" 
        className="button"
        disabled={loading || !name.trim()}
      >
        {loading ? 'Checking...' : 'Predict Gender'}
      </button>
    </form>
  )
}