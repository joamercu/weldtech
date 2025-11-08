
import GuiaDefectos from '@/app/components/guia-defectos'
import Navbar from '@/app/components/navbar'
import Footer from '@/app/components/footer'

export default function DefectosPage() {
  return (
    <div className="min-h-screen bg-[#0F1216]">
      <Navbar />
      <GuiaDefectos />
      <Footer />
    </div>
  )
}
