/**
 * @license
 * Copyright 2022 Superflows.dev
 * SPDX-License-Identifier: MIT
 */

import {SfITicketing} from '../sf-i-ticketing.js';
// import { stub } from 'sinon';
// import {fixture, assert} from '@open-wc/testing';
import {assert} from '@open-wc/testing';
// import {html} from 'lit/static-html.js';

//const TIMEOUT = 2000;
suite('sf-i-ticketing > left menu', () => {

  test('is defined', () => {
    const el = document.createElement('sf-i-ticketing');
    assert.instanceOf(el, SfITicketing);
  });


});

