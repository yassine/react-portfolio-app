import * as React          from 'react';
import { usePromiseState } from 'ui.hooks'
import { renderHook }      from "@testing-library/react-hooks/dom";

const SERVICE_DURATION = 100;
const RESULT_DURATION = 300;
const END_DURATION = 300;

describe("when i request the state of a promise", function () {

  it("in case of success state should transition accurately", async function () {

    let servicePromise = new Promise(resolve => {
      setTimeout(() => resolve(true), SERVICE_DURATION)
    })

    const { result, waitForNextUpdate } = renderHook(() => usePromiseState(servicePromise, {
      delaySuccess: RESULT_DURATION,
      delayEnd: END_DURATION
    }))
    let state = result.current

    expect(state.loading).toBe(true)
    expect(state.active).toBe(true)
    await waitForNextUpdate();

    state = result.current
    expect(state.active).toBe(true)
    expect(state.success).toBe(true)
    expect(state.loading).toBe(false)

    await waitForNextUpdate();
    state = result.current
    expect(state.active).toBe(false)
    expect(state.loading).toBe(false)
    expect(state.success).toBe(false)
    expect(state.error).toBe(false)

    return Promise.resolve(true);

  });

  it("in case of error state should transition accurately", async function () {

    let servicePromise = new Promise((resolve, nok) => {
      setTimeout(() => nok(true), SERVICE_DURATION)
    })

    servicePromise.catch(async e => {

      const { result, waitForNextUpdate } = renderHook(() => usePromiseState(servicePromise, {
        delayError: RESULT_DURATION,
        delayEnd: END_DURATION
      }))
      let state = result.current

      expect(state.loading).toBe(true)
      expect(state.active).toBe(true)
      await waitForNextUpdate();

      state = result.current
      let { active, error, loading } = state
      expect(active).toBe(true)
      expect(error).toBe(true)
      expect(loading).toBe(false)

      await waitForNextUpdate();
      expect(state.active).toBe(false)
      expect(state.loading).toBe(false)
      expect(state.success).toBe(false)
      expect(state.error).toBe(false)

    })

    return Promise.resolve(true);

  });

});

