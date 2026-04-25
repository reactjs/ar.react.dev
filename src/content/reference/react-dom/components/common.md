---
title: "مكوّنات شائعة (مثل <div>)"
---

<Intro>

تدعم جميع مكوّنات المتصفح المدمجة، مثل [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)، بعض الخصائص والأحداث المشتركة.

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### مكوّنات شائعة (مثل `<div>`) {/*common*/}

```js
<div className="wrapper">Some content</div>
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*common-props*/}

تدعم هذه الخصائص الخاصة بـ React جميع المكوّنات المدمجة:

* `children`: عقدة React (عنصر، أو نص، أو رقم، أو [بوابة،](/reference/react-dom/createPortal) أو عقدة فارغة مثل `null` و `undefined` والقيم المنطقية، أو مصفوفة من عقد React أخرى). يحدد المحتوى داخل المكوّن. عند استخدام JSX، غالبًا تحدد خاصية `children` ضمنيًا بتداخل الوسوم مثل `<div><span /></div>`.

* `dangerouslySetInnerHTML`: كائن بالشكل `{ __html: '<p>some html</p>' }` يحتوي على سلسلة HTML خام. يتجاوز خاصية [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) لعقدة DOM ويعرض HTML الممرَّر داخلها. يجب استخدام ذلك بحذر شديد! إذا لم يكن HTML موثوقًا (مثلاً مبنيًا على بيانات المستخدم)، فتعرّض تطبيقك لثغرة [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). [اقرأ المزيد عن استخدام `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

