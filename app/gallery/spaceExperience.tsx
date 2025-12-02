"use client"

export default function SpaceExperience() {
  return (
    <section id="space" className="w-full py-16 px-6 bg-white rounded-[32px] border border-black/5 text-gray-900">
      <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[0.9fr_1.1fr] items-center">
        <div className="rounded-[24px] overflow-hidden shadow-xl">
          <img
            src="/images/coffee-shop-interior-cozy-seating.jpg"
            alt="溫馨空間"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Cozy Space</p>
          <h2 className="text-3xl md:text-4xl font-semibold">溫馨空間</h2>
          <p className="text-base text-gray-600 leading-relaxed">
            以大量木質與柔和光線打造的溫暖座位，讓早晨到夜晚都能感受舒適的待客氛圍。窗邊座席配置隱藏插座與 USB 充電，適合攜帶筆電或閱讀。
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-500">
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="font-semibold text-gray-800">包廂感桌區</p>
              <p>柔和燈帶與大片植栽打造質感角落，適合 2-4 人聚會。</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="font-semibold text-gray-800">長吧台</p>
              <p>可近距離觀賞手沖與拉花流程，享受職人級沖煮演繹。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
