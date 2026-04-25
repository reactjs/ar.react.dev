---
title: "مكوّن <Profiler>"
---

<Intro>

`<Profiler>` يتيح قياس أداء العرض لشجرة React برمجيًا.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<Profiler>` {/*profiler*/}

لفّ شجرة مكوّنات بـ `<Profiler>` لقياس أداء عرضها.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### الخصائص {/*props*/}

* `id`: سلسلة تعرّف جزء واجهة المستخدم الذي تقيسه.
* `onRender`: [استدعاء `onRender`](#onrender-callback) تستدعيه React في كل مرة تُحدَّث فيها المكوّنات ضمن الشجرة الملفوفة. يتلقى معلومات عما تم عرضه وكم استغرق من الوقت.

#### ملاحظات {/*caveats*/}

* يضيف التنميط (Profiling) بعض العبء الإضافي، لذلك **يُعطّل في بناء الإنتاج افتراضيًا.** للموافقة على التنميط في الإنتاج، تحتاج إلى تفعيل [بناء إنتاج خاص بالتنميط.](/reference/dev-tools/react-performance-tracks#using-profiling-builds)

---

### استدعاء `onRender` {/*onrender-callback*/}

ستستدعي React دالة `onRender` مع معلومات عما تم عرضه.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
```

#### المعاملات {/*onrender-parameters*/}

* `id`: سلسلة خاصية `id` لشجرة `<Profiler>` التي أُكملت للتو. يتيح لك معرفة أي جزء من الشجرة أُكمل إذا استخدمت أكثر من محلل.
* `phase`: `"mount"` أو `"update"` أو `"nested-update"`. يخبرك ما إذا كانت الشجرة قد رُكبت لأول مرة أو أُعيد عرضها بسبب تغيّر في الخصائص أو الحالة أو الخطافات.
* `actualDuration`: عدد الميلي ثانية المستغرقة في عرض `<Profiler>` وأحفاده للتحديث الحالي. يدل على مدى استفادة الشجرة الفرعية من التذكير (مثل [`memo`](/reference/react/memo) و[`useMemo`](/reference/react/useMemo)). من المفترض أن ينخفض هذا القيم كثيرًا بعد الركوب الأول إذ يحتاج كثير من الأحفاد لإعادة العرض فقط عند تغيّر خصائصها.
* `baseDuration`: عدد الميلي ثانية تقديري لوقت إعادة عرض شجرة `<Profiler>` كاملة بلا أي تحسينات. يُحسب بجمع أطول مدد العرض الأخيرة لكل مكوّن في الشجرة. يقدّر تكلفة أسوأ حالة للعرض (مثل الركوب الأول أو شجرة بلا تذكير). قارن `actualDuration` به لترى ما إذا كان التذكير يعمل.
* `startTime`: طابع زمني رقمي لبداية عرض React للتحديث الحالي.
* `commitTime`: طابع زمني رقمي لالتزام React بالتحديث الحالي. تُشارك هذه القيمة بين كل المحللات في التزام واحد، ما يتيح تجميعها إن رغبت.

---

## الاستخدام {/*usage*/}

### قياس أداء العرض برمجيًا {/*measuring-rendering-performance-programmatically*/}

لفّ مكوّن `<Profiler>` حول شجرة React لقياس أداء عرضها.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

يتطلب خاصيتين: `id` (سلسلة) واستدعاء `onRender` (دالة) تستدعيه React في أي وقت «تلتزم» فيه مكوّنات داخل الشجرة بتحديث.

<Pitfall>

يضيف التنميط بعض العبء الإضافي، لذلك **يُعطّل في بناء الإنتاج افتراضيًا.** للموافقة على التنميط في الإنتاج، تحتاج إلى تفعيل [بناء إنتاج خاص بالتنميط.](/reference/dev-tools/react-performance-tracks#using-profiling-builds)

</Pitfall>

<Note>

`<Profiler>` يجمع القياسات برمجيًا. إذا كنت تبحث عن محلل تفاعلي، جرّب تبويب Profiler في [أدوات مطور React](/learn/react-developer-tools). يوفّر وظائف مشابهة كإضافة للمتصفح.

المكوّنات الملفوفة بـ `<Profiler>` ستُوسَّم أيضًا في [مسارات المكوّنات](/reference/dev-tools/react-performance-tracks#components) في React Performance حتى في بنيات التنميط.
في بنيات التطوير، تُوسَّم كل المكوّنات في مسار المكوّنات سواء أُلفت بـ `<Profiler>` أم لا.

</Note>

---

### قياس أجزاء مختلفة من التطبيق {/*measuring-different-parts-of-the-application*/}

يمكنك استخدام أكثر من `<Profiler>` لقياس أجزاء مختلفة:

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

يمكنك أيضًا تداخل `<Profiler>`:

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

رغم أن `<Profiler>` مكوّن خفيف، يُفضَّل استخدامه عند الحاجة فقط. كل استخدام يضيف بعض عبء المعالج والذاكرة.

---
