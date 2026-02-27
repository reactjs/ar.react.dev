````markdown
---
title: preconnect
canary: true
---

<Canary>

دالة `preconnect` متاحة حاليًا فقط في قنوات Canary و experimental الخاصة بـ React. تعرف على المزيد حول [قنوات إصدار React هنا](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

تتيح لك `preconnect` الاتصال بشكل استباقي بخادم تتوقع تحميل موارد منه.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

للاتصال مسبقًا بمضيف، استدعِ دالة `preconnect` من `react-dom`.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

توفر دالة `preconnect` للمتصفح تلميحًا بأنه يجب فتح اتصال بالخادم المحدد. إذا اختار المتصفح القيام بذلك، فقد يؤدي ذلك إلى تسريع تحميل الموارد من ذلك الخادم.

#### المعاملات {/*parameters*/}

* `href`: سلسلة نصية. عنوان URL للخادم الذي تريد الاتصال به.


#### القيم المرجعة {/*returns*/}

لا تُرجع `preconnect` أي شيء.

#### تنبيهات {/*caveats*/}

* عدة استدعاءات لـ `preconnect` مع نفس الخادم لها نفس تأثير الاستدعاء الواحد.
* في المتصفح، يمكنك استدعاء `preconnect` في أي موقف: أثناء تصيير مكون، في Effect، في معالج حدث، وما إلى ذلك.
* في التصيير من جانب الخادم أو عند تصيير Server Components، يكون لـ `preconnect` تأثير فقط إذا استدعيته أثناء تصيير مكون أو في سياق async ينشأ من تصيير مكون. سيتم تجاهل أي استدعاءات أخرى.
* إذا كنت تعرف الموارد المحددة التي ستحتاجها، يمكنك استدعاء [دوال أخرى](/reference/react-dom/#resource-preloading-apis) بدلاً من ذلك والتي ستبدأ في تحميل الموارد على الفور.
* لا توجد فائدة من الاتصال المسبق بنفس الخادم الذي تستضيف فيه صفحة الويب نفسها لأنه تم الاتصال به بالفعل بحلول الوقت الذي يُعطى فيه التلميح.

---

## الاستخدام {/*usage*/}

### الاتصال المسبق عند التصيير {/*preconnecting-when-rendering*/}

استدعِ `preconnect` عند تصيير مكون إذا كنت تعلم أن أطفاله سيحملون موارد خارجية من ذلك المضيف.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### الاتصال المسبق في معالج حدث {/*preconnecting-in-an-event-handler*/}

استدعِ `preconnect` في معالج حدث قبل الانتقال إلى صفحة أو حالة حيث ستكون هناك حاجة إلى موارد خارجية. يبدأ هذا العملية في وقت أبكر من استدعائها أثناء تصيير الصفحة أو الحالة الجديدة.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```

````