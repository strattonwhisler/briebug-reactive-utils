import { identity, ObjectUnsubscribedError, Subject, Subscriber, Subscription } from 'rxjs';
import { PersistenceAdapter } from "./persistence-adapter";

interface PersistentBehaviorSubjectOptions {
    /**
     * Behavior when nullish values are read from the persistence layer.
     *
     * - `initial` - Notify the initial value when read
     * - `error` - Notify an error when read
     * - `allow` - Notify the nullish value when read
     *
     * Defaults to `initial`.
     */
    nullish?: 'initial' | 'error' | 'allow';
}

export class PersistentBehaviorSubject<T> extends Subject<T> {
    constructor(
        private initialValue: T,
        private adapter: PersistenceAdapter<T>,
        private options?: PersistentBehaviorSubjectOptions
    ) {
        super();

        this.options = {
           nullish: 'initial',
            ...options
        };
    }

    get value(): Promise<T> {
        return this.getValue();
    }

    /** @deprecated This is an internal implementation details, do not use. */
    _subscribe(subscriber: Subscriber<T>): Subscription {
        const subscription = super._subscribe(subscriber);
        if (subscription && !subscription.closed) {
            this.adapter.read()
                .then(value => subscriber.next(value))
                .catch(error => subscriber.error(error));
        }
        return subscription;
    }

    getValue(): Promise<T> {
        if (this.hasError) {
            throw this.thrownError;
        } else if (this.closed) {
            throw new ObjectUnsubscribedError();
        } else {
            return this.adapter.read();
        }
    }

    next(value: T): void {
        this.adapter.write(value)
            .then(() => super.next(value))
            .catch(error => super.error(error))
    }

    clear(): void {
        this.adapter.clear()
            .then(
                this.options.nullish === 'initial' ? () => super.next(this.initialValue) :
                this.options.nullish === 'error' ? () => super.error(new Error('')) :
                this.options.nullish === 'allow' ? () => super.next(undefined) :
                identity
            )
            .catch(error => super.error(error))
    }
}
