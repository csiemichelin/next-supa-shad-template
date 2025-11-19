import { Instagram, Facebook, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="/logo/logo_white.png"
                alt="Shiguang Coffee Logo"
                className="h-25 rounded-full object-cover"
              />
              <h3 lang="zh-Hant" className="text-3xl md:text-4xl font-bold tracking-wide">
                時光咖啡
              </h3>
            </div>
            <p lang="zh-Hant" className="text-2xl text-primary-foreground/80 leading-relaxed">
              自 2018 年起，用咖啡陪你走過每個日常
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">常用連結</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  首頁
                </a>
              </li>
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  關於我們
                </a>
              </li>
              <li>
                <a href="#menu" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  菜單
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  店面資訊
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">聯絡我們</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  活動企劃
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  人才招募
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  加入我們
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">關注我們</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/80">
          <p>© {new Date().getFullYear()} Shiguang Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
