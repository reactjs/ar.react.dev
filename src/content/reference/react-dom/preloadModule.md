---
title: "تحميل الوحدة مسبقًا (preloadModule)"
---

<Note>

[أُطر React](/learn/creating-a-react-app) غالبًا تتولى تحميل الموارد نيابةً عنك، فقد لا تحتاج لاستدعاء هذه الواجهة بنفسك. راجع توثيق إطارك للتفاصيل.

</Note>

<Intro>

تمكنك `preloadModule` من جلب وحدة ESM بشكل استباقي تتوقع استخدامها.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

لتحميل وحدة ESM مسبقًا، استدعِ الدالة `preloadModule` من `react-dom`.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[المزيد من الأمثلة أدناه.](#usage)

توفّر `preloadModule` للمتصفّح تلميحًا بأن يبدأ تنزيل الوحدة المحدّدة، ما قد يوفر وقتًا.

#### المعاملات {/*parameters*/}

* `href`: سلسلة نصية. عنوان URL للوحدة التي تريد تنزيلها.
* `options`: كائن يحتوي الخصائص التالية:
  *  `as`: سلسلة مطلوبة. يجب أن تكون `'script'`.
  * `crossOrigin`: سلسلة. [سياسة CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) المستخدمة. القيم الممكنة `anonymous` و`use-credentials`.
  * `integrity`: سلسلة نصية. تجزئة تشفيرية للوحدة لـ [التحقق من سلامتها](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  * `nonce`: سلسلة نصية. [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) تشفيري للسماح بالوحدة مع سياسة أمان محتوى صارمة.


#### القيمة المُرجَعة {/*returns*/}

لا تُرجِع `preloadModule` شيئًا.

#### ملاحظات {/*caveats*/}

* عدة استدعاءات لـ `preloadModule` بنفس `href` لها نفس أثر استدعاء واحد.
* في المتصفّح يمكن استدعاء `preloadModule` في أي موضع: أثناء تصيير مكوّن، أو في Effect، أو في معالج حدث، إلخ.
* في التصيير على الخادم أو عند تصيير مكوّنات الخادم، لا يكون لـ `preloadModule` أثر إلا إذا استُدعي أثناء تصيير مكوّن أو في سياق async منبثق من تصيير مكوّن. تُتجاهل أي استدعاءات أخرى.

---

## الاستخدام {/*usage*/}

### التحميل المسبق أثناء التصيير {/*preloading-when-rendering*/}

استدعِ `preloadModule` أثناء تصيير مكوّن إن كنت تعلم أنه أو أبناؤه سيستخدمون وحدة محددة.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

إن أردت أن يبدأ المتصفّح تنفيذ الوحدة فورًا (وليس التنزيل فقط)، استخدم [`preinitModule`](/reference/react-dom/preinitModule) بدلًا من ذلك. إن أردت تحميل سكربت ليس وحدة ESM، استخدم [`preload`](/reference/react-dom/preload).

### التحميل المسبق في معالج حدث {/*preloading-in-an-event-handler*/}

استدعِ `preloadModule` في معالج حدث قبل الانتقال إلى صفحة أو حالة ستُحتاج فيها الوحدة. يبدأ ذلك مبكرًا أكثر من الاستدعاء أثناء تصيير الصفحة أو الحالة الجديدة.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>ابدأ المعالج</button>
  );
}
```