* `ref`: كائن ref من [`useRef`](/reference/react/useRef) أو [`createRef`](/reference/react/createRef)، أو [دالة استدعاء `ref`،](#ref-callback) أو نص لـ [مراجع قديمة.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) يُملأ المرجع بعنصر DOM لهذه العقدة. [اقرأ المزيد عن التعامل مع DOM عبر المراجع.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: قيمة منطقية. إذا كانت `true`، تُكتم التحذير الذي يعرضه React للعناصر التي لها `children` و `contentEditable={true}` معًا (وهما عادة لا يعملان معًا). استخدمها إذا بنيت مكتبة إدخال نص تدير محتوى `contentEditable` يدويًا.

* `suppressHydrationWarning`: قيمة منطقية. إذا استخدمت [التصيير على الخادم،](/reference/react-dom/server) يظهر عادة تحذير عند اختلاف ما يصيّره الخادم والعميل. في حالات نادرة (مثل الطوابع الزمنية)، يصعب أو يستحيل ضمان تطابق تام. إذا ضبطت `suppressHydrationWarning` إلى `true`، لن يحذّر React من عدم تطابق السمات ومحتوى ذلك العنصر. يعمل على مستوى واحد فقط، ويُقصد به كمخرج طارئ. لا تفرط في استخدامه. [اقرأ عن كتم أخطاء الترطيب.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: كائن بأنماط CSS، مثل `{ fontWeight: 'bold', margin: 20 }`. مثل خاصية DOM [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)، يجب كتابة أسماء خصائص CSS بـ `camelCase`، مثل `fontWeight` بدل `font-weight`. يمكنك تمرير نصوص أو أرقام كقيم. إذا مررت رقمًا مثل `width: 100`، يضيف React تلقائيًا `px` ما لم تكن [خاصية بلا وحدة.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) ننصح باستخدام `style` للأنماط الديناميكية فقط عندما لا تعرف القيم مسبقًا. في غير ذلك، تطبيق صفوف CSS عادية عبر `className` أكثر كفاءة. [اقرأ المزيد عن `className` و `style`.](#applying-css-styles)

تدعم أيضًا جميع المكوّنات المدمجة خصائص DOM القياسية التالية:

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): نص. يحدد اختصار لوحة مفاتيح للعنصر. [غير موصى به عمومًا.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): تسمح سمات ARIA بتحديد معلومات شجرة الوصولية لهذا العنصر. راجع [سمات ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) للمرجع الكامل. في React، أسماء سمات ARIA مطابقة تمامًا لـ HTML.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): نص. يحدد ما إذا كانت إدخالات المستخدم تُكتب بحروف كبيرة وكيف.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): نص. يحدد اسم صنف CSS للعنصر. [اقرأ المزيد عن تطبيق أنماط CSS.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): قيمة منطقية. إذا كانت `true`، يسمح المتصفح للمستخدم بتحرير العنصر المصوَّر مباشرة. يُستخدم لتنفيذ مكتبات إدخال نص غني مثل [Lexical.](https://lexical.dev/) يحذّر React إذا حاولت تمرير أبناء React إلى عنصر مع `contentEditable={true}` لأن React لن يستطيع تحديث محتواه بعد تعديلات المستخدم.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): تسمح سمات البيانات بإرفاق بيانات نصية بالعنصر، مثل `data-fruit="banana"`. في React، لا تُستخدم كثيرًا لأنك عادة تقرأ البيانات من الخصائص أو الحالة.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): إما `'ltr'` أو `'rtl'`. يحدد اتجاه النص للعنصر.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): قيمة منطقية. يحدد ما إذا كان العنصر قابلاً للسحب. جزء من [واجهة سحب وإفلات HTML.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): نص. يحدد الإجراء المعروض لمفتاح Enter على لوحات المفاتيح الافتراضية.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): نص. لـ [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) و [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output)، يسمح بـ [ربط التسمية بعنصر تحكم.](/reference/react-dom/components/input#providing-a-label-for-an-input) مثل [سمة HTML `for`.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) يستخدم React أسماء خصائص DOM القياسية (`htmlFor`) بدل أسماء سمات HTML.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): قيمة منطقية أو نص. يحدد ما إذا كان يجب إخفاء العنصر.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): نص. يحدد معرفًا فريدًا لهذا العنصر يمكن استخدامه لاحقًا للعثور عليه أو ربطه بعناصر أخرى. أنشئه بـ [`useId`](/reference/react/useId) لتجنب التعارض بين عدة نسخ من نفس المكوّن.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): نص. إذا حُدد، يتصرف المكوّن مثل [عنصر مخصص.](/reference/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): نص. يحدد نوع لوحة المفاتيح المعروضة (مثلًا نصًا أو رقمًا أو هاتفًا).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): نص. يحدد الخاصية التي يمثلها العنصر لبرامج الزحف للبيانات المنظمة.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): نص. يحدد لغة العنصر.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): دالة [معالج `AnimationEvent`](#animationevent-handler). تُطلق عند اكتمال حركة CSS.
* `onAnimationEndCapture`: نسخة من `onAnimationEnd` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): دالة [معالج `AnimationEvent`](#animationevent-handler). تُطلق عند انتهاء تكرار حركة CSS وبدء التالي.
* `onAnimationIterationCapture`: نسخة من `onAnimationIteration` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): دالة [معالج `AnimationEvent`](#animationevent-handler). تُطلق عند بدء حركة CSS.
* `onAnimationStartCapture`: `onAnimationStart`، لكنها تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): دالة [معالج `MouseEvent`](#mouseevent-handler). تُطلق عند النقر بزر غير أساسي على جهاز الإشارة.
* `onAuxClickCapture`: نسخة من `onAuxClick` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* `onBeforeInput`: دالة [معالج `InputEvent`](#inputevent-handler). تُطلق قبل تعديل قيمة عنصر قابل للتحرير. لا يستخدم React بعد الحدث الأصلي [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) ويحاول بدلًا من ذلك محاكاته بأحداث أخرى.
* `onBeforeInputCapture`: نسخة من `onBeforeInput` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* `onBlur`: دالة [معالج `FocusEvent`](#focusevent-handler). تُطلق عند فقدان العنصر للتركيز. على عكس حدث [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) المدمج، ينتشر `onBlur` في React.
* `onBlurCapture`: نسخة من `onBlur` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): دالة [معالج `MouseEvent`](#mouseevent-handler). تُطلق عند النقر بالزر الأساسي على جهاز الإشارة.
* `onClickCapture`: نسخة من `onClick` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): دالة [معالج `CompositionEvent`](#compositionevent-handler). تُطلق عند بدء [محرر طريقة إدخال](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) جلسة تركيب جديدة.
* `onCompositionStartCapture`: نسخة من `onCompositionStart` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): دالة [معالج `CompositionEvent`](#compositionevent-handler). تُطلق عند اكتمال أو إلغاء جلسة التركيب في [محرر طريقة إدخال](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor).
* `onCompositionEndCapture`: نسخة من `onCompositionEnd` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): دالة [معالج `CompositionEvent`](#compositionevent-handler). تُطلق عند استلام [محرر طريقة إدخال](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) حرفًا جديدًا.
* `onCompositionUpdateCapture`: نسخة من `onCompositionUpdate` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): دالة [معالج `MouseEvent`](#mouseevent-handler). تُطلق عند محاولة المستخدم فتح قائمة سياق.
* `onContextMenuCapture`: نسخة من `onContextMenu` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): دالة [معالج `ClipboardEvent`](#clipboardevent-handler). تُطلق عند محاولة المستخدم نسخ شيء إلى الحافظة.
* `onCopyCapture`: نسخة من `onCopy` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): دالة [معالج `ClipboardEvent`](#clipboardevent-handler). تُطلق عند محاولة المستخدم قص شيء إلى الحافظة.
* `onCutCapture`: نسخة من `onCut` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* `onDoubleClick`: دالة [معالج `MouseEvent`](#mouseevent-handler). تُطلق عند النقر مرتين. يقابل حدث [`dblclick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event) في المتصفح.
* `onDoubleClickCapture`: نسخة من `onDoubleClick` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): دالة [معالج `DragEvent`](#dragevent-handler). تُطلق أثناء سحب المستخدم لشيء ما. 
* `onDragCapture`: نسخة من `onDrag` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): دالة [معالج `DragEvent`](#dragevent-handler). تُطلق عند توقف المستخدم عن السحب. 
* `onDragEndCapture`: نسخة من `onDragEnd` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): دالة [معالج `DragEvent`](#dragevent-handler). تُطلق عند دخول المحتوى المسحوب إلى هدف إفلات صالح. 
* `onDragEnterCapture`: نسخة من `onDragEnter` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): دالة [معالج `DragEvent`](#dragevent-handler). تُطلق على هدف إفلات صالح أثناء مرور المحتوى المسحوب فوقه. يجب استدعاء `e.preventDefault()` هنا للسماح بالإفلات.
* `onDragOverCapture`: نسخة من `onDragOver` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): دالة [معالج `DragEvent`](#dragevent-handler). تُطلق عند بدء المستخدم سحب عنصر.
* `onDragStartCapture`: نسخة من `onDragStart` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): دالة [معالج `DragEvent`](#dragevent-handler). تُطلق عند إفلات شيء على هدف إفلات صالح.
* `onDropCapture`: نسخة من `onDrop` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* `onFocus`: دالة [معالج `FocusEvent`](#focusevent-handler). تُطلق عند حصول العنصر على التركيز. على عكس حدث [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) المدمج، ينتشر `onFocus` في React.
* `onFocusCapture`: نسخة من `onFocus` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): دالة [معالج `PointerEvent`](#pointerevent-handler). تُطلق عند التقاط العنصر لمؤشر برمجيًا.
* `onGotPointerCaptureCapture`: نسخة من `onGotPointerCapture` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): دالة [معالج `KeyboardEvent`](#keyboardevent-handler). تُطلق عند ضغط مفتاح.
* `onKeyDownCapture`: نسخة من `onKeyDown` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): دالة [معالج `KeyboardEvent`](#keyboardevent-handler). مهجور. استخدم `onKeyDown` أو `onBeforeInput` بدلًا من ذلك.
* `onKeyPressCapture`: نسخة من `onKeyPress` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): دالة [معالج `KeyboardEvent`](#keyboardevent-handler). تُطلق عند رفع مفتاح.
* `onKeyUpCapture`: نسخة من `onKeyUp` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): دالة [معالج `PointerEvent`](#pointerevent-handler). تُطلق عند توقف العنصر عن التقاط مؤشر.
* `onLostPointerCaptureCapture`: نسخة من `onLostPointerCapture` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): دالة [معالج `MouseEvent`](#mouseevent-handler). تُطلق عند ضغط المؤشر.
* `onMouseDownCapture`: نسخة من `onMouseDown` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): دالة [معالج `MouseEvent`](#mouseevent-handler). تُطلق عند دخول المؤشر داخل عنصر. لا يوجد طور التقاط؛ بدلًا من ذلك ينتقل `onMouseLeave` و `onMouseEnter` من العنصر المغادر إلى المدخل.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): دالة [معالج `MouseEvent`](#mouseevent-handler). تُطلق عند خروج المؤشر خارج عنصر. لا يوجد طور التقاط؛ بدلًا من ذلك ينتقل `onMouseLeave` و `onMouseEnter` من العنصر المغادر إلى المدخل.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): دالة [معالج `MouseEvent`](#mouseevent-handler). تُطلق عند تغيير إحداثيات المؤشر.
* `onMouseMoveCapture`: نسخة من `onMouseMove` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): دالة [معالج `MouseEvent`](#mouseevent-handler). تُطلق عند خروج المؤشر خارج عنصر، أو دخوله إلى عنصر فرعي.
* `onMouseOutCapture`: نسخة من `onMouseOut` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): دالة [معالج `MouseEvent`](#mouseevent-handler). تُطلق عند رفع المؤشر.
* `onMouseUpCapture`: نسخة من `onMouseUp` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): دالة [معالج `PointerEvent`](#pointerevent-handler). تُطلق عند إلغاء المتصفح تفاعلًا بالمؤشر.
* `onPointerCancelCapture`: نسخة من `onPointerCancel` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): دالة [معالج `PointerEvent`](#pointerevent-handler). تُطلق عند تنشيط مؤشر.
* `onPointerDownCapture`: نسخة من `onPointerDown` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): دالة [معالج `PointerEvent`](#pointerevent-handler). تُطلق عند دخول المؤشر داخل عنصر. لا يوجد طور التقاط؛ بدلًا من ذلك ينتقل `onPointerLeave` و `onPointerEnter` من العنصر المغادر إلى المدخل.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): دالة [معالج `PointerEvent`](#pointerevent-handler). تُطلق عند خروج المؤشر خارج عنصر. لا يوجد طور التقاط؛ بدلًا من ذلك ينتقل `onPointerLeave` و `onPointerEnter` من العنصر المغادر إلى المدخل.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): دالة [معالج `PointerEvent`](#pointerevent-handler). تُطلق عند تغيير إحداثيات مؤشر.
* `onPointerMoveCapture`: نسخة من `onPointerMove` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): دالة [معالج `PointerEvent`](#pointerevent-handler). تُطلق عند خروج المؤشر خارج عنصر، أو إلغاء التفاعل، و[أسباب أخرى.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: نسخة من `onPointerOut` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): دالة [معالج `PointerEvent`](#pointerevent-handler). تُطلق عندما لا يعود المؤشر نشطًا.
* `onPointerUpCapture`: نسخة من `onPointerUp` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): دالة [معالج `ClipboardEvent`](#clipboardevent-handler). تُطلق عند محاولة المستخدم لصق شيء من الحافظة.
* `onPasteCapture`: نسخة من `onPaste` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): دالة [معالج `Event`](#event-handler). تُطلق عند تمرير عنصر. هذا الحدث لا ينتشر.
* `onScrollCapture`: نسخة من `onScroll` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): دالة [معالج `Event`](#event-handler). تُطلق بعد تغيير التحديد داخل عنصر قابل للتحرير مثل إدخال. يوسّع React `onSelect` ليعمل مع عناصر `contentEditable={true}` أيضًا، وليطلق عند تحديد فارغ وعند التعديلات.
* `onSelectCapture`: نسخة من `onSelect` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): دالة [معالج `TouchEvent`](#touchevent-handler). تُطلق عند إلغاء المتصفح تفاعلًا باللمس.
* `onTouchCancelCapture`: نسخة من `onTouchCancel` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): دالة [معالج `TouchEvent`](#touchevent-handler). تُطلق عند إزالة نقطة لمس أو أكثر.
* `onTouchEndCapture`: نسخة من `onTouchEnd` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): دالة [معالج `TouchEvent`](#touchevent-handler). تُطلق عند تحريك نقطة لمس أو أكثر.
* `onTouchMoveCapture`: نسخة من `onTouchMove` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): دالة [معالج `TouchEvent`](#touchevent-handler). تُطلق عند وضع نقطة لمس أو أكثر.
* `onTouchStartCapture`: نسخة من `onTouchStart` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): دالة [معالج `TransitionEvent`](#transitionevent-handler). تُطلق عند اكتمال انتقال CSS.
* `onTransitionEndCapture`: نسخة من `onTransitionEnd` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): دالة [معالج `WheelEvent`](#wheelevent-handler). تُطلق عند تدوير عجلة.
* `onWheelCapture`: نسخة من `onWheel` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): نص. يحدد دور العنصر صراحةً لتقنيات المساعدة.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): نص. يحدد اسم الفتحة عند استخدام shadow DOM. في React، يُحقق نمط مماثل عادة بتمرير JSX كخصائص، مثل `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): قيمة منطقية أو null. إذا ضُبطت صراحةً إلى `true` أو `false`، تفعّل أو تعطّل التدقيق الإملائي.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): رقم. يتجاوز سلوك زر Tab الافتراضي. [تجنب قيمًا غير `-1` و `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): نص. يحدد نص التلميح للعنصر.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): إما `'yes'` أو `'no'`. تمرير `'no'` يستثني محتوى العنصر من الترجمة.

يمكنك أيضًا تمرير سمات مخصصة كخصائص، مثل `mycustomprop="someValue"`. قد يفيد ذلك عند التكامل مع مكتبات خارجية. يجب أن يكون اسم السمة المخصصة بأحرف صغيرة ولا يبدأ بـ `on`. تُحوَّل القيمة إلى نص. إذا مررت `null` أو `undefined`، تُزال السمة المخصصة.

تُطلق هذه الأحداث فقط لعناصر [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form):

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): دالة [معالج `Event`](#event-handler). تُطلق عند إعادة تعيين النموذج.
* `onResetCapture`: نسخة من `onReset` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): دالة [معالج `Event`](#event-handler). تُطلق عند إرسال النموذج.
* `onSubmitCapture`: نسخة من `onSubmit` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)

