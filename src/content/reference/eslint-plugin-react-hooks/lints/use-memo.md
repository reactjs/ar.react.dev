---
title: use-memo
---

<Intro>

يتحقق من أن hook `useMemo` يُستخدم مع قيمة مُرجَعة. راجع [توثيق `useMemo`](/reference/react/useMemo) لمزيد من التفاصيل.

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

`useMemo` لحساب وتخزين القيم المكلفة مؤقتاً، وليس لتأثيرات جانبية. بدون قيمة مُرجَعة يعيد `useMemo` القيمة `undefined`، ما يُبطِل الغرض وغالباً يدل على استخدام hook خاطئ.

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ لا قيمة مُرجَعة
function Component({ data }) {
  const processed = useMemo(() => {
    data.forEach(item => console.log(item));
    // return ناقص!
  }, [data]);

  return <div>{processed}</div>; // دائماً undefined
}
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ يعيد قيمة محسوبة
function Component({ data }) {
  const processed = useMemo(() => {
    return data.map(item => item * 2);
  }, [data]);

  return <div>{processed}</div>;
}
```

## استكشاف الأعطال {/*troubleshooting*/}

### أحتاج تشغيل تأثيرات جانبية عند تغيّر التبعيات {/*side-effects*/}

قد تحاول استخدام `useMemo` لتأثيرات جانبية:

{/* TODO(@poteto) fix compiler validation to check for unassigned useMemos */}
```js {expectedErrors: {'react-compiler': [4]}}
// ❌ خطأ: تأثيرات جانبية داخل useMemo
function Component({user}) {
  // لا قيمة مُرجَعة، تأثير جانبي فقط
  useMemo(() => {
    analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);

  // غير مُسنَد لمتغيّر
  useMemo(() => {
    return analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);
}
```

إذا كان يجب أن يحدث التأثير الجانبي استجابةً لتفاعل المستخدم، الأفضل تقارب التأثير مع الحدث:

```js
// ✅ جيد: تأثيرات جانبية في معالجات الأحداث
function Component({user}) {
  const handleClick = () => {
    analytics.track('ButtonClicked', {userId: user.id});
    // منطق النقرة...
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

إذا كان التأثير الجانبي يزامن حالة React مع حالة خارجية (أو العكس)، استخدم `useEffect`:

```js
// ✅ جيد: المزامنة في useEffect
function Component({theme}) {
  useEffect(() => {
    localStorage.setItem('preferredTheme', theme);
    document.body.className = theme;
  }, [theme]);

  return <div>Current theme: {theme}</div>;
}
```
