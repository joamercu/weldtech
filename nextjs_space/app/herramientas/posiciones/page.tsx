
import PosicionesEquivalencia from '@/app/components/posiciones-equivalencia'
import Navbar from '@/app/components/navbar'
import Footer from '@/app/components/footer'

export default function PosicionesPage() {
  return (
    <div className="min-h-screen bg-[#0F1216]">
      <Navbar />
      <PosicionesEquivalencia />
      <Footer />
    </div>
  )
}
