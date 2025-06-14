/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as WorkpapersRouteImport } from './routes/workpapers'
import { Route as SettingsRouteImport } from './routes/settings'
import { Route as ExceptionsRouteImport } from './routes/exceptions'
import { Route as EvidenceRouteImport } from './routes/evidence'
import { Route as DashboardRouteImport } from './routes/dashboard'
import { Route as CuecMappingRouteImport } from './routes/cuec-mapping'
import { Route as ControlsRouteImport } from './routes/controls'
import { Route as IndexRouteImport } from './routes/index'

const WorkpapersRoute = WorkpapersRouteImport.update({
  id: '/workpapers',
  path: '/workpapers',
  getParentRoute: () => rootRouteImport,
} as any)
const SettingsRoute = SettingsRouteImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRouteImport,
} as any)
const ExceptionsRoute = ExceptionsRouteImport.update({
  id: '/exceptions',
  path: '/exceptions',
  getParentRoute: () => rootRouteImport,
} as any)
const EvidenceRoute = EvidenceRouteImport.update({
  id: '/evidence',
  path: '/evidence',
  getParentRoute: () => rootRouteImport,
} as any)
const DashboardRoute = DashboardRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRouteImport,
} as any)
const CuecMappingRoute = CuecMappingRouteImport.update({
  id: '/cuec-mapping',
  path: '/cuec-mapping',
  getParentRoute: () => rootRouteImport,
} as any)
const ControlsRoute = ControlsRouteImport.update({
  id: '/controls',
  path: '/controls',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/controls': typeof ControlsRoute
  '/cuec-mapping': typeof CuecMappingRoute
  '/dashboard': typeof DashboardRoute
  '/evidence': typeof EvidenceRoute
  '/exceptions': typeof ExceptionsRoute
  '/settings': typeof SettingsRoute
  '/workpapers': typeof WorkpapersRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/controls': typeof ControlsRoute
  '/cuec-mapping': typeof CuecMappingRoute
  '/dashboard': typeof DashboardRoute
  '/evidence': typeof EvidenceRoute
  '/exceptions': typeof ExceptionsRoute
  '/settings': typeof SettingsRoute
  '/workpapers': typeof WorkpapersRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/controls': typeof ControlsRoute
  '/cuec-mapping': typeof CuecMappingRoute
  '/dashboard': typeof DashboardRoute
  '/evidence': typeof EvidenceRoute
  '/exceptions': typeof ExceptionsRoute
  '/settings': typeof SettingsRoute
  '/workpapers': typeof WorkpapersRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/controls'
    | '/cuec-mapping'
    | '/dashboard'
    | '/evidence'
    | '/exceptions'
    | '/settings'
    | '/workpapers'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/controls'
    | '/cuec-mapping'
    | '/dashboard'
    | '/evidence'
    | '/exceptions'
    | '/settings'
    | '/workpapers'
  id:
    | '__root__'
    | '/'
    | '/controls'
    | '/cuec-mapping'
    | '/dashboard'
    | '/evidence'
    | '/exceptions'
    | '/settings'
    | '/workpapers'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ControlsRoute: typeof ControlsRoute
  CuecMappingRoute: typeof CuecMappingRoute
  DashboardRoute: typeof DashboardRoute
  EvidenceRoute: typeof EvidenceRoute
  ExceptionsRoute: typeof ExceptionsRoute
  SettingsRoute: typeof SettingsRoute
  WorkpapersRoute: typeof WorkpapersRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/workpapers': {
      id: '/workpapers'
      path: '/workpapers'
      fullPath: '/workpapers'
      preLoaderRoute: typeof WorkpapersRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/exceptions': {
      id: '/exceptions'
      path: '/exceptions'
      fullPath: '/exceptions'
      preLoaderRoute: typeof ExceptionsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/evidence': {
      id: '/evidence'
      path: '/evidence'
      fullPath: '/evidence'
      preLoaderRoute: typeof EvidenceRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/cuec-mapping': {
      id: '/cuec-mapping'
      path: '/cuec-mapping'
      fullPath: '/cuec-mapping'
      preLoaderRoute: typeof CuecMappingRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/controls': {
      id: '/controls'
      path: '/controls'
      fullPath: '/controls'
      preLoaderRoute: typeof ControlsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ControlsRoute: ControlsRoute,
  CuecMappingRoute: CuecMappingRoute,
  DashboardRoute: DashboardRoute,
  EvidenceRoute: EvidenceRoute,
  ExceptionsRoute: ExceptionsRoute,
  SettingsRoute: SettingsRoute,
  WorkpapersRoute: WorkpapersRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
