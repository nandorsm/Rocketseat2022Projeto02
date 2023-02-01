import { ButtonContainer, ButtonVariant } from './Button.styles'

interface ButtonProps {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary' }: ButtonProps) {
  return (
    <ButtonContainer variant={variant}>Enviar</ButtonContainer>
    // <button className={`${styles.button} ${styles[color]}`}>Enviar</button>
  )
}
