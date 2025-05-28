import './style.css'

// Types
interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  author: string;
  publishedAt: string;
  comments?: Comment[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

interface NewsResponse {
  articles: Article[];
  status: string;
  totalResults: number;
}

interface NewsletterSubscriber {
  email: string;
  preferences: string[];
}

// State Management
let currentPage = 'home';

// Components
function createNavbar(): HTMLElement {
  const navbar = document.createElement('nav');
  navbar.className = 'sticky top-0 bg-white dark:bg-gray-800 shadow-md z-50';
  
  const container = document.createElement('div');
  container.className = 'container mx-auto px-4 py-4 flex justify-between items-center';
  
  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold text-gradient hover-lift';
  title.textContent = 'اخبار تکنولوژی امروز';
  
  // دکمه سرچ
  const searchBtn = document.createElement('button');
  searchBtn.className = 'btn btn-primary hover-lift mr-4 hidden sm:inline-flex';
  searchBtn.innerHTML = '<i class="fas fa-search"></i>';
  searchBtn.title = 'جستجو';
  
  // اینپوت جستجوی بازشونده
  let searchBox: HTMLDivElement | null = null;
  let searchInput: HTMLInputElement | null = null;
  let isSearchOpen = false;

  function openSearchBox() {
    if (isSearchOpen) return;
    isSearchOpen = true;
    searchBox = document.createElement('div');
    searchBox.className = 'absolute left-0 right-0 top-full mx-auto w-full max-w-md z-50 flex justify-center animate-fade-in';
    searchBox.style.direction = 'rtl';
    searchBox.innerHTML = `
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 mt-2 flex items-center gap-2 w-full">
        <input type="text" class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none" placeholder="جستجو در اخبار..." autofocus />
        <button class="btn btn-primary hover-lift"><i class="fas fa-search"></i></button>
      </div>
    `;
    searchInput = searchBox.querySelector('input');
    // بستن با کلیک بیرون
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
    // بستن با کلید Esc
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSearchBox();
    });
    // اضافه به داکیومنت
    container.appendChild(searchBox);
    searchInput?.focus();
  }

  function closeSearchBox() {
    if (!isSearchOpen) return;
    isSearchOpen = false;
    if (searchBox) {
      searchBox.remove();
      searchBox = null;
    }
    document.removeEventListener('mousedown', handleClickOutside);
  }

  function handleClickOutside(e: MouseEvent) {
    if (searchBox && !searchBox.contains(e.target as Node) && !(searchBtn.contains(e.target as Node))) {
      closeSearchBox();
    }
  }

  searchBtn.onclick = () => {
    if (isSearchOpen) {
      closeSearchBox();
    } else {
      openSearchBox();
    }
  };
  
  const rightSection = document.createElement('div');
  rightSection.className = 'flex items-center gap-4';
  
  const themeToggle = document.createElement('button');
  themeToggle.className = 'btn hover-lift';
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  themeToggle.onclick = () => {
    document.documentElement.classList.toggle('dark');
    themeToggle.innerHTML = document.documentElement.classList.contains('dark') 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  };
  
  const menuButton = document.createElement('button');
  menuButton.className = 'btn hover-lift';
  menuButton.innerHTML = '<i class="fas fa-bars"></i>';
  menuButton.onclick = toggleSidebar;
  
  rightSection.appendChild(searchBtn);
  rightSection.appendChild(themeToggle);
  rightSection.appendChild(menuButton);
  
  container.appendChild(title);
  container.appendChild(rightSection);
  navbar.appendChild(container);
  
  return navbar;
}

