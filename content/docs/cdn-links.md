---
id: cdn-links
title: روابط شبكة توزيع المحتوى ( CDN )
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

<div class="scary">

>
> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> See [Add React to an Existing Project](https://react.dev/learn/add-react-to-an-existing-project) for the recommended ways to add React.

</div>

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

لتحميل إصدار مُعيَّن من react و react-dom بَدّل الرقم `18` إلى رقم الإصدار المطلوب.

### لماذا خاصية `crossorigin` ؟ {#why-the-crossorigin-attribute}

إن كنت تزود خدمة React من خلال شبكة توزيع المحتوى، فأننا ننصح باستخدام خاصية [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)

```html
<script crossorigin src="..."></script>
```

ومن الموصى به أيضاً التحقق من أن شبكة توزيع المحتوى المستخدمة مُعين لها ترويسة `Access-Control-Allow-Origin : *`:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

القيام بذلك يقدم تجربة معالجة أخطاء أفضل عند استخدام React 16 أو أعلى.
