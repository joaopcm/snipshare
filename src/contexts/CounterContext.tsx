import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'

interface CounterContextValues {
  counter: number
  setCounter: Dispatch<SetStateAction<number>>
}

const CounterContext = createContext<CounterContextValues>(
  {} as CounterContextValues,
)

export function CounterProvider({ children }: { children: ReactNode }) {
  const [counter, setCounter] = useState<number>(0)

  return (
    <CounterContext.Provider value={{ counter, setCounter }}>
      {children}
    </CounterContext.Provider>
  )
}

export function useCounter() {
  const { counter, setCounter } = useContext(CounterContext)

  return { counter, setCounter }
}
