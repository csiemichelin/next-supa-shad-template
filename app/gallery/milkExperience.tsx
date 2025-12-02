"use client"

export default function MilkExperience() {
  return (
    <section id="milk" className="w-full py-16 px-6 bg-stone-50 rounded-[32px] border border-stone-200 text-stone-900">
      <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Fresh Milk</p>
          <h2 className="text-3xl md:text-4xl font-semibold">鮮乳直送</h2>
          <p className="text-base text-stone-600 leading-relaxed">
            與彰化小農牧場合作，每日低溫配送 12 小時內裝瓶的鮮乳，擁有厚實奶香與乾淨甜感。冷鏈物流與店內 2℃ 冷藏櫃確保鮮度，讓拉花與奶咖更順口。
          </p>
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
        </div>
        <div className="rounded-[24px] overflow-hidden shadow-xl border border-white">
          <img src="/images/milk.jpg" alt="鮮乳直送" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  )
}