function createSidebar(): HTMLElement {
  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar';
  
  const menuItems = [
    { icon: 'fa-home', text: 'صفحه اصلی', page: 'home' },
    { icon: 'fa-info-circle', text: 'درباره ما', page: 'about' },
    { icon: 'fa-envelope', text: 'تماس با ما', page: 'contact' }
  ];
  
  const menuList = document.createElement('div');
  menuList.className = 'py-4';
  
  menuItems.forEach(item => {
    const menuItem = document.createElement('a');
    menuItem.href = '#';
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
      <i class="fas ${item.icon} menu-icon"></i>
      <span>${item.text}</span>
    `;
    menuItem.onclick = (e) => {
      e.preventDefault();
      navigateTo(item.page);
      toggleSidebar();
    };
    menuList.appendChild(menuItem);
  });
  
  sidebar.appendChild(menuList);
  
  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.onclick = toggleSidebar;
  document.body.appendChild(overlay);
  
  return sidebar;
}

function createHero(): HTMLElement {
  const hero = document.createElement('section');
  hero.className = 'relative h-[400px] bg-gray-900 text-white wave-container';
  
  const overlay = document.createElement('div');
  overlay.className = 'absolute inset-0 bg-black/50';
  
  const content = document.createElement('div');
  content.className = 'relative h-full flex items-center justify-center text-center';
  
  const title = document.createElement('h2');
  title.className = 'text-5xl font-bold mb-4 text-gradient';
  title.textContent = 'اخبار تکنولوژی امروز';
  
  const subtitle = document.createElement('p');
  subtitle.className = 'text-xl hover-lift';
  subtitle.textContent = 'به‌روزترین اخبار تکنولوژی را با ما دنبال کنید';
  
  // اضافه کردن موج‌ها
  const waves = Array.from({ length: 3 }, (_, i) => {
    const wave = document.createElement('div');
    wave.className = 'wave';
    wave.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="currentColor" fill-opacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    `;
    return wave;
  });
  
  content.appendChild(title);
  content.appendChild(subtitle);
  hero.appendChild(overlay);
  hero.appendChild(content);
  waves.forEach(wave => hero.appendChild(wave));
  
  return hero;
}

function createArticleCard(article: Article): HTMLElement {
  const card = document.createElement('article');
  card.className = 'article-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden';
  
  const image = document.createElement('img');
  image.className = 'w-full h-48 object-cover';
  image.src = article.urlToImage || 'https://via.placeholder.com/400x200';
  image.alt = article.title;
  
  const content = document.createElement('div');
  content.className = 'p-6';
  
  const title = document.createElement('h3');
  title.className = 'text-xl font-bold mb-2';
  title.textContent = article.title;
  
  const meta = document.createElement('div');
  meta.className = 'text-sm text-gray-600 dark:text-gray-400 mb-4';
  meta.textContent = `${article.author || 'ناشناس'} • ${new Date(article.publishedAt).toLocaleDateString('fa-IR')}`;
  
  const description = document.createElement('p');
  description.className = 'text-gray-700 dark:text-gray-300 mb-4';
  description.textContent = article.description;
  
  const actions = document.createElement('div');
  actions.className = 'flex items-center justify-between';
  
  const link = document.createElement('a');
  link.className = 'btn btn-primary inline-block hover-lift';
  link.href = article.url;
  link.target = '_blank';
  link.innerHTML = '<i class="fas fa-external-link-alt ml-2"></i>ادامه مطلب';
  
  const commentCount = document.createElement('span');
  commentCount.className = 'text-sm text-gray-500';
  commentCount.innerHTML = `<i class="fas fa-comments ml-1"></i>${article.comments?.length || 0} نظر`;
  
  actions.appendChild(link);
  actions.appendChild(commentCount);
  
  content.appendChild(title);
  content.appendChild(meta);
  content.appendChild(description);
  content.appendChild(actions);
  
  card.appendChild(image);
  card.appendChild(content);
  
  // اضافه کردن بخش نظرات
  card.appendChild(createCommentSection(article));
  
  return card;
}

function createGrid(articles: Article[]): HTMLElement {
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6';
  
  articles.forEach(article => {
    grid.appendChild(createArticleCard(article));
  });
  
  return grid;
}

function createAboutPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'container mx-auto px-4 py-8';
  
  const content = document.createElement('div');
  content.className = 'max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8';
  
  const title = document.createElement('h2');
  title.className = 'text-3xl font-bold mb-6';
  title.textContent = 'درباره ما';
  
  const description = document.createElement('p');
  description.className = 'text-gray-700 dark:text-gray-300 mb-4 leading-relaxed';
  description.textContent = 'ما یک تیم متخصص در زمینه تکنولوژی هستیم که با هدف ارائه آخرین اخبار و تحولات دنیای فناوری، این وب‌سایت را راه‌اندازی کرده‌ایم. هدف ما آگاهی‌رسانی دقیق و به‌روز به کاربران فارسی‌زبان است.';
  
  const features = document.createElement('div');
  features.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 mt-8';
  
  const featureItems = [
    { icon: 'fa-check-circle', text: 'اخبار به‌روز و معتبر' },
    { icon: 'fa-clock', text: 'به‌روزرسانی مداوم' },
    { icon: 'fa-globe', text: 'پوشش جهانی' },
    { icon: 'fa-users', text: 'تیم متخصص' }
  ];
  
  featureItems.forEach(item => {
    const feature = document.createElement('div');
    feature.className = 'flex items-center gap-3';
    feature.innerHTML = `
      <i class="fas ${item.icon} text-primary text-xl"></i>
      <span>${item.text}</span>
    `;
    features.appendChild(feature);
  });
  
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(features);
  container.appendChild(content);
  
  return container;
}

function createContactPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'container mx-auto px-4 py-8';

  const content = document.createElement('div');
  content.className = 'contact-form';

  const title = document.createElement('h2');
  title.className = 'text-3xl font-bold mb-6 text-gradient';
  title.textContent = 'تماس با ما';

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4 relative';

  const formFields = [
    { type: 'text', name: 'name', label: 'نام', icon: 'fa-user' },
    { type: 'email', name: 'email', label: 'ایمیل', icon: 'fa-envelope' },
    { type: 'tel', name: 'phone', label: 'شماره تماس', icon: 'fa-phone' },
    { type: 'textarea', name: 'message', label: 'پیام', icon: 'fa-comment' }
  ];

  formFields.forEach(field => {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'relative';

    const label = document.createElement('label');
    label.className = '';
    label.textContent = field.label;

    const input = document.createElement(field.type === 'textarea' ? 'textarea' : 'input');
    if (field.type !== 'textarea') {
      (input as HTMLInputElement).type = field.type;
    }
    input.name = field.name;
    input.className = '';
    input.required = true;

    const icon = document.createElement('i');
    icon.className = `fas ${field.icon} input-icon`;

    fieldContainer.appendChild(label);
    fieldContainer.appendChild(input);
    fieldContainer.appendChild(icon);
    form.appendChild(fieldContainer);
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.innerHTML = '<i class="fas fa-paper-plane ml-2"></i>ارسال پیام';

  form.appendChild(submitButton);
  content.appendChild(title);
  content.appendChild(form);
  container.appendChild(content);

  return container;
}

function createNewsPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'container mx-auto px-4 py-8';
  
  // جستجوی پیشرفته
  const searchSection = document.createElement('div');
  searchSection.className = 'mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6';
  
  const searchTitle = document.createElement('h3');
  searchTitle.className = 'text-xl font-bold mb-4 text-gradient';
  searchTitle.textContent = 'جستجوی پیشرفته';
  
  const searchForm = document.createElement('form');
  searchForm.className = 'grid grid-cols-1 md:grid-cols-3 gap-4';
  
  const searchFields = [
    { type: 'text', name: 'keyword', label: 'کلیدواژه', icon: 'fa-search' },
    { type: 'date', name: 'date', label: 'تاریخ', icon: 'fa-calendar' },
    { type: 'select', name: 'category', label: 'دسته‌بندی', icon: 'fa-tag', options: ['همه', 'تکنولوژی', 'علم', 'بازی', 'سخت‌افزار'] }
  ];
  
  searchFields.forEach(field => {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'relative';
    
    const label = document.createElement('label');
    label.className = 'block text-sm font-bold mb-2';
    label.textContent = field.label;
    
    let input: HTMLInputElement | HTMLSelectElement;
    if (field.type === 'select') {
      input = document.createElement('select');
      field.options?.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        input.appendChild(optionElement);
      });
    } else {
      input = document.createElement('input');
      input.type = field.type;
    }
    
    input.name = field.name;
    input.className = 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600';
    
    const icon = document.createElement('i');
    icon.className = `fas ${field.icon} absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`;
    
    fieldContainer.appendChild(label);
    fieldContainer.appendChild(input);
    fieldContainer.appendChild(icon);
    searchForm.appendChild(fieldContainer);
  });
  
  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.className = 'btn btn-primary hover-lift';
  searchButton.innerHTML = '<i class="fas fa-search ml-2"></i>جستجو';
  
  searchForm.appendChild(searchButton);
  searchSection.appendChild(searchTitle);
  searchSection.appendChild(searchForm);
  
  // بخش خبرنامه
  const newsletterSection = document.createElement('div');
  newsletterSection.className = 'mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6';
  
  const newsletterTitle = document.createElement('h3');
  newsletterTitle.className = 'text-xl font-bold mb-4 text-gradient';
  newsletterTitle.textContent = 'خبرنامه';
  
  const newsletterForm = document.createElement('form');
  newsletterForm.className = 'flex flex-col md:flex-row gap-4';
  
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'ایمیل خود را وارد کنید';
  emailInput.className = 'flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600';
  emailInput.required = true;
  
  const subscribeButton = document.createElement('button');
  subscribeButton.type = 'submit';
  subscribeButton.className = 'btn btn-primary hover-lift';
  subscribeButton.innerHTML = '<i class="fas fa-paper-plane ml-2"></i>اشتراک';
  
  newsletterForm.appendChild(emailInput);
  newsletterForm.appendChild(subscribeButton);
  newsletterSection.appendChild(newsletterTitle);
  newsletterSection.appendChild(newsletterForm);
  
  // لیست اخبار
  const newsList = document.createElement('div');
  newsList.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  
  container.appendChild(searchSection);
  container.appendChild(newsletterSection);
  container.appendChild(newsList);
  
  return container;
}

