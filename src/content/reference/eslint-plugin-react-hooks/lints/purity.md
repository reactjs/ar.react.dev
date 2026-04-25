---
title: purity
---

<Intro>

يتحقق من أن [المكوّنات/الـ hooks نقية](/reference/rules/components-and-hooks-must-be-pure) بعدم استدعاء دوال معروفة بعدم النقاء.

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

يجب أن تكون مكوّنات React دوال نقية — لنفس الـ props يجب أن تعيد دائماً نفس JSX. عند استخدام دوال مثل `Math.random()` أو `Date.now()` أثناء التصيير تُنتج مخرجات مختلفة في كل مرة، ما يكسر افتراضات React ويسبب أعطالاً مثل عدم تطابق الترطيب، وتذكّراً خاطئاً، وسلوكاً غير متوقع.

## مخالفات شائعة {/*common-violations*/}

بشكل عام، أي واجهة تُرجِع قيمة مختلفة لنفس المدخلات تخالف القاعدة. أمثلة شائعة:

- `Math.random()`
- `Date.now()` / `new Date()`
- `crypto.randomUUID()`
- `performance.now()`

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ Math.random() في التصيير
function Component() {
  const id = Math.random(); // مختلف كل تصيير
  return <div key={id}>Content</div>;
}

// ❌ Date.now() للقيم
function Component() {
  const timestamp = Date.now(); // يتغيّر كل تصيير
  return <div>Created at: {timestamp}</div>;
}
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ معرّفات ثابتة من الحالة الابتدائية
function Component() {
  const [id] = useState(() => crypto.randomUUID());
  return <div key={id}>Content</div>;
}
```

## استكشاف الأعطال {/*troubleshooting*/}

### أحتاج عرض الوقت الحالي {/*current-time*/}

استدعاء `Date.now()` أثناء التصيير يجعل المكوّن غير نقي:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ خطأ: الوقت يتغيّر كل تصيير
function Clock() {
  return <div>Current time: {Date.now()}</div>;
}
```

بدلاً من ذلك، [انقل الدالة غير النقية خارج التصيير](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent):

```js
function Clock() {
  const [time, setTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Current time: {time}</div>;
}
```
