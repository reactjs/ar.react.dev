---
title: preserve-manual-memoization
---

<Intro>

يتحقق من أن المُصرّف يحافظ على التذكّر اليدوي الموجود. يجمّع React Compiler المكوّنات والـ hooks فقط إذا كان استنتاجه [يطابق أو يتجاوز التذكّر اليدوي الحالي](/learn/react-compiler/introduction#what-should-i-do-about-usememo-usecallback-and-reactmemo).

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

يحافظ React Compiler على استدعاءاتك الحالية لـ `useMemo` و`useCallback` و`React.memo`. إذا ذكّرت شيئاً يدوياً، يفترض المُصرّف أن لديك سبباً ولن يزيله. لكن التبعيات الناقصة تمنع المُصرّف من فهم تدفّق البيانات في شيفرتك وتطبيق تحسينات إضافية.

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ تبعيات ناقصة في useMemo
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data] // تبعية 'filter' ناقصة
  );

  return <List items={filtered} />;
}

// ❌ تبعيات ناقصة في useCallback
function Component({ onUpdate, value }) {
  const handleClick = useCallback(() => {
    onUpdate(value);
  }, [onUpdate]); // 'value' ناقص

  return <button onClick={handleClick}>Update</button>;
}
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ تبعيات كاملة
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data, filter] // كل التبعيات مضمّنة
  );

  return <List items={filtered} />;
}

// ✅ أو دع المُصرّف يتولى الأمر
function Component({ data, filter }) {
  // لا حاجة لتذكّر يدوي
  const filtered = data.filter(filter);
  return <List items={filtered} />;
}
```

## استكشاف الأعطال {/*troubleshooting*/}

### هل أزيل التذكّر اليدوي؟ {/*remove-manual-memoization*/}

قد تتساءل إن كان React Compiler يجعل التذكّر اليدوي غير لازم:

```js
// هل ما زلت أحتاج هذا؟
function Component({items, sortBy}) {
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      return a[sortBy] - b[sortBy];
    });
  }, [items, sortBy]);

  return <List items={sorted} />;
}
```

يمكنك إزالته بأمان عند استخدام React Compiler:

```js
// ✅ أفضل: دع المُصرّف يحسّن
function Component({items, sortBy}) {
  const sorted = [...items].sort((a, b) => {
    return a[sortBy] - b[sortBy];
  });

  return <List items={sorted} />;
}
```
