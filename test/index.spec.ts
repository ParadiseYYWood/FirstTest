import { getName } from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('getName', () => {
  it('getName', () => {
      const test='test'
    const result = getName(test);
    expect(result).to.equal(test);
  });
});