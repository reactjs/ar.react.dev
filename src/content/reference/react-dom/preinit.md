---
title: "التهيئة المسبقة (preinit)"
---

<Note>

[أُطر React](/learn/creating-a-react-app) غالبًا تتولى تحميل الموارد نيابةً عنك، فقد لا تحتاج لاستدعاء هذه الواجهة بنفسك. راجع توثيق إطارك للتفاصيل.

</Note>

<Intro>

تمكنك `preinit` من جلب ورَدّ وتقييم ورقة أنماط أو سكربت خارجي بشكل استباقي.

```js
preinit("https://example.com/script.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

لتهيئة سكربت أو ورقة أنماط مسبقًا، استدعِ الدالة `preinit` من `react-dom`.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[المزيد من الأمثلة أدناه.](#usage)

توفّر `preinit` للمتصفّح تلميحًا بأن يبدأ تنزيل المورد وتنفيذه، ما قد يوفر وقتًا. السكربتات التي تستدعي لها `preinit` تُنفَّذ عند انتهاء تنزيلها. أوراق الأنماط التي تهيئها مسبقًا تُدرَج في المستند، فيصبح مفعولها فورًا.

#### المعاملات {/*parameters*/}

* `href`: سلسلة نصية. عنوان URL للمورد الذي تريد تنزيله وتنفيذه.
* `options`: كائن يحتوي الخصائص التالية:
  *  `as`: سلسلة مطلوبة. نوع المورد. قيمها الممكنة `script` و`style`.
  * `precedence`: سلسلة. مطلوبة مع أوراق الأنماط. تحدد مكان إدراج الورقة نسبةً لغيرها. أوراق بأولوية أعلى يمكنها تجاوز أولوية أدنى. القيم الممكنة `reset` و`low` و`medium` و`high`.
  * `crossOrigin`: سلسلة. [سياسة CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) المستخدمة. القيم الممكنة `anonymous` و`use-credentials`.
  * `integrity`: سلسلة نصية. تجزئة تشفيرية للمورد لـ [التحقق من سلامته](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  * `nonce`: سلسلة نصية. [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) تشفيري للسماح بالمورد مع سياسة أمان محتوى صارمة.
  * `fetchPriority`: سلسلة. تقترح أولوية نسبية لتنزيل المورد. القيم الممكنة `auto` (الافتراضي) و`high` و`low`.

#### القيمة المُرجَعة {/*returns*/}

لا تُرجِع `preinit` شيئًا.

#### ملاحظات {/*caveats*/}

* عدة استدعاءات لـ `preinit` بنفس `href` لها نفس أثر استدعاء واحد.
* في المتصفّح يمكن استدعاء `preinit` في أي موضع: أثناء تصيير مكوّن، أو في Effect، أو في معالج حدث، إلخ.
* في التصيير على الخادم أو عند تصيير مكوّنات الخادم، لا يكون لـ `preinit` أثر إلا إذا استُدعي أثناء تصيير مكوّن أو في سياق async منبثق من تصيير مكوّن. تُتجاهل أي استدعاءات أخرى.

---

## الاستخدام {/*usage*/}

### التهيئة المسبقة أثناء التصيير {/*preiniting-when-rendering*/}

استدعِ `preinit` أثناء تصيير مكوّن إن كنت تعلم أنه أو أبناؤه سيستخدمون موردًا محددًا، وأنت موافق على تقييم المورد فورًا بعد تنزيله.

<Recipes titleText="أمثلة على التهيئة المسبقة">

#### تهيئة سكربت خارجي مسبقًا {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

إن أردت أن يحمّل المتصفّح السكربت دون تنفيذه فورًا، استخدم [`preload`](/reference/react-dom/preload) بدلًا من ذلك. إن أردت تحميل وحدة ESM، استخدم [`preinitModule`](/reference/react-dom/preinitModule).

<Solution />

#### تهيئة ورقة أنماط مسبقًا {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

خيار `precedence` المطلوب يتيح التحكم بترتيب أوراق الأنماط في المستند. أوراق بأولوية أعلى يمكنها تجاوز أولوية أدنى.

إن أردت تنزيل الورقة دون إدراجها في المستند فورًا، استخدم [`preload`](/reference/react-dom/preload) بدلًا من ذلك.

<Solution />

</Recipes>

### التهيئة المسبقة في معالج حدث {/*preiniting-in-an-event-handler*/}

استدعِ `preinit` في معالج حدث قبل الانتقال إلى صفحة أو حالة سيُحمّل فيها موارد خارجية. يبدأ ذلك مبكرًا أكثر من الاستدعاء أثناء تصيير الصفحة أو الحالة الجديدة.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>ابدأ المعالج</button>
  );
}
```
