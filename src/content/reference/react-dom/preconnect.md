---
title: preconnect
---

<Intro>

`preconnect` يتيح لك الاتصال مسبقاً بخادم تتوقع تحميل موارد منه.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

للاتصال المسبق بمضيف، استدعِ الدالة `preconnect` من `react-dom`.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[المزيد من الأمثلة أدناه.](#usage)

توفّر `preconnect` للمتصفّح تلميحاً بأن يفتح اتصالاً بالخادم المحدّد. إن اختار المتصفّح ذلك، قد يسرّع تحميل الموارد من ذلك الخادم.

#### المعاملات {/*parameters*/}

* `href`: سلسلة نصية. عنوان URL للخادم الذي تريد الاتصال به.


#### القيمة المُرجَعة {/*returns*/}

لا تُرجِع `preconnect` شيئاً.

#### ملاحظات {/*caveats*/}

* عدة استدعاءات لـ `preconnect` لنفس الخادم لها نفس أثر استدعاء واحد.
* في المتصفّح يمكن استدعاء `preconnect` في أي موضع: أثناء تصيير مكوّن، أو في Effect، أو في معالج حدث، إلخ.
* في التصيير على الخادم أو عند تصيير مكوّنات الخادم، لا يكون لـ `preconnect` أثر إلا إذا استُدعي أثناء تصيير مكوّن أو في سياق async منبثق من تصيير مكوّن. تُتجاهل أي استدعاءات أخرى.
* إن كنت تعرف الموارد المحدّدة التي تحتاجها، يمكنك استدعاء [دوال أخرى](/reference/react-dom/#resource-preloading-apis) تبدأ تحميل الموارد فوراً.
* لا فائدة من الاتصال المسبق بنفس الخادم الذي يستضيف الصفحة لأن الاتصال قائم بالفعل قبل أن يُعطى التلميح.

---

## الاستخدام {/*usage*/}

### الاتصال المسبق أثناء التصيير {/*preconnecting-when-rendering*/}

استدعِ `preconnect` أثناء تصيير مكوّن إن كنت تعلم أن الأبناء سيحمّلون موارد خارجية من ذلك المضيف.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### الاتصال المسبق في معالج حدث {/*preconnecting-in-an-event-handler*/}

استدعِ `preconnect` في معالج حدث قبل الانتقال إلى صفحة أو حالة سيُحمّل فيها موارد خارجية. يبدأ ذلك مبكراً أكثر من الاستدعاء أثناء تصيير الصفحة أو الحالة الجديدة.

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
