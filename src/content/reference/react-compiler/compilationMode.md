---
title: compilationMode
---

<Intro>

يتحكم خيار `compilationMode` في كيفية اختيار React Compiler للدوال التي يُجمّعها.

</Intro>

```js
{
  compilationMode: 'infer' // أو 'annotation' أو 'syntax' أو 'all'
}
```

<InlineToc />

---

## المرجع {/*reference*/}

### `compilationMode` {/*compilationmode*/}

يحدد الاستراتيجية لمعرفة أي الدوال سيُحسِّنها React Compiler.

#### النوع {/*type*/}

```
'infer' | 'syntax' | 'annotation' | 'all'
```

#### القيمة الافتراضية {/*default-value*/}

`'infer'`

#### الخيارات {/*options*/}

- **`'infer'`** (الافتراضي): يستخدم المُصرّف استدلالاً لتحديد مكوّنات React وhooks:
  - دوال موسومة صراحة بتوجيه `"use memo"`
  - دوال تُسمّى كمكوّنات (PascalCase) أو hooks (بادئة `use`) **وتُنشئ JSX** و/أو **تستدعي hooks أخرى**

- **`'annotation'`**: يُجمّع فقط الدوال الموسومة بتوجيه `"use memo"`. مناسب للتبنّي التدريجي.

- **`'syntax'`**: يُجمّع فقط المكوّنات والـ hooks التي تستخدم صياغة Flow لـ [component](https://flow.org/en/docs/react/component-syntax/) و[hook](https://flow.org/en/docs/react/hook-syntax/).

- **`'all'`**: يُجمّع كل الدوال على المستوى الأعلى. غير موصى به لأنه قد يُجمّع دوالاً ليست من React.

#### ملاحظات {/*caveats*/}

- وضع `'infer'` يتطلّب تسمية تتبع اصطلاحات React ليُكتشف المكوّن
- وضع `'all'` قد يضرّ بالأداء بتجميع دوال مساعدة
- وضع `'syntax'` يتطلّب Flow ولا يعمل مع TypeScript
- بغض النظر عن الوضع، الدوال التي تحتوي `"use no memo"` تُستبعد دائماً

---

## الاستخدام {/*usage*/}

### وضع الاستنتاج الافتراضي {/*default-inference-mode*/}

وضع `'infer'` الافتراضي يناسب أغلب القواعد التي تتبع اصطلاحات React:

```js
{
  compilationMode: 'infer'
}
```

في هذا الوضع تُجمَّع أمثلة مثل:

```js
// ✅ يُجمَّع: اسم كمكوّن + يعيد JSX
function Button(props) {
  return <button>{props.label}</button>;
}

// ✅ يُجمَّع: اسم كـ hook + يستدعي hooks
function useCounter() {
  const [count, setCount] = useState(0);
  return [count, setCount];
}

// ✅ يُجمَّع: توجيه صريح
function expensiveCalculation(data) {
  "use memo";
  return data.reduce(/* ... */);
}

// ❌ لا يُجمَّع: ليس نمط مكوّن/hook
function calculateTotal(items) {
  return items.reduce((a, b) => a + b, 0);
}
```

### تبنّي تدريجي بوضع annotation {/*incremental-adoption*/}

للهجرة التدريجية استخدم `'annotation'` لتجميع الدوال الموسومة فقط:

```js
{
  compilationMode: 'annotation'
}
```

ثم علّم الدوال يدوياً:

```js
// هذه الدالة فقط تُجمَّع
function ExpensiveList(props) {
  "use memo";
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// بدون التوجيه لا تُجمَّع
function NormalComponent(props) {
  return <div>{props.content}</div>;
}
```

### وضع صياغة Flow {/*flow-syntax-mode*/}

إذا كانت قاعدتك تستخدم Flow بدل TypeScript:

```js
{
  compilationMode: 'syntax'
}
```

ثم استخدم صياغة مكوّنات Flow:

```js
// يُجمَّع: صياغة مكوّن Flow
component Button(label: string) {
  return <button>{label}</button>;
}

// يُجمَّع: صياغة hook في Flow
hook useCounter(initial: number) {
  const [count, setCount] = useState(initial);
  return [count, setCount];
}

// لا يُجمَّع: دالة عادية
function helper(data) {
  return process(data);
}
```

### استبعاد دوال محدّدة {/*opting-out*/}

بغض النظر عن وضع التجميع، استخدم `"use no memo"` لتخطّي التجميع:

```js
function ComponentWithSideEffects() {
  "use no memo"; // منع التجميع

  // هذا المكوّن له تأثيرات جانبية لا يجب تذكّرها
  logToAnalytics('component_rendered');

  return <div>Content</div>;
}
```

---

## استكشاف الأعطال {/*troubleshooting*/}

### المكوّن لا يُجمَّع في وضع infer {/*component-not-compiled-infer*/}

في `'infer'` تأكد من اصطلاحات React:

```js
// ❌ لن يُجمَّع: اسم بحروف صغيرة
function button(props) {
  return <button>{props.label}</button>;
}

// ✅ سيُجمَّع: PascalCase
function Button(props) {
  return <button>{props.label}</button>;
}

// ❌ لن يُجمَّع: لا ينشئ JSX ولا يستدعي hooks
function useData() {
  return window.localStorage.getItem('data');
}

// ✅ سيُجمَّع: يستدعي hook
function useData() {
  const [data] = useState(() => window.localStorage.getItem('data'));
  return data;
}
```
