# Implementation Plan: TeamStack Kanban Features

## 1. User Authentication (NextAuth.js)
- Install next-auth (@auth/core)
- Create `src/app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- Create `src/lib/auth.ts` - Auth configuration with GitHub & Google providers
- Create `src/components/Providers.tsx` - Session provider wrapper
- Update `layout.tsx` to wrap with providers
- Add sign-in/sign-out UI in header

## 2. Task CRUD (Modal Forms)
- Create `src/components/TaskModal.tsx` - Modal for create/edit tasks
- Create `src/components/DeleteConfirmModal.tsx` - Delete confirmation
- Add state management with Zustand for tasks
- Implement create, edit, delete functionality
- Add modal triggers in TaskCard and Column headers

## 3. AI Integration (OpenClaw API)
- Create `src/lib/openclaw.ts` - OpenClaw API client
- Create `src/components/AIAssistModal.tsx` - AI suggestions UI
- Connect "AI Assist" button to OpenClaw API
- Display AI suggestions in modal

## Dependencies to Install
- next-auth@beta
- @types/bcrypt (for potential password hashing if needed later)
