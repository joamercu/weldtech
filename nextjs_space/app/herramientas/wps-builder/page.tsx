
import WPSBuilder from '@/app/components/wps-builder'
import Navbar from '@/app/components/navbar'
import Footer from '@/app/components/footer'

export default function WPSBuilderPage() {
  return (
    <div className="min-h-screen bg-[#0F1216]">
      <Navbar />
      <WPSBuilder />
      <Footer />
    </div>
  )
}
