---
title: تأجيل القيمة — useDeferredValue
---

<Intro>

`useDeferredValue` هو Hook في React يتيح لك تأجيل تحديث جزء من الواجهة.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

استدعِ `useDeferredValue` في أعلى مستوى مكوّنك للحصول على نسخة مؤجلة من تلك القيمة.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `value`: القيمة التي تريد تأجيلها. يمكن أن تكون من أي نوع.
* **اختياري** `initialValue`: قيمة تُستخدم أثناء الـ render الأول للمكوّن. إذا حذفت هذا الخيار، فلن يؤجّل `useDeferredValue` أثناء الـ render الأول، لأنه لا توجد نسخة سابقة من `value` يمكن عرضها بدلًا منها.


#### القيمة المعادة {/*returns*/}

- `currentValue`: أثناء الـ render الأول، تكون القيمة المؤجلة المعادة إما `initialValue` أو نفس القيمة التي قدمتها. أثناء التحديثات، يحاول React أولًا إعادة الرسم بالقيمة القديمة (فيُعاد القيمة القديمة)، ثم يحاول إعادة رسم أخرى في الخلفية بالقيمة الجديدة (فيُعاد القيمة المحدّثة).

#### ملاحظات مهمة {/*caveats*/}

- عندما يكون التحديث داخل Transition، يعيد `useDeferredValue` دائمًا `value` الجديدة ولا ينشئ renderًا مؤجلًا، لأن التحديث مؤجّل أصلًا.

- ينبغي أن تكون القيم التي تمرّرها إلى `useDeferredValue` إما قيمًا أولية (مثل السلاسل والأرقام) أو كائنات أُنشئت خارج الرسم. إذا أنشأت كائنًا جديدًا أثناء الرسم ومررته فورًا إلى `useDeferredValue`، فسيختلف في كل render، ما يسبب إعادات رسم خلفية غير ضرورية.

- عندما يتلقى `useDeferredValue` قيمة مختلفة (بالمقارنة مع [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is))، بالإضافة إلى الـ render الحالي (حيث ما زال يستخدم القيمة السابقة)، يجدول إعادة رسم في الخلفية بالقيمة الجديدة. إعادة الرسم الخلفية قابلة للمقاطعة: إذا حدث تحديث آخر لـ `value`، تعيد React إعادة الرسم الخلفي من الصفر. مثلًا، إذا كان المستخدم يكتب في حقل أسرع مما يستطيع مخطط يتلقى قيمته المؤجلة أن يعيد الرسم، فلن يعيد المخطط الرسم إلا بعد أن يتوقف المستخدم عن الكتابة.

- `useDeferredValue` متكامل مع [`<Suspense>`.](/reference/react/Suspense) إذا علّق التحديث الخلفي الناتج عن قيمة جديدة الواجهة، فلن يرى المستخدم الـ fallback. سيرى القيمة المؤجلة القديمة حتى تُحمَّل البيانات.

- `useDeferredValue` لا يمنع من تلقاء نفسه طلبات شبكة إضافية.

- لا يوجد تأخير ثابت يسببه `useDeferredValue` بحد ذاته. بمجرد أن تنتهي React من الـ render الأصلي، تبدأ فورًا العمل على إعادة الرسم الخلفية بالقيمة المؤجلة الجديدة. أي تحديثات ناتجة عن أحداث (مثل الكتابة) تقاطع إعادة الرسم الخلفية وتُعطى أولوية عليها.

- إعادة الرسم الخلفية الناتجة عن `useDeferredValue` لا تشغّل Effects حتى تُلتزم على الشاشة. إذا علّقت إعادة الرسم الخلفية، فتُشغَّل Effectsها بعد تحميل البيانات وتحديث الواجهة.

---

## الاستخدام {/*usage*/}

### عرض محتوى قديم أثناء تحميل المحتوى الجديد {/*showing-stale-content-while-fresh-content-is-loading*/}

استدعِ `useDeferredValue` في أعلى مستوى مكوّنك لتأجيل تحديث جزء من الواجهة.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

أثناء الـ render الأول، تكون <CodeStep step={2}>القيمة المؤجلة</CodeStep> نفس <CodeStep step={1}>القيمة</CodeStep> التي قدمتها.

أثناء التحديثات، تتأخر <CodeStep step={2}>القيمة المؤجلة</CodeStep> عن أحدث <CodeStep step={1}>قيمة</CodeStep>. على وجه الخصوص، تعيد React الرسم أولًا *دون* تحديث القيمة المؤجلة، ثم تحاول إعادة الرسم بالقيمة المستلمة حديثًا في الخلفية.

**لنمضِ في مثال لنرى متى يكون ذلك مفيدًا.**

<Note>

