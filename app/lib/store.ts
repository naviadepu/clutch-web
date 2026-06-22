// guest mode. everything lives in localStorage — no account, no signup wall.
// log dal in 5 seconds, the account ask comes later (after the dopamine).
//
// reactivity via useSyncExternalStore so the feed and the log sheet stay in
// sync without prop-drilling or a context provider.

import { useSyncExternalStore } from "react";
import { currentPhase, defaultCycleStartISO, type Phase } from "./cycle";
import type { CuisineId } from "./cuisines";
import type { JournalColorId } from "./journal";

export type MedType = "pill" | "supplement" | "birth-control" | "prn";
export type MedSchedule = "daily" | "specific-days" | "as-needed";

export type NutritionInfo = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  portionGrams: number;
  portionLabel: string;
};

export type Med = {
  id: string;
  name: string;
  type: MedType;
  dose?: string;
  schedule: MedSchedule;
  isBirthControl: boolean;
  photo?: string; // dataURL of the bottle, optional
  createdAt: number;
};

export type FoodLog = {
  id: string;
  kind: "food";
  ts: number;
  phase: Phase; // snapshot at write time
  cuisine: CuisineId | "custom";
  item: string;
  photo?: string; // dataURL, optional — the photo IS the log
  portion?: string; // optional, default skips it
  nutrition?: NutritionInfo; // fetched async from Gemini after logging
};

export type MedLog = {
  id: string;
  kind: "med";
  ts: number;
  phase: Phase; // snapshot at write time
  medId: string;
  name: string;
  isBirthControl: boolean;
};

export type LogEntry = FoodLog | MedLog;

export type ClutchState = {
  cycleStartISO: string;
  defaultCuisine: CuisineId;
  journalColor: JournalColorId;
  meds: Med[];
  logs: LogEntry[]; // food + med, newest-first
  savedPatternIds: string[];
  dismissedPatternIds: string[];
  savePromptDismissed: boolean;
  dailyCalorieGoal: number;
  userName: string;
  namePromptDone: boolean;
  showCalorieBar: boolean;
};

const STORAGE_KEY = "clutch.guest.v1";

function freshState(): ClutchState {
  return {
    cycleStartISO: defaultCycleStartISO(),
    defaultCuisine: "indian",
    journalColor: "rose",
    meds: [],
    logs: [],
    savedPatternIds: [],
    dismissedPatternIds: [],
    savePromptDismissed: false,
    dailyCalorieGoal: 2000,
    userName: "",
    namePromptDone: false,
    showCalorieBar: true,
  };
}

// stable default reference for SSR + first client render (no hydration drift).
const SERVER_STATE: ClutchState = freshState();

let state: ClutchState = SERVER_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // private mode / quota — guest mode degrades to in-memory, that's fine.
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function setState(next: ClutchState) {
  state = next;
  persist();
  emit();
}

/** load persisted guest data. call once on mount. */
export function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ClutchState>;
      state = { ...freshState(), ...parsed };
    } else {
      // give the guest a fresh, freshly-stamped cycle start
      state = freshState();
    }
  } catch {
    state = freshState();
  }
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return SERVER_STATE;
}

export function useClutch(): ClutchState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ---- actions -------------------------------------------------------------

export function logFood(input: {
  cuisine: CuisineId | "custom";
  item: string;
  photo?: string;
  portion?: string;
}) {
  const entry: FoodLog = {
    id: uid(),
    kind: "food",
    ts: Date.now(),
    phase: currentPhase(state.cycleStartISO),
    cuisine: input.cuisine,
    item: input.item.trim(),
    photo: input.photo,
    portion: input.portion?.trim() || undefined,
  };
  setState({ ...state, logs: [entry, ...state.logs] });
  return entry;
}

export function addMed(input: {
  name: string;
  type: MedType;
  dose?: string;
  schedule: MedSchedule;
  isBirthControl: boolean;
  photo?: string;
}): Med {
  const med: Med = {
    id: uid(),
    name: input.name.trim(),
    type: input.type,
    dose: input.dose?.trim() || undefined,
    schedule: input.schedule,
    isBirthControl: input.isBirthControl || input.type === "birth-control",
    photo: input.photo,
    createdAt: Date.now(),
  };
  setState({ ...state, meds: [...state.meds, med] });
  return med;
}

export function takeMed(medId: string) {
  const med = state.meds.find((m) => m.id === medId);
  if (!med) return;
  const entry: MedLog = {
    id: uid(),
    kind: "med",
    ts: Date.now(),
    phase: currentPhase(state.cycleStartISO),
    medId: med.id,
    name: med.name,
    isBirthControl: med.isBirthControl,
  };
  setState({ ...state, logs: [entry, ...state.logs] });
  return entry;
}

export function removeMed(medId: string) {
  setState({ ...state, meds: state.meds.filter((m) => m.id !== medId) });
}

export function deleteLog(id: string) {
  setState({ ...state, logs: state.logs.filter((l) => l.id !== id) });
}

export function updateFoodNutrition(id: string, nutrition: NutritionInfo) {
  setState({
    ...state,
    logs: state.logs.map((l) =>
      l.id === id && l.kind === "food" ? { ...l, nutrition } : l,
    ),
  });
}

export function setDefaultCuisine(cuisine: CuisineId) {
  setState({ ...state, defaultCuisine: cuisine });
}

export function setCycleStart(iso: string) {
  setState({ ...state, cycleStartISO: iso });
}

export function setJournalColor(id: JournalColorId) {
  setState({ ...state, journalColor: id });
}

export function savePattern(id: string) {
  if (state.savedPatternIds.includes(id)) return;
  setState({ ...state, savedPatternIds: [...state.savedPatternIds, id] });
}

export function dismissPattern(id: string) {
  if (state.dismissedPatternIds.includes(id)) return;
  setState({
    ...state,
    dismissedPatternIds: [...state.dismissedPatternIds, id],
  });
}

export function dismissSavePrompt() {
  setState({ ...state, savePromptDismissed: true });
}

export function setUserName(name: string) {
  setState({ ...state, userName: name.trim(), namePromptDone: true });
}

export function toggleCalorieBar() {
  setState({ ...state, showCalorieBar: !state.showCalorieBar });
}
