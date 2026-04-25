---
title: "دالة cacheSignal"
---

<RSC>

`cacheSignal` تُستخدم حاليًا مع [مكوّنات خادم React](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

</RSC>

<Intro>

`cacheSignal` تسمح لك بمعرفة متى ينتهي عمر `cache()`.

```js
const signal = cacheSignal();
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `cacheSignal` {/*cachesignal*/}

استدعِ `cacheSignal` للحصول على `AbortSignal`.

```js {3,7}
import {cacheSignal} from 'react';
async function Component() {
  await fetch(url, { signal: cacheSignal() });
}
```

عندما ينتهي React من العرض، سيُلغى `AbortSignal`. يتيح ذلك إلغاء أي عمل قيد التنفيذ لم يعد مطلوبًا.
يُعتبر العرض منتهيًا عندما:
- يكمل React العرض بنجاح
- يُلغى العرض
- يفشل العرض

#### المعاملات {/*parameters*/}

هذه الدالة لا تقبل معاملات.

#### القيمة المُرجَعة {/*returns*/}

`cacheSignal` تُرجع `AbortSignal` إذا اُستدعيت أثناء العرض. وإلا `cacheSignal()` تُرجع `null`.

#### ملاحظات {/*caveats*/}

- `cacheSignal` مخصّصة حاليًا لـ [مكوّنات خادم React](/reference/rsc/server-components) فقط. في مكوّنات العميل ستُرجع دائمًا `null`. لاحقًا ستُستخدم أيضًا لمكوّن العميل عند تحديث ذاكرة التخزين المؤقت أو إبطالها. لا تفترض أنها ستبقى `null` دائمًا على العميل.
- إذا اُستدعيت خارج العرض، تُرجع `cacheSignal` قيمة `null` ليوضح أن النطاق الحالي ليس مخزّنًا إلى الأبد.

---

## الاستخدام {/*usage*/}

### إلغاء الطلبات الجارية {/*cancel-in-flight-requests*/}

استدعِ <CodeStep step={1}>`cacheSignal`</CodeStep> لإلغاء الطلبات الجارية.

```js [[1, 4, "cacheSignal()"]]
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);
async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

<Pitfall>
لا يمكنك استخدام `cacheSignal` لإلغاء عمل async بدأ خارج العرض، مثلًا:

```js
import {cacheSignal} from 'react';
// 🚩 Pitfall: The request will not actually be aborted if the rendering of `Component` is finished.
const response = fetch(url, { signal: cacheSignal() });
async function Component() {
  await response;
}
```
</Pitfall>

### تجاهل الأخطاء بعد انتهاء عرض React {/*ignore-errors-after-react-has-finished-rendering*/}

إذا رمت دالة خطأ، قد يكون بسبب الإلغاء (مثلًا إغلاق <CodeStep step={1}>اتصال قاعدة البيانات</CodeStep>). يمكنك استخدام <CodeStep step={2}>خاصية `aborted`</CodeStep> للتحقق مما إذا كان الخطأ بسبب الإلغاء أم خطأ حقيقي. قد ترغب في <CodeStep step={3}>تجاهل الأخطاء</CodeStep> الناتجة عن الإلغاء فقط.

```js [[1, 2, "./database"], [2, 8, "cacheSignal()?.aborted"], [3, 12, "return null"]]
import {cacheSignal} from "react";
import {queryDatabase, logError} from "./database";

async function getData(id) {
  try {
     return await queryDatabase(id);
  } catch (x) {
     if (!cacheSignal()?.aborted) {
        // only log if it's a real error and not due to cancellation
       logError(x);
     }
     return null;
  }
}

async function Component({id}) {
  const data = await getData(id);
  if (data === null) {
    return <div>No data available</div>;
  }
  return <div>{data.name}</div>;
}
```
