"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { X } from "lucide-react"
import Image from "next/image"

interface CoffeeOrigin {
  id: string
  country: string
  flag: string
  position: { x: string; y: string }
  introduction: string
  roastingStyle: string
  menuItems: string[]
  farmer: {
    name: string
    region: string
    description: string
    image: string
  }
}

const coffeeOrigins: CoffeeOrigin[] = [
  {
    id: "kenya",
    country: "肯亞",
    flag: "🇰🇪",
    position: { x: "54%", y: "59%" },
    introduction:
      "這批肯亞咖啡採自中央高地 1,800 公尺的火山土壤，以黑醋栗、葡萄酒般酸度與明亮花香見長。穩定的日夜溫差讓酸質層次純淨鮮明。",
    roastingStyle:
      "採用淺至中烘（City），保留奔放果酸與黑醋栗甜感，尾韻帶出葡萄酒般的圓潤質地。",
    menuItems: ["單品濃縮", "冷萃"],
    farmer: {
      name: "Wanjiru 家族",
      region: "尼耶利 Nyeri 高地",
      description:
        "第三代農夫 Mary Wanjiru 與家族在梯田小農場栽種 SL28 / SL34。手採後送往合作社進行雙重水洗與棚架日曬，讓黑醋栗與柑橘調風味完好保留。",
      image: "/images/farmers/kenya-wanjiru.jpg",
    },
  },
  {
    id: "colombia",
    country: "哥倫比亞",
    flag: "🇨🇴",
    position: { x: "31%", y: "57%" },
    introduction:
      "來自安地斯山脈 1,700 公尺的小農批次，火山土壤與終年雲霧帶來柔和卻有存在感的酸質，風味以紅蘋果、焦糖與牛奶巧克力為主調。",
    roastingStyle:
      "採用中焙（City+），在保留果酸的同時加深焦糖與堅果甜感，適合作為單品與配奶基底。",
    menuItems: ["拿鐵", "美式", "手沖單品"],
    farmer: {
      name: "García 家族",
      region: "威拉 Huila 山區",
      description:
        "García 家族以小規模精緻化經營聞名，主種卡杜拉與卡斯提優。採用水洗處理搭配慢速日曬，使甜感與乾淨度達到穩定的高水準。",
      image: "/images/farmers/colombia-garcia.jpg",
    },
  },
  {
    id: "ethiopia",
    country: "衣索比亞",
    flag: "🇪🇹",
    position: { x: "55%", y: "54%" },
    introduction:
      "誕生於咖啡發源地之一的耶加雪菲高地，海拔約 2,000 公尺。此批次充滿茉莉花香、檸檬皮與白葡萄般的清甜，是最能代表衣索比亞印象的風味之一。",
    roastingStyle:
      "採用淺焙（Light），讓花香與柑橘果酸完整綻放，入口輕盈卻層次豐富。",
    menuItems: ["手沖單品", "冰手沖"],
    farmer: {
      name: "Kebede 小農合作社",
      region: "耶加雪菲 Yirgacheffe",
      description:
        "由當地數十位小農組成的合作社，統一採用手工精選、日曬處理，並以傳統棚架慢速乾燥，保留茶感與花果香的細膩表現。",
      image: "/images/farmers/ethiopia-kebede.jpg",
    },
  },
  {
    id: "brazil",
    country: "巴西",
    flag: "🇧🇷",
    position: { x: "36%", y: "65%" },
    introduction:
      "來自塞拉多高原的大型莊園批次，以均勻日照與溫和氣候孕育出堅果、可可與焦糖的厚實底蘊，是許多配方與奶咖的靈魂基底。",
    roastingStyle:
      "採用中深焙（Full City），加強可可與堅果調，降低酸度，帶出順口耐喝的口感。",
    menuItems: ["拿鐵", "卡布奇諾", "摩卡"],
    farmer: {
      name: "Fazenda Horizonte 莊園",
      region: "米納斯吉拉斯 Minas Gerais",
      description:
        "莊園採用機械與手工並行採收，並以自然日曬與蜂蜜處理為主軸，在穩定產量的同時追求更高甜感與潔淨度。",
      image: "/images/farmers/brazil-horizonte.jpg",
    },
  },
  {
    id: "indonesia",
    country: "印尼",
    flag: "🇮🇩",
    position: { x: "77%", y: "59%" },
    introduction:
      "來自蘇門答臘林東地區，典型濕剝法處理帶來厚重口感與香料、泥土、黑巧克力的深沉風味，是重口味咖啡愛好者的首選之一。",
    roastingStyle:
      "採用中深至深焙（Full City+），突顯煙燻、香料與黑巧克力調性，讓餘韻綿長濃郁。",
    menuItems: ["深焙手沖", "義式濃縮"],
    farmer: {
      name: "Siregar 小農群",
      region: "蘇門答臘林東 Lintong",
      description:
        "Siregar 家族與周邊小農共同運作處理站，以傳統濕剝法搭配高海拔種植，造就獨特泥土與香料調性，並逐步導入更乾淨的乾燥流程。",
      image: "/images/farmers/indonesia-siregar.jpg",
    },
  },
  {
    id: "costa-rica",
    country: "哥斯大黎加",
    flag: "🇨🇷",
    position: { x: "27.5%", y: "52%" },
    introduction:
      "來自塔拉珠高地的精品批次，以乾淨明亮的酸質和柑橘、紅糖風味聞名。高海拔與嚴謹處理讓杯中風味層次清晰分明。",
    roastingStyle:
      "採用淺中焙（Between Light & City），在保持柑橘酸質的同時加入一點紅糖甜感與圓潤口感。",
    menuItems: ["手沖單品", "美式咖啡"],
    farmer: {
      name: "Rodríguez 家族微型處理廠",
      region: "塔拉珠 Tarrazú",
      description:
        "Rodríguez 家族經營的微型處理廠強調批次追溯與精準控溫日曬，選用紅櫻桃進行黃蜜處理，使咖啡同時兼具明亮酸質與柔和甜感。",
      image: "/images/farmers/costa-rica-rodriguez.jpg",
    },
  },
];

