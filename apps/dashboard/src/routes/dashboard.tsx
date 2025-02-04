import { Button } from '@/components/button'
import { trpc } from '@/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const [count, setCount] = useState(0)

  const helloQuery = trpc.hello.useQuery({ name: 'John' })

  console.log(helloQuery.data)

  return (
    <>
      <h1 className='text-3xl font-bold underline bg-red-500'>Vite + React</h1>
      <div className='card'>
        <Button onClick={() => setCount((count) => count + 1)}>
          state is {count}
        </Button>
      </div>
      <div>Hello {helloQuery.data?.name}, end</div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more 123
      </p>
    </>
  )
}
