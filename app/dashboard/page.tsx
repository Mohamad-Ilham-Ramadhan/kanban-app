'use client'
import Draggable from "react-draggable"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "../_redux/store"
import Todo from "../_components/Todo"
import type { Todo as typeTodo } from "../_redux/reducers/taskReducer"
import { swap, move, resetY } from "../_redux/reducers/taskReducer"
import { useState } from "react"

export default function Drag() {
  const dispatch = useDispatch()
  const todos: typeTodo[] = useSelector((state: RootState) => state.todo.todos)
  // console.log('todos', todos)
  const [index1, setIndex1] = useState('')
  const [index2, setIndex2] = useState('')
  const [moveIndex, setMoveIndex] = useState('')
  const [moveY, setMoveY] = useState(0)
  console.log('index1', index1, 'index2', index2)

  /*
    dari bawah ke atas = selisih getBoundingClientRect().top
    dari atas ke bawah = selisih getBoundingClientRect().bottom
  */
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-[300px] mb-24">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam commodi voluptatibus aut saepe suscipit illo deserunt aspernatur illum recusandae aliquid, enim dicta unde ex incidunt minus, hic culpa nobis odio. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam velit, nesciunt nostrum id rerum est sunt. Sunt porro necessitatibus autem rerum consectetur distinctio vel modi. A doloribus cum voluptate officia unde corporis in dolorem reprehenderit saepe adipisci. Et quisquam, voluptate fugit temporibus omnis, dolor quidem expedita, inventore suscipit harum ab. Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias cum magnam sed! Ullam officia assumenda vero obcaecati magni deserunt! Provident amet laborum soluta voluptatem assumenda sit maxime qui, ea quod?
      </div>
      <button className="p-2 bg-slate-300" onClick={() => {
        console.log('todos', todos)
      }}>Todos check state!</button>

      <button className="p-2 bg-slate-300"
        onClick={() => { dispatch(resetY())}}
      >Reset Y</button>

      <h1 className="text-xl mb-8">Draggable list</h1>
      <div className="flex flex-col border border-2 border-black rounded w-[300px] mb-4 relative">
        {todos.map((todo, idx) =>
          <Todo id={todo.id} text={todo.text} y={todo.y} pageYTop={todo.pageYTop} pageYBottom={todo.pageYBottom} index={idx} key={todo.text} />
        )}
      </div>

      <div className="mb-8">
        <div>Move</div>
        <label htmlFor="index">Index: <input className="border-1 border border-slate-300" type="text" value={moveIndex} onChange={(e) => {
          e.preventDefault()
          setMoveIndex(e.target.value)
        }} /></label>
        <label htmlFor="y">Y: <input className="border-1 border border-slate-300" type="number" value={moveY} onChange={(e) => {
          e.preventDefault()
          setMoveY(Number(e.target.value))
        }} /></label>
        <button className="bg-slate-200 active:bg-slate-300 px-2"
          onClick={() => {
            dispatch(move({index: Number(moveIndex), y: Number(moveY)}))
          }}
        >Boom</button>
      </div>

      <div className="mb-16">
        <div>Swap</div>
        <label htmlFor="">index #1
          <input type="text" className="border-1 border border-slate-300"
            onChange={(e) => {
              e.preventDefault()
              setIndex1(e.target.value)
            }}
            value={index1}
          />
        </label>
        <label htmlFor="">index #2
          <input type="text" className="border-1 border border-slate-300"
            onChange={(e) => {
              e.preventDefault()
              setIndex2(e.target.value)
            }}
            value={index2}
          />
        </label>
        <button className="px-2 bg-slate-100 active:bg-slate-300"
          onClick={() => {
            dispatch(swap([Number(index1), Number(index2)]))
          }}
        >Swap</button>
      </div>

      <div className="flex w-[300px] mb-24">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam commodi voluptatibus aut saepe suscipit illo deserunt aspernatur illum recusandae aliquid, enim dicta unde ex incidunt minus, hic culpa nobis odio. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam velit, nesciunt nostrum id rerum est sunt. Sunt porro necessitatibus autem rerum consectetur distinctio vel modi. A doloribus cum voluptate officia unde corporis in dolorem reprehenderit saepe adipisci. Et quisquam, voluptate fugit temporibus omnis, dolor quidem expedita, inventore suscipit harum ab. Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias cum magnam sed! Ullam officia assumenda vero obcaecati magni deserunt! Provident amet laborum soluta voluptatem assumenda sit maxime qui, ea quod?
      </div>
    </div>
  )
}