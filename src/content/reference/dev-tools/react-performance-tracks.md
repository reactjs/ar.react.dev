---
title: مسارات أداء React
---

<Intro>

مسارات أداء React (React Performance tracks) هي إدخالات مخصّصة تظهر على خط زمن لوحة الأداء (Performance) في أدوات مطور المتصفّح.

</Intro>

صممت هذه المسارات لتعطي مطوري تطبيقات React رؤية أوضح لأداء التطبيق، عبر تصوير أحداث ومقاييس خاصة بـ React بجانب مصادر أخرى مثل طلبات الشبكة وتنفيذ JavaScript ونشاط حلقة الأحداث، كلها على خط زمن موحّد في لوحة الأداء لفهم سلوك التطبيق كاملاً.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/overview.png" alt="مسارات أداء React" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/overview.dark.png" alt="مسارات أداء React" />
</div>

<InlineToc />

---

## الاستخدام {/*usage*/}

مسارات أداء React متاحة فقط في بنيات التطوير والملف الشخصي (profiling) لـ React:

- **التطوير**: مفعّلة افتراضياً.
- **الملف الشخصي**: مسارات الجدولة (Scheduler) مفعّلة افتراضياً. مسار المكوّنات يعرض فقط المكوّنات في الأشجار الفرعية الملفوفة بـ [`<Profiler>`](/reference/react/Profiler). إن كان [امتداد React Developer Tools](/learn/react-developer-tools) مفعّلاً، تُدرَج كل المكوّنات في مسار المكوّنات حتى دون `<Profiler>`. مسارات الخادم غير متاحة في بنيات الملف الشخصي.

