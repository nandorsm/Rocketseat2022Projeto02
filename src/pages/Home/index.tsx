import { HandPalm, Play } from 'phosphor-react'

import { zodResolver } from '@hookform/resolvers/zod'

import { createContext, useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'



interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  
  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

  function markCurrentCycleAsFinished(cycleId: string) {
    setCycles( (state) => state.map(cycle => {
      if (cycle.id == activeCycleId){
        return { ...cycle, finishedDate: new Date() }
      } else {
        return cycle
      }
    }),
    )
  }

  // function handleCreateNewCycle(data: NewCycleFormData) {
  //   const id = String(new Date().getTime())
    
  //   const newCycle: Cycle = {
  //     id,
  //     task: data.task,
  //     minutesAmount: data.minutesAmount,
  //     startDate: new Date(),
  //   }

  //   setCycles((state) => [...cycles, newCycle])
  //   setActiveCycleId(id)
  //   setAmountSecondsPassed(0)

  //   reset()
  // }

  function handleInterruptCycle() {
    setCycles( (state) =>
      state.map(cycle => {
        if (cycle.id == activeCycleId){
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }

      }),
    )

    setActiveCycleId(null)
  }
  
  // const task = watch('task')
  // const isSubmitedDesabled = !task

  console.log(cycles)

  /* 
    - Prop Drilling -> Quando se tem MUITAS propriedades APENAS para comunicação entre componentes

    - Context API -> Permite compartilharmos informações entre vários componentes ao mesmo tempo
  */

  return (
    <HomeContainer>
      <form /*onSubmit={handleSubmit(handleCreateNewCycle)}*/ action="">
        <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}>
          {/* <NewCycleForm /> */}
          <Countdown />
        </CyclesContext.Provider>
        


        { activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton /*disabled={isSubmitedDesabled}*/ type="submit">
          <Play size={24} />
          Começar
          </StartCountdownButton>
        ) }


      </form>
    </HomeContainer>
  )
}
