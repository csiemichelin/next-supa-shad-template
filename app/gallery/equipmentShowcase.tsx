"use client"

export default function EquipmentShowcase() {
  return (
    <section id="equipment" className="w-full px-6 pt-16 pb-20 md:pb-32 bg-secondary/30">
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
        <p lang="the-Peak" className="text-muted-foreground text-lg max-w-2xl mx-auto">
          使用 La Marzocco 旗艦級沖煮系統與多段控溫的義式研磨機，搭配獨立蒸汽與萃取鍋爐設計，讓每一次萃取都能維持穩定水溫與壓力
        </p>
      </div>
      <div className="mx-auto max-w-2xl mt-8 px-5">
          <div className="rounded-[24px] border border-gray/10 bg-white/70 backdrop-blur-md shadow-xl overflow-hidden">
            <img
              src="/images/equipment.png"
              alt="精品咖啡設備展示"
              className="w-full h-[280px] md:h-[320px] scale-[1.5] object-contain"
            />
            <div className="text-center bg-background ">
              <ul
                lang="the-Peak"
                className="
                  inline-block 
                  text-left 
                  text-base 
                  leading-relaxed 
                  text-muted-foreground 
                  space-y-1
                  border border-white/25     
                  rounded-2xl               
                  px-6 py-4                 
                  list-disc list-inside  
                "
              >
                <li>雙鍋爐手工義式咖啡機</li>
                <li>EK43 &amp; Mythos 單雙研磨配置</li>
                <li>64mm 鈦刀手沖研磨機</li>
              </ul>
            </div>
          </div>
        </div>
    </section>
  )
}