تُطلق هذه الأحداث فقط لعناصر [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). على عكس أحداث المتصفح، تنتشر في React:

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): دالة [معالج `Event`](#event-handler). تُطلق عند محاولة المستخدم إغلاق الحوار.
* `onCancelCapture`: نسخة من `onCancel` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): دالة [معالج `Event`](#event-handler). تُطلق بعد إغلاق الحوار.
* `onCloseCapture`: نسخة من `onClose` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)

تُطلق هذه الأحداث فقط لعناصر [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details). على عكس أحداث المتصفح، تنتشر في React:

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): دالة [معالج `Event`](#event-handler). تُطلق عند تبديل المستخدم لعنصر التفاصيل.
* `onToggleCapture`: نسخة من `onToggle` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)

تُطلق هذه الأحداث لعناصر [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) و [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) و [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) و [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed) و [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) و [`<image>` في SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag). على عكس أحداث المتصفح، تنتشر في React:

* `onLoad`: دالة [معالج `Event`](#event-handler). تُطلق عند اكتمال تحميل المورد.
* `onLoadCapture`: نسخة من `onLoad` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): دالة [معالج `Event`](#event-handler). تُطلق عند تعذر تحميل المورد.
* `onErrorCapture`: نسخة من `onError` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)

تُطلق هذه الأحداث لموارد مثل [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) و [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). على عكس أحداث المتصفح، تنتشر في React:

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): دالة [معالج `Event`](#event-handler). تُطلق عندما لم يُحمَّل المورد بالكامل دون أن يكون السبب خطأ.
* `onAbortCapture`: نسخة من `onAbort` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): دالة [معالج `Event`](#event-handler). تُطلق عند وجود بيانات كافية لبدء التشغيل دون ما يكفي للوصول للنهاية دون تخزين مؤقت.
* `onCanPlayCapture`: نسخة من `onCanPlay` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): دالة [معالج `Event`](#event-handler). تُطلق عند وجود بيانات كافية يُحتمل معها التشغيل دون تخزين مؤقت حتى النهاية.
* `onCanPlayThroughCapture`: نسخة من `onCanPlayThrough` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): دالة [معالج `Event`](#event-handler). تُطلق عند تحديث مدة الوسيط.
* `onDurationChangeCapture`: نسخة من `onDurationChange` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): دالة [معالج `Event`](#event-handler). تُطلق عندما يصبح الوسيط فارغًا.
* `onEmptiedCapture`: نسخة من `onEmptied` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): دالة [معالج `Event`](#event-handler). تُطلق عندما يصادف المتصفح وسيطًا مشفرًا.
* `onEncryptedCapture`: نسخة من `onEncrypted` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): دالة [معالج `Event`](#event-handler). تُطلق عند توقف التشغيل لعدم وجود ما يُشغَّل.
* `onEndedCapture`: نسخة من `onEnded` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): دالة [معالج `Event`](#event-handler). تُطلق عند تعذر تحميل المورد.
* `onErrorCapture`: نسخة من `onError` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): دالة [معالج `Event`](#event-handler). تُطلق عند تحميل إطار التشغيل الحالي.
* `onLoadedDataCapture`: نسخة من `onLoadedData` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): دالة [معالج `Event`](#event-handler). تُطلق عند تحميل البيانات الوصفية.
* `onLoadedMetadataCapture`: نسخة من `onLoadedMetadata` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): دالة [معالج `Event`](#event-handler). تُطلق عند بدء المتصفح تحميل المورد.
* `onLoadStartCapture`: نسخة من `onLoadStart` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): دالة [معالج `Event`](#event-handler). تُطلق عند إيقاف الوسيط مؤقتًا.
* `onPauseCapture`: نسخة من `onPause` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): دالة [معالج `Event`](#event-handler). تُطلق عندما لا يعود الوسيط متوقفًا.
* `onPlayCapture`: نسخة من `onPlay` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): دالة [معالج `Event`](#event-handler). تُطلق عند بدء أو استئناف تشغيل الوسيط.
* `onPlayingCapture`: نسخة من `onPlaying` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): دالة [معالج `Event`](#event-handler). تُطلق دوريًا أثناء تحميل المورد.
* `onProgressCapture`: نسخة من `onProgress` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): دالة [معالج `Event`](#event-handler). تُطلق عند تغيير معدل التشغيل.
* `onRateChangeCapture`: نسخة من `onRateChange` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* `onResize`: دالة [معالج `Event`](#event-handler). تُطلق عند تغيير حجم الفيديو.
* `onResizeCapture`: نسخة من `onResize` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): دالة [معالج `Event`](#event-handler). تُطلق عند اكتمال عملية التقديم/الإرجاع.
* `onSeekedCapture`: نسخة من `onSeeked` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): دالة [معالج `Event`](#event-handler). تُطلق عند بدء عملية التقديم/الإرجاع.
* `onSeekingCapture`: نسخة من `onSeeking` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): دالة [معالج `Event`](#event-handler). تُطلق عند انتظار المتصفح بيانات دون أن تُحمَّل.
* `onStalledCapture`: نسخة من `onStalled` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): دالة [معالج `Event`](#event-handler). تُطلق عند تعليق تحميل المورد.
* `onSuspendCapture`: نسخة من `onSuspend` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): دالة [معالج `Event`](#event-handler). تُطلق عند تحديث وقت التشغيل الحالي.
* `onTimeUpdateCapture`: نسخة من `onTimeUpdate` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): دالة [معالج `Event`](#event-handler). تُطلق عند تغيير مستوى الصوت.
* `onVolumeChangeCapture`: نسخة من `onVolumeChange` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): دالة [معالج `Event`](#event-handler). تُطلق عند توقف التشغيل لنقص مؤقت في البيانات.
* `onWaitingCapture`: نسخة من `onWaiting` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)

#### تنبيهات {/*common-caveats*/}

- لا يمكنك تمرير `children` و `dangerouslySetInnerHTML` معًا.
- بعض الأحداث (مثل `onAbort` و `onLoad`) لا تنتشر في المتصفح، لكنها تنتشر في React.

---

### دالة استدعاء `ref` {/*ref-callback*/}

بدلًا من كائن ref (مثل المُعاد من [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref))، يمكنك تمرير دالة إلى سمة `ref`.

```js
<div ref={(node) => {
  console.log('Attached', node);

  return () => {
    console.log('Clean up', node)
  }
}}>
```

[اطّلع على مثال لاستخدام دالة `ref`.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

عند إضافة عقدة DOM `<div>` إلى الشاشة، يستدعي React دالة `ref` مع وسيط `node` من DOM. عند إزالة عقدة `<div>`، يستدعي React دالة التنظيف المُعادة من الاستدعاء.

يستدعي React أيضًا دالة `ref` كلما مررت دالة `ref` *مختلفة*. في المثال أعلاه، `(node) => { ... }` دالة مختلفة عند كل تصيير. عند إعادة تصيير المكوّن، تُستدعى الدالة *السابقة* بوسيط `null`، وتُستدعى الدالة *التالية* بعقدة DOM.

#### المعاملات {/*ref-callback-parameters*/}

* `node`: عقدة DOM. يمرّر React عقدة DOM عند ارتباط المرجع. ما لم تمرر نفس مرجع الدالة لاستدعاء `ref` عند كل تصيير، يُنظَّف الاستدعاء مؤقتًا ويُعاد إنشاؤه عند كل إعادة تصيير.

<Note>

#### أضاف React 19 دوال تنظيف لاستدعاءات `ref`. {/*react-19-added-cleanup-functions-for-ref-callbacks*/}

للتوافق مع الإصدارات السابقة، إذا لم تُعد دالة تنظيف من استدعاء `ref`، يُستدعى `node` بـ `null` عند فصل المرجع. سيُزال هذا السلوك في إصدار لاحق.

</Note>

#### القيم المُعادة {/*returns*/}

* **اختياري** `cleanup function`: عند فصل `ref`، يستدعي React دالة التنظيم. إذا لم تُعد دالة من استدعاء `ref`، يستدعي React الاستدعاء مجددًا بوسيط `null` عند فصل المرجع. سيُزال هذا السلوك في إصدار لاحق.

#### تنبيهات {/*caveats*/}

* عند تفعيل Strict Mode، يشغّل React **دورة إعداد+تنظيف إضافية في التطوير فقط** قبل أول إعداد حقيقي. هذا اختبار ضغط يضمن أن منطق التنظيم يعكس الإعداد وأنه يوقف أو يلغي ما يفعله الإعداد. إذا سبب ذلك مشكلة، نفّذ دالة التنظيم.
* عند تمرير استدعاء `ref` *مختلف*، يستدعي React دالة تنظيف الاستدعاء *السابق* إن وُجدت. إذا لم تُعرَّف دالة تنظيم، يُستدعى استدعاء `ref` بوسيط `null`. تُستدعى الدالة *التالية* بعقدة DOM.

---

### كائن حدث React {/*react-event-object*/}

تتلقى معالجات الأحداث *كائن حدث React.* ويُعرف أحيانًا بـ «حدث تركيبي».

```js
<button onClick={e => {
  console.log(e); // React event object
}} />
```

يتوافق مع نفس معيار أحداث DOM الأساسية، لكنه يصلح بعض تناقضات المتصفح.

بعض أحداث React لا تطابق مباشرة أحداث المتصفح الأصلية. مثلاً في `onMouseLeave`، يشير `e.nativeEvent` إلى حدث `mouseout`. التطابق التفصيلي ليس جزءًا من الواجهة العامة وقد يتغير. إذا احتجت الحدث الأصلي للمتصفح، اقرأه من `e.nativeEvent`.

#### الخصائص {/*react-event-object-properties*/}

تنفّذ كائنات أحداث React بعض خصائص [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) القياسية:

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): قيمة منطقية. تُعيد ما إذا كان الحدث ينتشر عبر DOM. 
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): قيمة منطقية. تُعيد ما إذا كان يمكن إلغاء الحدث.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): عقدة DOM. تُعيد العقدة التي يُرفق بها المعالج الحالي في شجرة React.
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): قيمة منطقية. تُعيد ما إذا وُجد استدعاء `preventDefault`.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): رقم. يُعيد طور الحدث الحالي.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): قيمة منطقية. تُعيد ما إذا كان الحدث منشأًا من المستخدم.
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): عقدة DOM. تُعيد العقدة التي وقع عليها الحدث (قد تكون فرعًا بعيدًا).
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): رقم. يُعيد وقت حدوث الحدث.

