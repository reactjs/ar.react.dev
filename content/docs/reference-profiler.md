---
id: profiler
title: واجهة برمجة التطبيقات المحلل(Profiler API)
layout: docs
category: Reference
permalink: docs/profiler.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React:
>
> - [`<Profiler>`](https://react.dev/reference/react/Profiler)

</div>

Its purpose is to help identify parts of an application that are slow and may benefit from [optimizations such as memoization](/docs/hooks-faq.html#how-to-memoize-calculations).
`(Profiler)المحلل` يقوم بحساب كم مرة يقوم فيها تطبيق React بالتنفيذ وايضاً "تكلفة" كل تنفيذ. الهدف من هذا هو المساعدة في تحديد اجزاء التطبيق البطيئة والتي قد تسفيد من [تحسينات مثل التخزين](/docs/hooks-faq.html#how-to-memoize-calculations).

> ملحوظة:
>
>المحلل(Profiler) يضيف بعض الاحمال الاضافية، لذلك **يتم تعطيلة في [البنية الانتاجية](/docs/optimizing-performance.html#use-the-production-build)**.
>
>للأشتراك في تحليل الانتاج ، توفر React بنية إنتاج خاصة مع تمكين المحلل(Profiler).
> أقراء اكثر عن كيفية استخدام هذه البنية في [fb.me/react-profiling](https://fb.me/react-profiling)

## طريقة الأستخدام {#usage}
`(Profiler)المحلل` يمكن أن يضاف في أي جزء من شجرة React لحساب لحساب تكلفة التسليم لهذا الجزء.
انها تحتاج إلى خاصيتين: `id`من نوع (string) و `onRender` التي تعتبر دالة تُنادا من قبل React عندما يسجل اي تحديث من العناصر الموجودة في الشجرة.
مثلاً، لتحليل العنصر `Navigation` وكل احفادة من العناصر (التي تندرج تحتة في شجرة العناصر):

```js{3}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```
من الممكن استعمال العديد من عناصر `(Profiler)المحلل` لحساب اجزاء مختلفة من التطبيق
```js{3,6}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Profiler id="Main" onRender={callback}>
      <Main {...props} />
    </Profiler>
  </App>
);
```
من الممكن أيضاً استعمال `(Profiler)المحلل` متداخلاً لحساب عناصر مختلفة تحت نفس الجزء من الشجرة.
```js{3,5,8}
render(
  <App>
    <Profiler id="Panel" onRender={callback}>
      <Panel {...props}>
        <Profiler id="Content" onRender={callback}>
          <Content {...props} />
        </Profiler>
        <Profiler id="PreviewPane" onRender={callback}>
          <PreviewPane {...props} />
        </Profiler>
      </Panel>
    </Profiler>
  </App>
);
```

> ملحوظة
>
>بالرغم من أن `(Profiler)المحلل` هو عنصر خفيف الحمل، لا يجب استعمالة ألا في الضرورة لأن كل مرة يستعمل فيها يضيف حمل على المعالج وذاكرة التخزين بالنسبة للتطبيق.

 ## `onRender` رد النداء  {#onrender-callback}

`المحلل (Profiler)` يحتاج دالة `onRender` كخاصية تناديها React في أي وقت يتم فيه "تنفيذ" تحديث من العناصر المندرجة تحت شجرة المحلل(Profiller).
يتم تسليم معاملات تصف ما تم تسليمة وكم من الوقت قد أخذ.

```js
function onRenderCallback(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
) {
  // Aggregate or log render timings...
}
```

لنلقي نظرة مقربة على كلٍ من الخواص:
* **`id: string`** -
الخاصية `id` لشجرة `(Profiler)المحلل`  التي تم تسليمها أخيرا. يمكن أستعمالها في تحديد أي من أجزاء الشجرة قد تم تنفيذة في حالة أستعمل أكثر من محلل(Profiler).
* **`phase: "mount" | "update"`** -
يحدد ما إذا كانت الشجرة قد تم تفعيلها لأول مرة أو قد تم أعادة تنفيذها بسبب تغير في الخواص أو الحالة أو الخطافات.
* **`actualDuration: number`** -
الوقت الذي استغرقة `(Profiler)المحلل` وكل اتباعة لأعادة التنفيذ بعد أخر تحديث.
هذا يوضح كفائة استهلاك الشجرة الفرعية للتخذين (مثلاً [`React.memo`](/docs/react-api.html#reactmemo), [`useMemo`](/docs/hooks-reference.html#usememo), [`shouldComponentUpdate`](/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)).
ف الحالات المثلا هذة القيمة يجب أن تقل بشكل ملحوظ بعد أول عملية تنفيذ لأن كل التابعين لن يحتاجو إلى أعادة تنفيذ إلا إذا كان هناك تغيير ف الخواص.
* **`baseDuration: number`** -
مدة `التنفيذ` لكل عنصر من شجرة `(profiler)المحلل` على حدا.
هذه القيمة لتقدير التكلفة في أسواء حالة تنفيذ ( مثلا التنفيذ الابتدائي أو شجرة بدون تخزين).
* **`startTime: number`** -
الوقت الذي بدأت في React عملية التنفيذ للتحديث الحالي.
* **`commitTime: number`** -
الوقت الذي سلمت فيه React التحديث الحالي.
هذه القيمة متاحة لكل المحللين(Profilers) في نفس عملية التسليم، يمكن تجميعهم إذا كنت ترغب.
* **`interactions: Set`** -
مجموعة من ["interactions"](https://fb.me/react-interaction-tracing) التي تم تعقبها عند جدولة التحديث ( مثلا عند `التنفيذ` أو تم استدعاء `setState`).
> ملحوظة
>
>يمكن استخدام التفاعلات في تحديد سبب تحديث، ولكن واجهة برمجة التطبيق الخاصة بالتعقب مازالت تحت التجربة.
>
>يمكنك معرفة المزيد في [fb.me/react-interaction-tracing](https://fb.me/react-interaction-tracing)
