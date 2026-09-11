import { useState } from 'react'

const App = () => {
    const [text, setText] = useState('')
    const [newText, setNewText] = useState('');

    const handleTextChange = e => setNewText(e.target.value)

    const saveText = e => {
        e.preventDefault()

        setText(newText)
        setNewText('')
    }

    return (
        <>
            <form onSubmit={saveText}>
                <textarea value={newText} onChange={handleTextChange}/>
                <div>
                    <button type="submit">Analyze</button>
                </div>
            </form>

            <p>Entered text: {text}</p>

            <p>debug: {newText}</p>
        </>
    )
}

export default App