import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/controls/layout')({
  component: ControlsLayout,
})

function ControlsLayout() {
  return <Outlet />
}