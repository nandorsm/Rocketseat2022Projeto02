import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from './styles'

import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'

// controlled / uncontrolled

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset /*formState*/ } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if(activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate);
        
        if (secondsDifference >= totalSeconds) {
          setCycles( (state) => state.map(cycle => {
            if (cycle.id == activeCycleId){
              return { ...cycle, finishedDate: new Date() }
            } else {
              return cycle
            }
          }),
          )
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }

  }, [activeCycle, totalSeconds, activeCycleId])


  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())
    
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...cycles, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    reset()
  }

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
  

  
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60) // floor, ceil, round
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // console.log(activeCycle)
  // console.log(formState.errors)

  useEffect(() => {
    if(activeCycle){
      document.title = `${minutes}:${seconds}`
    }
    
  }, [minutes, seconds, activeCycle])

  const task = watch('task')
  const isSubmitedDesabled = !task

  console.log(cycles)

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm />
        <Countdown />


        { activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitedDesabled} type="submit">
          <Play size={24} />
          Começar
          </StartCountdownButton>
        ) }


      </form>
    </HomeContainer>
  )
}
