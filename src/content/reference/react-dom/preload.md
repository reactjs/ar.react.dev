---
title: "التحميل المسبق (preload)"
---

<Note>

[أُطر React](/learn/creating-a-react-app) غالبًا تتولى تحميل الموارد نيابةً عنك، فقد لا تحتاج لاستدعاء هذه الواجهة بنفسك. راجع توثيق إطارك للتفاصيل.

</Note>

<Intro>

تمكنك `preload` من جلب مورد بشكل استباقي، مثل ورقة أنماط أو خط أو سكربت خارجي تتوقع استخدامه.

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `preload(href, options)` {/*preload*/}

لتحميل مورد مسبقًا، استدعِ الدالة `preload` من `react-dom`.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[المزيد من الأمثلة أدناه.](#usage)

توفّر `preload` للمتصفّح تلميحًا بأن يبدأ تنزيل المورد المحدّد، ما قد يوفر وقتًا.

#### المعاملات {/*parameters*/}

* `href`: سلسلة نصية. عنوان URL للمورد الذي تريد تنزيله.
* `options`: كائن يحتوي الخصائص التالية:
  *  `as`: سلسلة مطلوبة. نوع المورد. [قيمها الممكنة](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as) هي `audio` و`document` و`embed` و`fetch` و`font` و`image` و`object` و`script` و`style` و`track` و`video` و`worker`.
  * `crossOrigin`: سلسلة. [سياسة CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) المستخدمة. القيم الممكنة `anonymous` و`use-credentials`. مطلوبة عند ضبط `as` إلى `"fetch"`.
  * `referrerPolicy`: سلسلة. [رأس Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) المرسل عند الجلب. القيم الممكنة `no-referrer-when-downgrade` (الافتراضي) و`no-referrer` و`origin` و`origin-when-cross-origin` و`unsafe-url`.
  * `integrity`: سلسلة نصية. تجزئة تشفيرية للمورد لـ [التحقق من سلامته](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  * `type`: سلسلة. نوع MIME للمورد.
  * `nonce`: سلسلة نصية. [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) تشفيري للسماح بالمورد مع سياسة أمان محتوى صارمة.
  * `fetchPriority`: سلسلة. تقترح أولوية نسبية لتنزيل المورد. القيم الممكنة `auto` (الافتراضي) و`high` و`low`.
  * `imageSrcSet`: سلسلة. للاستخدام فقط مع `as: "image"`. تحدد [مجموعة مصادر الصورة](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
  * `imageSizes`: سلسلة. للاستخدام فقط مع `as: "image"`. تحدد [أحجام الصورة](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

#### القيمة المُرجَعة {/*returns*/}

لا تُرجِع `preload` شيئًا.

#### ملاحظات {/*caveats*/}

* عدة استدعاءات مكافئة لـ `preload` لها نفس أثر استدعاء واحد. تُعتبر الاستدعاءات مكافئة وفق القواعد التالية:
  * استدعاءان مكافئان إن كان لهما نفس `href`، باستثناء:
  * إن ضُبط `as` إلى `image`، يكون الاستدعاءان مكافئين إن كان لهما نفس `href` و`imageSrcSet` و`imageSizes`.
* في المتصفّح يمكن استدعاء `preload` في أي موضع: أثناء تصيير مكوّن، أو في Effect، أو في معالج حدث، إلخ.
* في التصيير على الخادم أو عند تصيير مكوّنات الخادم، لا يكون لـ `preload` أثر إلا إذا استُدعي أثناء تصيير مكوّن أو في سياق async منبثق من تصيير مكوّن. تُتجاهل أي استدعاءات أخرى.

---

## الاستخدام {/*usage*/}

### التحميل المسبق أثناء التصيير {/*preloading-when-rendering*/}

استدعِ `preload` أثناء تصيير مكوّن إن كنت تعلم أنه أو أبناؤه سيستخدمون موردًا محددًا.

<Recipes titleText="أمثلة على التحميل المسبق">

#### تحميل سكربت خارجي مسبقًا {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

إن أردت أن يبدأ المتصفّح تنفيذ السكربت فورًا (وليس التنزيل فقط)، استخدم [`preinit`](/reference/react-dom/preinit) بدلًا من ذلك. إن أردت تحميل وحدة ESM، استخدم [`preloadModule`](/reference/react-dom/preloadModule).

<Solution />

#### تحميل ورقة أنماط مسبقًا {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

إن أردت إدراج الورقة في المستند فورًا (أي أن يبدأ المتصفّح تحليلها فورًا وليس التنزيل فقط)، استخدم [`preinit`](/reference/react-dom/preinit) بدلًا من ذلك.

<Solution />

#### تحميل خط مسبقًا {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

إن حمّلت ورقة أنماط مسبقًا، من الحكمة تحميل أي خطوط تشير إليها الورقة مسبقًا أيضًا. فيستطيع المتصفّح بدء تنزيل الخط قبل انتهاء تنزيل الورقة وتحليلها.

<Solution />

#### تحميل صورة مسبقًا {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

عند تحميل صورة مسبقًا، تساعد خيارات `imageSrcSet` و`imageSizes` المتصفّح على [جلب الحجم المناسب لحجم الشاشة](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

<Solution />

</Recipes>

### التحميل المسبق في معالج حدث {/*preloading-in-an-event-handler*/}

استدعِ `preload` في معالج حدث قبل الانتقال إلى صفحة أو حالة سيُحمّل فيها موارد خارجية. يبدأ ذلك مبكرًا أكثر من الاستدعاء أثناء تصيير الصفحة أو الحالة الجديدة.

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>ابدأ المعالج</button>
  );
}
```
