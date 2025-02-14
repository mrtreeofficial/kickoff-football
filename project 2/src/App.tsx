import React from 'react';
import { Shield, Notebook as Robot, LineChart, ArrowRight } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1f2e] to-[#14142B] relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#9945FF] opacity-5 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#14F195] opacity-5 blur-[100px]" />
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-10 h-10 text-[#14F195]" />
              <span className="text-white font-bold text-2xl">Sentinel DEX</span>
            </div>
            <button className="bg-[#14F195]/10 hover:bg-[#14F195]/20 text-[#14F195] px-6 py-2 rounded-full backdrop-blur-sm transition-all border border-[#14F195]/20">
              Connect Wallet
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-2 bg-[#9945FF]/10 rounded-full backdrop-blur-sm mb-8 border border-[#9945FF]/20">
              <p className="text-[#9945FF] text-sm px-4">
                Powered by Solana
              </p>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              The Future of <span className="text-[#14F195]">AI-Powered</span> Trading
            </h1>
            
            <p className="text-xl text-white/70 mb-12 leading-relaxed">
              Experience the next generation of decentralized trading with advanced AI capabilities.
              Sentinel DEX is coming soon to revolutionize your trading experience.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button className="group bg-[#14F195] hover:bg-[#14F195]/90 text-gray-900 px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all">
                Join Waitlist
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-[#9945FF]/10 hover:bg-[#9945FF]/20 text-[#9945FF] px-8 py-4 rounded-full font-semibold backdrop-blur-sm transition-all border border-[#9945FF]/20">
                Learn More
              </button>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#14F195]/10 hover:border-[#14F195]/20 transition-colors">
              <div className="bg-[#14F195]/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Robot className="w-6 h-6 text-[#14F195]" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-4">AI Trading</h3>
              <p className="text-white/70">
                Advanced algorithms and machine learning to optimize your trading strategies
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#9945FF]/10 hover:border-[#9945FF]/20 transition-colors">
              <div className="bg-[#9945FF]/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-[#9945FF]" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-4">Maximum Security</h3>
              <p className="text-white/70">
                Built with industry-leading security measures to protect your assets
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-colors">
              <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <LineChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-4">Advanced Analytics</h3>
              <p className="text-white/70">
                Real-time market analysis and predictive insights for informed trading
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-[#14F195]" />
              <span className="text-white/70">© 2024 Sentinel DEX</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-white/70 hover:text-[#14F195] transition-colors">Twitter</a>
              <a href="#" className="text-white/70 hover:text-[#14F195] transition-colors">Discord</a>
              <a href="#" className="text-white/70 hover:text-[#14F195] transition-colors">Documentation</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;