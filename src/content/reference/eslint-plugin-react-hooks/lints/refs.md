---
title: refs
---

<Intro>

يتحقق من الاستخدام الصحيح للـ refs، دون قراءة/كتابة أثناء التصيير. راجع قسم «المخاطر» في [استخدام `useRef()`](/reference/react/useRef#usage).

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

الـ refs تحمل قيماً لا تُستخدم للتصيير. على عكس الحالة، تغيير ref لا يطلق إعادة تصيير. قراءة أو كتابة `ref.current` أثناء التصيير تُخالِف توقعات React. قد لا تُهيَّأ الـ refs عند محاولة قراءتها، وقد تكون قيمها قديمة أو غير متسقة.

## كيف يكتشف الـ lint الـ refs {/*how-it-detects-refs*/}

يطبّق الـ lint هذه القواعد فقط على قيم يعرف أنها refs. تُستنتَج القيمة كـ ref عندما يرى المُصرّف أياً من الأنماط التالية:

- مُرجَعة من `useRef()` أو `React.createRef()`.

  ```js
  const scrollRef = useRef(null);
  ```

- مُعرّف اسمه `ref` أو ينتهي بـ `Ref` ويقرأ أو يكتب `.current`.

  ```js
  buttonRef.current = node;
  ```

- مُمرَّرة عبر خاصّية JSX `ref` (مثلاً `<div ref={someRef} />`).

  ```jsx
  <input ref={inputRef} />
  ```

بعد تعليم شيء كـ ref، يتبع هذا الاستنتاج القيمة عبر الإسناد أو التفكيك أو استدعاءات مساعدة. يتيح للـ lint إظهار المخالفات حتى عند الوصول إلى `ref.current` داخل دالة أخرى استلمت الـ ref كوسيط.

## مخالفات شائعة {/*common-violations*/}

- قراءة `ref.current` أثناء التصيير
- تحديث الـ refs أثناء التصيير
- استخدام الـ refs لقيم يجب أن تكون state

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ قراءة ref أثناء التصيير
function Component() {
  const ref = useRef(0);
  const value = ref.current; // لا تقرأ أثناء التصيير
  return <div>{value}</div>;
}

// ❌ تعديل ref أثناء التصيير
function Component({value}) {
  const ref = useRef(null);
  ref.current = value; // لا تعدّل أثناء التصيير
  return <div />;
}
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ اقرأ ref في الـ effects أو المعالجات
function Component() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current.offsetWidth); // مسموح في effect
    }
  });

  return <div ref={ref} />;
}

// ✅ استخدم state لقيم الواجهة
function Component() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ تهيئة كسولة لقيمة ref
function Component() {
  const ref = useRef(null);

  // تهيئة مرة واحدة عند أول استخدام
  if (ref.current === null) {
    ref.current = expensiveComputation(); // مسموح — تهيئة كسولة
  }

  const handleClick = () => {
    console.log(ref.current); // استخدم القيمة المُهيَّأة
  };

  return <button onClick={handleClick}>Click</button>;
}
```

## استكشاف الأعطال {/*troubleshooting*/}

### الـ lint أشار لكائن عادي فيه `.current` {/*plain-object-current*/}

الاستدلال بالاسم يعامل `ref.current` و`fooRef.current` عمداً كـ refs حقيقية. إذا كنت تُمثّل حاوية مخصّصة، اختر اسماً مختلفاً (مثلاً `box`) أو انقل القيمة القابلة للتغيير إلى state. إعادة التسمية تتجنّب الـ lint لأن المُصرّف يتوقف عن استنتاجها كـ ref.
