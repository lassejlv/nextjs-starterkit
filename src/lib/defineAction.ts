import { z } from "zod";

// Updated Action interface with generic return type
interface Action<T> {
  success: boolean;
  message: string;
  isZodError?: boolean;
  zodErrors?: z.ZodIssue[];
  data: T | null;
}

// Updated ActionProps to accept the return type of action
interface ActionProps<T extends z.ZodType<any, any>, R> {
  schema: T;
  action: (data: z.infer<T>) => Promise<R>;
}

// DefineAction now properly infers the action's return type
export const defineAction = <T extends z.ZodType<any, any>, R>(
  props: ActionProps<T, R>,
): ((data: z.infer<T>) => Promise<Action<R>>) => {
  const { schema, action } = props;

  return async (data) => {
    const result = schema.safeParse(data);

    if (!result.success)
      return {
        isZodError: true,
        success: false,
        message: "Invalid data",
        zodErrors: result.error.issues,
        data: null,
      };

    const actionResult = await action(data);

    return {
      success: true,
      message: "Action executed successfully",
      data: actionResult,
    };
  };
};
