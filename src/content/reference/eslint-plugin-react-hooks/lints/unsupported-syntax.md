---
title: unsupported-syntax
---

<Intro>

يتحقق من صياغة لا يدعمها React Compiler. إن لزم، يمكنك ما زال استخدام هذه الصياغة خارج React، مثلاً في دالة مساعدة مستقلة.

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

يحتاج React Compiler إلى تحليل شيفرتك ساكنياً لتطبيق التحسينات. ميزات مثل `eval` و`with` تجعل فهم ما تفعله الشيفرة وقت التجميع مستحيلاً ساكنياً، لذا لا يستطيع المُصرّف تحسين مكوّنات تستخدمها.

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ استخدام eval في المكوّن
function Component({ code }) {
  const result = eval(code); // لا يُحلَّل
  return <div>{result}</div>;
}

// ❌ استخدام with
function Component() {
  with (Math) { // يغيّر النطاق ديناميكياً
    return <div>{sin(PI / 2)}</div>;
  }
}

// ❌ وصول ديناميكي لخاصّية مع eval
function Component({propName}) {
  const value = eval(`props.${propName}`);
  return <div>{value}</div>;
}
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ وصول عادي للخصائص
function Component({propName, props}) {
  const value = props[propName]; // قابل للتحليل
  return <div>{value}</div>;
}

// ✅ دوال Math القياسية
function Component() {
  return <div>{Math.sin(Math.PI / 2)}</div>;
}
```

## استكشاف الأعطال {/*troubleshooting*/}

### أحتاج تقييم شيفرة ديناميكية {/*evaluate-dynamic-code*/}

قد تحتاج لتقييم شيفرة يوفّرها المستخدم:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ خطأ: eval في المكوّن
function Calculator({expression}) {
  const result = eval(expression); // غير آمن وغير قابل للتحسين
  return <div>Result: {result}</div>;
}
```

استخدم محلّل تعبيرات آمناً بدلاً من ذلك:

```js
// ✅ أفضل: محلّل آمن
import {evaluate} from 'mathjs'; // أو مكتبة مشابهة

function Calculator({expression}) {
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      // تقييم آمن لتعبير رياضي
      setResult(evaluate(expression));
    } catch (error) {
      setResult('Invalid expression');
    }
  };

  return (
    <div>
      <button onClick={calculate}>Calculate</button>
      {result && <div>Result: {result}</div>}
    </div>
  );
}
```

<Note>

لا تستخدم `eval` مع مدخلات المستخدم — خطر أمني. استخدم مكتبات تحليل مخصّصة لحالات مثل التعبيرات الرياضية أو تحليل JSON أو تقييم القوالب.

</Note>
