---
title: استخدام TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript طريقة شائعة لإضافة تعريفات الأنواع إلى قواعد شيفرة JavaScript. يدعم TypeScript [JSX](/learn/writing-markup-with-jsx) افتراضيًا، ويمكنك الحصول على دعم كامل لتطبيقات React على الويب بإضافة [`@types/react`](https://www.npmjs.com/package/@types/react) و[`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) إلى مشروعك.

</Intro>

<YouWillLearn>

* [TypeScript مع مكوّنات React](/learn/typescript#typescript-with-react-components)
* [أمثلة على الأنواع مع Hooks](/learn/typescript#example-hooks)
* [أنواع شائعة من `@types/react`](/learn/typescript#useful-types)
* [موارد للتعلم الإضافي](/learn/typescript#further-learning)

</YouWillLearn>

## التثبيت {/*installation*/}

كل [أطر React الجاهزة للإنتاج](/learn/creating-a-react-app#full-stack-frameworks) تدعم استخدام TypeScript. اتبع دليل الإطار الخاص بالتثبيت:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### إضافة TypeScript إلى مشروع React قائم {/*adding-typescript-to-an-existing-react-project*/}

لتثبيت أحدث إصدارات تعريفات أنواع React:

<TerminalBlock>
npm install --save-dev @types/react @types/react-dom
</TerminalBlock>

يجب ضبط خيارات المُجمّع التالية في `tsconfig.json`:

1. يجب تضمين `dom` في [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (ملاحظة: إذا لم تُحدَّد خيار `lib`، يُضمَّن `dom` افتراضيًا).
2. يجب ضبط [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) على أحد الخيارات الصالحة. `preserve` يكفي لمعظم التطبيقات.
  إن كنت تنشر مكتبة، راجع [توثيق `jsx`](https://www.typescriptlang.org/tsconfig/#jsx) لاختيار القيمة المناسبة.

## TypeScript مع مكوّنات React {/*typescript-with-react-components*/}

<Note>

كل ملف يحتوي JSX يجب أن يستخدم امتداد `.tsx`. هذا امتداد خاص بـ TypeScript يخبره أن الملف يحتوي JSX.

</Note>

كتابة TypeScript مع React تشبه كثيرًا كتابة JavaScript مع React. الفرق الأساسي عند العمل مع مكوّن أنه يمكنك توفير أنواع لخصائص المكوّن. تُستخدم هذه الأنواع للتحقق من الصحة وللتوثيق المضمّن في المحرر.

آخذين مكوّن [`MyButton`](/learn#components) من دليل [البداية السريعة](/learn)، يمكننا إضافة نوع يصف خاصية `title` للزر:

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>مرحبًا بك في تطبيقي</h1>
      <MyButton title="أنا زر" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

هذه الصناديق الرملية تتعامل مع شيفرة TypeScript، لكنها لا تشغّل فاحص الأنواع. يعني أنه يمكنك تعديل أمثلة TypeScript للتعلم، لكنك لن تحصل على أخطاء أو تحذيرات أنواع. للحصول على فحص الأنواع، يمكنك استخدام [TypeScript Playground](https://www.typescriptlang.org/play) أو صندوق رملي أونلاين بمزايا أوسع.

</Note>

هذا الصياغة المضمّنة أبسط طريقة لتوصيف أنواع المكوّن، لكن عندما يزداد عدد الحقول قد تصبح غير عملية. بدلًا من ذلك يمكنك استخدام `interface` أو `type` لوصف خصائص المكوّن:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** النص المعروض داخل الزر */
  title: string;
  /** هل يمكن التفاعل مع الزر */
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
      <h1>مرحبًا بك في تطبيقي</h1>
      <MyButton title="أنا زر معطّل" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

النوع الذي يصف خصائص مكوّنك يمكن أن يكون بسيطًا أو معقدًا كما تحتاج، لكنه يجب أن يكون نوع كائن موصوفًا بـ`type` أو `interface`. يمكنك التعرّف على كيفية وصف TypeScript للكائنات في [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)، وقد يهمك استخدام [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) لوصف خاصية يمكن أن تكون من بين أنواع قليلة، ودليل [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) لحالات أعمق.


## أمثلة Hooks {/*example-hooks*/}

تعريفات الأنواع من `@types/react` تتضمن أنواعًا للـ Hooks المدمجة، فتستخدمها في مكوّناتك دون إعداد إضافي. صُممت لتأخذ في الحسبان الشيفرة التي تكتبها في مكوّنك، فتحصل كثيرًا على [أنواع مستنتجة](https://www.typescriptlang.org/docs/handbook/type-inference.html) ويفضل ألا تحتاج لمعالجة تفاصيل توفير الأنواع.

مع ذلك يمكننا الاطلاع على أمثلة لكيفية توفير الأنواع للـ Hooks.

### `useState` {/*typing-usestate*/}

[Hook `useState`](/reference/react/useState) يعيد استخدام القيمة الممرَّرة كحالة ابتدائية لتحديد نوع القيمة. مثلاً:

```ts
// استنتاج النوع كـ "boolean"
const [enabled, setEnabled] = useState(false);
```

يُعيَّن النوع `boolean` لـ`enabled`، و`setEnabled` تكون دالة تقبل إما وسيطًا من نوع `boolean` أو دالة تُرجع `boolean`. إن أردت توفير النوع صراحةً، مرّر وسيط نوع إلى استدعاء `useState`:

```ts
// ضبط النوع صراحةً إلى "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

هذا ليس مفيدًا جدًا هنا، لكن حالة شائعة قد تحتاج فيها لتحديد النوع هي نوع الاتحاد (union). مثلاً، `status` هنا يمكن أن يكون أحد عدة سلاسل:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

أو، كما يُنصح في [مبادئ هيكلة الحالة](/learn/choosing-the-state-structure#principles-for-structuring-state)، يمكنك تجميع الحالة ذات الصلة في كائن ووصف الاحتمالات عبر أنواع كائنات:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

[Hook `useReducer`](/reference/react/useReducer) أكثر تعقيدًا: يأخذ دالة reducer وحالة ابتدائية. تُستنتَج أنواع دالة الـ reducer من الحالة الابتدائية. يمكنك اختياريًا تمرير وسيط نوع إلى `useReducer` لوصف نوع الحالة، لكن غالبًا الأفضل ضبط النوع على الحالة الابتدائية:

<Sandpack>

```tsx src/App.tsx active
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
      throw new Error("إجراء غير معروف");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>مرحبًا بك في عدّادي</h1>

      <p>العد: {state.count}</p>
      <button onClick={addFive}>أضف 5</button>
      <button onClick={reset}>إعادة تعيين</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


نستخدم TypeScript في أماكن رئيسية:

 - `interface State` يصف شكل حالة الـ reducer.
 - `type CounterAction` يصف الإجراءات المختلفة التي يمكن إرسالها إلى الـ reducer.
 - `const initialState: State` يوفر نوعًا للحالة الابتدائية، وهو النوع الذي يستخدمه `useReducer` افتراضيًا أيضًا.
 - `stateReducer(state: State, action: CounterAction): State` يضبط أنواع وسائط دالة الـ reducer وقيمتها المُرجعة.

بديل أوضح لضبط النوع على `initialState` هو تمرير وسيط نوع إلى `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

[Hook `useContext`](/reference/react/useContext) تقنية لتمرير البيانات لأسفل شجرة المكوّنات دون تمرير props عبر كل طبقة. يُستخدم بإنشاء مكوّن provider وغالبًا Hook لاستهلاك القيمة في مكوّن ابن.

يُستنتَج نوع القيمة التي يوفّرها السياق من القيمة الممرَّرة إلى `createContext`:

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext value={theme}>
      <MyComponent />
    </ThemeContext>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>السمة الحالية: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

تعمل هذه التقنية عندما يكون لديك قيمة افتراضية معقولة—لكن أحيانًا لا يكون الأمر كذلك، وقد يبدو `null` معقولًا كقيمة افتراضية. لكن ليتمكن نظام الأنواع من فهم شيفرتك، تحتاج لضبط `ContextShape | null` صراحةً على `createContext`.

ينتج عن ذلك أن مستهلكي السياق يجب أن يزيلوا `| null` من النوع. توصيتنا أن يقوم الـ Hook بفحص وقت التشغيل لوجود القيمة ويرمي خطأ عند غيابها:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// هذا مثال مبسّط، لكن يمكنك تخيّل كائن أعقد هنا
type ComplexObject = {
  kind: string
};

// يُنشأ السياق مع `| null` في النوع ليعكس القيمة الافتراضية بدقة.
const Context = createContext<ComplexObject | null>(null);

// يُزال `| null` عبر الفحص في الـ Hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("يجب استخدام useGetComplexObject داخل Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context value={object}>
      <MyComponent />
    </Context>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>الكائن الحالي: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

<Note>

[React Compiler](/learn/react-compiler) يحفظ القيم والدوال تلقائيًا، ما يقلّل الحاجة لاستدعاءات `useMemo` يدويًا. يمكنك استخدام المُجمّع لمعالجة الحفظ تلقائيًا.

</Note>

[`useMemo`](/reference/react/useMemo) ينشئ/يعيد الوصول لقيمة محفوظة من استدعاء دالة، ويعيد تشغيل الدالة فقط عند تغيير التبعيات الممرَّرة كالمعامل الثاني. يُستنتَج نتيجة الـ Hook من القيمة المُرجعة من الدالة في المعامل الأول. يمكنك التصريح صراحةً بتمرير وسيط نوع إلى الـ Hook.

```ts
// يُستنتَج نوع visibleTodos من القيمة المُرجعة من filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

<Note>

[React Compiler](/learn/react-compiler) يحفظ القيم والدوال تلقائيًا، ما يقلّل الحاجة لاستدعاءات `useCallback` يدويًا. يمكنك استخدام المُجمّع لمعالجة الحفظ تلقائيًا.

</Note>

[`useCallback`](/reference/react/useCallback) يوفّر مرجعًا ثابتًا لدالة ما دامت التبعيات في المعامل الثاني كما هي. مثل `useMemo`، يُستنتَج نوع الدالة من القيمة المُرجعة للدالة في المعامل الأول، ويمكنك التصريح بتمرير وسيط نوع.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

في وضع TypeScript الصارم، `useCallback` يتطلب إضافة أنواع للمعاملات في callback. لأن نوع الـ callback يُستنتَج من القيمة المُرجعة، وبدون معاملات لا يُفهم النوع بالكامل.

حسب أسلوبك في الكتابة، يمكنك استخدام دوال `*EventHandler` من أنواع React لتوفير نوع معالج الحدث مع تعريف الـ callback:

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
      <p>القيمة: {value}</p>
    </>
  );
}
```

## أنواع مفيدة {/*useful-types*/}

هناك مجموعة واسعة من الأنواع القادمة من حزمة `@types/react`، يستحق الأمر القراءة عندما تشعر بالراحة لتفاعل React مع TypeScript. تجدها [في مجلد React في DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). سنغطي هنا بعض الأنواع الأكثر شيوعًا.

### أحداث DOM {/*typing-dom-events*/}

عند العمل مع أحداث DOM في React، يُستنتَج نوع الحدث غالبًا من معالج الحدث. لكن عند استخراج دالة لتُمرَّر إلى معالج حدث، ستحتاج لضبط نوع الحدث صراحةً.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("غيّرني");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>القيمة: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

هناك أنواع كثيرة للأحداث في أنواع React—القائمة الكاملة [هنا](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) مبنية على [أشهر أحداث DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

عند تحديد النوع الذي تبحث عنه يمكنك أولًا النظر لمعلومات التمرير فوق معالج الحدث الذي تستخدمه، فتظهر لك نوع الحدث.

إن احتجت حدثًا غير مضمّن في هذه القائمة، يمكنك استخدام النوع `React.SyntheticEvent`، وهو النوع الأساس لكل الأحداث.

### Children {/*typing-children*/}

هناك مساران شائعان لوصف children لمكوّن. الأول استخدام النوع `React.ReactNode`، وهو اتحاد كل الأنواع التي يمكن تمريرها كـ children في JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

هذا تعريف واسع جدًا للـ children. الثاني استخدام `React.ReactElement`، وهو عناصر JSX فقط دون primitives مثل السلاسل أو الأرقام:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

لاحظ أنك لا تستطيع بـ TypeScript أن تصف أن الـ children من نوع معيّن من عناصر JSX، فلا يمكن لنظام الأنواع أن يصف مكوّنًا يقبل فقط أبناء `<li>`.

يمكنك رؤية مثال لكل من `React.ReactNode` و`React.ReactElement` مع فاحص الأنواع في [هذا TypeScript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### خصائص الأنماط {/*typing-style-props*/}

عند استخدام الأنماط المضمّنة في React، يمكنك استخدام `React.CSSProperties` لوصف الكائن الممرَّر إلى خاصية `style`. هذا النوع اتحاد لكل خصائص CSS الممكنة، وهو طريقة جيدة للتأكد أنك تمرّر خصائص CSS صالحة وللحصول على إكمال تلقائي في المحرر.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## تعلم إضافي {/*further-learning*/}

غطّى هذا الدليل أساسيات استخدام TypeScript مع React، لكن هناك الكثير غيره.
صفحات API الفردية في التوثيق قد تحتوي شرحًا أعمق لاستخدامها مع TypeScript.

نوصي بالموارد التالية:

 - [The TypeScript handbook](https://www.typescriptlang.org/docs/handbook/) هو التوثيق الرسمي لـ TypeScript ويغطي أغلب ميزات اللغة.

 - [The TypeScript release notes](https://devblogs.microsoft.com/typescript/) تغطي الميزات الجديدة بالتفصيل.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) غشاء مجتمعي لاستخدام TypeScript مع React، يغطي حالات حافة مفيدة ويعطي تغطية أوسع من هذا المستند.

 - [TypeScript Community Discord](https://discord.com/invite/typescript) مكان جيد لطرح الأسئلة والمساعدة في مسائل TypeScript وReact.
