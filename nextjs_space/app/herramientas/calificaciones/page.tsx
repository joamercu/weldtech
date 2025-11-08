
import QualificationTracker from '@/app/components/qualification-tracker'
import Navbar from '@/app/components/navbar'
import Footer from '@/app/components/footer'

export default function CalificacionesPage() {
  return (
    <div className="min-h-screen bg-[#0F1216]">
      <Navbar />
      <QualificationTracker />
      <Footer />
    </div>
  )
}
