import type { PyodideInterface } from './pyodide';

declare global {
  interface Window {
    loadPyodide?: () => Promise<PyodideInterface>;
  }
  type PyodideInterface = import('./pyodide').PyodideInterface;
}