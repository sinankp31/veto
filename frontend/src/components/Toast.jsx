import { useUI } from '../context/UIContext'

export default function Toast() {
  const { toast } = useUI()
  return toast ? <div key={toast.id} className={`toast ${toast.tone}`} role="status">{toast.message}</div> : null
}
