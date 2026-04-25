/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'الصفحة غير موجودة'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>هذه الصفحة غير موجودة.</P>
          <P>
            إذا كان ذلك خطأً، يُرجى{' '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              إبلاغنا
            </A>{' '}
            وسنحاول معالجته.
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
