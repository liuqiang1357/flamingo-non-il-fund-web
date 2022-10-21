import { StringLocale } from 'utils/validators';

declare module 'yup' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType,
  > extends BaseSchema<TType, TContext, TOut> {
    isN3Address(message?: StringLocale['isN3Address']): this;
  }
}
