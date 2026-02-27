---
title: استخدام TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript هي طريقة شائعة لإضافة تعريفات الأنواع إلى قواعد أكواد JavaScript. بشكل افتراضي، يدعم TypeScript [JSX](/learn/writing-markup-with-jsx) ويمكنك الحصول على دعم كامل لـ React Web من خلال إضافة [`@types/react`](https://www.npmjs.com/package/@types/react) و [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) إلى مشروعك.

</Intro>

<YouWillLearn>

* [TypeScript مع مكونات React](/learn/typescript#typescript-with-react-components)
* [أمثلة على الكتابة مع Hooks](/learn/typescript#example-hooks)
* [أنواع شائعة من `@types/react`](/learn/typescript#useful-types)
* [مواقع التعلم الإضافية](/learn/typescript#further-learning)

</YouWillLearn>

## التثبيت {/*installation*/}

جميع [أطر عمل React الجاهزة للإنتاج](/learn/start-a-new-react-project#production-grade-react-frameworks) توفر دعمًا لاستخدام TypeScript. اتبع الدليل الخاص بإطار العمل للتثبيت:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### إضافة TypeScript إلى مشروع React موجود {/*adding-typescript-to-an-existing-react-project*/}

لتثبيت أحدث إصدار من تعريفات أنواع React:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

يجب تعيين خيارات المترجم التالية في ملف `tsconfig.json`:

1. يجب تضمين `dom` في [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (ملاحظة: إذا لم يتم تحديد خيار `lib`، فسيتم تضمين `dom` بشكل افتراضي).
1. يجب تعيين [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) إلى أحد الخيارات الصالحة. `preserve` يجب أن يكون كافيًا لمعظم التطبيقات.
  إذا كنت تنشر مكتبة، راجع [وثائق `jsx`](https://www.typescriptlang.org/tsconfig/#jsx) لمعرفة القيمة التي يجب اختيارها.

## TypeScript مع مكونات React {/*typescript-with-react-components*/}

<Note>

يجب أن يستخدم كل ملف يحتوي على JSX امتداد الملف `.tsx`. هذا امتداد خاص بـ TypeScript يخبر TypeScript بأن هذا الملف يحتوي على JSX.

</Note>

كتابة TypeScript مع React مشابهة جدًا لكتابة JavaScript مع React. الاختلاف الرئيسي عند العمل مع مكون هو أنه يمكنك توفير أنواع لـ props المكون. يمكن استخدام هذه الأنواع للتحقق من الصحة وتوفير التوثيق المضمن في المحررات.

مستعيرين [مكون `MyButton`](/learn#components) من دليل [البداية السريعة](/learn)، يمكننا إضافة نوع يصف `title` للزر:

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
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
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

يمكن لهذه البيئات التجريبية معالجة كود TypeScript، لكنها لا تشغل فاحص الأنواع. هذا يعني أنه يمكنك تعديل البيئات التجريبية لـ TypeScript للتعلم، لكنك لن تحصل على أخطاء أو تحذيرات الأنواع. للحصول على فحص الأنواع، يمكنك استخدام [TypeScript Playground](https://www.typescriptlang.org/play) أو استخدام بيئة تجريبية أكثر اكتمالاً عبر الإنترنت.

</Note>

هذا البناء المضمن هو أبسط طريقة لتوفير الأنواع لمكون، على الرغم من أنه بمجرد أن يكون لديك بعض الحقول لوصفها، يمكن أن يصبح غير عملي. بدلاً من ذلك، يمكنك استخدام `interface` أو `type` لوصف props المكون:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** The text to display inside the button */
  title: string;
  /** Whether the button can be interacted with */
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
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

النوع الذي يصف props مكونك يمكن أن يكون بسيطًا أو معقدًا حسب حاجتك، على الرغم من أنه يجب أن يكون نوع كائن موصوفًا بـ `type` أو `interface`. يمكنك التعرف على كيفية وصف TypeScript للكائنات في [أنواع الكائنات](https://www.typescriptlang.org/docs/handbook/2/objects.html) لكن قد تكون مهتمًا أيضًا باستخدام [أنواع الاتحاد](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) لوصف prop يمكن أن يكون واحدًا من عدة أنواع مختلفة ودليل [إنشاء أنواع من أنواع](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) لحالات الاستخدام الأكثر تقدمًا.


## أمثلة Hooks {/*example-hooks*/}

تعريفات الأنواع من `@types/react` تتضمن أنواعًا لـ Hooks المدمجة، لذا يمكنك استخدامها في مكوناتك دون أي إعداد إضافي. تم بناؤها لتأخذ في الاعتبار الكود الذي تكتبه في مكونك، لذا ستحصل على [أنواع مستنتجة](https://www.typescriptlang.org/docs/handbook/type-inference.html) في كثير من الأحيان وبشكل مثالي لن تحتاج إلى التعامل مع تفاصيل توفير الأنواع.

ومع ذلك، يمكننا إلقاء نظرة على بعض الأمثلة حول كيفية توفير أنواع لـ Hooks.

### `useState` {/*typing-usestate*/}

الـ [`useState` Hook](/reference/react/useState) سيعيد استخدام القيمة الممررة كحالة أولية لتحديد ما يجب أن يكون نوع القيمة. على سبيل المثال:

```ts
// استنتاج النوع كـ "boolean"
const [enabled, setEnabled] = useState(false);
```

سيعين هذا نوع `boolean` لـ `enabled`، و `setEnabled` ستكون دالة تقبل إما معامل `boolean`، أو دالة تُرجع `boolean`. إذا كنت ترغب في توفير نوع صريح للحالة، يمكنك القيام بذلك من خلال توفير معامل نوع لاستدعاء `useState`:

```ts 
// تعيين النوع بشكل صريح إلى "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

هذا ليس مفيدًا جدًا في هذه الحالة، لكن حالة شائعة قد ترغب فيها في توفير نوع هي عندما يكون لديك نوع اتحاد. على سبيل المثال، `status` هنا يمكن أن يكون واحدًا من عدة strings مختلفة:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

أو، كما هو موصى به في [مبادئ هيكلة الحالة](/learn/choosing-the-state-structure#principles-for-structuring-state)، يمكنك تجميع الحالات ذات الصلة ككائن ووصف الاحتمالات المختلفة عبر أنواع الكائنات:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

الـ [`useReducer` Hook](/reference/react/useReducer) هو Hook أكثر تعقيدًا يأخذ دالة reducer وحالة أولية. يتم استنتاج الأنواع لدالة reducer من الحالة الأولية. يمكنك اختياريًا توفير معامل نوع لاستدعاء `useReducer` لتوفير نوع للحالة، ولكن غالبًا ما يكون من الأفضل تعيين النوع على الحالة الأولية بدلاً من ذلك:

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
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


نحن نستخدم TypeScript في بعض الأماكن الرئيسية:

 - `interface State` يصف شكل حالة reducer.
 - `type CounterAction` يصف الإجراءات المختلفة التي يمكن إرسالها إلى reducer.
 - `const initialState: State` يوفر نوعًا للحالة الأولية، وأيضًا النوع الذي يستخدمه `useReducer` بشكل افتراضي.
 - `stateReducer(state: State, action: CounterAction): State` يعين الأنواع لمعاملات دالة reducer وقيمة الإرجاع.

بديل أكثر وضوحًا لتعيين النوع على `initialState` هو توفير معامل نوع لـ `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

الـ [`useContext` Hook](/reference/react/useContext) هو تقنية لتمرير البيانات عبر شجرة المكونات دون الحاجة لتمرير props عبر المكونات. يتم استخدامه من خلال إنشاء مكون موفر وغالبًا من خلال إنشاء Hook لاستهلاك القيمة في مكون فرعي.

يتم استنتاج نوع القيمة المقدمة من السياق من القيمة الممررة إلى استدعاء `createContext`:

<Sandpack>

```tsx src/App.tsx active
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
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

تعمل هذه التقنية عندما يكون لديك قيمة افتراضية منطقية - ولكن هناك حالات أحيانًا لا تكون لديك فيها، وفي هذه الحالات قد يبدو `null` معقولاً كقيمة افتراضية. ومع ذلك، للسماح لنظام الأنواع بفهم الكود الخاص بك، تحتاج إلى تعيين `ContextShape | null` بشكل صريح على `createContext`.

هذا يسبب مشكلة أنك تحتاج إلى إزالة `| null` في النوع لمستهلكي السياق. نوصي بأن يقوم Hook بفحص وجوده في وقت التشغيل ويطرح خطأ عندما لا يكون موجودًا:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// هذا مثال أبسط، لكن يمكنك تخيل كائن أكثر تعقيدًا هنا
type ComplexObject = {
  kind: string
};

// يتم إنشاء السياق مع `| null` في النوع، لتعكس بدقة القيمة الافتراضية.
const Context = createContext<ComplexObject | null>(null);

// سيتم إزالة `| null` عبر الفحص في Hook.
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
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

الـ [`useMemo`](/reference/react/useMemo) Hooks سينشئ/يعيد الوصول إلى قيمة محفوظة في الذاكرة من استدعاء دالة، ويعيد تشغيل الدالة فقط عندما تتغير التبعيات الممررة كمعامل ثانٍ. يتم استنتاج نتيجة استدعاء Hook من قيمة الإرجاع من الدالة في المعامل الأول. يمكنك أن تكون أكثر وضوحًا من خلال توفير معامل نوع لـ Hook.

```ts
// يتم استنتاج نوع visibleTodos من قيمة إرجاع filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

الـ [`useCallback`](/reference/react/useCallback) يوفر مرجعًا مستقرًا لدالة طالما أن التبعيات الممررة إلى المعامل الثاني هي نفسها. مثل `useMemo`، يتم استنتاج نوع الدالة من قيمة إرجاع الدالة في المعامل الأول، ويمكنك أن تكون أكثر وضوحًا من خلال توفير معامل نوع لـ Hook.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

عند العمل في وضع TypeScript strict، يتطلب `useCallback` إضافة أنواع للمعاملات في callback الخاص بك. هذا لأن نوع callback يتم استنتاجه من قيمة إرجاع الدالة، وبدون المعاملات لا يمكن فهم النوع بالكامل.

اعتمادًا على تفضيلات أسلوب الكود الخاص بك، يمكنك استخدام دوال `*EventHandler` من أنواع React لتوفير النوع لمعالج الحدث في نفس الوقت الذي تحدد فيه callback: 

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## أنواع مفيدة {/*useful-types*/}

هناك مجموعة واسعة جدًا من الأنواع التي تأتي من حزمة `@types/react`، يستحق القراءة عندما تشعر بالراحة مع كيفية تفاعل React و TypeScript. يمكنك العثور عليها [في مجلد React في DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). سنغطي بعض الأنواع الأكثر شيوعًا هنا.

### أحداث DOM {/*typing-dom-events*/}

عند العمل مع أحداث DOM في React، يمكن غالبًا استنتاج نوع الحدث من معالج الحدث. ومع ذلك، عندما تريد استخراج دالة لتمريرها إلى معالج حدث، ستحتاج إلى تعيين نوع الحدث بشكل صريح.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

There are many types of events provided in the React types - the full list can be found [here](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) which is based on the [most popular events from the DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

When determining the type you are looking for you can first look at the hover information for the event handler you are using, which will show the type of the event.

If you need to use an event that is not included in this list, you can use the `React.SyntheticEvent` type, which is the base type for all events.

### Children {/*typing-children*/}

هناك طريقتان شائعتان لوصف children المكون. الأولى هي استخدام نوع `React.ReactNode`، وهو اتحاد من جميع الأنواع الممكنة التي يمكن تمريرها كـ children في JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

This is a very broad definition of children. The second is to use the `React.ReactElement` type, which is only JSX elements and not JavaScript primitives like strings or numbers:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Note, that you cannot use TypeScript to describe that the children are a certain type of JSX elements, so you cannot use the type-system to describe a component which only accepts `<li>` children. 

You can see an example of both `React.ReactNode` and `React.ReactElement` with the type-checker in [this TypeScript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### Style Props {/*typing-style-props*/}

When using inline styles in React, you can use `React.CSSProperties` to describe the object passed to the `style` prop. This type is a union of all the possible CSS properties, and is a good way to ensure you are passing valid CSS properties to the `style` prop, and to get auto-complete in your editor.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Further learning {/*further-learning*/}

This guide has covered the basics of using TypeScript with React, but there is a lot more to learn.
Individual API pages on the docs may contain more in-depth documentation on how to use them with TypeScript.

We recommend the following resources:

 - [The TypeScript handbook](https://www.typescriptlang.org/docs/handbook/) is the official documentation for TypeScript, and covers most key language features.

 - [The TypeScript release notes](https://devblogs.microsoft.com/typescript/) cover new features in depth.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) is a community-maintained cheatsheet for using TypeScript with React, covering a lot of useful edge cases and providing more breadth than this document.

 - [TypeScript Community Discord](https://discord.com/invite/typescript) is a great place to ask questions and get help with TypeScript and React issues.
