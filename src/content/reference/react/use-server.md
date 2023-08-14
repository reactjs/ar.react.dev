---
title: "'use server'"
canary: true
---

<Canary>
هذه التوجيهات لازمة فقط إذا كنت [تستخدم RSC (مكونات الخادم)](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) أو تبني مكتبة متوافقة معها.
</Canary>


<Intro>

`'use server'` يميّز دوال الخادم (server-side functions) التي يمكن استدعاؤها في الكود من جانب العميل (client-side).

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `'use server'` {/*use-server*/}

أضف `'use server';` في أعلى دالة غير متزامنة (async) لتمييز أن الدالة يمكن تنفيذها من قبل العميل.

```js
async function addToCart(data) {
  'use server';
  // ...
}

// <ProductDetailPage addToCart={addToCart} />
```

يمكن تمرير هذه الدالة إلى العميل، عندما تُستدعى، ستنفذ طلب شبكة إلى الخادم يتضمن نسخة متسلسلة من أي معاملات تم تمريرها. إذا كانت دالة الخادم ترجع قيمة، سيتم تسلسلها وإرجاعها إلى العميل.

أو بدلا من ذلك، أضف `'use server';` في أعلى ملف لتمييز كل التصديرات في هذا الملف كدوال خادم غير متزامنة يمكن استخدامها في أي مكان، بما في ذلك استيرادها في ملفات مكونات العميل.

#### ملاحظات {/*caveats*/}

<<<<<<< HEAD
* تذكر أن المعاملات الممررة إلى دالة مميزة بـ `'use server'` متحكم بها بالكامل من جانب العميل. للأمان، عاملها دائمًا كإدخال غير موثوق به، وتأكد من التحقق من صحتها وتصفيتها كما يناسبك.
* لتجنب الارتباك الذي قد يحدثه خلط الكود من جانب العميل والخادم في نفس الملف، يمكن استخدام `'use server'` فقط في ملفات الخادم؛ يمكن تمرير الدوال الناتجة إلى مكونات العميل عبر الخصائص.
* لأن الاستدعاءات الشبكية الأساسية دائمًا غير متزامنة، يمكن استخدام `'use server'` فقط في دوال غير متزامنة (async).
* التوجيهات مثل `'use server'` يجب أن تكون في أعلى الدالة أو الملف، فوق أي كود آخر بما في ذلك الاستيرادات (التعليقات فوق التوجيهات مقبولة). يجب كتابتها بعلامات تنصيص مفردة (`'use server'`) أو مزدوجة (`"use server"`)، وليس علامات تنصيص عكسية backticks (&#x60;`use server`&#x60;). (تشبه تنسيق التوجيهات `'use xyz'` تنسيق تسمية الـ Hooks `useXyz()`، لكن هذا التشابه محض مصادفة.)
=======
* Remember that parameters to functions marked with `'use server'` are fully client-controlled. For security, always treat them as untrusted input, making sure to validate and escape the arguments as appropriate.
* To avoid the confusion that might result from mixing client- and server-side code in the same file, `'use server'` can only be used in server-side files; the resulting functions can be passed to client components through props.
* Because the underlying network calls are always asynchronous, `'use server'` can be used only on async functions.
* Directives like `'use server'` must be at the very beginning of their function or file, above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks. (The `'use xyz'` directive format somewhat resembles the `useXyz()` Hook naming convention, but the similarity is coincidental.)

## Usage {/*usage*/}

<Wip>

This section is incomplete. See also the [Next.js documentation for Server Components](https://beta.nextjs.org/docs/rendering/server-and-client-components).

</Wip>
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
