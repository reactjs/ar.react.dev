---
title: "خطاطيف مدمجة في React"
---

<Intro>

 تمكنك *الخطاطيف* (Hooks) من استخدام مزايا مختلفة من React في مكوناتك. يمكنك إما استخدام الخطاطيف المدمجة (المبنية مسبقا)، أو استخدامها لبناء الخطاف الخاص بك. ستريك هذه الصفحة جميع الخطاطيف المبنية مسبقًا في React.


</Intro>

---

## خطاطيف الحالة (State) {/*state-hooks*/}

تسمح *الحالة* للمكون ["بتذكر" معلومات مثل إدخالات المستخدم](/learn/state-a-components-memory). على سبيل المثال، يمكن لمكوّن النموذج Form استخدام الحالة لتخزين قيمة الإدخال، بينما يمكن لمكون معرض الصور استخدام الحالة لتخزين رقم الصورة المختارة.

لإضافة حالة إلى مكون، استخدم أحد هذه الخطاطيف:

* [`useState`](/reference/react/useState) يعيّن .متغير حالة يمكنك تحديثه مباشرة

* [`useReducer`](/reference/react/useReducer) يعيّن متغير حالة مع منطق التحديث داخل [دالة reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## خطاطيف السياق (Context) {/*context-hooks*/}

يسمح *السياق* للمكون [بتلقي المعلومات من الآباء البعيدين دون تمريرها كدعامات (props)](/learn/passing-props-to-a-component). على سبيل المثال، يمكن لمكوِّن المستوى الأعلى لتطبيقك أن يمرر سمة واجهة المستخدم الحالية إلى جميع المكونات أدناه، بغض النظر عن مدى عمقها.


* [`useContext`](/reference/react/useContext) يقرأ ويحدّث في السياق.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## خطاطيف المرجع {/*ref-hooks*/}

تسمح *المراجع* للمكون [بحمل بعض المعلومات التي لا تُستخدم للعرض](/learn/referencing-values-with-refs) ، مثل عنصر DOM أو معرّف المهلة (timeout ID).
 على عكس الحالة ، لا يؤدي تحديث المرجع إلى إعادة تصيير المكون الخاص بك. المرجع Ref هي "فتحة هروب" من طريقة React. تكون مفيدة عندما تحتاج إلى العمل مع أنظمة غير React، مثل واجهات برمجة تطبيقات المتصفح المضمنة (BOM).


* [`useRef`](/reference/react/useRef) يعيّن المرجع، يمكنك الاحتفاظ بأي قيمة فيه، ولكن غالبًا ما يتم استخدامه لاحتواء عنصر DOM
* [`useImperativeHandle`](/reference/react/useImperativeHandle) يتيح لك تخصيص المرجع الذي يعرضه المكون الخاص بك. نادرًا ما يُستخدم هذا الخطاف.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## خطاطيف التأثير (Effect) {/*effect-hooks*/}

تسمح التأثيرات للمكون [بالاتصال والمزامنة مع الأنظمة الخارجية](/learn/synchronizing-with-effects). يتضمن ذلك التعامل مع الشبكة، ومتصفح DOM، والرسوم المتحركة، وعناصر واجهة المستخدم المكتوبة باستخدام مكتبة واجهة مستخدم مختلفة، وأكواد أخرى غير React.


* [`useEffect`](/reference/react/useEffect) يربط المكوّن بنظام خارجي.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

التأثيرات هي "فتحة هروب" من أسلوب React. لا تَستخدِم التأثيرات لتنظيم تدفق البيانات لتطبيقك. إذا كنت لا تتفاعل مع نظام خارجي، [فقد لا تحتاج إلى تأثير](/learn/you-might-not-need-an-effect).


هناك نوعان نادران من أشكال الاستخدام للتأثير  `useEffect` مع اختلافات في توقيت الاستخدام:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) ينطلق قبل أن يعيد المتصفح اظهار الشاشة. يمكنك قياس التخطيط هنا.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) ينطلق قبل أن تُجري React تغييرات على DOM. يمكن للمكتبات إدراج CSS الديناميكي هنا.

---

## خطاطيف الأداء {/*performance-hooks*/}

من الطرق الشائعة لتحسين أداء إعادة العرض تخطي العمل غير الضروري. على سبيل المثال، يمكنك إخبار React بإعادة استخدام نتيجة عملية حسابية مخزنة أو تخطي إعادة التصيير إذا لم تتغير البيانات منذ التصيير السابق.

لتخطي العمليات الحسابية وإعادة التصيير غير الضرورية ، استخدم أحد هذه الخطاطيف:


- [`useMemo`](/reference/react/useMemo) يتيح لك تخزين نتيجة عملية حسابية مكلفة.
- [`useCallback`](/reference/react/useCallback) يتيح لك تخزين تعريف وظيفة function قبل تمريره إلى مكون محسَّن.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

في بعض الأحيان، لا يمكنك تخطي إعادة العرض لأن الشاشة تحتاج بالفعل إلى التحديث. في تلك الحالة، يمكنك تحسين الأداء عن طريق فصل التحديثات الحاظرة لمعالجة الكود (blocking) التي يجب أن تكون متزامنة (مثل الكتابة في أحد المدخلات) عن التحديثات غير الحاظرة (non-blocking) التي لا تحتاج إلى حظر واجهة المستخدم (مثل تحديث مخطط).

لتحديد أولوية العرض، استخدم أحد هذه الخطاطيف:

- [`useTransition`](/reference/react/useTransition) يتيح لك اعتبار الحالة غير حاظرة والسماح للتحديثات الأخرى بالتداخل معها.
- [`useDeferredValue`](/reference/react/useDeferredValue) يتيح لك تأجيل تحديث جزء غير مهم من واجهة المستخدم والسماح للأجزاء الأخرى بالتحديث أولاً.

---

<<<<<<< HEAD
## خطاطيف أخرى {/*other-hooks*/}
=======
## Resource Hooks {/*resource-hooks*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

To read a value from a resource, use this Hook:

- [`use`](/reference/react/use) lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

---

## Other Hooks {/*other-hooks*/}
>>>>>>> bdc60c26848820239db732b7218d41f4c2b204af

هذه الخطاطيف مفيدة في الغالب لمؤلفي المكتبات ولا يتم استخدامها بشكل شائع في كود التطبيق.

- [`useDebugValue`](/reference/react/useDebugValue) يتيح لك تخصيص التسمية التي تعرضها أدوات مطوري React لخطافك المخصص.
- [`useId`](/reference/react/useId) يتيح للمكون ربط معرف فريد بنفسه (unique ID). تستخدم عادة مع واجهات برمجة إمكانية الوصول API.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) يتيح للمكون الاشتراك في مُوَزّع خارجي.

---

## الخطاطيف الخاصة بك {/*your-own-hooks*/}

 يمكنك أيضًا [تعريف الخطاطيف المخصصة](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) الخاصة بك كدوال JavaScript.
