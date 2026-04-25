---
title: exhaustive-deps
---

<Intro>

يتحقق من أن مصفوفات تبعيات hooks في React تتضمّن كل التبعيات اللازمة.

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

تقبل hooks في React مثل `useEffect` و`useMemo` و`useCallback` مصفوفات تبعيات. عندما لا تُدرَج قيمة يُشار إليها داخل هذه الـ hooks في مصفوفة التبعيات، لن يُعاد تشغيل التأثير أو إعادة حساب القيمة عند تغيّر تلك التبعية. ينتج عن ذلك إغلاقات قديمة حيث يستخدم الـ hook قيماً عفا عليها الزمن.

## مخالفات شائعة {/*common-violations*/}

يحدث هذا الخطأ غالباً عند محاولة «خداع» React بشأن التبعيات للتحكّم في وقت تشغيل تأثير. يجب أن تزامن التأثيرات مكوّنك مع أنظمة خارجية. تخبر مصفوفة التبعيات React أي القيم يستخدمها التأثير، فيعرف React متى يُعاد المزامنة.

إذا وجدت نفسك تتصارع مع الـ linter، غالباً تحتاج إعادة هيكلة الشيفرة. راجع [إزالة تبعيات التأثير](/learn/removing-effect-dependencies) لتعلّم الطريقة.

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ تبعية ناقصة
useEffect(() => {
  console.log(count);
}, []); // 'count' ناقص

// ❌ prop ناقص
useEffect(() => {
  fetchUser(userId);
}, []); // 'userId' ناقص

// ❌ تبعيات غير كاملة
useMemo(() => {
  return items.sort(sortOrder);
}, [items]); // 'sortOrder' ناقص
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ كل التبعيات مضمّنة
useEffect(() => {
  console.log(count);
}, [count]);

// ✅ كل التبعيات مضمّنة
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

## استكشاف الأعطال {/*troubleshooting*/}

### إضافة تبعية دالة تسبب حلقات لانهائية {/*function-dependency-loops*/}

لديك تأثير لكنك تنشئ دالة جديدة كل تصيير:

```js
// ❌ يسبب حلقة لانهائية
const logItems = () => {
  console.log(items);
};

useEffect(() => {
  logItems();
}, [logItems]); // حلقة لانهائية!
```

في أغلب الحالات لا تحتاج التأثير. استدعِ الدالة حيث يحدث الإجراء:

```js
// ✅ استدعِها من معالج الحدث
const logItems = () => {
  console.log(items);
};

return <button onClick={logItems}>Log</button>;

// ✅ أو اشتق أثناء التصيير إن لم يكن هناك تأثير جانبي
items.forEach(item => {
  console.log(item);
});
```

إذا احتجت فعلاً للتأثير (مثلاً للاشتراك في شيء خارجي)، ثبّت التبعية:

```js
// ✅ useCallback يحافظ على مرجع الدالة
const logItems = useCallback(() => {
  console.log(items);
}, [items]);

useEffect(() => {
  logItems();
}, [logItems]);

// ✅ أو انقل المنطق مباشرة داخل التأثير
useEffect(() => {
  console.log(items);
}, [items]);
```

### تشغيل تأثير مرة واحدة فقط {/*effect-on-mount*/}

تريد تشغيل تأثير مرة عند التركيب، لكن الـ linter يشتكي من تبعيات ناقصة:

```js
// ❌ تبعية ناقصة
useEffect(() => {
  sendAnalytics(userId);
}, []); // 'userId' ناقص
```

إمّا تضمّن التبعية (موصى به) أو تستخدم ref إن احتجت حقاً التشغيل مرة واحدة:

```js
// ✅ تضمين التبعية
useEffect(() => {
  sendAnalytics(userId);
}, [userId]);

// ✅ أو حارس ref داخل تأثير
const sent = useRef(false);

useEffect(() => {
  if (sent.current) {
    return;
  }

  sent.current = true;
  sendAnalytics(userId);
}, [userId]);
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

- `additionalEffectHooks`: نمط regex يطابق الـ hooks المخصّصة التي يجب فحص تبعياتها بشكل شامل. هذا الإعداد مشترك عبر كل قواعد `react-hooks`.

للتوافق مع الإصدارات السابقة، تقبل هذه القاعدة أيضاً خياراً على مستوى القاعدة:

```js
{
  "rules": {
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useMyCustomHook|useAnotherHook)"
    }]
  }
}
```

- `additionalHooks`: regex للـ hooks التي يجب فحص تبعياتها بشكل شامل. **ملاحظة:** إذا حُدّد خيار القاعدة هذا، له الأسبقية على إعدادات `settings` المشتركة.
