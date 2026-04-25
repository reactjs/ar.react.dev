---
title: "experimental_taintUniqueValue"
version: experimental
---

<Experimental>

**هذه الواجهة تجريبية وغير متاحة في إصدار React المستقر بعد.**

يمكنك تجربتها بترقية حزم React إلى أحدث إصدار تجريبي:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

قد تحتوي الإصدارات التجريبية على أخطاء. لا تستخدمها في الإنتاج.

هذه الواجهة متاحة فقط داخل [مكوّنات خادم React](/reference/rsc/use-client).

</Experimental>


<Intro>

`taintUniqueValue` تمنع تمرير قيم فريدة إلى مكوّنات العميل مثل كلمات المرور أو المفاتيح أو الرموز.

```js
taintUniqueValue(errMessage, lifetime, value)
```

لمنع تمرير كائن يحتوي بيانات حساسة، راجع [`taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

استدعِ `taintUniqueValue` مع كلمة مرور أو رمز أو مفتاح أو تجزئة لتسجيلها لدى React كشيء لا يجوز تمريره إلى العميل كما هو:

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass secret keys to the client.',
  process,
  process.env.SECRET_KEY
);
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `message`: الرسالة التي تريد عرضها إذا اُمرّرت `value` إلى مكوّن عميل. ستظهر كجزء من الخطأ المُرمى.

* `lifetime`: أي كائن يحدد مدة بقاء `value` ملوّثًا. تُمنع `value` من الإرسال إلى أي مكوّن عميل ما دام هذا الكائن موجودًا. مثلًا، تمرير `globalThis` يمنع القيمة طوال عمر التطبيق. `lifetime` غالبًا كائن خصائصه تحتوي `value`.

* `value`: سلسلة أو bigint أو TypedArray. يجب أن تكون `value` تسلسلًا فريدًا من أحرف أو بايتات ذا انتروبيا عالية مثل رمز تشفيري أو مفتاح خاص أو تجزئة أو كلمة مرور طويلة. تُمنع من الإرسال إلى أي مكوّن عميل.

#### القيمة المُرجَعة {/*returns*/}

`experimental_taintUniqueValue` تُرجع `undefined`.

#### ملاحظات {/*caveats*/}

* اشتقاق قيم جديدة من قيم ملوّثة قد يضعف الحماية. القيم الجديدة بتحويل الحالة لأحرف كبيرة أو ربط سلاسل ملوّثة أو تحويلها إلى base64 أو أخذ جزء منها لا تُلوَّث ما لم تستدعِ `taintUniqueValue` صراحة على القيم الجديدة.
* لا تستخدم `taintUniqueValue` لحماية قيم منخفضة الانتروبيا مثل رموز PIN أو أرقام الهواتف. إذا كان مهاجم يتحكم بأي قيمة في الطلب، قد يستنتج أي قيمة ملوّثة بتعداد كل الاحتمالات.

---

## الاستخدام {/*usage*/}

### منع تمرير رمز إلى مكوّنات العميل {/*prevent-a-token-from-being-passed-to-client-components*/}

لضمان عدم تمرير معلومات حساسة مثل كلمات المرور أو رموز الجلسة أو قيم فريدة أخرى عن طريق الخطأ إلى مكوّنات العميل، توفر `taintUniqueValue` طبقة حماية. عند تلويث قيمة، أي محاولة لتمريرها إلى مكوّن عميل تُنتج خطأ.

معامل `lifetime` يحدد المدة التي تبقى فيها القيمة ملوّثة. للقيم التي يجب أن تبقى ملوّثة إلى أجل غير مسمى، يمكن استخدام كائنات مثل [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) أو `process` كـ `lifetime`. لهذه الكائنات عمر يمتد طوال تشغيل التطبيق.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass a user password to the client.',
  globalThis,
  process.env.SECRET_KEY
);
```

إذا كان عمر القيمة الملوّثة مرتبطًا بكائن، يجب أن يكون `lifetime` هو الكائن الذي يغلف القيمة. يضمن بقاء الحماية طوال عمر الكائن المغلف.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Do not pass a user session token to the client.',
    user,
    user.session.token
  );
  return user;
}
```

في هذا المثال، كائن `user` هو معامل `lifetime`. إذا خُزّن في ذاكرة تخزين عامة أو أصبح متاحًا لطلب آخر، يبقى رمز الجلسة ملوّثًا.

<Pitfall>

**لا تعتمد على التلويث وحده للأمان.** تلويث قيمة لا يمنع كل القيم المشتقة. مثلًا، إنشاء قيمة جديدة بتحويل سلسلة ملوّثة لأحرف كبيرة لا يلوّث القيمة الجديدة.


```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Do not pass the password to the client.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` is not tainted
```

في هذا المثال، الثابت `password` ملوّث. ثم يُستخدم `password` لإنشاء `uppercasePassword` باستدعاء `toUpperCase`. القيمة الجديدة `uppercasePassword` غير ملوّثة.

طرق مشابهة لاشتقاق قيم من قيم ملوّثة مثل ربطها في سلسلة أكبر أو تحويلها إلى base64 أو إرجاع جزء منها تنشئ قيمًا غير ملوّثة.

التلويث يحمي من أخطاء بسيطة مثل تمرير أسرار صراحة للعميل. أخطاء في استدعاء `taintUniqueValue` مثل استخدام مخزن عام خارج React بلا كائن lifetime مطابق قد يجعل القيمة غير ملوّثة. التلويث طبقة حماية؛ التطبيق الآمن يتعدد الطبقات، وواجهات برمجية مصممة جيدًا، وأنماط عزل.

</Pitfall>

<DeepDive>

#### استخدام `server-only` و`taintUniqueValue` لمنع تسرّب الأسرار {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

إذا كنت تشغّل بيئة مكوّنات خادم لديها مفاتيح خاصة أو كلمات مرور مثل كلمات مرور قواعد البيانات، يجب الحذر من عدم تمريرها إلى مكوّن عميل.

```js
export async function Dashboard(props) {
  // DO NOT DO THIS
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

هذا المثال يسرّب رمز API السري للعميل. إذا كان الرمز يمنح وصولًا لبيانات لا يحق لهذا المستخدم رؤيتها، قد يؤدي إلى خرق بيانات.

[comment]: <> (TODO: Link to `server-only` docs once they are written)

مثاليًا، تُجمل الأسرار في ملف مساعد واحد يُستورد فقط من أدوات بيانات موثوقة على الخادم. يمكن حتى وسم الملف بـ [`server-only`](https://www.npmjs.com/package/server-only) لضمان عدم استيراده على العميل.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

أحيانًا تحدث أخطاء أثناء إعادة الهيكلة ولا يعرف الجميع ذلك.
للحماية من هذه الأخطاء لاحقًا يمكننا «تلويث» كلمة المرور الفعلية:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass the API token password to the client. ' +
    'Instead do all fetches on the server.'
  process,
  process.env.API_PASSWORD
);
```

الآن عندما يحاول أي شخص تمرير كلمة المرور هذه إلى مكوّن عميل، أو إرسالها بدالة خادم إلى عميل، يُرمى خطأ بالرسالة التي عرّفتها عند استدعاء `taintUniqueValue`.

</DeepDive>

---
