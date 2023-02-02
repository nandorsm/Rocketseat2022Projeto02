import { HeaderContainer } from './styles'
import { Timer, Scroll } from 'phosphor-react'

// import logoIgnite from '../../assets/logo-ignite.svg'

export function Header() {
  return (
    <HeaderContainer>
      <span>Logo</span>
      {/* <img src={logoIgnite} alt="" /> */}
      <nav>
        <a href="">
          <Timer size={24} />
        </a>
        <a href="">
          <Scroll size={24} />
        </a>
      </nav>
    </HeaderContainer>
  )
}
