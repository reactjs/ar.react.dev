---
title: useDebugValue
---

<Intro>

`useDebugValue` هو خطاف React يمكنك من إضافة تصنيف إلى خطاف مخصص في [أدوات مطور React.](/learn/react-developer-tools)

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

قم باستدعاء `useDebugValue` في المستوى الأعلي من [خطافك المخصص](/learn/reusing-logic-with-custom-hooks) لعرض قيمة تصحيح قابلة للقراءة:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[اطلع على المزيد من الأمثلة بالأسفل.](#usage)

#### المعاملات (parameters) {/*parameters*/}

* `value`: القيمة التي تريد عرضها في أدوات مطور React. يمكن أن تكون من أي نوع.
* **اختياري** `format`: دالة تنسيق. عند فحص المكون، ستقوم أدوات المطور باستدعاء دالة التنسيق مع `value` كمعامل، ثم يتم عرض القيمة التي تم إرجاعها (والتي قد تحتوي على أي نوع). إذا لم تحدد دالة التنسيق، سيتم عرض القيمة الأصلية من المعامل `value`.

#### العائدات {/*returns*/}

`useDebugValue` لا يعيد أي شيء.

## الاستخدام {/*usage*/}

### إضافة تصنيف إلي خطاف مخصص {/*adding-a-label-to-a-custom-hook*/}

قم باستدعاء `useDebugValue` في المستوى الأعلي من [خطافك المخصص](/learn/reusing-logic-with-custom-hooks) لعرض <CodeStep step={1}>قيمة تصحيح</CodeStep> قابلة للقرائة في [أدوات مطور React.](/learn/react-developer-tools)

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

هذا يتيح للمكونات التي تستدعى `useOnlineStatus` أن تحمل تصنيف مثل `OnlineStatus: "Online"` عندما تقوم بفحصها:

![لقطة شاشة لأدوات مطور React تعرض قيمة تصحيح](/images/docs/react-devtools-usedebugvalue.png)

بدون استدعاء `useDebugValue`، سيتم عرض البيانات الأساسية فقط دون أي تصنيف (في هذا المثال، `true`).

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

<Note>

لا تضف قيم تصحيح إلى كل خطاف مخصص. يعد مفيدًا أكثر للخطاطيف المخصصة التي تشكل جزءا من المكتبات المشتركة والتي تحتوي على هيكل بيانات داخلي معقد يصعب فحصه.

</Note>

---

### تأجيل التنسيق لقيمة التصحيح (debug value) {/*deferring-formatting-of-a-debug-value*/}

يمكنك أيضا تمرير دالة تنسيق كمعامل (parameter) ثاني إلي `useDebugValue`:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

ستتلقى دالة التنسيق الخاصة بك <CodeStep step={1}>قيمة التصحيح</CodeStep> كمعامل ويجب أن تعيد <CodeStep step={2}>قيمة عرض منسقة</CodeStep>. عندما يتم فحص مكونك، ستقوم أدوات مطور React باستدعاء هذه الدالة وتعرض القيمة المنسقة التي تم إرجاعها.

وهذا يتيح لك تجنب تنفيذ منطق التنسيق باهظ التكلفة ما لم يتم فحص المكون فعليا. على سبيل المثال, إذا كان المتغير `date` يحمل قيمة تاريخ, فإن استخدام قيمة التصحيح يساعد في تجنب استدعاء دالة `toDateString()` عليها في كل عملية عرض.
