---
id: cdn-links
title: روابط شبكة توزيع المحتوى ( CDN )
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

كل من React و ReactDOM متوفران عبر شبكة توزيع المحتوى (CDN)

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
```

الغرض من الإصدارات السّابقة هو التطوير فقط، فهي ليست ملائمة للإنتاج. تتوفر إصدارات React مصغرة ومُحَسَّنة معدة للانتاج: 

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

<<<<<<< HEAD
لتحميل إصدار مُعيَّن من react و react-dom بَدّل الرقم 16 إلى رقم الإصدار المطلوب.
=======
To load a specific version of `react` and `react-dom`, replace `17` with the version number.
>>>>>>> 6682068641c16df6547b3fcdb7877e71bb0bebf9

### لماذا خاصية `crossorigin` ؟ {#why-the-crossorigin-attribute}

إن كنت تزود خدمة React من خلال شبكة توزيع المحتوى، فأننا ننصح باستخدام خاصية [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)

```html
<script crossorigin src="..."></script>
```

ومن الموصى به أيضاً التحقق من أن شبكة توزيع المحتوى المستخدمة مُعين لها ترويسة `Access-Control-Allow-Origin : *`:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

القيام بذلك يقدم تجربة معالجة أخطاء أفضل عند استخدام React 16 أو أعلى.
