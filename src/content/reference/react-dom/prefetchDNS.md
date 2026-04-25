---
title: prefetchDNS
---

<Intro>

`prefetchDNS` يتيح لك البحث المسبق عن عنوان IP لخادم تتوقع تحميل موارد منه.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

للبحث عن مضيف، استدعِ الدالة `prefetchDNS` من `react-dom`.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[المزيد من الأمثلة أدناه.](#usage)

توفّر `prefetchDNS` للمتصفّح تلميحاً بأن يبحث عن عنوان IP لخادم معيّن. إن اختار المتصفّح ذلك، قد يسرّع تحميل الموارد من ذلك الخادم.

#### المعاملات {/*parameters*/}

* `href`: سلسلة نصية. عنوان URL للخادم.

#### القيمة المُرجَعة {/*returns*/}

لا تُرجِع `prefetchDNS` شيئاً.

#### ملاحظات {/*caveats*/}

* عدة استدعاءات لـ `prefetchDNS` لنفس الخادم لها نفس أثر استدعاء واحد.
* في المتصفّح يمكن استدعاء `prefetchDNS` في أي موضع: أثناء تصيير مكوّن، أو في Effect، أو في معالج حدث، إلخ.
* في التصيير على الخادم أو عند تصيير مكوّنات الخادم، لا يكون لـ `prefetchDNS` أثر إلا إذا استُدعي أثناء تصيير مكوّن أو في سياق async منبثق من تصيير مكوّن. تُتجاهل أي استدعاءات أخرى.
* إن كنت تعرف الموارد المحدّدة، يمكنك استدعاء [دوال أخرى](/reference/react-dom/#resource-preloading-apis) تبدأ التحميل فوراً.
* لا فائدة من prefetch لنفس خادم الصفحة لأن البحث قد تم بالفعل.
* مقارنةً بـ [`preconnect`](/reference/react-dom/preconnect)، قد يكون `prefetchDNS` أفضل إذا اتصلت تخمينياً بعدد كبير من النطاقات، حيث قد يفوق عبء الاتصالات المسبقة الفائدة.

---

## الاستخدام {/*usage*/}

### prefetch لـ DNS أثناء التصيير {/*prefetching-dns-when-rendering*/}

استدعِ `prefetchDNS` أثناء تصيير مكوّن إن كنت تعلم أن الأبناء سيحمّلون موارد من ذلك المضيف.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### prefetch لـ DNS في معالج حدث {/*prefetching-dns-in-an-event-handler*/}

استدعِ `prefetchDNS` في معالج حدث قبل الانتقال إلى صفحة أو حالة سيُحمّل فيها موارد خارجية.

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