بالإضافة إلى ذلك، توفّر كائنات أحداث React هذه الخصائص:

* `nativeEvent`: [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) من DOM. كائن الحدث الأصلي في المتصفح.

#### الطرق {/*react-event-object-methods*/}

تنفّذ كائنات أحداث React بعض طرق [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) القياسية:

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): يمنع الإجراء الافتراضي للمتصفح للحدث.
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): يوقف انتشار الحدث في شجرة React.

بالإضافة إلى ذلك، توفّر كائنات أحداث React هذه الطرق:

* `isDefaultPrevented()`: تُعيد قيمة منطقية تدل على استدعاء `preventDefault`.
* `isPropagationStopped()`: تُعيد قيمة منطقية تدل على استدعاء `stopPropagation`.
* `persist()`: غير مستخدم مع React DOM. في React Native، استدعِها لقراءة خصائص الحدث بعده.
* `isPersistent()`: غير مستخدم مع React DOM. في React Native، تُعيد ما إذا وُجد استدعاء `persist`.

#### تنبيهات {/*react-event-object-caveats*/}

* قيم `currentTarget` و `eventPhase` و `target` و `type` تعكس ما يتوقعه كود React. داخليًا، يربط React المعالجات عند الجذر، لكن ذلك لا يظهر في كائنات الأحداث. مثلاً قد لا يطابق `e.currentTarget` قيمة `e.nativeEvent.currentTarget`. للأحداث المُحاكاة، قد يختلف `e.type` عن `e.nativeEvent.type`.

