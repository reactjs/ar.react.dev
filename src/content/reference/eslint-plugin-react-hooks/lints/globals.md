---
title: globals
---

<Intro>

يتحقق من عدم الإسناد أو التعديل على عامات أثناء التصيير، ضمن ضمان أن [التأثيرات الجانبية تُنفَّذ خارج التصيير](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render).

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

المتغيّرات العامة خارج سيطرة React. عند تعديلها أثناء التصيير تُخالِف افتراض React أن التصيير نقي. قد يجعل ذلك المكوّنات تتصرف بشكل مختلف بين التطوير والإنتاج، ويكسر Fast Refresh، ويجعل التطبيق صعب التحسين بميزات مثل React Compiler.

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ عدّاد عام
let renderCount = 0;
function Component() {
  renderCount++; // تعديل عام
  return <div>Count: {renderCount}</div>;
}

// ❌ تعديل خصائص window
function Component({userId}) {
  window.currentUser = userId; // تعديل عام
  return <div>User: {userId}</div>;
}

// ❌ دفع إلى مصفوفة عامة
const events = [];
function Component({event}) {
  events.push(event); // تعديل مصفوفة عامة
  return <div>Events: {events.length}</div>;
}

// ❌ التلاعب بذاكرة تخزين مؤقت عامة
const cache = {};
function Component({id}) {
  if (!cache[id]) {
    cache[id] = fetchData(id); // تعديل الذاكرة أثناء التصيير
  }
  return <div>{cache[id]}</div>;
}
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ استخدم state للعدادات
function Component() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(c => c + 1);
  };

  return (
    <button onClick={handleClick}>
      Clicked: {clickCount} times
    </button>
  );
}

// ✅ استخدم context للقيم «العامة» داخل React
function Component() {
  const user = useContext(UserContext);
  return <div>User: {user.id}</div>;
}

// ✅ زامن الحالة الخارجية مع React
function Component({title}) {
  useEffect(() => {
    document.title = title; // مسموح في effect
  }, [title]);

  return <div>Page: {title}</div>;
}
```
