# RINOV5 Project Context

This is a Next.js 16 + React 19 + TypeScript frontend demo application, migrated from Vue 3 (Rinov4). It is an ERP system for education management and branch/school management. Everything uses mock data only. Do not add real API calls.

## Project Structure

```text
rinov5/
  src/
    app/
      (auth)/login/page.tsx
      (dashboard)/
        page.tsx
        app/dashboard/
        app/[menuId]/
      api/auth/login/route.ts
      layout.tsx
    components/
      ui/
      layout/
    config/
      navigation.ts
      screens.ts
    stores/
      useAuthStore.ts
      useUIStore.ts
    lib/
      utils.ts
    hooks/
      use-mobile.ts
    mocks/
    middleware.ts
  .storybook/
  package.json
```

## Tech Stack

- Next.js 16.2.6 with Turbopack and App Router
- React 19.2.4
- TypeScript 5
- TailwindCSS v4 with CSS variables in `globals.css`
- shadcn/ui components, New York style
- Zustand for state management
- lucide-react for icons
- Radix UI primitives

## Mock Auth Flow

- Login accepts any email/password for demo use.
- Successful login sets the `auth_session` cookie and redirects to `/app/dashboard`.
- The Next.js middleware (`src/middleware.ts`) checks the cookie and redirects unauthenticated users to `/login`.
- Supported demo roles: `admin`, `branch_manager`, `sale`, `csm`, `teacher`.

## Mock Data

All mock data lives in `src/mocks/`. Each entity file should include:

- Type or interface definitions
- Mock data arrays
- Helper functions for search, filter, pagination, or sorting when needed

Example:

```typescript
export interface Student {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: 'active' | 'inactive' | 'pending'
  enrolledClass?: string
  enrollmentDate: string
  branch: string
}

export const mockStudents: Student[] = []

export function getStudents(filters?: {
  search?: string
  branch?: string
  status?: string
}): Student[] {
  return mockStudents
}
```

## Code Generation Conventions

### Component Style

- Use TypeScript React functional components.
- Do not add i18n. Hardcoded English text is acceptable for this demo.
- Use `cn()` from `@/lib/utils` for conditional `className` values.
- Use shadcn/ui components from `@/components/ui/`.
- Use icons from `lucide-react`.
- Follow shadcn New York style and preserve existing `data-slot` conventions.

### Page Convention

- Dashboard app screens are routed through `src/app/(dashboard)/app/[menuId]/page.tsx`.
- Screen metadata is defined in `@/config/screens.ts`.
- Navigation is defined in `@/config/navigation.ts`.
- Screen implementations should live in `src/components/screens/[menuId]Screen.tsx` when a dedicated screen component is needed.
- Dynamic routes should resolve screens by `menuId`; avoid adding one-off route files unless the app structure requires it.
- Use mock data from `@/mocks/` or local component state.
- Prefer a data-table pattern for list screens: toolbar, filters/search, table, actions, pagination footer.
- Loading states should use `<ModuleLoadingSkeleton />` when available or shadcn `<Skeleton />`.
- Empty states should include a clear placeholder message.

### State Management

- Auth state belongs in `useAuthStore()`: `isAuthenticated`, `user`, `login()`, `logout()`.
- UI state belongs in `useUIStore()`: sidebar, theme, notifications, current menu, and other app-shell UI state.
- Screen-specific state should stay local with React `useState` unless it needs cross-screen persistence.

### Route and Navigation Mapping

When creating a new screen:

1. Check whether the screen ID already exists in `@/config/screens.ts`.
2. Check whether it is already present in `@/config/navigation.ts`.
3. Create mock data in `@/mocks/` if the entity does not already exist.
4. Create the screen component under `src/components/screens/` if needed.
5. Keep the dynamic `/app/[menuId]` route as the resolver.

## No Real APIs

- Do not import `@supabase/supabase-js` in screens.
- Do not create server actions or database queries for product data.
- Do not use external APIs for demo data.
- All business data must come from `@/mocks/` or local state.
- The only API routes should be mock infrastructure, such as `src/app/api/auth/login/route.ts` and logout/session helpers.

## Screen Priority

P0 screens:

- `/app/dashboard`
- `/app/students`
- `/app/classes`
- `/app/calendar_class_schedule`
- `/app/orders`
- `/app/hr_employees`
- `/app/products`

## Demo-Friendly Features

For list and management screens, include:

- Search
- Filters
- Sort controls where useful
- View/edit/delete/add actions
- Status badges such as Active, Inactive, Pending
- Pagination using mock data
- Empty, loading, and error states

## Storybook

Add `.stories.tsx` coverage for reusable components and important screen previews when adding or changing UI that should be exported to Figma later.

Storybook config lives in `.storybook/` and should include Tailwind styling through the existing preview setup.

## Migration Context

The original project was Vue 3 + Pinia + vue-router. The Rinov5 codebase is the Next.js migration target.

- 60+ menu IDs are expected.
- Around 30 screens may be implemented and around 30 may remain placeholders.
- Migration checklist: `C:\Users\Jacky Tran\Documents\Rinov4-MIGRATION-CHECKLIST.md`.
- Mock data structure should stay aligned with Rinov4 service/data files when practical.

## Agent Startup Checklist

When an AI agent starts work in this repo:

1. Read this `AGENTS.md`.
2. Read `src/config/navigation.ts`.
3. Read `src/config/screens.ts`.
4. Read `src/stores/useAuthStore.ts` and `src/stores/useUIStore.ts`.
5. Read `src/components/layout/`.
6. Check `src/mocks/` for available data before creating new mock files.

## Current Guardrails

- The repository may contain in-progress migration work and a dirty git tree. Do not revert unrelated changes.
- Preserve mock-only behavior.
- Keep changes scoped.
- Prefer existing shadcn/ui, Zustand, Tailwind, and layout patterns.
