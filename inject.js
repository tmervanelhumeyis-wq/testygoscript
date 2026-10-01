// =====================================================
//  inject.js — ملف الحقن والتحويل (يرفع على GitHub Pages)
//  عدّل بيانات الكونفيج تحت بس، وسيب الكود زي ما هو
// =====================================================

const CONFIG = {

  // ---------- بيانات الحقن ----------
  keyword: "الكلمة المفتاحية هنا",                 // الجملة اللي عايز تتارشف بيها
  description: "الوصف اللي هيظهر في نتائج البحث هنا", // meta description
  siteName: "اسم الموقع الوهمي",                    // اسم الموقع في OG و السكيما
  image: "https://your-image-host.com/thumb.png",  // صورة المقال/الفيديو (og:image + thumbnail)
  pageUrl: "https://script.google.com/macros/s/AKfycbzGjyYi86FElaQ3wd7-oqti8Layjpv0q0CDhqON5qSCkij0t09uNTyDEGJRdfFd4skPiw/exec", // بعد النشر حط رابط صفحتك

  // المقال الحامل: {K} = مكان حقن الكلمة — انسخ مقال حقيقي وبدّل الأسماء بـ {K}
  articleBody: "{K} live: {K} look to seize control of thrilling {K}. Every team in the {K} has two wins apiece as we go into the final two game weeks. {K} will host {K} at the stadium with the {K} a single point ahead of {K} in the standings.",

  // ---------- التحويل ----------
  redirect: "https://yourblog.blogspot.com", // وجهة الزائر العادي
  delayMs: 0,          // تأخير قبل التحويل بالمللي ثانية (0 = فوري)

  // ---------- البوتات اللي منحولهاش (تشوف الصفحة المحقونة) ----------
  bots: ["googlebot", "bingbot", "slurp", "duckduckbot", "baiduspider",
         "yandex", "facebookexternalhit", "twitterbot", "adsbot", "mediapartners"]
};

// ================== الكود — متعدلش تحت السطر ده ==================

(function () {
  var ua = navigator.userAgent.toLowerCase();
  var isBot = CONFIG.bots.some(function (b) { return ua.indexOf(b) !== -1; });

  if (!isBot) {
    // زائر عادي → تحويل
    setTimeout(function () { window.location.replace(CONFIG.redirect); }, CONFIG.delayMs);
    return;
  }

  // بوت → حقن المحتوى في الصفحة
  var K = CONFIG.keyword;
  function inject(repeat) {
    var body = CONFIG.articleBody.split("{K}").join(K);
    if (repeat) body = (body + " ").repeat(repeat);

    // العنوان والوصف
    document.title = K;
    setMeta("description", K + " — " + CONFIG.description);

    // Open Graph + Twitter
    setMeta("og:title", K, true);
    setMeta("og:description", CONFIG.description, true);
    setMeta("og:image", CONFIG.image, true);
    setMeta("og:type", "article", true);
    setMeta("og:site_name", CONFIG.siteName, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", K);
    setMeta("twitter:image", CONFIG.image);

    // سكيما المقال
    addSchema({
      "@context": "https://schema.org", "@type": "NewsArticle",
      "headline": K, "alternativeHeadline": K,
      "description": K + " — " + CONFIG.description,
      "articleBody": body,
      "inLanguage": "ar",
      "datePublished": new Date().toISOString(),
      "mainEntityOfPage": { "@type": "WebPage", "url": CONFIG.pageUrl },
      "image": { "@type": "ImageObject", "url": CONFIG.image, "width": 1200, "height": 675 },
      "author": { "@type": "Organization", "name": CONFIG.siteName },
      "publisher": { "@type": "Organization", "name": CONFIG.siteName,
        "logo": { "@type": "ImageObject", "url": CONFIG.image } }
    });

    // سكيما المؤسسة
    addSchema({
      "@context": "https://schema.org", "@type": "Organization",
      "name": CONFIG.siteName, "legalName": CONFIG.siteName,
      "url": CONFIG.pageUrl,
      "description": CONFIG.description,
      "logo": { "@type": "ImageObject", "url": CONFIG.image, "width": 600, "height": 60 }
    });

    // سكيما الموقع
    addSchema({
      "@context": "https://schema.org", "@type": "WebSite",
      "name": CONFIG.siteName, "url": CONFIG.pageUrl,
      "inLanguage": "ar"
    });

    // سكيما الفيديو
    addSchema({
      "@context": "https://schema.org", "@type": "VideoObject",
      "name": K, "description": CONFIG.description,
      "thumbnailUrl": [CONFIG.image],
      "uploadDate": new Date().toISOString(),
      "contentUrl": CONFIG.pageUrl
    });

    // المقال المرئي في الصفحة
    var h1 = document.querySelector("h1");
    if (h1) h1.textContent = K;
    var art = document.getElementById("article-body");
    if (art) art.innerHTML = "<p>" + body + "</p>";
    var dt = document.getElementById("article-date");
    if (dt) dt.textContent = new Date().toISOString().slice(0, 10);
  }

  function setMeta(name, content, isProp) {
    var sel = isProp ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
    var el = document.head.querySelector(sel);
    if (!el) {
      el = document.createElement("meta");
      if (isProp) el.setAttribute("property", name); else el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function addSchema(obj) {
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }

  inject();
})();
