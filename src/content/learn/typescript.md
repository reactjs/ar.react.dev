---
title: استخدام Typescript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

استخدام TypeScript هو طريقة شائعة لإضافة تعريفات النوع لأكواد JavaScript التقليدية. بطريقة مبتكرة، TypeScript [تدعم JSX](/learn/writing-markup-with-jsx) ويمكنك الحصول على الدعم Typescript لمكتبة React بشكل كامل عند إضافة [`@types/react`](https://www.npmjs.com/package/@types/react) و [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) لمشروعك.



</Intro>

<YouWillLearn>

* [TypeScript مع مكونات React](/learn/typescript#typescript-with-react-components)
* [أمثلة عن الكتابة مع الخطافات Hooks](/learn/typescript#example-hooks)
* [أنواع شائعة من `@types/react`](/learn/typescript/#useful-types)
* [أماكن للتعلم بشكل أبعد وأعمق](/learn/typescript/#further-learning)

</YouWillLearn>

## التحميل {/*installation*/}

جميع [أُطر عمل React الإنتاجية](https://react-dev-git-fork-orta-typescriptpage-fbopensource.vercel.app/learn/start-a-new-react-project#production-grade-react-frameworks) توفر دعماً لاستخدام TypeScript. اتبع إرشادات إطار العمل التي تبيّن طريقة التحميل:

- [Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### إضافة TypeScript لمشروع React موجود بالفعل {/*adding-typescript-to-an-existing-react-project*/}

لتحميل آخر نسخة من تعريفات الأنواع الخاصة بمكتبة React، استخدم الأمر:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

خيارات المترجم الآتية عليك إعدادها في ملف 'tsconfig.json' الخاص بك:

1. يجب أن تُضمّن `dom` في  [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (ملاحظة: إذا لم يكن خيار `lib` محدداً،`dom`  هو مضمّن بشكل افتراضي).
1. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) عليك إعدادها بواحد من الخيارات الصالحة.يجب أن تكون  `preserve` كافية لمعظم التطبيقات.
  إذا كنت تريد نشر مكتبة، اتبع إرشادات [توثيقات `jsx`](https://www.typescriptlang.org/tsconfig/#jsx) لتعرف ما القيمة التي يجب اختيارها.

## Typescript مع مكونات react {/*typescript-with-react-components*/}

<Note>

كل ملف يحتوي على JSX يجب أن يمتلك اسمه اللاحقة `.tsx` . هذه اللاحقة هي إضافة مخصصة ل TypeScript والتي تخبر TypeScript بأنّ هذا الملف يحتوي على JSX.

</Note>

كتابة TypeScript مع React هي مشابهة جداً لطريقة كتابة JavaScript مع React. الاختلاف الوحيد هو عند العمل مع مكون ما، حيث يمكنك أن توفر أنواعاً لخصائص مكونك (props). هذه الأنواع يمكن أن تستخدم للتحقق الصحيح وتوفير توثيقات خطية في المحرر.

لنأخذ [المكون `MyButton`](/learn#components) من  إرشادات [البداية السريعة](/learn), يمكننا إضافة وصف لنوع `title` الخاص بالزر:

<Sandpack>

```tsx App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>مرحباً بك في تطبيقي</h1>
      <MyButton title="أنا زر" />
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

هذه ال sandboxes تسطيع التعامل مع كود TypeScript, لكنها لا تقوم بتشغيل متحقق-للنوع. هذا يعني أنه يمكنك تعديل أكواد TypeScript في sandboxes للتعلم, لكن لن تسطيع الحصول على أي أخطاء أو تحذيرات بشأن النوع. لكي تحصل على التحقق من النوع type-checking, يمكنك استخدام [TypeScript Playground](https://www.typescriptlang.org/play) أو استخدم sandbox آخر مليئاً بالميزات متصلاً بالإنترنت.

</Note> 

هذه الصيغة الخطية هي أبسط طريقة لتأمين الأنواع لمكون، ولكن بمجرد امتلاكه عدة حقول وعليك وصفها تصبح تلك الطريقة غير عملية. لذلك يمكنك أن تستخدم الواجهات `interface` أو النوع `type` لتصف خصائص الكون:

<Sandpack>

```tsx App.tsx active
interface MyButtonProps {
  /** نص لإظهاره داخل الزر **/
  title: string;
  /** تحديد فيما إذا كان بالإمكان التفاعل مع الزر */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>مرحباً بك في تطبيقي</h1>
      <MyButton title="أنا زر معطل" disabled={true}/>
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

النوع الذي يصف خصائص مكونك يمكن أن يكون بسيطاً أو معقداً حسب حاجتك، على الرغم من ذلك يجب أن يكونوا من نوع كائن موصوف إما بنوع `type` أو واجهة `interface`.يمكنك أن تتعلم عن كيفية وصف TypeScript للمكونات في هذا الرابط
 [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) ولكن إذا كنت أيضاً مهتماً باستخدام  [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) لوصف خاصية يمكن أن يكون نوعها واحداً من عدة أنواع مختلفة قليلاً و إرشادات [إنشاء أنواع من أنواع أخرى](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) لحالات استخدام أكثر تقدّماً.

## أمثلة الخطافات  {/*example-hooks*/}

تعريفات النوع من `@types/react` تتضمن أنواعاً للخطافات المدمجة مع React، لذلك يمكنك استخدامهم في مكونك بدون أي إعداد إضافي. يتم بناؤها لتأخد الأكواد التي تكتبها في مكونك بعين الاعتبار، لذلك تسطيع الحصول على  [أنواع مستنتجة](https://www.typescriptlang.org/docs/handbook/type-inference.html) في معظم الأوقات وبشكل مثالي لا تحتاج للتعامل مع تفاصيل تأمين الأنواع. 

علي أي حال، يمكننا إلقاء نظرة على القليل من الأمثلة في كيفية تزويد الخطافات بالأنواع.

### `useState` {/*typing-usestate*/}

 [الخطاف `useState`](/reference/react/useState) سيعيد استخدام القيمة التي تم تمريرها إليه كقيمة ابتدائية ليحدد ما هو نوع القيمة.مثال:

```ts
// استنتاج النوع كنوع "boolean"
const [enabled, setEnabled] = useState(false);
```

سيقوم بإسناد النوع `boolean` للقيمة `enabled`، و  `setEnabled` ستكون دالة تقبل إما `boolean` كمعامل، أو دالة تقوم بإرجاع `boolean`. إذا كنت تريد تقدم نوعاً بشكل صريح للحالة، يمكنك فعل ذلك بتقديم نوع للمعامل  لكي تستدعي  `useState`:

```ts 
// استنتاج النوع كنوع "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

إنها ليست مفيدة جداً في هذه الحالة، لكن الحالة الأكثر شيوعاً حيث ربما تريد تقديم نوع يكون عندما تمتلك union type. مثال، `status` هنا يمكن أن تكون واحدة من نصوص مختلفة قليلاً:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

أو، كما أوصي في [الاسس لهيكلة الحالات](/learn/choosing-the-state-structure#principles-for-structuring-state), يمكنك تجميع الحالات المرتبطة ككائن وتقوم بوصف الاحتمالات الممكنة من خلال أنواع الكائن: 

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

 [الخطاف `useReducer`](/reference/react/useReducer) هو خطاف أكثر تعقيداً يأخذ دالة reducer و حالة ابتدائية. الأنواع لدالة reducer تستنتج من الحالة الإبتدائية. بشكل اختياري يمكنك تقديم  نوع argement لإستدعاء الخطاف `useReducer` لتؤمن نوعاً للحالة، لكن إنه من الأفضل غالباً أن تضبط نوعاً للحالة الإبتدائية بدلاً من ذلك:
 
 <Sandpack>

```tsx App.tsx active
import {useReducer} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("فعل غير معروف");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>مرحباً بكم في عدّادي</h1>

      <p>عد: {state.count}</p>
      <button onClick={addFive}>أضف 5</button>
      <button onClick={reset}>إعادة ضبط</button>
    </div>
  );
}

```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


نستخدم TypeScript في أماكن مفتاحية قليلة:

 - `interface State` تصف الشكل لحالة ال reducer.
 - `type CounterAction` تصف الأفعال المختلفة التي يمكن إرسالها لل reducer.
 - `const initialState: State` تقدم نوعاً للحالة الإبتدائية، وأيضاً النوع الذي يُستخدم من قبل الخطاف `useReducer` افتراضيأ.
 - `stateReducer(state: State, action: CounterAction): State` يضبط الأنواع للمعاملات دالة ال reducer ويقوم بإرجاع قيمة.

بديل أكثر صراحة لضبط النوع على `initialState` هو تقديم نوع المعامل للخطاف `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

 [الخطاف `useContext` ](/reference/react/useContext) هو تقنية لتمرير البيانات لشجرة المكونات بدون الحاجة لتمرير الخصائص عبر المكونات. إنها تستخدم عن طريق إنشاء مكون مزود وغالباً عن طريق إنشاء خطاف ليستخدم القيمة في مكون ابن.   

نوع القيمة المزودة من قبل context مستنتج من القيمة التي تم تمرير إلى استدعاء الخطاف `createContext`:

<Sandpack>

```tsx App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p> السمة الحالية: {theme} </p>
    </div>
  )
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

هذه التقنية تعمل عندما يكون لديك قيمة افتراضية منطقية لكن في بعض الأحيان يوجد حالات لا تكون كذلك، وفي تلك الحالات `null` معقولة كقيمة افتراضية. على أي حال، لتسمح لنظام النوع أن يفهم كودك، أن تحتاج أن تضبط بشكل صريح `ContextShape | null` على `createContext`:

هذا يسبب المشكلة التي تحتاج لإزلة `| null` في نوع مستهلك ال context. توصياتنا بأن تجعل الخطاف يقوم بفحص وقت التشغيل ليتحقق من وجودها ويرمي خطأً عندما تكون موجودة: 

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// هذا مثال أبسط، لكن يمكنك أن تتخيل كائناً معقداً أكثر هنا
type ComplexObject = {
  kind: string
};

// المحتوى منشأ مع `| null`  في النوع، لتعكس بشكل دقيق القيمة الافتراضية.

const Context = createContext<ComplexObject | null>(null);

// `null |` سوف يتم إزالتها من خلال التحقق داخل الخطاف.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>  الكائن الحالي:{object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

الخطافات [`useMemo`](/reference/react/useMemo) ستنشئ / تعيد الوصول إلى قيمة محفوظة من استدعاء دالة، إعادة تشغيل الدالة فقط عندما مررت الاعتمادات كلما تم تغير المعامل الثاني. النتيجة لاستدعاء الخطاف مستنتجة من القيمة الراجعة من الدالة في المعامل الاول. يمكنك أن تكون أكثر صراحة بتقديم نوع معامل للخطاف. 
  
  ```ts
// نوع المتغير visibleTodos مستنتج من القيمة الراجعة من الدالة filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

 [`useCallback`](/reference/react/useCallback) يؤمن مرجعاً مستقراً لدالة طالما بقيت الاعتمادات التي تم تمريرها للمعامل الثاني نفسها. تماماً مثل `، نوع الدالة مستنتج من القيمة الراجعة من الدالة في المعامل الأول، ويمكنك أن تكون أكثر صراحة بتقديم نوع المعامل للخطاف.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

عندما تعمل بالوضع الصارم ل TypeScript  `useCallbck` تحتاج لإضافة الأنواع للمعاملات في دالة ال callback الخاصة بك. هذا بسبب أن نوع ال callback مسنتنج من القيمة الراجعة من الدالة، وبدون المعاملات النوع لن يفهم بشكل كامل.

حسب تفضيلات أسلوب كودك، يمكنك استخدام `EventHandler*`، وهي دوال من أنواع React لتأمين النوع للدوال التي تتعامل مع الأحداث بنفس الوقت الذي يتم تعريف دالة ال callback:
Depending on your code-style 

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("غيّرني");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p> القيمة: {value} </p>
    </>
  );
}
```

## أنواع مفيدة {/*useful-types*/}

هنالك مجموعة واسعة جداً من الأنواع التي تأتي من الحزمة `types/react@`. إنه يستحق القراءة عندما تشعر بالارتياح مع كيفية تفاعل React مع TypeScript. يمكنك أن تجدهم 
[في مجلد React في  DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). هنا سوف نغطي القليل من أكثر الأنواع شيوعاً.

### أحداث DOM  {/*typing-dom-events*/} 

عند العمل مع أحداث DOM في React، نوع الحدث يمكن أحياناً استنتاجه من معالج الأحداث. على أي حال، عندما تريد استخراج دالة ليتم تمريرها لمعالج أحداث، تحتاج أن تضبط بصراحة نوع الحدث.

<Sandpack>

```tsx App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("غيّرني");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>القيمة: {value} </p>
    </>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

هنالك العديد من أنواع الأحداث في أنواع React - القائمة الكاملة يمكن إيجادها [هنا](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) والتي تعتمد على أشهر الأحداث من ال [DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

عند تحديد النوع الذي تبحث عنه يمكنك أولاً إلقاء نظرة على المعلومات التي تظهر عندما يحوم مؤشر الفأرة على معالج الأحداث الذي تستخدمه، والتي ستعرض لك نوع الحدث.

إذا كنت تريد استخدام حدث لم يتم تضمينه في هذه القائمة، تستطيع استخدام نوع `React.SyntheticEvent، التي هي النوع الاساسي لكل الأحداث.

### الأبناء {/*typing-children*/}

هناك طريقان مشتركان لوصف أبناء المكونات. الأول هو استخدام نوع React.reactnode، وهو اتحاد لجميع الأنواع الممكنة التي يمكن تمريرها كأبناء في JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```
هذا تعريف واسع للغاية للأبناء. الثاني هو استخدام نوع "React.reacteLement" ، وهو فقط عناصر JSX وليس أنواع JavaScript البدائية مثل السلاسل النصية أو الأرقام:


```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```
ملاحظة، لا يمكنك استخدام TypeScript لوصف أن الأبناء هي نوع معين من عناصر JSX، لذلك لا يمكنك استخدام نظام النوع لوصف مكون يقبل `<li>` فقط.

يمكنك رؤية جميع الأمثلة لكلا الأنواع `React.ReactNode`  و `React.ReactElement` مع المتحقق من النوع في  [TypeScript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### خاصيات Style  {/*typing-style-props*/}

عند استخدام الأنماط المضمنة في React، يمكنك استخدام "reud.cssproperties" لوصف الكائن الذي تم تمريره إلى خاصية `style`. هذا النوع هو اتحاد لجميع خصائص CSS الممكنة، وهي طريقة جيدة للتأكد من أنك تمر خصائص CSS صالحة إلى خاصية `style`، والحصول على أكمال تلقائي في المحرر الخاص بك. 

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## تعلم أبعد {/*further-learning*/}

قد غطى هذا الدليل أساسيات استخدام TypeScript مع React، ولكن هناك الكثير لكي تعلمه. قد تحتوي صفحات API الفردية في المستندات على وثائق أكثر متعمقة حول كيفية استخدامها مع TypeScript.

نوصي بالموارد التالية:

 - [The TypeScript handbook](https://www.typescriptlang.org/docs/handbook/) التوثيق الرسمي للغة TypeScript، يغطي معظم الميزات المفتاحية للغة.

 - [The TypeScript release notes](https://devblogs.microsoft.com/typescript/) يتضمن كل الميزات الجديدة بشكل متعمق.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) هو ورقة تحتوي رؤوس أقلام يتم صيانتها من قبل المجتمع لاستخدام TypeScript مع React، تغطي الكثير من حالات الحافة المفيدة وتوفير المزيد من التوسع أكثر من هذا المستند. 
