import { TransformNumberPipe } from './transform-number.pipe';

describe('TransformNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new TransformNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