function createCommentSection(article: Article): HTMLElement {
  const container = document.createElement('div');
  container.className = 'comment-section';

  // پیام موفقیت
  let successMsg: HTMLElement | null = null;

  // فرم ارسال نظر
  const commentForm = document.createElement('form');
  commentForm.className = 'comment-form';

  const textarea = document.createElement('textarea');
  textarea.placeholder = 'نظر خود را بنویسید...';
  textarea.required = true;
  textarea.rows = 2;

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> ارسال نظر';

  commentForm.appendChild(textarea);
  commentForm.appendChild(submitButton);

  // لیست نظرات
  const commentsList = document.createElement('div');

  // نمایش نظرات موجود
  function renderComments() {
    commentsList.innerHTML = '';
    if (article.comments && article.comments.length > 0) {
      article.comments.forEach(comment => {
        const card = document.createElement('div');
        card.className = 'comment-card';

        // آواتار (حرف اول نام)
        const avatar = document.createElement('div');
        avatar.className = 'comment-avatar';
        avatar.textContent = comment.author[0] || '؟';

        // محتوای نظر
        const content = document.createElement('div');
        content.className = 'comment-content';

        // هدر: نام و تاریخ
        const header = document.createElement('div');
        header.className = 'comment-header';
        const author = document.createElement('span');
        author.className = 'comment-author';
        author.textContent = comment.author;
        const date = document.createElement('span');
        date.className = 'comment-date';
        date.textContent = new Date(comment.date).toLocaleDateString('fa-IR');
        header.appendChild(author);
        header.appendChild(date);

        // متن نظر
        const text = document.createElement('div');
        text.className = 'comment-text';
        text.textContent = comment.content;

        // اکشن‌ها: لایک و پاسخ
        const actions = document.createElement('div');
        actions.className = 'comment-actions';

        const likeBtn = document.createElement('button');
        likeBtn.type = 'button';
        likeBtn.className = 'comment-like' + (comment.likes > 0 ? ' liked' : '');
        likeBtn.innerHTML = `<i class="fas fa-heart"></i> ${comment.likes}`;
        likeBtn.onclick = () => {
          comment.likes++;
          likeBtn.classList.add('liked');
          likeBtn.innerHTML = `<i class="fas fa-heart"></i> ${comment.likes}`;
        };

        const replyBtn = document.createElement('button');
        replyBtn.type = 'button';
        replyBtn.className = 'comment-reply';
        replyBtn.innerHTML = '<i class="fas fa-reply"></i> پاسخ';
        // (در این نسخه فقط ظاهر دارد)

        actions.appendChild(likeBtn);
        actions.appendChild(replyBtn);

        content.appendChild(header);
        content.appendChild(text);
        content.appendChild(actions);

        card.appendChild(avatar);
        card.appendChild(content);
        commentsList.appendChild(card);
      });
    } else {
      const noComments = document.createElement('p');
      noComments.className = 'text-gray-500 text-center py-4';
      noComments.textContent = 'هنوز نظری ثبت نشده است. اولین نظر را شما بنویسید!';
      commentsList.appendChild(noComments);
    }
  }

  renderComments();

  // هندل ارسال نظر
  commentForm.onsubmit = (e) => {
    e.preventDefault();
    const value = textarea.value.trim();
    if (!value) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'کاربر مهمان',
      content: value,
      date: new Date().toISOString(),
      likes: 0
    };
    if (!article.comments) article.comments = [];
    article.comments.unshift(newComment);
    textarea.value = '';
    renderComments();
    // پیام موفقیت
    if (successMsg) successMsg.remove();
    successMsg = document.createElement('div');
    successMsg.className = 'comment-success';
    successMsg.textContent = 'نظر شما با موفقیت ثبت شد!';
    container.insertBefore(successMsg, commentForm);
    setTimeout(() => successMsg && successMsg.remove(), 2000);
  };

  container.appendChild(commentForm);
  container.appendChild(commentsList);
  return container;
}

