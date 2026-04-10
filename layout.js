import './globals.css'
import { AuthProvider } from './context/AuthContext'

export const metadata = {
  title: 'Dashboard Tavo - AI Git Dashboard',
  description: 'AI-powered Git dashboard with full user control and REST API integration',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
