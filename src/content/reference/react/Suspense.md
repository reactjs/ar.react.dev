---
title: <Suspense>
---

<Intro>

`<Suspense>` يتيح لك عرض بديل (fallback) حتى تنتهي عناصره الفرعية من التحميل.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### الخصائص {/*props*/}
* `children`: الواجهة الفعلية التي تنوي عرضها. إذا علّق `children` أثناء الرسم، ستنتقل حدود Suspense إلى عرض `fallback`.
* `fallback`: واجهة بديلة تُعرض مكان الواجهة الفعلية إذا لم يكتمل تحميلها. يُقبل أي عقدة React صالحة، وغالبًا ما يكون البديل عرضًا خفيفًا مثل مؤشر تحميل أو هيكل (skeleton). يُبدّل Suspense تلقائيًا إلى `fallback` عندما يعلّق `children`، ويعود إلى `children` عندما تصبح البيانات جاهزة. إذا علّق `fallback` أثناء الرسم، يُفعّل أقرب حد Suspense في المكوّن الأب.

#### ملاحظات مهمة {/*caveats*/}

- لا يحتفظ React بأي حالة للرُسومات التي علّقت قبل أن تتمكن من التركيب لأول مرة. عندما يكتمل تحميل المكوّن، يعيد React محاولة رسم الشجرة المعلّقة من الصفر.
- إذا كان Suspense يعرض محتوى الشجرة ثم علّق مجددًا، يُعرض `fallback` مرة أخرى ما لم يكن التحديث المسبب ناتجًا عن [`startTransition`](/reference/react/startTransition) أو [`useDeferredValue`](/reference/react/useDeferredValue).
- إذا احتاج React إلى إخفاء المحتوى الظاهر بالفعل لأنه علّق مجددًا، يُنظّف [تأثيرات التخطيط (layout Effects)](/reference/react/useLayoutEffect) في شجرة المحتوى. عندما يصبح المحتوى جاهزًا للعرض مرة أخرى، يُطلق React تأثيرات التخطيط من جديد. يضمن ذلك ألا تحاول التأثيرات التي تقيس تخطيط DOM القيام بذلك بينما المحتوى مخفي.
- يتضمّن React تحسينات داخلية مثل *تدفق الرسم من الخادم (Streaming Server Rendering)* و*الترطيب الانتقائي (Selective Hydration)* المتكاملة مع Suspense. اقرأ [نظرة معمارية](https://github.com/reactwg/react-18/discussions/37) وشاهد [حديثًا تقنيًا](https://www.youtube.com/watch?v=pj5N-Khihgc) لتعرف المزيد.

---

## الاستخدام {/*usage*/}

### عرض بديل أثناء تحميل المحتوى {/*displaying-a-fallback-while-content-is-loading*/}

يمكنك لف أي جزء من تطبيقك داخل حد Suspense:

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

يعرض React <CodeStep step={1}>بديل التحميل</CodeStep> حتى يُحمَّل كل الكود والبيانات التي يحتاجها <CodeStep step={2}>العناصر الفرعية</CodeStep>.

في المثال أدناه، يعلّق مكوّن `Albums` أثناء جلب قائمة الألبومات. حتى يصبح جاهزًا للرسم، يُبدّل React أقرب حد Suspense فوقه لعرض البديل — مكوّن `Loading` الخاص بك. ثم عندما تُحمَّل البيانات، يخفي React بديل `Loading` ويرسم مكوّن `Albums` مع البيانات.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

</Sandpack>

<Note>

**فقط مصادر البيانات المفعّلة لـ Suspense ستُفعّل مكوّن Suspense.** وتشمل:

- جلب البيانات مع أُطر تدعم Suspense مثل [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) و[Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
- تحميل كود المكوّن كسولًا (lazy) باستخدام [`lazy`](/reference/react/lazy)
- قراءة قيمة وعد (Promise) مخزّن مؤقتًا باستخدام [`use`](/reference/react/use)

Suspense **لا** يكتشف جلب البيانات داخل Effect أو معالج أحداث.

الطريقة الدقيقة لتحميل البيانات في مكوّن `Albums` أعلاه تعتمد على إطارك. إذا استخدمت إطارًا يدعم Suspense، ستجد التفاصيل في وثائق جلب البيانات لديه.

جلب البيانات المفعّل لـ Suspense دون إطار رأيي (opinionated) غير مدعوم بعد. متطلبات تنفيذ مصدر بيانات يدعم Suspense غير مستقرة وغير موثّقة. سيُصدَر واجهة رسمية لدمج مصادر البيانات مع Suspense في إصدار مستقبل من React.

</Note>

---

### كشف المحتوى دفعة واحدة {/*revealing-content-together-at-once*/}

افتراضيًا، تُعامل الشجرة بأكملها داخل Suspense كوحدة واحدة. على سبيل المثال، حتى لو علّق *مكوّن واحد فقط* منها بانتظار بعض البيانات، ستُستبدل *كلها معًا* بمؤشر التحميل:

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

ثم بعد أن تصبح كلها جاهزة للعرض، تظهر كلها معًا دفعة واحدة.

في المثال أدناه، يجلب كل من `Biography` و`Albums` بعض البيانات. لكن لأنهما مجمّعان تحت حد Suspense واحد، تظهر هذه المكوّنات دائمًا «دفعة واحدة» في نفس الوقت.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

لا يلزم أن تكون المكوّنات التي تحمّل البيانات أبناء مباشرين لحد Suspense. على سبيل المثال، يمكنك نقل `Biography` و`Albums` إلى مكوّن `Details` جديد. هذا لا يغيّر السلوك. كلاهما داخل نفس أقرب حد Suspense، لذا يُنسَّق ظهورهما معًا.

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---

### كشف المحتوى المتداخل مع تحميله {/*revealing-nested-content-as-it-loads*/}

عندما يعلّق مكوّن، يتولّى أقرب مكوّن Suspense أب عرض البديل. يتيح لك ذلك تداخل عدة مكوّنات Suspense لإنشاء تسلسل تحميل. يُملأ بديل كل حد Suspense عندما يصبح المستوى التالي من المحتوى متاحًا. على سبيل المثال، يمكنك إعطاء قائمة الألبومات بديلًا خاصًا بها:

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

مع هذا التغيير، لا يحتاج عرض `Biography` إلى «الانتظار» حتى يُحمَّل `Albums`.

سيكون التسلسل كالتالي:

1. إذا لم يُحمَّل `Biography` بعد، يُعرض `BigSpinner` مكان منطقة المحتوى بأكملها.
2. عندما يكتمل تحميل `Biography`، يُستبدل `BigSpinner` بالمحتوى.
3. إذا لم يُحمَّل `Albums` بعد، يُعرض `AlbumsGlimmer` مكان `Albums` و`Panel` الأب.
4. أخيرًا، عندما يكتمل تحميل `Albums`، يحل محل `AlbumsGlimmer`.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

تتيح لك حدود Suspense تنسيق أي أجزاء من الواجهة يجب أن تظهر دائمًا «دفعة واحدة» في آن واحد، وأي أجزاء يجب أن تكشف تدريجيًا عن المزيد من المحتوى في تسلسل حالات التحميل. يمكنك إضافة حدود Suspense أو نقلها أو حذفها في أي مكان في الشجرة دون التأثير على سلوك بقية التطبيق.

لا تضع حد Suspense حول كل مكوّن. لا ينبغي أن تكون حدود Suspense أدق من تسلسل التحميل الذي تريد للمستخدم تجربته. إذا عملت مع مصمّم، اسأله أين يجب وضع حالات التحميل — من المرجح أنها مضمّنة بالفعل في مخططات التصميم.

---

### إظهار محتوى قديم أثناء تحميل محتوى جديد {/*showing-stale-content-while-fresh-content-is-loading*/}

في هذا المثال، يعلّق مكوّن `SearchResults` أثناء جلب نتائج البحث. اكتب `"a"`، انتظر النتائج، ثم عدّلها إلى `"ab"`. ستُستبدل نتائج `"a"` ببديل التحميل.

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
    setTimeout(resolve, 500);
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

نمط واجهة شائع بديل هو *تأجيل* تحديث القائمة والإبقاء على عرض النتائج السابقة حتى تصبح النتائج الجديدة جاهزة. يتيح لك Hook [`useDeferredValue`](/reference/react/useDeferredValue) تمرير نسخة مؤجلة من الاستعلام إلى الأسفل: 

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

سيُحدَّث `query` فورًا، لذا سيُظهر الحقل القيمة الجديدة. لكن `deferredQuery` يحتفظ بقيمته السابقة حتى تُحمَّل البيانات، لذا يعرض `SearchResults` النتائج القديمة لبعض الوقت.

لجعل ذلك أوضح للمستخدم، يمكنك إضافة مؤشر بصري عند عرض قائمة النتائج القديمة:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1 
}}>
  <SearchResults query={deferredQuery} />
