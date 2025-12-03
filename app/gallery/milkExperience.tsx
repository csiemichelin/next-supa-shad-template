"use client"

export default function MilkExperience() {
  return (
    <section id="milk" className="w-full px-6 pt-16 pb-20 md:pb-32 bg-secondary/30">
      <div className="text-center space-y-4 mb-15">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#7B5538] font-bold">Fresh Milk</p>
        <h2
          lang="zh-Hant"
          className="text-3xl md:text-5xl font-bold text-foreground"
        >
          鮮乳直送
        </h2>
        <p lang="the-Peak" className="text-muted-foreground text-lg max-w-2xl mx-auto">
          與彰化小農牧場合作，每日低溫配送 12 小時內裝瓶的鮮乳，擁有厚實奶香與乾淨甜感。冷鏈物流與店內 2℃ 冷藏櫃確保鮮度，讓拉花與奶咖更順口。
        </p>
      </div>

      <ul className="text-sm text-stone-600 grid sm:grid-cols-2 gap-3">
        <li className="rounded-2xl border border-stone-200 bg-white p-4">
          <p className="font-semibold text-stone-900">產地履歷</p>
          <p>每批鮮乳皆附上生產日期與牧場資訊，透明可追溯。</p>
        </li>
        <li className="rounded-2xl border border-stone-200 bg-white p-4">
          <p className="font-semibold text-stone-900">專屬奶泡比例</p>
          <p>建立加熱與打發曲線，確保奶泡密度與甜感達最佳平衡。</p>
        </li>
      </ul>
    </section>
  )
}
