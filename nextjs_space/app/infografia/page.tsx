import InfografiaViewer from '../components/infografia-viewer'

// Evitar prerenderizado - esta página usa hooks del cliente y APIs del navegador
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function InfografiaPage() {
  return <InfografiaViewer />
}
