/*
 * Culpritly landing page analytics (GA4).
 *
 * Same GA4 property as faisalalvi.com (stream G-7JH7HHRTV6). Every event carries
 * product=culpritly so landing traffic can be filtered with one dimension.
 *
 * - Only faisalalvi.com loads gtag.js. Any other host (localhost, previews) logs
 *   events to the console, so dev traffic never reaches GA4.
 * - Consent Mode v2: EEA, UK and CH start denied. The banner appears for European
 *   time zones only. The choice is shared with faisalalvi.com (same origin).
 * - Only fixed labels are sent. No form values, emails or free text.
 * - Sign-up links to the app get ga_cid and cta params so the app can attribute
 *   server-side sign_up and purchase events to this visit. Only added when the
 *   _ga cookie exists, which means the visitor has not been denied analytics.
 */
(function () {
    'use strict';

    var GA_ID = 'G-7JH7HHRTV6';
    var PROD_HOSTS = ['faisalalvi.com', 'www.faisalalvi.com'];
    var IS_PROD = PROD_HOSTS.indexOf(location.hostname) !== -1;
    var APP_HOST = '35-253-165-3.sslip.io';
    var BOOKING_HOST = 'calendly.com';
    var CONSENT_KEY = 'fa_analytics_consent';

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    var stored = null;
    try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) {}

    gtag('consent', 'default', {
        ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
        region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'],
        wait_for_update: 500
    });
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    if (stored === 'granted') gtag('consent', 'update', { analytics_storage: 'granted' });
    if (stored === 'denied') gtag('consent', 'update', { analytics_storage: 'denied' });

    // ---- Page classification ----------------------------------------------
    var path = location.pathname.replace(/\/+$/, '/');
    var pageType = 'other';
    if (/\/culpritly\/(index\.html)?$/.test(path) || path === '/') pageType = 'landing';
    else if (/privacy\.html$/.test(path)) pageType = 'privacy';
    else if (/404/.test(path)) pageType = 'not_found';

    gtag('js', new Date());
    gtag('config', GA_ID, { page_type: pageType, product: 'culpritly' });
    if (IS_PROD) {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
    }

    function track(name, params) {
        params = params || {};
        params.page_type = pageType;
        params.product = 'culpritly';
        gtag('event', name, params);
        if (!IS_PROD && window.console) console.log('[analytics]', name, params);
    }
    window.cuTrack = track;

    // ---- Helpers ----------------------------------------------------------
    // Where on the page a link sits: header, footer, or the id of its section.
    function where(el) {
        if (el.closest('.site-header')) return 'nav';
        if (el.closest('.site-footer')) return 'footer';
        var sec = el.closest('section');
        if (sec) {
            if (sec.id) return sec.id;
            if (sec.classList.contains('hero2')) return 'hero';
            if (sec.classList.contains('cta-band')) return 'cta_band';
        }
        return 'body';
    }
    function label(el) {
        // Skip the visually hidden "(opens in a new tab)" text that screen readers get.
        var c = el.cloneNode(true);
        Array.prototype.forEach.call(c.querySelectorAll('.visually-hidden'), function (n) { n.remove(); });
        return (c.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    }
    function clientId() {
        var m = document.cookie.match(/(?:^|;\s*)_ga=GA\d\.\d\.(\d+\.\d+)/);
        return m ? m[1] : '';
    }

    // ---- Clicks -----------------------------------------------------------
    function decorate(a, url, cta) {
        if (url.pathname.replace(/\/+$/, '') !== '/signup') return;
        var cid = clientId();
        if (cid) url.searchParams.set('ga_cid', cid);
        url.searchParams.set('cta', cta);
        a.href = url.toString();
    }

    function onClick(e) {
        var a = e.target.closest && e.target.closest('a[href]');
        if (!a) return;
        var url;
        try { url = new URL(a.getAttribute('href') || '', location.href); } catch (err) { return; }
        var loc = where(a);
        var base = { cta_location: loc, cta_text: label(a) };

        if (url.protocol === 'mailto:') {
            track('click_email', { cta_location: loc });
        } else if (url.hostname === BOOKING_HOST) {
            base.cta_destination = loc === 'hands-on' ? 'hands_on_help' : 'free_replay';
            track(loc === 'hands-on' ? 'click_hands_on' : 'click_book_call', base);
        } else if (url.hostname === APP_HOST) {
            var p = url.pathname.replace(/\/+$/, '');
            if (p === '/signup') {
                decorate(a, url, loc);
                track('click_signup', base);
            } else if (p === '/login') {
                track('click_login', base);
            } else {
                base.cta_destination = p.replace(/^\//, '') || 'app_home';
                track('click_app_page', base);
            }
        } else if (url.hostname === 'faisalalvi.com' || url.hostname === 'www.faisalalvi.com') {
            track('click_founder_site', base);
        } else if (url.hostname.indexOf('linkedin.com') !== -1) {
            track('click_linkedin', base);
        } else if (a.hash && url.pathname === location.pathname && a.closest('.site-nav')) {
            track('click_nav', { cta_text: label(a), cta_location: 'nav' });
        }
    }
    document.addEventListener('click', onClick, true);
    // Middle click and keyboard context opens still need the sign-up params.
    document.addEventListener('auxclick', onClick, true);

    // ---- Section views (once each) ----------------------------------------
    var SECTIONS = {
        'product': 'view_product',
        'how-it-works': 'view_how_it_works',
        'features': 'view_features',
        'pricing': 'view_pricing',
        'hands-on': 'view_hands_on',
        'faq': 'view_faq',
        'real-case': 'view_real_case',
        'replay': 'view_replay_offer'
    };
    if ('IntersectionObserver' in window) {
        var seen = {};
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting || seen[en.target.id]) return;
                seen[en.target.id] = true;
                track(SECTIONS[en.target.id], { section: en.target.id });
                io.unobserve(en.target);
            });
        }, { threshold: 0.35 });
        Object.keys(SECTIONS).forEach(function (id) {
            var el = document.getElementById(id);
            if (el) io.observe(el);
        });
    }

    // ---- Scroll depth (landing page only) ---------------------------------
    if (pageType === 'landing') {
        var marks = [25, 50, 75, 100], hit = {};
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                ticking = false;
                var h = document.documentElement.scrollHeight - window.innerHeight;
                if (h <= 0) return;
                var pct = Math.round((window.scrollY / h) * 100);
                marks.forEach(function (m) {
                    if (pct >= m - (m === 100 ? 2 : 0) && !hit[m]) {
                        hit[m] = true;
                        track('scroll_depth', { percent: m });
                    }
                });
            });
        }, { passive: true });
    }

    // ---- FAQ opens, tour video --------------------------------------------
    document.addEventListener('toggle', function (e) {
        var d = e.target;
        if (!d || d.tagName !== 'DETAILS' || !d.open || !d.closest('.faq')) return;
        var q = d.querySelector('summary');
        track('faq_open', { question: q ? q.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) : '' });
    }, true);

    var vid = document.querySelector('.showreel__video');
    if (vid) {
        var played = false, done = false;
        // Autoplays muted, so count a play only once the visitor unmutes or uses the controls.
        vid.addEventListener('volumechange', function () {
            if (!vid.muted && !played) { played = true; track('tour_video_play', { how: 'unmuted' }); }
        });
        vid.addEventListener('seeked', function () {
            if (!played) { played = true; track('tour_video_play', { how: 'seek' }); }
        });
        vid.addEventListener('timeupdate', function () {
            if (!done && vid.duration && vid.currentTime / vid.duration > 0.9) {
                done = true;
                track('tour_video_complete', {});
            }
        });
    }

    // ---- Consent banner (European time zones only) ------------------------
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    var IN_EUROPE = /^Europe\//.test(tz) || ['Atlantic/Reykjavik', 'Atlantic/Canary', 'Atlantic/Madeira', 'Atlantic/Azores'].indexOf(tz) !== -1;
    var FORCE = /[?&]consent=show(&|$)/.test(location.search);
    if (FORCE || (IN_EUROPE && !stored)) {
        document.addEventListener('DOMContentLoaded', function () {
            var box = document.createElement('div');
            box.setAttribute('role', 'dialog');
            box.setAttribute('aria-label', 'Analytics cookies');
            box.className = 'consent';
            box.innerHTML = '<p>We use Google Analytics cookies to see which parts of this page are useful. See the <a href="privacy.html">privacy page</a>.</p>' +
                '<div class="consent__btns"><button type="button" class="btn btn--primary btn--sm" data-c="granted">Accept</button>' +
                '<button type="button" class="btn btn--ghost btn--sm" data-c="denied">Decline</button></div>';
            box.addEventListener('click', function (ev) {
                var v = ev.target.getAttribute && ev.target.getAttribute('data-c');
                if (!v) return;
                try { localStorage.setItem(CONSENT_KEY, v); } catch (err) {}
                gtag('consent', 'update', { analytics_storage: v });
                box.remove();
            });
            document.body.appendChild(box);
        });
    }
})();
