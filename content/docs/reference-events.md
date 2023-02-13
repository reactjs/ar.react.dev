---
id: events
title: الأحداث المصطنعة (Synthetic Events)
permalink: docs/events.html
layout: docs
category: Reference
---

<<<<<<< HEAD
يوثّق هذا الدليل مُغلِّف الأحداث المصطنعة `SyntheticEvent` والذي يُشكِّل جزءًا من نظام أحداث React. انظر توثيق [معالجة الأحداث](/docs/handling-events.html) لتعلّم المزيد.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Common components (e.g. `<div>`)](https://beta.reactjs.org/reference/react-dom/components/common)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

This reference guide documents the `SyntheticEvent` wrapper that forms part of React's Event System. See the [Handling Events](/docs/handling-events.html) guide to learn more.
>>>>>>> 47adefd30c46f486428d8231a68e639d62f02c9e

## لمحة عامة {#overview}

ستُمرِّر مُعالجات الأحداث لديك نُسخًا من `SyntheticEvent`, وهو عبارة عن تغليف للأحداث متوافق عبر المتصفحات لأجل نظام الأحداث الأصلي في المتصفّح، حيث يمتلك نفس الواجهة بما في ذلك `stopPropagation()` و `preventDefault()`, فيما عدا أنّ هذه الأحداث تعمل عبر جميع المتصفحات.

إن وجدت أنّك تحتاج حدث المتصفح الأصلي فاستخدم ببساطة الخاصيّة `nativeEvent` للحصول عليه. تختلف الأحداث التركيبية عن الأحداث الأصلية للمتصفح ولا ترتبط بها مباشرة. على سبيل المثال في `onMouseLeave` `event.nativeEvent` سيشير إلى حدث `mouseout`. التعيين المحدد ليس جزءًا من واجهة برمجة التطبيقات العامة وقد يتغير في أي وقت. يمتلك كل كائن `SyntheticEvent` الخاصيّات التالية:

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
void persist()
DOMEventTarget target
number timeStamp
string type
```

> ملاحظة:
>
> اعتبارًا من الإصدار 17, `e.persist()` لا تفعل أي شيء لأن `SyntheticEvent` لم تعد [مجمعة](/docs/legacy-event-pooling.html).

> ملاحظة:
>
> بدءًا من الإصدار v0.14 لن تؤدي إعادة `false` من مُعالِج الحدث إلى إيقاف انتشار الحدث، بل يجب إطلاق ذلك يدويًّا عن طريق التابع `e.stopPropagation()`‎ أو `e.preventDefault()`‎ بحسب ما هو ملائم.

## الأحداث المدعومة {#supported-events}

تُوحِّد React الأحداث بحيث تمتلك خاصيّات متوافقة عبر المتصفحات المختلفة.

تُطلَق معالجات الأحداث التالية عن طريق حدث في طور مضاعفة الأحداث. لتسجيل مُعالِج حدث لأجل طور الالتقاط أضف `Capture` إلى اسم الحدث. على سبيل المثال بدلًا من كتابة `onClick` تستخدم `onClickCapture` للتعامل مع حدث الضغط في طور الالتقاط.

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Generic Events](#generic-events)
- [Mouse Events](#mouse-events)
- [Pointer Events](#pointer-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)

* * *

## مرجع {#reference}

### أحداث الحافظة {#clipboard-events}

أسماء الحدث:

```
onCopy onCut onPaste
```

الخاصيّات:

```javascript
DOMDataTransfer clipboardData
```

* * *

### أحداث التركيب {#composition-events}

أسماء الحدث:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

الخاصيّات:

```javascript
string data

```

* * *

### أحداث لوحة المفاتيح {#keyboard-events}

أسماء الحدث:

```
onKeyDown onKeyPress onKeyUp
```

الخاصيّات:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

تستطيع الخاصيّة `key` أن تأخذ أي من القيم الموثقة في مواصفات أحداث DOM من المستوى الثالث.
* * *

### أحداث التركيز {#focus-events}

أسماء الحدث:

```
onFocus onBlur
```

تعمل أحداث التركيز هذه على جميع العناصر في React DOM، وليس فقط على عناصر حقول الإدخال. الخاصيّات:

الخاصيّات:

```js
DOMEventTarget relatedTarget
```

#### onFocus {#onfocus}

The `onFocus` event is called when the element (or some element inside of it) receives focus. For example, it's called when the user clicks on a text input.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur {#onblur}

The `onBlur` event handler is called when focus has left the element (or left some element inside of it). For example, it's called when the user clicks outside of a focused text input.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### Detecting Focus Entering and Leaving {#detecting-focus-entering-and-leaving}

You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from _outside_ of the parent element. Here is a demo you can copy and paste that shows how to detect focusing a child, focusing the element itself, and focus entering or leaving the whole subtree.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```

* * *

### أحداث حقول الإدخال {#form-events}

أسماء الحدث:

```
onChange onInput onInvalid onReset onSubmit 
```

للمزيد من المعلومات حول الحدث `onChange` انظر إلى توثيق[حقول الإدخال](/docs/forms.html).

* * *

### أحداث عامة {#generic-events}

أسماء الحدث:

```
onError onLoad
```

* * *

### أحداث الفأرة {#mouse-events}

أسماء الحدث:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

ينتشر الحدثان `onMouseEnter` و `onMouseLeave` من العنصر الذي نغادره إلى العنصر الذي ندخل إليه بدلًا من التضاعف الاعتيادي ولا يمتلكان طور التقاط. الخاصيّات:

الخاصيّات:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### أحداث المؤشر {#pointer-events}

أسماء الحدث:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

ينتشر الحدثان `onPointerEnter` و `onPointerLeave` من العنصر الذي نغادره إلى العنصر الذي ندخل إليه بدلًا من التضاعف الاعتيادي ولا يمتلكان طور التقاط.

الخاصيّات:

كما هو مُعرَّف في [W3 المعيار](https://www.w3.org/TR/pointerevents/), تُمد أحداث [Mouse Events](#mouse-events) بالخاصيّات التالية:

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

ملاحظة على دعم التوافقية بين المتصفحات:

إنّ أحداث المؤشر غير مدعومة حتى الآن في كل متصفّح (في وقت كتابة هذا المقال المتصفحات المدعومة هي: Chrome، و Firefox، و Edge، و Internet Explorer). لا تُضيف React بشكل افتراضي دعمًا للـ polyfills لمتصفحات أخرى لأنّها ستزيد بشكل ملحوظ من حجم الحزمة `react-dom`.

إن كان تطبيقك يتطلّب أحداث المؤشر، فنوصي بإضافة polyfill للأحداث مُقدَّمة من قبل طرف ثالث.

* * *

### أحداث الاختيار {#selection-events}

أسماء الحدث:

```
onSelect
```

* * *

### أحداث اللمس {#touch-events}

أسماء الحدث:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

الخاصيّات:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### أحداث واجهة المستخدم {#ui-events}

أسماء الحدث:

```
onScroll
```

>Note
>
> اعتبارًا من الإصدار 17, حدث `onScroll` **does not bubble** في React. حيث يطابق هذا سلوك المتصفح ويمنع الارتباك عند قيام عنصر متداخل قابل للتمرير بإطلاق أحداث على أحد العناصر الأخرى.


الخاصيّات:

```javascript
number detail
DOMAbstractView view
```

* * *

### أحداث دولاب الفأرة{#wheel-events}

أسماء الحدث:

```
onWheel
```

الخاصيّات:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### أحداث الوسائط {#media-events}

أسماء الحدث:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### أحداث الصور{#image-events}

أسماء الحدث:

```
onLoad onError
```

* * *

### أحداث التحريك {#animation-events}

أسماء الحدث:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

الخاصيّات:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### أحداث الانتقال {#transition-events}

أسماء الحدث:

```
onTransitionEnd
```

الخاصيّات:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### أحداث أخرى {#other-events}

أسماء الحدث:

```
onToggle
```
