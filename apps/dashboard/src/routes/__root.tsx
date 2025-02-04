import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className='p-2 flex gap-2'>
        <Link to='/dashboard' className='[&.active]:font-bold'>
          Dashboard
        </Link>{' '}
        <Link to='/settings' className='[&.active]:font-bold'>
          Settings
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
