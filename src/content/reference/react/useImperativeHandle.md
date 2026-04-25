---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` هو Hook في React يتيح لك تخصيص المقبض (handle) المعرَّض كـ [ref.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

استدعِ `useImperativeHandle` في أعلى مكوّنك لتخصيص مقبض الـ ref الذي يعرضه:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### Parameters {/*parameters*/}

* `ref`: الـ `ref` الذي استلمته كـ prop لمكوّن `MyInput`.

* `createHandle`: دالة لا تأخذ معاملات وتُرجع مقبض الـ ref الذي تريد تعريضه. يمكن أن يكون لهذا المقبض أي نوع. عادةً ستُرجع كائنًا بالدوال التي تريد تعريضها.

* **اختياري** `dependencies`: قائمة بجميع القيم التفاعلية المُشار إليها داخل كود `createHandle`. تشمل القيم التفاعلية الـ props والحالة وجميع المتغيرات والدوال المعرّفة مباشرة في جسم المكوّن. إذا كان linter الخاص بك [مهيأ لـ React](/learn/editor-setup#linting)، فسيتحقق من أن كل قيمة تفاعلية مُحدَّدة كتبعية. يجب أن يكون عدد عناصر قائمة التبعيات ثابتًا وتُكتب مضمّنة مثل `[dep1, dep2, dep3]`. يقارن React كل تبعية بقيمتها السابقة باستخدام [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). إذا أدت إعادة الرسم إلى تغيّر بعض التبعيات، أو إذا حذفت هذا المعامل، ستُعاد تنفيذ دالة `createHandle` ويُعيَّن المقبض الجديد إلى الـ ref.

<Note>

بدءًا من React 19، [`ref` متاح كـ prop.](/blog/2024/12/05/react-19#ref-as-a-prop) في React 18 وأقدم، كان يجب الحصول على `ref` من [`forwardRef`.](/reference/react/forwardRef) 

</Note>

#### Returns {/*returns*/}

`useImperativeHandle` تُرجع `undefined`.

---

## Usage {/*usage*/}

### Exposing a custom ref handle to the parent component {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

لتعريض عقدة DOM للعنصر الأب، مرّر prop الـ `ref` إلى العقدة.

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

مع الكود أعلاه، [سيستلم ref إلى `MyInput` عقدة `<input>` في DOM.](/learn/manipulating-the-dom-with-refs) لكن يمكنك تعريض قيمة مخصصة بدلًا من ذلك. لتخصيص المقبض المعرَّض، استدعِ `useImperativeHandle` في أعلى مكوّنك:

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);

  return <input />;
};
```

لاحظ أنه في الكود أعلاه لم يعد يُمرَّر الـ `ref` إلى `<input>`.

على سبيل المثال، لنفترض أنك لا تريد تعريض عقدة `<input>` كاملة في DOM، بل تريد تعريض طريقتين منها: `focus` و`scrollIntoView`. للقيام بذلك، احتفظ بعقدة DOM الحقيقية في ref منفصل. ثم استخدم `useImperativeHandle` لتعريض مقبض يحتوي فقط على الدوال التي تريد أن يستدعيها المكوّن الأب:

```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input ref={inputRef} />;
};
```

الآن، إذا حصل المكوّن الأب على ref إلى `MyInput`، يمكنه استدعاء الدالتين `focus` و`scrollIntoView` عليه. لكنه لن يملك وصولًا كاملًا إلى عقدة `<input>` الأساسية في DOM.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
};

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Exposing your own imperative methods {/*exposing-your-own-imperative-methods*/}

الدوال التي تعرّضها عبر مقبض imperative لا يجب أن تطابق دوال DOM حرفيًا. على سبيل المثال، يعرّض مكوّن `Post` الدالة `scrollAndFocusAddComment` عبر مقبض imperative. هذا يتيح للمكوّن الأب `Page` تمرير قائمة التعليقات *والتركيز* على حقل الإدخال عند النقر على الزر:

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

function AddComment({ ref }) {
  return <input placeholder="Add comment..." ref={ref} />;
}

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**لا تفرط في استخدام refs.** استخدم refs فقط للسلوكيات *الإلزامية (imperative)* التي لا يمكن التعبير عنها بالـ props: مثل التمرير إلى عقدة، التركيز، تشغيل رسوم متحركة، تحديد نص، وهكذا.

**إذا أمكن التعبير عن شيء كـ prop، لا تستخدم ref.** على سبيل المثال، بدل تعريض مقبض imperative مثل `{ open, close }` من مكوّن `Modal`، من الأفضل أخذ `isOpen` كـ prop مثل `<Modal isOpen={isOpen} />`. يمكن [للتأثيرات](/learn/synchronizing-with-effects) المساعدة على تعريض السلوك الإلزامي عبر الـ props.

</Pitfall>
