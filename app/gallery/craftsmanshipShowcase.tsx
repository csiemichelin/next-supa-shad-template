"use client"

export default function CraftsmanshipShowcase() {
  return (
    <section id="craftsmanship" className="w-full py-16 px-6 bg-emerald-950 rounded-[32px] border border-emerald-800/50 text-emerald-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">Craftsmanship</p>
          <h2 className="text-3xl md:text-4xl font-semibold">職人堅持</h2>
          <p className="text-sm md:text-base text-emerald-100/80 leading-relaxed">
            從杯測、烘焙到沖煮流程，我們遵循 SCA 標準訓練，維持穩定的萃取紀錄。每位吧台同仁每日進行手沖曲線與義式萃取記錄，確保每杯咖啡都符合當日標準。
          </p>
        </div>
        <div className="rounded-[24px] overflow-hidden bg-white/5 border border-white/10">
          <img
            src="/images/barista-pouring-milk-coffee.jpg"
            alt="職人堅持"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-emerald-100/80">
          <div className="rounded-2xl border border-emerald-800/60 p-4">
            <p className="text-lg font-semibold text-white mb-2">每日練習</p>
            <p>手沖萃取曲線與奶泡練習紀錄貼滿工作記錄板，隨時修正手感。</p>
          </div>
          <div className="rounded-2xl border border-emerald-800/60 p-4">
            <p className="text-lg font-semibold text-white mb-2">杯測紀錄</p>
            <p>每批豆子上架前杯測三輪，公開分享風味紀錄與建議沖煮比例。</p>
          </div>
          <div className="rounded-2xl border border-emerald-800/60 p-4">
            <p className="text-lg font-semibold text-white mb-2">顧客回饋</p>
            <p>定期舉辦手沖體驗與杯測課，收集回饋持續優化出杯流程。</p>
          </div>
        </div>
      </div>
    </section>
  )
}
