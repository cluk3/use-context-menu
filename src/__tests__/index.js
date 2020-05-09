import { renderHook, act } from "@testing-library/react-hooks";
import useContextMenu, { keyCodes } from "../useContextMenu";

const getMenuRefMock = () => ({
  getBoundingClientRect: jest.fn(() => ({ height: 100, width: 100 })),
  contains: jest.fn(() => false),
});

test("useContextMenu result is correct", () => {
  const { result } = renderHook(() => useContextMenu());

  expect(result.current.length).toBe(4);

  expect(result.current).toMatchSnapshot();
});

test("useContextMenu registers event listeners only when visible", () => {
  const addEventListener = jest.spyOn(document, "addEventListener");
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = getMenuRefMock();

  expect(addEventListener).not.toHaveBeenCalled();

  act(() => {
    result.current[3].setVisible(true);
    result.current[3].setCoords([100, 100]);
  });

  expect(addEventListener).toHaveBeenCalledTimes(3);
  expect(addEventListener.mock.calls.map((call) => call[0])).toEqual([
    "mousedown",
    "touchstart",
    "keydown",
  ]);
});

test("useContextMenu sets correctly the style when changing visibility", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = getMenuRefMock();

  expect(result.current[0].style).toMatchSnapshot();

  act(() => {
    result.current[3].setVisible(true);
    result.current[3].setCoords([100, 100]);
  });

  expect(result.current[0].style).toMatchSnapshot();

  act(() => {
    result.current[3].setVisible(false);
  });

  expect(result.current[0].style).toMatchSnapshot();
});

test("useContextMenu keeps the menu inside the viewport", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = getMenuRefMock();

  expect(result.current[0].style).toMatchSnapshot();

  act(() => {
    result.current[3].setVisible(true);
    result.current[3].setCoords([1000, 700]);
  });

  expect(result.current[0].style).toMatchSnapshot();
});

test("useContextMenu hides the menu when clicking outside", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = getMenuRefMock();

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new MouseEvent("mousedown");

    document.dispatchEvent(event);
  });

  expect(result.current[3].isVisible).toEqual(false);
});

test("useContextMenu hides the menu when touching outside", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = getMenuRefMock();

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new MouseEvent("touchstart");

    document.dispatchEvent(event);
  });

  expect(result.current[3].isVisible).toEqual(false);
});

test("useContextMenu hides the menu on scroll when specified", () => {
  const { result } = renderHook(() => useContextMenu({ hideOnScroll: true }));

  result.current[0].ref.current = getMenuRefMock();

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    document.dispatchEvent(new Event("scroll"));
  });

  expect(result.current[3].isVisible).toEqual(false);
});

test("useContextMenu hides the menu on ESCAPE key press", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = getMenuRefMock();

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new KeyboardEvent("keydown", { keyCode: keyCodes.ESCAPE });
    document.dispatchEvent(event);
  });

  expect(result.current[3].isVisible).toEqual(false);
});

test("useContextMenu hides the menu on ENTER key press", () => {
  const { result } = renderHook(() => useContextMenu());

  result.current[0].ref.current = getMenuRefMock();

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new KeyboardEvent("keydown", { keyCode: keyCodes.ENTER });
    document.dispatchEvent(event);
  });

  expect(result.current[3].isVisible).toEqual(false);
});

test("useContextMenu index of item selected by keyboard gets reset when closing the menu", () => {
  let selectedEl = 0;
  const { result } = renderHook(() =>
    useContextMenu({
      handleElementSelect: (_selectedEl) => (selectedEl = _selectedEl),
    })
  );

  result.current[0].ref.current = getMenuRefMock();

  result.current[1].ref(1);
  result.current[1].ref(2);
  result.current[1].ref(3);

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new KeyboardEvent("keydown", { keyCode: 40 });

    document.dispatchEvent(event);
  });

  act(() => {
    const event = new MouseEvent("touchstart");

    document.dispatchEvent(event);
  });

  act(() => {
    result.current[3].setVisible(true);
  });

  act(() => {
    const event = new KeyboardEvent("keydown", { keyCode: 40 });

    document.dispatchEvent(event);
  });

  expect(selectedEl).toEqual(1);
});

describe("useContextTrigger", () => {
  it("matches snapshot when giving no config", () => {
    const { result } = renderHook(() => useContextMenu());

    const [, , useContextTrigger] = result.current;

    const { result: contextTriggerResult } = renderHook(() =>
      useContextTrigger()
    );

    expect(contextTriggerResult.current).toMatchSnapshot();
  });
  it("matches snapshot when setting mouse holdToDisplay", () => {
    const { result } = renderHook(() => useContextMenu());

    const [, , useContextTrigger] = result.current;

    const { result: contextTriggerResult } = renderHook(() =>
      useContextTrigger({
        holdToDisplay: {
          mouse: 1000,
        },
      })
    );

    expect(contextTriggerResult.current).toMatchSnapshot();
  });
  it("matches snapshot when setting touch holdToDisplay", () => {
    const { result } = renderHook(() => useContextMenu());

    const [, , useContextTrigger] = result.current;

    const { result: contextTriggerResult } = renderHook(() =>
      useContextTrigger({
        holdToDisplay: {
          touch: 1000,
        },
      })
    );

    expect(contextTriggerResult.current).toMatchSnapshot();
  });
});
