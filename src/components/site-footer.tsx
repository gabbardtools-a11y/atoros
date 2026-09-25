import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Services */}
          <div>
            <div className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-3">Сервисы</div>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-xs text-muted-foreground hover:text-foreground transition">Как это работает</Link></li>
              <li><Link href="/tariffs" className="text-xs text-muted-foreground hover:text-foreground transition">Тарифы</Link></li>
              <li><Link href="/verify" className="text-xs text-muted-foreground hover:text-foreground transition">Проверка свидетельства</Link></li>
              <li><Link href="/publish" className="text-xs text-muted-foreground hover:text-foreground transition">Публикация контента</Link></li>
              <li><Link href="/claim" className="text-xs text-muted-foreground hover:text-foreground transition">Генератор претензий</Link></li>
              <li><Link href="/anti-piracy" className="text-xs text-muted-foreground hover:text-foreground transition">Антипиратство</Link></li>
              <li><Link href="/block-piracy" className="text-xs text-muted-foreground hover:text-foreground transition">Блокировка пиратства</Link></li>
              <li><Link href="/international" className="text-xs text-muted-foreground hover:text-foreground transition">Международная защита</Link></li>
              <li><Link href="/blockchain" className="text-xs text-muted-foreground hover:text-foreground transition">Блокчейн</Link></li>
            </ul>
          </div>
          {/* Deposit types */}
          <div>
            <div className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-3">Депонирование</div>
            <ul className="space-y-2">
              <li><Link href="/deposit-music" className="text-xs text-muted-foreground hover:text-foreground transition">Музыка и песни</Link></li>
              <li><Link href="/deposit-text" className="text-xs text-muted-foreground hover:text-foreground transition">Тексты и книги</Link></li>
              <li><Link href="/deposit-photo" className="text-xs text-muted-foreground hover:text-foreground transition">Фотографии</Link></li>
              <li><Link href="/deposit-code" className="text-xs text-muted-foreground hover:text-foreground transition">Код и ПО</Link></li>
              <li><Link href="/deposit-design" className="text-xs text-muted-foreground hover:text-foreground transition">Дизайн</Link></li>
              <li><Link href="/deposit-video" className="text-xs text-muted-foreground hover:text-foreground transition">Видео</Link></li>
            </ul>
          </div>
          {/* For whom */}
          <div>
            <div className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-3">Кому</div>
            <ul className="space-y-2">
              <li><Link href="/for-designers" className="text-xs text-muted-foreground hover:text-foreground transition">Дизайнерам</Link></li>
              <li><Link href="/for-developers" className="text-xs text-muted-foreground hover:text-foreground transition">Разработчикам</Link></li>
              <li><Link href="/for-musicians" className="text-xs text-muted-foreground hover:text-foreground transition">Музыкантам</Link></li>
              <li><Link href="/for-photographers" className="text-xs text-muted-foreground hover:text-foreground transition">Фотографам</Link></li>
              <li><Link href="/for-writers" className="text-xs text-muted-foreground hover:text-foreground transition">Писателям</Link></li>
              <li><Link href="/for-business" className="text-xs text-muted-foreground hover:text-foreground transition">Бизнесу</Link></li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <div className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-3">Право</div>
            <ul className="space-y-2">
              <li><Link href="/laws" className="text-xs text-muted-foreground hover:text-foreground transition">Законы</Link></li>
              <li><Link href="/legal-force" className="text-xs text-muted-foreground hover:text-foreground transition">Юридическая сила</Link></li>
              <li><Link href="/proof-court" className="text-xs text-muted-foreground hover:text-foreground transition">Доказательство для суда</Link></li>
              <li><Link href="/registration" className="text-xs text-muted-foreground hover:text-foreground transition">Регистрация прав</Link></li>
              <li><Link href="/know-how" className="text-xs text-muted-foreground hover:text-foreground transition">Защита ноу-хау</Link></li>
              <li><Link href="/trademark" className="text-xs text-muted-foreground hover:text-foreground transition">Товарные знаки</Link></li>
              <li><Link href="/contracts" className="text-xs text-muted-foreground hover:text-foreground transition">Договоры и NDA</Link></li>
              <li><Link href="/what-is-not-protected" className="text-xs text-muted-foreground hover:text-foreground transition">Что не защищается</Link></li>
              <li><Link href="/consultation" className="text-xs text-muted-foreground hover:text-foreground transition">Консультация юриста</Link></li>
            </ul>
          </div>
          {/* Info */}
          <div>
            <div className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-3">Инфо</div>
            <ul className="space-y-2">
              <li><Link href="/info" className="text-xs text-muted-foreground hover:text-foreground transition">Вопрос-ответ</Link></li>
              <li><Link href="/cases" className="text-xs text-muted-foreground hover:text-foreground transition">Кейсы</Link></li>
              <li><Link href="/reviews" className="text-xs text-muted-foreground hover:text-foreground transition">Отзывы</Link></li>
              <li><Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground transition">Блог</Link></li>
              <li><Link href="/registry" className="text-xs text-muted-foreground hover:text-foreground transition">Реестр</Link></li>
              <li><Link href="/marketplace" className="text-xs text-muted-foreground hover:text-foreground transition">Маркетплейсы</Link></li>
              <li><Link href="/protection-business" className="text-xs text-muted-foreground hover:text-foreground transition">Защита бизнеса</Link></li>
              <li><Link href="/protection-startup" className="text-xs text-muted-foreground hover:text-foreground transition">Защита стартапа</Link></li>
              <li><Link href="/blockchain-critique" className="text-xs text-muted-foreground hover:text-foreground transition">Критика блокчейна</Link></li>
            </ul>
          </div>
          {/* Contacts */}
          <div>
            <div className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-3">Контакты</div>
            <ul className="space-y-2">
              <li><Link href="/contacts" className="text-xs text-muted-foreground hover:text-foreground transition">Контакты</Link></li>
              <li><a href="mailto:info@atoros.ru" className="text-xs text-muted-foreground hover:text-foreground transition">info@atoros.ru</a></li>
              <li><a href="tel:+74953691314" className="text-xs text-muted-foreground hover:text-foreground transition">+7 (495) 369-13-14</a></li>
              <li><Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition">Политика данных</Link></li>
              <li><Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition">Соглашение</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            <span className="font-bold text-foreground">Atoros.ru</span> · Deposit4Copyright · ООО «Патентные Технологии» · ИНН 7716687757
          </div>
          <div className="text-xs text-muted-foreground">
            © 2026 Atoros. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
}
