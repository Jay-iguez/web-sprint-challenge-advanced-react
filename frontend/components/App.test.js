// Write your tests here
import server from '../../backend/mock-server'
import React from "react"
import AppClass from "./AppClass"
import { render, screen, fireEvent} from '@testing-library/react'


let up, down, left, right, submit, reset
let squares, coordinates, steps, message, email

const updateStatelessSelectors = document => {
   up = document.querySelector('#up')
   down = document.querySelector('#down')
   left = document.querySelector('#left')
   right = document.querySelector('#right')
   reset = document.querySelector('#reset')
   submit = document.querySelector('#submit')
}

const updateStatefulSelectors = document => {
   squares = document.querySelectorAll('.square')
   coordinates = document.querySelector('#coordinates')
   steps = document.querySelector('#steps')
   message = document.querySelector('#message')
   email = document.querySelector('#email')
}

const testSquares = (squares, activeIndex) => {
  squares.forEach((square, index) => {
    if (index === activeIndex) {
      expect(square.textContent).toBe('B')
      expect(square.className).toMatch(/active/)
    } else {
      expect(square.textContent).toBeFalsy()
      expect(square.className).not.toMatch(/active/)
    }
  })
}


test('AppClass mounts to screen', () => {
  render(<AppClass />)
})


describe('Movement of active square', function(){
  beforeAll(() => { server.listen() })
  afterAll(() => { server.close() })
    beforeEach(() => {
      render(<AppClass />)
      updateStatelessSelectors(document)
      updateStatefulSelectors(document)
    })
    afterEach(() => {
      server.resetHandlers()
      document.body.innerHTML = ''
    })

  test("Can move 'B' in a circle clock-wise and 'moved' be 10", () => {
    testSquares(squares, 4)

    fireEvent.click(left)
    fireEvent.click(up)
    fireEvent.click(right)
    fireEvent.click(right)
    fireEvent.click(down)
    fireEvent.click(down)
    fireEvent.click(left)
    fireEvent.click(left)
    fireEvent.click(up)
    fireEvent.click(right)

    testSquares(squares, 4)
  })

  test("Can't move up 3 times", () => {
    testSquares(squares, 4)
    expect(message.textContent).toBe('')

    fireEvent.click(up)
    fireEvent.click(up)
    fireEvent.click(up)

    testSquares(squares, 1)
    expect(message.textContent).toBe("You can't go up")
  })
})

describe('Appropriate elements render to screen', function(){
  beforeAll(() => { server.listen() })
  afterAll(() => { server.close() })
    beforeEach(() => {
      render(<AppClass />)
      updateStatelessSelectors(document)
      updateStatefulSelectors(document)
    })
    afterEach(() => {
      server.resetHandlers()
      document.body.innerHTML = ''
    })

    test('Email input takes in values from user', () => {
      const emailInput = screen.getByPlaceholderText('type email')

      fireEvent.change(emailInput, {target : {value: 'dogs@dogs.com'}})

      expect(emailInput.value).toBe('dogs@dogs.com')
    })

    test('Reset button is painted to DOM', async () => {
      const resetButton = screen.getByText('reset')

      expect(resetButton.textContent).toBe('reset')
    })

    test('Up button is painted to DOM', async () => {
      const upButton = screen.getByText('UP')

      expect(upButton.textContent).toBe('UP')
    })
})
