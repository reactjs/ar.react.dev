---
title: "تهيئة الوحدة مسبقًا (preinitModule)"
---

<Note>

[أُطر React](/learn/creating-a-react-app) غالبًا تتولى تحميل الموارد نيابةً عنك، فقد لا تحتاج لاستدعاء هذه الواجهة بنفسك. راجع توثيق إطارك للتفاصيل.

</Note>

<Intro>

تمكنك `preinitModule` من جلب ورَدّ وتقييم وحدة ESM بشكل استباقي.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

لتهيئة وحدة ESM مسبقًا، استدعِ الدالة `preinitModule` من `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[المزيد من الأمثلة أدناه.](#usage)

توفّر `preinitModule` للمتصفّح تلميحًا بأن يبدأ تنزيل الوحدة وتنفيذها، ما قد يوفر وقتًا. الوحدات التي تهيئها مسبقًا تُنفَّذ عند انتهاء تنزيلها.

#### المعاملات {/*parameters*/}

* `href`: سلسلة نصية. عنوان URL للوحدة التي تريد تنزيلها وتنفيذها.
* `options`: كائن يحتوي الخصائص التالية:
  *  `as`: سلسلة مطلوبة. يجب أن تكون `'script'`.
  * `crossOrigin`: سلسلة. [سياسة CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) المستخدمة. القيم الممكنة `anonymous` و`use-credentials`.
  * `integrity`: سلسلة نصية. تجزئة تشفيرية للوحدة لـ [التحقق من سلامتها](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  * `nonce`: سلسلة نصية. [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) تشفيري للسماح بالوحدة مع سياسة أمان محتوى صارمة.

#### القيمة المُرجَعة {/*returns*/}

لا تُرجِع `preinitModule` شيئًا.

#### ملاحظات {/*caveats*/}

* عدة استدعاءات لـ `preinitModule` بنفس `href` لها نفس أثر استدعاء واحد.
* في المتصفّح يمكن استدعاء `preinitModule` في أي موضع: أثناء تصيير مكوّن، أو في Effect، أو في معالج حدث، إلخ.
* في التصيير على الخادم أو عند تصيير مكوّنات الخادم، لا يكون لـ `preinitModule` أثر إلا إذا استُدعي أثناء تصيير مكوّن أو في سياق async منبثق من تصيير مكوّن. تُتجاهل أي استدعاءات أخرى.

---

## الاستخدام {/*usage*/}

### التحميل المسبق أثناء التصيير {/*preloading-when-rendering*/}

استدعِ `preinitModule` أثناء تصيير مكوّن إن كنت تعلم أنه أو أبناؤه سيستخدمون وحدة محددة، وأنت موافق على تقييم الوحدة فورًا بعد تنزيلها.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

إن أردت أن يحمّل المتصفّح الوحدة دون تنفيذها فورًا، استخدم [`preloadModule`](/reference/react-dom/preloadModule) بدلًا من ذلك. إن أردت تهيئة سكربت ليس وحدة ESM، استخدم [`preinit`](/reference/react-dom/preinit).

### التحميل المسبق في معالج حدث {/*preloading-in-an-event-handler*/}

استدعِ `preinitModule` في معالج حدث قبل الانتقال إلى صفحة أو حالة ستُحتاج فيها الوحدة. يبدأ ذلك مبكرًا أكثر من الاستدعاء أثناء تصيير الصفحة أو الحالة الجديدة.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>ابدأ المعالج</button>
  );
}
```
