import { useState, useEffect, TouchEvent, TouchEventHandler } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../_redux/store";
import {
  setActiveTask,
  setActiveColumn,
  swapTask,
} from "../_redux/reducers/boardReducer";
import ButtonPill from "../_components/buttons/ButtonPill";
import clsx from "clsx";

import Aside from "./Aside";
import ModalAddNewColumn from "./modals/ModalAddNewColumn";
import ModalTask from "./modals/ModalTask";
import useIsMobile from "../_hooks/useIsMobile";

export default function Main() {
  // @ts-ignore
  const state: RootState = useSelector<RootState>((state) => state);
  const dispatch = useDispatch();

  const board =
    state.board.boards.length > 0
      ? state.board.boards[state.board.activeBoard]
      : null;
  const columns = board !== null ? board.columns : null;

  let currentTask =
    board !== null && board.columns[0].tasks.length > 0
      ? board.columns[state.board.activeColumn].tasks[state.board.activeTask]
      : null;

  const [modalCreateNewColumnOpen, setModalCreateNewColumnOpen] =
    useState(false);
  const [modalTaskOpen, setModalTaskOpen] = useState(false);
  const [modalCreateNewBoardOpen, setModalCreateNewBoardOpen] = useState(false); // dipake

  useEffect(() => {
    if (state.board.theme) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [state.board.theme]);

  // drag card-task feature
  const [preventDrag, setPreventDrag] = useState(false);
  // const [preventMainScroll, setPreventMainScroll] = useState(false) // prevent main scrollbar to scroll when draggin on mobile view


  // css cursor drag scrollbar 
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    document.documentElement.style.cursor = scrolling ? 'grabbing' : '';
  }, [scrolling]);

  function dragDesktop({ taskIndex, columnIndex }: { taskIndex: number; columnIndex: number },
    e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    let isDragged = false;

    if (preventDrag) return;

    // disable text selection/highlight on document
    document.documentElement.style.userSelect = 'none';
    
    const $this = e.currentTarget as HTMLElement;
    const marginBottom = window.parseInt(window.getComputedStyle($this).marginBottom);
    let $wrapper = $this.parentElement;
    const $initialWrapper = $this.parentElement;
    const transitionDuration =
      parseFloat(window.getComputedStyle($this).transitionDuration) * 1000; // in ms
    let isOut = false; // when the dragged card doesn't belong in any position

    $this.classList.remove("card-task-transition");
    $this.classList.remove("z-50");
    $this.style.zIndex = "100";

    // create shadowRect
    const $thisRect = $this.getBoundingClientRect();
    const $shadowRect = document.createElement("div");

    $shadowRect.classList.add("shadow-rect");
    $shadowRect.style.color = "red";
    $shadowRect.style.height = `${$thisRect.height}px`;
    $shadowRect.style.width = `${$thisRect.width}px`;
    $shadowRect.style.position = "absolute";
    $shadowRect.style.top = `${$thisRect.top}px`;
    $shadowRect.style.left = `${$thisRect.left}px`;
    document.body.appendChild($shadowRect);

    let fromIndex = Number($this.dataset.index);
    // let $thisIndex = Number($this.dataset.index)
    let fromColumnIndex = Number(columnIndex);
    let toColumnIndex = Number(columnIndex);
    let movedCards = new Set([$this]);
    // let $prevSwap = { card: null, direction: null } // direction { null | 1 = swap bottom, -1 = swap top}

    function dragCard(e: MouseEvent) {
      $this.style.opacity = "1";
      isDragged = true;

      const matrix = new DOMMatrix(window.getComputedStyle($this).transform);
      $this.style.transform = `translate(${matrix.e + e.movementX}px, ${
        matrix.f + e.movementY
      }px)`;

      if (isOut == false && $wrapper !== null) {
        const $wrapperRect = $wrapper.getBoundingClientRect();

        if (
          e.clientX > $wrapperRect.right ||
          e.clientX < $wrapperRect.left ||
          e.clientY < $wrapperRect.top ||
          e.clientY > $wrapperRect.bottom
        ) {
          Array.from($wrapper.children).forEach(($el) => {
            if ($el instanceof HTMLElement) {
              if (Number($el.dataset.index) <= Number($this.dataset.index))
                return;
  
              $el.dataset.index = String(Number($el.dataset.index) - 1);
  
              const destinationY =
                Number($el.dataset.destinationY) -
                (marginBottom + $thisRect.height);
              $el.style.transform = `translate(0px, ${destinationY}px)`;
              $el.dataset.destinationY = String(destinationY);
  
              movedCards.add($el);

            }
          });

          const $temp = $wrapper;
          $temp.dataset.isAnimating = '1';
          window.setTimeout(() => {
            $temp.dataset.isAnimating = '0';
          }, transitionDuration);

          $shadowRect.remove();
          isOut = true;
          $wrapper = null;
        }

        const $swapCards = document
          .elementsFromPoint(e.clientX, e.clientY)
          .filter(($el) => {
            if ($el === $this) return false;
            return $el.classList.contains("card-task");
          }); 
        if (
          !!$swapCards.length &&
          !!$swapCards[0].getAnimations().length == false
        ) {
          const $swapCard = $swapCards[0] as HTMLElement;
          if (
            Number($this.dataset.index) < Number($swapCard.dataset.index) &&
            e.movementY > 0 && 
            $wrapper !== null
          ) {

            const min = Math.min(
              Number($this.dataset.index),
              Number($swapCard.dataset.index)
            );
            const max = Math.max(
              Number($this.dataset.index),
              Number($swapCard.dataset.index)
            );
            Array.from($wrapper.children).forEach(($el) => {
              if ($el instanceof HTMLElement) {
                if (
                  $el === $this ||
                  Number($el.dataset.index) > max ||
                  Number($el.dataset.index) < min
                )
                  return;
                $this.dataset.index = String(Number($this.dataset.index) + 1);
                $el.dataset.index = String(Number($el.dataset.index) - 1);
  
                $shadowRect.style.top = `${
                  $el.getBoundingClientRect().bottom - $thisRect.height
                }px`;
                $shadowRect.style.left = `${$el.getBoundingClientRect().left}px`;
  
                const destinationY =
                  Number($el.dataset.destinationY) -
                  (marginBottom + $thisRect.height);
                $el.style.transform = `translate(0px, ${destinationY}px)`;
                $el.dataset.destinationY = String(destinationY);
  
                movedCards.add($el);
              }
            });
          } else if (
            Number($this.dataset.index) > Number($swapCard.dataset.index) &&
            e.movementY < 0 &&
            $wrapper !== null
          ) {

            const min = Math.min(
              Number($this.dataset.index),
              Number($swapCard.dataset.index)
            );
            const max = Math.max(
              Number($this.dataset.index),
              Number($swapCard.dataset.index)
            );
            let isFirst = false;
            Array.from($wrapper.children).forEach(($el) => {
              if ($el instanceof HTMLElement) {

                if (
                  $el === $this ||
                  Number($el.dataset.index) > max ||
                  Number($el.dataset.index) < min
                )
                  return;
  
                // swap vertical fix $shadowRect
  
                $this.dataset.index = String(Number($this.dataset.index) - 1);
                $el.dataset.index = String(Number($el.dataset.index) + 1);
  
                if (isFirst == false) {
                  $shadowRect.style.top = `${$el.getBoundingClientRect().top}px`;
                  $shadowRect.style.left = `${
                    $el.getBoundingClientRect().left
                  }px`;
                  isFirst = true;
                }
  
                const destinationY =
                  Number($el.dataset.destinationY) +
                  (marginBottom + $thisRect.height);
                $el.style.transform = `translate(0px, ${destinationY}px)`;
                $el.dataset.destinationY = String(destinationY);
  
                movedCards.add($el);
              }
            });
          }
        }
        return;
      }

      if (isOut) {
        // and
        const $neoWrapper = document
          .elementsFromPoint(e.clientX, e.clientY)
          .find(($el) => {
            return $el.classList.contains("tasks-wrapper");
          }) as HTMLElement | undefined;

        if (!!$neoWrapper && $neoWrapper.childElementCount === 0) {
          $wrapper = $neoWrapper;
          isOut = false;
          $shadowRect.style.top = `${$wrapper.getBoundingClientRect().top}px`;
          $shadowRect.style.left = `${$wrapper.getBoundingClientRect().left}px`;
          document.body.appendChild($shadowRect);

          $this.dataset.index = '0';
          toColumnIndex = Number($wrapper.dataset.columnIndex);
          return;
        }


        if (!!$neoWrapper && Number($neoWrapper.dataset.isAnimating) == 0) {

          toColumnIndex = Number($neoWrapper.dataset.columnIndex);
          $wrapper = $neoWrapper;
          let isFirst = false;
          let isMoved = false;
          let $lastEl : HTMLElement | null = null;

          Array.from($wrapper.children).forEach(($el) => {
            if ($el === $this) return;

            const $elRect = $el.getBoundingClientRect();
            // if (e.clientY <= $elRect.bottom && !!$el.getAnimations().length == false) {
            if (e.clientY <= $elRect.bottom && $el instanceof HTMLElement) {
              isOut = false;
              isMoved = true;
              if (isFirst == false ) {
                isFirst = true;
                const diff =
                  new DOMMatrix(window.getComputedStyle($el).transform).f -
                  Number($el.dataset.destinationY);
                $this.dataset.index = $el.dataset.index;
                $shadowRect.style.top = `${$elRect.top - diff}px`;
                $shadowRect.style.left = `${$elRect.left}px`;
                document.body.appendChild($shadowRect);
              }

              $el.dataset.index = String(Number($el.dataset.index) + 1);

              const destinationY =
                Number($el.dataset.destinationY) +
                (marginBottom + $thisRect.height);
              $el.style.transform = `translate(0px, ${destinationY}px)`;
              $el.dataset.destinationY = String(destinationY);

              movedCards.add($el);
            }

            // if ($el instanceof HTMLElement) {$lastEl = $el};
            $lastEl = $el as HTMLElement;
          });


          if (isMoved == false) {
            // insert into last position in a new wrapper or when wrapper is empty of any card (new wrapper is initial wrapper)
            // $lastEl === null ? empty wrapper : last position;
            isOut = false;
            isMoved = true;

            // @ts-ignore
            $this.dataset.index = $lastEl === null ? '0' : String(Number($lastEl?.dataset.index) + 1);

            const $wrapperRect = $wrapper.getBoundingClientRect();
            $shadowRect.style.left = `${$wrapperRect.left}px`;
            // @ts-ignore
            const top = $lastEl === null ? $wrapperRect.top - marginBottom : $lastEl.getBoundingClientRect().bottom + Number($lastEl.dataset.destinationY) - new DOMMatrix(window.getComputedStyle($lastEl).transform).f;
            $shadowRect.style.top = `${top + marginBottom}px`;
            document.body.appendChild($shadowRect);
          }
        }
        return;
      } // Outside
    }

    function cancelDrag() {
      document.documentElement.style.userSelect = '';
      $this.style.opacity = "";

      setPreventDrag(true);
      window.setTimeout(() => {
        setPreventDrag(false);
      }, transitionDuration);

      document.removeEventListener("mousemove", dragCard);
      document.removeEventListener("mouseup", cancelDrag);

      if (isDragged == false) {
        // open modal card
        // boardStore.setColumnAndTaskIndex(columnIndex, index)
        dispatch(setActiveColumn(columnIndex));
        dispatch(setActiveTask(taskIndex));
        // openModalTask.value = true
        setModalTaskOpen(true);
        // boardStore.setColumnAndTaskIndex(fromColumnIndex, Number($this.dataset.index))
        $shadowRect.remove();
        return;
      }

      if ($wrapper == null && $initialWrapper !== null) {
        // if outside of wrapper when cancelDrag
        movedCards.forEach(($el) => {
          if ($this === $el) return
          $el.style.transform = ''
        })
  
        // reset cards.dataset.index
        Array.from($initialWrapper.children).reduce((curIndex, $el) => {
          if ($el === $this || Number(($el as HTMLElement).dataset.index) < fromIndex) return curIndex;
          ($el as HTMLElement).dataset.index = String(curIndex + 1)
          return curIndex + 1
        }, fromIndex)
  
        $shadowRect.style.top = `${$thisRect.top}px`
        $shadowRect.style.left = `${$thisRect.left}px`
        document.body.appendChild($shadowRect)
      }
  
      $this.classList.add('card-task-transition')
  
      // back to $shadowRect or back to initial position
      const moveX = $this.getBoundingClientRect().x - $shadowRect.getBoundingClientRect().x
      const moveY = $this.getBoundingClientRect().y - $shadowRect.getBoundingClientRect().y
      const matrix = new DOMMatrix(window.getComputedStyle($this).transform)
      $this.style.transform = `translate(${matrix.e - moveX}px, ${matrix.f - moveY}px)`
  
      $this.classList.remove('z-50')
      $this.style.zIndex = ''
  
      $shadowRect.remove()
  
      // update store
     window.setTimeout(() => {
        // set translateY 0 to all moved cards

        // @ts-ignore
        dispatch(swapTask({
          fromColumnIndex,
          toColumnIndex: isOut ? fromColumnIndex : toColumnIndex,
          fromIndex,
          toIndex: isOut ? fromIndex : Number($this.dataset.index)
        })).then(() => {
          movedCards.forEach(($c) => {
            $c.classList.remove('card-task-transition')
            $c.style.transform = 'translate(0px, 0px)'
            $c.dataset.destinationY = '0'
            window.setTimeout(() => {
            $c.classList.add('card-task-transition')
            }, 10) // needed so no transition
          })
          if (isOut) $this.dataset.index = String(fromIndex)
        })
      }, transitionDuration) // this setTimeout needs for dragged card get back to the position using transition
  }
  
  document.addEventListener("mousemove", dragCard);
  document.addEventListener("mouseup", cancelDrag);
  e.stopPropagation();
  }

  function dragMobile({ taskIndex, columnIndex }: { taskIndex: number; columnIndex: number },
    e: React.TouchEvent<HTMLDivElement>) {
    e.stopPropagation()
    // console.log('dragMobile event', e);

    let isDragged = false
  
    const $this = e.currentTarget
    const marginBottom = window.parseInt(window.getComputedStyle($this).marginBottom)
    let $wrapper = $this.parentElement
    const $wrappers = Array.from(document.querySelectorAll('.tasks-wrapper'))
    const $initialWrapper = $this.parentElement;

    if (!!$initialWrapper === false) return
    
    const transitionDuration = parseFloat(window.getComputedStyle($this).transitionDuration) * 1000 // in ms
    let isOut = false // when the dragged card doesn't belong in any position

    $this.style.opacity = '1';
  
    $this.classList.remove('card-task-transition')
    $this.classList.remove('z-50')
    $this.style.zIndex = '100'
  
    // create shadowRect
    const $thisRect = $this.getBoundingClientRect()
    const $shadowRect = document.createElement('div')
    $shadowRect.style.height = `${$thisRect.height}px`
    $shadowRect.style.width = `${$thisRect.width}px`
    $shadowRect.style.position = 'absolute'
    $shadowRect.style.top = `${$thisRect.top}px`
    $shadowRect.style.left = `${$thisRect.left}px`
    $shadowRect.style.border = '1px solid red';
    $shadowRect.style.zIndex = '100';
    document.body.appendChild($shadowRect)
  
    // let isDragged = false
    let fromIndex = Number($this.dataset.index)
    // let $thisIndex = Number($this.dataset.index)
    let fromColumnIndex = Number(columnIndex)
    let toColumnIndex = Number(columnIndex)
    let movedCards= new Set<HTMLElement>([$this])
    let prevTouch: Touch;
    const startStamp = Date.now()
    const holdToDrag = 150 // milliseconds hold to drag card-task
  
    const setBgTimeoutId = window.setTimeout(() => {
      // theme ==> 0 = dark, 1 = light
      $this.style.backgroundColor = state.board?.theme === 0 ? '#23242c' : '#e2e8f0'
      // setPreventMainScroll(true)
    }, holdToDrag)
  
    const $mainScroll = document.getElementById(`main-scroll`);
    if ($mainScroll === null) return;

    const mainScrollMaxScrollRight: number = Math.floor($mainScroll.scrollWidth - $mainScroll.clientWidth)
    const mainScrollMaxScrollBottom: number = Math.floor($mainScroll.scrollHeight - $mainScroll.clientHeight)
    
    let lastThisRectLeft = $this.getBoundingClientRect().left;
    let lastThisRectRight = $this.getBoundingClientRect().right;
    
    const setScrollIntervalId = window.setInterval(() => {
      if (!isDragged) return;
      // scroll when dragging out of frame
      const $thisRect = $this.getBoundingClientRect()
      const $thisMatrix = new DOMMatrix(window.getComputedStyle($this).transform)

      if ($thisRect.left >= 0) lastThisRectLeft = 0;
      if ($thisRect.right <= window.innerWidth) lastThisRectRight = window.innerWidth;
      
      if ($thisRect.left < 0 && $mainScroll.scrollLeft > 0) {
        // scroll left
        if ($thisRect.left >= lastThisRectLeft) {
          lastThisRectLeft = $thisRect.left;
          return;
        };
        $this.style.transform = `translate(${Math.ceil($thisMatrix.e - 3)}px, ${$thisMatrix.f}px)`
        $mainScroll.scrollLeft = Math.ceil($mainScroll.scrollLeft - 3)
      }

      if ($thisRect.right > window.innerWidth && $mainScroll.scrollLeft < mainScrollMaxScrollRight) {
        // scroll right
        if ($thisRect.right <= lastThisRectRight) {
          lastThisRectRight = $thisRect.right;
          return;
        };
        $this.style.transform = `translate(${Math.floor($thisMatrix.e + 3)}px, ${$thisMatrix.f}px)`
        $mainScroll.scrollLeft = Math.ceil($mainScroll.scrollLeft + 3)
      }
  
      if ($thisRect.bottom > window.innerHeight && $mainScroll.scrollTop < mainScrollMaxScrollBottom) {
        // Scroll bottom
        $this.style.transform = `translate(${$thisMatrix.e}px, ${Math.ceil($thisMatrix.f + 3)}px)`
        $mainScroll.scrollTop = Math.ceil($mainScroll.scrollTop + 3)
      }
  
      if ($thisRect.top < $mainScroll.getBoundingClientRect().top && $mainScroll.scrollTop > 0) {
        $this.style.transform = `translate(${$thisMatrix.e}px, ${Math.ceil($thisMatrix.f - 3)}px)`
        $mainScroll.scrollTop = Math.ceil($mainScroll.scrollTop - 3)
      }
    }, 5)
    // mobile drag feature
    const touchMove = (e: globalThis.TouchEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      if (!isDragged) {
        if (Date.now() - startStamp > holdToDrag) {
          isDragged = true
        } else {
          document.removeEventListener('touchmove', touchMove)
          document.removeEventListener('touchend', touchEnd)
          window.clearTimeout(setBgTimeoutId) // clear of card-task background and prevent main scroll
          window.clearInterval(setScrollIntervalId) // clear interval of scroll when dragging
          $shadowRect.remove()
        }
      }

      if (isDragged) {
        const touch = e.touches[0];

        let movementX: number = 0;
        let movementY: number = 0;
  
        if (prevTouch) {
          
          movementX = touch.pageX - prevTouch.pageX
          movementY = touch.pageY - prevTouch.pageY
  
          // drag $this card-task
          const matrix = new DOMMatrix(window.getComputedStyle($this).transform)
          $this.style.transform = `translate(${matrix.e + movementX}px, ${
            matrix.f + movementY
          }px)`
        }
        prevTouch = touch;


        // Drag and sort/swap lies here!! [START]
        if (isOut == false && $wrapper !== null) {
          const $wrapperRect = $wrapper.getBoundingClientRect()
  
          if (
            touch.clientX > $wrapperRect.right ||
            touch.clientX < $wrapperRect.left ||
            touch.clientY < $wrapperRect.top ||
            touch.clientY > $wrapperRect.bottom
          ) {
            // out of wrapper
            (Array.from($wrapper.children) as HTMLElement[]).forEach(($el: HTMLElement) => {
              if (Number($el.dataset.index) <= Number($this.dataset.index)) return
  
              $el.dataset.index = String(Number($el.dataset.index) - 1)
  
              const destinationY =
                Number($el.dataset.destinationY) - (marginBottom + $thisRect.height)
              $el.style.transform = `translate(0px, ${destinationY}px)`
              $el.dataset.destinationY = String(destinationY)
  
              movedCards.add($el)
            })
  
            const $temp = $wrapper;
            $temp.dataset.isAnimating = '1';
            window.setTimeout(() => {
              $temp.dataset.isAnimating = '0'
            }, transitionDuration)
  
            $shadowRect.remove()
            isOut = true
            $wrapper = null
          }
  
          const $swapCards = document.elementsFromPoint(touch.clientX, touch.clientY).filter(($el) => {
            if ($el === $this) return false
            return $el.classList.contains('card-task');
          }) as HTMLElement[];

          if (!!$swapCards.length && !!$swapCards[0].getAnimations().length == false && $wrapper !== null) {
            const $swapCard = $swapCards[0]
            if (Number($this.dataset.index) < Number(($swapCard as HTMLElement).dataset.index) && movementY > 0) {
  
              const min = Math.min(Number($this.dataset.index), Number(($swapCard as HTMLElement).dataset.index));
              const max = Math.max(Number($this.dataset.index), Number(($swapCard as HTMLElement).dataset.index));
              (Array.from($wrapper.children) as HTMLElement[]).forEach(($el : HTMLElement) => {
                if (
                  $el === $this ||
                  Number(($el as HTMLElement).dataset.index) > max ||
                  Number(($el as HTMLElement).dataset.index) < min
                )
                  return
                $this.dataset.index = String(Number($this.dataset.index) + 1)
                $el.dataset.index = String(Number($el.dataset.index) - 1)
  
                $shadowRect.style.top = `${$el.getBoundingClientRect().bottom - $thisRect.height}px`
                $shadowRect.style.left = `${$el.getBoundingClientRect().left}px`
  
                const destinationY = Number($el.dataset.destinationY) - (marginBottom + $thisRect.height);

                $el.style.transform = `translate(0px, ${destinationY}px)`;

                $el.dataset.destinationY = String(destinationY)
  
                movedCards.add($el)
              })
            } else if (
              Number($this.dataset.index) > Number(($swapCard as HTMLElement).dataset.index) &&
              movementY < 0
            ) {
  
              const min = Math.min(Number($this.dataset.index), Number($swapCard.dataset.index))
              const max = Math.max(Number($this.dataset.index), Number($swapCard.dataset.index))
              let isFirst = false;
              ([...$wrapper.children] as HTMLElement[]).forEach(($el: HTMLElement) => {
                if (
                  $el === $this ||
                  Number($el.dataset.index) > max ||
                  Number($el.dataset.index) < min
                )
                  return
  
                // swap vertical fix $shadowRect
  
                $this.dataset.index = String(Number($this.dataset.index) - 1);
                $el.dataset.index = String(Number($el.dataset.index) + 1);
  
                if (isFirst == false) {
                  $shadowRect.style.top = `${$el.getBoundingClientRect().top}px`
                  $shadowRect.style.left = `${$el.getBoundingClientRect().left}px`
                  isFirst = true
                }
  
                const destinationY =
                  Number($el.dataset.destinationY) + (marginBottom + $thisRect.height)
                $el.style.transform = `translate(0px, ${destinationY}px)`
                $el.dataset.destinationY = String(destinationY)
  
                movedCards.add($el)
              })
            }
          }
          return
        } // INSIDE
  
        if (isOut) {
          // console.log('isOut')
          const $neoWrapper = document.elementsFromPoint(touch.clientX, touch.clientY).find(($el) => {
            return $el.classList.contains('tasks-wrapper')
            }) as HTMLElement | undefined
            
          // console.log('$neoWrapper', $neoWrapper, $neoWrapper !== undefined ? $neoWrapper.childElementCount : 0);
          // empty wrapper
          if ($neoWrapper !== undefined && $neoWrapper.classList.contains('empty')) {
            // console.log('to empty new wrapper');
            $wrapper = $neoWrapper
            isOut = false
            $shadowRect.style.top = `${$wrapper.getBoundingClientRect().top}px`
            $shadowRect.style.left = `${$wrapper.getBoundingClientRect().left}px`
            document.body.appendChild($shadowRect)
  
            $this.dataset.index = '0'
            toColumnIndex = Number($wrapper.dataset.columnIndex)
            return
          }
          
          if (!!$neoWrapper && Number($neoWrapper.dataset.isAnimating) == 0) {
            
            // console.log('new wrapper')
            toColumnIndex = Number($neoWrapper.dataset.columnIndex);
            $wrapper = $neoWrapper;
            let isFirst = false;
            let isMoved = false; // isMoved === false it's mean that there is no cards that moved when dragged card enter the wrapper
            let $lastEl: null | HTMLElement = null;
  
            (Array.from($wrapper.children) as HTMLElement[]).forEach(($el: HTMLElement) => {
              if ($el === $this) return
              const $elRect = $el.getBoundingClientRect()

              if (touch.clientY <= $elRect.bottom) {
                isOut = false
                isMoved = true
                if (isFirst == false) {
                  isFirst = true
                  const diff =
                    new DOMMatrix(window.getComputedStyle($el).transform).f -
                    Number($el.dataset.destinationY)
                  $this.dataset.index = $el.dataset.index
                  $shadowRect.style.top = `${$elRect.top - diff}px`
                  $shadowRect.style.left = `${$elRect.left}px`
                  document.body.appendChild($shadowRect)
                }
  
                $el.dataset.index = String(Number($el.dataset.index) + 1)
  
                const destinationY =
                  Number($el.dataset.destinationY) + (marginBottom + $thisRect.height)
                $el.style.transform = `translate(0px, ${destinationY}px)`
                $el.dataset.destinationY = String(destinationY)
  
                movedCards.add($el)
              }
  
              $lastEl = $el
            })
            
            // console.log('isMoved', isMoved);
  
            if (isMoved == false) {
              // insert into last position in a new wrapper or when wrapper is empty of any card (new wrapper is initial wrapper)
              // console.log('$lastEl', $lastEl)
              isOut = false
              isMoved = true
              $this.dataset.index = $lastEl === null ? '0' : String(Number(($lastEl as HTMLElement).dataset.index) + 1)
  
              const $wrapperRect = $wrapper.getBoundingClientRect()
              $shadowRect.style.left = `${$wrapper.getBoundingClientRect().left}px`
              const top =
                $lastEl === null
                  ? $wrapperRect.top - marginBottom
                  : ($lastEl as HTMLElement).getBoundingClientRect().bottom +
                    Number(($lastEl as HTMLElement).dataset.destinationY) -
                    new DOMMatrix(window.getComputedStyle($lastEl).transform).f
              $shadowRect.style.top = `${top + marginBottom}px`
              document.body.appendChild($shadowRect)
            } else {
              // console.log('else $lastEl', $lastEl)
            }
          }
          return
        } // OUTSIDE
  
        // Drag and sort/swap lies here!! [END]
      }
    }
  
    const touchEnd = (e: globalThis.TouchEvent): void => {
      e.preventDefault()

      $this.style.backgroundColor = '';
      $this.style.opacity = '';
      window.clearTimeout(setBgTimeoutId)
      window.clearInterval(setScrollIntervalId)
  
      setPreventDrag(true)
      window.setTimeout(() => {
        setPreventDrag(false)
      }, transitionDuration)
  
      document.removeEventListener('touchmove', touchMove)
      document.removeEventListener('touchend', touchEnd)
      // setPreventMainScroll(false)
  
      // open modal task automatically handled by @click handler
      if (isDragged == false) {
        // open modal card
        // boardStore.setColumnAndTaskIndex(columnIndex, index)
        dispatch(setActiveColumn(columnIndex))
        dispatch(setActiveTask(taskIndex))
        setModalTaskOpen(true)
        $shadowRect.remove()
        return
      }
  
      $this.classList.add('card-task-transition')
  
      if ($wrapper == null) {
        // if outside of wrapper when cancelDrag
        movedCards.forEach(($el) => {
          if ($this === $el) return
          $el.style.transform = 'translate(0px, 0px)';
        });
  
        // reset cards.dataset.index
        (Array.from($initialWrapper.children) as HTMLElement[]).reduce((curIndex: number, $el: HTMLElement) => {
          if ($el === $this || Number($el.dataset.index) < fromIndex) return curIndex
          $el.dataset.index = String(curIndex + 1)
          return curIndex + 1
        }, fromIndex)
  
        $shadowRect.style.top = `${$thisRect.top}px`
        $shadowRect.style.left = `${$thisRect.left}px`
        document.body.appendChild($shadowRect)
      }
  
      // back to $shadowRect or back to initial position
      // New approach:
      const $toWrapper = $wrappers[isOut ? fromColumnIndex : toColumnIndex]
      $shadowRect.style.left = `${$toWrapper.getBoundingClientRect().left}px`
  
      const moveX = $this.getBoundingClientRect().x - $shadowRect.getBoundingClientRect().x
      const moveY = $this.getBoundingClientRect().y - $shadowRect.getBoundingClientRect().y
      const matrix = new DOMMatrix(window.getComputedStyle($this).transform)
      $this.style.transform = `translate(${matrix.e - moveX}px, ${matrix.f - moveY}px)`
  
      $this.classList.remove('z-50')
      $this.style.zIndex = ''
  
      $shadowRect.remove();
  
      // update store
     window.setTimeout(() => {
        // set translateY 0 to all moved cards

        // @ts-ignore
        dispatch(swapTask({
          fromColumnIndex,
          toColumnIndex: isOut ? fromColumnIndex : toColumnIndex,
          fromIndex,
          toIndex: isOut ? fromIndex : Number($this.dataset.index)
        })).then(() => {
          movedCards.forEach(($c) => {
            $c.classList.remove('card-task-transition')
            $c.style.transform = 'translate(0px, 0px)'
            $c.dataset.destinationY = '0'
            window.setTimeout(() => {
            $c.classList.add('card-task-transition')
            }, 10) // needed so no transition
          })
          if (isOut) $this.dataset.index = String(fromIndex)
        })
      }, transitionDuration) // this setTimeout needs for dragged card get back to the position using transition
    }
    document.addEventListener('touchmove', touchMove, {passive: false})
    document.addEventListener('touchend', touchEnd)
  }

  const [overlay, setOverlay] = useState(false);
  const {isMobile} = useIsMobile()

  return (
    <main className="flex flex-row fixed top-0 left-0 z-10 pt-[96px] w-screen h-screen bg-slate-100 dark:bg-dark"> 
      <Aside />
      <section
        className={clsx(
          "flex w-full transition-all",
          state.board.sidebar && !isMobile ? "pl-[300px]" : "pl-0"
        )}
      >
        {overlay && createPortal(
          <div className="absolute z-50 inset-0"></div>
        , document.body)}
        <div 
          id="main-scroll"
          className="beauty-scroll w-[100vw] overflow-auto relative cursor-move transition-all"
          onMouseDown={(e) => {
            const $this = e.currentTarget;
            document.documentElement.style.userSelect = 'none';
            setScrolling(true)
            setOverlay(true);
            function onDrag(e: MouseEvent) {
              $this.scrollLeft = $this.scrollLeft - e.movementX;
            }

            function onRelease() {
              setScrolling(false);
              setOverlay(false);
              document.removeEventListener('mousemove', onDrag)
              document.removeEventListener('mouseup', onRelease) 
              document.documentElement.style.userSelect = '';
            }

            document.addEventListener('mousemove', onDrag)
            document.addEventListener('mouseup', onRelease)
          }}
        >
          {board !== null ? (
            <div className="flex flex-row min-h-full pt-6 px-8 mobile:min-w-[770px] md:min-w-[80vw]">
              {/* bg-column[] is defined in tailwind.config.ts */}
              {columns !== null &&
                columns.map((c, columnIndex) => (
                  <div
                    key={c.id}
                    className="flex flex-col shrink-0 w-[280px] rounded-lg mr-8"
                  >
                    <div className="flex flex-row items-center mb-6" key={c.id}>
                      <div
                        className={`w-4 h-4 rounded-full bg-column${columnIndex} mr-3`}
                      ></div>
                      <div className="uppercase text-[.7rem] font-semibold tracking-[3px] text-slate-400">
                        <span>{c.name}</span>
                        <span>({c.tasks.length})</span>
                      </div>
                    </div>

                    <div 
                      className={clsx("flex flex-col h-full tasks-wrapper", c.tasks.length === 0 ? 'empty' : '')}
                      data-column-index={columnIndex}
                      data-is-animating="0"
                    >
                      {c.tasks.length > 0 ? (
                        c.tasks.map((task, taskIndex: number) => (
                          <div
                            key={task.id}
                            className="card-task card-task-transition select-none px-4 py-6 mb-6 rounded-md bg-white dark:bg-dark-light hover:opacity-50 hover:cursor-grab shadow-md dark:shadow-[0_4px_6px_rgb(54_78_126_/_10%)] shadow-slate-200 dark:border dark:border-[rgba(134,134,134,.1)]"
                            data-moveable="0"
                            data-index={taskIndex}
                            data-y="0"
                            data-title={task.title}
                            data-is-animating="0"
                            data-destination-y="0"
                            onMouseDown={(event) =>
                              dragDesktop({ taskIndex, columnIndex }, event)
                            }
                            onTouchStart={(event) => dragMobile({taskIndex, columnIndex}, event)}
                            draggable="false"
                          >
                            <div className="font-semibold text-[.95rem] mb-2">
                              {task.title}
                            </div>
                            {/* <div className="font-semibold text-[.95rem] mb-3">QA and test all major user journeys</div> */}
                            <div className="text-xs text-slate-400 font-semibold">
                              {task.subtasks.reduce(
                                (t, st) => (st.isDone ? t + 1 : t),
                                0
                              )}{" "}
                              of {task.subtasks.length} subtasks
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-[calc(100%-40px)]"></div>
                        // null
                      )}
                    </div>
                  </div>
                ))}
              {columns && columns.length < 6 && (
                <div className="rounded-lg flex flex-col shrink-0 w-[280px] mr-10">
                  <div className="h-10"></div>
                  <div
                    className="rounded-lg bg-red-700 h-full flex justify-center items-center font-bold text-2xl bg-gradient-to-b from-slate-200 to-slate-100 dark:from-dark-light dark:to-board hover:cursor-pointer text-slate-400 hover:text-primary"
                    onClick={(e) => {
                      setModalCreateNewColumnOpen(true);
                    }}
                    onMouseDown={(e) => {
                      // stop event bubbling supaya modal create new column open muncul dan tidak malah dragging main board yang ke trigger
                      e.stopPropagation();
                    }}
                  >
                    + New Column
                  </div>
                </div>
              )}
              
              <div className="h-full shrink-0 w-[32px]"></div>
              <ModalAddNewColumn
                isOpen={modalCreateNewColumnOpen}
                onRequestClose={() => setModalCreateNewColumnOpen(false)}
              />
            </div>
          ) : (
            <>
              {/* When there is no single board in the store. */}
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-4">
                  There is no single board. Create a new one to get started.
                </div>
                <ButtonPill
                  text="+ Create New Board"
                  className="w-fit"
                  onClick={(e) => {
                    setModalCreateNewBoardOpen(true);
                  }}
                />
              </div>
            </>
          )}
        </div>
        {/* Modal task [start] */}
        <ModalTask
          isOpen={modalTaskOpen}
          onRequestClose={() => {
            setModalTaskOpen(false);
          }}
        />
      </section>
    </main>
  );
}
