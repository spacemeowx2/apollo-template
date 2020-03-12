import React from 'react'
import './App.css'
import { useHelloWorldQuery } from './generated/graphql'

function App() {
  const { data, loading, error } = useHelloWorldQuery()

  return (
    <div className="App">
      <header className="App-header">
        <div>Loading: { String(loading) }</div>
        <div>Data: { JSON.stringify(data) }</div>
        <div>Error: { String(error) }</div>
      </header>
    </div>
  )
}

export default App