إن وُفعّلت، تظهر المسارات تلقائياً في التتبّعات التي تسجّلها لوحة الأداء في المتصفّحات التي توفّر [واجهات التوسعة](https://developer.chrome.com/docs/devtools/performance/extension).

<Pitfall>

أداة القياس التي تدعم مسارات أداء React تضيف بعض العبء الإضافي، لذا تكون معطّلة افتراضياً في بنيات الإنتاج.
مسارات مكوّنات الخادم وطلبات الخادم متاحة فقط في بنيات التطوير.

</Pitfall>

### استخدام بنيات الملف الشخصي {/*using-profiling-builds*/}

بالإضافة إلى بنيات الإنتاج والتطوير، يوفّر React بنية ملف شخصي خاصة.
لاستخدامها استبدل `react-dom/client` بـ `react-dom/profiling`.
نوصي بربط الاسم `react-dom/client` إلى `react-dom/profiling` وقت البناء عبر aliases المُجمّع بدل تعديل كل استيراد يدوياً.
قد يدعم إطار العمل لديك تفعيل بنية الملف الشخصي مدمجاً.

---

## المسارات {/*tracks*/}

### الجدولة (Scheduler) {/*scheduler*/}

الجدولة مفهوم داخلي في React لإدارة مهام بأولويات مختلفة. يتكوّن هذا المسار من أربعة مسارات فرعية لكل أولوية عمل:

- **Blocking** — التحديثات المتزامنة، وغالباً ما تبدأ من تفاعلات المستخدم.
- **Transition** — عمل غير حاجز في الخلفية، غالباً عبر [`startTransition`](/reference/react/startTransition).
- **Suspense** — عمل مرتبط بحدود Suspense، مثل عرض الحالات البديلة أو كشف المحتوى.
- **Idle** — أدنى أولوية، يُنفَّذ عندما لا توجد مهام أعلى أولوية.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler.png" alt="مسار الجدولة" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler.dark.png" alt="مسار الجدولة" />
</div>

#### التصييرات {/*renders*/}

كل مرور تصيير يمرّ بعدة مراحل تظهر على الخط الزمني:

- **Update** — ما الذي سبب مرور تصييراً جديداً.
- **Render** — يصيّر React الشجرة المحدّثة باستدعاء دوال تصيير المكوّنات. يمكنك رؤية الشجرة المصوّرة على [مسار المكوّنات](#components) بنفس نظام الألوان.
- **Commit** — بعد التصيير، يطبّق React التغييرات على DOM ويشغّل تأثيرات التخطيط مثل [`useLayoutEffect`](/reference/react/useLayoutEffect).
- **Remaining Effects** — يشغّل React التأثيرات السلبية للشجرة المصوّرة. غالباً بعد الرسم، وهنا يشغّل hooks مثل [`useEffect`](/reference/react/useEffect). استثناء معروف: تفاعلات المستخدم (نقرات وغيرها) قد تجعل هذه المرحلة تعمل قبل الرسم.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-update.png" alt="مسار الجدولة: التحديثات" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-update.dark.png" alt="مسار الجدولة: التحديثات" />
</div>

[تعرّف أكثر على التصيير والتأكيد](/learn/render-and-commit).

#### التحديثات المتسلسلة {/*cascading-updates*/}

التحديثات المتسلسلة من أنماط تراجع الأداء الشائعة. إذا جُدول تحديث أثناء مرور تصيير، قد يلغي React العمل المنجز ويبدأ مروراً جديداً.

في بنيات التطوير يمكن لـ React إظهار أي مكوّن جدول تحديثاً جديداً، بما في ذلك التحديثات المتسلسلة. انقر على إدخال «Cascading update» لرؤية مكدس موسّع يعرض أيضاً اسم الدالة التي جدولت التحديث.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-cascading-update.png" alt="مسار الجدولة: تحديثات متسلسلة" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-cascading-update.dark.png" alt="مسار الجدولة: تحديثات متسلسلة" />
</div>

[تعرّف أكثر على التأثيرات](/learn/you-might-not-need-an-effect).

### المكوّنات {/*components*/}

يصوّر مسار المكوّنات مدّة تصيير مكوّنات React كمخطط لهب، حيث يمثّل كل إدخال مدّة تصيير ذلك المكوّن وجميع الأبناء في الشجرة الفرعية.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-render.png" alt="مسار المكوّنات: مدد التصيير" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-render.dark.png" alt="مسار المكوّنات: مدد التصيير" />
</div>

كما في مدد التصيير، تُعرَض مدد التأثيرات كمخطط لهب بلون يتماشى مع المرحلة المقابلة على مسار الجدولة.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-effects.png" alt="مسار المكوّنات: مدد التأثيرات" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-effects.dark.png" alt="مسار المكوّنات: مدد التأثيرات" />
</div>

<Note>

على عكس التصيير، لا تُعرَض كل التأثيرات على مسار المكوّنات افتراضياً.

للحفاظ على الأداء وتجنّب ازدحام الواجهة، يعرض React فقط التأثيرات التي استغرقت 0.05ms أو أكثر، أو التي أطلقت تحديثاً.

</Note>

قد تظهر أحداث إضافية أثناء مراحل التصيير والتأثيرات:

- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Mount</span> — وُضِعت شجرة فرعية من التصييرات أو التأثيرات.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Unmount</span> — أُزيلت شجرة فرعية مماثلة.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Reconnect</span> — شبيه بـ Mount، عند استخدام [`<Activity>`](/reference/react/Activity).
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Disconnect</span> — شبيه بـ Unmount، عند استخدام [`<Activity>`](/reference/react/Activity).

#### الخصائص المتغيّرة {/*changed-props*/}

في بنيات التطوير، عند النقر على إدخال تصيير لمكوّن يمكنك فحص تغيّرات محتملة في الـ props لتحديد تصييرات غير لازمة.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/changed-props.png" alt="مسار المكوّنات: props متغيّرة" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/changed-props.dark.png" alt="مسار المكوّنات: props متغيّرة" />
</div>

### الخادم {/*server*/}

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/server-overview.png" alt="مسارات أداء خادم React" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/server-overview.dark.png" alt="مسارات أداء خادم React" />
</div>

#### طلبات الخادم {/*server-requests*/}

يصوّر مسار طلبات الخادم كل الوعود (Promises) التي تنتهي في مكوّن خادم React، بما فيها عمليات `async` مثل استدعاء `fetch` أو عمليات ملفات Node.js غير المتزامنة.

يحاول React دمج الوعود التي تبدأ من كود طرف ثالث في span واحد يمثّل مدة العملية التي تحجب كودك.
مثلاً: دالة طرف ثالث `getUser` تستدعي `fetch` عدة مرات داخلياً تظهر كـ span واحد باسم `getUser` بدل عدة spans لـ `fetch`.

النقر على span يعرض مكدس إنشاء الوعد وعرضاً لقيمة الوعد إن وُجدت.

تُعرَض الوعود المرفوضة باللون الأحمر مع قيمة الرفض.

#### مكوّنات الخادم {/*server-components*/}

تمثّل مسارات مكوّنات الخادم مدة وعود مكوّنات خادم React التي انتظرتها. تُعرَض الأزمنة كمخطط لهب؛ كل إدخال يمثّل مدّة تصيير ذلك المكوّن والأبناء في الشجرة الفرعية.

إذا انتظرت وعداً (Promise)، يعرض React مدة ذلك الوعد. لرؤية كل عمليات I/O استخدم مسار طلبات الخادم.

تُستخدم ألوان مختلفة لطول مدة التصيير؛ كلما كان اللون أغمق، كانت المدة أطول.

يحتوي مجموعة مسار مكوّنات الخادم دائماً على مسار «Primary». إذا استطاع React تصيير مكوّنات الخادم بالتوازي، تظهر مسارات «Parallel» إضافية.
إذا وُجد أكثر من 8 مكوّنات خادم بالتوازي، يربطها React بآخر مسار «Parallel» بدل إضافة مسارات أكثر.
