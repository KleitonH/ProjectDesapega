import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a
          href="https://github.com/KleitonH/ProjectDesapega"
          target="_blank"
          rel="noopener noreferrer"
        >
          Projeto Desapega
        </a>
        <span className="ms-1">&copy; 2025 praticidade em seu negócio</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
