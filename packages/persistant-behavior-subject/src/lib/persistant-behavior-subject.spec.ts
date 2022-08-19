import { persistantBehaviorSubject } from './persistant-behavior-subject';

describe('persistantBehaviorSubject', () => {
  it('should work', () => {
    expect(persistantBehaviorSubject()).toEqual('persistant-behavior-subject');
  });
});
