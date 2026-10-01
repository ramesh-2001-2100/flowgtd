# FlowGTD — Task Creation Entry Points

## 📐 Visual Schematic

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        FlowGTD — How to Add a Task                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐              │
│   │  1. INLINE ADD  │   │ 2. N SHORTCUT   │   │  3. FAB BUTTON  │              │
│   │   (Desktop)     │   │   (Keyboard)    │   │    (Mobile)     │              │
│   ├─────────────────┤   ├─────────────────┤   ├─────────────────┤              │
│   │                 │   │                 │   │                 │              │
│   │  ┌───────────┐  │   │  ░░░░░░░░░░░░░  │   │  ┌───────────┐  │              │
│   │  │ + Add a.. │  │   │  ░░░░░░░░░░░░░  │   │  │ Task 1    │  │              │
│   │  └───────────┘  │   │  ░░░░░░░░░░░░░  │   │  │ Task 2    │  │              │
│   │        ↓ click  │   │  ░░░░░░░░░░░░░  │   │  │ Task 3    │  │              │
│   │  ┌───────────┐  │   │  ░░░░░░░░░░░░░  │   │  │           │  │              │
│   │  │ What's    │  │   │  ░░┌─────────┐░░  │   │  │           │  │              │
│   │  │ the task? │  │   │  ░░│ Quick   │░░  │   │  │           │  │              │
│   │  │           │  │   │  ░░│ capture │░░  │   │  │           │  │              │
│   │  │ @home @work│  │   │  ░░│ task... │░░  │   │  │           │  │              │
│   │  │ 📁 Project│  │   │  ░░│         │░░  │   │  │           │  │              │
│   │  │ 📅 Date   │  │   │  ░░│ Add Task│░░  │   │  │        [+] │  │              │
│   │  │ ⏱ 5m 10m  │  │   │  ░░└─────────┘░░  │   │  │  FAB btn │  │              │
│   │  │ ⚡ Low High│  │   │  ░░░░░░░░░░░░░  │   │  └───────────┘  │              │
│   │  │ [Add task] │  │   │                 │   │                 │              │
│   │  └───────────┘  │   │                 │   │                 │              │
│   │                 │   │                 │   │                 │              │
│   │  Always visible │   │  Press N key    │   │  Tap + button   │              │
│   │  in every list  │   │  from anywhere  │   │  bottom-right   │              │
│   └─────────────────┘   └─────────────────┘   └─────────────────┘              │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   🔒 POPUP BLOCKER STATUS:                                                      │
│                                                                                 │
│   ✅ Inline QuickAdd  → React component (DOM element)    → CANNOT be blocked    │
│   ✅ N shortcut modal → React component (DOM element)    → CANNOT be blocked    │
│   ✅ FAB button       → React component (DOM element)    → CANNOT be blocked    │
│                                                                                 │
│   None of these use window.open() or browser popups.                            │
│   They are all in-page React-rendered overlays/panels.                          │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🎯 Detailed Breakdown

### 1. Inline QuickAdd (Primary Method)

**Where:** Top of every task list (Inbox, Next Actions, Waiting For, Someday/Maybe, Project detail, Context detail)

**Trigger:** Click the `+ Add a task…` row

**Behavior:**
```
┌─────────────────────────────────────────────┐
│  COLLAPSED STATE                            │
│  ┌───┐                                      │
│  │ + │  Add a task…              Press N    │
│  └───┘                                      │
└─────────────────────────────────────────────┘
                    ↓ click
┌─────────────────────────────────────────────┐
│  EXPANDED STATE                             │
│  ┌───┐                                      │
│  │ + │  What needs to be done?         [x]  │
│  └───┘                                      │
│                                             │
│  @ @home @phone @computer @work @errands   │
│  📁 No project │ Project 1 │ Project 2     │
│  📅 [date picker]  ⏱ — 5m 10m 30m         │
│  ⚡ — Low High                              │
│                                             │
│  ↵ to add · esc to cancel    [Add task]    │
└─────────────────────────────────────────────┘
```

**Features:**
- Auto-assigns status based on current view
- When in a Project view → auto-assigns project
- When in a Context view → auto-assigns context
- Stays open after adding (for rapid entry)
- Enter = submit, Escape = collapse

---

### 2. N Keyboard Shortcut (Power User Method)

**Where:** Global (works from any view)

**Trigger:** Press `N` key (when no input is focused)

**Behavior:**
```
┌─────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← Dark backdrop
│  ░░░░░░░░░░┌───────────────────┐░░░░░░░░░  │     (click to close)
│  ░░░░░░░░░░│                   │░░░░░░░░░  │
│  ░░░░░░░░░░│  🔍 Quick capture │░░░░░░░░░  │
│  ░░░░░░░░░░│  a task...    ESC │░░░░░░░░░  │
│  ░░░░░░░░░░├───────────────────┤░░░░░░░░░  │
│  ░░░░░░░░░░│ Will be added to  │░░░░░░░░░  │
│  ░░░░░░░░░░│ Inbox    [Add]    │░░░░░░░░░  │
│  ░░░░░░░░░░└───────────────────┘░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────┘
```

