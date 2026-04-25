---
title: set-state-in-render
---

<Intro>

يتحقق من عدم ضبط الحالة دون شرط أثناء التصيير، ما قد يطلق تصييرات إضافية وحلقات تصيير لانهائية.

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

استدعاء `setState` أثناء التصيير دون شرط يطلق تصييراً آخراً قبل انتهاء الحالي. ينتج عن ذلك حلقة لانهائية تُسقِط التطبيق.

## مخالفات شائعة {/*common-violations*/}

### غير صالح {/*invalid*/}

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ setState غير مشروط مباشرة في التصيير
function Component({value}) {
  const [count, setCount] = useState(0);
  setCount(value); // حلقة لانهائية!
  return <div>{count}</div>;
}
```

### صالح {/*valid*/}

```js
// ✅ اشتق أثناء التصيير
function Component({items}) {
  const sorted = [...items].sort(); // احسبه في التصيير
  return <ul>{sorted.map(/*...*/)}</ul>;
}

// ✅ عيّن الحالة في معالج حدث
function Component() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ اشتق من props بدل ضبط state
function Component({user}) {
  const name = user?.name || '';
  const email = user?.email || '';
  return <div>{name}</div>;
}

// ✅ اشتق شرطياً من props وحالة من تصييرات سابقة
function Component({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) { // هذا الشرط يجعله صالحاً
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

## استكشاف الأعطال {/*troubleshooting*/}

### أريد مزامنة الحالة مع prop {/*clamp-state-to-prop*/}

مشكلة شائعة هي محاولة «إصلاح» الحالة بعد التصيير. لنفترض أنك تريد منع عدّاد من تجاوز prop اسمه `max`:

```js
// ❌ خطأ: تقييد أثناء التصيير
function Counter({max}) {
  const [count, setCount] = useState(0);

  if (count > max) {
    setCount(max);
  }

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

ما إن يتجاوز `count` قيمة `max` حتى تُطلَق حلقة لانهائية.

غالباً الأفضل نقل هذا المنطق إلى الحدث (المكان الذي تُضبَط فيه الحالة أولاً). مثلاً يمكنك فرض الحد الأقصى لحظة تحديث الحالة:

```js
// ✅ قيّد عند التحديث
function Counter({max}) {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(current => Math.min(current + 1, max));
  };

  return <button onClick={increment}>{count}</button>;
}
```

الآن يُستدعى setter فقط استجابة للنقرة، ينهي React التصيير طبيعياً، ولا يتجاوز `count` قيمة `max`.

في حالات نادرة قد تحتاج لتعديل الحالة بناءً على معلومات من تصييرات سابقة. اتبع [هذا النمط](https://react.dev/reference/react/useState#storing-information-from-previous-renders) لضبط الحالة شرطياً.
