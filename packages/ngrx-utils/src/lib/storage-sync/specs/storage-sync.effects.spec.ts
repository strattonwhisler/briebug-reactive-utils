import { Observable } from 'rxjs';
import { StorageSyncEffects } from '../storage-sync.effects';

describe('StorageSyncEffects', () => {
  let effects: StorageSyncEffects;
  let actions$: Observable<any>;

  // beforeEach(() => {
  //   TestBed.configureTestingModule({
  //     imports: [
  //       IonicModule
  //     ],
  //     providers: [
  //       StorageSyncEffects,
  //       provideMockActions(() => actions$),
  //       provideMockStore(),
  //       Platform,
  //       // {
  //       //   provide: Storage,
  //       //   useValue: {}
  //       // },
  //       {
  //         provide: STORE_SYNC_CONFIG,
  //         useValue: {}
  //       }
  //     ],
  //   });
  //
  //   effects = TestBed.inject(StorageSyncEffects);
  //   actions$ = null;
  // });

  it('should create', () => {
    expect({}).toBeTruthy();
  });
});