function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'bg-gray-800 text-white py-8';
  
  const container = document.createElement('div');
  container.className = 'container mx-auto px-4';
  
  const content = document.createElement('div');
  content.className = 'flex flex-col md:flex-row justify-between items-center';
  
  const socialLinks = document.createElement('div');
  socialLinks.className = 'flex gap-4 mb-4 md:mb-0';
  
  const socialIcons = [
    { icon: 'fa-twitter', url: '#' },
    { icon: 'fa-facebook', url: '#' },
    { icon: 'fa-instagram', url: '#' },
    { icon: 'fa-linkedin', url: '#' }
  ];
  
  socialIcons.forEach(social => {
    const link = document.createElement('a');
    link.href = social.url;
    link.className = 'text-white hover:text-primary transition-colors';
    link.innerHTML = `<i class="fab ${social.icon} text-xl"></i>`;
    socialLinks.appendChild(link);
  });
  
  const copyright = document.createElement('p');
  copyright.className = 'text-xs text-gray-400 mt-4 md:mt-0';
  copyright.textContent = '© ۱۴۰۳ اخبار تکنولوژی امروز. تمامی حقوق محفوظ است.';
  
  content.appendChild(socialLinks);
  content.appendChild(copyright);
  container.appendChild(content);
  footer.appendChild(container);
  
  return footer;
}

