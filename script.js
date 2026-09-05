(function(){
  // ---------- Language switching ----------
  var html = document.documentElement;
  var langButtons = document.querySelectorAll('[data-setlang]');

  function applyLang(lang){
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-ar]').forEach(function(el){
      var val = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if(val !== null){
        el.textContent = val;
      }
    });
    document.querySelectorAll('[data-ar-html]').forEach(function(el){
      var val = lang === 'ar' ? el.getAttribute('data-ar-html') : el.getAttribute('data-en-html');
      if(val !== null){ el.innerHTML = val; }
    });

    langButtons.forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-setlang') === lang);
    });
  }

  langButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      applyLang(btn.getAttribute('data-setlang'));
    });
  });

  // ---------- AI Vision demo (camera + simulated recognition) ----------
  var camStart   = document.getElementById('camStart');
  var camAnalyze = document.getElementById('camAnalyze');
  var camVideo   = document.getElementById('camVideo');
  var camPlaceholder = document.getElementById('camPlaceholder');
  var camStatus  = document.getElementById('camStatus');
  var scanLine   = document.getElementById('scanLine');
  var resSign    = document.getElementById('resSign');
  var resReply   = document.getElementById('resReply');
  var confFill   = document.getElementById('confFill');

  var currentLangGetter = function(){ return html.getAttribute('data-lang') || 'ar'; };

  var signSamples = [
    { ar: 'مرحبًا',     en: 'Hello',    reply_ar: 'أهلاً بك في المتحف!',            reply_en: 'Hello, welcome to the museum!' },
    { ar: 'شكرًا',      en: 'Thank you',reply_ar: 'العفو، بالتوفيق في جولتك!',        reply_en: 'You are welcome — enjoy your visit!' },
    { ar: 'أين',        en: 'Where',    reply_ar: 'اتبعني، سأقودك إلى هناك.',         reply_en: 'Follow me, I will guide you there.' },
    { ar: 'مساعدة',     en: 'Help',     reply_ar: 'بالتأكيد، كيف يمكنني مساعدتك؟',    reply_en: 'Of course — how can I help you?' }
  ];

  camStart.addEventListener('click', function(){
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      camStatus.textContent = currentLangGetter() === 'ar' ? 'الكاميرا غير مدعومة' : 'Camera unsupported';
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream){
        camVideo.srcObject = stream;
        camVideo.style.display = 'block';
        camPlaceholder.style.display = 'none';
        camStatus.textContent = currentLangGetter() === 'ar' ? 'يعمل الآن' : 'Live';
        scanLine.classList.add('on');
        camAnalyze.disabled = false;
        camStart.setAttribute('disabled','disabled');
      })
      .catch(function(){
        camStatus.textContent = currentLangGetter() === 'ar' ? 'تم رفض الإذن' : 'Permission denied';
      });
  });

  camAnalyze.addEventListener('click', function(){
    var lang = currentLangGetter();
    camAnalyze.disabled = true;
    resSign.textContent = lang === 'ar' ? 'جارِ التحليل…' : 'Analyzing…';
    resReply.textContent = '—';
    confFill.style.width = '0%';

    setTimeout(function(){
      var sample = signSamples[Math.floor(Math.random() * signSamples.length)];
      var confidence = 82 + Math.floor(Math.random() * 15);
      resSign.textContent = lang === 'ar' ? sample.ar : sample.en;
      resReply.textContent = lang === 'ar' ? sample.reply_ar : sample.reply_en;
      confFill.style.width = confidence + '%';
      camAnalyze.disabled = false;
    }, 900);
  });

  // ---------- Mobile burger ----------
  var burger = document.querySelector('.burger');
  if(burger){
    burger.addEventListener('click', function(){
      document.querySelector('#features').scrollIntoView({ behavior:'smooth' });
    });
  }

  applyLang('ar');
})();