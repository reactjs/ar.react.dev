---
title: استخدام TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript طريقة شائعة لإضافة تعريفات الأنواع إلى قواعد شيفرة JavaScript. يوفّر TypeScript دعمًا افتراضيًا للـ [JSX](/learn/writing-markup-with-jsx)، ويمكنك الحصول على دعم كامل لـ React Web بإضافة حزمتي [`@types/react`](https://www.npmjs.com/package/@types/react) و[`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) إلى مشروعك.

</Intro>

<YouWillLearn>

* [TypeScript مع مكونات React](/learn/typescript#typescript-with-react-components)
* [أمثلة على كتابة الأنواع مع Hooks](/learn/typescript#example-hooks)
* [أنواع شائعة من حزمة `@types/react`](/learn/typescript#useful-types)
* [مصادر للمزيد من التعلم](/learn/typescript#further-learning)

</YouWillLearn>

## التثبيت {/*installation*/}

جميع [أُطر React الجاهزة للإنتاج](/learn/creating-a-react-app#full-stack-frameworks) تدعم استخدام TypeScript. اتبع دليل التثبيت الخاص بإطار العمل الذي تختاره:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### إضافة TypeScript إلى مشروع React موجود {/*adding-typescript-to-an-existing-react-project*/}

لتثبيت أحدث إصدار لتعريفات TypeScript الخاصة بـ React:

<TerminalBlock>
npm install --save-dev @types/react @types/react-dom
</TerminalBlock>

يجب ضبط خيارات المجمّع التالية في ملف `tsconfig.json`:

1. يجب أن يتضمن `lib` قيمة `dom` (ملاحظة: إذا لم تُحدَّد خاصية `lib`، فستُدرَج `dom` افتراضيًا).
2. يجب ضبط [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) على إحدى القيم الصالحة. عادةً ما تكفي قيمة `preserve` لمعظم التطبيقات.
  إذا كنت تنشر مكتبة، ارجع إلى [توثيق `jsx`](https://www.typescriptlang.org/tsconfig/#jsx) لاختيار القيمة المناسبة.

## TypeScript مع مكونات React {/*typescript-with-react-components*/}

<Note>

كل ملف يحتوي على JSX يجب أن يستخدم الامتداد `.tsx`. هذا امتداد خاص بـ TypeScript ويُعلِم TypeScript أن الملف يحتوي على JSX.

</Note>

العمل باستخدام TypeScript مع React مشابه جدًا للعمل باستخدام JavaScript مع React. الفارق الرئيسي عند العمل مع مكوّن هو أنه يمكنك تعريف أنواع لخصائص (props) المكوّن. تُستخدم هذه الأنواع للتحقق من صحة الاستخدام وتوفير توثيق داخلي في المحررات.

باستخدام مكوّن [`MyButton` ](/learn#components) من دليل [البدء السريع](/learn)، يمكننا إضافة نوع يصف الخاصية `title` للزر:

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
      <h1>مرحبًا بكم في تطبيقي</h1>
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

هذه الحاويات التوضيحية (sandboxes) يمكنها التعامل مع شيفرة TypeScript لكنها لا تُشغّل أحد أدوات فحص الأنواع. هذا يعني أنه يمكنك تعديل أمثلة TypeScript للتعلّم، لكنك لن ترى تحذيرات أو أخطاء الأنواع. للحصول على فحص الأنواع، استخدم [أداة TypeScript التفاعلية (Playground)](https://www.typescriptlang.org/play) أو حاوية إلكترونية أكثر اكتمالًا.

</Note>

تُعدّ هذه الصياغة المضمنة أبسط طريقة لتوفير أنواع لمكوّن، لكنّها قد تصبح صعبة الإدارة عندما تزداد الحقول. بدلًا من ذلك، يمكنك استخدام `interface` أو `type` لوصف خصائص المكوّن:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** النص الذي سيُعرض داخل الزر */
  title: string;
  /** ما إذا كان يمكن التفاعل مع الزر */
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
      <h1>مرحبًا بكم في تطبيقي</h1>
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

يمكن أن يكون النوع الذي يصف خصائص مكوّنك بسيطًا أو معقّدًا بحسب حاجتك، لكن يجب أن يكون نوعًا كائنًا موصوفًا باستخدام `type` أو `interface`. يمكنك التعرف على كيفية وصف TypeScript للكائنات في [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)، وقد تهمك أيضًا استخدام [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) لوصف خاصية يمكن أن تكون إحدى عدة أنواع، واطّلع على دليل [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) للحالات المتقدمة.


## أمثلة على Hooks {/*example-hooks*/}

تتضمّن تعريفات الأنواع في `@types/react` أنواعًا للـ Hooks المدمجة، لذلك يمكنك استخدامها في مكوناتك دون إعداد إضافي. وهي مصممة لأخذ الشيفرة التي تكتبها في المكوّن بعين الاعتبار، وبالتالي ستحصل غالبًا على [أنواع مستنتجة]([https://www.typescriptlang.org/docs/handbook/type-inference.html]) ولن تحتاج عادةً إلى القلق بشأن تفاصيل توفير الأنواع.

مع ذلك، يمكننا الاطّلاع على بعض الأمثلة حول كيفية توفير الأنواع للـ Hooks.

### `useState` {/*typing-usestate*/}

سيعيد Hook [`useState`](/reference/react/useState) استخدام القيمة الممرّرة كحالة ابتدائية لتحديد نوع القيمة. على سبيل المثال:

```ts
// يستنتج النوع كـ "boolean"
const [enabled, setEnabled] = useState(false);
```

سيُعيّن هذا نوع `boolean` إلى `enabled`، وستكون `setEnabled` دالة تقبل إما معاملًا من نوع `boolean` أو دالة تُرجع `boolean`. إذا رغبت في تحديد نوع الحالة صراحةً، يمكنك تمرير معامل نوع إلى استدعاء `useState`:

```ts
// تحديد النوع صراحةً كـ "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

قد لا يكون ذلك مفيدًا في هذه الحالة، لكن حالة شائعة قد ترغب فيها بتوفير نوع هي عندما يكون لديك نوع اتحاد (union). على سبيل المثال، يمكن أن تكون قيمة `status` هنا إحدى عدة سلاسل نصية مختلفة:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

أو، كما يُوصَى في [مبادئ هيكلة الحالة](/learn/choosing-the-state-structure#principles-for-structuring-state)، يمكنك تجميع الحالة المرتبطة في كائن واحد ووصف الاحتمالات المختلفة عبر أنواع الكائنات:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

Hook [`useReducer`](/reference/react/useReducer) هو Hook أكثر تعقيدًا يأخذ دالة مخفّضة (reducer) وحالة ابتدائية. تُستنتج أنواع دالة الـ reducer من الحالة الابتدائية. يمكنك اختياريًا تمرير معامل نوع إلى استدعاء `useReducer` لتحديد نوع الحالة، لكن غالبًا ما يكون من الأفضل تعيين النوع على الحالة الابتدائية بدلاً من ذلك:

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
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>مرحبًا بعدّادي</h1>

      <p>العدد: {state.count}</p>
      <button onClick={addFive}>زد 5</button>
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


نستخدم TypeScript في بضعة أماكن رئيسية:

 - يصف `interface State` شكل حالة الـ reducer.
 - يصف `type CounterAction` الإجراءات المختلفة التي يمكن إرسالها إلى الـ reducer.
 - يوفر `const initialState: State` نوعًا للحالة الابتدائية، ويكون هذا النوع مستخدمًا بواسطة `useReducer` افتراضيًا.
 - تحدّد `stateReducer(state: State, action: CounterAction): State` أنواع معامِلات الدالة وقيمة الإرجاع.
بديل أكثر صراحةً لتعيين النوع على `initialState` هو تمرير معامل نوع إلى `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

Hook [`useContext`](/reference/react/useContext) هي تقنية لتمرير البيانات عبر شجرة المكونات دون الحاجة إلى تمرير props خلال كل مكوّن. تُستخدم بإنشاء مكوّن مزوّد (Provider) وغالبًا بإنشاء Hook لاستهلاك القيمة في مكوّن تابع.

يُستنتج نوع القيمة المقدّمة من قِبل الـ context من القيمة الممرّرة إلى استدعاء `createContext`:

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
      <p>المظهر الحالي: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

تعمل هذه التقنية عندما يكون لديك قيمة افتراضية معقولة — لكن قد توجد حالات لا تكون فيها القيمة الافتراضية مناسبة، وفي هذه الحالات قد يبدو استخدام `null` معقولًا كقيمة افتراضية. ومع ذلك، لتمكين نظام الأنواع من فهم شيفرتك، تحتاج إلى تحديد `ContextShape | null` صراحةً عند استدعاء `createContext`.

هذا يتسبب في مشكلة الحاجة لإزالة `| null` من نوع مستهلكي الـ context. توصيتنا هي جعل الـ Hook يقوم بفحص وقت التشغيل لوجود القيمة ورمي خطأ إذا لم تكن موجودة:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// هذا مثال أبسط، لكن يمكنك تخيّل كائنٍ أكثر تعقيدًا هنا
type ComplexObject = {
  kind: string
};

// تم إنشاء الـ context مع `| null` في النوع، لتعكس القيمة الافتراضية بدقة.
const Context = createContext<ComplexObject | null>(null);

// The `| null` will be removed via the check in the Hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
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

يقوم [React Compiler](/learn/react-compiler) تلقائيًا بتذكرة (memoize) القيم والدوال، مما يقلّل الحاجة لاستخدام `useMemo` يدويًا. يمكنك استخدام المجمّع للتعامل مع التذكّر تلقائيًا.

</Note>

يقوم Hook [`useMemo`](/reference/react/useMemo) بإنشاء أو إعادة الوصول إلى قيمة مُذَكَّرَة (memorized) من خلال استدعاء دالة، ويعيد تشغيل الدالة فقط عندما تتغير التبعيات الممرّرة كوسيط ثانٍ. تُستنتَج نتيجة استدعاء الـ Hook من قيمة الإرجاع للدالة الممرَّرة كوسيط أول. يمكنك أن تكون أكثر صراحةً بتمرير معامل نوع إلى الـ Hook.

```ts
// يتم استنتاج نوع visibleTodos من قيمة الإرجاع في filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

<Note>

يقوم [React Compiler](/learn/react-compiler) تلقائيًا بتذكرة (memoize) القيم والدوال، مما يقلّل الحاجة لاستخدام `useCallback` يدويًا. يمكنك استخدام المجمّع للتعامل مع التذكرة تلقائيًا.

</Note>

يوفّر Hook [`useCallback`](/reference/react/useCallback) مرجعًا ثابتًا لدالة طالما أن التبعيات الممرَّرة في الوسيط الثاني لم تتغير. مثل `useMemo`، يُستنتج نوع الدالة من قيمة الإرجاع للدالة الممرَّرة كوسيط أول، ويمكنك أن تكون أكثر صراحةً بتمرير معامل نوع إلى الـ Hook.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

عند العمل في وضع TypeScript الصارم (`strict`)، يتطلب `useCallback` إضافة أنماط لأنواع معاملات الدالة في ردّ النداء. ذلك لأن نوع الدالة يُستنتج من قيمة الإرجاع، وبدون تعريف المعاملات لا يمكن فهم النوع بالكامل.

اعتمادًا على تفضيلات نمط كتابة الشيفرة لديك، يمكنك استخدام دوال `*EventHandler` المتاحة في تعريفات React لتحديد نوع معالج الحدث في نفس الوقت الذي تعرف فيه الدالة:

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

توجد مجموعة واسعة من الأنواع في حزمة `@types/react`، ومن المفيد الاطلاع عليها عندما تشعر بالراحة في كيفية تفاعل React مع TypeScript. يمكنك العثور عليها [في مجلد React في DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). سنراجع هنا بعض الأنواع الأكثر شيوعًا.

### أحداث DOM {/*typing-dom-events*/}

عند العمل مع أحداث DOM في React، يمكن غالبًا استنتاج نوع الحدث من معالج الحدث. ومع ذلك، عندما تريد استخراج دالة لتمريرها إلى معالج حدث، ستحتاج إلى تحديد نوع الحدث صراحةً.

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

هناك العديد من أنواع الأحداث المضمّنة في تعريفات React — يمكنك الاطّلاع على القائمة الكاملة [هنا](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) والتي تعتمد على [الأحداث الأكثر شيوعًا في DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

عند البحث عن النوع الذي تحتاجه، انظر أولًا إلى معلومات المرور (hover) لمعالج الحدث في محرّرك، فستوضح نوع الحدث.

إذا احتجت إلى استخدام حدث غير مُدرَج في هذه القائمة، يمكنك استخدام نوع `React.SyntheticEvent` باعتباره النوع الأساسي لكل الأحداث.

### العناصر الفرعية (Children) {/*typing-children*/}

هناك طريقتان شائعتان لوصف العناصر الفرعية لمكوّن. الأولى هي استخدام نوع `React.ReactNode`، وهو اتحاد لكافة الأنواع الممكن تمريرها كـ children في JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

هذا تعريف واسع جدًا للعناصر الفرعية. الطريقة الثانية هي استخدام نوع `React.ReactElement`، الذي يمثل عناصر JSX فقط وليس البدائل الأولية في JavaScript مثل السلاسل النصية أو الأعداد:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

ملاحظة: لا يمكنك استخدام TypeScript لوصف أن العناصر الفرعية هي نوع محدد من عناصر JSX، لذا لا يمكنك وصف مكوّن يقبل فقط عناصر `<li>` عبر نظام الأنواع.

يمكنك رؤية مثال لكل من `React.ReactNode` و`React.ReactElement` مع مدقّق الأنواع في [أداة TypeScript التفاعلية هذه](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### خصائص الأنماط (Style Props) {/*typing-style-props*/}

عند استخدام الأنماط المضمنة (inline styles) في React، يمكنك استخدام `React.CSSProperties` لوصف الكائن الممرَّر إلى الخاصية `style`. هذا النوع يضم جميع خصائص CSS الممكنة، وهو وسيلة جيدة لضمان تمرير خصائص CSS صالحة والحصول على الإكمال التلقائي في المحرر.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## المزيد من المصادر للتعلّم {/*further-learning*/}

يغطي هذا الدليل أساسيات استخدام TypeScript مع React، لكن هناك المزيد لتعلمه.
قد تحتوي صفحات واجهات برمجة التطبيقات (API) على وثائق أعمق حول كيفية استخدامها مع TypeScript.

نوصي بالمصادر التالية:

 - [دليل TypeScript الرسمي (Handbook)](https://www.typescriptlang.org/docs/handbook/) هو الوثيقة الرسمية لـ TypeScript ويغطي معظم ميزات اللغة الأساسية.

 - [ملاحظات إصدار TypeScript](https://devblogs.microsoft.com/typescript/) تغطي الميزات الجديدة بعمق.

 - [قائمة اختصارات React TypeScript (React TypeScript Cheatsheet)](https://react-typescript-cheatsheet.netlify.app/) تديرها المجتمع وتغطي حالات حافة مفيدة وتوفر نطاقًا أوسع من هذا المستند.

 - [خادم Discord لمجتمع TypeScript](https://discord.com/invite/typescript) مكان رائع لطرح الأسئلة والحصول على مساعدة حول TypeScript وReact.
