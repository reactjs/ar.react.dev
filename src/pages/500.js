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
    <Page toc={[]} routeTree={sidebarLearn} meta={{title: 'حدث خطأ ما'}}>
      <MaxWidth>
        <Intro>
          <P> لقد حدث خطأ ما.</P>
          <P>نحن متؤسفون على ذلك.</P>
          <P>
            إذا كنت ترغب، من فضلك{' '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              ان تبلغ عن المشكل.
            </A>
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
