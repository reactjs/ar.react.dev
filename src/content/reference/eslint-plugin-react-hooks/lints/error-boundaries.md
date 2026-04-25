---
title: error-boundaries
---

<Intro>

يتحقق من استخدام Error Boundaries بدلاً من try/catch لأخطاء المكوّنات الفرعية.

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

لا تستطيع كتل try/catch التقاط أخطاء تحدث أثناء عملية التصيير في React. الأخطاء المرمية في دوال التصيير أو الـ hooks تنتقل عبر شجرة المكوّنات. فقط [Error Boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) يمكنها التقاط هذه الأخطاء.

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ try/catch لن يلتقط أخطاء التصيير
function Parent() {
  try {
    return <ChildComponent />; // إذا رُمي خطأ هنا، catch لن يفيد
  } catch (error) {
    return <div>Error occurred</div>;
  }
}
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ استخدام Error Boundary
function Parent() {
  return (
    <ErrorBoundary>
      <ChildComponent />
    </ErrorBoundary>
  );
}
```

## استكشاف الأعطال {/*troubleshooting*/}

### لماذا يطلب مني الـ linter عدم لفّ `use` داخل `try`/`catch`؟ {/*why-is-the-linter-telling-me-not-to-wrap-use-in-trycatch*/}

لا يرمي الـ hook `use` أخطاء بالمعنى التقليدي؛ بل يعلّق تنفيذ المكوّن. عندما يصادف `use` وعداً معلّقاً، يعلّق المكوّن ويترك لـ React عرض حالة بديلة. فقط Suspense وError Boundaries يمكنها التعامل مع هذه الحالات. يحذّر الـ linter من `try`/`catch` حول `use` لتجنّب الالتباس لأن كتلة `catch` لن تعمل أبداً.

```js {expectedErrors: {'react-compiler': [5]}}
// ❌ try/catch حول hook `use`
function Component({promise}) {
  try {
    const data = use(promise); // لن يلتقط — `use` يعلّق لا يرمي
    return <div>{data}</div>;
  } catch (error) {
    return <div>Failed to load</div>; // لا يُنفَّذ
  }
}

// ✅ Error boundary تلتقط أخطاء `use`
function App() {
  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent promise={fetchData()} />
      </Suspense>
    </ErrorBoundary>
  );
}
```
