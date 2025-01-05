"use client"

import { Web3Provider } from "@/components/Web3Provider"
import { SessionController } from "@/components/SessionController"

import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import NoiseLayer from "@/components/NoiseLayer"
import Grid from "@/components/Grid"
import Footer from "@/components/Footer"

import { Shantell_Sans } from "next/font/google"

const shantellSans = Shantell_Sans({
  subsets: ["latin"],
  variable: "--font-shantell-sans",
})

import "./globals.css"
import { usePathname } from "next/navigation"
import CoolHeader from "@/components/CoolHeader"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${shantellSans.variable} font-shantellSans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          // enableSystem
          // disableTransitionOnChange
        >
          <Web3Provider>
            <SessionController />
            {/* <div className="">
            </div> */}
            {/* <Script
            id="snow"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `var embedimSnow=document.getElementById("embedim--snow");if(!embedimSnow){function embRand(a,b){return Math.floor(Math.random()*(b-a+1))+a}var embCSS='.embedim-snow{position: absolute;width: 10px;height: 10px;background: white;border-radius: 50%;margin-top:-10px}';var embHTML='';for(i=1;i<200;i++){embHTML+='<i class="embedim-snow"></i>';var rndX=(embRand(0,1000000)*0.0001),rndO=embRand(-100000,100000)*0.0001,rndT=(embRand(3,8)*10).toFixed(2),rndS=(embRand(0,10000)*0.0001).toFixed(2);embCSS+='.embedim-snow:nth-child('+i+'){'+'opacity:'+(embRand(1,10000)*0.0001).toFixed(2)+';'+'transform:translate('+rndX.toFixed(2)+'vw,-10px) scale('+rndS+');'+'animation:fall-'+i+' '+embRand(10,30)+'s -'+embRand(0,30)+'s linear infinite'+'}'+'@keyframes fall-'+i+'{'+rndT+'%{'+'transform:translate('+(rndX+rndO).toFixed(2)+'vw,'+rndT+'vh) scale('+rndS+')'+'}'+'to{'+'transform:translate('+(rndX+(rndO/2)).toFixed(2)+'vw, 105vh) scale('+rndS+')'+'}'+'}'}embedimSnow=document.createElement('div');embedimSnow.id='embedim--snow';embedimSnow.innerHTML='<style>#embedim--snow{position:fixed;left:0;top:0;bottom:0;width:100vw;height:100vh;overflow:hidden;z-index:9999999;pointer-events:none}'+embCSS+'</style>'+embHTML;document.body.appendChild(embedimSnow)}`,
              }}
              /> */}

            {pathname !== "/" && <CoolHeader />}
            <NoiseLayer />
            <Grid />
            <div className="min-h-[100svh] flex flex-col justify-between selection:bg-black/60 selection:text-rfGreen">
              <Toaster />

              <div>{children}</div>
              <Footer />
            </div>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