يفترض هذا المثال أنك تستخدم مصدر بيانات يدعم Suspense:

- جلب البيانات مع أطر تدعم Suspense مثل [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) و[Next.js](https://nextjs.org/docs/app/getting-started/fetching-data#with-suspense)
- تحميل كود المكوّن كسولًا بـ [`lazy`](/reference/react/lazy)
- قراءة قيمة Promise بـ [`use`](/reference/react/use)

[تعرّف أكثر على Suspense وقيوده.](/reference/react/Suspense)

</Note>


في هذا المثال، يعلّق مكوّن `SearchResults` أثناء جلب نتائج البحث. جرّب كتابة `"a"`، انتظر النتائح، ثم عدّلها إلى `"ab"`. تُستبدل نتائج `"a"` بـ fallback التحميل.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

نمط واجهة شائع بديل هو *تأجيل* تحديث قائمة النتائج والإبقاء على النتائج السابقة حتى تجهز الجديدة. استدعِ `useDeferredValue` لتمرير نسخة مؤجلة من الاستعلام:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

يتحدّث `query` فورًا، فيعرض الحقل القيمة الجديدة. أما `deferredQuery` فيحتفظ بقيمته السابقة حتى تُحمَّل البيانات، فيعرض `SearchResults` النتائج القديمة لبرهة.

أدخل `"a"` في المثال أدناه، انتظر تحميل النتائح، ثم عدّل الإدخال إلى `"ab"`. لاحظ أنك بدلًا من fallback الخاص بـ Suspense ترى قائمة النتائج القديمة حتى تُحمَّل النتائج الجديدة:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### كيف يعمل تأجيل القيمة داخليًا؟ {/*how-does-deferring-a-value-work-under-the-hood*/}

يمكنك تخيّله على خطوتين:

1. **أولًا، تعيد React الرسم بـ `query` الجديدة (`"ab"`) لكن بـ `deferredQuery` القديمة (ما زالت `"a"`).** قيمة `deferredQuery` التي تمررها لقائمة النتائج *مؤجلة:* تتأخر عن قيمة `query`.

2. **في الخلفية، تحاول React إعادة الرسم مع تحديث *كلٍ* من `query` و`deferredQuery` إلى `"ab"`.** إذا اكتملت إعادة الرسم هذه، تعرضها React على الشاشة. لكن إذا علّقت (لم تُحمَّل بعد نتائج `"ab"`)، تتخلى React عن محاولة الرسم هذه، وتعيد محاولة إعادة الرسم بعد تحميل البيانات. يظل المستخدم يرى القيمة المؤجلة القديمة حتى تجهز البيانات.

إعادة الرسم الخلفية المؤجلة قابلة للمقاطعة. مثلًا، إذا كتبت في الحقل مجددًا، تتخلى React عنها وتبدأ بالقيمة الجديدة. تستخدم React دائمًا أحدث قيمة مقدَّمة.

لاحظ أنه ما زال يوجد طلب شبكة لكل ضغطة مفتاح. ما يُؤجَّل هنا هو عرض النتائح (حتى تجهز)، لا طلبات الشبكة نفسها. حتى إذا واصل المستخدم الكتابة، تُخزَّن استجابات كل ضغطة، فيكون الرجوع بالمسافة فوريًا دون إعادة جلب.

</DeepDive>

---

### إظهار أن المحتوى قديم {/*indicating-that-the-content-is-stale*/}

في المثال أعلاه، لا يوجد ما يدل على أن قائمة النتائج لأحدث استعلام ما زالت تُحمَّل. قد يُربك المستخدم إذا طال انتظار النتائج الجديدة. لتوضيح أن قائمة النتائج لا تطابق أحدث استعلام، أضف مؤشرًا بصريًا عند عرض قائمة النتائج القديمة:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

مع هذا التغيير، بمجرد أن تبدأ الكتابة، تخفت قائمة النتائج القديمة قليلًا حتى تُحمَّل القائمة الجديدة. يمكنك أيضًا إضافة انتقال CSS لتأخير الخفوت فيبدو تدريجيًا، كفي المثال أدناه:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### تأجيل إعادة الرسم لجزء من الواجهة {/*deferring-re-rendering-for-a-part-of-the-ui*/}

يمكنك أيضًا استخدام `useDeferredValue` كتحسين للأداء. يفيد عندما يكون جزء من الواجهة بطيئًا في إعادة الرسم، ولا يوجد تحسين سهل، وتريد منعه من حجب بقية الواجهة.

تخيّل حقل نصًا ومكوّنًا (مثل مخطط أو قائمة طويلة) يعيد الرسم عند كل ضغطة مفتاح:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

أولًا، حسّن `SlowList` لتتخطى إعادة الرسم عندما تكون الخصائص نفسها. لفعل ذلك، [لفّه بـ `memo`:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

لكن هذا يساعد فقط إذا كانت خصائص `SlowList` *نفسها* كما في الـ render السابق. المشكلة الآن أنها بطيئة عندما تكون *مختلفة*، حين تحتاج فعلًا إلى مخرجات مرئية مختلفة.

عمليًا، المشكلة الأدائية الرئيسية أنه كلما كتبت في الحقل، يتلقى `SlowList` خصائص جديدة، وإعادة رسم الشجرة كاملة تجعل الكتابة تبدو متقطعة. هنا، يتيح لك `useDeferredValue` إعطاء أولوية لتحديث الحقل (الذي ينبغي أن يكون سريعًا) على تحديث قائمة النتائج (التي يُسمح أن تكون أبطأ):

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

هذا لا يسرّع إعادة رسم `SlowList` نفسها. لكنه يخبر React أن إعادة رسم القائمة يمكن خفض أولويتها حتى لا تحجب ضغطات المفاتيح. تتأخر القائمة عن الحقل ثم «تلحق». كسابقه، تحاول React تحديث القائمة بأسرع ما يمكن، دون أن تمنع المستخدم من الكتابة.

<Recipes titleText="الفرق بين useDeferredValue وإعادة رسم غير محسّنة" titleId="examples">

#### إعادة رسم مؤجلة للقائمة {/*deferred-re-rendering-of-the-list*/}

في هذا المثال، **يُبطّأ كل عنصر** في مكوّن `SlowList` اصطناعيًا حتى ترى كيف يحافظ `useDeferredValue` على استجابة الحقل. اكتب في الحقل ولاحظ أن الكتابة تبدو سلسة بينما القائمة «تتأخر» عنه.

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### إعادة رسم غير محسّنة للقائمة {/*unoptimized-re-rendering-of-the-list*/}

في هذا المثال، **يُبطّأ كل عنصر** في `SlowList` اصطناعيًا، لكن بلا `useDeferredValue`.

لاحظ أن الكتابة في الحقل تبدو متقطعة جدًا. ذلك لأنه بلا `useDeferredValue`، كل ضغطة تجبر القائمة كاملة على إعادة رسم فورية غير قابلة للمقاطعة.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

يتطلب هذا التحسين لف `SlowList` بـ [`memo`.](/reference/react/memo) لأنه كلما تغيّر `text`، ينبغي أن تعيد React رسم المكوّن الأب بسرعة. أثناء ذلك الـ render، ما زال `deferredText` يحمل قيمته السابقة، فيستطيع `SlowList` تخطي إعادة الرسم (خصائصه لم تتغيّر). بلا [`memo`,](/reference/react/memo) لاضطر لإعادة الرسم على أي حال، فيُبطل غرض التحسين.

</Pitfall>

<DeepDive>

#### كيف يختلف تأجيل القيمة عن debouncing وthrottling؟ {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

تقنيتان شائعتان للتحسين ربما استخدمتهما في هذا السيناريو:

- *Debouncing* تعني انتظار توقف المستخدم عن الكتابة (مثلًا ثانية) قبل تحديث القائمة.
- *Throttling* تعني تحديث القائمة بين حين وآخر (مثلًا مرة في الثانية على الأكثر).

رغم فائدتهما أحيانًا، فـ`useDeferredValue` أنسب لتحسين الرسم لأنه متكامل عميقًا مع React ويتكيّف مع جهاز المستخدم.

على عكس debouncing أو throttling، لا يتطلب اختيار تأخير ثابت. إذا كان الجهاز سريعًا (مثل حاسوب محمول قوي)، تحدث إعادة الرسم المؤجلة تقريبًا فورًا دون أن تُلاحظ. إذا كان الجهاز بطيئًا، تتأخر القائمة عن الحقل بما يتناسب مع البطء.

أيضًا، على عكس debouncing أو throttling، إعادات الرسم المؤجلة بـ`useDeferredValue` قابلة للمقاطعة افتراضيًا. أي إذا كانت React في منتصف إعادة رسم قائمة كبيرة والمستخدم ضغط مفتاحًا آخر، تتخلى React عن ذلك الـ render وتعالج الضغطة ثم تبدأ الرسم في الخلفية من جديد. بالمقابل، debouncing وthrottling ما زالا ينتجان تجربة متقطعة لأنهما *يحجبان*: يؤجلان فقط لحظة حجب الرسم لضغطات المفاتيح.

إذا كان العمل الذي تحسّنه لا يحدث أثناء الرسم، فلا يزال debouncing وthrottling مفيدين. مثلًا، يقللان طلبات الشبكة. يمكنك أيضًا الجمع بين هذه التقنيات.

</DeepDive>
