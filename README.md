# اخبار تکنولوژی امروز

وب‌سایت خبری با محوریت آخرین اخبار تکنولوژی از سراسر جهان  
(Tech News Website - Persian)

## ویژگی‌ها

- رابط کاربری راست‌چین و فارسی
- استفاده از [Vite](https://vitejs.dev/) برای توسعه سریع
- استایل‌دهی با [Tailwind CSS](https://tailwindcss.com/) و فونت وزیر
- پشتیبانی از حالت تاریک (Dark Mode)
- ساختار ماژولار با TypeScript

## پیش‌نیازها

- Node.js (نسخه ۱۸ یا بالاتر پیشنهاد می‌شود)
- npm یا yarn

## نصب و راه‌اندازی

```bash
git clone [https://github.com/your-username/news-website.git](https://github.com/mjfrontdev/news-website)
cd news-website
npm install
```

## اجرای پروژه در حالت توسعه

```bash
npm run dev
```

سپس سایت روی آدرس `http://localhost:5173` (یا پورت مشابه) در دسترس خواهد بود.

## ساخت نسخه نهایی (Production)

```bash
npm run build
```

خروجی در پوشه‌ی `dist` قرار می‌گیرد.

## پیش‌نمایش نسخه نهایی

```bash
npm run preview
```

## ساختار پوشه‌ها

```
├── public/           # فایل‌های عمومی (مانند آیکون و تصاویر)
├── src/              # سورس کد اصلی پروژه (TypeScript, CSS)
│   ├── main.ts
│   ├── style.css
│   └── ...
├── index.html        # صفحه اصلی HTML
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── tsconfig.json
```

## تکنولوژی‌ها و ابزارها

- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostCSS](https://postcss.org/)
- [Font Awesome](https://fontawesome.com/)
- [Vazirmatn Font](https://github.com/rastikerdar/vazirmatn)

## فونت و استایل

فونت اصلی پروژه [وزیرمتن (Vazirmatn)](https://github.com/rastikerdar/vazirmatn) است که از CDN بارگذاری می‌شود.
