---
title: React تستدعي المكوّنات والـ Hooks
---

<Intro>
تتولى React تصيير المكوّنات والـ Hooks عند الحاجة لتحسين تجربة المستخدم. النموذج تصريحي: تخبر React بما يجب تصييره في منطق المكوّن، وتقرّر React أفضل طريقة لعرضه.
</Intro>

<InlineToc />

---

## لا تستدعِ دوال المكوّنات مباشرة {/*never-call-component-functions-directly*/}

يُستخدم المكوّن فقط داخل JSX. لا تستدعِه كدالة عادية. يجب أن تستدعيه React.

يجب أن تقرر React متى تُستدعى دالة المكوّن [أثناء التصيير](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code). في React تفعل ذلك عبر JSX.

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ جيد: استخدم المكوّنات في JSX فقط
}
```

```js {expectedErrors: {'react-compiler': [2]}} {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 سيء: لا تستدعِها مباشرة
}
```

إذا احتوى مكوّن على Hooks، يصبح من السهل مخالفة [قواعد Hooks](/reference/rules/rules-of-hooks) عند استدعاء المكوّنات مباشرة داخل حلقة أو شرط.

ترك React تنسّق التصيير يتيح فوائد عدة:

* **المكوّنات أكثر من دوال.** يمكن لـ React إثرائها بميزات مثل _الحالة المحلية_ عبر Hooks مرتبطة بهوية المكوّن في الشجرة.
* **أنواع المكوّنات تشارك في المطابقة (reconciliation).** بترك React تستدعي مكوّناتك، تُخبرها أيضاً عن البنية المفاهيمية للشجرة. مثلاً عند الانتقال من `<Feed>` إلى صفحة `<Profile>`، لن تحاول React إعادة استخدامهما معاً.
* **React يحسّن تجربة المستخدم.** يمكنه مثلاً ترك المتصفّح يعمل بين استدعاءات المكوّنات حتى لا يحجب إعادة تصيير شجرة كبيرة الخيط الرئيسي.
* **قصة تصحيح أفضل.** عندما تكون المكوّنات مواطنة درجة أولى يدركها الإطار، يمكن بناء أدوات مطوّر غنية للفحص في وضع التطوير.
* **مطابقة أكثر كفاءة.** يمكن لـ React تحديد المكوّنات التي تحتاج إعادة تصيير بالضبط وتخطّي البقية. يجعل التطبيق أسرع وأكثر استجابة.

---

## لا تمرّر الـ Hooks كقيم عادية {/*never-pass-around-hooks-as-regular-values*/}

يُستدعى الـ Hook فقط داخل مكوّنات أو Hooks أخرى. لا تمرّره كقيمة عادية.

الـ Hooks يوسّع المكوّن بميزات React. يجب دائماً استدعاؤه كدالة، ولا تمريره كقيمة. يتيح ذلك _الاستدلال المحلي_: فهم كل ما يفعله المكوّن بقراءته معزولاً.

مخالفة هذه القاعدة تمنع React من تحسين مكوّنك تلقائياً.

### لا تغيّر الـ Hook ديناميكياً {/*dont-dynamically-mutate-a-hook*/}

يجب أن تكون الـ Hooks «ثابتة» قدر الإمكان؛ لا تغيّرها ديناميكياً. مثلاً لا تكتب Hooks رتبة أعلى:

```js {expectedErrors: {'react-compiler': [2, 3]}} {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 سيء: لا تكتب Hooks رتبة أعلى
  const data = useDataWithLogging();
}
```

يجب أن تكون الـ Hooks غير قابلة للتعديل. بدل تعديل hook ديناميكياً، أنشئ نسخة ثابتة من الـ Hook بالسلوك المطلوب.

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ جيد: أنشئ نسخة جديدة من الـ Hook
}

function useDataWithLogging() {
  // ... أنشئ نسخة جديدة من الـ Hook وادمج المنطق هنا
}
```

### لا تستخدم الـ Hooks ديناميكياً {/*dont-dynamically-use-hooks*/}

لا يجوز أيضاً استخدام الـ Hooks ديناميكياً: مثلاً بدل حقن تبعية بتمرير Hook كقيمة:

```js {expectedErrors: {'react-compiler': [2]}} {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 سيء: لا تمرّر Hooks كـ props
}
```

ادمج دائماً استدعاء الـ Hook داخل ذلك المكوّن وعالج المنطق هناك.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ جيد: استدعِ الـ Hook مباشرة
}

function useDataWithLogging() {
  // إن وُجد منطق شرطي لتغيير سلوك الـ Hook، يجب دمجه داخل الـ Hook
}
```

بهذا يصبح `<Button />` أسهل فهماً وتصحيحاً. الاستخدام الديناميكي للـ Hooks يزيد التعقيد كثيراً ويضعف الاستدلال المحلي وإنتاجية الفريق على المدى الطويل. كما يسهل كسر [قواعد Hooks](/reference/rules/rules-of-hooks) بعدم الاستدعاء الشرطي. إن احتجت محاكاة مكوّنات للاختبارات، الأفضل غالباً محاكاة الخادم ليرد ببيانات جاهزة. وعند الإمكان، الاختبار الشامل (E2E) غالباً أكثر فعالية.
