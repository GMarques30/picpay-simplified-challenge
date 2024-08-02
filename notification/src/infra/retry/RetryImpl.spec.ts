import { RetryImpl } from "./RetryImpl";

let retryImpl: RetryImpl;

beforeEach(() => {
  retryImpl = new RetryImpl(3, 100);
});

it("should call the callback once if it succeeds on the first try", async () => {
  const callback = jest.fn().mockResolvedValueOnce(undefined);
  await retryImpl.retry(callback);
  expect(callback).toHaveBeenCalledTimes(1);
});

it("should retry the callback until it succeeds within the maxRetries limit", async () => {
  const callback = jest
    .fn()
    .mockRejectedValueOnce(new Error("Error 1"))
    .mockRejectedValueOnce(new Error("Error 2"))
    .mockResolvedValueOnce(undefined);
  await retryImpl.retry(callback);
  expect(callback).toHaveBeenCalledTimes(3);
});

it.only("should throw an error if the callback fails the maximum number of times", async () => {
  const callback = jest.fn().mockRejectedValue(new Error("Error"));
  await expect(retryImpl.retry(callback)).rejects.toThrow(
    new Error("Maximum number of attempts exceeded")
  );
  expect(callback).toHaveBeenCalledTimes(3);
});
