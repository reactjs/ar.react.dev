---
title: مكوّنات الخادم
---

<RSC>

مكوّنات الخادم (Server Components) مخصّصة للاستخدام في [React Server Components](/learn/creating-a-react-app#full-stack-frameworks).

</RSC>

<Intro>

مكوّنات الخادم نوع جديد من المكوّنات تُصيَّر مسبقًا قبل التجميع، في بيئة منفصلة عن تطبيق العميل أو خادم SSR.

</Intro>

هذه البيئة المنفصلة هي «الخادم» في React Server Components. يمكن لمكوّنات الخادم أن تعمل مرة واحدة وقت البناء على خادم CI، أو أن تُنفَّذ لكل طلب باستخدام خادم ويب.

<InlineToc />

<Note>

#### كيف أبني دعمًا لمكوّنات الخادم؟ {/*how-do-i-build-support-for-server-components*/}

بينما React Server Components في React 19 مستقرة ولن تنكسر بين الإصدارات الفرعية، فإن واجهات البرمجة الأساسية المستخدمة لتنفيذ أداة تجميع أو إطار عمل لـ React Server Components لا تتبع semver وقد تنكسر بين الإصدارات الفرعية في React 19.x.

لدعم React Server Components كأداة تجميع أو إطار عمل، نوصي بتثبيت إصدار محدّد من React، أو استخدام إصدار Canary. سنستمر في العمل مع أدوات التجميع والأطر لتثبيت واجهات البرمجة المستخدمة لتنفيذ React Server Components مستقبلًا.

</Note>

### مكوّنات الخادم دون خادم {/*server-components-without-a-server*/}
يمكن لمكوّنات الخادم أن تعمل وقت البناء لقراءة نظام الملفات أو جلب محتوى ثابت، لذا لا يلزم خادم ويب. على سبيل المثال، قد ترغب في قراءة بيانات ثابتة من نظام إدارة محتوى.

بدون مكوّنات الخادم، يُشاع جلب البيانات الثابتة على العميل باستخدام Effect:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOTE: loads *after* first page render.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

هذا النمط يعني أن المستخدمين يحتاجون إلى تنزيل وتحليل نحو 75 كيلوبايت (مضغوطًا gzip) من المكتبات إضافيًا، والانتظار لطلب ثانٍ لجلب البيانات بعد تحميل الصفحة، فقط لعرض محتوى ثابت لن يتغيّر طوال عمر الصفحة.

باستخدام مكوّنات الخادم، يمكنك تصيير هذه المكوّنات مرة واحدة وقت البناء:

```js
import marked from 'marked'; // Not included in bundle
import sanitizeHtml from 'sanitize-html'; // Not included in bundle

async function Page({page}) {
  // NOTE: loads *during* render, when the app is built.
  const content = await file.readFile(`${page}.md`);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

يمكن بعد ذلك تصيير المخرجات إلى HTML عبر SSR ورفعها إلى CDN. عند تحميل التطبيق، لن يرى العميل مكوّن `Page` الأصلي، ولا المكتبات الثقيلة لعرض Markdown. سيرى العميل المخرجات المصيَّرة فقط:

```js
<div><!-- html for markdown --></div>
```

هذا يعني أن المحتوى يظهر عند أول تحميل للصفحة، وأن الحزمة لا تتضمّن المكتبات الثقيلة اللازمة لعرض المحتوى الثابت.

<Note>

قد تلاحظ أن مكوّن الخادم أعلاه دالة async:

```js
async function Page({page}) {
  //...
}
```

المكوّنات غير المتزامنة (async) ميزة جديدة في مكوّنات الخادم تسمح باستخدام `await` أثناء التصيير.

انظر [المكوّنات غير المتزامنة مع مكوّنات الخادم](#async-components-with-server-components) أدناه.

</Note>

### مكوّنات الخادم مع خادم {/*server-components-with-a-server*/}
يمكن لمكوّنات الخادم أيضًا أن تعمل على خادم ويب أثناء طلب صفحة، ما يتيح الوصول إلى طبقة البيانات دون بناء API. تُصيَّر قبل تجميع تطبيقك، ويمكنها تمرير البيانات وJSX كخصائص إلى مكوّنات العميل (Client Components).

بدون مكوّنات الخادم، يُشاع جلب البيانات الديناميكية على العميل في Effect:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOTE: loads *after* first render.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);

  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // NOTE: loads *after* Note renders.
  // Causing an expensive client-server waterfall.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

باستخدام مكوّنات الخادم، يمكنك قراءة البيانات وتصييرها داخل المكوّن:

```js
import db from './database';

async function Note({id}) {
  // NOTE: loads *during* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: loads *after* Note,
  // but is fast if data is co-located.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

ثم تجمع أداة التجميع البيانات ومكوّنات الخادم المصيَّرة ومكوّنات العميل الديناميكية في حزمة. يمكن بعد ذلك، اختياريًا، تطبيق SSR على تلك الحزمة لإنشاء HTML الأولي للصفحة. عند تحميل الصفحة، لا يرى المتصفح مكوّني `Note` و`Author` الأصليين؛ يُرسل إلى العميل المخرجات المصيَّرة فقط:

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

يمكن جعل مكوّنات الخادم ديناميكية بإعادة جلبها من خادم حيث يمكنها الوصول إلى البيانات والتصيير مجددًا. يجمع هذا النمط المعماري للتطبيق بين نموذج «طلب/استجابة» البسيط لتطبيقات متعددة الصفحات (MPA) المرتكزة على الخادم، والتفاعل السلس لتطبيقات الصفحة الواحدة (SPA) المرتكزة على العميل، ليمنحك أفضل ما في العالمين.

### إضافة تفاعلية إلى مكوّنات الخادم {/*adding-interactivity-to-server-components*/}

لا تُرسل مكوّنات الخادم إلى المتصفح، لذا لا يمكنها استخدام واجهات برمجة تفاعلية مثل `useState`. لإضافة تفاعلية إلى مكوّنات الخادم، يمكنك تجميعها مع مكوّن عميل باستخدام التوجيه `"use client"`.

<Note>

#### لا يوجد توجيه لمكوّنات الخادم. {/*there-is-no-directive-for-server-components*/}

سوء فهم شائع هو أن مكوّنات الخادم تُشار إليها بـ `"use server"`، لكن لا يوجد توجيه لمكوّنات الخادم. التوجيه `"use server"` يُستخدم لدوال الخادم (Server Functions).

لمزيد من المعلومات، راجع توثيق [التوجيهات](/reference/rsc/directives).

</Note>


في المثال التالي، مكوّن الخادم `Notes` يستورد مكوّن العميل `Expandable` الذي يستخدم state لتبديل حالة `expanded`:
```js
// Server Component
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Client Component
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

يعمل ذلك بتصيير `Notes` أولًا كمكوّن خادم، ثم إرشاد أداة التجميع لإنشاء حزمة لمكوّن العميل `Expandable`. في المتصفح، سترى مكوّنات العميل مخرجات مكوّنات الخادم الممرَّرة كخصائص:

```js
<head>
  <!-- the bundle for Client Components -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div>
</body>
```

### المكوّنات غير المتزامنة مع مكوّنات الخادم {/*async-components-with-server-components*/}

تقدّم مكوّنات الخادم طريقة جديدة لكتابة المكوّنات باستخدام async/await. عند استخدام `await` في مكوّن async، يعلّق React التصيير وينتظر حل الوعد قبل استئناف التصيير. يعمل ذلك عبر حدود الخادم/العميل مع دعم البث لـ Suspense.

يمكنك حتى إنشاء وعد على الخادم، وانتظاره على العميل:

```js
// Server Component
import db from './database';

async function Page({id}) {
  // Will suspend the Server Component.
  const note = await db.notes.get(id);

  // NOTE: not awaited, will start here and await on the client.
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(commentsPromise);
  return comments.map(comment => <p>{comment}</p>);
}
```

محتوى `note` بيانات مهمة لتصيير الصفحة، لذا نستخدم `await` له على الخادم. التعليقات أسفل الطي وأولوية أقل، لذا نبدأ الوعد على الخادم وننتظره على العميل بواجهة `use`. سيُعلّق ذلك على العميل دون حجب تصيير محتوى `note`.

بما أن المكوّنات غير المتزامنة غير مدعومة على العميل، ننتظر الوعد باستخدام `use`.
