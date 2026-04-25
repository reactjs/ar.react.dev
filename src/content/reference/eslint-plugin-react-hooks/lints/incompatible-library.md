---
title: incompatible-library
---

<Intro>

يتحقق من عدم استخدام مكتبات غير متوافقة مع التذكّر (اليدوي أو التلقائي).

</Intro>

<Note>

صُممت هذه المكتبات قبل توثيق قواعد تذكّر React بالكامل. اتخذت خيارات صحيحة آنذلك لتحسين تجربة الإبقاء على المكوّنات تفاعلية بالقدر المناسب مع تغيّر حالة التطبيق. بينما كانت هذه الأنماط القديمة تعمل، اكتشفنا لاحقاً أنها غير متوافقة مع نموذج برمجة React. سنواصل العمل مع مؤلفي المكتبات لترحيلها إلى أنماط تتبع Rules of React.

</Note>

## تفاصيل القاعدة {/*rule-details*/}

تستخدم بعض المكتبات أنماطاً غير مدعومة في React. عندما يلتقط الـ lint استخدام هذه الواجهات من [قائمة معروفة](https://github.com/facebook/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/HIR/DefaultModuleTypeProvider.ts)، يوسمها تحت هذه القاعدة. يعني ذلك أن React Compiler يمكنه تخطّي المكوّنات التي تستخدم واجهات غير متوافقة تلقائياً لتجنّب كسر تطبيقك.

```js
// مثال لكيفية كسر التذكّر مع هذه المكتبات
function Form() {
  const { watch } = useForm();

  // ❌ هذه القيمة لن تتحدّث حتى عند تغيّر حقل 'name'
  const name = useMemo(() => watch('name'), [watch]);

  return <div>Name: {name}</div>; // الواجهة تبدو «مجمّدة»
}
```

يذكّر React Compiler القيم تلقائياً وفق Rules of React. إذا انكسر شيء مع `useMemo` يدوياً، سينكسر أيضاً تحسين المُصرّف التلقائي. تساعدك هذه القاعدة على تحديد هذه الأنماط المشكِلة.

<DeepDive>

#### تصميم واجهات تتبع Rules of React {/*designing-apis-that-follow-the-rules-of-react*/}

سؤال يُفكَّر فيه عند تصميم واجهة مكتبة أو hook: هل يمكن استدعاء الواجهة بأمان مع `useMemo`؟ إن لم يكن ذلك ممكناً، فكل من التذكّر اليدوي وتذكّر React Compiler سيكسران شيفرة المستخدم.

مثلاً، أحد الأنماط غير المتوافقة هو «التعديل الداخلي» (interior mutability): عندما يحتفظ كائن أو دالة بحالة خفية تتغيّر مع الزمن رغم بقاء المرجع نفسه. فكّر فيها كصندوق يبدو من الخارج كما هو لكنه يعيد ترتيب محتواه سراً. لا يستطيع React معرفة أن شيئاً تغيّر لأنه يتحقق فقط مما إذا أعطيته صندوقاً مختلفاً لا ما بداخله. هذا يكسر التذكّر لأن React يعتمد على تغيّر الكائن الخارجي (أو الدالة) إذا تغيّر جزء من قيمته.

كقاعدة إبهام عند تصميم واجهات React، فكّر هل سينكسر `useMemo`:

```js
function Component() {
  const { someFunction } = useLibrary();
  // يجب أن يكون آمناً دائماً لتذكّر دوال كهذه
  const result = useMemo(() => someFunction(), [someFunction]);
}
```

بدلاً من ذلك، صمّم واجهات تُرجِع حالة غير قابلة للتغيير وتستخدم دوال تحديث صريحة:

```js
// ✅ جيد: إرجاع حالة غير قابلة للتغيير يتغيّر مرجعها عند التحديث
function Component() {
  const { field, updateField } = useLibrary();
  // هذا آمناً دائماً للتذكّر
  const greeting = useMemo(() => `Hello, ${field.name}!`, [field.name]);

  return (
    <div>
      <input
        value={field.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <p>{greeting}</p>
    </div>
  );
}
```

</DeepDive>

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ `watch` من react-hook-form
function Component() {
  const {watch} = useForm();
  const value = watch('field'); // تعديل داخلي
  return <div>{value}</div>;
}

// ❌ `useReactTable` من TanStack Table
function Component({data}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // مثيل الجدول يستخدم تعديلاً داخلياً
  return <Table table={table} />;
}
```

<Pitfall>

#### MobX {/*mobx*/}

أنماط MobX مثل `observer` تكسر أيضاً افتراضات التذكّر، لكن الـ lint لا يكتشفها بعد. إذا اعتمدت على MobX ووجدت أن تطبيقك لا يعمل مع React Compiler، قد تحتاج توجيه `"use no memo"`.

```js
// ❌ `observer` من MobX
const Component = observer(() => {
  const [timer] = useState(() => new Timer());
  return <span>Seconds passed: {timer.secondsPassed}</span>;
});
```

</Pitfall>

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ مع react-hook-form استخدم `useWatch`:
function Component() {
  const {register, control} = useForm();
  const watchedValue = useWatch({
    control,
    name: 'field'
  });

  return (
    <>
      <input {...register('field')} />
      <div>Current value: {watchedValue}</div>
    </>
  );
}
```

لا تملك بعض المكتبات بعد واجهات بديلة متوافقة مع نموذج تذكّر React. إذا لم يتخطّ الـ lint تلقائياً مكوّناتك أو hooks التي تستدعي هذه الواجهات، يرجى [فتح issue](https://github.com/facebook/react/issues) لنضيفها للـ linter.
