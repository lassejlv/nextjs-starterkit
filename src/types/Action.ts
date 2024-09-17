export interface Action<T> {
  success: boolean;
  message: string;
  isZodError?: boolean;
  data: T | null;
}