</div>
```

أدخل `"a"` في المثال أدناه، انتظر تحميل النتائج، ثم عدّل المدخل إلى `"ab"`. لاحظ أنه بدلًا من بديل Suspense، ترى الآن قائمة النتائج القديمة باهتة حتى تُحمَّل النتائج الجديدة:


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
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
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
    setTimeout(resolve, 500);
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

<Note>

كل من القيم المؤجلة و[الانتقالات (Transitions)](#preventing-already-revealed-content-from-hiding) تتيحان تجنّب عرض بديل Suspense لصالح مؤشرات مضمّنة. توسم الانتقالات التحديث بأكمله كغير عاجل، لذا تستخدمها عادة الأُطر ومكتبات التوجيه للتنقّل. أما القيم المؤجلة فمفيدة غالبًا في كود التطبيق عندما تريد توسيم جزء من الواجهة كغير عاجل وتركه «يتأخر» عن بقية الواجهة.

</Note>

---

### منع إخفاء المحتوى الظاهر بالفعل {/*preventing-already-revealed-content-from-hiding*/}

عندما يعلّق مكوّن، يُبدّل أقرب حد Suspense في المكوّن الأب إلى عرض البديل. قد يؤدي ذلك إلى تجربة مزعجة إذا كان يعرض بالفعل بعض المحتوى. جرّب الضغط على هذا الزر:

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

عند الضغط على الزر، رسم مكوّن `Router` صفحة `ArtistPage` بدلًا من `IndexPage`. علّق مكوّن داخل `ArtistPage`، فبدأ أقرب حد Suspense بعرض البديل. كان أقرب حد Suspense قريبًا من الجذر، لذا استُبدل تخطيط الموقع بأكمله بـ `BigSpinner`.

لمنع ذلك، يمكنك توسيم تحديث حالة التنقّل كـ *Transition* باستخدام [`startTransition`:](/reference/react/startTransition)

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);      
    });
  }
  // ...
```