---

### `AnimationEvent` handler function {/*animationevent-handler*/}

نوع معالج أحداث [حركات CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### المعاملات {/*animationevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent):
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### `ClipboardEvent` handler function {/*clipboadevent-handler*/}

نوع معالج أحداث [واجهة الحافظة](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### المعاملات {/*clipboadevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent):

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### `CompositionEvent` handler function {/*compositionevent-handler*/}

نوع معالج أحداث [محرر طريقة الإدخال (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor).

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### المعاملات {/*compositionevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### `DragEvent` handler function {/*dragevent-handler*/}

نوع معالج أحداث [واجهة السحب والإفلات في HTML](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Drag source
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Drop target
  </div>
</>
```

#### المعاملات {/*dragevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent):
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  يتضمن أيضًا خصائص [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) الموروثة:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  يتضمن أيضًا خصائص [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) الموروثة:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `FocusEvent` handler function {/*focusevent-handler*/}

نوع معالج أحداث التركيز.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[اطّلع على مثال.](#handling-focus-events)

#### المعاملات {/*focusevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent):
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  يتضمن أيضًا خصائص [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) الموروثة:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `Event` handler function {/*event-handler*/}

نوع معالج أحداث عامة.

#### المعاملات {/*event-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) بلا خصائص إضافية.

---

### `InputEvent` handler function {/*inputevent-handler*/}

نوع معالج لحدث `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### المعاملات {/*inputevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent` handler function {/*keyboardevent-handler*/}

نوع معالج أحداث لوحة المفاتيح.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[اطّلع على مثال.](#handling-keyboard-events)

#### المعاملات {/*keyboardevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  يتضمن أيضًا خصائص [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) الموروثة:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `MouseEvent` handler function {/*mouseevent-handler*/}

نوع معالج أحداث الفأرة.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[اطّلع على مثال.](#handling-mouse-events)

#### المعاملات {/*mouseevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  يتضمن أيضًا خصائص [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) الموروثة:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `PointerEvent` handler function {/*pointerevent-handler*/}

نوع معالج [أحداث المؤشر.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[اطّلع على مثال.](#handling-pointer-events)

#### المعاملات {/*pointerevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent):
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  يتضمن أيضًا خصائص [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) الموروثة:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  يتضمن أيضًا خصائص [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) الموروثة:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TouchEvent` handler function {/*touchevent-handler*/}

نوع معالج [أحداث اللمس.](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### المعاملات {/*touchevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  يتضمن أيضًا خصائص [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) الموروثة:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TransitionEvent` handler function {/*transitionevent-handler*/}

نوع معالج أحداث انتقال CSS.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### المعاملات {/*transitionevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent):
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent` handler function {/*uievent-handler*/}

نوع معالج أحداث واجهة عامة.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### المعاملات {/*uievent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `WheelEvent` handler function {/*wheelevent-handler*/}

نوع معالج لحدث `onWheel`.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### المعاملات {/*wheelevent-handler-parameters*/}

* `e`: [كائن حدث React](#react-event-object) مع هذه الخصائص الإضافية من [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent):
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  يتضمن أيضًا خصائص [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) الموروثة:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  يتضمن أيضًا خصائص [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) الموروثة:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## الاستخدام {/*usage*/}

### تطبيق أنماط CSS {/*applying-css-styles*/}

في React، تحدد صنف CSS بـ [`className`.](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) يعمل مثل سمة `class` في HTML:

```js
<img className="avatar" />
```

ثم تكتب قواعد CSS في ملف CSS منفصل:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

لا يحدد React كيف تضيف ملفات CSS. في أبسط الحالات، تضيف وسم [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) إلى HTML. إذا استخدمت أداة بناء أو إطارًا، راجع وثائقه لمعرفة كيفية إضافة ملف CSS.

أحيانًا تعتمد قيم الأنماط على بيانات. استخدم سمة `style` لتمرير أنماط ديناميكيًا:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


في المثال أعلاه، `style={{}}` ليس بناءً خاصًا، بل كائن `{}` عادي داخل `style={ }` ضمن [أقواس JSX.](/learn/javascript-in-jsx-with-curly-braces) ننصح باستخدام `style` فقط عندما تعتمد الأنماط على متغيرات JavaScript.

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### كيف تطبّق عدة أصناف CSS شرطيًا؟ {/*how-to-apply-multiple-css-classes-conditionally*/}

لتطبيق أصناف CSS شرطيًا، أنشئ سلسلة `className` بنفسك باستخدام JavaScript.

مثلاً `className={'row ' + (isSelected ? 'selected': '')}` ينتج إما `className="row"` أو `className="row selected"` بحسب كون `isSelected` هو `true`.

لتحسين القراءة، يمكنك استخدام مكتبة مساعدة صغيرة مثل [`classnames`:](https://github.com/JedWatson/classnames)

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

ذلك مريح خصوصًا عند وجود عدة أصناف شرطية:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### التعامل مع عقدة DOM عبر مرجع {/*manipulating-a-dom-node-with-a-ref*/}

أحيانًا تحتاج للحصول على عقدة DOM المرتبطة بوسم في JSX. مثلاً لتركيز `<input>` عند النقر على زر، استدعِ [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) على عقدة `<input>` في المتصفح.

للحصول على عقدة DOM لوسم، [أعلن مرجعًا](/reference/react/useRef) ومرّره كسمة `ref` لذلك الوسم:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

يضع React عقدة DOM في `inputRef.current` بعد تصييرها على الشاشة.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

اقرأ المزيد عن [التعامل مع DOM عبر المراجع](/learn/manipulating-the-dom-with-refs) و [اطّلع على أمثلة إضافية.](/reference/react/useRef#usage)

لحالات متقدمة، تقبل سمة `ref` أيضًا [دالة استدعاء.](#ref-callback)

---

### تعيين HTML الداخلي بخطورة {/*dangerously-setting-the-inner-html*/}

يمكنك تمرير سلسلة HTML خام إلى عنصر هكذا:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**هذا خطير. مثل خاصية DOM [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)، يجب الحذر الشديد! ما لم يأتِ التعليم من مصدر موثوق تمامًا، يصبح إدخال ثغرة [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) سهلًا.**

مثلاً إذا استخدمت مكتبة Markdown تحول Markdown إلى HTML، وتثق أن المحلل بلا عيوب، والمستخدم يرى إدخاله فقط، يمكنك عرض HTML الناتج هكذا:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // This is ONLY safe because the output HTML
  // is shown to the same user, and because you
  // trust this Markdown parser to not have bugs.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

يُفضَّل إنشاء كائن `{__html}` قرب مكان توليد HTML، كما في `renderMarkdownToHTML` أعلاه. يضمن ذلك أن كل HTML الخام في شيفرتك مُعلَّم صراحة، وأن المتغيرات الممرَّرة إلى `dangerouslySetInnerHTML` هي التي تتوقع أن تحتوي HTML فقط. لا يُنصح بإنشاء الكائن مضمّنًا مثل `<div dangerouslySetInnerHTML={{__html: markup}} />`.

لمعرفة سبب خطورة تصيير HTML عشوائي، استبدل الشيفرة أعلاه بهذا:

```js {1-4,7,8}
const post = {
  // Imagine this content is stored in the database.
  content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
  // 🔴 SECURITY HOLE: passing untrusted input to dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

ستُنفَّذ الشيفرة المضمّنة في HTML. قد يستغل مهاجم الثغرة لسرقة بيانات المستخدم أو التصرف نيابة عنه. **استخدم `dangerouslySetInnerHTML` فقط مع بيانات موثوقة ومُنقّاة.**

---

### التعامل مع أحداث الفأرة {/*handling-mouse-events*/}

يعرض هذا المثال بعض [أحداث الفأرة](#mouseevent-handler) الشائعة ومتى تُطلق.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        First button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Second button
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### التعامل مع أحداث المؤشر {/*handling-pointer-events*/}

يعرض هذا المثال بعض [أحداث المؤشر](#pointerevent-handler) الشائعة ومتى تُطلق.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        First child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Second child
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### التعامل مع أحداث التركيز {/*handling-focus-events*/}

في React، [أحداث التركيز](#focusevent-handler) تنتشر. يمكنك استخدام `currentTarget` و `relatedTarget` لمعرفة ما إذا كان التركيز أو فقدان التركيز قد جاء من خارج العنصر الأب. يوضح المثال كيفية اكتشاف تركيز فرع، أو الأب، أو دخول/خروج التركيز من الشجرة الفرعية بأكملها.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left parent');
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### التعامل مع أحداث لوحة المفاتيح {/*handling-keyboard-events*/}

يعرض هذا المثال بعض [أحداث لوحة المفاتيح](#keyboardevent-handler) الشائعة ومتى تُطلق.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      First name:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
