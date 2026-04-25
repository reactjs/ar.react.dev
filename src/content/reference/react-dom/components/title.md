---
title: "<title>"
---

<Intro>

يتيح لك [مكوّن `<title>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) تحديد عنوان المستند.

```js
<title>My Blog</title>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<title>` {/*title*/}

لتحديد عنوان المستند، صيّر [مكوّن `<title>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title). يمكنك تصيير `<title>` من أي مكوّن وسيضع React دائمًا عنصر DOM المقابل في رأس المستند.

```js
<title>My Blog</title>
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*props*/}

يدعم `<title>` [جميع خصائص العناصر الشائعة.](/reference/react-dom/components/common#common-props)

* `children`: يقبل `<title>` نصًا فقط كابن. يصبح هذا النص عنوان المستند. يمكنك أيضًا تمرير مكوّناتك الخاصة طالما أنها تصيّر نصًا فقط.

#### سلوك تصيير خاص {/*special-rendering-behavior*/}

سيضع React دائمًا عنصر DOM المقابل لمكوّن `<title>` داخل `<head>` للمستند، بغضّ النظر عن مكان تصييره في شجرة React. `<head>` هو المكان الصالح الوحيد لوجود `<title>` في DOM، مع أنه من المريح أن يمثّل مكوّن الصفحة عنوانه بنفسه.

يستثنى من ذلك أمران:
* إذا كان `<title>` داخل مكوّن `<svg>`، فلا يوجد سلوك خاص، لأن السياق هنا لا يمثل عنوان المستند بل [تعليقًا للوصولية على الرسم SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title).
* إذا كان لـ `<title>` سمة [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop)، فلا يوجد سلوك خاص، لأن الحالة هنا لا تمثل عنوان المستند بل بيانات وصفية عن جزء معيّن من الصفحة. 

<Pitfall>

صيّر `<title>` واحدًا فقط في كل مرة. إذا صيَّر أكثر من مكوّن وسوم `<title>` في آن واحد، سيضع React كل هذه العناوين في رأس المستند. عندها يكون سلوك المتصفحات ومحركات البحث غير محدد.

</Pitfall>

---

## الاستخدام {/*usage*/}

### تعيين عنوان المستند {/*set-the-document-title*/}

صيّر مكوّن `<title>` من أي مكوّن مع نص كأبناء. سيضع React عقدة `<title>` في `<head>` للمستند.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### استخدام متغيرات في العنوان {/*use-variables-in-the-title*/}

يجب أن تكون أبناء مكوّن `<title>` سلسلة نصية واحدة. (أو رقمًا واحدًا أو كائنًا واحدًا له طريقة `toString`.) قد لا يبدو واضحًا أن استخدام أقواس JSX هكذا:

```js
<title>Results page {pageNumber}</title> // 🔴 Problem: This is not a single string
```

... يجعل أبناء `<title>` في الواقع مصفوفة من عنصرين (السلسلة `"Results page"` وقيمة `pageNumber`). ذلك يسبب خطأ. بدلًا من ذلك، استخدم دمج السلاسل لتمرير سلسلة واحدة إلى `<title>`:

```js
<title>{`Results page ${pageNumber}`}</title>
```

