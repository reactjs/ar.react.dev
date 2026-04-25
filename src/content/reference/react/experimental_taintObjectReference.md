---
title: "experimental_taintObjectReference"
version: experimental
---

<Experimental>

**هذه الواجهة تجريبية وغير متاحة في إصدار React المستقر بعد.**

يمكنك تجربتها بترقية حزم React إلى أحدث إصدار تجريبي:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

قد تحتوي الإصدارات التجريبية على أخطاء. لا تستخدمها في الإنتاج.

هذه الواجهة متاحة فقط داخل مكوّنات خادم React.

</Experimental>


<Intro>

`taintObjectReference` تمنع تمرير نسخة كائن معيّنة إلى مكوّن عميل، مثل كائن `user`.

```js
experimental_taintObjectReference(message, object);
```

لمنع تمرير مفتاح أو تجزئة أو رمز، راجع [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue).

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

استدعِ `taintObjectReference` مع كائن لتسجيله لدى React كشيء لا يجوز تمريره إلى العميل كما هو:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Do not pass ALL environment variables to the client.',
  process.env
);
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `message`: الرسالة التي تريد عرضها إذا اُمرّر الكائن إلى مكوّن عميل. ستظهر كجزء من الخطأ الذي يُرمى عند محاولة تمرير الكائن.

* `object`: الكائن المراد «تلويثه». يمكن تمرير دوال ونسخ صنفية كـ `object`. الدوال والأصناف ممنوعة أصلًا من التمرير لمكوّنات العميل، لكن رسالة الخطأ الافتراضية لـ React تُستبدل بما عرّفته في `message`. عند تمرير نسخة معيّنة من Typed Array كـ `object`، لن تُلوَّث النسخ الأخرى من نفس Typed Array.

#### القيمة المُرجَعة {/*returns*/}

`experimental_taintObjectReference` تُرجع `undefined`.

#### ملاحظات {/*caveats*/}

- إعادة إنشاء الكائن أو استنساخه ينتج كائنًا جديدًا غير ملوّث وقد يحمل بيانات حساسة. مثلًا، إذا كان لديك كائن `user` ملوّث، `const userInfo = {name: user.name, ssn: user.ssn}` أو `{...user}` ينشئ كائنات جديدة غير ملوّثة. `taintObjectReference` تحمي فقط من أخطاء بسيطة عند تمرير الكائن كما هو إلى مكوّن عميل.

<Pitfall>

**لا تعتمد على التلويث وحده للأمان.** تلويث كائن لا يمنع تسرّب كل القيم المشتقة. مثلًا، استنساخ كائن ملوّث ينشئ كائنًا جديدًا غير ملوّث. استخدام بيانات من كائن ملوّث (مثل `{secret: taintedObj.secret}`) ينشئ قيمة أو كائنًا جديدًا غير ملوّث. التلويث طبقة حماية؛ التطبيق الآمن يتعدد الطبقات، وواجهات برمجية مصممة جيدًا، وأنماط عزل.

</Pitfall>

---

## الاستخدام {/*usage*/}

### منع وصول بيانات المستخدم للعميل عن طريق الخطأ {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

لا يجب أن يقبل مكوّن عميل كائنات تحمل بيانات حساسة. مثاليًا، دوال جلب البيانات لا تكشف بيانات لا يحق للمستخدم الحالي رؤيتها. أحيانًا تحدث أخطاء أثناء إعادة الهيكلة. للحماية من هذه الأخطاء لاحقًا يمكننا «تلويث» كائن المستخدم في واجهة بياناتنا.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

الآن عندما يحاول أي شخص تمرير هذا الكائن إلى مكوّن عميل، يُرمى خطأ بالرسالة التي مررتها.

<DeepDive>

#### الحماية من التسرّب في جلب البيانات {/*protecting-against-leaks-in-data-fetching*/}

إذا كنت تشغّل بيئة مكوّنات خادم لديها بيانات حساسة، يجب الحذر من عدم تمرير الكائنات مباشرة:

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // DO NOT DO THIS
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

مثاليًا، لا يجب أن تكشف `getUser` بيانات لا يحق للمستخدم الحالي رؤيتها. لمنع تمرير كائن `user` إلى مكوّن عميل لاحقًا يمكننا «تلويث» كائن المستخدم:


```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

الآن إذا حاول أي شخص تمرير كائن `user` إلى مكوّن عميل، يُرمى خطأ بالرسالة التي مررتها.

</DeepDive>
