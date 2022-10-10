---
id: cdn-links
title: روابط شبكة توزيع المحتوى ( CDN )
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

كل من React و ReactDOM متوفران عبر شبكة توزيع المحتوى (CDN)

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

الغرض من الإصدارات السّابقة هو التطوير فقط، فهي ليست ملائمة للإنتاج. تتوفر إصدارات React مصغرة ومُحَسَّنة معدة للانتاج: 

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

<<<<<<< HEAD
لتحميل إصدار مُعيَّن من react و react-dom بَدّل الرقم `17` إلى رقم الإصدار المطلوب.
=======
To load a specific version of `react` and `react-dom`, replace `18` with the version number.
>>>>>>> d07016aea812d26c60252a952bff7ae3e70bde27

### لماذا خاصية `crossorigin` ؟ {#why-the-crossorigin-attribute}

إن كنت تزود خدمة React من خلال شبكة توزيع المحتوى، فأننا ننصح باستخدام خاصية [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)

```html
<script crossorigin src="..."></script>
```

ومن الموصى به أيضاً التحقق من أن شبكة توزيع المحتوى المستخدمة مُعين لها ترويسة `Access-Control-Allow-Origin : *`:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

القيام بذلك يقدم تجربة معالجة أخطاء أفضل عند استخدام React 16 أو أعلى.