يخبر هذا React أن انتقال الحالة ليس عاجلاً، وأنه من الأفضل الإبقاء على الصفحة السابقة بدلًا من إخفاء أي محتوى ظهر بالفعل. الآن ينتظر الضغط على الزر حتى يُحمَّل `Biography`:

<Sandpack>

```js src/App.js
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

لا تنتظر الانتقالة (Transition) حتى يُحمَّل *كل* المحتوى. إنما تنتظر فقط ما يكفي لتجنّب إخفاء المحتوى الظاهر بالفعل. على سبيل المثال، كان `Layout` الموقع قد ظهر بالفعل، لذا كان سيئًا إخفاؤه خلف مؤشر تحميل. أما حد `Suspense` المتداخل حول `Albums` فجديد، لذا لا تنتظره الانتقالة.

<Note>

يُتوقَّع من أجهزة التوجيه المفعّلة لـ Suspense أن تلف تحديثات التنقّل في انتقالات (Transitions) افتراضيًا.

</Note>

---

### دلالة على جريان انتقالة (Transition) {/*indicating-that-a-transition-is-happening*/}

في المثال أعلاه، بعد الضغط على الزر لا يوجد مؤشر بصري على أن التنقّل قيد التنفيذ. لإضافة مؤشر، يمكنك استبدال [`startTransition`](/reference/react/startTransition) بـ [`useTransition`](/reference/react/useTransition) الذي يمنحك قيمة منطقية `isPending`. في المثال أدناه، تُستخدم لتغيير تنسيق رأس الموقع أثناء حدوث انتقالة:

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### إعادة ضبط حدود Suspense عند التنقّل {/*resetting-suspense-boundaries-on-navigation*/}

أثناء انتقالة (Transition)، يتجنّب React إخفاء المحتوى الظاهر بالفعل. لكن إذا انتقلت إلى مسار بمعاملات مختلفة، قد ترغب في إخبار React أنه محتوى *مختلف*. يمكنك التعبير عن ذلك بـ `key`:

```js
<ProfilePage key={queryParams.id} />
```

تخيّل أنك تتنقّل داخل صفحة ملف مستخدم وشيء ما يعلّق. إذا كان ذلك التحديث ملفوفًا في انتقالة، فلن يُفعّل البديل للمحتوى الظاهر بالفعل. هذا السلوك متوقع.

لكن تخيّل الآن الانتقال بين ملفي مستخدمين مختلفين. هنا يكون من المنطقي عرض البديل. على سبيل المثال، خط زمني لمستخدم *محتوى مختلف* عن خط زمني لمستخدم آخر. بتحديد `key`، تضمن أن React تعامل ملفات المستخدمين المختلفة كمكوّنات مختلفة، وتُصفّر حدود Suspense أثناء التنقّل. يجب أن تفعل أجهزة التوجيه المتكاملة مع Suspense ذلك تلقائيًا.

---

### توفير بديل لأخطاء الخادم ومحتوى للعميل فقط {/*providing-a-fallback-for-server-errors-and-client-only-content*/}

إذا استخدمت إحدى [واجهات رسم الخادم بالتدفق](/reference/react-dom/server) (أو إطارًا يعتمد عليها)، سيستخدم React أيضًا حدود `<Suspense>` لديك للتعامل مع الأخطاء على الخادم. إذا رمى مكوّن خطأ على الخادم، لن يُلغِ React رسم الخادم. بدلًا من ذلك، يجد أقرب `<Suspense>` فوقه ويُضمّن بديله (مثل مؤشر دوار) في HTML المُنشَأ على الخادم. سيرى المستخدم مؤشرًا أولًا.

على العميل، يحاول React رسم نفس المكوّن مرة أخرى. إذا رمى خطأ على العميل أيضًا، يرمي React الخطأ ويعرض أقرب [حد خطأ (Error Boundary).](/reference/react/Component#static-getderivedstatefromerror) أما إذا لم يحدث خطأ على العميل، فلن يعرض React الخطأ للمستخدم لأن المحتوى ظهر في النهاية بنجاح.

يمكنك استخدام ذلك لاستبعاد بعض المكوّنات من الرسم على الخادم. لفعل ذلك، ارمِ خطأ في بيئة الخادم ثم لفّ المكوّنات في `<Suspense>` ليُستبدل HTML الخاص بها ببدائل:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```