**Features:**
- Simple, fast title-only capture
- Auto-routes to current view's status (Inbox/Next/Waiting/Someday)
- Enter = submit, Escape = close
- Click backdrop = close

---

### 3. FAB Button (Mobile Method)

**Where:** Bottom-right corner (mobile only, hidden on desktop)

**Trigger:** Tap the floating `+` button

**Behavior:** Opens the same quick-capture modal as the `N` shortcut

```
┌─────────────────────┐
│                     │
│   (task list)       │
│                     │
│                     │
│                     │
│                     │
│              ┌───┐  │
│              │ + │  │  ← Floating Action Button
│              └───┘  │     (indigo circle, 56px)
├─────────────────────┤
│ ⚡  ⏰  📁  ⏳  💡  │  ← Bottom nav
└─────────────────────┘
```

**Features:**
- Only visible on mobile (< 768px)
- Positioned above bottom nav to avoid overlap
- 56px touch target (meets accessibility guidelines)
- Opens same modal as `N` shortcut

---

## 🔒 Why Popup Blockers Can't Interfere

### Technical Explanation

| Method | Implementation | Popup Blocker Impact |
|--------|---------------|---------------------|
| Inline QuickAdd | `<div>` component in React tree | ❌ None |
| N shortcut modal | `<div>` overlay in React tree | ❌ None |
| FAB button | `<div>` overlay in React tree | ❌ None |

**What popup blockers actually block:**
- `window.open()` calls
- `<a target="_blank">` without user gesture
- `alert()`, `confirm()`, `prompt()` in some cases

**What popup blockers CANNOT block:**
- In-page DOM elements (divs, modals, overlays)
- CSS-based animations and transitions
- React state changes and re-renders

Since all three methods use **React components that render as `<div>` elements within the existing page**, they are completely immune to popup blockers.

---

## 📱 Mobile-Specific Considerations

### iOS Safari
- ✅ In-page modals work perfectly
- ✅ No popup blocker interference
- ⚠️ Virtual keyboard may push content up (handled by CSS)

### Android Chrome
- ✅ In-page modals work perfectly
- ✅ No popup blocker interference
- ✅ Smooth keyboard handling

### Samsung Internet
- ✅ In-page modals work perfectly
- ✅ No popup blocker interference

---

## 🎨 Component Hierarchy

```
App.tsx
├── Sidebar (desktop)
├── MobileNav (mobile)
├── Main Content Area
│   ├── TaskList
│   │   ├── QuickAdd ← Inline add (always in every list)
│   │   └── TaskItem[]
│   ├── ProjectsView
│   │   └── QuickAdd ← When viewing a project
│   ├── ContextsView
│   │   └── QuickAdd ← When viewing a context
│   └── TaskDetail (slide-out panel)
├── Quick Capture Modal ← Triggered by N key or FAB
└── Command Palette ← Triggered by Cmd/Ctrl+K
```

---

## ⌨️ Keyboard Shortcuts Summary

| Shortcut | Action | Scope |
|----------|--------|-------|
| `N` | Open quick capture modal | Global |
| `Cmd/Ctrl + K` | Open command palette | Global |
| `Enter` | Submit task (in QuickAdd/modal) | When input focused |
| `Escape` | Close modal / collapse QuickAdd | When modal/QuickAdd open |

---

## 🚀 User Flow Examples

### Scenario 1: Desktop user in Inbox
1. User is in Inbox view
2. Clicks "+ Add a task…" at top of list
3. Types "Call dentist"
4. Selects @phone context
5. Presses Enter
6. Task added to Inbox with @phone context
7. Form stays open for next task

### Scenario 2: Mobile user anywhere
1. User is viewing Next Actions
2. Taps FAB (+) button
3. Modal appears
4. Types "Buy groceries"
5. Taps "Add Task"
6. Task added to Next Actions (because that's current view)
7. Modal closes

### Scenario 3: Power user with keyboard
1. User is in Projects view
2. Presses `N`
3. Modal appears
4. Types "Review Q4 budget"
5. Presses Enter
6. Task added to Inbox (default for Projects view)
7. Modal closes
8. User continues working

---

## 📊 Comparison: Inline vs Modal

| Feature | Inline QuickAdd | N Shortcut Modal |
|---------|----------------|------------------|
| **Visibility** | Always visible | Hidden until triggered |
| **Metadata** | Full (context, project, date, time, energy) | Title only |
| **Speed** | Slower (more options) | Faster (minimal) |
| **Best for** | Detailed task creation | Quick capture |
| **Mobile** | Works (expanded form) | Works (modal overlay) |
| **Desktop** | Works (expanded form) | Works (modal overlay) |

**Recommendation:**
- Use **Inline QuickAdd** when you need to set context/project/date
- Use **N shortcut** for rapid-fire capture of simple tasks
- Use **FAB** on mobile when keyboard isn't available
