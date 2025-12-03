"use client"

export default function EquipmentShowcase() {
  return (
    <section id="equipment" className="w-full px-6 pt-16 pb-20 md:pb-32 bg-secondary/30">
      <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="text-center space-y-4 mb-15">
          <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#7B5538] font-bold">
            Boutique Equipment
          </p>
          <h2
            lang="zh-Hant"
            className="text-3xl md:text-5xl font-bold text-foreground"
          >
            精品設備
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed">
            使用 La Marzocco 旗艦級沖煮系統與多段控溫的義式研磨機，搭配獨立蒸汽與萃取鍋爐設計，讓每一次萃取都能維持穩定水溫與壓力。你可以走近吧台細看儀表、燈號與吧台師的工作動線。
          </p>
          <ul className="text-sm space-y-2 text-white/80">
            <li>• 雙鍋爐手工義式咖啡機</li>
            <li>• EK43 &amp; Mythos 單雙研磨配置</li>
            <li>• 64mm 鈦刀手沖研磨機</li>
          </ul>
        </div>
        <div className="rounded-[24px] overflow-hidden border border-white/20 shadow-2xl">
          <img
            src="/images/espresso-machine-pouring-coffee.jpg"
            alt="精品設備"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
