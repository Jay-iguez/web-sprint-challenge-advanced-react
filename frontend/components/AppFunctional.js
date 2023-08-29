import React, { useEffect, useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = {email: ''}
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const [stepCount, setStepCount] = useState(initialSteps)
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)

  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  function getXY(reset) {
    if (reset === 'reset') {
      setSelectedIndex(initialIndex)
      setMessage('')
      setStepCount(0)
      setEmail(initialEmail)
    }

    let xMap = {'0': 1, '1': 2, '2': 3, '3': 1, '4': 2, '5': 3, '6': 1, '7': 2, '8': 3}
    let coordinates = {x: 0, y: 0}
    if (selectedIndex >= 0 && selectedIndex <= 2) {
      const y = 1
      coordinates = {x: xMap[selectedIndex], y: y}
    } else if (selectedIndex >= 3 && selectedIndex <= 5) {
      const y = 2
      coordinates = {x: xMap[selectedIndex], y: y}
    } else if (selectedIndex >= 6 && selectedIndex <= 8) {
      const y = 3
      coordinates = {x: xMap[selectedIndex], y: y}
    } 
    
    return coordinates
  }

  function getXYMessage() {
    const coordinates = getXY()
    return `Coordinates (${coordinates.x}, ${coordinates.y})`
  }

  function reset(reset) {
    // Use this helper to reset all states to their initial values.
    getXY(reset)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let coordinates = getXY()

    let checkMove = `${coordinates.x}, ${coordinates.y} : ${direction}`
    const nonMovableMap = {
      '1, 1 : left' : 'no',
      '1, 2 : left' : 'no', 
      '1, 3 : left' : 'no',
      '3, 3 : right' : 'no',
      '3, 2 : right' : 'no',
      '3, 1 : right' : 'no',
      '2, 1 : up' : 'no',
      '3, 1 : up' : 'no',
      '1, 1 : up' : 'no',
      '3, 3 : down' : 'no',
      '2, 3 : down' : 'no',
      '1, 3 : down' : 'no',
    }

    if (nonMovableMap[checkMove] === 'no') {
      setMessage(`You can't go ${direction}`)
    } else {
      move(direction)
    }
  }

  function move(direction) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    if (direction === 'left') {
      setSelectedIndex(selectedIndex - 1)
    } else if (direction === 'up'){
      setSelectedIndex(selectedIndex - 3)
    } else if (direction === 'right'){
      setSelectedIndex(selectedIndex + 1)
    } else if (direction === 'down'){
      setSelectedIndex(selectedIndex + 3)
    }
    setStepCount(stepCount + 1)
    setMessage(initialMessage)
  }

  function onChange(e) {
    // You will need this to update the value of the input.
    const {name, value} = e.target
    setEmail({...email, [name] : value})
  }

  function onSubmit(e) {
    // Use a POST request to send a payload to the server.
    e.preventDefault() 
    if(email.email === 'foo@bar.baz'){
      setMessage('foo@bar.baz failure #23')
      setEmail(initialEmail)
      return
    }

    const coordinates = getXY()
    const payloadData = {'x' : coordinates.x, 'y' : coordinates.y, 'steps' : stepCount, email: email.email}
    axios.post('http://localhost:9000/api/result', payloadData)
    .then(res => {
      setMessage(res.data.message)
      setEmail(initialEmail)
    })
    .catch(err => {
      console.error(err)
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {stepCount} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2,
           3, 4, 5,
           6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === selectedIndex ? ' active' : ''}`}>
              {idx === selectedIndex ? 'B' : null}
            </div>
           ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={(e) => {getNextIndex(e.target.id)}}>LEFT</button>
        <button id="up" onClick={(e) => {getNextIndex(e.target.id)}}>UP</button>
        <button id="right" onClick={(e) => {getNextIndex(e.target.id)}}>RIGHT</button>
        <button id="down" onClick={(e) => {getNextIndex(e.target.id)}}>DOWN</button>
        <button id="reset" onClick={() => {reset('reset')}}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" name="email" value={email.email} onChange={onChange} placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