function createErrorBanner(message: string): HTMLElement {
  const banner = document.createElement('div');
  banner.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  
  const content = document.createElement('div');
  content.className = 'flex items-center gap-4';
  
  const text = document.createElement('p');
  text.textContent = message;
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'text-white hover:text-gray-200';
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  closeBtn.onclick = () => banner.remove();
  
  content.appendChild(text);
  content.appendChild(closeBtn);
  banner.appendChild(content);
  
  return banner;
}

function createLoadingSpinner(): HTMLElement {
  const spinner = document.createElement('div');
  spinner.className = 'flex justify-center items-center h-32';
  spinner.innerHTML = `
    <div class="flex flex-col items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400 loading-dots">در حال بارگذاری</p>
    </div>
  `;
  return spinner;
}

function createScrollToTopButton(): HTMLElement {
  const button = document.createElement('button');
  button.className = 'fixed bottom-8 left-8 bg-primary text-white p-3 rounded-full shadow-lg opacity-0 transition-opacity duration-300 hover:bg-secondary z-50';
  button.innerHTML = '<i class="fas fa-arrow-up"></i>';
  
  const showButton = () => {
    if (window.scrollY > 300) {
      button.classList.remove('opacity-0');
      button.classList.add('opacity-100');
    } else {
      button.classList.remove('opacity-100');
      button.classList.add('opacity-0');
    }
  };
  
  button.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  window.addEventListener('scroll', showButton);
  
  return button;
}

// Navigation
function navigateTo(page: string) {
  currentPage = page;
  const app = document.getElementById('app');
  if (!app) return;
  
  // Clear current content
  while (app.children.length > 0) {
    app.removeChild(app.children[0]);
  }
  
  // Add navbar and sidebar
  app.appendChild(createNavbar());
  app.appendChild(createSidebar());
  
  // Add page content
  switch (page) {
    case 'home':
      app.appendChild(createHero());
      loadNews();
      break;
    case 'news':
      app.appendChild(createNewsPage());
      loadNews();
      break;
    case 'about':
      app.appendChild(createAboutPage());
      break;
    case 'contact':
      app.appendChild(createContactPage());
      break;
  }
  
  // Add footer
  app.appendChild(createFooter());
}

// Sidebar Toggle
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  }
}

// News Loading
async function loadNews() {
  const app = document.getElementById('app');
  if (!app) return;
  
  const spinner = createLoadingSpinner();
  app.appendChild(spinner);
  
  try {
    const response = await fetch(
      'https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=3005d19be4024fae8a2651d5c7f2388d'
    );
    
    if (!response.ok) {
      throw new Error('خطا در دریافت اخبار');
    }
    
    const data: NewsResponse = await response.json();
    spinner.remove();
    
    if (data.articles.length === 0) {
      throw new Error('هیچ خبری یافت نشد');
    }
    
    // اضافه کردن نظرات نمونه
    const articlesWithComments = data.articles.map(article => ({
      ...article,
      comments: [
        {
          id: '1',
          author: 'علی محمدی',
          content: 'مقاله بسیار مفیدی بود. ممنون از اشتراک‌گذاری.',
          date: new Date().toISOString(),
          likes: 5
        },
        {
          id: '2',
          author: 'سارا احمدی',
          content: 'اطلاعات خوبی در مورد تکنولوژی‌های جدید ارائه شده.',
          date: new Date().toISOString(),
          likes: 3
        }
      ]
    }));
    
    const newsList = document.querySelector('.grid');
    if (newsList) {
      articlesWithComments.forEach(article => {
        newsList.appendChild(createArticleCard(article));
      });
    } else {
      app.appendChild(createGrid(articlesWithComments));
    }
  } catch (error) {
    spinner.remove();
    app.appendChild(createErrorBanner(error instanceof Error ? error.message : 'خطایی رخ داد'));
  }
}

// Initialize App
function initApp() {
  // Set initial theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  
  // Add scroll to top button
  document.body.appendChild(createScrollToTopButton());
  
  // Start with home page
  navigateTo('home');
}

// Start the app
initApp();
