import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Политика обработки персональных данных — Atoros', description: 'Политика обработки персональных данных пользователей сервиса Atoros.ru.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-8">Политика обработки персональных данных</h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>ООО «Патентные Технологии» (ИНН 7716687757, ОГРН 1117746321296) обрабатывает персональные данные пользователей сервиса Atoros.ru в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».</p>
          <p><strong className="text-foreground">Какие данные мы собираем:</strong> ФИО, email, телефон, страна, город. Эти данные указываются при регистрации и используются для оформления свидетельства о депонировании.</p>
          <p><strong className="text-foreground">Где хранятся данные:</strong> На сервере atoros.ru (Россия). Файлы пользователей шифруются AES-256 и хранятся в зашифрованном виде. Доступ к содержимому архива имеет только автор (через пароль).</p>
          <p><strong className="text-foreground">Передача третьим лицам:</strong> Зашифрованные копии архивов загружаются на Яндекс.Диск и Google Drive. Без пароля содержимое недоступно. Персональные данные пользователей третьим лицам не передаются.</p>
          <p><strong className="text-foreground">Срок хранения:</strong> Персональные данные хранятся до удаления аккаунта пользователем. Свидетельства о депонировании хранятся бессрочно.</p>
          <p><strong className="text-foreground">Права пользователя:</strong> Вы можете запросить удаление персональных данных, написав на info@atoros.ru.</p>
        </div>
      </main>
    <SiteFooter />
    </div>
  );
}