سيضمّن HTML الخادم مؤشر التحميل. يُستبدل بمكوّن `Chat` على العميل.

---

## استكشاف الأخطاء {/*troubleshooting*/}

### كيف أمنع استبدال الواجهة ببديل أثناء تحديث؟ {/*preventing-unwanted-fallbacks*/}

استبدال واجهة ظاهرة ببديل يخلق تجربة مزعجة. قد يحدث ذلك عندما يسبب تحديث تعليق مكوّن، وحد Suspense الأقرب يعرض بالفعل محتوى للمستخدم.

لمنع ذلك، [وسم التحديث كغير عاجل باستخدام `startTransition`](#preventing-already-revealed-content-from-hiding). أثناء انتقالة (Transition)، ينتظر React حتى يُحمَّل ما يكفي من البيانات لتجنّب ظهور بديل غير مرغوب:

```js {2-3,5}
function handleNextPageClick() {
  // If this update suspends, don't hide the already displayed content
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

سيُجنّب ذلك إخفاء المحتوى الموجود. لكن أي حدود `Suspense` تُرسم حديثًا ستعرض بدائلها فورًا لتجنّب حظر الواجهة وليُرى المستخدم المحتوى كلما أصبح متاحًا.

**React يمنع البدائل غير المرغوبة فقط أثناء التحديثات غير العاجلة**. لن يؤخر الرسم إذا كان ناتجًا عن تحديث عاجل. يجب الاشتراك صراحةً بواجهة مثل [`startTransition`](/reference/react/startTransition) أو [`useDeferredValue`](/reference/react/useDeferredValue).

إذا كان جهاز التوجيه متكاملًا مع Suspense، فينبغي أن يلف تحديثاته في [`startTransition`](/reference/react/startTransition) تلقائيًا.
