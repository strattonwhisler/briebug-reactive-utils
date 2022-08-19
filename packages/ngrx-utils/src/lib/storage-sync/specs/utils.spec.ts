import { SyncKeyMap } from '../storage-sync.config';
import { buildRestoreableState, getStorableState } from '../utils';

describe('buildRestoreableState', () => {
  it('should build a state object matching the keymap', () => {
    const state = {
      prop: 'Some Property',
      children: {
        child: 'SomeChild',
        shouldBeIgnored: 'This prop should be ignored',
      },
      moreChildren: {
        nested: {
          child: 'SomeChild',
        },
      },
    };
    const keyMap: SyncKeyMap = {
      prop: true,
      children: {
        child: true,
      },
      moreChildren: {
        nested: {
          child: true,
        },
      },
    };
    const res = buildRestoreableState(state, keyMap);

    expect(res).toMatchObject({
      prop: 'Some Property',
      children: {
        child: 'SomeChild',
      },
      moreChildren: {
        nested: {
          child: 'SomeChild',
        },
      },
    });
  });
});

describe('getStorableState', () => {
  it('should build a storable state object matching the keymap', () => {
    const state = {
      prop: 'Some Property',
      children: {
        child: 'SomeChild',
        shouldBeIgnored: 'This prop should be ignored',
      },
      moreChildren: {
        nested: {
          child: 'SomeChild',
        },
      },
    };
    const keyMap: SyncKeyMap = {
      prop: true,
      children: {
        child: true,
      },
      moreChildren: {
        nested: {
          child: true,
        },
      },
    };
    const res = getStorableState(state, keyMap);

    expect(res).toMatchObject({
      prop: 'Some Property',
      children: {
        child: 'SomeChild',
      },
      moreChildren: {
        nested: {
          child: 'SomeChild',
        },
      },
    });
  });
});
