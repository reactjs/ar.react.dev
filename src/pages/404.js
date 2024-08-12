/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'غير موجود'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>هذه الصفحة غير موجودة حالياً.</P>
          <P>
            إذا كان هناك خطب{', '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              اعلمنا بذلك
            </A>
            {', '}
            وسنحاول حله في أقرب وقت
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
