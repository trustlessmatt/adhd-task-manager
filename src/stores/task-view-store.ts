import { create } from 'zustand';

type View = 'all' | 'active' | 'completed'

interface TaskViewStore {
  view: View
  setView: (view: View) => void;
}

export const useTaskViewStore = create<TaskViewStore>((set) => ({
  view: 'active',
  setView: (view) => set({ view }),
}));