````markdown
---
title: prefetchDNS
canary: true
---

<Canary>

دالة `prefetchDNS` متاحة حاليًا فقط في قنوات Canary و experimental الخاصة بـ React. تعرف على المزيد حول [قنوات إصدار React هنا](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

تتيح لك `prefetchDNS` البحث بشكل استباقي عن عنوان IP لخادم تتوقع تحميل موارد منه.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

للبحث عن مضيف، استدعِ دالة `prefetchDNS` من `react-dom`.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

توفر دالة prefetchDNS للمتصفح تلميحًا بأنه يجب البحث عن عنوان IP للخادم المحدد. إذا اختار المتصفح القيام بذلك، فقد يؤدي ذلك إلى تسريع تحميل الموارد من ذلك الخادم.

#### المعاملات {/*parameters*/}

* `href`: سلسلة نصية. عنوان URL للخادم الذي تريد الاتصال به.

#### القيم المرجعة {/*returns*/}

لا تُرجع `prefetchDNS` أي شيء.

#### تنبيهات {/*caveats*/}

* عدة استدعاءات لـ `prefetchDNS` مع نفس الخادم لها نفس تأثير الاستدعاء الواحد.
* في المتصفح، يمكنك استدعاء `prefetchDNS` في أي موقف: أثناء تصيير مكون، في Effect، في معالج حدث، وما إلى ذلك.
* في التصيير من جانب الخادم أو عند تصيير Server Components، يكون لـ `prefetchDNS` تأثير فقط إذا استدعيته أثناء تصيير مكون أو في سياق async ينشأ من تصيير مكون. سيتم تجاهل أي استدعاءات أخرى.
* إذا كنت تعرف الموارد المحددة التي ستحتاجها، يمكنك استدعاء [دوال أخرى](/reference/react-dom/#resource-preloading-apis) بدلاً من ذلك والتي ستبدأ في تحميل الموارد على الفور.
* لا توجد فائدة من جلب DNS مسبقًا لنفس الخادم الذي تستضيف فيه صفحة الويب نفسها لأنه تم البحث عنه بالفعل بحلول الوقت الذي يُعطى فيه التلميح.
* بالمقارنة مع [`preconnect`](/reference/react-dom/preconnect)، قد تكون `prefetchDNS` أفضل إذا كنت تتصل بشكل تخميني بعدد كبير من النطاقات، حيث قد تفوق تكلفة الاتصالات المسبقة الفائدة.

---

## الاستخدام {/*usage*/}

### جلب DNS مسبقًا عند التصيير {/*prefetching-dns-when-rendering*/}

استدعِ `prefetchDNS` عند تصيير مكون إذا كنت تعلم أن أطفاله سيحملون موارد خارجية من ذلك المضيف.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### جلب DNS مسبقًا في معالج حدث {/*prefetching-dns-in-an-event-handler*/}

استدعِ `prefetchDNS` في معالج حدث قبل الانتقال إلى صفحة أو حالة حيث ستكون هناك حاجة إلى موارد خارجية. يبدأ هذا العملية في وقت أبكر من استدعائها أثناء تصيير الصفحة أو الحالة الجديدة.

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```

````