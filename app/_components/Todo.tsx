'use client'
import Draggable, { DraggableProps } from "react-draggable"
import { DraggableCore } from "react-draggable"
import { useState, useEffect, useRef } from "react"
import type { Todo } from "../_redux/reducers/taskReducer"
import { useDispatch } from "react-redux"
import { swap, move, setPageYTop, setPageYBottom } from "../_redux/reducers/taskReducer"

export default function Todo({ text, y, id, index, pageYTop, pageYBottom }: { text: Todo['text']; y: Todo['y']; id: Todo['id']; pageYTop: Todo['pageYTop']; pageYBottom: Todo['pageYBottom']; index: number }) {
   const dispatch = useDispatch()
   const [startX, setStartX] = useState(0)
   const [targetIndex, setTargetIndex] = useState<null | number>(null)
   // const [pageYTop, setPageYTop] = useState(0)
   // const [pageYBottom, setPageYBottom] = useState(0)
   const [height, setHeight] = useState(0)
   const ref = useRef(null)
   useEffect(() => {
      console.log('didMount', ref.current)
      if (ref.current !== null) {
         // @ts-ignore
         const {top: topY, bottom: bottomY, height} = ref.current.getBoundingClientRect()
         // @ts-ignore
         ref.current.dataset.moved = ''
         dispatch(setPageYTop( {index, pageYTop: Math.round(topY + window.scrollY) }))
         dispatch(setPageYBottom({index, pageYBottom:  Math.round(bottomY + window.scrollY) }))
         setHeight(height)
      }
   }, [index]) 
   return (
      <Draggable
         axis="y"
         bounds="parent"
         position={{ x: 0, y: y }}
         onStart={(e, data) => {
            // @ts-ignore
            e.target.style.zIndex = 100
            console.log('onStart', e)
            // @ts-ignore
            setStartX(e.screenX)
            setTargetIndex(index)
         }}
         onDrag={(e, data) => {

            // console.log('onDrag deltaY', data.deltaY)
            // @ts-ignore
            e.target.style.zIndex = '100'
            // @ts-ignore
            const clientY = e.y
            // @ts-ignore
            // const clientX = e.x
            let els = document.elementsFromPoint(startX, clientY)
            let $self = e.target
            if (!($self instanceof HTMLElement && $self !== null)) {
               return
            }
            // console.log('dragged index', $self.dataset.index)
            // console.log('els', els)
            // console.log('$self', $self)
            const $target = els.find($el => {
               return $el.classList.contains('todo') && $el.id !== id
            })
            console.log('$target', $target)
            if (!$target || !($target instanceof HTMLElement)) {
               // setTargetIndex(null)
               // console.log('not $target')
               return
            }
            const $targetPageYBottom = Number($target.dataset.pageYBottom)
            const $targetIndex = Number($target.dataset.index)
            // if ($targetIndex == targetIndex) return
            // setTargetIndex($targetIndex)
            console.log('Y', pageYTop - Number($target.dataset.pageYTop))
            // @ts-ignore
            const movementY = e.movementY
            let moveY;
            // $target move up one
            if (movementY > 0 && $target.dataset.moved !== 'up') {
               console.log('move up')

               moveY = pageYTop - Number($target.dataset.pageYTop)
               $target.dataset.moved = 'up'
               // this <Todo> move down
               dispatch( setPageYTop( {index, pageYTop: $targetPageYBottom - height} ) )
               dispatch( setPageYBottom({index, pageYBottom: $targetPageYBottom}))
               setTargetIndex(prev => {
                  if (prev !== null) {
                     return prev + 1
                  }
                  return null
               })
            } 
            else if
            // $target move down one
            (movementY < 0 && $target.dataset.moved !== 'down') {
               console.log('move down')
               // moveY = pageYTop - Number($target.dataset.pageYTop) - Math.abs(height - Number($target.dataset.height) )
               moveY = (pageYTop - Number($target.dataset.pageYTop)) + (height - Number($target.dataset.height))
               $target.dataset.moved = 'down'
               // this <Todo> move up
               dispatch( setPageYTop( {index, pageYTop: Number($target.dataset.pageYTop)} ) )
               dispatch( setPageYBottom({index, pageYBottom: Number($target.dataset.pageYTop) + height}))
               setTargetIndex(prev => {
                  if (prev !== null) {
                     return prev - 1
                  }
                  return null
               })
            }
            if (moveY == undefined) { return }
            dispatch(move({index: $targetIndex, y: moveY }))
            // update $this pageYTop and pageYBottom 
            // @ts-ignore
            if ($target.dataset.pageYBottom == undefined) return
            // target <Todo>
            // @ts-ignore
            dispatch( setPageYTop({index: $targetIndex, pageYTop: Number($target.dataset.pageYTop) + moveY}) )
            // @ts-ignore
            dispatch( setPageYBottom({index: $targetIndex, pageYBottom: Number($target.dataset.pageYTop) + moveY + Number($target.dataset.height)}) )
            // 886
         }}
         onStop={(e, data) => {
            console.log('startIndex', index, 'targetIndex', targetIndex)
            dispatch(swap([index, targetIndex]))
            setStartX(0)
            setTargetIndex(null)
            // @ts-ignore
            e.target.style.zIndex = ''
         }}
      >
         <div
            id={id}
            className="bg-slate-200 p-2 mb-2 relative todo"
            data-index={index}
            data-page-y-top={pageYTop}
            data-page-y-bottom={pageYBottom}
            data-height={height}
            ref={ref}
         // style={{transform: `translateY(${y}px)`}}
         >
            {text}</div>
      </Draggable>
   )
}