export default function OriginsPage() {
  const [selectedOrigin, setSelectedOrigin] = useState<CoffeeOrigin | null>(null)
  const [pinDelays, setPinDelays] = useState<number[]>([])

  useEffect(() => {
    setPinDelays(coffeeOrigins.map(() => Math.random() * 0.6 + 0.1))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 lang="zh-Hant" className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">嚴選豆源</h1>
            <p lang="the-Peak" className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              本店嚴選世界各地咖啡豆，帶你品味其豐富傳承與獨特風味
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="relative w-full aspect-[1200/630] bg-muted/30 rounded-lg overflow-hidden shadow-2xl">
              <Image src="/images/world-map.png" alt="World Map" fill className="object-cover scale-[1.28] translate-x-[5%] -translate-y-[5%]" priority />

              {coffeeOrigins.map((origin, index) => (
                <button
                  key={origin.id}
                  onClick={() => setSelectedOrigin(origin)}
                  className="absolute group cursor-pointer"
                  style={{
                    left: origin.position.x,
                    top: origin.position.y,
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-label={`View ${origin.country} coffee information`}
                >
                    <div
                        className="relative w-9 h-9 hover:scale-110 active:scale-110 transition-transform duration-300"
                        style={{ "--pin-delay": `${pinDelays[index] ?? 0}s` } as CSSProperties}
                    >
                        <div className="absolute z-10 inset-0 drop-shadow-lg">
                            <Image
                            src="/gif/location-pin.gif"
                            alt={`${origin.country} pin`}
                            fill
                            sizes="40px"
                            className="object-contain"
                            unoptimized
                            />
                        </div>
                    </div>

                  <div className="absolute z-20 top-full left-1/2 -translate-x-1/2 mt-1 w-35 rounded-2xl border border-white/40 overflow-hidden opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-300 pointer-events-none">
                      <div className="bg-gradient-to-r from-primary/70 to-accent/70 px-3 py-1 text-xs font-semibold text-primary-foreground flex items-center justify-center gap-2">
                        <div className="relative h-6 w-10 overflow-hidden rounded-md border border-white/30">
                          <Image
                            src={`/images/${origin.id}.png`}
                            alt={`${origin.country} flag`}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <span>{origin.country}</span>
                      </div>
                  </div>
                </button>
              ))}
            </div>

            <div lang="the-Peak" className="text-base mt-5 text-center text-muted-foreground">
              <p>探索世界各地咖啡豆的豐富傳承與獨特風味，這些都是本店嚴選的精品</p>
            </div>
          </div>
        </div>
      </main>

      {selectedOrigin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/70 via-black/60 to-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="group relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-background/95 to-background/80 shadow-[0_30px_120px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 group-active:opacity-60 transition-opacity duration-500">
              <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
              <div className="absolute top-10 -left-16 h-60 w-60 rounded-full bg-accent/25 blur-3xl" />
            </div>
            <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] max-h-[92vh] overflow-y-auto custom-scrollbar">
              <div className="p-8 space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-8">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/20 shadow-lg flex-shrink-0">
                      <Image
                        src={`/images/${selectedOrigin.id}.png`}
                        alt={`${selectedOrigin.country} flag`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <p lang="the-Peak" className="text-base font-bold uppercase tracking-[0.4em] text-muted-foreground metallic-silver">原產地</p>
                      <h2 lang="zh-Hant" className="text-3xl md:text-5xl pt-1 font-bold text-foreground tracking-tight">{selectedOrigin.country}</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOrigin(null)}
                    className="h-10 w-10 rounded-full border border-white/30 text-white flex items-center justify-center bg-white/10 hover:bg-white/20 active:bg-white/20 transition-colors"
                    aria-label="Close origin details"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <section className="space-y-3">
                  <p lang="the-Peak" className="text-base font-bold uppercase tracking-[0.3em] text-muted-foreground">關於咖啡豆</p>
                  <p lang="the-Peak" className="text-base leading-relaxed text-muted-foreground/90">{selectedOrigin.introduction}</p>
                </section>
                
                <section className="space-y-3 rounded-2xl border border-accent/20 bg-accent/5 p-4">
                  <p lang="the-Peak" className="text-base font-bold uppercase tracking-[0.3em] text-accent/80">烘焙程度</p>
                  <p lang="the-Peak" className="text-base text-muted-foreground leading-relaxed">{selectedOrigin.roastingStyle}</p>
                </section>

                <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5">
                  <p lang="the-Peak" className="mb-2 text-base font-bold uppercase tracking-[0.3em] text-muted-foreground">咖啡農的故事</p>
                  <div lang="the-Peak" className="text-sm font-bold flex flex-wrap items-center uppercase tracking-[0.1em] text-accent/80">
                    <span>{selectedOrigin.farmer.region} • {selectedOrigin.farmer.name}</span>
                  </div>
                  <div className="relative h-48 w-full overflow-hidden rounded-xl">
                    <Image
                      src={selectedOrigin.farmer.image}
                      alt={`${selectedOrigin.country} 小農 ${selectedOrigin.farmer.name}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 40vw, 80vw"
                    />
                  </div>
                  <p lang="the-Peak" className="text-sm text-muted-foreground leading-snug">
                    {selectedOrigin.farmer.description}
                  </p>
                </section>
              </div>

              <div className="relative border-l border-white/10 bg-black/15 p-8 flex flex-col gap-6">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-5 text-center shadow-inner">
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-1">Harvest Altitude</p>
                  <p className="text-4xl font-serif text-foreground">1,800m</p>
                  <p className="text-xs text-muted-foreground">Above sea level</p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Menu Highlights</p>
                  <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedOrigin.menuItems.length > 0 ? (
                      selectedOrigin.menuItems.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-white/10 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-4"
                        >
                          <p className="font-semibold text-white">{item}</p>
                          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Signature Beverage
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-sm text-center py-6 rounded-2xl border border-white/10 bg-white/5">
                        No menu items currently use beans from this origin
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

