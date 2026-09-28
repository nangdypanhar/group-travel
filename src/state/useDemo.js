import { useContext } from 'react'
import { DemoContext } from './context'

export const useDemo = () => useContext(DemoContext)
