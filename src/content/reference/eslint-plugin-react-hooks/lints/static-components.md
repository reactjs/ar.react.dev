---
title: static-components
---

<Intro>

يتحقق من أن المكوّنات ثابتة، لا تُعاد إنشاؤها كل تصيير. المكوّنات المُعاد إنشاؤها ديناميكياً قد تعيد ضبط الحالة وتطلق إعادة تصيير مفرطة.

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

المكوّنات المعرّفة داخل مكوّنات أخرى تُعاد إنشاؤها كل تصيير. يرى React كل واحد كنوع مكوّن جديد تماماً، فيزيل القديم ويثبّت الجديد، ما يدمّر كل الحالة وعقد DOM في العملية.

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ مكوّن معرّف داخل مكوّن
function Parent() {
  const ChildComponent = () => { // مكوّن جديد كل تصيير!
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  };

  return <ChildComponent />; // الحالة تُصفَّر كل تصيير
}

// ❌ إنشاء ديناميكي لمكوّن
function Parent({type}) {
  const Component = type === 'button'
    ? () => <button>Click</button>
    : () => <div>Text</div>;

  return <Component />;
}
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ مكوّنات على مستوى الوحدة
const ButtonComponent = () => <button>Click</button>;
const TextComponent = () => <div>Text</div>;

function Parent({type}) {
  const Component = type === 'button'
    ? ButtonComponent  // مرجع لمكوّن موجود
    : TextComponent;

  return <Component />;
}
```

## استكشاف الأعطال {/*troubleshooting*/}

### أحتاج تصيير مكوّنات مختلفة شرطياً {/*conditional-components*/}

قد تعرّف مكوّنات داخلياً للوصول لحالة محلية:

```js {expectedErrors: {'react-compiler': [13]}}
// ❌ خطأ: مكوّن داخلي للوصول لحالة الأب
function Parent() {
  const [theme, setTheme] = useState('light');

  function ThemedButton() { // يُعاد إنشاؤه كل تصيير!
    return (
      <button className={theme}>
        Click me
      </button>
    );
  }

  return <ThemedButton />;
}
```

مرّر البيانات كـ props بدلاً من ذلك:

```js
// ✅ أفضل: مرّر props لمكوّن ثابت
function ThemedButton({theme}) {
  return (
    <button className={theme}>
      Click me
    </button>
  );
}

function Parent() {
  const [theme, setTheme] = useState('light');
  return <ThemedButton theme={theme} />;
}
```

<Note>

إذا وجدت نفسك تريد تعريف مكوّنات داخل مكوّنات أخرى للوصول لمتغيّرات محلية، فهذه إشارة إلى أنك يجب أن تمرّر props بدلاً من ذلك. يجعل المكوّنات أكثر إعادة استخداماً وقابلية للاختبار.

</Note>
