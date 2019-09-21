/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import React from 'react';
import {urlRoot} from 'site-constants';
import {sharedStyles} from 'theme';

import names from '../../content/acknowledgements.yml';

const Acknowlegements = ({data, location}) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>شكر وتقدير</Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/acknowledgements.html`}
            title="React - شكر وتقدير"
          />

          <div css={sharedStyles.markdown}>
            <p>نود أن نشكر جميع المساهمين:</p>

            <ul
              css={{
                display: 'flex',
                flexWrap: 'wrap',
              }}>
              {names.map((name, index) => (
                <li
                  css={{
                    flex: '1 0 200px',
                  }}
                  key={index}>
                  {name}
                </li>
              ))}
            </ul>

            <p>بالإضافة إلى ذلك ، نحن ممتنون لـ</p>
            <ul>
              <li>
                <a href="https://github.com/jeffbski">Jeff Barczewski</a> : للسماح لنا باستخدام <a href="https://www.npmjs.com/package/react">react</a> كإسم حزمة في مدير الحزم npm.
              </li>
              <li>
                <a href="https://christopheraue.net/">Christopher Aue</a> : للسماح لنا باستخدام <a href="https://reactjs.com/">reactjs.com</a> كإسم مجال (domaine) و <a href="https://twitter.com/reactjs">@reactjs</a> كإسم مستخدم على منصة Twitter.
              </li>
              <li>
                <a href="https://github.com/ProjectMoon">ProjectMoon</a> : للسماح لنا باستخدام <a href="https://www.npmjs.com/package/flux">flux</a> كإسم حزمة على منصة npm.
              </li>
              <li>
                Shane Anderson : للسماح لنا باستخدام منظمة <a href="https://github.com/react">react</a> على منصة Github.
              </li>
              <li>
                <a href="https://github.com/voronianski">Dmitri Voronianski</a> : {' '}
                  للسماح لنا باستخدام نظام الألوان {' '}
                  <a href="https://labs.voronianski.com/oceanic-next-color-scheme/">
                    Oceanic Next
                  </a> {' '}
                  على هذا الموقع.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Acknowlegements;
