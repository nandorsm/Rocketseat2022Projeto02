import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import * as zod from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
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


export function NewCycleForm() {
  const { register, handleSubmit, watch, reset /*formState*/ } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  return (
      <FormContainer>
        <label htmlFor="task">Vou trabalhar em </label>
        <TaskInput
          id="task"
          list="task-suggestions"
          placeholder="Dê um nome para o seu projeto"
          disabled={!!activeCycle} // !! se tiver algo converte pra true, se não, falso.
          {...register('task')}
        />

        <datalist id="task-suggestions">
          <option value="Projeto 1" />
          <option value="Projeto 2" />
          <option value="Projeto 3" />
          <option value="Banana" />
        </datalist>

        <label htmlFor="">durante</label>
        <MinutesAmountInput
          type="number"
          id="minutesAmount"
          placeholder="00"
          step={5}
          min={1}
          max={60}
          disabled={!!activeCycle}
          {...register('minutesAmount', { valueAsNumber: true })}
        />

        <span>minutos.</span>
      </FormContainer>
  );
}