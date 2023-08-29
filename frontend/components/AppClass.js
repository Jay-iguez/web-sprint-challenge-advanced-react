import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default class AppClass extends React.Component {
  constructor(){
    super()
    this.state ={
      selectedIndex: initialIndex,
      stepCount: initialSteps,
      message: initialMessage,
      email: initialEmail
    }
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = (reset) => {
    if (reset === 'reset') {
      this.setState(() => ({
        selectedIndex: initialIndex,
        stepCount: initialSteps, 
        message: initialMessage,
        email: initialEmail
      }))
    }

    let xMap = {'0': 1, '1': 2, '2': 3, '3': 1, '4': 2, '5': 3, '6': 1, '7': 2, '8': 3}
    let coordinates = {x: 0, y: 0}
    if (this.state.selectedIndex >= 0 && this.state.selectedIndex <= 2) {
      const y = 1
      coordinates = {x: xMap[this.state.selectedIndex], y: y}
    } else if (this.state.selectedIndex >= 3 && this.state.selectedIndex <= 5) {
      const y = 2
      coordinates = {x: xMap[this.state.selectedIndex], y: y}
    } else if (this.state.selectedIndex >= 6 && this.state.selectedIndex <= 8) {
      const y = 3
      coordinates = {x: xMap[this.state.selectedIndex], y: y}
    }

    return coordinates
  }

  getXYMessage = () => {
    const coordinates = this.getXY()
    return `Coordinates (${coordinates.x}, ${coordinates.y})`
  }

  reset = (reset) => {
    this.getXY(reset)
  }

  move = (direction) => {
    if (direction === 'left') {
      this.setState({selectedIndex : this.state.selectedIndex - 1})
    } else if (direction === 'up'){
      this.setState({selectedIndex : this.state.selectedIndex - 3})
    } else if (direction === 'right'){
      this.setState({selectedIndex : this.state.selectedIndex + 1})
    } else if (direction === 'down'){
      this.setState({selectedIndex : this.state.selectedIndex + 3})
    }
    this.setState(() => ({
      stepCount : this.state.stepCount + 1,
      message: initialMessage
    }))
  }

  getNextIndex = (direction) => {
    let coordinates = this.getXY()

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
      this.setState({message : `You can't go ${direction}`})
    } else {
      this.move(direction)
    }
  }

 
  onChange = (evt) => {
    const {value} = evt.target
    this.setState({email : value})
  }

  onSubmit = (evt) => {
    evt.preventDefault()

    if (this.state.email === ''){
      this.setState({message : 'Ouch: email is required'})
      return
    }

    const coordinates = this.getXY()
    const payloadData = {'x' : coordinates.x, 'y' : coordinates.y, 'steps' : this.state.stepCount, 'email': this.state.email}
    axios.post('http://localhost:9000/api/result', payloadData)
    .then(res => {
      this.setState(() => ({
        message : res.data.message,
        email : initialEmail
      }))
    })
    .catch(err => {
      this.setState({message : err.response.data.message})
    })
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.stepCount} {this.state.stepCount === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.selectedIndex ? ' active' : ''}`}>
                {idx === this.state.selectedIndex ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={(e) => {this.getNextIndex(e.target.id)}}>LEFT</button>
          <button id="up" onClick={(e) => {this.getNextIndex(e.target.id)}}>UP</button>
          <button id="right" onClick={(e) => {this.getNextIndex(e.target.id)}}>RIGHT</button>
          <button id="down" onClick={(e) => {this.getNextIndex(e.target.id)}}>DOWN</button>
          <button id="reset" onClick={() => {this.reset('reset')}}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" value={this.state.email} onChange={this.onChange} placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
