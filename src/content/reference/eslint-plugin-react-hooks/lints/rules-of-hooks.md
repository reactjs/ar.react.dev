---
title: rules-of-hooks
---

<Intro>

يتحقق من أن المكوّنات والـ hooks تتبع [Rules of Hooks](/reference/rules/rules-of-hooks).

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

يعتمد React على ترتيب استدعاء الـ hooks ليحافظ بشكل صحيح على الحالة بين التصييرات. في كل مرة يُصيَّر فيها المكوّن، يتوقع React نفس الـ hooks بنفس الترتيب بالضبط. عند استدعاء الـ hooks شرطياً أو داخل حلقات، يفقد React تتبّع أي حالة تطابق أي استدعاء hook، ما يؤدي إلى أعطال مثل عدم تطابق الحالة وأخطاء «Rendered fewer/more hooks than expected».

## مخالفات شائعة {/*common-violations*/}

هذه الأنماط تخالف Rules of Hooks:

- **Hooks داخل شروط** (`if`/`else`، ثلاثي، `&&`/`||`)
- **Hooks داخل حلقات** (`for`، `while`، `do-while`)
- **Hooks بعد إرجاع مبكر**
- **Hooks داخل callbacks أو معالجات أحداث**
- **Hooks داخل دوال async**
- **Hooks في طرق صنف**
- **Hooks على مستوى الوحدة**

<Note>

### hook `use` {/*use-hook*/}

يختلف hook `use` عن بقية hooks في React. يمكن استدعاؤه شرطياً وداخل حلقات:

```js
// ✅ يمكن أن يكون `use` شرطياً
if (shouldFetch) {
  const data = use(fetchPromise);
}

// ✅ يمكن أن يكون `use` داخل حلقة
for (const promise of promises) {
  results.push(use(promise));
}
```

لكن `use` ما زال له قيود:
- لا يُلفّ في try/catch
- يجب استدعاؤه داخل مكوّن أو hook

تعلّم المزيد: [مرجع واجهة `use`](/reference/react/use)

</Note>

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ Hook داخل شرط
if (isLoggedIn) {
  const [user, setUser] = useState(null);
}

// ❌ Hook بعد إرجاع مبكر
if (!data) return <Loading />;
const [processed, setProcessed] = useState(data);

// ❌ Hook داخل callback
<button onClick={() => {
  const [clicked, setClicked] = useState(false);
}}/>

// ❌ `use` داخل try/catch
try {
  const data = use(promise);
} catch (e) {
  // error handling
}

// ❌ Hook على مستوى الوحدة
const globalState = useState(0); // خارج المكوّن
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
function Component({ isSpecial, shouldFetch, fetchPromise }) {
  // ✅ Hooks في أعلى المستوى
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  if (!isSpecial) {
    return null;
  }

  if (shouldFetch) {
    // ✅ يمكن أن يكون `use` شرطياً
    const data = use(fetchPromise);
    return <div>{data}</div>;
  }

  return <div>{name}: {count}</div>;
}
```

## استكشاف الأعطال {/*troubleshooting*/}

### أريد جلب بيانات بناءً على شرط {/*conditional-data-fetching*/}

تحاول استدعاء useEffect شرطياً:

```js
// ❌ Hook شرطي
if (isLoggedIn) {
  useEffect(() => {
    fetchUserData();
  }, []);
}
```

استدعِ الـ hook دون شرط، وتحقق من الشرط داخله:

```js
// ✅ الشرط داخل الـ hook
useEffect(() => {
  if (isLoggedIn) {
    fetchUserData();
  }
}, [isLoggedIn]);
```

<Note>

هناك طرق أفضل لجلب البيانات بدل useEffect. فكّر في TanStack Query أو useSWR أو React Router 6.4+ لجلب البيانات. تتولى هذه الحلول إزالة التكرار من الطلبات، وتخزين الاستجابات مؤقتاً، وتجنّب شلالات الشبكة.

تعلّم المزيد: [جلب البيانات](/learn/synchronizing-with-effects#fetching-data)

</Note>

### أحتاج حالة مختلفة لسيناريوهات مختلفة {/*conditional-state-initialization*/}

تحاول تهيئة الحالة شرطياً:

```js
// ❌ حالة شرطية
if (userType === 'admin') {
  const [permissions, setPermissions] = useState(adminPerms);
} else {
  const [permissions, setPermissions] = useState(userPerms);
}
```

استدعِ useState دائماً، واضبط القيمة الابتدائية شرطياً:

```js
// ✅ قيمة ابتدائية شرطية
const [permissions, setPermissions] = useState(
  userType === 'admin' ? adminPerms : userPerms
);
```

## الخيارات {/*options*/}

يمكنك تهيئة hooks تأثير مخصّصة عبر إعدادات ESLint المشتركة (متوفرة في `eslint-plugin-react-hooks` 6.1.1 وما بعد):

```js
{
  "settings": {
    "react-hooks": {
      "additionalEffectHooks": "(useMyEffect|useCustomEffect)"
    }
  }
}
```

- `additionalEffectHooks`: نمط regex يطابق الـ hooks المخصّصة التي تُعامل كتأثيرات. يتيح استدعاء `useEffectEvent` ودوال أحداث مشابهة من hooks التأثير المخصّصة.

يُستخدم هذا الإعداد المشترك من قواعد `rules-of-hooks` و`exhaustive-deps` معاً، لسلوك متسق عبر كل lint المتعلّق بالـ hooks.
