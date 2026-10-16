(function () {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
  var sel = '.section__head, .showcase__item, .feature, .step, .proof li, .compare__item, .problem, .plan, .faq__item, details, .about, .works';
  var els = document.querySelectorAll(sel);
  var root = document.documentElement;
  root.classList.add('reveal-on');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(function (el, i) {
    el.classList.add('rv');
    el.style.transitionDelay = (i % 3) * 70 + 'ms';
    io.observe(el);
  });
})();
